import {CATALOG,THEMES,createState,dayKey,completeRound,streakOf,buyItem,validateSave,makeDeck,flipCard,resolveCards} from './1109_核心_v1.mjs';
import {icon,roomSVG,bunnyBadge} from './1109_插画_v1.mjs';
import {renderScene,sceneData,SCENE_THEMES,SCENE_WIDTH,SCENE_HEIGHT} from './1109_精修场景_v3.mjs';
import {mountViewer} from './1109_看图交互_v2.mjs';
import {createStore} from './1109_存档协调_v2.mjs';
import {awardPlay,dailyChallenge,questStatus,claimQuest,chapterProgress,makePuzzle,swapPuzzle,isPuzzleSolved} from './1109_成长规则_v3.mjs';
import {homeView,gamesView,journeyView,dailyView,collectionView,puzzleMenuView,puzzleView,postcardContent,stamps,cardArt} from './1109_游玩界面_v3.mjs';

const KEY='nuonuo-cottage-v1';
const $=selector=>document.querySelector(selector);
const esc=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state=createState(),storageOK=true,route='home',toastTimer,memoryTimer,hintTimer,hint=-1,shopGroup='wall',pendingImport=null;
let viewer=null,camera={zoom:1,x:.5,y:.5},difficulty='hard',compareMode=false,swapped=false,hintStep=0,selectedHint=null;
let memoryFocus=null,selectedChapter=0,puzzleSize=3,puzzleLevel=0,puzzlePeek=false,puzzleNumbers=false,pendingWrites=0;
const ROUTES=['home','games','calendar','difference','memory','memory-menu','journey','daily','collection','puzzle','puzzle-menu'];
const randomSeed=()=>globalThis.crypto?.getRandomValues(new Uint32Array(1))[0]??Math.floor(Math.random()*4294967296);
const DIFFICULTIES={medium:{label:'细心 · 8 处',count:8},hard:{label:'困难 · 12 处',count:12},expert:{label:'专家 · 16 处',count:16}};
const store=createStore({getItem:key=>window.localStorage.getItem(key),setItem:(key,value)=>window.localStorage.setItem(key,value)},KEY);
let calendarMonth=new Date().getMonth(),calendarYear=new Date().getFullYear(),memoryTheme='animals',memoryPairs=6,audio;
try {const saved=localStorage.getItem(KEY);if(saved)adoptState(validateSave(saved));}catch {storageOK=false;}
const today=()=>dayKey();
const eventId=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
const totalDays=()=>Object.keys(state.days).length;
const button=(action,label,extra='',className='button')=>`<button class="${className}" data-action="${action}" ${extra}>${label}</button>`;
const warnings=()=>storageOK?'':'<div class="storage-warning">这台设备暂时无法读取或保存进度。请先到设置里导出备份，避免离开后丢失。</div>';
function clearDifferenceHint() {
 if(selectedHint||hintStep||hint>=0){clearTimeout(toastTimer);$('#toast')?.classList.remove('visible');}
 clearTimeout(hintTimer);hintTimer=null;hint=-1;hintStep=0;selectedHint=null;
}
function adoptState(next,{resetGames=false}={}) {
 const previous=state.activeDifference,game=next.activeDifference;
 if(resetGames||previous?.eventId!==game?.eventId){
  clearDifferenceHint();camera={zoom:1,x:.5,y:.5};compareMode=false;swapped=false;
 }else if(game&&(game.found.includes(selectedHint?.id)||game.found.includes(hint))){
  clearDifferenceHint();
 }
 if(resetGames||state.activePuzzle?.eventId!==next.activePuzzle?.eventId){puzzlePeek=false;puzzleNumbers=false;}
 if(resetGames||state.activeMemory?.eventId!==next.activeMemory?.eventId)clearTimeout(memoryTimer);
 state=next;
}
async function change(transform) {
  pendingWrites++;$('#content').setAttribute('aria-busy','true');
  try {adoptState(await store.update(transform));storageOK=true;renderHeader();return true;}
  catch(error){toast(error.message.includes('备份')?'当前存档需要恢复，请先导出保留一份':error.message);return false;}
  finally {pendingWrites--;if(!pendingWrites)$('#content').removeAttribute('aria-busy');}
}
function toast(message) {
  clearTimeout(toastTimer);const notice=$('#toast');($('#sheet').open?$('#sheet'):$('.app-shell')).append(notice);notice.textContent=message;notice.classList.add('visible');
  toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3000);
}
function sound(success=false) {
 if(!state.settings.sound)return;
 try {
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
  audio ||= new Audio();audio.resume();
  const notes=success?[523.25,659.25,783.99]:[659.25];
  notes.forEach((frequency,i)=>{
   const oscillator=audio.createOscillator(),gain=audio.createGain(),time=audio.currentTime+i*.105;
   oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(.09,time+.015);gain.gain.exponentialRampToValueAtTime(.0001,time+.22);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(time);oscillator.stop(time+.24);
  });
 }catch{}
}
function renderHeader() {
 $('#brand-icon').innerHTML=bunnyBadge();
 $('#wallet').innerHTML=`${icon('star',16)}<span>${state.stars}</span>`;
 $('#settings').innerHTML=icon('settings',20);
 const tab=route==='calendar'?'daily':['memory','memory-menu','difference','games','puzzle','puzzle-menu'].includes(route)?'home':route;
 $('#navigation').innerHTML=[['home','home','小屋'],['journey','leaf','探索'],['daily','calendar','每日'],['collection','heart','收藏']].map(([name,symbol,label])=>`<button class="nav-item ${tab===name?'active':''}" data-action="go" data-route="${name}" ${tab===name?'aria-current="page"':''}><span class="nav-icon">${icon(symbol,22)}</span><span>${label}</span></button>`).join('');
}
function go(next) {
 if(location.hash!==`#${next}`)location.hash=next;
 else {route=next;render();window.scrollTo({top:0,behavior:'instant'});}
}
function openSheet(title,html,kicker='一点点小美好') {
 $('#sheet-title').textContent=title;$('#sheet-kicker').textContent=kicker;$('#sheet-content').innerHTML=html;
 if(!$('#sheet').open)$('#sheet').showModal();
 $('#sheet').scrollTop=0;
}
function closeSheet() {const notice=$('#toast');if(notice)$('.app-shell').append(notice);$('#sheet').close();}
function gameCards() { return gamesView(state); }

