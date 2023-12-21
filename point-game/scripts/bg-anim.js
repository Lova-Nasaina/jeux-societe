$(document).ready(function () {
    const colorsHex = [
        "#FF0000",
        "#0000FF",
        "#008000",
        "#FFFF00",
        "#FFA500",
        "#800080",
        "#FFC0CB",
        "#A52A2A",
        "#00FFFF",
        "#00FF00",
        "#40E0D0",
        "#808080"
    ];


    function animerLosanges(nombreLosanges) {
        function creerLosange() { // ho ana losange iray
            var largeur = Math.random() * 180 + 30;
            var hauteur = Math.random() * 180 + 30;

            var positionTop = Math.random() * ($(window).height() - hauteur);
            var positionLeft = Math.random() * ($(window).width() - largeur);

            var couleurAleatoire = colorsHex[Math.floor(Math.random() * colorsHex.length)];


            /*********************************************************** */
            // Foronina le losange de atsofoka anatinle losange-container
            var $losange = $("<div class='losange'></div>").css({
                width: largeur,
                height: hauteur,
                top: positionTop,
                left: positionLeft,
                border: "1px solid " + couleurAleatoire + "CC",
                backgroundColor: couleurAleatoire + "26"
            });

            $("#losange-container").append($losange);

            /************************************************************ */


            // animation boucle infini
            var delai = Math.random() * 3000 + 1000;
            $losange.fadeIn(delai, function () {
                var delai2 = Math.random() * 3800 + 200;

                $(this).fadeOut(delai2, function () {
                    $(this).remove();
                    creerLosange();
                });
            });
        }

        /******************************************* */
        for (var i = 0; i < nombreLosanges; i++) {
            creerLosange();
        }
    }

    animerLosanges(25);
})