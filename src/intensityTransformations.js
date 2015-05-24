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

	g.ImageData.prototype.transform = function (typeString) {
		
	};
} ());
