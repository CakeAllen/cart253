/**
 * Froggerfroggerfrogger
 * Daniel Michurov
 * 
 * The frog is very hungry, but the flies are always across the road!
 * 
 * All the frog has to do is cross the road without getting squashed.
 * 
 * Press the mouse button to advance forward one lane.
 * 
 * Made with p5
 * https://p5js.org/
 */

// handles state of the game, 0 being the game itself, 1 being a victory and 2 being a game over
let froggerGameState = 0;

// Our frog
const frogger = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: undefined,
        size: 40
    }
};

// the vehicles that circulate in the lanes
const car1 =
{
    x: 0,
    y: undefined,
    w: 150,
    h: 50,
    Speed: undefined,
}

const car2 =
{
    x: 640,
    y: undefined,
    w: 150,
    h: 50,
    Speed: undefined,
}

const car3 =
{
    x: 0,
    y: undefined,
    w: 150,
    h: 50,
    Speed: undefined,
}

// Our fly
// Has a position and size
const stationaryFly = {
    x: 320,
    y: 25,
    size: 25,
};

/**
 * This will be called just before the green variation starts
 */
function greenSetup() {
    createCanvas(640, 480);

    frogger.body.y = height - 25;
    car1.Speed = random(8, 16);
    car2.Speed = random(9, 18);
    car3.Speed = random(10, 20);
}

/**
 * This will be called every frame when the green variation is active
 */
function greenDraw() {
    // checks what the game's state is and draws the correct thing
    switch (froggerGameState)
    {
        case 0:
            drawFroggerGame();
            break;
        case 1: 
            drawVictoryScreen();
            break;
        case 2:
            drawGameOverScreen();
            break;
    }
}

function drawFroggerGame()
{
    background("green");
    drawStationaryFly();
    moveFrogger();

    checkFroggerFlyOverlap()
    // checks if any of the cars overlap the frog
    checkCarFrogOverlap(car1)
    checkCarFrogOverlap(car2)
    checkCarFrogOverlap(car3)

    //draws all roads
    for (let i = 1; i < 4; i++)
    {
        drawRoad(height - (140*i));
    }

    drawFrogger();

    car1.y = (height - (130*1));
    car2.y = (height - (135*2));
    car3.y = (height - (136*3));

    drawCar(car1.x,car1.y, car1.w, car1.h);
    drawCar(car2.x,car2.y, car2.w, car2.h);
    drawCar(car3.x,car3.y, car3.w, car3.h);
    moveCars();
}

// draws the vehicles
function drawCar(carX, carY, w, h)
{
    push();
    noStroke();
    fill("#440303ff");
    rect(carX, carY, w, h);
    pop();
}

// handles the movement of the vehicles
function moveCars()
{
    // Moves the bottom vehicle
    car1.x += car1.Speed;
    // Handle the car going off the canvas
    if (car1.x > width) {
        car1.x = 0;
        car1.Speed = random(8, 16);
    }

    // Moves the middle vehicle
    car2.x -= car2.Speed;
    // Handle the car going off the canvas
    if (car2.x < 0-car2.w) {
        car2.x = width;
        car2.Speed = random(9, 18);
    }

    // Moves the top vehicle
    car3.x += car3.Speed;
    // Handle the car going off the canvas
    if (car3.x > width) {
        car3.x = 0;
        car3.Speed = random(10, 20);
    }
}

// draws a single road with possibility to change the Y position
function drawRoad(roadY)
{
    push();
    stroke("#3a3a3aff");
    strokeWeight(10);
    fill("#626262ff");
    rect(-10, roadY, width+20, 75);
    pop();
}

function drawVictoryScreen()
{
    background(0);
    drawText(50, 255, "You got the fly!", width/2, height/2);
}

function drawGameOverScreen()
{
    background(0);
    drawText(50, 255, "Game Over!", width/2, height/2);
}

/**
 * Draws the fly as a black circle
 */
function drawStationaryFly() {
    push();
    noStroke();
    fill("#000000");
    ellipse(stationaryFly.x, stationaryFly.y, stationaryFly.size);
    pop();
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrogger() {
    // frogger.body.x = mouseX;
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrogger() {
    // Draw the frog's body
    push();
    fill("#00ff00");
    noStroke();
    ellipse(frogger.body.x, frogger.body.y, frogger.body.size);
    pop();
}

/**
 * Handles the frog overlapping the fly
 */
function checkFroggerFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(frogger.body.x, frogger.body.y, stationaryFly.x, stationaryFly.y);
    // Check if it's an overlap
    const eaten = (d < frogger.body.size/2 + stationaryFly.size/2);
    if (eaten) {
        
        froggerGameState = 1;
    }
}

/**
 * Handles the cars overlapping the frog
 */
function checkCarFrogOverlap(car) {
    // Get distance from the car to the frog
    const dCar = dist(frogger.body.x, frogger.body.y, (car.x+car.w/2), (car.y+car.h/2));
    // Check if it's an overlap
    const ranOver = (dCar < frogger.body.size/2 + car.h/2);

    if (ranOver) {
        
        froggerGameState = 2;
    }
}

/**
 * This will be called whenever a key is pressed while the green variation is active
 */
function greenKeyPressed(event) {
    if (event.keyCode === 27) {
        state = "menu";
    }
}

/**
 * This will be called whenever the mouse is pressed while the green variation is active
 * 
 * clicking moves the frog forwards a certain distance.
 */
function greenMousePressed() {
    frogger.body.y -= 70;
}