// canvas variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// ball variables
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

// paddle variables
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

// event variables
var rightPressed = false;
var leftPressed = false;

// handlers
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e){
	if(e.keyCode == 39){
		rightPressed = true;
	}
	else if(e.keyCode == 37){
		leftPressed = true;
	}
}

function keyUpHandler(e){
	if(e.keyCode == 39){
		rightPressed = false;
	}
	else if(e.keyCode == 37){
		leftPressed = false;
	}
}

function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();

	// if ball gets to top of canvas reverse direction
	if(y + dy < ballRadius){
		dy = -dy;
	//if the ball gets to the bottom game over	
	}else if(y + dy > canvas.height-ballRadius){
		alert("Game Over");
		document.location.reload();
	}
	// if ball gets to either side of the canvas reverse direction
	if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){
		dx = -dx;
	}

	// move paddle right
	if(rightPressed && paddleX < canvas.width-paddleWidth){
		paddleX +=7;
	}
	// move paddle left
	else if(leftPressed && paddleX > 0){
		paddleX -=7;
	}


	// increment xy cooridinates
	x += dx;
	y += dy;
}

setInterval(draw, 10);