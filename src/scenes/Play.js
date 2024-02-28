class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        //set up audio ---------------------------------------
        this.music = this.sound.add('fighting_music', {volume: .3});
        this.music.setLoop(true);
        this.music.play();

        // add fight text
        this.fightConfig = {
            fontFamily: 'pixel',
            fontSize: '48px',
            color: '#fff914',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }  

        this.gameOverConfig = {
            fontFamily: 'pixel',
            fontSize: '32px',
            color: '#fff914',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }  

        this.fightText = this.add.text(game.config.width/2.5, game.config.height/3, 'fight', this.fightConfig)
        this.fightText.setDepth(12)
        this.tweens.add({
            targets: this.fightText,
            duration: 800,
            ease: 'Linear',
            repeat: 0,
            yoyo: false,
            delay: 400,
            alpha: { from: 1, to: 0},
        });

        // add background images
        //arcade bg
        const arcadeOutline = this.add.image(0,0, 'outline', 0).setOrigin(0,0).setScale(.75)
        const lighting = this.add.image(0,0, 'lighting', 0).setOrigin(0,0).setScale(.75)

        arcadeOutline.setDepth(10)
        lighting.setDepth(11)
        // create webm of pixelized ellie playing!!!
        this.background = this.add.video(0, 70, 'EllieBG').setOrigin(.1).setScale(.48)
        this.background.play(true)

        // add new Angel Knives player to scene (scene, x, y, key, frame, direction)
        this.angelKnives = new AngelKnives(this, 145, 430, 'hero', 0, 'left').setScale(3)
        this.add.image(110, 55, 'angelHeadshot').setScale(1.5)

        //adding Blackfang
        this.blackFang = new BlackFang(this, 580, 430, 'hero', 0, 'right').setScale(3)
        this.add.image(645, 55, 'fangHeadshot').setScale(2)

        //health bars
        this.angelKnives.healthBar = this.add.image(135,65, "health").setScale(.6).setOrigin(0,0.5);
        this.blackFang.healthBar = this.add.image(625, 65, "health").setScale(.6).setOrigin(1,0.5);

        //setting enemies
        this.angelKnives.enemy = this.blackFang
        this.blackFang.enemy = this.angelKnives

        // setup keyboard input PLAYER 1 -----------------------------------------------
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.HKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H) //hurt
        this.keys.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER) //enter
        this.keys.VKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V) // v --> restart

        // setup keybinds input PLAYER 2 -----------------------------------------------
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A) //left
        this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D) //right
        this.keys.FKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F) //attack
        this.keys.RKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R) //block

        // adding ground 
        this.platform = this.physics.add.staticGroup()
        this.platform.create(400, h+210, "platform").setScale(1.2).refreshBody()

        this.physics.add.collider(this.angelKnives, this.platform)
        this.physics.add.collider(this.angelKnives.fist, this.blackFang)
        this.physics.add.collider(this.blackFang, this.platform)
        this.physics.add.collider(this.blackFang.fist, this.angelKnives)
        this.physics.add.collider(this.angelKnives, this.blackFang)

        //game ender variables
        this.gameOver = false
        this.endingTween = false

    }
    
    update() {
        // make sure we step (ie update) the hero's state machine

        // thank you Katrina for the code related to the ending sequence !!!
        if (!this.gameOver){
            this.angelFSM.step()
            this.fangFSM.step()

            // check if fang or angel is attacking --> create new 'fist', if collision -> deplete health (need to check for blocking)
        }
        //debugging 
        else { 
            if (!this.endingTween){ //either blackfang or angel knives wins
                this.endTextstart();
                this.music.stop()
                this.sound.play('death', {volume: 1})
                // this.scene.start('titleScene')
            }

            if(Phaser.Input.Keyboard.JustDown(this.keys.VKey)) {
                this.scene.restart();
            }

            //restarting game
            this.time.delayedCall(10000, () => {
                this.scene.start("titleScene");
            })
        }
    }

    // OTHER FUNCTIONS -----------------------------------------
    // tweens for game over text
    endTextstart() {
        let over = this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'GAME OVER', this.gameOverConfig).setOrigin(0.5,0.5);
        let instruct = this.add.text(game.config.width/2, game.config.height/4 - borderUISize - borderPadding, 'Press V to play again', this.gameOverConfig).setOrigin(0.5,0.5);

        var flash = this.tweens.add({
            targets: [over, instruct],
            duration: 800,
            ease: 'Linear',
            repeat: -1,
            yoyo: true,
            scaleX: 1.1,
            scaleY: 1.1,
            alpha: 1,
        });

        this.endingTween = true;
    }
    

}