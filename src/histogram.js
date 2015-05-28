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

} (gorgeous));