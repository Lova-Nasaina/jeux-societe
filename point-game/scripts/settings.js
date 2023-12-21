$(document).ready(function () {
    // Remplir les sélecteurs de couleur
    const couleurs = ["Rouge", "Bleu", "Vert", "Jaune", "Orange", "Violet", "Rose", "Marron", "Cyan", "Vert clair", "Noir", "Gris"];
    const colors = ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Brown", "Cyan", "Lime", "Black", "Gray"];
    const optionsCouleur = couleurs.map(couleur => `<option style="--option-bg-color: ${colors[couleurs.indexOf(couleur)]};" value="${couleur}">${couleur}</option>`);
    $("#player1-color, #player2-color").html(optionsCouleur.join(''));
    $('#start-game').hide();
    $('#substitute').show();

    function checkStart() {
        if ($("#player1-color").val() == $("#player2-color").val()) {
            $('#start-game').hide();
            $('#substitute').show();
        }
        else {
            $('#start-game').show();
            $('#substitute').hide();
        }
    }

    // Gestionnaire d'événements pour les sélecteurs de couleur des joueurs
    $("#player1-color").change(function () {
        $('#player1-section').css("background-color", colors[couleurs.indexOf($(this).val())]);
        checkStart();
    });

    $("#player2-color").change(function () {
        $('#player2-section').css("background-color", colors[couleurs.indexOf($(this).val())]);
        checkStart();
    });

    $("#start-game").click(function () {
        // Récupérer les valeurs des champs
        let nomJoueur1 = $("#player1-name").val();
        let nomJoueur2 = $("#player2-name").val();

        nomJoueur1 = (nomJoueur1 == '') ? "Joueur 1" : nomJoueur1;
        nomJoueur2 = (nomJoueur2 == '') ? "Joueur 2" : nomJoueur2;

        // Stocker les valeurs dans localStorage
        localStorage.setItem("nomJoueur1", nomJoueur1);
        localStorage.setItem("nomJoueur2", nomJoueur2);
        localStorage.setItem("couleurJoueur1", $("#player1-color").val());
        localStorage.setItem("couleurJoueur2", $("#player2-color").val());
        localStorage.setItem("tempsReflexion", $("input[name='reflection-time']:checked").val());
        localStorage.setItem("dureeJeu", $("input[name='game-time']:checked").val());
        localStorage.setItem("size", $("input[name='notebook-size']:checked").val());

        // Rediriger vers la page game.html
        window.location.href = "game.html";
    });
});
