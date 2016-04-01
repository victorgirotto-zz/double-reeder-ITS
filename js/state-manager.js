var sm_currentState = undefined;
var sm_currentStateIndex = -1;

var sm_loadRandomBugState = function(){
	var randomNumber = Math.floor((Math.random()*sm_debugStates.length));
	sm_loadState(sm_debugStates, randomNumber);
};

var sm_loadState = function(list, index){
	var state = list[index];
	// Reseting workbench
	resetWorkbench();
	// Setting cane, thread and measures state
	for(var i in state.cane){
		m_materials.cane[i] = state.cane[i];
	}
	for(var i in state.thread){
		m_materials.thread[i] = state.thread[i];
	}
	for(var i in state.measures){
		measure_manager[i] = state.measures[i];
	}
	// Changing cane class
	if(state.caneClass){
		changeState("cane", state.caneClass);
	}
	// Displaying workbench items
	for(var i in state.workbench){
		setVisibleInWorkbench(state.workbench[i], true);
	}

	if(measure_manager.areMeasuresSet()){
		m_scrapeMode.setMeasures();
	}
	sm_currentStateIndex = index;
	sm_currentState = state;

	// Loading hints
	hint_manager.setHints(sm_currentState.hints);
};

var sm_states = [
	{
		name: "initial",
		workbench: [],
		cane: {},
		hints: [
			"Is the cane ready?",
			"You need to shape the cane. But is it ready for that?",
			"The cane needs to be wet before it's shaped",
			"Drag the water into the workbench, then drag the cane into the water"
		],
		next: {
			action: "drop",
			draggable: "water",
			droppable: "workbench"
		}
	},
	{
		name: "waterOnWorkbench",
		workbench: ["water"],
		cane: {},
		hints: [
			"What should you put in the water?",
			"The cane seems a bit dry...",
			"Drag the cane into the water"
		],
		next: {
			action: "drop",
			draggable: "cane",
			droppable: "water"
		}
	},
	{
		name: "wetCane",
		workbench: ["*water"],
		cane: {
			isWet: true
		},
		hints: [
			"You need to add one of the materials to the workbench",
			"You need to shape one of the materials, so add it to the workbench",
			"Drag the cane into the workbench"
		],
		next: {
			action: "drop",
			draggable: "cane",
			droppable: "water"
		}
	},
	{
		name: "preTied",
		workbench: ["cane", "tube"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			areEndsThinned: true
		},
	},
	{
		name: "tied",
		workbench: ["cane", "thread", "tube"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			areEndsThinned: true
		}
	},
	{
		name: "preScrape",
		workbench: ["cane", "thread", "tube"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: false,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true
		}
	},
	{
		name: "perfect",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: false
		},
		thread: {
			isLeaking: false
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.5,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0.5
		}
	}
];

var sm_debugStates = [
	{
		name: "lowTuning",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: false
		},
		thread: {
			isLeaking: false
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.5,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0
		}
	},
	{
		name: "lowTuningThreadLeak",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: false
		},
		thread: {
			isLeaking: true
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.5,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0
		}
	},
	{
		name: "lowTuningCaneLeak",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: true
		},
		thread: {
			isLeaking: false
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.5,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0
		}
	},
	{
		name: "lowTuningDoubleLeak",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: true
		},
		thread: {
			isLeaking: true
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.5,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0
		}
	},
	{
		name: "tooResistant",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: false
		},
		thread: {
			isLeaking: false
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.05,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0.5
		}
	},
	{
		name: "tooResistantThreadLeak",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: false
		},
		thread: {
			isLeaking: true
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.05,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0.5
		}
	},
	{
		name: "tooResistantCaneLeak",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: false
		},
		thread: {
			isLeaking: false
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.05,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0.5
		}
	},
	{
		name: "tooResistantDoubleLeak",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: true
		},
		thread: {
			isLeaking: true
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.05,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0.5
		}
	},
	{
		name: "tooResistantlowTuning",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: false
		},
		thread: {
			isLeaking: false
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.05,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0
		}
	},
	{
		name: "tooResistantlowTuningThreadLeak",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: false
		},
		thread: {
			isLeaking: true
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.05,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0
		}
	},
	{
		name: "tooResistantlowTuningCaneLeak",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: true
		},
		thread: {
			isLeaking: false
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.05,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0
		}
	},
	{
		name: "tooResistantlowTuningDoubleLeak",
		workbench: ["cane", "thread", "tube", "scrape"],
		caneClass: "tied",
		cane: {
			isWet: true,
			isShaped: true,
			isScraped: true,
			isCut: true,
			isPreparedForCut: true,
			areEndsThinned: true,
			isLeaking: true
		},
		thread: {
			isLeaking: true
		},
		measures: {
			tip: 58,
			heart: 73,
			back: 208,
			scrape_tip: 0.05,
			scrape_heart: 0.5,
			scrape_back: 0.5,
			clipSize: 0
		}
	},
];

var reportAction = function(action, draggable, droppable){
	// Reseting the hint flag
	hint_manager.resetHintRequested();
	// Checking the next state
	if(sm_currentState.next){
		if(action === "drop"){
			if(sm_currentState.next.action === "drop" && 
			   sm_currentState.next.draggable === draggable && 
			   sm_currentState.next.droppable === droppable){
				// This actions matches a transition. Change state
				sm_currentStateIndex++;
				sm_currentState = sm_states[sm_currentStateIndex];
				// Loading hints
				hint_manager.setHints(sm_currentState.hints);
			}
		}
	}
}