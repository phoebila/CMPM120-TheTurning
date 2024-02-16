// Code Practice: Scrolling States
// Name:
// Date: 

'use strict'

const config = {
    parent: 'phaser-game',  // for info text
    type: Phaser.WEBGL,     // for tinting
    width: 375,
    height: 240,
    pixelArt: true,
    scene: [ Load, Title, Play, Credits ],
    zoom: 2,
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
}

const game = new Phaser.Game(config)

//global variables
let centerX = game.config.width/2;
let centerY = game.config.height/2;
let w = game.config.width;
let h = game.config.height;
let cursors;
let angelHealth;
let fangHealth;

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// credits
// Music from #Uppbeat (free for Creators!):
// https://uppbeat.io/t/danijel-zambo/game-over
// License code: ZL380LGWYXN5HQHC