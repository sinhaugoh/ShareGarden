# Generated by Django 3.2 on 2022-08-03 04:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_transaction'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaction',
            name='status',
        ),
        migrations.AddField(
            model_name='transaction',
            name='is_completed',
            field=models.BooleanField(default=False),
        ),
    ]