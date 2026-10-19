// Descomposición en factores primos: árbol de factores (hacia abajo o hacia la derecha), división sucesiva (escalera) y burbujas agrupadas en potencias. De 1 a 3 números a la vez.
(()=>{
const {P,C,K,T,S}=Registry.h,ts=()=>Registry.h.ts(26),fm=x=>x.toLocaleString('es-CL');
const PAL=['#2563eb','#dc2626','#16a34a','#d97706','#7c3aed','#0891b2','#db2777','#65a30d','#ea580c','#475569'],PR=[2,3,5,7,11,13,17,19,23],SUP='⁰¹²³⁴⁵⁶⁷⁸⁹',sup=n=>n<2?'':String(n).split('').map(d=>SUP[d]).join('');
const parse=s=>(String(s).match(/\d+/g)||[]).map(Number).filter(n=>n>=1&&n<=99999).slice(0,3);
const spf=n=>{for(let d=2;d*d<=n;d++)if(n%d===0)return d;return n},isP=n=>n>1&&spf(n)===n;
const fac=n=>{const m=new Map();let x=n;while(x>1){const d=spf(x);m.set(d,(m.get(d)||0)+1);x/=d}return m};
const lpf=n=>{let m=1;fac(n).forEach((_,q)=>{m=Math.max(m,q)});return m};
const colorOf=(p,q)=>p.colorPrimes?PAL[PR.indexOf(q)>=0?PR.indexOf(q):9]:p.col;
const divisors=f=>{let d=[1];f.forEach((e,q)=>{const o=[];d.forEach(x=>{let y=x;for(let i=0;i<=e;i++){o.push(y);y*=q}});d=o});return d.sort((a,b)=>a-b)};
const build=(n,st)=>{if(n===1||isP(n))return{n,prime:isP(n),ch:[]};let a;if(st==='small')a=spf(n);else if(st==='big')a=lpf(n);else{a=spf(n);for(let d=2;d*d<=n;d++)if(n%d===0)a=d}
 return{n,prime:false,ch:[build(a,st),build(n/a,st)]}};
const layout=root=>{let leaf=0;const nodes=[],go=(nd,d)=>{nd.d=d;nodes.push(nd);if(!nd.ch.length)nd.x=leaf++;else{nd.ch.forEach(c=>go(c,d+1));nd.x=nd.ch.reduce((s,c)=>s+c.x,0)/nd.ch.length}};go(root,0);return{nodes,L:leaf,D:Math.max(...nodes.map(q=>q.d))}};
const wrap=(txt,maxc,maxl)=>{const w=txt.split(' '),o=[];let cur='';w.forEach(t=>{if((cur+' '+t).trim().length>maxc&&cur){o.push(cur);cur=t}else cur=(cur+' '+t).trim()});if(cur)o.push(cur);if(o.length>maxl){o.length=maxl;o[maxl-1]=o[maxl-1].replace(/,?$/,' …')}return o};
const info=n=>{const f=fac(n),pr=[...f].sort((a,b)=>a[0]-b[0]);return{n,fac:f,prime:isP(n),pow:pr.map(([q,e])=>q+sup(e)).join(' · '),exp:pr.flatMap(([q,e])=>Array(e).fill(q)).join(' · '),divs:divisors(f)}};
const lines=(p,I,w,f)=>{const o=[],n=I.n;
 if(p.showFinal){if(n===1)o.push('1 no es primo ni compuesto');else if(I.prime)o.push(`${fm(n)} es un número primo`);else o.push(`${fm(n)} = ${I.pow}`)}
 if(p.showExp&&n>1&&!I.prime&&I.exp!==I.pow)o.push(`${fm(n)} = ${I.exp}`);
 if(p.showCount&&n>1)o.push(`Cantidad de divisores: ${[...I.fac.values()].map(e=>`(${e}+1)`).join(' · ')} = ${I.divs.length}`);
 if(p.showList&&n>1)o.push(...wrap(`Divisores de ${fm(n)}: ${I.divs.map(fm).join(', ')}`,Math.max(12,Math.floor(w/(f*.5))),4));
 return o};

function drawTree(p,I,X,Y,w,h,fs){const root=build(I.n,p.strat),{nodes,L,D}=layout(root),right=p.dir==='right',LE=right?h:w,DE=right?w:h,dg=q=>String(q.n).length;let f=fs,S1=1,S2=1,r;
 for(let it=0;it<60;it++){r=q=>f*(.7+.17*dg(q));const rl=[];nodes.forEach(q=>{rl[q.d]=Math.max(rl[q.d]||0,r(q))});const rm=Math.max(...rl),avail=(LE-2*rm)/Math.max(L-1,1);S1=Math.min(avail,rm*3);let ok=avail>0;
  const by=[];nodes.forEach(q=>(by[q.d]=by[q.d]||[]).push(q));by.forEach(a=>{a.sort((u,v)=>u.x-v.x);for(let i=1;i<a.length;i++)if((a[i].x-a[i-1].x)*S1<(r(a[i])+r(a[i-1]))*1.15)ok=false});
  const need=Math.max(0,...rl.slice(1).map((v,i)=>(v+rl[i])*1.25)),avD=(DE-rl[0]-rl[D])/Math.max(D,1);S2=Math.min(avD,f*5);if(D>0&&S2<need)ok=false;if(ok||f<fs*.25)break;f*=.93}
 const pos=q=>{const lp=LE/2+(q.x-(L-1)/2)*S1,dp=(DE-D*S2)/2+q.d*S2;return right?[X+dp,Y+lp]:[X+lp,Y+dp]},vis=q=>q.d<p.lev;let g='';
 nodes.forEach(q=>{if(!vis(q))return;q.ch.forEach(c=>{if(!vis(c))return;const a=pos(q),b=pos(c),dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,ra=r(q),rb=r(c);
  g+=`<line x1="${a[0]+dx/l*ra}" y1="${a[1]+dy/l*ra}" x2="${b[0]-dx/l*rb}" y2="${b[1]-dy/l*rb}" stroke="#64748b" stroke-width="${p.strokeW}" stroke-linecap="round"/>`})});
 nodes.forEach(q=>{if(!vis(q))return;const c=pos(q),pr=q.prime;g+=`<circle cx="${c[0]}" cy="${c[1]}" r="${r(q)}" fill="${pr?colorOf(p,q.n):p.colComp}" stroke="${pr?colorOf(p,q.n):'#64748b'}" stroke-width="${p.strokeW}"/>`+Draw.t(c[0],c[1],q.n,p,{b:'central',w:700,fs:f*(dg(q)>3?.88:1),c:pr?'#ffffff':p.textColor})});
 return g}

function drawLadder(p,I,X,Y,w,h,fs){const rows=[];let v=I.n;if(v===1)rows.push({v:1});else{while(v>1){const q=spf(v);rows.push({v,q});v/=q}rows.push({v:1})}
 const maxq=Math.max(1,...rows.map(r=>r.q||0)),a=String(I.n).length*.62+1.4,b=String(maxq).length*.62+1.6,f=Math.min(fs,w*.95/(a+b)),rh=Math.min(f*2.2,h/rows.length),cw=f*a,pw=f*b,x0=X+(w-cw-pw)/2,y0=Y+(h-rows.length*rh)/2,vis=rows.slice(0,p.lev);let g='';
 vis.forEach((r,i)=>{const y=y0+i*rh+rh/2;g+=Draw.t(x0+cw-f*.45,y,fm(r.v),p,{a:'end',b:'central',fs:f,w:i===0?700:400});if(r.q)g+=Draw.t(x0+cw+f*.5,y,r.q,p,{a:'start',b:'central',fs:f,w:700,c:colorOf(p,r.q)})});
 const nq=vis.filter(r=>r.q).length;if(nq)g+=`<line x1="${x0+cw}" x2="${x0+cw}" y1="${y0}" y2="${y0+nq*rh}" stroke="${p.textColor}" stroke-width="${p.strokeW*1.3}" stroke-linecap="round"/>`;return g}

function drawPow(p,I,X,Y,w,h,fs){const seq=[];[...I.fac].sort((a,b)=>a[0]-b[0]).forEach(([q,e])=>{for(let i=0;i<e;i++)seq.push(q)});if(!seq.length)return'';
 const c=seq.length,gp=1.5;let rr=fs*.95;const tot=c*2*rr+(c-1)*gp*rr;if(tot>w*.96)rr*=w*.96/tot;const gap=gp*rr,x0=X+(w-(c*2*rr+(c-1)*gap))/2,cy=Y+Math.min(h*.4,h-rr*3.2),fb=Math.min(fs,rr*1.1);let g='',i=0;
 [...I.fac].sort((a,b)=>a[0]-b[0]).forEach(([q,e],gi)=>{const xs=x0+i*(2*rr+gap),xe=x0+(i+e-1)*(2*rr+gap)+2*rr;
  for(let k=0;k<e;k++){const cx=x0+(i+k)*(2*rr+gap)+rr;g+=`<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${colorOf(p,q)}"/>`+Draw.t(cx,cy,q,p,{b:'central',w:700,fs:rr*(String(q).length>2?.8:1.05),c:'#fff'});if(i+k<c-1)g+=Draw.t(cx+rr+gap/2,cy,'×',p,{b:'central',fs:rr*1.1,c:'#64748b'})}
  const by=cy+rr*1.35,bh=rr*.5;g+=`<path d="M${xs} ${by} V${by+bh} H${xe} V${by}" fill="none" stroke="${colorOf(p,q)}" stroke-width="${p.strokeW}" stroke-linejoin="round"/>`+Draw.t((xs+xe)/2,by+bh+fb*1.15,q+sup(e),p,{w:700,fs:fb*1.1,c:colorOf(p,q)});i+=e});return g}

Registry.register({id:'primefactors',category:'fractions',name:'Descomposición en factores primos',icon:'🌳',description:'Árbol de factores, división sucesiva y burbujas en potencias, para uno a tres números',
 parameters:[T('nums','Número (de 1 a 3, separados por espacios o ;)','60','Número'),
  S('method','Representación','tree','Representación',[['tree','Árbol de factores'],['ladder','División sucesiva (escalera)'],['pow','Burbujas agrupadas en potencias']]),
  S('strat','Cómo se parte cada número','small','Representación',[['small','Dividiendo por el menor primo'],['big','Dividiendo por el mayor primo'],['pair','En dos factores cercanos entre sí']],p=>p.method==='tree'),
  S('dir','Dirección del árbol','down','Representación',[['down','Hacia abajo'],['right','Hacia la derecha']],p=>p.method==='tree'),
  P('lev','Niveles visibles (para mostrarlo paso a paso)',20,1,20,'Representación',{show:p=>p.method!=='pow'}),
  K('showFinal','Escribir la factorización (con potencias)',true,'Mostrar'),K('showExp','Escribir el producto desarrollado (2 · 2 · 3)',true,'Mostrar'),K('showCount','Cantidad de divisores',false,'Mostrar'),K('showList','Lista de divisores',false,'Mostrar'),
  K('colorPrimes','Un color distinto por cada primo',true,'Estilo'),C('col','Color de los primos (si es uno solo)','#2563eb','Estilo'),C('colComp','Color de los números compuestos','#f1f5f9','Estilo'),P('strokeW','Grosor de las líneas',2.5,1,8,'Estilo',{style:true,step:.5}),...ts()],
 render(p,W,H){const fs=p.fontSize,ns=parse(p.nums),T0=Draw.title(p,W);if(!ns.length)return T0+Draw.t(W/2,H/2,'Escribe un número entre 1 y 99.999 (por ejemplo: 60)',p,{c:'#94a3b8'});
  const k=ns.length,tH=Draw.titleH(p),top=tH+fs*.5,fsS=fs*(k===1?1:k===2?.85:.72),stack=p.method==='pow',sw=stack?W:W/k,sh=stack?(H-top-fs*.4)/k:H-top-fs*.4;let g='';
  ns.forEach((n,i)=>{const I=info(n),X=stack?0:i*sw,Y=stack?top+i*sh:top,tl=lines(p,I,sw*.96,fsS*.9),fT=tl.map(t=>Math.min(fsS*.9,sw*.96/(t.length*.55))),tb=fT.reduce((a,b)=>a+b*1.35,0)+(tl.length?fsS*.3:0),ah=sh-tb;
   g+=p.method==='tree'?drawTree(p,I,X,Y,sw,ah,fsS):p.method==='ladder'?drawLadder(p,I,X,Y,sw,ah,fsS):drawPow(p,I,X,Y,sw,ah,fsS);
   let y=Y+ah+fsS*.3;tl.forEach((t,j)=>{y+=fT[j]*1.35;g+=Draw.t(X+sw/2,y-fT[j]*.35,t,p,{fs:fT[j],w:j===0&&p.showFinal?700:400})})});
  return T0+g}});
})();
