from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os


class OverwriteFileStorage(FileSystemStorage):
    def get_available_name(self, name, max_length):
        # remove old file if new one has the same name
        if self.exists(name):
            self.delete(name)
        return name
