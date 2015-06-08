//Test:Palette Test
var g = gorgeous;

Test(
	['Palette & draw', function (tools) {
		waterfall([
			function (callback) {
				g.ImageData('img/baboon.png', function (imd) {
					callback(null, imd);
				});
			},
			function (imd1, callback) {
				g.ImageData('img/horsesnoise.png', function (imd2) {
					callback(null, imd1, imd2);
				});
			}],
			function (err, imd1, imd2) {
				var pal = g.Palette(640, 480);
				pal.append(imd1, 70, 90);
				pal.append(imd2, 50, 60, 20, 0, 300, 200, 'hello');
				pal.getImage(function (img) {
					tools.show('Palette', img);
					tools.pass(img instanceof Image);
				});
			}
		);
	}]
);