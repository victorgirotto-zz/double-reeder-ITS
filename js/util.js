var intervalId = undefined;

var setIntervalId = function(id){
	intervalId = id;
}

var stopCurrentInterval = function(){
	if(intervalId){
		window.clearInterval(intervalId);
	}
}

var setVisibleInWorkbench = function(objectId, visible){
	var id = "#ph_" + objectId; 
	var idScrape = "#scrape-" + objectId + "-large";
	var selector = id + "," + idScrape;
	if(visible){
		$(selector).fadeIn("fast");
	} else {
		$(selector).fadeOut("fast");
	}
};

var isReedTied = function(){
	// Checking if thread is visible
	return $("#ph_thread").is(":visible");
};

var isReedLeaking = function(){
	return m_materials.cane.isLeaking || m_materials.thread.isLeaking;
}

var changeState = function(objectId, newState){
	var id = "#ph_" + objectId;
	$(id).attr("class", "droppable placeholder " + newState);
};

var isOnWorkbench = function(objectId){
	if(objectId.substring(0,1) === "*"){
		// Element is optional, so it doesn't matter
		return true;
	}
	// Checking if an object is currently on the workbench
	return $("#ph_" + objectId).is(":visible");
};

var clearWorkbench = function(){
	$(".placeholder").hide();
	$("#timer").empty().hide();
};

// Resets the workbench
var resetWorkbench = function(){
	// Reseting models
	m_materials = m_materials_builder();
	measure_manager = measure_manager_builder();
	m_scrapeMode = m_scrapeMode_builder();
	hint_manager = hint_manager_builder();
	// Reseting GUI
	closeScrapeMode();
	clearWorkbench();
	// Stop timer, if any
	stopCurrentInterval
};

var breakReed = function(){
	// Cleaning workbench
	sm_loadState(sm_states, 0);
}

var clipTip = function(){
	// Updating the model
	measure_manager.clipSize = measure_manager.increase("clipSize");
	// Obtaining the reed html element
	var reed = $("#scrape-reed");
	// Updating the GUI. It will take the current height and subtract 44 (total clip size) * the current clip size
	reed.animate({
		"height": getClipHeight(measure_manager.clipSize) + "px"
	});
}

var getClipHeight = function(size){
	return (400 - (size * 44));
}

var scrape = function(part){
	measure_manager.increase("scrape_" + part);
	var part = $("#scrape-" + part).css("opacity", measure_manager["scrape_" + part]);
}

var getRandomTrueFalse = function(){
	return Math.random() < 0.7 ? false : true;
};

var map = function(value, ideal, min, max){
	var finalValue;
	// Calculating
	if(value === ideal){
		return 0.5;
	} else if(value < ideal) {
		finalValue = (value * (50 / (ideal -  min)));
	} else if(value > ideal){

		finalValue = 50 + ((value - ideal) * (50 / (max - ideal)));
	}
	// Constraining boundaries
	if(finalValue > 100){
		finalValue = 100;
	} else if(finalValue < 0) {
		finalValue = 0;
	}
	// returning value
	return finalValue / 100;
};

/*
	Displays the list of actions available to an object
 */
var displayDropActionList = function(actions){
	// Hiding the information window and showing dialog
	$(".window").hide();
	$("#dialog").show();
	// Building menu
	var list = $("<ul/>", {
		class: "actionList"
	});
	for(var action in actions){
		var listItem = $("<li/>");
		var listLink = $("<a/>", {
			href: "#",
			class: "button",
			text: camelcaseToCapital(action) 
		});
		// Adding action listener
		listLink.click(actions[action]);
		// Adding elements
		listItem.append(listLink);
		list.append(listItem);
	}
	// Displaying list and updating title
	$("#dialog p").html(list);
	$("#dialog h2").text("Choose an action");
	// Displaying popup
	$("#overlay").fadeIn("fast");
}

var getHtml = function(template, data){
	var source   = $("#" + template).html();
	var template = Handlebars.compile(source);
	return template(data);
};

