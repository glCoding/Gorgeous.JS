(function (g) {

	g.registerFilter('Sharpen', [
		-1, -1, -1,
		-1, 9, -1,
		-1, -1, -1
	]);

	g.registerFilter('Excessive Sharpen', [
		1, 1, 1,
		1, -7, 1,
		1, 1, 1
	]);

	g.registerFilter('Emboss', [
		-1, -1, 0,
		-1, 0, 1,
		0, 1, 1
	], 1, 128);

} (gorgeous));