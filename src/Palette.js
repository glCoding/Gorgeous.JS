(function (g) {
	'use strict';
	
	//TODO: Undo & Redo
	
	//TODO: transform
	//Although g.ImageData itself can make spatial transformation,
	//the transform in this layer will not sync to the g.ImageData.
	//So we could make high-quality image and also get a better performance.
	//
	g.Palette = function (width, height) {
		if (!(this instanceof g.Palette)) {
			return new g.Palette(width, height);
		} else {
			this.layers = [];
			this.view = g.makeCanvasContext(width, height);
		}
	};

	g.Palette.prototype.draw = function () {
		var self = this;
		this.layers.forEach(function (layer) {
			if (layer.visible) {
				self.view.putImageData(layer.imd.nativeImageData, layer.pleft, layer.ptop,
					layer.left, layer.top, layer.width, layer.height);
			}
		});
		return this;
	};

	g.Palette.prototype.getDataURL = function () {
		return this.draw().view.canvas.toDataURL();
	};
	
	g.Palette.prototype.getImage = function (callback) {
		return g.loadImage(this.getDataURL(), function (img) {
			if (typeof callback === 'function') {
				callback(img);
			}
		});
	};

	g.Palette.prototype.append = function (imd, pleft, ptop, left, top, width, height, name) {
		var rimd;
		if (!name) {
			name = 'Layer ' + this.layers.length;
		}
		if (this.layers.some(function (v) { return v === imd; })) {
			rimd = new g.ImageData(imd);
		} else {
			rimd = imd;
		}
		pleft = pleft || 0;
		ptop = ptop || 0;
		left = left || 0;
		top = top || 0;
		width = width || rimd.width;
		height = height || rimd.height;
		this.layers.push({
			id: this.layers.length,
			name: name,
			imd: rimd,
			pleft: pleft,
			ptop: ptop,
			left: left,
			top: top,
			width: width,
			height: height,
			visible: true
			//will add anchor & rotation here
			//will add size factor here
			//will add alpha here
		});
		this.draw();
		return this;
	};
	
	g.Palette.prototype.remove = function (id) {
		if (this.layers[id]) {
			this.splice(id, 1);
		} else {
			throw new Error('no such id: ', id);
		}
		this.draw();
		return this;
	}

} (gorgeous));