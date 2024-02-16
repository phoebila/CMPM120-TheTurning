class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // add background image
        this.map = this.add.image(0, 0, 'map').setOrigin(0).setScale(.6)

        // add new Angel Knives player to scene (scene, x, y, key, frame, direction)
        this.angelKnives = new AngelKnives(this, 345, 250, 'hero', 0, 'left')

        //adding Blackfang
        this.blackFang = new BlackFang(this, 45, 250, 'hero', 0, 'right')

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


    }

    update() {
        // make sure we step (ie update) the hero's state machine
        this.angelFSM.step()
        this.fangFSM.step()

        //debugging 
        if (Phaser.Input.Keyboard.JustDown(this.keys.up)){
            this.scene.start('creditsScene')
        }
    }
}