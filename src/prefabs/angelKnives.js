// angelKnives prefab
class AngelKnives extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        scene.add.existing(this)           // add Hero to existing scene
        scene.physics.add.existing(this)   // add physics body to scene

        this.body.setSize(this.width / 2, this.height* 1.5)
        this.body.setOffset(20, 15)
        // look at big bodies examples for fist collider physics
        // in punch state change offset of fist collider object (look at net example)
        this.body.setCollideWorldBounds(true)
        this.body.gravity.y = 200

        // set custom Hero properties
        this.direction = direction 
        this.angelVelocity = 100    // in pixels
        this.hurtTimer = 200       // in ms
        this.blockCoolDown = 300 // blocking cooldown
        this.health = 100 //total health
        this.immune = false //hurt and can't be hit again
        this.attacking = false; // one punch
        this.hurt = false;
        this.name = "AngelKnives"
        this.enemy = 

        //fist WIP
        this.fist = scene.physics.add.sprite(165, 470).setScale(3)
        this.fist.body.setCircle(5)
        this.fist.body.onCollide = true
        this.fist.body.setCollideWorldBounds(true)
        // adding fist to a physics grp
        this.fistGrp = scene.physics.add.group([this.fist])
        //now how to move fist with body and on anims

        // initialize state machine managing hero (initial state, possible states, state args[])
        scene.angelFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            attack: new AttackState(),
            block: new BlockState(),
            hurt: new HurtState(),
        }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
    }

}

// hero-specific state classes
class IdleState extends State {
    enter(scene, angel) {

        // create new fist to avoid crashing
        if (angel.fist.active == false){
            angel.fist = scene.physics.add.sprite(angel.x+110, angel.y+35).setScale(3)
            angel.fist.body.setCircle(5)
            angel.fist.setVelocity(0)
            angel.fist.body.onCollide = true
            angel.fist.body.setCollideWorldBounds(true)
        }

        angel.setVelocity(0)
        angel.fist.setVelocity(0)
        angel.anims.play(`angel-idle`)
        // angel.anims.stop()
    }

    execute(scene, angel) {

        // create new fist
        if (angel.fist.active == false){
            angel.fist = scene.physics.add.sprite(angel.x+110, angel.y+35).setScale(3)
            angel.fist.body.setCircle(5)
            angel.fist.setVelocity(0)
            angel.fist.body.onCollide = true
            angel.fist.body.setCollideWorldBounds(true)
        }

        // use destructuring to make a local copy of the keyboard object
        // const { left, right, space, shift} = scene.keys
        // const HKey = scene.keys.HKey
        // const BKey = scene.keys.BKey
        // const EnterKey = scene.keys.enter

        const AKey = scene.keys.AKey //left 
        const DKey = scene.keys.DKey //right
        const FKey = scene.keys.FKey //attack
        const RKey = scene.keys.RKey //block
        const HKey = scene.keys.HKey //hurt 

        // transition to swing if pressing enter
        if(Phaser.Input.Keyboard.JustDown(FKey)) {
            this.stateMachine.transition('attack')
            return
        }

        // hurt if hurt is true
        if (angel.hurt == true){
            this.stateMachine.transition('hurt')    
        }

        // block if B key input
        if(Phaser.Input.Keyboard.JustDown(RKey)) {
            this.stateMachine.transition('block')
            return
        }

        // transition to move if pressing a movement key
        if(AKey.isDown || DKey.isDown) {
            this.stateMachine.transition('move')
            return
        }
    }
}

class MoveState extends State {
    execute(scene, angel) {

        // create new fist to avoid crashing
        if (angel.fist.active == false){
            angel.fist = scene.physics.add.sprite(angel.x+110, angel.y+35).setScale(3)
            angel.fist.body.setCircle(5)
            angel.fist.setVelocity(0)
            angel.fist.body.onCollide = true
            angel.fist.body.setCollideWorldBounds(true)
        }

        // use destructuring to make a local copy of the keyboard object
        // const { left, right, space, shift} = scene.keys
        // const HKey = scene.keys.HKey
        // const BKey = scene.keys.BKey
        // const EnterKey = scene.keys.enter

        const AKey = scene.keys.AKey //left 
        const DKey = scene.keys.DKey //right
        const FKey = scene.keys.FKey //attack
        const RKey = scene.keys.RKey //block
        const HKey = scene.keys.HKey //hurt 

        // transition to swing if pressing space
        if(Phaser.Input.Keyboard.JustDown(FKey)) {
            this.stateMachine.transition('attack')
            return
        }


        // hurt if H key input (just for demo purposes)
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
            this.stateMachine.transition('hurt')
            return
        }

        // block if B key input
        if(Phaser.Input.Keyboard.JustDown(RKey)) {
            this.stateMachine.transition('block')
            return
        }

