"use strict";

// a generic random color generator used for "Musilux" and play button background
function randomRGB() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    return `rgb(${r}, ${g}, ${b})`
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
// need to wait for the document to be done loading, otherwise it does not load properly
$(document).ready(function() {
    setRandomBackgroundColor("#play");
});

function calculateBeatInterval(bpm) {
    return Math.floor(60000 / bpm);
}

function lightShow(midi) {
    let bpm = midi.header.bpm;
    let trackData = midi.tracks[1];
    let trackNotes = trackData.notes;

    let $lastKey;

    let noteInterval = setInterval(function() {
        if(trackNotes.length == 0) {
            clearInterval(noteInterval);
            return;
        }

        let note = trackNotes.splice(0, 1)[0];
        console.log(note);

        let $key = $('#note-'+ note.midi);

        if($lastKey) $lastKey.removeAttr('style');

        $key.css('background', randomRGB());

        $lastKey = $key;
    }, calculateBeatInterval(bpm));
}


// todo: https://github.com/Tonejs/MidiConvert, website for midi parser
// function to parse the chosen song to play and for the lightshow
function parseResponse(song) {
    let url = song.midifile_url;

    MidiConvert.load(url, lightShow);
}

// function to get the chosen song
function fetchSong(){
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
// when play button is clicked, start playing chosen song from list
$("#play").on('click', function(){
    fetchSong();
});

// Give keys valid ids.
$(document).ready(function() {
    $('#lights').children('div').each(function(index) {
       $(this).attr('id', `note-${index + 21}`);
    });
});