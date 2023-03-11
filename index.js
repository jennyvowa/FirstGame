// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 600;
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
	y: 0
};
var spacestation = {
	x: 0,
	y: 0
};

var destroyer = {
	x: 500,
	y: 100,
	direction: 1
};

var spacestationsCaught = 0;

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
	shipsprite.x = canvas.width / 2;
	shipsprite.y = canvas.height / 2;

	//Place the spacestation somewhere on the screen randomly
	spacestation.x = 32 + (Math.random() * (canvas.width - 150));
	spacestation.y = 32 + (Math.random() * (canvas.height - 148));
	destroyer.x = 32 + (Math.random() * (canvas.width - 150));
	destroyer.y = 32 + (Math.random() * (canvas.height - 148));
	destroyer.direction = 1;
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		shipsprite.y -= shipsprite.speed * modifier;
		if (shipsprite.y < (32)) {
			shipsprite.y = 32;
		}

	}
	if (40 in keysDown) { // Player holding down
		shipsprite.y += shipsprite.speed * modifier;
		if (shipsprite.y > (1000 - (81))) {
			shipsprite.y = 1000 - 81;
		}
	}
	if (37 in keysDown) { // Player holding left
		shipsprite.x -= shipsprite.speed * modifier;
		if (shipsprite.x < (21)) {
			shipsprite.x = 21;
		}
	}
	if (39 in keysDown) { // Player holding right
		shipsprite.x += shipsprite.speed * modifier;
		if (shipsprite.x > (1000 - (32 + 55))) {
			shipsprite.x = 1000 - (32 + 55);
		}
	}

	destroyer.x = destroyer.x + (4 * destroyer.direction);
	if (destroyer.x > 900) {
		destroyer.direction = -1;
	}
	if (destroyer.x < 50) {
		destroyer.direction = 1;
	}

	destroyer.y = destroyer.y + (4 * destroyer.direction);
	if (destroyer.y > 900) {
		destroyer.direction = -1.5;
	}
	if (destroyer.y < 50) {
		destroyer.direction = 0.5;
	}

	// Are they touching?

	if (
		shipsprite.x + 5 <= (spacestation.x + 81)
		&& spacestation.x <= (shipsprite.x + 55)
		&& shipsprite.y <= (spacestation.y + 83)
		&& spacestation.y <= (shipsprite.y + 52)
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
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (btReady) {
		ctx.drawImage(btImage, 0, 0);
		ctx.drawImage(btImage, 0, 1000 - 32);
	}

	if (blReady) {
		ctx.drawImage(blImage, 0, 0);
		ctx.drawImage(blImage, 1000 - 32, 0);
	}


	if (shipspriteReady) {
		ctx.drawImage(shipspriteImage, shipsprite.x, shipsprite.y);
	}

	if (spacestationReady) {
		ctx.drawImage(spacestationImage, spacestation.x, spacestation.y);
	}

	if (destroyerReady) {
		ctx.drawImage(destroyerImage, destroyer.x, destroyer.y);
	}
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Space Stations Destroyed: " + spacestationsCaught, 32, 32);
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