let currentQuestionIndex = 0;

function loadQuestion() {
    const questionContainer = document.getElementById("question");
    const choicesContainer = document.getElementById("choices");
    const nextButton = document.getElementById("next-btn");
    const resultContainer = document.getElementById("question");

    // Réinitialiser les éléments
    resultContainer.textContent = "";
    choicesContainer.innerHTML = "";
    nextButton.style.display = "none";

    // Charger la question actuelle
    const currentQuestion = quizData[currentQuestionIndex];
    questionContainer.textContent = currentQuestion.question;

    // Créer les boutons de choix
    currentQuestion.choices.forEach((choice) => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.className = "choice-btn"; // Classe générique pour le style initial
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
        resultContainer.textContent = `Bonne réponse ! ${explanation}`;
        resultContainer.style.color = "green";
    } else {
        button.style.backgroundColor = "red"; // Mauvaise réponse
        resultContainer.textContent = `Mauvaise réponse. ${explanation}`;
        resultContainer.style.color = "red";
    }

    // Colorer la bonne réponse pour feedback
    choicesButtons.forEach((btn) => {
        if (btn.textContent === correctAnswer) {
            btn.style.backgroundColor = "green";
        }
    });

    // Montrer le bouton "Question Suivante"
    nextButton.style.display = "block";
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        document.getElementById("quiz-container").innerHTML = "<h1>Quiz terminé ! Bravo !</h1>";
    }
}

// Charger la première question
loadQuestion();
