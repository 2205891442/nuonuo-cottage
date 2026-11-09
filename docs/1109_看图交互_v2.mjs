const W=1600,H=1050;
const limit=(n,min,max)=>Math.min(max,Math.max(min,n));
export function clampCamera(camera) {
 const zoom=limit(Number(camera.zoom)||1,1,6),edge=.5/zoom;
 return {zoom,x:limit(Number.isFinite(Number(camera.x))?Number(camera.x):.5,edge,1-edge),y:limit(Number.isFinite(Number(camera.y))?Number(camera.y):.5,edge,1-edge)};
}
export function zoomCamera(camera,zoom,anchor={x:.5,y:.5}) {
 const nextZoom=limit(zoom,1,6),x=camera.x+(anchor.x-.5)/camera.zoom-(anchor.x-.5)/nextZoom,y=camera.y+(anchor.y-.5)/camera.zoom-(anchor.y-.5)/nextZoom;
 return clampCamera({zoom:nextZoom,x,y});
}
export function panCamera(camera,dx,dy) {return clampCamera({...camera,x:camera.x-dx/camera.zoom,y:camera.y-dy/camera.zoom});}
export function scenePoint(camera,point) {return {x:(camera.x+(point.x-.5)/camera.zoom)*W,y:(camera.y+(point.y-.5)/camera.zoom)*H};}

export function mountViewer(root,{camera={zoom:1,x:.5,y:.5},onTap,onChange,onSwap}={}) {
 let view=clampCamera(camera),moved=false,pointerStart=null,pinch=null,lastTap=0,lastTapPoint=null,active=root.classList.contains('show-b')?1:0;
 const pointers=new Map(),boards=[...root.querySelectorAll('.detail-viewport')];
 function apply(){
  for(const board of boards)board.querySelector('.detail-surface').style.transform=`translate(${(0.5-view.x*view.zoom)*100}%,${(0.5-view.y*view.zoom)*100}%) scale(${view.zoom})`;
  const percent=root.querySelector('[data-zoom-value]');if(percent)percent.textContent=`${Math.round(view.zoom*100)}%`;
  root.querySelectorAll('[data-view-zoom]').forEach(button=>button.classList.toggle('active',Number(button.dataset.viewZoom)===view.zoom));
  onChange?.(view);
 }
 function normalized(event,board){const b=board.getBoundingClientRect();return {x:(event.clientX-b.left)/b.width,y:(event.clientY-b.top)/b.height};}
 function pointerDown(event){
  if(event.button!==0&&event.pointerType==='mouse')return;
  const board=event.currentTarget;board.focus({preventScroll:true});board.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});moved=false;pointerStart={x:event.clientX,y:event.clientY};
  if(pointers.size===2){const [a,b]=[...pointers.values()];const rect=board.getBoundingClientRect();pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),camera:{...view},anchor:{x:((a.x+b.x)/2-rect.left)/rect.width,y:((a.y+b.y)/2-rect.top)/rect.height}};moved=true;}
 }
 function pointerMove(event){
  if(!pointers.has(event.pointerId))return;
  const board=event.currentTarget,old=pointers.get(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
  if(pointers.size===2&&pinch){const[a,b]=[...pointers.values()];view=zoomCamera(pinch.camera,pinch.camera.zoom*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(pinch.distance,1),pinch.anchor);moved=true;apply();return;}
  if(pointerStart&&Math.hypot(event.clientX-pointerStart.x,event.clientY-pointerStart.y)>6)moved=true;
  if(moved){const rect=board.getBoundingClientRect();view=panCamera(view,(event.clientX-old.x)/rect.width,(event.clientY-old.y)/rect.height);apply();}
 }
 function pointerUp(event){
  if(!pointers.has(event.pointerId))return;
  const wasPinch=!!pinch,p=normalized(event,event.currentTarget);
  pointers.delete(event.pointerId);if(pointers.size<2)pinch=null;
  if(!moved&&!wasPinch&&event.type==='pointerup'){
   const now=Date.now();
   if(now-lastTap<280&&lastTapPoint&&Math.hypot(p.x-lastTapPoint.x,p.y-lastTapPoint.y)<.06){view=zoomCamera(view,view.zoom<2?3:1,p);apply();lastTap=0;}
   else {lastTap=now;lastTapPoint=p;onTap?.(scenePoint(view,p),view.zoom);}
  }
  if(!pointers.size)pointerStart=null;
 }
 function keyDown(event){
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','=','0'].includes(event.key))event.preventDefault();
  if(event.key==='+'||event.key==='=')view=zoomCamera(view,view.zoom+1);
  if(event.key==='-')view=zoomCamera(view,view.zoom-1);
  if(event.key==='0')view={zoom:1,x:.5,y:.5};
  if(event.key==='ArrowLeft')view=panCamera(view,.16,0);
  if(event.key==='ArrowRight')view=panCamera(view,-.16,0);
  if(event.key==='ArrowUp')view=panCamera(view,0,.16);
  if(event.key==='ArrowDown')view=panCamera(view,0,-.16);
  apply();
 }
 function wheel(event){event.preventDefault();view=zoomCamera(view,view.zoom*Math.exp(-event.deltaY*.002),normalized(event,event.currentTarget));apply();}
 for(const board of boards){board.addEventListener('pointerdown',pointerDown);board.addEventListener('pointermove',pointerMove);board.addEventListener('pointerup',pointerUp);board.addEventListener('pointercancel',pointerUp);board.addEventListener('wheel',wheel,{passive:false});board.addEventListener('keydown',keyDown);}
 root.addEventListener('click',event=>{const button=event.target.closest('[data-view-zoom]');if(button){view=zoomCamera(view,Number(button.dataset.viewZoom));apply();}});
 apply();
 return {
  getCamera:()=>({...view}),
  focus(point,zoom=3){view=clampCamera({zoom,x:point.x/W,y:point.y/H});apply();},
  swap(){active=1-active;root.classList.toggle('show-b',active===1);onSwap?.(active);},
  destroy(){for(const board of boards){board.removeEventListener('pointerdown',pointerDown);board.removeEventListener('pointermove',pointerMove);board.removeEventListener('pointerup',pointerUp);board.removeEventListener('pointercancel',pointerUp);board.removeEventListener('wheel',wheel);board.removeEventListener('keydown',keyDown);}},
 };
}