        // transition to idle if not pressing movement keys
        if(!(AKey.isDown || DKey.isDown)) {
            this.stateMachine.transition('idle')
            return
        }

        // handle movement
        let moveDirection = new Phaser.Math.Vector2(0, 0)
        if(AKey.isDown) {
            moveDirection.x = -1
            angel.direction = 'left'
        } else if(DKey.isDown) {
            moveDirection.x = 1
            angel.direction = 'right'
        }
        // normalize movement vector, update angel position, and play proper animation
        moveDirection.normalize()
        angel.setVelocity(angel.angelVelocity * moveDirection.x, angel.angelVelocity * moveDirection.y)
        angel.fist.setVelocity(angel.angelVelocity * moveDirection.x, angel.angelVelocity * moveDirection.y)
        angel.anims.play(`angel-walk-${angel.direction}`, true)
    }
}

class AttackState extends State {
    enter(scene, angel) {
        angel.setVelocity(0)
        angel.fist.setVelocity(0)
        angel.anims.play(`angel-punch`)
        angel.attacking = true
        angel.fist.x += 80 //moving fist

        //implement collisions with enemy?
        // FIST COLLIDER THINGS<3 WIP --> From Fight Fighters
        this.collider = scene.physics.add.collider(angel.enemy, angel.fist, () => {
        if (!angel.enemy.immune){
            angel.enemy.hurt = true
        }

        angel.enemy.health -= 10

        // console.log('blackfang health', angel.enemy.health);

        if (angel.enemy.health <= 0){ //game over condition
            angel.enemy.health = 0
            scene.gameOver = true
            angel.enemy.healthBar.setScale(0, 1)
        }
        else { //decrease health bar
            angel.enemy.healthBar.setScale(angel.enemy.health/100, 1)
        }
        
        angel.fist.destroy()
        }, null, scene)

        angel.once('animationcomplete', () => {
            angel.attacking = false

            // create new fist
            if (angel.fist.active == false){
                angel.fist = scene.physics.add.sprite(angel.x+110, angel.y+35).setScale(3)
                angel.fist.body.setCircle(5)
                angel.fist.body.onCollide = true
                angel.fist.setVelocity(0)
                angel.fist.body.setCollideWorldBounds(true)
            }

            angel.fist.x -= 80 //moving fist    
            this.stateMachine.transition('idle')
        })
        //if collision -> lower health points, update health bar (go to hurt state)
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

class HurtState extends State {
    enter(scene, angel) {

        // create new fist to avoid crashing
        if (angel.fist.active == false){
            angel.fist = scene.physics.add.sprite(angel.x+110, angel.y+35).setScale(3)
            angel.fist.body.setCircle(5)
            angel.fist.setVelocity(0)
            angel.fist.body.onCollide = true
            angel.fist.body.setCollideWorldBounds(true)
        }

        angel.setVelocity(0)
        angel.fist.setVelocity(0)
        angel.anims.play(`angel-hurt`)
        scene.sound.play('hurtAngel')
        angel.anims.stop()
        angel.setTint(0xFF0000)     // turn red
        // create knockback by sending body in direction opposite facing direction
        switch(angel.direction) {
            case 'left':
                angel.setVelocityX(angel.angelVelocity*2)
                angel.fist.setVelocityX(angel.angelVelocity*2)
                break
            case 'right':
                angel.setVelocityX(-angel.angelVelocity*2)
                angel.fist.setVelocityX(-angel.angelVelocity*2)
                break
        }

        angel.immune = true
        angel.hurt = true

        // set recovery timer
        scene.time.delayedCall(angel.hurtTimer, () => {
            console.log('done');
            angel.clearTint()
            angel.immune = false
            angel.hurt = false
            this.stateMachine.transition('idle')
        })
    }
}

class BlockState extends State {
    enter(scene, angel){

        // create new fist to avoid crashing
        if (angel.fist.active == false){
            angel.fist = scene.physics.add.sprite(angel.x+110, angel.y+35).setScale(3)
            angel.fist.body.setCircle(5)
            angel.fist.setVelocity(0)
            angel.fist.body.onCollide = true
            angel.fist.body.setCollideWorldBounds(true)
        }

        angel.setVelocity(0)
        angel.fist.setVelocity(0)
        scene.sound.play('block') 

        // play block anims
        angel.anims.play(`angel-block`) //testing
        angel.immune = true //angel has blocked

        // adding particles
        this.blockParticles = scene.add.particles(angel.x, angel.y, 'block_pixel', {speed: 400, tint: 0xfff914, lifespan: 500})

        // set a short cooldown delay before going back to idle
        scene.time.delayedCall(angel.blockCoolDown, () => {
            angel.immune = false //angel is no longer blocking
            this.blockParticles.stop()
            this.stateMachine.transition('idle')
        })

    }
}