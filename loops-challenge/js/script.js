/**
 * Lines
 * Pippin Barr
 * 
 * A series of lines across the canvas
 */

"use strict";

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(500, 500);
}

/**
 * Draws lines across the canvas with increasing thickness and
 * gradually lightening colour
 */
function draw() {
    
    drawGradientBackground('blue');

    drawVerticalLines();

    drawHorizontalLines();
}

// draws the vertical lines. the stroke weight decreases as the colour gets lighter
function drawVerticalLines()
{
    let st = 0;
    let stW = 10;
    let x = 0;

    while (x <= width)
    {
        stroke(st);
        strokeWeight(stW);
        line(x, 0, x, height);
        st += 25;
        stW -= 1;
        x += 50;
    }
}

// draws the horizontal lines. the stroke weight decreases as the colour gets lighter as well
function drawHorizontalLines()
{
    let st = 0;
    let stW = 10;
    let y = 0;

    while (y <= height)
    {
        stroke(st);
        strokeWeight(stW);
        line(0, y, width, y);
        st += 25;
        stW -= 1;
        y += 50;
    }
}

// instead of using colour, i thought of having a parametre for the background colour, then using the for loop to create
// lines that are overlayed on top of the background to simulate a darkening gradient. probably not as interesting as
// a gradient from pink to blue, for example, but still works.
function drawGradientBackground(backgroundColour)
{
    background(backgroundColour);

    let a = 0;

    for (let i = 0; i < width; i++)
    {
        stroke(0, a);
        strokeWeight(10);
        line(i, 0, i, height);
        a = map(i, 0, 500, 0, 50, true);
    }
}
