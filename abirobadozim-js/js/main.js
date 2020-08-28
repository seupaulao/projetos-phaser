
       /*
          TESTE 4 - walljump com array de tiles
          OK carregar level
          OK diferenciar objetos dos tiles
          OK carregar grupos de objetos
          OK criar mais levels - 10 até o momento
          OK movimento walljump
             separar codigo - aplicar STATES
             OK criar SCORE
             OK criar LIFE
             colocar sons
             musica de fundo - simples e repetitiva
             criar tela de opcoes
             criar tela inicial
             criar tela game over
             criar tela de topscore
             criar inimigo simples
             colocar mais sprites
             tentar colocar fundo parallax ou fundo animado
            
       spritesheet
	       animacao personagem
		       correr, pular, morrer, nadar, escalar, parado
	       animacao inimigo simples 1 - cor basica
	       animacao inimigo simples 2 - cor basica
	       animacao inimigo simples 3 - cor basica
	       animacao inimigo simples 4 - cor basica
	       tiles de construcao - terreno aberto
	       tiles de construcao - submundo
	       tiles de construcao - mundo aquatico
               icones
                       puloduplo, voltar
       */

var currentlevel = 0;
var bkey = false;
var vidas = 3;
var score = 0;
var game;

var gameOptions = {

    // width of the game, in pixels
    gameWidth: 640,

    // height of the game, in pixels
    gameHeight: 480,

    // background color
    bgColor: '#3598db',

    // player gravity
    playerGravity: 600,

    // player friction when on wall
    playerGrip: 100,

    // player horizontal speed
    playerSpeed: 200,

    // player jump force
    playerJump: 300,

    // player double jump force
    playerDoubleJump: 300
}
var mainState = {

   preload: function() {
        game.load.image('tiles', 'img/tiles.png');
        game.load.image('player', 'img/persona1.png');
        game.load.image('coin', 'img/coin.png');
        game.load.image('lava', 'img/lava.png');
        game.load.image('key', 'img/key.png');
        game.load.image('cdoor', 'img/cdoor.png');
   },

   create: function() {
       game.stage.backgroundColor = gameOptions.bgColor;
       game.physics.startSystem(Phaser.Physics.ARCADE);
       game.world.enableBody = true;
       game.world.resize(gameOptions.gameWidth*5, 5*gameOptions.gameHeight);

       //modo de scalemanager
       //nao abre a tela toda, mas a camera acompanha o personagem perfeitamente
       game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
       //abre a tela toda, fica lindo, mas a camera falha em acompanhar o personagem
       game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
 
       //alinhamento do jogo
       game.scale.pageAlignHorizontally = true;                           
       game.scale.pageAlignVertically = true;

       //forçando a orientacao para landscape
       if (!game.device.desktop)                                     
        {
            game.scale.forceOrientation(true, false);
        }
        game.scale.setMaximum();

        //aplicando fullscreen
        game.scale.startFullScreen(true); 


       var data = level[currentlevel];
       game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);
       this.map = game.add.tilemap('dynamicMap', 30, 30);
       this.map.setCollisionBetween(1, 5);
       this.map.addTilesetImage('tiles','tiles',30,30);

       this.layer = this.map.createLayer(0);
       this.layer.resizeWorld();

       this.coins = game.add.group();
       this.spikes = game.add.group();
       this.keys = game.add.group();
       this.doors = game.add.group();

       this.carregaObjetos();

       game.physics.arcade.enable(this.player);
       this.player.body.gravity.y = gameOptions.playerGravity;
       this.player.body.velocity.x = gameOptions.playerSpeed;
       // the hero can jump
       this.canJump = true;

       // the hero is not on the wall
       this.onWall = false;

       // waiting for player input
       game.input.onDown.add(this.handleJump, this);

       game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER, 0.1, 0.1);

       this.texto1 = game.add.text(20,20,'score: 0      vidas:3');
       this.texto1.fixedToCamera = true;


   },

   handleJump: function()
   {
     // the hero can jump when:
     // canJump is true AND the hero is on the ground (blocked.down)
     // OR
     // the hero is on the wall
     if((this.canJump && this.player.body.blocked.down) || this.onWall){

         // applying jump force
         this.player.body.velocity.y = -gameOptions.playerJump;

         // is the hero on a wall?
         if(this.onWall){

             // flip horizontally the hero
             this.player.scale.x *= -1;

             // change the horizontal velocity too. This way the hero will jump off the wall
             this.player.body.velocity.x = gameOptions.playerSpeed * this.player.scale.x;
         }

         // hero can't jump anymore
         this.canJump = false;

         // hero is not on the wall anymore
         this.onWall = false;
     }
   },

   carregaObjetos: function() {
       var obj = strobjetos[currentlevel].data.split(",");
       var yy=0;
       var cx=0;
       for(var i = 0; i < obj.length; i++)
       {
           if((i > 0) && (i % strobjetos[currentlevel].colunas == 0)) {
              yy += 30;
              cx = 0;
           }
           if(obj[i]=='2')
           {
              var tx = 30*cx
              var k = game.add.sprite(tx, yy, 'coin');
              this.coins.add(k);
           }
           else if(obj[i]=='3')
           {
              var tx = 30*cx
              var k = game.add.sprite(tx, yy, 'lava');
              this.spikes.add(k);
           }
           else if(obj[i]=='4')
           {
              var tx = 30*cx
              var k = game.add.sprite(tx, yy, 'key');
              this.keys.add(k);
           }
           else if(obj[i]=='5')
           {
              var tx = 30*cx
              var k = game.add.sprite(tx, yy, 'cdoor');
              this.doors.add(k);
           }
           else if(obj[i]=='6')
           {
              var tx = 30*cx
              this.player = game.add.sprite(tx, yy, 'player');
           }
              cx++;
       }

   },

   update: function() {

     // handling collision between the hero and the tiles
     game.physics.arcade.collide(this.player, this.layer, function(player, layer){

         // hero on the ground
         if(player.body.blocked.down){

             // hero can jump
             this.canJump = true;

             // hero not on the wall
             this.onWall = false;
         }

         // hero on the ground and touching a wall on the right
         if(this.player.body.blocked.right && this.player.body.blocked.down){

             // horizontal flipping hero sprite
             this.player.scale.x = -1;
         }

         // hero NOT on the ground and touching a wall on the right
         if(this.player.body.blocked.right && !this.player.body.blocked.down){

             // hero on a wall
             this.onWall = true;
         }

         // same concept applies to the left
         if(this.player.body.blocked.left && this.player.body.blocked.down){
             this.player.scale.x = 1;
         }
         if(this.player.body.blocked.left && !this.player.body.blocked.down){
             this.onWall = true;
         }

         // adjusting hero speed according to the direction it's moving
         this.player.body.velocity.x = gameOptions.playerSpeed * this.player.scale.x;
     }, null, this);


        game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this);

        game.physics.arcade.overlap(this.player, this.spikes, this.takeDamage, null, this);

        game.physics.arcade.overlap(this.player, this.keys, this.takeKey, null, this);

        game.physics.arcade.overlap(this.player, this.doors, this.nextLevel, null, this);

   },


   takeCoin: function(player, coin)
   {
      coin.kill();
      score += 5;
      this.texto1.text = 'score: '+score+'      vidas:'+vidas;
   },

   takeDamage: function()
   {
      vidas--;
      this.texto1.text = 'score: '+score+'      vidas:'+vidas;
      bkey = false;
      if (vidas <= 0)
      {
        vidas = 3;
        score = 0;
        currentlevel = 0;
        this.texto1.text = 'score: '+score+'      vidas:'+vidas;
        game.state.start('main', true, false, currentlevel);
      }
      else {
         game.state.start('main', true, false, currentlevel);
      }
   },

   takeKey: function(player, key)
   {
       key.kill();
       bkey = true;
       score += 10;
       this.texto1.text = 'score: '+score+'      vidas:'+vidas;
   },

   nextLevel: function()
   {
       if (bkey) {
           currentlevel+=1;
           if (currentlevel >= level.length) {
                currentlevel = 0;
           }
           bkey=false;
           score += 20;
           this.texto1.text = 'score: '+score+'      vidas:'+vidas;
           game.state.start('main', true, false, currentlevel);
       }
   }

};

window.onload = function() {
        game = new Phaser.Game(gameOptions.gameWidth,gameOptions.gameHeight);
        game.state.add('main',mainState);
        game.state.start('main', true, false, 0);
}
