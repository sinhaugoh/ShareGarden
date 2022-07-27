# Generated by Django 3.2 on 2022-07-27 04:54

import core.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_auto_20220727_1248'),
    ]

    operations = [
        migrations.CreateModel(
            name='ItemPostImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=core.models.get_item_image_path)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.itempost')),
            ],
        ),
    ]
