import factory
from .models import *
from core.model_factories import UserFactory, ItemPostFactory


class ChatroomFactory(factory.django.DjangoModelFactory):
    post = factory.SubFactory(ItemPostFactory)
    requester = factory.SubFactory(UserFactory)
    requestee = factory.SubFactory(UserFactory)
    name = factory.LazyAttribute(lambda o: '{}__{}__{}'.format(
        o.requester.username, o.requestee.username, o.post.id))

    class Meta:
        model = Chatroom


class MessageFactory(factory.django.DjangoModelFactory):
    content = 'random_text'
    chatroom = factory.SubFactory(ChatroomFactory)
    sender = factory.SubFactory(UserFactory)

    class Meta:
        model = Message
