"use strict";


// get random color for each letter in the word Musilux for the home page
function randomColor() {
    let letters = '0123456789ABCDEF';
    // hexletter for hexidecimal (the color) of the letter
    let hexletter = 'Musilux'.split('');
    let color = '#';
    for (let i=0;i<6;i++) {
        color += letters[Math.floor(math.random() * 16)];
    }
    let rejoin = hexletter.color.join();
    return color
}

function setRandomColor() {
    $("#musilux").css("font-color", randomColor());
    $("#play").css("background-color", randomColor());
}
// TODO: randomly color musilux in the home page


// todo: https://github.com/Tonejs/MidiConvert, website for midi parser

function parseResponse(song){
    let url = song.midifile;
    let audio = $('<audio controls autoplay>');
    let source = $('<source>', {'src': url});
    audio.append(source);
}


function fetchSong(){
    let choice = $('option:selected').attr('data-songpk');
    console.log(choice);
    // name and functionalize the ajax call, name and functionalize the success part
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
