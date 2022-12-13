const {ipcRenderer} = require('electron');
const fs = require("fs");
let $ = (jQuery = require("jquery"));

let currentQuestionIndex = 1;
let questions = [];

const questionFolder = "./json/";

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

    trAnswer.on("click", function() {
      console.log($(this).index()); 
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
  console.log("wrong");
});

$("#next-button").on("click", function () {
  console.log("next");
});

$(".team-button").on("click", function() {
  console.log(this.id);
})