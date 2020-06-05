class Area {
	constructor(x, y, w, h, color, isMatch) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.color = color;
		this.isMatch = isMatch;
	}
}

class Level {
	constructor(areas) {
		this.areas = areas;
		this.match = areas.find((a) => a.isMatch);
	}
}

class Game {
	constructor(levels) {
		this.currentLevel = 0;
		this.levels = levels;
	}
}

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let square = {
	size: 35,
	x: 0,
	y: 0,
	dx: 0,
	dy: 0,
	speed: 6,
};

let areas = [
	new Area(0, 0, canvas.width, canvas.height / 2, '#e0892b', false),
	new Area(0, canvas.height / 2, canvas.width, canvas.height, '#122345', true),
];

let areas2 = [
	new Area(0, 0, canvas.width / 2, canvas.height / 2, '#e0892b', false),
	new Area(
		canvas.width / 2,
		0,
		canvas.width,
		canvas.height / 2,
		'#86db9b',
		false
	),
	new Area(
		0,
		canvas.height / 2,
		canvas.width / 2,
		canvas.height,
		'#122345',
		false
	),
	new Area(
		canvas.width / 2,
		canvas.height / 2,
		canvas.width,
		canvas.height,
		'#db72ac',
		true
	),
];

let levels = [new Level(areas), new Level(areas2)];

let game = new Game(levels);

let buttons = document.querySelectorAll('.btn');

let time = document.querySelector('.time');
let interval = '';

let score = document.querySelector('.score');

let request;

let popUp = document.querySelector('.pop-up');
let btnRestart = document.querySelector('.btn-restart');

let message = document.querySelector('.message');
const VICTORY = 'Congrats, you won!';
const DEFEAT = 'You lost :c';

// Events
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

buttons.forEach((btn) => {
	btn.addEventListener('mousedown', move);
	btn.addEventListener('mouseup', stop);
});

btnRestart.addEventListener('click', startGame);

startGame();

// Functions
function startGame() {
	popUp.style.display = 'none';
	game.currentLevel = 0;
	score.textContent = 0;

	update();
	startLevel();
}

function update() {
	clear();

	drawSquare();

	newPos();

	request = requestAnimationFrame(update);
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	setUpLevel();
}

function setUpLevel() {
	let index = game.currentLevel;
	let gameAreas = game.levels[index].areas;

	gameAreas.forEach((a) => {
		ctx.fillStyle = a.color;
		ctx.fillRect(a.x, a.y, a.w, a.h);
	});
}

function startLevel() {
	square.x = 0;
	square.y = 0;
	square.dx = 0;
	square.dy = 0;

	time.textContent = '5';

	interval = window.setInterval(updateTimer, 1000);
}

function drawSquare() {
	let index = game.currentLevel;

	ctx.fillStyle = game.levels[index].match.color;
	ctx.fillRect(square.x, square.y, square.size, square.size);

	ctx.strokeStyle = '#94cfff';
	ctx.strokeRect(square.x, square.y, square.size, square.size);
}

function keyDown(e) {
	if (e.key === 'ArrowRight' || e.key === 'Right') {
		moveRight();
	} else if (e.key === 'ArrowLeft' || e.key === 'Left') {
		moveLeft();
	} else if (e.key === 'ArrowUp' || e.key === 'Up') {
		moveUp();
	} else if (e.key === 'ArrowDown' || e.key === 'Down') {
		moveDown();
	}
}

function move(e) {
	let classList = e.target.classList;

	if (classList.contains('btn--up') || classList.contains('arrow--up')) {
		moveUp();
	}

	if (classList.contains('btn--left') || classList.contains('arrow--left')) {
		moveLeft();
	}

	if (classList.contains('btn--down') || classList.contains('arrow--down')) {
		moveDown();
	}

	if (classList.contains('btn--right') || classList.contains('arrow--right')) {
		moveRight();
	}
}

function moveRight() {
	square.dx = square.speed;
}

function moveLeft() {
	square.dx = -square.speed;
}

function moveUp() {
	square.dy = -square.speed;
}

function moveDown() {
	square.dy = square.speed;
}

function stop() {
	square.dx = 0;
	square.dy = 0;
}

function keyUp(e) {
	if (
		e.key === 'ArrowRight' ||
		e.key === 'Right' ||
		e.key === 'ArrowLeft' ||
		e.key === 'Left' ||
		e.key === 'ArrowUp' ||
		e.key === 'Up' ||
		e.key === 'ArrowDown' ||
		e.key === 'Down'
	) {
		stop();
	}
}

function checkCollision() {
	// Detect left wall
	if (square.x < 0) {
		square.x = 0;
	}

	// Detect right wall
	if (square.x + square.size > canvas.width) {
		square.x = canvas.width - square.size;
	}

	// Detect top wall
	if (square.y < 0) {
		square.y = 0;
	}

	// Detect bottom wall
	if (square.y + square.size > canvas.height) {
		square.y = canvas.height - square.size;
	}
}

function newPos() {
	square.x += square.dx;
	square.y += square.dy;

	checkCollision();
}

function updateTimer() {
	time.textContent = parseInt(time.textContent) - 1;

	if (time.textContent === '0') {
		clearInterval(interval);

		if (isMatch()) {
			score.textContent = parseInt(score.textContent) + 1;
			game.currentLevel++;

			if (gameEnded()) {
				window.cancelAnimationFrame(request);
				message.textContent = VICTORY;
				popUp.style.display = 'flex';
				return;
			}
			startLevel();
		} else {
			window.cancelAnimationFrame(request);
			message.textContent = DEFEAT;
			popUp.style.display = 'flex';
			return;
		}
	}
}

function isMatch() {
	let index = game.currentLevel;
	let areaMatch = game.levels[index].match;

	// check if square is inside x axe
	if (!isInsideXAxe(areaMatch)) return false;

	// check if square is inside y axe
	if (isInsideYAxe(areaMatch)) return true;

	return false;
}

function isInsideXAxe(area) {
	return square.x >= area.x && square.x + square.size <= area.x + area.w;
}

function isInsideYAxe(area) {
	return square.y >= area.y && square.y + square.size <= area.y + area.h;
}

function gameEnded() {
	return game.currentLevel >= game.levels.length;
}
