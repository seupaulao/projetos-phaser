window.onload = function() {
	
	var game = new Phaser.Game(480,320,Phaser.CANVAS,"",{preload:onPreload, create:onCreate, update:onUpdate});                

	var playerSpeed = 150;
	var bulletXSpeed = 3;
	var player;
	var platformGroup;
	var onPlatform = false;
	var readyToFire = false;

	function onPreload() {
		game.load.image("platform180","platform180.png");
		game.load.image("platform120","platform120.png");
		game.load.image("player","player.png");
		game.load.image("ground","ground.png");
		game.load.image("bullet","bullet.png");
	}

	function onCreate() {
		platformgroup = game.add.group();
		game.physics.startSystem(Phaser.Physics.ARCADE);
		player = game.add.sprite(240, 0, "player");
		player.anchor.setTo(0.5);
		game.physics.enable(player, Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = playerSpeed;
		addPlatform(240,60,"platform180");  
		addPlatform(340,140,"platform120");  
		addPlatform(140,140,"platform120");
		addPlatform(420,220,"platform120"); 
		addPlatform(60,220,"platform120");
		addPlatform(100,316,"ground");
		addPlatform(380,316,"ground");
		game.input.onDown.add(changeDir, this);	
	}
	
	function addPlatform(posX,posY,asset){
		platform = game.add.sprite(posX,posY,asset)
		platform.anchor.setTo(0.5);
		game.physics.enable(platform, Phaser.Physics.ARCADE);
		platform.body.allowGravity = false;
		platform.body.immovable = true;
		platformgroup.add(platform);	
	}
	
	function onUpdate() {
		player.body.velocity.y = Math.abs(playerSpeed);
		player.body.velocity.x = 0;
		onPlatform = false;
		game.physics.arcade.collide(player, platformgroup, movePlayer);
		if(!onPlatform){
			readyToFire = true;
		}
		if(player.y>320){
			player.y = 0
		}
		if(player.x<12){
			player.x=12;
			playerSpeed*=-1
		}
		if(player.x>468){
			player.x=468;
			playerSpeed*=-1
		}

	}
	
	function movePlayer(){     
		player.body.velocity.x = playerSpeed;
		onPlatform = true;
		if(readyToFire){
			var bullet = new Bullet(game, player.x, player.y, playerSpeed, bulletXSpeed);
			game.add.existing(bullet);
			readyToFire = false;
		}
	}
	
	function changeDir(){
		playerSpeed *= -1;
	}
	
	Bullet = function (game, x, y, direction, speed) {
		Phaser.Sprite.call(this, game, x, y, "bullet");
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.xSpeed = direction*speed;
	};
	
	Bullet.prototype = Object.create(Phaser.Sprite.prototype);
	Bullet.prototype.constructor = Bullet;
	
	Bullet.prototype.update = function() {
     	this.body.velocity.y = 0;
		this.body.velocity.x = this.xSpeed;
		if(this.x<0 || this.x>480){
			this.destroy();
		}
	};
	
}