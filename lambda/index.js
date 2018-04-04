'use strict';

const Alexa = require('alexa-sdk');
const APP_ID = 'REPLACE_WITH_ALEXA_SKILLS_ID';  
const log = require('lambda-log');
const https = require('https');
const welcomeOutput = "Welcome to Alexa microbit. You can ask me to set the LED light to red, green or blue on microbit.";
const welcomeReprompt = "Let me know what LED light that you want to set";

let speechOutput;
const hostname = "REPLACE_WITH_NGROK_URL_FORWARDING_INFO";

const handlers = {
    "LaunchRequest": function () {
      this.response.speak(welcomeOutput).listen(welcomeReprompt);
      this.emit(":responseReady");
    },
    "mbitlight": function () {
		let myHandler = this;
		let reprompt;

        let color = isSlotValid(this.event.request, "color");
        if (color == "blue" || color == "red" || color == "green") {
			speechOutput = "Ok, the LED light has been set to " + color;

			let request_options = {
				host: hostname, //Change this to your webhook setting.
				path: "/?" + color,
				method: "GET",
			}

			let request = https.request(request_options, function(r) {
				console.log("RESPONSE - STATUS:" + r.statusCode);
				r.on("data", function(d) {
					console.log("RESPONSE:" + d);
				});
				r.on("end", function() {
					console.log("END: returning speech output");
					myHandler.response.speak(speechOutput);
					myHandler.emit(":responseReady");
				});
				r.on("error", function(e) {
					console.log("ERROR:");
					console.error(e);
					speechOutput = "Sorry, there was problem";
					myHandler.response.speak(speechOutput);
					myHandler.emit(":responseReady");
				});
			});
			request.end();

        } else {
			speechOutput= "Sorry, I don't recognize that color.";
			myHandler.response.speak(speechOutput);
			myHandler.emit(":responseReady");
		}

    },
    "AMAZON.HelpIntent": function () {
        speechOutput = "";
        reprompt = "";
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function () {
        speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(":responseReady");
    },
    "AMAZON.StopIntent": function () {
        speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    "SessionEndedRequest": function () {
        let speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(":responseReady");
    },
};

exports.handler = (event, context) => {
	log.config.meta.event = event;
	log.config.tags.push(event.env);
	log.info('my lambda function is running!');
    let alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function isSlotValid(request, slotName){
	let slot = request.intent.slots[slotName];
    let slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
		//we have a value in the slot
        slotValue = slot.value.toLowerCase().trim();
		return slotValue;
	} else {
		//we didn't get a value in the slot.
        return false;
    }
}


