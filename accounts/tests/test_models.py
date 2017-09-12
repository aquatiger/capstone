import pytest
from mixer.backend.django import mixer
pytestmark = pytest.mark.django_db


class TestSong:
    def test_init(self):
        obj = mixer.blend('musilux.Song')
        assert obj.pk == 1, 'Does not exist'

    def test_str(self):
        # use attributes that match the column heading of database model to streamline code
        song = mixer.blend('musilux.Song', title='Rudolph', performer='Temptations', composer='Mozart',
                           year_c='1789', midifile='Rudolph.mid')


        # need title of song, need performer of song etc
        message = f'{song.title}, {song.performer}, {song.composer}, {song.year_c}'

        assert str(song) == message
