/**
 * Fly Clicker
 * Daniel Michurov
 * 
 * A game where you just press a button and get lots and lots of flies!
 * 
 * After a few flies collected, you can buy upgrades for your fly-collecting adventures.
 * 
 * Made with p5
 * https://p5js.org/
 */

let fliesCollected = 0;

// Our fly
// Has a position, size, and speed of horizontal movement
const flyButton = {
    x: 320,
    y: 240,
    size: 50
};

/**
 * This will be called just before the blue variation starts
 */
function blueSetup() {
    createCanvas(640, 480);
    fliesCollected = 0;
}

/**
 * This will be called every frame when the blue variation is active
 */
function blueDraw() {
    background("#87ceeb");
    drawFly();

    drawHUD();
}

// draws all the HUD elements: fly counter and the upgrades
function drawHUD()
{
    drawText(20, 0, "Flies collected: " + fliesCollected, 90, 35);
    drawText(15, 0, "Collect as many flies as possible by clicking the centre fly! (to eat them later...)", width/2, height - 25);
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {
    push();
    noStroke();
    fill("#000000");
    ellipse(flyButton.x, flyButton.y - 20, flyButton.size, flyButton.size + 10);
    pop();

    push();
    noStroke();
    fill("#000000");
    ellipse(flyButton.x, flyButton.y + 20, flyButton.size, flyButton.size + 10);
    pop();

    push();
    noStroke();
    fill(255);
    ellipse(flyButton.x + 40, flyButton.y, flyButton.size + 20, flyButton.size-10);
    pop();

    push();
    noStroke();
    fill(255);
    ellipse(flyButton.x - 40, flyButton.y, flyButton.size + 20, flyButton.size-10);
    pop();
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from mouse to fly
    const d = dist(mouseX, mouseY, flyButton.x, flyButton.y);
    // Check if it's an overlap
    const collected = (d < 10 + flyButton.size/2);
    if (collected) {
        fliesCollected += 1;
    }
}


/**
 * This will be called whenever a key is pressed while the blue variation is active
 */
function blueKeyPressed(event) {
    if (event.keyCode === 27) {
        state = "menu";
    }
}

/**
 * This will be called whenever the mouse is pressed while the blue variation is active
 */
function blueMousePressed() {
    checkTongueFlyOverlap();
}