import unittest
from .utils import *


class SplitRoomNameTest(unittest.TestCase):
    def test_returnCorrectResult(self):
        room_name = 'Test__Test2__1'
        self.assertEqual(split_room_name(room_name), ('Test', 'Test2', '1'))


class CreateRoomNameTest(unittest.TestCase):
    def test_returnCorrectResult(self):
        requester_name = 'Test'
        requestee_name = 'Test2'
        item_post_id = 1

        self.assertEqual(create_room_name(
            requester_name, requestee_name, item_post_id), 'Test__Test2__1')
