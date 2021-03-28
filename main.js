//-------------------// Variables //-------------------//
let phrases = ['ABOVE AND BEYOND', 'FISH FOOD', 'EARLY IN THE MORNING', 'YOU CAN TRUST ME', 'COME BACK SOON', 'GOOD NIGHT', 'HAVE FUN', 'FLEX YOUR BICEP', 'GUESS ME', 'ENJOY YOUR STAY'];
let placeWord = document.querySelector('.board__phrase')
let keyPress = document.querySelectorAll('.board__key')
let allKeys = document.getElementsByClassName('board__key');
let buttons = document.querySelectorAll('.board__key--chosen')
let lives = 6;
let checkLetter = [];
let endGame = document.querySelector('.overlay__header')
let overlay = document.querySelector('.overlay')
let start = document.querySelector('.overlay__button')
let heart = document.getElementsByClassName('board__score--heart')

//-------------------// Functions //-------------------//

// Random phrases generated from list //
function randomWord() {
    let guessWord = Math.floor(Math.random() * phrases.length);
    return guessWord;
}

// Insert generated phrase into prepared place, if phrase is multi words insert empty space beetween //
function addGuessWord() {
    let word = phrases[randomWord()]
    for (i = 0; i < word.length; i++) {
        let li = document.createElement('div')
        placeWord.appendChild(li);
        li.setAttribute('class', 'board__letter');
        li.textContent = word[i].toUpperCase();
    }
    let liList = document.getElementsByClassName('board__letter');
    for (i = 0; i < liList.length; i++) {
        correctLetter = liList[i].textContent
        if (correctLetter.toLowerCase() === ' ') {
            liList[i].classList.add('board__letter--show');
            liList[i].classList.add('board__letter--blank')
        }
    }
    overlay.classList.remove('overlay--lose')
    overlay.classList.remove('overlay--win')
}

// Checks if clicked or pressed key is letter in phrase, if so, shows it //
function checkGuess(guess) {
    let correctLetter = null
    let liList = document.getElementsByClassName('board__letter');
    for (i = 0; i < liList.length; i++) {
        if (liList[i].innerHTML.toLowerCase() === guess) {
            liList[i].classList.add('board__letter--show')
            correctLetter = liList[i].innerHTML;
        }
    }
    if (correctLetter != null) {
        return correctLetter;
    }
    return;
}

// Checks if all letter are guessed => checks win condition. Checks if all lives are usec => lose condition //
function checkWin() {
    if (lives == 0) {
        overlay.classList.add('overlay--lose');
        overlay.style.display = 'flex'
        endGame.textContent = 'You lost! Try again.'
        reset()
        return
    }
    let liList = document.getElementsByClassName('board__letter')
    for (i = 0; i < liList.length; i++) {
        if (liList[i].classList.contains('board__letter--show') === false) {
            return
        }
    }
    overlay.classList.add('overlay--win');
    overlay.style.display = 'flex'
    endGame.textContent = 'You won!'

    reset();
}

// Resets keys look, lives   //
function reset() {

    lives = 6;
    checkLetter = [];
    while (placeWord.firstChild) {
        placeWord.removeChild(placeWord.firstChild)
    }
    for (i = 0; i < allKeys.length; i++) {
        allKeys[i].setAttribute('class', 'board__key');
        allKeys[i].setAttribute('disabled', 'true')
    }
    for (i = 0; i < allKeys.length; i++) {
        if (allKeys[i].textContent === guess) {
            allKeys[i].classList.remove('board__key--chosen');
        }
    }

}

//-------------------// Event handlers //-------------------//

// Hiding startgame layout, calls addGuessWord(), lives reset //
start.addEventListener('click', function () {
    overlay.style.display = 'none';
    addGuessWord();
    for (i = 0; i < heart.length; i++) {
        heart[i].className = 'fas fa-heart board__score--heart'
    }
    for (i = 0; i < allKeys.length; i++) {
        allKeys[i].removeAttribute('disabled')
    }
});

// Takes user keyboard pressed letter, disable it, removes one life if wrong, checks if keyboard was pressed more times, calls checkWin() //
document.addEventListener('keydown', function (e) {
    if (overlay.getAttribute('style') === 'display: none;') {
        let guess = e.key.toLowerCase();
        const charList = 'abcdefghijklmnopqrstuvwxyz';

        if (charList.indexOf(guess) === -1) return;

        for (i = 0; i < allKeys.length; i++) {
            if (allKeys[i].textContent === guess) {
                allKeys[i].setAttribute('disabled', 'true');
                allKeys[i].classList.add('board__key--chosen');
            }
        }
        var foundLetter = checkGuess(guess)

        if (checkLetter.includes(guess) === false) {
            checkLetter.push(guess);
            if (foundLetter == null) {
                lives -= 1;
                heart[lives].className = 'far fa-heart board__score--heart'
            }
        }
        checkWin()
    }
})

// Takes user mouse clicked letter, disable it, removes one life if wrong, calls checkWin() //
keyPress.forEach(function (keyPress) {
    keyPress.addEventListener("click", function (e) {
        e.target.classList.add('board__key--chosen');
        e.target.setAttribute('disabled', 'true');
        let guess = keyPress.textContent
        var foundLetter = checkGuess(guess)
        if (foundLetter == null) {
            lives -= 1
            heart[lives].className = 'far fa-heart board__score--heart'
        }
        checkWin()
    })
})