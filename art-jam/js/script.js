/**
 * Art Jam
 * Daniel Michurov
 * 
 * A simple boss fight between the player character and my face... kinda :^)
 */

"use strict";

// consts
const lerpSpeed = 0.5;

// HUD stuff
let enableHUD = true;
let enabledGameOverScreen = false;
let gameOverTextSize = 30;
let tryAgainTextSize = 25;

// temp invincibility blinking
let blinkIndex = 0;

// images
let heartContainer;
let emptyHeart;

let spawnProjectile = false;
// this bool allows the smoother closing/opening of the eye (the weak spot).
let handleWeakSpot = false;

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
        canBeDamaged: true,
        canShoot: true
    },
    // physical appearance variables
    appearance:
    {
        size: 75,
        speed: 0.5,
        verticalMovement: 0,
        canMove: true
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
        colour: 
        {
            r: 250,
            g: 235,
            b: 215
        },

        pupils:
        {
            lX: undefined,
            lY: undefined,
            rX: undefined,
            rY: undefined
        },

        hair:
        {
            x: undefined,
            y: undefined,
            w: 500,
            h: 550,
            colour:
            {
            r: 125,
            g: 50,
            b: 0
            }
        }
    },

    weakSpot:
    {
        x: undefined,
        y: undefined,
        w: 100,
        h: 50,
        colour:
        {
            r: 201,
            g: 58,
            b: 58
        },
        pupil:
        {
            x: undefined,
            y: undefined,
            size: 25
        },
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

// face' hp bar
let hpBar =
{
    nameText: "Dimitri, the Face",
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
        colour: 75,
        alpha: 100
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

    heartContainer = loadImage('./assets/images/heart_container.png');
    emptyHeart = loadImage('./assets/images/empty_heart.png');

    // allows for an initial position as the face will be on the move eventually.
    face.appearance.x = windowWidth/2;
    face.appearance.y = windowHeight/2;
}

function draw() 
{
    // draws the background
    background(135, 206, 235);
    drawBackgroundScenery();

    // draws the face
    drawFace();

    if (spawnProjectile && player.combat.canShoot)
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

        // detects if projectile collides with the weak spot.
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
    drawWeakSpotPupil();

    // handles player movement and draws the player character
    handleMovement();

    // allows for the eye to open and close smoothly, rather than instantly
    if (handleWeakSpot)
    {
        if (!face.combat.weakSpotOpen)
        {
            openWeakSpot();
            if (face.weakSpot.h >= 50)
            {
                face.combat.weakSpotOpen = true;
                handleWeakSpot = false;
            }
        }
        else
        {
            closeWeakSpot();
            if (face.weakSpot.h <= 2)
            {
                face.combat.weakSpotOpen = false;
                handleWeakSpot = false;
            }
        }
    }

    // draws the HUD
    handleHUD();
    cursor(CROSS);
    
    if (enabledGameOverScreen)
    {


        // makes the game over text grow over time
        gameOverTextSize += 1;
        gameOverTextSize = constrain(gameOverTextSize, 30, 150);
        
        textSize(gameOverTextSize);
        fill('red');
        stroke(255);
        strokeWeight(5);
        textAlign(CENTER);
        text("Game Over", (windowWidth/2), (windowHeight/2));

        // adds a line of text that says the player needs to refresh to try again after the game over text has gotten big enough
        if (gameOverTextSize >= 135)
        {
            tryAgainTextSize += 0.5;
            tryAgainTextSize = constrain(tryAgainTextSize, 25, 30);

            textSize(tryAgainTextSize);
            fill(255);
            stroke(0);
            strokeWeight(3);
            textAlign(CENTER);
            text("Refresh to try again.", (windowWidth/2), ((windowHeight/2) + 150));
        }
    }
    
    // COOLDOWNS
    player.combat.attackSpeed -= deltaTime;
    player.combat.tempInvincibility -= deltaTime;
    if (player.combat.tempInvincibility <= 0)
    {
        player.combat.canBeDamaged = true;
    }
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

// player shoots a projectile on mouse click
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

// DEBUGGING
function doubleClicked()
{
    damagePlayer(face.combat.aPower);
}

// a function that draws a rectangle, made to save space
function drawRect(hasStroke, strokeColour, strokeThickness, gray, rectColour, rectAlpha, rectColourR, rectColourG, rectColourB, rectX, rectY, rectW, rectH)
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
        fill(rectColour, rectAlpha);
    }
    else
    {
        fill(rectColourR, rectColourG, rectColourB);
    }
    rect(rectX, rectY, rectW, rectH);
    pop()
}

