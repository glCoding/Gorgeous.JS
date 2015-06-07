(function (g) {
	'use strict';
	
	//TODO: Undo & Redo
	
	//TODO: transform
	//Although g.ImageData itself can make spatial transformation,
	//the transform in this layer will not sync to the g.ImageData.
	//So we could make high-quality image and also get a better performance.
	
	g.Palette = function (width, height) {
		if (this instanceof g.Palette) {
			return new g.Palette(width, height);
		} else {
			this.layers = [];
			this.view = g.makeCanvasContext(width, height);
		}
	};

	g.Palette.prototype.draw = function () {
		//For imd in layers, draw it with its binding properties.
	};

	g.Palette.prototype.append = function (imd, left, top, name) {
		var rimd;
		if (!name) {
			name = 'Layer ' + this.layers.length;
		}
		if (this.layers.some(function (v) { return v === imd; })) {
			rimd = new g.ImageData(imd);
		} else {
			rimd = imd;
		}
		this.layers.push({
			id: this.layers.length,
			name: name,
			imd: rimd,
			left: left,
			top: top,
			visible: true
			//will add anchor & rotation here
			//will add size factor here
			//will add alpha here
		});
		this.draw();
	};
	
	g.Palette.prototype.remove = function (id) {
		if (this.layers[id]) {
			this.splice(id, 1);
		}
		this.draw();
	}

} (gorgeous));