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


// palyerChar image 
var palyerCharReady = false;
var palyerCharImage = new Image();
palyerCharImage.onload = function () {
	palyerCharReady = true;
};
//palyerCharImage.src = "images/palyerChar.png";
palyerCharImage.src = "images/1shipsprite.png";

// spacestation image
var spacestationReady = false;
var spacestationImage = new Image();
spacestationImage.onload = function () {
	spacestationReady = true;
};
//spacestationImage.src = "images/spacestation.png";
spacestationImage.src = "images/spacestation.png";

/*****************************   Main Loop of the game     *************************/
// Game objects
var palyerChar = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0,
	width: 64,
	height: 64
};
var spacestation = {
	x: 0,
	y: 0,
	width: 85,
	height:85
};

var destroyer = {
	x: 500,
	y: 100,
	width: 64,
	height: 64,
	direction: 1
};

var spacestationsCaught = 0;
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

// Reset the game when the player catches a spacestation
var reset = function () {
	//Place the palyerChar in the middle of canvas
	palyerChar.x = canvas.width / 2;
	palyerChar.y = canvas.height / 2;

	//Place the spacestation somewhere on the screen randomly
	spacestation.x = boarderTopLen + (Math.random() * (canvas.width - 150));
	spacestation.y = boarderLeftLen + (Math.random() * (canvas.height - 148));
	destroyer.x = boarderLeftLen + (Math.random() * (canvas.width - 150));
	destroyer.y = boarderTopLen + (Math.random() * (canvas.height - 148));
	destroyer.direction = 1;
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up 
		palyerChar.y -= palyerChar.speed * modifier; // make the object move fater or lower
		if (palyerChar.y < (boarderTopLen)) {
			palyerChar.y = boarderTopLen;
		}

	}
	if (40 in keysDown) { // Player holding down
		palyerChar.y += palyerChar.speed * modifier;
		if (palyerChar.y > (canvas.height - (boarderTopLen + palyerChar.height - buffer *3/2))) {
			palyerChar.y = canvas.height - (boarderTopLen + palyerChar.height - buffer * 3/2);
		}
	}
	if (37 in keysDown) { // Player holding left
		palyerChar.x -= palyerChar.speed * modifier ;
		if (palyerChar.x < (boarderLeftLen - buffer)) {
			palyerChar.x = boarderTopLen - buffer ;
		}
	}
	if (39 in keysDown) { // Player holding right
		palyerChar.x += palyerChar.speed * modifier;
		if (palyerChar.x > (canvas.width - (boarderLeftLen + palyerChar.width - buffer))) {
			palyerChar.x = canvas.width - (boarderLeftLen + palyerChar.width - buffer);
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
		palyerChar.x <= (spacestation.x + spacestation.width) // touch from right of spacestation
		&& spacestation.x <= (palyerChar.x + palyerChar.width) // touch from the left
		&& palyerChar.y <= (spacestation.y + palyerChar.height) // touch from the top
		&& spacestation.y <= (palyerChar.y + spacestation.height)  // touch from the bottom 
	) {

		++spacestationsCaught;

		// insert play sounds where you want them to happen

		if (spacestationsCaught === 3) {
			// change sound effect and play it.
			soundEfx.src = soundGameOver;
			soundEfx.play();
			alert("you won");
			keysDown = {};
			spacestationsCaught = 0;
		} else {
			soundEfx.src = soundCaught;
			soundEfx.play();

		}

		reset();
	}

	// When palyerChar was touched by destroyer
	if (
		palyerChar.x  <= (destroyer.x + destroyer.width)
		&& destroyer.x <= (palyerChar.x + palyerChar.width)
		&& palyerChar.y <= (destroyer.y + palyerChar.height)
		&& destroyer.y <= (palyerChar.y + destroyer.height)
	) {
		alert("The mission was failed!");
		keysDown = {};
		spacestationsCaught = 0;
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

		// Score. Draw this before the spacestation, palyerChar, and destroyer. So the objects can be on the top of the test
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Destroyed: " + spacestationsCaught, boarderTopLen, boarderLeftLen);

	if (palyerCharReady) {
		ctx.drawImage(palyerCharImage, palyerChar.x, palyerChar.y);
	}

	if (spacestationReady) {
		ctx.drawImage(spacestationImage, spacestation.x, spacestation.y);
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