var openScrapeMode = function(){
	// Hide other windows
	hideOverlay();
	// Open scrape mode
	$("#scrapeMode").fadeIn("fast");
};

var openHelpManual = function(){
	hideOverlay();
	$("#help-window").fadeIn("fast");
	// Displaying popup
	$("#overlay").fadeIn("fast");
}

var closeScrapeMode = function(){
	$("#scrapeMode").fadeOut("fast");	
}

var hideOverlay = function(){
	// Hiding the information window and showing dialog
	$(".window").fadeOut("fast");
	$("#overlay").fadeOut("fast");
}

/*
	Shows a message to the user
 */
var messageToUser = function(message){
	// Hiding the information window and showing dialog
	$(".window").hide();
	$("#dialog").show();
	// Updating dialog information
	$("#dialog h2").text("Message");
	$("#dialog p").text(message);
	// Showing the dialog
	$("#overlay").fadeIn("fast");
};

var getValueFromUser = function(message, submitFn){
	// Hiding the information window and showing dialog
	$(".window").hide();
	$("#submit-value-window").show();
	// Updating message
	$("#submit-value-window p").text(message);
	// Attaching event listener
	$("#submit-value-window a").one('click', function(){
		var value = $("#submit-value-window input").val();
		submitFn(value);
	});
	// Showing the dialog
	$("#overlay").fadeIn("fast");
}

var openReviewWindow = function(listHtml){
	$(".window").hide();
	$("#review-window ul").html(listHtml);
	$("#review-window").show();
	$("#overlay").fadeIn("fast");
};

var openWelcomeWindow = function(){
	$(".window").hide();
	$("#welcome").show();
	$("#overlay").fadeIn("fast");
};

var openWindow = function(title, html, listener){
	// Hiding the dialog and showing the window
	$(".window").hide();
	$("#info-window").show();
	// Showing the information window
	$("#info-window h2").text(title);
	$("#info-window div").html(html);
	$("#overlay").fadeIn("fast");
	// Check if there's a listener. If so, attach it.
	if(listener){
		$(listener.selector, "#info-window div").click(listener.fn);
	}
};

var camelcaseToCapital = function(str){
	// By Vincent Robert: http://stackoverflow.com/questions/4149276/javascript-camelcase-to-regular-form
	return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
};

var removePlaceholderPrefix = function(str){
	return str.replace("ph_","");
};

// By InfinitiesLoop, http://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

var countDown = function(max, updateFn, finishFn){
	var formatTime = function(minutes, seconds){
		return pad(minutes, 2) + ":" + pad(seconds, 2);
	};
	var seconds = 59;
	var minutes = max-1;
	updateFn(formatTime(minutes, seconds));
	var interval = window.setInterval(function(){
		if(!(minutes == 0 && seconds == 0)){
			seconds--;
			updateFn(formatTime(minutes, seconds));
			if(seconds === 0){
				if(minutes == 0){
					// Countdown ended
					finishFn();
				}
				seconds = 60;
				minutes--;
			}
		}
	}, 1000);
	return interval;
};

var doneWithProblem = function(){
	var data = {
			data:[
				{name: "Leak", value: isReedLeaking() ? "Yes" : "No", isNumber: false},
				{name: "Tuning", value: (measure_manager.getTuning() + 0.5) * 100, isNumber: true},
				{name: "Resistance", value: (measure_manager.getResistance() + 0.5) * 100, isNumber: true},
				{name: "Tip measurement", value: measure_manager.getTipSize() * 100, isNumber: true},
				{name: "Heart measurement", value: measure_manager.getHeartSize() * 100, isNumber: true},
				{name: "Back measurement", value: measure_manager.getBackSize() * 100, isNumber: true}
			]
		}; // createDataObject();
	var listHtml = getHtml("review-window-template", data);
	openReviewWindow(listHtml);
	// Stopping the interval
	stopCurrentInterval();
};