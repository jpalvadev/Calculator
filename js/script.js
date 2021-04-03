// Math.pow(n, 1/root);

const regex = new RegExp('([0-9]+)|([^0-9]+)', 'g');
const isOperatorRegex = new RegExp('[^0-9]');
const isNumberRegex = new RegExp('[0-9]');

// let pep = 'djkdhs+';
// console.log(pep[pep.length - 1]);
// let la = 1;
// console.log(la);
// console.log(isOperatorRegex.test(la));

let textColor = getComputedStyle(document.body).getPropertyValue(
  '--color-text'
);
let bgColor = getComputedStyle(document.body).getPropertyValue('--color-back');

const btnsContainer = document.querySelector('.btns-container');
const displayHistory = document.querySelector('.display__history');
const displayValue = document.querySelector('.display__value');

const calculator = {
  value: '',
  history: '',
  array: [],
  firstOperand: '',
  hasFirstOperand: false,
  operator: '',
  hasOperator: false,
  secondOperand: '',
  hasSecondOperand: false,
};

const changeColorMode = () => {
  [textColor, bgColor] = [bgColor, textColor];
  document.documentElement.style.setProperty('--color-text', textColor);
  document.documentElement.style.setProperty('--color-back', bgColor);
};

const changeStringToArray = () => {
  calculator.array = calculator.value.match(regex);
};

const checkLastInputIsNumber = () => {
  const lastInput = calculator.value[calculator.value.length - 1];
  return isNumberRegex.test(lastInput);
};

const checkValidDecimals = () => {
  // if (!checkLastInputIsNumber) return;
  changeStringToArray();
  console.log(calculator.array[-1].includes('.'));

  return calculator.array[-1].includes('.');
};

// const checkLastInputIsOperator = () => {
//   const lastInput = calculator.value[calculator.value.length - 1];
//   if (isOperatorRegex.test(lastInput)) {
//     calculator.value = calculator.value.substring(
//       0,
//       calculator.value.length - 1
//     );
//   }
//   updateDisplayValue();
// };

const checkLastInputIsOperator = () => {
  const lastInput = calculator.value[calculator.value.length - 1];
  return isOperatorRegex.test(lastInput);
};

const handleDecimalInput = () => {
  if (checkLastInputIsOperator) {
    console.log('ok');
  }
  return;
};

//Click Handler
btnsContainer.addEventListener('click', function (e) {
  if (!e.target.matches('button') && !e.target.matches('img')) return;
  // if (!e.target.classList.contains('btns-container__btn')) return;

  // console.log(e.target);

  if (e.target.classList.contains('operator')) {
    // console.log('operator', e.target.textContent);
    checkLastInputIsOperator();
  }

  if (e.target.classList.contains('number')) {
    // console.log('number', e.target.textContent);
    // calculator.value += e.target.textContent;
    // updateDisplayValue();
  }

  if (e.target.classList.contains('dark-mode')) {
    // console.log('color mode', e.target.textContent);
    changeColorMode();
  }

  if (e.target.classList.contains('equal')) {
    checkLastInputIsOperator();
    changeStringToArray();
    console.log(calculator.array);
    return;
  }

  if (e.target.classList.contains('decimal')) {
    console.log('punto');
    handleDecimalInput();

    checkLastInputIsNumber();
    changeStringToArray();
    console.log(calculator.array);
    return;
  }
  calculator.value += e.target.textContent;
  updateDisplayValue();
  // console.log('boton');
});

// Keypress Handler
window.addEventListener('keydown', function (e) {
  // e.preventDefault();
  if (e.keyCode === 68) {
    changeColorMode();
  }
});

const updateDisplayValue = () => {
  displayValue.textContent = calculator.value;
  // console.log(displayValue.textContent);
};

// const init = () => {
//   updateDisplayValue();
// };

// init();
