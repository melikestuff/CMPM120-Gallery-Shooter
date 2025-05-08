// Benjamin Nguyen
// Created: 5/5/2025
// Phaser: 3.70.0
//
//Assets made by Kenny's assets
//https://kenney.nl/assets/rpg-urban-pack
//
// Some code inspired by Jim Whitehead
// Most of the code was rewritten so that it can be stored in objects
//
//


"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 800,
    height: 600,
    scene: [StartMenu ,gameplay, EndScreen, CreditsScene],
    fps: { forceSetTimeOut: true, target: 30 }
}

const game = new Phaser.Game(config);