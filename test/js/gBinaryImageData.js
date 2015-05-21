//Test:gorgeous g.BinaryImageData test
var g = gorgeous;
var src = 'img/baboon.png';
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var img = g.loadImage(src, function (img) {
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img, 0, 0, img.width, img.height);
	tests();
});

function tests() {
Test(['g.BinaryImageData({string}, null, {function})', function (test) {
	g.BinaryImageData(src, null, function (gimd) {
		test.log('width: ' + gimd.width + '; height:' + gimd.height);
		gimd.getImage(function (image) {
			test.show('BinaryImageData from string source', image);
			test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
				&& gimd.data instanceof Uint8ClampedArray && gimd.nativeImageData instanceof ImageData
				&& image instanceof Image);
		});
	});
}]
,
['g.BinaryImageData({Image}, null)', function (test) {
	var gimd = g.BinaryImageData(img);
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('BinaryImageData from Image', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.nativeImageData instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.BinaryImageData({native ImageData}, null)', function (test) {
	var gimd = g.BinaryImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('BinaryImageData from ImageData', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.nativeImageData instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.BinaryImageData({g.ImageData}, null)', function (test) {
	var gimd = g.BinaryImageData(g.ImageData(img));
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('BinaryImageData from g.ImageData', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.nativeImageData instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.BinaryImageData({g.GrayImageData}, null)', function (test) {
	var gimd = g.BinaryImageData(g.GrayImageData(img));
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('BinaryImageData from g.GrayImageData', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.nativeImageData instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.BinaryImageData({g.BinaryImageData}, null)', function (test) {
	var gimd = g.BinaryImageData(g.BinaryImageData(img));
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('BinaryImageData from g.BinaryImageData', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.nativeImageData instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.BinaryImageData({CanvasRenderingContext2D}, null)', function (test) {
	var gimd = g.BinaryImageData(ctx);
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('BinaryImageData from Context2D', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.nativeImageData instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.BinaryImageData({HTMLCanvasElement}, null)', function (test) {
	var gimd = g.BinaryImageData(canvas);
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('BinaryImageData from Canvas', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.nativeImageData instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.BinaryImageData({HTMLCanvasElement}, {function}) With User-defined threshold function '
+ '(Actually this also tests g.BinaryImageData.prototype.setPixels.)', function (test) {
	var gimd = g.BinaryImageData(canvas, function (ps) {
		ps.each(function (p) {
			p.l = (p.l > 127) ? 0 : 255;
		});
	});
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('BinaryImageData', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.nativeImageData instanceof ImageData
			&& image instanceof Image);
	});
}]
);
}