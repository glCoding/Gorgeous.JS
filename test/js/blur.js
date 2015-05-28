//Test:Blur Test
var g = gorgeous;

var src = 'img/horsesnoise.png';
var tip = document.createElement('h3');
tip.innerHTML = 'Loading horsenoise image, please wait...';
document.body.appendChild(tip);
g.loadImage(src, function (img) {
	tip.innerHTML = 'Baboon image loaded.';
	Test(
		['Blur', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			console.time('use kernel');
			var filter = 'Blur';
			imd.useFilter(filter).getImage(function (img) {
				test.show(filter, img);
				test.pass(img instanceof Image);
			});
			console.timeEnd('use kernel');
		}],
		['Gaussian Blur', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			console.time('use kernel');
			var filter = 'Gaussian Blur';
			imd.useFilter(filter).getImage(function (img) {
				test.show(filter, img);
				test.pass(img instanceof Image);
			});
			console.timeEnd('use kernel');
		}],
		['Middle', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			console.time('use kernel');
			var filter = 'Middle';
			imd.useFilter(filter, 5, 2).getImage(function (img) {
				test.show(filter, img);
				test.pass(img instanceof Image);
			});
			console.timeEnd('use kernel');
		}],
		['Mosaic', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			console.time('use kernel');
			var filter = 'Mosaic';
			imd.useFilter(filter).getImage(function (img) {
				test.show(filter, img);
				test.pass(img instanceof Image);
			});
			console.timeEnd('use kernel');
		}]
		);
});
