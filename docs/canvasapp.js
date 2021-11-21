import { get_state, save_state, get_page, get_page_state, set_page_state, init_score, get_score, get_solved, set_solved } from './state.js';

//#region utility functions

const log = function(...args) {
	args.forEach(arg => console.log(arg));
};

function stop_stop_sets(...stop_sets) {
	stop_sets.forEach(stop_set => {
		stop_set.forEach(o => o.stop())
	});
}

function start_start_sets(...start_sets) {
	start_sets.forEach(start_set => {
		start_set.forEach(o => {
			if (typeof(o) === 'function') {
				o();
			} else if ('play' in o) {
				o.play();
			} else {
				o.start();
			}
		});
	});
}

//#endregion

//#region circle

function c_circle(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
}

c_circle.prototype.inside = function(x, y) {
	return (this.x - x) * (this.x - x) + (this.y - y) * (this.y - y) < this.r * this.r;
};

const circle = function(x, y, r) {
	return new c_circle(x, y, r);
};

//#endregion

//#region rect

function c_rect(left, top, right, bottom) {
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
}

c_rect.prototype.inside = function(x, y) {
	return x >= this.left && x < this.right && y >= this.top && y < this.bottom;
};

c_rect.prototype.center = function() {
	return { 
		x: (this.left + this.right) / 2, 
		y: (this.top + this.bottom) / 2 
	};
};

const rect = function(left, top, right, bottom) {
	return new c_rect(left, top, right, bottom);
};

//#endregion

//#region frame

function c_frame(image, duration = 1/8, x = 0, y = 0) {
	this.image = image;
	this.duration = duration;
	this.x = x;
	this.y = y;
}

c_frame.prototype.draw = function(ctx, dx = 0, dy = 0) {
	ctx.drawImage(
		this.image, 
		0, 
		0, 
		this.image.width, 
		this.image.height, 
		this.x + dx, 
		this.y + dy, 
		this.image.width, 
		this.image.height);
};

const frame = function(image, duration = 1/8, x = 0, y = 0) {
	return new c_frame(image, duration, x, y);
};

const frames = function(images, duration = 1/8, x = 0, y = 0) {
	if (!Array.isArray(images)) {
		return [new c_frame(images, duration, x, y)];
	} else {
		return images.map(image => new c_frame(image, duration, x, y));
	}
};

//#endregion

//#region delay

function c_delay(t) {
	this.t = t;
	this.start_set = [];
	this.stop_set  = [];
	this.elapsed_time = 0;
}

c_delay.prototype.starts = function(...os) {
	os.forEach(o => this.start_set.push(o));
	return this;
};

c_delay.prototype.stops = function(...os) {
	os.forEach(o => this.stop_set.push(o));
	return this;
};

c_delay.prototype.start = function() {
	this.elapsed_time = 0;
	add_updatable(this);
};

c_delay.prototype.update = function(dt) {
	this.elapsed_time += dt;
	if (this.elapsed_time > this.t) {
		remove_updatable(this);
		stop_stop_sets(this.stop_set);
		start_start_sets(this.start_set);
	}
};

const delay = function(t) {
	return new c_delay(t);
};

//#endregion

//#region once

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

//#endregion

//#region loop

function c_loop(frames, z_index = 10, dx = 0, dy = 0) {
	this.frames = frames;
	this.z_index = z_index;
	this.dx = dx;
	this.dy = dy;
}

c_loop.prototype.set_dx = function(dx) {
	this.dx = dx;
	dirty = true;
	return this;
}

c_loop.prototype.set_dy = function(dy) {
	this.dy = dy;
	dirty = true;
	return this;
}

c_loop.prototype.start = function() {
	this.frame_index  = 0;
	this.elapsed_time = 0;
	add_drawable(this);
	add_updatable(this);
};

c_loop.prototype.stop = function() {
	remove_drawable(this);
	remove_updatable(this);
};

c_loop.prototype.started = function() {
	return drawables.includes(this);
};

c_loop.prototype.draw = function(ctx) {
	this.frames[this.frame_index].draw(ctx, this.dx, this.dy);
};