function renderHome() { return warnings()+homeView(state); }

function renderGames() { return warnings()+gamesView(state); }

function nextLevel(current=state){return current.activeDifference?.level??Array.from({length:30},(_,i)=>i).find(i=>!current.levelDone.includes(i))??0;}

async function startDifference(level,mode='free') {
 if(!await change(current=>{
  const challenge=mode==='daily'?dailyChallenge(today()):null;
  if(level!==undefined||mode==='daily'||!current.activeDifference){
   const selected=challenge?.level??level??nextLevel(current);
   if(mode==='journey'&&!chapterProgress(current)[Math.floor(selected/5)]?.unlocked)throw new Error('先走完上一章，再来打开这扇小门吧');
   current.activeDifference={level:selected,found:[],eventId:eventId(),difficulty:challenge?.difficulty??(mode==='journey'?'hard':difficulty),seed:challenge?.seed??randomSeed(),mode,challengeDate:challenge?.date??'',hints:0,mistakes:0,startedAt:Date.now()};
  }
  return current;
 }))return;
 difficulty=state.activeDifference?.difficulty||difficulty;closeSheet();go('difference');
}

function showLevels() {
 openSheet('挑一个小世界',`<p>从一整幅小世界里，发现微小的变化。选择难度后再进入关卡。</p><div class="chips">${Object.entries(DIFFICULTIES).map(([id,option])=>button('set-difficulty',option.label,`data-difficulty="${id}" aria-pressed="${difficulty===id}"`,'chip '+(difficulty===id?'active':''))).join('')}</div>${SCENE_THEMES.map((theme,index)=>`<h3 class="level-heading">${theme.name}</h3><div class="level-grid">${Array.from({length:5},(_,n)=>{const level=index*5+n;return button('choose-level',String(level+1).padStart(2,'0'),`data-level="${level}" aria-label="第 ${level+1} 关，${theme.name}${state.levelDone.includes(level)?'，已完成':''}"`,'level-button '+(state.levelDone.includes(level)?'done':''));}).join('')}</div>`).join('')}`,'30 幅高细节场景');
}
function renderDifference() {
 const game=state.activeDifference;if(!game)return renderGames();
 const data=sceneData(game.level,game.difficulty||'hard',game.seed||0);
 return `<div class="play-header">${button('go',icon('back',23),'data-route="games" aria-label="返回游戏列表"','icon-button')}<div class="play-title"><h1>${data.theme.name}</h1><p>第 ${String(game.level+1).padStart(2,'0')} 关 · ${{medium:'细心',hard:'困难',expert:'专家'}[game.difficulty||'hard']} · ${data.targets.length} 处细微变化</p></div><span class="progress">${game.found.length} / ${data.targets.length}</span></div>
 <div class="challenge-note"><span>高细节场景</span><p>放大找一找：小物件、纹理和数量里，藏着不一样。</p></div>
 <section id="detail-viewer" class="detail-viewer ${compareMode?'alternating':''} ${swapped?'show-b':''}"><div class="viewer-toolbar"><div class="zoom-options">${[1,2,3,4,6].map(value=>`<button data-view-zoom="${value}" class="zoom-chip ${camera.zoom===value?'active':''}" aria-label="放大到 ${value} 倍">${value}×</button>`).join('')}</div><span data-zoom-value>${Math.round(camera.zoom*100)}%</span></div>
 <div class="detail-pictures">${[false,true].map(variant=>`<section class="scene-wrap detail-frame ${variant?'frame-b':'frame-a'}"><div class="scene-label"><span>${variant?'B · 找找细小的变化':'A · 原图'}</span><strong>${compareMode?'同位置交替对照':'双图同步移动'}</strong></div><div class="detail-viewport" data-board="${variant?'b':'a'}" tabindex="0" role="application" aria-label="${variant?'变化图':'原图'}，可双指缩放或拖动，键盘方向键移动"><div class="detail-surface">${renderScene(game.level,variant,game.found,hint,game.difficulty||'hard',game.seed||0)}</div><span class="detail-corner">${variant?'B':'A'}</span></div></section>`).join('')}</div>
 <div class="viewer-controls">${button('compare',compareMode?'双图并看':'交替对照',`aria-pressed="${compareMode}"`,'viewer-control')}${compareMode?button('swap',`切换到 ${swapped?'A 原图':'B 变化图'}`,'','viewer-control primary-control'):''}${button('reset-view','重置视野','','viewer-control')}</div></section>
 <div class="play-tools">${button('hint',icon('flower',17)+(hintStep?' 再提示一点':' 给点线索'),'','button secondary')}${button('levels',icon('game',17)+' 换个挑战','','button soft')}</div><p class="memory-foot">双指缩放 / 拖动看细节 · 双击快速放大<br>提示先给大致区域，再给物件线索，最后才圈出来。</p>`;
}
async function hitDifference(point,scale=1) {
 if(route!=='difference'||!state.activeDifference)return;
 const game=state.activeDifference,data=sceneData(game.level,game.difficulty||'hard',game.seed||0),{x,y}=point;
 const target=data.targets.filter(t=>!game.found.includes(t.id)).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y)).find(t=>Math.hypot(t.x-x,t.y-y)<=t.radius);
 if(!target){
  const repeated=data.targets.some(t=>game.found.includes(t.id)&&Math.hypot(t.x-x,t.y-y)<=t.radius);
  if(repeated){toast('这里已经找到啦，看看别处吧');return;}
  await change(current=>{if(current.activeDifference?.eventId===game.eventId)current.activeDifference.mistakes=(current.activeDifference.mistakes||0)+1;return current;});
  toast(scale<2?'放大后再看看，细节会更清楚':'这里好像一样，再对照一下');return;
 }
 let completion=null;
 if(!await change(current=>{
  if(current.activeDifference?.eventId!==game.eventId)return current;
  if(!current.activeDifference.found.includes(target.id))current.activeDifference.found.push(target.id);
  if(current.activeDifference.found.length===data.targets.length){completion=settleGame(current,'difference',game.eventId);return completion.state;}
  return current;
 }))return;
 clearDifferenceHint();sound();
 if(completion?.result)presentRound('difference',completion.game,completion.result);else renderKeepScroll();
}
function renderMemoryMenu() {
 const names={animals:'小动物',sweets:'甜甜点心',garden:'秘密花园'};
 return `<div class="page-heading"><span class="eyebrow">一翻，一对小欢喜</span><h1>和可爱碰个面。</h1><p>翻开两张相同的卡片，让它们找回好朋友。</p></div>${state.activeMemory?`<div class="resume-banner"><div>上次的小伙伴还在这里<small>已配对 ${state.activeMemory.matched.length/2}/${state.activeMemory.pairs} 对</small></div>${button('go','继续','data-route="memory"','text-button')}</div>`:''}<div class="memory-banner polished">${cardArt()}</div><span class="field-label">今天想遇见谁？</span><div class="chips">${Object.keys(THEMES).map(theme=>button('memory-theme',names[theme],`data-theme="${theme}" aria-pressed="${memoryTheme===theme}"`,'chip '+(memoryTheme===theme?'active':''))).join('')}</div><span class="field-label">想玩多久？</span><div class="chips">${[[6,'轻松 · 6 对'],[8,'刚好 · 8 对'],[10,'挑战 · 10 对']].map(([pairs,label])=>button('memory-pairs',label,`data-pairs="${pairs}" aria-pressed="${memoryPairs===pairs}"`,'chip '+(memoryPairs===pairs?'active':''))).join('')}</div><div class="row-spacer"></div>${button('start-memory','准备好啦，开始翻牌','','button full')}<p class="memory-foot">${state.activeMemory?'开始新一局会替换当前未完成的翻牌。':'不催你，不计时，想多久都可以。'}</p>`;
}
async function startMemory() {
 clearTimeout(memoryTimer);
 if(!await change(current=>({...current,activeMemory:{deck:makeDeck(memoryPairs,memoryTheme),open:[],matched:[],moves:0,eventId:eventId(),theme:memoryTheme,pairs:memoryPairs}})))return;
 closeSheet();go('memory');
}
async function startPuzzle() {
 if(!await change(current=>({...current,activePuzzle:{...makePuzzle(puzzleSize,puzzleLevel),eventId:eventId()}})))return;
 closeSheet();go('puzzle');
}
async function handlePuzzle(index) {
 const game=state.activePuzzle;if(!game||puzzlePeek)return;
 let completion=null;
 if(!await change(current=>{
  const active=current.activePuzzle;if(active?.eventId!==game.eventId)return current;
  if(!Number.isInteger(index)||index<0||index>=active.tiles.length)return current;
  if(active.selected===null)active.selected=index;
  else if(active.selected===index)active.selected=null;
  else {current.activePuzzle=swapPuzzle(active,active.selected,index);current.activePuzzle.selected=null;}
  if(isPuzzleSolved(current.activePuzzle)){completion=settleGame(current,'puzzle',game.eventId);return completion.state;}
  return current;
 }))return;
 sound();
 if(completion?.result)presentRound('puzzle',completion.game,completion.result);else renderKeepScroll();
}
function renderMemory() {
 const game=state.activeMemory;if(!game)return renderMemoryMenu();
 return `<div class="play-header">${button('go',icon('back',23),'data-route="games" aria-label="返回游戏列表"','icon-button')}<div class="play-title"><h1>翻出小欢喜</h1><p>每个可爱，都有它的好朋友</p></div><span class="progress">${game.matched.length/2} / ${game.pairs}</span></div><div class="memory-mode-summary"><span>已翻 ${game.moves} 次</span><span>${{animals:'🐰 小动物',sweets:'🍓 甜甜点心',garden:'🌼 秘密花园'}[game.theme]}</span></div><div class="memory-grid" tabindex="-1" role="group" aria-label="翻牌游戏区域">${game.deck.map((card,index)=>{const open=game.open.includes(card.id),matched=game.matched.includes(card.id);return button('flip',open||matched?card.symbol:`<span class="card-back">${bunnyBadge()}</span>`,`data-card="${esc(card.id)}" aria-label="第 ${index+1} 张，${open||matched?card.symbol:'未翻开'}${matched?'，已配对':''}" ${(matched||open||game.open.length>=2)?'disabled':''}`,'memory-card '+(matched?'matched':open?'open':''));}).join('')}</div><p class="memory-foot">翻错也没关系，可爱会等你的。<br>已配好的卡片和进度都会自动保存。</p>${button('go','换个主题','data-route="memory-menu"','button full secondary')}`;
}
async function handleFlip(id) {
 const game=state.activeMemory;if(!game)return;
 const next=flipCard(game,id);if(next===game)return;
 if(!await change(current=>{if(current.activeMemory?.eventId===game.eventId)current.activeMemory=flipCard(current.activeMemory,id);return current;}))return;
 sound();renderKeepScroll();
 if(state.activeMemory?.open.length===2)scheduleMemoryResolve(state.activeMemory.eventId);
}
function scheduleMemoryResolve(session){
  clearTimeout(memoryTimer);
  memoryTimer=setTimeout(async()=>{
   if(!state.activeMemory||state.activeMemory.eventId!==session)return;
   if(!await change(current=>{if(current.activeMemory?.eventId===session)current.activeMemory=resolveCards(current.activeMemory);return current;}))return;
   const pair=state.activeMemory;if(!pair)return;
   if(pair.matched.length===pair.deck.length){await finishRound('memory');}
   else if(route==='memory')renderKeepScroll();
  },650);
}
function settleGame(current,kind,event) {
 const field={difference:'activeDifference',memory:'activeMemory',puzzle:'activePuzzle'}[kind],game=current[field];
 if(!game||game.eventId!==event)return {state:current,result:null};
 const complete=kind==='difference'?game.found.length===sceneData(game.level,game.difficulty||'hard',game.seed||0).targets.length:kind==='memory'?game.matched.length===game.deck.length:isPuzzleSolved(game);
 if(!complete)return {state:current,result:null};
 const date=today(),result=completeRound(current,event,kind,date);
 const growth=awardPlay(result.state,{eventId:event,kind,date,...(kind==='difference'?{level:game.level,difficulty:game.difficulty||'hard',seed:game.seed||0,mode:game.mode||'free',challengeDate:game.challengeDate||'',hints:game.hints||0,mistakes:game.mistakes||0}:{})});
 result.state=growth.state;result.reward+=growth.bonus;result.growth=growth;
 result.state[field]=null;
 return {state:result.state,result,game};
}

