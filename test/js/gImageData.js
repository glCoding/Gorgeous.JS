//Test:gorgeous g.ImageData test
var g = gorgeous;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var src = 'img/baboon.png';
var url = '';
var img = g.loadImage(src, function (img) {
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	url = canvas.toDataURL();
	tests();
});

function tests() {
	Test(
		['g.ImageData({string}, {callback function})', function (test) {
			g.ImageData(src, function (imd) {
				test.log('g.ImageData constructed! width:' + imd.width + ' height:' + imd.height);
				test.pass(imd.width === 512 && imd.width === 512 && imd.ctx
					&& imd.data instanceof Uint8ClampedArray && imd.nativeImageData instanceof ImageData);
			});
		}]
		,
		['g.ImageData({Image})', function (test) {
			var imd = g.ImageData(img);
			test.log('g.ImageData constructed! width:' + imd.width + ' height:' + imd.height);
			test.pass(imd.width === 512 && imd.width === 512 && imd.ctx
				&& imd.data instanceof Uint8ClampedArray && imd.nativeImageData instanceof ImageData);
		}]
		,
		['g.ImageData({native ImageData})', function (test) {
			var imd = g.ImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
			test.log('g.ImageData constructed! width:' + imd.width + ' height:' + imd.height);
			test.pass(imd.width === 512 && imd.width === 512 && imd.ctx
				&& imd.data instanceof Uint8ClampedArray && imd.nativeImageData instanceof ImageData);
		}]
		,
		['g.ImageData({g.ImageData}) (Actually a copy method)', function (test) {
			var imd = g.ImageData(g.ImageData(img));
			test.log('g.ImageData constructed! width:' + imd.width + ' height:' + imd.height);
			test.pass(imd.width === 512 && imd.width === 512 && imd.ctx
				&& imd.data instanceof Uint8ClampedArray && imd.nativeImageData instanceof ImageData);
		}]
		,
		['g.ImageData({CanvasRenderingContext2D})', function (test) {
			var imd = g.ImageData(ctx);
			test.log('g.ImageData constructed! width:' + imd.width + ' height:' + imd.height);
			test.pass(imd.width === 512 && imd.width === 512 && imd.ctx
				&& imd.data instanceof Uint8ClampedArray && imd.nativeImageData instanceof ImageData);
		}]
		,
		['g.ImageData({HTMLCanvasElement})', function (test) {
			var imd = g.ImageData(canvas);
			test.log('g.ImageData constructed! width:' + imd.width + ' height:' + imd.height);
			test.pass(imd.width === 512 && imd.width === 512 && imd.ctx
				&& imd.data instanceof Uint8ClampedArray && imd.nativeImageData instanceof ImageData);
		}]
		,
		['g.ImageData.prototype.toDataURL()', function (test) {
			var dataURL = g.ImageData(img).getDataURL();
			test.log('DataURL: ' + dataURL.slice(0, 21));
			test.pass(dataURL === url);
		}]
		,
		['g.ImageData.prototype.getImage({function ({Image})})', function (test) {
			g.ImageData(img).getImage(function (img) {
				test.show('test getImage', img);
				test.pass(img instanceof Image);
			});
		}]
		,
		['g.ImageData.prototype.getSize()', function (test) {
			var size = g.ImageData(img).getSize();
			test.log('getSize: width-' + size.width + ' height-' + size.height);
			test.pass(size.width === 512 && size.height === 512);
		}]
		,
		['g.ImageData.prototype.getPixels()', function (test) {
			var canvas = document.createElement('canvas');
			canvas.width = 100;
			canvas.height = 100;
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = '#FF0000';
			ctx.fillRect(0, 0, 50, 50);
			ctx.fillStyle = '#00FF00';
			ctx.fillRect(50, 0, 50, 50);
			ctx.fillStyle = '#0000FF';
			ctx.fillRect(0, 50, 50, 50);
			ctx.fillStyle = '#FFFFFF';
			ctx.fillRect(50, 50, 50, 50);
			var imd = g.ImageData(canvas);
			var ps = imd.getPixels(7, 9, 62, 73);
			test.log([ps.left, ps.right, ps.top, ps.bottom].join(' '));
			test.pass(function () {
				var pf = true;
				ps.each(function (p, x, y) {
					if (x < 50) {
						if (y < 50) {
							if (p.r !== 0xff || p.g !== 0x00 || p.b !== 0x00 || p.a !== 255) {
								test.log([x, y].join(', '));
								pf = false;
							}
						} else {
							if (p.r !== 0x00 || p.g !== 0xff || p.b !== 0x00 || p.a !== 255) {
								test.log([x, y].join(', '));
								pf = false;
							}
						}
					} else {
						if (y < 50) {
							if (p.r !== 0x00 || p.g !== 0x00 || p.b !== 0xff || p.a !== 255) {
								test.log([x, y].join(', '));
								pf = false;
							}
						} else {
							if (p.r !== 0xff || p.g !== 0xff || p.b !== 0xff || p.a !== 255) {
								test.log([x, y].join(', '));
								pf = false;
							}
						}
					}
				});
				return pf;
			});
		}]
		,
		['g.ImageData.prototype.sizePixels()', function (test) {
			var imd = g.ImageData(img);
			var ps = imd.getPixels(100, 70, 200, 200);
			ps.each(function (p) {
				p.r = p.g = p.b = 0x00;
			});
			imd.setPixels(ps);
			imd.getImage(function (img) {
				test.show('setPixels', img);
			});
			test.pass(function () {
				var pf = true;
				var ps = imd.getPixels(100, 70, 200, 200);
				ps.each(function (p) {
					if (p.r !== 0 || p.g !== 0 || p.b !== 0) {
						pf = false;
					}
				});
				return pf;
			});
		}]
		,
		['g.ImageData.prototype.getR\\G\\B()', function (test) {
			var canvas = document.createElement('canvas');
			canvas.width = 50;
			canvas.height = 50;
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = '#F0B0C0';
			ctx.fillRect(0, 0, 50, 50);
			var imd = g.ImageData(canvas);
			var rc = imd.getR();
			var gc = imd.getG();
			var bc = imd.getB();
			rc.getImage(function (img) {
				test.show('Channel R', img);
			});
			gc.getImage(function (img) {
				test.show('Channel G', img);
			});
			bc.getImage(function (img) {
				test.show('Channel B', img);
			});
			test.pass(function () {
				return ((rc.getPixels().every(function (p) {
					return (p.r === 0xf0 && p.g === 0x00 && p.b === 0x00);
				})) && (gc.getPixels().every(function (p) {
						return (p.r === 0x00 && p.g === 0xb0 && p.b === 0x00);
					})) && (bc.getPixels().every(function (p) {
						return (p.r === 0x00 && p.g === 0x00 && p.b === 0xc0);
					})));
			});
		}]
		,
		['g.ImageData.prototype.copy & paste', function (test) {
			var imd1 = g.ImageData(ctx);
			var canvas = document.createElement('canvas');
			canvas.width = 300;
			canvas.height = 300;
			var ctx2 = canvas.getContext('2d');
			ctx2.fillStyle = '#F0B0C0';
			ctx2.fillRect(0, 0, 300, 300);
			var imd2 = g.ImageData(ctx2);
			var clip = imd1.copy(35, 71, 100, 200);
			imd2.paste(clip, 19, 36, 21, 31);
			imd2.getImage(function (img) {
				test.show('Copy & Paste', img);
				test.pass(function () {
					return (img instanceof Image);
				});
			});
		}]
		);
}