(function (g) {

	g.registerFilter('Blur', [
		0, 0, 1, 0, 0,
		0, 1, 1, 1, 0,
		1, 1, 1, 1, 1,
		0, 1, 1, 1, 0,
		0, 0, 1, 0, 0,
	].map(function (v) { return v / 13; }));

	g.registerFilter('Gaussian Blur', [
		1, 4, 6, 4, 1,
		4, 16, 24, 16, 4,
		6, 24, 36, 24, 6,
		4, 16, 24, 16, 4,
		1, 4, 6, 4, 1,
	].map(function (v) { return v / 256; }));

	g.registerFilter('Mosaic', function (width, height) {
		width = width || 10;
		height = height || 10;
		for (var y = 0; y < this.height; y += height) {
			for (var x = 0; x < this.width; x += width) {
				var index = 4 * (y * this.width + x);
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