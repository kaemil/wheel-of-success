import { PHRASES, CHARS } from './consts.js';

const checkedChars = [];
let choosenPhrase = '';
let lives = 6;

const heartsList = document.getElementsByClassName('board__score--heart');
const keyboardKeys = document.getElementsByClassName('board__key');
const placeContainer = document.querySelector('.board__phrase');
const buttonsList = document.querySelectorAll('.board__key');
const endGame = document.querySelector('.overlay__header');
const start = document.querySelector('.overlay__button');
const overlay = document.querySelector('.overlay');

const getPhrase = () => {
  const index = Math.floor(Math.random() * PHRASES.length);
  choosenPhrase = PHRASES[index];
};

const addGuessWord = () => {
  reset();
  getPhrase();

  for (let i = 0; i < choosenPhrase.length; i++) {
    const char = choosenPhrase.charAt(i);

    const li = document.createElement('div');
    placeContainer.appendChild(li);

    if (char === ' ') {
      li.setAttribute(
        'class',
        'board__letter board__letter--blank board__letter--show'
      );
    } else {
      li.setAttribute('class', 'board__letter');
    }
  }
};

const checkGuess = (guess) => {
  let foundMatch = false;

  const charsList = document.getElementsByClassName('board__letter');

  for (let i = 0; i < choosenPhrase.length; i++) {
    const char = choosenPhrase.charAt(i).toLocaleLowerCase();

    if (char === guess) {
      charsList[i].classList.add('board__letter--show');
      charsList[i].textContent = char.toLocaleUpperCase();

      foundMatch = true;
    }
  }

  return foundMatch;
};

const checkWin = () => {
  if (lives == 0) {
    overlay.classList.add('overlay--lose');
    overlay.style.display = 'flex';
    endGame.textContent = 'You lost! Try again.';
  }

  const charsList = document.getElementsByClassName('board__letter');

  const isGuessed = Array.from(charsList).every((item) =>
    item.classList.contains('board__letter--show')
  );

  if (isGuessed) {
    overlay.classList.add('overlay--win');
    overlay.style.display = 'flex';
    endGame.textContent = 'You won!';
  }
};

const reset = () => {
  lives = 6;

  overlay.classList = 'overlay';
  const charsList = document.getElementsByClassName('board__letter');

  Array.from(charsList).forEach((item) => item.remove());

  for (let i = 0; i < keyboardKeys.length; i++) {
    keyboardKeys[i].setAttribute('class', 'board__key');
    keyboardKeys[i].setAttribute('disabled', 'true');
    keyboardKeys[i].style.cursor = 'pointer';
    keyboardKeys[i].style.outline = '2px solid var($keyborder-hover)';
  }
};

start.addEventListener('click', () => {
  overlay.style.display = 'none';
  addGuessWord();

  for (let i = 0; i < heartsList.length; i++) {
    heartsList[i].className = 'fas fa-heart board__score--heart';
  }

  for (let i = 0; i < keyboardKeys.length; i++) {
    keyboardKeys[i].removeAttribute('disabled');
  }
});

const setChoosenButtonStyle = (element) => {
  element.classList.add('board__key--chosen');
  element.setAttribute('disabled', 'true');
  element.style.cursor = 'auto';
  element.style.outline = 'none';
};

const removeLife = () => {
  lives -= 1;
  heartsList[lives].className = 'far fa-heart board__score--heart';
};

document.addEventListener('keydown', (event) => {
  if (overlay.getAttribute('style') === 'display: none;') {
    const guess = event.key.toLowerCase();

    if (CHARS.indexOf(guess) === -1) return;

    for (let i = 0; i < keyboardKeys.length; i++) {
      if (keyboardKeys[i].textContent === guess) {
        setChoosenButtonStyle(keyboardKeys[i]);
      }
    }

    const isGuessed = checkGuess(guess);

    if (!isGuessed && !checkedChars.includes(guess)) {
      checkedChars.push(guess);
      removeLife();
    }

    checkWin();
  }
});

buttonsList.forEach((button) => {
  button.addEventListener('click', (event) => {
    setChoosenButtonStyle(event.target);
    const guess = button.textContent;

    const isGuessed = checkGuess(guess);

    if (!isGuessed) {
      removeLife();
    }

    checkWin();
  });
});
