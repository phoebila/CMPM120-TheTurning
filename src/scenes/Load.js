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
        this.load.path = './assets/'
        this.load.spritesheet('angelKnives', 'sprites/angelKnivesSpriteSheet.png', {
            frameWidth: 64,
            frameHeight: 64,
        })

        // Black Fang Sprites
        this.load.path = './assets/'
        this.load.spritesheet('blackFang', 'sprites/blackFangSpriteSheet.png', {
            frameWidth: 64,
            frameHeight: 64,
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

        //menu select 
        this.load.audio('menuSelect', 'audio/select.wav')

    }

    create() {
        // angel animations (idle) ------------------------------------------------------------
        this.anims.create({
            key: 'angel-idle',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('angelKnives', { start: 0, end: 3 }),
            yoyo: true
        })

        //angel animations (hurt)
        this.anims.create({
            key: 'angel-hurt',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('angelKnives', { start: 4, end: 5 }),
        })

        // angel animations (block)
        this.anims.create({
            key: 'angel-block',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('angelKnives', { start: 6, end: 8 }),
        })

        //angel animations (punch)
        this.anims.create({
            key: 'angel-punch',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('angelKnives', { start: 9, end: 11 }),
        })
        //angel animations (walk - left)
        this.anims.create({
            key: 'angel-walk-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('angelKnives', { start: 12, end: 17 }),
        })

        //angel animations (walk - right)
        this.anims.create({
            key: 'angel-walk-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('angelKnives', { start: 18, end: 23 }),
        })

        // fang animations (idle) ------------------------------------------------------------
        this.anims.create({
            key: 'fang-idle',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('blackFang', { start: 0, end: 3 }),
            yoyo: true
        })

        // fang animations (block)
        this.anims.create({
            key: 'fang-block',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('blackFang', { start: 4, end: 6 }),
        })

        //fang animations (hurt)
        this.anims.create({
            key: 'fang-hurt',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('blackFang', { start: 7, end: 10 }),
        })
        //fang animations (punch)
        this.anims.create({
            key: 'fang-punch',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('blackFang', { start: 11, end: 13 }),
        })

        //fang animations (walk - left)
        this.anims.create({
            key: 'fang-walk-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('blackFang', { start: 14, end: 17 }),
        })
         //fang animations (walk - right)
         this.anims.create({
            key: 'fang-walk-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('blackFang', { start: 18, end: 21 }),
        })

        // proceed once loading completes
        this.scene.start('titleScene')
        // this.scene.start('playScene') //debugging
    }
}