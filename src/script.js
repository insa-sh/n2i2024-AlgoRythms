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
    document.getElementById("next-btn").style.display = "none";

    // loadQuestion2();
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
    document.getElementById("storyline").style.display = "flex";
    const questionContainer = document.getElementById("result");
    const choicesContainer = document.getElementById("choices");
    const nextButton = document.getElementById("next-btn");
    nextButton.addEventListener('click', nextQuestion);
    const resultContainer = document.getElementById("result");
    const characterImage = document.getElementById("character-image");

    // Réinitialiser les éléments
    resultContainer.textContent = "";
    choicesContainer.innerHTML = "";
    nextButton.style.display = "none";

    // Réinitialiser l'image du personnage
    characterImage.src = "assets/images/default.png";
    characterImage.alt = "Personnage neutre";

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
    const characterImage = document.getElementById("character-image");

    // Désactiver tous les boutons après le clic
    choicesButtons.forEach((btn) => (btn.disabled = true));

    // Vérifier la réponse sélectionnée
    if (selectedAnswer === correctAnswer) {
        button.style.backgroundColor = "green"; // Bonne réponse
        resultContainer.innerHTML = `Bonne reponse ! <br>${explanation}`;
        resultContainer.style.color = "green";
        applyLetterAnimation(resultContainer);
        score++;

        // Mettre à jour l'image du personnage (happy)
        characterImage.src = "assets/images/happy.png";
        characterImage.alt = "Personnage heureux";
    } else {
        button.style.backgroundColor = "red"; // Mauvaise réponse
        resultContainer.innerHTML = `Mauvaise reponse. <br>${explanation}`;
        resultContainer.style.color = "red";
        applyLetterAnimation(resultContainer);

        // Mettre à jour l'image du personnage (sad)
        characterImage.src = "assets/images/sad.png";
        characterImage.alt = "Personnage triste";
    }

    // Montrer le bouton "Question Suivante"
    nextButton.style.display = "block";
}


export function nextQuestion() {

    currentQuestionIndex++;
    document.getElementById("result").style.color = "black";
    if (currentQuestionIndex < questions.length) {
        toggleControl();
        // masquer tout
        document.getElementById("storyline").style.display = "none";
        document.getElementById("choices").innerHTML = "";
        document.getElementById("next-btn").style.display = "none";
        
        
    } else {
        document.getElementById("result").innerHTML = "<h1>Quiz termine ! Bravo !</h1>";
    }
}



document.addEventListener('DOMContentLoaded', init);


