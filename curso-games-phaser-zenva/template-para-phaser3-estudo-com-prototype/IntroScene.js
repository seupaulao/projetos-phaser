var IntroScene= new Phaser.Scene('Intro');

IntroScene.preload = function()
{
	'use strict';
	console.log("intro scene");
	// ...
};

IntroScene.create= function()
{
	'use strict';
	this.scene.start('Game');
	// ...
};

IntroScene.update= function()
{
	'use strict';
	
	// ...
};