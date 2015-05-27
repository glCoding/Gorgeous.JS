//Test:Convolution Test
var g = gorgeous;
Test(
	['g.convolution', function (test) {
		var res = [57, 52, 32, 255, 106, 67, 38, 255, 77, 58, 22, 255, 85, 77, 47, 255, 160, 101, 58, 255, 116, 87, 34, 255, 57, 52, 32, 255, 106, 67, 38, 255, 77, 58, 22, 255];
		var width = 3, height = 3;
		var matrix = new Uint8ClampedArray(width * height * 4);
		var v = [
			[131, 41, 72, 255],
			[124, 191, 70, 255],
			[224, 71, 31, 255]
		];
		var i = 0;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				for (var j = 0; j < v[0].length; j++) {
					matrix[4 * (y * width + x) + j] = v[i][j];
				}
				if (++i === v.length) {
					i = 0;
				}
			}
		}

		var filter = [
			1, 1, 1,
			1, 1, 1,
			1, 1, 1
		].map(function (v) { return v / 9; });

		g.convolution(matrix, width, height, filter, filter, filter);
		test.log(matrix.join(','));
		test.pass(res.every(function (v, i) {
			return v === matrix[i];
		}));
	}]
	);
