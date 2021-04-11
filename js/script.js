let textColor = getComputedStyle(document.body).getPropertyValue(
  '--color-text'
);
let bgColor = getComputedStyle(document.body).getPropertyValue('--color-back');
let accentColorOne = getComputedStyle(document.body).getPropertyValue(
  '--color-accent-one'
);
let accentColorTwo = getComputedStyle(document.body).getPropertyValue(
  '--color-accent-two'
);

const regex = new RegExp('([.0-9]+)|([^0-9]+)', 'g');
const btnsContainer = document.querySelector('.btns-container');
const displayOperation = document.querySelector('.display__operation');
const displayValue = document.querySelector('.display__value');
const light = document.querySelector('.btns-container__light');
light.style.top = `-1000px`;
const radioBtns = document.querySelector('.checkbox');

const darkThemeBtn = document.querySelector('.dark');
console.log(darkThemeBtn);

// console.log(radioBtns);
const sidePanel = document.querySelector('.side-panel');
const historyDiv = document.querySelector('.side-panel__history-div');
const gameDiv = document.querySelector('.side-panel__game-div');
// const tabs = document.querySelectorAll('.side-panel__input');
console.log(sidePanel);
const startGameBtn = document.querySelector('.side-panel__btn');
const gameBar = document.querySelector('.side-panel__bar');

// const gameText = document.querySelector('.side-panel__game-text');
const gameText = document.querySelector('.guess');
const scoreText = document.querySelector('.score');
// const topFive = document.querySelector('.top-five');
let score = 0;

const tabs = document.querySelectorAll('.side-panel label');

// console.log(tabs[0]);
// tabs[0].style.display = 'none';

const highScoresContainer = document.querySelector('.side-panel__high-scores');
// let gameTimer = 60;
let gameStarted = false;

let sumUpperLimit = 100;
let timesUpperLimit = 10;

let highScores = [
  {
    name: 'Tino',
  },
  {
    name: 'Juan',
  },
  {
    name: 'Andrea',
  },
  {
    name: 'Marmolina',
  },
  {
    name: 'Vito',
  },
  {
    name: 'Pepe',
  },
];
highScores.forEach((player) => (player.score = Math.floor(Math.random() * 10)));

///////////////////////////////////////////
// Change CSS display property
const showElements = (...elements) => {
  elements.forEach((el) => {
    el.style.display = 'initial';
  });
};
const hideElements = (...elements) => {
  elements.forEach((el) => {
    el.style.display = 'none';
  });
};

// HIGH SCORES

if (localStorage.getItem('highscores') === null) {
  localStorage.setItem('highscores', JSON.stringify(highScores));
}

highScores = JSON.parse(localStorage.getItem('highscores'));

const sortHighScores = () => {
  highScores = highScores.sort((a, b) => (a.score > b.score ? -1 : 1));
  highScores.length = 5;
};
sortHighScores();

const checkNewScoreIsHighScore = () => {
  if (score <= highScores[4].score) return;
  const newHighScore = {};
  newHighScore.name = prompt('New High Score! Enter your name', 'Doomguy');
  newHighScore.score = score;
  console.log(newHighScore);

  highScores.push(newHighScore);
  console.log(highScores);
  sortHighScores();
  populateHighScores();
  localStorage.setItem('highscores', JSON.stringify(highScores));
};

const populateHighScores = () => {
  highScoresContainer.innerHTML = ``;
  const topText = ['T', 'o', 'p', '&nbsp;', '5'];
  highScores.forEach((highScore, i) => {
    const topScoreDiv = document.createElement('div');
    topScoreDiv.classList.add('side-panel__top-score');
    topScoreDiv.innerHTML = `
      <p class="side-panel__game-text top-five">${topText[i]}</p>
      <p class="side-panel__player-name">${highScore.name}</p>
      <p class="side-panel__player-score">${highScore.score}</p>
    `;
    highScoresContainer.appendChild(topScoreDiv);
  });
  // gameBar.style.visibility = 'hidden';
  localStorage.setItem('highscores', JSON.stringify(highScores));
};
populateHighScores();

// LocalStorage

