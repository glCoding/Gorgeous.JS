//Test:Intensity Transformation Test
var g = gorgeous;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var src = 'img/baboon.png';
var load = document.createElement('h3');
load.innerHTML = 'loading img/baboon.png, please wait for a while.';
document.body.appendChild(load);
var img = g.loadImage(src, function () {
	load.innerHTML = 'img/baboon.png loaded.';
	canvas.width = 200;
	canvas.height = 200;
	tests();
});

function tests() {
	Test(['Image Negative', function (test) {
		ctx.fillStyle = 'rgb(124, 224, 31)';
		ctx.fillRect(0, 0, 200, 200);
		var imd = new g.ImageData(ctx);
		var neimd = imd.negative();
		imd.getImage(function (img) {
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Negative Image', img);
		});
		test.pass(neimd.getPixels().every(function (p) { return p.r === 131 && p.g === 31 && p.b === 224; }));
		imd = new g.ImageData(img);
		neimd = imd.negative();
		imd.getImage(function (img) {
			test.log('Baboon Test');
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Negative Image', img);
		});
	}],
	['Image Log Transformation', function (test) {
		ctx.fillStyle = 'rgb(124, 224, 31)';
		ctx.fillRect(0, 0, 200, 200);
		var imd = new g.ImageData(ctx);
		var neimd = imd.log(2);
		imd.getImage(function (img) {
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
		test.pass(neimd.getPixels().every(function (p) { return p.r === 222 && p.g === 249 && p.b === 159; }));
		imd = new g.ImageData(img);
		neimd = imd.log(2);
		imd.getImage(function (img) {
			test.log('Baboon Test');
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
	}],
	['Image Exponential Transformation', function (test) {
		ctx.fillStyle = 'rgb(124, 224, 31)';
		ctx.fillRect(0, 0, 200, 200);
		var imd = new g.ImageData(ctx);
		var neimd = imd.exp(1.01);
		imd.getImage(function (img) {
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
		test.pass(neimd.getPixels().every(function (p) { return p.r === 53 && p.g === 182 && p.b === 8; }));
		imd = new g.ImageData(img);
		neimd = imd.exp(1.01);
		imd.getImage(function (img) {
			test.log('Baboon Test');
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
	}],
	['Image Power Transformation', function (test) {
		ctx.fillStyle = 'rgb(124, 224, 31)';
		ctx.fillRect(0, 0, 200, 200);
		var imd = new g.ImageData(ctx);
		var neimd = imd.pow(2);
		imd.getImage(function (img) {
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
		test.pass(neimd.getPixels().every(function (p) { return p.r === 60 && p.g === 197 && p.b === 4; }));
		imd = new g.ImageData(img);
		neimd = imd.pow(2);
		imd.getImage(function (img) {
			test.log('Baboon Test');
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
	}],
	['Image Root Transformation', function (test) {
		ctx.fillStyle = 'rgb(124, 224, 31)';
		ctx.fillRect(0, 0, 200, 200);
		var imd = new g.ImageData(ctx);
		var neimd = imd.root(2);
		imd.getImage(function (img) {
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
		test.pass(neimd.getPixels().every(function (p) { return p.r === 178 && p.g === 239 && p.b === 89; }));
		imd = new g.ImageData(img);
		neimd = imd.root(2);
		imd.getImage(function (img) {
			test.log('Baboon Test');
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
	}],
	['Gray Image Histogram Equalization', function (test) {
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, 200, 200);
		var cimd = new g.GrayImageData(ctx);
		var dist = [];
		dist[100] = 5000;
		dist[110] = 5000;
		dist[120] = 5000;
		dist[130] = 5000;
		dist[140] = 5000;
		dist[150] = 5000;
		dist[160] = 5000;
		dist[170] = 5000;
		var ps = cimd.getPixels();
		ps.each(function (p) {
			var done = false;
			var w;
			while (!done) {
				w = 10 * (10 + Math.floor(Math.random() * 8));
				if(dist[w] !== 0) {
					dist[w] -= 1;
					p.l = w;
					done = true;
				}
			}
		});
		cimd.setPixels(ps);
		var hcimd = cimd.histogramEqualize();
		cimd.getImage(function (img) {
			test.show('Original Image', img);
		});
		hcimd.getImage(function (img) {
			test.show('Histogram Equalization', img);
		});
		var gimd = new g.GrayImageData(img);
		var himd = gimd.histogramEqualize();
		gimd.getImage(function (img) {
			test.log('Baboon Image');
			test.show('Original Image', img);
		});
		himd.getImage(function (img) {
			test.show('Histogram Equalization', img);
		});
		var psp = hcimd.getPixels();
		test.pass(psp.each(function (p, x, y) {
			switch (ps[x][y].l) {
				case 100:
					return p.l === 31;
				case 110:
					return p.l === 63;
				case 120:
					return p.l === 95;
				case 130:
					return p.l === 127;
				case 140:
					return p.l === 159;
				case 150:
					return p.l === 191;
				case 160:
					return p.l === 223;
				case 170:
					return p.l === 255;
			}
		}));
	}],
	['Image Histogram Equalization', function (test) {
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, 200, 200);
		var cimd = new g.GrayImageData(ctx);
		var dist = [];
		dist[100] = 5000;
		dist[110] = 5000;
		dist[120] = 5000;
		dist[130] = 5000;
		dist[140] = 5000;
		dist[150] = 5000;
		dist[160] = 5000;
		dist[170] = 5000;
		var ps = cimd.getPixels();
		ps.each(function (p) {
			var done = false;
			var w;
			while (!done) {
				w = 10 * (10 + Math.floor(Math.random() * 8));
				if(dist[w] !== 0) {
					dist[w] -= 1;
					p.l = w;
					done = true;
				}
			}
		});
		cimd.setPixels(ps);
		var hcimd = cimd.histogramEqualize();
		cimd.getImage(function (img) {
			test.show('Original Image', img);
		});
		hcimd.getImage(function (img) {
			test.show('Histogram Equalization', img);
		});
		var imd = new g.ImageData(img);
		var himd = imd.histogramEqualize();
		imd.getImage(function (img) {
			test.log('Baboon Image');
			test.show('Original Image', img);
		});
		himd.getImage(function (img) {
			test.show('Histogram Equalization', img);
		});
		var psp = hcimd.getPixels();
		test.pass(psp.each(function (p, x, y) {
			switch (ps[x][y].l) {
				case 100:
					return p.l === 31;
				case 110:
					return p.l === 63;
				case 120:
					return p.l === 95;
				case 130:
					return p.l === 127;
				case 140:
					return p.l === 159;
				case 150:
					return p.l === 191;
				case 160:
					return p.l === 223;
				case 170:
					return p.l === 255;
			}
		}));
	}]
	);
}