c_loop.prototype.update = function(dt) {
	if (this.frames.length === 1) {
		// ensure an initial draw after start
		if (this.elapsed_time === 0) {
			this.elapsed_time = dt;
			dirty = true;
		}
		return;
	}
	this.elapsed_time += dt;
	if (this.elapsed_time > this.frames[this.frame_index].duration) {
		this.elapsed_time = 0;
		++this.frame_index;
		dirty = true;
		if (this.frame_index === this.frames.length) {
			this.frame_index = 0;
		}
	}
};

const loop = function(frames, z_index = 10, dx = 0, dy = 0) {
	if (Array.isArray(frames)) {
		return new c_loop(frames, z_index, dx, dy);
	} else {
		return new c_loop([frames], z_index, dx, dy);
	}
};

//#endregion

//#region touch

function c_touch(shapes, dx, dy) {
	this.shapes = shapes;
	this.dx = dx;
	this.dy = dy;
	this.independent = false;
	this.start_set = [];
	this.stop_set  = [];
}

c_touch.prototype.make_independent = function() {
	this.independent = true;
	return this;
}

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

c_touch.prototype.stop = function() {
	remove_touchable(this);
};

c_touch.prototype.start_first = function() {
	touchables.unshift(this);
}

c_touch.prototype.touch = function(x, y) {
	for (let i = 0; i < this.shapes.length; ++i) {
		if (this.shapes[i].inside(x - this.dx, y - this.dy)) {
			if (!this.independent) {
				touchables = touchables.filter(o => o.independent);
			}
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

//#endregion

//#region main

const g_spf   = 1 / 8; // default seconds per frame
let dirty = true;  // to redraw canvas

let g_w     = 1280;  // design width
let g_h     = 720;   // design height

function set_design_size(w, h) {
	g_w = w;
	g_h = h;
	adjust_canvas();
}

const ctx = g_canvas.getContext('2d', { alpha: false });
let scale = 1;
let left  = 0;
let top   = 0;

function adjust_canvas() {
	let w = window.innerWidth;
	let h = window.innerHeight;
	
	// Set canvas size.
	scale = Math.min(1, w / g_w, h / g_h);
	g_canvas.width  = scale * g_w;
	g_canvas.height = scale * g_h;

	// Center canvas in browser window.
	left = (w  - g_canvas.width ) / 2;
	top  = (h - g_canvas.height) / 2;
	g_canvas.style.left = left;
	g_canvas.style.top  = top;

	// Set drawing context transform to scale design coordinates 
	// (world coordinates) to display coordinates.
	ctx.setTransform(scale, 0, 0, scale, 0, 0);
	dirty = true;
}

adjust_canvas();

window.addEventListener('resize', adjust_canvas);

// Convert mouse event coords to game world coords.
const canvas_coords = e => {
	return {
		x: (e.pageX - left) / scale,
		y: (e.pageY - top ) / scale
	};
};

const drawables  = [];
const updatables = [];
let touchables   = [];

const on_touch = p => {
	for (let i = 0; i < touchables.length; ++i) {
		if (touchables[i].touch(p.x, p.y)) break;
	}	
};

const mousemove = e => {
	e.preventDefault();
	e.stopImmediatePropagation();
	g_canvas.style.cursor = 'default';
};

const mousedown = e => {
	e.preventDefault();
	e.stopImmediatePropagation();
	g_canvas.style.cursor = 'default';
	on_touch(canvas_coords(e));
};

// the following touchend and touchmove code needed for fullscreen on chrome
// see: https://stackoverflow.com/questions/42945378/full-screen-event-on-touch-not-working-on-chrome/42948120

const touchend = e => {
	e.preventDefault();
	e.stopImmediatePropagation();
	g_canvas.style.cursor = 'none';
	on_touch(canvas_coords(e.changedTouches[0]));
};

const touchmove = e => {
	e.preventDefault();
}

g_canvas.addEventListener('mousemove', mousemove, true);
g_canvas.addEventListener('mousedown', mousedown, true); 
g_canvas.addEventListener('touchend' , touchend , true); 
g_canvas.addEventListener('touchmove', touchmove, { passive: false }); 

const add_touchable = function(o) {
	if (touchables.includes(o)) return;
	touchables.push(o);
};

// const unshift_touchable = function(o) {
// 	touchables.unshift(o);
// };

const add_drawable = function(o) {
	if (!('z_index' in o)) throw new Error(o);
	if (drawables.includes(o)) return;
	dirty = true;
	for (let i = drawables.length; i > 0; --i) {
		if (o.z_index >= drawables[i - 1].z_index) {
			drawables.splice(i, 0, o);
			return;
		}
	}
	drawables.unshift(o);
};

const add_updatable = function(o) {
	if (updatables.includes(o)) return;
	updatables.push(o);
};

const clear_touchables = function() {
	touchables.length = 0;
};

// const clear_drawables = function() {
// 	drawables.length = 0;
// 	dirty = true;
// };

// const clear_updatables = function() {
// 	updatables.length = 0;
// };

const remove_touchable = function(o) {
	const i = touchables.indexOf(o);
	if (i !== -1) {
		touchables.splice(i, 1);
	}
};

const remove_drawable = function(o) {
	const i = drawables.indexOf(o);
	if (i !== -1) {
		drawables.splice(i, 1);
		dirty = true;
	}
};

const remove_updatable = function(o) {
	const i = updatables.indexOf(o);
	if (i !== -1) {
		updatables.splice(i, 1);
	}
};

let score_image = null;

const digit_images = [];
for (let i = 0; i < 6; ++i) {
	const digit_image = new Image();
	digit_image.src = '../images/hud/' + i + '.png';
	digit_images.push(digit_image);
}
const plus_image = new Image();
plus_image.src = '../images/hud/plus.png';

let previous_time = new Date().getTime() / 1000;

function animation_loop() {
	const current_time = new Date().getTime() / 1000;
	// if (audio_context === null) {
	// 	if (dirty) {
	// 		if (splash_image !== null) {
	// 			ctx.drawImage(splash_image, 0, 0);
	// 		}
	// 		dirty = false;
	// 	}
	// } else {
		if (dirty) {
			if (typeof(g_bg) === 'undefined') {
				ctx.fillStyle = 'rgba(0, 0, 0)';
				ctx.fillRect(0, 0, g_w, g_h);
			} else {
				ctx.drawImage(g_bg, 0, 0);
			}
			drawables.forEach(o => o.draw(ctx));
			// if (fullscreen_enabled() && !fullscreen_active()) {
			// 	if (fullscreen_image !== null) {
			// 		ctx.drawImage(fullscreen_image, 0, 0);
			// 	}
			// }
			if (score_image) {
				ctx.drawImage(score_image, 0, 0);
			}
			dirty = false;
		}
		let dt = current_time - previous_time;
		updatables.slice().forEach(o => o.update(dt));
//	}
	previous_time = current_time;
	requestAnimationFrame(animation_loop);
}

addEventListener('load', () => {
	const score = get_score();
	if (score < digit_images.length) {
		score_image = digit_images[score];
	} else {
		score_image = plus_image;
	}
	requestAnimationFrame(animation_loop);
});

//#endregion

//#region globals

function goto(next_page) {
	return delay(.001).starts(
		() => {
			const s = get_state();
			s.page = next_page;
			save_state();
			location.replace('../' + next_page);
		}		
	);
}

// do this after state is loaded or something else
// state is undefined here

//debugger;
// let back_page = get_page_state('back');
// if (back_page === false) {
// 	back_page = get_page();
// }
// const back_0 = new Image();
// const back_1 = new Image();
// const back_2 = new Image();
// const back_3 = new Image();
// back_0.src = '../images/back_0.png';
// back_1.src = '../images/back_1.png';
// back_2.src = '../images/back_2.png';
// back_3.src = '../images/back_3.png';
// const back = loop(frames(back_0), 1000);
// const back_once = once(frames([back_1, back_2, back_3]), 1000);
// const back_touch = touch(rect(568, 980, 668, 1080)).make_independent();
// back_touch.stops(back).starts(back_once);
// back_once.starts(goto(back_page));
// back.start();
// back_touch.start();

//#endregion

//#region exports

export default {
	log: log,
	set_design_size: set_design_size,
	goto: goto,
	get_state: get_state,
	save_state: save_state,
	get_page: get_page,
	get_page_state: get_page_state,
	set_page_state: set_page_state,
	init_score: init_score,
	get_solved: get_solved,
	set_solved: set_solved,
	stop_stop_sets: stop_stop_sets,
	start_start_sets: start_start_sets,
	circle: circle,
	rect: rect,
	frame: frame,
	frames: frames,
	delay: delay,
	once: once,
	loop: loop,
	touch: touch
}

//#endregion
