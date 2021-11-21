const default_spf   = 1 / 8; // default seconds per frame
window.dirty = true;  // to redraw canvas

let design_width     = 1280;  // design width
let design_height     = 720;   // design height

// function set_design_size(w, h) {
// 	design_width = w;
// 	design_height = h;
// 	adjust_canvas();
// }

const ctx = a_canvas.getContext('2d', { alpha: false });
let scale = 1;
let left  = 0;
let top   = 0;

function adjust_canvas() {
	let w = window.innerWidth;
	let h = window.innerHeight;
	
	// Set canvas size.
	scale = Math.min(1, w / design_width, h / design_height);
	a_canvas.width  = scale * design_width;
	a_canvas.height = scale * design_height;

	// Center canvas in browser window.
	left = (w  - a_canvas.width ) / 2;
	top  = (h - a_canvas.height) / 2;
	a_canvas.style.left = left;
	a_canvas.style.top  = top;

	// Set drawing context transform to scale 
    // design coordinates to display coordinates.
	ctx.setTransform(scale, 0, 0, scale, 0, 0);
	dirty = true;
}

adjust_canvas();

window.addEventListener('resize', adjust_canvas);

// Convert mouse event coords to design coords.
const design_coords = e => {
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
	a_canvas.style.cursor = 'default';
};

const mousedown = e => {
	e.preventDefault();
	e.stopImmediatePropagation();
	a_canvas.style.cursor = 'default';
	on_touch(design_coords(e));
};

// the following touchend and touchmove code needed for fullscreen on chrome
// see: https://stackoverflow.com/questions/42945378/full-screen-event-on-touch-not-working-on-chrome/42948120

const touchend = e => {
	e.preventDefault();
	e.stopImmediatePropagation();
	a_canvas.style.cursor = 'none';
	on_touch(design_coords(e.changedTouches[0]));
};

const touchmove = e => {
	e.preventDefault();
}

a_canvas.addEventListener('mousemove', mousemove, true);
a_canvas.addEventListener('mousedown', mousedown, true); 
a_canvas.addEventListener('touchend' , touchend , true); 
a_canvas.addEventListener('touchmove', touchmove, { passive: false }); 

window.add_touchable = function(o) {
	if (touchables.includes(o)) return;
	touchables.push(o);
};

// const unshift_touchable = function(o) {
// 	touchables.unshift(o);
// };

window.add_drawable = function(o) {
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

window.add_updatable = function(o) {
	if (updatables.includes(o)) return;
	updatables.push(o);
};

window.clear_touchables = function() {
	touchables.length = 0;
};

// const clear_drawables = function() {
// 	drawables.length = 0;
// 	dirty = true;
// };

// const clear_updatables = function() {
// 	updatables.length = 0;
// };

window.remove_touchable = function(o) {
	const i = touchables.indexOf(o);
	if (i !== -1) {
		touchables.splice(i, 1);
	}
};

window.remove_drawable = function(o) {
	const i = drawables.indexOf(o);
	if (i !== -1) {
		drawables.splice(i, 1);
		dirty = true;
	}
};

window.remove_updatable = function(o) {
	const i = updatables.indexOf(o);
	if (i !== -1) {
		updatables.splice(i, 1);
	}
};

let previous_time = new Date().getTime() / 1000;

function animation_loop() {
	const current_time = new Date().getTime() / 1000;
	if (dirty) {
//		if (typeof(g_bg) === 'undefined') {
			//ctx.fillStyle = 'rgba(0, 0, 0)';
			ctx.fillStyle = 'rgba(0, 0, 0, 0)';
			ctx.fillRect(0, 0, design_width, design_height);
//		} else {
//			ctx.drawImage(g_bg, 0, 0);
//		}
		drawables.forEach(o => o.draw(ctx));
		dirty = false;
	}
	let dt = current_time - previous_time;
	updatables.slice().forEach(o => o.update(dt));
	previous_time = current_time;
	requestAnimationFrame(animation_loop);
}

addEventListener('load', () => {
	requestAnimationFrame(animation_loop);
});
