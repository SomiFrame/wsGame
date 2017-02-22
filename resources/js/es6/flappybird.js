// import Material from './Class_Material';
// import Tubing from './Class_Tubing';

require('pixi.js');
require('p2');
window.Phaser = require('phaser');
require('../../sass/game.scss');
var io = require('socket.io-client');
// let gameCanvas = document. getElementById('gameArea');
// let gameCtx = gameCanvas.getContext('2d');
// var socket = io.connect('http://localhost:3000/game');
//create a image of brid
var bridimg = new Image();
var pipeimg = new Image();
// socket.on('init', function (e) {
//     gameCanvas.width = e.width;
//     gameCanvas.height = e.height;
// });
// socket.on('change', function (e) {
//     var ballPack = e['ballPack'];
//     var tubingPack = e['tubingPack'];
//     console.log(ballPack);
//     gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
//     // gameCtx.fillStyle = 'rgba(0,0,0,0.1)';
//     // gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
//     for (var b = 0; b < ballPack.length; b++) {
//         var ball = ballPack[b];
//         gameCtx.beginPath();
//         // gameCtx.fillStyle = pat;
//         // gameCtx.arc(gameCanvas.width / 2, ball.y, ball.r, 0, Math.PI * 2);
//         gameCtx.drawImage(bridimg, gameCanvas.width / 2, ball.y, ball.r * 1.2, ball.r);
//         gameCtx.fill();
//     }
//     for (var t = 0; t < tubingPack.length; t++) {
//         var tubing = tubingPack[t];
//         gameCtx.beginPath();
//         gameCtx.fillStyle = '#000';
//         gameCtx.drawImage(pipeimg, tubing.bottomPositionX, tubing.bottomPositionY, 50, 154);
//         gameCtx.save();
//         gameCtx.scale(1, -1);
//         // gameCtx.rect(tubing.topPositionX, tubing.topPositionY, tubing.width, tubing.topHeight);
//         gameCtx.drawImage(pipeimg, tubing.topPositionX, -tubing.topPositionY, tubing.width, tubing.topHeight);
//         // gameCtx.rect(tubing.bottomPositionX, tubing.bottomPositionY, tubing.width, tubing.bottomHeight);
//         gameCtx.restore();
//         gameCtx.fill();
//     }
// });
// socket.on('explosion', function (e) {
//     console.log(e);
// });
// window.addEventListener('keydown', function (e) {
//     socket.emit('ball jump');
// }, false);

var HEIGHT, WIDTH, bird, background, ground, pipes, GROUND_Y, GROUND_HEIGHT, ORIGINAL_PIPE_HEIGHT, floor, flapSound,crashSound;
HEIGHT = 384;
WIDTH = 288;
ORIGINAL_PIPE_HEIGHT = 320;
GROUND_HEIGHT = 30;
GROUND_Y = HEIGHT - GROUND_HEIGHT;
floor = Math.floor;
var parent = document.querySelector('#screen');

// Create our 'main' state that will contain the game
var mainState = {
    spawnPipe: function (openPos, key) {
        var Pipe, PipeY;
        if (key == 'topPipe') {
            PipeY = floor(openPos - 100 / 2 - ORIGINAL_PIPE_HEIGHT);
        } else if (key == 'bottomPipe') {
            PipeY = floor(openPos + 100 / 2);
        }
        Pipe = pipes.create(game.world.width, PipeY, key);
        game.physics.enable(Pipe, Phaser.Physics.ARCADE);
        Pipe.body.allowGravity = false;
        Pipe.body.velocity.x = -100;
        Pipe.checkWorldBounds = true;
        Pipe.outOfBoundsKill = true;
        return Pipe;
    },
    spawnPipes: function () {
        var pipeY = game.world.height / 2 + (Math.random() - .5) * game.world.height * 0.3;

        this.spawnPipe(pipeY, 'topPipe');
        this.spawnPipe(pipeY, 'bottomPipe');
    },
    fly: function () {
        if (bird.alive == false)
            return;
        flapSound.play();
        bird.body.velocity.y = -250;
    },
    preload: function () {
        // This function will be executed at the beginning
        // That's where we load the images and sounds
        game.load.spritesheet('bird', require('../../images/bird.png'), 36, 26);
        game.load.image('background', require('../../images/bg.png'));
        game.load.image('ground_y', require('../../images/ground.png'));
        game.load.image('topPipe', require('../../images/tube1.png'));
        game.load.image('bottomPipe', require('../../images/tube2.png'));
        game.load.audio('flapSound',require('../../AVideos/sfx_wing.mp3'));
        game.load.audio('crashSound',require('../../AVideos/sfx_hit.mp3'));
    },
    create: function () {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.
        Phaser.Canvas.setSmoothingEnabled(game.context, false);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 1000;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.forceLandscape = true;
        game.scale.updateLayout(true);
        game.world.width = WIDTH;
        game.world.height = HEIGHT;
        game.world.setBounds(0, 0, WIDTH, HEIGHT - GROUND_HEIGHT);
        background = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
        pipes = game.add.group();
        ground = game.add.tileSprite(0, GROUND_Y, WIDTH, GROUND_HEIGHT, 'ground_y');
        bird = game.add.sprite(36, 24, 'bird');

        //
        flapSound = game.add.audio('flapSound');
        crashSound = game.add.audio('crashSound');

        game.physics.enable([bird], Phaser.Physics.ARCADE);
        bird.anchor.setTo(.5, .5);
        bird.animations.add('fly', [0, 1, 2], 10, true);
        bird.body.collideWorldBounds = true;
        bird.body.bounce.y = .6;
        bird.play('fly');
        bird.alive = true;
        game.input.mouse.capture = true;
        this.timer = game.time.events.loop(1500, this.spawnPipes, this);
    },

    update: function () {
        // This function is called 60 times per second
        // It contains the game's logic
        game.physics.arcade.overlap(
            bird, pipes, this.crashPipe, null, this);
        background.tilePosition.x += -2;
        ground.tilePosition.x += -2;
        if (game.input.activePointer.leftButton.isDown) {
            this.fly();
        }
        var angle = (90 * (320 + bird.body.velocity.y) / 320) - 180;
        if (angle < 80 && angle > -45) {
            bird.angle = angle;
        }
        else if (angle > 80) {
            bird.angle = 90;
        }
        else if (angle < -45) {
            bird.angle = -45;
        }

    },

    crashPipe: function () {
        crashSound.play();
        bird.alive = false;
        game.time.events.remove(this.timer);
        pipes.forEach(function (p) {
            p.body.velocity.x = 0;
        }, this);
    }
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, parent, false, false);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');