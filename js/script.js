let textColor = getComputedStyle(document.body).getPropertyValue(
  '--color-text'
);
let bgColor = getComputedStyle(document.body).getPropertyValue('--color-back');

const btnsContainer = document.querySelector('.btns-container');
const displayOperation = document.querySelector('.display__operation');
const displayValue = document.querySelector('.display__value');

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
  document.documentElement.style.setProperty('--color-text', textColor);
  document.documentElement.style.setProperty('--color-back', bgColor);
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
const light = document.querySelector('.btns-container__light');
document.addEventListener('mousemove', (e) => {
  light.style.top = e.pageY - btnsContainer.offsetTop + 'px';
  light.style.left = e.pageX - btnsContainer.offsetLeft + 'px';
});
