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

    function changeTextColor() {
        // mparcourir chaque lettre du texte
        $("h1").children().each(function () {
            const randomColor = colorsHex[Math.floor(Math.random() * colorsHex.length)];
            $(this).css("color", randomColor);
        });
    }

    //premier appel
    changeTextColor();

    // appel isan-tsegondra
    setInterval(changeTextColor, 1000);



    /***************************************************** */
    /*animation troinagle*/
    /***************************************************** */
    function animateLeftTriangle() {
        $(".left-triangle").animate({ left: "-10px" }, 500, "linear", function () {
            $(".left-triangle").animate({ left: "0" }, 500, "linear", function () {
                animateLeftTriangle();
            });
        });
    }

    function animateRightTriangle() {
        $(".right-triangle").animate({ right: "-10px" }, 500, "linear", function () {
            $(".right-triangle").animate({ right: "0" }, 500, "linear", function () {
                animateRightTriangle(); // Appel récursif pour l'animation en boucle
            });
        });
    }

    animateLeftTriangle();
    animateRightTriangle();

    /***************************************************** */

    $("a").hover(function () {
        $(this).animate({ fontSize: '35px' }, 200);
    }, function () {
        $(this).animate({ fontSize: '30px' }, 200);
    });

    // Effet de rebond au clic du bouton et redirection vers game.html
    $("a").click(function () {
        $(this).effect('bounce', { times: 3 }, 300, function () {
            // Redirection vers game.html
            window.location.href = "otherpages/settings.html";
        });
    });


    // Sélectionnez tous les éléments <span>
    var spans = $("span");

    // Fonction récursive pour appliquer l'effet "bounce" un à un de manière infinie
    function bounceOneByOne(index) {
        if (index < spans.length) {
            var span = spans.eq(index);
            span.effect('bounce', {times: 1 }, 500, function() {
                // Appel récursif pour le prochain élément
                bounceOneByOne(index + 1);
            });
        } else {
            // Appel récursif infini
            bounceOneByOne(0);
        }
    }

    // Démarrez la séquence de rebonds
    bounceOneByOne(0);
});

