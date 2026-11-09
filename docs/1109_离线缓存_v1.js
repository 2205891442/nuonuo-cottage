const CACHE='nuonuo-cottage-v4-20261109-pancake-b';
const FILES=['./1109_糯糯小屋_v1.html','./1109_煎饼规则_v4.mjs','./1109_煎饼插画_v4.mjs','./1109_煎饼界面_v4.mjs','./1109_煎饼交互_v4.mjs','./1109_煎饼小铺_v4.css','./1109_界面_v1.css','./1109_高难看图_v2.css','./1109_耐玩精修_v3.css','./1109_核心_v1.mjs','./1109_插画_v1.mjs','./1109_应用_v1.mjs','./1109_精修场景_v3.mjs','./1109_成长规则_v3.mjs','./1109_游玩界面_v3.mjs','./1109_看图交互_v2.mjs','./1109_存档协调_v2.mjs','./1109_应用信息_v1.webmanifest','./1109_小屋图标_v1.svg','./1109_苹果图标_v1.png','./1109_安装图标_v1.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nuonuo-cottage-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
  return response;
 }).catch(async()=>{
  const saved=await caches.match(event.request);if(saved)return saved;
  if(event.request.mode==='navigate')return caches.match('./1109_糯糯小屋_v1.html');
  return new Response('离线时暂时无法读取此内容',{status:503});
 }));
});
