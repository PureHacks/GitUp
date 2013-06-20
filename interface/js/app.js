chrome.app.runtime.onLaunched.addListener(function(launchData) {
	chrome.app.window.create('../app/index.html', {
		bounds: {
			width: 400,
			height: 200
		},
		minWidth: 400,
		minHeight: 200
	});
});

SmartAss = function(){
	
	var self = this,
		statusColors = { sitting : "#CC3333", active : "#39b54b" },
		statusLabel = $("#current-status"),
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
		//var data = [['elapsed',10],['remaining',50]];
		var data = [['stats',100]];
		
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
					dataLabels: 'value'
				}
			}
		};
		
		lifeStats = $.jqplot("life-stats", [data], lifeStatsOptions);
		updateStatusUI("sitting");
	};
	
	self.updateStatus = function(){		
		// need to be getting new data here
		// we use random seed for now
		var randomSeed = Math.floor((Math.random()*10)+1);	// 1 - 10
		if (randomSeed >= 5) {
			// active
			if (lifeStatsOptions.seriesColors[0] !== statusColors.active) {
				updateStatusUI("active");
				lifeStatsOptions.seriesColors = [statusColors.active];
				lifeStats.replot(lifeStatsOptions);
			}
		} else {
			// sitting
			if (lifeStatsOptions.seriesColors[0] !== statusColors.sitting) {
				updateStatusUI("sitting");
				lifeStatsOptions.seriesColors = [statusColors.sitting];				
				lifeStats.replot(lifeStatsOptions);
			}
		}
	};
};

$(document).ready( function(){
	var app = new SmartAss();
		app.showLifeStatus();
		
	setInterval( function(){
			app.updateStatus();
		}, 3000);
});