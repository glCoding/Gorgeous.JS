(function (g) {

	g.makeKernel = function (array, factor, bias) {
		if (!array) {
			return null;
		}
		var o = array.slice().map(function (v) {
			return v * (factor || 1);
		});
		o.n = Math.floor(Math.sqrt(o.length));
		o.mid = Math.round(o.n / 2) - 1;
		if (o.n * o.n !== o.length) {
			throw new Error('kernel size mismatch.');
		}
		o.bias = bias || 0;
		o.get = function (x, y) {
			return o[y * o.n + x];
		};
		return o;
	};

	//TODO: seperate the calculation of border
	g.convolution = function (oMatrix, width, height, kernel) {
		var matrix = new Uint8ClampedArray(oMatrix);
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				//operation on image matrix
				var sum = [0, 0, 0];
				for (var j = 0; j < kernel.length; j++) {
					//operation on kernel matrix
					//get the offset
					var yy = Math.floor(j / kernel.n) - kernel.mid + y;
					var xx = j % kernel.n - kernel.mid + x;
					if (!(xx < 0 || yy < 0 || xx >= width || yy >= height)) {
						var cc = 4 * (width * yy + xx);
						for (var i = 0; i < 3; i++) {
							sum[i] += kernel[j] * matrix[cc + i];
						}
					}
				}
				var cur = 4 * (width * y + x);
				for (var i = 0; i < 3; i++) {
					oMatrix[cur + i] = sum[i] + kernel.bias;
				}
			}
		}
		return oMatrix;
	};

	g.kernels = {};

	g.registerFilter = function (name, kernel, factor, bias) {
		if (typeof kernel === 'string') {
			if (!g.kernels[kernel]) {
				throw new Error('no ' + kernel + ' in g.kernels.');
			}
			g.kernels[name] = g.kernels[kernel];
		} else if (kernel instanceof Function) {
			g.kernels[name] = kernel;
		} else {
			g.kernels[name] = g.makeKernel(kernel, factor, bias);
		}
		return g;
	};

	g.ImageData.prototype.useFilter = function (name) {
		var kernel = g.kernels[name];
		if (kernel instanceof Function) {
			kernel.apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			g.convolution(this.data, this.width, this.height, kernel);
		}
		this.pushChange();
		return this;
	};

} (gorgeous));