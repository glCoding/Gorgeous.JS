var fs = require('fs');
var colors = require('colors');
var testInfo = JSON.parse(fs.readFileSync('test/testInfo.json', {encoding: 'utf8'}));
var tests = testInfo.tests;

var indexhead = '\
<!DOCTYPE html>\n\
<html>\n\
	<head>\n\
		<title>Gorgeous.JS</title>\n\
		<meta charset="utf-8" />\n\
		<link rel="stylesheet" type="text/css" href="css/main.css" />\n\
	</head>\n\
	<body>\n\
		<h1 id="head-title">Gorgeous.JS</h1>\n\
		<h2 id="head-description">A JavaScript Library for Digital Image Processing.</h2>\n\
		<div class="links">\n\
			<h2>Tests</h2>\n';
var indextail = '\
		</div>\n\
	</body>\n\
</html>';

var lis = [];
(function () {
for (var i in tests) {
	lis.push('<li><a href="' + tests[i][0] + '.html">' + tests[i][1] + '</a></li>');
	var js = 'test/js/' + tests[i][0] + '.js';
	if(fs.existsSync(js)) {
		console.log((js + ' already exists.').yellow);
	} else {
		var jshead = '//Test:' + tests[i][1] + '\n';
		fs.writeFileSync(js, jshead, {encoding: 'utf8', flag: 'w'});
		console.log((js + ' created.').blue);
	}

	var html = 'test/' + tests[i][0] + '.html';
	var htmlhead = '\
<!DOCTYPE html>\n\
<html>\n\
	<head>\n\
		<title>Gorgeous.JS</title>\n\
		<meta charset="utf-8" />\n\
		<link rel="stylesheet" type="text/css" href="css/main.css" />\n\
	</head>\n\
	<body>\n\
		<h1 id="head-title">Gorgeous.JS</h1>\n\
		<h2 id="head-description">A JavaScript Library for Digital Image Processing.</h2>\n\
		<script src="js/lib/gorgeous.js"></script>\n\
		<script src="js/lib/test-tools.js"></script>\n';
	var htmltail = '\
	</body>\n\
</html>';
	if(fs.existsSync(html)) {
		console.log((html + ' already exists.').yellow);
	} else {
		var script = '\t\t<script src="js/' + tests[i][0] + '.js">' + '</script>\n';
		fs.writeFileSync(html, htmlhead + script + htmltail, {encoding: 'utf8', flag: 'w'});
		console.log((html + ' created.').blue);
	}	
}
}());

console.log();
var indexol = '\t\t\t<ol>\n\t\t\t\t' + lis.join('\n\t\t\t\t') + '\n\t\t\t</ol>\n';
fs.writeFile('test/index.html', indexhead + indexol + indextail, {encoding: 'utf8', flag: 'w'}, function (err) {
	if (err) {
		console.log('Error occured when creating test/index.html');
		throw err;
	} else {
		console.log('Test files created, no error.\x07'.green);
	}
});