"use strict";

/*
 Dependency: reed.js
 */

var m_actions = function(){
/*
<li>Leak: </li>
				<li>Tuning: </li>
				<li>Resistance: </li>
				<li>Total cost: </li>
				<li>Time: </li>
*/
	var done = {
		name: "done",
		image: "img/actions/done.png",
		action: function(){
			doneWithProblem();
		}
	};

	var restart = {
		name: "restart",
		image: "img/actions/restart.png",
		action: function(){
			// Reset workbench
			sm_loadState(sm_states, 0);
		}
	}

	var help = {
		name: "help",
		image: "img/actions/help.png",
		dropActions: function(){
			var parent = this;
			return {
				readManual: function(){
					openHelpManual();
				},
				getHint: function(){
					messageToUser(hint_manager.getHint());
				}
			};
		},
		action: function(){
			displayDropActionList(this.dropActions());
		}
	};

	var playC = {
		name: "play c",
		image: "img/actions/play-c.png",
		action: function(){
			// Play sound
			playSound("c");
		}
	}

	var playOboe = {
		name: "play with oboe",
		image: "img/actions/play_oboe.png",
		action: function(){
			// Test if reed is playable
			if(measure_manager.isReedPlayable()){
				// Reed is playable. Test tuning.
				var resistance = measure_manager.getResistance(true);
				if(resistance < 0){
					playSound("oboe-g-g-p");
					messageToUser("It's too resistant!");
				} else if(resistance > 0){
					playSound("oboe-g-g-m");
					messageToUser("It's too light!");
				} else {
					playSound("oboe-g-g-g");
					messageToUser("Ah, perfect!");
				}
			} else {
				// Reed is not playable. Warn user.
				messageToUser("The reed is not yet playable!");
			}
		}
	};

	var playCrow = {
		name: "play crow",
		image: "img/actions/play_crow.png",
		action: function(){
			// Test if reed is playable
			if(measure_manager.isReedPlayable()){
				// Reed is playable. Test tuning.
				var tuning = measure_manager.getTuning(true);
				if(tuning < 0){
					playSound("crow-m");
					messageToUser("It's a bit low");
				} else if(tuning > 0){
					playSound("crow-p");
					messageToUser("It's a bit high");
				} else {
					playSound("crow-g");
					messageToUser("Ah, perfect!");
				}
			} else {
				// Reed is not playable. Warn user.
				messageToUser("The reed is not yet playable!");
			}
		}
	};

	// var measure = {
	// 	name: "measure",
	// 	image: "img/actions/ruler.png",
	// 	action: function(){
	// 		var html = getHtml("measurements-window", measure_manager);
	// 		var listener = {
	// 			selector: ".button",
	// 			fn: function(){
	// 				getValueFromUser("What is the desired new measurement?", function(value){
	// 					measure_manager.measurements["bottomTip"].measure = value;
	// 				});
	// 			} 
	// 		};
	// 		openWindow("Measurements", html, listener);
	// 	}
	// };

	// var testTuning = {
	// 	name: "test tuning",
	// 	image: "img/actions/tuner.png",
	// 	action: function(){
	// 		// Test if reed is playable
	// 		if(measure_manager.isReedPlayable()){
	// 			// Reed is playable. Test tuning.
	// 			// TODO test tuning
	// 		} else {
	// 			// Reed is not playable. Warn user.
	// 			messageToUser("The reed is not yet playable!");
	// 		}
	// 	}
	// };

	var testLeak = {
		name: "test for leak",
		image: "img/actions/leak.png",
		action: function(){
			// Test if reed is already tied
			if(isReedTied()){
				if(isReedLeaking()){
					messageToUser("There is a leak somewhere!");
				} else {
					messageToUser("No leaks!");
				}
			} else {
				messageToUser("The reed is not tied yet! There's no point in testing for leaks!");
			}
		}
		
	};

	return {
		done: done,
		restart: restart,
		help: help,
		playC: playC,
		playOboe: playOboe,
		playCrow: playCrow,
		// measure: measure,
		// testTuning: testTuning,
		testLeak: testLeak
	};
}(); // Executing function
