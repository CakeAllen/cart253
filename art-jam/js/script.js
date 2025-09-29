/**
 * Art Jam
 * Daniel Michurov
 * 
 * description here
 */

"use strict";

let player =
{
    // health variables
    hp: 100,
    maxHP: 100,
    // combat variables
    combat:
    {
        // attack power, i.e. how much damage this actor causes
        aPower: 10,
        // kind of like a cooldown, starts at 0 because the player should be able to attack as soon as they start
        rate: 0
    },
};

let face =
{
    // health variables
    hp: 250,
    maxHP: 250,
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

function setup()
{

}

function draw() 
{

}