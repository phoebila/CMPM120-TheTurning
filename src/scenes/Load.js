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

        // Angel Knives Sprites
        //idle
        this.load.path = './assets/'
        this.load.spritesheet('angelIdle', 'sprites/idle.png', {
            frameWidth: 55,
            frameHeight: 52,
        })
        //block
        this.load.path = './assets/'
        this.load.spritesheet('angelBlock', 'sprites/block.png', {
            frameWidth: 73,
            frameHeight: 58,
        })
        //hurt
        this.load.path = './assets/'
        this.load.spritesheet('angelHurt', 'sprites/hurt.png', {
            frameWidth: 53,
            frameHeight: 49,
        })
        //punch
        this.load.path = './assets/'
        this.load.spritesheet('angelPunch', 'sprites/punch.png', {
            frameWidth: 71,
            frameHeight: 54,
        })
        //walk
        this.load.path = './assets/'
        this.load.spritesheet('angelWalk', 'sprites/walk.png', {
            frameWidth: 57,
            frameHeight: 57,
        })

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
        // angel animations (idle)
        this.anims.create({
            key: 'idle',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('angelIdle', { start: 0, end: 3 }),
            yoyo: true
        })

        //angel animations (walk - right)
        this.anims.create({
            key: 'walk-right',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('angelWalk', { start: 0, end: 5 }),
        })

        // angel animations (block)
        this.anims.create({
            key: 'angel-block',
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('angelBlock', { start: 0, end: 2 }),
        })

        //angel animations (punch)
        this.anims.create({
            key: 'angel-punch',
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('angelPunch', { start: 0, end: 2 }),
        })

         //angel animations (hurt)
         this.anims.create({
            key: 'angel-hurt',
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('angelHurt', { start: 0, end: 1 }),
        })

        // proceed once loading completes
        this.scene.start('titleScene')
        // this.scene.start('playScene') //debugging
    }
}