"use strict";


function randomRGB() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    return `rgb(${r}, ${g}, ${b})`
}

function musiluxColor(){
    let musilux = 'Musilux'.split('');
    for (let i=0;i<musilux.length;i++){
        let char = musilux[i];
        let color = randomRGB();
        let clrltr = $("<li>").text(char);
        clrltr.css({'color': color, 'display': 'inline'});
        $('#musilux').append(clrltr);
    }
}
musiluxColor();

function setRandomBackgroundColor(selector) {
    $(selector).css(
        'background',
        `linear-gradient(to bottom, ${randomRGB()}, white)`
    );
}
$(document).ready(function() {
    setRandomBackgroundColor("#play");
});


// todo: https://github.com/Tonejs/MidiConvert, website for midi parser

function parseResponse(song){
    let url = song.midifile_url;

    MidiConvert.load(url, function(midi) {
       console.log(midi);
    });

    let audio = $('<audio controls autoplay>');
    let source = $('<source>', {'src': url});
    audio.append(source);
}


function fetchSong(){
    let choice = $('option:selected').attr('data-songpk');
    console.log(choice);
    // name and functionalize the ajax call
    // call those functions within this area
    $.ajax({
        url: `/api/songs/${choice}`,
        method: 'GET',
        //data: {'title': choice},
        //Response Callback Below
        success: function (response) {
            console.log(response);
            console.log('This works');
            parseResponse(response);
        },
        error: function (err) {
            console.log(err);
            console.log('This does not work');
        }
    });
}


// select id=play when clicked to open  and play appropriate midifile
// don't forget to use console.log to test
$("#play").on('click', function(){
    fetchSong();
});
