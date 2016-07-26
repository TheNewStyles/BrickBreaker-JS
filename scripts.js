//Pure javascript for breakout game

// canvas variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// ball variables
var x = canvas.width/2;
var y = canvas.height-16;
var dx = 2;
var dy = -2;
var ballRadius = canvas.width/48;

// paddle variables
var paddleHeight = canvas.width/48;
var paddleWidth = canvas.width/6.4;
var paddleX = (canvas.width-paddleWidth)/2;

// event variables
var rightPressed = false;
var leftPressed = false;
var mouseX = 0;
var canvasPos = getPosition(canvas);

// brick variables
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = canvas.width/6.4;
var brickHeight = canvas.width/24;
var brickPadding = canvas.width/48;
var brickOffsetTop = canvas.width/16;
var brickOffsetLeft = canvas.width/16;

//score variables
var score = 0;
var lives = 3;

//creat brick array
var bricks = [];
for(c=0; c<brickColumnCount; c++){
	bricks[c] = [];
	for(r=0; r<brickRowCount; r++){
		//assign status
		bricks[c][r] = {x:0, y:0, status: 1};
	}
}

// handlers - listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

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

function mouseMoveHandler(e){
	mouseX = e.clientX - canvasPos.x;
	if (mouseX > 0 && mouseX < canvas.width){
		paddleX = mouseX - paddleWidth/2;
	}	
}

//mouse helper function
function getPosition(el) {
  var xPosition = 0;
   
  while (el) {
    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);    
    el = el.offsetParent;
  }
  return {
    x: xPosition,   
  };
}      


//functions for bricks, score, ball, and paddle
function drawScore(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: "+score, 15, 15);
} 

function drawLives(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Lives: "+lives, canvas.width-70, 15);
}

function drawBricks(){
	for(c=0; c<brickColumnCount; c++){
		for(r=0; r<brickRowCount; r++){
			if(bricks[c][r].status == 1){
				//xy cooridinates for bricks
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
	            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				//create each brick
				ctx.beginPath();
				ctx.rect(brickX,brickY,brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}			
		}
	}
}

function collisionDetection(){
	for(c=0; c<brickColumnCount; c++){
		for(r=0; r<brickRowCount; r++){
			var b = bricks[c][r];
			//The x position of the ball is greater than the x position of the brick.
			//The x position of the ball is less than the x position of the brick plus its width.
			//The y position of the ball is greater than the y position of the brick.
			//The y position of the ball is less than the y position of the brick plus its height.
			if(b.status == 1){
				if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
					dy = -dy;
					b.status = 0;
					score++;
					if(score == brickRowCount * brickColumnCount){
						alert("You won!");
						document.location.reload();						
					}
				}	
			}		
		}
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
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();

	// if ball gets to top of canvas reverse direction
	if(y + dy < ballRadius){
		dy = -dy;
	//if the ball gets to the bottom game over	
	}else if(y + dy > canvas.height-ballRadius){
		if(x > paddleX && x < paddleX + paddleWidth){
			dy = -dy
		}
		else{
			lives--;
			if(!lives){
				//alert("Game over");
				document.location.reload();				
			}
			else{
				x = canvas.width/2;
				y = canvas.height-16;
				dx = 2;
				dy = -2;
				paddleX = (canvas.width-paddleWidth)/2;
			}
		}		
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

	requestAnimationFrame(draw);
}

draw();



///   Phaser framework breakoutgame
var game = new Phaser.Game(480, 320, Phaser.AUTO, phaserGame, { 
	preload: preload, create: create, update: update
	});

var ball;
var paddle;
var bricksP;
var newBrick;
var brickInfo;


function preload() {
	game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
	game.scale.pageAlignhorizontally = true;
	game.scale.pageAlignVertically = true;
	game.stage.backgroundColor = '#eee';

	game.load.image('ball', 'ball.png');
	game.load.image('paddle', 'paddle.png');
	game.load.image('brick', 'brick.png');

}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.checkCollision.down = false;

	ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
	ball.anchor.set(0.5);
	game.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.set(1);
	ball.body.velocity.set(150,-150);

	paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
    paddle.anchor.set(0.5,1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

    initBricks();
}

function update() {
	game.physics.arcade.collide(ball,paddle);
	paddle.x = game.input.x || game.world.width*0.5;

	ball.checkWorldBounds = true;
	ball.events.onOutOfBounds.add(function(){
    	//alert('Game over!');
    	location.reload();
	}, this);	
}

function initBricks() {
    brickInfo = {
        width: 50,
        height: 20,
        count: {
            row: 7,
            col: 3
        },
        offset: {
            top: 50,
            left: 60
        },
        padding: 10
    }
    bricksP = game.add.group();
    for(c=0; c<brickInfo.count.col; c++) {
        for(r=0; r<brickInfo.count.row; r++) {
            var brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
            newBrick = game.add.sprite(brickX, brickY, 'brick');
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricksP.add(newBrick);
        }
    }
}