chrome.app.runtime.onLaunched.addListener(function(launchData) {
	console.log("launched");
	chrome.app.window.create('../index.html', {
	id: "GitUpWidget",
	bounds: {
		width: 360,
		height: 480
	},
	minWidth: 360,
	minHeight: 480,
	singleton: true,
	frame: "none",
	resizable: false
	});
});

var GitUp = new function() {
	return {
	user: {}
	}
}

function displayInfoCallback(displayInfo) {
	console.log(displayInfo);
}

$(document).ready(function() {
	console.log("ready");
	$('#window-controls .btn-close').click(function() {
		chrome.app.window.current().hide();
		chrome.app.window.current().close();
		return false;
	});

	$('#window-controls .btn-minimize').click(function() {
		chrome.app.window.current().minimize();
	});

	//chrome.storage.local['user'] = '{"firstName": "Lucas", "email": "lucas@iowa.edu", "password": "abc123" }';
	GitUp.user = JSON.parse(chrome.storage.local["user"] || "{}");

	if (GitUp.user.firstName) {
		$("#home").show();
	}
	else {
		$("#register").show();
	}

	$(".btn-sign-in").click(function() {
		$("section.main").hide();
		$("#sign-in").show();
	});

	$(".btn-register").click(function() {
		$("section.main").hide();
		$("#register .step1").show();
		$("#register .step2").hide();
		$("#register").show();
	});

	$("#register .btn-next").click(function() {
		$("#register .step1").hide();
		$("#register .step2").show();
	});

});