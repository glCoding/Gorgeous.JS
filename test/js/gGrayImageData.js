//Test:gorgeous g.GrayImageData test
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
Test(['g.GrayImageData({string}, null, {function})', function (test) {
	g.GrayImageData(src, null, function (gimd) {
		test.log('width: ' + gimd.width + '; height:' + gimd.height);
		gimd.getImage(function (image) {
			test.show('GrayImageData from string source', image);
			test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
				&& gimd.data instanceof Uint8ClampedArray && gimd.native instanceof ImageData
				&& image instanceof Image);
		});
	});
}]
,
['g.GrayImageData({Image}, null)', function (test) {
	var gimd = g.GrayImageData(img);
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('GrayImageData from Image', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.native instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.GrayImageData({native ImageData}, null)', function (test) {
	var gimd = g.GrayImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('GrayImageData from ImageData', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.native instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.GrayImageData({g.ImageData}, null)', function (test) {
	var gimd = g.GrayImageData(g.ImageData(img));
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('GrayImageData from g.ImageData', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.native instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.GrayImageData({g.GrayImageData}, null)', function (test) {
	var gimd = g.GrayImageData(g.GrayImageData(img));
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('GrayImageData from g.GrayImageData', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.native instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.GrayImageData({CanvasRenderingContext2D}, null)', function (test) {
	var gimd = g.GrayImageData(ctx);
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('GrayImageData from Context2D', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.native instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.GrayImageData({HTMLCanvasElement}, null)', function (test) {
	var gimd = g.GrayImageData(canvas);
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('GrayImageData from Canvas', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.native instanceof ImageData
			&& image instanceof Image);
	});
}]
,
['g.GrayImageData({HTMLCanvasElement}, {function}) With User-defined intensity function '
+ '(Actually this also tests g.GrayImageData.prototype.get\\setPixels.)', function (test) {
	var gimd = g.GrayImageData(canvas, function (ps) {
		ps.each(function (p) {
			p.l = Math.min(p.r, p.g, p.b);
		});
	});
	test.log('width: ' + gimd.width + '; height:' + gimd.height);
	gimd.getImage(function (image) {
		test.show('GrayImageData Min value of RGBs', image);
		test.pass(gimd.width === 512 && gimd.width === 512 && gimd.ctx
			&& gimd.data instanceof Uint8ClampedArray && gimd.native instanceof ImageData
			&& image instanceof Image);
	});
}]
);
}