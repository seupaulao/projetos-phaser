var BootScene= new Phaser.Scene('Boot');

BootScene.preload = function()
{
	'use strict';
	console.log("boot scene!");
	// ...
};

BootScene.create= function()
{
	'use strict';
	this.scene.start('Preload');
	// ...
};

BootScene.update= function()
{
	'use strict';
	
	// ...
};