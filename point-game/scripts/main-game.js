document.addEventListener("DOMContentLoaded", function () {
  const gameContainer = document.querySelector(".game-container");
  const canvasContainer = document.querySelector(".canvas-container");
  const canvas = document.getElementById("gridCanvas");
  const ctx = canvas.getContext("2d");

  let nbCol = 0;
  let nbRow = 0;

  const s = parseInt(localStorage.getItem('size'));
  console.log(s);

  switch (s) {
    case 1:
      nbCol = 15;
      nbRow = 15;
      break;
    case 2:
      nbCol = 18;
      nbRow = 24;
      break;
    case 3:
      nbCol = 40;
      nbRow = 40;
      break;
    case 4:
      nbCol = 25;
      nbRow = 36;
      break;

    default:
      break;
  }

  let numColumns = nbCol + 2;
  let numRows = nbRow + 2;
  console.log(numColumns + '/' + numRows);
  let _offsetX = 0;
  let _offsetY = 0;

  // Calculer la taille d'une cellule en fonction du nombre de colonnes et de lignes
  let cellSize = 21;
  const cellSizeRef = 27.75;
  let lineScale = cellSize / cellSizeRef;

  // Stocker les coordonnées des points des joueurs
  const player1Points = [];
  const player2Points = [];

  const colorsHex = {
    "Rouge": "#FF0000",
    "Bleu": "#0000FF",
    "Vert": "#008000",
    "Jaune": "#FFFF00",
    "Orange": "#FFA500",
    "Violet": "#800080",
    "Rose": "#FFC0CB",
    "Marron": "#A52A2A",
    "Cyan": "#00FFFF",
    "Vert clair": "#00FF00",
    "Noir": "#000000",
    "Gris": "#808080"
  };

  // Couleurs des joueurs
  const player1Color = colorsHex[localStorage.getItem("couleurJoueur1")];
  const player2Color = colorsHex[localStorage.getItem("couleurJoueur2")];

  // Noms des joueurs
  const player1Name = localStorage.getItem("nomJoueur1");
  const player2Name = localStorage.getItem("nomJoueur2");

  // Matrice de plateau
  const grid = Array.from({ length: numRows }, () => Array(numColumns).fill(0));

  // Variables du jeu
  let currentPlayer = 1;
  let score = [0, 0];
  let tempScore = 0;
  let countScore = 0;

  let secondValidation = false;

  // Variables du circuit
  let debX, debY;
  let xyList = [[], []];

  let circuitList1 = [];
  let circuitList2 = [];
  // Regrouper circuitList1 et circuitList2 dans une seule variable circuitPlayerList
  let circuitList = [circuitList1, circuitList2];

  function drawGrid(cellSize) {
    _offsetX = 4 * cellSize;
    _offsetY = 2 * cellSize;
    let coeffX = (1 / 8);
    let coeffY = (2 / 3);

    canvas.width = (numColumns - 2) * cellSize + _offsetX + coeffX * _offsetX;
    canvas.height = (numRows - 2) * cellSize + _offsetY + coeffY * _offsetY;

    const canvasWidth = Math.min(canvas.width + 5, gameContainer.clientWidth - 50);
    canvasContainer.style.width = `${canvasWidth}px`;

    const canvasHeight = Math.min(canvas.height + 5, gameContainer.clientHeight - 150);
    canvasContainer.style.height = `${canvasHeight}px`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#ccc";

    // Dessiner les trois lignes équidistantes entre chaque ligne existante
    for (let y = - cellSize / 2 + _offsetY; y <= canvas.height - coeffY * _offsetY; y += cellSize) {
      let distance = cellSize / 4; // Distance entre chaque ligne équidistante
      for (let i = 1; i <= 3; i++) {
        if (((y + cellSize) >= canvas.height - coeffY * _offsetY) && (i == 3)) {
          break;
        }
        ctx.beginPath();
        ctx.moveTo(0, y + distance * i);
        ctx.lineTo(canvas.width, y + distance * i);

        ctx.strokeStyle = "#4455C9CC"; // Couleur bleu-violet
        ctx.lineWidth = 0.3 * lineScale; // Épaisseur de ligne
        ctx.stroke();
      }
    }

    // Dessiner les lignes horizontales
    for (let y = cellSize / 2 + _offsetY; y <= canvas.height - coeffY * _offsetY; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);

      ctx.strokeStyle = "#4455C9CC"; // Couleur bleu-violet
      ctx.lineWidth = 0.85 * lineScale; // Épaisseur de ligne
      ctx.stroke();
    }

    // Dessiner les lignes verticales
    for (let x = cellSize / 2 + _offsetX; x <= canvas.width - coeffX * _offsetX; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);

      if (x == cellSize / 2 + _offsetX) {
        ctx.strokeStyle = "#FF0000CC"; // Couleur de la marge
      } else {
        ctx.strokeStyle = "#4455C9CC"; // Couleur bleu-violet
      }

      ctx.lineWidth = 0.85 * lineScale; // Épaisseur de ligne
      ctx.stroke();
    }

    // Dessiner les points des joueurs
    drawPlayerPoints(player1Points, player1Color);
    drawPlayerPoints(player2Points, player2Color);
  }

  // Dessiner les points des joueurs
  function drawPlayerPoints(points, color) {
    ctx.fillStyle = color;
    for (let point of points) {
      ctx.beginPath();
      ctx.arc(point.x * cellSize + cellSize / 2 + _offsetX, point.y * cellSize + cellSize / 2 + _offsetY, cellSize * 0.105, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  /**************************************************** */
  /**************************************************** */

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
    window.location.href = "result.html";
  });


  /**************************************************** */
  /**************************************************** */

  // Variable pour suivre l'état actuel du minuteur
  let timerPaused = false;
  let startPause = 0;
  let endPause = 0;
  let timePaused = 0;

  // Variable pour stocker le temps restant lors de la pause
  let remainingTimeSeconds = 0;

  // Gestionnaire d'événements pour le bouton "Pause/Reprendre"
  const pauseResumeButton = document.getElementById("pauseResumeButton");
  pauseResumeButton.addEventListener("click", function () {
    if (timerPaused) {
      // Reprendre le minuteur
      timerPaused = false;
      $('#gridCanvas').show();
      endPause = Date.now();
      timePaused += Math.round((endPause - startPause) / 1000);

      // Mettre à jour le texte du bouton
      pauseResumeButton.textContent = "Pause";
    } else {
      // Mettre en pause le minuteur
      timerPaused = true;
      $('#gridCanvas').hide();

      startPause = Date.now();
      // Mettre à jour le texte du bouton
      pauseResumeButton.textContent = "Reprendre";
    }
  });


  // Définir la durée du minuteur en secondes (5 minutes dans cet exemple)
  let tD = localStorage.getItem("dureeJeu");
  const timerDuration = tD * 60; // 5 minutes * 60 secondes
  const turnStartGame = Date.now();

  // Fonction pour mettre à jour le minuteur et gérer la fin du jeu
  function updateTimer() {
    if (!timerPaused && (tD != 99)) {
      const currentTurnElement = document.getElementById("currentTurn");
      const currentTime = Math.max(0, timePaused + timerDuration - Math.floor((Date.now() - turnStartGame) / 1000)); // Correction ici
      const minutes = Math.floor(currentTime / 60);
      const seconds = currentTime % 60;

      currentTurnElement.textContent = `Temps restant: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

      // Vérifier si le temps est écoulé
      if (currentTime <= 0) {
        // Arrêter le minuteur et terminer le jeu
        clearInterval(timerInterval);
        // Ajoutez ici le code pour gérer la fin du jeu (par exemple, afficher un message de fin, réinitialiser le jeu, etc.)
      }
    }
  }

  // Vous devez stocker l'ID renvoyé par setInterval pour pouvoir le nettoyer si nécessaire
  const timerInterval = setInterval(updateTimer, 1000);


  // Fonction pour afficher un minuteur au format mm:ss
  function formatTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Fonction pour mettre à jour le minuteur
  function updateReflectionTime() {
    const tR = localStorage.getItem("tempsReflexion");
    if (!timerPaused && (tR != 0)) {
      // Durée totale de chaque tour (en secondes, y compris le temps de réflexion)
      const turnDurationSeconds = tR; // 10 secondes de réflexion

      // Obtenir l'élément HTML pour afficher le minuteur
      const timerElement = document.getElementById("timer");

      // Obtenir le temps écoulé depuis le début du tour (en secondes)
      const currentTimeSeconds = Math.floor((Date.now() - turnStartTime) / 1000);

      // Calculer le temps restant
      remainingTimeSeconds = turnDurationSeconds - currentTimeSeconds + timePaused;

      // Mettre à jour le contenu de l'élément HTML avec le minuteur formaté
      timerElement.textContent = formatTimer(remainingTimeSeconds);

      // Si le temps de réflexion est écoulé, changer de tour
      if (remainingTimeSeconds <= 0) {
        // Changer de joueur pour le tour suivant
        currentPlayer = currentPlayer === 1 ? 2 : 1;

        updateCurrentTurn();

        // Réinitialiser le temps de début du tour
        turnStartTime = Date.now();
      }
    }
  }

  // Variable pour enregistrer le temps de début du tour
  let turnStartTime = Date.now();

  // Appeler la fonction de mise à jour du minuteur chaque seconde
  setInterval(updateReflectionTime, 1000);

  // Appeler la fonction de mise à jour du minuteur immédiatement pour l'initialiser
  updateReflectionTime();

  // Affichage des coordonnées de la souris
  const mousePositionDisplay = document.getElementById("mousePosition");

  // Gestionnaire d'événement de survol de la souris sur le canvas
  canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - _offsetX;
    const mouseY = event.clientY - rect.top - _offsetY;

    const col = Math.floor(mouseX / cellSize) + 1;
    const row = Math.floor(mouseY / cellSize) + 1;

    const centerX = (col - 1) * cellSize + cellSize / 2 + _offsetX;
    const centerY = (row - 1) * cellSize + cellSize / 2 + _offsetY;

    if (col > 0 && col < numColumns - 1 && row > 0 && row < numRows - 1) {
      redraw(cellSize);
      drawIndicator(centerX, centerY); // Dessiner le cercle bleu indicateur de la zone
    }

    // Afficher les coordonnées de la souris
    // mousePositionDisplay.textContent = "Position de la souris : (" + col + "," + row + ")";
  });

  // Gestionnaire d'événement de clic sur le canvas
  canvas.addEventListener("click", function (event) {
    let searcher;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left - _offsetX;
    const clickY = event.clientY - rect.top - _offsetY;

    const col = Math.floor(clickX / cellSize) + 1;
    const row = Math.floor(clickY / cellSize) + 1;

    const centerX = (col - 1) * cellSize + cellSize / 2 + _offsetX;
    const centerY = (row - 1) * cellSize + cellSize / 2 + _offsetY;

    if (col > 0 && col < numColumns - 1 && row > 0 && row < numRows - 1) {
      // Vérifier si la cellule est déjà occupée par un point d'un joueur
      if (grid[row][col] === 0) {
        // Réinitialiser le temps de début du tour pour le joueur actuel
        turnStartTime = Date.now();

        const currentPlayerPoints = currentPlayer === 1 ? player1Points : player2Points;
        currentPlayerPoints.push({ x: (col - 1), y: (row - 1) });
        grid[row][col] = currentPlayer;

        debX = col;
        debY = row;

        searcher = buildUpCircuit(col, row, xyList, circuitList, 0, 0);

        if (!searcher || tempScore == 0) {
          // Changer de joueur pour le tour suivant
          currentPlayer = currentPlayer === 1 ? 2 : 1;
        }

        score[currentPlayer - 1] += tempScore;
        localStorage.setItem('score' + currentPlayer, score[currentPlayer - 1]);

        tempScore = 0;
        xyList = [[], []];

        // Réinitialiser le temps de début du tour pour le joueur suivant
        turnStartTime = Date.now();

        redraw(cellSize);
        drawIndicator(centerX, centerY); // Dessiner le cercle bleu indicateur de la zone
      }
    }

  });


  // Définir des seuils min et max pour cellSize
  const minCellSize = 21; // Taille minimale de cellule
  const maxCellSize = 100; // Taille maximale de cellule

  const zoomSlider = document.getElementById("zoomSlider");
  zoomSlider.min = minCellSize;
  zoomSlider.max = maxCellSize;
  zoomSlider.value = cellSize;

  canvas.addEventListener("wheel", function (e) {
    e.preventDefault();
    const delta = Math.sign(e.deltaY); // Direction de la molette (1 pour haut, -1 pour bas)
    const zoomFactor = delta > 0 ? 1 / 1.1 : 1.1; // Facteur de zoom en fonction de la direction

    // Calculer la nouvelle taille de cellule après zoom
    const newCellSize = cellSize * zoomFactor;

    // Vérifier si la nouvelle taille est dans les limites
    adaptSize(newCellSize)

    zoomSlider.value = cellSize;
  });

  zoomSlider.addEventListener("input", function () {
    const newCellSize = parseInt(zoomSlider.value);
    adaptSize(newCellSize);
  });

  function adaptSize(size) {
    cellSize = (size <= minCellSize) ? minCellSize : (size >= maxCellSize) ? maxCellSize : cellSize;
    if (size >= minCellSize && size <= maxCellSize) {
      cellSize = size;
      lineScale = cellSize / cellSizeRef

      redraw(cellSize);
    }
  }

  function isInCircuit(x, y, _circuit) {
    for (let coords of _circuit) {
      if (coords[0] === x && coords[1] === y) {
        return true;
      }
    }
    return false;
  }

  function isCaugth(x, y, circuit) {
    let temp = false;
    for (let j = y + 1; j < numRows - 1; j++) {
      if (isInCircuit(x, j, circuit)) {
        temp = true;
        break;
      }
      temp = false;
    }
    if (temp) {
      for (let j = y - 1; j >= 0; j--) {
        if (isInCircuit(x, j, circuit)) {
          temp = true;
          break;
        }
        temp = false;
      }
    }
    return temp;
  }

  function isPalindrome(c1, c2) {
    const n = c1.length;
    if (n != c2.length) {
      return false;
    }
    for (let i = 0; i < Math.floor(n / 2); i++) {
      if (c1[i][0] !== c2[n - 1 - i][0] || c1[i][1] !== c2[n - 1 - i][1]) {
        return false;
      }
    }
    return true;
  }

  function copyCircuit(circuit) {
    const circuitCopy = [];
    for (let i = 0; i < circuit.length; i++) {
      circuitCopy.push([circuit[i][0], circuit[i][1]]);
    }
    return circuitCopy;
  }

  function isCaughtByNonSubCircuit(gridCopy, beginX, x, y) {
    let out = false;
    let tempPlayer = ((gridCopy[y][x] - 1) % 3) + 1;
    let other = tempPlayer == 1 ? 2 : 1;

    for (let j = x - 1; j > beginX; j--) {
      let currentJ = (gridCopy[y][j] - 1) % 3;
      if (currentJ == other - 1) {
        for (const c of circuitList[other - 1]) {
          if (isInCircuit(j, y, c)) {
            out = true;
            break;
          }
        }
        if (out) {
          break;
        }
      }
    }
    return out;
  }

  function catchOpponent(circuit) {
    countScore = 0;
    // Créez une copie de la grille pour effectuer les actions
    let gridCopy = grid.map(row => [...row]);

    let previousX = -1;
    let previousY = -1;

    // Recherche de gauche à doite à partir de chaque point du circuit
    for (let i = 0; i < circuit.length - 1; i++) {
      const y = circuit[i][1];
      let check = false;
      let beginX = circuit[i][0];
      let endX;
      for (let x = circuit[i][0] + 1; x < numRows - 1; x++) {
        if (!check && isInCircuit(x, y, circuit)) {
          beginX = x; // beginX++;
          continue;
        }
        check = true;
        if (check && isInCircuit(x, y, circuit)) {
          endX = x;
          break;
        }
        if (x === numRows - 2) {
          check = false;
        }
      }

      if (check & !(beginX == previousX && y == previousY)) {
        for (let x = beginX + 1; x < endX; x++) {
          if (gridCopy[y][x] != currentPlayer && isCaugth(x, y, circuit)) {
            if (gridCopy[y][x] > 3) {
              let caught = isCaughtByNonSubCircuit(gridCopy, beginX, x, y);
              if (!caught) {
                return false;
              }
            }
            if (gridCopy[y][x] < 3) {
              if (gridCopy[y][x] != 0) {
                countScore++;
              }
              secondValidation = true;
              gridCopy[y][x] += 3;
            }
          }
        }
      }

      previousX = beginX;
      previousY = y;
    }

    // Enregistrez les changements dans la grille d'origine
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        grid[j][i] = gridCopy[j][i];
      }
    }

    return true;
  }

  function validateCircuit(circuit, circuitList) {
    for (let i = circuitList[currentPlayer - 1].length - 1; i >= 0; i--) {
      let palindromeCheck = isPalindrome(circuit, circuitList[currentPlayer - 1][i]);
      if (palindromeCheck) {
        return false;
      }
    }

    let firstValidation = catchOpponent(circuit);

    if (firstValidation && secondValidation) {
      circuitList[currentPlayer - 1].push(circuit);
      tempScore += countScore;
    }

    return (firstValidation && secondValidation);
  }

  function reliable(x, y, leng) {
    if (grid[y][x] === currentPlayer) {
      for (let i = leng; i > 0; i--) {
        if (x === xyList[currentPlayer - 1][i][0] && y === xyList[currentPlayer - 1][i][1]) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  function unlike(i, j, apart) {
    if (i == 0 && j == 0) {
      return false;
    }

    switch (apart) {
      /*   i
         j 1-2-3
           4- -6
           7-8-9 */
      case 1:
        // bd-d-b
        return ((i == 1 && j == 1) || (i == 1 && j == 0) || (i == 0 && j == 1)) ? false : true;
      case 2:
        // b-g-d-bg-bd
        return ((i == 0 && j == 1) || (i == -1 && j == 0) || (i == 1 && j == 0) || (i == -1 && j == 1) || (i == 1 && j == 1)) ? false : true;
      case 3:
        // bg-g-b
        return ((i == -1 && j == 1) || (i == -1 && j == 0) || (i == 0 && j == 1)) ? false : true;
      case 4:
        // d-h-b-hd-bd
        return ((i == 1 && j == 0) || (i == 0 && j == -1) || (i == 0 && j == 1) || (i == 1 && j == -1) || (i == 1 && j == 1)) ? false : true;
      case 6:
        // g-h-b-hg-bg 
        return ((i == -1 && j == 0) || (i == 0 && j == -1) || (i == 0 && j == 1) || (i == -1 && j == -1) || (i == -1 && j == 1)) ? false : true;
      case 7:
        // hd-h-d
        return ((i == 1 && j == -1) || (i == 0 && j == -1) || (i == 1 && j == 0)) ? false : true;
      case 8:
        // h-g-d-hg-hd
        return ((i == 0 && j == -1) || (i == -1 && j == 0) || (i == 1 && j == 0) || (i == -1 && j == -1) || (i == 1 && j == -1)) ? false : true;
      case 9:
        // hg-g-h
        return ((i == -1 && j == -1) || (i == -1 && j == 0) || (i == 0 && j == -1)) ? false : true;
      default:
        return true;
    }
  }

  function buildUpCircuit(x, y, xyList, circuitList, apart, counter) {
    let buildedUp = false;

    xyList[currentPlayer - 1].push([x, y]); // à l'indice counter

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let u = unlike(j, i, apart);
        let r = reliable(x + j, y + i, counter - 1);

        if (u && r) {
          if ((x + j === debX) && (y + i === debY)) {
            xyList[currentPlayer - 1].push([x + j, y + i]); // à l'indice counter + 1

            // Fermer le circuit en ajoutant une copie des coordonnées de xyList à circuitList
            const xyListCopy = copyCircuit(xyList[currentPlayer - 1]);

            let validation = validateCircuit(xyListCopy, circuitList);

            secondValidation = false;

            xyList[currentPlayer - 1].splice(counter);

            return validation;
          }
          else {
            let _apart = (j === -1 && i === -1) ? 1 : (j === 0 && i === -1) ? 2 : (j === 1 && i === -1) ? 3 : (j === -1 && i === 0) ? 4 : (j === 1 && i === 0) ? 6 : (j === -1 && i === 1) ? 7 : (j === 0 && i === 1) ? 8 : (j === 1 && i === 1) ? 9 : apart;
            let recursiveBuildUp = buildUpCircuit(x + j, y + i, xyList, circuitList, _apart, counter + 1);

            if (recursiveBuildUp) {
              buildedUp = true;
            }
          }
        }
      }
    }

    xyList[currentPlayer - 1].pop();
    return buildedUp;
  }

  // Dessiner le cercle bleu indicateur de la zone
  function drawIndicator(x, y) {
    ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
    ctx.strokeStyle = "rgba(0, 0, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(x, y, cellSize * 0.25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  // Dessiner le circuit fermé
  function drawClosedCircuit() {
    // Parcourir chaque circuit fermé dans circuitList
    for (let i = 0; i < circuitList.length; i++) {
      let c = circuitList[i];
      let color = (i == 0) ? player1Color : player2Color;

      for (let i = 0; i < c.length; i++) {
        const circuit = c[i];

        ctx.beginPath();
        for (let j = 0; j < circuit.length; j++) {
          const x = circuit[j][0] * cellSize - cellSize / 2;
          const y = circuit[j][1] * cellSize - cellSize / 2;

          if (j === 0) {
            ctx.moveTo(x + _offsetX, y + _offsetY);
          } else {
            ctx.lineTo(x + _offsetX, y + _offsetY);
          }
        }

        ctx.fillStyle = color + "26";
        ctx.fill();
        ctx.strokeStyle = color + "CC";
        ctx.lineWidth = 1 * lineScale; // Épaisseur de ligne
        ctx.stroke();

        ctx.closePath();
      }
    }
  }

  // Mettre à jour le score dans le HTML
  function updateScores() {
    const scorePlayer1Element = document.getElementById("scorePlayer1");
    const scorePlayer2Element = document.getElementById("scorePlayer2");
    scorePlayer1Element.textContent = `${player1Name}: ${score[0]}`;
    scorePlayer2Element.textContent = `${player2Name}: ${score[1]}`;
  }

  // Mettre à jour le current turn dans le HTML
  function updateCurrentTurn() {
    const gameContainer = document.querySelector(".game-container");
    gameContainer.style.backgroundColor = currentPlayer === 1 ? player1Color + "BF" : player2Color + "BF";
  }

  function redraw(cellSize) {
    drawGrid(cellSize);
    updateScores();
    updateCurrentTurn();
    drawClosedCircuit(); // Dessiner le circuit fermé
    // displayMatrix();
  }

  // Fonction pour afficher la matrice
  function displayMatrix() {
    const matrixDisplay = document.getElementById("matrixDisplay");
    let matrixHTML = "<h3>Matrice du plateau :</h3><table>";
    for (let i = 0; i < numRows; i++) {
      matrixHTML += "<tr>";
      for (let j = 0; j < numColumns; j++) {
        matrixHTML += `<td>${grid[i][j]}</td>`;
      }
      matrixHTML += "</tr>";
    }
    matrixHTML += "</table>";
    matrixDisplay.innerHTML = matrixHTML;
  }

  redraw(cellSize);

  const offsetX = (canvasContainer.scrollWidth - canvasContainer.clientWidth) / 2;
  const offsetY = (canvasContainer.scrollHeight - canvasContainer.clientHeight) / 2;
  canvasContainer.scrollTo(offsetX, offsetY);
});
