# Generated by Django 3.2 on 2022-07-28 09:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20220727_1626'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='itempost',
            name='optimal_temperature',
        ),
    ]
