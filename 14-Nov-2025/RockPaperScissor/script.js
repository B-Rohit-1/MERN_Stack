let userScore = 0;
let compScore = 0;
let gameActive = true;

let userScoreElem = document.getElementById("userScore");
let compScoreElem = document.getElementById("compScore");
let messageElem = document.getElementById("message");

let choiceButtons = document.getElementsByClassName("choiceBtn");
for (let i = 0; i < choiceButtons.length; i++) {
  choiceButtons[i].onclick = function () {
    if (!gameActive) return;
    let userChoice = this.getAttribute("data-choice");
    playRound(userChoice);
  };
}

document.getElementById("quitBtn").onclick = function () {
  gameActive = false;

  let finalMsg = "";
  if (userScore > compScore) {
    finalMsg = "Final Result: YOU WIN!";
  } else if (compScore > userScore) {
    finalMsg = "Final Result: COMPUTER WINS!";
  } else {
    finalMsg = "Final Result: IT'S A TIE!";
  }

  messageElem.innerText = "Game Quit by User.\n" + finalMsg;
};

function playRound(userChoice) {
  let options = ["R", "P", "S"];
  let compChoice = options[Math.floor(Math.random() * 3)];
  let result = "";

  if (userChoice === compChoice) {
    result = "Tie! Both chose " + userChoice + ".";
  } else if (
    (userChoice === "R" && compChoice === "S") ||
    (userChoice === "P" && compChoice === "R") ||
    (userChoice === "S" && compChoice === "P")
  ) {
    userScore++;
    result = "You win! " + userChoice + " beats " + compChoice + ".";
  } else {
    compScore++;
    result = "Computer wins! " + compChoice + " beats " + userChoice + ".";
  }

  userScoreElem.innerText = "Score: " + userScore;
  compScoreElem.innerText = "Score: " + compScore;
  messageElem.innerText = result;
}
