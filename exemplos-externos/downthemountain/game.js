var game;
var hexagonWidth = 70;
var hexagonHeight = 80;
var minRow = 0;
var gridSizeX = 5;
var gridSizeY = 14;
var marker;
var hexagonGroup;
var playerCol = 2;
var playerRow = 0;
var playerMove = true;

window.onload = function() {
    game = new Phaser.Game(480, 480);
    game.state.add("PlayGame", playGame);
    game.state.start("PlayGame");
}
var playGame = function(game){}
playGame.prototype = {
    preload: function(){
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.load.image("hexagon", "hexagon.png");
        game.load.spritesheet("marker", "marker.png", 56, 64);
    },
    create: function(){
        this.hexagonPool = [];
        hexagonGroup = game.add.group();
        game.stage.backgroundColor = "#ffffff";
        for(var i = 0; i < gridSizeY; i ++){
            this.addHexagonRow(i);
        }
        hexagonGroup.x = (game.width - hexagonWidth * gridSizeX) / 2;
        hexagonGroup.y = 20;
        marker = game.add.sprite(hexagonGroup.width / 2, 6, "marker");
        marker.anchor.setTo(0.5);
        hexagonGroup.add(marker);
        game.input.onDown.add(function(e){
            if(playerMove){
                if(e.x < (game.width / 2) && (playerCol > 0 || (playerRow % 2 == 1))){
                    placeMarker(playerCol - (1 - playerRow % 2), playerRow + 1);
                    marker.frame = 0;
                }
                if(e.x >= (game.width / 2) &&  playerCol < gridSizeX - 1){
                    placeMarker(playerCol + (playerRow % 2), playerRow + 1);
                    marker.frame = 1;
                }
            }
        }, this)
    },
    update: function(){
        if(marker.world.y > 60){
            var distance = 60 - marker.world.y
            hexagonGroup.y += distance / 25;
        }
        hexagonGroup.forEach(function(item){
            if(item.world.y < 0){
                item.y += hexagonHeight * (gridSizeY * 3 / 4);
                item.row += gridSizeY;
                item.children[0].text = item.row + "," + item.col;
            }
        }, this);
    },
    addHexagonRow: function(i){
        for(var j = 0; j < gridSizeX - i % 2; j ++){
            var hexagonX = hexagonWidth * j + (hexagonWidth / 2) * (i % 2);
            var hexagonY = hexagonHeight * i / 4 * 3;
            var hexagon = game.add.sprite(hexagonX, hexagonY, "hexagon");
            hexagon.row = i;
            hexagon.col = j;
            var hexagonText = game.add.text(0 + hexagonWidth / 3 + 5, 0 + 15, i + "," + j);
            hexagonText.font = "arial";
            hexagonText.align = "center";
            hexagonText.fontSize = 10;
            hexagon.addChild(hexagonText);
            hexagonGroup.add(hexagon);
        }
    }
}
function placeMarker(posX, posY){
    playerRow = posY;
    playerCol = posX;
    var nextX = hexagonWidth * (2 * posX + 1 + posY % 2) / 2;
    var nextY = hexagonHeight * (3 * posY + 1) / 4 - 14;
    playerMove = false;
    var bezierX = hexagonWidth;
    if(marker.x > nextX){
        bezierX *= -1;
    }
    var playerTween = game.add.tween(marker).to({
        x: [marker.x, marker.x + bezierX, nextX, nextX],
        y: [marker.y, marker.y, nextY, nextY]
    }, 100, Phaser.Easing.Linear.None, true).interpolation(function(v, k){
        return Phaser.Math.bezierInterpolation(v, k);
    });
    playerTween.onComplete.add(function(){
        playerMove = true;
    });
    marker.bringToTop();
}