async function finishRound(kind) {
 const field={difference:'activeDifference',memory:'activeMemory',puzzle:'activePuzzle'}[kind],game=state[field];if(!game)return;
 let completion;
 if(!await change(current=>{completion=settleGame(current,kind,game.eventId);return completion.state;})||!completion?.result)return;
 presentRound(kind,completion.game,completion.result);
}

function presentRound(kind,game,result) {
 const level=game.level,growth=result.growth;
 sound(true);
 route=kind==='difference'&&game.mode==='journey'?'journey':game.mode==='daily'?'daily':'games';
 if(route==='journey')selectedChapter=Math.floor(level/5);
 history.replaceState(null,'',`#${route}`);render();
 const headline=result.checkedIn?'今天的小花开啦！':'又收集了一点快乐';
 const description=kind==='difference'?`${game.found.length} 处小秘密，都被你找到啦。`:kind==='puzzle'?`${game.size*game.size} 块风景，${game.moves} 次交换，拼成完整的小世界。`:`${game.pairs} 对小伙伴，都找到好朋友啦。`;
 openSheet(headline,`<div class="success"><div class="success-art">${bunnyBadge()}</div><span class="eyebrow">A LITTLE MOMENT TO CELEBRATE</span><h3>${kind==='puzzle'?'散落的小美好，<br>终于在一起。':'每一点小发现，<br>都值得被珍藏。'}</h3><p>${description}</p>${kind==='difference'?`<div class="earned-stamps">${stamps(growth?.stamps||0)}<small>这站已收藏的最好印章</small></div>`:''}<div class="reward">${icon('star',26)} +${result.reward}</div><small>${result.checkedIn?'今日打卡已完成 · ':''}${result.reward===0?'今天的游玩奖励已领完，看看每日目标吧。':'小星星已经放进口袋。'}${result.milestone?`<br>连续 ${result.milestone} 天的小礼物也一起收到啦！`:''}</small>${growth?.newPostcard?`<div class="unlocked-postcard">${icon('heart',21)} 新明信片已收藏：${SCENE_THEMES[growth.postcard].name}</div>`:''}<div class="button-row">${button('go','领取每日目标','data-route="daily"')}${button(kind==='difference'?'next-difference':kind==='puzzle'?'another-puzzle':'another-memory',kind==='difference'?'再逛下一站':'再玩一局',kind==='difference'?`data-level="${(level+1)%30}" data-mode="${game.mode==='journey'?'journey':'free'}"`:'','button secondary')}</div>${growth?.newPostcard?button('postcard','看看新明信片',`data-chapter="${growth.postcard}"`,'text-button'):button('return-home','回小屋歇一歇','','text-button')}</div>`,'认真收藏每一份快乐');
}

