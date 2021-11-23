function c_sound(audio_element) {
	this.audio_element = audio_element;
	this.playing = false;
	this.broken = false;
	this.start_set = [];
	this.stop_set  = [];
	audio_element.addEventListener('ended', () => {
		this.playing = false;
	});
	audio_element.addEventListener('error', () => {
		this.broken = true;
	});
	audio_element.load();
}

c_sound.prototype.starts = function(...os) {
	os.forEach(o => this.start_set.push(o));
	return this;
};

c_sound.prototype.stops = function(...os) {
	os.forEach(o => this.stop_set.push(o));
	return this;
};

c_sound.prototype.start = function() {
	if (this.broken || this.playing) {
		stop(this.stop_set);   // ???
		start(this.start_set); // ???
	} else {
		this.playing = true;
		this.audio_element.play();
		setTimeout(() => {
			stop(this.stop_set);
			start(this.start_set);
		}, this.audio_element.duration * 1000 + 120);
	}
};

const sound = function(audio_element) {
	return new c_sound(audio_element);
};
