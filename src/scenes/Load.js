class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // load the visual goodz
        this.load.path = './assets/'
        this.load.spritesheet('hero', 'hero-sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.image('map', 'map-scroll.jpg')
    }

    create() {
        // hero animations (walking)
        this.anims.create({
            key: 'walk-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
        })
        this.anims.create({
            key: 'walk-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 15 }),
        })

        // hero animations (swinging)
        this.anims.create({
            key: 'swing-down',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('hero', { start: 16, end: 19 }),
        })
        this.anims.create({
            key: 'swing-up',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('hero', { start: 20, end: 23 }),
        })
        this.anims.create({
            key: 'swing-right',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('hero', { start: 24, end: 27 }),
        })
        this.anims.create({
            key: 'swing-left',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('hero', { start: 28, end: 31 }),
        })

        // proceed once loading completes
        this.scene.start('playScene')
    }
}