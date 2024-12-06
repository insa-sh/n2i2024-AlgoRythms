// Charger les données du quiz
const quizData = [
    {
        "id": 1,
        "question": "À quelle partie du corps humain qu'on peut comparer les courants marins, hein ?",
        "choices": ["Les poumons", "Le système digestif", "Le système sanguin", "La peau"],
        "correct_answer": "Le système sanguin",
        "explanation": "Les courants marins, y transportent chaleur, gaz et nutriments, tout comme le système circulatoire transporte oxygène et nutriments dans l'corps, t'vois."
    },
    {
        "id": 2,
        "question": "Quelle partie du corps humain qu'on peut comparer au phytoplancton dans l’océan, hein ?",
        "choices": ["Les cellules de la peau", "Les globules rouges", "Les reins", "Le cerveau"],
        "correct_answer": "Les globules rouges",
        "explanation": "Tout comme les globules rouges transportent et échangent l’oxygène, le phytoplancton produit de l’oxygène grâce à la photosynthèse, essentiel à la vie marine et terrestre, t'vois."
    },
    {
        "id": 3,
        "question": "À quoi qu'on peut comparer la stratification des océans dans l'corps humain, dis ?",
        "choices": ["L’équilibre thermique", "Le système nerveux", "Le système lymphatique", "Le système osseux"],
        "correct_answer": "L’équilibre thermique",
        "explanation": "La stratification limite les échanges entre les eaux chaudes et froides, comme l'corps qui régule la température, hein."
    },
    {
        "id": 4,
        "question": "Quel phénomène océanique qu'est similaire à la production de déchets dans l'corps humain, hein ?",
        "choices": ["La création de courants marins", "La production de neige marine", "L’acidification des océans", "La dissolution des gaz"],
        "correct_answer": "La production de neige marine",
        "explanation": "Les déchets organiques produits par le phytoplancton, qui coulent sous forme de « neige marine », rappellent les déchets métaboliques du corps humain, t'vois."
    },
    {
        "id": 5,
        "question": "Quel écosystème de l'océan qu'est similaire aux poumons humains, dis ?",
        "choices": ["Les récifs coralliens", "Les mangroves", "Les algues", "Les zones abyssales"],
        "correct_answer": "Les algues",
        "explanation": "Les algues, comme les poumons, jouent un rôle crucial dans la production d'oxygène et la filtration de l'eau, contribuant à la santé globale de l'écosystème marin, hein."
    },
    {
        "id": 6,
        "question": "Le cœur de l'océan est représenté par les courants marins, qui fonctionnent comme le système circulatoire du corps humain.",
        "choices": ["Vrai", "Faux"],
        "correct_answer": "Vrai",
        "explanation": "Les courants marins, comme le Gulf Stream, distribuent la chaleur et les nutriments dans l'océan, de la même manière que le cœur pompe le sang pour nourrir et oxygéner le corps humain."
    },
    {
        "id": 7,
        "question": "La peau du corps humain est comparable à la surface de l'océan, car elle régule l'échange d'eau et de chaleur.",
        "choices": ["Vrai", "Faux"],
        "correct_answer": "Vrai",
        "explanation": "La surface de l'océan agit comme une barrière et régule les échanges thermiques entre l'eau et l'atmosphère, tout comme la peau contrôle la température corporelle et prévient la perte d'eau."
    },
    {
        "id": 8,
        "question": "Les globules rouges transportent l'oxygène dans le corps humain, tout comme les dauphins distribuent l'oxygène dans l'océan.",
        "choices": ["Vrai", "Faux"],
        "correct_answer": "Faux",
        "explanation": "Les globules rouges transportent de l'oxygène aux cellules, mais les dauphins ne jouent aucun rôle dans la distribution d'oxygène dans l'océan. Ce rôle revient principalement au phytoplancton et aux échanges gazeux à la surface."
    },
    {
        "id": 9,
        "question": "Le système nerveux du corps humain peut être comparé à la thermohaline de l'océan, qui transmet des signaux à travers ses courants.",
        "choices": ["Vrai", "Faux"],
        "correct_answer": "Vrai",
        "explanation": "La thermohaline est un réseau de courants profonds reliant les océans du monde entier, transmettant des signaux climatiques comme un système nerveux transmet des informations à travers le corps."
    },
    {
        "id": 10,
        "question": "Le foie du corps humain filtre les toxines, tout comme le sable filtre l'eau dans l'océan.",
        "choices": ["Vrai", "Faux"],
        "correct_answer": "Vrai",
        "explanation": "Le sable joue un rôle de filtre naturel, aidant à purifier l'eau qui passe à travers lui, tout comme le foie filtre les toxines du sang dans le corps humain."
    },
    {
        "id": 11,
        "question": "L'oxygène présent dans l'atmosphère est majoritairement produit par la forêt amazonienne.",
        "choices": ["Vrai", "Faux"],
        "correct_answer": "Faux",
        "explanation": "L'océan produit environ 50 à 70 % de l'oxygène de la planète grâce au phytoplancton, un organisme minuscule qui effectue la photosynthèse. La forêt amazonienne est importante, mais elle n'est pas seule."
    },
    {
        "id": 12,
        "question": "La salinité de l'océan est essentielle, tout comme le taux de sel dans le sang humain.",
        "choices": ["Vrai", "Faux"],
        "correct_answer": "Vrai",
        "explanation": "La salinité de l'océan maintient son équilibre chimique, tout comme la concentration de sel dans le sang humain est cruciale pour les fonctions cellulaires et le métabolisme."
    }
];



let currentQuestionIndex = 0;

function loadQuestion() {
    const questionContainer = document.getElementById("question");
    const choicesContainer = document.getElementById("choices");
    const nextButton = document.getElementById("next-btn");
    const resultContainer = document.getElementById("question");
    console.log(resultContainer);
    
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
        button.className = "button"; // Classe générique pour le style initial
        button.onclick = () => checkAnswer(button, choice, currentQuestion.correct_answer, currentQuestion.explanation);
        choicesContainer.appendChild(button);
    });
}

function checkAnswer(button, selectedAnswer, correctAnswer, explanation) {
    const resultContainer = document.getElementById("question");
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
        document.getElementById("question").innerHTML = "<h1>Quiz terminé ! Bravo !</h1>";
        document.getElementById("choices").style.display = "none";
    }
}

// Charger la première question
loadQuestion();
