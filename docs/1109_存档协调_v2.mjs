import {createState,validateSave} from './1109_核心_v1.mjs';

export function createStore(storage,key,locks=globalThis.navigator?.locks) {
  function read() {
    const raw=storage.getItem(key);
    if(!raw)return createState();
    const safe=validateSave(raw),input=JSON.parse(raw);
    // 页面间的事务保留正在揭晓的牌；启动时由界面显式收起未配对牌。
    if(safe.activeMemory&&Array.isArray(input.activeMemory?.open)) {
      const ids=input.activeMemory.open;
      if(ids.length<=2&&new Set(ids).size===ids.length&&ids.every(id=>safe.activeMemory.deck.some(card=>card.id===id)&&!safe.activeMemory.matched.includes(id)))safe.activeMemory.open=[...ids];
    }
    return safe;
  }
  function update(transform) {
    const operation=()=>{
      const result=transform(read());
      if(!result||typeof result.then==='function')throw new Error('存档更新必须一次完成');
      const safe=validateSave(JSON.stringify(result));
      if(safe.activeMemory&&result.activeMemory?.eventId===safe.activeMemory.eventId) {
        const ids=result.activeMemory.open;
        if(Array.isArray(ids)&&ids.length<=2&&new Set(ids).size===ids.length&&ids.every(id=>safe.activeMemory.deck.some(c=>c.id===id)&&!safe.activeMemory.matched.includes(id)))safe.activeMemory.open=[...ids];
      }
      storage.setItem(key,JSON.stringify(safe));
      return safe;
    };
    if(locks?.request)return locks.request(key+'-write',operation);
    try{return Promise.resolve(operation());}catch(error){return Promise.reject(error);}
  }
  function replace(input) {
    const safe=validateSave(JSON.stringify(input));
    const operation=()=>{storage.setItem(key,JSON.stringify(safe));return safe;};
    return locks?.request?locks.request(key+'-write',operation):Promise.resolve(operation());
  }
  return {read,update,replace};
}
