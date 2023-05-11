var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var locations = require('./routes/location');

var multichainroutes = require('./routes/multichain');

var ethereumroutes = require('./routes/ethereum');

var tripdetail = require('./routes/tripdetail');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/v1/routes', locations);

app.use('/api/v1/multichain',multichainroutes);

app.use('/api/v1/ethereum',ethereumroutes);

app.use('/api/v1/tripvalidation', tripdetail);

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    next();
});

module.exports = app;
