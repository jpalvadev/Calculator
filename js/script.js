/////////////////////////////////////////
// CSS Properties
const cssProperties = getComputedStyle(document.body);
let textColor = cssProperties.getPropertyValue("--color-text");
let bgColor = cssProperties.getPropertyValue("--color-back");
let accentColorOne = cssProperties.getPropertyValue("--color-accent-one");
let accentColorTwo = cssProperties.getPropertyValue("--color-accent-two");

const game = {
  score: 0,
  timer: cssProperties.getPropertyValue("--timer"),
  started: false,
  result: 0,
};

/////////////////////////////////////////
// DOM Elements
const regex = new RegExp("([.0-9]+)|([^0-9]+)", "g");
const darkThemeBtn = document.querySelector(".dark");
const btnsContainer = document.querySelector(".btns-container");
const displayOperation = document.querySelector(".display__operation");
const displayValue = document.querySelector(".display__value");
const light = document.querySelector(".btns-container__light");
light.style.top = `-1000px`;
const radioBtns = document.querySelector(".checkbox");
const sidePanel = document.querySelector(".side-panel");
const historyDiv = document.querySelector(".side-panel__history-div");
const gameDiv = document.querySelector(".side-panel__game-div");
const startGameBtn = document.querySelector(".side-panel__btn");
const gameBar = document.querySelector(".side-panel__bar");
const gameText = document.querySelector(".guess");
const scoreText = document.querySelector(".score");
const tabs = document.querySelectorAll(".side-panel label");
const highScoresContainer = document.querySelector(".side-panel__high-scores");

///////////////////////////////////////////
// Change CSS display property
const showElements = (...elements) => {
  elements.forEach((el) => {
    el.style.display = "initial";
  });
};
const hideElements = (...elements) => {
  elements.forEach((el) => {
    el.style.display = "none";
  });
};

//////////////////////////////////////////
// HIGH SCORES
let highScores = [
  { name: "Tino" },
  { name: "Juan" },
  { name: "Andrea" },
  { name: "Marmolina" },
  { name: "Vito" },
  { name: "Pepe" },
  { name: "Cristina" },
  { name: "Shepard" },
  { name: "Doomguy" },
  { name: "Negrita" },
  { name: "Geralt" },
  { name: "Ezio" },
  { name: "Garrus" },
  { name: "Mario" },
];

const sortHighScores = () => {
  highScores = highScores.sort((a, b) => (a.score > b.score ? -1 : 1));
  highScores.length = 5;
};

const checkNewScoreIsHighScore = () => {
  if (game.score <= highScores[4].score) return;
  const newHighScore = {};
  newHighScore.name = prompt("New High Score! Enter your name");
  if (!newHighScore.name) newHighScore.name = "El Barto";
  newHighScore.score = game.score;
  highScores.push(newHighScore);
  sortHighScores();
  populateHighScoreTable();
  localStorage.setItem("highscores", JSON.stringify(highScores));
};

const populateHighScoreTable = () => {
  highScoresContainer.innerHTML = ``;
  const topText = ["T", "O", "P", "&nbsp;", "5"];
  highScores.forEach((highScore, i) => {
    const topScoreDiv = document.createElement("div");
    topScoreDiv.classList.add("side-panel__top-score");
    topScoreDiv.innerHTML = `
      <p class="side-panel__game-text top-five">${topText[i]}</p>
      <p class="side-panel__player-name">${highScore.name}</p>
      <p class="side-panel__player-score">${highScore.score}</p>
    `;
    highScoresContainer.appendChild(topScoreDiv);
  });
  localStorage.setItem("highscores", JSON.stringify(highScores));
};

const getRandomOperation = () => {
  const operators = ["+", "-", "x", "/"];
  const operator = Math.floor(Math.random() * operators.length);
  let upperLimit = 0;
  if (operator > 1) upperLimit = 10 + 2 * game.score;
  else upperLimit = 100 + 20 * game.score;
  calculator.firstOperand = Math.ceil(Math.random() * upperLimit);
  calculator.secondOperand = Math.ceil(Math.random() * upperLimit);
  if (operator === 1 && calculator.firstOperand < calculator.secondOperand) {
    [calculator.firstOperand, calculator.secondOperand] = [
      calculator.secondOperand,
      calculator.firstOperand,
    ];
  }
  calculator.operator = operators[operator];
  game.result = handleOperation();
  gameText.textContent = `${calculator.firstOperand} ${calculator.operator} ${calculator.secondOperand} = ?`;
};

const startGame = () => {
  game.started = true;
  showElements(scoreText);
  hideElements(highScoresContainer, startGameBtn, ...tabs);
  ClearAll();
  getRandomOperation();
  showElements(gameBar, gameText);

  // We need a timeout because you can't animate elements inmediately after displaying them
  setTimeout(() => {
    game.timer -= 1;
    gameBar.style.width = `${game.timer * 5}%`;
  }, 20);

  const interval = setInterval(() => {
    game.timer -= 1;
    gameBar.style.width = `${game.timer * 5}%`;

    if (game.timer <= -1) {
      gameOver();
      clearInterval(interval);
    }
  }, 1000);
};

