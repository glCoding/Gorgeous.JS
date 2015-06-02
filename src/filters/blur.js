(function (g) {
	'use strict';

	g.register('Blur', [
		0, 0, 1, 0, 0,
		0, 1, 1, 1, 0,
		1, 1, 1, 1, 1,
		0, 1, 1, 1, 0,
		0, 0, 1, 0, 0,
	], 5, 5, 1 / 13);

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
				var index = g.edge(s, y, width, height);
				for (var i = 0; i < 3; i++) {
					sum[i] += data[index + i];
				}
			}
			for (var x = 0; x < width; x++) {
				var cur = g.edge(x, y, width, height);
				var cc1 = g.edge(x - radius, y, width, height);
				var cc2 = g.edge(x + radius, y, width, height);
				for (var i = 0; i < 3; i++) {
					odata[cur + i] = sum[i] * factor;
					sum[i] -= data[cc1 + i];
					sum[i] += data[cc2 + i];
				}
			}
		}
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
				var index = g.edge(x, s, width, height);
				for (var i = 0; i < 3; i++) {
					sum[i] += data[index + i];
				}
			}
			for (var y = 0; y < height; y++) {
				var cur = g.edge(x, y, width, height);
				var cc1 = g.edge(x, y - radius, width, height);
				var cc2 = g.edge(x, y + radius, width, height);
				for (var i = 0; i < 3; i++) {
					odata[cur + i] = sum[i] * factor;
					sum[i] -= data[cc1 + i];
					sum[i] += data[cc2 + i];
				}
			}
		}
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

	g.register('Median', function (radius) {
		function makeHistogram() {
			var h = [new Array(256), new Array(256), new Array(256)];
			for (var j = 0; j < 256; j++) {
				h[0][j] = h[1][j] = h[2][j] = 0;
			}
			return h;
		}
		function sub(ha, hb) {
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 256; j++) {
					ha[i][j] -= hb[i][j];
				}
			}
		}
		function add(ha, hb) {
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 256; j++) {
					ha[i][j] += hb[i][j];
				}
			}
		}
		function edge(x, width) {
			return (x < 0) ? 0
				: ((x >= width) ? (width - 1) : x);
		}
		var hs = [];
		var width = this.width;
		var height = this.height;
		var len = 2 * radius + 1;
		var half = Math.ceil((len * len) / 2);
		var oData = this.data;
		var data = new Uint8ClampedArray(oData);
		//Initiate column histograms
		for (var xx = 0; xx < width; xx++) {
			hs[xx] = makeHistogram();
			for (var yy = -radius; yy <= radius; yy++) {
				var cur = g.edge(xx, yy, width, height);
				for (var i = 0; i < 3; i++) {
					hs[xx][i][data[cur + i]] += 1;
				}
			}
		}
		for (var y = 0; y < height; y++) {
			//Initiate original mask histogram
			var th = makeHistogram();
			for (var xx = -radius; xx <= radius; xx++) {
				add(th, hs[edge(xx, width)]);
			}
			var lt = [0, 0, 0];
			var mid = [0, 0, 0];
			//Find middle value
			for (var i = 0; i < 3; i++) {
				for (var n = 0; n < 256; n++) {
					lt[i] += th[i][n];
					if (lt[i] >= half) {
						mid[i] = n;
						break;
					}
				}
			}
			//window goes
			for (var x = 0; x < width; x++) {
				var cc = g.edge(x, y, width, height);
				sub(th, hs[edge(x - radius, width)]);
				add(th, hs[edge(x + radius + 1, width)]);
				for (var i = 0; i < 3; i++) {
					oData[cc + i] = mid[i];
					lt[i] = 0;
					mid[i] = 0;
					for (var n = 0; n < 256; n++) {
						lt[i] += th[i][n];
						if (lt[i] >= half) {
							mid[i] = n;
							break;
						}
					}
				}
			}
			//Update colum histograms
			for (var xx = 0; xx < width; xx++) {
				var c1 = g.edge(xx, y - radius, width, height);
				var c2 = g.edge(xx, y + radius + 1, width, height);
				for (var i = 0; i < 3; i++) {
					hs[xx][i][data[c1 + i]] -= 1;
					hs[xx][i][data[c2 + i]] += 1;
				}
			}
		}
	});

} (gorgeous));