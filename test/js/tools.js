//Test:Test gorgeous tools
var g = gorgeous;

Test(
	['rgb2hsi & hsi2rgb', function (test) {
		var rgbs = [
			{ r: 115, g: 224, b: 70 },
			{ r: 0, g: 0, b: 0 },
			{ r: 255, g: 255, b: 255 },
			{ r: 32, g: 71, b: 0 },
			{ r: 132, g: 0, b: 10 },
			{ r: 255, g: 0, b: 0 },
			{ r: 177, g: 177, b: 177 },
			{ r: 0, g: 255, b: 255 },
		];
		function ok(a, b) {
			for (var index in a) {
				test.log(index + ' ' + Math.abs(a[index] - b[index]));
				if (Math.abs(a[index] - b[index]) > 2) {
					return false;
				}
			}
			return true;
		}
		test.pass(function () {
			for (var i in rgbs) {
				var hsi = g.rgb2hsi(rgbs[i].r, rgbs[i].g, rgbs[i].b);
				var rgb = g.hsi2rgb(hsi.h, hsi.s, hsi.i);
				if (!ok(rgb, rgbs[i])) {
					test.log(i);
					return false;
				}
			}
			return true;
		});
	}]
	);
