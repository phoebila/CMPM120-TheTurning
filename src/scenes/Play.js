class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        //set up audio ---------------------------------------
        this.music = this.sound.add('fighting_music', {volume: .1});
        this.music.setLoop(true);
        this.music.play();

        // add fight text
        let fightConfig = {
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
        this.fightText = this.add.text(game.config.width/2.5, game.config.height/3, 'fight', fightConfig)
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
        this.angelKnives = new AngelKnives(this, 145, 300, 'hero', 0, 'left').setScale(3)
        this.add.image(110, 55, 'angelHeadshot').setScale(1.5)

        //adding Blackfang
        this.blackFang = new BlackFang(this, 580, 300, 'hero', 0, 'right').setScale(3)
        this.add.image(645, 55, 'fangHeadshot').setScale(2)

        // setup keyboard input PLAYER 1 -----------------------------------------------
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.HKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H) //hurt
        this.keys.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER) //enter

        // setup keybinds input PLAYER 2 -----------------------------------------------
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A) //left
        this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D) //right
        this.keys.FKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F) //attack
        this.keys.RKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R) //block

        // adding ground 
        this.platform = this.physics.add.staticGroup()
        this.platform.create(400, h+210, "platform").setScale(1.2).refreshBody()

        this.physics.add.collider(this.angelKnives, this.platform)
        this.physics.add.collider(this.blackFang, this.platform)
        this.physics.add.collider(this.angelKnives, this.blackFang)

        //health bars: https://phasergames.com/how-to-make-a-health-bar-in-phaser-3/
        angelHealth = this.makeBar(140,50,0xfff914).setScale(.5)
        this.setValue(angelHealth,100);

        fangHealth = this.makeBar(520,50,0xfff914).setScale(.5)
        this.setValue(fangHealth,100);

    }

    //creation of health bar
    makeBar(x, y,color) {
        //draw the bar
        let bar = this.add.graphics();

        //color the bar
        bar.fillStyle(color, 1);

        //fill the bar with a rectangle
        bar.fillRect(0, 0, 100, 50);
        
        //position the bar
        bar.x = x;
        bar.y = y;

        //return the bar
        return bar;
    }
    
    update() {
        // make sure we step (ie update) the hero's state machine
        this.angelFSM.step()
        this.fangFSM.step()

        //debugging 
        if (Phaser.Input.Keyboard.JustDown(this.keys.up)){ //either blackfang or angel knives wins
            this.music.stop()
            this.sound.play('death')
            this.scene.start('titleScene')
        }
    }

    // update health bar
    setValue(bar,percentage) {
        //scale the bar
        bar.scaleX = percentage/100;
    }

}