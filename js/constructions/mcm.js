// Mínimo común múltiplo (MCM) de 2 a 8 números: barras que se igualan, lista de múltiplos, saltos en la recta, factores primos y división simultánea
(()=>{
const {P,C,K,T,S}=Registry.h,ts=()=>Registry.h.ts(24),fm=x=>x.toLocaleString('es-CL');
const PAL=['#3b82f6','#ef4444','#22c55e','#f59e0b','#8b5cf6','#06b6d4','#ec4899','#84cc16'],SUP='⁰¹²³⁴⁵⁶⁷⁸⁹',sup=n=>n<2?'':String(n).split('').map(d=>SUP[d]).join('');
const G=(a,b)=>b?G(b,a%b):a;
const fac=n=>{const m=new Map();for(let d=2;d*d<=n;d++)while(n%d===0){m.set(d,(m.get(d)||0)+1);n/=d}if(n>1)m.set(n,(m.get(n)||0)+1);return m};
const parse=s=>(String(s).match(/\d+/g)||[]).map(Number).filter(n=>n>=1&&n<=99999).slice(0,8);
const dec=(f,n)=>n===1?'1':[...f].map(([q,e])=>q+sup(e)).join(' · ');

Registry.register({id:'mcm',category:'fractions',name:'Mínimo común múltiplo (MCM)',icon:'✖',description:'MCM de dos o más números con barras, lista de múltiplos, saltos, factores primos y división simultánea',
 parameters:[T('nums','Números (de 2 a 8, separados por espacios, comas o ;)','6 8','Números'),
  S('method','Método de representación','bars','Método',[['bars','Barras que se igualan'],['list','Lista de múltiplos'],['jumps','Saltos en la recta numérica'],['factors','Factores primos (exponentes mayores)'],['ladder','División simultánea (escalera)']]),
  K('more','Extender hasta el 2.º múltiplo común',false,'Método',p=>['bars','list','jumps'].includes(p.method)),K('showDecomp','Mostrar la descomposición de cada número',true,'Método',p=>p.method==='factors'),
  K('showRes','Escribir el resultado',true,'Mostrar'),K('showSteps','Escribir la explicación',true,'Mostrar'),K('showCount','Cuántas veces cabe cada número (n × k = MCM)',true,'Mostrar',p=>p.method==='bars'),
  S('abbr','Notación','MCM','Mostrar',[['MCM','MCM'],['m.c.m.','m.c.m.'],['mcm','mcm']]),
  K('varied','Un color distinto por número',true,'Estilo'),C('col','Color (si es uno solo)','#3b82f6','Estilo'),C('colRes','Color del MCM','#dc2626','Estilo'),P('strokeW','Grosor de las líneas',2,1,8,'Estilo',{style:true,step:.5}),P('size','Tamaño (%)',90,40,100,'Estilo',{style:true}),...ts()],
 render(p,W,H){const fs=p.fontSize,ns=parse(p.nums),T0=Draw.title(p,W);
  if(ns.length<2)return T0+Draw.t(W/2,H/2,'Escribe al menos dos números (por ejemplo: 6 8)',p,{c:'#94a3b8'});
  const LB=ns.map(BigInt).reduce((a,b)=>a/G(a,b)*b),LS=fm(LB),big=LB>50000n,L=big?0:Number(LB),mult=p.more?2:1,Lm=L*mult,ab=p.abbr,n=ns.length,cols=ns.map((_,i)=>p.varied?PAL[i%8]:p.col),
   facs=ns.map(fac),primes=[...new Set(facs.flatMap(f=>[...f.keys()]))].sort((a,b)=>a-b),mx=primes.map(q=>Math.max(...facs.map(f=>f.get(q)||0))),powStr=primes.length?primes.map((q,j)=>q+sup(mx[j])).join(' · '):'1';
  const steps=[];let cur=ns.slice();for(let g0=0;g0<80&&cur.some(x=>x>1);g0++){let q=2;while(!cur.some(x=>x>1&&x%q===0))q++;const dv=cur.map(x=>x>1&&x%q===0);steps.push({vals:cur,q,dv});cur=cur.map((x,i)=>dv[i]?x/q:x)}
  const Ls=[];if(p.showRes)Ls.push(`${ab}(${ns.join(', ')}) = ${LS}`);
  if(p.showSteps){const m=p.method;if(m==='list')Ls.push('M(n) = múltiplos de n',`Múltiplos comunes (los múltiplos del ${ab}): ${[1,2,3].map(k=>fm(LB*BigInt(k))).join(', ')}, …`);
   else if(m==='bars')Ls.push(`Las barras se igualan por primera vez en ${LS}`);else if(m==='jumps')Ls.push(`Todos los saltos coinciden por primera vez en ${LS}`);
   else if(m==='factors')Ls.push(`${ab} = ${powStr} = ${LS}`);else Ls.push(`${ab} = ${steps.map(s=>s.q).join(' · ')||'1'} = ${powStr} = ${LS}`)}
  if(p.method==='bars'&&p.showCount&&!big)Ls.push(ns.map(x=>`${x} × ${LB/BigInt(x)} = ${LS}`).join('     '));
  const below=Ls.length?Ls.length*fs*1.3+fs*.5:0,tH=Draw.titleH(p),top=tH+fs*.8,bot=H-below-fs*.5,avail=bot-top;let g='';
  const warn=t=>Draw.t(W/2,top+avail/2-fs*.7,t,p,{c:'#64748b',fs:fs*.9})+Draw.t(W/2,top+avail/2+fs*.8,'Prueba con «Factores primos» o «División simultánea».',p,{c:'#64748b',fs:fs*.9});
  const m=p.method;
  if(m==='bars'||m==='jumps'){const cnt=ns.map(x=>Lm/x);
   if(big||Math.max(...cnt)>(m==='bars'?60:40))g+=warn(`El ${ab} (${LS}) es muy grande para dibujar este método.`);
   else{const xl=fs*3.4,xr=W-fs*1.4,sx=(xr-xl)/Lm,rh=Math.min(fs*(m==='bars'?2.8:3.6),(avail-fs*1.6)/n),y0=top+fs*1.2+(avail-fs*1.6-n*rh)/2;
    if(m==='bars'&&Lm<=60)for(let u=0;u<=Lm;u++)g+=`<line x1="${xl+u*sx}" x2="${xl+u*sx}" y1="${y0}" y2="${y0+n*rh}" stroke="#e5e7eb" stroke-width="1"/>`;
    ns.forEach((nn,i)=>{const y=y0+i*rh,k=Lm/nn;g+=Draw.t(xl-fs*.5,y+rh/2,(m==='jumps'?'+':'')+nn,p,{a:'end',b:'central',w:700,c:cols[i]});
     if(m==='bars')for(let j=0;j<k;j++){const x=xl+j*nn*sx,w=nn*sx;g+=`<rect x="${x}" y="${y+rh*.15}" width="${w}" height="${rh*.7}" fill="${cols[i]}" fill-opacity="${j%2?.5:.8}" stroke="${cols[i]}" stroke-width="${p.strokeW*.7}"/>`+(w>=fs*(String(nn).length*.6+.8)?Draw.t(x+w/2,y+rh/2,nn,p,{b:'central',fs:fs*.85,c:'#0f172a'}):'')}
     else{const ya=y+rh*.74,rx=nn*sx/2,ry=Math.min(rx,rh*.62),gap=fs*(String(Lm).length*.62+.6);let last=-1e9;g+=`<line x1="${xl}" x2="${xr}" y1="${ya}" y2="${ya}" stroke="${p.textColor}" stroke-opacity=".5" stroke-width="1.5"/>`;
      for(let j=0;j<k;j++){const x1=xl+j*nn*sx;g+=`<path d="M${x1} ${ya} A${rx} ${ry} 0 0 1 ${x1+nn*sx} ${ya}" fill="none" stroke="${cols[i]}" stroke-width="${p.strokeW*1.2}"/>`}
      for(let j=0;j<=k;j++){const x=xl+j*nn*sx,v=j*nn,lcm=v>0&&v%L===0;g+=`<circle cx="${x}" cy="${ya}" r="${lcm?4.5:2.8}" fill="${lcm?p.colRes:cols[i]}"/>`;if(x-last>=gap||j===k||j===0){if(j===k||x-last>=gap){g+=Draw.t(x,ya+fs*.95,fm(v),p,{fs:fs*.65,c:lcm?p.colRes:p.textColor,w:lcm?700:400});last=x}else if(j===0){g+=Draw.t(x,ya+fs*.95,'0',p,{fs:fs*.65});last=x}}}}});
    let vl='';for(let q=1;q<=mult;q++){const x=xl+q*L*sx;vl+=`<line x1="${x}" x2="${x}" y1="${y0-fs*.3}" y2="${y0+n*rh}" stroke="${p.colRes}" stroke-width="${p.strokeW*1.2}" stroke-dasharray="7 5"/>`+Draw.t(x,y0-fs*.6,q===1?`${ab} = ${LS}`:fm(L*q),p,{a:x>W-fs*6?'end':'middle',c:p.colRes,w:700,fs:fs*.9})}g=vl+g}}
  else if(m==='list'){const cnt=ns.map(x=>Lm/x),Cm=Math.max(...cnt);
   if(big||Cm>26)g+=warn(`Hay demasiados múltiplos para listarlos (${ab} = ${LS}).`);
   else{const lw=fs*(Math.max(...ns.map(x=>String(x).length))*.6+3),cw=Math.min(fs*3.6,(W*.95-lw)/Cm),rh=Math.min(fs*3,avail/(n+.6)),ch=Math.min(rh*.78,fs*2),x0=(W-lw-Cm*cw)/2+lw,y0=top+(avail-n*rh)/2+fs*.4,pts=[];
    ns.forEach((nn,i)=>{const y=y0+i*rh+rh/2;g+=Draw.t(x0-fs*.4,y,`M(${nn})`,p,{a:'end',b:'central',w:700,c:cols[i],fs:fs*.95});
     for(let j=0;j<cnt[i];j++){const v=nn*(j+1),x=x0+j*cw,com=v%L===0;g+=`<rect x="${x+cw*.06}" y="${y-ch/2}" width="${cw*.88}" height="${ch}" rx="${ch*.25}" fill="${com?p.colRes:cols[i]}" fill-opacity="${com?.3:.18}" stroke="${com?p.colRes:cols[i]}" stroke-width="${com?p.strokeW*1.4:p.strokeW*.7}"/>`+Draw.t(x+cw/2,y,fm(v),p,{b:'central',w:com?700:400,fs:Math.min(fs*.95,cw*.84/(String(v).length*.62))});if(v===L)pts.push([x+cw/2,y])}});
    if(pts.length>1)g+=`<polyline points="${pts.map(q=>q.join(',')).join(' ')}" fill="none" stroke="${p.colRes}" stroke-width="${p.strokeW}" stroke-dasharray="6 5"/>`;
    if(pts.length)g+=Draw.t(pts[0][0],pts[0][1]-ch/2-fs*.5,`${ab} = ${LS}`,p,{a:pts[0][0]>W-fs*6?'end':'middle',c:p.colRes,w:700,fs:fs*.9})}}
  else if(m==='factors'){if(!primes.length)g+=Draw.t(W/2,H/2,`Todos los números son 1: ${ab} = 1`,p,{c:'#64748b'});
   else{const dd=ns.map((x,i)=>dec(facs[i],x)),w0=fs*Math.max(4.6,Math.max(...ns.map(x=>String(x).length))*.62+2.2),wp=fs*3.4,wd=p.showDecomp?fs*Math.max(9,Math.max(...dd.map(s=>s.length))*.55+1.6):0,sw=w0+primes.length*wp+wd,nr=n+2,rh0=fs*2,
     r=Math.min(1,W*.94/sw,avail/(nr*rh0)),f2=fs*r,rh=rh0*r,x0=(W-sw*r)/2,y0=top+(avail-nr*rh)/2,q2={...p,fontSize:f2},ce=(x,y,w,t,fill,b,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${rh}" fill="${fill}" stroke="#64748b" stroke-width="1.2"/>`+Draw.t(x+w/2,y+rh/2,t,q2,{b:'central',w:b?700:400,c});
    const cell=(i,j)=>{const e=facs[i].get(primes[j])||0;return e?primes[j]+sup(e):'—'};
    for(let ri=0;ri<nr;ri++){let x=x0;const y=y0+ri*rh,hd=ri===0,rs=ri===nr-1,i=ri-1;
     g+=ce(x,y,w0*r,hd?'Número':rs?ab:ns[i],hd||rs?'#dbeafe':'#fff',true,!hd&&!rs?cols[i]:undefined);x+=w0*r;
     primes.forEach((q,j)=>{const e=hd?0:rs?mx[j]:facs[i].get(q)||0,hi=!hd&&!rs&&e>0&&e===mx[j],t=hd?String(q):rs?q+sup(mx[j]):cell(i,j);g+=ce(x,y,wp*r,t,hd?'#dbeafe':rs?p.colRes+'33':hi?p.colRes+'2e':'#fff',hd||rs||hi,hi||rs?p.colRes:e===0&&!hd?'#94a3b8':undefined);x+=wp*r});
     if(p.showDecomp)g+=ce(x,y,wd*r,hd?'Descomposición':rs?`= ${LS}`:`${ns[i]} = ${dd[i]}`,hd||rs?'#dbeafe':'#fff',hd||rs)}}}
  else{const rows=[...steps,{vals:cur,q:null,dv:[]}],cw=fs*(Math.max(...ns.map(x=>String(x).length))*.62+1.8),pw=fs*2.6,sw=n*cw+pw,rh0=fs*2,r=Math.min(1,W*.9/sw,avail/(rows.length*rh0)),f2=fs*r,rh=rh0*r,x0=(W-sw*r)/2,y0=top+(avail-rows.length*rh)/2,q2={...p,fontSize:f2};
   rows.forEach((row,ri)=>{const y=y0+ri*rh;row.vals.forEach((v,i)=>{const x=x0+i*cw*r;if(row.dv[i])g+=`<rect x="${x+cw*r*.08}" y="${y+rh*.08}" width="${cw*r*.84}" height="${rh*.84}" rx="${rh*.2}" fill="${p.colRes}" fill-opacity=".2"/>`;g+=Draw.t(x+cw*r/2,y+rh/2,v,q2,{b:'central',w:row.dv[i]?700:400,c:cols[i]})});
    if(row.q)g+=Draw.t(x0+n*cw*r+pw*r/2,y+rh/2,row.q,q2,{b:'central',w:700,c:p.colRes})});
   g+=`<line x1="${x0+n*cw*r}" x2="${x0+n*cw*r}" y1="${y0}" y2="${y0+rows.length*rh}" stroke="${p.textColor}" stroke-width="${p.strokeW*1.3}"/>`}
  Ls.forEach((t,i)=>g+=Draw.t(W/2,tH+(H-tH)-below+fs*1.1+i*fs*1.3,t,p,{fs:Math.min(fs*.9,W*.94/(t.length*.5)),w:i===0&&p.showRes?700:400}));
  return T0+g}});
})();
