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
