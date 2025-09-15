/**
 * Self-Esteem
 * Pippin Barr
 * 
 * A portrait of Pippin's self-esteem on a sunny day.
 */

"use strict";

// Colour of the sky
let sky =
{
    red: 150,
    green: 180,
    blue: 250
};

// The sun
let sun =
{
    // sun colour
    colour:
    {
        red: 255,
        green: 255,
        blue: 0
    },
    // sun position
    pos:
    {
        x: 500,
        y: 70
    },

    // sun size
    size: 100
}

// My self-esteem
let selfEsteem =
{
    // grayscale shade
    shade: 0,
    // self esteem position
    pos:
    {
        x: 320,
        y: 320
    },
    // self esteem size
    size: 20
}

/**
 * Create the canvas
 */
function setup() {
    // Create the canvas
    createCanvas(640, 320);
}

/**
 * Displays the sky, sun, and self-esteem
 */
function draw() {
    // A nice blue sky
    background(sky.red, sky.green, sky.blue);

    // The sun
    push();
    fill(sun.colour.red, sun.colour.green, sun.colour.blue);
    noStroke();
    ellipse(sun.pos.x, sun.pos.y, sun.size);
    pop();

    // My self esteem
    push();
    fill(selfEsteem.shade);
    noStroke();
    ellipse(selfEsteem.pos.x, selfEsteem.pos.y, selfEsteem.size);
    pop();
}