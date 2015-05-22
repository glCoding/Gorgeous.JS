/**
 * Serialize callback chain. It will wrap next method as a callback to previous one.
 * Every method should call its callback to continue the chain.
 * 
 * @param {Array.<function (..., callback)>} methods: contains callback chain as an Array.
 * 	|--@arg {function (err, ...)} callback
 * @param {function} finalHandler: handle errors and as the final callback.
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

/**
 * Create a test frame for a test task and execute the tests.
 * 
 * @param {Array.<string, function>} arg: Array for [{string}description, {function (tools)}test] pairs.
 * @param {string} arg[0]: description for corresponding test.
 * @param {function (tools)} arg[1]: function contains the test operations.
 * 	|---@arg {Object} tools: contains tools for test.
 */
var Test = function () {
	var args = arguments;
	var total = arguments.length,
		running = arguments.length,
		passed = 0,
		error = 0;

	var resultDiv = document.createElement('div');
	resultDiv.className = 'result';
	document.body.appendChild(resultDiv);

	var progressSpan = document.createElement('span');
	progressSpan.className = 'progress';
	resultDiv.appendChild(progressSpan);
	progressChange();
	
	(function () {
		var i = 0;
		chunk();

		function chunk() {
			if (i >= args.length) {
				return;
			}
			process();
			setTimeout(chunk, 100);
			i++;
		}

		function process() {
			if (args[i][1] && args[i][1] instanceof Function) {
				//Top test Div
				var testDiv = document.createElement('div');
				testDiv.className = 'test running';
				document.body.appendChild(testDiv);

				//test description
				var t = document.createElement('h2');
				t.innerHTML = (i + 1) + '. ' + args[i][0];
				testDiv.appendChild(t);
				
				//execute test operations
				args[i][1](toolsGenerator(testDiv));
			} else {
				throw new Error('arguments[' + i + '][1] should be a function.');
			}
		}
	} ());

	function progressChange() {
		progressSpan.innerHTML = 'total: ' + total + '; running: '
		+ running + '; passed: ' + passed + '; error: '
		+ error + '.';
		if (passed === total) {
			resultDiv.className = 'result passed';
		} else if (error !== 0) {
			resultDiv.className = 'result error';
		}
	}

	function toolsGenerator(testDiv) {
		var passCalled = false;

		var tools = {};
		
		/**
		 * log description to test frame and other parameters will
		 * be logged to console.
		 * 
		 * @param {string} description
		 */
		tools.log = function (description) {
			var p = document.createElement('p');
			p.className = 'log';
			p.innerHTML = 'LOG: ' + description;
			testDiv.appendChild(p);
			console.log(description);
			for (var i = 1; i < arguments.length; i++) {
				console.log(arguments[i]);
			}
		};

		/**
		 * show a figure with its description.
		 * 
		 * @param {string} description
		 * @param {Image} figure
		 */
		tools.show = function (description, figure) {
			var showDiv = document.createElement('div');
			showDiv.className = 'show';
			testDiv.appendChild(showDiv);
			if (description instanceof Image) {
				showDiv.appendChild(description);
				return;
			}
			var span = document.createElement('span');
			span.innerHTML = description;
			showDiv.appendChild(span);
			showDiv.appendChild(figure);
		};
	
		/**
		 * make sure if a test passed.
		 * 
		 * @param {boolean} condition
 		 */
		tools.pass = function (condition) {
			if (!passCalled) {
				if (condition instanceof Function) {
					condition = condition();
				}
				if (condition) {
					testDiv.className = 'test passed';
					passed += 1;
				} else {
					testDiv.className = 'test error';
					error += 1;
				}
				running -= 1;
				progressChange();
			} else {
				throw new Error('pass() can only called once in a test.');
			}
		};

		return tools;
	}
};
