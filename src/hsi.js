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
} (gorgeous));