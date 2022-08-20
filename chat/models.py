from django.contrib.auth import get_user_model
from django.db import models
from core.models import ItemPost

# Create your models here.


class Chatroom(models.Model):
    name = models.CharField(max_length=500)
    post = models.ForeignKey(ItemPost, on_delete=models.DO_NOTHING)
    requester = models.ForeignKey(
        get_user_model(), on_delete=models.DO_NOTHING)
    # online = models.ManyToManyField(to=get_user_model(), blank=True)


class Message(models.Model):
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)
    chatroom = models.ForeignKey(Chatroom, on_delete=models.CASCADE)
    sender = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING)
