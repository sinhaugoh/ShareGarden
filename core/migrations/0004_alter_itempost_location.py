# Generated by Django 3.2 on 2022-07-29 06:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_remove_itempost_optimal_temperature'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itempost',
            name='location',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]