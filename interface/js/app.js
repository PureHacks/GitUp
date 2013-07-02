chrome.app.runtime.onLaunched.addListener(function(launchData) {
	chrome.app.window.create('../app/index.html', {
		bounds: {
			width: 650,
			height: 600
		},
		minWidth: 650,
		minHeight: 600
	});
});

SmartAss = function(){
	
	var self = this,
		statusColors = { sitting : "#CC3333", active : "#39b54b" },
		statusLabel = $("#current-status"),
		sitting = 0,
		timer = null,
		data = [['elapsed',0],['remaining',60]],
		lifeStats,
		lifeStatsOptions = {},
		INTERVAL = 3000,	// update every 5 seconds	
		localization = {
			en : {
				status_label_sitting : "You are sitting on yo ass!",
				status_label_active : "You have got up and about!"
			}
		};
	
	var updateStatusUI = function(status){
		if (status === "active" && !statusLabel.hasClass("active")){
			statusLabel.removeClass();
			statusLabel.addClass("active");
			statusLabel.html(localization.en.status_label_active);
		}

		if (status === "sitting" && !statusLabel.hasClass("sitting")){
			statusLabel.removeClass();
			statusLabel.addClass("sitting");
			statusLabel.html(localization.en.status_label_sitting);
		}
	};
	
	self.showLifeStatus = function(params){		
		
		lifeStatsOptions = {
			seriesColors: [statusColors.sitting],
			seriesDefaults: {
				// make this a donut chart.
				renderer:$.jqplot.DonutRenderer,
				rendererOptions:{
					// Donut's can be cut into slices like pies.
					sliceMargin: 0,
					// Pies and donuts can start at any arbitrary angle.
					startAngle: -90,
					showDataLabels: false,
					// By default, data labels show the percentage of the donut/pie.
					// You can show the data 'value' or data 'label' instead.
					dataLabels: 'value',
					animate: true,
					animateReplot: true
				}
			}
		};
		
		lifeStats = $.jqplot("life-stats", [data], lifeStatsOptions);
		updateStatusUI("sitting");
	};
	
	self.updateStatus = function(_active){		
		// need to be getting new data here
		// we use random seed for now
		//var randomSeed = Math.floor((Math.random()*10)+1);	// 1 - 10
		sitting = _active; //upate global state

		if (_active == 1) {			
			// active
			$("#log").html("active");
			if (lifeStatsOptions.seriesColors[0] !== statusColors.active) {
				updateStatusUI("active");				
			}
		} else {			
			// sitting
			$("#log").html("sitting");
			if (lifeStatsOptions.seriesColors[0] !== statusColors.sitting) {
				updateStatusUI("sitting");				
			}
		}

		//lifeStatsOptions.seriesColors = [statusColors.active];
		//lifeStats.replot(lifeStatsOptions);
		animate();

	};

	var animate = function() {	

		timer = window.clearInterval(timer);

		timer = window.setInterval( function() {			
			var elapsed, remaining;

			if (sitting == 1) {
				elapsed = data[0][1] >= 60 ? 60 : data[0][1] + 1;				
			} else {
				elapsed = data[0][1] <= 0 ? 0 : data[0][1] - 1;				
			}
			
			remaining = 60 - elapsed;

			data[0][1] = elapsed;
			data[1][1] = remaining;

			//lifeStatsOptions.seriesColors[0].data = data;

			lifeStats.series[0].data = data;
			lifeStats.replot({resetAxes:true});			
			lifeStats.redraw();

			$("#log1").html(elapsed);

		},1000);
	}
};
var app = new SmartAss();
$(document).ready( function(){
	
		app.showLifeStatus();

	var socket = io.connect('http://10.102.24.162:8080/');
		socket.on('arduino', function (data) {
			//console.log(data);		  	
			if (data) {
				app.updateStatus(data.value);
		  	}
		});		
	
});