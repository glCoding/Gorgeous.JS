var colors = require('colors');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/test'));

app.listen(app.get('port'), function() {
  console.log();
  console.log(('Test server is running on port: ' + app.get('port').toString()).bgGreen);
  console.log('\u0007');
});
