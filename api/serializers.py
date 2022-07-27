from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from core.models import ItemPost


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username', 'profile_image', 'about']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        required=True, validators=[validate_password])
    password2 = serializers.CharField(required=True)

    class Meta:
        model = get_user_model()
        fields = ['username', 'password', 'password2']
        write_only_fields = ['password', 'password2']

    def validate(self, attrs):
        print('validate----------------------')
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields not match."})

        return attrs

    def create(self, validated_data):
        user = get_user_model().objects.create(
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user


class ItemPostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPost
        fields = [
            'title',
            'description',
            'location',
            'category',
            'cover_image'
        ]
