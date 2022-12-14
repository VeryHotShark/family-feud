const { ipcRenderer} = require('electron');
const { app, dialog , globalShortcut} = require('@electron/remote');
const path = require('path');
const fs = require("fs");

globalShortcut.register('CommandOrControl+W', () => {
  playAudio("Faceoff");
})

globalShortcut.register('CommandOrControl+Q', () => {
  playAudio("WrongAnswer");
})


let $ = (jQuery = require("jquery"));

let currentQuestionIndex = 0;
let questions = [];

let gainedPoints = 0;
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
  $("tbody").empty();

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
      gainedPoints += parseInt(pointsText);
      playAudio('CorrectAnswer') 
    })
  })
}

function UpdateQuestion(question) {
  $('#question-counter').text((currentQuestionIndex + 1) + "/" + questions.length);
  $('#question').text(question.question);
  addAnswersToList(question.answers);
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

  UpdateQuestion(questions[0]);
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
       pointsRed.text(currentPoints + gainedPoints);
    }
    else {
      let pointsBlue = $('.points-blue');
      let currentPoints = parseInt(pointsBlue.text());
      pointsBlue.text(currentPoints + gainedPoints);
    }

    playAudio('RoundWin');
  })
});

function GetWinnerTeam() {
  let pointsBlue = parseInt($('.points-blue').text());
  let pointsRed = parseInt($('.points-red').text());

  if(pointsRed > pointsBlue) {
    return {
      team : "Red Wins!",
      points : pointsRed    
    }
  }
  else if(pointsRed < pointsBlue)
  {
    return {
      team : "Blue Wins!",
      points : pointsBlue    
    }
  }
  else
  {
    return {
      team : "Draw!",
      points : pointsRed    
    }
  }
}

$("#next-button").on("click", function () {
  gainedPoints = 0;
  currentQuestionIndex++;

  if(currentQuestionIndex < questions.length)
    UpdateQuestion(questions[currentQuestionIndex]);
  else
    ipcRenderer.send('on-questions-end', GetWinnerTeam())
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
