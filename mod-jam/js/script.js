/**
 * Frogfrogfrog
 * Pippin Barr
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// Our frog
const frog = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 20,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    },

    movementSlogginess: 0.1
};

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 3
};

let titleScreenEnabled = true;
let canContinue = true;
let helpScreenEnabled = false;
let gameOver = false;

let frogStatus =
{
    hunger: 0,
    maxHunger: 100,
    hungerTimer: 0,
    hungerCooldown: 200,

    bar:
    {
        background:
        {
            // colour + alpha
            colour: 0,
            a: 100,

            // position
            x: 25,
            y: 25,

            // size
            w: 250,
            h: 20
        },

        fill:
        {
            // colour
            r: 255,
            g: 165,
            b: 0,

            // position
            x: 25,
            y: 25,

            // size
            w: undefined,
            h: 20
        }
    }
};

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();
}

function draw() {
    if (!titleScreenEnabled)
    {
        if (!gameOver)
        {
            frogGame();
            return;
        }

        handleGameOverScreen();
    }
    else
    {
        if (helpScreenEnabled)
        {
            helpScreen();
            return;
        }

        titleScreen();
    }
}

// draws the title screen
function titleScreen()
{
    drawBackground(true);

    simpleCenteredText(75, 255, 'DARK FLY', width/2, (height/2) - 25);
    
    simpleCenteredText(20, 200, 'Press Enter to start', width/2, (height/4*2.75));

    simpleCenteredText(20, 200, 'Press Spacebar for help', width/2, (height/4*3.25));
}

// draws the help screen.
function helpScreen()
{
    drawBackground(true);

    simpleCenteredText(25, 255, 'HELP', width/2, 25);
    
    simpleCenteredText(20, 255, 'Move the frog side to side with mouse cursor', width/2, (height/4));

    simpleCenteredText(20, 255, 'Press the left mouse button to shoot out your tongue', width/2, (height/4*1.5)); 

    simpleCenteredText(20, 255, 'Your hunger bar will gradully fill up, eating flies will lower it.', width/2, (height/4*2)); 

    simpleCenteredText(20, 255, 'If you let a fly escape, it will make the frog hungrier so beware!', width/2, (height/4*2.5)); 

    simpleCenteredText(30, 255, 'INSERT WIN CON HERE', width/2, (height/4*3)); 

    simpleCenteredText(17.5, 255, 'Press the left mouse button to go back to main menu', width/2, (height/4*3.75)); 
}

function handleGameOverScreen()
{
    drawBackground(true);

    simpleCenteredText(50, 'red', 'STARVED', width/2, height/2);
}

// makes putting centered text a bit easier and cleaner.
function simpleCenteredText(size, colour, textString, pos_x, pos_y)
{
    textSize(size);
    fill(colour);
    textAlign(CENTER, CENTER);
    text(textString, pos_x, pos_y);
}

// makes drawing rects a bit easier and cleaner.
function drawRect(gray, rectColour, rectAlpha, rectColourR, rectColourG, rectColourB, rectX, rectY, rectW, rectH)
{
    push();
    noStroke();

    if (gray)
    {
        fill(rectColour, rectAlpha);
    }
    else
    {
        fill(rectColourR, rectColourG, rectColourB);
    }
    rect(rectX, rectY, rectW, rectH);
    pop()
}

// every function that pertains to running the actual game go here.
function frogGame()
{
    handleCooldowns();

    drawBackground();
    moveFly();
    drawFly();
    moveFrog();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();

    handleHUD();

    handleGameState();
}

// handles everything that has to do with UI.
function handleHUD()
{
    drawHungerBar();
    // drawScore()
}

function drawHungerBar()
{
    // gets a percentage for the fill portion of the bar based on the current hunger value
    let hungerBarLength = map(frogStatus.hunger, 0, frogStatus.maxHunger, 0, 1, true);
    // multiplies the fill's width with the percentage acquired above
    frogStatus.bar.fill.w = frogStatus.bar.background.w * hungerBarLength;

    // draws the background of the hunger bar first
    drawRect(true, frogStatus.bar.background.colour, frogStatus.bar.background.a, undefined, undefined, undefined, frogStatus.bar.background.x, 
        frogStatus.bar.background.y, frogStatus.bar.background.w, frogStatus.bar.background.h);
    // then draws the fill portion of the hunger bar
    drawRect(false, undefined, undefined, frogStatus.bar.fill.r, frogStatus.bar.fill.g, frogStatus.bar.fill.b, frogStatus.bar.fill.x, 
        frogStatus.bar.fill.y, frogStatus.bar.fill.w, frogStatus.bar.fill.h);
}

// handles all the cooldowns of the project. 
function handleCooldowns()
{
    frogStatus.hungerTimer -= deltaTime;
}

function handleGameState()
{
    // checks if the player's hunger has reached maximum capacity
    if (frogStatus.hunger <= frogStatus.maxHunger)
    {
        // checks for the hunger cooldown and...
        if (frogStatus.hungerTimer <= 0)
        {
            // ...adds to the hunger bar
            frogStatus.hunger += 1;
            frogStatus.hungerTimer = frogStatus.hungerCooldown;
        }
    }
    else
    {
        // if hunger is at max, the player loses.
        gameOver = true;
    }
}

// draws the background. the parametre is for whether we want that background to be black(for the menus) or the regular game background
function drawBackground(drawBlack)
{
    if (!drawBlack)
    {
        background("#87ceeb");
    }
    else
    {
        background("#000000ff");
    }
    
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

        // if the frog lets flies escape, he gets more hungry
        frogStatus.hunger += 10;

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
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
    // added a small thing where once the tongue comes out, you cant move the frog until it's retracted. this adds a bit of difficulty.
    if (frog.tongue.state === "idle")
    {
        // linearly interpolates the frog's movement so that it doesnt snap and essentially render the added mechanic of stopping when trying to eat
        // practically useless
        frog.body.x = lerp(frog.body.x, mouseX, frog.movementSlogginess);
    }
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "idle") {
        // Do nothing
    }
    // If the tongue is outbound, it moves up
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves down
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        // The tongue stops if it hits the bottom
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill("#00ff00");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size/2 + fly.size/2);
    if (eaten) {
        // Reset the fly
        resetFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";

        // when the frog eats a fly, it lowers the hunger bar.
        frogStatus.hunger -= 15;
        frogStatus.hunger = constrain(frogStatus.hunger, 0, frogStatus.maxHunger);
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    // pressing mouse handles different things depending on if player is in the help menu or in game.
    if (helpScreenEnabled)
        {
            helpScreenEnabled = false;
            return;
        }

    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}

// handles all the key press events via a switch case.
function keyPressed(event)
{
    if (titleScreenEnabled && canContinue)
    {
        switch (event.keyCode)
        {
            // if on the title screen the user presses spacebar (keycode 32), it will open the help screen.
            case 32:
                helpScreenEnabled = true;
                break;
            // if on the title screen the user presses enter (keycode 13), it will start the game.
            case 13:
                if (canContinue)
                {
                    titleScreenEnabled = false;
                    break;
                }
        }
    }
}