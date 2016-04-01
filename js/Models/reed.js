"use strict";

var m_reed = new function(){ // Instantiating reed

	this.tube = false;
	this.thread = false;
	this.cane = false;
	this.mandrel = false;

	this.isPlayable = function(){
		var hasTube = this.tube !== false;
		var hasThread = this.thread !== false;
		var hasPlayableCane = this.cane !== false && this.cane.isPlayable();
		return hasTube && hasThread && hasPlayableCane; 
	}

}(); // Executing function