
class GameScene extends Phaser.Scene{
	constructor(){
	  super("Game");
	}

	preload(){
		'use strict';
	
	}
  
	create(){

	  'use strict';
	console.log("jogo  iniciado");
	// ...
	this.add.image(400, 300, 'sky');
	this.add.text(20, 20, "Playing game", {font: "25px Arial", fill: "yellow"});

        var particles = this.add.particles('red');

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        var logo = this.physics.add.image(400, 100, 'logo');

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
	}
  }
