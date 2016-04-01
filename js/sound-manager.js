var playSound = function(sound){

	var player = document.getElementById("audio-player");
	player.src = "sounds/" + sound + ".m4a";
	player.play();
};