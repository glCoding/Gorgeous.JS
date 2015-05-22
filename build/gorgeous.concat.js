var gorgeous = {};;
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
	
	g.getLevel = function (imd) {
		if(imd instanceof g.BinaryImageData) {
			return 3;
		} else if (imd instanceof g.GrayImageData) {
			return 2;
		} else if (imd instanceof g.ImageData) {
			return 1;
		}
	}

} ());
;
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

	function makeBlankImageData(imd) {
		imd.ctx = g.createCanvasContext(0, 0);
		imd.width = 0;
		imd.height = 0;
		imd.nativeImageData = null;
		imd.data = null;
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
		imd.nativeImageData = ctx.getImageData(0, 0, imd.width, imd.height);
		imd.data = imd.nativeImageData.data;
	}

	function initImageDataFromAnotherImageData(imd, aimd) {
		var ctx = imd.ctx;
		setImageDataSize(imd, aimd.width, aimd.height);
		ctx.putImageData(aimd.nativeImageData, 0, 0);
		imd.nativeImageData = ctx.getImageData(0, 0, imd.width, imd.height);
		imd.data = imd.nativeImageData.data;
	}

	function initImageDataFromNativeImageData(imd, nimd) {
		var ctx = imd.ctx;
		setImageDataSize(imd, nimd.width, nimd.height);
		ctx.putImageData(nimd, 0, 0);
		imd.nativeImageData = ctx.getImageData(0, 0, imd.width, imd.height);
		imd.data = imd.nativeImageData.data;
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
		imd.ctx.putImageData(imd.nativeImageData, 0, 0);
		imd.nativeImageData = imd.ctx.getImageData(0, 0, imd.width, imd.height);
		imd.data = imd.nativeImageData.data;
	}

	g.ImageData = function (src, callback) {
		if (!(this instanceof g.ImageData)) {
			return new g.ImageData(src, callback);
		}
		makeBlankImageData(this);
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
		this.ctx.putImageData(nimd, l, t, 0, 0, w, h);
	};

	g.GrayImageData = function (src, intensity, callback) {
		if (!(this instanceof g.GrayImageData)) {
			return new g.GrayImageData(src, intensity, callback);
		}
		function defaultIntensity(n) {
			var data = n.data;
			for (var i = 0; i < data.length; i += 4) {
				var max = Math.max(data[i], data[i + 1], data[i + 2]);
				var min = Math.min(data[i], data[i + 1], data[i + 2]);
				var lightness = (max + min) * 0.5;
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
	var arithmeticError = new Error('Arithmetic Operations can only be performed on two ImageData in the same size.');

	function arithmeticOperationRangeTest(imd1, imd2) {
		return (imd1.width === imd2.width && imd1.height === imd2.height);
	}

	function testAndDo(imda, imdb, process) {
		if (arithmeticOperationRangeTest(imda, imdb)) {
			var rimd;
			var rl, imd1, imd2;
			var il = g.getLevel(imdb);
			var tl = g.getLevel(imda);
			if (il < tl) {
				rl = il;
				imd1 = imdb;
				imd2 = imda;
			} else {
				rl = tl;
				imd1 = imda;
				imd2 = imdb;
			}
			switch (rl) {
				case 1:
					rimd = new g.ImageData(imd1);
					break;
				case 2:
					rimd = new g.GrayImageData(imd1);
					break;
				case 3:
					rimd = new g.BinaryImageData(imd1);
					break;
				default:
					rimd = new g.ImageData(imd1);
			}
			process(imd1, imd2, rimd);
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
			return rimd;
		}
		return testAndDo(this, imd, process);
	};
	
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
			return rimd;
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
			return rimd;
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
			return rimd;
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
			return rimd;
		}
		return testAndDo(this, imd, process);
	};
} ());
