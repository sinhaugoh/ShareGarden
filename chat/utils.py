def split_room_name(room_name):
    '''
    Split room name string into a tuple of 3 elements:
    (requester_name, item_post_author_name, item_post_id)
    '''
    splitted_content = room_name.split('__')
    return tuple(splitted_content)


def create_room_name(requester_name, item_post_author_name, item_post_id):
    '''
    Create room name based on requester_name, item_post_author_name
    item_post_id.

    Format: <requester_name>__<item_post_author_name>__<item_post_id>
    '''
    return '{}__{}__{}'.format(requester_name, item_post_author_name, item_post_id)
