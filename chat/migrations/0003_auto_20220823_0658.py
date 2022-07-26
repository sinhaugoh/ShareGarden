# Generated by Django 3.2 on 2022-08-23 06:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0002_alter_message_chatroom'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatroom',
            name='requestee',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.DO_NOTHING, related_name='requestee_chatrooms', to='core.user'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='chatroom',
            name='requester',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='requester_chatrooms', to=settings.AUTH_USER_MODEL),
        ),
    ]
