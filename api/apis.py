from django.http import Http404
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import logout, authenticate, login
from .constants import *
from .serializers import *
from core.models import *
import googlemaps


class AuthUser(APIView):
    def get(self, request):
        payload = {}
        payload['user'] = None

        if request.user.is_authenticated:
            serializer = UserSerializer(instance=request.user)
            payload['user'] = serializer.data

        return Response(payload, status=status.HTTP_200_OK)


class Logout(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class Register(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # authenticate and log the user in
            user = authenticate(
                username=serializer.validated_data['username'], password=serializer.validated_data['password'])
            login(request, user)

            userSerializer = UserSerializer(instance=user)

            return Response({'user': userSerializer.data}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ItemPostList(APIView):
    def get(self, request):
        # query for item posts which exclude those that are posted by the logged in user
        item_posts = ItemPost.objects.exclude(
            created_by=request.user.id).filter(is_active=True).order_by('-date_created')
        serializer = ItemPostListSerializer(instance=item_posts, many=True)

        if not request.user.is_authenticated or not request.user.location or not item_posts:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # insert distances calculation if the user is authenticated and has location
            payload = serializer.data.copy()

            # get the list of posts addresses
            item_posts_pick_up_location = [
                item_post.get('location') for item_post in payload]

            print('user location', request.user.location)
            print('item post locations', item_posts_pick_up_location)

            gmaps = googlemaps.Client(key=GOOGLE_API_KEY)
            # calculate distances
            result = gmaps.distance_matrix(
                origins=request.user.location, destinations=item_posts_pick_up_location, units="metric")
            print(result)

            # result_elements = result['rows'][0]['elements']
            # iter_result_elements = iter(result_elements)
            # # extract the distances from the result
            # distances = []
            # for i in range(0, len(item_posts_pick_up_location)):
            #     if item_posts_pick_up_location[i] == '':
            #         distances.append('')
            #         continue

            #     distance_element = next(iter_result_elements)
            #     distances.append(distance_element.get(
            #         'distance').get('text') if distance_element.get('distance') else '')

            distances = [ele['distance']['text']
                         for ele in result['rows'][0]['elements']]

            # add the distances into the item posts
            for i in range(0, len(distances)):
                payload[i]['distance'] = distances[i]

            print('payload', payload)
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


class ItemPostDetail(generics.RetrieveAPIView):
    serializer_class = ItemPostSerializer
    queryset = ItemPost.objects.all()