// handles all the HUD stuff
function handleHUD()
{
    if (enableHUD)
    {
        drawBossHealthBar();
        drawMaxHealth();
        drawPlayerHealth();
    }
}

// draws the boss health bar
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
    drawRect(false, 0, 0, true, hpBar.background.colour, hpBar.background.alpha, 0, 0, 0, hpBar.background.x, hpBar.background.y, 
        hpBar.background.w, hpBar.background.h);
    // then handles the fill
    drawRect(false, 0, 0, false, undefined, undefined, hpBar.fill.colour.r, hpBar.fill.colour.g, hpBar.fill.colour.b, 
        hpBar.fill.x, hpBar.fill.y, hpBar.fill.w, hpBar.fill.h);
}

// draws the hearts of the player health HUD
function drawPlayerHealth()
{
    let currentHearts = 25+(70*player.hp);

    for (let x = 25; x < currentHearts; x += 70)
    {
        image(heartContainer, x, (windowHeight-75));
    }
}

// draws the background of the player health HUD
function drawMaxHealth()
{
    let maxHearts = 25+(70*player.maxHP);

    for (let x = 25; x < maxHearts; x += 70)
    {
        image(emptyHeart, x, (windowHeight-75));
    }
}

// draws the player and handles the movement.
function handleMovement()
{
    if (player.appearance.canMove)
    {
        drawPlayer();
    }
    
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
        blinkIndex += 10;

        if(blinkIndex % 30 === 0)
        {
            fill(200, 50);
        }
        else
        {
            fill(0);
        }
    }
    else
    {
        fill(0);
        blinkIndex = 0;
    }

    player.appearance.verticalMovement = constrain(mouseY, (windowHeight-(windowHeight*0.33)),windowHeight);
    ellipse(mouseX, player.appearance.verticalMovement, player.appearance.size);
    pop()
}

// draws the face.
function drawFace()
{
    drawRestOfHair();

    // draws the foundation of the face
    push();
    stroke(face.appearance.colour.r-10, face.appearance.colour.g-10, face.appearance.colour.b-10);
    strokeWeight(5);
    fill(face.appearance.colour.r, face.appearance.colour.g, face.appearance.colour.b);

    // DEBUGGING
    // face.appearance.x += 1;
    // face.appearance.y += 1;

    ellipse(face.appearance.x, face.appearance.y, face.appearance.w, face.appearance.h);
    pop();

    // draws the more characteristic aspects of the face
    drawHair();
    drawMiddlePart();
    drawEyes();
    drawPupils();
    drawMouth();
}

// draws the  whites of the eyes
function drawEyes()
{
    push();
    stroke(0);
    strokeWeight(5);
    fill(255);
    arc(face.appearance.x - 100, face.appearance.y, 100, 100, 0, PI, CHORD);
    arc(face.appearance.x + 100, face.appearance.y, 100, 100, 0, PI, CHORD);
    pop();
}

function drawPupils()
{
    push();
    stroke('brown');
    strokeWeight(5);
    fill(0);

    // these handle the movement of the pupils
    face.appearance.pupils.lX = map(mouseX, 0, windowWidth, (face.appearance.x - 100) - 20, (face.appearance.x - 100) + 20);
    face.appearance.pupils.lY = map(player.appearance.verticalMovement, 0, windowHeight, face.appearance.y - 7.5, face.appearance.y + 7.5);
    ellipse(face.appearance.pupils.lX, face.appearance.pupils.lY + 25, 25);

    face.appearance.pupils.rX = map(mouseX, 0, windowWidth, (face.appearance.x + 100) - 20, (face.appearance.x + 100) + 20);
    face.appearance.pupils.rY = map(player.appearance.verticalMovement, 0, windowHeight, face.appearance.y - 7.5, face.appearance.y + 7.5);
    ellipse(face.appearance.pupils.rX, face.appearance.pupils.rY + 25, 25);

    pop();
}

