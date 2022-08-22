from rest_framework import serializers
from .models import Message, Chatroom
from core.models import User, ItemPost


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

# class ItemPostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ItemPost
#         field = ['title']

# class ChatroomSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Chatroom
#         fields = ['']


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SlugRelatedField(
        read_only=True, slug_field='username')

    class Meta:
        model = Message
        fields = ['content', 'timestamp', 'sender']
