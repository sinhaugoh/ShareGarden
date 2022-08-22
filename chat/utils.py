def split_room_name(room_name):
    '''
    Split room name string into a tuple of 3 elements:
    (requester_name, item_post_author_name, item_post_id)
    '''
    splitted_content = room_name.split('__')
    return tuple(splitted_content)
