from django.db import models


class Song(models.Model):
    """
    database structure for the songs to be played

    """

    title = models.CharField(max_length=255)         # title or name of the song
    performer = models.CharField(max_length=255)     # the performer of this song
    composer = models.CharField(max_length=255)      # the composer of this song
    year = models.CharField(max_length=4, help_text='Year composed')
                                                     # year the song was composed
    description = models.TextField()                 # description also could be or could include history of song
    created = models.DateField(auto_now=True)        # day uploaded to the system
    last_accessed = models.DateField(auto_now=True)  # last time the file was accessed
    midifile = models.FileField(upload_to='midifiles/')  # reference to midi file
    comments = models.TextField()                    # uncategorizable remarks

    def __str__(self):
        # can I do Songs.object.all() instead of listing all the fields?
        message = f"""
        {self.title}, {self.performer}, {self.composer}, {self.year}, {self.description}, 
        {self.created}, {self.midifile}, {self.comments}"""

        return message
