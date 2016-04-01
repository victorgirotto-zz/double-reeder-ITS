
var measure_manager_builder = function(){

	var bottomTip = {
		bottom: "Bottom",
		top: "Tip",
		measure: 76,
		canChange: true
	};

	var clipSize = 0;

	var tip = 0;
	var heart = 0;
	var back = 0;

	var scrape_tip = 0;
	var scrape_heart = 0;
	var scrape_back = 0;

	return {
		measurements: {
			bottomTip: bottomTip
		},
		clipSize: clipSize,
		tip: tip,
		heart: heart,
		back: back,
		scrape_tip: scrape_tip, 
		scrape_heart: scrape_heart,
		scrape_back: scrape_back,
		areMeasuresSet: function(){
			return this.tip !== 0 && this.heart !== 0 && this.back !== 0;
		},
		increase: function(part){
			if(this[part] !== undefined && this[part] < 1){
				this[part] += 0.05;
			}
			return this[part]
		},
		isReedPlayable: function(){
			return this.scrape_tip != 0;
		},
		getTuning: function(absolute){
			var tune = this.clipSize - 0.5;
			var offset = 0.1;
			if(absolute){
				if(tune < 0 - offset){
					return -1;
				} else if(tune > 0 + offset){
					return 1;
				} else {
					return 0;				
				}
			} else {
				return tune;
			}
		},
		getResistance: function(absolute){
			var resistance = this.scrape_tip - 0.5;
			var offset = 0.1;
			if(absolute){
				if(resistance < 0 - offset){
					// Too resistant
					return -1;
				} else if(resistance > 0 + offset){
					// Too soft
					return 1;
				} else {
					// Perfect
					return 0;				
				}
			} else {
				return resistance;
			}
		},
		getTipSize: function(){
			return map(this.tip, 58, 0, 400);
		},
		getHeartSize: function(){	
			return map(this.heart, 73, 0, 400);
		},
		getBackSize: function(){
			return map(this.back, 208, 0, 400);
		},
	};
	
}; // initializing manager

var measure_manager = measure_manager_builder();