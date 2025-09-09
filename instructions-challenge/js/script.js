/**
 * * Some Random Game
 * Benedict Ambayec
 * 
 * One of the first prototypes of a game, I'll make on JS.
 * Might be scuffed but it's all good, we're all learning.
 * 
 */

"use strict";

/**
 * woah, a setup!
*/
function setup() {
         // e=mc squared
    createCanvas(640, 480);

}


/**
 * this is kinda difficult
*/

function draw(){
    drawSky();
    drawHill(300, 600, 50);
    drawHill(640, 500, 0);
    drawHill(100, 550, 0);
    drawGround();
    drawPlanet();
    drawAlien();
    drawCapsule();
    drawSaucer();
}

function drawSky() {
    // outer space
 background(120, 74, 237);
}

function drawGround() {
    // ground of the moon?
    push();
	noStroke();
	fill(247, 246, 143);
	rect(0, 400, 640, 480);
	pop();
}

function drawCapsule() {
    //square structure
    push();
	noStroke();
	fill(227, 227, 227);
	square(330, 200, 200);
	pop();
}

function drawAlien() {
    //lil half circle blob
     push();
	noStroke();
	fill(63, 181, 50);
    arc(100, 400, 100, 200, PI, 0);
	pop();
}

function drawHill(position_x, size, dark){
    // some awesome freaking hills, with custom colours and position to boot!
    push();
    noStroke();
    fill(200-dark, 200-dark, 100-dark);
    circle(position_x, 480, size)
    pop();
}


function drawPlanet() {
    //  mars?    
    push();
	noStroke();
	fill(191, 77, 77);
	circle(450, 100, 100);
	pop();
}

function drawSaucer(){
    // a beautiful flying saucer :)
    push();
    noStroke();
    fill(175);
    ellipse(150, 150, 200, 50);
    ellipse(150, 135, 75, 75);
	pop();
}
