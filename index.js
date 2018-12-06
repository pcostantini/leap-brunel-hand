var refreshSpeed = 1000;
var fingers = require('./leap-hand')(refreshSpeed);
var beetrootCsv = require('./beetroot-serial-controller')('/dev/ttyACM0');

var thumbThresholds = [true, false];
var fingerThresholds = [30, 125];
var brunelThresholds = [50, 973]

fingers.subscribe(fingers => {
    if (!fingers.length) return;

    var thumb = from(thumbThresholds)(fingers[0]);

    // In the Brunel hand, the pinky and ring fingers are controllers by the same servo
    var otherLessPinky = fingers.slice(1, 4).map(from(fingerThresholds));

    var percents = [thumb].concat(otherLessPinky);

    var brunelValues = percents.map(to(brunelThresholds));

    console.log(JSON.stringify({
        fingers,
        percents,
        brunelValues
    }));


    // Send to Brunel as CSV (activate A4 mode)
    var brunelCsv = brunelValues.join(',')
    console.log('Brunel CSV: ', brunelCsv);
    beetrootCsv.write(brunelCsv);
});


function from(thresholds) {
    var m = 100 / (thresholds[1] - thresholds[0]);
    return (value) => {
        var per = m * (value - thresholds[0]);
        return Math.max(Math.min(per, 100), 0);
    }
}

function to(thresholds) {
    var m = thresholds[1] - thresholds[0];
    return (per) => {
        return Math.round(((m / 100) * per) + thresholds[0]);
    }
}