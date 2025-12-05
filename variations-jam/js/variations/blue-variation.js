/**
 * Fly Clicker
 * Daniel Michurov
 * 
 * A game where you just press a button and get lots and lots of flies!
 * 
 * After a few flies collected, you get upgrades for your fly-collecting adventures.
 * 
 * Made with p5
 * https://p5js.org/
 */

// keeps track of how many flies the player has collected
let fliesCollected = 0;

// keeps track of which upgrades the player has;
// 0 means none, 1 means has frog helper, 2 means has helper and garbage and 3 means has all three
// not my favourite way of doing this, but it's simple
let upgradesReceived = 0;

// this is just to change the colour of the upgrade texts 
let upgradeOneColour = 0;
let upgradeTwoColour = 0;
let upgradeThreeColour = 0;

// cooldown variables
let frogHelperCooldown = 0;
let garbageCooldown = 0;
let factoryCooldown = 0;

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

    // offsets the fly's x position to make space for the upgrade texts
    flyButton.x -= 125;
}

/**
 * This will be called every frame when the blue variation is active
 */
function blueDraw() {
    background("#87ceeb");
    drawFlyButton();

    drawClickerHUD();

    handleFrogHelper();
    handleGarbage();
    handleFactory();

    handleUpgrades();
    handleCooldowns();
}

function handleCooldowns()
{
    frogHelperCooldown -= deltaTime;
    garbageCooldown -= deltaTime;
    factoryCooldown -= deltaTime;
}

function handleFrogHelper()
{
    if (upgradesReceived < 1)
    {
        return;
    }

    if (frogHelperCooldown <= 0)
    {
        fliesCollected += 1;
        frogHelperCooldown = 350;
    }
}

function handleGarbage()
{
    if (upgradesReceived < 2)
    {
        return;
    }

    if (garbageCooldown <= 0)
    {
        fliesCollected += 10;
        garbageCooldown = 500;
    }
}

function handleFactory()
{
    if (upgradesReceived < 3)
    {
        return;
    }

    if (factoryCooldown <= 0)
    {
        fliesCollected = fliesCollected * 2;
        factoryCooldown = 2750;
    }
}

// draws all the HUD elements: fly counter and the upgrades
function drawClickerHUD()
{
    drawText(40, 0, "Flies collected: " + fliesCollected, 180, 45);
    drawText(15, 0, "Collect as many flies as possible by clicking the centre fly! (to eat them later...)", width/2, height - 25);
    drawUpgradesHUD();
}

// checks for if the player has enough flies for the upgrades
function handleUpgrades()
{
    if (fliesCollected == 25)
    {
        upgradeOneColour = 150;
        upgradesReceived = 1;
    }
    else if (fliesCollected == 150)
    {
        upgradeTwoColour = 150;
        upgradesReceived = 2;
    }
    else if (fliesCollected >= 500)
    {
        upgradeThreeColour = 150;
        upgradesReceived = 3;
    }
}

// draws the upgrades you can have in the game
function drawUpgradesHUD()
{
    drawText(20, upgradeOneColour, '[25 flies] Frog helper: \n Adds a frog friend that \n catches flies too', width - 150, height/2-90);
    drawText(20, upgradeTwoColour, "[150 flies] Add Garbage: \n Surround yourself with garbage, \n attracting flies naturally", width - 150, height/2);
    drawText(20, upgradeThreeColour, "[500 flies] Fly Factory: \n Doubles the flies collected \n every so often", width - 150, height/2+90);
}

/**
 * Draws the fly as a black circle
 */
function drawFlyButton() {
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
 * Handles the mouse overlapping the fly button
 */
function checkCursorFlyButtonOverlap() {
    // Get distance from mouse to fly
    const d = dist(mouseX, mouseY, flyButton.x, flyButton.y);
    // Check if it's an overlap
    const collected = (d < 10 + flyButton.size+10);
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
    checkCursorFlyButtonOverlap();
}