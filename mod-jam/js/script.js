/**
 * Dark Flies
 * Pippin Barr (for the base game) & Daniel Michurov
 * 
 * A game about catching runes with a side of catching flies to not go hungry. Collect the 5 runes that spell out DECAY and win. Beware of your hunger metre!
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies & runes
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
    size: 13,
    minSpeed: 2,
    maxSpeed: 3
};

let titleScreenEnabled = true;
let canContinue = true;
let helpScreenEnabled = false;
let gameOver = false;
let gameWin = false;

let runeArray = [];
let runeDrop = false;
let randomLetter = undefined;
let winCon = 0;

// bools for each letter. i do not like this solution one bit, but nothing
// else has worked for me so far.
let hasD = false;
let hasE = false;
let hasC = false;
let hasA = false;
let hasY = false;

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
            colour: 255,
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

let frogStamina =
{
    stamina: 100,
    maxStamina: 100,

    bar:
    {
        background:
        {
            // colour + alpha
            colour: 255,
            a: 100,

            // position
            x: 25,
            y: 50,

            // size
            w: 250,
            h: 20
        },

        fill:
        {
            // colour
            r: 33,
            g: 135,
            b: 181,

            // position
            x: 25,
            y: 50,

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
        if (gameWin)
        {
            handleWinScreen();
            return;
        }
        
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

    simpleCenteredText(75, 255, 'DARK FLIES', width/2, (height/2) - 25);
    
    simpleCenteredText(20, 200, 'Press Enter to start', width/2, (height/4*2.75));

    simpleCenteredText(20, 200, 'Press Spacebar for help', width/2, (height/4*3.25));
}

function handleWinScreen()
{
    drawBackground(true);

    simpleCenteredText(60, 'teal', 'RUNES FOUND', width/2, height/2 - 25);

    simpleCenteredText(20, 200, 'You have found all the runes. Congratulations.', width/2, (height/4*2.75));

    simpleCenteredText(20, 200, 'Press Enter to go back to main menu', width/2, (height/4*3.25));

    displayRunesForWinScreen();
}

// draws the help screen.
function helpScreen()
{
    drawBackground(true);

    simpleCenteredText(25, 'teal', 'HELP', width/2, 50);
    
    simpleCenteredText(20, 255, 'Move the frog side to side with mouse cursor', width/2, (height/4));

    simpleCenteredText(20, 255, 'Press the left mouse button to shoot out your tongue', width/2, (height/4*1.5)); 

    simpleCenteredText(20, 255, 'Your hunger bar will gradully fill up, eating flies will lower it.', width/2, (height/4*2)); 

    simpleCenteredText(20, 255, 'If you let a fly escape, it will make the frog hungrier so beware!', width/2, (height/4*2.5)); 

    simpleCenteredText(20, 'teal', 'You were given the task to find the 5 runes that spell out DECAY.', width/2, (height/4*3)); 

    simpleCenteredText(17.5, 200, 'Press the left mouse button to go back to main menu', width/2, (height/4*3.75)); 
}

function handleGameOverScreen()
{
    drawBackground(true);

    simpleCenteredText(50, 'red', 'YOU STARVED', width/2, height/2);

    simpleCenteredText(20, 200, 'Press Enter to go back to main menu', width/2, (height/4*2.75));
}

// makes putting centered text a bit easier and cleaner.
function simpleCenteredText(size, colour, textString, pos_x, pos_y)
{
    noStroke();
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

    if (!runeDrop)
    {
        drawFly();
    }
    else
    {
        drawRune(randomLetter, fly.x, fly.y);
    }

    moveFrog();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();

    handleHUD();

    handleHungerState();

    if (frog.tongue.state === "idle")
    {
        staminaRegen(true);
    }
}

// handles everything that has to do with UI.
function handleHUD()
{
    drawHungerBar();
    drawStaminaBar();
    displayRunes();

}

function displayRunes()
{
    let count = runeArray.length;
    let runeY = 50;

    for (let i = 0; i < count; i++)
    {
        drawRune(runeArray[i], (width - 50), runeY)
        runeY += 50;
    }
}

// displays the collected runes on the win screen.
function displayRunesForWinScreen()
{
    let count = runeArray.length;
    let runeX = width/6;
    runeArray = ["D", "E", "C", "A", "Y"];

    for (let i = 0; i < count; i++)
    {
        drawRune(runeArray[i], runeX, 100)
        runeX += width/6;
    }
}

// draws the hunger bar
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

// draws the stamina bar
function drawStaminaBar()
{
    // gets a percentage for the fill portion of the bar based on the current hunger value
    let stamBarLength = map(frogStamina.stamina, 0, frogStamina.maxStamina, 0, 1, true);
    // multiplies the fill's width with the percentage acquired above
    frogStamina.bar.fill.w = frogStamina.bar.background.w * stamBarLength;

    // draws the background of the hunger bar first
    drawRect(true, frogStamina.bar.background.colour, frogStamina.bar.background.a, undefined, undefined, undefined, frogStamina.bar.background.x, 
        frogStamina.bar.background.y, frogStamina.bar.background.w, frogStamina.bar.background.h);
    // then draws the fill portion of the hunger bar
    drawRect(false, undefined, undefined, frogStamina.bar.fill.r, frogStamina.bar.fill.g, frogStamina.bar.fill.b, frogStamina.bar.fill.x, 
        frogStamina.bar.fill.y, frogStamina.bar.fill.w, frogStamina.bar.fill.h);
}

// handles all the cooldowns of the project. 
function handleCooldowns()
{
    frogStatus.hungerTimer -= deltaTime;
}

function handleHungerState()
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
    // if we dont want the background to be just black, i used a for loop to make a gradient 
    // to simulate a fog effect in a dark place.
    if (!drawBlack)
    {
        background(212, 185, 91);
        let a = 0;

        for (let i = 0; i < height; i++)
        {
            stroke(0, a);
            line(0, i, width, i);
            a = map(i, 0, 750, 255, 0, true);
        }
        
        drawBackgroundBuilding();
        drawRuins();
    }
    else
    {
        background("#000000ff");
    }
    
}

// draws some ruins near us
function drawRuins()
{
    // draws the main building
    push();
    stroke(100);
    strokeWeight(35);
    fill(50);
    rect(-20, 200, width/2,(height/3*2));
    pop();

    // draws the windows. couldve used for loop but i had to go quick
    push();
    noStroke();
    fill(25);
    rect(150, 325, 100,(height/3));
    pop();

    push();
    noStroke();
    fill(25);
    arc(200, 325, 100, 150, PI, 0);
    pop();

    push();
    noStroke();
    fill(25);
    rect(25, 325, 100,(height/3));
    pop();

    push();
    noStroke();
    fill(25);
    arc(75, 325, 100, 150, PI, 0);
    pop();
}

function drawBackgroundBuilding()
{   
    // draws the ground
    push();
    noStroke();
    fill(30);
    rect(0, 400, width, 100);
    pop();

    // draws the body of the distant church-like building
    push();
    noStroke();
    fill(30);
    rect(450, 275, 150, 135);
    pop();

    // draws the main roof
    push();
    noStroke();
    fill(30);
    triangle(450, 275, ((495+555)/2), 210, 600, 275);
    pop();

    // draws the tower
    push();
    noStroke();
    fill(30);
    rect(495, 190, 60, 200);
    pop();
    
    // draws the roof of the tower
    push();
    noStroke();
    fill(30);
    triangle(495, 190, ((495+555)/2), 100, 555, 190);
    pop();
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    // Move the fly
    let flySpeed = random(fly.minSpeed, fly.maxSpeed);

    fly.x += flySpeed;

    // moves the fly up and down with a sine wave of random amplitude.
    let amplitude = random(1, 4);
    fly.y += sin(frameCount * 0.075) * amplitude;

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

    drawFlyWings();

    push();
    stroke(200);
    strokeWeight(1);
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

function determineRuneLetter()
{
    let randomLetterChance = random(0, 1);

    if (randomLetterChance <= 0.2)
    {
        randomLetter = "D";
    }
    else if (randomLetterChance <= 0.4)
    {
        randomLetter = "E";
    }
    else if (randomLetterChance <= 0.6)
    {
        randomLetter = "C";
    }
    else if (randomLetterChance <= 0.8)
    {
        randomLetter = "A";
    }
    else if (randomLetterChance <= 1)
    {
        randomLetter = "Y";
    }
}

function drawRune(letter, xPos, yPos) 
{
    push();
    stroke(116, 199, 227);
    strokeWeight(4);
    fill(31, 165, 207);
    ellipse(xPos, yPos, fly.size * 2);
    pop();

    stroke(175);
    strokeWeight(1);
    textSize(20);
    fill(255);
    textAlign(CENTER, CENTER);
    text(letter, xPos, yPos);
}

// draws the fly's wings. 
function drawFlyWings()
{
    for (let i = 0; i <= 2; i++)
    {
        let yOffset = undefined;

        if (i == 0)
        {
            yOffset = 5;
        }
        else
        {
            yOffset = -5;
        }
        push();
        noStroke();
        fill(200);
        ellipse(fly.x, (fly.y + yOffset), (fly.size - 2));
        pop();
    }
}

/**
 * Resets the fly to the left with a random y
 */
