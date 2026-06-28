const quizData = [
    {
        question: "Which sentence is grammatically correct?",
        options: [
            "She don't like coffee.",
            "She doesn't likes coffee.",
            "She doesn't like coffee.",
            "She not like coffee."
        ],
        answer: 2
    },
    {
        question: "What is the synonym of 'abundant'?",
        options: [
            "Scarce",
            "Plentiful",
            "Limited",
            "Rare"
        ],
        answer: 1
    },
    {
        question: "Identify the adverb in the sentence: 'He completed the assignment quickly.'",
        options: [
            "He",
            "Completed",
            "Assignment",
            "Quickly"
        ],
        answer: 3
    },
    {
        question: "Which word is the antonym of 'optimistic'?",
        options: [
            "Hopeful",
            "Positive",
            "Pessimistic",
            "Confident"
        ],
        answer: 2
    },
    {
        question: "Choose the correct passive form of: 'The students wrote the report.'",
        options: [
            "The report was written by the students.",
            "The report is written by the students.",
            "The report has written by the students.",
            "The report was wrote by the students."
        ],
        answer: 0
    },
    {
        question: "What is the meaning of the idiom 'break the ice'?",
        options: [
            "To destroy something",
            "To begin a conversation in a social setting",
            "To feel cold",
            "To end a friendship"
        ],
        answer: 1
    },
    {
        question: "Which sentence contains a relative clause?",
        options: [
            "I like reading books.",
            "The man who called yesterday is my uncle.",
            "She arrived late.",
            "They are studying."
        ],
        answer: 1
    },
    {
        question: "Choose the correctly punctuated sentence.",
        options: [
            "Its a beautiful day.",
            "It's a beautiful day.",
            "Its' a beautiful day.",
            "It's a beautiful day"
        ],
        answer: 1
    },
    {
        question: "Which word is a noun?",
        options: [
            "Beautiful",
            "Run",
            "Happiness",
            "Quickly"
        ],
        answer: 2
    },
    {
        question: "What is the main purpose of an academic thesis statement?",
        options: [
            "To summarize references",
            "To introduce the writer's main argument",
            "To list sources",
            "To conclude the essay"
        ],
        answer: 1
    }
];

let currentQuestion = 0;
let selectedAnswers = [];
let questionTimes = new Array(quizData.length).fill(30); 
let timer = null;
let isPaused = false;

const questionElement = document.getElementById("question-number");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("prev-btn");
const questionText = document.getElementById("question-text");
const optionButtons = document.querySelectorAll(".option");
const darkModeButton = document.getElementById("dark-mode-btn");
const pauseButton = document.getElementById("pause-btn"); 

const answeredElement = document.getElementById("answered");
const remainingElement = document.getElementById("remaining");

const resultScreen = document.getElementById("result-screen");
const quizScreen = document.getElementById("quiz-screen");

const totalElement = document.getElementById("total");
const correctElement = document.getElementById("correct");
const incorrectElement = document.getElementById("incorrect");
const unansweredElement = document.getElementById("unanswered");
const scoreElement = document.getElementById("score");
const percentElement = document.getElementById("percent");
const restartButtons = document.querySelectorAll(".restart");
const performanceElement = document.getElementById("performance");
const progressBar = document.getElementById("progress-bar");
const timerElement = document.getElementById("timer");

function displayQuestion() {
    const currentQuiz = quizData[currentQuestion];

    questionElement.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
    questionText.textContent = currentQuiz.question;

    const letters = ["A", "B", "C", "D"];

    currentQuiz.options.forEach((option, index) => {
        if (optionButtons[index]) {
            optionButtons[index].textContent = letters[index] + ". " + option;
        }
    });

    resetOptionsUI();
    restoreSelectedAnswer();
    updateProgress();
    
    if (questionTimes[currentQuestion] <= 0) {
        if (timer) clearInterval(timer);
        timerElement.textContent = "0";
        optionButtons.forEach(button => {
            button.disabled = true;
        });
    } else if (isPaused) {
        setPauseState(true);
    } else {
        startTimer(); 
    }
}

function resetOptionsUI() {
    optionButtons.forEach(button => {
        button.disabled = false;
        button.classList.remove("selected");
        button.classList.remove("correct");
        button.classList.remove("wrong");
    });
}

function restoreSelectedAnswer() {
    const selectedAnswer = selectedAnswers[currentQuestion];

    if (selectedAnswer !== undefined && optionButtons[selectedAnswer]) {
        const correctAnswer = quizData[currentQuestion].answer;

        optionButtons.forEach(button => {
            button.disabled = true;
        });

        if (selectedAnswer === correctAnswer) {
            optionButtons[selectedAnswer].classList.add("correct");
        } else {
            optionButtons[selectedAnswer].classList.add("wrong");

            if (optionButtons[correctAnswer]) {
                optionButtons[correctAnswer].classList.add("correct");
            }
        }
    }
}

optionButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        selectAnswer(index);
    });
});

function selectAnswer(answerIndex) {
    selectedAnswers[currentQuestion] = answerIndex;
    timerElement.textContent = questionTimes[currentQuestion];

    const correctAnswer = quizData[currentQuestion].answer;

    optionButtons.forEach(button => {
        button.disabled = true;
    });

    if (answerIndex === correctAnswer) {
        if (optionButtons[answerIndex]) {
            optionButtons[answerIndex].classList.add("correct");
        }
    } else {
        if (optionButtons[answerIndex]) {
            optionButtons[answerIndex].classList.add("wrong");
        }
        if (optionButtons[correctAnswer]) {
            optionButtons[correctAnswer].classList.add("correct");
        }
    }

    updateProgress();
    saveProgress();
}

