var gonzalez = {};

(function () {
	'use strict';
	var g = gonzalez;

	function createCanvasContext(width, height) {
		var canvas = document.createElement('canvas');
		canvas.width = width || 0;
		canvas.height = height || 0;
		return canvas.getContext('2d');
	}

	function makeBlankImageData(imd) {
		imd.ctx = createCanvasContext(0, 0);
		imd.width = 0;
		imd.height = 0;
		imd.native = null;
		imd.data = null;
	}

	function setImageDataSize(imd, width, height) {
		imd.width = width;
		imd.height = height;
		imd.ctx.canvas.width = width;
		imd.ctx.canvas.height = height;
	}

	function initImageDataFromCanvas(imd, canvas) {
		imd.ctx = createCanvasContext(canvas.width, canvas.height);
		imd.ctx.putImageData(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height), 0, 0);
		imd.width = canvas.width;
		imd.height = canvas.height;
		imd.native = imd.ctx.getImageData(0, 0, imd.width, imd.height);
		imd.data = imd.native.data;
	}

	function initImageDataFromContext(imd, ctx) {
		initImageDataFromCanvas(imd, ctx.canvas);
	}

	function initImageDataFromString(imd, str, callback) {
		var img = new Image();
		img.onload = function () {
			initImageDataFromImage(imd, img);
			if(typeof callback === 'function') {
				callback(imd);
			}
		};
		img.src = str;
	}

	function initImageDataFromImage(imd, img) {
		var ctx = imd.ctx;
		setImageDataSize(imd, img.width, img.height);
		ctx.drawImage(img, 0, 0, img.width, img.height);
		imd.native = ctx.getImageData(0, 0, imd.width, imd.height);
		imd.data = imd.native.data;
	}

	function initImageDataFromAnotherImageData(imd, aimd) {
		var ctx = imd.ctx;
		setImageDataSize(imd, aimd.width, aimd.height);
		ctx.putImageData(aimd.native, 0, 0);
		imd.native = ctx.getImageData(0, 0, imd.width, imd.height);
		imd.data = imd.native.data;
	}

	function initImageDataFromNativeImageData(imd, nimd) {
		var ctx = imd.ctx;
		setImageDataSize(imd, nimd.width, nimd.height);
		ctx.putImageData(nimd, 0, 0);
		imd.native = ctx.getImageData(0, 0, imd.width, imd.height);
		imd.data = imd.native.data;
	}

	function getPixelArray(imd, l, t, w, h, callback) {
		l = l || 0;
		t = t || 0;
		w = w || (imd.width - l);
		h = h || (imd.height - t);
		if(l < 0 || t < 0 || l > imd.width || t > imd.height
		|| w < 0 || h < 0 || l + w > imd.width || t + h > imd.height) {
			throw new Error('range error');
		}
		var pixels = [];
		var	r = w + l,
			b = h + t;
		for(var i = l; i < r; i++) {
			pixels[i] = [];
		}
		var data = imd.data;
		pixels.left = l;
		pixels.top = t;
		pixels.width = w;
		pixels.height = h;
		pixels.right = l + w;
		pixels.bottom = t + h;
		pixels.each = function (opr) {
			for(var y = this.top; y < this.bottom; y++) {
				for(var x = this.left; x < this.right; x++) {
					opr(this[x][y], x, y);
				}
			}
			return this;
		};
		for(var y = t; y < b; y++) {
			for(var x = l; x < r; x++) {
				pixels[x][y] = {};
				var now = (y * imd.width + x) * 4;
				callback(pixels[x][y], data, now);
			}
		}
		return pixels;
	}
	
	function setPixelArray(imd, pixels, callback) {
		var data = imd.data;
		for(var y = pixels.top; y < pixels.bottom; y++) {
			for(var x = pixels.left; x < pixels.right; x++) {
				var now = 4 * (y * imd.width + x);
				callback(pixels[x][y], data, now);
			}
		}
		imd.ctx.putImageData(imd.native, 0, 0);
		imd.native = imd.ctx.getImageData(0, 0, imd.width, imd.height);
		imd.data = imd.native.data;
	}
	
	g.ImageData = function (src, callback) {
		if(!(this instanceof g.ImageData)) {
			return new g.ImageData(src, callback);
		}
		if(src instanceof HTMLCanvasElement) {
			initImageDataFromCanvas(this, src);
		} else if(src instanceof CanvasRenderingContext2D) {
			initImageDataFromContext(this, src);
		} else {
			makeBlankImageData(this);
			if(typeof src === 'string') {
				initImageDataFromString(this, src, callback);
			} else if(src instanceof Image) {
				initImageDataFromImage(this, src);
			} else if(src instanceof g.ImageData) {
				initImageDataFromAnotherImageData(this, src);
			} else if(src instanceof ImageData) {
				initImageDataFromNativeImageData(this, src);
			} else {
				throw new Error('Need a source to create g.ImageData.');
			}
		}
	};

	g.ImageData.prototype.getDataURL = function () {
		return this.ctx.canvas.toDataURL();
	};

	g.ImageData.prototype.getImage = function (callback) {
		var img = new Image();
		img.onload = function () {
			if(typeof callback === 'function') {
				callback(img);
			}
		};
		img.src = this.getDataURL();
		return img;
	};

	g.ImageData.prototype.getSize = function () {
		return {w: this.width, h: this.height};
	};

	g.ImageData.prototype.setSize = function (w, h) {
		if(w <= 0 || h <= 0) { throw new Error('width and height should be positive integer.'); }
		var oldNimd = this.native;
		var nw = (this.width > w) ? w : this.width;
		var nh = (this.height > h) ? h : this.height;
		setImageDataSize(this, w, h);
		var ctx = this.ctx;
		ctx.putImageData(oldNimd, 0, 0, 0, 0, nw, nh);
		this.native = ctx.getImageData(0, 0, w, h);
		this.data = this.native.data;
	};

	g.ImageData.prototype.getPixelArray = function (l, t, w, h) {
		return getPixelArray(this, l, t, w, h, function (p, data, now) {
			p.r = data[now];
			p.g = data[now+1];
			p.b = data[now+2];
			p.a = data[now+3];
		});
	}

	g.ImageData.prototype.setPixelArray = function (pixels) {
		setPixelArray(this, pixels, function (p, data, now) {
			data[now] = p.r;
			data[now+1] = p.g;
			data[now+2] = p.b;
			data[now+3] = p.a;
		});
	}

	g.ImageData.prototype.getRChannel = function () {
		var imd = g.ImageData(this);
		var data = imd.data;
		for(var i = 0; i < data.length; i += 4) {
			data[i+1] = data[i+2] = 0;
		}
		imd.ctx.putImageData(imd.native, 0, 0);
		return imd;
	};

	g.ImageData.prototype.getGChannel = function () {
		var imd = g.ImageData(this);
		var data = imd.data;
		for(var i = 0; i < data.length; i += 4) {
			data[i] = data[i+2] = 0;
		}
		imd.ctx.putImageData(imd.native, 0, 0);
		return imd;
	};

	g.ImageData.prototype.getBChannel = function () {
		var imd = g.ImageData(this);
		var data = imd.data;
		for(var i = 0; i < data.length; i += 4) {
			data[i] = data[i+1] = 0;
		}
		imd.ctx.putImageData(imd.native, 0, 0);
		return imd;
	};

	g.GrayImageData = function (src, intensity, callback) {
		if(!(this instanceof g.GrayImageData)) {
			return new g.GrayImageData(src, intensity, callback);
		}
		function defaultIntensity(n) {
			function mm(arr3) {
				var result = {max: arr3[0], min: arr3[0]};
				for(var i = 1; i < 3; i++) {
					if(arr3[i] < result.min) { result.min = arr3[i]; }
					if(arr3[i] > result.max) { result.max = arr3[i]; }
				}
				return result;
			}
			var data = n.data;
			for(var i = 0; i < data.length; i += 4) {
				var mmr = mm([data[i], data[i+1], data[i+2]]);
				var lightness = (mmr.max + mmr.min) * 0.5;
				data[i] = data[i+1] = data[i+2] = lightness;
			}
		}
		function transform(self) {
			if(typeof intensity === 'function') {
				var ps = g.ImageData.prototype.getPixelArray.call(self);
				intensity(ps);
				self.setPixelArray(ps);
			} else {
				defaultIntensity(self.native);
				self.ctx.putImageData(self.native, 0, 0);
			}
		}
		if(src instanceof g.GrayImageData) {
			g.ImageData.call(this, src);
		} else if(typeof src === 'string') {
			var self = this;
			g.ImageData.call(this, src, function () {
				transform(self);
				if(typeof callback === 'function') {
					callback(self);
				}
			});
		} else if(src instanceof HTMLCanvasElement || src instanceof CanvasRenderingContext2D) {
			g.GrayImageData.call(this, new g.ImageData(src), intensity);
		} else {
			if(src instanceof g.ImageData || src instanceof Image || src instanceof ImageData) {
				g.ImageData.call(this, src);
			} else {
				throw new Error('Need a source to create g.GrayImageData.');
			}
			transform(this);
		}
	}
	g.GrayImageData.prototype = Object.create(g.ImageData.prototype);
	g.GrayImageData.prototype.constructor = g.GrayImageData;

	g.GrayImageData.prototype.getPixelArray = function (l, t, w, h) {
		return getPixelArray(this, l, t, w, h, function (p, data, now) {
			p.l = data[now];
			p.a = data[now+3];
		});
	}

	g.GrayImageData.prototype.setPixelArray = function (pixels) {
		setPixelArray(this, pixels, function (p, data, now) {
			data[now] = data[now+1] = data[now+2] = p.l;
			data[now+3] = p.a;
		});
	};

	g.BinaryImageData = function (src, threshold, callback) {
		if(!(this instanceof g.BinaryImageData)) {
			return new g.BinaryImageData(src, threshold, callback);
		}
		function defaultThreshold(n) {
			var data = n.data;
			var sum = 0;
			for(var i = 0; i < data.length; i += 4) {
				sum += data[i];
			}
			var average = sum / data.length * 4;
			for(var i = 0; i < data.length; i += 4) {
				if(data[i] <= average) {
					data[i] = data[i+1] = data[i+2] = 0;
				} else {
					data[i] = data[i+1] = data[i+2] = 255;
				}
			}
		}
		function transform(self) {
			if(typeof threshold === 'function') {
				console.log('threshold');
				var ps = g.GrayImageData.prototype.getPixelArray.call(self);
				threshold(ps);
				self.setPixelArray(ps);
			} else {
				defaultThreshold(self.native);
				self.ctx.putImageData(self.native, 0, 0);
			}
		}
		if(src instanceof g.BinaryImageData) {
			g.GrayImageData.call(this, src);
		} else if(typeof src === 'string') {
			var self = this;
			g.GrayImageData.call(this, src, null, function () {
				transform(self);
				if(typeof callback === 'function') {
					callback(self);
				}
			});
		} else if(src instanceof HTMLCanvasElement || src instanceof CanvasRenderingContext2D) {
			g.BinaryImageData.call(this, new g.GrayImageData(src), threshold);
		} else {
			if(src instanceof g.ImageData || src instanceof Image || src instanceof ImageData) {
				g.GrayImageData.call(this, src);
			} else {
				throw new Error('Need a source to create g.BinaryImageData.');
			}
			transform(this);
		}
	}
	g.BinaryImageData.prototype = Object.create(g.GrayImageData.prototype);
	g.BinaryImageData.prototype.constructor = g.BinaryImageData;

	g.BinaryImageData.prototype.setPixelArray = function (pixels) {
		setPixelArray(this, pixels, function (p, data, now) {
			if(p.l === 255 || p.l === 0) {
				data[now] = data[now+1] = data[now+2] = p.l;
				data[now+3] = p.a;
			} else {
				throw new Error('binary image only accepts 0 or 255 as lightness.');
			}
		});
	}

}());