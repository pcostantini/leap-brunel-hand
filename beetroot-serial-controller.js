var SerialPort = require('serialport');

module.exports = function (device) {

    var port = new SerialPort(
        device/*'/dev/ttyACM0'*/,
        {
            autoOpen: true,
            baudRate: 115200,
            parser: new SerialPort.parsers.Readline("\r")
        },
        (err) => {
            if (!err) return;
            console.log('Error connecting to device', err);
        });


    port.on('error', (err) => {
        console.log('Port error:', err);
    });

    // Init CSV Mode
    // port.write('A10', (err) => {
    //     if (err) {
    //         console.log('A10 write error:', err);
    //         return;
    //     }

    //     port.write('A4', (err) => {
    //         if (!err) return;
    //         console.log('A10 write error:', err);
    //     })
    // })

    return {
        write: function (msg) {
            port.write(msg + '\r', (err) => {
                if (!err) return;
                console.log('Port write error:', err);
            })
        }
    }

}