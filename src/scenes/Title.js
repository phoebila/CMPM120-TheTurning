class Title extends Phaser.Scene{
    constructor(){
        super("titleScene")
    }

    create(){
        // display main menu
        let titleConfig = {
            fontFamily: 'pixel',
            fontSize: '32px',
            backgroundColor: '#000',
            color: '#fff',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }   
        
        let textConfig = {
            fontFamily: 'Upheaval',
            fontSize: '32px',
            backgroundColor: '#000',
            color: '#fff',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }  

        let instructConfig = {
            fontFamily: 'nokia',
            fontSize: '14px',
            backgroundColor: '#000',
            color: '#fff',
            align: 'left',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }   

        // display menu background
        // this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to fire', titleConfig).setOrigin(0.5)
        titleConfig.backgroundColor = '#000'
        titleConfig.color = '#fff'

        //temp background
        this.tempBG = this.add.image(0,0, 'mainBG').setScale(5)

        this.instrucMenu = this.add.image(50, 500, 'instrucBG').setOrigin(0)


        //arcade bg
        const arcadeOutline = this.add.image(0,0, 'outline', 0).setOrigin(0,0).setScale(.75)
        const lighting = this.add.image(0,0, 'lighting', 0).setOrigin(0,0).setScale(.75)

        arcadeOutline.setDepth(10)
        lighting.setDepth(11)

        // Added flashing title text: https://codepen.io/yandeu/pen/wOWaPr
        this.flasingTitle = this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'The Turning', titleConfig)
            .setOrigin(0.5)
            .setVisible(true)
    
        var introMenu = this.tweens.add({
            targets: this.flasingTitle,
            alpha: 0,
            ease: 'Cubic.easeOut',  
            duration: 800,
            repeat: -1,
            yoyo: true
        })

        // start game text
        this.startGame = this.add.text(game.config.width/2, game.config.height/4 - borderUISize - borderPadding, 'Press ↑ to start', textConfig)
        .setOrigin(0.5)    

        // credits menu text
        this.credz = this.add.text(game.config.width/2.5, - borderPadding*4, 'Credits', textConfig)
        this.credit1 = this.add.text(borderPadding*8, - borderPadding, 'Game by Phoebe Royer\nAnsimuz on itch.io for character assets\nKatrina Vanarsdale for letting me use her awesome assets!!', instructConfig).setOrigin(0,0.5);

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();  

        // how to play
        this.instructions = this.add.text(game.config.width/2, - borderPadding*2, 'how to play', textConfig).setOrigin(0.5,0.5);
        //Angel Knives
        this.player1 = this.add.text(borderPadding*6.8, - borderPadding*5.5, 'Angel Knives', textConfig).setOrigin(0,0.5);
        this.buttons1 = this.add.text(borderPadding*8, - borderPadding, '←→ for Movement\nENTER for Punch\nSHIFT to Block', instructConfig).setOrigin(0,0.5);
        this.buttons1.lineSpacing = 40
        // BlackFang
        this.player2 = this.add.text(borderPadding*45, - borderPadding*5.5, 'BlackFang', textConfig).setOrigin(1,0.5);
        this.buttons2 = this.add.text(borderPadding*44, - borderPadding/1.2, 'AD for Movement\nF for Attack\nR to Block', instructConfig).setOrigin(1,0.5);
        this.buttons2.lineSpacing = 40

        //play intro music

        this.num = 1
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(cursors.up)){
            // this.scene.start('playScene')
            // credits menu
            if(this.num == 1) {
                this.sound.play('menuSelect', {volume: .1})
                // tween away menu 1 and tween in menu 2
                var menu1away = this.tweens.add({
                    targets: [this.flasingTitle, this.startGame],
                    duration: 800,
                    ease: 'Linear',
                    repeat: 0,
                    y: "-= 500",
                });
                var menu2in = this.tweens.add({
                    targets: this.tempBG,
                    duration: 800,
                    ease: 'Cubic.easeOut',
                    repeat: 0,
                    x: 0,
                });

                var textIn = this.tweens.add({
                    targets: [this.credz, this.startGame],
                    duration: 800,
                    ease: 'Cubic.easeOut',
                    repeat: 0,
                    y: "+= 122",
                });
                var textInInstruc = this.tweens.add({
                    targets: [this.credit1],
                    duration: 800,
                    ease: 'Cubic.easeOut',
                    repeat: 0,
                    y: "+= 300",
                });

                // next menu
                this.time.delayedCall(100, () => {
                    this.num = 2;
                })
            }

            // menu 3
            if(this.num == 2) {
                this.sound.play('menuSelect', {volume: .1})
                // slide away text and in menu 3 text
                var menu2away = this.tweens.add({
                    targets: [this.tempBG],
                    duration: 800,
                    ease: 'Linear',
                    repeat: 0,
                    y: "-= 500",
                });
                var menu3in = this.tweens.add({
                    targets: [this.instrucMenu, this.startGame],
                    duration: 800,
                    ease: 'Cubic.easeOut',
                    repeat: 0,
                    y: "-= 400"
                });
                var textOut = this.tweens.add({
                    targets: [this.credz, this.credit1],
                    duration: 800,
                    ease: 'Cubic.easeOut',
                    repeat: 0,
                    y: "-= 500",
                });

                var textInTitle = this.tweens.add({
                    targets: [this.instructions],
                    duration: 800,
                    ease: 'Cubic.easeOut',
                    repeat: 0,
                    y: "+= 122",
                });
                var textInInstruc = this.tweens.add({
                    targets: [this.player1, this.player2, this.buttons1, this.buttons2],
                    duration: 800,
                    ease: 'Cubic.easeOut',
                    repeat: 0,
                    y: "+= 250",
                });

                // next menu
                this.time.delayedCall(100, () => {
                    this.num = 3;
                })
            }

            // start game
            if(this.num == 3) {
                this.sound.play('menuSelect', {volume: .3})
                // snapshot code from Nathan Altice Paddle Parkour
                let textureManager = this.textures;
                this.game.renderer.snapshot((snapshotImage) => {
                    if(textureManager.exists('titlesnapshot')) {
                        textureManager.remove('titlesnapshot');
                    }

                    textureManager.addImage('titlesnapshot', snapshotImage);
                });

                this.scene.start("playScene");
            }
        }
    }
}
