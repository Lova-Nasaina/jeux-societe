/** @format */

function generateMaze(_domElement, _cellSize) {
	const canvas = document.querySelector(_domElement);
	const ctx = canvas.getContext("2d");
	const cellSize = _cellSize; // Taille d'une cellule du labyrinthe
	const rows = Math.floor((canvas.height - 40) / cellSize);
	const cols = Math.floor(canvas.width / cellSize);
	const maze = new Array(rows).fill(null).map(() => new Array(cols).fill(1)); // initialisation

	function backtrack(x, y) {
		maze[y][x] = 2; // Marquer le point courant comme chemin (0)
		const directions = shuffleArray([
			{ dx: 0, dy: -1 }, // Haut
			{ dx: 0, dy: 1 }, // Bas
			{ dx: -1, dy: 0 }, // Gauche
			{ dx: 1, dy: 0 }, // Droite
		]);

		for (const { dx, dy } of directions) {
			const nx = x + dx * 2;
			const ny = y + dy * 2;

			if (
				nx >= 0 &&
				nx < cols &&
				ny >= 0 &&
				ny < rows &&
				maze[ny][nx] === 1
			) {
				maze[y + dy][x + dx] = 0;
				backtrack(nx, ny);
			}
		}
	}

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	backtrack(1, 1);

	// Dessiner le labyrinthe sur le canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			if (maze[y][x] === 1) {
				ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
			}
		}
	}
	return maze;
}
