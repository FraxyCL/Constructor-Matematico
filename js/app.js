const $=s=>document.querySelector(s),R=(x,p)=>typeof x==='function'?x(p):x;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2200)}
const SIZES={square:[800,800],landscape:[1200,800],wide:[1600,900],portrait:[800,1200]};
const App={zoom:1,fit:true,open:new Set(['geometry','fractions','functions','transforms','circles']),
 init(){try{if(localStorage.getItem('cm-dark'))document.body.classList.add('dark')}catch(e){}State.cur='fraction-circle';State.p();History.push();this.bind();this.refresh()},
 refresh(){this.side();this.panel();this.draw()},
 side(){$('#side').innerHTML=Registry.cats.map(c=>{const its=Registry.byCat(c.id),o=this.open.has(c.id);
  return `<div><button class="cat-h" data-cat="${c.id}"><span>${c.icon}</span><b>${c.name}</b><i>${o?'▾':'▸'}</i></button>`+(o?`<div class="items">`+its.map(i=>`<button class="item${i.id===State.cur?' on':''}" data-id="${i.id}" title="${i.description}">${i.icon} ${i.name}</button>`).join('')+c.planned.map(n=>`<span class="item soon">${n} <em>pronto</em></span>`).join('')+(its.length+c.planned.length?'':'<span class="item soon">Próximamente</span>')+`</div>`:'')+`</div>`}).join('')},
 ctl(q,p){const v=p[q.key],a=`data-k="${q.key}"`,L=R(q.label,p);
  if(q.type==='check')return `<label class="chk"><input type="checkbox" ${a} ${v?'checked':''}>${L}</label>`;
  if(q.type==='range'){const at=`min="${R(q.min,p)}" max="${R(q.max,p)}" step="${q.step||(q.max<10?.1:1)}" value="${v}"`;return `<label>${L}<span class="row"><input type="range" ${a} ${at}><input type="number" ${a} ${at}></span></label>`}
  if(q.type==='area')return `<label>${L}<textarea ${a} rows="${q.rows||5}">${Draw.esc(v)}</textarea></label>`;
  if(q.type==='color')return `<label class="clr">${L}<input type="color" ${a} value="${v}"></label>`;
  if(q.type==='select')return `<label>${L}<select ${a}>${q.options.map(o=>`<option value="${o[0]}" ${o[0]===v?'selected':''}>${o[1]}</option>`).join('')}</select></label>`;
  return `<label>${L}<input type="text" ${a} value="${Draw.esc(v)}"></label>`},
 panel(){const k=Registry.get(State.cur),c=State.canvas;let h=`<h3>${k?k.icon+' '+k.name:'Sin construcción'}</h3>`;
  if(k){const p=State.p();let g='';k.parameters.forEach(q=>{if(q.show&&!q.show(p))return;if(q.group!==g){g=q.group;h+=`<h4>${g}</h4>`}h+=this.ctl(q,p)});h+=`<button class="ghost" data-act="resetstyle">↺ Restablecer estilo</button>`}
  else h+='<p class="hint">Elige una construcción en el menú lateral.</p>';
  h+=`<h4>Lienzo</h4><label>Tamaño<select data-c="preset">${[['square','Cuadrado 800×800'],['landscape','Horizontal 1200×800'],['wide','Panorámico 1600×900'],['portrait','Vertical 800×1200'],['custom','Personalizado']].map(o=>`<option value="${o[0]}" ${c.preset===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select></label>
  <div class="row"><label>Ancho<input type="number" data-c="w" value="${c.w}"></label><label>Alto<input type="number" data-c="h" value="${c.h}"></label></div>
  <label>Resolución PNG<select data-c="scale">${[1,2,3,4].map(n=>`<option value="${n}" ${c.scale===n?'selected':''}>${n}×</option>`).join('')}</select></label>
  <label>Estilo del lienzo<select data-c="theme">${[['light','Claro'],['dark','Oscuro'],['gray','Escala de grises']].map(o=>`<option value="${o[0]}" ${(c.theme||'light')===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select></label>
  <label class="chk"><input type="checkbox" data-c="transparent" ${c.transparent?'checked':''}>Fondo transparente</label><label class="chk"><input type="checkbox" data-c="grid" ${c.grid?'checked':''}>Mostrar cuadrícula (no se exporta)</label>`;
  $('#panel').innerHTML=h},
 draw(){const c=State.canvas,k=Registry.get(State.cur);
  const th=c.theme||'light',FX={dark:'<filter id="fx" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.574 -1.43 -0.144 0 1 -0.426 -0.43 -0.144 0 1 -0.426 -1.43 0.856 0 1 0 0 0 1 0"/></filter>',gray:'<filter id="fx" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/></filter>'}[th]||'';
  $('#paper').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c.w} ${c.h}">${FX?`<defs>${FX}</defs>`:''}${c.transparent?'':`<rect width="${c.w}" height="${c.h}" fill="${th==='dark'?'#0f172a':'#fff'}"/>`}<g${FX?' filter="url(#fx)"':''}>${k?k.render(State.p(),c.w,c.h):''}</g></svg>`;
  
this.layout()},
 layout(){const c=State.canvas,v=$('#viewport'),pp=$('#paper');if(this.fit)this.zoom=Math.min((v.clientWidth-48)/c.w,(v.clientHeight-48)/c.h,2);
  pp.style.width=c.w*this.zoom+'px';pp.style.height=c.h*this.zoom+'px';pp.style.setProperty('--g',20*this.zoom+'px');
  pp.classList.toggle('grid',c.grid);pp.classList.toggle('transp',c.transparent);$('#zl').textContent=Math.round(this.zoom*100)+'%'},
 zoomBy(f){this.fit=false;this.zoom=Math.min(4,Math.max(.1,this.zoom*f));this.layout()},
 sync(k,p){k.parameters.forEach(q=>document.querySelectorAll(`#panel [data-k="${q.key}"]`).forEach(el=>{if(el.type==='checkbox'||el===document.activeElement)return;el.value=p[q.key];if(typeof q.max==='function')el.max=q.max(p)}))},
 onIn(e,commit){const t=e.target,k=t.dataset.k,c=t.dataset.c;if(!k&&!c)return;
  let v=t.type==='checkbox'?t.checked:(t.type==='number'||t.type==='range')?parseFloat(t.value):t.value;if(typeof v==='number'&&isNaN(v))return;
  if(k){const kc=Registry.get(State.cur),p=State.p(),q=kc.parameters.find(x=>x.key===k);
   if(q.type==='range'){const lo=R(q.min,p),hi=R(q.max,p),w=Math.min(hi,Math.max(lo,v));if(w!==v){if(!commit)return;toast(`${q.label}: valor entre ${lo} y ${hi}`);v=w}}
   p[k]=v;kc.normalize&&kc.normalize(p);this.sync(kc,p)}
  else{if((c==='w'||c==='h')&&(v<100||v>4000)){if(commit)toast('Medida entre 100 y 4000 px');return}
   if(c==='preset'){State.canvas.preset=v;if(SIZES[v]){State.canvas.w=SIZES[v][0];State.canvas.h=SIZES[v][1]}}else{State.canvas[c]=v;if(c==='w'||c==='h')State.canvas.preset='custom'}
   if(c==='scale')State.canvas.scale=+v;if(c!=='scale'&&commit)this.fit=true}
  this.draw();if(commit){History.push();this.panel()}},
 act(a){const go=r=>r?this.refresh():0,A={
  dark:()=>{const d=document.body.classList.toggle('dark');try{localStorage.setItem('cm-dark',d?'1':'')}catch(e){}},
  new:()=>{State.params={};State.canvas={...DEF_CANVAS};State.cur=State.cur||'fraction-circle';State.p();History.push();this.fit=true;this.refresh()},
  undo:()=>go(History.undo()),redo:()=>go(History.redo()),
  clear:()=>{State.cur=null;History.push();this.refresh()},
  resetstyle:()=>{const p=State.p();Registry.get(State.cur).parameters.filter(q=>q.style).forEach(q=>p[q.key]=q.def);History.push();this.refresh()},
  xv:()=>{document.body.classList.toggle('xv');this.fit=true;setTimeout(()=>this.layout(),0)},
  copy:()=>Export.copy(),png:()=>Export.download('png'),svg:()=>Export.download('svg'),
  zin:()=>this.zoomBy(1.2),zout:()=>this.zoomBy(1/1.2),zfit:()=>{this.fit=true;this.layout()},z100:()=>{this.fit=false;this.zoom=1;this.layout()}};
  A[a]&&A[a]()},
 bind(){
  document.addEventListener('click',e=>{const b=e.target.closest('[data-act],[data-cat],[data-id]');if(!b)return;const d=b.dataset;
   if(d.cat){this.open.has(d.cat)?this.open.delete(d.cat):this.open.add(d.cat);this.side()}
   else if(d.id){State.cur=d.id;State.p();History.push();this.refresh()}else this.act(d.act)});
  const pn=$('#panel');pn.addEventListener('input',e=>this.onIn(e,false));pn.addEventListener('change',e=>this.onIn(e,true));
  addEventListener('resize',()=>this.layout());
  addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('xv'))this.act('xv');
   if((e.ctrlKey||e.metaKey)&&!e.target.matches('input[type=text],textarea')){if(e.key==='z'){e.preventDefault();this.act(e.shiftKey?'redo':'undo')}if(e.key==='y'){e.preventDefault();this.act('redo')}}});
  $('#viewport').addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();this.zoomBy(e.deltaY<0?1.1:.9)}},{passive:false})}
};
