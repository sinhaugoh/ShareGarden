# Generated by Django 3.2 on 2022-08-25 04:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_transaction_note'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='date_created',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
