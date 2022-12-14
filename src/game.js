const { ipcRenderer} = require('electron');
const { app, dialog } = require('@electron/remote');
const path = require('path');
const fs = require("fs");

let $ = (jQuery = require("jquery"));

let currentQuestionIndex = 1;
let questions = [];

let points = 0;
let selectedTeam;

const questionFolder = "./json/";

function playAudio(audioName) {
  let fileName = `/sounds/${audioName}.mp3`;
  let filePath = path.join(app.getAppPath(), fileName);
  let audio = new Audio(filePath);
  audio.play();
}

function addXIcon(){
  let icon = $("<i></i>", {
    class: "fa-solid fa-x fa-3x"
  });

  let iconsDiv = $(selectedTeam).find('.x-icons')

  if(iconsDiv.children().length < 3)
    iconsDiv.append(icon);
}

function addAnswersToList(answers) {
  answers.forEach((answer) => {
    let tdAnswer = $("<td></td>", {
      text: answer.answer,
    });
    
    let tdPoint = $("<td></td>", {
      text: answer.points,
    });

    let trAnswer = $("<tr></tr>").append(tdAnswer, tdPoint);
    
    $("tbody").append(trAnswer);

    trAnswer.one("click", function() {
      trAnswer.addClass('cross-text half-opacity');
      let pointsText = $(this).find("td").last().text();
      points += parseInt(pointsText);
      playAudio('CorrectAnswer') 
    })
  })
}

ipcRenderer.on('selected-questions-send', (e, args) => {
  let questionFiles = fs
  .readdirSync(questionFolder, { withFileTypes: true })
  .filter((item) => !item.isDirectory())
  .map((item) => item.name);

  questionFiles.forEach((fileName, index) => {
    if(args.includes(index)) {
      let rawData = fs.readFileSync(questionFolder + fileName);
      let question = JSON.parse(rawData);
      questions.push(question);
    }
  });

  let firstQuestion = questions[0] 

  $('#question-counter').text("1/" + questions.length);
  $('#question').text(firstQuestion.question);
  addAnswersToList(firstQuestion.answers);
})

$("#timer-button").on("click", function () {
  console.log("timer");
});

$("#wrong-button").on("click", function () {
  playAudio("WrongAnswer");

  if(selectedTeam !== undefined)
    addXIcon();
});

$("#winner-button").on("click", function () {
  dialog.showMessageBox({
    message: 'Which team won the round?',
    buttons: ['Red', 'Blue']
  }).then(res => {
    if(res.response === 0) {
      let pointsRed = $('.points-red');
      let currentPoints = parseInt(pointsRed.text());
       pointsRed.text(currentPoints + points);
    }
    else {
      let pointsBlue = $('.points-blue');
      let currentPoints = parseInt(pointsBlue.text());
      pointsBlue.text(currentPoints + points);
    }

    playAudio('RoundWin');
  })
});

$("#next-button").on("click", function () {

});

$(".team-button").on("click", function() {
  
  let teamRed = $('#team-red');
  let teamBlue = $('#team-blue');

  let opacity = 'half-opacity';
  
  selectedTeam = this;
  $(this).removeClass(opacity);
  
  if(this.id == teamRed.attr('id'))  {
    if(!teamBlue.hasClass(opacity))
      teamBlue.addClass(opacity);
  }
  else {
    if(!teamRed.hasClass(opacity))
      teamRed.addClass(opacity);
  }

})
