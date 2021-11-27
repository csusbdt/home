import             "./scripts/main.js"  ;
import frames from "./scripts/frame.js" ;
import loop   from "./scripts/loop.js"  ;
import once   from "./scripts/once.js"  ;
import circle from './scripts/circle.js';
//import rect   from './scripts/rect.js'  ;
import touch  from "./scripts/touch.js" ;
import music  from "./scripts/music.js" ;
import sfx    from "./scripts/sfx.js"   ;

const say_it = music(m_say_it);

const thud = sfx("sfx/thud_0.966.mp3");
const tick = sfx("sfx/tick_0.157.mp3");
const blop = sfx("sfx/blop_0.264.mp3");

//document.body.style.backgroundColor = "rgb(135, 181, 174)";

const play_loop_frames  = frames([i_play_0 ], 1, -150, 0);
const pause_loop_frames = frames([i_pause_0], 1,  150, 0);

const play_closing_frames  = frames([i_play_1 , i_play_2 ], .08, -150, 0);
const pause_closing_frames = frames([i_pause_1, i_pause_2], .08,  150, 0);

const play_opening_frames  = play_closing_frames.slice().reverse();
const pause_opening_frames = pause_closing_frames.slice().reverse();

const play_loop   = loop(play_loop_frames , 10);
const pause_loop  = loop(pause_loop_frames, 10);

const play_closing  = once(play_closing_frames , 10);
const pause_closing = once(pause_closing_frames, 10);

const play_opening  = once(play_opening_frames , 10);
const pause_opening = once(pause_opening_frames, 10);

const play_touch      = touch(circle(608, 327, 110), -150, 0);
const play_bg_touch   = touch();

const pause_touch     = touch(circle(620, 316, 126), 150, 0);
const pause_bg_touch  = touch();

const play_view  = [play_loop , play_touch , play_bg_touch ];
const pause_view = [pause_loop, pause_touch, pause_bg_touch];

play_touch.stops(play_loop).starts(blop, play_closing);
play_closing.starts(say_it, pause_opening);
pause_opening.starts(pause_view);

pause_touch.stops(say_it, pause_loop).starts(blop, pause_closing);
pause_closing.starts(play_opening);
play_opening.starts(play_view);

play_bg_touch.starts(thud, play_view);
pause_bg_touch.starts(thud, pause_view);

say_it.stops(pause_view).starts(pause_closing);

start_start_sets(play_view);

/*

const play_exit_touch   = touch(rect(409, 423, 845, 594));
const pause_exit_touch  = touch(rect(409, 423, 845, 594));
const resume_touch      = touch(rect(85, 87, 561, 272));
const reset_touch       = touch(circle(956, 187, 189));
const resume_exit_touch = touch(rect(409, 423, 845, 594));

const music_view  = [music_touch, music_bg_touch, music_loop];
const play_view   = [play_touch, play_exit_touch, play_bg_touch, play_loop, exit_loop];
const pause_view  = [pause_touch, pause_exit_touch, pause_bg_touch, pause_loop, exit_loop];
const resume_view = [resume_touch, reset_touch, resume_exit_touch, resume_bg_touch, resume_loop, reset_loop, exit_loop];

function music_handler() {
    if (say_it.media_element.paused) {
        if (say_it.media_element.currentTime === 0) {
            start_start_sets(play_view);
        } else {
            start_start_sets(resume_view);
        }
    } else {
        start_start_sets(pause_view);
    }
}

music_touch.stops(music_loop).starts(blop, music_closing);
music_closing.starts(music_handler);
music_bg_touch.starts(thud, music_view);

play_touch.stops(play_loop).starts(blop, play_closing);
play_closing.starts(pause_view);
play_bg_touch.starts(thud, play_view);
play_exit_touch.stops(play_loop).starts(blop, play_exit_closing);
play_exit_closing.stops(exit_loop).starts(music_view);

pause_touch.stops(pause_loop).starts(blop, pause_closing);
pause_closing.starts(resume_view);
pause_bg_touch.starts(thud, pause_view);
pause_exit_touch.stops(pause_loop).starts(blop, pause_exit_closing);
pause_exit_closing.stops(exit_loop, pause_loop).starts(music_view);

resume_touch.stops(resume_loop).starts(blop, resume_closing);
resume_closing.starts(pause_view);
resume_bg_touch.starts(thud, resume_view);
resume_exit_touch.stops(exit_loop).starts(blop, resume_exit_closing);
resume_exit_closing.stops(resume_loop, reset_loop).starts(music_view);
reset_touch.stops(reset_loop).starts(blop, reset_closing);
reset_closing.stops(resume_loop, exit_loop).starts(play_view);


touch_music.stops(music_loop).starts(music_closing, blop);
music_closing.starts(say_it);

music_bg_touch.starts(music_bg_touch, thud);

start_loop.start();
touch_start.start();    
touch_bg.starts(thud);

//say_it.starts(start_loop);
*/
