from rest_framework import serializers
from .models import Message, Chatroom
from core.models import User, ItemPost


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profile_image']


class ItemPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPost
        fields = ['id', 'title', 'cover_image', 'quantity']


class ChatroomSerializer(serializers.ModelSerializer):
    post = ItemPostSerializer()
    requester = UserSerializer()
    requestee = UserSerializer()

    class Meta:
        model = Chatroom
        fields = ['name', 'post', 'requester', 'requestee']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()

    class Meta:
        model = Message
        fields = ['content', 'timestamp', 'sender']
