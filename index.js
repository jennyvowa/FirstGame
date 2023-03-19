// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 750;
document.body.appendChild(canvas);

// SoundFx
var soundGameOver = "sounds/gameOver.wav"; //Game Over sound efx
var soundCaught = "sounds/caught.wav"; //Game Over sound efx
var soundFailed = "sounds/fail.wav"; //Failed sound efx
//Assign audio to soundEfx
var soundEfx = document.getElementById("soundEfx");

//****************    Define Game background, objects - loading images for objects  ****************/
// Background image
var bgReady = false;
var bgImage = new Image(); // call image object in HTML 
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/house.jpg";

// border image L-R
var blReady = false;
var blImage = new Image();
blImage.onload = function () {
	blReady = true;
};
blImage.src = "images/BorderLeft.jpg";

// border image T-B
var btReady = false;
var btImage = new Image();
btImage.onload = function () {
	btReady = true;
};
btImage.src = "images/BorderTop.jpg";

// destroyer image
var destroyerReady = false;
var destroyerImage = new Image();
destroyerImage.onload = function () {
	destroyerReady = true;
};
destroyerImage.src = "images/destroyer.jpg";


// playerChar image 
var playerCharReady = false;
var playerCharImage = new Image();
playerCharImage.onload = function () {
	playerCharReady = true;
};
playerCharImage.src = "images/zelda_spritesheet.png";

// the pride image: can be a princess, treasure, or a crown, or anything you prefer it to be, Add your images here
var prideReady = false;
var prideImage = new Image();
prideImage.onload = function () {
	prideReady = true;
};
prideImage.src = "images/aprincess.png";

// explosion images -> plan to have it when the collision happen. What do you think?
var explosionReady = false;
var explosionImage = new Image();
explosionImage.onload = function () {
	explosionReady = true;
};
explosionImage.src = "images/aspider_pre.png";


/*****************************   Main Loop of the game     *************************/
// Game objects 

// main object manipulated by keyboard left, up, right, down
var playerChar = {
	speed: 256, // movement in pixels per second
	x: 0,  // x,y coordinates to render the sprite sheet
	y: 0,
	srcX: 0, // x, y coordinates of the canvas to get the single frame 
	scrY: 0,
	currentFrame: 0,  // start on the left frame
	column: 5,  // equal frame count or framesPerRowCount, columns of the sprite sheet
	row: 4,  // rows of the sprite sheet
	trackLeft: 0, // the right row for the movement 
	trackRight: 1,
	trackUp: 2,
	trackDown: 3,
	moveLeft: false,
	moveRight: false,
	moveUp: false,
	moveDown: true,
	sheetWidth: 320, // size of sprite sheet
	sheetHeight: 256,
	width: 320/5,  // equal oneSpriteWidth
	height: 256/4,    // equal oneSpriteHeight
	counter: 0
};

// The object is hit 3 times by the main objects to win the game
var pride = {
	x: 0,
	y: 0,
	width: 38,
	height: 48
};

// obstacle objects
var destroyer = {
	x: 500,
	y: 100,
	width: 64,
	height: 64,
	direction: 1
};

// display when main object touching destroyer. Can use it for animation as well
var explosion = {
	x: 0,
	y: 0,
	column: 6,
	row: 6,
	srcX: 0, // x, y coordinates of the canvas to get the single frame 
	scrY: 2 * 300/6,
	trackExplosion: 2,
	sheetWidth: 300,
	sheetHeight: 300,
	width: 49,
	height: 41,
	direction: 1
};

var pridesCaught = 0;
var boarderTopLen = 32;
var boarderLeftLen = 32;
var buffer = 10

// Handle keyboard controls
var keysDown = {}; // object were we add up to 4 properties when keys go down
// and then delete them when the key goes up

