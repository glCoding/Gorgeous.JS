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
