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

//****************    Define Game background, objects   ****************/
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
playerCharImage.src = "images/1shipsprite.png";
//playerCharImage.src = "images/zelda_spritesheet.png";

// the pride image: can be a princess, treasure, or a crown, or anything you prefer it to be, Add more images
var prideReady = false;
var prideImage = new Image();
prideImage.onload = function () {
	prideReady = true;
};
//prideImage.src = "images/pride.png";
prideImage.src = "images/aprincess.png";

// explosion images -> plan to have it when the collision happen. What do you think?
var explosionReady = false;
var explosionImage = new Image();
explosionImage.onload = function () {
	explosionReady = true;
};
explosionImage.src = "images/explosion_spritesheet.png";

/*****************************   Main Loop of the game     *************************/
// Game objects 
// for regular object imagge
var playerChar = {
	speed: 256,
	x: 0,
	y: 0,
	width: 64,
	height: 64
};

// main object manipulated by keyboard left, up, right, down
/* var playerChar = {
	speed: 256, // movement in pixels per second
	x: 0,  // x,y coordinates to render the sprite
	y: 0,
	srcX: 0, // x, y coordinates of the canvas to get the single frame
	scrY: 0,
	currentFrame: 4,
	column: 5,  // equal frame count
	row: 4,
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
	//width: this.sheetWidth/this.column,
	//height: this.sheetHeight/this.row 
};*/

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
	trackExplosion: 2,
	sheetWidth: 300,
	sheetHeight: 300,
	//width: this.sheetWidth/this.column,
	//height: this.sheetHeight/this.row,
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
};

// Update game objects
var update = function (modifier) {
	//update the frame index  for animation -> need more work to make it work in our code 
	//playerChar.currentFrame = ++playerChar.currentFrame % playerChar.column;
	// calculate the x coordinate for spritesheeet 
	//playerChar.srcX = playerChar.currentFrame * playerChar.sheetWidth/ playerChar.column;

	if (38 in keysDown) { // Player holding up 
		playerChar.y -= playerChar.speed * modifier; // make the object move fater or lower
		if (playerChar.y < (boarderTopLen)) {
			playerChar.y = boarderTopLen;
		}

	}
	if (40 in keysDown) { // Player holding down
		playerChar.y += playerChar.speed * modifier;
		if (playerChar.y > (canvas.height - (boarderTopLen + playerChar.height - buffer *3/2))) {
			playerChar.y = canvas.height - (boarderTopLen + playerChar.height - buffer * 3/2);
		}
	}
	if (37 in keysDown) { // Player holding left
		playerChar.x -= playerChar.speed * modifier ;
		if (playerChar.x < (boarderLeftLen - buffer)) {
			playerChar.x = boarderTopLen - buffer ;
		}
	}
	if (39 in keysDown) { // Player holding right
		playerChar.x += playerChar.speed * modifier;
		if (playerChar.x > (canvas.width - (boarderLeftLen + playerChar.width - buffer))) {
			playerChar.x = canvas.width - (boarderLeftLen + playerChar.width - buffer);
		}
	}

	destroyer.x = destroyer.x + (4 * destroyer.direction);
	if (destroyer.x >= canvas.width - boarderLeftLen - destroyer.width) { // go right
		destroyer.direction = -1;
	}
	if (destroyer.x <= boarderTopLen) {   // go left
		destroyer.direction = 1;
	}

	destroyer.y = destroyer.y + (4 * destroyer.direction);
	if (destroyer.y >= canvas.height - boarderTopLen - destroyer.height) {  // go top
		destroyer.direction = -1.5;
	}
	if (destroyer.y <= boarderTopLen) {   // go bottom 
		destroyer.direction = 0.8;
	}

	// Are they touching?

	if (
		playerChar.x <= (pride.x + pride.width) // touch from right of pride
		&& pride.x <= (playerChar.x + playerChar.width) // touch from the left
		&& playerChar.y <= (pride.y + playerChar.height) // touch from the top
		&& pride.y <= (playerChar.y + pride.height)  // touch from the bottom 
	) {

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

	// When playerChar was touched by destroyer
	if (
		playerChar.x  <= (destroyer.x + destroyer.width)
		&& destroyer.x <= (playerChar.x + playerChar.width)
		&& playerChar.y <= (destroyer.y + playerChar.height)
		&& destroyer.y <= (playerChar.y + destroyer.height)
	) {
		alert("The mission was failed!");
		keysDown = {};
		pridesCaught = 0;
		soundEfx.src = soundFailed;
		soundEfx.play();
		reset();
	}
};



// Draw everything
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
		ctx.drawImage(playerCharImage, playerChar.x, playerChar.y);
		// For animation 
		//ctx.drawImage(playerCharImage, playerChar.srcX, playerChar.srcY, playerChar.width, playerChar.height, playerChar.x, playerChar.y, playerChar.width, playerChar.height);
	}

	if (prideReady) {
		ctx.drawImage(prideImage, pride.x, pride.y);
	}

	if (destroyerReady) {
		ctx.drawImage(destroyerImage, destroyer.x, destroyer.y);
	}

};

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