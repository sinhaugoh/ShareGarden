from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import async_to_sync


class ChatConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.group_name = None

    async def connect(self):
        #TODO: authentication
        print("Connected!")
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.group_name = 'chat_{}'.format(self.room_name)

        print('room name', self.room_name)

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        await self.send_json(
            {
                "type": "welcome_message",
                "message": "Hey there! You've successfully connected!",
            }
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive_json(self, content, **kwargs):
        message_type = content['type']
        if message_type == 'chat_message':
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'chat_message_echo',
                    'message': content['message']
                }
            )

        print(content)
        return super().receive_json(content, **kwargs)

    async def chat_message_echo(self, event):
        print('event', event)
        await self.send_json(event)
