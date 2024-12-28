const questionDiv = document.querySelector(".question");
const answerDiv = document.querySelector(".answers");
const difficultySpan = document.querySelector(".difficulty span");
const categorySpan = document.querySelector(".category span");
const questionElem = document.querySelector(".quest");
const btnNewQuest = document.getElementById("btn-new-quest");
const messageElem = document.querySelector(".message");
const iconCor = document.querySelector(".icon-cor");
const iconHandGood = document.querySelector(".icon-hand-good");
const iconInc = document.querySelector(".icon-inc");
const iconHandBad = document.querySelector(".icon-hand-bad");

let answers = [];
let turnIsDone = false;

class answerObj {
  constructor(answer) {
    this.answer = answer;
    this.correctAnswer = false;
  }
}

class correctAnswerObj extends answerObj {
  constructor(answer) {
    super(answer);
    this.correctAnswer = true;
  }
}

async function getTriviaQuestion() {
  const URL = "https://opentdb.com/api.php?amount=1";
  const response = await fetch(URL);
  const result = await response.text();
  const data = await JSON.parse(result);
  return data.results[0];
}

async function startGame() {
  const questionObj = await getTriviaQuestion();
  const {
    category,
    difficulty,
    type,
    correct_answer,
    incorrect_answers,
    question,
  } = questionObj;

  console.log(questionObj);

  populateAnswersArray(correct_answer, incorrect_answers);

  type === "multiple"
    ? generateLayoutMultiple(category, difficulty, question)
    : generateLayoutBoolean(category, difficulty, question);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const rndNum = Math.floor(Math.random() * array.length);
    let temp = array[i];
    array[i] = array[rndNum];
    array[rndNum] = temp;
  }
  return array;
}

function generateLayoutMultiple(category, difficulty, question) {
  populateDifficulty(difficulty);
  populateCategory(category);
  populateQuestion(question);
  populateMultAnswers();
}
function generateLayoutBoolean(category, difficulty, question) {
  populateDifficulty(difficulty);
  populateCategory(category);
  populateQuestion(question);
  populateBoolAnswers();
}

function populateDifficulty(difficulty) {
  difficultySpan.innerHTML = difficulty.toUpperCase();
}

function populateCategory(category) {
  categorySpan.innerHTML = category.toUpperCase();
}

function populateQuestion(question) {
  questionElem.innerHTML = question;
}

function populateBoolAnswers() {
  let isTrueCorrect;

  answers.forEach((ans) => {
    ans.answer === "True" && ans.correctAnswer
      ? (isTrueCorrect = true)
      : (isTrueCorrect = false);
  });

  answerDiv.innerHTML += `
  <button data-correct=${isTrueCorrect} type='button'>True</button>
  <button data-correct=${!isTrueCorrect} type='button'>False</button>
`;
}

function populateMultAnswers() {
  answerDiv.innerHTML = "";
  const shuffledAnswers = shuffleArray(answers);

  shuffledAnswers.forEach((ans) => {
    answerDiv.innerHTML += `
      <button data-correct=${ans.correctAnswer}>${ans.answer}</button>      
    `;
  });
}

function populateAnswersArray(corr, incAnsArr) {
  const correctAnswer = new correctAnswerObj(corr);
  incAnsArr.forEach((answer) => {
    answers.push(new answerObj(answer));
  });
  answers.push(correctAnswer);
}

function handleCorrectClick() {
  if (!turnIsDone) {
    console.log("the correct answer was clicked");
    messageElem.innerText = "CORRECT";
    turnIsDone = true;
    addButtonOutlines();
    showIcons(true);
  }
}

function handleIncorrectClick() {
  if (!turnIsDone) {
    console.log("an incorrect answer was clicked");
    messageElem.classList.add("message-wrong");
    messageElem.innerHTML = `
      INCORRECT
      <br />
      <span>
      The correct answer was:
      </span>
      <br />
      <span>
       ${getCorrectAnswer()}
       </span>
      `;
    turnIsDone = true;
    addButtonOutlines();
    showIcons(false);
  }
}

function getCorrectAnswer() {
  const corAns = answers.filter((ans) => ans.correctAnswer === true);
  return corAns[0].answer;
}

function showIcons(isCorrect) {
  if (isCorrect) {
    iconCor.classList.add("display");
    iconHandGood.classList.add("display");
  } else {
    iconInc.classList.add("display");
    iconHandBad.classList.add("display");
  }
}

function addButtonOutlines() {
  const buttons = document.querySelectorAll(".answers button");
  buttons.forEach((btn) => {
    const isCorr = btn.getAttribute("data-correct");
    if (isCorr === "true") {
      btn.classList.add("correct");
    } else {
      btn.classList.add("incorrect");
    }
  });
}

btnNewQuest.addEventListener("click", () => {
  location.reload();
});

document.addEventListener("click", (e) => {
  if (e.target.matches('button[data-correct="true"]')) {
    handleCorrectClick();
  } else if (e.target.matches('button[data-correct="false"]')) {
    handleIncorrectClick();
  }
});

startGame();