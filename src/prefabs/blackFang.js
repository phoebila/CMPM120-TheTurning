// blackFang prefab
class BlackFang extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        scene.add.existing(this)           // add Hero to existing scene
        scene.physics.add.existing(this)   // add physics body to scene

        // this.body.setSize(this.width / 2, this.height / 2)
        this.body.setSize(this.width / 2, this.height* 1.5)
        this.body.setOffset(20, 15)
        this.body.setCollideWorldBounds(true)
        this.body.gravity.y = 500

        // set custom Hero properties
        this.direction = direction 
        this.fangVelocity = 100    // in pixels
        this.hurtTimer = 200       // in ms
        this.blockCoolDown = 300 // blocking cooldown
        this.health = 100 //total health
        this.immune = false //hurt and can't be hit again
        this.attacking = false; // one punch
        this.hurt = false;
        this.name = "BlackFang"
        this.enemy = 

        //fist WIP
        this.fist = scene.physics.add.sprite(605, 470).setScale(3)
        this.fist.body.setCircle(5)
        this.fist.body.onCollide = true
        this.fist.body.setCollideWorldBounds(true)
        // adding fist to a physics grp
        this.fistGrp = scene.physics.add.group([this.fist])
        //now how to move fist with body and on anims

        // initialize state machine managing hero (initial state, possible states, state args[])
        scene.fangFSM = new StateMachine('idle', {
            idle: new IdleStateFang(),
            move: new MoveStateFang(),
            attack: new AttackStateFang(),
            block: new BlockStateFang(),
            hurt: new HurtStateFang(),
        }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
    }
}

// hero-specific state classes
class IdleStateFang extends State {
    enter(scene, fang) {

        // create new fist to avoid crashing
        if (fang.fist.active == false){
            fang.fist = scene.physics.add.sprite(fang.x-40, fang.y+35).setScale(3)
            fang.fist.body.setCircle(5)
            fang.fist.setVelocity(0)
            fang.fist.body.onCollide = true
            fang.fist.body.setCollideWorldBounds(true)
        }

        fang.setVelocity(0)
        fang.fist.setVelocity(0)
        fang.anims.play(`fang-idle`)
        // fang.anims.stop()
    }

    execute(scene, fang) {

        // create new fist
        if (fang.fist.active == false){
            fang.fist = scene.physics.add.sprite(fang.x-40, fang.y+35).setScale(3)
            fang.fist.body.setCircle(5)
            fang.fist.setVelocity(0)
            fang.fist.body.onCollide = true
            fang.fist.body.setCollideWorldBounds(true)
        }

        // use destructuring to make a local copy of the keyboard object
        // const AKey = scene.keys.AKey //left 
        // const DKey = scene.keys.DKey //right
        // const FKey = scene.keys.FKey //attack
        // const RKey = scene.keys.RKey //block
        // const HKey = scene.keys.HKey //hurt 

         // use destructuring to make a local copy of the keyboard object
         const { left, right, space, shift} = scene.keys
         const HKey = scene.keys.HKey
         const BKey = scene.keys.BKey
         const EnterKey = scene.keys.enter


        // transition to swing if pressing space
        if(Phaser.Input.Keyboard.JustDown(EnterKey)) {
            this.stateMachine.transition('attack')
            return
        }

        // hurt if H key input (just for demo purposes)
        // if(Phaser.Input.Keyboard.JustDown(HKey)) {
        //     this.stateMachine.transition('hurt')
        //     return
        // }

        if (fang.hurt == true){
            this.stateMachine.transition('hurt')    
        }

        // block if R key input
        if(Phaser.Input.Keyboard.JustDown(shift)) {
            this.stateMachine.transition('block')
            return
        }

        // transition to move if pressing a movement key
        if(left.isDown || right.isDown) {
            this.stateMachine.transition('move')
            return
        }
    }
}

class MoveStateFang extends State {
    execute(scene, fang) {

        // create new fist to avoid crashing
        if (fang.fist.active == false){
            fang.fist = scene.physics.add.sprite(fang.x-40, fang.y+35).setScale(3)
            fang.fist.body.setCircle(5)
            fang.fist.setVelocity(0)
            fang.fist.body.onCollide = true
            fang.fist.body.setCollideWorldBounds(true)
        }

        // use destructuring to make a local copy of the keyboard object
        // const AKey = scene.keys.AKey //left 
        // const DKey = scene.keys.DKey //right
        // const FKey = scene.keys.FKey //attack
        // const RKey = scene.keys.RKey //block
        // const HKey = scene.keys.HKey //hurt 

        const { left, right, space, shift} = scene.keys
        const HKey = scene.keys.HKey
        const BKey = scene.keys.BKey
        const EnterKey = scene.keys.enter


        // transition to swing if pressing space
        if(Phaser.Input.Keyboard.JustDown(EnterKey)) {
            this.stateMachine.transition('attack')
            return
        }


        // hurt if H key input (just for demo purposes)
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
            this.stateMachine.transition('hurt')
            return
        }

        // block if R key input
        if(Phaser.Input.Keyboard.JustDown(shift)) {
            this.stateMachine.transition('block')
            return
        }

