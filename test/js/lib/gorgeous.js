var gorgeous = {};;
(function () {
	'use strict';
	var g = gorgeous;
	
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

	function getPixels(imd, l, t, w, h, callback) {
		var range = rangeTest(l, t, w, h, imd.width, imd.height);
		if(!range) {
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
		var data = imd.data;
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
		for (var y = t; y < b; y++) {
			for (var x = l; x < r; x++) {
				pixels[x][y] = {};
				var now = (y * imd.width + x) * 4;
				callback(pixels[x][y], data, now);
			}
		}
		pixels.every = function (test, fail) {
			if (!(test instanceof Function)) {
				return false;
			}
			for (var y = this.top; y < this.bottom; y++) {
				for (var x = this.left; x < this.right; x++) {
					if(!test(this[x][y], x, y)) {
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

	function setPixels(imd, pixels, callback) {
		var data = imd.data;
		for (var y = pixels.top; y < pixels.bottom; y++) {
			for (var x = pixels.left; x < pixels.right; x++) {
				var now = 4 * (y * imd.width + x);
				callback(pixels[x][y], data, now);
			}
		}
		imd.pushChange();
	}

	g.ImageData = function (src, callback) {
		if (!(this instanceof g.ImageData)) {
			return new g.ImageData(src, callback);
		}
		g.makeBlank(this, 1, 1);
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

	g.ImageData.prototype.pushChange = function () {
		this.ctx.putImageData(this.nativeImageData, 0, 0);
	};
	
	g.ImageData.prototype.pullChange = function () {
		this.nativeImageData = this.ctx.getImageData(0, 0, this.width, this.height);
		this.data = this.nativeImageData.data;
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

	g.ImageData.prototype.getSize = function () {
		return { width: this.width, height: this.height };
	};

	g.ImageData.prototype.getPixels = function (l, t, w, h) {
		return getPixels(this, l, t, w, h, function (p, data, now) {
			p.r = data[now];
			p.g = data[now + 1];
			p.b = data[now + 2];
			p.a = data[now + 3];
		});
	};

	g.ImageData.prototype.setPixels = function (pixels) {
		setPixels(this, pixels, function (p, data, now) {
			data[now] = p.r;
			data[now + 1] = p.g;
			data[now + 2] = p.b;
			data[now + 3] = p.a;
		});
	};

	g.ImageData.prototype.getR = function () {
		var imd = new g.ImageData(this);
		var data = imd.data;
		for (var i = 0; i < data.length; i += 4) {
			data[i + 1] = data[i + 2] = 0;
		}
		imd.ctx.putImageData(imd.nativeImageData, 0, 0);
		return imd;
	};

	g.ImageData.prototype.getG = function () {
		var imd = new g.ImageData(this);
		var data = imd.data;
		for (var i = 0; i < data.length; i += 4) {
			data[i] = data[i + 2] = 0;
		}
		imd.ctx.putImageData(imd.nativeImageData, 0, 0);
		return imd;
	};

	g.ImageData.prototype.getB = function () {
		var imd = new g.ImageData(this);
		var data = imd.data;
		for (var i = 0; i < data.length; i += 4) {
			data[i] = data[i + 1] = 0;
		}
		imd.ctx.putImageData(imd.nativeImageData, 0, 0);
		return imd;
	};

	g.ImageData.prototype.copy = function (l, t, w, h) {
		var range = rangeTest(l, t, w, h, this.width, this.height);
		if(!range) {
			throw new Error('range error');
		}
		l = range[0];
		t = range[1];
		var r = range[2],
			b = range[3];
		return this.ctx.getImageData(l, t, r-l, b-h);
	};

	g.ImageData.prototype.paste = function (nimd, l, t, w, h) {
		w = (w) ? ((w < nimd.width) ? w : nimd.width) : nimd.width;
		h = (h) ? ((h < nimd.height) ? h : nimd.height) : nimd.height;
		this.pushChange();
	};

	g.GrayImageData = function (src, intensity, callback) {
		if (!(this instanceof g.GrayImageData)) {
			return new g.GrayImageData(src, intensity, callback);
		}
		function defaultIntensity(n) {
			var data = n.data;
			for (var i = 0; i < data.length; i += 4) {
				var lightness = (data[i] + data[i+1] + data[i+2]) / 3;
				data[i] = data[i + 1] = data[i + 2] = lightness;
			}
		}
		function transform(self) {
			if (typeof intensity === 'function') {
				var ps = g.ImageData.prototype.getPixels.call(self);
				intensity(ps);
				self.setPixels(ps);
			} else {
				defaultIntensity(self.nativeImageData);
				self.ctx.putImageData(self.nativeImageData, 0, 0);
			}
		}
		if (src instanceof g.GrayImageData) {
			g.ImageData.call(this, src);
		} else if (typeof src === 'string') {
			var self = this;
			g.ImageData.call(this, src, function () {
				transform(self);
				if (typeof callback === 'function') {
					callback(self);
				}
			});
		} else if (src instanceof HTMLCanvasElement || src instanceof CanvasRenderingContext2D) {
			g.GrayImageData.call(this, new g.ImageData(src), intensity);
		} else {
			if (src instanceof g.ImageData || src instanceof Image || src instanceof ImageData) {
				g.ImageData.call(this, src);
			} else {
				throw new Error('Need a source to create g.GrayImageData.');
			}
			transform(this);
		}
	};
	g.GrayImageData.prototype = Object.create(g.ImageData.prototype);
	g.GrayImageData.prototype.constructor = g.GrayImageData;

	g.GrayImageData.prototype.getPixels = function (l, t, w, h) {
		return getPixels(this, l, t, w, h, function (p, data, now) {
			p.l = data[now];
			p.a = data[now + 3];
		});
	};

	g.GrayImageData.prototype.setPixels = function (pixels) {
		setPixels(this, pixels, function (p, data, now) {
			data[now] = data[now + 1] = data[now + 2] = p.l;
			data[now + 3] = p.a;
		});
	};

	g.BinaryImageData = function (src, threshold, callback) {
		if (!(this instanceof g.BinaryImageData)) {
			return new g.BinaryImageData(src, threshold, callback);
		}
		function defaultThreshold(n) {
			var data = n.data;
			var sum = 0;
			for (var i = 0; i < data.length; i += 4) {
				sum += data[i];
			}
			var average = sum / data.length * 4;
			for (var i = 0; i < data.length; i += 4) {
				if (data[i] <= average) {
					data[i] = data[i + 1] = data[i + 2] = 0;
				} else {
					data[i] = data[i + 1] = data[i + 2] = 255;
				}
			}
		}
		function transform(self) {
			if (typeof threshold === 'function') {
				console.log('threshold');
				var ps = g.GrayImageData.prototype.getPixels.call(self);
				threshold(ps);
				self.setPixels(ps);
			} else {
				defaultThreshold(self.nativeImageData);
				self.ctx.putImageData(self.nativeImageData, 0, 0);
			}
		}
		if (src instanceof g.BinaryImageData) {
			g.GrayImageData.call(this, src);
		} else if (typeof src === 'string') {
			var self = this;
			g.GrayImageData.call(this, src, null, function () {
				transform(self);
				if (typeof callback === 'function') {
					callback(self);
				}
			});
		} else if (src instanceof HTMLCanvasElement || src instanceof CanvasRenderingContext2D) {
			g.BinaryImageData.call(this, new g.GrayImageData(src), threshold);
		} else {
			if (src instanceof g.ImageData || src instanceof Image || src instanceof ImageData) {
				g.GrayImageData.call(this, src);
			} else {
				throw new Error('Need a source to create g.BinaryImageData.');
			}
			transform(this);
		}
	};
	g.BinaryImageData.prototype = Object.create(g.GrayImageData.prototype);
	g.BinaryImageData.prototype.constructor = g.BinaryImageData;

	g.BinaryImageData.prototype.setPixels = function (pixels) {
		setPixels(this, pixels, function (p, data, now) {
			if (p.l === 255 || p.l === 0) {
				data[now] = data[now + 1] = data[now + 2] = p.l;
				data[now + 3] = p.a;
			} else {
				throw new Error('binary image only accepts 0 or 255 as lightness.');
			}
		});
	};

} ());;
(function () {
	'use strict';
	var g = gorgeous;

	g.loadImage = function (src, callback) {
		var img = new Image();
		img.onload = function (e) {
			callback(img, e);
		};
		img.src = src;
		return img;
	};
	
	g.createCanvasContext = function (width, height) {
		var canvas = document.createElement('canvas');
		canvas.width = width || 0;
		canvas.height = height || 0;
		return canvas.getContext('2d');
	};
	
	g.makeBlank = function (imd, width, height) {
		imd.ctx = g.createCanvasContext(width || 1, height || 1);
		imd.width = width || 1;
		imd.height = height || 1;
		imd.nativeImageData = imd.ctx.getImageData(0, 0, width || 1, height || 1);
		imd.data = imd.nativeImageData.data;
	};

	g.createBlankImageData = function (which, width, height) {
		function Helper() {};
		Helper.prototype = which.prototype;
		var r = new Helper();
		g.makeBlank(r, width, height);
		return r;
	};

} ());
;
(function () {
	'use strict';
	var g = gorgeous;
	var arithmeticError = new Error('Arithmetic Operations can only be performed on two ImageData in the same size.');

	function arithmeticOperationRangeTest(imd1, imd2) {
		return (imd1.width === imd2.width && imd1.height === imd2.height);
	}

	function testAndDo(imda, imdb, process) {
		if (arithmeticOperationRangeTest(imda, imdb)) {
			var rimd;
			if (imdb instanceof imda.constructor) {
				if (imdb.constructor !== imda.constructor) {
					//Attention: must use new operator because 'this' in imda.constructor() will be imda.
					//It will be good if use imda.constructor.call(null, imdb);
					//But I leave it here to remind myself.
					rimd = new imda.constructor(imdb);
					process(imda, rimd, rimd);
				} else {
					rimd = new imda.constructor(imda);
					process(rimd, imdb, rimd);
				}
			} else {
				rimd = new imdb.constructor(imda);
				process(rimd, imdb, rimd);
			}
			return rimd;
		} else {
			throw arithmeticError;
		}
	}
	
	g.ImageData.prototype.add = function (imd) {
		function process(imd1, imd2, rimd) {
			var data = rimd.data;
			for (var i = 0; i < data.length; i += 4) {
				data[i] += imd2.data[i];
				data[i+1] += imd2.data[i+1];
				data[i+2] += imd2.data[i+2];
				data[i+3] = 255;
			}
			rimd.ctx.putImageData(rimd.nativeImageData, 0, 0);
		}
		return testAndDo(this, imd, process);
	};

	g.ImageData.prototype.sub = function (imd) {
		function process(imd1, imd2, rimd) {
			var data = rimd.data;
			for (var i = 0; i < data.length; i += 4) {
				var diff = imd1.data[i] - imd2.data[i];
				data[i] = (diff > 0) ? diff : 0;
				diff = imd1.data[i+1] - imd2.data[i+1];
				data[i+1] = (diff > 0) ? diff : 0;
				diff = imd1.data[i+2] - imd2.data[i+2];
				data[i+2] = (diff > 0) ? diff : 0;
				data[i+3] = 255;
			}
			rimd.ctx.putImageData(rimd.nativeImageData, 0, 0);
		}
		return testAndDo(this, imd, process);
	};
	
	g.ImageData.prototype.mul = function (imd) {
		function process(imd1, imd2, rimd) {
			var data = rimd.data;
			for (var i = 0; i < data.length; i += 4) {
				data[i] *= imd2.data[i];
				data[i+1] *= imd2.data[i+1];
				data[i+2] *= imd2.data[i+2];
				data[i+3] = 255;
			}
			rimd.ctx.putImageData(rimd.nativeImageData, 0, 0);
		}
		return testAndDo(this, imd, process);
	};

	g.ImageData.prototype.div = function (imd) {
		function process(imd1, imd2, rimd) {
			var data = rimd.data;
			for (var i = 0; i < data.length; i += 4) {
				data[i] /= imd2.data[i] + 0.00001;
				data[i+1] /= imd2.data[i+1] + 0.00001;
				data[i+2] /= imd2.data[i+2] + 0.00001;
				data[i+3] = 255;
			}
			rimd.ctx.putImageData(rimd.nativeImageData, 0, 0);
		}
		return testAndDo(this, imd, process);
	};
} ());
;
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
} ());;
(function () {
	'use strict';
	var g = gorgeous;
	
	function execute(obj, process) {
		var imd = obj.constructor.call(null, obj);
		for (var i = 0; i < imd.data.length; i += 4) {
			for (var j = i; j < i+3; j++) {
				process(imd.data, j);
			}
		}
		imd.pushChange();
		return imd;
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

	g.GrayImageData.prototype.histogramEqualize = function () {
		if (this instanceof g.BinaryImageData) {
			throw new Error('You should not equalize a BinaryImageData\'s histogram, that doesn\'t make sense.');
		}
		var gimd = new g.GrayImageData(this);
		var histogramDistributionA = new Array(256);
		var histogramDistributionB = new Array(256);
		var invsize = 1 / (gimd.width * gimd.height);
		for (var i = 0; i < 256; i++) {
			histogramDistributionA[i] = 0;
		}
		for (var j = 0; j < gimd.data.length; j += 4) {
			histogramDistributionA[gimd.data[j]] += 1;
		}
		for (var k = 0; k < 256; k++) {
			histogramDistributionA[k] *= invsize;
		}
		for (var l = 0; l < 256; l++) {
			histogramDistributionB[l] = 0;
			for (var m = 0; m <= l; m++) {
				histogramDistributionB[l] += histogramDistributionA[m];
			}
			histogramDistributionB[l] = Math.round(histogramDistributionB[l] * 255);
		}
		for (var n = 0; n < gimd.data.length; n += 4) {
			var nv = histogramDistributionB[gimd.data[n]];
			gimd.data[n] = gimd.data[n+1] = gimd.data[n+2] = nv;
		}
		gimd.pushChange();
		return gimd;
	};
	
	g.ImageData.prototype.histogramEqualize = function () {
		var imd = this.getHSI();
		var histogramDistributionA = new Array(256);
		var histogramDistributionB = new Array(256);
		var invsize = 1 / (imd.width * imd.height);
		for (var i = 0; i < 256; i++) {
			histogramDistributionA[i] = 0;
		}
		for (var j = 0; j < imd.data.length; j += 4) {
			histogramDistributionA[imd.data[j+2]] += 1;
		}
		for (var k = 0; k < 256; k++) {
			histogramDistributionA[k] *= invsize;
		}
		for (var l = 0; l < 256; l++) {
			histogramDistributionB[l] = 0;
			for (var m = 0; m <= l; m++) {
				histogramDistributionB[l] += histogramDistributionA[m];
			}
			histogramDistributionB[l] = Math.round(histogramDistributionB[l] * 255);
		}
		for (var n = 0; n < imd.data.length; n += 4) {
			imd.data[n+2] = histogramDistributionB[imd.data[n+2]];
		}
		imd.pushChange();
		return imd.getRGB();
	};

	g.ImageData.prototype.transform = function (typeString) {
		
	};
} ());
