import {CATALOG} from './1109_核心_v1.mjs';
const stroke='#66594d';
const wrap=(body,view='0 0 400 252',label='')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" fill="none" role="img" aria-label="${label}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
export function icon(name,size=22) {
 const paths={home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-8h6v8"/>',game:'<rect x="3" y="5" width="18" height="15" rx="5"/><path d="M7 11h5m-2.5-2.5v5"/><circle cx="16" cy="10" r=".8"/><circle cx="18" cy="14" r=".8"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="4"/><path d="M7 3v4m10-4v4M3 11h18m-14 5 3 2 5-4"/>',star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1Z"/>',settings:'<path d="m9 3-1 3-3 1-2 4 2 2v4l4 3 3-1 3 1 4-3v-4l2-2-2-4-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/>',back:'<path d="m14 5-7 7 7 7"/>',next:'<path d="m10 5 7 7-7 7"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',check:'<path d="m5 12 4 4L19 6"/>',flower:'<path d="M12 20v-7m0 4c-5 0-6-3-6-3s5-1 6 3m0 0c5 0 6-3 6-3s-5-1-6 3"/><path d="M9 7C5 5 7 1 10 3c2-4 6-2 5 1 4 0 5 5 1 6-1 4-6 4-7 0-4 0-4-5 0-3Z"/>',sound:'<path d="M4 9h4l5-4v14l-5-4H4Zm13-2c4 3 4 7 0 10m-1-7c1 1 1 3 0 4"/>',mute:'<path d="M4 9h4l5-4v14l-5-4H4Zm12 1 5 5m0-5-5 5"/>',zoom:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6M7 10h6m-3-3v6"/>',gift:'<path d="M3 10h18v5H3Zm2 5v6h14v-6M12 10v11m0-11C3 10 5 0 10 5l2 5Zm0 0c9 0 7-10 2-5l-2 5Z"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',heart:'<path d="M12 21C-4 10 3-3 12 6 21-3 28 10 12 21Z"/>',leaf:'<path d="M20 3C4 1-1 10 7 17 14 23 23 16 20 3ZM4 21 16 9"/>'};
 return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.flower}</svg>`;
}
function animal(type='bunny',x=0,y=0,scale=1,changed=false) {
 const fill=type==='bear'?'#d9b18a':type==='duck'?'#f5d478':'#fff9ef';
 const ears=type==='bunny'?'<ellipse cx="-13" cy="-34" rx="8" ry="23"/><ellipse cx="13" cy="-34" rx="8" ry="23"/><path d="M-13-48v25m26-25v25" stroke="#e8b8ae" stroke-width="4"/>':type==='cat'?'<path d="m-26-10 0-28 22 14m8 0 22-14v28"/>':type==='duck'?'': '<circle cx="-22" cy="-25" r="10"/><circle cx="22" cy="-25" r="10"/>';
 return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${fill}" stroke="${stroke}" stroke-width="2.2">${ears}<ellipse cy="31" rx="28" ry="30"/><ellipse rx="32" ry="28"/><ellipse cx="-17" cy="10" rx="7" ry="4" fill="#f3c3b8" stroke="none"/><ellipse cx="17" cy="10" rx="7" ry="4" fill="#f3c3b8" stroke="none"/><path d="M-11-2v3m22-3v3" stroke-width="3.5"/>${type==='duck'?'<path d="m-8 8 8-4 8 4-8 7Z" fill="#dc9b52"/>':'<path d="m-3 8 3 3 3-3m-3 3v4m-5-1q5 4 10 0" fill="none"/>'}<ellipse cx="-18" cy="55" rx="12" ry="7"/><ellipse cx="18" cy="55" rx="12" ry="7"/><path d="m-8 26 8 5-8 5Zm16 0-8 5 8 5Z" fill="${changed?'#acbdd9':'#d69790'}"/><circle cy="31" r="3" fill="#f8e6b9"/><path d="M-24 31q-8-4-8 5m56-5q8-4 8 5" fill="none"/></g>`;
}
function plant(type='sprout',x=0,y=0,scale=1,changed=false) {
 let leaves='<path d="M0 0v-29m0 16c-20 0-22-17-22-17S-2-31 0-13Zm0-5c20 0 22-17 22-17S2-36 0-18Z" fill="#9eb58d"/>';
 if(type==='flower') leaves=`<path d="M0 0v-27m0 16-14-8m14 2 13-9"/><g transform="translate(0 -32)" fill="${changed?'#b7c5e1':'#f3c565'}"><circle cy="-8" r="8"/><circle cx="8" r="8"/><circle cx="-8" r="8"/><circle cy="8" r="8"/><circle r="5" fill="#fff4d4"/></g>`;
 if(type==='cactus') leaves='<path d="M-8 1v-35a8 8 0 0 1 16 0v35m-16-8c-16 0-19-5-19-17v-7a5 5 0 0 1 10 0v9h9m16 9c16 0 19-5 19-17v-7a5 5 0 0 0-10 0v9H8" fill="#a6ba94"/><path d="M0-33v25" stroke="#718767"/>';
 if(type==='berry') leaves='<path d="M0 0v-30m0 9-15-11m15 7 15-12" stroke="#819774"/><path d="M-24-26q9-6 18 0l-9 18Z" fill="#da8d87"/><path d="m6-31 9-4 9 4-9 18Z" fill="#da8d87"/><path d="m-20-28 5 4 5-4m20-7 5 4 5-4" stroke="#819774"/>';
 return `<g transform="translate(${x} ${y}) scale(${scale})" stroke="${stroke}" stroke-width="2" stroke-linejoin="round">${leaves}<path d="m-18 0 4 27h28l4-27Z" fill="${changed?'#b7c9d6':'#e4b39d'}"/><path d="M-20 0h40v6h-40Z" fill="${changed?'#cbdce5':'#f0c5af'}"/></g>`;
}
export function roomSVG(room) {
 const wall=CATALOG.find(x=>x.id===room.wall)?.color||'#e7eee0';
 const rug=CATALOG.find(x=>x.id===room.rug)?.color||'#f8efd9';
 const friend=room.friend?.split('-')[1]||'bunny';
 let seat='<ellipse cx="113" cy="245" rx="40" ry="11" fill="#d8bba0"/><path d="m86 247-5 30m58-30 6 30" stroke="#ad8e73" stroke-width="8"/>';
 if(room.seat==='seat-sofa') seat='<path d="M51 238v-19q0-14 15-14h90q15 0 15 14v37H51Z" fill="#e5b0aa"/><rect x="46" y="233" width="133" height="30" rx="12" fill="#f0c5be"/><path d="M61 262v10m103-10v10" stroke="#9c7c68" stroke-width="6"/><path d="M110 211v24" stroke="#d39b96"/>';
 if(room.seat==='seat-pillow') seat='<path d="M54 254q-6-21 20-28-2-25 31-20 24-17 40 7 27 2 26 26 15 18-7 27H68q-14 0-14-12Z" fill="#f8f5e9" stroke="#d5c9b6" stroke-width="2"/>';
 if(room.seat==='seat-table') seat='<ellipse cx="112" cy="242" rx="57" ry="15" fill="#cfa984"/><path d="m74 250-6 30m85-30 6 30" stroke="#ad896a" stroke-width="7"/><path d="M98 226h24v12H98Z" fill="#f8f4e6" stroke="#9f9280"/><path d="M122 227q13 0 7 9h-7" stroke="#9f9280"/><ellipse cx="82" cy="233" rx="11" ry="4" fill="#f2d6ad"/>';
 return wrap(`<defs><pattern id="room-paper" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".6" fill="#8c9d7d" opacity=".13"/></pattern></defs><rect width="480" height="330" rx="25" fill="${wall}"/><rect width="480" height="235" rx="25" fill="url(#room-paper)"/><path d="M0 235h480v95H0Z" fill="#e7d6bd"/><path d="M0 235h480" stroke="#d8c5aa" stroke-width="5"/><path d="M0 280h480m-380-43-14 93m139-93 4 93m142-93 18 93" stroke="#d8c5aa" stroke-width="1.4"/><path d="M40 28Q220 75 439 24" stroke="#ad9e7e" stroke-width="1.5"/><path d="m72 34 13 24 14-19m57 8 14 25 14-23m57-1 12 24 16-27m53-6 17 22 11-27m50-8 17 22 10-28" fill="#f4d8ba" stroke="#c7b196"/><rect x="285" y="66" width="127" height="121" rx="49" fill="#fcf8e8" stroke="#bdba9f" stroke-width="5"/><path d="M292 164V121a56 56 0 0 1 112 0v43Z" fill="#d9e8e7"/><circle cx="378" cy="109" r="16" fill="#f3db96"/><path d="M291 157q32-31 59 0 28-31 55-5v28H291Z" fill="#c1d1b0"/><path d="M349 72v112m-58-49h114" stroke="#fcf8e8" stroke-width="5"/><path d="M281 69h-13v118l26-9V76m117-7h16v118l-26-9V76" fill="#f2ede0" stroke="#ded4be" stroke-width="1.5"/><rect x="48" y="87" width="76" height="74" rx="4" fill="#c3a282"/><rect x="54" y="93" width="64" height="62" rx="2" fill="#fff7e9"/><path d="m77 130 10-25 12 25-12-5Z" fill="#b1c09b"/><path d="M87 122v20" stroke="#8c9c7a" stroke-width="3"/><path d="M154 170h87" stroke="#c2a382" stroke-width="8"/><path d="M164 154v-22h13v22m7 0v-31h15v31m7 0v-25h12v25" fill="#c1c6a7" stroke="#9ba58d" stroke-width="2"/><ellipse cx="241" cy="284" rx="151" ry="32" fill="${rug}" stroke="#cfbea3" stroke-width="1.3"/><ellipse cx="241" cy="284" rx="137" ry="25" stroke="#fffaf0" stroke-width="1.5" stroke-dasharray="3 6"/>${seat}${animal(friend,264,207,.83)}${plant(room.plant?.split('-')[1],390,228,1.1)}<path d="m191 95 3 6 6 2-6 3-3 6-2-6-6-3 6-2Z" fill="#edc991"/><path d="M438 211q12-12 19 0-9 9-19 0Z" fill="#b1bf96"/><circle cx="55" cy="190" r="2" fill="#c1af90"/><circle cx="430" cy="74" r="2.5" fill="#c1af90"/>`,'0 0 480 330','可以布置的面面');
}
export const SCENE_THEMES=[
 {name:'草莓茶话会',subtitle:'一杯热茶，五颗小发现',wall:'#f5e6dd',floor:'#e5cdb8',accent:'#dba09a',props:['cup','cake','plant','clock','frame','book','animal','gift','berry','vase','window','lamp']},
 {name:'云朵的房间',subtitle:'软绵绵的秘密藏在哪里',wall:'#e5eaf1',floor:'#d6cdbd',accent:'#a7b8d0',props:['window','cloud','clock','lamp','animal','plant','book','frame','gift','star','cup','vase']},
 {name:'小熊的花园',subtitle:'花园里又多了点小惊喜',wall:'#e7eddb',floor:'#cfdbb7',accent:'#a5ba8b',props:['plant','mushroom','berry','cloud','animal','gift','cup','flower','vase','star','cake','frame']},
 {name:'月亮晚安书店',subtitle:'在睡前收集一点点星光',wall:'#e8e1ee',floor:'#d5c7be',accent:'#b1a2c4',props:['book','lamp','star','clock','frame','window','animal','cup','plant','cloud','gift','vase']},
 {name:'奶油烘焙屋',subtitle:'今天也闻到了甜甜的香气',wall:'#f4ebd5',floor:'#e2c5a4',accent:'#d5b77e',props:['cake','cup','berry','clock','gift','animal','book','vase','flower','plant','frame','lamp']},
 {name:'贝壳杂货铺',subtitle:'把海边的好心情装进口袋',wall:'#e0edeb',floor:'#dcd3ba',accent:'#9abdb8',props:['shell','star','vase','window','frame','plant','animal','gift','cup','book','cloud','lamp']},
];
const positions=[[49,61],[150,61],[251,61],[352,61],[49,142],[150,142],[251,142],[352,142],[49,217],[150,217],[251,217],[352,217]];
const names={cup:'小茶杯',cake:'小蛋糕',plant:'盆栽',clock:'小钟表',frame:'挂画',book:'书本',animal:'小动物',gift:'礼物盒',berry:'草莓',vase:'花瓶',window:'窗户',lamp:'台灯',cloud:'云朵',star:'小星星',mushroom:'蘑菇',flower:'小花',shell:'贝壳'};
function randomSeed(seed) {let n=seed+123;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
function shuffle(array,rng) {const a=[...array];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function sceneData(level) {
 if(!Number.isInteger(level)||level<0||level>=30) throw new Error('关卡不存在');
 const theme=SCENE_THEMES[Math.floor(level/5)], rng=randomSeed(level*997+73);
 const props=shuffle(theme.props,rng), slots=shuffle(Array.from({length:12},(_,i)=>i),rng).slice(0,5);
 return {level,theme,props,targets:slots.map((slot,id)=>({id,slot,x:positions[slot][0],y:positions[slot][1],radius:42,label:names[props[slot]]}))};
}
function prop(type,changed,accent,level) {
 const a=changed?'#a4c4d8':accent, b=changed?'#edbd76':'#f9f1dc';
 const outer=`stroke="${stroke}" stroke-width="1.7"`;
 let body='';
 if(type==='cup') body=`<ellipse cy="16" rx="27" ry="5" fill="#d7c6b1" stroke="none"/><path d="M-19-13h33v27q-16 12-33 0Z" fill="${a}"/><path d="M14-8q22-3 15 14-5 9-15 5"/><path d="M-8-25q-5 6 1 10m11-10q-5 6 1 10" stroke="#b1a38e"/>${changed?'<path d="m-7 0 6 6 6-6" stroke="#fff9ed" stroke-width="3"/>':'<circle cx="-2" cy="1" r="4" fill="#fff9ed" stroke="none"/>'}`;
 if(type==='cake') body=`<path d="m-25 0 11 23h30L26 0Z" fill="#e2bb92"/><path d="M-25 0q-9-15 6-16-1-15 16-15 15-1 16 10 16-3 17 11 9 12-4 14H-24Z" fill="${b}"/><path d="m-4-33 4-10 8 10-6 9Z" fill="${a}"/><path d="M-13 5v10m13-10v10M13 5v10" stroke="#bc946e"/>`;
 if(type==='plant'||type==='flower') return plant(type==='flower'?'flower':(level%2?'sprout':'flower'),0,3,.83,changed);
 if(type==='clock') body=`<circle r="26" fill="${b}"/><circle r="21" fill="#fffaf0"/><path d="M0-17v2m17 2h-2M0 17v-2m-17-15h2"/>${changed?'<path d="M0 0 10-8M0 0v13" stroke-width="2.8"/>':'<path d="M0 0-11-7M0 0v-13" stroke-width="2.8"/>'}<circle r="2" fill="${stroke}"/>`;
 if(type==='frame') body=`<rect x="-26" y="-30" width="52" height="59" rx="4" fill="#c6a789"/><rect x="-21" y="-25" width="42" height="49" fill="${b}"/>${changed?'<path d="M0-12C-18-28-23 0 0 13 23 0 18-28 0-12Z" fill="#d79c9a" stroke="none"/>':'<path d="m0-16 6 12 14 2-10 10 2 13-12-7-12 7 2-13-10-10 14-2Z" fill="#d7ba7d" stroke="none"/>'}`;
 if(type==='book') body=`<path d="M-28-20q15-6 28 3 13-9 28-3v40q-15-7-28 1-13-8-28-1Z" fill="${b}"/><path d="M0-17v38M-21-9l13 2m-13 8 13 2m-13 8 13 2m16-20 13-2m-13 12 13-2m-13 12 13-2" stroke="#b6ab93"/>${changed?'<path d="M12-20v20l5-5 5 5v-23" fill="#a9bfcc"/>':''}`;
 if(type==='animal') return animal(changed?'cat':'bunny',0,-4,.49);
 if(type==='gift') body=`<rect x="-24" y="-11" width="48" height="34" rx="3" fill="${a}"/><rect x="-27" y="-18" width="54" height="11" rx="3" fill="${b}"/><path d="M-5-18V23H5v-41" fill="#fff9e9"/><path d="M0-18q-26-26-25-9 2 14 25 9Zm0 0q26-26 25-9-2 14-25 9Z" fill="${b}"/>`;
 if(type==='berry') body=`<path d="M-24-12Q0-25 24-12q-3 31-24 41-21-10-24-41Z" fill="${a}"/><path d="m-23-15 13-3 4-14 9 13 16-8-4 13 12 4-19 4-10-9-8 11Z" fill="#a7bb91"/><path d="m-10 0 1 3m16-5 1 3m-6 12 1 3" stroke="#fff6dd" stroke-width="3"/>`;
 if(type==='vase') body=`<path d="M-8-9v-14m8 14v-25m8 25 7-15" stroke="#8f9d7e"/><circle cx="-8" cy="-28" r="8" fill="${a}"/><circle cy="-38" r="8" fill="${b}"/><circle cx="18" cy="-28" r="8" fill="${a}"/><path d="M-11-10h22l-2 12q19 23-9 26-28-3-9-26Z" fill="${a}"/><path d="M-13 12h26" stroke="#fff9eb" stroke-width="4"/>`;
 if(type==='window') body=`<path d="M-24 25v-29a24 24 0 0 1 48 0v29Z" fill="#dce9e5" stroke-width="3"/><circle cx="${changed?-10:10}" cy="-6" r="9" fill="#ebcd8b" stroke="none"/><path d="M-24 12q15-12 25 0 13-10 23-1v14h-48Z" fill="#b9c9a4" stroke="none"/><path d="M0-28v53m-24-21h48" stroke="#faf4e5" stroke-width="3"/>`;
 if(type==='lamp') body=`<path d="M0-4v30m-19 0h38" stroke-width="4"/><path d="m-14-29-14 27h56L14-29Z" fill="${a}"/><path d="M-8-23-3-7m14-16 4 16" stroke="#fff7df"/>${changed?'<circle cx="30" cy="9" r="5" fill="#e9c787"/><path d="M26-1v6"/>':''}`;
 if(type==='cloud') body=`<path d="M-25 14q-16-12 0-23-1-23 22-19 16-11 25 9 20 0 15 20 3 13-16 13Z" fill="${b}"/><path d="M-10-3v2m19-2v2m-12 8q6 5 11 0"/>${changed?'<path d="m-14 25-2 7m15-7-2 7m16-7-2 7" stroke="#a2bdcf" stroke-width="3"/>':''}`;
 if(type==='star') body=`<path d="m0-30 9 18 20 3-15 14 4 20L0 16-18 25l4-20-15-14 20-3Z" fill="${changed?'#b6c5da':'#f0d59b'}"/><path d="M-7-3v2m14-2v2m-11 8q4 4 8 0"/>`;
 if(type==='mushroom') body=`<path d="m-9 0-4 25q13 8 26 0L9 0Z" fill="#f9f0dc"/><path d="M-29 0q6-47 29-39Q23-47 29 0Z" fill="${a}"/><circle cx="-12" cy="-15" r="5" fill="#fff6e4" stroke="none"/><circle cx="10" cy="-24" r="4" fill="#fff6e4" stroke="none"/>${changed?'<circle cx="14" cy="-9" r="4" fill="#fff6e4" stroke="none"/>':''}`;
 if(type==='shell') body=`<path d="M-8 23C-67-14-8-53 0-21c8-32 67 7 8 44Z" fill="${a}"/><path d="M0 20V-21m-5 40-13-42M5 19l13-42M-8 23H8" stroke="#fff7e9" stroke-width="2.5"/>`;
 return `<g ${outer}>${body}</g>`;
}
export function renderScene(level,variant=false,found=[],hint=-1) {
 const data=sceneData(level),{theme,props,targets}=data;
 const floorY=Math.floor(level/5)===2?177:179;
 let body=`<rect width="400" height="252" rx="16" fill="${theme.wall}"/><path d="M0 ${floorY}h400v80H0Z" fill="${theme.floor}"/><path d="M0 98h400M0 179h400" stroke="#c5b49d" stroke-width="4" opacity=".6"/><path d="M100 181v71m100-71v71m100-71v71" stroke="#b9a992" opacity=".23"/><path d="M5 14q195 38 390-2" stroke="#cabca6"/><path d="m20 16 7 12 9-9m75 9 7 13 9-11m77-5 7 13 8-14m78-9 8 12 8-15" fill="${theme.accent}" stroke="#c9b69d" stroke-width="1"/>`;
 props.forEach((type,slot)=>{
   const changed=variant&&targets.some(t=>t.slot===slot);
   body+=`<g transform="translate(${positions[slot][0]} ${positions[slot][1]}) scale(.88)">${prop(type,changed,theme.accent,level)}</g>`;
 });
 for(const target of targets) {
   if(found.includes(target.id)) body+=`<circle cx="${target.x}" cy="${target.y}" r="30" fill="#78916a" fill-opacity=".1" stroke="#6f8b67" stroke-width="3"/><path d="m${target.x+14} ${target.y+19} 5 5 10-12" stroke="#5e7b58" stroke-width="3" fill="none"/>`;
   else if(target.id===hint) body+=`<circle class="hint-ring" cx="${target.x}" cy="${target.y}" r="31" stroke="#d29d65" stroke-width="3" stroke-dasharray="5 5"/>`;
 }
 return wrap(body,'0 0 400 252',`${data.theme.name}，${variant?'变化后的图':'原图'}`);
}
export function bunnyBadge() {return wrap(`<circle cx="45" cy="45" r="44" fill="#f6e7d8"/>${animal('bunny',45,43,.45)}`,'0 0 90 90','面面小兔');}
