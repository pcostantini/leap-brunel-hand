var fingers = require('./leap-hand');

var thumbThresholds = [17, 83];
var fingerThresholds = [30, 125];
var brunelThresholds = [50, 973]

fingers.subscribe(fingers => {
    if (!fingers.length) return;

    var thumb = from(thumbThresholds)(fingers[0]);
    var otherLessPinky = fingers.slice(1, 4).map(from(fingerThresholds));

    var percents = [thumb].concat(otherLessPinky);

    var brunelValues = percents.map(to(brunelThresholds));

    // TODO: Send to Brunel as CSV
    var brunelCsv = brunelValues.join(',')

    console.log({
        fingers,
        percents,
        brunelValues
    });
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