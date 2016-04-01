"use strict";

/*
 Dependencies:
 - Global variables: m_tools, m_materials, m_actions.
 */

$(function(){

	// Reseting the workbench and reed state
	sm_loadState(sm_states, 0);

	// Load the three toolbars
	loadToolbar(m_tools, "#tools", undefined, "menubox-link");
	loadToolbar(m_materials, "#materials", undefined, "menubox-link");
	loadToolbar(m_actions, "#actions", setExecuteAction, "menubox-link");
	// Load the scrape mode toolbar
	loadToolbar(m_scrapeMode.tools, "#scrape-toolbar", setExecuteAction, "");

	// Load the user actions menu for the placeholders
	loadUserActionMenu($(".placeholder"));

	// Set the draggables
	$("#tools a, #materials a").draggable({ 
		revert: true,
		helper: "clone",
		appendTo: "body" 
	});

	// Set the workbench as droppable
	$(".droppable").droppable({
		drop: handleDrop,
		greedy: true,
		activeClass: "active-droppable",
		hoverClass: "hover-droppable"
	});

	$("#scrape-reed > div").resizable({
			handles: "s",
			grid: [0, 15],
			minHeight: 28,
			maxHeight: 370,
			containment: "parent"
		})

	// Set the listeners
	$(".dismiss-window").click(function(){
		$("#overlay").fadeOut("fast");
	});

	// Setting the click listeners for the three main menu buttons
	$("#free-roam").click(function(){
		$("#overlay").fadeOut("fast");
	});

	$("#time-pressure").click(function(){
		$("#timer").show();
		$("#overlay").fadeOut("fast");
		var interval = countDown(
			5,
			function(time){
				$("#timer").text(time);
			},
			function(){
				stopCurrentInterval();
				// Finish problem
				doneWithProblem();
			}
		);
		// For later stopping
		setIntervalId(interval);
	});

	$("#debug").click(function(){
		// Load a random problem
		sm_loadRandomBugState();
		messageToUser("Something is not right with this reed. You have to fix it!");
	});

	// Setting the listener to close the scrape panel
	$("#scrape-close").click(function(){
		closeScrapeMode();
	});

	// Setting the listener to close the review panel
	$("#dismiss-results").click(function(){
		// Reset everything
		resetWorkbench();
		// Open welcome window
		openWelcomeWindow();
	});

	// Open welcome window
	openWelcomeWindow();

});


/*
 Loads the user action menu for each placeholder
 */
var  loadUserActionMenu = function(placeholders){
	placeholders.each(function(i){
		var placeholder = placeholders[i];
		var placeholderUl = $("#" + $(placeholder).attr('id') + " ul");
		// Getting the id from the element
		var id = removePlaceholderPrefix($(placeholder).attr('id'));
		// I am trying to load each placeholder with the content from their userActions property
		var object = m_materials[id] || m_tools[id];
		// Checking if there is such an object
		if(object !== undefined && object.userActions !== undefined){
			// There is such an object
			var actions = object.userActions();
			// Iterating over each action
			for(var action in actions){
				// Extracting action from array
				var actionFn = actions[action];
				// Creating elements
				var li = $("<li/>")
				var a = $("<a/>", {
					href: "#",
					text: camelcaseToCapital(action)
				});
				// Setting click listener
				a.click(actionFn);
				// Adding link to list item
				li.append(a);
				// Adding list item to list
				placeholderUl.append(li);
				placeholderUl.removeClass("inactive");
			}
		}
	});
}

/*
 Adds a click listener to the actions
 - link: jquery "a" object
 - object: actions object (from m_actions)
 */
var setExecuteAction = function(link, object){
	link.click(function(){
		// Calling action
		object.action();
	});
}

/*
 Handles the event of when an element is dropped into another
 */
var handleDrop = function(event, ui){
	// Getting the object IDs
	var draggableId = ui.draggable.attr("id");
	var droppableId = removePlaceholderPrefix(event.target.id);

	// Getting the objects
	var draggableObject = m_materials[draggableId] || m_tools[draggableId]; // Getting either the material or tool that was droped
	var droppableObject = m_materials[droppableId] 							// Getting the material on to which is was dropped

	// if(draggableObject && draggableObject.dropActions){
	// 	// There is a list of actions for selections. Display it.
	// 	displayDropActionList(draggableObject.dropActions());
	// } else 
	if(droppableObject && droppableObject.drop){
		// There is a drop handler. Execute it.
		droppableObject.drop(draggableObject);
	}

	// reporting the action to the state manager
	reportAction("drop", draggableId, droppableId);
};

/*
 Loads a list of models into a ul/ol container
 - modelList: contains the list of models. Each model must contain the attributes: name, image.
 - topContainer: jquery selector for the container (ul)
 */
var loadToolbar = function(modelList, topContainer, addLinkEvents, linkClass){
	for(var i in modelList){
		// Check if model shuold be displayed
		if(!modelList[i].isPrivate){
			// Adding the model to the container
			addIconToList(modelList[i], topContainer + " ul", addLinkEvents, linkClass);
		}
	}
};

/*
 Adds an object to a list (either materials, tools or actions). 
 - object: must contain the attributes: name, image.
 - list: should be a ul/ol jquery selector string.
 */
var addIconToList = function(object, list, addLinkEvents, linkClass){
	var listContainer = $(list),
		listItem = $("<li/>"),
		listImage = $("<img/>", {
			src: object.image
		}),
		listLink = $("<a/>", {
			text: object.name,
			href: "#",
			class: linkClass,
			id: object.id
		});

	// Adding the image to the link before the text
	listLink.prepend(listImage);
	// Adding the link to the list item
	listItem.append(listLink);
	// Adding the lit item to the container
	listContainer.append(listItem);

	// Add the events
	if(addLinkEvents !== undefined){
		addLinkEvents(listLink, object);	
	}
	
};