function submitAnswer(answer) {
    // Variable to store the response
    let response = answer;

    // Display the result to the user
    const resultElement = document.getElementById("result");
    if (response === "vrai") {
        resultElement.textContent = "Bonne réponse ! C'est VRAI.";
    } else {
        resultElement.textContent = "Mauvaise réponse. Essayez encore.";
    }

    // Log the response to console (for debugging)
    console.log("Réponse sélectionnée :", response);
}
