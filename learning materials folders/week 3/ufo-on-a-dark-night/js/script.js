/**
 * UFO on a Dark Night
 * Pippin Barr
 * 
 * A UFO. On a dark night. It just sits there?
 */

"use strict";

// Our UFO
let ufo = {
    // Position
    x: 200,
    y: 375,
    // Dimensions
    width: 150,
    height: 50,
    // Fill colour (greyscale)
    fill: 255
};

// Shade to fill the sky (background)
let skyShade = 0;

/**
 * Creates the canvas
*/
function setup() {
    createCanvas(400, 400);
}

/**
 * Displays a UFO
*/
function draw() {
    // Display the sky
    skyShade += 1;
    background(skyShade);

    // moves ufo to the right slowly
    ufo.x += 0.5;
    // moves ufo upwards
    ufo.y -= 2;
    // makes ufo darker over time
    ufo.fill = ufo.fill * 0.999;
    //makes ufo smaller over time
    ufo.width = ufo.width / 1.005;
    ufo.height = ufo.height / 1.005;

    // Draw the UFO based on its properties
    push();
    fill(ufo.fill);
    noStroke();
    ellipse(ufo.x, ufo.y, ufo.width, ufo.height);
    pop();
}