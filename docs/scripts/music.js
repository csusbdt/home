function c_music(audio_element) {
	this.audio_element = audio_element;
	this.start_set = [];
	this.stop_set  = [];

/*
	audio_element.addEventListener('ended', () => {
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
	});
	audio_element.addEventListener('error', () => {
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
	});
	//audio_element.load();
	*/
}

c_music.prototype.starts = window.starts;
c_music.prototype.stops  = window.stops;

c_music.prototype.start = function() {
	this.audio_element = new Audio();
	this.audio_element.src = "music/say_it_isnt_so.mp3";
	this.audio_element.addEventListener('ended', () => {
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
	});
	this.audio_element.addEventListener('error', () => {
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
	});


	this.audio_element.play();
};

c_music.prototype.stop = function() {
	this.audio_element.pause();
};

const music = function(audio_element) {
	return new c_music(audio_element);
};

export default music;
