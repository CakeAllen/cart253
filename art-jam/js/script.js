/**
 * Art Jam
 * Daniel Michurov
 * 
 * description here
 */

"use strict";

const lerpSpeed = 0.5;

let enableHUD = true;
let spawnProjectile = false;

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
        attackSpeed: 0,
        tempInvincibility: 0,
        canBeDamaged: true
    },
    // physical appearance variables
    appearance:
    {
        size: 75,
        x: 0,
        speed: 0.5,
        verticalMovement: 0
    },
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
        aPower: 1,
        // kind of like a cooldown, starts at 1 so that the player doesn't get immediately surprised by an attack
        attackSpeed: 2,
        hit: false,
        weakSpotOpen: true,
        weakSpotDamageMultiplier: 2.5,
        closedDamageMultiplier: 0.5
    },

    appearance:
    {
        x: undefined,
        y: undefined,
        w: 450,
        h: 550,
        colour: 'orange'
    },

    weakSpot:
    {
        x: undefined,
        y: undefined,
        w: 100,
        h: 0,
        colour: 'yellow',
        offsetFromCentre: 90
    }
};

let projectile =
{
    x: undefined,
    y: undefined,
    w: 5,
    h: 55,
    size: 20,
    velocity: 0,
    speed: 0.1,
    acceleration: -0.05
}

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
        colour: 75
    },
}

let playerHpBar =
{
    x: 0,
    y: 0,
    size: 0,
    emptyColour: 75,
    colour:
    {
        r: 255,
        g: 0,
        b: 0
    }
}

function setup()
{
    // creates the canvas
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
}

function draw() 
{
    // draws the background
    background('purple');

    // draws the face
    drawFace();

    if (spawnProjectile)
    {
        // draws the projectile
        push();
        noStroke();
        fill('red');
        // calculates velocity
        let velocity = projectile.y + projectile.acceleration;
        velocity = constrain(velocity, 0, 15);
        projectile.y -= velocity;
        rect(projectile.x, projectile.y, projectile.w, projectile.h);
        pop()

        if (projectile.x < ((windowWidth/2)+50) && projectile.x > ((windowWidth/2)-50) && 
        projectile.y < (((windowHeight/2)-face.weakSpot.offsetFromCentre)+25) && 
        projectile.y > (((windowHeight/2)-face.weakSpot.offsetFromCentre)-25))
        {
            face.combat.hit = true;
            damageFace(player.combat.aPower);
        }

        if (projectile.y < 1 || face.combat.hit)
        {
            spawnProjectile = false;
            face.combat.hit = false;
        }
    }
    
    drawWeakSpotLids();
    drawWeakSpot();
    
    // handles player movement and draws the player character
    handleMovement();

    

    // draws the HUD
    handleHUD();
    cursor(CROSS);

    // COOLDOWNS
    player.combat.attackSpeed -= deltaTime;
    player.combat.tempInvincibility -= deltaTime;
    face.combat.attackSpeed -= deltaTime;

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

function mouseClicked()
{
    // spawns projectile, after spawning one, the projectile goes on cooldown
    if (player.combat.attackSpeed <= 0)
    {
        projectile.x = mouseX;
        projectile.y = player.appearance.verticalMovement;
        spawnProjectile = true;
        player.combat.attackSpeed = 400;
    }
}

function doubleClicked()
{
    damagePlayer(face.combat.aPower);
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
        drawPlayerHealth();
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
    textSize(30);
    fill(255);
    stroke(0);
    strokeWeight(4);
    text(hpBar.nameText, (hpBar.background.x + 25), (hpBar.background.y - 15))

    // calculates the percentage of the bar based on the boss' current health.
    let hpBarFillWidth = map(face.hp, 0, face.maxHP, 0, 1, true); 
    // multiplies the total width of the bar with the health percentage from above
    hpBar.fill.w = hpBar.background.w * hpBarFillWidth;

    // first handles the background
    drawRect(false, 0, 0, true, hpBar.background.colour, 0, 0, 0, hpBar.background.x, hpBar.background.y, 
        hpBar.background.w, hpBar.background.h);
    // then handles the fill
    drawRect(false, 0, 0, false, undefined, hpBar.fill.colour.r, hpBar.fill.colour.g, hpBar.fill.colour.b, 
        hpBar.fill.x, hpBar.fill.y, hpBar.fill.w, hpBar.fill.h);
}

function drawPlayerHealth()
{

}

function handleMovement()
{
    drawPlayer();
}

// draws the player
function drawPlayer()
{
    push();
    noStroke();
    // visual clarity to indicate that the player, after getting hit, will have a small grace period to reposition before being able to
    // get hit again.
    if (player.combat.tempInvincibility > 0)
    {
        let flashIndex = 0;
        if (flashIndex == 0)
        {
            flashIndex += 1;
            fill(255);
        }
        else if (flashIndex == 1)
        {
            flashIndex -= 1;
            fill(0);
        }
    }
    else
    {
        fill(0);
    }

    player.appearance.verticalMovement = constrain(mouseY, (windowHeight-(windowHeight*0.33)),windowHeight);
    ellipse(mouseX, player.appearance.verticalMovement, player.appearance.size);
    pop()
}

function drawFace()
{
    // draws the foundation of the face
    push();
    stroke(255);
    strokeWeight(5);
    fill(face.appearance.colour);

    face.appearance.x = windowWidth/2;
    face.appearance.y = windowHeight/2;

    ellipse(face.appearance.x, face.appearance.y, face.appearance.w, face.appearance.h);
    pop();
}

function drawWeakSpot()
{
    // draws the weak spot
    push();
    noStroke();
    fill(face.weakSpot.colour);

    face.weakSpot.x = face.appearance.x;
    face.weakSpot.y = face.appearance.y - face.weakSpot.offsetFromCentre;

    ellipse(face.weakSpot.x, face.weakSpot.y, face.weakSpot.w, face.weakSpot.h);
    pop();
}

function drawWeakSpotLids()
{
    // draws the weak spot
    push();
    noStroke();
    fill(215, 125, 0);

    face.weakSpot.x = face.appearance.x;
    face.weakSpot.y = face.appearance.y - face.weakSpot.offsetFromCentre;

    ellipse(face.weakSpot.x, face.weakSpot.y, face.weakSpot.w, 50);
    pop();
}

// function for when the player gets hit
function damagePlayer(amount)
{
    if (player.combat.canBeDamaged)
    {
        player.combat.canBeDamaged = false;
        player.combat.tempInvincibility = 1000;
        player.hp -= amount;
    }
}

// function for when the player hits the face's weak spot
function damageFace(amount)
{
    if (face.combat.weakSpotOpen)
    {
        face.combat.weakSpotOpen = false;
        closeWeakSpot();
        face.hp -= amount * face.combat.weakSpotDamageMultiplier;
    }
    else
    {
        face.hp -= amount * face.combat.closedDamageMultiplier;
    }
}

function openWeakSpot()
{

}

function closeWeakSpot()
{

}