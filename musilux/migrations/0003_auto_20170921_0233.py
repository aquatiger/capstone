# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-09-21 02:33
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('musilux', '0002_auto_20170918_1747'),
    ]

    operations = [
        migrations.RenameField(
            model_name='song',
            old_name='year_c',
            new_name='year',
        ),
    ]
