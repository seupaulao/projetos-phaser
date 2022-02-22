var PreloadScene= new Phaser.Scene('Preload');

PreloadScene.preload = function()
{
	'use strict';
	console.log("preload scene!");
	// ...
};

PreloadScene.create= function()
{
	'use strict';
	this.scene.start('Intro');
	// ...
};

PreloadScene.update= function()
{
	'use strict';
	
	// ...
};