// punch prefab
class Punch extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, enemy, player){
        super(scene, x, y, enemy, player)

        // Fist physics
        this.fist = scene.physics.add.sprite(x, y).setScale(3)
        this.fist.body.setCircle(5)
        this.fist.body.setAngularVelocity(-100)
        this.fist.body.onCollide = true
        this.fist.body.setCollideWorldBounds(true)
        // adding fist to a physics grp
        this.fistGrp = scene.physics.add.group([this.fist])
        //now how to move fist with body and on anims

        if (player.attacking === true){ //if the player is attacking
            this.fistGrp.x += 100
        }

        // FIST COLLIDER THINGS<3 WIP --> From Fight Fighters
        this.collider = scene.physics.add.collider(enemy, this.fistGrp, () => {
            if (!enemy.immune){
                enemy.hurt = true
            }

            enemy.health -= 5

            if (enemy.health <= 0){ //game over condition
                enemy.health = 0
                scene.gameOver = true
                enemy.healthBar.setScale(0, 1)
            }
            else { //decrease health bar (not dependent of whos fist is it, will take care of either situation) WIP
                if (enemy.name == "AngelKnives"){
                    enemy.healthBar.setScale(enemy.health/1000, 1)
                }
                else { //BlackFang health
                    enemy.healthBar.setScale(enemy.health/1000, 1)
                }
            } 
        }, null, scene)
    }
}