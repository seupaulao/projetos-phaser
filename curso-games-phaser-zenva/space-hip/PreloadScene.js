class PreloadScene extends Phaser.Scene{
	constructor(){
	  super("Preload");
	}
  
    preload(){
		console.log("preload scene!");
        this.load.image('logo', 'logo.png');
        this.load.image('sky', 'sky.png');

	}

	create(){
	    this.scene.start('Intro');
	}
  }
