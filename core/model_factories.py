import factory

from .models import *


class UserFactory(factory.django.DjangoModelFactory):
    username = factory.Sequence(lambda n: 'user{}'.format(n))
    # set the password of user instance once it is created
    password = factory.PostGenerationMethodCall('set_password', 'ShareGarden')
    profile_image = factory.django.ImageField()
    about = 'this is about section'

    class Meta:
        model = User


class ItemPostFactory(factory.django.DjangoModelFactory):
    title = factory.Sequence(lambda n: 'item{}'.format(n))
    quantity = 1
    pick_up_information = 'This is pick up information'
    location = 'Yew tee mrt'
    category = ItemPost.Category.GIVEAWAY.title()
    item_type = ItemPost.ItemType.SEED_OR_PLANT.title()
    cover_image = factory.django.ImageField()
    created_by = factory.SubFactory(UserFactory)
    water_requirement = ItemPost.WaterRequirement.NONE.title()
    light_requirement = ItemPost.LightRequirement.NONE.title()
    soil_type = ItemPost.SoilType.NONE.title()

    class Meta:
        model = ItemPost
