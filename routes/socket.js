function _socketio(server) {
    //玩家类
    var Player = require('../resources/js/es5/player.js');
    //油管
    var Tubing = require('../resources/js/es5/tubing.js');
    //检测器
    var detection = require('../resources/js/es5/detection.js')();
    var uuid = require('node-uuid');
    //画布
    var canvas = {
        width: 400,
        height: 300
    };
    var SocketList = {};
    var PlayerList = {};
    var TubingList = {};

    for (var i = 0; i < 4; i++) {
        TubingList[i] = Tubing().create(i, canvas);
    }


    var io = require('socket.io')(server);
    var gamesk = io
        .of('/game')
        .on('connection', function (socket) {
            socket.id = uuid.v4();
            PlayerList[socket.id] = Player().create(socket.id, canvas);
            SocketList[socket.id] = socket;
            socket.emit('init', PlayerList[socket.id].self.canvas);
            socket.on('disconnect', function () {
                delete PlayerList[socket.id];
                delete SocketList[socket.id];
            });
            socket.on('ball jump', function () {
                if (!PlayerList[socket.id]) {
                    console.log('some loser try to control the ball');
                    return;
                }
                PlayerList[socket.id].self.ballOption.sy = -7;
            });
        });

    var loopId = setInterval(function () {
        var ballPack = [];
        var tubingPack = [];
        for (var t in TubingList) {
            var tubing = TubingList[t];
            tubing.move();
            tubingPack.push(tubing.self);
        }
        for (var j in PlayerList) {
            var player = PlayerList[j];
            player.move();
            detection.detectBoundary(player.self);
            for (var t in TubingList) {
                var tubing = TubingList[t];
                if (detection.detectCrash(player.self,tubing.self)) {
                    // var pack = new explosion(player.ball.x, player.ball.y);
                    // SocketList[player.id].emit('explosion', pack);
                    // delete PlayerList[player.id];
                    // console.log('crash');
                }
            }
            ballPack.push(player.self.ball);
        }
        var Pack = {
            ballPack: ballPack,
            tubingPack: tubingPack
        };

        for (var i in SocketList) {
            var socket = SocketList[i];
            socket.emit('change', Pack);
        }
    }, 1000 / 25);
}
module.exports = _socketio;