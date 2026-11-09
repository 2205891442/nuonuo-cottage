// 面面煎饼铺：无时钟、DOM、存储或核心依赖，所有更改通过返回新状态完成。
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
export const INGREDIENTS = freeze([
  {id:'plain',name:'普通面糊',type:'batter',unlockLevel:0},{id:'grain',name:'杂粮面糊',type:'batter',unlockLevel:4},
  {id:'egg',name:'鸡蛋',type:'egg',unlockLevel:0},{id:'sweet',name:'甜面酱',type:'sauce',unlockLevel:0},
  {id:'spicy',name:'微辣酱',type:'sauce',unlockLevel:2},{id:'scallion',name:'小葱',type:'filling',unlockLevel:0},
  {id:'coriander',name:'香菜',type:'filling',unlockLevel:3},{id:'lettuce',name:'生菜',type:'filling',unlockLevel:1},
  {id:'crisp',name:'脆片',type:'filling',unlockLevel:0},{id:'ham',name:'火腿',type:'filling',unlockLevel:5},
  {id:'floss',name:'肉松',type:'filling',unlockLevel:6},{id:'cheese',name:'芝士',type:'filling',unlockLevel:8}
]);
export const CUSTOMERS = freeze([
  {id:'bunny',name:'围巾兔',preference:'甜酱、脆片，不要葱',stories:[
    '围巾兔捧着第一张热饼，小声说今天要去报名合唱团。她怕唱错，决定先在路上哼一小段。',
    '第二周她带来了排练表。第一次独唱虽然漏了一句，伙伴们却给她打着拍子，让她把歌唱完。',
    '演出结束，围巾兔把节目单贴在摊边。她说最想感谢的，是每次出门前那张让手心暖起来的煎饼。'
  ]},
  {id:'squirrel',name:'松鼠学生',preference:'双蛋、脆片，少一点酱',stories:[
    '松鼠学生的书包里装着一张被擦皱的草图。他想给学校做一座小书屋，还没有勇气把想法说出来。',
    '他把草图交给了老师，几位同学也来帮忙。第一次装好的书架歪了一点，大家扶着它一起重新拧紧。',
    '书屋终于开门，松鼠学生送来一张借书卡。最下面写着：留给面面的位置，什么时候来都欢迎。'
  ]},
  {id:'bear',name:'小熊邮差',preference:'金黄饼皮、双脆片',stories:['小熊邮差把最后一封信投好，才来摊前歇脚。他说热饼的香气像每天准时亮起的一盏灯。']},
  {id:'cat',name:'小猫画家',preference:'生菜、甜酱，配料自由',stories:['小猫画家给摊位画了一片金色晨光。他没收画纸的钱，只约好下次带颜料来教大家画画。']},
  {id:'hedgehog',name:'刺猬园丁',preference:'清爽生菜、不要香菜',stories:['刺猬园丁送来一盆小薄荷，说浇水别太着急。等新叶长出来，就知道每天的照顾没有白费。']},
  {id:'owl',name:'夜班猫头鹰',preference:'杂粮面糊、暖暖的馅料',stories:['夜班猫头鹰下班时天刚亮。他把窗边的位置留给晚来的朋友，慢慢吃完一张饼才安心回家。']}
]);
const LEVEL_NAMES=['第一张金黄饼','清晨的生菜香','有人不吃辣','双份的小满足','杂粮暖手心','周末新摊位','书包里的愿望','还是老样子','月光芝士夜','随你搭配','夜班后的早餐','送给面面的晚安'];
const INTROS=['先跟着顺序做好六张热饼。','清爽生菜加入菜单，留意顾客的搭配。','辣酱开放，红色忌口要看清。','核对双蛋、双脆片和香菜忌口。','换一种面糊，也换一段新故事。','火腿登场，搭配开始更丰富。','肉松暖暖的，陪松鼠把愿望说出来。','熟客会说老样子，口味卡一直可查。','芝士在夜市融化，记住多酱和少酱。','顾客给出条件，其余交给你的灵感。','完整食材与数量组合，让每位晚归的人吃饱。','第六位顾客带来一份写给面面的特别祝福。'];
export const LEVELS = freeze(LEVEL_NAMES.map((name,i)=>({id:i,name,chapter:Math.floor(i/4)+1,intro:INTROS[i],total:6,ingredients:INGREDIENTS.filter(x=>x.unlockLevel<=i).map(x=>x.id)})));
export const STALL_ITEMS = freeze([
  {id:'mint-sign',name:'薄荷木招牌',price:35,slot:'sign',description:'给面面的小摊挂上清爽的手写招牌。'},
  {id:'flower-sign',name:'小花招牌',price:70,slot:'sign',description:'晨光里开着一圈温柔的小花。'},
  {id:'heart-bag',name:'爱心纸袋',price:30,slot:'paper',description:'把热乎乎的心意装进纸袋。'},
  {id:'moon-bag',name:'月亮纸袋',price:65,slot:'paper',description:'夜市的晚安被印在袋子上。'},
  {id:'gold-pan',name:'暖金小锅',price:90,slot:'tool',description:'金色锅沿映着刚出炉的饼。'},
  {id:'plant',name:'窗边薄荷',price:25,slot:'ornament',description:'小小的绿色陪你慢慢开店。'},
  {id:'cat-bell',name:'猫咪风铃',price:55,slot:'ornament',description:'小猫路过时最喜欢看它摇晃。'},
  {id:'cloud-awning',name:'云朵遮阳棚',price:110,slot:'awning',description:'给等候的朋友留一片柔软的阴凉。'}
]);
export const SECRETS = freeze([
  {id:'paper',title:'纸袋背面的便条',message:'面面天天开心'},
  {id:'cat',title:'猫咪试吃员',message:'小雅快乐'},
  {id:'photo',title:'晨光小摊毕业照',message:'四次晨光，六位朋友，热乎乎的回忆都在这里。'},
  {id:'special',title:'给面面的特别订单',message:'面面天天开心，小雅快乐。每个平常日子，都有人记得你的口味。'}
]);
const MODES=['relaxed','rush','creative'],STAGES=['batter','spread','egg','cook','sauce','fill','fold','pack','review','ended'];
const ids=type=>INGREDIENTS.filter(x=>x.type===type).map(x=>x.id);
const integer=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
const bounded=(v,min,max,fallback=0)=>Number.isFinite(v)?Math.max(min,Math.min(max,Math.trunc(v))):fallback;
const plain=v=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&(Object.getPrototypeOf(v)===Object.prototype||Object.getPrototypeOf(v)===null);
function safe(v,depth=0){
  if(depth>12)return false;
  if(v===null||typeof v==='string'||typeof v==='boolean')return true;
  if(typeof v==='number')return Number.isFinite(v);
  if(Array.isArray(v))return v.length<=10000&&v.every(x=>safe(x,depth+1));
  if(!plain(v))return false;
  return Object.keys(v).length<=100&&Object.entries(v).every(([k,x])=>!['__proto__','constructor','prototype'].includes(k)&&safe(x,depth+1));
}
const unique=a=>[...new Set(a)];
const eventId=v=>typeof v==='string'&&v.trim().length>0&&v.length<=100&&!/[\x00-\x1f]/.test(v);
const nameOf=id=>INGREDIENTS.find(x=>x.id===id)?.name||'';
const emptyCake=()=>({batter:null,spread:[],eggs:0,sauce:null,sauceCells:[],fillings:[],folds:0});
function cakeValue(v){
  if(!plain(v)||!safe(v)||![null,...ids('batter')].includes(v.batter)||!integer(v.eggs,0,2)||![null,...ids('sauce')].includes(v.sauce)||!integer(v.folds,0,2))return null;
  if(!Array.isArray(v.spread)||v.spread.length>64||v.spread.some(x=>!integer(x,0,63))||unique(v.spread).length!==v.spread.length)return null;
  if(!Array.isArray(v.sauceCells)||v.sauceCells.length>64||v.sauceCells.some(x=>!integer(x,0,63))||unique(v.sauceCells).length!==v.sauceCells.length)return null;
  if(!Array.isArray(v.fillings)||v.fillings.length>12||v.fillings.some(x=>!ids('filling').includes(x)))return null;
  if(v.batter===null&&(v.spread.length||v.eggs||v.sauce!==null||v.sauceCells.length||v.fillings.length||v.folds))return null;
  if(v.sauce===null&&v.sauceCells.length)return null;
  return {batter:v.batter,spread:[...v.spread],eggs:v.eggs,sauce:v.sauce,sauceCells:[...v.sauceCells],fillings:[...v.fillings],folds:v.folds};
}
export function createProgress(){
  return {coins:0,levels:Array(12).fill(0),unlockedLevel:0,customers:Object.fromEntries(CUSTOMERS.map(x=>[x.id,{visits:0,story:0}])),owned:[],equipped:{},secrets:[],album:[],bestRush:0,completed:0,settledEvents:[],specialServed:false};
}
export function normalizeProgress(raw){
  const p=createProgress();if(!plain(raw))return p;
  p.coins=bounded(raw.coins,0,999999);p.completed=bounded(raw.completed,0,999999);p.bestRush=bounded(raw.bestRush,0,600);
  p.levels=p.levels.map((_,i)=>bounded(Array.isArray(raw.levels)?raw.levels[i]:0,0,3));
  const earned=p.levels.reduce((n,x,i)=>x?Math.max(n,Math.min(11,i+1)):n,0);
  p.unlockedLevel=Math.max(earned,bounded(raw.unlockedLevel,0,11));
  if(plain(raw.customers))for(const c of CUSTOMERS){const v=raw.customers[c.id];if(plain(v)){const visits=bounded(v.visits,0,9999);p.customers[c.id]={visits,story:Math.min(Math.floor(visits/2),c.stories.length,bounded(v.story,0,3))};}}
  if(Array.isArray(raw.owned))p.owned=unique(raw.owned.filter(id=>STALL_ITEMS.some(x=>x.id===id))).slice(0,STALL_ITEMS.length);
  if(plain(raw.equipped))for(const x of STALL_ITEMS)if(raw.equipped[x.slot]===x.id&&p.owned.includes(x.id))p.equipped[x.slot]=x.id;
  if(Array.isArray(raw.secrets))p.secrets=unique(raw.secrets.filter(id=>SECRETS.some(x=>x.id===id)));
  if(Array.isArray(raw.settledEvents))p.settledEvents=unique(raw.settledEvents.filter(eventId)).slice(0,4096);
  p.specialServed=raw.specialServed===true;
  if(Array.isArray(raw.album))for(const a of raw.album.slice(-24)){
    if(!plain(a)||!safe(a)||!eventId(a.id)||!integer(a.level,0,11)||!integer(a.seed,0,0xffffffff))continue;
    const cake=cakeValue(a.cake);if(!cake||cake.folds!==2||!cake.batter||cake.spread.length<40||cake.eggs<1||cake.sauceCells.length<8||cake.fillings.length<1||p.album.some(x=>x.id===a.id))continue;
    p.album.push({id:a.id,name:cleanName(a.name),cake,level:a.level,seed:a.seed});
  }
  return p;
}
function cleanName(name){return typeof name==='string'&&name.trim()?name.replace(/[\x00-\x1f<>]/g,'').trim().slice(0,20)||'我的热乎小饼':'我的热乎小饼';}
export function createShift(options,progress){
  if(!plain(options)||!safe(options)||!MODES.includes(options.mode)||!integer(options.level,0,11)||!integer(options.seed,0,0xffffffff)||!eventId(options.eventId))return null;
  if(options.mode!=='creative'&&options.level>normalizeProgress(progress).unlockedLevel)return null;
  return {eventId:options.eventId,mode:options.mode,level:options.level,seed:options.seed,stage:'batter',index:0,total:options.mode==='creative'?1:6,elapsedMs:0,cookMs:0,orderMs:0,paused:true,finished:false,cake:emptyCake(),served:[],lastResult:null,packed:false};
}
function roll(seed,level,index){let x=(seed^Math.imul(level+1,2654435761)^Math.imul(index+1,2246822519))>>>0;x=Math.imul(x^(x>>>16),2246822507)>>>0;return (x^(x>>>13))>>>0;}
export function currentOrder(shift){
  if(!shift||!integer(shift.level,0,11)||!integer(shift.index,0,6)||!integer(shift.seed,0,0xffffffff))return null;
  const l=shift.level,i=Math.min(shift.index,5),n=roll(shift.seed,l,i),available=LEVELS[l].ingredients;
  const customerId=CUSTOMERS[(i+l)%6].id;
  let batter=l>=4&&(n%3===0||customerId==='owl')?'grain':'plain';
  const eggs=l>=3&&(customerId==='squirrel'||n%3===0)?2:1;
  let sauce=l>=2&&n%3===0?'spicy':'sweet';
  const sauceAmount=l>=3?(customerId==='squirrel'||n%3===1?'light':n%3===2?'extra':'normal'):'normal';
  let fillings=['crisp'];
  if(l>=1&&n%2===0)fillings.push('lettuce');
  if(l>=3&&customerId==='bear')fillings.push('crisp');
  if(l>=5&&n%3===0)fillings.push('ham');
  if(l>=6&&n%4===1)fillings.push('floss');
  if(l>=8&&n%3===2)fillings.push('cheese');
  if(l>=3&&customerId==='cat'&&n%2===1)fillings.push('coriander');
  const forbidden=[];
  if(customerId==='bunny'){forbidden.push('scallion');sauce='sweet';}
  if(l>=2&&n%2===1){forbidden.push('spicy');sauce='sweet';}
  if(l>=3&&customerId==='hedgehog')forbidden.push('coriander');
  if(l===0&&i===0)fillings=['crisp'];
  const open=l>=9&&(i===2||i===4),special=l===11&&i===5;
  fillings=fillings.filter(x=>available.includes(x)&&!forbidden.includes(x));
  const counts=Object.entries(fillings.reduce((a,x)=>(a[x]=(a[x]||0)+1,a),{}));
  const kind=l>=7&&i===1?'老样子：':'';
  const text=`${kind}${nameOf(batter)}，鸡蛋×${eggs}，${nameOf(sauce)}（${{light:'少酱',normal:'正常酱',extra:'多酱'}[sauceAmount]}），${counts.map(([id,count])=>`${nameOf(id)}×${count}`).join('、')}${forbidden.length?`；不要${forbidden.map(nameOf).join('、')}`:''}${open?'；其余配料随你搭配':''}${special?'。送给面面：面面天天开心，小雅快乐。':''}`;
  return {id:`${l}-${shift.seed}-${i}`,customerId,text,recipe:{batter,eggs,sauce,sauceAmount,fillings,forbidden:unique(forbidden),open},special};
}
function resultValue(v,index,mode,level,seed){
  if(!plain(v)||!safe(v)||v.index!==index||!integer(v.score,0,100)||!integer(v.coins,0,30)||typeof v.qualified!=='boolean'||v.qualified!==(v.score>=60)||typeof v.special!=='boolean'||!integer(v.cookMs,3000,20000)||!integer(v.orderMs,0,36000000))return null;
  const q=currentOrder({level,seed,index}),cake=cakeValue(v.cake);
  if(v.customerId!==q.customerId||v.special!==q.special||!cake||cake.folds!==2||cake.spread.length<40||cake.eggs<1||cake.sauceCells.length<8||cake.fillings.length<1||v.cookMs>v.orderMs)return null;
  if(mode==='creative'&&v.coins!==0)return null;
  if(!Array.isArray(v.feedback)||v.feedback.length>10||v.feedback.some(x=>typeof x!=='string'||x.length>150))return null;
  const available=LEVELS[level].ingredients;if([cake.batter,cake.sauce,...cake.fillings].some(x=>!available.includes(x)))return null;
  const expected=scoreOrder({index,mode,level,seed,cake,cookMs:v.cookMs,orderMs:v.orderMs});
  if(v.score!==expected.score||v.coins!==expected.coins||JSON.stringify(v.feedback)!==JSON.stringify(expected.feedback))return null;
  return expected;
}
export function normalizeShift(v){
  if(!plain(v)||!safe(v)||!eventId(v.eventId)||!MODES.includes(v.mode)||!integer(v.level,0,11)||!integer(v.seed,0,0xffffffff)||!STAGES.includes(v.stage)||!integer(v.index,0,6)||v.total!==(v.mode==='creative'?1:6))return null;
  if(!integer(v.elapsedMs,0,v.mode==='rush'?180000:36000000)||!integer(v.cookMs,0,v.mode==='rush'?20000:6000)||!integer(v.orderMs,0,36000000)||v.orderMs>v.elapsedMs||v.cookMs>v.orderMs||typeof v.paused!=='boolean'||typeof v.finished!=='boolean'||typeof v.packed!=='boolean'||!Array.isArray(v.served)||v.served.length>v.total)return null;
  const cake=cakeValue(v.cake);if(!cake)return null;
  const served=v.served.map((x,i)=>resultValue(x,i,v.mode,v.level,v.seed));if(served.some(x=>!x))return null;
  const servedMs=served.reduce((n,x)=>n+x.orderMs,0);
  // 超时会把制作和review都改成ended；仅最后作品、火候、等待均与交付结果
  // 一致的已打包状态，才可能是review超时。未完成当前单仍须累计。
  const last=served.at(-1);
  const endedAtReview=v.stage==='ended'&&v.mode==='rush'&&served.length<v.total&&last&&v.packed&&v.orderMs===last.orderMs&&v.cookMs===last.cookMs&&JSON.stringify(cake)===JSON.stringify(last.cake);
  const currentMs=v.stage==='review'||v.stage==='ended'&&(served.length===v.total||endedAtReview)?0:v.orderMs;
  if(servedMs+currentMs>v.elapsedMs)return null;
  const available=LEVELS[v.level].ingredients;if([cake.batter,cake.sauce,...cake.fillings].filter(Boolean).some(x=>!available.includes(x)))return null;
  if(v.finished!==(v.stage==='ended'))return null;
  if(v.finished){
    if(v.index!==served.length||!v.paused)return null;
    if(v.mode==='rush'){if(served.length<6&&v.elapsedMs!==180000)return null;}
    else if(served.length!==v.total)return null;
  } else if(v.stage==='review'){
    if(served.length!==v.index+1||served.length>=v.total||!v.packed)return null;
  } else if(v.index!==served.length||v.index>=v.total)return null;
  const rank=STAGES.indexOf(v.stage);
  // 不仅检查阶段最低要求，也拒绝提前出现的蛋、酱、馅和折痕。
  if(cake.eggs>0&&cake.spread.length<40)return null;
  if(v.cookMs>0&&cake.eggs<1)return null;
  if(cake.sauce!==null&&v.cookMs<3000)return null;
  if(cake.fillings.length&&cake.sauceCells.length<8)return null;
  if(cake.folds&&cake.fillings.length<1)return null;
  if(rank<2&&cake.eggs)return null;
  if(rank<3&&v.cookMs)return null;
  if(rank<4&&cake.sauce!==null)return null;
  if(rank<5&&cake.fillings.length)return null;
  if(rank<6&&cake.folds)return null;
  if(v.stage==='batter'&&(cake.batter!==null||v.cookMs||v.packed))return null;
  if(rank>=1&&rank<=8&&!cake.batter)return null;
  if(rank>=2&&rank<=8&&cake.spread.length<40)return null;
  if(rank>=3&&rank<=8&&cake.eggs<1)return null;
  if(rank>=4&&rank<=8&&v.cookMs<3000)return null;
  if(rank>=5&&rank<=8&&cake.sauceCells.length<8)return null;
  if(rank>=6&&rank<=8&&cake.fillings.length<1)return null;
  if(rank>=7&&rank<=8&&cake.folds!==2)return null;
  if(v.packed&&rank<7)return null;
  let lastResult=null;
  if(served.length){lastResult=resultValue(v.lastResult,served.length-1,v.mode,v.level,v.seed);if(!lastResult||JSON.stringify(lastResult)!==JSON.stringify(served.at(-1)))return null;}
  else if(v.lastResult!==null)return null;
  if((v.stage==='review'||v.finished&&served.length===v.total)&&(JSON.stringify(cake)!==JSON.stringify(lastResult.cake)||v.cookMs!==lastResult.cookMs||v.orderMs!==lastResult.orderMs||!v.packed))return null;
  return {eventId:v.eventId,mode:v.mode,level:v.level,seed:v.seed,stage:v.stage,index:v.index,total:v.total,elapsedMs:v.elapsedMs,cookMs:v.cookMs,orderMs:v.orderMs,paused:v.paused,finished:v.finished,cake,served,lastResult,packed:v.packed};
}
const cells=v=>Array.isArray(v)?unique(v.filter(x=>integer(x,0,63))):[];
const pattern=count=>Array.from({length:count},(_,i)=>(i*17+7)%64).sort((a,b)=>a-b);
function scoreOrder(s){
  const q=currentOrder(s),c=s.cake,r=q.recipe,feedback=[];let score=100;
  if(s.mode!=='creative'){
    if(c.batter!==r.batter){score-=18;feedback.push('下次记得核对面糊种类。');}
    if(c.eggs!==r.eggs){score-=15;feedback.push(`这位顾客要${r.eggs}个鸡蛋。`);}
    if(c.sauce!==r.sauce){score-=18;feedback.push('酱料口味和订单不一样。');}
    const supplied=c.fillings.reduce((a,x)=>(a[x]=(a[x]||0)+1,a),{}),required=r.fillings.reduce((a,x)=>(a[x]=(a[x]||0)+1,a),{});
    let missing=false,extra=false;
    for(const [id,n] of Object.entries(required))if((supplied[id]||0)<n)missing=true;
    if(!r.open)for(const [id,n] of Object.entries(supplied))if(n>(required[id]||0))extra=true;
    if(missing){score-=22;feedback.push('有配料或份数漏掉了。');}if(extra){score-=12;feedback.push('多放了订单外的配料。');}
    if(r.forbidden.some(id=>[c.batter,c.sauce,...c.fillings,...(c.eggs?['egg']:[])].includes(id))){score-=40;feedback.push('这次放入了顾客的忌口，下次先看红色提醒。');}
    const n=c.sauceCells.length,valid=r.sauceAmount==='light'?n>=8&&n<=22:r.sauceAmount==='extra'?n>=34:n>=23&&n<=35;
    if(!valid){score-=10;feedback.push(`酱量需要${{light:'少一点',normal:'适中',extra:'多一点'}[r.sauceAmount]}。`);}
    if(s.cookMs<4500){score-=20;feedback.push('饼皮还偏嫩，等到金黄会更香。');}
    else if(s.cookMs>8000){score-=Math.min(35,15+Math.floor((s.cookMs-8000)/500));feedback.push('这张饼有些过火了。');}
    if(s.mode==='rush'&&s.orderMs>35000){score-=Math.min(25,Math.floor((s.orderMs-35000)/2000)+1);feedback.push('顾客等得有些久，下次试试提前核对订单。');}
  }
  if(c.spread.length<46){score-=8;feedback.push('边缘还可以再摊匀一点。');}
  score=Math.max(0,score);
  if(!feedback.length)feedback.push(s.mode==='creative'?'你的热乎小饼完成啦，可以给作品起个名字。':'饼皮金黄，口味和份数都刚刚好！');
  return {index:s.index,customerId:q.customerId,score,coins:s.mode==='creative'?0:4+Math.floor(score/10),qualified:score>=60,feedback,special:q.special,cake:cakeValue(c),cookMs:s.cookMs,orderMs:s.orderMs};
}
export function applyAction(shift,action){
  const s=normalizeShift(shift);if(!s||!plain(action)||!safe(action)||typeof action.type!=='string')return shift;
  if(s.finished)return shift;
  if(action.type==='pause'){if(typeof action.value!=='boolean')return shift;return {...s,paused:action.value};}
  if(s.paused)return shift;
  const c=s.cake,available=LEVELS[s.level].ingredients;
  switch(action.type){
    case 'tick':{
      if(!integer(action.ms,0,1000))return shift;
      const delta=Math.min(action.ms,(s.mode==='rush'?180000:36000000)-s.elapsedMs);
      s.elapsedMs+=delta;
      if(s.stage!=='review')s.orderMs=Math.min(36000000,s.orderMs+delta);
      if(s.stage==='cook')s.cookMs=Math.min(s.mode==='rush'?20000:6000,s.cookMs+delta);
      if(s.mode==='rush'&&s.elapsedMs===180000){s.stage='ended';s.finished=true;s.paused=true;s.index=s.served.length;}
      return s;
    }
    case 'pour':if(s.stage!=='batter'||!ids('batter').includes(action.id)||!available.includes(action.id))return shift;c.batter=action.id;s.stage='spread';return s;
    case 'spread':if(s.stage!=='spread')return shift;c.spread=unique([...c.spread,...cells(action.cells)]).sort((a,b)=>a-b);return s;
    case 'spread-help':if(s.stage!=='spread')return shift;c.spread=unique([...c.spread,...pattern(48)]).sort((a,b)=>a-b);return s;
    case 'egg':if(s.stage!=='egg'||c.eggs>=2)return shift;c.eggs++;return s;
    case 'next':
      if(s.stage==='spread'&&c.spread.length>=40)s.stage='egg';
      else if(s.stage==='egg'&&c.eggs>=1)s.stage='cook';
      else if(s.stage==='cook'&&s.cookMs>=3000)s.stage='sauce';
      else if(s.stage==='sauce'&&c.sauceCells.length>=8)s.stage='fill';
      else if(s.stage==='fill'&&c.fillings.length>=1)s.stage='fold';
      else return shift;
      return s;
    case 'sauce':
      if(s.stage!=='sauce'||!ids('sauce').includes(action.id)||!available.includes(action.id))return shift;
      if(c.sauce!==action.id)c.sauceCells=[];c.sauce=action.id;c.sauceCells=unique([...c.sauceCells,...cells(action.cells)]).sort((a,b)=>a-b);return s;
    case 'sauce-help':{
      if(s.stage!=='sauce')return shift;const q=currentOrder(s).recipe,id=action.id??q.sauce;
      if(!ids('sauce').includes(id)||!available.includes(id))return shift;
      c.sauce=id;c.sauceCells=pattern({light:16,normal:28,extra:40}[q.sauceAmount]);return s;
    }
    case 'fill':if(s.stage!=='fill'||!ids('filling').includes(action.id)||!available.includes(action.id)||c.fillings.length>=12)return shift;c.fillings.push(action.id);return s;
    case 'undo-fill':if(s.stage!=='fill'||!c.fillings.length)return shift;c.fillings.pop();return s;
    case 'fold':if(s.stage!=='fold')return shift;c.folds++;if(c.folds===2)s.stage='pack';return s;
    case 'pack':if(s.stage!=='pack'||s.packed)return shift;s.packed=true;return s;
    case 'serve':{
      if(s.stage!=='pack'||!s.packed)return shift;
      const result=scoreOrder(s);s.served.push(result);s.lastResult=result;
      if(s.served.length===s.total){s.stage='ended';s.index=s.served.length;s.finished=true;s.paused=true;}else s.stage='review';return s;
    }
    case 'next-order':if(s.stage!=='review')return shift;return {...s,stage:'batter',index:s.served.length,cake:emptyCake(),cookMs:0,orderMs:0,packed:false};
    case 'remake':if(s.stage==='review')return shift;return {...s,stage:'batter',cake:emptyCake(),cookMs:0,packed:false};
    default:return shift;
  }
}
function availableSecrets(p){return SECRETS.filter(x=>!p.secrets.includes(x.id)&&secretEligible(p,x.id)).map(x=>x.id);}
function secretEligible(p,id){return (id==='paper'||id==='cat')?p.completed>=1:id==='photo'?p.levels.slice(0,4).every(x=>x>0):id==='special'?p.specialServed:false;}
export function settleShift(progress,shift,date){
  const p=normalizeProgress(progress),s=normalizeShift(shift);
  const summary={served:s?.served.length||0,qualified:s?.served.filter(x=>x.qualified).length||0,averageScore:s?.served.length?Math.round(s.served.reduce((n,x)=>n+x.score,0)/s.served.length):0,mode:s?.mode||null,level:s?.level??null,completed:false,unlockedLevel:p.unlockedLevel};
  const no=()=>({progress:p,coins:0,firstWin:false,secrets:availableSecrets(p),summary,rewardEligible:false});
  if(!s||!s.finished||s.mode==='creative'||!s.served.length||(s.mode==='relaxed'&&s.served.length!==s.total)||p.settledEvents.includes(s.eventId)||p.settledEvents.length>=4096||typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)return no();
  const firstWin=s.mode==='relaxed'&&p.levels[s.level]===0;
  const earned=s.served.reduce((n,x)=>n+x.coins,0),coins=Math.min(999999-p.coins,earned);p.coins+=coins;p.completed=Math.min(999999,p.completed+1);p.settledEvents.push(s.eventId);
  if(s.mode==='relaxed'){
    const stars=summary.qualified>=5?3:summary.qualified>=3?2:1;p.levels[s.level]=Math.max(p.levels[s.level],stars);p.unlockedLevel=Math.max(p.unlockedLevel,Math.min(11,s.level+1));
  }else p.bestRush=Math.max(p.bestRush,s.served.reduce((n,x)=>n+x.score,0));
  for(const x of s.served)if(x.qualified){const c=p.customers[x.customerId],customer=CUSTOMERS.find(y=>y.id===x.customerId);c.visits=Math.min(9999,c.visits+1);c.story=Math.min(customer.stories.length,Math.floor(c.visits/2));if(x.special)p.specialServed=true;}
  summary.completed=true;summary.unlockedLevel=p.unlockedLevel;
  return {progress:p,coins,firstWin,secrets:availableSecrets(p),summary,rewardEligible:true};
}
export function purchaseDecor(progress,id){
  const p=normalizeProgress(progress),item=STALL_ITEMS.find(x=>x.id===id);
  if(!item)return p;
  if(!p.owned.includes(id)){
    if(p.coins<item.price)return p;
    p.coins-=item.price;p.owned.push(id);
  }
  p.equipped[item.slot]=id;return p;
}
export function claimSecret(progress,id){const p=normalizeProgress(progress);if(secretEligible(p,id)&&!p.secrets.includes(id))p.secrets.push(id);return p;}
export function customerStory(progress,id){const p=normalizeProgress(progress),customer=CUSTOMERS.find(x=>x.id===id);if(!customer)return null;const c=p.customers[id];return {id,name:customer.name,visits:c.visits,chapter:c.story,stories:customer.stories.slice(0,c.story),next:c.story<customer.stories.length?`再接待${2-c.visits%2}次合格订单，解锁下一段故事。`:'这段故事已完整收藏。'};}
export function saveCreation(progress,shift,name){const p=normalizeProgress(progress),s=normalizeShift(shift);if(!s||s.mode!=='creative'||!s.finished||s.served.length!==1||p.album.some(x=>x.id===s.eventId))return p;p.album.push({id:s.eventId,name:cleanName(name),cake:cakeValue(s.served[0].cake),level:s.level,seed:s.seed});p.album=p.album.slice(-24);return p;}
