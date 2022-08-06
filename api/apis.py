from django.http import Http404
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import logout, authenticate, login
from .constants import *
from .serializers import *
from core.models import *
from django.db.models import Q
import googlemaps


class AuthUser(APIView):
    '''Return current logged in user. return None if not authenticated'''

    def get(self, request):
        payload = {}
        payload['user'] = None

        if request.user.is_authenticated:
            serializer = UserSerializer(instance=request.user)
            payload['user'] = serializer.data

        return Response(payload, status=status.HTTP_200_OK)


class Logout(APIView):
    '''Log the current logged in user out of the session'''

    def get(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class Register(APIView):
    '''Register user with username, password and password2'''

    def post(self, request):
        # reject user from registering if already authenticated
        if request.user.is_authenticated:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            # authenticate and log the new user in
            user = authenticate(
                username=serializer.validated_data['username'], password=serializer.validated_data['password'])
            login(request, user)

            # return the data of the user to be stored in the frontend
            userSerializer = UserSerializer(instance=user)

            return Response({'user': userSerializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserApi(generics.RetrieveAPIView):
    '''Retrieve data about a specific user'''

    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"


class ProfileUpdate(APIView):
    '''Update profile of the logged in user'''

    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        serializer = UserSerializer(
            instance=request.user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'details': 'success'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ItemPostList(APIView):
    '''
    Get - Retrieve item post list
    Post - Create an item post
    '''

    def get(self, request):
        q_objects_for_filter = Q()
        q_objects_for_exclude = Q()

        if not request.query_params:
            # if no query param given, that means show only active posts and exclude posts posted
            # by the logged in user
            # item_posts_queryset = ItemPost.objects.exclude(
            #     created_by=request.user.id).filter(is_active=True).order_by('-date_created')
            q_objects_for_exclude.add(Q(created_by=request.user.id), Q.AND)
            q_objects_for_filter.add(Q(is_active=True), Q.AND)
        else:
            # retrieve filters
            user_filter = request.query_params.get('username')

            # include optional filters
            if user_filter:
                # this filter is used in profile page
                try:
                    user = User.objects.get(username=user_filter)
                    q_objects_for_filter.add(Q(created_by=user), Q.AND)
                except User.DoesNotExist:
                    return Response({'detail': 'Queried user not found'}, status=status.HTTP_404_NOT_FOUND)

        # retrieve item posts with applied filters
        item_posts = ItemPost.objects.exclude(q_objects_for_exclude).filter(
            q_objects_for_filter).order_by('-date_created')

        serializer = ItemPostListSerializer(instance=item_posts, many=True)

        if not request.user.is_authenticated or not request.user.address or not item_posts:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # insert distances calculation if the user is authenticated and has location
            payload = serializer.data.copy()

            # get the list of posts addresses
            item_posts_pick_up_location = [
                item_post.get('location') for item_post in payload]

            gmaps = googlemaps.Client(key=GOOGLE_API_KEY)

            # calculate distances
            result = gmaps.distance_matrix(
                origins=request.user.address, destinations=item_posts_pick_up_location, units="metric")

            distances = [ele['distance']['text']
                         for ele in result['rows'][0]['elements']]

            # add the distances into the item posts
            for i in range(0, len(distances)):
                payload[i]['distance'] = distances[i]

            # sort the list based on distance (ascending)
            def sort_by_distance_callback(item_post):
                distance = item_post.get('distance')

                # convert distance to meter
                # Example:
                #   '2.2 km' --> 2200
                #   '2.2 m' --> 2.2
                if 'km' in distance:
                    distance = float(distance[:-3]) * 1000
                else:
                    distance = float(distance[:-2])

                return distance

            payload = sorted(payload, key=sort_by_distance_callback)

            return Response(payload, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CreateItemPostSerializer(
            data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(data={'status': 'success'}, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ItemPostDetail(generics.RetrieveUpdateAPIView):
    serializer_class = ItemPostSerializer
    queryset = ItemPost.objects.all()
