# Generated by Django 3.2 on 2022-07-31 12:35

import core.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_alter_itempost_location'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itempost',
            name='cover_image',
            field=models.ImageField(upload_to=core.models.get_item_cover_image_path),
        ),
    ]
