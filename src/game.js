let $ = (jQuery = require("jquery"));

$("#timer-button").on("click", function () {
  console.log("timer");
});

$("#wrong-button").on("click", function () {
  console.log("wrong");
});

$("#next-button").on("click", function () {
  console.log("next");
});

$("tbody tr").on("click", function() {
  console.log($(this).index()); 
})

$(".team-button").on("click", function() {
  console.log(this.id);
})