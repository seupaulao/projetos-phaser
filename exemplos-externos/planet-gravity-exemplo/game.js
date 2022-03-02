let game;
let gameOptions = {
    gameGravity: 900,
    heroSpeed: 200,
    jumpForce: 250
}
 
const SIDE_UP = 0;
const SIDE_RIGHT = 1;
const SIDE_DOWN = 2;
const SIDE_LEFT = 3;
 
window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: 0x444444,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 800,
            height: 400
        },
        physics: {
            default: "arcade"
        },
       scene: playGame
    }
    game = new Phaser.Game(gameConfig);
}
 
class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    preload(){
        this.load.image("tile", "tile.png");
        this.load.image("hero", "hero.png");
    }
    create(){
        this.wall = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "tile");
        this.wall.displayWidth = game.config.width / 2;
        this.wall.displayHeight = game.config.height / 2;
        this.wall.setImmovable(true);
        this.hero = this.physics.add.sprite(game.config.width / 2, this.wall.getBounds().top - 100, "hero");
        this.hero.body.gravity.y = gameOptions.gameGravity;
        this.controls = this.input.keyboard.createCursorKeys();
        this.rotating = false;
        this.direction = SIDE_UP;
    }
 
    update(){
        this.physics.world.collide(this.hero, this.wall, null, null, this);
        if(!this.rotating){
            if(this.controls.left.isDown && !this.controls.right.isDown){
                this.moveCounterClockwise();
            }
            else {
                if(this.controls.right.isDown && !this.controls.left.isDown){
                    this.moveClockwise();
                }
                else{
                    this.stopMoving();
                }
            }
            if(this.controls.up.isDown){
                this.jump();
            }
            this.checkRotation();
        }
    }
 
    moveCounterClockwise(){
        this.hero.setFlipX(true);
        switch(this.direction){
            case SIDE_UP:
                this.hero.setVelocity(-gameOptions.heroSpeed, this.hero.body.velocity.y);
                break;
            case SIDE_DOWN:
                this.hero.setVelocity(gameOptions.heroSpeed, this.hero.body.velocity.y);
                break;
            case SIDE_LEFT:
                this.hero.setVelocity(this.hero.body.velocity.x, gameOptions.heroSpeed);
                break;
            case SIDE_RIGHT:
                this.hero.setVelocity(this.hero.body.velocity.x, -gameOptions.heroSpeed);
                break;
        }
    }
 
    moveClockwise(){
        this.hero.setFlipX(false);
        switch(this.direction){
            case SIDE_UP:
                this.hero.setVelocity(gameOptions.heroSpeed, this.hero.body.velocity.y);
                break;
            case SIDE_DOWN:
                this.hero.setVelocity(-gameOptions.heroSpeed, this.hero.body.velocity.y);
                break;
            case SIDE_LEFT:
                this.hero.setVelocity(this.hero.body.velocity.x, -gameOptions.heroSpeed);
                break;
            case SIDE_RIGHT:
                this.hero.setVelocity(this.hero.body.velocity.x, gameOptions.heroSpeed);
                break;
        }
    }
 
    stopMoving(){
        switch(this.direction){
            case SIDE_UP:
                this.hero.setVelocity(0, this.hero.body.velocity.y);
                break;
            case SIDE_DOWN:
                this.hero.setVelocity(0, this.hero.body.velocity.y);
                break;
            case SIDE_LEFT:
                this.hero.setVelocity(this.hero.body.velocity.x, 0);
                break;
            case SIDE_RIGHT:
                this.hero.setVelocity(this.hero.body.velocity.x, 0);
                break;
        }
    }
 
    checkRotation(){
        switch(this.direction){
            case SIDE_UP:
                if(this.hero.getBounds().left > this.wall.getBounds().right && !this.rotating){
                    this.handleRotation(1, this.wall.getBounds().right + this.hero.displayWidth / 2 + this.getHeight(), this.wall.getBounds().top + this.hero.displayHeight / 2);
                }
                if(this.hero.getBounds().right < this.wall.getBounds().left && !this.rotating){
                    this.handleRotation(-1, this.wall.getBounds().left - this.hero.displayWidth / 2 - this.getHeight(), this.wall.getBounds().top + this.hero.displayHeight / 2);
                }
                break;
            case SIDE_RIGHT:
                if(this.hero.getBounds().top > this.wall.getBounds().bottom && !this.rotating){
                    this.handleRotation(1, this.wall.getBounds().right - this.hero.displayWidth / 2, this.wall.getBounds().bottom + this.hero.displayHeight / 2 + this.getHeight());
                }
                if(this.hero.getBounds().bottom < this.wall.getBounds().top && !this.rotating){
                    this.handleRotation(-1, this.wall.getBounds().right - this.hero.displayWidth / 2, this.wall.getBounds().top - this.hero.displayHeight / 2 - this.getHeight());
                }
                break;
            case SIDE_DOWN:
                if(this.hero.getBounds().right < this.wall.getBounds().left && !this.rotating){
                    this.handleRotation(1, this.wall.getBounds().left - this.hero.displayWidth / 2 - this.getHeight(), this.wall.getBounds().bottom - this.hero.displayHeight / 2);
                }
                if(this.hero.getBounds().left > this.wall.getBounds().right && !this.rotating){
                    this.handleRotation(-1, this.wall.getBounds().right + this.hero.displayWidth / 2 + this.getHeight(), this.wall.getBounds().bottom - this.hero.displayHeight / 2);
                }
                break;
            case SIDE_LEFT:
                if(this.hero.getBounds().bottom < this.wall.getBounds().top && !this.rotating){
                    this.handleRotation(1, this.wall.getBounds().left + this.hero.displayWidth / 2, this.wall.getBounds().top - this.hero.displayHeight / 2 - this.getHeight());
                }
                if(this.hero.getBounds().top > this.wall.getBounds().bottom && !this.rotating){
                    this.handleRotation(-1, this.wall.getBounds().left + this.hero.displayWidth / 2, this.wall.getBounds().bottom + this.hero.displayHeight / 2 + this.getHeight());
                }
                break;
        }
    }
 
    handleRotation(delta, targetX, targetY){
        this.hero.body.setAllowGravity(false);
        this.hero.setVelocity(0, 0)
        this.rotating = true;
        this.tweens.add({
            targets: [this.hero],
            angle: this.hero.angle + 90 * delta,
            x: targetX,
            y: targetY,
            duration: 200,
            callbackScope: this,
            onComplete: function(){
                this.rotating = false;
                this.hero.body.setAllowGravity(true);
                this.direction = Phaser.Math.Wrap(this.direction + delta, 0, 4);
                this.setGravity();
            }
        });
    }
 
    setGravity(){
        switch(this.direction){
            case SIDE_UP:
                this.hero.setGravity(0, gameOptions.gameGravity);
                break;
            case SIDE_DOWN:
                this.hero.setGravity(0, -gameOptions.gameGravity);
                break;
            case SIDE_LEFT:
                this.hero.setGravity(gameOptions.gameGravity, 0);
                break;
            case SIDE_RIGHT:
                this.hero.setGravity(-gameOptions.gameGravity, 0);
                break;
        }
    }
 
    jump(){
        switch(this.direction){
            case SIDE_UP:
                if(this.hero.body.touching.down){
                    this.hero.setVelocityY(-gameOptions.jumpForce);
                }
                break;
            case SIDE_DOWN:
                if(this.hero.body.touching.up){
                    this.hero.setVelocityY(gameOptions.jumpForce);
                }
                break;
            case SIDE_LEFT:
                if(this.hero.body.touching.right){
                    this.hero.setVelocityX(-gameOptions.jumpForce);
                }
                break;
            case SIDE_RIGHT:
                if(this.hero.body.touching.left){
                    this.hero.setVelocityX(gameOptions.jumpForce);
                }
                break;
        }
    }
 
    getHeight(){
        switch(this.direction){
            case SIDE_UP:
                return this.wall.getBounds().top - this.hero.getBounds().bottom;
            case SIDE_DOWN:
                return this.hero.getBounds().top - this.wall.getBounds().bottom;
            case SIDE_LEFT:
                return this.wall.getBounds().left - this.hero.getBounds().right;
            case SIDE_RIGHT:
                return this.hero.getBounds().left - this.wall.getBounds().right;
        }
    }
}