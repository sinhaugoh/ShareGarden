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
    category = ItemPost.Category.GIVEAWAY
    item_type = ItemPost.ItemType.SEED_OR_PLANT
    cover_image = factory.django.ImageField()
    created_by = factory.SubFactory(UserFactory)

    class Meta:
        model = ItemPost