addEventListener("keydown", function (e) {
	console.log(e.keyCode + " down")
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	console.log(e.keyCode + " up")
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a pride
var reset = function () {
	//Place the playerChar in the middle of canvas
	playerChar.x = canvas.width / 2;
	playerChar.y = canvas.height / 2;

	//Place the pride somewhere on the screen randomly
	pride.x = boarderTopLen + (Math.random() * (canvas.width - 150));
	pride.y = boarderLeftLen + (Math.random() * (canvas.height - 148));
	destroyer.x = boarderLeftLen + (Math.random() * (canvas.width - 150));
	destroyer.y = boarderTopLen + (Math.random() * (canvas.height - 148));
	destroyer.direction = 1;
	explosion.x = pride.x + 50;
	explosion.y = pride.y + Math.random()*10 + 50;
	explosion.direction = 1;
};

// Update game objects
var update = function (modifier) {
	// clear last player image posistion and assume he is not moving
	ctx.clearRect(playerChar.x, playerChar.y, playerChar.width, playerChar.height);
	playerChar.moveLeft = false;
	playerChar.moveRight = false;
	playerChar.moveUp = false;
	playerChar.moveDown = false;
	

	if (38 in keysDown) { // Player holding up 
		playerChar.y -= playerChar.speed * modifier; // make the object move fater or lower
		if (playerChar.y < (boarderTopLen)) {
			playerChar.y = boarderTopLen - buffer;
		}
		playerChar.moveLeft = false;
		playerChar.moveRight = false;
		playerChar.moveUp = true;
		playerChar.moveDown = false;
	}
	if (40 in keysDown) { // Player holding down
		playerChar.y += playerChar.speed * modifier;
		if (playerChar.y > (canvas.height - (boarderTopLen + playerChar.height - buffer/2))) {
			playerChar.y = canvas.height - (boarderTopLen + playerChar.height - buffer);
		}
		playerChar.moveLeft = false;
		playerChar.moveRight = false;
		playerChar.moveUp = false;
		playerChar.moveDown = true;
	}
	if (37 in keysDown) { // Player holding left
		playerChar.x -= playerChar.speed * modifier ;
		if (playerChar.x < (boarderLeftLen)) {
			playerChar.x = boarderTopLen - buffer *2;
		}
		playerChar.moveLeft = true;
		playerChar.moveRight = false;
		playerChar.moveUp = false;
		playerChar.moveDown = false;
	}
	if (39 in keysDown) { // Player holding right
		playerChar.x += playerChar.speed * modifier;
		if (playerChar.x > (canvas.width - (boarderLeftLen + playerChar.width - buffer))) {
			playerChar.x = canvas.width - (boarderLeftLen + playerChar.width - buffer * 2);
		}
		playerChar.moveLeft = false;
		playerChar.moveRight = true;
		playerChar.moveUp = false;
		playerChar.moveDown = false;
	}

	moveObjects(destroyer);
	moveObjects(explosion);

	// Are they touching? // player touch the 

	if ( isTouching(playerChar, pride)) 
	{
		++pridesCaught;
		// insert play sounds where you want them to happen
		if (pridesCaught === 3) {
			// change sound effect and play it.
			soundEfx.src = soundGameOver;
			soundEfx.play();
			alert("you won");
			keysDown = {};
			pridesCaught = 0;
		} else {
			soundEfx.src = soundCaught;
			soundEfx.play();
		}
		reset();
	}

	//for animation after touching 
	//curXFrame = ++curXFrame % framesPerRowCount; 	//equal cols, Updating the sprite frame index  
	//slow animation if walking or whatever doesn't look good
	//add a counter varible to only change frame every nth loop

	if (playerChar.counter == playerChar.column) {  // adjust this to change "walking speed" of animation
        playerChar.currentFrame = ++playerChar.currentFrame % playerChar.column; 	//Updating the sprite frame index 
        // it will count 0,1,2,0,1,2,0, etc
        playerChar.counter = 0;
    } else {
        playerChar.counter++;
    }

	// it will count 0,1,2,0,1,2,0, etc
	playerChar.srcX = playerChar.currentFrame * playerChar.width;   	//Calculating the x coordinate for spritesheet 
	//if left is true,  pick Y dim of the correct row
	if (playerChar.moveLeft) {
		//calculate srcY 
		playerChar.srcY = playerChar.trackLeft * playerChar.height; // row index in sheet * sprite height
	}
	//if the right is true, pick Y dim of the correct row
	if (playerChar.moveRight) {
		//calculating y coordinate for spritesheet
		playerChar.srcY = playerChar.trackRight * playerChar.height;
	}
	if (playerChar.moveUp) {
		//calculate srcY 
		playerChar.srcY = playerChar.trackUp * playerChar.height;
	}
	//if moveDown is true
	if (playerChar.moveDown) {
		//calculating y coordinate for spritesheet
		playerChar.srcY = playerChar.trackDown * playerChar.height;
	}
	// player not moving, pick an image at row index 3, column 0 in the spritesheet
	if (playerChar.moveLeft == false && playerChar.moveRight == false & playerChar.moveUp == false && playerChar.moveDown == false) {
		playerChar.srcX = 0 * playerChar.width;
		playerChar.srcY = 3 * playerChar.height;
	}

	//explosion.srcX = 0;
	//explosion.srcX = 100;
	// When playerChar and destroyer touch each other
	gameOver(playerChar, destroyer);
	gameOver(playerChar, explosion);

};

// Draw objects
var render = function () {
	// Draw backgroud first, then draw other objects on the top of background 
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	if (btReady) {
		ctx.drawImage(btImage, 0, 0);
		ctx.drawImage(btImage, 0, canvas.height - boarderTopLen);
	}
	if (blReady) {
		ctx.drawImage(blImage, 0, 0);
		ctx.drawImage(blImage, canvas.width - boarderLeftLen, 0);
	}
	// Score. Draw this before the pride, playerChar, and destroyer. So the objects can be on the top of the test
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Destroyed: " + pridesCaught, boarderTopLen, boarderLeftLen);
	if (playerCharReady) {
		// For animation 
		ctx.drawImage(playerCharImage, playerChar.srcX, playerChar.srcY, playerChar.width, playerChar.height, playerChar.x, playerChar.y, playerChar.width, playerChar.height);
	}
	if (prideReady) {
		ctx.drawImage(prideImage, pride.x, pride.y);
	}
	if (destroyerReady) {
		ctx.drawImage(destroyerImage, destroyer.x, destroyer.y);
	}
	if (explosionReady) {
		//ctx.drawImage(explosionImage, explosion.srcX, explosion.srcY, explosion.width, explosion.height, explosion.x, explosion.y, explosion.width, explosion.height);
		ctx.drawImage(explosionImage, explosion.x, explosion.y);
	}
};

// Helper functions
function isTouching (player, object) {
	return (player.x >= (object.x - player.width/2) // touch from left of pride
	&& player.x <= (object.x + object.width * 3/4) // touch from the right
	&& player.y >= (object.y - player.height * 3/4) // touch from the top
	&& player.y <= (object.y + object.height * 3/4) ) // touch from the bottom
};

function moveObjects (object) {
	object.x = object.x + (4 * object.direction);
	if (object.x >= canvas.width - boarderLeftLen - object.width) { // go right
		object.direction = Math.random() * (-2);
	}
	if (object.x <= boarderTopLen) {   // go left
		object.direction = Math.random() * 2;
	}

	object.y = object.y + (4 * object.direction);
	if (object.y >= canvas.height - boarderTopLen - object.height) {  // go top
		object.direction = -1.5;
	}
	if (object.y <= boarderTopLen) {   // go bottom 
		object.direction = 0.8;
	}
}

function gameOver (player, destroyer){
	if ( isTouching(player, destroyer)) 
	{
		alert("The mission was failed!");
		keysDown = {};
		pridesCaught = 0;
		soundEfx.src = soundFailed;
		soundEfx.play();
		reset();
	}
}
/************************* The main game loop   **********************/
var main = function () {
	// This chunk of code will be called over again by this: requestAnimationFrame(main);
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render(); 
	then = now;

	//  Request to do this again ASAP , call the main method over and over again, so our players can move and be re-drawn
	requestAnimationFrame(main);
};

/***********************    Let's play this game!   **************************/
var then = Date.now();
reset();
main(); // call the main loop