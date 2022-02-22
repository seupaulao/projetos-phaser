var App = function() {};

App.prototype.start = function()
{
    var cenas = [];

    cenas.push(BootScene);
    cenas.push(PreloadScene);
    cenas.push(IntroScene);
    cenas.push(GameScene);
    
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
        scene: cenas
    };
    
    var game = new Phaser.Game(config);

    this.scene.start('Boot');
}

window.onload = function()
{
	'use strict';
	
	var app = new App();

	app.start();
}