const getRandomOperation = () => {
  const operators = ['+', '-', 'x', '/'];
  const operator = Math.floor(Math.random() * operators.length);
  console.log(operator);
  let upperLimit = 0;
  if (operator > 1) upperLimit = timesUpperLimit;
  else upperLimit = sumUpperLimit;
  calculator.firstOperand = Math.ceil(Math.random() * upperLimit);
  calculator.secondOperand = Math.ceil(Math.random() * upperLimit);
  if (operator === 1 && calculator.firstOperand < calculator.secondOperand) {
    [calculator.firstOperand, calculator.secondOperand] = [
      calculator.secondOperand,
      calculator.firstOperand,
    ];
  }
  calculator.operator = operators[operator];
  console.log(calculator);
  calculator.gameResult = handleOperation();
  console.log(calculator);
  gameText.textContent = `${calculator.firstOperand} ${calculator.operator} ${calculator.secondOperand} = ?`;
};
// gameBar.style.width = `${100}%`;
// gameBar.style.width = `${5 * 5}%`;
let cssProperties = getComputedStyle(document.documentElement);
let gameTimer = cssProperties.getPropertyValue('--timer');
document.documentElement.style.setProperty('--timer', gameTimer);
const startGame = () => {
  gameStarted = true;
  // scoreText.style.visibility = "visible";
  scoreText.style.display = 'initial';
  // hideElements(topFive, highScoresContainer, startGameBtn, ...tabs);
  hideElements(highScoresContainer, startGameBtn, ...tabs);

  ClearAll();
  getRandomOperation();

  sumUpperLimit += 20;
  timesUpperLimit += 2;

  // startGameBtn.style.visibility = 'hidden';

  // document.querySelector('.mas').addEventListener('click', function (e) {
  //   gameTimer++;
  //   console.log('y????');

  //   document.documentElement.style.setProperty('--timer', gameTimer);
  // });
  // gameBar.style.width = `${gameTimer * 5}%`;

  showElements(gameBar);
  // gameBar.style.visibility = 'visible';

  // We need a timeout because you can't animate elements inmediately after displaying them
  setTimeout(() => {
    gameTimer -= 1;
    gameBar.style.width = `${gameTimer * 5}%`;
  }, 20);
  // console.log('ja');

  const interval = setInterval(() => {
    gameTimer -= 1;
    gameBar.style.width = `${gameTimer * 5}%`;
    // gameBar.style.width = `${5 * gameTimer}%`;
    // console.log('je');
    // console.log(gameTimer);

    if (gameTimer <= -1) {
      checkNewScoreIsHighScore();
      ClearAll();
      // showElements(topFive, highScoresContainer, startGameBtn);
      showElements(highScoresContainer, startGameBtn);
      tabs.forEach((tab) => (tab.style.display = `flex`));
      hideElements(scoreText, gameBar);
      // startGameBtn.style.visibility = 'visible';
      // scoreText.style.visibility = 'hidden';
      // scoreText.style.display = 'none';
      // console.log('noooo!');
      // gameOver();
      gameTimer = 20;
      gameStarted = false;
      sumUpperLimit = 100;
      timesUpperLimit = 20;
      gameText.textContent = `Final Score: ${score}`;
      score = 0;
      scoreText.textContent = `Score: 0`;
      gameBar.style.width = `100%`;
      // gameBar.style.visibility = 'hidden';
      // hideElements(gameBar);
      // gameBar.style.animation = ``;
      clearInterval(interval);
    }
  }, 1000);
};

startGameBtn.addEventListener('click', () => {
  startGame();
});

// Tabs
sidePanel.addEventListener('click', function (e) {
  console.log(e.target);
  console.log(e.target.id);
  if (e.target.id === 'history-tab') {
    console.log('history');
    historyDiv.classList.add('visible');
    gameDiv.classList.remove('visible');
  } else {
    console.log('game');
    gameDiv.classList.add('visible');
    historyDiv.classList.remove('visible');
  }
});

// const handleRadionBtns = () => {

radioBtns.addEventListener('change', function (e) {
  console.log(e.target);
  // if (
  //   !e.target.classList.contains('dark') ||
  //   !e.target.classList.contains('voice')
  // )
  //   return;
  if (e.target.classList.contains('dark')) {
    changeColorMode();
    return;
  }
  if (e.target.classList.contains('voice') && e.target.checked) {
    // if (e.target.checked) {
    recognition.addEventListener('end', continueVoiceRecog);
    recognition.start();
    console.log('y?');
  } else {
    recognition.stop();
    recognition.removeEventListener('end', continueVoiceRecog);
    // }
  }
  // } else {
  //   recognition.stop();
  // }

  // if (e.target.checked) changeColorMode();
});

// radioBtns.forEach((radioBtn) =>
//   radioBtn.addEventListener('change', function (e) {
//     changeColorMode();
//     // if (e.target.checked) changeColorMode();
//   })
// );

// if (radioBtns[0].checked) console.log('hi');
// };

const calculator = {
  displayValue: 0,
  firstOperand: '',
  hasFirstPart: false,
  operator: '',
  secondOperand: '',
  calculationDone: false,
  gameResult: 0,
};

