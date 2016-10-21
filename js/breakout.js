// Environment variables
var canvas = document.getElementById("breakoutCanvas");
var context = canvas.getContext("2d");

// Player variables
var score = 0;
var lives = 3;

// Paddle variables
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;

// Ball variables
var x = canvas.width/2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

// Brick variables
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
// Initialize empty bricks
var bricks = [];
for (column = 0; column < brickColumnCount; column++) {
    bricks[column] = [];
    for (row = 0; row < brickRowCount; row++) {
        bricks[column][row] = { x: 0, y: 0, status: 1 };
    }
}

KEY_CODES = {
  32: 'space',
  37: 'left',
  39: 'right',
}

KEY_STATUS = { keyDown:false };
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}

$(window).keydown(function (e) {
  KEY_STATUS.keyDown = true;
  if (KEY_CODES[e.keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[e.keyCode]] = true;
  }
}).keyup(function (e) {
  KEY_STATUS.keyDown = false;
  if (KEY_CODES[e.keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[e.keyCode]] = false;
  }
});

// Key press statuses
var rightPressed = false;
var leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Key press handers
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode = 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

//
function collisionDetection() {
    for (column = 0; column < brickColumnCount; column++) {
        for (row = 0; row < brickRowCount; row++) {
            var brick = bricks[column][row];
            if (brick.status == 1) {
                if (x + ballRadius > brick.x && x - ballRadius < brick.x + brickWidth && y + ballRadius > brick.y && y - ballRadius < brick.y + brickHeight) {
                    // If ball hits brick on left or right
                    if(y > brick.y && y < brick.y + brickHeight) {
                        dx = -dx;
                    } else {
                        // If ball hits brick on top or bottom
                        dy = -dy;
                    }

                    brick.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        document.location.reload();
                        renderText('You win!')
                    }
                }
            }
        }
    }
}

// Drawing Functions
function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI*2);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}

function drawBricks() {
    for (column = 0; column < brickColumnCount; column++) {
        for (row = 0; row < brickRowCount; row++) {
            if (bricks[column][row].status == 1) {
                var brickX = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[column][row].x = brickX;
                bricks[column][row].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = "#0095DD";
                context.fill();
                context.closePath();
            }
        }
    }
}

function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Lives: "+lives, canvas.width-65, 20);
}

// Main drawing function
function draw() {
    // Drawing code
    context.clearRect(0,0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    collisionDetection();

    // Game logic

    // Ball right edge bounces off right wall,
    // or left edge bounces off left wall
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
    }

    // Ball top edge bounces off top wall,
    // or ball bottom edge bounces off paddle top
    // or ball bottom edge bounces falls below bottom wall,
    if(y + dy < ballRadius) {
            dy = -dy;
    } else if (y + dy > canvas.height - ballRadius - paddleHeight && x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        lives--;
        if(!lives) {
            document.location.reload();
            renderText('Game over');
        }
        else {
            x = canvas.width/2;
            y = canvas.height-30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width-paddleWidth)/2;
        }
    }

    // Keyboard arrow key movements
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
    }

    // Ball movement
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

function renderText(text) {
    context.font = "30px Helvetica";
    context.fillStyle = "#0095DD";
    context.textAlign = "center";
    context.fillText(text, canvas.width/2, canvas.height/2);
}


renderText('Click here to start');
$(window).one('click', function() {
    draw();
});
