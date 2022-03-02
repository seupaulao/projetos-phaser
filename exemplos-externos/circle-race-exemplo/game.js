let game;
let gameOptions = {
    circleRadius: 300,
    circleStrokeWidth: 20,
    circleDistance: 400,
    ballRadius: 50,
    ballSpeed: [0.5, 2],
    enemySpeedRange: [0.5, 1]
}
window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: 0x222222,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 750,
            height: 1334
        },
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}
class playGame extends Phaser.Scene{
    constructor() {
        super("PlayGame");
    }
    create() {
        this.rounds = 0;
        this.leftSide = false;
        let actualSize = gameOptions.circleStrokeWidth + gameOptions.circleRadius;
        let assetsGraphics = this.make.graphics();
        assetsGraphics.lineStyle(gameOptions.circleStrokeWidth, 0xffffff);
        assetsGraphics.strokeCircle(actualSize, actualSize, gameOptions.circleRadius);
        assetsGraphics.generateTexture("circle", 2 * actualSize, 2 * actualSize);
        assetsGraphics.clear();
        assetsGraphics.fillStyle(0x00ff00);
        assetsGraphics.fillCircle(gameOptions.ballRadius, gameOptions.ballRadius, gameOptions.ballRadius);
        assetsGraphics.generateTexture("ball", 2 * gameOptions.ballRadius, 2 * gameOptions.ballRadius);
        assetsGraphics.clear();
        assetsGraphics.fillStyle(0xff0000);
        assetsGraphics.fillCircle(gameOptions.ballRadius, gameOptions.ballRadius, gameOptions.ballRadius);
        assetsGraphics.generateTexture("enemyball", 2 * gameOptions.ballRadius, 2 * gameOptions.ballRadius);
        this.upperCircle = this.add.sprite(game.config.width / 2, game.config.height / 2 - gameOptions.circleDistance / 2, "circle");
        this.lowerCircle = this.add.sprite(game.config.width / 2, game.config.height / 2 + gameOptions.circleDistance / 2, "circle");
        this.ball = this.add.sprite(this.upperCircle.x, this.upperCircle.y - gameOptions.circleRadius, "ball");
        this.ball.radians = - Math.PI / 2;
        this.ball.speed = gameOptions.ballSpeed[1];
        this.enemyGroup = this.add.group();
        this.input.on("pointerdown", function() {
            this.ball.speed = gameOptions.ballSpeed[0];
        }, this);
        this.input.on("pointerup", function() {
            this.ball.speed = gameOptions.ballSpeed[1];
        }, this);
    }
    update(t, dt) {
        this.ball.radians += this.ball.speed * dt / 1000;
        this.ball.x = this.upperCircle.x + gameOptions.circleRadius * Math.cos(this.ball.radians);
        this.ball.y = this.upperCircle.y + gameOptions.circleRadius * Math.sin(this.ball.radians);
        this.enemyGroup.children.iterate(function(enemy) {
            enemy.radians += enemy.speed * dt / 1000;
            enemy.x = this.lowerCircle.x + gameOptions.circleRadius * Math.cos(enemy.radians);
            enemy.y = this.lowerCircle.y + gameOptions.circleRadius * Math.sin(enemy.radians);
            if(Phaser.Math.Distance.Between(this.ball.x, this.ball.y, enemy.x, enemy.y) < gameOptions.ballRadius * 2) {
                this.scene.start("PlayGame");
            }
        }, this);
        let previousLeftSide = this.leftSide;
        this.leftSide = this.ball.x < game.config.width / 2;
        if(previousLeftSide && !this.leftSide) {
            let randomAngle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            let randomSpeed = Phaser.Math.FloatBetween(gameOptions.enemySpeedRange[0], gameOptions.enemySpeedRange[1]);
            let enemy = this.add.sprite(this.lowerCircle.x + gameOptions.circleRadius * Math.cos(randomAngle), this.lowerCircle.y + gameOptions.circleRadius * Math.sin(randomAngle), "enemyball");
            enemy.speed = randomSpeed;
            enemy.radians = randomAngle;
            this.enemyGroup.add(enemy);
        }
    }
}