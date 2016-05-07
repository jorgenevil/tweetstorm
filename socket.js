// socket.js

// This code is meant for an art project, and has no practical function 
// besides from counting tweets with the word "Love" or "Hate" in it.

// However, beware that twitter has some roof on the requests you can make
// on their API, so you might get denied every once in a while.

// Feel free to do whatever you want with the code :)


// ██████╗  █████╗ ███████╗███████╗    ███████╗███████╗████████╗██╗   ██╗██████╗ 
// ██╔══██╗██╔══██╗██╔════╝██╔════╝    ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ██████╔╝███████║███████╗█████╗      ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ██╔══██╗██╔══██║╚════██║██╔══╝      ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝ 
// ██████╔╝██║  ██║███████║███████╗    ███████║███████╗   ██║   ╚██████╔╝██║     
// ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝    ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     
// =============================================================================

var trackOne = 'clinton, hillary';
var trackTwo = 'trump, donald';


// call the packages we need
var express    	= require('express'); 			// call express
var app        	= express(); 					// define our app using express
var bodyParser 	= require('body-parser');
var WebSocket 	= require('ws');

// call the packages we need
var Twitter = require('node-tweet-stream');

// Suck on the fire hoose for Love
var tOne = new Twitter({
	consumer_key: 'qDlCUiVQlU1jdPdzuQamiy28P',
	consumer_secret: 'T8WR6NYxTnC9O9GoweauJQjiKD7wGZz0tTDZeJukP4859fCqA5',
	token: '337322757-LIw968NwrCQFCgaGuf8NMciM0hpDBddcwaBOdtrP',
	token_secret: 'oZNjbdXA3NNs7Qo9Un1hRu8l7L0ogzSzL3s3vVYhi0KnW'
});

tOne.track(trackOne);


// Suck on the fire hoose for Hate
var tTwo = new Twitter({
	consumer_key: 'qDlCUiVQlU1jdPdzuQamiy28P',
	consumer_secret: 'T8WR6NYxTnC9O9GoweauJQjiKD7wGZz0tTDZeJukP4859fCqA5',
	token: '337322757-LIw968NwrCQFCgaGuf8NMciM0hpDBddcwaBOdtrP',
	token_secret: 'oZNjbdXA3NNs7Qo9Un1hRu8l7L0ogzSzL3s3vVYhi0KnW'
});

tTwo.track(trackTwo);

// SERVER
// SERVER
// SERVER

// Websocket server
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8008 });

// Start with zero
var ones = 0;
var twos = 0;

// collect users here
var users = [];

// Counting Tweets
tOne.on('tweet', function (tweet) { 
	ones++; 
	// console.log(tweet.text); 
	// console.log('');
	}
)

tTwo.on('tweet', function (tweet) { 
	twos++; 
	// console.log(tweet.text); 
	// console.log('');
	}
)


// When a user connects
wss.on('connection', function(fws) {

	// New user is connected
	console.log('connected to socket');
	
	// Push users in user array
	users.push(fws);

	// Tell us how manu users we have
	console.log(users.length, 'users connected');


	// When a user disconnects
	fws.on('close', function() {

		console.log('client disconnected');

		// Remove user from user array
		users.splice(users.indexOf(fws), 1);

		// Tell us how many users we have
		console.log(users.length, 'users connected');
	});
	
});




sendIt();

// Function that pushes tweets to clients (users)
function sendIt() {

	// Run a loop, to slow down and prevend flooding
	setInterval(function() {

		console.log('ones', ones, 'twos', twos);

		var sendObject = {
				 'one' : ones,
				 'two' : twos 
				};

		var sObject = JSON.stringify(sendObject)


		// Go thorugh our subscribers
		users.forEach(function(user) {
	
			// Try sending them the latest tweetz
			try { user.send(sObject); }
			catch (e) { console.log('error', e); }

		})
	
		// Reset counters
		ones = 0;
		twos = 0;	

	}, 100)

}



