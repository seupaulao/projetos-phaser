var game;

var pinguim;
var peixeColors = [0xff0000, 0xff00ff];
var pinguimTurnSpeed = 250;

var pinguimGroup;
var obstacleGroup;
var score;
var texto;
var level;
var lado;
var obstacleSpeed ;
var obstacleDelay ;
var contcomida;
var objcriado=false;

defineVelocidade = function(_speed, _delay)
{
   obstacleSpeed = _speed;
   obstacleDelay = _delay;
}

getVelocidade = function(level)
{
   switch(level)
   {
       case 1: defineVelocidade(200,1300); break;
       case 2: defineVelocidade(200,1000); break;
       case 3: defineVelocidade(400,600); break;
       default: defineVelocidade(600, 600); break;
   } 
}

window.onload = function() {	
     game = new Phaser.Game(320, 480, Phaser.AUTO, "");
     game.state.add("PlayGame",playGame);
     game.state.start("PlayGame");
}

var playGame = function(game){};

playGame.prototype = {
	preload: function(){
          game.load.image("piscinas", "img/piscinas.png");
          game.load.image("pinguim", "img/pinguim.png");
          game.load.image("barreira", "img/barreira.png");
          game.load.image("peixe", "img/peixe.png");
          game.load.image("gelo", "img/iceberg.png");
          game.load.image("rocha0", "img/rocha0.png");
          game.load.image("rocha1", "img/rocha1.png");
          game.load.image("arvore0", "img/arvore0.png");
          game.load.image("arvore1", "img/arvore1.png");
          game.load.image("arvore2", "img/arvore2.png");
          game.load.image("camarao", "img/camarao.png");
          game.load.image("madeira", "img/madeira.png");
          /* 
          1 - colocar os novos elementos para funcionar no jogo basico
          2 - criar as animacoes
              - animacao inicial fazendo todos os pinguins adversarios passarem por mim
              - inclinar antes de mover para o lado
              - suavizar aceleracao automatica; gradualmente aumenta a velocidade
              - fazer animacao com sensacao de movimento na agua - marolas passando, outra coisa (particulas)
          5 - telas
              - de pausa - clique para continuar
              - de inicio
              - de fim de jogo
              - de mapas/fases?
          8 - modo 1: 
                - corrida infinita
                  - muda o cenario e inimigos na medida que avanca
              modo 2:
                - fase a fase
              modo 3 - misto : cenario poderia ser o mesmo, porém altera-se:
                - cor da água
                - margens do rio
                - cor dos peixes     
          10 - placar : score, comida, adversarios ultrapassados, level
             - compartilhar, redes sociais
          14 - o primeiro lugar é a meta principal do jogo, a meta secundária é:
             1. pontuar
             2. pegar determinadas coisas
             3. cumprir tarefas
          */
	},
  	create: function(){
          contcomida = 0;
          level=1;  
          getVelocidade(3);
          game.add.image(0, 0, "piscinas");
          game.physics.startSystem(Phaser.Physics.ARCADE);
          pinguimGroup = game.add.group();
          obstacleGroup = game.add.group();
               lado=1;
               pinguim = game.add.sprite(0, game.height - 40, "pinguim");
               pinguim.positions = [game.width * 1 / 6, game.width * 3 / 6, game.width * 5 / 6];
               pinguim.anchor.set(0.5);
               pinguim.canMove = true;
               pinguim.side = 1;
               pinguim.x = pinguim.positions[pinguim.side];
               game.physics.enable(pinguim, Phaser.Physics.ARCADE); 
               pinguim.body.allowRotation = false;
               pinguim.body.moves = false;  
               pinguimGroup.add(pinguim);
          score = 0;
          //texto = game.add.text(20,20,'level 1 score: 0',{'fill':'#FF0000'});

          game.input.onDown.add(movePinguim);

          game.time.events.loop(obstacleDelay, function(){
                   var opcao = game.rnd.between(0,3);
                   if (opcao <= 0)
                   {
                       var buraco =  game.rnd.between(0,2); //0 a N - onde N eh o numero de objetos
                       var obstacle;
  
                       for (var i = 0; i <= 2; i++)         //funciona como tunel, apenas um espaco estara aberto
                       {
                            pos = qualPosicao(i);
                            if (i==buraco)
                            {
                               obstacle = new Obstacle2(game, pos, "peixe");
                            } else {
                               obstacle = new Obstacle2(game, pos, "barreira");
                            } 
                            game.add.existing(obstacle);
                            obstacleGroup.add(obstacle);
                       }

                   } 
                   else { 
                       var obstacle = new Obstacle(game, objetoPosicaoAleatoria());
                       game.add.existing(obstacle);
                       obstacleGroup.add(obstacle);
                   }
          });          
	},
     update: function(){
          game.physics.arcade.collide(pinguimGroup, obstacleGroup, this.verificarColisao);
     },
     verificarColisao:function(_pinguim, _obj)
     {
        if (_obj.key=="peixe")
        {
             score += 5;
             //texto.text = "level " + level + " score: " + score;
             contcomida += 1;
             if (contcomida >= 5)
             {
               level += 1;
               //getVelocidade(level);
               contcomida = 0; 
             }  
           
             _obj.kill();
        }
        if (_obj.key=="barreira")
        {
             game.state.start("PlayGame");
        }
     },
     render: function()
    {
       game.debug.text("Velocidade: " + obstacleSpeed,100,30);
       game.debug.text("Delay: " + obstacleDelay,100,60);
    }
}

function movePinguim(e){
     var teclo = Math.floor(e.position.x / (game.width / 2));
     if(pinguim.canMove){
          pinguim.canMove = false;
          //******funciona para um rio de 3 lados apenas******* 
          if (teclo == 0) lado--;
          if (teclo == 1) lado++;
          if (lado <= 0) lado=0;
          if (lado >= 2) lado=2; 
          //***************************************************
          pinguim.side = lado;
          var moveTween = game.add.tween(pinguim).to({ 
               x: pinguim.positions[pinguim.side],
          }, pinguimTurnSpeed, Phaser.Easing.Linear.None, true);
          moveTween.onComplete.add(function(){
               pinguim.canMove = true;
          })
     }
}

qualObjeto = function(game)
{
   var objeto = game.rnd.between(0,1);
   var temp="peixe"; 
   switch(objeto)
    {
      case 0: temp = "barreira"; break;
      case 1: temp = "peixe"; break;
    }
   return temp;
}

qualPosicao = function (position)
{
        var temp = 1;
        switch(position)
        {
          case 0: temp = 1; break;
          case 1: temp = 3; break;
          case 2: temp = 5; break;
        }
        return temp;  
}
objetoPosicaoAleatoria = function()
{
        var position = game.rnd.between(0, 2);
        return qualPosicao(position);
}

Obstacle = function (game, posicao) {
        Phaser.Sprite.call(this, game, game.width * posicao / 6, -20, qualObjeto(game));
      	game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.set(0.5);
};
Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;
Obstacle.prototype.update = function() {
	this.body.velocity.y = obstacleSpeed;
	if(this.y > game.height){
		this.destroy();
        score += 1;
	}
};

Obstacle2 = function (game, posicao, nome) {
        Phaser.Sprite.call(this, game, game.width * posicao / 6, -20, nome);
      	game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.set(0.5);
};
Obstacle2.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle2.prototype.constructor = Obstacle2;
Obstacle2.prototype.update = function() {
	this.body.velocity.y = obstacleSpeed;
	if(this.y > game.height){
		this.destroy();
        score += 1;
	}
};

