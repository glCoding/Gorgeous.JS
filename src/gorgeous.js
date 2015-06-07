var gorgeous = {};
(function (g) {
	'use strict';
	g.loadImage = function (src, callback) {
		var img = new Image();
		img.onload = function (e) {
			callback(img, e);
		};
		img.src = src;
		return img;
	};

	g.makeCanvasContext = function (width, height) {
		if (!width || !height || width < 0 || height < 0) {
			throw new Error('Canvas width & height must be positive.');
		}
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		return canvas.getContext('2d');
	};

	g.init = function (imd, width, height) {
		width = width || 1, height = height || 1;
		imd.ctx = g.makeCanvasContext(width, height);
		imd.width = width;
		imd.height = height;
		imd.nativeImageData = imd.ctx.getImageData(0, 0, width, height);
		imd.data = imd.nativeImageData.data;
		imd.hsiData = null;
		imd.__synchronized = false;
	};

	function hue(R, G, B) {
		var r_g = R - G;
		var r_b = R - B;
		var g_b = G - B;
		var theta = Math.acos(0.5 * (r_g + r_b) / (Math.sqrt((r_g * r_g + r_b * g_b)) + 0.00001));
		return Math.round(255 * ((B <= G) ? theta : (Math.PI * 2 - theta)) / (2 * Math.PI));
	}

	function saturation(R, G, B) {
		var m = Math.min(R, G, B);
		return Math.round(255 * (1 - 3 * m / (R + G + B + 0.00001)));
	}

	function intensity(R, G, B) {
		return Math.round((R + G + B) / 3);
	}

	g.intensity = function (r, g, b) {
		return intensity(r, g, b);
	};

	g.rgb2hsi = function (r, g, b) {
		return {
			h: hue(r, g, b),
			s: saturation(r, g, b),
			i: intensity(r, g, b)
		};
	};

	g.hsi2rgb = function (h, s, i) {
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
		var H, S, I, R, G, B;
		H = h / 255 * (Math.PI * 2),
		S = s / 255,
		I = i;
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
		return {
			r: Math.round(R),
			g: Math.round(G),
			b: Math.round(B),
		};
	};
} (gorgeous));