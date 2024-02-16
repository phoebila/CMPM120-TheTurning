class Title extends Phaser.Scene{
    constructor(){
        super("titleScene")
    }

    create(){
        // display main menu
        let menuConfig = {
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
        // display menu text
        // this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#000'
        menuConfig.color = '#fff'
        // this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5)

        // Added flashing title text: https://codepen.io/yandeu/pen/wOWaPr
        let flasingTitle = this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'The Turning', menuConfig)
            .setOrigin(0.5)
            .setVisible(true)
    
          this.tweens.add({
            targets: flasingTitle,
            alpha: 0,
            ease: 'Cubic.easeOut',  
            duration: 800,
            repeat: -1,
            yoyo: true
          })
        
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();  

        //play intro music
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(cursors.up)){
            this.scene.start('playScene')
        }

    }
}