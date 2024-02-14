class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // add background image
        this.map = this.add.image(0, 0, 'map').setOrigin(0)

        // add new Angel Knives player to scene (scene, x, y, key, frame, direction)
        this.angelKnives = new AngelKnives(this, 200, 150, 'hero', 0, 'down')

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
        document.getElementById('info').innerHTML = '<strong>CharacterFSM.js:</strong> Arrows: move | SPACE: attack | SHIFT: dash attack | F: spin attack | H: hurt (knockback) | D: debug (toggle)'
    
        //cams 
        this.cameras.main.setBounds(0, 0, this.map.width, this.map.height)
        this.cameras.main.startFollow(this.angelKnives, false, 0.5, .5)
        this.physics.world.setBounds(0, 0, this.map.width, this.map.height)
    }

    update() {
        // make sure we step (ie update) the hero's state machine
        this.angelFSM.step()
    }
}