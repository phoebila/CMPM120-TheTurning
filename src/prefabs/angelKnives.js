// Hero prefab
class AngelKnives extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        scene.add.existing(this)           // add Hero to existing scene
        scene.physics.add.existing(this)   // add physics body to scene

        this.body.setSize(this.width / 2, this.height / 2)
        this.body.setCollideWorldBounds(true)

        // set custom Hero properties
        this.direction = direction 
        this.angelVelocity = 100    // in pixels
        this.dashCooldown = 300    // in ms
        this.hurtTimer = 250       // in ms

        // initialize state machine managing hero (initial state, possible states, state args[])
        scene.angelFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            swing: new SwingState(),
            dash: new DashState(),
            hurt: new HurtState(),
            circular: new CircularState()
        }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
    }
}

// hero-specific state classes
class IdleState extends State {
    enter(scene, angel) {
        angel.setVelocity(0)
        angel.anims.play(`walk-${angel.direction}`)
        angel.anims.stop()
    }

    execute(scene, angel) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const HKey = scene.keys.HKey
        const FKey = scene.keys.FKey

        // transition to swing if pressing space
        if(Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('swing')
            return
        }

        // transition to dash if pressing shift
        if(Phaser.Input.Keyboard.JustDown(shift)) {
            this.stateMachine.transition('dash')
            return
        }

        // hurt if H key input (just for demo purposes)
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
            this.stateMachine.transition('hurt')
            return
        }

        // circle attack if f key input
        if (Phaser.Input.Keyboard.JustDown(FKey)){
            this.stateMachine.transition('circular')
            return
        }

        // transition to move if pressing a movement key
        if(left.isDown || right.isDown || up.isDown || down.isDown ) {
            this.stateMachine.transition('move')
            return
        }
    }
}

class MoveState extends State {
    execute(scene, angel) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const HKey = scene.keys.HKey
        const FKey = scene.keys.FKey


        // transition to swing if pressing space
        if(Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('swing')
            return
        }

        // transition to dash if pressing shift
        if(Phaser.Input.Keyboard.JustDown(shift)) {
            this.stateMachine.transition('dash')
            return
        }

        // hurt if H key input (just for demo purposes)
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
            this.stateMachine.transition('hurt')
            return
        }

        // circle attack if f key input
        if (Phaser.Input.Keyboard.JustDown(FKey)){
            this.stateMachine.transition('circular')
            return
        }

        

        // transition to idle if not pressing movement keys
        if(!(left.isDown || right.isDown || up.isDown || down.isDown)) {
            this.stateMachine.transition('idle')
            return
        }

        // handle movement
        let moveDirection = new Phaser.Math.Vector2(0, 0)
        if(up.isDown) {
            moveDirection.y = -1
            angel.direction = 'up'
        } else if(down.isDown) {
            moveDirection.y = 1
            angel.direction = 'down'
        }
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
        angel.anims.play(`walk-${angel.direction}`, true)
    }
}

class SwingState extends State {
    enter(scene, angel) {
        angel.setVelocity(0)
        angel.anims.play(`swing-${angel.direction}`)
        angel.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
    }
}

class DashState extends State {
    enter(scene, angel) {
        angel.setVelocity(0)
        angel.anims.play(`swing-${angel.direction}`)
        angel.setTint(0x00AA00)     // turn green
        switch(angel.direction) {
            case 'up':
                angel.setVelocityY(-angel.angelVelocity * 3)
                break
            case 'down':
                angel.setVelocityY(angel.angelVelocity * 3)
                break
            case 'left':
                angel.setVelocityX(-angel.angelVelocity * 3)
                break
            case 'right':
                angel.setVelocityX(angel.angelVelocity * 3)
                break
        }

        // set a short cooldown delay before going back to idle
        scene.time.delayedCall(angel.dashCooldown, () => {
            angel.clearTint()
            this.stateMachine.transition('idle')
        })
    }
}

class HurtState extends State {
    enter(scene, angel) {
        angel.setVelocity(0)
        angel.anims.play(`walk-${angel.direction}`)
        angel.anims.stop()
        angel.setTint(0xFF0000)     // turn red
        // create knockback by sending body in direction opposite facing direction
        switch(angel.direction) {
            case 'up':
                angel.setVelocityY(angel.angelVelocity*2)
                break
            case 'down':
                angel.setVelocityY(-angel.angelVelocity*2)
                break
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

class CircularState extends State {
    enter(scene, angel){
        // angel.setTint(0x000FF)
        angel.setVelocity(0)
        angel.anims.play('circular-attack').once('animationcomplete', () => {
            scene.cameras.main.shake(350, .01)  
            this.stateMachine.transition('idle')
        })
    }
}