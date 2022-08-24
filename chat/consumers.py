from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
from django.core.exceptions import ObjectDoesNotExist
from .models import Chatroom, Message
from .utils import split_room_name
from core.models import User, ItemPost
from .serializers import MessageSerializer


class ChatConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.group_name = None
        self.user = None
        self.chatroom = None

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.group_name = 'chat_{}'.format(self.room_name)
        (requester_name, item_post_author_name,
         item_post_id) = split_room_name(self.room_name)

        # make sure logged in user are authorised to connect to the chatroom
        self.user = self.scope['user']
        if requester_name != self.user.username and item_post_author_name != self.user.username:
            await self.close()
            return

        self.chatroom = await self.get_or_create_chatroom(requester_name, item_post_author_name, item_post_id)

        if self.chatroom is None:
            # return 404 if chatroom cannot be retrieved or created (invalid link)
            await self.close(code=404)
            return

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        # fetch message history from database
        messages = await self.get_message_history_in_dict(self.chatroom)

        await self.accept()
        print("Connected!")

        # send to websocket
        await self.send_json({
            'type': 'message_history',
            'messages': messages
        })

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive_json(self, content, **kwargs):
        message_type = content['type']
        if message_type == 'chat_message':
            # save message into the database
            message = await self.save_message_to_database(content['message'], content['username'], self.chatroom)

            # broadcast the message to everyone connected to the
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'chat_message_echo',
                    'message': MessageSerializer(message).data
                }
            )

        return super().receive_json(content, **kwargs)

    async def chat_message_echo(self, event):
        await self.send_json(event)

    @sync_to_async
    def get_or_create_chatroom(self, requester_name, item_post_author_name, item_post_id):
        # retrieve users and item post
        try:
            self.requester = User.objects.get(username=requester_name)
            self.post_author = User.objects.get(username=item_post_author_name)
            self.item_post = ItemPost.objects.get(
                id=item_post_id, created_by=self.post_author)

            # retrieve chatroom instance from the database
            chatroom, created = Chatroom.objects.get_or_create(
                name=self.room_name, requester=self.requester, requestee=self.post_author, post=self.item_post)
            return chatroom
        except ObjectDoesNotExist:
            print('error: invalid url')
            return None

    @sync_to_async
    def save_message_to_database(self, message_content, sender_name, chatroom):
        # store chat message into the database
        sender = User.objects.get(username=sender_name)
        return Message.objects.create(
            content=message_content,
            sender=sender,
            chatroom=chatroom
        )

    @sync_to_async
    def get_message_history_in_dict(self, chatroom):
        messages = chatroom.messages.all().order_by('-timestamp')
        return MessageSerializer(messages, many=True).data
