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

        //main menu background: from kvanarsd on github! https://github.com/kvanarsd/Fight-Fighters/tree/main
        this.load.image('outline', 'sprites/Outline.png')
        this.load.image('lighting', 'sprites/lighting.png')
        this.load.image('mainBG', 'sprites/menuBG.png')

        // ground --> platform
        this.load.image('platform', 'sprites/platform.png')

        //Angel Kives headshot
        this.load.image('angelHeadshot', 'sprites/AngelHeadshot.png')
        // BlackFang headshot
        this.load.image('fangHeadshot', 'sprites/bfHeadshot.png')


        //background movie
        this.load.video('EllieBG', 'webm/ElliePixelMov.mp4', true);

        //audios -----------------------------
        //background
        this.load.audio('fighting_music', 'audio/main_fight.mp3')
        //fight sequence
        this.load.audio('fight-sequence', 'audio/fight-sequence.wav')
        //punch audio
        this.load.audio('punch1', 'audio/punch1.wav')
        this.load.audio('punch2', 'audio/punch2.mp3')
        this.load.audio('punch3', 'audio/punch3.wav')
        this.load.audio('punch4', 'audio/punch4.wav')
        this.load.audio('punch5', 'audio/punch5.ogg')
        //block
        this.load.audio('block', 'audio/block.mp3')
        //hurt
        this.load.audio('hurtAngel', 'audio/hurt_angel.wav')
        this.load.audio('hurtFang', 'audio/hurt_fang.mp3')
        //death
        this.load.audio('death', 'audio/death.wav')

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