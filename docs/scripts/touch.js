function c_touch(shapes, dx, dy) {
	this.shapes = shapes;
	this.dx = dx;
	this.dy = dy;
//	this.independent = false;
	this.start_set = [];
	this.stop_set  = [];
}

// c_touch.prototype.make_independent = function() {
// 	this.independent = true;
// 	return this;
// }

c_touch.prototype.starts = function(...os) {
	os.forEach(o => this.start_set.push(o));
	return this;
};

c_touch.prototype.stops = function(...os) {
	os.forEach(o => this.stop_set.push(o));
	return this;
};

c_touch.prototype.start = function() {
	add_touchable(this);
};

// c_touch.prototype.stop = function() {
// 	remove_touchable(this);
// };

// c_touch.prototype.start_first = function() {
// 	touchables.unshift(this);
// }

c_touch.prototype.touch = function(x, y) {
	for (let i = 0; i < this.shapes.length; ++i) {
		if (this.shapes[i].inside(x - this.dx, y - this.dy)) {
//			if (!this.independent) {
//				touchables = touchables.filter(o => o.independent);
			clear_touchables();
			stop_stop_sets(this.stop_set);
			start_start_sets(this.start_set);
			return true;
		}
	}
	return false;
};

const touch = function(shapes, dx = 0, dy = 0) {
	if (Array.isArray(shapes)) {
		return new c_touch(shapes, dx, dy);
	} else {
		return new c_touch([shapes], dx, dy);
	}
};

export default touch;
