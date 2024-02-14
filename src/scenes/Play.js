class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // add background image
        this.map = this.add.image(0, 0, 'map').setOrigin(0)

        // add new Angel Knives player to scene (scene, x, y, key, frame, direction)
        this.angelKnives = new AngelKnives(this, 345, 260, 'hero', 0, 'left')

        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.HKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H)
        this.keys.BKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B)

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)

        // update instruction text
        document.getElementById('info').innerHTML = '<strong>CharacterFSM.js:</strong> Arrows: move | SPACE: attack | H: hurt (knockback) | D: debug (toggle) | B: Block'
    
        //cams 
        this.cameras.main.setBounds(0, 0, this.map.width, this.map.height)
        // this.cameras.main.startFollow(this.angelKnives, false, 0.5, .5)
        this.physics.world.setBounds(0, 0, this.map.width, this.map.height)

        // adding ground 
        let h = game.config.height;
        this.platform = this.physics.add.staticGroup()
        this.platform.create(320.5, h+210, "platform").refreshBody()
    }

    update() {
        // make sure we step (ie update) the hero's state machine
        this.angelFSM.step()
    }
}