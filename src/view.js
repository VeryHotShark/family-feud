const { ipcRenderer } = require("electron");
let $ = (jQuery = require("jquery"));

function UpdateAnswers(question) {
  let ol = $("ol");
  ol.empty();

  question.answers.forEach((answer) => {
    let div = $("<div></div>", {
      class: "answer-container hide",
    });
    let pAnswer = $("<p></p>", {
      text: answer.answer,
      class: "answer",
    });
    let pPoints = $("<p></p>", {
      text: answer.points,
      class: "points",
    });

    div.append(pAnswer, pPoints);

    let li = $("<li></li>");
    let hr = $("<hr>");

    li.append(div, hr);
    ol.append(li);
  });
}

ipcRenderer.on("on-question-update", (e, args) => {
  UpdateAnswers(args);

  // let icons = $('i');
  //   if(!icons.hasClass('hide'))
  // icons.addClass('hide')
  if ($("i").hasClass("hide")) $("i").addClass("hide");
});

ipcRenderer.on("on-game-start", () => {
  $(".team").removeClass("hide");
});

ipcRenderer.on("on-answer-click", (e, args) => {
  let answer = $("li")[args];
  $(answer).find("div").first().removeClass("hide");
});

ipcRenderer.on("on-points-update", (e, args) => {
  if (args.team === 0) $("#points-red").text(args.points);
  else $("#points-blue").text(args.points);
});

ipcRenderer.on("on-wrong-answer", (e, args) => {
  let iconChildren = $(`div.${args} .icons`).children();

  iconChildren.filter(".hide").first().removeClass("hide");

  $("#overlay").show();

  setTimeout(() => {
    $("#overlay").hide();
  }, 1000);
});

ipcRenderer.on("on-wrong-general", () => {
  $("#overlay").show();

  setTimeout(() => {
    $("#overlay").hide();
  }, 1000);
});

ipcRenderer.on("on-questions-end", (e, args) => {
  $("body").empty();

  let centerDiv = $("<div></div>", {
    class: "center"
  })

  let title = $("<h1></h1>", {
    text: args.caption,
  })

  let points = $("<h1></h1>", {
    text: args.points + " points!",
  })

  centerDiv.css("color", "#fff")
  centerDiv.append(title, points);

  $("body").append(centerDiv);

  if(args.team == 0)
    $("body").css("background-color", "#FF0000")
  else
    $("body").css("background-color", "#0000ff")
});