const changeColorMode = () => {
  console.log(darkThemeBtn.checked);
  localStorage.setItem('dark-theme', darkThemeBtn.checked);
  if (darkThemeBtn.checked) {
    document.documentElement.style.setProperty('--color-text', bgColor);
    document.documentElement.style.setProperty('--color-back', textColor);
    document.documentElement.style.setProperty(
      '--color-accent-one',
      accentColorTwo
    );
  } else {
    document.documentElement.style.setProperty('--color-text', textColor);
    document.documentElement.style.setProperty('--color-back', bgColor);
    document.documentElement.style.setProperty(
      '--color-accent-one',
      accentColorOne
    );
  }

  // [textColor, bgColor] = [bgColor, textColor];
  // [accentColorOne, accentColorTwo] = [accentColorTwo, accentColorOne];

  // console.log(`a${bgColor.trim()}a`);

  // light.style.background =
  //   'radial-gradient( ellipse at center, rgba( ' +
  //   textColor.trim() +
  //   ', 0.5) 0%, rgba( ' +
  //   textColor.trim() +
  //   ', 0) 50%)';
  // console.log(
  //   window.getComputedStyle(light, null).getPropertyValue('background')
  // );

  // light.style.background = `red`;
};

handleOperation = () => {
  switch (calculator.operator) {
    case '+':
      return calculator.firstOperand + calculator.secondOperand;
    case '-':
      return calculator.firstOperand - calculator.secondOperand;
    case 'x':
      return calculator.firstOperand * calculator.secondOperand;
    case '/':
      if (gameStarted) {
        console.log('divid');

        let temp = calculator.firstOperand * calculator.secondOperand;
        let result = calculator.secondOperand;
        calculator.secondOperand = calculator.firstOperand;
        calculator.firstOperand = temp;
        return result;
      }
      return calculator.firstOperand / calculator.secondOperand;
    case '^':
      return calculator.firstOperand ** calculator.secondOperand;
    case '√':
      return Math.pow(calculator.firstOperand, 1 / calculator.secondOperand);
  }
};

const updateHistory = (operation) => {
  let resultTag = document.createElement('p');
  resultTag.textContent = operation;
  resultTag.classList.add('side-panel__history-text');
  historyDiv.removeChild(historyDiv.firstElementChild);
  historyDiv.appendChild(resultTag);
  console.log(historyDiv.childElementCount);
};

const handleEqualInput = () => {
  console.log(calculator);

  if (gameStarted) {
    console.log(Number(calculator.displayValue), calculator.gameResult);
    if (Number(calculator.displayValue) === calculator.gameResult) {
      gameTimer += 5;
      score++;
      scoreText.textContent = `Score: ${score}`;
    } else gameTimer -= 5;
    if (gameTimer > 20) gameTimer = 20;
    getRandomOperation();
    // if (calculator.displayValue)
  }

  if (!calculator.hasFirstPart) return;

  calculator.secondOperand = parseFloat(calculator.displayValue);
  if (!calculator.secondOperand) return;

  calculator.displayValue = handleOperation();
  const operandOne = Number(calculator.firstOperand).toLocaleString('en-US');
  const OperandTwo = Number(calculator.secondOperand).toLocaleString('en-US');
  const result = Number(calculator.displayValue).toLocaleString('en-US');

  displayOperation.textContent = `${operandOne} ${calculator.operator} ${OperandTwo} = ${result}`;
  updateHistory(displayOperation.textContent);
  updateDisplayValue();
  calculator.hasFirstPart = false;
  calculator.secondOperand = '';
  calculator.operator = '';
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
  const operandOne = Number(calculator.firstOperand).toLocaleString('en-US');
  displayOperation.textContent = `${operandOne} ${calculator.operator}`;
  calculator.displayValue = '';
};

const handleNumberInput = (number) => {
  if (calculator.calculationDone) ClearAll();
  calculator.displayValue += number;
  updateDisplayValue(number);
};

const handleDecimalInput = () => {
  if (calculator.calculationDone) ClearAll();
  if (displayValue.textContent.includes('.')) return;
  if (calculator.displayValue === '') {
    calculator.displayValue === 0;
    updateDisplayValue();
  }
  calculator.displayValue += '.';
  displayValue.textContent += '.';
};

const deleteLastInput = () => {
  if (calculator.displayValue.length > 0) {
    calculator.displayValue = calculator.displayValue.slice(0, -1);
    updateDisplayValue();
  }
};

