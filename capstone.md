CAPSTONE  PROPOSAL


1. Project name: Music color or Chromomusic, but I want to use something no one else has used maybe even invent a word that means music represented by color.

2. Product overview: More immediate goal is to use sheet music to color a circle above the key on the keyboard that is playing that note. Ultimate goal: use audio input to color the notes that are playing in a song by any voice or instrument.

3. Specific functionality: user interaction is not very intense; they will select a song from a list and press play. Ultimately, I would like to get another category to select from their composition (a file, exact type to be determined) or from streaming audio (with or without video). Minimum feature set is one song.

4. Data model: each note has a color associated with it and every time that note is sounded or played or written the color will change, either the key on the keyboard or a light above the note. Hoping to aid hearing impaired people to â€œseeâ€ sound.

5. Tech components: this is actually a fairly simple program.
    1. User chooses from a list (a database?) of songs and then chooses Play
    2. This choice opens the appropriate file to be read
    3. Plays file, maybe, maybe not, audio
    4. Finishes playing song once and closes file

    There will be one button for song choice and one button for play. In the future, there will be another button for song input from a file not in my list or from user microphone input.
    Biggest problem is input. How will the program read the music? How will the program hear and interpret the music? Simultaneity is another problem, that is, lighting lights simultaneously. Duration is another potential problem, depending on how the music is interpreted. Possible solution is to attach a frequency to a color.
    Probably use flexbox.

6. Estimated schedule: donâ€™t know for sure if it is too difficult. It seems doable with pyAudio, or the likes. Probably do just one song that I choose.

7. Functionality beyond MVP: I would like to use all types of input:

mp3
different music programs
midi
use live audio/frequencies
streaming
orchestral/band as well as piano and vocal
record input, save a file, then play
decibel level directly proportional to intensity


Having said all this though, if you think this is too hard I do have another idea.

See you this week.
