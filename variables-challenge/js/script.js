/**
 * Mr. Furious
 * Pippin Barr
 *
 * A guy who becomes visibly furious!
 */

"use strict";

// Our friend Mr. Furious
let mrFurious = {
  // Position and size
  x: 200,
  y: 200,
  size: 200,
  // Colour
  fill: {
    r: 255,
    g: 225,
    b: 225
  },
  // amount that the head should move
  movement:
  {
    x: undefined,
    y: undefined
  }
};

// the sky
let sky = 
{
    colour:
    {
        r: 160,
        g: 180,
        b: 200
    },
    // amount of colour to remove > time
    time: 1
};

// the sun
let sun =
{
    // position and size
    x: 400,
    y: 0,
    size: 150,
    speed: 0.5,
    // colour
    colour:
    {
        r: 255,
        g: 255,
        b: 0
    }
};

// the ground
let ground =
{
    hill:
    {
        x: 0,
        x2: 400,
        y: 400,
        size1: 450,
        size2: 500
    },

    colour:
    {
        r: 150,
        g: 150,
        b: 0
    },
};

// the bird
let bird =
{
    x: 0,
    y: 150,
    size: 50,
    direction: true,

    colour:
    {
        r: 200,
        g: 200,
        b: 200
    },

    velocity:
    {
        x: 0,
        y: undefined
    },

    minVelocity:
    {
        x: -7,
        y: undefined
    },

    maxVelocity:
    {
        x: 7,
        y: undefined
    },

    acceleration:
    {
        x: 0.75,
        y: undefined
    }
};

/**
 * Create the canvas
 */
function setup() 
{
  createCanvas(400, 400);
}

/**
 * Draw (and update) Mr. Furious
 */
function draw() 
{
    handleSky();    

    drawSun();

    drawGround();

    drawMrFurious();

    drawBird();
}

// handles the sky's behaviour
function handleSky()
{
    // sky turns orange until the sun reaches a certain point in the canvas, then darkens to black.
    if (sun.y > height*0.5)
    {
        sky.colour.r -= sky.time;
        sky.colour.g -= sky.time;
    }
    else
    {
        sky.colour.g -= sky.time/2;
    }
    
    sky.colour.b -= sky.time;

    // draws the sky
    background(sky.colour.r, sky.colour.g, sky.colour.b);
}

// draws mr furious
function drawMrFurious()
{
    push();
    // added an outline for visual clarity
    stroke(150);
    strokeWeight(2);
    
    // handles mr furious' colour
    mrFurious.fill.r -= 1;
    mrFurious.fill.g -= 2;
    mrFurious.fill.b -= 2;

    mrFurious.fill.r = constrain(mrFurious.fill.r, 175, 255);
    mrFurious.fill.g = constrain(mrFurious.fill.g, 50, 255);
    mrFurious.fill.b = constrain(mrFurious.fill.b, 50, 255);

    fill(mrFurious.fill.r, mrFurious.fill.g, mrFurious.fill.b);

    // handles mr furious' position on the canvas, starts only when he's starts to get red

    let minRage = -1;
    minRage -= 2;
    minRage = constrain(minRage, -40, -1);

    let maxRage = 2;
    maxRage += 2;
    maxRage = constrain(maxRage, 1, 40);
    

    if (mrFurious.fill.r <= 175)
    {
        mrFurious.movement.x = random(minRage, maxRage);
        mrFurious.movement.y = random(minRage-5, maxRage+5);
    }
    else
    {
        mrFurious.movement.x = 0;
        mrFurious.movement.y = 0;
    }

    ellipse(mrFurious.x+mrFurious.movement.x, mrFurious.y+mrFurious.movement.y, mrFurious.size);
    pop();
}

// draws the sun
function drawSun()
{
    push();
    noStroke();

    sun.colour.g -= 1.5;

    fill(sun.colour.r, sun.colour.g, sun.colour.b);

    sun.y += sun.speed;

    ellipse(sun.x, sun.y, sun.size);
    pop();
}

// draws the ground
function drawGround()
{
    // draws the first hill
    push();
    noStroke();
    fill(ground.colour.r, ground.colour.g, ground.colour.b);
    ellipse(ground.hill.x, ground.hill.y, ground.hill.size1);
    pop();
    
    // draws the second hill
    push();
    noStroke();
    fill(ground.colour.r, ground.colour.g, ground.colour.b);
    ellipse(ground.hill.x2, ground.hill.y, ground.hill.size2);
    pop();
}

// draws the bird
function drawBird()
{
    push();
    noStroke();
    fill(bird.colour.r, bird.colour.g, bird.colour.b);
    
    // handles the side to side movement
    if (bird.direction)
    {
        bird.acceleration.x = 0.75;
    }
    else
    {
        bird.acceleration.x = -0.75;
    }

    // handles bird's velocity
    bird.velocity.x += bird.acceleration.x;
    bird.velocity.x = constrain(bird.velocity.x, bird.minVelocity.x, bird.maxVelocity.x);

    // handles actual movement
    bird.x += bird.velocity.x;
    bird.y = mouseY;
    bird.y = constrain(bird.y, 0, height);

    // handles when to move the other direction
    if (bird.x >= width)
    {
        bird.direction = false;
    }
    else if (bird.x <= 0)
    {
        bird.direction = true;
    }   

    ellipse(bird.x, bird.y, bird.size);
    pop();
}