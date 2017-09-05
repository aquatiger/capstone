"use strict";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// get random color for each letter in the word Musilux for the home page
// function randomColor() {
//     let hexletter = 'Musilux'.split('');
//     let color = '#';
//     for (let i=0;i<6;i++){
//         // get random number between 0 and len of hexletter
//         // use random number to get hexletter
//         // concatenate to the color string
//         let x = getRandomInt(0, hexletter.length);
//         let hexlet = hexletter[x];
//         color += hexletter;
//     }
//     return color
// }
// TODO: color musilux in the home page

function randomColor() {
    let hexletter = 'Musilux'.split('');
    return '#' + ('00000' + (Math.random() * 16777216 << 0).hexletter.join()

//    toString(16)).substr(-6); this was in the original from Stackoverflow replacing hexletter.join
}