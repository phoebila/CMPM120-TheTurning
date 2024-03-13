// Name: Phoebe Royer
// Date: 2/23/24
// Game Name: The Turning
// Components: physics, fsm, text objs, animations, tweens, different fonts
// Special: I wanted to give The Turning from the last of us a visual aspect instead of the straight narration. So, I used the arcade assets from Katrina's Fight Fighters
//          to create the arcade box, like in the game. I also used Katrina's tweens, timers, etc to adapt it to what I needed to portray my vision.

'use strict'

const config = {
    parent: 'phaser-game',  // for info text
    type: Phaser.WEBGL,     // for tinting
    width: 750,
    height: 609,
    pixelArt: true,
    scene: [ Load, Title, Play],
    zoom: 2,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.HORIZONTALLY
    },
}

// THIS GAME WOULDNT BE AS COOL WITHOUT KATRINA VANARSDALES FIGHT FIGHTERS<3 THANK YOU SO MUCH FOR LETTING ME USE ASSETS AND CODE!!!! 

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