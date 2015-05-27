(function (g) {

	g.makeKernel = function (array) {
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
		var k = [kernel1, kernel2, kernel3];
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
		return oMatrix;
	};

	g.kernels = {};

	g.registerKernel = function (name, kernels) {
		if (typeof kernels === 'string') {
			g.kernels[name] = g.kernels[kernels];
		} else if (typeof kernels[0] === 'number') {
			var ks = [];
			ks[0] = ks[1] = ks[2] = g.makeKernel(kernels);
			g.kernels[name] = ks;
		} else {
			g.kernels[name] = kernels.map(function (v) {
				return g.makeKernel(v);
			});
		}
		return g;
	};

	g.ImageData.prototype.useKernel = function (name, hsi, c1, c2, c3) {
		var kernels = g.kernels[name];
		if (arguments.length > 2) {
			kernels[0] = c1 ? kernels[0] : null;
			kernels[1] = c2 ? kernels[1] : null;
			kernels[2] = c3 ? kernels[2] : null;
		}
		if (hsi) {
			if (!(this.__synchronized)) {
				this.updateHSI();
			}
			g.convolution(this.hsiData, this.width, this.height, kernels[0], kernels[1], kernels[2]);
			this.updateRGB();
			this.pushChange();
			this.__synchronized = true;
		} else {
			g.convolution(this.data, this.width, this.height, kernels[0], kernels[1], kernels[2]);
			this.pushChange();
		}
		return this;
	};

} (gorgeous));