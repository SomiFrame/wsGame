var express = require('express');
var router = express.Router();
//画布
var canvas = {
    width: 1000,
    height: 600
};
//玩家类
var Player = require('../resources/js/es5/player.js');
//油管
var Tubing = require('../resources/js/es5/tubing.js');
router.get('/', function (req,res,next) {
    res.render('gameone',{});
});


module.exports = router;