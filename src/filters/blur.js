(function (g) {
	'use strict';

	g.register('Blur', [
		0, 0, 1, 0, 0,
		0, 1, 1, 1, 0,
		1, 1, 1, 1, 1,
		0, 1, 1, 1, 0,
		0, 0, 1, 0, 0,
	], 5, 5,  1 / 13);

	g.register('Horizontal Motion Blur', function (radius) {
		radius = radius || 5;
		var width = this.width;
		var height = this.height;
		var odata = this.data;
		var factor = 1 / (2 * radius + 1);
		var data = new Uint8ClampedArray(odata);
		for (var y = 0; y < height; y++) {
			var sum = [0, 0, 0];
			for (var s = -radius; s <= radius; s++) {
				var index = 4 * (width * y + s);
				for (var i = 0; i < 3; i++) {
					sum[i] += data[index + i] || 0;
				}
			}
			for (var x = 0; x < width; x++) {
				var cur = 4 * (width * y + x);
				for (var i = 0; i < 3; i++) {
					odata[cur+i] = sum[i] * factor;
					sum[i] -= data[cur + i - 4 * radius] || 0;
					sum[i] += data[cur + i + 4 * radius] || 0;
				}
			}
		}
		this.pushChange();
	});

	g.register('Vertical Motion Blur', function (radius) {
		radius = radius || 5;
		var width = this.width;
		var height = this.height;
		var odata = this.data;
		var factor = 1 / (2 * radius + 1);
		var data = new Uint8ClampedArray(odata);
		for (var x = 0; x < width; x++) {
			var sum = [0, 0, 0];
			for (var s = -radius; s <= radius; s++) {
				var index = 4 * (width * s + x);
				for (var i = 0; i < 3; i++) {
					sum[i] += data[index + i] || 0;
				}
			}
			for (var y = 0; y < height; y++) {
				var cur = 4 * (width * y + x);
				for (var i = 0; i < 3; i++) {
					odata[cur+i] = sum[i] * factor;
					var cc1 = 4 * (width * (y - radius) + x);
					var cc2 = 4 * (width * (y + radius) + x);
					sum[i] -= data[cc1 + i] || 0;
					sum[i] += data[cc2 + i] || 0;
				}
			}
		}
		this.pushChange();
	});

	g.register('Gaussian Blur', function (radius, repeat) {
		radius = radius || 5;
		repeat = repeat || 3;
		for (var i = 0; i < repeat; i++) {
			this.use('Horizontal Motion Blur', radius);
			this.use('Vertical Motion Blur', radius);
		}
	});

	g.register('Mean', [
		1, 1, 1,
		1, 1, 1,
		1, 1, 1
	], 3, 3);

	g.register('Middle', function (width, height) {
		function comp(a, b) {
			return a - b;
		}
		width = width || 3;
		height = height || 3;
		var matrix = new Uint8ClampedArray(this.data);
		var mid = [];
		var length = width * height;
		var centery = Math.round(height / 2) - 1;
		var centerx = Math.round(width / 2) - 1;
		if (length % 2 === 0) {
			mid.push(length / 2 - 1);
			mid.push(length / 2);
		} else {
			mid.push((length - 1) / 2);
		}
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var cur = 4 * (this.width * y + x);
				var pixels = [[], [], []];
				for (var j = 0; j < length; j++) {
					var yy = Math.floor(j / width) - centery + y;
					var xx = j % width - centerx + x;
					if (!(xx < 0 || yy < 0 || xx >= this.width || yy >= this.height)) {
						var cc = 4 * (this.width * yy + xx);
						for (var i = 0; i < 3; i++) {
							pixels[i].push(matrix[cc + i]);
						}
					} else {
						for (var i = 0; i < 3; i++) {
							pixels[i].push(0);
						}
					}
				}
				for (var i = 0; i < 3; i++) {
					pixels[i].sort(comp);
					var sum = 0;
					for (var j = 0; j < mid.length; j++) {
						sum += pixels[i][mid[j]];
					}
					this.data[cur + i] = sum / mid.length;
				}
			}
		}
	});

} (gorgeous));