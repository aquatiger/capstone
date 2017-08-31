from django.db import models

from accounts.models import User

class Song(models.Model):
    """
    database structure for the songs to be played

    """

    title = models.CharField(max_length=255)         # title or name of the song
    performer = models.CharField(max_length=255)     # the performer of this song
    composer = models.CharField(max_length=255)      # the composer of this song
    year_c = models.CharField(max_length=4)          # year the song was composed
    description = models.TextField()                 # description also could be or could include history of song
    created = models.DateField(auto_now=True)    # day uploaded to the system
    midifile = models.FileField()                    #     reference to midi file

    def __str__(self):
        title = self.title()