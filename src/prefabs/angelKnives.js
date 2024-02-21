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
        this.body.gravity.y = 500

        // set custom Hero properties
        this.direction = direction 
        this.angelVelocity = 100    // in pixels
        this.hurtTimer = 200       // in ms
        this.blockCoolDown = 300 // blocking cooldown

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
        angel.setVelocity(0)
        angel.anims.play(`angel-idle`)
        angel.anims.stop()
    }

    execute(scene, angel) {
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
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
            this.stateMachine.transition('hurt')
            return
        }

        // block if B key input
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

class MoveState extends State {
    execute(scene, angel) {
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
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
            this.stateMachine.transition('hurt')
            return
        }

        // block if B key input
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
            angel.direction = 'left'
        } else if(right.isDown) {
            moveDirection.x = 1
            angel.direction = 'right'
        }
        // normalize movement vector, update angel position, and play proper animation
        moveDirection.normalize()
        angel.setVelocity(angel.angelVelocity * moveDirection.x, angel.angelVelocity * moveDirection.y)
        angel.anims.play(`angel-walk-${angel.direction}`, true)
    }
}

class AttackState extends State {
    enter(scene, angel) {
        angel.setVelocity(0)
        angel.anims.play(`angel-punch`)
        angel.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
        //if collision -> lower health points, update health bar (go to hurt state)
    }
}

class HurtState extends State {
    enter(scene, angel) {
        angel.setVelocity(0)
        angel.anims.play(`angel-hurt`)
        angel.anims.stop()
        angel.setTint(0xFF0000)     // turn red
        // create knockback by sending body in direction opposite facing direction
        switch(angel.direction) {
            case 'left':
                angel.setVelocityX(angel.angelVelocity*2)
                break
            case 'right':
                angel.setVelocityX(-angel.angelVelocity*2)
                break
        }

        // set recovery timer
        scene.time.delayedCall(angel.hurtTimer, () => {
            angel.clearTint()
            this.stateMachine.transition('idle')
        })
    }
}

class BlockState extends State {
    enter(scene, angel){
        angel.setVelocity(0)

        // play block anims
        angel.anims.play(`angel-block`) //testing

        // set a short cooldown delay before going back to idle
        scene.time.delayedCall(angel.blockCoolDown, () => {
            angel.clearTint()
            this.stateMachine.transition('idle')
        })

        // angel.anims.stop()
    }
}