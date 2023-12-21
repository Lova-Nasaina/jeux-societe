document.addEventListener("DOMContentLoaded", function () {
    // Exemple de données de jeu (vainqueur, perdant, score)
    
    let score1 = localStorage.getItem("score1");
    let score2 = localStorage.getItem("score2");

    score1 = (score1 == null) ? 0 : score1;
    score2 = (score2 == null) ? 0 : score2;

    const winner = (score1 > score2) ? localStorage.getItem("nomJoueur1") : (score1 == score2) ? "Partie Nulle" : localStorage.getItem("nomJoueur2");
    
    console.log(score1 + ' ' + score2);

    // Sélectionnez les éléments HTML pour les résultats
    const winnerElement = document.getElementById("winner");
    const scoreElement = document.getElementById("score");

    // Mettez à jour les éléments HTML avec les données du jeu
    winnerElement.textContent = winner;
    scoreElement.textContent = score1 + " - " + score2;

    // Sélectionnez le bouton "Quitter" par son ID
    const quitterButton = document.getElementById("quitter-button");

    // Ajoutez un gestionnaire d'événement pour le clic sur le bouton
    quitterButton.addEventListener("click", function () {
        // Effectuez la redirection vers index.html
        window.location.href = "../index.html";
    });
    // Sélectionnez le bouton "Terminer" par son ID
    const finishButton = document.getElementById("finish-button");

    // Ajoutez un gestionnaire d'événements de clic au bouton
    finishButton.addEventListener("click", function () {
        // Redirigez vers la page result.html
        window.location.href = "game.html";
    });


    localStorage.removeItem("score1")
    localStorage.removeItem("score2")
});
