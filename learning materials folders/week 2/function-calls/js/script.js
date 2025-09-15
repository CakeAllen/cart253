/**
 * Function Calls
 * Daniel Michurov
 * 
 * This is supposed to draw an image that ressembles a teal frame using p5.
 * 
 * Uses : 
 * p5.js
 * https://p5js.org/
 */

"use strict";

/**
 * Creates a 640x480 canvas on startup.
 */
function setup() 
{
	// Create the canvas at a set resolution.
	createCanvas(640, 480);
}

/**
 * Draws a teal background and a white rectangle every frame.
 */
function draw() 
{
	// The teal background.
	background(25, 100, 125);
	// White rectangle.
	rect(50, 50, 540, 380);
}