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
} (gorgeous));