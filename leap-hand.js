var leapjs = require('leapjs');
var rxjs = require('rxjs');
var Vector3 = require('vector-3');
var operators = require('rxjs/operators');

var controller = new leapjs.Controller();

controller.on('connect', function () {
    console.log("Successfully connected.");
});

controller.on('deviceConnected', function () {
    console.log("A Leap device has been connected.");
});

controller.on('deviceDisconnected', function () {
    console.log("A Leap device has been disconnected.");
});

var fingerStream = rxjs.fromEvent(controller, 'deviceFrame')
    .pipe(operators.throttleTime(1000))
    .pipe(operators.map(frame => {
        var hand = frame.hands.find(h => h.type === 'right');
        if (!hand) return [];

        // console.log([bone1.direction(), bone2.direction()])

        return [
            getFingerAngle(hand.thumb),
            getFingerAngle(hand.indexFinger),
            getFingerAngle(hand.middleFinger),
            getFingerAngle(hand.ringFinger),
            getFingerAngle(hand.pinky)
        ];
    }));

// EXPORT
module.exports = fingerStream;


controller.connect();

function getFingerAngle(finger) {
    var bone1 = finger.proximal;
    var bone2 = finger.distal;
    var dir1 = bone1.direction();
    var dir2 = bone2.direction();
    var bone1V = new Vector3(dir1[0], dir1[1], dir1[2])
    var bone2V = new Vector3(dir2[0], dir2[1], dir2[2])
    var ang = bone1V.angle(bone2V) * 180 / Math.PI;
    return Math.round(ang);
}