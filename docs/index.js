import             "./scripts/main.js"  ;
import frames from "./scripts/frame.js" ;
import loop   from "./scripts/loop.js"  ;
import once   from "./scripts/once.js"  ;
import circle from './scripts/circle.js';
import rect   from './scripts/rect.js'  ;
import touch  from "./scripts/touch.js" ;

const sfx_on_loop_frames     = frames([i_sfx_on_0 ]);
const sfx_off_loop_frames    = frames([i_sfx_off_0]);
const sfx_on_closing_frames  = frames([i_sfx_on_1 , i_sfx_on_2 ], .088);
const sfx_off_closing_frames = frames([i_sfx_off_1, i_sfx_off_2], .088);

const sfx_on_loop  = loop(sfx_on_loop_frames , 10);
const sfx_off_loop = loop(sfx_off_loop_frames, 10);

const sfx_on_closing  = once(sfx_on_closing_frames , 10);
const sfx_off_closing = once(sfx_off_closing_frames, 10);

const touch_sfx_on  = touch(circle(293, 350, 153));
const touch_sfx_off = touch(circle(854, 371, 161));
const touch_bg      = touch(rect(0, 0, 1280, 720));

touch_sfx_on.stops(sfx_on_loop).starts(sfx_on_closing);
sfx_on_closing.stops(sfx_off_loop).starts(touch_bg);

touch_sfx_off.stops(sfx_off_loop).starts(sfx_off_closing);
sfx_off_closing.stops(sfx_on_loop).starts(touch_bg);

touch_bg.starts(s_thud, touch_bg);

sfx_on_loop.start();
sfx_off_loop.start();
touch_sfx_on.start();
touch_sfx_off.start();
