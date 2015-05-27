var gorgeous = {};
(function (g) {
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
		if (!(ops instanceof Function)) {
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
			data[i+1] = data[i+2] = 0;
		}, false);
	};

	g.ImageData.prototype.getG = function () {
		return commonOperationForGet(this, function (i, data) {
			data[i] = data[i+2] = 0;
		}, false);
	};

	g.ImageData.prototype.getB = function () {
		return commonOperationForGet(this, function (i, data) {
			data[i] = data[i+1] = 0;
		}, false);
	};

	g.ImageData.prototype.getH = function () {
		var imd = commonOperationForGet(this, function (i, data, hsiData) {
			data[i] = data[i+1] = data[i+2] = hsiData[i];
		}, true);
		this.__synchronized = true;
		return imd;
	};

	g.ImageData.prototype.getS = function () {
		var imd = commonOperationForGet(this, function (i, data, hsiData) {
			data[i] = data[i+1] = data[i+2] = hsiData[i+1];
		}, true);
		this.__synchronized = true;
		return imd;
	};

	g.ImageData.prototype.getI = function () {
		var imd = commonOperationForGet(this, function (i, data, hsiData) {
			data[i] = data[i+1] = data[i+2] = hsiData[i+2];
		}, true);
		this.__synchronized = true;
		return imd;
	};
	
	g.ImageData.prototype.getHSI = function () {
		var imd = commonOperationForGet(this, function (i, data, hsiData) {
			for (var j = 0; j < 4; j++) {
				data[i+j] = hsiData[i+j];
			}
		}, true);
		this.__synchronized = true;
		return imd;
	};
} (gorgeous));;
(function (g) {
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
			if (!(test instanceof Function)) {
				return false;
			}
			for (var y = this.top; y < this.bottom; y++) {
				for (var x = this.left; x < this.right; x++) {
					if (!test(this[x][y], x, y)) {
						if (fail instanceof Function) {
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
	};
} (gorgeous));;
(function (g) {
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
			if(!(data[i] === data[i + 1] && data[i + 1] === data[i + 2])) {
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

	function makeKernel(array) {
		if (!array) {
			return null;
		}
		var o = array.slice();
		o.reverse();
		if (!o.n) {
			o.n = Math.floor(Math.sqrt(o.length));
			o.mid = Math.round(o.n / 2) - 1;
			if (o.n * o.n !== o.length) {
				throw new Error('kernel size mismatch.');
			}
			o.get = function (x, y) {
				return o[y * o.n + x];
			};
		}
		return o;
	};

	//TODO: seperate the calculation of border
	g.convolution = function (oMatrix, width, height, kernel1, kernel2, kernel3) {
		var matrix = new Uint8ClampedArray(oMatrix);
		if (arguments.length === 4) {
			kernel3 = kernel2 = kernel1;
		}
		var k = [makeKernel(kernel1), makeKernel(kernel2), makeKernel(kernel3)];
		for (var i = 0; i < 3; i++) {
			var kk = k[i];
			if (kk) {
				for (var y = 0; y < height; y++) {
					for (var x = 0; x < width; x++) {
						//operation on image matrix
						var sum = 0;
						for (var j = 0; j < kk.length; j++) {
							//operation on kernel matrix
							//get the offset
							var yy = Math.floor(j / kk.n) - kk.mid + y;
							var xx = j % kk.n - kk.mid + x;
							if (!(xx < 0 || yy < 0 || xx >= width || yy >= height)) {
								var index = (yy * width + xx) * 4 + i;
								sum += kk[j] * matrix[index];
							}
						}
						oMatrix[4 * (width * y + x) + i] = sum;
					}
				}
			}
		}
	};

} (gorgeous));