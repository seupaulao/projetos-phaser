class PreloadScene extends Phaser.Scene{
	constructor(){
	  super("Preload");
	}
  
	/*
	Criar artes
	  - logo.png
	  - preloadbar.png
	  - sky.png   - plano de fundo [OK]
	  - space.png - plano de fundo
	  - rocha.png - spritesheet
	  - player.png - spritesheet
	  - power.png
	  - particle.png
	  - explosao - som
	  - coletar  - som
	*/
    preload(){
		console.log("preload scene!");
        this.load.image('logo', 'logo.png');
        this.load.image('sky', 'sky.png');

	}

	create(){
	    this.scene.start('Intro');
	}
  }
