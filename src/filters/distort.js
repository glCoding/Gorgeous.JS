(function (g) {
	'use strict';
	g.register('Emboss', [
		-1, -1, 0,
		-1, 0, 1,
		0, 1, 1
	], 3, 3, 1, 128);

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