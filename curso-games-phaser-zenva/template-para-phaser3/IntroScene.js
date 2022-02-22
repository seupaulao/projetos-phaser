class IntroScene extends Phaser.Scene{
	constructor(){
	  super("Intro");
	}
  
	create(){
	  this.add.image(400,300,'logo');
	  this.add.text(20, 20, "Intro Scene", {font: "25px Arial", fill: "yellow"});
	  this.add.image(100,150,'b2');
	  this.add.image(100,200,'b3');
	  this.scene.start("Game");
	}
  }