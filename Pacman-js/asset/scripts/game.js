/** @format */

const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x, y, width, height);
};

//#region Variable declaration
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
let state = 0; // 0: Play mode 1: Mode clear interval
let lives = 3;
let ghostCount = 5;
let ghostImageLocations = [
	{ x: 0, y: 0 },
	{ x: 176, y: 0 },
	{ x: 0, y: 121 },
	{ x: 176, y: 121 },
	{ x: 20, y: 20 },
];

let gameInterval;

// Game variables
let fps = 30;
let pacman;
let oneBlockSize = 20;
let score = 0;
let ghosts = [];
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let powerUpCount = 10;

let map = generateMaze("#canvas", oneBlockSize);

//#endregion

let randomTargetsForGhosts = [
	{ x: 1 * oneBlockSize, y: 1 * oneBlockSize },
	{ x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
	{ x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
	{
		x: (map[0].length - 2) * oneBlockSize,
		y: (map.length - 2) * oneBlockSize,
	},
];

let init = () => {
	map = generateMaze("#canvas", oneBlockSize);
	restartPacmanAndGhosts();
	lives = 3;
	score = 0;
	clearInterval(gameInterval);
	if (lives == 3) gameInterval = setInterval(gameLoop, 1000 / fps);
	createNewPacman();
	createGhosts();
	gameLoop();
};

let continueGame = () => {
	map = generateMaze("#canvas", oneBlockSize);
	restartPacmanAndGhosts();
	lives += 3;
	if (lives > 10) lives = 10;
	powerUpCount += 7;
	if (powerUpCount > 15) powerUpCount = 15;
	ghostCount++; // Augmenter le nombre de fantomes
	clearInterval(gameInterval);
	if (lives >= 3) gameInterval = setInterval(gameLoop, 1000 / fps);
	createNewPacman();
	createGhosts();
	gameLoop();
	console.log("okok");
};

let createNewPacman = () => {
	pacman = new Pacman(
		oneBlockSize,
		oneBlockSize,
		oneBlockSize,
		oneBlockSize,
		oneBlockSize / 5
	);
};

function isWinner() {
	let i, j;
	// Si on rencontre 1 seul nourutire dans la carte, la partie n'est donc pas terminé
	for (i = 0; i < map.length; i++) {
		for (j = 0; j < map[0].length; j++) {
			if (map[i][j] == 2) return false;
		}
	}
	return true;
}

function sayMessage(_message) {
	canvasContext.fillStyle = "#fff";
	canvasContext.font = "20px Emulogic";
	canvasContext.fillText(_message, 120, 200);
}

let gameLoop = () => {
	draw();
	update();
};

let restartPacmanAndGhosts = () => {
	createNewPacman();
	createGhosts();
};

function gameOver() {
	sayMessage("Game over. Press Enter key to replay...");
	clearInterval(gameInterval);
	window.addEventListener("keypress", (e) => {
		if (e.keyCode == 13) {
			// Touche Entrer du clavier
			if (lives != 0) return;
			// La touche "entrer du clavier"
			init(); // Refaire une partie
		}
	});
}

function breakWall() {
	if (powerUpCount == 0) return;
	let position = pacman.getDirectionForward();
	if (!isDesctructible(position)) return;
	map[position.y][position.x] = 0;
	createRect(
		position.x * oneBlockSize,
		position.y * oneBlockSize,
		oneBlockSize,
		oneBlockSize,
		"red"
	);
	powerUpCount--;
}

// Detecter les collisions sur les ghosts (fantomes)
function onGhostCollision() {
	lives--;
	if (lives == 0) {
		// si le joueur n'a plus de vie, alors, c'est gameOver
		gameOver();
	}
	restartPacmanAndGhosts();
}

let update = () => {
	pacman.moveProcess();
	pacman.eat(); // Manger les aliments
	if (isWinner()) {
		continueGame();
	}
	updateGhosts(); // Mettre a jour les positions des fantomes
	if (pacman.checkGhostCollision(ghosts)) {
		onGhostCollision();
	}
};

let drawFoods = () => {
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] == 2) {
				createRect(
					j * oneBlockSize + oneBlockSize / 3,
					i * oneBlockSize + oneBlockSize / 3,
					oneBlockSize / 3,
					oneBlockSize / 3,
					"#FEB897"
				);
			}
		}
	}
};

