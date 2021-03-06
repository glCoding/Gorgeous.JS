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
} (gorgeous));;
(function (g) {
	'use strict';

	function setImageDataSize(imd, width, height) {
		imd.width = width;
		imd.height = height;
		imd.ctx.canvas.width = width;
		imd.ctx.canvas.height = height;
	}

	function initImageDataFromCanvas(imd, canvas) {
		initImageDataFromContext(imd, canvas.getContext('2d'));
	}

	function initImageDataFromContext(imd, ctx) {
		initImageDataFromNativeImageData(imd, ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
	}

	function initImageDataFromString(imd, str, callback) {
		var img = new Image();
		img.onload = function () {
			initImageDataFromImage(imd, img);
			if (typeof callback === 'function') {
				callback(imd);
			}
		};
		img.src = str;
	}

	function initImageDataFromImage(imd, img) {
		var ctx = imd.ctx;
		setImageDataSize(imd, img.width, img.height);
		ctx.drawImage(img, 0, 0, img.width, img.height);
		imd.pullChange();
	}

	function initImageDataFromAnotherImageData(imd, aimd) {
		var ctx = imd.ctx;
		setImageDataSize(imd, aimd.width, aimd.height);
		ctx.putImageData(aimd.nativeImageData, 0, 0);
		imd.pullChange();
	}

	function initImageDataFromNativeImageData(imd, nimd) {
		var ctx = imd.ctx;
		setImageDataSize(imd, nimd.width, nimd.height);
		ctx.putImageData(nimd, 0, 0);
		imd.pullChange();
	}

	g.ImageData = function (src, callback) {
		if (!(this instanceof g.ImageData)) {
			return new g.ImageData(src, callback);
		}
		g.init(this);
		if (src instanceof Image) {
			initImageDataFromImage(this, src);
		} else if (typeof src === 'string') {
			initImageDataFromString(this, src, callback);
		} else if (src instanceof HTMLCanvasElement) {
			initImageDataFromCanvas(this, src);
		} else if (src instanceof CanvasRenderingContext2D) {
			initImageDataFromContext(this, src);
		} else if (src instanceof g.ImageData) {
			initImageDataFromAnotherImageData(this, src);
		} else if (src instanceof ImageData) {
			initImageDataFromNativeImageData(this, src);
		} else {
			throw new Error('Need a source to create g.ImageData.');
		}
	};

	g.ImageData.prototype.toString = function () {
		return '[object g.ImageData] with width: ' + this.width + 'px, height: ' + this.height + 'px';
	};

	g.ImageData.prototype.getDataURL = function () {
		return this.ctx.canvas.toDataURL();
	};

	g.ImageData.prototype.getImage = function (callback) {
		var img = new Image();
		img.onload = function () {
			if (typeof callback === 'function') {
				callback(img);
			}
		};
		img.src = this.getDataURL();
		return img;
	};

	g.ImageData.prototype.pushChange = function () {
		this.ctx.putImageData(this.nativeImageData, 0, 0);
		this.__synchronized = false;
		return this;
	};

	g.ImageData.prototype.pullChange = function () {
		this.nativeImageData = this.ctx.getImageData(0, 0, this.width, this.height);
		this.data = this.nativeImageData.data;
		this.__synchronized = false;
		return this;
	};

} (gorgeous));;
(function (g) {
	'use strict';
	g.ImageData.prototype.updateHSI = function () {
		var length = this.data.length;
		var data = this.data;
		if (!this.hsiData) {
			this.hsiData = new Uint8ClampedArray(length);
		}
		var hsiData = this.hsiData;
		for (var i = 0; i < length; i += 4) {
			var hsi = g.rgb2hsi(data[i], data[i + 1], data[i + 2]);
			hsiData[i] = hsi.h;
			hsiData[i + 1] = hsi.s;
			hsiData[i + 2] = hsi.i;
			hsiData[i + 3] = data[i + 3];
		}
		this.__synchronized = true;
		return this;
	};

	g.ImageData.prototype.updateRGB = function () {
		if (!this.hsiData) {
			throw new Error('There is no hsiData field yet.');
		}
		var length = this.data.length;
		var data = this.data;
		var hsiData = this.hsiData;
		for (var i = 0; i < length; i += 4) {
			var rgb = g.hsi2rgb(hsiData[i], hsiData[i + 1], hsiData[i + 2]);
			data[i] = rgb.r;
			data[i + 1] = rgb.g;
			data[i + 2] = rgb.b;
			data[i + 3] = hsiData[i + 3];
		}
		this.pushChange();
		this.__synchronized = true;
		return this;
	};

	function commonOperationForGet(self, ops, hsi) {
		if (hsi && !self.__synchronized) {
			self.updateHSI();
		}
		var hsiData = self.hsiData;
		var imd = new g.ImageData(self);
		var data = imd.data;
		if (!(typeof ops === 'function')) {
			throw new Error('need operations.');
		}
		for (var i = 0; i < data.length; i += 4) {
			ops(i, data, hsiData);
		}
		imd.ctx.putImageData(imd.nativeImageData, 0, 0);
		return imd;
	}

	g.ImageData.prototype.getR = function () {
		return commonOperationForGet(this, function (i, data) {
			data[i + 1] = data[i + 2] = 0;
		}, false);
	};

	g.ImageData.prototype.getG = function () {
		return commonOperationForGet(this, function (i, data) {
			data[i] = data[i + 2] = 0;
		}, false);
	};

	g.ImageData.prototype.getB = function () {
		return commonOperationForGet(this, function (i, data) {
			data[i] = data[i + 1] = 0;
		}, false);
	};

	g.ImageData.prototype.getH = function () {
		var imd = commonOperationForGet(this, function (i, data, hsiData) {
			data[i] = data[i + 1] = data[i + 2] = hsiData[i];
		}, true);
		this.__synchronized = true;
		return imd;
	};

	g.ImageData.prototype.getS = function () {
		var imd = commonOperationForGet(this, function (i, data, hsiData) {
			data[i] = data[i + 1] = data[i + 2] = hsiData[i + 1];
		}, true);
		this.__synchronized = true;
		return imd;
	};

	g.ImageData.prototype.getI = function () {
		var imd = commonOperationForGet(this, function (i, data, hsiData) {
			data[i] = data[i + 1] = data[i + 2] = hsiData[i + 2];
		}, true);
		this.__synchronized = true;
		return imd;
	};

	g.ImageData.prototype.getHSI = function () {
		var imd = commonOperationForGet(this, function (i, data, hsiData) {
			for (var j = 0; j < 4; j++) {
				data[i + j] = hsiData[i + j];
			}
		}, true);
		this.__synchronized = true;
		return imd;
	};
} (gorgeous));;
(function (g) {
	'use strict';
	function rangeTest(l, t, w, h, width, height) {
		l = l || 0;
		t = t || 0;
		w = w || (width - l);
		h = h || (height - t);
		if (l < 0 || l > width || t < 0 || t > height
			|| w + l > width || w < 0 || h + t > height || h < 0) {
			return false;
		} else {
			return [l, t, l + w, t + h];
		}
	}

	function getPixels(imd, l, t, w, h, callback, hsi) {
		var range = rangeTest(l, t, w, h, imd.width, imd.height);
		if (!range) {
			throw new Error('range error');
		}
		l = range[0];
		t = range[1];
		var r = range[2],
			b = range[3];
		var pixels = [];
		for (var i = l; i < r; i++) {
			pixels[i] = [];
		}
		var data;
		if (!hsi) {
			data = imd.data;
		} else {
			if (!(imd.hsiData)) {
				imd.updateHSI();
			}
			data = imd.hsiData;
		}
		for (var y = t; y < b; y++) {
			for (var x = l; x < r; x++) {
				pixels[x][y] = {};
				var now = (y * imd.width + x) * 4;
				callback(pixels[x][y], data, now);
			}
		}
		pixels.left = l;
		pixels.top = t;
		pixels.width = w;
		pixels.height = h;
		pixels.right = r;
		pixels.bottom = b;
		pixels.each = function (opr) {
			for (var y = this.top; y < this.bottom; y++) {
				for (var x = this.left; x < this.right; x++) {
					opr(this[x][y], x, y);
				}
			}
			return this;
		};
		pixels.every = function (test, fail) {
			if (!(typeof test === 'function')) {
				return false;
			}
			for (var y = this.top; y < this.bottom; y++) {
				for (var x = this.left; x < this.right; x++) {
					if (!test(this[x][y], x, y)) {
						if (typeof fail === 'function') {
							fail(this[x][y], x, y);
						}
						return false;
					}
				}
			}
			return true;
		};
		return pixels;
	}

	function setPixels(imd, pixels, callback, hsi) {
		var data;
		if (!hsi) {
			data = imd.data;
		} else {
			if (!(imd.hsiData)) {
				imd.hsiData = new Uint8ClampedArray(imd.data.length);
			}
			data = imd.hsiData;
		}
		for (var y = pixels.top; y < pixels.bottom; y++) {
			for (var x = pixels.left; x < pixels.right; x++) {
				var now = 4 * (y * imd.width + x);
				callback(pixels[x][y], data, now);
			}
		}
		if (hsi) {
			imd.updateRGB();
		} else {
			imd.pushChange();
		}
	}

	g.ImageData.prototype.getPixels = function (l, t, w, h) {
		return getPixels(this, l, t, w, h, function (p, data, now) {
			p.r = data[now];
			p.g = data[now + 1];
			p.b = data[now + 2];
			p.a = data[now + 3];
		}, false);
	};

	g.ImageData.prototype.setPixels = function (pixels) {
		setPixels(this, pixels, function (p, data, now) {
			data[now] = p.r;
			data[now + 1] = p.g;
			data[now + 2] = p.b;
			data[now + 3] = p.a;
		}, false);
		return this;
	};

	g.ImageData.prototype.getHSIPixels = function (l, t, w, h) {
		var ps = getPixels(this, l, t, w, h, function (p, data, now) {
			p.h = data[now];
			p.s = data[now + 1];
			p.i = data[now + 2];
			p.a = data[now + 3];
		}, true);
		this.__synchronized = true;
		return ps;
	};

	g.ImageData.prototype.setHSIPixels = function (pixels) {
		setPixels(this, pixels, function (p, data, now) {
			data[now] = p.h;
			data[now + 1] = p.s;
			data[now + 2] = p.i;
			data[now + 3] = p.a;
		}, true);
		this.__synchronized = true;
		return this;
	};
} (gorgeous));;
(function (g) {
	'use strict';
	g.ImageData.prototype.gray = function () {
		var data = this.data;
		for (var i = 0; i < data.length; i += 4) {
			data[i] = data[i + 1] = data[i + 2] = g.intensity(data[i], data[i + 1], data[i + 2]);
		}
		this.pushChange();
		return this;
	};

	g.ImageData.prototype.threshold = function () {
		var data = this.data;
		var th = 0;
		for (var i = 0; i < data.length; i += 4) {
			if (!(data[i] === data[i + 1] && data[i + 1] === data[i + 2])) {
				data[i] = data[i + 1] = data[i + 2] = g.intensity(data[i], data[i + 1], data[i + 2]);
			}
			th += data[i];
		}
		th /= this.width * this.height;
		for (var i = 0; i < data.length; i += 4) {
			if (data[i] > th) {
				data[i] = data[i + 1] = data[i + 2] = 255;
			} else {
				data[i] = data[i + 1] = data[i + 2] = 0;
			}
		}
		this.pushChange();
		return this;
	};

	function execute(obj, process) {
		for (var i = 0; i < obj.data.length; i += 4) {
			for (var j = 0; j < 3; j++) {
				process(obj.data, i + j);
			}
		}
		obj.pushChange();
		return obj;
	}

	g.ImageData.prototype.negative = function () {
		return execute(this, function (arr, i) {
			arr[i] = 255 - arr[i];
		});
	};

	g.ImageData.prototype.log = function (n) {
		if (n < 1 || n > 5) {
			throw new Error('log() need argument n greater than 1 & less than 5.');
		}
		var c = 255 / Math.log(256);
		return execute(this, function (arr, i) {
			arr[i] = Math.log(arr[i] + 1) * c;
		});
	};

	g.ImageData.prototype.exp = function (n) {
		if (n < 1 || n > 5) {
			throw new Error('exp() need argument n greater than 1 & less than 5.');
		}
		n = 1 + n / 20;
		var c = 255 / (Math.pow(n, 255) - 1);
		return execute(this, function (arr, i) {
			arr[i] = (Math.pow(n, arr[i]) - 1) * c;
		});
	};

	g.ImageData.prototype.root = function (n) {
		if (n < 1 || n > 5) {
			throw new Error('root() need argument n greater than 1 & less than 5.');
		}
		var m = 1 / n;
		var c = 255 / Math.pow(255, m);
		return execute(this, function (arr, i) {
			arr[i] = Math.pow(arr[i], m) * c;
		});
	};

	g.ImageData.prototype.pow = function (n) {
		if (n < 1 || n > 5) {
			throw new Error('pow() need argument n greater than 1 & less than 5.');
		}
		var c = 255 / Math.pow(255, n);
		return execute(this, function (arr, i) {
			arr[i] = Math.pow(arr[i], n) * c;
		});
	};

} (gorgeous));;
(function (g) {
	'use strict';
	g.ImageData.prototype.histogram = function () {
		if (!this.__synchronized) {
			this.updateHSI();
		}
		var data = this.hsiData;
		var histogramDistribution = new Array(256);
		for (var i = 0; i < 256; i++) {
			histogramDistribution[i] = 0;
		}
		var inv = 1 / (this.width * this.height);
		for (var i = 0; i < data.length; i += 4) {
			histogramDistribution[data[i + 2]] += 1;
		}
		for (var i = 0; i < 256; i++) {
			histogramDistribution[i] *= inv;
		}
		this.__synchronized = true;
		return histogramDistribution;
	};

	g.ImageData.prototype.equalize = function () {
		var ndis = new Uint8ClampedArray(256);
		var odis = this.histogram();
		var sum = 0;
		for (var i = 0; i < 256; i++) {
			sum += odis[i];
			ndis[i] = sum * 255;
		}
		var data = this.hsiData;
		for (var i = 0; i < data.length; i += 4) {
			data[i + 2] = ndis[data[i + 2]];
		}
		this.updateRGB();
		this.__synchronized = true;
		return this;
	};

} (gorgeous));;
(function (g) {
	'use strict';

	g.edge = function (x, y, width, height) {
		x = (x < 0) ? 0
			: ((x >= width) ? (width - 1) : x);
		y = (y < 0) ? 0
			: ((y >= height) ? (height - 1) : y);
		return 4 * (width * y + x);
	};

	g.makeKernel = function (array, width, height, factor, bias) {
		if (!array) {
			return null;
		}
		var o = array.slice().map(function (v) {
			return v * (factor || 1);
		});
		if (width * height !== o.length) {
			throw new Error('kernel size mismatch.');
		}
		o.width = width;
		o.height = height;
		o.midx = Math.round(o.width / 2) - 1;
		o.midy = Math.round(o.height / 2) - 1;
		o.bias = bias || 0;
		o.get = function (x, y) {
			return o[y * o.width + x];
		};
		return o;
	};

	//TODO: seperate the calculation of border
	g.convolution = function (oMatrix, width, height, kernel) {
		var matrix = new Uint8ClampedArray(oMatrix);
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				//operation on image matrix
				var sum = [0, 0, 0];
				for (var j = 0; j < kernel.length; j++) {
					//operation on kernel matrix
					//get the offset
					var yy = Math.floor(j / kernel.width) - kernel.midy + y;
					var xx = j % kernel.width - kernel.midx + x;
					if (!(xx < 0 || yy < 0 || xx >= width || yy >= height)) {
						var cc = g.edge(xx, yy, width, height);
						for (var i = 0; i < 3; i++) {
							sum[i] += kernel[j] * matrix[cc + i];
						}
					}
				}
				var cur = g.edge(x, y, width, height);
				for (var i = 0; i < 3; i++) {
					oMatrix[cur + i] = sum[i] + kernel.bias;
				}
			}
		}
		return oMatrix;
	};

	g.kernels = {};

	function preprocessFilterName(name) {
		return name.trim().replace(/\s+/g, ' ').toLowerCase();
	}

	g.register = function (name, kernel, width, height, factor, bias) {
		name = preprocessFilterName(name);
		if (typeof kernel === 'string') {
			kernel = preprocessFilterName(kernel);
			if (!g.kernels[kernel]) {
				if (!g.ImageData.prototypep[kernel]) {
					throw new Error('no ' + kernel + ' in g.kernels.');
				}
				g.kernels[name] = function () {
					g.ImageData.prototype[kernel].apply(this, Array.prototype.slice.call(this, 2));
				};
			}
			g.kernels[name] = g.kernels[kernel];
		} else if (typeof kernel === 'function') {
			g.kernels[name] = kernel;
		} else if (kernel instanceof Array && typeof kernel[0] === 'string') {
			g.kernels[name] = (function (ks) {
				return function () {
					for (var i = 0; i < ks.length; i++) {
						this.use.apply(this, ks[i]);
					}
				};
			} (Array.prototype.slice.call(arguments, 1)));
		} else {
			g.kernels[name] = g.makeKernel(kernel, width, height, factor, bias);
		}
		return g;
	};

	g.ImageData.prototype.use = function (name) {
		if (name instanceof Array && typeof name[0] === 'string') {
			for (var i = 0; i < arguments.length; i++) {
				this.use.apply(this, arguments[i]);
			}
		} else {
			name = preprocessFilterName(name);
			var kernel = g.kernels[name];
			if (typeof kernel === 'function') {
				kernel.apply(this, Array.prototype.slice.call(arguments, 1));
				this.pushChange();
			} else if (kernel instanceof Array && typeof kernel[0] === 'number') {
				g.convolution(this.data, this.width, this.height, kernel);
				this.pushChange();
			} else if (typeof this[name] === 'function') {
				this[name].apply(this, Array.prototype.slice.call(arguments, 1));
			} else {
				throw new Error('no such filter.');
			}
		}
		return this;
	};

} (gorgeous));;
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
		radius = radius || 2;
		function makeHistogram() {
			var h = [new Uint8ClampedArray(256), new Uint8ClampedArray(256), new Uint8ClampedArray(256)];
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

} (gorgeous));;
(function (g) {
	'use strict';
	g.register('Sharpen', [
		-1, -1, -1,
		-1, 9, -1,
		-1, -1, -1
	], 3, 3);

	g.register('Excessive Sharpen', [
		1, 1, 1,
		1, -7, 1,
		1, 1, 1
	], 3, 3);

} (gorgeous));;
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

} (gorgeous));;
(function (g) {
	'use strict';
	
	//TODO: Undo & Redo
	
	//TODO: transform
	//Although g.ImageData itself can make spatial transformation,
	//the transform in this layer will not sync to the g.ImageData.
	//So we could make high-quality image and also get a better performance.
	//
	g.Palette = function (width, height) {
		if (!(this instanceof g.Palette)) {
			return new g.Palette(width, height);
		} else {
			this.layers = [];
			this.view = g.makeCanvasContext(width, height);
		}
	};

	g.Palette.prototype.draw = function () {
		var self = this;
		this.layers.forEach(function (layer) {
			if (layer.visible) {
				self.view.putImageData(layer.imd.nativeImageData, layer.pleft, layer.ptop,
					layer.left, layer.top, layer.width, layer.height);
			}
		});
		return this;
	};

	g.Palette.prototype.getDataURL = function () {
		return this.draw().view.canvas.toDataURL();
	};
	
	g.Palette.prototype.getImage = function (callback) {
		return g.loadImage(this.getDataURL(), function (img) {
			if (typeof callback === 'function') {
				callback(img);
			}
		});
	};

	g.Palette.prototype.append = function (imd, pleft, ptop, left, top, width, height, name) {
		var rimd;
		if (!name) {
			name = 'Layer ' + this.layers.length;
		}
		if (this.layers.some(function (v) { return v === imd; })) {
			rimd = new g.ImageData(imd);
		} else {
			rimd = imd;
		}
		pleft = pleft || 0;
		ptop = ptop || 0;
		left = left || 0;
		top = top || 0;
		width = width || rimd.width;
		height = height || rimd.height;
		this.layers.push({
			id: this.layers.length,
			name: name,
			imd: rimd,
			pleft: pleft,
			ptop: ptop,
			left: left,
			top: top,
			width: width,
			height: height,
			visible: true
			//will add anchor & rotation here
			//will add size factor here
			//will add alpha here
		});
		this.draw();
		return this;
	};
	
	g.Palette.prototype.remove = function (id) {
		if (this.layers[id]) {
			this.splice(id, 1);
		} else {
			throw new Error('no such id: ', id);
		}
		this.draw();
		return this;
	}

} (gorgeous));