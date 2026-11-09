const KINDS=['difference','memory','puzzle','pancake'];
const DIFFICULTIES=['medium','hard','expert'];
const MODES=['free','journey','daily'];
const CHAPTER_NAMES=['奶油咖啡街','松鼠杂货铺','森林周末集','月光小书屋','桃子甜点工坊','海风花园'];
const QUESTS=[
  {id:'difference',title:'找不同小探险',target:1,reward:5},
  {id:'memory',title:'翻开一份好心情',target:1,reward:5},
  {id:'rounds',title:'今天玩满三小局',target:3,reward:8},
];
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const count=value=>Number.isSafeInteger(value)&&value>=0;
const levelId=value=>Number.isInteger(value)&&value>=0&&value<30;
const seedValue=value=>Number.isInteger(value)&&value>=0&&value<=4294967295;
const eventId=value=>typeof value==='string'&&value.trim().length>0&&value.length<=100;
const copy=value=>JSON.parse(JSON.stringify(value));
function validDate(value) {
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time=Date.parse(value+'T00:00:00Z');
  return Number.isFinite(time)&&new Date(time).toISOString().slice(0,10)===value;
}
function requireDate(date) {if(!validDate(date)) throw new Error('日期不正确');}
function completedChapter(levels,index) {
  return Array.from({length:5},(_,i)=>levels[String(index*5+i)]).every(Boolean);
}
const uniqueValid=(input,check)=>Array.isArray(input)?[...new Set(input.filter(check))]:[];
const emptyDay=()=>({difference:0,memory:0,puzzle:0,pancake:0,rounds:0});

export function createJournal() {
  return {version:1,levels:{},daily:{},events:[],claimedQuests:[],dailyWins:[],postcards:[]};
}

export function normalizeJournal(input,legacyLevelDone=[]) {
  const result=createJournal();
  const source=record(input)&&input.version===1?input:{};
  if(record(source.levels)) for(const [key,value] of Object.entries(source.levels)) {
    if(/^(?:[0-9]|[12][0-9])$/.test(key)&&record(value)&&Number.isInteger(value.stamps)&&value.stamps>=1&&value.stamps<=3) result.levels[key]={stamps:value.stamps};
  }
  if(Array.isArray(legacyLevelDone)) for(const level of legacyLevelDone) {
    if(levelId(level)&&!result.levels[String(level)]) result.levels[String(level)]={stamps:1};
  }
  if(record(source.daily)) for(const [date,value] of Object.entries(source.daily)) {
    if(!validDate(date)||!record(value)) continue;
    const day=emptyDay();
    for(const kind of KINDS) if(count(value[kind])&&value[kind]<=10000000) day[kind]=value[kind];
    day.rounds=day.difference+day.memory+day.puzzle+day.pancake;
    result.daily[date]=day;
  }
  result.events=uniqueValid(source.events,eventId);
  result.claimedQuests=uniqueValid(source.claimedQuests,value=>{
    if(typeof value!=='string') return false;
    const match=/^(\d{4}-\d{2}-\d{2}):(difference|memory|rounds)$/.exec(value);
    return !!match&&validDate(match[1]);
  });
  result.dailyWins=uniqueValid(source.dailyWins,validDate);
  // 全章完成即拥有收藏；迁移和修复只恢复记录，不在这里补星星。
  for(let index=0;index<6;index++) if(completedChapter(result.levels,index)) result.postcards.push(index);
  return result;
}

export function dailyChallenge(date) {
  requireDate(date);
  const day=Math.floor(Date.parse(date+'T00:00:00Z')/86400000);
  // 相邻日期轮换关卡，整数混合得到稳定的32位场景种子。
  let seed=(day+0x9e3779b9)>>>0;
  seed=Math.imul(seed^(seed>>>16),0x21f0aaad)>>>0;
  seed=Math.imul(seed^(seed>>>15),0x735a2d97)>>>0;
  seed=(seed^(seed>>>15))>>>0;
  return {date,level:((day%30)+30)%30,seed,difficulty:'hard'};
}

function normalizeMeta(meta) {
  if(!record(meta)||!eventId(meta.eventId)||!KINDS.includes(meta.kind)||!validDate(meta.date)) throw new Error('这一局成长记录无效');
  const data={...meta,hints:meta.hints===undefined?0:meta.hints,mistakes:meta.mistakes===undefined?0:meta.mistakes,mode:meta.mode===undefined?'free':meta.mode,seed:meta.seed===undefined?0:meta.seed,challengeDate:meta.challengeDate===undefined?'':meta.challengeDate};
  if(!MODES.includes(data.mode)||!count(data.hints)||!count(data.mistakes)||!seedValue(data.seed)||(data.challengeDate!==''&&!validDate(data.challengeDate))) throw new Error('这一局成长记录无效');
  if((data.kind==='difference'||data.level!==undefined)&&!levelId(data.level)) throw new Error('这一局成长记录无效');
  if((data.kind==='difference'||data.difficulty!==undefined)&&!DIFFICULTIES.includes(data.difficulty)) throw new Error('这一局成长记录无效');
  return data;
}