const gameOver = () => {
  checkNewScoreIsHighScore();
  ClearAll();
  showElements(highScoresContainer, startGameBtn);
  tabs.forEach((tab) => (tab.style.display = `flex`));
  hideElements(scoreText, gameBar);
  game.timer = 20;
  game.started = false;
  gameText.textContent = `Final Score: ${game.score}`;
  game.score = 0;
  scoreText.textContent = `Score: 0`;
  gameBar.style.width = `100%`;
};

startGameBtn.addEventListener("click", () => {
  startGame();
});

// Tabs
sidePanel.addEventListener("click", function (e) {
  if (e.target.id === "history-tab") {
    historyDiv.classList.add("visible");
    gameDiv.classList.remove("visible");
  } else {
    gameDiv.classList.add("visible");
    historyDiv.classList.remove("visible");
  }
});

radioBtns.addEventListener("change", function (e) {
  if (e.target.classList.contains("dark")) {
    changeColorMode();
    return;
  }
  if (e.target.classList.contains("voice") && e.target.checked) {
    recognition.addEventListener("end", continueVoiceRecog);
    recognition.start();
  } else {
    recognition.stop();
    recognition.removeEventListener("end", continueVoiceRecog);
  }
});

const calculator = {
  displayValue: 0,
  firstOperand: "",
  hasFirstPart: false,
  operator: "",
  secondOperand: "",
  calculationDone: false,
};

const changeColorMode = () => {
  localStorage.setItem("dark-theme", darkThemeBtn.checked);
  if (darkThemeBtn.checked) {
    document.documentElement.style.setProperty("--color-text", bgColor);
    document.documentElement.style.setProperty("--color-back", textColor);
    document.documentElement.style.setProperty(
      "--color-accent-one",
      accentColorTwo
    );
  } else {
    document.documentElement.style.setProperty("--color-text", textColor);
    document.documentElement.style.setProperty("--color-back", bgColor);
    document.documentElement.style.setProperty(
      "--color-accent-one",
      accentColorOne
    );
  }
};

handleOperation = () => {
  switch (calculator.operator) {
    case "+":
      return calculator.firstOperand + calculator.secondOperand;
    case "-":
      return calculator.firstOperand - calculator.secondOperand;
    case "x":
      return calculator.firstOperand * calculator.secondOperand;
    case "/":
      if (game.started) {
        let temp = calculator.firstOperand * calculator.secondOperand;
        let result = calculator.secondOperand;
        calculator.secondOperand = calculator.firstOperand;
        calculator.firstOperand = temp;
        return result;
      }
      return calculator.firstOperand / calculator.secondOperand;
    case "^":
      return calculator.firstOperand ** calculator.secondOperand;
    case "√":
      return Math.pow(calculator.firstOperand, 1 / calculator.secondOperand);
  }
};

const updateHistory = (operation) => {
  const resultTag = document.createElement("p");
  resultTag.textContent = operation;
  resultTag.classList.add("side-panel__history-text");
  historyDiv.removeChild(historyDiv.firstElementChild);
  historyDiv.appendChild(resultTag);
};

const checkAnswer = () => {
  if (Number(calculator.displayValue) === game.result) {
    game.timer += 5;
    game.score++;
    scoreText.textContent = `Score: ${game.score}`;
  } else game.timer -= 5;
  if (game.timer > 20) game.timer = 20;
  getRandomOperation();
  displayValue.textContent = "0";
};

const handleEqualInput = () => {
  if (game.started) checkAnswer();

  if (!calculator.hasFirstPart) return;

  calculator.secondOperand = parseFloat(calculator.displayValue);
  if (!calculator.secondOperand) return;

  calculator.displayValue = handleOperation();
  const operandOne = Number(calculator.firstOperand).toLocaleString("en-US");
  const OperandTwo = Number(calculator.secondOperand).toLocaleString("en-US");
  const result = Number(calculator.displayValue).toLocaleString("en-US");

  displayOperation.textContent = `${operandOne} ${calculator.operator} ${OperandTwo} = ${result}`;
  updateHistory(displayOperation.textContent);
  updateDisplayValue();
  calculator.hasFirstPart = false;
  calculator.secondOperand = "";
  calculator.operator = "";
};

const handleOperatorInput = (operator) => {
  if (calculator.operator) {
    calculator.operator = operator;
    displayOperation.textContent =
      displayOperation.textContent.slice(0, -1) + operator;
  }

  if (calculator.displayValue.length === 0) return;

  calculator.calculationDone = false;

  if (calculator.hasFirstPart) {
    handleEqualInput();
  }
  calculator.operator = operator;
  calculator.hasFirstPart = true;
  calculator.firstOperand = parseFloat(calculator.displayValue);
  const operandOne = Number(calculator.firstOperand).toLocaleString("en-US");
  displayOperation.textContent = `${operandOne} ${calculator.operator}`;
  calculator.displayValue = "";
};

