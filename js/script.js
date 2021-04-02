let textColor = getComputedStyle(document.body).getPropertyValue(
  '--color-text'
);
let bgColor = getComputedStyle(document.body).getPropertyValue('--color-back');

window.addEventListener('keydown', function (e) {
  // e.preventDefault();
  if (e.keyCode === 68) {
    [textColor, bgColor] = [bgColor, textColor];
    document.documentElement.style.setProperty('--color-text', textColor);
    document.documentElement.style.setProperty('--color-back', bgColor);
  }
});
