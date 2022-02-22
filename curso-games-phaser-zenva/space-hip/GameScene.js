
class GameScene extends Phaser.Scene{
	constructor(){
	  super("Game");
	}

	preload(){
		'use strict';
	
	}
  
	create(){

	
	this.add.image(400, 300, 'sky');
	this.add.image(300, 300, 'logo');
	
	}
  }
