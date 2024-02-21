// blackFang prefab
class BlackFang extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        scene.add.existing(this)           // add Hero to existing scene
        scene.physics.add.existing(this)   // add physics body to scene

        this.body.setSize(this.width / 2, this.height / 2)
        this.body.setCollideWorldBounds(true)
        this.body.gravity.y = 500

        // set custom Hero properties
        this.direction = direction 
        this.fangVelocity = 100    // in pixels
        this.hurtTimer = 200       // in ms
        this.blockCoolDown = 300 // blocking cooldown

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
        fang.setVelocity(0)
        fang.anims.play(`fangIdle`)
        fang.anims.stop()
    }

    execute(scene, fang) {
        // use destructuring to make a local copy of the keyboard object
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

        // block if R key input
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

class MoveStateFang extends State {
    execute(scene, fang) {
        // use destructuring to make a local copy of the keyboard object
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

        // block if R key input
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
            fang.direction = 'left'
        } else if(DKey.isDown) {
            moveDirection.x = 1
            fang.direction = 'right'
        }
        // normalize movement vector, update fang position, and play proper animation
        moveDirection.normalize()
        fang.setVelocity(fang.fangVelocity * moveDirection.x, fang.fangVelocity * moveDirection.y)
        fang.anims.play(`fangWalk-${fang.direction}`, true)
    }
}

class AttackStateFang extends State {
    enter(scene, fang) {
        fang.setVelocity(0)
        fang.anims.play(`fangPunch`)
        fang.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })

        //if collision -> lower health points, update health bar (go to hurt state)
    }
}

class HurtStateFang extends State {
    enter(scene, fang) {
        fang.setVelocity(0)
        fang.anims.play(`fangHurt`)
        fang.anims.stop()
        fang.setTint(0xFF0000)     // turn red
        // create knockback by sending body in direction opposite facing direction
        switch(fang.direction) {
            case 'left':
                fang.setVelocityX(fang.fangVelocity*2)
                break
            case 'right':
                fang.setVelocityX(-fang.fangVelocity*2)
                break
        }

        // set recovery timer
        scene.time.delayedCall(fang.hurtTimer, () => {
            fang.clearTint()
            this.stateMachine.transition('idle')
        })
    }
}

class BlockStateFang extends State {
    enter(scene, fang){
        fang.setVelocity(0)
        // play block anims

        fang.anims.play(`fangBlock`) //testing

        // set a short cooldown delay before going back to idle
        scene.time.delayedCall(fang.blockCoolDown, () => {
            fang.clearTint()
            this.stateMachine.transition('idle')
        })

        // fang.anims.stop()
    }
}