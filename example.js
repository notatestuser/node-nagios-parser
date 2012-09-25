#!/usr/bin/env node

var np = require('./nagiosparser').parser,
    url = require('url');
    
var nagiosRoot = url.parse('http://readonly:readonly@nagioscore.demos.nagios.com/nagios');

var startTime = Date.now(), duration;

np.parse(nagiosRoot, function(parsedObj, count) {
        duration = Date.now() - startTime;
        console.log(parsedObj);
        console.log("\nNumber of monitored servers: " + count);
        console.log("Took " + duration + " ms to retrieve and parse");
    }, function(error) {
        console.error(error);
    });
