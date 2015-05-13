/**
 * Serialize callback chain, it will call the first method and pass next
 * one as callback to previous one.
 * @param {Array} methods: contains callback chain as an Array. 
 */
var waterfall = function (methods, finalHandler) {
	var i = 0;
	function next(err) {
		if (err) {
			finalHandler(err);
		} else {
			++i;
			var args = Array.prototype.slice.call(arguments);
			if (i < methods.length) {
				args.shift();
				args.push(next);
				methods[i].apply(this, args);
			} else {
				finalHandler.apply(this, args);
			}
		}
	}
	methods[0](next);
};

var Test = (function () {
	var count = (function () {
		var counter = 0;
		return function () {
			return ++counter;
		};
	} ());

	return function (title, testOprations) {

		var testDiv = document.createElement('div');
		testDiv.className = 'test';
		document.body.appendChild(testDiv);

		var t = document.createElement('h2');
		t.innerHTML = count() + '. ' + title;
		testDiv.appendChild(t);

		var tools = {};
		
		tools.assert = function () {
			
		};
		
		tools.log = function (description) {
			var h = document.createElement('h3');
			h.className = 'log';
			h.innerHTML = 'LOG: ' + description;
			testDiv.appendChild(h);
			console.log(description);
			for (var i = 1; i < arguments.length; i++) {
				console.log(arguments[i]);
			}
		};

		tools.show = function (description, figure) {
			var showDiv = document.createElement('div');
			showDiv.className = 'show';
			testDiv.appendChild(showDiv);
			showDiv.appendChild(figure);
			var span = document.createElement('span');
			span.innerHTML = description;
			showDiv.appendChild(description);
		};
		
		testOprations(tools);
	};
} ());
