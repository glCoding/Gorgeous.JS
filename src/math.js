(function (g) {

	function makeKernel(array) {
		if (!array) {
			return null;
		}
		var o = array.slice();
		o.reverse();
		if (!o.n) {
			o.n = Math.floor(Math.sqrt(o.length));
			o.mid = Math.round(o.n / 2) - 1;
			if (o.n * o.n !== o.length) {
				throw new Error('kernel size mismatch.');
			}
			o.get = function (x, y) {
				return o[y * o.n + x];
			};
		}
		return o;
	};

	//TODO: seperate the calculation of border
	g.convolution = function (oMatrix, width, height, kernel1, kernel2, kernel3) {
		var matrix = new Uint8ClampedArray(oMatrix);
		if (arguments.length === 4) {
			kernel3 = kernel2 = kernel1;
		}
		var k = [makeKernel(kernel1), makeKernel(kernel2), makeKernel(kernel3)];
		for (var i = 0; i < 3; i++) {
			var kk = k[i];
			if (kk) {
				for (var y = 0; y < height; y++) {
					for (var x = 0; x < width; x++) {
						//operation on image matrix
						var sum = 0;
						for (var j = 0; j < kk.length; j++) {
							//operation on kernel matrix
							//get the offset
							var yy = Math.floor(j / kk.n) - kk.mid + y;
							var xx = j % kk.n - kk.mid + x;
							if (!(xx < 0 || yy < 0 || xx >= width || yy >= height)) {
								var index = (yy * width + xx) * 4 + i;
								sum += kk[j] * matrix[index];
							}
						}
						oMatrix[4 * (width * y + x) + i] = sum;
					}
				}
			}
		}
	};

} (gorgeous));