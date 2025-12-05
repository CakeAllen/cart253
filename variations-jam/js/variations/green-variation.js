/**
 * Froggerfroggerfrogger
 * Daniel Michurov
 * 
 * The frog is very hungry, but the flies are always across the road!
 * 
 * All the frog has to do is cross the road without getting squashed.
 * 
 * Made with p5
 * https://p5js.org/
 */

/**
 * This will be called just before the green variation starts
 */
function greenSetup() {

}

/**
 * This will be called every frame when the green variation is active
 */
function greenDraw() {
    background("green");
}

/**
 * This will be called whenever a key is pressed while the green variation is active
 */
function greenKeyPressed(event) {
    if (event.keyCode === 27) {
        state = "menu";
    }
}

/**
 * This will be called whenever the mouse is pressed while the green variation is active
 */
function greenMousePressed() {

}