// draws the face's hair
function drawHair()
{
    push();
    noStroke();
    fill(face.appearance.hair.colour.r, face.appearance.hair.colour.g, face.appearance.hair.colour.b);

    face.appearance.hair.x = face.appearance.x
    face.appearance.hair.y = face.appearance.y-25;

    arc(face.appearance.hair.x, face.appearance.hair.y, face.appearance.hair.w, face.appearance.hair.h, PI, 0);
    pop();
}

// draws a skin coloured triangle over the hair to simulate a middle part
function drawMiddlePart()
{
    push();
    noStroke();
    fill(face.appearance.colour.r, face.appearance.colour.g, face.appearance.colour.b)

    // you were right, triangles are kind of a pain...
    triangle(face.appearance.x - 130, face.appearance.y - 20, face.appearance.x, face.appearance.y - 175, face.appearance.x + 130,
     face.appearance.y - 20);
    pop();
}

// draws the hair thats behind/to the side of the head
function drawRestOfHair()
{
    push();
    noStroke();
    fill(face.appearance.hair.colour.r - 50, face.appearance.hair.colour.g - 50, face.appearance.hair.colour.b - 50)

    face.appearance.hair.x = face.appearance.x
    face.appearance.hair.y = face.appearance.y-25;

    ellipse(face.appearance.hair.x, face.appearance.hair.y, face.appearance.hair.w);
    pop();
}

// draws the mouth... well kinda, it draws a weird looking goatee and makes it imply that there's a mouth there.
function drawMouth()
{
    // draws the facial hair
    push();
    noStroke();
    fill(face.appearance.hair.colour.r - 10, face.appearance.hair.colour.g - 10, face.appearance.hair.colour.b - 10);
    // draws the moustache part
    triangle(face.appearance.x - 90, face.appearance.y + 160, face.appearance.x, face.appearance.y + 130, 
        face.appearance.x + 90, face.appearance.y + 160);
    // draws the body of the facial hair
    rect(face.appearance.x - 90, face.appearance.y + 159.5, dist(face.appearance.x - 90, face.appearance.y + 150, face.appearance.x + 90, 
        face.appearance.y + 150), (dist(face.appearance.x - 90, face.appearance.y + 150, face.appearance.x + 90, face.appearance.y + 150)*0.45));
    // draws the chin portion of the facial hair
    ellipse(face.appearance.x, face.appearance.y + 240, dist(face.appearance.x - 90, face.appearance.y + 150, face.appearance.x + 90, 
        face.appearance.y + 150), 75);
    pop();

    //draws the parts where there isnt supposed to be hair using three triangles
    push();
    noStroke();
    fill(face.appearance.colour.r, face.appearance.colour.g, face.appearance.colour.b);
    triangle(face.appearance.x - 90, face.appearance.y + 185, face.appearance.x, face.appearance.y + 140, 
        face.appearance.x + 90, face.appearance.y + 185);
    triangle(face.appearance.x - 90, face.appearance.y + 184.5, face.appearance.x - 10, face.appearance.y + 184.5, 
        face.appearance.x - 30, face.appearance.y + 240);
    triangle(face.appearance.x + 90, face.appearance.y + 184.5, face.appearance.x + 10, face.appearance.y + 184.5, 
        face.appearance.x + 30, face.appearance.y + 240);  
    pop();    
}

// handles the face's random movement
function moveFace(status)
{
    // status means if it's true, then the face is on the move, if false, then it's stationary
    if (status)
    {
        // move to a random location
    }
    // the eye will be open only when stationary, so to make it a bit more satisfying, the face will shake/shudder after getting hit in the 
    // weak spot.
    else
    {
        // stay put
    }
}

