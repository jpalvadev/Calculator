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

const btnsContainer = document.querySelector('.btns-container');
const displayOperation = document.querySelector('.display__operation');
const displayValue = document.querySelector('.display__value');
const light = document.querySelector('.btns-container__light');
light.style.top = `-1000px`;

const calculator = {
  displayValue: 0,
  firstOperand: '',
  hasFirstPart: false,
  operator: '',
  secondOperand: '',
  calculationDone: false,
};

const changeColorMode = () => {
  [textColor, bgColor] = [bgColor, textColor];
  // console.log(accentColorOne);
  [accentColorOne, accentColorTwo] = [accentColorTwo, accentColorOne];
  // console.log(accentColorOne);

  document.documentElement.style.setProperty('--color-text', textColor);
  document.documentElement.style.setProperty('--color-back', bgColor);
  document.documentElement.style.setProperty(
    '--color-accent-one',
    accentColorOne
  );
  console.log(`a${bgColor.trim()}a`);

  light.style.background =
    'radial-gradient( ellipse at center, rgba( ' +
    textColor.trim() +
    ', 0.5) 0%, rgba( ' +
    textColor.trim() +
    ', 0) 50%)';
  console.log(
    window.getComputedStyle(light, null).getPropertyValue('background')
  );

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
      return calculator.firstOperand / calculator.secondOperand;
    case '^':
      return calculator.firstOperand ** calculator.secondOperand;
    case '√':
      return Math.pow(calculator.firstOperand, 1 / calculator.secondOperand);
  }
};

const handleEqualInput = () => {
  if (!calculator.hasFirstPart) return;

  calculator.secondOperand = parseFloat(calculator.displayValue);
  if (!calculator.secondOperand) return;

  calculator.displayValue = handleOperation();
  const operandOne = Number(calculator.firstOperand).toLocaleString('en-US');
  const OperandTwo = Number(calculator.secondOperand).toLocaleString('en-US');
  const result = Number(calculator.displayValue).toLocaleString('en-US');

  displayOperation.textContent = `${operandOne} ${calculator.operator} ${OperandTwo} = ${result}`;

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

//Click Handler
btnsContainer.addEventListener('click', function (e) {
  if (!e.target.matches('button') && !e.target.matches('img')) return;

  createRipple(e);

  if (e.target.classList.contains('number')) {
    handleNumberInput(e.target.textContent);
  }

  if (e.target.classList.contains('dark-mode')) {
    changeColorMode();
  }

  if (e.target.classList.contains('equal')) {
    calculator.calculationDone = true;
    handleEqualInput();
  }

  if (e.target.classList.contains('decimal')) {
    handleDecimalInput();
  }

  if (e.target.classList.contains('operator')) {
    handleOperatorInput(e.target.textContent);
  }

  if (e.target.classList.contains('clear')) {
    ClearAll();
  }

  if (e.target.classList.contains('back')) {
    deleteLastInput();
  }
});

// Keypress Handler
window.addEventListener('keydown', function (e) {
  // e.preventDefault();
  if (e.keyCode === 68) {
    changeColorMode();
  }
});

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

// Copied - modify it
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
