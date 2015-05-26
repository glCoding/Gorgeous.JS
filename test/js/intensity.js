//Test:Intensity Operations Test
var g = gorgeous;

var ctx = g.makeCanvasContext(300, 200);
ctx.fillStyle = 'rgb(15, 71, 32)';
ctx.fillRect(0, 0, 150, 100);
ctx.fillStyle = 'rgb(0, 120, 224)';
ctx.fillRect(150, 0, 150, 100);
ctx.fillStyle = 'rgb(75, 111, 122)';
ctx.fillRect(0, 100, 150, 100);
ctx.fillStyle = 'rgb(39, 26, 232)';
ctx.fillRect(150, 100, 150, 100);
var canvas = ctx.canvas;
Test(
	["Gray Level Image", function (test) {
		var imd = g.ImageData(ctx);
		imd.gray().getImage(function (img) {
			test.show('Gray Level', img);
			test.pass(img instanceof Image);
		});
	}],
	["Binary Image", function (test) {
		var imd = g.ImageData(ctx);
		imd.threshold().getImage(function (img) {
			test.show('Binary Image', img);
			test.pass(img instanceof Image);
		});
	}],
	["Negative Color", function (test) {
		var imd = g.ImageData(ctx);
		imd.negative().getImage(function (img) {
			test.show('Binary Image', img);
			test.pass(img instanceof Image);
		});
	}],
	["Gray Negative Binary Combined", function (test) {
		var imd = g.ImageData(ctx);
		imd.gray().negative().threshold().getImage(function (img) {
			test.show('Combined', img);
			test.pass(img instanceof Image);
		});
	}],
	["log & exp", function (test) {
		var imd = g.ImageData(ctx);
		imd.getImage(function (img) {
			test.show('original', img);
		});
		imd.log(2).getImage(function (img) {
			test.show('log(2)', img);
		});
		imd = g.ImageData(ctx);
		imd.exp(1.5).getImage(function (img) {
			test.show('exp(1.5)', img);
			test.pass(img instanceof Image);
		});
	}],
	["root & pow", function (test) {
		var imd = g.ImageData(ctx);
		imd.getImage(function (img) {
			test.show('original', img);
		});
		imd.root(2).getImage(function (img) {
			test.show('root(2)', img);
		});
		imd = g.ImageData(ctx);
		imd.pow(2).getImage(function (img) {
			test.show('pow(2)', img);
			test.pass(img instanceof Image);
		});
	}],
	["root & pow combined", function (test) {
		var imd = g.ImageData(ctx);
		imd.getImage(function (img) {
			test.show('original', img);
		});
		imd.pow(2).root(2).getImage(function (img) {
			test.show('combined', img);
			test.pass(img instanceof Image);
		});
	}]
);

