#!/usr/bin/env node

var jsdom = require('jsdom')
    jQuery = require('jquery');

var parseDocument = function(textData, callback) {
    var headings = [],
        parsedHash = {};
    
    jsdom.env(textData, [], 
        function(errors, window) {
            var $ = jQuery.create(window);
            
            var count = 0,
                lastServerObj = null;
            $('table.status > tr').each(function(index) {
                var $this = $(this);
                
                if (index == 0) {
                    // heading row of the stats table -- build headings
                    $this.children('th').each(function(thIdx) {
                        if (thIdx > 1) {
                            // add the current heading text to the array (e.g. "Status Information")
                            headings.push($.trim($(this).text()));
                        }
                    });
                } else {
                    // just another ordinary row
                    var $name = $this.find('a');
                    
                    if ($name.length) {
                        var serverAddr = $name.attr('title');
                        
                        if (serverAddr) {
                            var serverName = $name.html();
                            
                            //console.info(' + ' + $name.html());
                            lastServerObj = parsedHash[serverName] = {};
                            
                            count++;
                            
                            // get the first service (same line than serverName)
                            $name = $name.slice(1);
                            
                            // avoid getting icons
                            if ($name.find('img').length) {
                                $name = $name.slice(1);
                            }
                            
                        }
	                    var serviceName = $name.html();
	                    //console.info('\t' + serviceName);
	                    lastServerObj[serviceName] = {};
	                    
	                    $this.children('td').each(function(tdIdx) {
	                        if (tdIdx > 1) {
	                            //console.info('\t\t' + headings[tdIdx - 2] + ' ' + $(this).text());
	                            lastServerObj[serviceName][headings[tdIdx - 2]] = $.trim($(this).text());
	                        }
	                    });
                    }
                }
            });
            callback(parsedHash, count);
        });
}

exports.parser = function(){ 
    return {
        parse: function(nagiosUrlObject, callback, errorCallback) {
            nagiosUrlObject.pathname = nagiosUrlObject.pathname ? nagiosUrlObject.pathname : '';
            nagiosUrlObject.path = nagiosUrlObject.pathname += '/cgi-bin/status.cgi?hostgroup=all&style=detail';

            var data = '';
            var http = nagiosUrlObject.protocol.indexOf('https') === 0 ? require('https') : require('http');
            var req = http.request(nagiosUrlObject, 
                function(res) {
                    res.setEncoding('utf8');
                    res.on('data', function(chunk) {
                        data += chunk;
                    }).on('end', function() {
                        parseDocument(data, callback);
                    });
                }).on('error', function(e) {
                    if (errorCallback != undefined)
                        errorCallback(e);
                });
            req.end();
        }
    }
}();
