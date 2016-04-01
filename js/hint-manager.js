var hint_manager_builder = function(){

	var hints = [];
	var currentHint = 0;
	var hintCount = 0;
	var hintRequested = false;

	return {
		hintRequested: hintRequested,
		hint: hints,
		currentHint: currentHint,
		hintCount: hintCount,
		resetHintRequested: function(){
			this.hintRequested = false;
		},
		getHintCount: function(){
			return this.hintCount;
		},
		getHint: function(){
			if(!this.hintRequested){
				this.hintCount++;
				if(this.hints){
					var hint = this.hints[this.currentHint];
					if(this.currentHint < this.hints.length-1){
						// If it's up to the penultimate hint, increment counter
						this.currentHint++;
					}
					this.hintRequested = true;
					return hint;
				} else {
					return "There are no hints for the current step. Why not check the manual?";
				}
			} else {
				return "You have to at least try something before asking for another hint!";
			}
		},
		setHints: function(hints){
			this.currentHint = 0;
			this.hints = hints;
		}

	}

};

var hint_manager = hint_manager_builder();