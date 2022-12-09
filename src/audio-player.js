exports.playAudio = (audioName) => {
    let path = `sounds/${audioName}.mp3`;
    let audio = new Audio(path);
}