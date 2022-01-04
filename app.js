const settingsToggle = document.querySelector('.settings-toggle');
const navbar = document.querySelector('#navbar');
const uiTime = document.querySelector('.time');
const uiScore = document.querySelector('.score');
const selectList = document.querySelector('select');
const input = document.querySelector('input');
const startBtn = document.querySelector('#start');
const uiWord = document.querySelector('.word');
const card = document.querySelector('.card');
const rulesBtn = document.querySelector('#rules-btn');
const leaderboardBtn = document.querySelector('#leaderboard-btn');
const rulesContainer = document.querySelector('.container');
const leaderboardContainer = document.querySelector('.container-2');
const closeBtn = document.querySelector('.close');
const closeBtn2 = document.querySelector('.close-2');
const scoresEl = document.querySelector('.scores');

let timeInterval;
let timeLeft = 10;
let totalScore = 0;
let randomWord = '';

let words = [];

async function getWords() {
  let numFetch = 3000;
  if (selectList.value === 'medium') {
    numFetch = 2000;
  } else if (selectList.value === 'easy') {
    numFetch = 1000;
  }

  const res = await fetch(
    `https://random-word-api.herokuapp.com/word?number=${numFetch}`
  );
  const data = await res.json();
  words = data;
}

function startGame(e) {
  if (e.target.textContent === 'Start Game') {
    timeLeft = 10;

    startBtn.textContent = 'Restart Game';
    startBtn.style.backgroundColor = '#d9534f';

    input.value = '';

    randomWord = getRandomWord();

    populateUI(randomWord, totalScore, timeLeft);

    timeInterval = setInterval(timeReduce, 1000);
  } else {
    window.location.reload();
  }
}

// Reduce time left
function timeReduce() {
  timeLeft--;
  if (timeLeft > 0) {
    populateUI(randomWord, totalScore, timeLeft);
  } else {
    clearInterval(timeInterval);
    changeState();
    updateLeaderboard();
  }
}

// Update Difficulty
function updateDifficulty() {
  getWords();
  timeLeft = 10;
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
  if (e.target.classList.contains('play-again')) {
    window.location.reload();
  }
}

// Get new word
function newWord() {
  const inputWord = input.value;

  if (inputWord === randomWord && inputWord !== '') {
    totalScore++;
    updateTime();
    randomWord = getRandomWord();
    input.value = '';
    populateUI(randomWord, totalScore, timeLeft);
  }
}

// Update time
function updateTime() {
  if (selectList.value === 'easy') {
    timeLeft += 3;
  } else if (selectList.value === 'medium') {
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

// Get high scores from Local Storage
function getLeaderboard() {
  let highScores = [
    {
      easy: [0, null],
    },
    {
      medium: [0, null],
    },
    {
      hard: [0, null],
    },
  ];
  if (localStorage.getItem('scores') !== null) {
    highScores = JSON.parse(localStorage.getItem('scores'));
  }
  return highScores;
}

// Update high scores in local storage
function updateLeaderboard() {
  const currScores = getLeaderboard();

  if (selectList.value === 'easy' && totalScore > currScores[0].easy[0]) {
    currScores[0].easy[0] = totalScore;
    currScores[0].easy[1] = moment().format('MMM Do YY');
  } else if (
    selectList.value === 'medium' &&
    totalScore > currScores[1].medium[0]
  ) {
    currScores[1].medium[0] = totalScore;
    currScores[1].medium[1] = moment().format('MMM Do YY');
  } else if (
    selectList.value === 'hard' &&
    totalScore > currScores[2].hard[0]
  ) {
    currScores[2].hard[0] = totalScore;
    currScores[2].hard[1] = moment().format('MMM Do YY');
  }

  localStorage.setItem('scores', JSON.stringify(currScores));
}

// Populate Leaderboard
function populateLeaderboard() {
  const highScores = getLeaderboard();
  scoresEl.innerHTML = `
    <div class="score-entry score-head">Difficulty</div>
    <div class="score-entry score-head">Score</div>
    <div class="score-entry score-head">Date</div>
    <div class="score-entry">Easy</div>
    <div class="score-entry">${highScores[0].easy[0]}</div>
    <div class="score-entry">${highScores[0].easy[1] || 'Never Played'}</div>
    <div class="score-entry">Medium</div>
    <div class="score-entry">${highScores[1].medium[0]}</div>
    <div class="score-entry">${highScores[1].medium[1] || 'Never Played'}</div>
    <div class="score-entry">Hard</div>
    <div class="score-entry">${highScores[2].hard[0]}</div>
    <div class="score-entry">${highScores[2].hard[1] || 'Never Played'}</div>
  `;
}

// Populate UI
function populateUI(word, score, time) {
  uiWord.innerText = word;
  uiTime.innerText = time;
  uiScore.innerText = score;
}

// App
getWords();
populateUI(randomWord, totalScore, timeLeft);

// Event Listeners
settingsToggle.addEventListener('click', () => {
  navbar.classList.toggle('show');
  settingsToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
});

rulesBtn.addEventListener('click', () => rulesContainer.classList.add('show'));

leaderboardBtn.addEventListener('click', () => {
  populateLeaderboard();
  leaderboardContainer.classList.add('show');
});

closeBtn.addEventListener('click', () =>
  rulesContainer.classList.remove('show')
);

closeBtn2.addEventListener('click', () =>
  leaderboardContainer.classList.remove('show')
);

startBtn.addEventListener('click', startGame);

selectList.addEventListener('change', updateDifficulty);

input.addEventListener('input', newWord);

card.addEventListener('click', replayGame);
