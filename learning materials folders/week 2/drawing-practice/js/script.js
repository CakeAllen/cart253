/**
 * Drawing Practice
 * Daniel Michurov
 * 
 *  This project draws a vinyl record.
 * 
 * Uses:
 * p5.js
 * https://p5js.org/ 
 */

"use strict";

/**
 *  Creates the canvas.
 */
function setup() 
{
    // creating the canvas
    createCanvas(640, 640);
}

/**
 * First, adds a gray background.
 * 
 * Then, draws 3 separate ellipses that combine into what looks like a vinyl record.
 */
function draw()
{
    // Adds a gray background.
    background(150, 150, 150);

    // Adds a red circle with a white outline in the centre of the canvas.
    // This circle is the main part of the vinyl record.
    push();
    fill(255, 0, 0);
    stroke(255, 255, 255);
    ellipse(320, 320, 480, 480);
    pop();

    // adds the label on the record.
    push();
    fill(255, 255, 255);
    noStroke();
    ellipse(320, 320, 140, 140);
    pop();

    // the hole in the record.
    push();
    fill(150, 150, 150);
    stroke(50, 50, 50);
    ellipse(320, 320, 20, 20);
    pop();
}