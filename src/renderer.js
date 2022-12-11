const {ipcRenderer, remote} = require('electron')
const path = require('path');

let $ = jQuery = require('jquery')

function playAudio (audioPath) {
    console.log(audioPath);
    let audio = new Audio(audioPath);
    audio.play();
}

$(document).on('keypress', function (e) {
    // console.log(e.key, e.type);
});

ipcRenderer.on('audio', (e, args) => {
    playAudio(args);
})

$('button').on('click', function () {
    ipcRenderer.send('on-play-button-clicked')
})