const handleButton = (e) => {
  if (!e.target.matches('button') && !e.target.matches('img')) return;

  createRipple(e);

  if (e.target.classList.contains('number')) {
    handleNumberInput(e.target.textContent);
  }

  // if (e.target.classList.contains('dark-mode')) {
  //   changeColorMode();
  // }
  if (e.target.classList.contains('back')) {
    deleteLastInput();
  }

  if (e.target.classList.contains('equal')) {
    calculator.calculationDone = true;
    handleEqualInput();
  }

  if (gameStarted) return;

  if (e.target.classList.contains('decimal')) {
    handleDecimalInput();
  }

  if (e.target.classList.contains('operator')) {
    console.log(e.target.textContent);

    handleOperatorInput(e.target.textContent);
  }

  if (e.target.classList.contains('clear')) {
    ClearAll();
  }
};

// btnsContainer.addEventListener('click', function (e) {
//   handleButton(e);
// });
// btnsContainer.addEventListener('click', function (e) {
// if (!e.target.matches('button') && !e.target.matches('img')) return;

// createRipple(e);

// if (e.target.classList.contains('number')) {
//   handleNumberInput(e.target.textContent);
// }

// if (e.target.classList.contains('dark-mode')) {
//   changeColorMode();
// }

// if (e.target.classList.contains('equal')) {
//   calculator.calculationDone = true;
//   handleEqualInput();
// }

// if (e.target.classList.contains('decimal')) {
//   handleDecimalInput();
// }

// if (e.target.classList.contains('operator')) {
//   handleOperatorInput(e.target.textContent);
// }

// if (e.target.classList.contains('clear')) {
//   ClearAll();
// }

// if (e.target.classList.contains('back')) {
//   deleteLastInput();
// }
// });

const ClearAll = () => {
  displayOperation.innerHTML = `&nbsp;`;
  displayValue.textContent = 0;
  calculator.displayValue = 0;
  calculator.firstOperand = '';
  calculator.hasFirstPart = false;
  calculator.operator = '';
  calculator.secondOperand = '';
  calculator.calculationDone = false;
};

const updateDisplayValue = (target) => {
  displayValue.textContent = Number(calculator.displayValue).toLocaleString(
    'en-US'
  );
};

// Windows 10 Calculator Hover Effect
const detectScreenType = () => {
  if (navigator.maxTouchPoints === 0) {
    document.addEventListener('mousemove', (e) => {
      light.style.top = e.pageY - btnsContainer.offsetTop + 'px';
      light.style.left = e.pageX - btnsContainer.offsetLeft + 'px';
    });
  }
};
detectScreenType();

function createRipple(event) {
  const button = event.target;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${
    event.pageX - btnsContainer.offsetLeft - button.offsetLeft - radius
  }px`;
  circle.style.top = `${
    event.pageY - btnsContainer.offsetTop - button.offsetTop - radius
  }px`;

  circle.classList.add('ripple');
  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) ripple.remove();
  button.appendChild(circle);
}

//Click Handler
btnsContainer.addEventListener('click', handleButton);

// Keypress Handler
window.addEventListener('keydown', function (e) {
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
recognition.interimResults = true;
recognition.lang = 'en-US';

console.log('anda?');

// let p = document.createElement('p');
// const words = document.querySelector('.words');
// words.appendChild(p);

recognition.addEventListener('result', (e) => {
  const transcript = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join('');

  // const poopScript = transcript.replace(/poop|poo|shit|dump/gi, '💩');
  // p.textContent = transcript;

  if (e.results[0].isFinal) {
    console.log('la');
    voiceOperation = transcript.match(regex);
    console.log(voiceOperation);

    if (voiceOperation.length !== 3) {
      console.log('y?');
      return;
    }
    calculator.hasFirstPart = true;
    calculator.firstOperand = parseFloat(voiceOperation[0]);
    calculator.operator = voiceOperation[1]?.trim().replace('*', 'x');
    calculator.displayValue = voiceOperation[2];
    handleEqualInput();
    msg.text = calculator.displayValue;
    console.log(speechSynthesis);
    msg.lang = 'en-US';

    speechSynthesis.speak(msg);
  }

  // p = document.createElement('p');
  // words.appendChild(p);

  // console.log(transcript);

  // console.log(pepee);

  //   secondOperand: '',
  //   calculationDone: false,
  // };
});

// if (status) {

const continueVoiceRecog = () => {
  recognition.start();
  console.log('voice recognition begins');
};

// console.log(voiceOperation);
// calculator.hasFirstPart = true;
// calculator.firstOperand = parseFloat(voiceOperation[0]);
// calculator.operator = voiceOperation[1]?.trim().replace('*', 'x');
// calculator.displayValue = voiceOperation[2];

// handleEqualInput();
// console.log("sigue?");

// recognition.start();
// recognition.addEventListener('end', function (e) {
//   recognition.start();
// });
// } else recognition.stop();
// };

// voiceRecognition();
const init = () => {
  let darkTheme = localStorage.getItem('dark-theme');
  if (darkTheme === 'true') darkThemeBtn.checked = true;
  changeColorMode();
};
init();
