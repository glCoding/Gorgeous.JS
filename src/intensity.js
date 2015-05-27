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
	
} (gorgeous));