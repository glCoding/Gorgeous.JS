(function (g) {

	g.register('Blur', [
		0, 0, 1, 0, 0,
		0, 1, 1, 1, 0,
		1, 1, 1, 1, 1,
		0, 1, 1, 1, 0,
		0, 0, 1, 0, 0,
	], 1 / 13);

	g.register('Gaussian Blur', [
		1, 4, 6, 4, 1,
		4, 16, 24, 16, 4,
		6, 24, 36, 24, 6,
		4, 16, 24, 16, 4,
		1, 4, 6, 4, 1,
	], 1 / 256);

	g.register('Mean', [
		1, 1, 1,
		1, 1, 1,
		1, 1, 1
	]);

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

	g.register('Mosaic', function (width, height) {
		width = width || 6;
		height = height || 6;
		var centery = Math.round(height / 2) - 1;
		var centerx = Math.round(width / 2) - 1;
		for (var y = 0; y < this.height; y += height) {
			for (var x = 0; x < this.width; x += width) {
				var index = 4 * ((y + centery) * this.width + (x + centerx));
				var vertex = [];
				for (var i = 0; i < 3; i++) {
					vertex.push(this.data[index + i]);
				}
				for (var yy = 0; yy < height; yy++) {
					for (var xx = 0; xx < width; xx++) {
						if (xx < this.width && yy < this.height) {
							var iter = 4 * ((y + yy) * this.width + (x + xx));
							for (var i = 0; i < 3; i++) {
								this.data[iter + i] = vertex[i];
							}
						}
					}
				}
			}
		}
	});

} (gorgeous));