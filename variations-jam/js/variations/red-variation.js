/**
 * First Person FrogFrogFrog
 * Daniel michurov
 * 
 * A game of catching flies with your frog-tongue, but in first person! kind of...
 * 
 * Move the crosshair with your mouse and click to eat flies.
 * 
 * Made with p5
 * https://p5js.org/
 */

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 20,
    speed: 5
};

// total flies eaten
let fliesEaten = 0;

// total clicks the player performed, used for accuracy calculations
let totalClicks = 0;

// win condition, how many flies needed to eat
let winCon = 10;

// handles the state of this game
let gameOneState = false;

/**
 * This will be called just before the red variation starts
 */
function redSetup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();
    noCursor();
}

/**
 * This will be called every frame when the red variation is active
 */
function redDraw() {
    if (gameOneState)
    {
        drawEndScreen();
        return;
    }

    drawGame();
}

function drawGame()
{   
    background("#87ceeb");
    moveFly();
    drawFly();
    drawCrosshair();
    drawHUD();
}

// draws the crosshair as a red circle, as a way to indicating its the tongue
function drawCrosshair()
{
    push();
    noStroke();
    fill('red');
    ellipse(mouseX, mouseY, 30);
    pop();
}

function drawHUD()
{
    drawText(20, 0, "Flies eaten: " + fliesEaten, width - 90, 35);
    drawText(15, 0, "Eat 10 flies as accurately as possible!", width/2, height - 25);
}

function drawEndScreen()
{
    // calculates and formats the accuracy percentage
    let accuracyScore = nf((fliesEaten/totalClicks)*100, 0, 0);

    background(0);

    // draws the victory texts
    drawText(50, 255, "You win!", width/2, (height/2)-50);
    drawText(32, 255, "Accuracy: " + accuracyScore + "%", width/2, height/2);
}

function drawText(tS, tF, theText, textX, textY)
{
    textAlign(CENTER, CENTER);
    textSize(tS);
    fill(tF);
    noStroke();
    text(theText, textX, textY);
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    // Move the fly
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width) {
        resetFly();
    }
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

/**
 * Resets the fly to the left with a random y
 */
function resetFly() {
    fly.x = 0;
    fly.y = random(0, 300);
}

/**
 * Moves the crosshair along with your mouse movement.
 */
function moveCrosshair() {
    frog.body.x = mouseX;
}

/**
 * Handles the crosshair aim overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(mouseX, mouseY, fly.x, fly.y);
    // Check if it's an overlap
    const eaten = (d < 15 + fly.size/2);
    if (eaten) {
        // adds to the total score
        fliesEaten += 1;
        // checks if player has eaten 10 flies for the win condition
        if(fliesEaten == winCon)
        {
            gameOneState = true;
        }

        // Reset the fly
        resetFly();
    }
}

/**
 * This will be called whenever a key is pressed while the red variation is active
 */
function redKeyPressed(event) {
    if (event.keyCode === 27) {
        state = "menu";
    }
}

/**
 * This will be called whenever the mouse is pressed while the red variation is active
 * 
 * when clicked, it checks to see if the player's cursor overlaps with the fly
 */
function redMousePressed() {
    // fixes bug where you can keep clicking and decreasing your accuracy score in the victory screen
    if (gameOneState)
    {
        return;
    }

    totalClicks += 1;
    checkTongueFlyOverlap();
}