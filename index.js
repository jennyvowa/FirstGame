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
bgImage.src = "images/background.jpg";


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


// shipsprite image 
var shipspriteReady = false;
var shipspriteImage = new Image();
shipspriteImage.onload = function () {
	shipspriteReady = true;
};
//shipspriteImage.src = "images/shipsprite.png";
shipspriteImage.src = "images/1shipsprite.png";

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
var shipsprite = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0,
	width: 62,
	height: 49
};
var spacestation = {
	x: 0,
	y: 0,
	width: 60,
	height:75
};

var destroyer = {
	x: 500,
	y: 100,
	width: 75,
	height: 70,
	direction: 1
};

var spacestationsCaught = 0;
var boarderTopLength = 30;
var boarderLeftLenth = 20;

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
	//Place the shipsprite in the middle of canvas
	shipsprite.x = canvas.width / 2;
	shipsprite.y = canvas.height / 2;

	//Place the spacestation somewhere on the screen randomly
	spacestation.x = boarderTopLength + (Math.random() * (canvas.width - 150));
	spacestation.y = boarderTopLength + (Math.random() * (canvas.height - 148));
	destroyer.x = boarderTopLength + (Math.random() * (canvas.width - 150));
	destroyer.y = boarderTopLength + (Math.random() * (canvas.height - 148));
	destroyer.direction = 1;
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		shipsprite.y -= shipsprite.speed * modifier; // make the object move fater or lower
		if (shipsprite.y < (boarderTopLength)) {
			shipsprite.y = boarderTopLength;
		}

	}
	if (40 in keysDown) { // Player holding down
		shipsprite.y += shipsprite.speed * modifier;
		if (shipsprite.y > (canvas.height - (boarderTopLength + shipsprite.height ))) {
			shipsprite.y = canvas.height - (boarderTopLength + shipsprite.height);
		}
	}
	if (37 in keysDown) { // Player holding left
		shipsprite.x -= shipsprite.speed * modifier;
		if (shipsprite.x < (boarderLeftLenth)) {
			shipsprite.x = boarderTopLength ;
		}
	}
	if (39 in keysDown) { // Player holding right
		shipsprite.x += shipsprite.speed * modifier;
		if (shipsprite.x > (canvas.width - (boarderLeftLenth + shipsprite.width))) {
			shipsprite.x = canvas.width - (boarderLeftLenth + shipsprite.width);
		}
	}

	destroyer.x = destroyer.x + (4 * destroyer.direction);
	if (destroyer.x >= canvas.width - boarderLeftLenth - destroyer.width) { // go right
		destroyer.direction = -1;
	}
	if (destroyer.x <= boarderTopLength) {   // go left
		destroyer.direction = 1;
	}

	destroyer.y = destroyer.y + (4 * destroyer.direction);
	if (destroyer.y >= canvas.height - boarderTopLength - destroyer.height) {  // go top
		destroyer.direction = -1.5;
	}
	if (destroyer.y <= boarderTopLength) {   // go bottom 
		destroyer.direction = 0.8;
	}

	// Are they touching?

	if (
		shipsprite.x <= (spacestation.x + shipsprite.x) // touch from right of spacestation
		&& spacestation.x <= (shipsprite.x + spacestation.height) // touch from the left
		&& shipsprite.y <= (spacestation.y + shipsprite.width) // touch from the top
		&& spacestation.y <= (shipsprite.y + spacestation.height)  // touch from the bottom 
	) {

		++spacestationsCaught;

		// insert play sounds where you want them to happen

		if (spacestationsCaught === 3) {
			// change sound effect and play it.
			soundEfx.src = soundGameOver;
			soundEfx.play();
			alert("you won");
			spacestationsCaught = 0;
		} else {
			soundEfx.src = soundCaught;
			soundEfx.play();
		}

		reset();
	}

	// When shipsprite was touched by destroyer
	if (
		shipsprite.x + 5 <= (destroyer.x + 64)
		&& destroyer.x <= (shipsprite.x + 55)
		&& shipsprite.y <= (destroyer.y + 64)
		&& destroyer.y <= (shipsprite.y + 52)
	) {
		alert("The mission was failed!");
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
		ctx.drawImage(btImage, 0, canvas.height - 32);
	}

	if (blReady) {
		ctx.drawImage(blImage, 0, 0);
		ctx.drawImage(blImage, canvas.width - 32, 0);
	}

		// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Destroyed: " + spacestationsCaught, 32, 32);

	if (shipspriteReady) {
		ctx.drawImage(shipspriteImage, shipsprite.x, shipsprite.y);
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