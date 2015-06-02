//Test:Blur Test
var g = gorgeous;

var src = 'img/horsesnoise.png';
//var src = 'img/math.png';
var tip = document.createElement('h3');
tip.innerHTML = 'Loading horsenoise image, please wait...';
document.body.appendChild(tip);
g.loadImage(src, function (img) {
	tip.innerHTML = 'Horsenoise image loaded.';
	Test(
		['Blur', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			var filter = 'Blur';
			console.time(filter);
			imd.use(filter).getImage(function (img) {
				test.show(filter, img);
				test.pass(img instanceof Image);
			});
			console.timeEnd(filter);
		}],
		['Gaussian Blur', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			var filter = 'Gaussian Blur';
			console.time(filter);
			imd.use(filter, 6, 4).getImage(function (img) {
				test.show(filter, img);
				test.pass(img instanceof Image);
			});
			console.timeEnd(filter);
		}],
		['Median', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			var filter = 'Median';
			console.time(filter);
			imd.use(filter, 10).getImage(function (img) {
				test.show(filter, img);
				test.pass(img instanceof Image);
			});
			console.timeEnd(filter);
		}],
		['Mosaic', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			var filter = 'Mosaic';
			console.time(filter);
			imd.use(filter).getImage(function (img) {
				test.show(filter, img);
				test.pass(img instanceof Image);
			});
			console.timeEnd(filter);
		}],
		['Horizontal Motion Blur', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			var filter = 'Horizontal Motion Blur';
			console.time(filter);
			imd.use(filter, 10).getImage(function (img) {
				test.show(filter, img);
				test.pass(img instanceof Image);
			});
			console.timeEnd(filter);
		}],
		['Vertical Motion Blur', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			var filter = 'Vertical Motion Blur';
			console.time(filter);
			imd.use(filter, 10).getImage(function (img) {
				test.show(filter, img);
				test.pass(img instanceof Image);
			});
			console.timeEnd(filter);
		}]
		);
});
