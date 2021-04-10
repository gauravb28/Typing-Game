const settings = document.querySelector('#settings');
const navbar = document.querySelector('#navbar');
const uiTime = document.querySelector('.time');
const uiScore = document.querySelector('.score');
const selectList = document.querySelector('select');
const input = document.querySelector('input');
const startBtn = document.querySelector('#start');
const uiWord = document.querySelector('.word');
const card = document.querySelector('.card');

let timeInterval;
let timeLeft;
let totalScore = 0;
let randomWord = '';

const words = [
  'sigh',
  'tense',
  'airplane',
  'ball',
  'pies',
  'juice',
  'warlike',
  'bad',
  'north',
  'dependent',
  'steer',
  'silver',
  'highfalutin',
  'superficial',
  'quince',
  'eight',
  'feeble',
  'admit',
  'drag',
  'loving'
];

function showWord() {
  input.value = '';

  randomWord = getRandomWord();
  setInitialTime();

  populateUI(randomWord, totalScore, timeLeft);

  timeInterval = setInterval(timeReduce, 1000);
}

// Reduce time left
function timeReduce() {
  timeLeft--;
  if(timeLeft > 0) {
    populateUI(randomWord, totalScore, timeLeft);
  } else {
    clearInterval(timeInterval);
    changeState();
  }
}

// Update Difficulty
function updateDifficulty() {
  setInitialTime();
  totalScore = 0;
  randomWord = '';
  
  populateUI(randomWord, totalScore, timeLeft);
}

// Change State
function changeState() {
  card.innerHTML = `
    <h3>TIME RAN OUT</h3>
    <p class="display-score">Your final score is ${totalScore}</p>
    <button class="btn play-again">Play Again</button>
  `;
}

// Replay game
function replayGame(e) {
  if(e.target.classList.contains('play-again')) {
    window.location.reload();
  }
}

// Get new word
function newWord() {
  const inputWord = input.value;

  if(inputWord === randomWord && inputWord !== '') {
    totalScore++;
    updateTime();
    randomWord = getRandomWord();
    input.value = '';
    populateUI(randomWord, totalScore, timeLeft);
  }
}

// Calculate initial time
function setInitialTime() {
  if(selectList.value === 'easy') {
    timeLeft = 15;
  } else if(selectList.value === 'medium') {
    timeLeft = 12;
  } else {
    timeLeft = 8;
  }
}

// Update time
function updateTime() {
  if(selectList.value === 'easy') {
    timeLeft += 3;
  } else if(selectList.value === 'medium') {
    timeLeft += 2;
  } else {
    timeLeft += 1;
  }
}

// Get Random Word
function getRandomWord() {
  const word = words[Math.floor(words.length * Math.random())];
  return word;
}

// Populate UI
function populateUI(word, score, time) {
  uiWord.innerText = word;
  uiTime.innerText = time;
  uiScore.innerText = score;
}


// App
setInitialTime();
populateUI(randomWord, totalScore, timeLeft);


// Event Listeners
settings.addEventListener('click', () => navbar.classList.toggle('show'));

startBtn.addEventListener('click', showWord);

selectList.addEventListener('change', updateDifficulty);

input.addEventListener('input', newWord);

card.addEventListener('click', replayGame);