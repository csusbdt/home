import             "./scripts/main.js"  ;
import frames from "./scripts/frame.js" ;
import loop   from "./scripts/loop.js"  ;
import once   from "./scripts/once.js"  ;
import circle from './scripts/circle.js';
import rect   from './scripts/rect.js'  ;
import touch  from "./scripts/touch.js" ;
import music  from "./scripts/music.js" ;
import sfx    from "./scripts/sfx.js"   ;

const say_it = music(m_say_it);

const thud = sfx("sfx/thud_0.966.mp3");
const tick = sfx("sfx/tick_0.157.mp3");
const blop = sfx("sfx/blop_0.264.mp3");

//const start_loop_frames = frames([i_start_0]);
const music_loop_frames = frames([i_music_0]);

//const start_closing_frames = frames([i_start_1, i_start_2, i_start_3], .088);
const music_closing_frames = frames([i_music_1, i_music_2], .088);

//const start_loop = loop(start_loop_frames, 10);
const music_loop = loop(music_loop_frames, 10);

//const start_closing = once(start_closing_frames, 10);
const music_closing = once(music_closing_frames, 10);

//const touch_start    = touch(circle(643, 368, 308));
//const touch_start_bg = touch(rect(0, 0, 1280, 720));

const touch_music    = touch(circle(169, 143, 47));
const touch_music_bg = touch(rect(0, 0, 1280, 720));



touch_start.stops(start_loop).starts(start_closing, blop);
start_closing.starts(touch_music, touch_bg);

//const start_view = [touch_start, touch_start_bg, start_loop];
const main_view  = [touch_music, touch_music_bg, music_loop];
const play_view  = [touch_play, touch_play_exit, touch_play_bg, play_loop, play_exit_loop];

touch_no_start.starts(touch_no_start, touch_start, thud);

touch_music.stops(music_loop).starts(music_closing, blop);
music_closing.starts(say_it);

touch_bg.starts(touch_bg, thud);

start_loop.start();
touch_start.start();    
touch_bg.starts(thud);

//say_it.starts(start_loop);
