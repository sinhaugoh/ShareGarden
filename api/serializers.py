from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from core.models import ItemPost, ItemPostImage
import googlemaps
from .constants import GOOGLE_API_KEY


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username', 'profile_image', 'about', 'address']

    def validate_username(self, value):
        # make sure the username cannot be modified once user is created
        if self.instance and value != self.instance.username:
            raise serializers.ValidationError("Username can only be set once.")

    def validate_address(self, value):
        if value == '':
            return value

        gmaps = googlemaps.Client(key=GOOGLE_API_KEY)
        # raise validation error if the google map api cannot geocode the address
        result = gmaps.geocode(value)

        if not result:
            raise serializers.ValidationError(
                'Please provide a valid address.')

        return value


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        required=True, validators=[validate_password])
    password2 = serializers.CharField(required=True)

    class Meta:
        model = get_user_model()
        fields = ['username', 'password', 'password2']
        write_only_fields = ['password', 'password2']

    def validate(self, attrs):
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


class ItemPostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPostImage
        fields = ['id', 'image', 'item_post']


class ItemPostSerializer(serializers.ModelSerializer):
    itempostimage_set = ItemPostImageSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    quantity = serializers.IntegerField(min_value=1, max_value=99)
    days_to_harvest = serializers.IntegerField(
        min_value=1, max_value=999, required=False)

    class Meta:
        model = ItemPost
        fields = [
            'id',
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
            'created_by',
            'itempostimage_set',
            'characteristics',
            'soil_type',
            'light_requirement',
            'cover_image',
            'is_active'
        ]

    def validate_location(self, value):
        gmaps = googlemaps.Client(key=GOOGLE_API_KEY)
        # raise validation error if the google map api cannot geocode the address
        result = gmaps.geocode(value)
        if not result:
            raise serializers.ValidationError(
                'Please provide a valid address.')

        return value

    def validate(self, attrs):
        # have to convert QueryDict into dict so that I am able to get the images in List type
        request_data_dict = dict(self.context.get('request').data)
        images = request_data_dict.get('images')
        # throw validation error if number of images more than 5
        if images and len(images) > 5:
            raise serializers.ValidationError(
                {'images': 'Upload count exceeded.'})
        return attrs

    def update(self, instance, validated_data):
        print('validated_data', validated_data)
        with transaction.atomic():
            instance.title = validated_data.get('title', instance.title)
            instance.description = validated_data.get(
                'description', instance.description)
            instance.quantity = validated_data.get(
                'quantity', instance.quantity)
            instance.pick_up_information = validated_data.get(
                'pick_up_information', instance.pick_up_information)
            instance.location = validated_data.get(
                'location', instance.location)
            instance.characteristics = validated_data.get(
                'characteristics', instance.characteristics)
            instance.soil_type = validated_data.get(
                'soil_type', instance.soil_type)
            instance.light_requirement = validated_data.get(
                'light_requirement', instance.light_requirement)
            instance.category = validated_data.get(
                'category', instance.category)
            instance.item_type = validated_data.get(
                'item_type', instance.item_type)
            instance.days_to_harvest = validated_data.get(
                'days_to_harvest', instance.days_to_harvest)
            instance.water_requirement = validated_data.get(
                'water_requirement', instance.water_requirement)
            instance.growing_tips = validated_data.get(
                'growing_tips', instance.growing_tips)
            instance.is_active = validated_data.get(
                'is_active', instance.is_active)
            instance.cover_image = validated_data.get(
                'cover_image', instance.cover_image)

            instance.save()

            # have to convert QueryDict into dict so that I am able to get the images in List type
            request_data_dict = dict(self.context.get('request').data)
            images = request_data_dict.get('images')

            # bulk create and delete PostImage
            post_images = []
            if images is not None:
                # remove all previously uploaded images
                ItemPostImage.objects.filter(item_post=instance).delete()

                # create new item post image instances
                for image in images:
                    post_images.append(ItemPostImage(
                        item_post=instance, image=image))
                ItemPostImage.objects.bulk_create(post_images)

        return instance


class ItemPostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPost
        fields = [
            'id',
            'title',
            'description',
            'location',
            'category',
            'cover_image',
            'is_active',
            'quantity'
        ]


class CreateItemPostSerializer(serializers.ModelSerializer):
    # images = serializers.ListField(
    #     child=serializers.ImageField(), required=False)
    images = ItemPostImageSerializer(many=True, required=False)
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
            'cover_image',
            'is_active'
        ]

    # def validate_images(self, value):
    #     print('halo')
    #     print(self.context.get('request'))
    #     if len(self.context.get('request').data.pop('images')) > 5:
    #         # throw validation error if number of images more than 5
    #         raise serializers.ValidationError('Upload count exceeded.')

    #     return value

    def validate_location(self, value):
        gmaps = googlemaps.Client(key=GOOGLE_API_KEY)
        # raise validation error if the google map api cannot geocode the address
        result = gmaps.geocode(value)
        if not result:
            raise serializers.ValidationError(
                'Please provide a valid address.')

        return value

    def validate(self, attrs):
        # have to convert QueryDict into dict so that I am able to get the images in List type
        request_data_dict = dict(self.context.get('request').data)
        images = request_data_dict.get('images')
        # throw validation error if number of images more than 5
        if images and len(images) > 5:
            raise serializers.ValidationError(
                {'images': 'Upload count exceeded.'})
        return attrs

    def create(self, validated_data):
        # remove is_active field so that it is set to its default value (True for now)
        del validated_data['is_active']

        item_post = ItemPost.objects.create(
            **validated_data, created_by=self.context['request'].user)

        # bulk create PostImage
        images = self.context.get('request').data.pop('images', None)
        post_images = []
        if images is not None:
            for image in images:
                post_images.append(ItemPostImage(
                    item_post=item_post, image=image))
            ItemPostImage.objects.bulk_create(post_images)

        return item_post
