// angelKnives prefab
class AngelKnives extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction, enemy) {
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
        this.health = 100 //total health
        this.immune = false //hurt and can't be hit again
        this.attacking = false; // one punch
        this.hurt = false;

        //health bar --> switching these healthbars to easier decrease health inside this prefab
        //health bars: https://phasergames.com/how-to-make-a-health-bar-in-phaser-3/
        this.fangHealth = makeBar(520,50,0xfff914, scene).setScale(.5)
        setValue(this.fangHealth,100);

        // Fist physics
        this.fist = scene.physics.add.sprite(245, 470).setScale(3)
        this.fist.body.setCircle(6)
        this.fist.body.setAngularVelocity(-20)
        this.fist.body.setImmovable(true)
        this.fist.body.onCollide = true
        // adding fist to a physics grp
        this.fistGrp = scene.add.group([this.fist])
        // now how to add it to move with body and punching?

        // FIST COLLIDER THINGS<3
        // this.collider = scene.physics.add.collider(enemy, this.fistGrp, () => {
        //     if (!enemy.immune){
        //         enemy.hurt = true
        //     }

        //     enemy.health -= 10

        //     if (enemy.health <= 0){ //game over condition
        //         enemy.health = 0
        //         scene.gameOver = true
        //     }
        //     else { //decrease health bar
        //         setValue(this.fangHealth, enemy.health);
        //     } 
        // }, null, scene)

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
        // angel.anims.stop()
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
        angel.attacking = true
        angel.once('animationcomplete', () => {
            angel.attacking = false
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
        angel.setVelocity(0)
        angel.anims.play(`angel-hurt`)
        scene.sound.play('hurtFang')
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

        angel.immune = true //angel is hit

        // set recovery timer
        scene.time.delayedCall(angel.hurtTimer, () => {
            angel.clearTint()
            angel.immune = false; //angel can be hit again
            this.stateMachine.transition('idle')
        })
    }
}

class BlockState extends State {
    enter(scene, angel){
        angel.setVelocity(0)
        scene.sound.play('block') 

        // play block anims
        angel.anims.play(`angel-block`) //testing
        angel.immune = true //angel has blocked

        // set a short cooldown delay before going back to idle
        scene.time.delayedCall(angel.blockCoolDown, () => {
            angel.immune = false //angel is no longer blocking
            this.stateMachine.transition('idle')
        })

        // angel.anims.stop()

    }
}

//creation of health bar
function makeBar(x, y,color, scene) {
    //draw the bar
    let bar = scene.add.graphics();

    //color the bar
    bar.fillStyle(color, 1);

    //fill the bar with a rectangle
    bar.fillRect(0, 0, 100, 50);
    
    //position the bar
    bar.x = x;
    bar.y = y;

    //return the bar
    return bar;
}

// update health bar
function setValue(bar,percentage) {
    //scale the bar
    bar.scaleX = percentage/100;
}