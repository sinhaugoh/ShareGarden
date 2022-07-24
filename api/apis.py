from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import logout
from .serializers import *


class AuthUser(APIView):
    def get(self, request):
        payload = {
            'user': None,
            'is_authenticated': False
        }
        if request.user.is_authenticated:
            serializer = UserSerializer(instance=request.user)
            payload['user'] = serializer.data
            payload['is_authenticated'] = True

        return Response(payload, status=status.HTTP_200_OK)


class Logout(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
