'use strict'
const BBCMicrobit = require('bbc-microbit');
const request = require('request');

const EVENT_FAMILY = 8888;
const EVENT_VALUE_ANY = 0;

const http = require('http')  
const port = 3000

let microbit_;


console.log('Scanning for microbit');
BBCMicrobit.discover(function(microbit) {
    console.log('\tdiscovered microbit: id = %s, address = %s', microbit.id, microbit.address);

    microbit.on('disconnect', function() {
        console.log('\tmicrobit disconnected!');
        process.exit(0);
    });


    console.log('connecting to microbit');
    microbit.connectAndSetUp(function() {
        console.log('\tconnected to microbit');


        console.log('subscribing to event family, any event value');
        microbit.subscribeEvents(EVENT_VALUE_ANY, EVENT_FAMILY, function() {
            console.log('\tsubscribed to micro:bit events of required type');
        });

        microbit_ = microbit;

        
        //Off all LEDs
        microbit.writeEvent(19, 8888, function() {});
        microbit.writeEvent(23, 8888, function() {});
        microbit.writeEvent(28, 8888, function() {});       
    });
});


const requestHandler = (request, response) => {  
  console.log(request.url)
  
  if(request.url.indexOf("red") !== -1){
    console.log("Red");

    //Off all LEDs
    microbit_.writeEvent(19, 8888, function() {});
    microbit_.writeEvent(23, 8888, function() {});
    microbit_.writeEvent(28, 8888, function() {});
	
	//Red 
    microbit_.writeEvent(23, 8888, function() {});
    microbit_.writeEvent(21, 8888, function() {});
    microbit_.writeEvent(18, 8888, function() {});
  }
  
  if(request.url.indexOf("green") !== -1){
    console.log("Green");

    //Off all LEDs
    microbit_.writeEvent(19, 8888, function() {});
    microbit_.writeEvent(23, 8888, function() {});
    microbit_.writeEvent(28, 8888, function() {});

    //Green 
    microbit_.writeEvent(19, 8888, function() {});
    microbit_.writeEvent(23, 8888, function() {});
    microbit_.writeEvent(20, 8888, function() {});
	
  }
  
  if(request.url.indexOf("blue") !== -1){
	console.log("Blue");

    //Off all LEDs
    microbit_.writeEvent(19, 8888, function() {});
    microbit_.writeEvent(23, 8888, function() {});
    microbit_.writeEvent(28, 8888, function() {});

    //Blue 
    microbit_.writeEvent(19, 8888, function() {});
    microbit_.writeEvent(21, 8888, function() {});
    microbit_.writeEvent(22, 8888, function() {});
	
  }

  response.end('Alexa m:bit Controller')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {  
  if (err) {
    return console.log('Error: something bad happened', err)
  }

  console.log('Alexa m:bit Controller is listening on port ' + port);
})

