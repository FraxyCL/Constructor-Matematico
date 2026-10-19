// Combinatoria: principio multiplicativo, permutaciones y combinaciones, con árbol, lista, tabla, casillas, triángulo de Pascal y relación P = C · r!
(()=>{
const {P,C,K,T,A,S}=Registry.h,ts=()=>Registry.h.ts(24),fm=x=>x.toLocaleString('es-CL');
const PAL=['#3b82f6','#ef4444','#22c55e','#f59e0b','#8b5cf6','#06b6d4','#ec4899','#84cc16'];
const fact=n=>{let r=1;for(let i=2;i<=n;i++)r*=i;return r};
const tokens=(s,max)=>{let t=String(s).split(/[\s,;]+/).filter(Boolean);if(t.length===1&&t[0].length>1&&t[0].length<=max)t=t[0].split('');return t.slice(0,max)};
const nCr=(n,r)=>{if(r<0||r>n)return 0;let x=1;for(let i=1;i<=r;i++)x=x*(n-r+i)/i;return Math.round(x)};
const warn=(p,W,H,a,b)=>Draw.t(W/2,H/2-p.fontSize*.7,a,p,{c:'#64748b',fs:p.fontSize*.9})+(b?Draw.t(W/2,H/2+p.fontSize*.8,b,p,{c:'#64748b',fs:p.fontSize*.9}):'');
const lines=(p,W,H,L)=>{const fs=p.fontSize;return L.map((t,i)=>Draw.t(W/2,H-(L.length-i)*fs*1.3+fs*.2,t,p,{fs:Math.min(fs*.9,W*.94/(t.length*.5)),w:i===0?700:400})).join('')};
const belowH=(p,L)=>L.length?L.length*p.fontSize*1.3+p.fontSize*.5:0;

// ---- árbol horizontal genérico: raíz {l,ch:[]}; todas las hojas a la misma profundidad ----
const leaves=n=>n.ch.length?n.ch.reduce((a,c)=>a+leaves(c),0):1;
const depth=n=>n.ch.length?1+depth(n.ch[0]):0;
function tree(p,W,top,avail,root,o={}){const fs=p.fontSize,L=leaves(root),D=depth(root),root0=p.showRoot,cols=D+(root0?1:0),heads=o.heads&&p.showHeads?o.heads:null,hh=heads?fs*1.5:0,rowH=(avail-hh)/L;
 const lvl=[];(function walk(n,d){(lvl[d]=lvl[d]||[]).push(n);n.ch.forEach(c=>walk(c,d+1))})(root,0);
 const paths=[];(function walk(n,acc){if(!n.ch.length)paths.push(acc);else n.ch.forEach(c=>walk(c,acc.concat(c.l)))})(root,[]);
 const sep=o.sep||' ',leafT=paths.map(a=>a.join(sep)),
  fit=f=>{const wl=[];for(let d=root0?0:1;d<=D;d++)wl.push(f*(Math.max(...lvl[d].map(n=>String(n.l).length))*.6+1.3));
   const lw=p.showLeaf?f*(Math.max(...leafT.map(s=>s.length))*.58+1.2):0,tot=wl.reduce((a,b)=>a+b,0)+lw,gap=(W*.95-tot)/Math.max(.5,wl.length-1+(p.showLeaf?.5:0));return{wl,lw,gap}};
 let f=Math.min(fs,rowH*.74),F=fit(f);while((F.gap<f*1.1)&&f>5){f*=.93;F=fit(f)}
 if(f<5.5)return null;
 const yOf=new Map();let k=0;(function place(n){if(!n.ch.length){yOf.set(n,top+hh+(k+.5)*rowH);k++}else{n.ch.forEach(place);yOf.set(n,(yOf.get(n.ch[0])+yOf.get(n.ch[n.ch.length-1]))/2)}})(root);
 const gap=Math.min(F.gap,f*7),total=F.wl.reduce((a,b)=>a+b,0)+gap*(F.wl.length-1)+(p.showLeaf?gap*.5+F.lw:0),x0=(W-total)/2,xs=[];let x=x0;F.wl.forEach(w=>{xs.push(x);x+=w+gap});
 const col=d=>PAL[(d-1+PAL.length)%PAL.length],bh=Math.min(f*1.7,rowH*.9);let g='',ed='';
 const cx=d=>xs[d-(root0?0:1)],cw=d=>F.wl[d-(root0?0:1)];
 if(heads)heads.forEach((h,i)=>{const d=i+1;if(h)g+=Draw.t(cx(d)+cw(d)/2,top+hh*.55,h,p,{fs:f*.85,w:700,c:col(d)})});
 (function draw(n,d){if(d>=(root0?0:1)){const x1=cx(d),y=yOf.get(n),c=d===0?'#64748b':col(d);g+=`<rect x="${x1}" y="${y-bh/2}" width="${cw(d)}" height="${bh}" rx="${bh*.3}" fill="${c}" fill-opacity="${d===0?.12:.16}" stroke="${c}" stroke-width="${p.strokeW}"/>`+Draw.t(x1+cw(d)/2,y,n.l,p,{b:'central',fs:f,w:d===0?400:700})}
  n.ch.forEach(ch=>{if(d>=(root0?0:1))ed+=`<line x1="${cx(d)+cw(d)}" y1="${yOf.get(n)}" x2="${cx(d+1)}" y2="${yOf.get(ch)}" stroke="#94a3b8" stroke-width="${Math.max(1,p.strokeW*.6)}"/>`;draw(ch,d+1)});
  if(!n.ch.length&&p.showLeaf){const xe=cx(d)+cw(d)+gap*.5;ed+=`<line x1="${cx(d)+cw(d)}" y1="${yOf.get(n)}" x2="${xe}" y2="${yOf.get(n)}" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3"/>`;g+=Draw.t(xe+f*.3,yOf.get(n),leafT[[...yOf.keys()].filter(q=>!q.ch.length).indexOf(n)],p,{a:'start',b:'central',fs:f*.95,c:p.textColor})}})(root,0);
 return ed+g}

// ---- rejilla de resultados ----
function grid(p,W,top,avail,items){const N=items.length,fs=p.fontSize;let f=fs;const lay=f=>{const cw=f*(Math.max(...items.map(s=>s.length))*.6+1.1),c=Math.max(1,Math.floor(W*.94/cw));return{cw,c,h:Math.ceil(N/c)*f*1.6}};
 let a=lay(f);while(a.h>avail&&f>5){f*=.94;a=lay(f)}if(a.h>avail||f<5.5)return null;
 const cols=Math.min(a.c,N),x0=(W-cols*a.cw)/2,rows=Math.ceil(N/cols),y0=top+(avail-rows*f*1.6)/2;
 return items.map((s,i)=>{const x=x0+(i%cols)*a.cw,y=y0+Math.floor(i/cols)*f*1.6;return `<rect x="${x+a.cw*.04}" y="${y+f*.1}" width="${a.cw*.92}" height="${f*1.4}" rx="${f*.3}" fill="${PAL[i%8]}" fill-opacity=".13" stroke="${PAL[i%8]}" stroke-width="1"/>`+Draw.t(x+a.cw/2,y+f*.8,s,p,{b:'central',fs:f})}).join('')}

// ---- casillas ×  ----
function boxes(p,W,top,avail,cells,res,den){const fs=p.fontSize,n=cells.length,bw=Math.min(fs*5,(W*.9)/(n*1.5)),bh=bw*.9,f=Math.min(fs,bw*.42);let g='';const tot=n*bw+(n-1)*bw*.5,x0=(W-tot)/2,cy=top+avail/2-bh*.2;
 cells.forEach((c,i)=>{const x=x0+i*bw*1.5;g+=`<rect x="${x}" y="${cy-bh/2}" width="${bw}" height="${bh}" rx="${bw*.15}" fill="${c.c||PAL[i%8]}" fill-opacity=".18" stroke="${c.c||PAL[i%8]}" stroke-width="${p.strokeW}"/>`+Draw.t(x+bw/2,cy,c.n,p,{b:'central',fs:f*1.5,w:700})+(c.top?Draw.t(x+bw/2,cy-bh/2-f*.6,c.top,p,{fs:f*.8,c:'#64748b'}):'')+(i<n-1?Draw.t(x+bw*1.25,cy,'×',p,{b:'central',fs:f*1.3}):'')});
 return g+Draw.t(W/2,cy+bh/2+fs*1.6,res,p,{fs:fs*1.2,w:700,c:p.colRes})}

const common=()=>[C('colRes','Color del resultado','#dc2626','Estilo'),P('strokeW','Grosor de las líneas',2,1,8,'Estilo',{style:true,step:.5}),...ts()];

// ================= Principio multiplicativo =================
const stages=s=>String(s).split('\n').map(l=>l.trim()).filter(Boolean).slice(0,4).map(l=>{const i=l.indexOf(':'),name=i<0?'':l.slice(0,i).trim(),opts=(i<0?l:l.slice(i+1)).split(/[,;]/).map(x=>x.trim()).filter(Boolean).slice(0,8);return{name,opts}}).filter(s=>s.opts.length);
Registry.register({id:'comb-mult',category:'combinatorics',name:'Principio multiplicativo',icon:'✖',description:'Todas las combinaciones de varias elecciones: árbol, tabla, lista o casillas',
 parameters:[A('st','Elecciones (una por línea: nombre: opción, opción…)','Polera: roja, azul, verde\nPantalón: negro, jeans','Elecciones',5),
  S('method','Representación','tree','Representación',[['tree','Diagrama de árbol'],['table','Tabla de doble entrada'],['list','Lista de resultados'],['boxes','Casillas (n × m × …)']]),
  K('showRoot','Mostrar el inicio del árbol',true,'Árbol',p=>p.method==='tree'),K('showHeads','Nombre de cada elección sobre el árbol',true,'Árbol',p=>p.method==='tree'),K('showLeaf','Escribir cada resultado al final',true,'Árbol',p=>p.method==='tree'),
  K('showRes','Escribir la cuenta',true,'Mostrar'),...common()],
 render(p,W,H){const fs=p.fontSize,st=stages(p.st),T0=Draw.title(p,W);
  if(st.length<1)return T0+Draw.t(W/2,H/2,'Escribe al menos una elección',p,{c:'#94a3b8'});
  const ns=st.map(s=>s.opts.length),tot=ns.reduce((a,b)=>a*b,1),Ls=p.showRes?[`${ns.join(' × ')} = ${fm(tot)} combinaciones posibles`]:[],tH=Draw.titleH(p),top=tH+fs*.6,avail=H-tH-belowH(p,Ls)-fs;let g='';
  const all=[];(function w(i,a){if(i===st.length){all.push(a);return}st[i].opts.forEach(o=>w(i+1,a.concat(o)))})(0,[]);
  if(p.method==='tree'){const mk=(i)=>st[i]?st[i].opts.map(o=>({l:o,ch:mk(i+1)})):[];const root={l:'Inicio',ch:mk(0)},r=tot<=160?tree(p,W,top,avail,root,{heads:st.map(s=>s.name),sep:' – '}):null;g=r||warn(p,W,H,`Hay ${fm(tot)} resultados: son demasiados para el árbol.`,'Prueba con «Casillas» o reduce las opciones.')}
  else if(p.method==='list'){g=tot<=800?grid(p,W,top,avail,all.map(a=>a.join(' – '))):null;g=g||warn(p,W,H,`Hay ${fm(tot)} resultados: son demasiados para listarlos.`)}
  else if(p.method==='boxes')g=boxes(p,W,top,avail,st.map((s,i)=>({n:ns[i],top:s.name})),`${ns.join(' × ')} = ${fm(tot)}`);
  else{const cn=ns[ns.length-1],rn=tot/cn;if(rn>40||st.length<2)g=warn(p,W,H,st.length<2?'La tabla necesita al menos dos elecciones.':'Hay demasiadas filas para la tabla.');
   else{const rowsA=all.filter((_,i)=>i%cn===0).map(a=>a.slice(0,-1).join(' – ')),lw=Math.max(...rowsA.map(s=>s.length)),f0=fs;let f=f0;const wl=f=>f*(lw*.58+1.2),wc=f=>Math.max(f*3,f*(Math.max(...st[st.length-1].opts.map(s=>s.length))*.6+1.2)),rh=f=>f*2.1;
    while((wl(f)+cn*wc(f)>W*.95||(rn+1)*rh(f)>avail)&&f>5)f*=.94;const x0=(W-wl(f)-cn*wc(f))/2,y0=top+(avail-(rn+1)*rh(f))/2,cell=(x,y,w,t,fill,b,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${rh(f)}" fill="${fill}" stroke="#64748b" stroke-width="1.2"/>`+Draw.t(x+w/2,y+rh(f)/2,t,p,{b:'central',fs:f,w:b?700:400,c});
    g+=cell(x0,y0,wl(f),st.slice(0,-1).map(s=>s.name).filter(Boolean).join(' – ')||'',"#dbeafe",true)+st[st.length-1].opts.map((o,j)=>cell(x0+wl(f)+j*wc(f),y0,wc(f),o,'#dbeafe',true,PAL[j%8])).join('');
    rowsA.forEach((rl,i)=>{g+=cell(x0,y0+(i+1)*rh(f),wl(f),rl,'#f1f5f9',true);for(let j=0;j<cn;j++)g+=cell(x0+wl(f)+j*wc(f),y0+(i+1)*rh(f),wc(f),`${i*cn+j+1}`,'#fff',false,'#475569')})}}
  return T0+g+(Ls.length?lines(p,W,H,Ls):'')}});

// ================= Permutaciones =================
const uniq=a=>{const m=new Map();a.forEach(x=>m.set(x,(m.get(x)||0)+1));return m};
function permTree(items,r,fixed){const cnt=uniq(items);const mk=(d)=>d===0?[]:[...cnt.keys()].filter(k=>cnt.get(k)>0).map(k=>{cnt.set(k,cnt.get(k)-1);const ch=mk(d-1);cnt.set(k,cnt.get(k)+1);return{l:k,ch}});
 if(fixed!==undefined){cnt.set(fixed,cnt.get(fixed)-1);return{l:'Inicio',ch:[{l:fixed,ch:mk(r-1)}]}}return{l:'Inicio',ch:mk(r)}}
Registry.register({id:'comb-perm',category:'combinatorics',name:'Permutaciones',icon:'🔀',description:'Ordenar elementos: simples, de r en n, con elementos repetidos y circulares',
 parameters:[T('el','Elementos (separados por espacios o comas; o letras juntas)','A B C','Elementos'),
  S('kind','Tipo','simple','Elementos',[['simple','Simples: ordenar r de los n elementos'],['rep','Con elementos repetidos (anagramas)'],['circ','Circulares (en una mesa)']]),
  P('r','Elementos a ordenar (r)',3,1,8,'Elementos',{show:p=>p.kind==='simple'}),
  S('method','Representación','tree','Representación',[['tree','Diagrama de árbol'],['list','Lista de ordenaciones'],['boxes','Casillas (n × (n−1) × …)']]),
  K('showRoot','Mostrar el inicio del árbol',true,'Árbol',p=>p.method==='tree'),K('showHeads','Rotular las posiciones (1.º, 2.º…)',true,'Árbol',p=>p.method==='tree'),K('showLeaf','Escribir cada ordenación al final',true,'Árbol',p=>p.method==='tree'),
  K('showRes','Escribir la fórmula',true,'Mostrar'),...common()],
 render(p,W,H){const fs=p.fontSize,T0=Draw.title(p,W),items=tokens(p.el,8),n=items.length;
  if(n<2)return T0+Draw.t(W/2,H/2,'Escribe al menos dos elementos (por ejemplo: A B C)',p,{c:'#94a3b8'});
  const cnt=uniq(items),kind=p.kind,r=kind==='simple'?Math.min(Math.max(1,p.r),n):n,m=kind==='circ'?n-1:r;
  let total,form;const rep=[...cnt.values()].filter(v=>v>1);
  if(kind==='simple'){total=fact(n)/fact(n-r);form=r===n?`P(${n}) = ${n}! = ${fm(total)}`:`P(${n}, ${r}) = ${n}! / (${n}−${r})! = ${fm(total)}`;
   if(rep.length)form+='   (con elementos repetidos hay menos ordenaciones distintas)';}
  else if(kind==='rep'){total=fact(n)/[...cnt.values()].reduce((a,v)=>a*fact(v),1);form=`${n}! / (${[...cnt.values()].map(v=>v+'!').join(' · ')}) = ${fm(total)}`;if(!rep.length)form=`No hay elementos repetidos: ${n}! = ${fm(total)}`}
  else{total=fact(n-1);form=`(${n}−1)! = ${n-1}! = ${fm(total)}`}
  const Ls=p.showRes?[form,kind==='simple'&&r<n?`${[...Array(r)].map((_,i)=>n-i).join(' × ')} = ${fm(total)}`:kind==='circ'?'Se fija un elemento y se ordenan los demás':''].filter(Boolean):[],tH=Draw.titleH(p),top=tH+fs*.6,avail=H-tH-belowH(p,Ls)-fs;let g='';
  if(p.method==='boxes'){const cells=kind==='rep'?[...Array(n)].map((_,i)=>({n:n-i,top:`${i+1}.º`})):kind==='circ'?[{n:1,top:'fijo',c:'#64748b'},...[...Array(n-1)].map((_,i)=>({n:n-1-i,top:`${i+2}.º`}))]:[...Array(r)].map((_,i)=>({n:n-i,top:`${i+1}.º`}));
   const prod=cells.map(c=>c.n).join(' × ');g=boxes(p,W,top,avail,cells,kind==='rep'&&rep.length?`${prod} = ${fm(fact(n))}  →  ÷ repeticiones = ${fm(total)}`:`${prod} = ${fm(total)}`)}
  else{if(total>(p.method==='tree'?160:800))g=warn(p,W,H,`Hay ${fm(total)} ordenaciones: son demasiadas para dibujarlas.`,'Usa «Casillas» o menos elementos.');
   else{const root=kind==='circ'?permTree(items.slice(1),n-1,undefined):permTree(items,m);
    if(kind==='circ')root.ch=[{l:items[0],ch:root.ch}];
    const heads=kind==='circ'?['fijo',...[...Array(n-1)].map((_,i)=>`${i+2}.º`)]:[...Array(m)].map((_,i)=>`${i+1}.º`),sepl=' – ';
    if(p.method==='tree')g=tree(p,W,top,avail,root,{heads,sep:sepl})||warn(p,W,H,'No cabe el árbol: usa «Lista» o menos elementos.');
    else{const compact=items.every(x=>x.length===1),out=[];(function w(nd,a){if(!nd.ch.length)out.push(a.join(compact?'':sepl));else nd.ch.forEach(c=>w(c,a.concat(c.l)))})(root,[]);g=grid(p,W,top,avail,out)||warn(p,W,H,'No caben todas las ordenaciones.')}}}
  return T0+g+(Ls.length?lines(p,W,H,Ls):'')}});

// ================= Combinaciones =================
function subsets(n,r){const o=[];(function w(s,a){if(a.length===r){o.push(a.slice());return}for(let i=s;i<n;i++){a.push(i);w(i+1,a);a.pop()}})(0,[]);return o}
Registry.register({id:'comb-comb',category:'combinatorics',name:'Combinaciones',icon:'🎯',description:'Elegir r de n elementos sin importar el orden: lista, árbol, triángulo de Pascal y relación con las permutaciones',
 parameters:[T('el','Elementos (separados por espacios o comas; o letras juntas)','A B C D','Elementos'),
  P('r','Elementos a elegir (r)',2,1,9,'Elementos'),
  S('method','Representación','list','Representación',[['list','Lista de grupos'],['tree','Diagrama de árbol (en orden)'],['pascal','Triángulo de Pascal'],['rel','Orden sí importa vs. no importa']]),
  K('showRoot','Mostrar el inicio del árbol',true,'Árbol',p=>p.method==='tree'),K('showHeads','Rotular las elecciones',true,'Árbol',p=>p.method==='tree'),K('showLeaf','Escribir cada grupo al final',true,'Árbol',p=>p.method==='tree'),
  K('showRes','Escribir la fórmula',true,'Mostrar'),...common()],
 render(p,W,H){const fs=p.fontSize,T0=Draw.title(p,W),items=[...new Set(tokens(p.el,10))],n=items.length;
  if(n<2)return T0+Draw.t(W/2,H/2,'Escribe al menos dos elementos distintos (por ejemplo: A B C D)',p,{c:'#94a3b8'});
  const r=Math.min(Math.max(1,p.r),n),total=nCr(n,r),pr=fact(n)/fact(n-r),
   Ls=p.showRes?[`C(${n}, ${r}) = ${n}! / (${r}! · ${n-r}!) = ${fm(total)}`,`C(${n}, ${r}) = P(${n}, ${r}) / ${r}! = ${fm(pr)} / ${fm(fact(r))} = ${fm(total)}`]:[],tH=Draw.titleH(p),top=tH+fs*.6,avail=H-tH-belowH(p,Ls)-fs;let g='';
  const sub=subsets(n,r),lab=s=>`{${s.map(i=>items[i]).join(', ')}}`;
  if(p.method==='list'){g=total<=500?grid(p,W,top,avail,sub.map(lab)):null;g=g||warn(p,W,H,`Hay ${fm(total)} grupos: son demasiados para listarlos.`)}
  else if(p.method==='tree'){if(total>160)g=warn(p,W,H,`Hay ${fm(total)} grupos: son demasiados para el árbol.`);
   else{const mk=(s,d)=>d===0?[]:items.slice(s).map((it,k)=>({l:it,i:s+k})).filter(x=>x.i<=n-d).map(x=>({l:x.l,ch:mk(x.i+1,d-1)}));
    g=tree(p,W,top,avail,{l:'Inicio',ch:mk(0,r)},{heads:[...Array(r)].map((_,i)=>`${i+1}.ª elección`),sep:', '})||warn(p,W,H,'No cabe el árbol: usa «Lista».')}}
  else if(p.method==='pascal'){const N=Math.min(n,12),rows=N+1,rh=Math.min(avail/rows,fs*2.4),cw=Math.min(W*.92/(N+1),fs*(String(nCr(N,Math.floor(N/2))).length*.7+1.2)*1.1),rd=Math.min(rh*.46,cw*.46),y0=top+(avail-rows*rh)/2+rh/2;
   for(let i=0;i<=N;i++)for(let j=0;j<=i;j++){const x=W/2+(j-i/2)*cw,y=y0+i*rh,hi=i===n&&j===r,line=i===n;g+=`<circle cx="${x}" cy="${y}" r="${rd}" fill="${hi?p.colRes:line?PAL[0]:'#e2e8f0'}" fill-opacity="${hi?1:line?.25:.5}" stroke="${hi?p.colRes:line?PAL[0]:'#94a3b8'}" stroke-width="${hi?p.strokeW*1.4:1}"/>`+Draw.t(x,y,fm(nCr(i,j)),p,{b:'central',fs:Math.min(fs*.85,rd*(1.5/Math.max(1,String(nCr(i,j)).length*.6))),w:hi?700:400,c:hi?'#fff':undefined})}
   g+=Draw.t(fs*.6,y0+N*rh,`n = ${N}`,p,{a:'start',b:'central',fs:fs*.75,c:'#64748b'});if(n>12)g+=Draw.t(W/2,top+avail+fs*.2,`(el triángulo se detiene en n = 12)`,p,{fs:fs*.7,c:'#64748b'})}
  else{const comb=sub[0],rf=fact(r);if(rf>24)g=warn(p,W,H,'Esta vista admite hasta r = 4.');
   else{const perms=[];(function w(rest,a){if(!rest.length){perms.push(a.map(i=>items[i]).join(' '));return}rest.forEach((x,k)=>w(rest.filter((_,j)=>j!==k),a.concat(x)))})(comb,[]);
    const gl=grid(p,W,top+avail*.28,avail*.5,perms);g+=Draw.t(W/2,top+avail*.07,`Un solo grupo (si el orden NO importa):   ${lab(comb)}`,p,{w:700,c:PAL[2],fs:fs*.95})+(t=>Draw.t(W/2,top+avail*.22,t,p,{fs:Math.min(fs*.85,W*.94/(t.length*.5))}))(`Si el orden SÍ importa, esos ${r} elementos se pueden ordenar de ${rf} formas:`)+(gl||'')+
     Draw.t(W/2,top+avail*.88,`${fm(pr)} ordenaciones en total ÷ ${rf} = ${fm(total)} grupos`,p,{w:700,c:p.colRes,fs:fs*1.05})}}
  return T0+g+(Ls.length?lines(p,W,H,Ls):'')}});
})();
