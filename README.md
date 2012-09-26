node-nagios-parser
==================

Node Nagios Parser is a library for Node that uses jsdom and server-side 
jQuery to parse a Nagios status page into an easy-to-navigate Javascript object.

Tested against Nagios 3.x.

Usage
-----

Install the dependencies we need:

    $ cd node-nagios-parser
    $ npm install

Require the script and call ```parse(url, callback, errorCallback)```:

    var np = require('./nagiosparser').parser;
    np.parse(url.parse('http://user:pass@nagios.domain/nagios'),
        function(parsedObj, count) {
		    console.log("Parsed status information for " + count + " servers");
            console.log(parsedObj);
        });

The passed in URL object must point to your equivalent of the ```/nagios``` endpoint. 
If you've configured this to be named otherwise, use that instead!

Upon executing, the function will return instantly, but your callback will be invoked 
with the hash representation of the acquired data after retrieval and parsing has finished: 

    { 'your.awesome.server.com': 
       { Load: 
          { Status: 'OK',
            'Last Check': '01-04-2012 16:09:52',
            Duration: '30d 13h 58m 27s',
            Attempt: '1/3',
            'Status Information': 'OK - load average: 0.00, 0.00, 0.00' },
         Opt: 
          { Status: 'OK',
            'Last Check': '01-04-2012 16:09:51',
            Duration: '30d 13h 58m 28s',
            Attempt: '1/3',
            'Status Information': 'DISK OK - free space: /opt 5621 MB (59% inode=99%):' },
         SSH: 
          { Status: 'OK',
            'Last Check': '01-04-2012 16:09:59',
            Duration: '30d 13h 58m  5s',
            Attempt: '1/3',
            'Status Information': 'SSH OK - OpenSSH_4.3 (protocol 2.0)' } },
      'your.next.awesome.server.com': { etc... } }

Example
-------

See ```example.js``` for a working example that uses the public demo server at ```nagioscore.demos.nagios.com```.
