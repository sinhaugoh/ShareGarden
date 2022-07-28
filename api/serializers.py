from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from core.models import ItemPost, ItemPostImage


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
            'id',
            'title',
            'description',
            'location',
            'category',
            'cover_image'
        ]


class CreateItemPostSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), required=False)
    quantity = serializers.IntegerField(min_value=1, max_value=99)
    days_to_harvest = serializers.IntegerField(
        min_value=1, max_value=999, required=False)

    class Meta:
        model = ItemPost
        fields = [
            'title',
            'description',
            'quantity',
            'pick_up_information',
            'category',
            'item_type',
            'days_to_harvest',
            'water_requirement',
            'growing_tips',
            'location',
            'date_created',
            'date_modified',
            'images',
            'characteristics',
            'soil_type',
            'light_requirement',
            'cover_image'
        ]

    def validate_images(self, value):
        if len(value) > 5:
            # throw validation error if number of images more than 5
            raise serializers.ValidationError('Upload count exceeded.')

        return value

    def create(self, validated_data):
        images = validated_data.pop('images', None)

        item_post = ItemPost.objects.create(
            **validated_data, created_by=self.context['request'].user)

        # bulk create PostImage
        post_images = []
        if images is not None:
            for image in images:
                post_images.append(ItemPostImage(
                    item_post=item_post, image=image))
            ItemPostImage.objects.bulk_create(post_images)

        return item_post