nextButton.addEventListener("click", nextQuestion);
prevButton.addEventListener("click", previousQuestion);

function nextQuestion() {
    if (timer) clearInterval(timer);

    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        displayQuestion();
        saveProgress();
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (timer) clearInterval(timer);

    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
        saveProgress();
    }
}

darkModeButton.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", isDark); 
});

pauseButton.addEventListener("click", () => {
    isPaused = !isPaused;
    setPauseState(isPaused);
    saveProgress();
});

function setPauseState(paused) {
    if (paused) {
        clearInterval(timer);
        pauseButton.textContent = "resume quiz";
        nextButton.disabled = true;
        prevButton.disabled = true;
        optionButtons.forEach(btn => btn.disabled = true);
    } else {
        pauseButton.textContent = "pause quiz";
        nextButton.disabled = false;
        prevButton.disabled = false;
        
        if (selectedAnswers[currentQuestion] === undefined && questionTimes[currentQuestion] > 0) {
            optionButtons.forEach(btn => btn.disabled = false);
        }
        
        startTimer(); 
    }
}

function updateProgress() {
    let completedQuestionsCount = 0;
    
    for (let i = 0; i < quizData.length; i++) {
        if (selectedAnswers[i] !== undefined || questionTimes[i] <= 0) {
            completedQuestionsCount++;
        }
    }

    const remainingCount = quizData.length - completedQuestionsCount;

    answeredElement.textContent = `Answered: ${completedQuestionsCount}`;
    remainingElement.textContent = `Remaining: ${remainingCount}`;

    const progressPercent = (completedQuestionsCount / quizData.length) * 100;
    progressBar.textContent = `Progress: ${progressPercent.toFixed(0)}%`;
}

function calculateResults() {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    quizData.forEach((question, index) => {
        const userAnswer = selectedAnswers[index];

        if (userAnswer === undefined) {
            unanswered++;
        } else if (userAnswer === question.answer) {
            correct++;
        } else {
            incorrect++;
        }
    });

    const percentage = (correct / quizData.length) * 100;

    return { correct, incorrect, unanswered, percentage };
}

function showResults() {
    clearInterval(timer);
    localStorage.removeItem("quizState"); 
    
    const results = calculateResults();

    quizScreen.style.display = "none";
    resultScreen.style.display = "block";

    totalElement.textContent = `Total: ${quizData.length}`;
    correctElement.textContent = `Correct: ${results.correct}`;
    incorrectElement.textContent = `Incorrect: ${results.incorrect}`;
    unansweredElement.textContent = `Unanswered: ${results.unanswered}`;

    scoreElement.textContent = `Score: ${results.correct}/${quizData.length}`;
    percentElement.textContent = `Percentage: ${results.percentage.toFixed(2)}%`;
    let performanceMessage = "";

    if (results.percentage <= 40) {
        performanceMessage = "Needs Improvement";
    }
    else if (results.percentage <= 70) {
        performanceMessage = "Good Effort";
    }
    else if (results.percentage <= 90) {
        performanceMessage = "Great Work";
    }
    else {
        performanceMessage = "Excellent";
    }

    performanceElement.textContent = performanceMessage;    
}

restartButtons.forEach(button => {
    button.addEventListener("click", resetQuiz);
});

function resetQuiz() {
    currentQuestion = 0;
    selectedAnswers = [];
    questionTimes = new Array(quizData.length).fill(30); 
    isPaused = false;
    if (pauseButton) pauseButton.textContent = "pause quiz";
    nextButton.disabled = false;
    prevButton.disabled = false;

    resultScreen.style.display = "none";
    quizScreen.style.display = "block";

    optionButtons.forEach(button => {
        button.classList.remove("selected");
        button.disabled = false;
    });

    localStorage.removeItem("quizState"); 
    displayQuestion();
    updateProgress();
}

function startTimer() {
    if (timer) clearInterval(timer); 

    timerElement.textContent = questionTimes[currentQuestion];

    timer = setInterval(() => {
        questionTimes[currentQuestion]--;
        timerElement.textContent = questionTimes[currentQuestion];
        saveProgress(); 

        if (questionTimes[currentQuestion] <= 0) {
            clearInterval(timer);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        displayQuestion();
        saveProgress();
    } else {
        showResults();
    }
}

function saveProgress() {
    const quizState = {
        currentQuestion: currentQuestion,
        selectedAnswers: selectedAnswers,
        questionTimes: questionTimes, 
        isPaused: isPaused  
    };

    localStorage.setItem("quizState", JSON.stringify(quizState));
}

function loadProgress() {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "true") {
        document.body.classList.add("dark-mode");
    }

    const saved = localStorage.getItem("quizState");
    if (!saved) return false; 

    const data = JSON.parse(saved);
    currentQuestion = data.currentQuestion || 0;
    selectedAnswers = data.selectedAnswers || [];
    questionTimes = data.questionTimes || new Array(quizData.length).fill(30);
    isPaused = data.isPaused || false;
    return true;
}

const hasSavedData = loadProgress();
displayQuestion();
