"use strict";

var m_scrapeMode_builder = function(){

	
	// PROPERTIES 

	
	var scrapeTip = {
		name: "scrape the tip",
		id: "scrape-tip-icon",
		image: "img/scrape-tools/tip.png",
		action: function(){
			if(isOnWorkbench("plaque")){
				// Scrape the tip
				scrape("tip");
			} else {
				// No plaque!
				messageToUser("You forgot the plaque! The reed broke!");
				breakReed();
			}
		}
	};

	var scrapeHeart = {
		name: "scrape the heart",
		id: "scrape-heart-icon",
		image: "img/scrape-tools/heart.png",
		action: function(){
			if(isOnWorkbench("plaque")){
				if(measure_manager.scrape_tip > 0){
					// Scrape the heart
					scrape("heart");
				} else {
					messageToUser("Don't get ahead of yourself! Is the tip scraped already?");
				}
			} else {
				// No plaque!
				messageToUser("You forgot the plaque! The reed broke!");
				breakReed();
			}
		}
	};

	var scrapeBack = {
		name: "scrape the back",
		id: "scrape-back-icon",
		image: "img/scrape-tools/back.png",
		action: function(){
			if(isOnWorkbench("plaque")){
				if(measure_manager.scrape_heart > 0){
					// Scrape the back
					scrape("back");
				} else {
					messageToUser("Don't get ahead of yourself! Start from the top down!");
				}
			} else {
				// No plaque
				messageToUser("You forgot the plaque! The reed broke!");
				breakReed();
			}
		}
	};

	var clip = {
		name: "clip edge",
		id: "scrape-clip-icon",
		image: "img/scrape-tools/clip.png",
		action: function(){
			if(!isOnWorkbench("plaque") && isOnWorkbench("cutBlock")){
				// Clips the tip a little bit
				if(measure_manager.clipSize < 1){
					clipTip();
				}
			} else {
				if(isOnWorkbench("plaque")){
					// The plaque is on
					messageToUser("You can't cut it with the plaque on!");
				} else if(!isOnWorkbench("cutBlock")){
					// No cutblock
					messageToUser("You can't cut the reed directly on the table! It was too expensive!");
				};
			}
			
		}
	};

	var plaque = {
		name: "toggle plaque",
		id: "scrape-plaque",
		image: "img/scrape-tools/plaque.png",
		action: function(){
			// Toggle plaque
			setVisibleInWorkbench("plaque", !isOnWorkbench("plaque"));
		}
	};

	var cutBlock = {
		name: "toggle cutting block",
		id: "scrape-cut-block",
		image: "img/scrape-tools/cutBlock.png",
		action: function(){
			// Toggle cutblock
			setVisibleInWorkbench("cutBlock", !isOnWorkbench("cutBlock"));
		}
	};

	var ruler = {
		name: "toggle ruler",
		id: "scrape-ruler",
		image: "img/scrape-tools/scrape-ruler.png",
		action: function(){
			// Toggle cutblock
			toggleElement("#scrape-ruler-large");
		}
	}

	var toggleElement = function(element){
		$(element).toggle("fast");
	}


	// INITIALIZATION
	// Initializing resizables
	$(":ui-resizable").resizable("destroy");

	$("#scrape-reed > div").addClass("scrape-area scrape-resizable")
						   .attr("style", "")
						   .height(28)
						   .html("Drag border to set size.<br/> Click to finish.");

	// Toggling the visibility of the tip
	$(".enabled").removeClass("enabled");
	$("#scrape-tip").addClass("enabled");

	// Enabling resizable behavior
	$("#scrape-reed > div:not(:ui-resizable)").resizable({
		handles: "s",
		grid: [0, 15],
		minHeight: 28,
		maxHeight: 370,
		containment: "parent"
	});

	$("#scrape-tip").unbind('click').one("click", function(){
		console.dir("abd");
		$("#scrape-tip").text("").toggleClass("scrape-resizable").resizable( "destroy" );
		$("#scrape-heart").show();
		// Set size in model
		measure_manager.tip = $("#scrape-tip").height();
	});

	$("#scrape-heart").unbind('click').one("click", function(){
		$("#scrape-heart").text("").toggleClass("scrape-resizable").resizable( "destroy" );
		$("#scrape-back").show();
		// Set size in model
		measure_manager.heart = $("#scrape-heart").height();
	});

	$("#scrape-back").unbind('click').one("click", function(){
		$("#scrape-back").text("").toggleClass("scrape-resizable").resizable( "destroy" );
		// Set size in model
		measure_manager.back = $("#scrape-back").height();
		// Reed is "scraped". Show scraping on workbench
		setVisibleInWorkbench("scrape", true);
	});
	


	// PUBLIC INTERFACE


	return {
		tools: {
			scrapeTip: scrapeTip,
			scrapeHeart: scrapeHeart,
			scrapeBack: scrapeBack,
			clip: clip,
			plaque: plaque,
			cutBlock: cutBlock,
			ruler: ruler
		},
		setMeasures: function(){
			$(".scrape-area").text("").toggleClass("scrape-resizable");
			$(".scrape-area").show();
			// Set size in model
			$("#scrape-tip").height(measure_manager.tip).css("opacity", measure_manager.scrape_tip);
			$("#scrape-heart").height(measure_manager.heart).css("opacity", measure_manager.scrape_heart);
			$("#scrape-back").height(measure_manager.back).css("opacity", measure_manager.scrape_back);
			$("#scrape-reed").height(getClipHeight(measure_manager.clipSize));
		}
	}

};

var m_scrapeMode;