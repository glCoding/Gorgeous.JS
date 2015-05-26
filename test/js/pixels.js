//Test:Pixel Operations Test
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
	["getPixels", function (test) {
		var imd = g.ImageData(ctx);
		var ps = imd.getPixels(120, 60, 75, 120);
		imd.getImage(function (img) {
			test.show('origin', img);
		});
		test.pass(ps.every(function (p, x, y) {
			return (
				(x < 150 && y < 100 && (p.r === 15 && p.g === 71 && p.b === 32)) ||
				(x >= 150 && y < 100 && (p.r === 0 && p.g === 120 && p.b === 224)) ||
				(x < 150 && y >= 100 && (p.r === 75 && p.g === 111 && p.b === 122)) ||
				(x >= 150 && y >= 100 && (p.r === 39 && p.g === 26 && p.b === 232))
			);
		}));
	}],
	["setPixels", function (test) {
		var imd = g.ImageData(ctx);
		var ps = imd.getPixels(120, 60, 75, 120);
		ps.each(function (p, x, y) {
			p.r = p.g = p.b = 127;
		});
		imd.setPixels(ps);
		imd.getImage(function (img) {
			test.show('changed', img);
		});
		test.pass(ps.every(function (p, x, y) {
			return (
				((x >= 120 && y >= 60 && x < 195 && y < 180) && (p.r === 127 && p.g === 127 && p.b === 127)) ||
				(x < 150 && y < 100 && (p.r === 15 && p.g === 71 && p.b === 32)) ||
				(x >= 150 && y < 100 && (p.r === 0 && p.g === 120 && p.b === 224)) ||
				(x < 150 && y >= 100 && (p.r === 75 && p.g === 111 && p.b === 122)) ||
				(x >= 150 && y >= 100 && (p.r === 39 && p.g === 26 && p.b === 232))
			);
		}));
	}],
	["getHSIPixels", function (test) {
		var imd = g.ImageData(ctx);
		var ps = imd.getHSIPixels(120, 60, 75, 120);
		imd.getImage(function (img) {
			test.show('origin', img);
		});
		console.log(g.rgb2hsi(15, 71, 32));
		console.log(g.rgb2hsi(0, 120, 224));
		console.log(g.rgb2hsi(75, 111, 122));
		console.log(g.rgb2hsi(39, 26, 232));
		test.pass(ps.every(function (p, x, y) {
			return (
				(x < 150 && y < 100 && (p.h === 97 && p.s === 158 && p.i === 39)) ||
				(x >= 150 && y < 100 && (p.h === 147 && p.s === 255 && p.i === 115)) ||
				(x < 150 && y >= 100 && (p.h === 137 && p.s === 69 && p.i === 103)) ||
				(x >= 150 && y >= 100 && (p.h === 172 && p.s === 188 && p.i === 99))
			);
		}));
	}],
	["setHSIPixels", function (test) {
		var imd = g.ImageData(ctx);
		var ps = imd.getHSIPixels(120, 60, 75, 120);
		console.log(g.hsi2rgb(210, 124, 69));
		ps.each(function (p) {
			p.h = 210;
			p.s = 124;
			p.i = 69;
		});
		imd.setHSIPixels(ps);
		imd.getImage(function (img) {
			test.show('origin', img);
		});
		test.pass(ps.every(function (p, x, y) {
			return (
				((x >= 120 && y >= 60 && x < 195 && y < 180) && (p.h === 210 && p.s === 124 && p.i === 69)) ||
				(x < 150 && y < 100 && (p.h === 97 && p.s === 158 && p.i === 39)) ||
				(x >= 150 && y < 100 && (p.h === 147 && p.s === 255 && p.i === 115)) ||
				(x < 150 && y >= 100 && (p.h === 137 && p.s === 69 && p.i === 103)) ||
				(x >= 150 && y >= 100 && (p.h === 172 && p.s === 188 && p.i === 99))
			);
		}));
	}]
);
