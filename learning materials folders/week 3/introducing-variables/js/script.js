/**
 * Introducing Variables
 * Daniel Michurov
 * 
 * This allows for a circle to be drawn in the centre of the screen and changes colour based on the mouse's position.
 */

"use strict";

/**
 * Canvas creation on setup
*/
function setup()
{
    // creates canvas
    createCanvas(640, 640);
}


/**
 * Drawing a circle.
*/
function draw()
{
    // draws a circle in the centre whose colour changes based on mouse pos
    push();
    noStroke();
    // the red and green values change based on the mouse's X and Y coordinates respectively. the blue value stays at 0.
    fill(mouseX, mouseY, 0);
    // the ellipse's position will be at the very centre of the canvas.
    ellipse(width / 2, height / 2, 100, 100);
    pop();
}