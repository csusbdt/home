import "./scripts/main.js" ;
import frames      from "./scripts/frame.js";
import loop        from "./scripts/loop.js" ;

window.log = function(...args) {
	args.forEach(arg => console.log(arg));
};

const ctx = a_canvas.getContext('2d', { alpha: false });

const sfx_on_loop_frames  = frames([i_sfx_on_0 ]);
const sfx_off_loop_frames = frames([i_sfx_off_0]);

//const sfx_on_closing_frames  = frames([i_sfx_on_1, i_sfx_on_2], .088);
//const sfx_off_closing_frames = frames([i_sfx_off_1, i_sfx_off_2], .088);

const sfx_on_loop  = loop(sfx_on_loop_frames , 10);
const sfx_off_loop = loop(sfx_off_loop_frames, 10);

//const blop     = sound(s_blop);
//const touch_bg = touch(rect(0, 0, 1280, 720));

//window.addEventListener('load', e => {
	//ctx.clearRect(0, 0, a_canvas.width, a_canvas.height);
	sfx_on_loop.start();
	sfx_off_loop.start();
//});