        // transition to idle if not pressing movement keys
        if(!(left.isDown || right.isDown)) {
            this.stateMachine.transition('idle')
            return
        }

        // handle movement
        let moveDirection = new Phaser.Math.Vector2(0, 0)
        if(left.isDown) {
            moveDirection.x = -1
            fang.direction = 'left'
        } else if(right.isDown) {
            moveDirection.x = 1
            fang.direction = 'right'
        }
        // normalize movement vector, update fang position, and play proper animation
        moveDirection.normalize()
        fang.setVelocity(fang.fangVelocity * moveDirection.x, fang.fangVelocity * moveDirection.y)
        fang.fist.setVelocity(fang.fangVelocity * moveDirection.x, fang.fangVelocity * moveDirection.y)
        fang.anims.play(`fang-walk-${fang.direction}`, true)
    }
}

class AttackStateFang extends State {
    enter(scene, fang) {
        fang.setVelocity(0)
        fang.fist.setVelocity(0)
        fang.anims.play(`fang-punch`)
        fang.attacking = true;
        fang.fist.x -= 60 //moving fist

        // implement fist collisions?
        // FIST COLLIDER THINGS<3 WIP --> From Fight Fighters
        this.collider = scene.physics.add.collider(fang.enemy, fang.fist, () => {
            if (!fang.enemy.immune){
                fang.enemy.hurt = true
            }
            fang.enemy.health -= 10
            if (fang.enemy.health <= 0){ //game over condition
                fang.enemy.health = 0
                scene.gameOver = true
                fang.enemy.healthBar.setScale(0, 1)
            }
            else { //decrease health bar
                fang.enemy.healthBar.setScale(fang.enemy.health/100, 1)
            } 
            fang.fist.destroy()
            }, null, scene)

        fang.once('animationcomplete', () => {
            fang.attacking = false;

            // create new fist
            if (fang.fist.active == false){
                fang.fist = scene.physics.add.sprite(fang.x-40, fang.y+35).setScale(3)
                fang.fist.body.setCircle(5)
                fang.fist.body.onCollide = true
                fang.fist.setVelocity(0)
                fang.fist.body.setCollideWorldBounds(true)
            }

            fang.fist.x += 60 //moving fist back
            this.stateMachine.transition('idle')
        })

        var soundGen = Phaser.Math.Between(1, 4)
            if (soundGen == 1){
                scene.sound.play('punch1', {volume: 1})
            }
            if (soundGen == 2){
                scene.sound.play('punch2', {volume: 1})
            }
            if (soundGen == 3){
                scene.sound.play('punch3', {volume: 1})
            }
            if (soundGen == 4){
                scene.sound.play('punch4', {volume: 1})
            }
            if (soundGen == 5){
                scene.sound.play('punch5', {volume: 1})
            }
    }
}

class HurtStateFang extends State {
    enter(scene, fang) {

        // create new fist to avoid crashing
        if (fang.fist.active == false){
            fang.fist = scene.physics.add.sprite(fang.x-40, fang.y+35).setScale(3)
            fang.fist.body.setCircle(5)
            fang.fist.setVelocity(0)
            fang.fist.body.onCollide = true
            fang.fist.body.setCollideWorldBounds(true)
        }

        fang.setVelocity(0)
        fang.fist.setVelocity(0)
        fang.anims.play(`fang-hurt`)
        scene.sound.play('hurtFang')
        fang.anims.stop()
        fang.setTint(0xFF0000)     // turn red
        // create knockback by sending body in direction opposite facing direction
        switch(fang.direction) {
            case 'left':
                fang.setVelocityX(fang.fangVelocity*2)
                fang.fist.setVelocityX(fang.fangVelocity*2)
                break
            case 'right':
                fang.setVelocityX(-fang.fangVelocity*2)
                fang.fist.setVelocityX(-fang.fangVelocity*2)
                break
        }

        fang.immune = true //fang is hit
        fang.hurt = true

        // set recovery timer
        scene.time.delayedCall(fang.hurtTimer, () => {
            fang.clearTint()
            fang.immune = false; //fang can be hit again
            fang.hurt = false
            this.stateMachine.transition('idle')
        })
    }
}

class BlockStateFang extends State {
    enter(scene, fang){

        // create new fist to avoid crashing
        if (fang.fist.active == false){
            fang.fist = scene.physics.add.sprite(fang.x-40, fang.y+35).setScale(3)
            fang.fist.body.setCircle(5)
            fang.fist.setVelocity(0)
            fang.fist.body.onCollide = true
            fang.fist.body.setCollideWorldBounds(true)
        }

        fang.setVelocity(0)
        fang.fist.setVelocity(0)
        scene.sound.play('block') 

        // play block anims
        fang.anims.play(`fang-block`) //testing
        fang.immune = true //fang is blocking

        // adding particles
        this.blockParticles = scene.add.particles(fang.x, fang.y, 'block_pixel', {speed: 400, tint: 0xfff914, lifespan: 500})


        // set a short cooldown delay before going back to idle
        scene.time.delayedCall(fang.blockCoolDown, () => {
            fang.immune = false //fang is no longer blocking
            this.blockParticles.stop()
            this.stateMachine.transition('idle')
        })

        // fang.anims.stop()
    }
}