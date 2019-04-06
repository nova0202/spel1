// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');
let winScene = new Phaser.Scene('Win');
let gameOverScene = new Phaser.Scene('Game over');
let startScene = new Phaser.Scene('Start');

startScene.update = function(){
  this.add.text(16, 16, 'Tryck för att starta', { fontSize: '32px', fill: '#FFF' });
  if (this.input.activePointer.isDown) {
  
      if (!this.scale.isFullscreen) {
          this.scale.startFullscreen();
      }
      this.scene.start(gameScene);
  
  }
}

winScene.init = function(){
		console.log("winScene");
	
	  this.time.delayedCall(3000, function() {
	  this.scene.start(startScene);
  }, [], this);


}
winScene.update = function(){
	this.add.text(16, 16, 'Yay! Du vann!', { fontSize: '32px', fill: '#FFF' });
}
gameOverScene.init = function(){
	
	  this.time.delayedCall(5000, function() {
	  this.scene.start(gameScene);
  }, [], this);


}
gameOverScene.update = function(){
	this.add.text(16, 16, 'Game over', { fontSize: '32px', fill: '#FFF' });
}

// some parameters for our scene
gameScene.init = function() {
  this.playerSpeed = 2.5;
  this.enemySpeed = 2;
  this.enemyMaxY = 280;
  this.enemyMinY = 80;
}

// load asset files for our game
gameScene.preload = function() {

  // load images
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('dragon', 'assets/dragon.png');
  this.load.image('treasure', 'assets/treasure.png');
};

// executed once, after assets were loaded
gameScene.create = function() {

  // background
  let bg = this.add.sprite(0, 0, 'background');

  // change origin to the top-left of the sprite
  bg.setOrigin(0, 0);

  // player
  this.player = this.add.sprite(40, this.sys.game.config.height / 2 + 25, 'player');

  // scale down
  this.player.setScale(0.5);

  // goal
  this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2 + 25, 'treasure');
  this.treasure.setScale(0.6);

  // group of enemies
  this.enemies = this.add.group({
    key: 'dragon',
    repeat: 5,
    setXY: {
      x: 110,
      y: 100,
      stepX: 80,
      stepY: 20
    }
  });

  // scale enemies
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);

  // set speeds
  Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
    enemy.speed = Math.random() * 2 + 1;
  }, this);

  // player is alive
  this.isPlayerAlive = true;

  // reset camera
  this.cameras.main.resetFX();
		
  cursors = this.input.keyboard.createCursorKeys();
	
};

// executed on every frame (60 times per second)
gameScene.update = function() {

  // only if the player is alive
  if (!this.isPlayerAlive) {
    return;
  }

  // check for active in put
  if (this.input.activePointer.isDown) {

    // player walks
    this.player.x += this.playerSpeed;
  }
	if (cursors.left.isDown)
	{
	    this.player.x -= this.playerSpeed;

	}
	if (cursors.right.isDown)
	{
	    this.player.x += this.playerSpeed;

	}
  // treasure collision
  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
	  this.scene.start(winScene);
  }

  // enemy movement and collision
  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;

  for (let i = 0; i < numEnemies; i++) {

    // move enemies
    enemies[i].y += enemies[i].speed;

    // reverse movement if reached the edges
    if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
      enemies[i].speed *= -1;
    } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
      enemies[i].speed *= -1;
    }

    // enemy collision
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
      this.gameOver();
      break;
    }
  }
  
  
};

gameScene.gameOver = function() {

  // flag to set player is dead
  this.isPlayerAlive = false;

  // shake the camera
  this.cameras.main.shake(1000);

  // fade camera
  this.time.delayedCall(250, function() {
    this.cameras.main.fade(250);
  }, [], this);

  // restart game
  this.time.delayedCall(500, function() {
	  this.scene.start(startScene);
	  
  }, [], this);
};



// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: [startScene,gameScene, winScene, gameOverScene]
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
