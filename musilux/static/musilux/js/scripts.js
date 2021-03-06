"use strict";

// Large portions are commented out but not deleted because I'm not sure whether they will be useful later.

// a generic random color generator used for "Musilux" and play button background
function randomRGB() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    return `rgb(${r}, ${g}, ${b})`
}

function getColor(midinumber, velocity) {
    let hsl_str = colors[midinumber];
    // console.log(hsl_str);
    return hsl_str
}

// function to randomly color the word Musilux
function musiluxColor() {
    let musilux = 'Musilux'.split('');
    for (let i=0;i<musilux.length;i++){
        let char = musilux[i];
        let color = randomRGB();
        // clrltr is color letter
        let clrltr = $("<li>").text(char);
        clrltr.css({'color': color, 'display': 'inline'});
        $('#musilux').append(clrltr);
    }
}
musiluxColor();

// function to randomly color the play button background w/ the generic random color generator
function setRandomBackgroundColor(selector) {
    $(selector).css(
        'background',
        `linear-gradient(to bottom, ${randomRGB()}, white)`
    );
}
// need to wait for the document to be done loading, otherwise it does not set the background color
$(document).ready(function() {
    setRandomBackgroundColor("#play");
});

// bpm stands for beats per minute
function calculateBeatInterval(bpm) {
    return Math.floor(60000 / bpm);
}

// function lightShow(midi) {
//     let bpm = midi.header.bpm;
//     let trackData = midi.tracks[0];
//     let trackNotes = trackData.notes;
//
//     let $lastKey;
//
//     let noteInterval = setInterval(function() {
//         if(trackNotes.length === 0) {
//             clearInterval(noteInterval);
//             return;
//         }
//
//         let note = trackNotes.splice(0, 1)[0];
//         console.log(note);
//         let velocity = note.velocity;
//         let midinum = note.midi;
//
//         let $key = $(`#note-${midinum}`);
//
//         if($lastKey) $lastKey.removeAttr('style');
//
//         let note_color = getColor(midinum, velocity);
//         // console.log(note_color);
//
//         let bgsubstr = `background 0.02s`; // I think this should be note.duration
//
//         let lightColor = {
//             // 'background': randomRGB(),
//             'background-color': note_color,
//             '-webkit-transition': bgsubstr,
//             '-moz-transition': bgsubstr,
//             '-o-transition': bgsubstr,
//             'transition': bgsubstr,
//             'opacity': velocity
//             };
//
//
//         console.log(lightColor);
//         // let lightColor = {backgroundColor: randomRGB()};
//         $key.css(lightColor);
//
//         $lastKey = $key;
//     }, calculateBeatInterval(bpm));
// }
//
//
let testSynth = new Tone.PolySynth(8).toMaster();

function newLightShow(midi) {
    console.log(midi);
    Tone.Transport.latencyHint = 2;
    Tone.Transport.bpm.value = midi.header.bpm;

    let $lastKey;
    let trackNumber = (midi.tracks.length > 1)? midi.tracks.length-1 : 0;

    let midiPart = new Tone.Part(function(time, note) {
        testSynth.triggerAttackRelease(note.name, '4n', 0.2);
        // console.log(note.duration);
        //
        let velocity = note.velocity;

        let $key = $(`#note-${note.midi}`);

        if($lastKey) {
            if($lastKey.hasClass('blackkey'))
                $lastKey.css('background-color', '#000');
            else if($lastKey.hasClass('whitekey'))
                $lastKey.css('background-color', '#FFF');

            $lastKey.css('opacity', '1');
        }

        let note_color = getColor(note.midi, velocity);
        // console.log(note_color);

        // let bgsubstr = `background 0.02s`; // I think this should be note.duration

        let lightColor = {
            // 'background': randomRGB(),
            'background-color': note_color,
            // 'opacity': velocity
            };


        // console.log(lightColor);
        // let lightColor = {backgroundColor: randomRGB()};
        $key.css(lightColor);

        $lastKey = $key;
    }, midi.tracks[trackNumber].notes);

    Tone.Transport.start();
    midiPart.start();
}

// function to parse the chosen song to play and for the lightshow
function parseResponse(song) {
    let url = song.midifile_url;

    MidiConvert.load(url, newLightShow);
}

function playSong(midifile) {
    MIDI.programChange(0, MIDI.GM.byName['acoustic_grand_piano'].number);
    MIDI.Player.timeWarp = 1;
    MIDI.Player.loadFile(midifile, MIDI.Player.start);
    MIDI.Player.addListener(function (data) {
        console.log("I'm playing!!!");
        console.log(data);
    });
}

// function to get the song the user chooses
function fetchSong() {
    let choice = $('option:selected').attr('data-songpk');

    // name and functionalize the ajax call
    // call those functions within this area
    $.ajax({
        url: `/api/songs/${choice}`,
        method: 'GET',
        success: function (response) {
            parseResponse(response);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
    // // MIDI.Player.clearAnimation();
    // MIDI.Player.setAnimation(function(data) {
    //     let now = data.now; // where we are now
    //     let end = data.end; // time when song ends
    //     let events = data.events; // all the notes currently being processed
    // });

    // name and functionalize the ajax call
    // call those functions within this area
    // $.ajax({
    //     url: `/api/songs/${choice}`,
    //     method: 'GET',
    //     success: function (response) {
    //         parseResponse(response);
    //     },
    //     error: function (err) {
    //         console.log(err);
    //     }
    // });

// when play button is clicked, start playing chosen song from list
$("#play").on('click', function(){
    fetchSong();
});

// Give keys valid ids.
/*$(document).ready(function() {
    $('#keyboard.lightshow-top').children('div').each(function(index) {
       $(this).attr('id', `note-${index + 21}`);
    });
});*/

// Matthew Cooper's piano generation script.

let keyboards = document.querySelectorAll('#keyboard');

keyboards.forEach(function(keyboard) {
    let pattern = [1,1,0,1,1,0,1];
    //let pattern = [1,1,1,1,1,1,1];
    let n_white_keys = 52;
    let key_width = 100/n_white_keys;
    let white_key_height = 100;
    let black_key_height = 60;

    let id = 21;

    for (let i=0; i<n_white_keys; ++i) {
      if (i != 0 && pattern[i%pattern.length] == 1) {
        let black_key = document.createElement('div');
        black_key.className = 'blackkey';
        black_key.style.backgroundColor = 'black';
        black_key.style.width = (key_width-0.8)+'%';
        black_key.style.height = black_key_height+'px';
        black_key.style.zIndex = 2;
        black_key.style.position = 'absolute';
        black_key.style.top = 0;
        black_key.style.transform = 'translateX(-50%)';
        black_key.style.left = (i*(key_width))+'%';
        black_key.id = 'note-'+id;
        id += 1;
        keyboard.appendChild(black_key);
      }

      let white_key = document.createElement('div');
      white_key.classList.add('whitekey');
      white_key.style.position = 'absolute';
      white_key.style.left = i*(key_width)+'%';
      white_key.style.top = 0;
      white_key.style.width = key_width+'%';
      white_key.style.height = white_key_height+'px';
      white_key.id = 'note-'+id; //    Give keys valid ids
      id += 1;
      keyboard.appendChild(white_key);


    }

});

// End piano script.
