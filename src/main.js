// Benjamin Nguyen
// Created: 5/5/2025
// Phaser: 3.70.0
//
//Tile set made by Kenny assets
//https://kenney.nl/assets/rpg-urban-pack


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