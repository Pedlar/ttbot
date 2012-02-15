var fs = require('fs');

fs.readFile('./bots', 'utf-8', function (err, data) {
		  if (err) throw err;
		    var json = JSON.parse(data);
		    console.log(json[1].__name);
		    });
