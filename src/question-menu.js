const { app, ipcRenderer, remote } = require("electron");
const path = require("path");
const fs = require("fs");
let $ = (jQuery = require("jquery"));

const questionFolder = "./json/";

let selectedCount = 0;

$("button").on("click", function (e) {
  let selectedQuestions = [];

  $("input").each(function (index, element) {
    if (element.checked) selectedQuestions.push(index);
  });

  if (selectedQuestions.length > 0)
    ipcRenderer.send("on-start-button-clicked", selectedQuestions);
  else alert("Please Select at least 1 Question");

  // ipcRenderer.send('on-start-button-clicked', )
});

//called when document is loaded 
$(function() {
  $("input[type=checkbox]").on('change', function() {

    if(this.checked)
      selectedCount++;
    else
      selectedCount--;

    $('h2').text(selectedCount);
  })
})


let questionFiles = fs
  .readdirSync(questionFolder, { withFileTypes: true })
  .filter((item) => !item.isDirectory())
  .map((item) => item.name);

function addQuestionToList(question) {
  let input = $("<input>", {
    type: "checkbox",
    class: "form-check-input",
  });

  let label = $("<label></label>", {
    class: "list-group-item",
    text: question,
  });

  label.prepend(input);

  $("#questions").append(label);

  // .append(`<label class="list-group-item"><input type="checkbox" class="form-check-input me-1"> ${question} </label>`)
}

questionFiles.forEach((questionName) => {
  let rawData = fs.readFileSync(questionFolder + questionName);
  let question = JSON.parse(rawData);
  addQuestionToList(question.question);
});
