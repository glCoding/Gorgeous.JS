(function () {
	'use strict';
	var g = gorgeous;

	function hue(R, G, B) {
		var r_g = R - G;
		var r_b = R - B;
		var g_b = G - B;
		var theta = Math.acos(0.5 * (r_g + r_b) / (Math.sqrt((r_g * r_g + r_b * g_b)) + 0.00001));
		return 255 * ((B <= G) ? theta : (Math.PI * 2 - theta)) / (2 * Math.PI);
	}

	function saturation(R, G, B) {
		var m = Math.min(R, G, B);
		return 255 * (1 - 3 * m / (R + G + B + 0.00001));
	}

	function intensity(R, G, B) {
		return (R + G + B) / 3;
	}

	g.ImageData.prototype.getH = function () {
		var himd = g.createBlankImageData(g.GrayImageData, this.width, this.height);
		for (var i = 0; i < this.data.length; i += 4) {
			himd.data[i] = himd.data[i + 1] = himd.data[i + 2] = hue(this.data[i], this.data[i + 1], this.data[i + 2]);
			himd.data[i + 3] = 255;
		}
		himd.ctx.putImageData(himd.nativeImageData, 0, 0);
		return himd;
	};

	g.ImageData.prototype.getS = function () {
		var simd = g.createBlankImageData(g.GrayImageData, this.width, this.height);
		for (var i = 0; i < this.data.length; i += 4) {
			simd.data[i] = simd.data[i + 1] = simd.data[i + 2] = saturation(this.data[i], this.data[i + 1], this.data[i + 2]);
			simd.data[i + 3] = 255;
		}
		simd.ctx.putImageData(simd.nativeImageData, 0, 0);
		return simd;
	};

	g.ImageData.prototype.getI = function () {
		var iimd = g.createBlankImageData(g.GrayImageData, this.width, this.height);
		for (var i = 0; i < this.data.length; i += 4) {
			iimd.data[i] = iimd.data[i + 1] = iimd.data[i + 2] = intensity(this.data[i], this.data[i + 1], this.data[i + 2]);
			iimd.data[i + 3] = 255;
		}
		iimd.ctx.putImageData(iimd.nativeImageData, 0, 0);
		return iimd;
	};

	g.ImageData.prototype.getHSI = function () {
		var imd = g.createBlankImageData(g.ImageData, this.width, this.height);
		for (var i = 0; i < this.data.length; i += 4) {
			imd.data[i] = hue(this.data[i], this.data[i + 1], this.data[i + 2]);
			imd.data[i + 1] = saturation(this.data[i], this.data[i + 1], this.data[i + 2]);
			imd.data[i + 2] = intensity(this.data[i], this.data[i + 1], this.data[i + 2]);
			imd.data[i + 3] = 255;
		}
		imd.ctx.putImageData(imd.nativeImageData, 0, 0);
		return imd;
	};

	g.ImageData.prototype.getRGB = function () {
		var imd = g.createBlankImageData(g.ImageData, this.width, this.height);
		for (var i = 0; i < this.data.length; i += 4) {
			var rgb = g.hsi2rgb([this.data[i], this.data[i + 1], this.data[i + 2]]);
			imd.data[i] = rgb[0];
			imd.data[i + 1] = rgb[1];
			imd.data[i + 2] = rgb[2];
			imd.data[i + 3] = 255;
		}
		imd.ctx.putImageData(imd.nativeImageData, 0, 0);
		return imd;
	};

	g.rgb2hsi = function (c) {
		if (c instanceof Array) {
			return [hue(c[0], c[1], c[2]), saturation(c[0], c[1], c[2]), intensity(c[0], c[1], c[2])];
		} else {
			throw new Error('Please call g.rgb2hsi() as g.rgb2hsi([R, G, B]).');
		}
	};

	g.hsi2rgb = function (c) {
		var r120 = Math.PI * 120 / 180;
		var r240 = Math.PI * 240 / 180;
		function X(S, I) {
			return I * (1 - S); //I(1-S)
		}
		function Y(H, S, I) {
			return I * (1 + S * Math.cos(H) / Math.cos(Math.PI / 3 - H)); //I(1 + S * (cosH / cos(60-H)))
		}
		function Z(I, V, W) {
			return 3 * I - V - W;
		}
		if (c instanceof Array) {
			var H, S, I, R, G, B;
			H = c[0] / 255 * (Math.PI * 2),
			S = c[1] / 255,
			I = c[2];
			if (H > r240) {
				H = H - r240;
				G = X(S, I);
				B = Y(H, S, I);
				R = Z(I, G, B);
			} else if (H > r120) {
				H = H - r120;
				R = X(S, I);
				G = Y(H, S, I);
				B = Z(I, G, R);
			} else {
				B = X(S, I);
				R = Y(H, S, I);
				G = Z(I, R, B);
			}
			return [R, G, B];
		} else {
			throw new Error('Please call g.hsi2rgb() as g.hsi2rgb([H, S, I]).');
		}
	};
} ());