// draws the weak spot, an eye
function drawWeakSpot()
{
    // draws the weak spot
    push();
    stroke('orange');
    strokeWeight(5);
    fill(face.weakSpot.colour.r, face.weakSpot.colour.g, face.weakSpot.colour.b);

    face.weakSpot.x = face.appearance.x;
    face.weakSpot.y = face.appearance.y - face.weakSpot.offsetFromCentre;

    ellipse(face.weakSpot.x, face.weakSpot.y, face.weakSpot.w, face.weakSpot.h);
    pop();
}

function drawWeakSpotPupil()
{
    if(face.combat.weakSpotOpen)
    {
        push();
        stroke(face.weakSpot.colour.r+15, face.weakSpot.colour.g, face.weakSpot.colour.b);
        strokeWeight(5);
        fill('red')

        face.weakSpot.pupil.x = map(mouseX, 0, windowWidth, face.weakSpot.x - 30, face.weakSpot.x + 30);
        face.weakSpot.pupil.y = map(player.appearance.verticalMovement, 0, windowHeight, face.weakSpot.y - 7.5, face.weakSpot.y + 7.5);

        ellipse(face.weakSpot.pupil.x, face.weakSpot.pupil.y, face.weakSpot.pupil.size);
        pop();
    }
}

// draws the eye lids of the weak spot that is visible when closed.
function drawWeakSpotLids()
{
    // draws the weak spot
    push();
    noStroke();
    fill(face.appearance.colour.r-20, face.appearance.colour.g-20, face.appearance.colour.b-20);

    face.weakSpot.x = face.appearance.x;
    face.weakSpot.y = face.appearance.y - face.weakSpot.offsetFromCentre;

    let eyelidW = face.weakSpot.w;

    ellipse(face.weakSpot.x, face.weakSpot.y, eyelidW, 50);
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

        if (player.hp <= 0)
        {
            gameOver();
            console.log('game over!');
        }
    }
}

// function for when the player hits the face's weak spot
function damageFace(amount)
{
    if (face.combat.weakSpotOpen)
    {
        handleWeakSpot = true;
        face.hp -= amount * face.combat.weakSpotDamageMultiplier;
    }
    else
    {
        face.hp -= amount * face.combat.closedDamageMultiplier;
    }
}

// opens the eye
function openWeakSpot()
{
    face.weakSpot.h += 5;
    face.weakSpot.h = constrain(face.weakSpot.h, 2, 50);
    face.weakSpot.pupil.size += 2.5;
    face.weakSpot.pupil.size = constrain(face.weakSpot.h, 0, 25);
}

// closes the eye
function closeWeakSpot()
{
    face.weakSpot.h -= 5;
    face.weakSpot.h = constrain(face.weakSpot.h, 2, 50);
    face.weakSpot.pupil.size -= 7.5;
    face.weakSpot.pupil.size = constrain(face.weakSpot.h, 0, 25);
}

// gets called when the player "dies"
function gameOver()
{
    cursor(ARROW);
    player.appearance.canMove = false;
    player.combat.canShoot = false;
    enableHUD = false;
    enabledGameOverScreen = true;
}

// draws multiple clouds with a big sun in the background
function drawBackgroundScenery()
{
    // draws a simple sun in the background
    push();
    stroke('yellow');
    strokeWeight(100);
    fill('orange');
    ellipse((windowWidth/2), ((windowHeight/2)+50), 900);
    pop();

    // draws a bunch of clouds
    drawCloud(350, 1250);
    drawCloud(0,1100);
    drawCloud(300, 750);

    drawCloud(windowWidth-300, 1200);
    drawCloud(windowWidth, 1150);
    drawCloud(windowWidth-750, 500);
    drawCloud(windowWidth-275, 800);
}

// draws a cloud based on the given parametres 
function drawCloud(x, size)
{
    push();
    stroke(200);
    strokeWeight(50);
    fill(255);
    ellipse(x, windowHeight, size);
    pop();
}