function renderCalendar() {
 const first=new Date(calendarYear,calendarMonth,1).getDay(),count=new Date(calendarYear,calendarMonth+1,0).getDate();
 let cells=Array.from({length:first},()=>'<span></span>').join('');
 for(let n=1;n<=count;n++) {
  const date=`${calendarYear}-${String(calendarMonth+1).padStart(2,'0')}-${String(n).padStart(2,'0')}`,done=!!state.days[date];
  cells+=`<span class="calendar-day ${done?'stamped':''} ${date===today()?'today':''} ${date>today()?'future':''}" aria-label="${date}${done?`，已打卡，完成 ${state.days[date].rounds} 局`:''}">${n}</span>`;
 }
 return `${warnings()}<div class="page-heading"><span class="eyebrow">那些被认真收藏的日子</span><h1>快乐，有迹可循。</h1><p>每一朵小花，都是你留给生活的温柔。</p></div><div class="stat-strip"><div class="stat"><strong>${totalDays()}</strong><small>累计陪伴 / 天</small></div><div class="stat"><strong>${streakOf(state.days)}</strong><small>连续打卡 / 天</small></div><div class="stat"><strong>${state.stats.memory+state.stats.difference+(state.stats.puzzle||0)}</strong><small>收获快乐 / 局</small></div></div><section class="calendar-card"><div class="month-heading">${button('month-prev',icon('back',17),'aria-label="上个月"','icon-button')}<h2>${calendarYear} 年 ${calendarMonth+1} 月</h2>${button('month-next',icon('next',17),'aria-label="下个月"','icon-button')}</div><div class="calendar-grid">${['日','一','二','三','四','五','六'].map(d=>`<span class="week-label">${d}</span>`).join('')}${cells}</div><div class="calendar-legend"><span class="legend-dot"></span>玩一局，就会长出一朵小花</div></section><div class="section-title"><h2>小小的陪伴纪念</h2><small>漏一天，也保留所有美好</small></div>${[[3,'🌱','初次发芽','连续 3 天 · 额外 10 星'],[7,'🌷','一周的小温柔','连续 7 天 · 额外 20 星'],[14,'🌼','开成一座小花园','连续 14 天 · 额外 40 星']].map(([days,emoji,title,detail])=>`<div class="milestone ${state.milestones.includes(days)?'done':''}"><span class="milestone-emoji">${emoji}</span><div><h3>${title}</h3><p>${detail}</p></div><span>${state.milestones.includes(days)?'已收藏':'慢慢来'}</span></div>`).join('')}<div class="row-spacer"></div>${button('go',state.days[today()]?'再玩一会也很好':'去玩一局，点亮今天','data-route="games"','button full secondary')}`;
}
function showShop(keepScroll=false) {
 const scroll=$('#sheet').scrollTop;
 const groups={wall:'墙纸',rug:'地毯',plant:'小植物',friend:'小伙伴',seat:'家具'};
 openSheet('给小屋添点可爱',`<div class="shop-preview">${roomSVG(state.room)}</div><div class="shop-meta"><span>喜欢什么，就带什么回家。</span><strong>✦ ${state.stars} 星</strong></div><div class="chips">${Object.entries(groups).map(([id,name])=>button('shop-group',name,`data-group="${id}"`,'chip '+(shopGroup===id?'active':''))).join('')}</div><div class="shop-grid">${CATALOG.filter(item=>item.group===shopGroup).map(item=>{const owned=state.owned.includes(item.id),selected=state.room[item.group]===item.id;return `<article class="product ${selected?'selected':''}"><span class="product-emoji" ${item.color?`style="background:${item.color}"`:''}>${item.icon}</span><h3>${item.name}</h3>${button('buy',selected?'✓ 已摆好':owned?'摆进小屋':`<span class="price">✦ ${item.price}</span> 带回家`,`data-item="${item.id}" ${selected?'disabled':''}`,'')}</article>`;}).join('')}</div><p class="memory-foot">拥有过的装饰，可以随时免费换着摆。</p>`,'把小星星，变成喜欢的样子');
 if(keepScroll)$('#sheet').scrollTop=scroll;
}
function showSettings() {
 openSheet('小屋里的小设置',`<div class="settings-row"><div><h3>软软的游戏音效</h3><p>只在点击和完成时响起，默认安静陪伴。</p></div><button class="toggle ${state.settings.sound?'on':''}" data-action="toggle-sound" role="switch" aria-checked="${state.settings.sound}" aria-label="游戏音效"></button></div><div class="settings-row"><div><h3>听一听</h3><p>试听通关的小旋律。</p></div>${button('test-sound',icon('sound',20),'aria-label="试听音效"','icon-button')}</div><div class="help-box"><strong>把小屋放到 iPhone 主屏幕</strong>用 Safari 打开小屋网址 → 点分享按钮 → 选择「添加到主屏幕」。下次点小兔图标，就能回来啦。<br>已经打开过的小游戏，会自动缓存以便离线玩。</div><span class="field-label">保存你的快乐</span><p style="font-size:11px;color:#929781;line-height:1.8;margin-top:8px">进度保存在当前浏览器。换设备或清理浏览器前，记得带走一份备份。</p><div class="button-row">${button('export',icon('download',17)+' 导出备份','','button secondary')}${button('import','恢复备份','','button soft')}</div><div class="help-box"><strong>星星是怎么来的？</strong>欢迎礼 30 星。每天首次通关打卡得 20 星，前 3 局各得 5 星。连续打卡还有小礼物。<br>漏签保留余额、装饰和累计记录，可以从新的一天继续。</div><p class="settings-foot">糯糯小屋 · 耐玩精修版 v3<br>六段漫游，三种小游戏，慢慢收藏小美好。</p>`,'把陪伴调成你喜欢的样子');
}
function exportSave() {
 const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download=`${today().replaceAll('-','')}_糯糯小屋备份_v1.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);toast('备份已准备好，请保存到文件');
}
function render() {
 viewer?.destroy();viewer=null;
 renderHeader();
  const views={home:renderHome,games:renderGames,calendar:renderCalendar,difference:renderDifference,'memory-menu':renderMemoryMenu,memory:renderMemory,journey:()=>journeyView(state,selectedChapter),daily:()=>dailyView(state),collection:()=>collectionView(state),'puzzle-menu':()=>puzzleMenuView(state,puzzleSize,puzzleLevel),puzzle:()=>state.activePuzzle?puzzleView(state,puzzlePeek,puzzleNumbers):puzzleMenuView(state,puzzleSize,puzzleLevel)};
 $('#content').innerHTML=(views[route]||renderHome)();
 if(route==='difference'&&$('#detail-viewer'))viewer=mountViewer($('#detail-viewer'),{camera,onTap:hitDifference,onChange:value=>{camera=value;},onSwap:value=>{swapped=!!value;const control=$('[data-action="swap"]');if(control)control.textContent=`切换到 ${swapped?'A 原图':'B 变化图'}`;}});
}
function renderKeepScroll() {
 const y=window.scrollY,focused=document.activeElement,focusCard=focused?.dataset?.card,focusAction=focused?.dataset?.action,viewFocus=focused?.dataset?.board,puzzleFocus=focused?.dataset?.index;
 render();window.scrollTo({top:y,behavior:'instant'});
 if(focusCard||focused?.classList.contains('memory-grid')){memoryFocus=focusCard||memoryFocus;const original=[...document.querySelectorAll('[data-card]')].find(node=>node.dataset.card===memoryFocus&&!node.disabled);(original||$('.memory-card:not(:disabled)')||$('.memory-grid'))?.focus({preventScroll:true});}
 else if(puzzleFocus!==undefined)document.querySelector(`[data-action="puzzle-tile"][data-index="${puzzleFocus}"]`)?.focus({preventScroll:true});
 else if(viewFocus)document.querySelector(`.detail-viewport[data-board="${viewFocus}"]`)?.focus({preventScroll:true});
 else if(focusAction)document.querySelector(`[data-action="${focusAction}"]`)?.focus({preventScroll:true});
}
document.addEventListener('click',async event=>{
 const target=event.target.closest('[data-action]');if(!target||target.disabled)return;
 const {action}=target.dataset;
 switch(action) {
 case 'go':closeSheet();go(target.dataset.route);break;
 case 'return-home':closeSheet();go('home');break;
 case 'close-sheet':closeSheet();break;
 case 'settings':showSettings();break;
 case 'shop':showShop();break;
 case 'shop-group':shopGroup=target.dataset.group;showShop(true);break;
 case 'buy':if(await change(current=>buyItem(current,target.dataset.item))){showShop(true);renderKeepScroll();sound();toast('新的可爱已经摆进小屋啦');}break;
 case 'start-difference':await startDifference();break;
 case 'choose-level':case 'next-difference':await startDifference(Number(target.dataset.level),target.dataset.mode||'free');break;
 case 'journey-level':await startDifference(Number(target.dataset.level),'journey');break;
 case 'daily-challenge':await startDifference(undefined,'daily');break;
 case 'chapter':selectedChapter=Number(target.dataset.chapter);renderKeepScroll();break;
 case 'collection-chapter':selectedChapter=Number(target.dataset.chapter);closeSheet();go('journey');break;
 case 'postcard':{
  const index=Number(target.dataset.chapter);if(!Number.isInteger(index)||!state.journal.postcards.includes(index))break;
  openSheet('寄给你的一小片风景',postcardContent(index),'糯糯的漫游手记');break;
 }
 case 'claim-quest':{
  const quest=questStatus(state,today()).find(q=>q.id===target.dataset.quest);if(!quest||quest.claimed)break;
  if(!quest.ready){go(quest.id==='memory'?'memory-menu':'games');break;}
  let awarded=0;
  if(await change(current=>{const next=claimQuest(current,quest.id,today());awarded=next.stars-current.stars;return next;})){renderKeepScroll();sound(true);toast(awarded?`收到 ${awarded} 颗小星星，今天也很棒`:'这份小礼物已经收到啦');}break;
 }
 case 'levels':showLevels();break;
 case 'set-difficulty':difficulty=target.dataset.difficulty;showLevels();break;
 case 'hint':{
  const game=state.activeDifference;if(!game)break;
  const remaining=sceneData(game.level,game.difficulty||'hard',game.seed||0).targets.filter(t=>!game.found.includes(t.id));
  const targetHint=remaining.find(t=>t.id===selectedHint?.id)??remaining[0];if(!targetHint)break;selectedHint=targetHint;
  if(!await change(current=>{if(current.activeDifference?.eventId===game.eventId&&!current.activeDifference.found.includes(targetHint.id))current.activeDifference.hints=(current.activeDifference.hints||0)+1;return current;}))break;
  if(state.activeDifference?.eventId!==game.eventId||state.activeDifference.found.includes(targetHint.id)){renderKeepScroll();break;}
  hintStep++;
  if(hintStep===1){const region=(targetHint.y<SCENE_HEIGHT/3?'上':targetHint.y>SCENE_HEIGHT*2/3?'下':'中')+(targetHint.x<SCENE_WIDTH/3?'左':targetHint.x>SCENE_WIDTH*2/3?'右':'间');toast(`先看画面的${region}区域，放大仔细找一找。`);}
  else if(hintStep===2){toast(`留意${targetHint.label}，有一处小变化。`);viewer?.focus(targetHint,3);}
  else{clearTimeout(hintTimer);hint=targetHint.id;renderKeepScroll();viewer?.focus(targetHint,4);toast('这次把具体位置圈出来啦');hintTimer=setTimeout(()=>{hint=-1;if(route==='difference')renderKeepScroll();},5000);hintStep=0;selectedHint=null;}
  const label=$('[data-action="hint"]');if(label)label.innerHTML=icon('flower',17)+(hintStep?' 再提示一点':' 给点线索');break;
 }
 case 'compare':compareMode=!compareMode;swapped=false;renderKeepScroll();break;
 case 'swap':viewer?.swap();break;
 case 'reset-view':camera={zoom:1,x:.5,y:.5};renderKeepScroll();break;
 case 'memory-theme':memoryTheme=target.dataset.theme;renderKeepScroll();break;
 case 'memory-pairs':memoryPairs=Number(target.dataset.pairs);renderKeepScroll();break;
 case 'start-memory':case 'another-memory':await startMemory();break;
 case 'flip':await handleFlip(target.dataset.card);break;
 case 'puzzle-scene':puzzleLevel=Number(target.dataset.level);renderKeepScroll();break;
 case 'puzzle-size':puzzleSize=Number(target.dataset.size);renderKeepScroll();break;
 case 'start-puzzle':case 'another-puzzle':await startPuzzle();break;
 case 'puzzle-tile':await handlePuzzle(Number(target.dataset.index));break;
 case 'puzzle-peek':puzzlePeek=!puzzlePeek;renderKeepScroll();break;
 case 'puzzle-numbers':puzzleNumbers=!puzzleNumbers;renderKeepScroll();break;
 case 'month-prev':case 'month-next':{
  const date=new Date(calendarYear,calendarMonth+(action==='month-prev'?-1:1),1);calendarYear=date.getFullYear();calendarMonth=date.getMonth();renderKeepScroll();break;
 }
 case 'toggle-sound':if(await change(current=>({...current,settings:{sound:!current.settings.sound}}))){showSettings();sound();}break;
 case 'test-sound':if(state.settings.sound)sound(true);else toast('先打开音效开关，再听一听吧');break;
 case 'export':exportSave();break;
 case 'import':$('#import-file').value='';$('#import-file').click();break;
 case 'confirm-import':if(pendingImport){try{clearTimeout(memoryTimer);clearTimeout(hintTimer);adoptState(await store.replace(pendingImport),{resetGames:true});pendingImport=null;closeSheet();go('home');toast('回忆和小屋，已经一起带回来啦');}catch(error){toast(error.message);}}break;
 }
});
$('#import-file').addEventListener('change',async event=>{
 const file=event.target.files?.[0];if(!file)return;
 try {
  if(file.size>2000000)throw new Error('备份太大了，请选择小屋导出的备份文件');
  pendingImport=validateSave(await file.text());
  openSheet('把这份快乐带回来？',`<p>备份里有 ${Object.keys(pendingImport.days).length} 天陪伴、${pendingImport.stars} 颗星星和 ${pendingImport.owned.length} 件装饰。</p><div class="help-box">恢复后会替换当前设备的小屋进度。想保留现在的小屋，可以先导出一份备份。</div><div class="button-row">${button('export','先备份现在的小屋','','button secondary')}${button('confirm-import','恢复这个备份')}</div>`,'欢迎回家');
 }catch(error){pendingImport=null;toast(error.message);}
});
$('#sheet').addEventListener('click',event=>{if(event.target===$('#sheet')){const r=$('#sheet').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeSheet();}});
window.addEventListener('hashchange',()=>{const requested=location.hash.slice(1);route=ROUTES.includes(requested)?requested:'home';render();window.scrollTo({top:0,behavior:'instant'});});
function syncStored(){
 try{adoptState(store.read());if(state.activeMemory?.open.length===2)scheduleMemoryResolve(state.activeMemory.eventId);renderKeepScroll();if($('#sheet').open&&$('#sheet-title').textContent==='给小屋添点可爱')showShop(true);}catch{storageOK=false;}
}
window.addEventListener('storage',event=>{if(event.key===KEY)syncStored();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncStored();});
route=ROUTES.includes(location.hash.slice(1))?location.hash.slice(1):'home';
if(state.activeMemory)await change(current=>{if(current.activeMemory){current.activeMemory=resolveCards(current.activeMemory);current.activeMemory.open=[];}return current;});
render();
if(state.activeMemory?.matched.length===state.activeMemory?.deck.length&&state.activeMemory)await finishRound('memory');
if(state.activeDifference&&state.activeDifference.found.length===sceneData(state.activeDifference.level,state.activeDifference.difficulty||'hard',state.activeDifference.seed||0).targets.length)await finishRound('difference');
if(state.activePuzzle&&isPuzzleSolved(state.activePuzzle))await finishRound('puzzle');
if('serviceWorker'in navigator&&['http:','https:'].includes(location.protocol))navigator.serviceWorker.register('./1109_离线缓存_v1.js').catch(()=>{toast('离线准备未完成，联网时仍可正常玩。');});
