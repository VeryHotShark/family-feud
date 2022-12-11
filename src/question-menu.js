const { app, ipcRenderer, remote } = require("electron");
const path = require('path');
const fs = require("fs");
let $ = jQuery = require('jquery')

let questions = [];
const questionFolder = "./json/";

$('button').on('click',function(e) {

  $('input').each(function (index, element) {
    // element == this

    if(element.checked)
        console.log(index);    
  });

  

  // ipcRenderer.send('on-start-button-clicked', )
});

let questionFiles = fs
  .readdirSync(questionFolder, { withFileTypes: true })
  .filter((item) => !item.isDirectory())
  .map((item) => item.name);


function addQuestionToList(question) {
  let input = $('<input>', {
    "type": 'checkbox',
    "class": 'form-check-input me-1',
  });

  let label = $('<label></label>', {
    "class" : "list-group-item",
    text: question
  });

  label.prepend(input);

  $('#questions').append(label);

    // .append(`<label class="list-group-item"><input type="checkbox" class="form-check-input me-1"> ${question} </label>`)
}

questionFiles.forEach(questionName => {
      let rawData = fs.readFileSync(questionFolder + questionName);
      let question = JSON.parse(rawData);
      questions.push(question);
      addQuestionToList(question.question)
});
  