// Verifier que le mur a detruire n'est pas une limite de zone
let isDesctructible = (pos) => {
	/* Ne peut pas être detruit si:
		→ C'est une mur de lilitation de zone
		→ C'est une nourriture
		→ C'est une chemin sans mur
	*/
	if (
		pos.x == 0 || // Les murs de limitation de zone en haut
		pos.x == map.length - 1 || // Les murs de limitation de zone en bas
		pos.y == 0 || // Les murs de limitation de zone à gauche
		pos.y == map.length - 1 || // Les murs de limitation de zone à droite
		map[pos.y][pos.x] != 1 // Ce n'est pas un mur
	) {
		return false;
	}
	return true;
};

// Dessiner le nombre de vie restant
let drawRemainingLives = () => {
	canvasContext.font = "20px Emulogic"; // Font
	canvasContext.fillStyle = "white";
	canvasContext.fillText("Lives: ", 100, oneBlockSize * (map.length + 1));

	for (let i = 0; i < lives; i++) {
		// Dessigner des pacman representnt le nombre de vie restant
		canvasContext.drawImage(
			pacmanFrames,
			2 * oneBlockSize,
			0,
			oneBlockSize,
			oneBlockSize,
			175 + i * oneBlockSize,
			oneBlockSize * map.length + 2,
			oneBlockSize,
			oneBlockSize
		);
	}
};

let drawScore = () => {
	canvasContext.font = "20px Emulogic";
	canvasContext.fillStyle = "white";
	canvasContext.fillText(
		"Score: " + score,
		0,
		oneBlockSize * (map.length + 1)
	);
};

// Nombre de power up restant
const drawPowerUp = () => {
	canvasContext.fillStyle = "#fff";
	canvasContext.fillText(
		"Power up : " + powerUpCount,
		385,
		canvas.height - oneBlockSize
	);
};

// Regroper tout les dessins a chaque frame du jeu
let draw = () => {
	canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Vider l'affichage
	createRect(0, 0, canvas.width, canvas.height, "black");
	drawWalls(); // Dessinner les murs
	drawFoods(); // Dessinner les nourritures
	drawGhosts(); // Dessinner les fantomes
	pacman.draw(); // Dessinner le pacman
	drawPowerUp(); // Dessinner le nombre de power up restant (detruire les murs)
	drawScore(); // Dessinner le score
	drawRemainingLives(); // Dessinner le nombre de vie restant
};

let drawWalls = () => {
	// Dessinner un cube representant un mur si son correspendant dans la variable map est a 1
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] == 1) {
				// C'est un mur
				createRect(
					j * oneBlockSize,
					i * oneBlockSize,
					oneBlockSize,
					oneBlockSize,
					"#342DCA"
				);
			}
		}
	}
};

let ghostSpawnPoint = [
	// Les points d'apparitions des fantômes
	{ x: 20, y: 460 },
	{ x: 460, y: 460 },
	{ x: 460, y: 20 },
];

let getRandomspawnPoint = () => {
	// Prendre aleatoirement une position des fantomes
	let index = Math.round(Math.random() * 2);
	return ghostSpawnPoint[index];
};

let createGhosts = () => {
	// Creer les fantomes
	ghosts = [];
	for (let i = 0; i < ghostCount; i++) {
		const spawnPoint = getRandomspawnPoint(); // Avoir une point d'apparition par hasard dans les points de spawn
		let newGhost = new Ghost(
			spawnPoint.x,
			spawnPoint.y,
			oneBlockSize,
			oneBlockSize,
			pacman.speed / 2, // Rapidité de deplacement du fantome en cours
			ghostImageLocations[i % 4].x, // Couleur du fantomes
			ghostImageLocations[i % 4].y, // Couleur du fantomes
			124,
			116,
			6 + i
		);
		ghosts.push(newGhost); // Ajouter le fantome ainsi crée
	}
};

init(); // Commencer le jeu

window.addEventListener("keydown", (event) => {
	let k = event.keyCode;
	setTimeout(() => {
		if (k == 37 || k == 81) {
			// left arrow or q
			pacman.nextDirection = DIRECTION_LEFT;
		} else if (k == 38 || k == 90) {
			// up arrow or z
			pacman.nextDirection = DIRECTION_UP;
		} else if (k == 39 || k == 68) {
			// right arrow or d
			pacman.nextDirection = DIRECTION_RIGHT;
		} else if (k == 40 || k == 83) {
			// bottom arrow or s
			pacman.nextDirection = DIRECTION_BOTTOM;
		} else if (k == 82) {
			onGhostCollision();
		} else if (k == 66) {
			// touche "b" clavier
			breakWall();
		}
	}, 1);
});

// Afficher / masquer le menu d'aide
$(document).ready(function () {
	$(".commands").hide();
	$(".help").click(function () {
		$(".commands").hasClass("visible")
			? $(".commands").hide().removeClass("visible")
			: $(".commands").show().addClass("visible");
	});
});
