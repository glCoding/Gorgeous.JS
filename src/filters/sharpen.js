(function (g) {

	g.register('Sharpen', [
		-1, -1, -1,
		-1, 9, -1,
		-1, -1, -1
	]);

	g.register('Excessive Sharpen', [
		1, 1, 1,
		1, -7, 1,
		1, 1, 1
	]);

	g.register('Emboss', [
		-1, -1, 0,
		-1, 0, 1,
		0, 1, 1
	], 1, 128);

} (gorgeous));