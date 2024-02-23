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

        //health bars: https://phasergames.com/how-to-make-a-health-bar-in-phaser-3/
        this.fangHealth = makeBar(520,50,0xfff914, scene).setScale(.5)
        setValue(this.fangHealth,100);


        this.angelHealth = makeBar(140,50,0xfff914, scene).setScale(.5)
        setValue(this.angelHealth,100);


        // FIST COLLIDER THINGS<3 WIP --> From Fight Fighters
        this.collider = scene.physics.add.collider(enemy, this.fistGrp, () => {
            if (!enemy.immune){
                enemy.hurt = true
            }

            enemy.health -= 5

            if (enemy.health <= 0){ //game over condition
                enemy.health = 0
                scene.gameOver = true
            }
            else { //decrease health bar (not dependent of whos fist is it, will take care of either situation) WIP
                if (enemy.name == "AngelKnives"){
                    setValue(this.angelHealth, enemy.health);
                    console.log("being hit");
                }
                else { //BlackFang health
                    setValue(this.fangHealth, enemy.health);
                }
            } 
        }, null, scene)
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