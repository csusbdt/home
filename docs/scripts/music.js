function c_music(audio_element) {
	this.audio_element = audio_element;
	//this.playing = false;
	//this.broken = false;
	this.start_set = [];
	this.stop_set  = [];
	audio_element.addEventListener('ended', () => {
		//this.playing = false;
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
	});
	audio_element.addEventListener('error', () => {
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
		//this.broken = true;
	});
	audio_element.load();
}

c_music.prototype.starts = function(...os) {
	os.forEach(o => this.start_set.push(o));
	return this;
};

c_music.prototype.stops = function(...os) {
	os.forEach(o => this.stop_set.push(o));
	return this;
};

c_music.prototype.start = function() {
//	if (this.broken || this.playing) {
//		return;
//	}
//	this.playing = true;
	this.audio_element.play();
	// setTimeout(() => {
	// 	stop_stop_set(this.stop_set);
	// 	start_start_set(this.start_set);
	// }, this.audio_element.duration * 1000 + 120);
};

c_music.prototype.stop = function() {
	this.audio_element.pause();
};

const music = function(audio_element) {
	return new c_music(audio_element);
};

export default music;