const handleNumberInput = (number) => {
  if (calculator.calculationDone) ClearAll();
  calculator.displayValue += number;
  updateDisplayValue(number);
};

const handleDecimalInput = () => {
  if (calculator.calculationDone) ClearAll();
  if (displayValue.textContent.includes(".")) return;
  if (calculator.displayValue === "") {
    calculator.displayValue === 0;
    updateDisplayValue();
  }
  calculator.displayValue += ".";
  displayValue.textContent += ".";
};

const deleteLastInput = () => {
  if (calculator.displayValue.length > 0) {
    calculator.displayValue = calculator.displayValue.slice(0, -1);
    updateDisplayValue();
  }
};

const handleButton = (e) => {
  if (!e.target.matches("button") && !e.target.matches("img")) return;

  createRipple(e);

  if (e.target.classList.contains("number")) {
    handleNumberInput(e.target.textContent);
  }

  if (e.target.classList.contains("back")) {
    deleteLastInput();
  }

  if (e.target.classList.contains("equal")) {
    calculator.calculationDone = true;
    handleEqualInput();
  }

  if (game.started) return;

  if (e.target.classList.contains("decimal")) {
    handleDecimalInput();
  }

  if (e.target.classList.contains("operator")) {
    console.log(e.target.textContent);

    handleOperatorInput(e.target.textContent);
  }

  if (e.target.classList.contains("clear")) {
    ClearAll();
  }
};

const ClearAll = () => {
  displayOperation.innerHTML = `&nbsp;`;
  displayValue.textContent = 0;
  calculator.displayValue = 0;
  calculator.firstOperand = "";
  calculator.hasFirstPart = false;
  calculator.operator = "";
  calculator.secondOperand = "";
  calculator.calculationDone = false;
};

const updateDisplayValue = (target) => {
  displayValue.textContent = Number(calculator.displayValue).toLocaleString(
    "en-US"
  );
};

// Windows 10 Calculator Hover Effect
const detectScreenType = () => {
  if (navigator.maxTouchPoints === 0) {
    document.addEventListener("mousemove", (e) => {
      light.style.top = e.pageY - btnsContainer.offsetTop + "px";
      light.style.left = e.pageX - btnsContainer.offsetLeft + "px";
    });
  }
};

const createRipple = (e) => {
  const button = e.target;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${
    e.pageX - btnsContainer.offsetLeft - button.offsetLeft - radius
  }px`;
  circle.style.top = `${
    e.pageY - btnsContainer.offsetTop - button.offsetTop - radius
  }px`;

  circle.classList.add("ripple");
  const ripple = button.getElementsByClassName("ripple")[0];
  if (ripple) ripple.remove();
  button.appendChild(circle);
};

//Click Handler
btnsContainer.addEventListener("click", handleButton);

// Keypress Handler
window.addEventListener("keydown", function (e) {
  const button = {};
  button.target = document.querySelector(`button[data-key="${e.keyCode}"]`);
  handleButton(button);
});

// Voice Handler
let voiceOperation = [];
let previousVoiceOperation = [];

const msg = new SpeechSynthesisUtterance();
let voice = [];
voice = window.speechSynthesis.getVoices();
console.log(voice);

console.log(speechSynthesis);

// console.log(msg.voice);

// const voiceRecognition = (status) => {
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
// var recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "en-US";

console.log("anda?");

// let p = document.createElement('p');
// const words = document.querySelector('.words');
// words.appendChild(p);

recognition.addEventListener("result", (e) => {
  const transcript = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  // const poopScript = transcript.replace(/poop|poo|shit|dump/gi, '💩');
  // p.textContent = transcript;

  if (e.results[0].isFinal) {
    console.log("la");
    voiceOperation = transcript.match(regex);
    console.log(voiceOperation);

    if (voiceOperation.length !== 3) {
      console.log("y?");
      return;
    }
    calculator.hasFirstPart = true;
    calculator.firstOperand = parseFloat(voiceOperation[0]);
    calculator.operator = voiceOperation[1]?.trim().replace("*", "x");
    calculator.displayValue = voiceOperation[2];
    handleEqualInput();
    msg.text = calculator.displayValue;
    console.log(speechSynthesis);
    msg.lang = "en-US";

    speechSynthesis.speak(msg);
  }
});

const continueVoiceRecog = () => {
  recognition.start();
  console.log("voice recognition begins");
};

const init = () => {
  detectScreenType();
  let darkTheme = localStorage.getItem("dark-theme");
  if (darkTheme === "true") darkThemeBtn.checked = true;
  changeColorMode();
  if (localStorage.getItem("highscores") === null) {
    highScores.forEach(
      (player) => (player.score = Math.floor(Math.random() * 10))
    );
    localStorage.setItem("highscores", JSON.stringify(highScores));
  } else highScores = JSON.parse(localStorage.getItem("highscores"));
  sortHighScores();
  populateHighScoreTable();
};

init();
