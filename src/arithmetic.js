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
