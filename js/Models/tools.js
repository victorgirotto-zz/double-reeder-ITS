"use strict";

/*
 Dependency: reed.js
 */

var m_tools = function(){

	var scrapeKnife = {
		name: "scraping knife",
		id: "scrapeKnife",
		image: "img/tools/scrape_knife.gif",
		dropActions: function(){
			var parent = this;
			return {
				thinEnds: function(){
					if(isOnWorkbench("easel")){
						m_materials.cane.areEndsThinned = true;
						messageToUser("The ends have been thinned...");
					} else {
						messageToUser("You didn't use the right surface! The reed broke!");
						// break reed
						breakReed();
					}
				},
				prepareForCut: function(){
					if(isReedTied()){
						// Cane is ready to be prepared for cutting
						m_materials.cane.isPreparedForCut = true;
						messageToUser("The cane is ready for being cut");
					} else {
						messageToUser("The reed is not ready for that");
					}
					
				},
				scrape: function(){
					if(isReedTied() && m_materials.cane.isCut){
						// Start scrape mode
						openScrapeMode();
					} else {
						messageToUser("The reed is not ready for scraping yet!");
					}
				}
			};
		}
	};

	var cutKnife = {
		name: "cutting knife",
		id: "cutKnife",
		image: "img/tools/cut_knife.png"
	};

	var cutBlock = {
		name: "Cutting Block",
		id: "cutBlock",
		image: "img/tools/cut_block.png",
		addToWorkbench: function(){
			// Setting water visibility
			setVisibleInWorkbench(this.id, true);
		},
		userActions: function(){
			// The functions in the return statement will be publicly accessible
			var parent = this;
			return {
				removeFromWorkbench: function(){
					setVisibleInWorkbench(parent.id, false);
				}
			};
		}
	};

	var mandrel = {
		name: "mandrel",
		id: "mandrel",
		image: "img/tools/mandrel.png",
		userActions: function(){
			// The functions in the return statement will be publicly accessible
			var parent = this;
			return{
				removeFromWorkbench: function(){
					setVisibleInWorkbench(parent.id, false);
				}
			};
		}
	};

	var shaper = {
		name: "shaper",
		id: "shaper",
		image: "img/tools/shaper.png"
	};

	var easel = {
		name: "easel",
		id: "easel",
		image: "img/tools/easel.png",
		userActions: function(){
			// The functions in the return statement will be publicly accessible
			var parent = this;
			return {
				removeFromWorkbench: function(){
					setVisibleInWorkbench(parent.id, false);
				}
			};
		},
		drop: function(object){
			if(object.id === "cane"){
				// Switch cane to shaped
				changeState("cane", "shaped");
				// Adding cane to workbench
				addToWorkbench(object.id, true);
			} else {
				// There's no response for this drop
				messageToUser("Nothing to do here");
			}
		}	
	};

	var plaque = {
		name: "plaque",
		id: "plaque",
		image: "img/tools/plaque.png",
		userActions: function(){
			// The functions in the return statement will be publicly accessible
			var parent = this;
			return {
				removeFromWorkbench: function(){
					setVisibleInWorkbench(parent.id, false);
				}
			};
		}
	};

	return {
		scrapeKnife: scrapeKnife,
		cutKnife: cutKnife,
		cutBlock: cutBlock,
		mandrel: mandrel,
		shaper: shaper,
		easel: easel,
		plaque: plaque
	};
}(); // Executing function
