/**
 * Art Jam
 * Daniel Michurov
 * 
 * description here
 */

"use strict";

let enableHUD = true;

let player =
{
    // health variables
    hp: 3,
    maxHP: 3,
    // combat variables
    combat:
    {
        // attack power, i.e. how much damage this actor causes
        aPower: 10,
        // kind of like a cooldown, starts at 0 because the player should be able to attack as soon as they start
        rate: 0
    },
    // physical appearance variables
    appearance:
    {
        x: 0,
        y: 0,
        size: 0
    }
};

let face =
{
    // health variables
    hp: 400,
    maxHP: 400,
    // combat variables
    combat:
    {
        // attack power, i.e. how much damage this actor causes
        aPower: 20,
        // kind of like a cooldown, starts at 1 so that the player doesn't get immediately surprised by an attack
        rate: 1,
        weakSpotOpen: false,
        weakSpotDamageMultiplier: 2.0,
        closedDamageMultiplier: 0.5
    },
};

let projectile =
{
    x: undefined,
    y: undefined,
    size: 5,
    speed: 5,
    acceleration: 5
}

// has all the variables pertaining to the health bar at the top
let hpBar =
{
    nameText: "The Face",
    // variables for the foreground portion of the health bar
    fill:
    {
        x: undefined,
        y: undefined,
        w: undefined,
        h: 15,
        colour:
        {
            r:200,
            g:10,
            b:10
        }
    },
    // variables for the background portion of the health bar
    background:
    {
        x: undefined,
        y: undefined,
        w: undefined,
        h: 15,
        colour: (75)
    },
}

function setup()
{
    createCanvas(windowWidth, windowHeight);
}

function draw() 
{
    background(230, 145, 0);

    handleHUD();

    // DEBUGGING
    // if (face.hp <= 0)
    // {
    //     enableHUD = false;
    // }
    // else
    // {
    //     face.hp -= 1;
    // }
}

// a function that draws a rectangle, made to save space
function drawRect(hasStroke, strokeColour, strokeThickness, gray, rectColour, rectColourR, rectColourG, rectColourB, rectX, rectY, rectW, rectH)
{
    push();
    if (!hasStroke)
    {
        noStroke();
    }
    else
    {
        stroke(strokeColour);
        strokeWeight(strokeThickness);
    }
    if (gray)
    {
        fill(rectColour);
    }
    else
    {
        fill(rectColourR, rectColourG, rectColourB);
    }
    rect(rectX, rectY, rectW, rectH);
    pop()
}

function handleHUD()
{
    if (enableHUD)
    {
        drawBossHealthBar();
    }
}

function drawBossHealthBar()
{
    // handles the position and size of the healthbar
    hpBar.background.x = windowWidth/3.5;
    hpBar.fill.x = hpBar.background.x;
    hpBar.background.y = 100;
    hpBar.fill.y = hpBar.background.y;

    // uses the window width to have a consistent bar width
    hpBar.background.w = windowWidth-((windowWidth/3.5)*2);

    // draws the text of the boss' name
    textSize(40);
    fill(255);
    stroke(0);
    strokeWeight(4);
    text(hpBar.nameText, (hpBar.background.x + 25), (hpBar.background.y - 15))

    // calculates the percentage of the bar based on the boss' current health.
    let hpBarFillWidth = map(face.hp, 0, face.maxHP, 0, 1, true); 
    
    hpBar.fill.w = hpBar.background.w * hpBarFillWidth;

    // first handles the background
    drawRect(false, 0, 0, true, hpBar.background.colour, 0, 0, 0, hpBar.background.x, hpBar.background.y, hpBar.background.w, hpBar.background.h);
    // then handles the fill
    drawRect(false, 0, 0, false, undefined, hpBar.fill.colour.r, hpBar.fill.colour.g, hpBar.fill.colour.b, hpBar.fill.x, hpBar.fill.y, hpBar.fill.w, hpBar.fill.h);
}

