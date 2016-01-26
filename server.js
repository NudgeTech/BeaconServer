// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(morgan('dev')); // log every request to the console
//app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms


var scanner = io.of('/scanner'); 

scanner.on('connection', function(socket) {

    var responseBusy = {text: "its busy right?"};
    var responseQuiet = {text: "its quiet right?"};
    var responseMadBusy = {text: "its MAD BUSY"};
    console.log('Scanner Connected');
    
    socket.on('message', function(msg, count) {
        //recived message from scanner
        //do some processing here
        console.log("beacon recieved: " + msg + ": " + count);

        if(count < 5){
            socket.emit("response", responseQuiet);
        }else if (count >= 5 && count < 7){
            socket.emit("response", responseBusy);
        }else{
            socket.emit("response", responseMadBusy);
        }
        

    });

    socket.on('disconnect', function() {
        console.log('Scanner Disconnected');
    });
});


http.listen(3000, function() {
    console.log('listening on port:3000');
});