export function awardPlay(state,meta) {
  const data=normalizeMeta(meta);
  const journal=normalizeJournal(state.journal,state.levelDone);
  const oldStamps=data.kind==='difference'?(journal.levels[String(data.level)]?.stamps||0):0;
  if(journal.events.includes(data.eventId)) return {state,bonus:0,stamps:oldStamps,postcard:null,newPostcard:false};
  const next=copy(state);
  next.journal=journal;
  let bonus=0,stamps=0,postcard=null,newPostcard=false;
  const day=journal.daily[data.date]||emptyDay();
  day[data.kind]++;day.rounds++;journal.daily[data.date]=day;
  journal.events.push(data.eventId);
  if(data.kind==='difference') {
    if(!oldStamps) bonus+=8;
    stamps=Math.max(oldStamps,1+(data.hints===0?1:0)+(data.difficulty==='hard'||data.difficulty==='expert'?1:0));
    journal.levels[String(data.level)]={stamps};
    next.levelDone=uniqueValid([...(Array.isArray(next.levelDone)?next.levelDone:[]),data.level],levelId);
    const index=Math.floor(data.level/5);
    if(completedChapter(journal.levels,index)&&!journal.postcards.includes(index)) {
      journal.postcards.push(index);journal.postcards.sort((a,b)=>a-b);
      bonus+=12;postcard=index;newPostcard=true;
    }
    const challenge=dailyChallenge(data.date);
    if(data.mode==='daily'&&data.challengeDate===data.date&&data.level===challenge.level&&data.difficulty===challenge.difficulty&&data.seed===challenge.seed&&!journal.dailyWins.includes(data.date)) {
      journal.dailyWins.push(data.date);bonus+=15;
    }
  }
  next.stars=Math.min(10000000,next.stars+bonus);
  bonus=next.stars-state.stars;
  return {state:next,bonus,stamps,postcard,newPostcard};
}

export function questStatus(state,date) {
  requireDate(date);
  const journal=normalizeJournal(state.journal,state.levelDone),day=journal.daily[date]||emptyDay();
  return QUESTS.map(quest=>{
    const current=Math.min(quest.target,day[quest.id]);
    const claimed=journal.claimedQuests.includes(date+':'+quest.id);
    return {...quest,current,claimed,ready:current>=quest.target&&!claimed};
  });
}

export function claimQuest(state,id,date) {
  const quest=questStatus(state,date).find(item=>item.id===id);
  if(!quest) throw new Error('任务无效');
  if(quest.claimed) return state;
  if(!quest.ready) throw new Error('先完成这个小目标再领取呀');
  const next=copy(state);
  next.journal=normalizeJournal(state.journal,state.levelDone);
  next.journal.claimedQuests.push(date+':'+id);
  next.stars=Math.min(10000000,next.stars+quest.reward);
  return next;
}

export function chapterProgress(state) {
  const journal=normalizeJournal(state.journal,state.levelDone);
  return CHAPTER_NAMES.map((name,index)=>{
    const levels=Array.from({length:5},(_,i)=>journal.levels[String(index*5+i)]);
    return {chapter:index,index,name,completed:levels.filter(Boolean).length,total:5,stamps:levels.reduce((sum,level)=>sum+(level?.stamps||0),0),maxStamps:15,unlocked:index===0||completedChapter(journal.levels,index-1),postcard:journal.postcards.includes(index)};
  });
}

function validTiles(game) {
  return record(game)&&[3,4].includes(game.size)&&Array.isArray(game.tiles)&&game.tiles.length===game.size*game.size&&new Set(game.tiles).size===game.tiles.length&&[...game.tiles].every(tile=>Number.isInteger(tile)&&tile>=0&&tile<game.tiles.length);
}

export function makePuzzle(size,level=0,random=Math.random) {
  if(![3,4].includes(size)||!levelId(level)||typeof random!=='function') throw new Error('拼图设置不正确');
  const tiles=Array.from({length:size*size},(_,i)=>i);
  for(let i=tiles.length-1;i>0;i--) {
    const value=random();
    if(!Number.isFinite(value)||value<0||value>=1) throw new Error('拼图随机数不正确');
    const j=Math.floor(value*(i+1));[tiles[i],tiles[j]]=[tiles[j],tiles[i]];
  }
  if(tiles.every((tile,index)=>tile===index)) [tiles[0],tiles[1]]=[tiles[1],tiles[0]];
  return {size,level,tiles,selected:null,moves:0,eventId:''};
}

export function swapPuzzle(game,first,second) {
  if(!validTiles(game)||!Number.isInteger(first)||!Number.isInteger(second)||first<0||second<0||first>=game.tiles.length||second>=game.tiles.length||first===second||!count(game.moves)) return game;
  const tiles=[...game.tiles];[tiles[first],tiles[second]]=[tiles[second],tiles[first]];
  return {...game,tiles,selected:null,moves:game.moves+1};
}

export function isPuzzleSolved(game) {
  return validTiles(game)&&game.tiles.every((tile,index)=>tile===index);
}
