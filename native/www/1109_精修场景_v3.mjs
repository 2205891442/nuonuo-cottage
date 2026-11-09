// v3原创离线矢量场景。材质、光照与完整角色均为实际图形；答案微片段独立切换。
export const SCENE_WIDTH = 1600;
export const SCENE_HEIGHT = 1050;
export const SCENE_THEMES = Object.freeze([
  Object.freeze({name:'奶油咖啡街',subtitle:'沿着花香，找一张晒太阳的桌子'}),
  Object.freeze({name:'松鼠杂货铺',subtitle:'玻璃罐、布袋和一整天的小确幸'}),
  Object.freeze({name:'森林周末集',subtitle:'树荫下的果酱、野餐与小摊'}),
  Object.freeze({name:'月光小书屋',subtitle:'翻开书页，听雨滴落在窗边'}),
  Object.freeze({name:'桃子甜点工坊',subtitle:'把今天揉进面团，烤成甜甜的香气'}),
  Object.freeze({name:'海风花园',subtitle:'白色小屋、贝壳与缓慢的午后'})
]);
const COLORS=['#d9a89d','#a7beb0','#e6c387','#c5b8ca','#d1b494','#9fbcc8','#b8c7a0'];
const ink='#796554', cream='#fff7e7', wood='#caa37d';
const DEFS=`<defs>
<linearGradient id="wall" x2=".82" y2="1"><stop stop-color="#fff6df"/><stop offset="1" stop-color="#e2cdb2"/></linearGradient>
<linearGradient id="floor" x2=".1" y2="1"><stop stop-color="#d7b98e"/><stop offset="1" stop-color="#f3dfb8"/></linearGradient>
<linearGradient id="wood" x2=".12" y2="1"><stop stop-color="#efdab6"/><stop offset=".35" stop-color="#d7b88c"/><stop offset="1" stop-color="#b28c62"/></linearGradient>
<linearGradient id="woodEdge" x2="0" y2="1"><stop stop-color="#c39a6d"/><stop offset="1" stop-color="#947454"/></linearGradient>
<linearGradient id="glass" x2="1" y2=".45"><stop stop-color="#fff9e4" stop-opacity=".84"/><stop offset=".2" stop-color="#ecedcf" stop-opacity=".28"/><stop offset=".7" stop-color="#b0c5b7" stop-opacity=".45"/><stop offset="1" stop-color="#f6f3d9" stop-opacity=".9"/></linearGradient>
<linearGradient id="bread" x2=".15" y2="1"><stop stop-color="#ffe4a3"/><stop offset=".48" stop-color="#eac283"/><stop offset="1" stop-color="#bc8853"/></linearGradient>
<linearGradient id="ceramic" x2="1" y2=".4"><stop stop-color="#fffdf0"/><stop offset=".55" stop-color="#fff4db"/><stop offset="1" stop-color="#d1baa0"/></linearGradient>
<linearGradient id="leaf" x2=".8" y2="1"><stop stop-color="#c3d1aa"/><stop offset="1" stop-color="#839d7a"/></linearGradient>
<linearGradient id="copper" x2="1" y2=".8"><stop stop-color="#f2ce9d"/><stop offset=".45" stop-color="#cf9d76"/><stop offset=".7" stop-color="#a77b5b"/><stop offset="1" stop-color="#e1b38a"/></linearGradient>
<linearGradient id="sky" x2=".1" y2="1"><stop stop-color="#d7e5df"/><stop offset="1" stop-color="#f7ead0"/></linearGradient>
<linearGradient id="night" x2=".5" y2="1"><stop stop-color="#728f9c"/><stop offset=".65" stop-color="#a9bdbb"/><stop offset="1" stop-color="#d4d9c4"/></linearGradient>
<linearGradient id="sea" x2="0" y2="1"><stop stop-color="#a8c8ca"/><stop offset="1" stop-color="#d3e1d5"/></linearGradient>
<linearGradient id="oven" x2=".1" y2="1"><stop stop-color="#927c60"/><stop offset=".5" stop-color="#bfa57d"/><stop offset="1" stop-color="#ddc29a"/></linearGradient>
<radialGradient id="shadow"><stop stop-color="#75604d" stop-opacity=".25"/><stop offset="1" stop-color="#75604d" stop-opacity="0"/></radialGradient>
<radialGradient id="sun"><stop stop-color="#fff9d9" stop-opacity=".78"/><stop offset="1" stop-color="#fff9d9" stop-opacity="0"/></radialGradient>
<radialGradient id="fur" cx=".28" cy=".18" r=".9"><stop stop-color="#f3debc"/><stop offset="1" stop-color="#c6a17a"/></radialGradient>
<pattern id="linen" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 1H7M1 0V7" stroke="#fff7de" stroke-width=".8" opacity=".32"/></pattern>
<pattern id="gingham" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#f5e8cd"/><path d="M0 5.5H22M5.5 0V22" stroke="#c79e98" stroke-width="10" opacity=".28"/></pattern>
</defs>`;
const cache=new Map();
const esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function validate(level,difficulty,seed=0) {
  if(!Number.isInteger(level)||level<0||level>29) throw new RangeError('关卡必须是0至29的整数');
  if(!['medium','hard','expert'].includes(difficulty)) throw new RangeError('难度必须为medium、hard或expert');
  if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw new RangeError('seed必须为0至4294967295的整数');
}
function build(level) {
  if(cache.has(level)) return cache.get(level);
  const theme=Math.floor(level/5), layout=level%5, mirrored=layout===1||layout===3;
  const parts=[],targets=[];
  let detailCount=0,tx=0,ty=0,scale=1;
  const raw=s=>parts.push(s);
  const detail=(name,s)=>{detailCount++;raw(`<g data-detail="${esc(name)}">${s}</g>`);};
  const material=fill=>({'#e0c49c':'url(#wood)','#ead8b6':'url(#wood)','#b99871':'url(#woodEdge)','#e4bc82':'url(#bread)','#e2c8a4':'url(#fur)','#d7ba93':'url(#fur)','#b8c8aa':'url(#leaf)','#aabea3':'url(#leaf)','#a5b598':'url(#leaf)','#d6aa91':'url(#copper)','#e9dbbe':'url(#wall)','#e9cfb0':'url(#wall)','#f3e6ca':'url(#wall)','#d3c3a2':'url(#oven)'}[fill]||fill);
  const rect=(x,y,w,h,fill,r=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${material(fill)}" ${extra}/>`;
  const ellipse=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${material(fill)}" ${extra}/>`;
  const circle=(x,y,r,fill,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
  const line=(x1,y1,x2,y2,color=ink,w=3)=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${w}"/>`;
  const path=(d,fill='none',extra='')=>`<path d="${d}" fill="${material(fill)}" ${extra}/>`;
  const shadow=(x,y,rx,ry)=>raw(ellipse(x,y,rx,ry,'url(#shadow)','stroke="none"'));
  // 招牌使用内置单线字形，离线放大和测试均不依赖设备字体。
  const glyphs={A:'M0 7L2.5 0L5 7M1 4.5H4',B:'M0 7V0H2.8Q6 1.5 2.8 3.5Q6 5.5 3 7Z',C:'M5 1Q0 -2 0 3.5Q0 9 5 6',D:'M0 7V0H2Q6 0 5 4Q5 7 2 7Z',E:'M5 0H0V7H5M0 3.5H4',F:'M5 0H0V7M0 3.5H4',G:'M5 1Q0 -2 0 3.5Q0 9 5 6V4H3',H:'M0 0V7M5 0V7M0 3.5H5',I:'M0 0H5M2.5 0V7M0 7H5',J:'M0 0H5V5Q5 9 0 6',K:'M0 0V7M5 0L0 3.5L5 7',L:'M0 0V7H5',M:'M0 7V0L2.5 4L5 0V7',N:'M0 7V0L5 7V0',O:'M2.5 0Q-1 0 0 3.5Q-1 7 2.5 7Q6 7 5 3.5Q6 0 2.5 0Z',P:'M0 7V0H3Q7 2 3 3.5H0',Q:'M2.5 0Q-1 0 0 3.5Q-1 7 2.5 7Q6 7 5 3.5Q6 0 2.5 0ZM3 5L6 8',R:'M0 7V0H3Q7 2 3 3.5H0M2.5 3.5L5 7',S:'M5 1Q0 -2 0 2Q0 3.5 2.5 3.5Q5 3.5 5 5.5Q5 9 0 6',T:'M0 0H5M2.5 0V7',U:'M0 0V5Q2.5 9 5 5V0',V:'M0 0L2.5 7L5 0',W:'M0 0L1 7L2.5 3L4 7L5 0',X:'M0 0L5 7M5 0L0 7',Y:'M0 0L2.5 3.5L5 0M2.5 3.5V7',Z:'M0 0H5L0 7H5','&':'M5 7L1 2Q0 -1 3 0Q6 1 2 4Q-1 6 2 7Q5 8 5 4','É':'M5 0H0V7H5M0 3.5H4M2 -2L4 -4'};
  const text=(x,y,str,size=22,color=ink)=>{const s=size/9,w=str.length*8*s;return `<g${mirrored?` transform="translate(${x*2} 0) scale(-1 1)"`:''}><g transform="translate(${x-w/2} ${y-size*.8}) scale(${s})" fill="none" stroke="${color}" stroke-width=".75">${[...str].map((ch,i)=>glyphs[ch]?`<path transform="translate(${i*8} 0)" d="${glyphs[ch]}"/>`:'').join('')}</g></g>`;};
  function group(x,y,s,fn) {const prev=[tx,ty,scale];tx+=x*scale;ty+=y*scale;scale*=s;raw(`<g transform="translate(${x} ${y}) scale(${s})">`);fn();raw('</g>');[tx,ty,scale]=prev;}
  function micro(x,y,label,a,b) {const id=targets.length;targets.push({id,x:tx+x*scale,y:ty+y*scale,radius:24*scale,label});parts.push({id,a,b});}
  function motif(x,y,t,label='杯身的小叶子') {
    const a=path(`M${x-8} ${y+5}Q${x-7} ${y-8} ${x+8} ${y-5}Q${x+7} ${y+8} ${x-8} ${y+5}Z`,'#9eb39b')+line(x-6,y+4,x+5,y-3,ink,1.5);
    const b=path(`M${x-8} ${y-5}Q${x+7} ${y-8} ${x+8} ${y+5}Q${x-7} ${y+8} ${x-8} ${y-5}Z`,'#9eb39b')+line(x-6,y-4,x+5,y+3,ink,1.5);
    if(t) micro(x,y,label,a,b); else raw(a);
  }
  function flower(x,y,s=1,color='#e5b0a2') {group(x,y,s,()=>{
    detail('小花',[-90,-18,54,126,198].map(a=>{const z=a*Math.PI/180;return ellipse(Math.cos(z)*9,Math.sin(z)*9,6,8,color,`transform="rotate(${a+90} ${Math.cos(z)*9} ${Math.sin(z)*9})"`);}).join('')+circle(0,0,5,'#edcf8b'));
  });}
  function plant(x,y,s=1,t=false,blossom=true) {group(x,y,s,()=>{
    shadow(39,116,46,9);
    detail('陶花盆',path('M10 70H65L59 116H17Z','#d6aa91')+rect(7,66,61,11,'#e6c2a5',4)+line(25,83,27,103,'#b58a75',2)+line(46,83,44,103,'#b58a75',2));
    raw(path('M37 67Q32 42 35 9M36 49L14 30M36 41L57 20M37 60L61 44','none','stroke="#83906b" stroke-width="2"'));
    [[18,31,-32],[31,16,25],[52,23,-35],[19,52,35],[57,49,-20]].forEach(([a,b,r])=>detail('植物叶片',ellipse(a,b,14,6,'#a5b598',`transform="rotate(${r} ${a} ${b})"`)));
    if(t) micro(47,39,'花盆右侧的小叶片',path('M37 42Q39 29 54 32Q56 43 37 42Z','#9eb39b'),path('M37 36Q53 29 55 42Q42 46 37 36Z','#9eb39b'));
    else detail('植物小叶',ellipse(45,39,11,5,'#9eb39b','transform="rotate(-25 45 39)"'));
    raw(path('M13 75H61M21 110H55','none','stroke="#f0ceb0" stroke-width="2"'));
    if(blossom) {flower(14,17,.75);flower(43,5,.8,'#f1d59b');flower(65,31,.65,'#d7bbc6');}
  });}
  function cup(x,y,s=1,t=false) {group(x,y,s,()=>{
    shadow(25,50,38,9);
    detail('瓷杯',ellipse(22,48,31,7,'url(#ceramic)')+path('M41 14Q62 10 56 30Q52 38 42 33','url(#ceramic)')+path('M0 7H43L39 41Q20 51 4 41Z','url(#ceramic)')+ellipse(21,8,21,6,'#a5846b')+ellipse(21,7,17,3,'#c29b74','stroke="none"')+path('M8 12L10 33M16 9Q21 5 29 8','none','stroke="#fffbed" stroke-width="3"'));
    motif(22,28,t,'瓷杯上的小叶纹');raw(path('M6 13Q20 17 37 13M10 45Q21 49 34 45','none','stroke="#dec6a0" stroke-width="1.5"')+path('M12 -1Q7 -11 14 -18M28 -1Q35 -10 29 -18','none','stroke="#c7bca8" stroke-width="2"'));
  });}
  function jar(x,y,s=1,t=false,color='#d9b58d') {group(x,y,s,()=>{
    shadow(24,66,31,7);
    detail('标签玻璃罐',rect(3,9,42,56,'url(#glass)',9)+path('M6 23Q24 29 42 23V57Q25 65 6 57Z',color,'opacity=".75" stroke-width="1.2"')+rect(1,2,46,12,'url(#wood)',3)+rect(8,27,32,24,cream,4)+path('M10 18V24M10 53V58M38 18V24M38 54V58','none','stroke="#fff9e8" stroke-width="3"')+path('M5 16V55','none','stroke="#f7f4db" stroke-width="1.1"'));
    for(let i=0;i<6;i++)raw(line(7+i*6,5,7+i*6,11,'#dfc9a8',1));
    raw(path('M36 19L36 23M34 57L38 56','none','stroke="#fae8cd" stroke-width="2"'));
    const a=line(15,34,33,34,ink,2)+line(15,42,28,42,ink,2),b=line(15,34,28,34,ink,2)+line(15,42,33,42,ink,2);
    if(t) micro(24,38,'玻璃罐标签上的两条短线',a,b);else raw(a);
  });}
  function book(x,y,s=1,t=false,color='#acbca9',lean=0) {group(x,y,s,()=>{
    raw(`<g transform="rotate(${lean} 16 65)">`);
    detail('书本',rect(0,0,28,72,color,3)+rect(25,3,5,67,'#7f7461',2,'opacity=".2" stroke="none"')+line(5,3,5,68,'#fff3db',2)+line(1,8,27,8,ink,1.6)+line(1,63,27,63,ink,1.6)+line(8,67,22,67,'#f4e7c9',1));
    // 带答案的书始终直立，避免旋转后的点击坐标偏差。
    raw(line(8,13,23,13,'#efdfbc',1.1)+line(8,59,23,59,'#efdfbc',1.1)+circle(16,49,1.4,'#eee0be','stroke="none"'));
    const a=line(11,29,22,29,ink,2)+line(11,35,22,35,ink,2),b=line(11,29,22,29,ink,2)+line(11,41,22,41,ink,2);
    if(t)micro(16,35,'书脊中间的细条纹',a,b);else raw(a);raw('</g>');
  });}
  function bread(x,y,s=1,t=false) {group(x,y,s,()=>{
    shadow(28,37,35,7);
    detail('烤面包',path('M0 32Q-5 3 27 1Q56 2 57 32Q29 47 0 32Z','#e4bc82')+path('M10 11Q13 16 17 22M24 8Q27 15 31 21M39 10Q42 16 45 22','none','stroke="#af7b46" stroke-width="4"')+path('M8 9Q12 14 14 19M22 7Q25 13 28 18M37 9Q40 15 42 19','none','stroke="#fff0c2" stroke-width="2.4"')+path('M6 31Q25 40 49 31','none','stroke="#f9da9b" stroke-width="1.7"'));
    if(t)micro(28,29,'面包上的一粒芝麻',ellipse(23,28,2,4,'#fff2cf','stroke="none"')+ellipse(33,30,2,4,'#fff2cf','stroke="none"'),ellipse(23,28,2,4,'#fff2cf','stroke="none"')+ellipse(33,23,2,4,'#fff2cf','stroke="none"'));
  });}
  function cake(x,y,s=1,t=false) {group(x,y,s,()=>{
    shadow(27,54,40,9);
    detail('小蛋糕',ellipse(25,52,34,8,'#eadcc7')+path('M1 22H49L44 48H6Z','#dba7a2')+path('M0 23Q-2 14 8 13Q7 -1 23 7Q34 -5 40 11Q54 9 51 24Q45 32 37 24Q29 34 21 25Q9 34 0 23Z',cream)+circle(26,5,6,'#b87d79')+path('M26 0Q25 -8 32 -10','none','stroke="#8a9b76"'));
    raw(path('M10 18l4 -2M32 16l4 2M20 21l3 -2','none','stroke="#c9a187" stroke-width="1.4"')+path('M8 13Q12 4 20 10M29 10Q36 5 39 14','none','stroke="#fffdf2" stroke-width="3"')+line(7,28,6,46,'#ba8d89',1)+line(44,28,43,46,'#ba8d89',1)+circle(24,2,1.5,'#f4d1b9','stroke="none"'));
    const a=line(15,37,18,44,'#fff3d9',2)+line(33,37,30,44,'#fff3d9',2),b=line(15,37,18,44,'#fff3d9',2)+line(27,37,30,44,'#fff3d9',2);
    if(t)micro(25,40,'纸杯蛋糕侧边的细褶纹',a,b);else raw(a);
  });}
  function rabbit(x,y,s=1,t=false,color='#e5c2b0') {group(x,y,s,()=>{
    shadow(50,173,65,15);
    detail('兔子角色',ellipse(50,123,43,50,color)+ellipse(20,163,20,11,cream)+ellipse(79,163,20,11,cream)+ellipse(48,63,45,39,cream)+ellipse(27,17,12,37,cream,'transform="rotate(-13 27 17)"')+ellipse(66,14,12,39,cream,'transform="rotate(10 66 14)"')+ellipse(27,14,5,26,'#eac4bd','transform="rotate(-13 27 14)" stroke="none"')+ellipse(66,11,5,26,'#eac4bd','transform="rotate(10 66 11)" stroke="none"')+circle(33,63,3,ink,'stroke="none"')+circle(64,63,3,ink,'stroke="none"')+path('M44 75L50 79L56 75M50 79V84','none','stroke-width="2"')+ellipse(20,77,8,4,'#e5afa7','stroke="none"')+ellipse(78,77,8,4,'#e5afa7','stroke="none"')+path('M22 100Q50 115 77 100L72 145H28Z','#f6e8c8')+ellipse(12,118,10,21,cream,'transform="rotate(20 12 118)"')+ellipse(88,118,10,21,cream,'transform="rotate(-20 88 118)"'));
    detail('围裙暗褶',path('M29 105L27 143Q51 152 72 144L70 107','url(#linen)','stroke="none"')+path('M33 140Q49 145 66 140M32 151Q47 155 66 151','none','stroke="#cebda0" stroke-width="1.2"')+path('M16 156Q21 160 25 157M72 156Q79 160 84 157','none','stroke="#c7b299" stroke-width="1.4"'));
    const a=circle(50,119,3,wood)+circle(50,131,3,wood),b=circle(50,119,3,wood)+circle(58,131,3,wood);
    if(t)micro(53,125,'兔子围裙上的小纽扣',a,b);else raw(a);
  });}
  function cat(x,y,s=1,t=false) {group(x,y,s,()=>{
    shadow(48,178,62,13);
    detail('猫咪完整身体',path('M16 153Q-21 150 -17 125Q-15 108 -8 113Q-6 119 -11 127Q-16 144 21 140','none','stroke="#bea07d" stroke-width="15"')+ellipse(49,137,34,39,'url(#fur)')+ellipse(49,143,21,29,'#f8ead0')+ellipse(26,173,19,10,'#dec09a')+ellipse(73,173,19,10,'#dec09a')+path('M31 141L32 171M67 141L66 171M20 172v4M27 172v4M68 172v4M75 172v4','none','stroke="#aa8968" stroke-width="1.8"'));
    detail('猫咪角色',path('M9 52L8 8L36 29Q53 22 67 30L91 12L87 57Q100 97 52 103Q3 99 9 52Z','#e2c8a4')+path('M16 24L18 47L31 34M81 28L69 39L82 49','#d9aa9e')+path('M27 84Q50 68 76 84Q68 99 51 99Q33 98 27 84Z','#f7e7ca','stroke="none"')+circle(32,64,3,ink)+circle(69,64,3,ink)+path('M44 76L51 80L58 76M51 80V86M51 86Q45 92 41 87M51 86Q58 92 62 87','none','stroke-width="2"')+line(8,78,25,80)+line(77,80,95,77)+path('M31 31L36 44M48 28L50 43M65 32L62 44','none','stroke="#b49778" stroke-width="4"')+path('M24 103Q50 114 77 103L75 118Q49 128 27 116Z','#9fb7ad')+line(28,107,36,110,'#d0dfc8',2));
    const a=circle(52,116,7,'#e6c789')+line(52,112,52,120,ink,2),b=circle(52,116,7,'#e6c789')+line(48,116,56,116,ink,2);
    if(t)micro(52,116,'猫咪项圈铃铛上的小刻线',a,b);else raw(a);
  });}
  function basket(x,y,s=1,t=false,fruit=true) {group(x,y,s,()=>{
    shadow(46,79,58,10);
    if(fruit) [[13,12],[36,5],[59,12],[78,6],[27,24],[54,24],[76,25]].forEach(([a,b],i)=>detail('篮中水果',circle(a,b,13,i%3===0?'#c98f7a':'#dec584')+path(`M${a} ${b-11}l3 -8`,'none','stroke="#829775" stroke-width="2"')));
    detail('藤编篮',path('M0 28H93L82 78H13Z','#cba779')+path('M8 28Q41 -17 86 28','none','stroke-width="5"')+line(5,42,89,42,'#a88965',2)+line(9,56,86,56,'#a88965',2)+line(14,68,81,68,'#a88965',2));
    [22,37,52,67,82].forEach(a=>raw(line(a,31,a-3,74,'#a88965',1.8)));
    raw(path('M4 33H90M15 73H81','none','stroke="#ecd2a4" stroke-width="2"')+path('M13 24Q43 -8 79 23','none','stroke="#e8d3aa" stroke-width="1.5"'));
    if(t)micro(47,49,'藤篮交叉编织的一小段',line(40,43,53,55,'#f4dfb7',2.4),line(40,55,53,43,'#f4dfb7',2.4));
  });}
  function lamp(x,y,s=1,t=false) {group(x,y,s,()=>{
    raw(ellipse(37,41,75,62,'url(#sun)','stroke="none"'));shadow(38,116,39,8);
    detail('灯罩台灯',line(37,38,37,110,wood,6)+ellipse(37,112,29,6,'#b69d83')+path('M14 0H60L74 42Q36 55 0 42Z','#e5c88e')+line(59,46,59,70,ink,2));
    raw(path('M18 5H55L65 38Q38 46 10 38Z','url(#linen)','stroke="none"')+path('M18 6L14 37M30 5L28 41M44 5L47 41M56 8L61 36','none','stroke="#d0ad75" stroke-width="1.2"'));
    if(t)micro(59,70,'灯罩拉绳末端的小珠子',circle(59,67,4,'#c29b72')+circle(59,76,3,'#c29b72'),circle(59,67,4,'#c29b72')+circle(65,76,3,'#c29b72'));
  });}
  function cushion(x,y,s=1,t=false,color='#d2afad') {group(x,y,s,()=>{
    shadow(35,63,43,10);
    detail('刺绣靠垫',path('M0 5Q31 -5 65 4Q73 33 65 60Q30 69 0 58Q7 31 0 5Z',color)+path('M8 12Q31 6 58 12L59 51Q34 57 9 51Z','none','stroke="#f6e7d4" stroke-width="2" stroke-dasharray="3 5"'));
    raw(path('M3 7Q33 -2 64 6L65 57Q34 65 3 56Q8 31 3 7Z','url(#linen)','stroke="none"')+path('M4 57Q29 64 62 59','none','stroke="#a8807f" stroke-width="1.7"'));
    const a=line(27,27,39,39,cream,2.2)+line(27,39,39,27,cream,2.2),b=line(25,33,41,33,cream,2.2)+line(33,25,33,41,cream,2.2);
    if(t)micro(33,33,'靠垫中央的刺绣针脚',a,b);else raw(a);
  });}
  function clockFace(x,y,s=1,t=false) {group(x,y,s,()=>{
    detail('墙上小钟',circle(0,0,39,'#d5b48f')+circle(0,0,32,cream));
    for(let i=0;i<12;i++){let a=i*Math.PI/6;raw(line(Math.sin(a)*25,-Math.cos(a)*25,Math.sin(a)*28,-Math.cos(a)*28,ink,1.5));}
    raw(line(0,0,0,-16,ink,2.4)+circle(0,0,2.5,ink));
    if(t)micro(6,6,'小钟短针的方向',line(0,0,12,8,ink,2.4),line(0,0,8,12,ink,2.4));else raw(line(0,0,12,8,ink,2.4));
  });}
  function frame(x,y,s=1,t=false,kind=0) {group(x,y,s,()=>{
    detail('墙上植物画',rect(0,0,89,110,'#c6a483',4)+rect(8,8,73,94,'#faf0da',1)+path('M44 83Q32 59 46 34M40 61L61 47','none','stroke="#8f9d78" stroke-width="3"')+ellipse(35,52,13,6,'#b8c4a1','transform="rotate(35 35 52)"')+ellipse(55,43,14,6,'#aabc9e','transform="rotate(-30 55 43)"'));
    if(t)micro(46,27,'植物画顶端的花心',circle(46,27,9,'#d6a999')+circle(43,27,2.5,'#f3d18e'),circle(46,27,9,'#d6a999')+circle(49,27,2.5,'#f3d18e'));else flower(46,27,.65);
  });}
  function windowPane(x,y,w,h,t=false,sea=false) {group(x,y,1,()=>{
    raw(path(`M7 ${h+8}V${w/2+8}A${w/2} ${w/2} 0 0 1 ${w+7} ${w/2+8}V${h+8}Z`,'#8c7761','stroke="none" opacity=".16"'));
    detail('拱形窗',path(`M0 ${h}V${w/2}A${w/2} ${w/2} 0 0 1 ${w} ${w/2}V${h}Z`,'#cfdbd1','stroke-width="8"'));
    raw(path(`M10 ${h-10}V${w/2}A${w/2-10} ${w/2-10} 0 0 1 ${w-10} ${w/2}V${h-10}Z`,theme===3?'url(#night)':sea?'url(#sea)':'url(#sky)','stroke="none"'));
    if(theme===3) {
      detail('窗外月亮',circle(w*.32,w*.32,21,'#f5e9ba','stroke="none"')+circle(w*.32+7,w*.32-6,18,'#8ca2a8','stroke="none"'));
      for(let i=0;i<9;i++){const sx=28+(i*47)%(w-55),sy=w*.42+((i*29)%(h*.35));detail('窗外细雨',line(sx,sy,sx-5,sy+13,'#e1e7d7',1.4));}
    }
    raw(path(`M11 ${h-40}Q${w/3} ${h-80} ${w/2} ${h-43}T${w-11} ${h-55}V${h-10}H11Z`,sea?'#a7c9c8':'#b2c6a7','stroke="none"'));
    raw(line(w/2,6,w/2,h,'#b69979',6)+line(3,h*.48,w-3,h*.48,'#b69979',6)+line(3,h*.76,w-3,h*.76,'#b69979',6)+rect(-8,h-3,w+16,15,'#d1b28d',3));
    if(t)micro(w*.25,h*.62,'窗格反光中间的一小段',line(w*.25-6,h*.62+7,w*.25+6,h*.62-7,'#fff9e8',3),line(w*.25-6,h*.62+7,w*.25+3,h*.62-3,'#fff9e8',3));
    raw(path(`M13 40Q${w*.23} 52 ${w*.27} ${h*.45}L12 ${h*.53}Z`,'#f2dfc1','stroke-width="2"')+path(`M${w-13} 40Q${w*.77} 52 ${w*.73} ${h*.45}L${w-12} ${h*.53}Z`,'#f2dfc1','stroke-width="2"'));
    raw(path(`M16 47Q${w*.18} 57 ${w*.22} ${h*.42}M${w-16} 47Q${w*.82} 57 ${w*.78} ${h*.42}`,'none','stroke="#c9b48e" stroke-width="2"')+line(w*.56,h*.55,w*.72,h*.35,'#fff8df',4)+line(w*.62,h*.56,w*.76,h*.39,'#fff8df',1.6));
  });}
  function shelf(x,y,w,h,rows=3,books=false) {group(x,y,1,()=>{
    raw(rect(7,8,w,h,'#a48a68',8,'opacity=".12" stroke="none"'));
    detail('木质置物架',rect(0,0,w,h,'url(#woodEdge)',7)+rect(12,12,w-24,h-24,'#d2b58d',3)+rect(17,17,w-34,h-34,'#e6ceaa',3)+path(`M8 8V${h-8}M8 8H${w-8}`,'none','stroke="#f2dfb8" stroke-width="2"'));
    for(let row=0;row<rows;row++) {
      const base=(row+1)*(h-16)/rows;
      for(let i=0;i<Math.floor((w-35)/(books?34:57));i++){
        if(books)book(19+i*34,base-75,.84,false,COLORS[(i+row+layout)%COLORS.length],i===2?7:0);
        else if((i+row+layout)%5===3) {const px=19+i*57,py=base-57;detail('纸装食材包',path(`M${px+5} ${py+6}l7 -8h25l8 8v47h-40Z`,'#e6cf9f')+rect(px+11,py+19,26,20,'#f4e4c3',2)+path(`M${px+24} ${py+23}v12m-5 -8l5 3l5 -5`,'none','stroke="#a99773" stroke-width="1.7"'));}
        else jar(20+i*57,base-63,.83,false,COLORS[(i+row+layout)%COLORS.length]);
      }
      detail('搁板',rect(7,base,w-14,11,'#b99871',2)+line(9,base+1,w-9,base+1,'#f0d6ac',2)+rect(14,base+11,w-28,7,'#8d7054',0,'opacity=".13" stroke="none"'));
    }
  });}
  function table(x,y,w=230,h=120,color='#c9aa85') {group(x,y,1,()=>{
    shadow(w/2,h,w*.65,25);
    detail('木桌',path(`M22 5L12 ${h}H32L48 5M${w-46} 5L${w-31} ${h}H${w-12}L${w-21} 5`,color)+ellipse(w/2,0,w/2,35,'#e0c49c')+ellipse(w/2,-8,w/2,30,'#ead8b6'));
    raw(path(`M${w*.13} 1Q${w*.5} 23 ${w*.87} 1M${w*.18} 6Q${w*.5} 26 ${w*.82} 6`,'none','stroke="#d0b38d" stroke-width="1.2"'));
    detail('桌面蕾丝小垫',ellipse(w*.5,-8,w*.27,17,'#f6e6c9','stroke="#ccb38f" stroke-width="1.3" stroke-dasharray="2 4"')+ellipse(w*.5,-8,w*.23,13,'none','stroke="#d6bfa0" stroke-width="1.2"'));
  });}
  function stool(x,y,s=1) {group(x,y,s,()=>{shadow(33,76,48,12);detail('小木凳',path('M13 0L4 76H17L28 0M52 0L63 76H50L38 0','url(#woodEdge)')+ellipse(33,3,40,17,'#ba986f')+ellipse(33,-2,40,15,'url(#wood)')+path('M6 -2Q29 -13 57 -4M13 4Q32 9 53 2','none','stroke="#ebd3ab" stroke-width="1.2"')+line(12,45,54,45,wood,5));});}
  function sofa(x,y,w=290) {group(x,y,1,()=>{
    shadow(w/2,183,w*.66,23);
    detail('双人沙发',rect(10,0,w-20,112,'#a8b9aa',30)+rect(20,9,w-40,80,'url(#linen)',22,'stroke="#d2dbc0" stroke-width="1.3"')+rect(7,73,w-14,84,'#c4cfb8',20)+path(`M25 81Q${w/2} 90 ${w-25} 81M27 142H${w-27}`,'none','stroke="#e0e3cb" stroke-width="3"')+rect(7,145,w-14,12,'#8ca18f',6,'stroke="none"')+rect(-9,53,39,105,'#9fb3a3',16)+rect(w-30,53,39,105,'#9fb3a3',16)+rect(25,152,14,30,wood,3)+rect(w-39,152,14,30,wood,3)+line(w/2,80,w/2,147,'#8fa38f',2));
  });}
  function tree(x,y,s=1,kind=0) {group(x,y,s,()=>{
    shadow(0,380,138,23);
    detail('大树树干',path('M-17 380Q-8 215 -37 118L16 100Q9 236 33 380Z','#c8ac87')+path('M-8 255L-55 208M5 216L53 157','none','stroke="#b29576" stroke-width="13"')+path('M1 288L7 348','none','stroke="#a58d73" stroke-width="2"'));
    [[-67,96,88,69],[39,76,97,83],[-12,5,89,81],[98,121,66,59],[-103,155,67,64],[0,154,103,63]].forEach(([a,b,c,d],i)=>detail('树冠',ellipse(a,b,c,d,i%2?'#aabea3':'#b8c8aa','stroke="#91a685" stroke-width="2"')));
    for(let i=0;i<18;i++){const a=Math.sin(i*5+layout)*112,b=30+((i*43)%141);detail('树梢叶簇',path(`M${a} ${b}q8 -10 17 -5M${a+12} ${b+3}q10 -8 17 -1`,'none','stroke="#8fa47f" stroke-width="2"'));}
    raw(path('M-114 88Q-89 30 -37 39M-46 -28Q-11 -59 33 -27M36 34Q83 27 104 65','none','stroke="#d6dfbb" stroke-width="9" opacity=".55"')+path('M-4 166Q-10 230 8 273M17 290L23 344','none','stroke="#e8d4ad" stroke-width="3"'));
  });}
  function stones() {for(let i=0;i<22;i++){const x=45+(i*197)%1490,y=730+(i*43)%280;detail('地面小石',ellipse(x,y,5+(i%4),2+(i%3),'#c7b59a','stroke="#ab9a84" stroke-width="1.5"'));}}
  function bunting(x,y,w,n=12) {raw(path(`M${x} ${y}Q${x+w/2} ${y+70} ${x+w} ${y}`,'none','stroke-width="2"'));for(let i=0;i<n;i++){const a=x+(i+.5)*w/n,b=y+34*Math.sin((i+.5)/n*Math.PI);detail('布旗',path(`M${a-15} ${b}l29 3l-12 28Z`,COLORS[(i+layout)%7],'stroke-width="1.5"'));}}
  function awning(x,y,w,color='#c7a49a') {group(x,y,1,()=>{
    detail('条纹遮阳篷',path(`M20 0H${w-20}L${w} 91H0Z`,cream));
    for(let i=0;i<Math.floor(w/40);i++) {const a=i*40;raw(path(`M${20+a*(w-40)/w} 0h${20*(w-40)/w}L${a+20} 91H${a}Z`,color,'stroke="none"'));detail('篷边小垂褶',path(`M${a} 91h40v13q-20 21 -40 0Z`,i%2?cream:color,'stroke-width="2"'));}
    raw(line(0,91,w,91,ink,3));
  });}
  function fence(x,y,w,white=false) {for(let i=0;i<Math.floor(w/38);i++)detail('篱笆木条',path(`M${x+i*38} ${y+110}V${y+12}l12 -12l12 12v98Z`,white?'#f2e8d1':'#c9b18b','stroke-width="2"'));raw(line(x-7,y+40,x+w,y+40,white?'#eadcc0':'#b69c77',8)+line(x-7,y+82,x+w,y+82,white?'#eadcc0':'#b69c77',8));}
  function rug(x,y,w,h) {shadow(x,y+8,w+14,h+7);detail('编织地毯',ellipse(x,y,w,h,'#d9bda7','stroke="#be9f87" stroke-width="4"')+ellipse(x,y,w-4,h-3,'url(#linen)','stroke="none"')+ellipse(x,y,w-12,h-8,'none','stroke="#f6e5cc" stroke-width="3" stroke-dasharray="5 9"')+ellipse(x,y,w-26,h-16,'none','stroke="#c3a58d" stroke-width="2"'));}
  function fern(x,y,s=1) {group(x,y,s,()=>{
    for(let j=0;j<5;j++){const dx=(j-2)*23,top=-43-Math.abs(j-2)*-7;detail('蕨叶簇',path(`M0 0Q${dx*.3} -28 ${dx} ${top}`,'none','stroke="#7b9876" stroke-width="2"')+[0,1,2,3].map(k=>{const xx=dx*(k+1)/5,yy=top*(k+1)/5;return path(`M${xx} ${yy}q-16 -13 -19 -4q3 8 19 4q12 -17 18 -10q-3 9 -18 10Z`,'#9eb48b','stroke="#829c77" stroke-width="1"');}).join(''));}
  });}
  function stack(x,y,s=1) {group(x,y,s,()=>{
    shadow(47,37,66,11);
    for(let i=0;i<3;i++)detail('平放书册',rect(i%2*5,22-i*13,94-i*4,13,COLORS[(i+layout+3)%7],2)+rect(5+i%2*5,25-i*13,80-i*4,6,'#f7e8c8',1,'stroke-width="1"')+line(10+i%2*5,28-i*13,75,28-i*13,'#cfb991',.8));
  });}
  function teapot(x,y,s=1) {group(x,y,s,()=>{
    shadow(34,58,54,11);
    detail('花纹茶壶',path('M62 24Q83 13 79 36Q74 47 65 40M9 28L-8 20L4 43Q10 50 16 43','url(#ceramic)')+ellipse(36,34,31,25,'url(#ceramic)')+ellipse(36,14,24,6,'#ddcba8')+circle(36,7,6,'#9cb09c')+line(19,47,54,47,'#d3b58c',2));
    flower(35,32,.55,'#d9b1a4');
  });}
  function squirrel(x,y,s=1) {group(x,y,s,()=>{
    shadow(36,109,57,11);
    detail('松鼠蓬松尾巴',path('M54 96Q111 101 110 43Q111 7 88 2Q61 -4 65 21Q68 34 83 31Q96 58 61 64Z','url(#copper)')+path('M77 12Q95 5 100 37Q105 75 75 85','none','stroke="#f0cc9e" stroke-width="5"'));
    detail('松鼠完整身体',ellipse(37,78,25,31,'#cda786')+ellipse(37,85,13,20,'#f5e2be')+ellipse(20,106,16,6,'#cda786')+ellipse(54,106,16,6,'#cda786')+path('M11 35L9 6L29 23Q39 18 49 25L65 11L63 42Q68 64 36 66Q6 63 11 35Z','url(#copper)')+circle(24,42,2.3,ink)+circle(48,42,2.3,ink)+path('M31 51l5 4l5 -4M36 55v5','none','stroke-width="1.7"')+ellipse(19,72,8,13,'#e1bc94','transform="rotate(-32 19 72)"')+ellipse(53,72,8,13,'#e1bc94','transform="rotate(32 53 72)"'));
    detail('松鼠橡果',ellipse(36,76,10,13,'#c8a077')+ellipse(36,67,12,5,'#a48762')+line(36,63,39,58,'#8d7958',2));
  });}
  function sconce(x,y,s=1) {group(x,y,s,()=>{
    raw(circle(0,0,82,'url(#sun)','stroke="none"'));
    detail('黄铜壁灯',ellipse(0,17,15,22,'url(#copper)')+path('M0 12Q30 12 28 -5','none','stroke="#a88660" stroke-width="5"')+path('M11 -33H43L53 -6Q29 4 2 -6Z','#eddbac')+path('M14 -30H40L48 -8Q29 -1 8 -8Z','url(#linen)','stroke="none"'));
  });}
  function floor(interior=true) {
    raw(rect(0,0,1600,1050,interior?'#f4e8d0':'#e5e6cf'));
    if(interior){raw(rect(0,0,1600,650,'url(#wall)'));raw(rect(0,0,1600,650,['#f1e3c9','#f0e0c5','#e7e6ce','#c3c8c2','#f0dcd0','#e5e7d7'][theme],0,'opacity=".32" stroke="none"'));raw(path('M0 665H1600V1050H0Z','url(#floor)','stroke="none"'));for(let i=0;i<9;i++)raw(line(0,680+i*44,1600,680+i*44,'#c5a982',1.6));for(let row=0;row<9;row++)for(let j=0;j<6;j++)raw(line(j*300+(row%2)*150,680+row*44,j*300+(row%2)*150,724+row*44,'#cdb796',1.4));for(let i=0;i<24;i++){const x=31+(i*193)%1500,y=694+(i*37)%340;raw(path(`M${x} ${y}q20 -4 43 0m-27 5q23 -3 57 0`,'none','stroke="#bd9e77" stroke-width=".9" opacity=".55"'));}raw(rect(0,632,1600,28,'url(#woodEdge)')+line(0,633,1600,633,'#ebd6b5',3)+path('M0 661H1600V680H0Z','#8f775c','opacity=".1" stroke="none"'));if(theme!==3)raw(path('M1120 518L1400 518L1190 1030H620Z','#fff4ce','opacity=".15" stroke="none"'));}
    else {raw(rect(0,0,1600,620,'url(#sky)'));raw(ellipse(1290,115,260,230,'url(#sun)','stroke="none"'));raw(path('M0 393Q200 295 451 386T870 362T1600 375V700H0Z','#bfcdb0','stroke="none"'));raw(path('M0 661Q401 597 796 665T1600 632V1050H0Z','#e7d9b9','stroke="none"'));stones();
      for(let i=0;i<20;i++){const x=36+(i*227)%1510,y=710+(i*61)%315;detail('路边细草',path(`M${x} ${y}q-7 -14 -15 -14m15 14q0 -20 6 -23m-6 23q12 -15 21 -13`,'none','stroke="#a2ad85" stroke-width="1.5"'));}
    }
  }
  // 五种布置使用不同家具偏移、摆放组合、装饰序列和建筑局部位置。
  const shifts=[{a:0,b:0,c:0},{a:55,b:-48,c:28},{a:-45,b:44,c:-28},{a:32,b:55,c:38},{a:-55,b:-56,c:-38}][layout];
  const {a:A,b:B,c:C}=shifts;
  if(theme===0) {
    floor(false);
    // 咖啡街独有的砖花箱、碎石路、窗上爬藤；先画环境，避免压住桌面答案。
    for(let row=0;row<3;row++)for(let i=0;i<12;i++){const x=26+i*137+(row%2)*54,y=846+row*73;raw(path(`M${x} ${y}l67 -10l39 11l-60 12Z`,'#e4ceb0','stroke="#d1b899" stroke-width="1.1"'));}
    raw(ellipse(1260,145,77,70,'#f4e5b9','stroke="none"'));
    tree(93,265,.88);tree(1519,270,.85);
    // 街道立面：三间有纵深的店面组成连续街景。
    raw(path('M165 610V247L381 96L582 250V610Z','#e9cfb0')+path('M145 252L380 78L601 252L579 266L380 119L169 272Z','#b8bca5'));
    raw(rect(568,191,561,435,'#e9dbbe',5)+rect(590,170,518,31,'#c4ad88',3)+rect(1118,294,326,332,'#d8c5ae',5)+path('M1099 294L1285 164L1465 294Z','#c4aa9c'));
    windowPane(219,290,127,235,true);windowPane(405,290,127,235,false);windowPane(1167,344,205,224,false);
    raw(rect(635,313,150,284,'#9fac98',55)+rect(651,329,118,185,'#c6d7ca',44)+rect(808,313,254,260,'#acbaa5',7)+rect(823,329,224,226,'#dbe3ce',4));
    raw(line(936,329,936,555,'#aa9778',7)+line(823,441,1047,441,'#aa9778',7));
    detail('门把手',circle(765,530,5,'#aa8a64'));
    raw(rect(721,213,278,64,'#718a75',10)+text(860,254,'PETIT CAFÉ',29,'#fff0d3'));
    awning(603,281,500,layout%2?'#b3bba5':'#d2a69a');
    raw(rect(184,598,1244,24,'#c5ac89',4));
    clockFace(1280,258,.8,true);
    plant(186,516,.82,true);plant(478,514,.8,false);plant(1354,514,.9,false);
    frame(1140,607,.8,true);
    // 橱窗内的杯碟、甜点与小罐。
    for(let i=0;i<4;i++){jar(831+i*49,478,.67,false,COLORS[(i+layout)%7]);cake(837+i*49,416,.55);}
    jar(1164,518,.75,true);
    bunting(172,143,1180,17);
    fence(34,634,155);fence(1395,634,172);
    raw(path('M0 811Q500 730 967 768T1600 768','none','stroke="#cab99c" stroke-width="3"'));
    detail('砖砌花箱',rect(62,681,134,64,'#c29c84',7)+rect(54,672,151,16,'url(#copper)',4)+path('M66 706H192M66 726H192M95 689V706M154 689V706M123 707V726M94 727V742M155 727V742','none','stroke="#e2c5a6" stroke-width="2"'));
    [76,105,136,169].forEach((x,i)=>{plant(x,610-i%2*8,.4,false,true);});
    detail('咖啡街门口脚垫',path('M655 602H761L777 628H641Z','url(#gingham)','stroke="#b69875" stroke-width="1.5"'));
    detail('店墙攀援枝',path('M1114 558Q1117 434 1100 345Q1089 311 1122 286','none','stroke="#8f9f79" stroke-width="3"'));
    for(let i=0;i<9;i++){const y=319+i*23;detail('店墙藤叶',ellipse(1106+(i%2?9:-9),y,10,4,'url(#leaf)',`transform="rotate(${i%2?35:-35} 1106 ${y})"`));}
    // 左侧露天餐桌，中央招牌，右侧推车；前景留通行空间。
    table(228+A,776,271,151);cup(268+A,714,1,true);cake(378+A,709,1,true);plant(319+A,653,.65,false);
    stool(235+A,865,.9);stool(485+A,831,.85);cushion(422+A,797,.8,true);
    raw(path(`M642 644L618 843M748 644L773 843`,'none','stroke="#a7896b" stroke-width="9"')+rect(639,628,112,151,'#677c67',9)+text(695,667,'TODAY',14,'#f5ead4')+text(695,705,'COFFEE',12,'#f5ead4')+path('M661 733q29 -15 66 0M670 748h51','none','stroke="#e4d5b7" stroke-width="2"'));
    rabbit(784+C,647,.85,true);
    // 餐车及摆放的果酱、面包、藤篮。
    raw(rect(1020+B,701,330,139,'#b1bca7',12)+rect(1004+B,681,362,27,'#cfb08a',8)+circle(1070+B,849,31,'#b29876')+circle(1305+B,849,31,'#b29876')+circle(1070+B,849,12,'#e6d2ae')+circle(1305+B,849,12,'#e6d2ae')+line(1350+B,720,1394+B,688,wood,9));
    basket(1034+B,619,.9,true);bread(1157+B,649,1,true);jar(1260+B,618,1,true);
    raw(rect(1060+B,735,229,68,'#e7d9bb',7));motif(1168+B,770,true,'餐车木牌上的小叶纹');
    cat(1315+B,875,.83,true);plant(111,848,1.15,false);plant(1444,837,1.1,false);
    table(620+C,945,200,91);book(653+C,866,.85,true);cup(721+C,893,.75,false);lamp(858+C,832,.78,true);
    basket(975,902,.85,false);
    detail('咖啡陶壶',path('M515 944Q512 926 528 924H555Q573 934 564 956Q538 969 519 955Z','url(#ceramic)')+path('M561 931Q583 923 577 942Q571 949 566 944','none','stroke="#a58e73" stroke-width="4"')+ellipse(541,924,16,5,'#ad9375')+circle(541,917,4,'#9cafa1'));
    fern(23,1018,.85);fern(1522,1006,.78);
  } else if(theme===1) {
    floor(true);
    detail('杂货铺墙板',rect(39,64,1518,91,'#e4d2b1',5)+line(42,151,1553,151,'#c4a984',2));
    raw(rect(33,38,1534,590,'none',12,'stroke="#c5ac89" stroke-width="8"')+line(47,164,1554,164,'#dac7a5',6));
    windowPane(1094,168,343,351,true);
    shelf(86,214,280,371,3,false);shelf(413+A,230,282,350,3,false);
    raw(rect(77,180,300,42,'#9caa8f',6)+text(227,208,'PANTRY',22,'#fff1d6')+rect(407+A,191,294,41,'#c39f88',6)+text(554+A,218,'DAILY GOODS',19,'#fff1d6'));
    clockFace(816,103,1,true);frame(1470,230,.8,true);
    bunting(97,71,577,8);
    raw(rect(752,380,270,207,'#d2b18c',9)+rect(737,366,300,23,'#b99b75',4)+line(888,390,888,578,'#aa8c6d',4));
    basket(778,305,.9,true);jar(922,299,1,true);
    plant(1267,455,.85,true);cup(1167,480,.85,true);
    // 挂物区：围裙、布袋、花束，悬挂高度各不相同。
    raw(line(762,200,1013,200,wood,10));
    for(let i=0;i<4;i++){const x=771+i*66;detail('悬挂布袋',path(`M${x} 235q25 -40 49 0v77q-22 15 -49 0Z`,COLORS[(i+layout)%7])+path(`M${x+8} 241q17 -42 34 0`,'none','stroke-width="3"'));flower(x+24,276,.62,'#f5e3c2');}
    // 前景货台与两组果蔬箱。
    raw(path(`M${101+B} 696H569L543 887H121Z`,'url(#woodEdge)')+rect(86+B,668,490-B,37,'url(#wood)',5));
    for(let row=0;row<2;row++)for(let i=0;i<3;i++){const x=126+i*139,y=733+row*64;detail('木箱小隔间',rect(x,y,122,57,'#d6bd94',5));for(let j=0;j<4;j++)detail('新鲜蔬果',ellipse(x+18+j*27,y+22+(j%2)*8,15,13,COLORS[(i+row+layout)%3]));}
    basket(129+B,590,1,true);bread(272,633,1,true);plant(405,568,.9,false);jar(500,603,1,true);
    rabbit(616+C,658,1,true);
    raw(rect(946+A,654,492,204,'#c0b8a0',9)+rect(927+A,630,532,31,'#d7b892',7)+line(1096+A,675,1096+A,831,'#a2967e',3)+line(1290+A,675,1290+A,831,'#a2967e',3)+rect(1116+A,683,151,140,'#d8ceb4',8));
    for(let i=0;i<3;i++)raw(rect(958+A,680+i*47,116,34,'#d9c6a6',5)+ellipse(1016+A,696+i*47,7,4,'#a78b6c'));
    lamp(969+A,508,1,true);book(1080+A,555,1,true);jar(1184+A,560,1,true);cup(1342+A,581,1,false);
    rug(797,914,162,67);stool(767,877,1);cushion(761,819,1,true);cat(1284+A,896,.8,true);
    plant(76,884,1.06,false);basket(363,944,.85,false);plant(1447,851,1.03,false);
    for(let i=0;i<2;i++)basket(1039+i*113,918,.67,false);
    basket(1113,1001,.5,false);
    // 低位袋装食材、铜秤与蒜辫，让杂货铺有明确工作用途。
    detail('杂货铜秤',rect(705,610,133,16,'url(#wood)',4)+path('M746 610L760 573H782L796 610Z','url(#copper)')+circle(771,570,27,'#dfc69e')+circle(771,570,21,'#fff0d2')+path('M771 570l12 -11','none','stroke-width="2"')+ellipse(771,537,60,9,'url(#copper)'));
    raw(line(1122,96,1335,96,'#bca27c',4));
    for(let i=0;i<6;i++){const x=1131+i*36;detail('吊挂蒜辫',path(`M${x} 98q-3 19 0 37`,'none','stroke="#b09c72" stroke-width="2"')+ellipse(x,132,8,10,'#f8edce')+ellipse(x-4,128,4,7,'#eee1c0')+line(x,123,x+3,118,'#96a17b',1.5));}
    for(let i=0;i<3;i++){const x=561+i*91,y=959-i%2*25;detail('亚麻粮食袋',path(`M${x} ${y-52}q17 -14 40 -1l10 42q-20 20 -56 1Z`,'#ddc59c')+path(`M${x+1} ${y-48}q17 6 36 -1`,'none','stroke="#a9916e" stroke-width="2"')+rect(x+1,y-45,42,41,'url(#linen)',7,'stroke="none"')+ellipse(x+21,y-24,12,8,'#f8ead0'));}
    squirrel(892,912,.8);stack(1393,607,.65);
  } else if(theme===2) {
    floor(false);
    for(let i=0;i<10;i++){const x=61+(i*159)%1450,y=712+(i*57)%293;detail('林间落叶',path(`M${x-7} ${y}q0 -11 15 -6q0 13 -15 6Z`,i%2?'#c1aa7c':'#b4be93','stroke="#9e9c74" stroke-width="1"'));}
    // 远处林间纵深：细树干与透光树影，前景加蕨类与落叶。
    for(let i=0;i<12;i++){const x=25+i*141;raw(path(`M${x} 520V205m0 87l-28 -34m28 79l32 -44`,'none','stroke="#b8c6a9" stroke-width="8"'));}
    raw(path('M758 509Q587 698 692 802Q795 889 474 1050H1038Q1138 900 922 749Q794 636 973 511Z','#eddfbe','stroke="none"'));
    tree(121,182,1.03);tree(488,80,.94);tree(1063,78,1.05);tree(1487,171,1.05);
    raw(path('M0 536Q286 478 567 540M1064 539Q1356 468 1600 539','none','stroke="#a8bb98" stroke-width="28"'));
    bunting(166,230,1257,19);
    // 两座有屋顶、台面和支撑的森林市集摊位。
    const market=(x,y,w,color)=>{raw(rect(x+22,y+70,13,287,'#b19872',3)+rect(x+w-35,y+70,13,287,'#b19872',3)+path(`M${x} ${y+88}L${x+44} ${y}H${x+w-44}L${x+w} ${y+88}Z`,color)+rect(x-9,y+269,w+18,29,'#cbb28c',5)+rect(x+15,y+298,w-30,93,'#dbc5a2',5));for(let i=0;i<6;i++)raw(line(x+33+i*(w-66)/6,y+310,x+33+i*(w-66)/6,y+379,'#ba9e7b',2));};
    market(172+A,351,419,'#bdc8a6');market(1031+B,386,407,'#d7b29f');
    raw(text(382+A,408,'FOREST PANTRY',23)+text(1236+B,442,'WILD BLOOMS',23));
    for(let i=0;i<5;i++)jar(206+A+i*71,550,.9,false,COLORS[(i+layout)%7]);
    basket(210+A,514,.95,true);jar(347+A,487,1,true);bread(462+A,512,1,true);
    plant(1064+B,557,.92,true);plant(1187+B,547,.95,false);plant(1330+B,542,.99,false);
    raw(line(679,384,679,586,wood,9)+line(891,306,891,520,wood,9));
    frame(641,373,.85,true);clockFace(891,322,.82,true);
    // 树干旁的旅人书和暖灯。
    raw(rect(716,528,179,72,'#c9ae85',10)+ellipse(807,529,89,26,'#e2caa0')+path('M748 533Q803 551 858 533','none','stroke="#b39975" stroke-width="2"'));
    book(749,466,.82,true);lamp(828,434,.86,true);
    for(let i=0;i<13;i++){const x=47+(i*109)%1490,y=794+(i*71)%231;if(x>750&&x<1040)continue;detail('林间蘑菇',rect(x,y,8,23,'#f4e5c7',4)+path(`M${x-10} ${y+2}q14 -26 29 0Z`,'#cfa393')+circle(x-1,y-3,2.5,cream)+circle(x+10,y-4,2,cream));}
    rabbit(633+C,614,.92,true);cat(933+C,700,.9,true);
    rug(409+A,907,248,96);table(258+A,862,270,123);cup(290+A,807,1,true);cake(413+A,801,1,true);cushion(158+A,879,1,true);
    basket(525+A,896,.9,true);jar(653+A,914,.8,true);
    // 右前景花农的手推车。
    raw(path('M1122 793L1149 923H1387L1434 793Z','#beac89')+rect(1106,772,344,29,'#d1bc98',6)+circle(1179,932,35,'#ae9777')+circle(1380,932,35,'#ae9777')+circle(1179,932,17,'#e6d4b0')+circle(1380,932,17,'#e6d4b0')+line(1431,804,1502,765,wood,10));
    basket(1144,707,.9,false);plant(1271,672,.9,false);cup(1359,727,.82,true);
    plant(29,890,1.05,false);plant(1486,898,.85,false);
    fern(145,1021,1.1);fern(990,1014,1);fern(1440,1009,1.05);
    detail('野餐格纹布',path('M708 877Q777 863 841 890L834 921Q773 905 712 912Z','url(#gingham)','stroke="#c5ad8b" stroke-width="1.8"'));
    teapot(730,853,.65);squirrel(869,567,.72);
  } else if(theme===3) {
    floor(true);
    sconce(579,421,.7);sconce(963,418,.7);
    raw(path('M0 125L800 15L1600 125','none','stroke="#b99e7c" stroke-width="24"')+line(63,141,63,636,'#b99e7c',17)+line(1538,141,1538,636,'#b99e7c',17));
    windowPane(676,159,251,388,true);
    shelf(94,192,468,394,4,true);shelf(1019,191,477,399,4,true);
    raw(rect(106,146,444,42,'#aab69e',5)+text(328,176,'A LITTLE LIBRARY',22,'#fff2d8')+rect(1032,146,451,41,'#c4a29c',5)+text(1257,175,'STORIES & TEA',22,'#fff2d8'));
    clockFace(803,90,.9,true);frame(583,214,.75,true);
    // 阶梯状置书架，不做整页物件网格。
    raw(path('M1432 316L1336 648M1471 324L1383 658','none','stroke="#b29574" stroke-width="12"'));
    for(let i=0;i<6;i++)raw(line(1422-i*13,359+i*46,1461-i*13,365+i*46,'#c1a481',9));
    plant(660,485,.86,true);cup(859,513,.83,true);
    // 落地灯先于前景家具绘制，灯脚真实落地，桌面书不被灯座穿过。
    shadow(569,879,47,13);
    raw(line(569,591,569,875,'url(#woodEdge)',7)+path('M527 576H611L632 628H506Z','#d9be8e')+path('M531 580H607L625 625H513Z','url(#linen)','stroke="none"')+ellipse(569,878,36,8,'url(#wood)'));
    sofa(121+A,704,361);cushion(149+A,730,.93,true);cushion(364+A,726,.95,false,'#d9c294');
    table(503+A,820,265,143);book(548+A,734,1,true);cup(642+A,766,1,false);cake(687+A,759,.8,true);
    rug(457+A,934,358,80);
    raw(rect(988+B,707,431,30,'#d7bc95',6)+path(`M${1010+B} 737l-16 172h21l26 -172M${1367+B} 737l20 172h23l-13 -172`,wood)+rect(1167+B,743,220,83,'#d6c09c',6)+ellipse(1274+B,785,10,4,'#ad8f6c'));
    lamp(1007+B,591,1,true);jar(1123+B,645,.9,true);book(1233+B,632,1,true);cup(1320+B,660,1,true);
    stool(1155+B,902,1);cushion(1155+B,844,.85,false);rabbit(841+C,734,.95,true);cat(1342+B,876,.87,true);
    plant(49,867,1.12,false);plant(1472,833,1.13,false);
    basket(649,943,.86,true);jar(768,935,.85,true);
    // 前景自然摊开的阅读册与角落落地灯。
    detail('摊开的书',path('M301 941Q335 925 371 941Q405 925 441 941L439 989Q406 975 371 990Q335 977 303 989Z','#faf0d7')+line(371,943,371,986,'#bfa787',2));
    for(let i=0;i<4;i++)raw(path(`M311 ${949+i*8}q23 -7 49 0M382 ${949+i*8}q23 -7 46 0`,'none','stroke="#c1af90" stroke-width="1.5"'));
    stack(85,1011,1.05);stack(967,985,.8);teapot(885,929,.72);
    detail('读书眼镜',ellipse(480,988,16,9,'none','stroke="#a48560" stroke-width="2"')+ellipse(520,988,16,9,'none','stroke="#a48560" stroke-width="2"')+path('M496 986q4 -5 8 0M465 984l-10 -8M535 984l9 -8','none','stroke="#a48560" stroke-width="2"'));
    detail('流苏书签',path('M373 967l12 7l-2 34l-6 -6l-6 5Z','#a3b3a0','stroke-width="1.2"')+path('M376 1008l-1 12m3 -12v14m3 -15l2 12','none','stroke="#b29b76" stroke-width="1.2"'));
    detail('图书馆告示',rect(602,320,45,68,'#f3e3be',2,'transform="rotate(-6 624 354)"')+circle(625,322,3,'#b28f6c')+path('M610 341h27m-28 8h23m-22 8h26m-25 8h19','none','stroke="#aa9577" stroke-width="1.3"'));
  } else if(theme===4) {
    floor(true);
    // 墙上悬挂的烤盘有独立铜色边缘、高光与挂孔。
    for(let i=0;i<5;i++){const x=110+i*90;detail('铜制烤盘',line(x+25,108,x+25,134,'#aa8d67',4)+rect(x,131,52,63,'url(#copper)',8)+rect(x+6,138,40,49,'none',5,'stroke="#f3d4a5" stroke-width="2"')+circle(x+25,114,3,'#e9c99b'));}
    // 整墙烘焙空间；淡色墙砖只作为结构，不计入物件数量。
    for(let row=0;row<5;row++)for(let col=0;col<14;col++)raw(rect(col*120-(row%2)*60,369+row*49,118,47,'#efdfc8',3,'stroke="#d8c3aa" stroke-width="1.4"'));
    windowPane(1048,142,363,356,true);
    for(let i=0;i<7;i++)jar(1072+i*48,86,.62,false,COLORS[(i+layout)%7]);
    detail('香料罐小搁板',rect(1057,131,366,11,'#bd9e7b',3));
    shelf(91,220,350,341,3,false);raw(rect(78,170,376,47,'#bc9c98',7)+text(266,202,'SUGAR & FLOUR',23,'#fff2db'));
    clockFace(805,103,1,true);frame(931,203,.8,true);
    raw(rect(542,300,373,312,'#8e775d',17,'stroke="none" opacity=".12"')+rect(535,290,373,312,'#c6bba6',17)+rect(556,337,331,215,'#8e8b76',15)+rect(580,359,284,157,'#d3c3a2',26)+rect(569,308,298,14,'#e6d9c0',4)+line(599,538,847,538,'#987653',11)+line(599,535,847,535,'#d8bb94',5)+path('M591 381L631 362H667L590 421M802 502L852 462V479L828 502','none','stroke="#f4ddb3" stroke-width="5" opacity=".2"'));
    [591,658,726,795,857].forEach(x=>detail('烤箱旋钮',circle(x,576,11,'#e6d5b5')+line(x,569,x,574,ink,2)));
    for(let i=0;i<4;i++)bread(595+i*65,441,.82,false);
    raw(path('M584 287L613 181H829L863 287Z','#d1b6a1')+rect(590,271,268,24,'#bc9e89',4));
    raw(line(1080,547,1424,547,wood,8));
    for(let i=0;i<6;i++){let x=1098+i*59;
      const shapes=[ellipse(x,601,12,22,'none','stroke="#99a59a" stroke-width="2"')+ellipse(x,601,5,22,'none','stroke="#99a59a" stroke-width="1.5"'),path(`M${x-12} 583h24v37h-24Z`,'url(#wood)')+path(`M${x-5} 590v22m10 -22v22`,'none','stroke="#a98b67" stroke-width="2"'),ellipse(x,601,11,20,'url(#wood)')+line(x-3,587,x-3,604,'#f4dfb5',2),circle(x,600,18,'#c9d2bf')+circle(x,600,13,'none','stroke="#98a692" stroke-width="1" stroke-dasharray="2 3"'),path(`M${x-14} 586q-7 36 14 33q20 -3 14 -33Z`,'url(#copper)'),rect(x-10,582,20,42,'url(#wood)',7)+line(x,624,x,632,'#aa8d67',3)];
      detail('悬挂烘焙工具',line(x,552,x,581,ink,3)+shapes[i]+circle(x,554,2,'#e2d2b0','stroke="none"'));
    }
    plant(1057,439,.83,true);jar(1200,449,.84,true);cup(1324,464,.83,false);
    // 中央岛台加左前方甜点陈列车。
    shadow(968+A,885,402,30);
    raw(rect(592+A,704,736,178,'#d5b4a5',12)+rect(1299+A,711,29,161,'#b89684',7,'stroke="none" opacity=".3"')+rect(571+A,681,778,36,'url(#woodEdge)',8)+rect(571+A,675,778,28,'url(#wood)',8)+line(583+A,679,1335+A,679,'#f3dfbc',2));
    for(let i=0;i<4;i++){raw(rect(610+A+i*174,732,150,120,'#e8c8b7',7));detail('抽屉拉手',line(661+A+i*174,748,710+A+i*174,748,'#b08c72',4));}
    basket(618+A,601,.91,true);bread(751+A,640,1,true);jar(884+A,606,1,true);cake(997+A,625,1,true);cup(1092+A,630,1,true);book(1227+A,598,1,true);
    // 面粉碗、擀面杖、奶油裱花袋。
    detail('搅拌碗',path(`M${767+A} 606q55 22 105 0q-3 61 -53 54q-45 1 -52 -54Z`,'#a8bdb4')+ellipse(819+A,606,53,15,cream)+line(827+A,606,855+A,552,wood,7));
    detail('擀面杖',line(931+A,660,1010+A,660,wood,11)+rect(946+A,651,48,18,'#dfc29b',5));
    raw(rect(111,688,355,167,'#b7c0aa',9)+rect(91,665,397,27,'#d6bc96',6)+circle(150,865,22,'#a58c70')+circle(432,865,22,'#a58c70'));
    for(let row=0;row<2;row++)for(let i=0;i<4;i++)cake(137+i*77,705+row*72,.66);
    cake(129,614,1,true);lamp(374,544,1,true);rabbit(473+B,832,.9,true);cat(1346+B,859,.85,true);
    cushion(942,909,.9,true);stool(939,958,.9);plant(35,881,1.05,false);plant(1469,855,1.03,false);
    basket(708,938,.8,false);bunting(116,68,533,8);
    // 原有台面保留工作空间；前景再放冷却架、桃子筐与配方卡。
    detail('冷却金属架',path('M1034 977l51 -24h158l-28 24Z','#aab2a0','stroke="#879380" stroke-width="2"'));
    for(let i=0;i<8;i++)raw(line(1050+i*21,972,1087+i*18,957,'#dce0c9',1.5));
    for(let i=0;i<4;i++)bread(1066+i*37,942,.52,false);
    detail('桃子木箱',rect(165,953,218,71,'url(#wood)',6)+path('M170 976H376M171 999H375M179 955V1018M368 956V1018','none','stroke="#ad8a61" stroke-width="2"'));
    for(let i=0;i<10;i++){const x=185+i%5*39,y=943-Math.floor(i/5)*23;detail('筐中桃子',circle(x,y,17,i%2?'#e3b49a':'#e6c39f')+path(`M${x} ${y-14}q-6 13 -1 25`,'none','stroke="#c28e7e" stroke-width="1.2"')+ellipse(x+7,y-17,9,4,'url(#leaf)','transform="rotate(-24 '+(x+7)+' '+(y-17)+')"')+circle(x-6,y-6,4,'#f3d4b4','stroke="none" opacity=".6"'));}
    for(let i=0;i<3;i++){const x=634+i*82;detail('奶油配方卡',rect(x,192,57,77,'#f5e5c3',3,'transform="rotate('+((i-1)*5)+' '+(x+28)+' 230)"')+circle(x+28,195,3,'#ae8c64')+path(`M${x+10} 211h35m-35 8h31m-31 8h35m-35 8h22m-22 8h33`,'none','stroke="#baa17e" stroke-width="1.1"'));}
    for(let i=0;i<5;i++){const x=1031+i*40;detail('晾干百里香',path(`M${x} 97v45m0 -26l-8 -8m8 17l8 -8m-8 18l-8 -8`,'none','stroke="#829570" stroke-width="2"')+ellipse(x-7,108,6,3,'#9aad86')+ellipse(x+7,117,6,3,'#9aad86'));}
    detail('厨房格纹毛巾',path(`M${608+A} 710h85l-7 139q-30 12 -76 -4Z`,'url(#gingham)','stroke="#bd9d82" stroke-width="1.7"')+line(619+A,832,673+A,837,'#b9967b',1.2));
  } else {
    floor(false);
    // 远景海平线、层叠水面、沙滩和中央花园小屋。
    raw(rect(0,329,1600,243,'url(#sea)')+path('M0 390Q300 365 600 397T1200 396T1600 384M0 463Q400 430 720 462T1600 458','none','stroke="#e7e9d8" stroke-width="7"')+path('M0 540Q431 511 744 554T1600 534V664H0Z','#eddfbd','stroke="none"'));
    detail('海边灯塔',path('M1388 337L1397 231H1426L1436 337Z','#f4e9cc')+path('M1393 289h38l-2 -23h-33Z','#c5a194')+rect(1392,215,40,21,'#c3cbc0',4)+path('M1386 216l26 -22l26 22Z','#a1b4ad')+rect(1407,220,10,12,'#f5e5b9',2));
    for(let i=0;i<4;i++)detail('远海飞鸟',path(`M${1127+i*88} ${163+i%2*39}q10 -13 21 0q11 -13 22 0`,'none','stroke="#92a7a1" stroke-width="2"'));
    detail('远海小船',path('M1208 365h80l-18 20h-46Z','#bcb7a2')+line(1244,360,1244,284,'#b3ab91',3)+path('M1237 294l-45 61h45Z','#f7edd6')+path('M1250 304l31 51h-31Z','#ded2b9'));
    raw(path('M421 627V302L805 100L1148 302V627Z','#f3e6ca')+path('M393 307L800 78L1176 307L1154 330L800 120L420 332Z','#a7b8b2')+rect(437,594,695,32,'#cfbb97',4));
    for(let i=0;i<11;i++)raw(line(438,334+i*23,1133,334+i*23,'#ddcfb0',1.4));
    windowPane(481,327,155,238,true,true);windowPane(947,327,155,238,false,true);
    raw(rect(716,296,169,301,'#b2c4b4',61)+rect(735,317,130,168,'#d5e0cd',45)+line(800,317,800,485,'#a99f80',5)+line(739,406,862,406,'#a99f80',5));detail('门把手',circle(860,526,5,'#b39870'));
    clockFace(801,224,.82,true);frame(650,361,.65,true);
    plant(467,521,.85,true);jar(1010,517,.8,true);bunting(431,287,699,11);
    // 花园左侧藤架，右侧木栈道栏杆。
    raw(line(111,332,111,729,wood,17)+line(354,332,354,729,wood,17)+line(70,336,393,336,wood,17)+line(84,308,378,308,wood,13));
    for(let i=0;i<7;i++)raw(line(110+i*39,296,110+i*39,355,wood,9));
    for(let i=0;i<11;i++){const x=89+i*27;detail('藤架叶',ellipse(x,321+Math.sin(i)*21,21,9,'#a8bd98',`transform="rotate(${i%2?25:-28} ${x} ${321+Math.sin(i)*21})"`));if(i%2===0)flower(x,347+(i%3)*15,.7,'#e6b8b7');}
    fence(1175,565,387,true);fence(28,594,352,true);
    raw(path('M714 625Q701 742 857 823Q958 892 913 1050H1260Q1217 902 1047 780Q918 696 891 625Z','#d3bd98','stroke="none"'));
    for(let i=0;i<8;i++)raw(line(755+i*16,653+i*45,900+i*39,653+i*45,'#bca884',2));
    // 花台、下午茶桌、园艺车自然分组。
    sofa(117+A,716,293);cushion(143+A,740,.92,true);cat(293+A,813,.8,true);
    table(499+C,809,252,151);cup(541+C,756,1,true);cake(640+C,749,.9,true);plant(593+C,691,.62,false);
    rabbit(812+B,688,.92,true);stool(714+C,862,.9);
    raw(rect(1155+A,746,276,128,'#b4c2b1',10)+rect(1137+A,726,310,25,'#d9c5a0',7)+circle(1196+A,886,25,'#ac9879')+circle(1390+A,886,25,'#ac9879')+line(1425+A,766,1494+A,716,wood,8));
    basket(1163+A,649,.9,true);jar(1299+A,660,1,true);cup(1380+A,679,.8,true);
    plant(49,864,1.02,false);plant(432+A,881,1.03,false);plant(1444,877,1.05,false);
    rug(685,981,162,50);book(619,906,.88,true);lamp(762,867,.9,true);bread(857,955,.85,true);
    for(let i=0;i<11;i++){const x=58+(i*131)%1435,y=935+(i*29)%90;detail('沙地贝壳',path(`M${x-11} ${y}q1 -22 14 -16q16 1 11 19Z`,'#f4e7cb')+line(x+1,y-13,x+2,y, '#c3ad90',1.4));}
    detail('花园浇水壶',path('M1210 965l-24 -24l5 -9l27 20','url(#copper)')+rect(1210,936,55,46,'url(#copper)',12)+path('M1263 946Q1297 932 1284 966Q1273 980 1263 968','none','stroke="#b08c6a" stroke-width="7"')+ellipse(1237,937,24,7,'#e4c4a2')+line(1227,932,1227,923,'#cfa27b',5));
    detail('藤架风铃',line(228,345,228,400,'#8f9a83',1.4)+path('M207 403q21 -25 42 0v16h-42Z','url(#glass)')+line(228,414,228,447,'#8f9a83',1.3)+path('M219 444h17l-4 32h-11Z','#e6bfb0','stroke-width="1"'));
    fern(83,1007,.7);fern(1419,1020,.6);
  }
  if(targets.length!==16)throw new Error(`第${level+1}关应有16个差异，实际${targets.length}`);
  if(mirrored)for(const t of targets){t.x=1600-t.x;t.label=t.label.replace('右侧','左侧');}
  const data={level,theme:SCENE_THEMES[theme],detailCount,targets,parts,mirrored};cache.set(level,data);return data;
}
// 无运行时随机数：同seed可恢复同一局；候选序号只留在模块内部。
function random32(state) {
  return ()=>{state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};
}
function selection(scene,difficulty,seed) {
  const count={medium:8,hard:12,expert:16}[difficulty];
  // v2旧局没有seed，以0恢复：保留原候选顺序及a/b方向，让found编号继续有效。
  if(seed===0) {
    const selected=scene.targets.slice(0,count).map((_,i)=>i);
    return {selected,flips:scene.targets.map(()=>0),targets:selected.map((index,id)=>({...scene.targets[index],id}))};
  }
  const rng=random32((seed^Math.imul(scene.level+1,0x9E3779B9))>>>0),order=scene.targets.map((_,i)=>i);
  for(let i=order.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  const selected=order.slice(0,count);
  // 翻转a/b是实际图形方向变化，expert16处全选时依旧改变原图和右图的局部状态。
  const flips=scene.targets.map((_,i)=>((Math.imul((seed^i)>>>0,0x45d9f3b)>>>16)^seed^i)&1);
  return {selected,flips,targets:selected.map((index,id)=>({...scene.targets[index],id}))};
}
export function sceneData(level,difficulty='hard',seed=0) {
  validate(level,difficulty,seed);const scene=build(level),{targets}=selection(scene,difficulty,seed);
  return {level,theme:scene.theme,difficulty,seed,detailCount:scene.detailCount,targets};
}
export function renderScene(level,variant=false,found=[],hint=-1,difficulty='hard',seed=0) {
  validate(level,difficulty,seed);const scene=build(level),{selected,flips,targets}=selection(scene,difficulty,seed),chosen=new Set(selected);
  let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1050" viewBox="0 0 1600 1050" role="img" aria-label="${scene.theme.name}，第${level+1}关">${DEFS}<g stroke="${ink}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">`;
  if(scene.mirrored)svg+='<g transform="translate(1600 0) scale(-1 1)">';
  svg+=scene.parts.map(p=>typeof p==='string'?p:((flips[p.id]^(variant&&chosen.has(p.id)?1:0))?p.b:p.a)).join('');
  if(scene.mirrored)svg+='</g>';
  svg+='</g>';
  for(const t of targets){
    if(found.includes(t.id))svg+=`<circle class="found-ring" data-found="${t.id}" cx="${t.x}" cy="${t.y}" r="${t.radius+5}" fill="#a4c6a8" fill-opacity=".14" stroke="#688f75" stroke-width="3"/>`;
    if(hint===t.id)svg+=`<circle class="hint-ring" data-hint="${t.id}" cx="${t.x}" cy="${t.y}" r="${t.radius+10}" fill="#f8cf77" fill-opacity=".22" stroke="#c88e45" stroke-width="4" stroke-dasharray="7 5"/>`;
  }
  // 前缀隔离页面其它插画的defs；同关多份定义完全一致，仍可稳定还原。
  return (svg+'</svg>').replace(/id="([A-Za-z]+)"/g,`id="nn-v3-${level}-$1"`).replace(/url\(#([A-Za-z]+)\)/g,`url(#nn-v3-${level}-$1)`);
}
