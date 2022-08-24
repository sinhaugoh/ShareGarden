from django.db import models
from django.contrib.auth.models import AbstractUser
from .storage import OverwriteFileStorage
import uuid


def get_profile_image_path(instance, filename):
    return 'images/profile_images/{}/profile_image.jpg'.format(str(instance.pk))


def get_item_image_path(instance, filename):
    return 'images/item_posts/{}/images/{}'.format(str(instance.item_post.uuid), filename)


def get_item_cover_image_path(instance, filename):
    return 'images/item_posts/{}/cover_image.jpg'.format(str(instance.uuid))


class User(AbstractUser):
    profile_image = models.ImageField(null=True, blank=True,
                                      upload_to=get_profile_image_path, storage=OverwriteFileStorage())
    about = models.CharField(max_length=500, null=True, blank=True)
    address = models.CharField(max_length=500, null=True, blank=True)


class ItemPost(models.Model):
    class Category(models.TextChoices):
        '''Category enum'''
        GIVEAWAY = 'Giveaway'
        LEND = 'Lend'
        REQUEST = 'Request'

    class ItemType(models.TextChoices):
        '''Item type enum'''
        SEED_OR_PLANT = 'Seed/Plant'
        FERTILIZER = 'Fertilizer'
        GARDENING_TOOL = 'Gardening tool'
        POT = 'Pot'

    class WaterRequirement(models.TextChoices):
        '''Water requirement enum'''
        NONE = 'None'
        LOW = 'Low'
        MODERATE = 'Moderate'
        MEDIUM = 'Medium'
        HIGH = 'High'
        INTENSIVE = 'Intensive'

    class SoilType(models.TextChoices):
        '''Soil type enum'''
        NONE = 'None'
        CHALK = 'Chalk'
        CLAY = 'Clay'
        PEAT = 'Peat'
        LOAM = 'Loam'
        SANDY_SOIL = 'Sandy soil'

    class LightRequirement(models.TextChoices):
        '''Light requirement enum'''
        NONE = 'None'
        FULL_SUN = 'Full sun'
        PARTIAL_SHADE = 'Partial shade'
        SHADE = 'Shade'

    title = models.CharField(max_length=100)
    description = models.TextField(max_length=500, null=True, blank=True)
    quantity = models.PositiveSmallIntegerField()
    pick_up_information = models.TextField(max_length=256)
    location = models.CharField(max_length=500)
    characteristics = models.TextField(max_length=500, null=True, blank=True)
    soil_type = models.CharField(
        max_length=20, choices=SoilType.choices, default=SoilType.NONE)
    light_requirement = models.CharField(
        max_length=20, choices=LightRequirement.choices, default=LightRequirement.NONE)
    category = models.CharField(max_length=20, choices=Category.choices)
    item_type = models.CharField(max_length=20, choices=ItemType.choices)
    days_to_harvest = models.PositiveSmallIntegerField(null=True, blank=True)
    water_requirement = models.CharField(
        max_length=20, choices=WaterRequirement.choices, default=WaterRequirement.NONE)
    growing_tips = models.TextField(max_length=500, null=True, blank=True)
    cover_image = models.ImageField(
        upload_to=get_item_cover_image_path, storage=OverwriteFileStorage())
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)


class ItemPostImage(models.Model):
    item_post = models.ForeignKey(ItemPost, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_item_image_path)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)


class Transaction(models.Model):
    # class Status(models.TextChoices):
    #     PENDING = 'Pending'
    #     ACCEPTED = 'Accepted'
    #     COMPLETED = 'Completed'

    request_amount = models.PositiveSmallIntegerField()
    # status = models.CharField(
    #     max_length=10, choices=Status.choices, default=Status.PENDING)
    is_completed = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    requester = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, related_name='requester')
    requestee = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, related_name='requestee')
    note = models.CharField(max_length=256, blank=True, null=True)
    item_post = models.ForeignKey(ItemPost, on_delete=models.CASCADE)
