// import Material from './Class_Material';
// import Tubing from './Class_Tubing';

require('../../sass/game.scss');
var io = require('socket.io-client');
let LoopID;
let gameCanvas = document.getElementById('gameArea');
let gameCtx = gameCanvas.getContext('2d');
var socket = io.connect('http://localhost:3000/game');
//create a image of brid
// var dlimage = new Image();
// dlimage.src=require('../../images/brid.png');
var bridimg = document.createElement('img');
var pat;
bridimg.addEventListener('load',function() {
    pat = gameCtx.createPattern(bridimg, "repeat");
});
bridimg.src = require('../../images/brid.png');
socket.on('init', function (e) {
    gameCanvas.width = e.width;
    gameCanvas.height = e.height;
});
socket.on('change', function (e) {
    var ballPack = e['ballPack'];
    var tubingPack = e['tubingPack'];
    console.log(ballPack);
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    // gameCtx.fillStyle = 'rgba(0,0,0,0.1)';
    // gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    for (var b = 0; b < ballPack.length; b++) {
        var ball = ballPack[b];
        gameCtx.beginPath();
        // gameCtx.fillStyle = pat;
        // gameCtx.arc(gameCanvas.width / 2, ball.y, ball.r, 0, Math.PI * 2);
        gameCtx.drawImage(bridimg,gameCanvas.width/2,ball.y);
        gameCtx.fill();
    }
    for (var t = 0; t < tubingPack.length; t++) {
        var tubing = tubingPack[t];
        gameCtx.beginPath();
        gameCtx.fillStyle = '#000';
        gameCtx.rect(tubing.topPositionX, tubing.topPositionY, tubing.width, tubing.topHeight);
        gameCtx.rect(tubing.bottomPositionX, tubing.bottomPositionY, tubing.width, tubing.bottomHeight);
        gameCtx.closePath();
        gameCtx.fill();
    }
});
socket.on('explosion', function (e) {
    console.log(e);
});
window.addEventListener('keydown', function (e) {
    socket.emit('ball jump');
}, false);
// loop();



