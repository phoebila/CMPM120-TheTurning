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
        //walk - right
        this.load.path = './assets/'
        this.load.spritesheet('angelWalk-right', 'sprites/walk-right.png', {
            frameWidth: 57,
            frameHeight: 57,
        })
        //walk - left
        this.load.path = './assets/'
        this.load.spritesheet('angelWalk-left', 'sprites/walk-left.png', {
            frameWidth: 57,
            frameHeight: 57,
        })

        // Black Fang Sprites
        //idle
        this.load.path = './assets/'
        this.load.spritesheet('fangIdle', 'sprites/idleBF.png', {
            frameWidth: 67,
            frameHeight: 57,
        })
        //block
        this.load.path = './assets/'
        this.load.spritesheet('fangBlock', 'sprites/blockBF.png', {
            frameWidth: 57,
            frameHeight: 56,
        })
        //hurt
        this.load.path = './assets/'
        this.load.spritesheet('fangHurt', 'sprites/hurtBF.png', {
            frameWidth: 58,
            frameHeight: 54,
        })
        //punch
        this.load.path = './assets/'
        this.load.spritesheet('fangPunch', 'sprites/punchBF.png', {
            frameWidth: 60,
            frameHeight: 58,
        })
        //walk (right)
        this.load.path = './assets/'
        this.load.spritesheet('fangWalk-right', 'sprites/walkBF-right.png', {
            frameWidth: 69,
            frameHeight: 63,
        })
        //walk (left)
        this.load.path = './assets/'
        this.load.spritesheet('fangWalk-left', 'sprites/walkBF-left.png', {
            frameWidth: 69,
            frameHeight: 63,
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
            key: 'angel-idle',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('angelIdle', { start: 0, end: 3 }),
            yoyo: true
        })

        //angel animations (walk - right)
        this.anims.create({
            key: 'angel-walk-right',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('angelWalk', { start: 0, end: 5 }),
        })
        //angel animations (walk - right)
        this.anims.create({
            key: 'angel-walk-right',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('angelWalk-right', { start: 0, end: 5 }),
        })
        //angel animations (walk - left)
        this.anims.create({
            key: 'angel-walk-left',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('angelWalk-left', { start: 0, end: 5 }),
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

        // fang animations (idle)
        this.anims.create({
            key: 'fang-idle',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('fangIdle', { start: 0, end: 3 }),
            yoyo: true
        })

        //fang animations (walk - left)
        this.anims.create({
            key: 'fang-walk-left',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('fangWalk-left', { start: 0, end: 3 }),
        })
         //fang animations (walk - right)
         this.anims.create({
            key: 'fang-walk-right',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('fangWalk-right', { start: 0, end: 3 }),
        })

        // fang animations (block)
        this.anims.create({
            key: 'fang-block',
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('fangBlock', { start: 0, end: 2 }),
        })

        //fang animations (punch)
        this.anims.create({
            key: 'fang-punch',
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('fangPunch', { start: 0, end: 2 }),
        })

         //fang animations (hurt)
         this.anims.create({
            key: 'fang-hurt',
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('fangHurt', { start: 0, end: 3 }),
        })

        // proceed once loading completes
        this.scene.start('titleScene')
        // this.scene.start('playScene') //debugging
    }
}