//var App = function() {};

//App.prototype.start = function()
//{
    
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 }
            }
        },
        scene: [BootScene, PreloadScene, IntroScene, GameScene]
    };
    
    var game = new Phaser.Game(config);

//}

//window.onload = function()
//{
//	'use strict';
//	
//	var app = new App();
//
//	app.start();
//}