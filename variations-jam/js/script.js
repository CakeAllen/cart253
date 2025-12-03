/**
 * Variation Menu
 * Pippin Barr
 * 
 * A relatively simple example of a set of variations within a single
 * project. (When we learn Object-Oriented Programming this will be a
 * LOT easier.)
 */

"use strict";

let state = "menu";

/**
 * Create the canvas
*/
function setup() {
    createCanvas(500, 500);
}


/**
 * Display the menu or the current variation
*/
function draw() {
    switch (state) {
        case "menu":
            menuDraw();
            break;
        case "first-variation":
            firstDraw();
            break
        case "second-variation":
            secondDraw();
            break;
        case "third-variation":
            thirdDraw();
            break;
    }
}

/**
 * Listen for mouse pressed and call the function for it in the
 * current state
 */
function mousePressed() {
    switch (state) {
        case "menu":
            menuMousePressed();
            break;
        case "first-variation":
            firstMousePressed();
            break
        case "second-variation":
            secondMousePressed();
            break;
        case "third-variation":
            thirdMousePressed();
            break;
    }
}

/**
 * Listen for keypressed and call the function for it in the
 * current state
 */
function keyPressed(event) {
    switch (state) {
        case "menu":
            menuKeyPressed(event);
            break;
        case "first-variation":
            firstKeyPressed(event);
            break
        case "second-variation":
            secondKeyPressed(event);
            break;
        case "third-variation":
            thirdKeyPressed(event);
            break;
    }
}