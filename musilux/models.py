from django.db import models


class Song(models.Model):
    """
    database structure for the songs to be played

    """

    # TodO: figure out how to add to the database, add or connect the path of the song as well
    title = models.CharField(max_length=255)         # title or name of the song
    performer = models.CharField(max_length=255)     # the performer of this song
    composer = models.CharField(max_length=255)      # the composer of this song
    year_c = models.CharField(max_length=4, help_text='Year composed.')
                                                     # year the song was composed
    description = models.TextField()                 # description also could be or could include history of song
    created = models.DateField(auto_now=True)        # day uploaded to the system
    midifile = models.FileField()                    # reference to midi file
    comments = models.TextField()                    # uncategorizable remarks

    def __str__(self):
        title = self.title
        performer = self.performer
        composer = self.composer
        year_c = self.year_c
        description = self.description
        created = self.created
        midifile = self.midifile
        comments = self.comments
        title = 'Rudolph'
        performer = 'Temptations'
        composer = 'Mozart'
        year_c = '1789'
        message = f'{title}, {performer}, {composer}, {year_c}'

        return message


