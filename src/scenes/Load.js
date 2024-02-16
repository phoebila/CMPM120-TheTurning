class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {

        // loading bar
        // see: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();                                 // reset fill/line style
            loadingBar.fillStyle(0xfff, 1);                  // (color, alpha)
            loadingBar.fillRect(0, centerY, w * value, 5);  // (x, y, w, h)
        });
        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        // load the visual goodz
        this.load.path = './assets/'
        this.load.spritesheet('hero', 'sprites/hero-sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        // this.load.image('map', 'sprites/EllieBG.png')

        // ground --> platform
        this.load.image('platform', 'sprites/platform.png')

        //background movie
        this.load.video('EllieBG', 'webm/ElliePixelMov.mp4', true);

        //audios
        this.load.audio('fighting_music', 'audio/main_fight.mp3')
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
        this.scene.start('titleScene')
        // this.scene.start('playScene') //debugging
    }
}