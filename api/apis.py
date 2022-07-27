from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import logout, authenticate, login
from .constants import *
from .serializers import *
from core.models import *


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
        item_posts = ItemPost.objects.all().order_by('-created_by')
        serializer = ItemPostListSerializer(instance=item_posts, many=True)

        if not request.user.is_authenticated or not request.user.location:
            return Response(serializer.data, status=status.HTTP_200_OK)
