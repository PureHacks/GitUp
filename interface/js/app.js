chrome.app.runtime.onLaunched.addListener(function(launchData) {
	chrome.app.window.create('../app/index.html', {
		bounds: {
			width: 450,
			height: 450
		},
		minWidth: 450,
		minHeight: 450
	});
});

/*
var SmartAss = {
		statusColors : { green : "#00933B", yellow : "#F2B50F", red: "#F90101" },
		statusLabel : $("#current-status"),
		life : 5,
		sitting : false,
		timer : null,
		recoveredTime : 10, //5400
		recoveryInterval : 18,  // will recover 18x faster than dying
		data : [['elapsed',recoveredTime],['remaining',0]],
		lifeStats : {},
		lifeStatsOptions : {},
		INTERVAL : 3000,	// update every 5 seconds
		comments : [["Congrats, you're smarter than you look.", "Hey, welcome back. Don't get too comfortable...", "Not exactly going for the world record, are we?",	"Did you miss me?"],[]]
};
*/
SmartAss = function() {

	var self = this,
		statusColors = {
			green: "#4EB96E",
			yellow: "#EFC319",
			red: "#E64C3B",
			blue: "#49677F"
		},
		statusLabel = $("#current-status"),
		deaths = 0,
		sitting = false,
		timer = null,
		recoveredTime = 10, //5400
		recoveryInterval = 18,
		/* will recover 18x faster than dying*/
		data = [
			['elapsed', recoveredTime],
			['remaining', 0]
		],
		lifeStats,
		lifeStatsOptions = {},
		INTERVAL = 3000, // update every 5 seconds	
		localization = {
			en: {
				status_label_sitting: "You are sitting on yo ass!",
				status_label_active: "You have got up and about!"
			}
		};

	var updateStatusUI = function(status) {
		if (status === "active" && !statusLabel.hasClass("active")) {
			statusLabel.removeClass();
			statusLabel.addClass("active");
			statusLabel.html(localization.en.status_label_active);
		}

		if (status === "sitting" && !statusLabel.hasClass("sitting")) {
			statusLabel.removeClass();
			statusLabel.addClass("sitting");
			statusLabel.html(localization.en.status_label_sitting);
		}
	};
	var comments = [];

	comments[0] = ["Congrats, you're smarter than you look.", "Hey, welcome back. Don't get too comfortable...", "Not exactly going for the world record, are we?", "Did you miss me?"];
	comments[1] = ["Oh, my aching bolts. 30 minutes and counting...", "At this rate, you might want to invest in a mattress.", "Ok, I think its time for a walk. I promise I won't go anywhere.", "You just lost a life. What is this, a game to you?", "Y U NO GET UP???", "I wasn't designed for this."];


	var setDonutColor = function(_color) {
		if (lifeStats.series[0].seriesColors[0] != _color) {
			lifeStats.series[0].seriesColors[0] = _color;
			chrome.app.window.current().focus();

			var index = sitting ? 1 : 0,
				comment,
				notifyOptions = {},
				random;

			random = Math.random();
			comment = comments[index][Math.floor((random * comments[index].length) + 0)];

			notifyOptions = {
				type: "basic",
				title: "SmartAss Notification",
				message: comment,
				iconUrl: chrome.runtime.getURL("/img/icon-128.png")
			};


			chrome.notifications.create("id" + random, notifyOptions, function() {
				console.info("Notification: " + comment);
			});
		}
	};


	self.showLifeStatus = function(params) {

		lifeStatsOptions = {
			grid: {
				background: "transparent",
				borderColor: "none",
				shadow: false
			},
			seriesColors: [statusColors.green, statusColors.blue],
			seriesDefaults: {
				// make this a donut chart.
				renderer: $.jqplot.DonutRenderer,
				rendererOptions: {
					sliceMargin: 0,
					startAngle: -90,
					showDataLabels: false,
					dataLabels: 'value',
					animate: true,
					animateReplot: true,
					highlightMouseOver: false,
					shadowDepth: 0,
					thickness: 50,
					padding: 0
				}
			}
		};

		lifeStats = $.jqplot("life-chart", [data], lifeStatsOptions);
		updateStatusUI("sitting");
	};

	self.updateStatus = function(_sitting) {

		sitting = _sitting;

		timer = window.clearInterval(timer);

		timer = window.setInterval(function() {
			var elapsed, remaining;

			if (sitting) { //currently not sitting
				elapsed = data[0][1] <= 0 ? 0 : data[0][1] - 1;
			} else {
				elapsed = data[0][1] >= recoveredTime ? recoveredTime : data[0][1] + recoveryInterval;
			}

			remaining = recoveredTime - elapsed;

			data[0][1] = elapsed;
			data[1][1] = remaining;

			if (elapsed <= (recoveredTime * 0.33)) {
				setDonutColor(statusColors.red);
			} else if (elapsed <= (recoveredTime * 0.66)) {
				setDonutColor(statusColors.yellow);
			} else {
				setDonutColor(statusColors.green);
			}

			lifeStats.series[0].data = data;
			lifeStats.replot({
				resetAxes: true
			});
			lifeStats.redraw();

			if (elapsed === 0) {
				if (deaths >= 4) {
					timer = window.clearInterval(timer);
					$(".hearts").attr("class","hearts lost-" + deaths);
					return false;
				} else {
					deaths += 1;
					data = [
						['elapsed', recoveredTime],
						['remaining', 0]
					];

					$(".hearts").attr("class","hearts lost-" + deaths);
				}
			}

		}, 1000);

	};

};

var app = new SmartAss();

$(document).ready(function() {

	app.showLifeStatus();
	/*
	var socket = io.connect('http://smartass.khoaski.com/');

		socket.on('chair', function (data) {
			//console.log(data);		  	
			if (data) {
				app.updateStatus(data.value);
		  	}
		});*/
	//test code

	$("#sitting").on("click", function() {
		app.updateStatus(1);
	});

	$("#active").on("click", function() {
		app.updateStatus(0);
	});

});