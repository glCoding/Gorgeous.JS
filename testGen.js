var fs = require('fs');

fs.readFile('test/index.html', function (err, file) {
	if (!err) {
		
	} else {
		console.log('File not found.');
	}
})