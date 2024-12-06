import { toggleControl } from './main.js';



let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const getQuestions = async () => {
    const response = await fetch("assets/data/questions.json");
    return await response.json();
}

async function init() {
    questions = await getQuestions();
    loadQuestion2();
}

function applyLetterAnimation(element) {
    const text = element.textContent;
    element.innerHTML = '';
    text.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter === " " ? "\u00A0" : letter;
        span.classList.add('letter')
        span.style.animationDelay = `${index * 0.05}s`;
        element.appendChild(span);
    });
}


export function loadQuestion2(indice) {
    const questionContainer = document.getElementById("result");
    const choicesContainer = document.getElementById("choices");
    const nextButton = document.getElementById("next-btn");
    nextButton.addEventListener('click', nextQuestion);
    const resultContainer = document.getElementById("result");

    // Réinitialiser les éléments
    resultContainer.textContent = "";
    choicesContainer.innerHTML = "";
    nextButton.style.display = "none";

    // Charger la question actuelle
    const currentQuestion = questions[indice];
    questionContainer.textContent = currentQuestion.question;
    applyLetterAnimation(questionContainer);

    // Créer les boutons de choix
    currentQuestion.choices.forEach((choice) => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.className = "choice-btn button"; // Classe générique pour le style initial
        button.onclick = () => checkAnswer(button, choice, currentQuestion.correct_answer, currentQuestion.explanation);
        choicesContainer.appendChild(button);
    });
}

function checkAnswer(button, selectedAnswer, correctAnswer, explanation) {
    const resultContainer = document.getElementById("result");
    const nextButton = document.getElementById("next-btn");
    const choicesButtons = document.querySelectorAll(".choice-btn");

    // Désactiver tous les boutons après le clic
    choicesButtons.forEach((btn) => (btn.disabled = true));

    // Vérifier la réponse sélectionnée
    if (selectedAnswer === correctAnswer) {
        button.style.backgroundColor = "green"; // Bonne réponse
        resultContainer.innerHTML = `Bonne réponse !<br>${explanation}`;
        resultContainer.style.color = "green";
        score++;
    } else {
        button.style.backgroundColor = "red"; // Mauvaise réponse
        resultContainer.innerHTML = `Mauvaise réponse.<br>${explanation}`;
        resultContainer.style.color = "red";
    }

    // Colorer la bonne réponse pour feedback
    choicesButtons.forEach((btn) => {
        if (btn.textContent === correctAnswer) {
            btn.style.backgroundColor = "green";
        }
    });
    console.log(score);

    // Montrer le bouton "Question Suivante"
    nextButton.style.display = "block";
}

export function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        toggleControl();
    } else {
        document.getElementById("result").innerHTML = "<h1>Quiz terminé ! Bravo !</h1>";
    }
}

document.addEventListener('DOMContentLoaded', init);
