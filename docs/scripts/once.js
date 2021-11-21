function c_once(frames, z_index = 100, dx = 0, dy = 0) {
	this.frames = frames;
	this.z_index = z_index;
	this.dx = dx;
	this.dy = dy;
	this.start_set = [];
	this.stop_set  = [];
}

c_once.prototype.set_dx = function(dx) {
	this.dx = dx;
	dirty = true;
	return this;
}

c_once.prototype.set_dy = function(dy) {
	this.dy = dy;
	dirty = true;
	return this;
}

c_once.prototype.starts = function(...os) {
	os.forEach(o => {
		this.start_set.push(o);
	});
	return this;
};

c_once.prototype.stops = function(...os) {
	os.forEach(o => this.stop_set.push(o));
	return this;
};

c_once.prototype.started = function() {
	return drawables.includes(this);
};

c_once.prototype.start = function() {
	this.frame_index = 0;
	this.elapsed_time = 0;
	add_drawable(this);
	add_updatable(this);
};

c_once.prototype.draw = function(ctx) {
	this.frames[this.frame_index].draw(ctx, this.dx, this.dy);
};

c_once.prototype.update = function(dt) {
	this.elapsed_time += dt;
	if (this.elapsed_time > this.frames[this.frame_index].duration) {
		this.elapsed_time = 0;
		++this.frame_index;
		dirty = true;
		if (this.frame_index === this.frames.length) {
			this.frame_index = 0;
			remove_drawable(this);
			remove_updatable(this);
			stop_stop_sets(this.stop_set);
			start_start_sets(this.start_set);
		}
	}
};

const once = function(frames, z_index = 10, dx = 0, dy = 0) {
	if (Array.isArray(frames)) {
		return new c_once(frames, z_index, dx, dy);
	} else {
		return new c_once([frames], z_index, dx, dy);
	}
};

export default once;
