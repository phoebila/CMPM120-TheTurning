class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        //set up audio ---------------------------------------
        this.music = this.sound.add('fighting_music', {volume: .1});
        this.music.setLoop(true);
        this.music.play();

        // add background image
        // create webm of pixelized ellie playing!!!
        this.background = this.add.video(0, 0, 'EllieBG').setOrigin(0).setScale(.2)
        this.background.play(true)

        // add new Angel Knives player to scene (scene, x, y, key, frame, direction)
        this.angelKnives = new AngelKnives(this, 345, 200, 'hero', 0, 'left')

        //adding Blackfang
        this.blackFang = new BlackFang(this, 45, 200, 'hero', 0, 'right')

        // setup keyboard input PLAYER 1 -----------------------------------------------
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.HKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H) //hurt

        // setup keybinds input PLAYER 2 -----------------------------------------------
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A) //left
        this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D) //right
        this.keys.FKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F) //attack
        this.keys.RKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R) //block


        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-X', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)

        // update instruction text
        // document.getElementById('info').innerHTML = '<strong>CharacterFSM.js:</strong> Arrows: move | SPACE: attack | H: hurt (knockback) | X: debug (toggle) | B: Block'
    
        //cams 
        // this.cameras.main.setBounds(0, 0, this.map.width, this.map.height)
        // this.cameras.main.startFollow(this.angelKnives, false, 0.5, .5)
        // this.physics.world.setBounds(0, 0, this.map.width, this.map.height)

        // adding ground 
        let h = game.config.height;
        this.platform = this.physics.add.staticGroup()
        this.platform.create(320.5, h+210, "platform").refreshBody()

        this.physics.add.collider(this.angelKnives, this.platform)
        this.physics.add.collider(this.blackFang, this.platform)
        this.physics.add.collider(this.angelKnives, this.blackFang)

        //health bars: https://phasergames.com/how-to-make-a-health-bar-in-phaser-3/
        angelHealth = this.makeBar(50,20,0xfff914).setScale(.2)
        this.setValue(angelHealth,100);

        fangHealth = this.makeBar(245,20,0xfff914).setScale(.2)
        this.setValue(fangHealth,100);

    }
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
    setValue(bar,percentage) {
        //scale the bar
        bar.scaleX = percentage/100;
    }

    update() {
        // make sure we step (ie update) the hero's state machine
        this.angelFSM.step()
        this.fangFSM.step()

        //debugging 
        if (Phaser.Input.Keyboard.JustDown(this.keys.up)){ //either blackfang or angel knives wins
            this.music.stop()
            this.scene.start('creditsScene')
        }
    }
}