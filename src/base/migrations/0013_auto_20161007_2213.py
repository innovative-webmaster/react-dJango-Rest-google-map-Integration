# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-10-07 22:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0012_auto_20161007_2201'),
    ]

    operations = [
        migrations.AlterField(
            model_name='unit',
            name='number',
            field=models.CharField(max_length=64),
        ),
    ]
