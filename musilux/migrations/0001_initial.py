# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-09-05 22:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('performer', models.CharField(max_length=255)),
                ('composer', models.CharField(max_length=255)),
                ('year_c', models.CharField(max_length=4)),
                ('description', models.TextField()),
                ('created', models.DateField(auto_now=True)),
                ('midifile', models.FileField(upload_to='')),
                ('comments', models.TextField()),
            ],
        ),
    ]
