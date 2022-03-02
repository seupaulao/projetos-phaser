class PreloadScene extends Phaser.Scene{
	constructor(){
	  super("Preload");
	}
  
    preload(){
		console.log("preload scene!");
		this.load.setBaseURL('');
        this.load.image('zlogo', 'zenva_logo.png');
		this.load.image('b2', 'blue_button02.png');
		this.load.image('b3', 'blue_button03.png');

		// this.load.setBaseURL('http://labs.phaser.io');
        this.load.image('sky', 'space3.png');
        this.load.image('logo', 'phaser3-logo.png');
        this.load.image('red', 'red.png');


	}

	create(){
		this.add.image(400,300,'zlogo');
	    this.scene.start('Intro');
	}
  }