function resetFly() {
    fly.x = 0;
    fly.y = random(100, 300);

    if (runeDrop)
    {
        runeDrop = false;
        return;
    }

    let powerUpChance = random(0, 1);
    if (powerUpChance < 0.3333)
    {
        determineRuneLetter();
        runeDrop = true;
    }
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
            
            let count = runeArray.length;

            for (let i = 0; i < count; i++)
            {
                if (runeArray[i] === "D" && !hasD)
                {
                    winCon += 1;
                    hasD = true;
                    console.log(hasD);
                }
                else if (runeArray[i] === "E" && !hasE)
                {
                    winCon += 1;
                    hasE = true;
                    console.log(hasE);
                }
                else if (runeArray[i] === "C" && !hasC)
                {
                    winCon += 1;
                    hasC = true;
                    console.log(hasC);
                }
                else if (runeArray[i] === "A" && !hasA)
                {
                    winCon += 1;
                    hasA = true;
                    console.log(hasA);
                }
                else if (runeArray[i] === "Y" && !hasY)
                {
                    winCon += 1;
                    hasY = true;
                    console.log(hasY);
                }
            }

            console.log(winCon);

            if (winCon == 5)
            {
                gameWin = true;
            }
        }
    }
}

function staminaRegen(start)
{
    if (start)
    {
        frogStamina.stamina += 0.5;
        frogStamina.stamina = constrain(frogStamina.stamina, 0, frogStamina.maxStamina);
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill(153, 50, 50);
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke(153, 50, 50);
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill(71, 143, 47);
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();

    drawFrogEyes();
}

// draws the two frog eyes. if i wasnt dumb, i'd clean this one up a bit.
function drawFrogEyes()
{
    // left eye
    push();
    fill(71, 143, 47);
    noStroke();
    ellipse(frog.body.x - 40, frog.body.y - 40, 50);
    pop();

    push();
    fill(235, 223, 223);
    noStroke();
    ellipse(frog.body.x - 40, frog.body.y - 40, 40);
    pop();

    // moves the left eye
    let leftEyeY = undefined;
    let leftEyeX = undefined;

    leftEyeY = map(fly.y, height, 0, frog.body.y - 40, frog.body.y - 55)
    leftEyeX = map(fly.x, 0, width, frog.body.x - 50, frog.body.x - 30)

    push();
    fill(0);
    noStroke();
    ellipse(leftEyeX, leftEyeY, 10);
    pop();

    // right eye
    push();
    fill(71, 143, 47);
    noStroke();
    ellipse(frog.body.x + 40, frog.body.y - 40, 50);
    pop();

    push();
    fill(235, 223, 223);
    noStroke();
    ellipse(frog.body.x + 40, frog.body.y - 40, 40);
    pop();

    // moves the right eye
    let rightEyeY = undefined;
    let rightEyeX = undefined;

    rightEyeY = map(fly.y, height, 0, frog.body.y - 40, frog.body.y - 55)
    rightEyeX = map(fly.x, 0, width, frog.body.x + 30, frog.body.x + 50)

    push();
    fill(0);
    noStroke();
    ellipse(rightEyeX, rightEyeY, 10);
    pop();
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {

    let eaten = undefined;
    // Get distance from tongue to fly or powerup
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    
    // since the sizes are different between the flies and the powerups, the collision detection has
    // to be a bit different.
    if (!runeDrop)
    {
        eaten = (d < frog.tongue.size/2 + fly.size/2);
    }
    else
    {
        eaten = (d < frog.tongue.size/2 + fly.size);
    }

    if (eaten) {
        if (runeDrop)
        {
            runeEaten();
            console.log(runeArray);
        }
        else
        {
            // when the frog eats a fly, it lowers the hunger bar.
            frogStatus.hunger -= 15;
            frogStatus.hunger = constrain(frogStatus.hunger, 0, frogStatus.maxHunger);
        }

        // Reset the fly
        resetFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
}

// if a rune has been eaten, then it stores the eaten rune in an array
function runeEaten()
{
    switch (randomLetter)
    {
        case "D":
            if (!hasD)
            {
                runeArray.push("D");
                fly.maxSpeed += 0.75;
            }
            break;
        case "E":
            if (!hasE)
            {
                runeArray.push("E");
                fly.maxSpeed += 0.75;
            }
            break;
        case "C":
            if (!hasC)
            {
                runeArray.push("C");
                fly.maxSpeed += 0.75;
            }
            break;
        case "A":
            if (!hasA)
            {
                runeArray.push("A");
                fly.maxSpeed += 0.75;
            }
            break;
        case "Y":
            if (!hasY)
            {
                runeArray.push("Y");
                fly.maxSpeed += 0.75;
            }
            break;
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
    // this is so that if you click while on the title screen, the frog wont launch his tongue out
    // as soon as game starts.
    else if (titleScreenEnabled)
    {
        return;
    }

    // checks if the player has the minimum stamina requirement to use the tongue.
    if (frogStamina.stamina < 25)
    {
        return;
    }
    
    // if yes, then  the tongue launches, and takes away 25 stamina.
    if (frog.tongue.state === "idle") {
        frogStamina.stamina -= 25;
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
    else if (gameOver || gameWin)
    {
        if (event.keyCode == 13)
        {
            restartGame();
            titleScreenEnabled = true;
        }
    }
}

// function that resets everything needed to restart the game.
function restartGame()
{
    gameOver = false;
    runeArray = [];
    winCon = 0;
    frogStatus.hunger = 0;
    frogStamina.stamina = frogStamina.maxStamina;
}