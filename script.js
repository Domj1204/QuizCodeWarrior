// JavaScript code for the quiz
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('highscores-btn').addEventListener('click', showHighScores);
document.getElementById('back-btn').addEventListener('click', backToQuiz);
document.getElementById('save-score').addEventListener('click', saveScore);
document.getElementById('reset-scores').addEventListener('click', resetHighScores);

let currentQuestionIndex, questions, timer, timerInterval = 0;
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const timerElement = document.getElementById('time');
const scoreForm = document.getElementById('score-form');
const feedbackElement = document.getElementById('feedback');
const highscoresContainer = document.getElementById('highscores-container');
const highscoresList = document.getElementById('highscores-list');

function startGame() {
    console.log("Let the games begin!")
    document.getElementById('start-btn').classList.add('hide');
    questionContainerElement.classList.remove('hide');
    currentQuestionIndex = 0;
    score = 0;
    timer = 60;
    startTimer();
    setNextQuestion();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer--;
        timerElement.textContent = timer;
        if (timer <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
}

// Questions for Quiz
questions = [
    { 
        question: "What does HTML stand for?", answers: [{ text: "Hyper Text Markup Language", correct: true }, { text: "Hot Mail", correct: false }, { text: "How To Make Lasagna", correct: false }, { text: "Hyperlink and Text Markup Language", correct: false }
        ] 
    },
    { 
        question: "What is the correct syntax for referring to an external script called app.js?", answers: [{ text: "<script src=app.js>", correct: true }, { text: "<script name=app.js>", correct: false }, { text: "<script href=app.js>", correct: false }, { text: "<script file=app.js>", correct: false }
        ] 
    },
    { 
        question: "Which of the following is a valid type of function in JavaScript?", answers: [{ text: "Both named and anonymous functions", correct: true }, { text: "Named Function", correct: false }, { text: "Anonymous Function", correct: false }, { text: "None of the above", correct: false }
        ] 
    },
    { 
        question: "Inside which HTML element do we put the JavaScript?", answers: [{ text: "<script>", correct: true }, { text: "<javascript>", correct: false }, { text: "<js>", correct: false }, { text: "<scripting>", correct: false }
        ] 
    },
    { 
        question: "Which of the following method checks if its argument is not a number?", answers: [{ text: "isNan()", correct: true }, { text: "nonNaN", correct: false }, { text: "isNumber", correct: false }, { text: "None of the above", correct: false }
        ] 
    },
];

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    feedbackElement.textContent = '';
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    Array.from(answerButtonsElement.children).forEach(button => {
        button.removeEventListener('click', selectAnswer);
    });
    if (correct) {
        score++;
        feedbackElement.textContent = 'Correct!';
        feedbackElement.style.color = 'green';
    } else {
        feedbackElement.textContent = 'Wrong!';
        feedbackElement.style.color = 'red';
        if (timer > 10) {
            timer -= 10;
        } else {
            timer = 0;
        }
        timerElement.textContent = timer;
    }
    if (questions.length > currentQuestionIndex + 1) {
        setTimeout(() => {
            currentQuestionIndex++;
            setNextQuestion();
        }, 1000);
    } else {
        setTimeout(endGame, 1000);
    }
}

function endGame() {
    console.log("This is the END!")
    clearInterval(timerInterval);
    questionContainerElement.classList.add('hide');
    scoreForm.classList.remove('hide');
    feedbackElement.textContent = 'Final Score: ' + calculateScorePercentage() + '%';
}

function calculateScorePercentage() {
    return (score / questions.length) * 100;
}

function saveScore() {
    const initials = document.getElementById('initials').value;
    const finalscore = calculateScorePercentage();
    const highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    highscores.push({ initials, score });
    highscores.sort((a, b) => b.score - a.score);
    localStorage.setItem('highscores', JSON.stringify(highscores));
    showHighScores();
}

function showHighScores() {
    const highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    highscoresList.innerHTML = highscores.map(score => `<li>${score.initials} - ${score.score}</li>`).join('');
    highscoresContainer.classList.remove('hide');
    scoreForm.classList.add('hide');
    questionContainerElement.classList.add('hide');
    document.getElementById('start-btn').classList.add('hide');
}

function backToQuiz() {
    highscoresContainer.classList.add('hide');
    document.getElementById('start-btn').classList.remove('hide');
}

function resetHighScores() {
    localStorage.removeItem('highscores');
    highscoresList.innerHTML = '';
};