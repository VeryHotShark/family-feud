const {ipcRenderer} = require('electron')
const path = require('path');

let $ = jQuery = require('jquery')
$("#description").text("New Description");

// const information = document.getElementById('description');
// information.innerText = "New Description";

function playAudio (audioPath) {
    console.log(audioPath);
    let audio = new Audio(audioPath);
    audio.play();
}

$(document).on('keypress', function (e) {
    // console.log(e.key, e.type);

    // if(e.key === 'w')
        // playAudio('WrongAnswer');
});

ipcRenderer.on('audio', (e, args) => {
    playAudio(args);
})