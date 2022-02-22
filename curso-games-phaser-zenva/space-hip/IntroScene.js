class IntroScene extends Phaser.Scene{
	constructor(){
	  super("Intro");
	}
  
	create(){
	  this.scene.start("Game");
	}
  }