let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let square = {
	size: 35,
	x: 0,
	y: 0,
	dx: 0,
	dy: 0,
	speed: 6,
	color: '#6a82a6',
};

let buttons = document.querySelectorAll('.btn');

// Events
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

buttons.forEach((btn) => {
	btn.addEventListener('mousedown', move);
	btn.addEventListener('mouseup', stop);
});

update();

// Functions
function drawSquare() {
	ctx.fillStyle = square.color;
	ctx.fillRect(square.x, square.y, square.size, square.size);
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function update() {
	clear();

	drawSquare();

	newPos();

	requestAnimationFrame(update);
}
