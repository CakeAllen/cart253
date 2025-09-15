/**
 * Creating Variables
 * Daniel Michurov
 * 
 * This code 
 */

"use strict";

// Colours (RGB)
let cheeseRed = 255;
let cheeseGreen = 255;
let cheeseBlue = 255;

// Cheese hole
let holeShade = 0;
let holeX = 140;
let holeY = 140;
let holeSize = 180;

// Creates the canvas.
function setup()
{
    createCanvas(480, 480);
}

function draw()
{
    // makes the background cheese coloured.
    background(255, 255, 0);

    push();
    noStroke();
    fill(holeShade);
    ellipse(holeX, holeY, holeSize);
    pop();
}