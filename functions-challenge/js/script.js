/**
 * Bouncy Ball Ball Bonanza
 * Pippin Barr
 * 
 * The starting point for a ball-bouncing experience of
 * epic proportions!
 */

"use strict";

// if false, it makes the game easier. if true, it makes it harder
let difficulty = false;
// the score, it adds up by 1 every time a ball is bounced
let score = 0;
// cooldown for adding score, so that way you can't cheese it once one ball starts to 
// bounce really fast
let scoreCooldown = 0;

// Our ball
const ball = {
    x: 200,
    y: 20,
    width: 10,
    height: 10,
    velocity: {
        x: 0,
        y: 1
    },
    acceleration: 0.2
};

// Our second ball
const ball2 = {
    x: 400,
    y: 20,
    width: 10,
    height: 10,
    velocity: {
        x: 0,
        y: 0.5
    },
    acceleration: 0.1
};

// Our paddle
const paddle = {
    x: undefined,
    y: 280,
    width: 80,
    height: 10
};

// Our second paddle
const paddle2 = {
    x: undefined,
    y: 280,
    width: 80,
    height: 10
};

/**
 * Create the canvas
*/
function setup() {
    createCanvas(600, 300);
    paddle.x = width/3;
    paddle2.x = (width/3)*2;
}

/**
 * Move and display the ball and paddle
*/
function draw() {
    background("#87ceeb");

    drawScoreText();
    
    moveBall(ball);
    moveBall(ball2);

    drawPaddle(paddle);
    
    drawBall(ball);
    drawBall(ball2);

    handleDifficulty();

    scoreCooldown -= deltaTime;
    console.log(scoreCooldown);
}

function mouseClicked()
{
    difficulty = !difficulty;
}

// draws the text indicating the score, for fun :p
function drawScoreText()
{
    textSize(25);
    fill(0);
    text("Score: " + score, width - 130, height - 250);
}

// this just checks the difficulty and spawns/despawns the second paddle and changes the way
// the first paddle behaves (if on easy, only the first half of screen, if on hard then
// it's the only paddle, thus can move freely throughout the canvas on the x axis)
function handleDifficulty()
{
    if (!difficulty)
    {
        moveFirstPaddle(paddle);
        moveAnotherPaddle(paddle2);

        handleBounce(ball, paddle);
        handleBounce(ball2, paddle2);

        drawPaddle(paddle2);
    }
    else
    {
        movePaddle(paddle);

        handleBounce(ball, paddle);
        handleBounce(ball2, paddle);
    }
}

/**
 * Moves the hard mode paddle
 */
function movePaddle(paddle) {
    paddle.x = mouseX;
}

/**
 * Moves the first paddle
 */
function moveFirstPaddle(paddle) {
    paddle.x = map(mouseX, 0, width, 0, width/2)
    paddle.x = constrain(paddle.x, 0, width/2)
}

/**
 * Moves the second paddle. adding this second paddle removes the challenge that was 
 * there with two balls and one paddle, but it works!
 */
function moveAnotherPaddle(paddle) 
{
    paddle.x = map(mouseX, 0, width, width, (width - width/2))
    paddle.x = constrain(paddle.x, (width - width/2), width)
}

/**
 * Moves the ball passed in as a parameter
 */
function moveBall(ball) {
    ball.velocity.y += ball.acceleration;
    ball.y += ball.velocity.y;
}

/**
 * Bounces the provided ball off the provided paddle
 */
function handleBounce(ball, paddle) {

    // const distance = dist(ball.x, ball.y, paddle.x, paddle.y);

    // const overlap = (distance < ball.height/2 + paddle.height);

    if (checkOverlap(ball, paddle))
    {
        ball.velocity.y *= -1;
        // this just simulates the ball losing kinetic energy
        ball.y -= 0.5;
        // checks for cooldown, ideally the two balls would have their own separate cooldown
        // but its okay.
        if (scoreCooldown <= 0)
        {
            // checks for what difficulty it is and changes how much you earn accordingly.
            let addedScore = undefined;
            if (difficulty)
            {
                addedScore = 2;
            }
            else
            {
                addedScore = 1;
            }

            score += addedScore;
        }
        
        scoreCooldown = 250;
    }
}

/**
 * Draws the specified paddle on the canvas
 */
function drawPaddle(paddle) {
    push();
    rectMode(CENTER);
    noStroke();
    fill("pink");
    rect(paddle.x, paddle.y, paddle.width, paddle.height);
    pop();
}

/**
 * Draws the specified ball on the canvas
 */
function drawBall(ball) {
    push();
    rectMode(CENTER);
    noStroke();
    fill("pink");
    rect(ball.x, ball.y, ball.width, ball.height);
    pop();
}

/**
 * Returns true if rectA and rectB overlap, and false otherwise
 * Assumes rectA and rectB have properties x, y, width and height to describe
 * their rectangles, and that rectA and rectB are displayed CENTERED on their
 * x,y coordinates.
 */
function checkOverlap(rectA, rectB) {
  return (rectA.x + rectA.width/2 > rectB.x - rectB.width/2 &&
          rectA.x - rectA.width/2 < rectB.x + rectB.width/2 &&
          rectA.y + rectA.height/2 > rectB.y - rectB.height/2 &&
          rectA.y - rectA.height/2 < rectB.y + rectB.height/2);
}
