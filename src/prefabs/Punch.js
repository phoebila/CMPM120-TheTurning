// punch prefab
class Punch extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, enemy){
        super(scene, x, y, enemy)

        // Fist physics
        this.fist = scene.physics.add.sprite(x, y).setScale(3)
        this.fist.body.setCircle(5)
        this.fist.body.setAngularVelocity(-20)
        this.fist.body.setImmovable(true)
        this.fist.body.onCollide = true
        // adding fist to a physics grp
        this.fistGrp = scene.add.group([this.fist])


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