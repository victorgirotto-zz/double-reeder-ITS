"use strict";

/*
 Dependency: reed.js
 */

var m_materials_builder = function(){

	var workbench = {
		name: "workbench",
		id: "workbench",
		isPrivate: true,
		drop: function(object){
			if(object.id === "thread"){
				// The thread can't be dropped on the workbench
				messageToUser("There is nothing to do with this!");
			} else if(object.id === "cane"){
				// Check if tube is already on workbench
				if(isOnWorkbench("tube")){
					// User should add the cane directly to tube
					messageToUser("It seems like you already have the tube on the workbench...");
				} else {
					// Add cane to workbench
					setVisibleInWorkbench(object.id, true);
				}
			} else if(object.id === "tube"){
				// Check if cane is already on workbench
				if(isOnWorkbench("cane")){
					// User should add the tube directly to cane
					messageToUser("It seems like you already have the cane on the workbench...");
				} else {
					// Add tube to workbench
					setVisibleInWorkbench(object.id, true);
				}
			} else if(object.id === "water"){
				// Add the water to the workbench
				object.addToWorkbench();
			} else if(object.id === "cutBlock"){
				object.addToWorkbench();
			}
		}
	};

	var cane = {
		name: "cane",
		id: "cane",
		image: "img/materials/gouged_cane.gif",
		isWet: false,
		isShaped: false,
		isScraped: false,
		isCut: false,
		isPreparedForCut: false,
		areEndsThinned: false,
		isLeaking: getRandomTrueFalse(),
		drop: function(object){
			if(object.id === "tube"){
				if(this.isShaped){
					// Change cane to folded image
					changeState("cane", "tied");
					// Add tube to workbench
					setVisibleInWorkbench("tube", true);
				} else {
					messageToUser("The cane is not shaped yet!");
				}
			} else if(object.id === "plaque"){
				// Check if the reed is cut
				if(this.isCut){
					// insert plaque
					setVisibleInWorkbench("plaque", true);
				} else {
					messageToUser("The reed is not ready for the plaque yet!");
				}
			} else if(object.id === "thread"){
				// Check if both tube and cane are on the workbench
				if(isOnWorkbench("tube") && isOnWorkbench("cane") && isOnWorkbench("mandrel") && cane.areEndsThinned){
					// adding thread to workbench
					setVisibleInWorkbench("thread", true);
					// Setting leak settings
					cane.isLeaking = getRandomTrueFalse();
					thread.isLeaking = getRandomTrueFalse();
				} else {
					if(!isOnWorkbench("mandrel")){
						// User needs the mandrel
						messageToUser("You can't grasp the reed well enough to tie it, so you dropped it and it broke.");
						// Break reed
						breakReed();
					} else if(!cane.areEndsThinned){
						messageToUser("The ends are not thinned!");
					}
				}
			} else if(object.id === "scrapeKnife"){
				// Showing actions
				displayDropActionList(object.dropActions());
			} else if(object.id === "cutKnife"){
				// Check if it's ready to cut
				if(isReedTied() && isOnWorkbench("cutBlock") && this.isPreparedForCut){
					// Cut
					this.isCut = true;
					messageToUser("The reed has been cut!");
				} else {
					if(!isOnWorkbench("cutBlock")){
						// User was missing the cutblock
						messageToUser("You cut on the wrong surface! The reed broke!");
						breakReed();
					} else if(!isReedTied()){
						// The reed wasn't tied
						messageToUser("You cut it before tying it! It's impossible to continue now.");
						breakReed();
					} else if(!this.isPreparedForCut){
						// The user didn't prepare the reed for cutting
						messageToUser("The reed wasn't ready! It broke!");
						breakReed();	
					}
					
				}
			} else if(object.id === "shaper"){
				if(!this.isShaped){
					if(this.isWet){
						// Changing the state
						this.isShaped = true;
						changeState(this.id, "shaped");
					} else {
						// The cane was dry
						messageToUser("The cane was dry. It broke!");
						// Break reed
						breakReed();
					}
				} else {
					messageToUser("The cane is already shaped!");
				}
			} else if(object.id === "easel"){
				if(cane.isShaped && !isReedTied()){
					// Switch cane to shaped
					changeState("cane", "shaped");
					// Add easel to workbench
					setVisibleInWorkbench("easel", true);
				} else {
					messageToUser("It seems like the reed isn't ready for the easel, yet...");
				}
			} else if(object.id === "plasticWrap"){
				if(isReedTied()){
					// Stop leak
					this.isLeaking = false;
					changeState("cane", "tied wrapped");
				}
			}
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

	var thread = {
		name: "thread",
		id: "thread",
		image: "img/materials/thread.png",
		isLeaking: getRandomTrueFalse(),
		drop: function(object){
			if(object.id === "plasticWrap"){
				// Stop leak
				this.isLeaking = false;
				changeState("thread", "wrapped");
			}
		}
	};

	var tube = {
		name: "tube",
		id: "tube",
		image: "img/materials/tube.png",
		drop: function(object){
			if(object.id === "cane"){
				if(object.isShaped){
					// Change cane to folded image
					changeState("cane", "tied");
					// Add cane to workbench
					setVisibleInWorkbench("cane", true);
				} else {
					messageToUser("The cane is not shaped yet!");
				}
			} else if(object.id === "thread"){
				// Check if both tube and cane are on the workbench
				if(isOnWorkbench("tube") && isOnWorkbench("cane") && isOnWorkbench("mandrel") && cane.areEndsThinned){
					// adding thread to workbench
					setVisibleInWorkbench("thread", true);
					// Setting leak settings
					cane.isLeaking = getRandomTrueFalse();
					thread.isLeaking = getRandomTrueFalse();
				} else {
					if(!isOnWorkbench("mandrel")){
						// User needs the mandrel
						messageToUser("You can't grasp the reed well enough to tie it! Maybe you're missing something...");
					} else if(!cane.areEndsThinned){
						messageToUser("The ends are not thinned!");
					}
				}
			} else if(object.id === "mandrel"){
				// Adding mandrel to workbench
				setVisibleInWorkbench("mandrel", true);
			} else {
				messageToUser("Nothing to do here!");
			}
		},
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

	var water = {
		name: "water",
		id: "water",
		image: "img/materials/water.png",
		drop: function(object){
			if(object.id === "cane"){
				// Making cane wet	
				object.isWet = true;
				// Letting the user know
				messageToUser("The cane is now wet!");
			} else {
				// Anything else
				messageToUser("Why would you want to get that wet?");
			}
		},
		addToWorkbench: function(){
			// Setting water visibility
			setVisibleInWorkbench(this.id, true);
		},
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

	var plasticWrap = {
		name: "plastic wrap",
		id: "plasticWrap",
		image: "img/materials/plastic_wrap.png"
	}

	// Seeting initial states
	// Cane
	changeState("cane", "gouged");

	return {
		workbench: workbench,
		cane: cane,
		thread: thread,
		tube: tube,
		water: water,
		plasticWrap: plasticWrap
	};
};

var m_materials;


