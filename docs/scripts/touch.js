function c_touch(shapes, dx, dy) {
	this.shapes = shapes;
	this.dx = dx;
	this.dy = dy;
	this.start_set = [];
	this.stop_set  = [];
}


c_touch.prototype.starts = window.starts;
c_touch.prototype.stops  = window.stops;

c_touch.prototype.start = function() {
	add_touchable(this);
};

c_touch.prototype.stop = function() {
	remove_touchable(this);
};

c_touch.prototype.touch = function(x, y) {
	if (this.shapes === null) {
		clear_touchables();
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
		return true;
	}
	for (let i = 0; i < this.shapes.length; ++i) {
		if (this.shapes[i].inside(x - this.dx, y - this.dy)) {
			clear_touchables();
			stop_stop_sets(this.stop_set);
			start_start_sets(this.start_set);
			return true;
		}
	}
	return false;
};

const touch = function(shapes = null, dx = 0, dy = 0) {
	if (shapes === null) {
		return new c_touch(null, 0, 0);
	} else if (Array.isArray(shapes)) {
		return new c_touch(shapes, dx, dy);
	} else {
		return new c_touch([shapes], dx, dy);
	}
};

export default touch;
