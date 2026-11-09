import {createJournal,normalizeJournal} from './1109_成长规则_v3.mjs';
import {createProgress,normalizeProgress,normalizeShift} from './1109_煎饼规则_v4.mjs';

export const CATALOG = [
  {id:'wall-mint', group:'wall',name:'奶油绿墙纸',price:0,icon:'🌿',color:'#e7eee0'},
  {id:'wall-peach',group:'wall',name:'蜜桃墙纸',price:25,icon:'🍑',color:'#f7e1dc'},
  {id:'wall-butter',group:'wall',name:'布丁墙纸',price:30,icon:'🍮',color:'#f7edcf'},
  {id:'wall-lilac',group:'wall',name:'芋泥墙纸',price:45,icon:'🪻',color:'#e9e0f0'},
  {id:'rug-cream',group:'rug',name:'奶油小地毯',price:0,icon:'☁️',color:'#f8efd9'},
  {id:'rug-peach',group:'rug',name:'蜜桃绒地毯',price:15,icon:'🌸',color:'#f1b8b0'},
  {id:'rug-clover',group:'rug',name:'四叶草地毯',price:25,icon:'🍀',color:'#bfd1b1'},
  {id:'rug-cloud',group:'rug',name:'云朵小地毯',price:35,icon:'🫧',color:'#d5e5ef'},
  {id:'plant-sprout',group:'plant',name:'一盆小绿芽',price:0,icon:'🌱'},
  {id:'plant-flower',group:'plant',name:'开花的好心情',price:15,icon:'🌼'},
  {id:'plant-cactus',group:'plant',name:'软软仙人掌',price:25,icon:'🌵'},
  {id:'plant-berry',group:'plant',name:'草莓小盆栽',price:35,icon:'🍓'},
  {id:'friend-bunny',group:'friend',name:'面面小兔',price:0,icon:'🐰'},
  {id:'friend-cat',group:'friend',name:'奶油小猫',price:30,icon:'🐱'},
  {id:'friend-bear',group:'friend',name:'焦糖小熊',price:35,icon:'🐻'},
  {id:'friend-duck',group:'friend',name:'布丁小鸭',price:40,icon:'🐥'},
  {id:'seat-stool',group:'seat',name:'原木小圆凳',price:0,icon:'🪵'},
  {id:'seat-sofa',group:'seat',name:'草莓小沙发',price:25,icon:'🛋️'},
  {id:'seat-pillow',group:'seat',name:'云朵懒人垫',price:30,icon:'☁️'},
  {id:'seat-table',group:'seat',name:'下午茶小桌',price:35,icon:'🫖'},
];
export const THEMES = {
  animals:['🐰','🐱','🐻','🐥','🦊','🐼','🐶','🐨','🐸','🐹'],
  sweets:['🍓','🍰','🍩','🍒','🍮','🧁','🍑','🍪','🍨','🥐'],
  garden:['🌼','🌷','🍀','🍄','🌻','🦋','🌸','🌿','🌹','🌺'],
};
const DEFAULT_ROOM = {wall:'wall-mint',rug:'rug-cream',plant:'plant-sprout',friend:'friend-bunny',seat:'seat-stool'};
const clone = value => JSON.parse(JSON.stringify(value));
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function validDate(date) {
  return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date+'T00:00:00Z')) && new Date(date+'T00:00:00Z').toISOString().slice(0,10) === date;
}
function previousDay(date) { return new Date(Date.parse(date+'T00:00:00Z')-86400000).toISOString().slice(0,10); }
export function createState() {
  return {version:1,stars:30,days:{},owned:Object.values(DEFAULT_ROOM),room:{...DEFAULT_ROOM},milestones:[],settled:[],stats:{memory:0,difference:0,puzzle:0,pancake:0},levelDone:[],settings:{sound:false},activeMemory:null,activeDifference:null,activePuzzle:null,activePancake:null,pancake:createProgress(),journal:createJournal()};
}
export function streakOf(days,date = dayKey()) {
  let current = days[date] ? date : previousDay(date), count=0;
  while(days[current]) { count++; current=previousDay(current); }
  return count;
}
export function completeRound(state,eventId,kind,date = dayKey()) {
  if(!validDate(date) || !['memory','difference','puzzle','pancake'].includes(kind) || typeof eventId !== 'string' || !eventId.trim() || eventId.length>100) throw new Error('这一局记录无效');
  if(state.settled.includes(eventId)) return {state,reward:0,checkedIn:false,milestone:0};
  const next=clone(state), checkedIn=!next.days[date];
  const day=next.days[date] || {rounds:0};
  day.rounds++; next.days[date]=day;
  let reward=(checkedIn?20:0)+(day.rounds<=3?5:0), milestone=0;
  const streak=streakOf(next.days,date);
  for(const [threshold,bonus] of [[3,10],[7,20],[14,40]]) {
    if(streak>=threshold && !next.milestones.includes(threshold)) {
      next.milestones.push(threshold); reward+=bonus; milestone=threshold;
    }
  }
  next.stars=Math.min(10000000,next.stars+reward);
  reward=next.stars-state.stars;
  next.settled.push(eventId);
  next.stats[kind]=(next.stats[kind]||0)+1;
  return {state:next,reward,checkedIn,milestone};
}
export function buyItem(state,id) {
  const item=CATALOG.find(x=>x.id===id);
  if(!item) throw new Error('这件装饰不存在');
  const next=clone(state);
  if(!next.owned.includes(id)) {
    if(next.stars<item.price) throw new Error('星星还差一点，玩一局再来呀');
    next.stars-=item.price; next.owned.push(id);
  }
  next.room[item.group]=id;
  return next;
}
export function makeDeck(pairs=6,theme='animals',random=Math.random) {
  if(![6,8,10].includes(pairs)||!THEMES[theme]) throw new Error('翻牌设置不正确');
  const symbols=THEMES[theme].slice(0,pairs);
  const deck=symbols.flatMap((symbol,i)=>[{id:`${i}-a`,symbol},{id:`${i}-b`,symbol}]);
  for(let i=deck.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [deck[i],deck[j]]=[deck[j],deck[i]]; }
  return deck;
}
export function flipCard(game,id) {
  if(game.open.length>=2||game.open.includes(id)||game.matched.includes(id)||!game.deck.some(c=>c.id===id)) return game;
  const next={...game,open:[...game.open,id]};
  if(next.open.length===2) next.moves++;
  return next;
}
export function resolveCards(game) {
  if(game.open.length!==2) return game;
  const [a,b]=game.open.map(id=>game.deck.find(c=>c.id===id));
  return {...game,open:[],matched:a.symbol===b.symbol?[...game.matched,...game.open]:[...game.matched]};
}
function normalizeMemory(game) {
  if(!game||!Array.isArray(game.deck)||![12,16,20].includes(game.deck.length)) return null;
  if(!THEMES[game.theme]||!Number.isSafeInteger(game.moves)||game.moves<0||typeof game.eventId!=='string'||!game.eventId||game.eventId.length>100) return null;
  const ids=new Set(),counts={};
  for(const card of game.deck) {
    if(!card || typeof card.id!=='string'||card.id.length!==3||!/^\d-[ab]$/.test(card.id)||Number(card.id[0])>=game.deck.length/2||ids.has(card.id)||!THEMES[game.theme].includes(card.symbol)) return null;
    ids.add(card.id); counts[card.symbol]=(counts[card.symbol]||0)+1;
  }
  if(Object.values(counts).some(n=>n!==2)||!Array.isArray(game.matched)||new Set(game.matched).size!==game.matched.length||game.matched.some(id=>!ids.has(id))) return null;
  const matchedCounts={};
  for(const id of game.matched) {const symbol=game.deck.find(c=>c.id===id).symbol; matchedCounts[symbol]=(matchedCounts[symbol]||0)+1;}
  if(Object.values(matchedCounts).some(n=>n!==2)) return null;
  return {deck:game.deck.map(c=>({id:c.id,symbol:c.symbol})),open:[],matched:[...game.matched],moves:game.moves,eventId:game.eventId,theme:game.theme,pairs:game.deck.length/2};
}
function nonnegativeInteger(value) {return Number.isSafeInteger(value)&&value>=0;}
function normalizeDifference(diff) {
  if(!diff||typeof diff!=='object'||Array.isArray(diff)) return null;
  const difficulty=diff.difficulty===undefined?'hard':diff.difficulty;
  const seed=diff.seed===undefined?0:diff.seed,mode=diff.mode===undefined?'free':diff.mode,challengeDate=diff.challengeDate===undefined?'':diff.challengeDate;
  const hints=diff.hints===undefined?0:diff.hints,mistakes=diff.mistakes===undefined?0:diff.mistakes,startedAt=diff.startedAt===undefined?0:diff.startedAt;
  const answerCount=difficulty==='medium'?8:difficulty==='hard'?12:16;
  if(!Number.isInteger(diff.level)||diff.level<0||diff.level>=30||typeof diff.eventId!=='string'||!diff.eventId.trim()||diff.eventId.length>100||!['medium','hard','expert'].includes(difficulty)||!Array.isArray(diff.found)||!diff.found.every(id=>Number.isInteger(id)&&id>=0&&id<answerCount)) return null;
  if(!Number.isInteger(seed)||seed<0||seed>4294967295||!['free','journey','daily'].includes(mode)||(challengeDate!==''&&!validDate(challengeDate))||!nonnegativeInteger(hints)||!nonnegativeInteger(mistakes)||!nonnegativeInteger(startedAt)) return null;
  return {level:diff.level,eventId:diff.eventId,difficulty,found:[...new Set(diff.found)],seed,mode,challengeDate,hints,mistakes,startedAt};
}
function normalizePuzzle(game) {
  if(!game||![3,4].includes(game.size)||!Number.isInteger(game.level)||game.level<0||game.level>=30||!nonnegativeInteger(game.moves)||typeof game.eventId!=='string'||!game.eventId.trim()||game.eventId.length>100) return null;
  const length=game.size*game.size;
  if(!Array.isArray(game.tiles)||game.tiles.length!==length||new Set(game.tiles).size!==length||!game.tiles.every(tile=>Number.isInteger(tile)&&tile>=0&&tile<length)||(game.selected!==null&&(!Number.isInteger(game.selected)||game.selected<0||game.selected>=length))) return null;
  return {size:game.size,level:game.level,tiles:[...game.tiles],selected:game.selected,moves:game.moves,eventId:game.eventId};
}
export function normalizeState(input) {
  const base=createState();
  const state={...base,...clone(input)};
  state.stats=Object.fromEntries(['memory','difference','puzzle','pancake'].map(kind=>[kind,nonnegativeInteger(state.stats?.[kind])&&state.stats[kind]<=10000000?state.stats[kind]:0]));
  state.journal=normalizeJournal(state.journal,state.levelDone);
  state.levelDone=[...new Set([...(Array.isArray(state.levelDone)?state.levelDone.filter(level=>Number.isInteger(level)&&level>=0&&level<30):[]),...Object.keys(state.journal.levels).map(Number)])];
  state.activeMemory=normalizeMemory(state.activeMemory);
  state.activeDifference=normalizeDifference(state.activeDifference);
  state.activePuzzle=normalizePuzzle(state.activePuzzle);
  state.pancake=normalizeProgress(state.pancake);
  state.activePancake=normalizeShift(state.activePancake);
  return state;
}
export function validateSave(text) {
  try {
    if(typeof text!=='string'||text.length>2000000) throw new Error();
    const data=JSON.parse(text);
    if(!data||data.version!==1||!Number.isSafeInteger(data.stars)||data.stars<0||data.stars>10000000) throw new Error();
    if(!data.days||typeof data.days!=='object'||Array.isArray(data.days)||Object.keys(data.days).length>20000) throw new Error();
    const days={};
    for(const [date,day] of Object.entries(data.days)) {
      if(!validDate(date)||!day||!Number.isSafeInteger(day.rounds)||day.rounds<1||day.rounds>100000) throw new Error();
      days[date]={rounds:day.rounds};
    }
    const known=new Set(CATALOG.map(x=>x.id));
    if(!Array.isArray(data.owned)||data.owned.some(id=>!known.has(id))||Object.values(DEFAULT_ROOM).some(id=>!data.owned.includes(id))) throw new Error();
    if(!data.room||Object.keys(DEFAULT_ROOM).some(group=>!CATALOG.some(x=>x.id===data.room[group]&&x.group===group)||!data.owned.includes(data.room[group]))) throw new Error();
    if(!Array.isArray(data.settled)||data.settled.length>100000||data.settled.some(id=>typeof id!=='string'||id.length>100)) throw new Error();
    if(!Array.isArray(data.levelDone)||data.levelDone.some(n=>!Number.isInteger(n)||n<0||n>=30)) throw new Error();
    if(!Array.isArray(data.milestones)||data.milestones.some(n=>![3,7,14].includes(n))) throw new Error();
    if(!data.stats||['memory','difference'].some(key=>!Number.isSafeInteger(data.stats[key])||data.stats[key]<0||data.stats[key]>10000000)) throw new Error();
    for(const kind of ['puzzle','pancake'])if(data.stats[kind]!==undefined&&(!Number.isSafeInteger(data.stats[kind])||data.stats[kind]<0||data.stats[kind]>10000000)) throw new Error();
    const safe={version:1,stars:data.stars,days,owned:[...new Set(data.owned)],room:Object.fromEntries(Object.keys(DEFAULT_ROOM).map(k=>[k,data.room[k]])),settled:[...new Set(data.settled)],levelDone:[...new Set(data.levelDone)],milestones:[...new Set(data.milestones)],stats:{memory:data.stats.memory,difference:data.stats.difference,puzzle:data.stats.puzzle??0,pancake:data.stats.pancake??0},settings:{sound:data.settings?.sound===true},activeMemory:data.activeMemory,activeDifference:data.activeDifference,activePuzzle:data.activePuzzle,activePancake:data.activePancake,pancake:data.pancake,journal:data.journal};
    return normalizeState(safe);
  } catch { throw new Error('备份文件不正确，请选择面面导出的完整备份'); }
}
