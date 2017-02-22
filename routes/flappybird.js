var express = require('express');
var router = express.Router();
//画布
var canvas = {
    width: 400,
    height: 300
};
//玩家类
var Player = require('../resources/js/es5/player.js');
//油管
var Tubing = require('../resources/js/es5/tubing.js');
router.get('/', function (req,res,next) {
    res.render('flappybird',{});
});
module.exports = router;