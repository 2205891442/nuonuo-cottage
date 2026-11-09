import {createShift,applyAction,currentOrder,settleShift,purchaseDecor,claimSecret,saveCreation,customerStory,SECRETS} from './1109_煎饼规则_v4.mjs';
import {pancakeMenu,pancakePlay,pancakeBook,pancakeStall,pancakeAlbum,secretContent,storyContent,pcEscape} from './1109_煎饼界面_v4.mjs';
import {panArt,creationCard} from './1109_煎饼插画_v4.mjs';
import {completeRound,dayKey} from './1109_核心_v1.mjs';
import {awardPlay} from './1109_成长规则_v3.mjs';
const makeId=()=>globalThis.crypto?.randomUUID?.()||`pancake-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const makeSeed=()=>globalThis.crypto?.getRandomValues(new Uint32Array(1))[0]??Math.floor(Math.random()*4294967296);
export function createPancakeController({getState,change,go,render,getRoute,openSheet,toast,sound}){
 const ui={mode:'relaxed',level:0,sauce:'sweet',result:null,finishedShift:null,starReward:0,artName:''};
 let timer=null,element=null,mountedRoute='',cleanup=()=>{},busy=false,ticking=false,clock=null,gesture=null,viewShiftId='';
 function markClock(g,time=performance.now()){clock=g?{id:g.eventId,time,elapsed:g.elapsedMs,paused:g.paused}:null;}
 function ensureClock(g){if(!g||!clock||clock.id!==g.eventId||clock.paused!==g.paused)markClock(g);}
 function advanceClock(g){
  const now=performance.now();
  if(!g||g.paused||!clock||clock.id!==g.eventId||clock.paused){markClock(g,now);return g;}
  // 共享存档中其它页面已经推进的时间，本页不能再次累计。
  const passed=Math.min(1000,Math.max(0,now-clock.time)),advanced=Math.max(0,g.elapsedMs-clock.elapsed);
  const delta=Math.round(Math.max(0,passed-advanced));
  const next=delta?applyAction(g,{type:'tick',ms:delta}):g;markClock(next,now);return next;
 }
 function view(route){
  const g=getState().activePancake;
  if(g&&g.eventId!==viewShiftId){viewShiftId=g.eventId;ui.sauce=g.cake.sauce||currentOrder(g)?.recipe.sauce||'sweet';}
  return route==='pancake'?pancakePlay(getState(),ui):route==='pancake-book'?pancakeBook(getState()):route==='pancake-stall'?pancakeStall(getState()):route==='pancake-album'?pancakeAlbum(getState()):pancakeMenu(getState(),ui);
 }
 const refresh=()=>{const y=window.scrollY;render();window.scrollTo({top:y,behavior:'instant'});};
 async function suspend(){
  if(!getState().activePancake||getState().activePancake.paused||getState().activePancake.finished)return;
  const id=getState().activePancake.eventId;
  if(await change(current=>{if(current.activePancake?.eventId===id){current.activePancake=applyAction(advanceClock(current.activePancake),{type:'pause',value:true});markClock(current.activePancake);}return current;})){
   if(getRoute()==='pancake')refresh();
  }
 }
 async function finish(){
  const shift=getState().activePancake;if(!shift?.finished)return;
  let result=null,stars=0;
  const ok=await change(current=>{
   const g=current.activePancake;if(!g||g.eventId!==shift.eventId||!g.finished)return current;
   result=settleShift(current.pancake,g,dayKey());current.pancake=result.progress;
   if(result.rewardEligible){const completion=completeRound(current,g.eventId,'pancake',dayKey());const growth=awardPlay(completion.state,{eventId:g.eventId,kind:'pancake',date:dayKey()});stars=completion.reward+growth.bonus;current=growth.state;}
   current.activePancake=null;return current;
  });
  if(ok&&result){ui.result=result;ui.finishedShift=shift;ui.starReward=stars;ui.artName='';ui.level=Math.min(getState().pancake.unlockedLevel,shift.level+1);sound(true);if(getRoute()==='pancake')refresh();}
 }
 async function act(action){
  if(busy)return;const shift=getState().activePancake;if(!shift)return;
  busy=true;
  try{
   const previous=shift.stage;
   const ok=await change(current=>{if(current.activePancake?.eventId===shift.eventId){current.activePancake=applyAction(advanceClock(current.activePancake),action);markClock(current.activePancake);}return current;});
   if(!ok)return;
   const next=getState().activePancake;if(!next)return;
   if(next.finished){await finish();return;}
   if(action.type==='next-order')ui.sauce=currentOrder(next)?.recipe.sauce||'sweet';
   if(previous===next.stage&&action.type==='next'){
    toast(({spread:'再把面糊摊开一点，或点「帮我摊匀」',egg:'先敲入至少一颗鸡蛋',cook:'还没熟，再煎一小会儿',sauce:'先选好酱，刷上几笔',fill:'先放入至少一份配料'})[previous]||'跟着步骤慢慢来');
   }else if(action.type!=='pause')sound(false,action.type);
   refresh();
  }finally{busy=false;}
 }
 function patchClock(){
  const g=getState().activePancake;if(!g)return;
  const clock=element?.querySelector('[data-pc-clock]');if(clock)clock.textContent=Math.max(0,Math.ceil((180000-g.elapsedMs)/1000));
  if(g.stage==='cook'){
   const time=element?.querySelector('[data-pc-heat-time]');if(time)time.textContent=(g.cookMs/1000).toFixed(1)+' 秒';
   const label=element?.querySelector('[data-pc-heat-label]');if(label)label.textContent=g.cookMs<3000?'蛋液正在慢慢凝固':g.cookMs<5000?'快熟啦，再等一小会':g.cookMs<=7000?'金黄刚刚好':g.cookMs<9000?'更酥脆一点了':'有些过火了，可重新做';
   const pointer=element?.querySelector('[data-pc-heat-pointer]');if(pointer)pointer.style.left=Math.min(100,g.cookMs/100)+'%';
   const board=element?.querySelector('#pc-board-art');if(board)board.innerHTML=panArt(g,getState().pancake.equipped);
  }
 }
 async function tick(){
  if(ticking||busy||document.hidden||getRoute()!=='pancake'||document.querySelector('#sheet')?.open)return;
  const g=getState().activePancake;if(!g||g.paused||g.finished)return;
  ticking=true;
  try{
   if(await change(current=>{if(current.activePancake?.eventId===g.eventId)current.activePancake=advanceClock(current.activePancake);return current;})){
    if(getState().activePancake?.finished)await finish();else patchClock();
   }
  }finally{ticking=false;}
 }
 async function start(){
  if(busy)return;
  const current=getState().activePancake;
  if(current){openSheet('换一轮新的营业？','<p>当前这轮还没收摊，开始后会换掉这张未完成订单。已有零钱和收藏都会保留。</p><div class="button-row"><button class="button secondary" data-action="close-sheet">继续保留</button><button class="button" data-pancake-global="replace">开始新营业</button></div>','先把手里的快乐安顿好');return;}
  await begin();
 }
 async function begin(){
  busy=true;
  try{
   const opts={mode:ui.mode,level:ui.level,seed:makeSeed(),eventId:makeId()};
   if(await change(current=>{const next=createShift(opts,current.pancake);if(!next)throw new Error('先完成前面的营业，再来这站开张吧');current.activePancake=next;return current;})){
    ui.result=null;ui.finishedShift=null;ui.sauce=currentOrder(getState().activePancake)?.recipe.sauce||'sweet';document.querySelector('#sheet')?.close();go('pancake');
   }
  }finally{busy=false;}
 }
 async function artDetail(id){
  const a=getState().pancake.album.find(x=>x.id===id);if(!a)return;
  const picture=creationCard(a);
  const url=URL.createObjectURL(new Blob([picture],{type:'image/svg+xml;charset=utf-8'}));
  openSheet(a.name,`<div class="pc-card-image">${picture}</div><p style="text-align:center">${pcEscape(a.name)} · 面面的手作小心意<br>小雅快乐，每天都有热乎乎的好心情。</p><a class="pc-art-download" href="${url}" download="1109_面面手作卡_v4.svg">保存这张手作卡</a>`,'把这一点快乐，留在身边');
  setTimeout(()=>URL.revokeObjectURL(url),60000);
 }
 async function handleClick(event){
  const target=event.target.closest('[data-pancake-action]');if(!target||target.disabled)return;
  const a=target.dataset.pancakeAction;
  if(a==='mode'){ui.mode=target.dataset.pancakeMode;if(ui.mode!=='creative')ui.level=Math.min(ui.level,getState().pancake.unlockedLevel);refresh();}
  else if(a==='level'){ui.level=Number(target.dataset.pancakeLevel);refresh();}
  else if(a==='start')await start();
  else if(a==='resume-route'){ui.result=null;go('pancake');}
  else if(a==='resume')await act({type:'pause',value:false});
  else if(a==='pause')await suspend();
  else if(a==='leave'){await suspend();go('pancake-menu');}
  else if(a==='menu'){ui.result=null;go('pancake-menu');}
  else if(a==='book')go('pancake-book');
  else if(a==='stall')go('pancake-stall');
  else if(a==='album')go('pancake-album');
  else if(a==='creative'){ui.mode='creative';ui.level=11;go('pancake-menu');}
  else if(a==='sauce-select'){ui.sauce=target.dataset.ingredient;refresh();}
  else if(a==='act')await act({type:target.dataset.type,...(target.dataset.ingredient?{id:target.dataset.ingredient}:target.dataset.type==='sauce-help'?{id:ui.sauce}:{})});
  else if(a==='buy'){
   if(await change(current=>{current.pancake=purchaseDecor(current.pancake,target.dataset.item);return current;})){refresh();sound();}
  }else if(a==='secret'){
   const id=target.dataset.secret;
   if(await change(current=>{current.pancake=claimSecret(current.pancake,id);return current;})){
    if(getState().pancake.secrets.includes(id)){refresh();sound(true);const secret=SECRETS.find(x=>x.id===id);openSheet(secret.title,secretContent(secret),'只给你的，小小彩蛋');}
   }
  }else if(a==='story'){const story=customerStory(getState().pancake,target.dataset.customer);if(story)openSheet(story.name+'的小故事',storyContent(story),'热乎乎的相遇');}
  else if(a==='save-art'){
   const input=element?.querySelector('#pc-art-name');ui.artName=input?.value||'今天的快乐煎饼';
   if(ui.finishedShift&&await change(current=>{current.pancake=saveCreation(current.pancake,ui.finishedShift,ui.artName);return current;})){sound(true);toast('这份小心意，已好好收藏');go('pancake-album');}
  }else if(a==='art-detail')await artDetail(target.dataset.art);
 }
 function point(event,box){return {x:(event.clientX-box.left)/box.width,y:(event.clientY-box.top)/box.height};}
 function brushCells(a,b){
  const cells=new Set(),steps=Math.max(1,Math.ceil(Math.hypot(a.x-b.x,a.y-b.y)*45));
  for(let n=0;n<=steps;n++){const x=a.x+(b.x-a.x)*n/steps,y=a.y+(b.y-a.y)*n/steps;for(let cy=0;cy<8;cy++)for(let cx=0;cx<8;cx++)if(Math.hypot((cx+.5)/8-x,(cy+.5)/8-y)<.15)cells.add(cy*8+cx);}
  return cells;
 }
 function paint(event){
  if(!gesture)return;
  const pos=point(event,gesture.box);if(gesture.stage==='fold'){gesture.last=pos;return;}
  const cells=brushCells(gesture.last,pos);for(const c of cells)gesture.cells.add(c);gesture.last=pos;
  const g=getState().activePancake;if(!g||g.eventId!==gesture.id)return;
  const cake={...g.cake};if(gesture.stage==='spread')cake.spread=[...new Set([...cake.spread,...gesture.cells])];else{cake.sauce=ui.sauce;cake.sauceCells=[...new Set([...(cake.sauce===g.cake.sauce?g.cake.sauceCells:[]),...gesture.cells])];}
  const board=element?.querySelector('#pc-board-art');if(board)board.innerHTML=panArt({...g,cake},getState().pancake.equipped);
  const brush=element?.querySelector('.pc-brush');if(brush){brush.hidden=false;brush.style.left=pos.x*100+'%';brush.style.top=pos.y*100+'%';}
 }
 function pointerDown(event){
  const pan=event.target.closest('#pc-pan'),g=getState().activePancake;
  if(!pan||!g||g.paused||busy||gesture||!['spread','sauce','fold'].includes(g.stage)||event.button!==0)return;
  const box=pan.getBoundingClientRect(),p=point(event,box);
  if(p.x<.12||p.x>.88||p.y<.12||p.y>.88)return;
  event.preventDefault();pan.setPointerCapture(event.pointerId);
  gesture={pointerId:event.pointerId,id:g.eventId,stage:g.stage,box,start:p,last:p,cells:new Set()};paint(event);
 }
 function pointerMove(event){if(gesture?.pointerId===event.pointerId){event.preventDefault();paint(event);}}
 async function pointerUp(event){
  if(gesture?.pointerId!==event.pointerId)return;event.preventDefault();const done=gesture;gesture=null;
  const brush=element?.querySelector('.pc-brush');if(brush)brush.hidden=true;
  if(done.stage==='fold'){if(done.last.x-done.start.x>.18)await act({type:'fold'});}
  else await act({type:done.stage==='spread'?'spread':'sauce',cells:[...done.cells],...(done.stage==='sauce'?{id:ui.sauce}:{})});
 }
 function detach(){cleanup();cleanup=()=>{};gesture=null;}
 function sync(previous){
  const g=getState().activePancake;ensureClock(g);
  if(!g||!previous)return false;
  const stable=x=>({...x,elapsedMs:0,cookMs:0,orderMs:0});
  if(JSON.stringify(stable(g))!==JSON.stringify(stable(previous)))return false;
  patchClock();return true;
 }
 function mount(root,route){
  detach();if(mountedRoute==='pancake'&&route!=='pancake')void suspend();mountedRoute=route;element=root;
  root.addEventListener('click',handleClick);root.addEventListener('pointerdown',pointerDown);root.addEventListener('pointermove',pointerMove);root.addEventListener('pointerup',pointerUp);root.addEventListener('pointercancel',pointerUp);
  cleanup=()=>{root.removeEventListener('click',handleClick);root.removeEventListener('pointerdown',pointerDown);root.removeEventListener('pointermove',pointerMove);root.removeEventListener('pointerup',pointerUp);root.removeEventListener('pointercancel',pointerUp);};
  if(route==='pancake'&&getState().activePancake){const g=getState().activePancake,pan=root.querySelector('#pc-pan');if(pan)pan.dataset.drawing=String(['spread','sauce','fold'].includes(g.stage));ensureClock(g);timer??=setInterval(tick,400);if(g.finished)void finish();}
  else{if(timer)clearInterval(timer);timer=null;markClock(null);}
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)void suspend();});
 window.addEventListener('pagehide',()=>{void suspend();});
 document.addEventListener('click',event=>{const target=event.target.closest('[data-pancake-global]');if(target?.dataset.pancakeGlobal==='replace')void begin();});
 return {view,mount,detach,suspend,sync,ui};
}
