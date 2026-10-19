// Máximo común divisor (MCD) de 2 a 6 números: divisores, bloques iguales (con prueba de tamaño), cuadrados de Euclides, algoritmo de Euclides, factores primos y división simultánea
(()=>{
const {P,C,K,T,S}=Registry.h,ts=()=>Registry.h.ts(24),fm=x=>x.toLocaleString('es-CL');
const PAL=['#3b82f6','#ef4444','#22c55e','#f59e0b','#8b5cf6','#06b6d4'],SUP='⁰¹²³⁴⁵⁶⁷⁸⁹',sup=n=>n<2?'':String(n).split('').map(d=>SUP[d]).join('');
const G=(a,b)=>b?G(b,a%b):a;
const fac=n=>{const m=new Map();for(let d=2;d*d<=n;d++)while(n%d===0){m.set(d,(m.get(d)||0)+1);n/=d}if(n>1)m.set(n,(m.get(n)||0)+1);return m};
const parse=s=>(String(s).match(/\d+/g)||[]).map(Number).filter(n=>n>=1&&n<=99999).slice(0,6);
const divs=n=>{const a=[],b=[];for(let d=1;d*d<=n;d++)if(n%d===0){a.push(d);if(d*d!==n)b.push(n/d)}return a.concat(b.reverse())};
const dec=(f,n)=>n===1?'1':[...f].map(([q,e])=>q+sup(e)).join(' · ');
const gAll=a=>a.reduce(G);

Registry.register({id:'mcd',category:'fractions',name:'Máximo común divisor (MCD)',icon:'÷',description:'MCD de dos a seis números: divisores, bloques iguales, cuadrados de Euclides, algoritmo de Euclides, factores primos y división simultánea',
 parameters:[T('nums','Números (de 2 a 6, separados por espacios, comas o ;)','12 18','Números'),
  S('method','Método de representación','bars','Método',[['bars','Bloques iguales (cortar las barras)'],['rect','Cuadrados de Euclides (rectángulo)'],['divs','Lista de divisores'],['euclid','Algoritmo de Euclides'],['factors','Factores primos (exponentes menores)'],['ladder','División simultánea (escalera)']]),
  P('test','Tamaño del bloque de prueba (0 = usar el MCD)',0,0,p=>Math.min(200,...(parse(p.nums).length?parse(p.nums):[200])),'Método',{show:p=>p.method==='bars'}),
  K('showGrid','Mostrar la cuadrícula del MCD',true,'Método',p=>p.method==='rect'),K('showDecomp','Mostrar la descomposición de cada número',true,'Método',p=>p.method==='factors'),
  K('showRes','Escribir el resultado',true,'Mostrar'),K('showSteps','Escribir la explicación',true,'Mostrar'),K('showRel','Relación MCD × MCM = a × b (dos números)',false,'Mostrar'),
  S('abbr','Notación','MCD','Mostrar',[['MCD','MCD'],['m.c.d.','m.c.d.'],['mcd','mcd']]),
  K('varied','Un color distinto por número',true,'Estilo'),C('col','Color (si es uno solo)','#3b82f6','Estilo'),C('colRes','Color del MCD','#dc2626','Estilo'),P('strokeW','Grosor de las líneas',2,1,8,'Estilo',{style:true,step:.5}),P('size','Tamaño (%)',90,40,100,'Estilo',{style:true}),...ts()],
 render(p,W,H){const fs=p.fontSize,ns=parse(p.nums),T0=Draw.title(p,W);
  if(ns.length<2)return T0+Draw.t(W/2,H/2,'Escribe al menos dos números (por ejemplo: 12 18)',p,{c:'#94a3b8'});
  const D=gAll(ns),DS=fm(D),ab=p.abbr,n=ns.length,cols=ns.map((_,i)=>p.varied?PAL[i%6]:p.col),m=p.method,
   facs=ns.map(fac),primes=[...new Set(facs.flatMap(f=>[...f.keys()]))].sort((a,b)=>a-b),mn=primes.map(q=>Math.min(...facs.map(f=>f.get(q)||0))),
   powStr=mn.some(e=>e>0)?primes.map((q,j)=>mn[j]>0?q+sup(mn[j]):'').filter(Boolean).join(' · '):'1';
  const steps=[];let cur=ns.slice();for(let g0=0;g0<80;g0++){const g=gAll(cur);if(g===1)break;let q=2;while(g%q)q++;steps.push({vals:cur,q});cur=cur.map(x=>x/q)}
  const eu=[];{let a=ns[0];for(let i=1;i<n;i++){let x=Math.max(a,ns[i]),y=Math.min(a,ns[i]);const part=[];while(y>0){const q=Math.floor(x/y),r=x%y;part.push({x,y,q,r});x=y;y=r}eu.push(part);a=x}}
  const Ls=[];if(p.showRes)Ls.push(`${ab}(${ns.join(', ')}) = ${DS}`+(D===1?'  (primos entre sí)':''));
  if(p.showSteps){if(m==='bars'){const t=p.test>0?p.test:D;Ls.push(ns.every(x=>x%t===0)?`${ns.map(x=>`${x} = ${t} × ${x/t}`).join('     ')}`:`${t} no divide a todos: sobran trozos. El mayor tamaño que sirve es ${DS}`)}
   else if(m==='rect')Ls.push(`El cuadrado más grande que cubre el rectángulo exacto mide ${fm(gAll(ns.slice(0,2)))}`);
   else if(m==='divs')Ls.push(`Divisores comunes: ${divs(D).join(', ')}. El mayor es ${DS}`);
   else if(m==='euclid')Ls.push(`El último resto distinto de cero es ${DS}`);
   else if(m==='factors')Ls.push(`${ab} = ${powStr} = ${DS}`);
   else Ls.push(`${ab} = ${steps.map(s=>s.q).join(' · ')||'1'} = ${DS}`)}
  if(p.showRel&&n===2){const l=ns[0]/D*ns[1];Ls.push(`${ab} × MCM = ${DS} × ${fm(l)} = ${fm(D*l)} = ${ns[0]} × ${ns[1]}`)}
  const below=Ls.length?Ls.length*fs*1.3+fs*.5:0,tH=Draw.titleH(p),top=tH+fs*.8,bot=H-below-fs*.5,avail=bot-top,sz=p.size/100;let g='';
  if(m==='bars'){const t=p.test>0?p.test:D,mx=Math.max(...ns),sx=Math.max(.01,(W*sz-fs*9)/mx),rh=Math.min(fs*3.2,avail/n),y0=top+(avail-n*rh)/2,x0=(W-mx*sx)/2-fs*2.2;
   ns.forEach((x,i)=>{const y=y0+i*rh,k=Math.floor(x/t),rem=x-k*t,ok=rem===0,col=ok&&t===D?p.colRes:cols[i],bh=rh*.66,by=y+rh*.17;
    for(let j=0;j<k&&j<400;j++){const bx=x0+j*t*sx,bw=t*sx;g+=`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${col}" fill-opacity="${j%2?.45:.75}" stroke="${col}" stroke-width="${Math.min(p.strokeW*.7,bw/3)}"/>`+(bw>=fs*(String(t).length*.6+.7)?Draw.t(bx+bw/2,by+bh/2,t,p,{b:'central',fs:fs*.85,c:'#0f172a'}):'')}
    if(k>400)g+=`<rect x="${x0}" y="${by}" width="${x*sx}" height="${bh}" fill="${col}" fill-opacity=".6"/>`;
    if(rem>0)g+=`<rect x="${x0+k*t*sx}" y="${by}" width="${rem*sx}" height="${bh}" fill="#94a3b8" fill-opacity=".45" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 3"/>`+(rem*sx>=fs*1.6?Draw.t(x0+(k*t+rem/2)*sx,by+bh/2,`sobra ${rem}`,p,{b:'central',fs:fs*.65,c:'#334155'}):'');
    g+=Draw.t(x0-fs*.3,by+bh/2,x,p,{a:'end',b:'central',w:700,c:cols[i]})+Draw.t(x0+x*sx+fs*.4,by+bh/2,`${k} bloque${k===1?'':'s'}`,p,{a:'start',b:'central',fs:fs*.8,c:p.textColor})});
   g+=`<line x1="${x0}" x2="${x0}" y1="${y0}" y2="${y0+n*rh}" stroke="${p.textColor}" stroke-width="1.5" stroke-opacity=".5"/>`}
  else if(m==='rect'){const a=ns[0],b=ns[1],st=[];{let x=0,y=0,w=a,h=b;while(w>0&&h>0){if(w>=h){const q=Math.floor(w/h);st.push({x,y,w:q*h,h,s:h,q});x+=q*h;w-=q*h}else{const q=Math.floor(h/w);st.push({x,y,w,h:q*w,s:w,q});y+=q*w;h-=q*w}}}
   const k=Math.min(W*.9*sz/a,avail*sz/b),x0=(W-a*k)/2,y0=top+(avail-b*k)/2,d2=G(a,b);
   st.forEach((s,i)=>{const last=i===st.length-1,cl=last?p.colRes:p.varied?PAL[i%6]:p.col;
    g+=`<rect x="${x0+s.x*k}" y="${y0+s.y*k}" width="${s.w*k}" height="${s.h*k}" fill="${cl}" fill-opacity=".3" stroke="${cl}" stroke-width="${p.strokeW*1.2}"/>`;
    for(let j=1;j<s.q&&s.q<=60;j++){if(s.w>s.h)g+=`<line x1="${x0+(s.x+j*s.s)*k}" x2="${x0+(s.x+j*s.s)*k}" y1="${y0+s.y*k}" y2="${y0+(s.y+s.h)*k}" stroke="${cl}" stroke-width="${p.strokeW*.8}"/>`;else g+=`<line x1="${x0+s.x*k}" x2="${x0+(s.x+s.w)*k}" y1="${y0+(s.y+j*s.s)*k}" y2="${y0+(s.y+j*s.s)*k}" stroke="${cl}" stroke-width="${p.strokeW*.8}"/>`}
    const lab=s.q>1?`${fm(s.s)} × ${s.q}`:fm(s.s);if(Math.min(s.w,s.h)*k>=fs*1.4&&s.w*k>=fs*(lab.length*.5+.6))g+=Draw.t(x0+(s.x+s.w/2)*k,y0+(s.y+s.h/2)*k,lab,p,{b:'central',w:700,fs:Math.min(fs,Math.min(s.w,s.h)*k*.5),c:'#0f172a'})});
   if(p.showGrid&&(a/d2)*(b/d2)<=900&&d2*k>=3){for(let i=1;i<a/d2;i++)g+=`<line x1="${x0+i*d2*k}" x2="${x0+i*d2*k}" y1="${y0}" y2="${y0+b*k}" stroke="#64748b" stroke-width="1" stroke-opacity=".6"/>`;
    for(let j=1;j<b/d2;j++)g+=`<line x1="${x0}" x2="${x0+a*k}" y1="${y0+j*d2*k}" y2="${y0+j*d2*k}" stroke="#64748b" stroke-width="1" stroke-opacity=".6"/>`}
   g+=`<rect x="${x0}" y="${y0}" width="${a*k}" height="${b*k}" fill="none" stroke="${p.textColor}" stroke-width="${p.strokeW*1.4}"/>`+Draw.t(x0+a*k/2,y0-fs*.5,a,p,{w:700,fs:fs*.9})+Draw.t(x0-fs*.5,y0+b*k/2,b,p,{a:'end',b:'central',w:700,fs:fs*.9});
   if(n>2)g+=Draw.t(W/2,y0+b*k+fs*1.1,'(El dibujo usa los dos primeros números)',p,{fs:fs*.7,c:'#64748b'})}
  else if(m==='divs'){const dl=ns.map(divs),cm=new Set(divs(D)),lay=r=>{const f=fs*r,hh=f*1.8,items=[];let y=0;dl.forEach((ds,i)=>{items.push({hd:i,y,f});y+=f*1.7;let x=0;const cw=f*.3,maxw=W*.92;ds.forEach(v=>{const w=f*(String(v).length*.6+1);if(x+w>maxw&&x>0){x=0;y+=hh}items.push({v,i,x,y,w,f,hh});x+=w+cw});y+=hh+f*.5});return{items,h:y}};
   let r=1,L=lay(r);while(L.h>avail&&r>.3){r*=.92;L=lay(r)}
   const rowW=new Map();L.items.forEach(it=>{if(it.v!==undefined){const k=it.i+'_'+it.y;rowW.set(k,Math.max(rowW.get(k)||0,it.x+it.w))}});
   const y0=top+(avail-L.h)/2;
   L.items.forEach(it=>{if(it.hd!==undefined){g+=Draw.t(W*.04,y0+it.y+it.f*.8,`Divisores de ${ns[it.hd]}`,p,{a:'start',b:'central',w:700,fs:it.f*.95,c:cols[it.hd]});return}
    const k=it.i+'_'+it.y,ox=(W-rowW.get(k))/2,x=ox+it.x,y=y0+it.y,com=cm.has(it.v),isD=it.v===D,cl=com?p.colRes:cols[it.i];
    g+=`<rect x="${x}" y="${y}" width="${it.w}" height="${it.hh*.82}" rx="${it.hh*.2}" fill="${isD?p.colRes:cl}" fill-opacity="${isD?1:com?.22:.12}" stroke="${cl}" stroke-width="${com?p.strokeW*.9:p.strokeW*.5}"/>`+Draw.t(x+it.w/2,y+it.hh*.41,fm(it.v),p,{b:'central',fs:it.f*.9,w:com?700:400,c:isD?'#fff':undefined})})}
  else if(m==='euclid'){const lines=[];eu.forEach((part,pi)=>{if(n>2)lines.push({h:true,t:pi===0?`${ns[0]} y ${ns[1]}`:`${fm(eu[pi-1][eu[pi-1].length-1].y)} y ${ns[pi+1]}`});part.forEach((s,j)=>lines.push({s,last:s.r===0,pi}))});
   const rh0=fs*1.9;let r=Math.min(1,avail/(lines.length*rh0),W*.95/(fs*18));const f2=fs*r,rh=rh0*r,y0=top+(avail-lines.length*rh)/2;
   lines.forEach((ln,i)=>{const y=y0+i*rh+rh/2;if(ln.h){g+=Draw.t(W/2,y,ln.t,p,{b:'central',fs:f2*.85,c:'#64748b',w:700});return}
    const s=ln.s,col=ln.last?p.colRes:(p.varied?PAL[i%6]:p.col),t=`${fm(s.x)} = ${fm(s.y)} · ${fm(s.q)} + ${fm(s.r)}`;
    g+=(ln.last?`<rect x="${W/2-f2*(t.length*.28+1)}" y="${y-rh*.45}" width="${f2*(t.length*.56+2)}" height="${rh*.9}" rx="${rh*.2}" fill="${p.colRes}" fill-opacity=".15" stroke="${p.colRes}" stroke-width="${p.strokeW*.7}"/>`:'')+Draw.t(W/2,y,t,p,{b:'central',fs:f2,c:col,w:ln.last?700:400});
    if(ln.last)g+=Draw.t(W/2+f2*(t.length*.28+1.4),y,`← ${ab} = ${fm(s.y)}`,p,{a:'start',b:'central',fs:f2*.85,c:p.colRes,w:700})})}
  else if(m==='factors'){if(!primes.length)g+=Draw.t(W/2,H/2,`Todos los números son 1: ${ab} = 1`,p,{c:'#64748b'});
   else{const dd=ns.map((x,i)=>dec(facs[i],x)),w0=fs*Math.max(4.6,Math.max(...ns.map(x=>String(x).length))*.62+2.2),wp=fs*3.4,wd=p.showDecomp?fs*Math.max(9,Math.max(...dd.map(s=>s.length))*.55+1.6):0,sw=w0+primes.length*wp+wd,nr=n+2,rh0=fs*2,
     r=Math.min(1,W*.94/sw,avail/(nr*rh0)),f2=fs*r,rh=rh0*r,x0=(W-sw*r)/2,y0=top+(avail-nr*rh)/2,q2={...p,fontSize:f2},ce=(x,y,w,t,fill,b,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${rh}" fill="${fill}" stroke="#64748b" stroke-width="1.2"/>`+Draw.t(x+w/2,y+rh/2,t,q2,{b:'central',w:b?700:400,c});
    for(let ri=0;ri<nr;ri++){let x=x0;const y=y0+ri*rh,hd=ri===0,rs=ri===nr-1,i=ri-1;
     g+=ce(x,y,w0*r,hd?'Número':rs?ab:ns[i],hd||rs?'#dbeafe':'#fff',true,!hd&&!rs?cols[i]:undefined);x+=w0*r;
     primes.forEach((q,j)=>{const e=hd?0:rs?mn[j]:facs[i].get(q)||0,hi=!hd&&!rs&&e>0&&e===mn[j],t=hd?String(q):rs?(mn[j]?q+sup(mn[j]):'—'):(e?q+sup(e):'—');g+=ce(x,y,wp*r,t,hd?'#dbeafe':rs?(mn[j]?p.colRes+'33':'#fff'):hi?p.colRes+'2e':'#fff',hd||rs||hi,hi||(rs&&mn[j])?p.colRes:(e===0&&!hd?'#94a3b8':undefined));x+=wp*r});
     if(p.showDecomp)g+=ce(x,y,wd*r,hd?'Descomposición':rs?`= ${DS}`:`${ns[i]} = ${dd[i]}`,hd||rs?'#dbeafe':'#fff',hd||rs)}}}
  else{const rows=[...steps,{vals:cur,q:null}],cw=fs*(Math.max(...ns.map(x=>String(x).length))*.62+1.8),pw=fs*2.6,sw=n*cw+pw,rh0=fs*2,r=Math.min(1,W*.9/sw,avail/(rows.length*rh0)),f2=fs*r,rh=rh0*r,x0=(W-sw*r)/2,y0=top+(avail-rows.length*rh)/2,q2={...p,fontSize:f2};
   rows.forEach((row,ri)=>{const y=y0+ri*rh;row.vals.forEach((v,i)=>{const x=x0+i*cw*r;if(row.q)g+=`<rect x="${x+cw*r*.08}" y="${y+rh*.08}" width="${cw*r*.84}" height="${rh*.84}" rx="${rh*.2}" fill="${p.colRes}" fill-opacity=".2"/>`;g+=Draw.t(x+cw*r/2,y+rh/2,v,q2,{b:'central',w:row.q?700:400,c:cols[i]})});
    if(row.q)g+=Draw.t(x0+n*cw*r+pw*r/2,y+rh/2,row.q,q2,{b:'central',w:700,c:p.colRes})});
   g+=`<line x1="${x0+n*cw*r}" x2="${x0+n*cw*r}" y1="${y0}" y2="${y0+rows.length*rh}" stroke="${p.textColor}" stroke-width="${p.strokeW*1.3}"/>`;
   if(!steps.length)g+=Draw.t(W/2,y0+rows.length*rh+fs*.9,'No hay ningún primo que divida a todos',p,{fs:fs*.8,c:'#64748b'})}
  Ls.forEach((t,i)=>g+=Draw.t(W/2,tH+(H-tH)-below+fs*1.1+i*fs*1.3,t,p,{fs:Math.min(fs*.9,W*.94/(t.length*.5)),w:i===0&&p.showRes?700:400}));
  return T0+g}});
})();
