class Credits extends Phaser.Scene{
    constructor(){
        super("creditsScene")
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
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Credits', menuConfig).setOrigin(0.5)
        // this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#000'
        menuConfig.color = '#fff'
        // this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5)


        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();  

        //play credits music
    }
    update(){
        if (Phaser.Input.Keyboard.JustDown(cursors.up)){
            this.scene.start('titleScene')
        }
    }
}