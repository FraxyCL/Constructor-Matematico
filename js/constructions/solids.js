// Cuerpos geométricos: poliedros (proyección con aristas ocultas), cuerpos redondos y redes planas
(()=>{
const {P,C,K,S}=Registry.h,ts=()=>Registry.h.ts(24),f=x=>Draw.fmt(x+0),D=Math.PI/180,PI=Math.PI,{view}=Draw.g;
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 norm=a=>{const l=Math.hypot(...a)||1;return[a[0]/l,a[1]/l,a[2]/l]},mean=vs=>vs.reduce((s,v)=>[s[0]+v[0],s[1]+v[1],s[2]+v[2]],[0,0,0]).map(x=>x/vs.length);
const shade=(c,k)=>'#'+[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)).map(x=>k<=1?x*k:x+(255-x)*(k-1)).map(x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('');
const LET='ABCDEFGHIJKLMNOPQRSTUVWX',LD=norm([-.45,.8,.55]);
// cámara: d = hacia el observador, r = derecha de la pantalla, u = arriba de la pantalla
const cam=(az,el)=>{const a=az*D,e=el*D;return{d:[Math.sin(a)*Math.cos(e),Math.sin(e),Math.cos(a)*Math.cos(e)],r:[Math.cos(a),0,-Math.sin(a)],u:[-Math.sin(a)*Math.sin(e),Math.cos(e),-Math.cos(a)*Math.sin(e)]}};
const proj=(c,v)=>[dot(v,c.r),dot(v,c.u),dot(v,c.d)];
const PHI=(1+Math.sqrt(5))/2,PL={tet:[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]],oct:[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],
 ico:[[0,1,PHI],[0,-1,PHI],[0,1,-PHI],[0,-1,-PHI],[1,PHI,0],[-1,PHI,0],[1,-PHI,0],[-1,-PHI,0],[PHI,0,1],[-PHI,0,1],[PHI,0,-1],[-PHI,0,-1]]};
function poly(p){const k=p.kind,h=p.h,n=p.n;let V,F;
 if(k==='cube'||k==='box'){const w=k==='cube'?p.a:p.w,hh=k==='cube'?p.a:p.h,d=k==='cube'?p.a:p.d;
  V=[[-w/2,-hh/2,d/2],[w/2,-hh/2,d/2],[w/2,-hh/2,-d/2],[-w/2,-hh/2,-d/2],[-w/2,hh/2,d/2],[w/2,hh/2,d/2],[w/2,hh/2,-d/2],[-w/2,hh/2,-d/2]];F=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]]}
 else if(k==='prism'||k==='pyr'){const R=p.a/(2*Math.sin(PI/n)),off=90-180/n,ng=y=>[...Array(n)].map((_,i)=>{const a=(off+360*i/n)*D;return[R*Math.cos(a),y,R*Math.sin(a)]}),idx=[...Array(n).keys()];
  if(k==='prism'){V=[...ng(-h/2),...ng(h/2)];F=[idx,idx.map(i=>i+n),...idx.map(i=>[i,(i+1)%n,n+(i+1)%n,n+i])]}else{V=[...ng(-h/2),[0,h/2,0]];F=[idx,...idx.map(i=>[i,(i+1)%n,n])]}}
 else{V=PL[k];let e=1e9;V.forEach((a,i)=>V.forEach((b,j)=>{if(i<j)e=Math.min(e,Math.hypot(...sub(a,b)))}));V=V.map(v=>v.map(x=>x*p.a/e));F=[];
  const ok=(a,b)=>Math.abs(Math.hypot(...sub(V[a],V[b]))-p.a)<1e-6*p.a+1e-9;
  for(let i=0;i<V.length;i++)for(let j=i+1;j<V.length;j++)for(let l=j+1;l<V.length;l++)if(ok(i,j)&&ok(j,l)&&ok(i,l))F.push([i,j,l])}
 const c=mean(V),fc=F.map(fa=>{const q=fa.map(i=>V[i]);let nn=norm(cross(sub(q[1],q[0]),sub(q[2],q[0])));if(dot(nn,sub(mean(q),c))<0)nn=nn.map(x=>-x);return{v:fa,n:nn}}),E=new Map();
 fc.forEach((fa,i)=>fa.v.forEach((a,j)=>{const b=fa.v[(j+1)%fa.v.length],key=Math.min(a,b)+'-'+Math.max(a,b);(E.get(key)||E.set(key,[]).get(key)).push(i)}));
 return{V,F:fc,E}}
function info(p){const k=p.kind,a=p.a,n=p.n,h=p.h,u=p.unit,t=(x,y,A,V)=>[`Área total = ${x} = ${f(A)} ${u}²`,`Volumen = ${y} = ${f(V)} ${u}³`];
 if(k==='cube')return t('6·a²','a³',6*a*a,a**3);
 if(k==='box')return t('2·(a·b + a·c + b·c)','a·b·c',2*(p.w*p.d+p.w*h+p.d*h),p.w*p.d*h);
 if(k==='tet')return t('√3·a²','a³ / (6·√2)',Math.sqrt(3)*a*a,a**3/(6*Math.SQRT2));
 if(k==='oct')return t('2·√3·a²','(√2 / 3)·a³',2*Math.sqrt(3)*a*a,Math.SQRT2/3*a**3);
 if(k==='ico')return t('5·√3·a²','(5·(3 + √5) / 12)·a³',5*Math.sqrt(3)*a*a,5*(3+Math.sqrt(5))/12*a**3);
 const Ab=n*a*a/(4*Math.tan(PI/n)),Pm=n*a;
 if(k==='prism')return t('2·Ab + P·h','Ab·h',2*Ab+Pm*h,Ab*h).concat([`Ab = ${f(Ab)} ${u}²,  P = ${f(Pm)} ${u}`]);
 const g=Math.sqrt(h*h+Math.pow(a/(2*Math.tan(PI/n)),2));return t('Ab + ½·P·g','⅓·Ab·h',Ab+Pm*g/2,Ab*h/3).concat([`Ab = ${f(Ab)} ${u}²,  P = ${f(Pm)} ${u},  g = ${f(g)} ${u}`])}
const dimsOf=(p,S)=>{const k=p.kind,u=p.unit,d=[];
 if(k==='cube')d.push([0,1,`a = ${f(p.a)} ${u}`]);else if(k==='box')d.push([0,1,`a = ${f(p.w)} ${u}`],[1,2,`b = ${f(p.d)} ${u}`],[1,5,`c = ${f(p.h)} ${u}`]);
 else if(k==='prism')d.push([0,1,`a = ${f(p.a)} ${u}`],[1,p.n+1,`h = ${f(p.h)} ${u}`]);else if(k==='pyr')d.push([0,1,`a = ${f(p.a)} ${u}`]);
 else{const[x,y]=[...S.E.keys()][0].split('-').map(Number);d.push([x,y,`a = ${f(p.a)} ${u}`])}return d};
const KINDS=[['cube','Cubo (hexaedro)'],['box','Prisma rectangular'],['prism','Prisma regular'],['pyr','Pirámide regular'],['tet','Tetraedro regular'],['oct','Octaedro regular'],['ico','Icosaedro regular']];
const sizes=(poly3=false)=>[P('a','Arista / lado de la base (cm)',4,1,10,'Medidas',{step:.5,show:p=>['cube','prism','pyr','tet','oct','ico'].includes(p.kind)}),
 P('w','Ancho a (cm)',5,1,10,'Medidas',{step:.5,show:p=>p.kind==='box'}),P('d','Fondo b (cm)',3,1,10,'Medidas',{step:.5,show:p=>p.kind==='box'}),
 P('h','Alto (cm)',4,1,10,'Medidas',{step:.5,show:p=>['box','prism','pyr'].includes(p.kind)}),P('n','Lados de la base',5,3,12,'Medidas',{show:p=>['prism','pyr'].includes(p.kind)})];

Registry.register({id:'solid-poly',category:'solids',name:'Poliedros',icon:'🧊',description:'Cubo, prismas, pirámides y sólidos platónicos con aristas ocultas',
 parameters:[S('kind','Cuerpo','cube','Cuerpo',KINDS),...sizes(),P('az','Giro horizontal (°)',35,0,359,'Vista'),P('el','Elevación (°)',25,-80,80,'Vista'),
  K('showHidden','Aristas ocultas punteadas',true,'Mostrar'),K('wire','Cuerpo transparente',false,'Mostrar'),K('showV','Nombrar vértices',false,'Mostrar'),K('showDims','Medidas de las aristas',true,'Mostrar'),K('showFormula','Área y volumen',false,'Mostrar'),Registry.h.UN(),
  C('col','Color del cuerpo','#60a5fa','Estilo'),P('strokeW','Grosor de las aristas',2.5,1,8,'Estilo',{style:true,step:.5}),P('size','Tamaño (%)',75,30,100,'Estilo',{style:true}),...ts()],
 render(p,W,H){const S0=poly(p),cm=cam(p.az,p.el),pv=S0.V.map(v=>proj(cm,v)),xs=pv.map(q=>q[0]),ys=pv.map(q=>q[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),
  inf=info(p),fs=p.fontSize,below=p.showFormula?fs*(inf.length*1.25+.6):0,tH=Draw.titleH(p),av=H-tH-below,k=Math.min(W*p.size/100/((x1-x0)||1),av*p.size/100/((y1-y0)||1)),
  T=q=>[W/2+(q[0]-(x0+x1)/2)*k,tH+av/2-(q[1]-(y0+y1)/2)*k],ctr=[W/2,tH+av/2];let g='',hid='',vsb='';
  const fcs=S0.F.map(fa=>({...fa,z:mean(fa.v.map(j=>pv[j]))[2],front:dot(fa.n,cm.d)>0})),pts=fa=>fa.v.map(j=>T(pv[j]).join(',')).join(' ');
  [...fcs].sort((a,b)=>a.z-b.z).forEach(fa=>{if(!fa.front&&!p.wire)return;g+=`<polygon points="${pts(fa)}" fill="${p.wire?p.col:shade(p.col,.62+.5*Math.max(0,dot(fa.n,LD)))}" fill-opacity="${p.wire?.16:1}"/>`});
  const vis=new Set();S0.E.forEach((fl,key)=>{const[a,b]=key.split('-').map(Number),v=fl.some(i=>fcs[i].front),A=T(pv[a]),B=T(pv[b]),l=`x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}"`;
   if(v){vis.add(a);vis.add(b);vsb+=`<line ${l} stroke="#0f172a" stroke-width="${p.strokeW}" stroke-linecap="round"/>`}else if(p.showHidden||p.wire)hid+=`<line ${l} stroke="#0f172a" stroke-opacity=".6" stroke-width="${p.strokeW*.7}" stroke-dasharray="6 5"/>`});
  g+=hid+vsb;
  if(p.showV)(p.wire?pv.map((_,i)=>i):[...vis]).forEach(i=>{const q=T(pv[i]),d=[q[0]-ctr[0],q[1]-ctr[1]],l=Math.hypot(...d)||1;g+=Draw.t(q[0]+d[0]/l*fs*.9,q[1]+d[1]/l*fs*.9,LET[i],p,{b:'central',w:700})});
  if(p.showDims){const lbl=(A,B,t)=>{const m=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[m[0]-ctr[0],m[1]-ctr[1]],l=Math.hypot(...d)||1;return Draw.t(m[0]+d[0]/l*fs*1.1,m[1]+d[1]/l*fs*1.1,t,p,{b:'central',c:'#dc2626',w:700,fs:fs*.8})};
   dimsOf(p,S0).forEach(([i,j,t])=>g+=lbl(T(pv[i]),T(pv[j]),t));
   if(p.kind==='pyr'){const A=T(pv[p.n]),B=T(proj(cm,[0,-p.h/2,0]));g+=`<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 4"/>`+lbl(A,B,`h = ${f(p.h)} ${p.unit}`)}}
  if(p.showFormula)inf.forEach((t,i)=>g+=Draw.t(W/2,tH+av+fs*1.2+i*fs*1.25,t,p,{fs:fs*.85}));
  return Draw.title(p,W)+g}});

// ---------- Cuerpos redondos ----------
Registry.register({id:'solid-round',category:'solids',name:'Cilindro, cono y esfera',icon:'🛢',description:'Cuerpos de revolución con base elíptica en perspectiva',
 parameters:[S('kind','Cuerpo','cyl','Cuerpo',[['cyl','Cilindro'],['cone','Cono'],['sph','Esfera']]),P('r','Radio (cm)',3,1,10,'Medidas',{step:.5}),P('h','Altura (cm)',5,1,12,'Medidas',{step:.5,show:p=>p.kind!=='sph'}),P('el','Elevación de la vista (°)',22,5,85,'Vista'),
  K('showHidden','Línea oculta punteada',true,'Mostrar'),K('showDims','Medidas (r, h, g)',true,'Mostrar'),K('showFormula','Área y volumen',false,'Mostrar'),Registry.h.UN(),
  C('col','Color del cuerpo','#34d399','Estilo'),P('strokeW','Grosor de las líneas',2.5,1,8,'Estilo',{style:true,step:.5}),P('size','Tamaño (%)',75,30,100,'Estilo',{style:true}),...ts()],
 render(p,W,H){const r=p.r,h=p.h,e=p.el*D,ry=r*Math.sin(e),hp=p.kind==='sph'?0:h*Math.cos(e),fs=p.fontSize,u=p.unit,K0=p.kind,
  ytop=K0==='cyl'?hp/2+ry:K0==='cone'?hp/2:r,ybot=K0==='sph'?-r:-hp/2-ry,g_=Math.sqrt(r*r+h*h),
  lines=K0==='cyl'?[`Área total = 2·π·r·(r + h) = ${f(2*PI*r*(r+h))} ${u}²`,`Volumen = π·r²·h = ${f(PI*r*r*h)} ${u}³`]:K0==='cone'?[`Generatriz g = √(r² + h²) = ${f(g_)} ${u}`,`Área total = π·r·(r + g) = ${f(PI*r*(r+g_))} ${u}²`,`Volumen = ⅓·π·r²·h = ${f(PI*r*r*h/3)} ${u}³`]:[`Área = 4·π·r² = ${f(4*PI*r*r)} ${u}²`,`Volumen = ⁴⁄₃·π·r³ = ${f(4/3*PI*r**3)} ${u}³`],
  below=p.showFormula?fs*(lines.length*1.25+.6):0,tH=Draw.titleH(p),av=H-tH-below,k=Math.min(W*p.size/100/(2*r*1.3),av*p.size/100/((ytop-ybot)||1)),cy=(ytop+ybot)/2,T=(x,y)=>[W/2+x*k,tH+av/2-(y-cy)*k],
  st=`stroke="#0f172a" stroke-width="${p.strokeW}" stroke-linejoin="round"`,rx=r*k,ryk=ry*k,pt=(x,y)=>T(x,y).join(' '),dash=`stroke="#0f172a" stroke-opacity=".6" stroke-width="${p.strokeW*.7}" stroke-dasharray="6 5" fill="none"`;let g='';
  const lab=(x,y,t,dx=0,dy=0)=>Draw.t(T(x,y)[0]+dx,T(x,y)[1]+dy,t,p,{c:'#dc2626',w:700,fs:fs*.85,b:'central',a:dx>0?'start':'middle'}),seg=(a,b,c='#dc2626')=>{const A=T(...a),B=T(...b);return `<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${c}" stroke-width="2" stroke-dasharray="5 4"/>`};
  if(K0==='cyl'){g+=`<path d="M${pt(-r,hp/2)} L${pt(-r,-hp/2)} A${rx} ${ryk} 0 0 0 ${pt(r,-hp/2)} L${pt(r,hp/2)} Z" fill="${p.col}" ${st}/>`+(p.showHidden?`<path d="M${pt(r,-hp/2)} A${rx} ${ryk} 0 0 0 ${pt(-r,-hp/2)}" ${dash}/>`:'')+`<ellipse cx="${T(0,hp/2)[0]}" cy="${T(0,hp/2)[1]}" rx="${rx}" ry="${ryk}" fill="${shade(p.col,1.4)}" ${st}/>`;
   if(p.showDims)g+=seg([0,hp/2],[r,hp/2])+lab(r/2,hp/2,`r = ${f(r)} ${u}`,0,-fs*.9)+seg([r*1.18,hp/2],[r*1.18,-hp/2])+lab(r*1.18,0,`h = ${f(h)} ${u}`,fs*.4,0)}
  else if(K0==='cone'){g+=`<path d="M${pt(0,hp/2)} L${pt(-r,-hp/2)} A${rx} ${ryk} 0 0 0 ${pt(r,-hp/2)} Z" fill="${p.col}" ${st}/>`+(p.showHidden?`<path d="M${pt(r,-hp/2)} A${rx} ${ryk} 0 0 0 ${pt(-r,-hp/2)}" ${dash}/>`:'');
   if(p.showDims)g+=seg([0,hp/2],[0,-hp/2])+lab(0,0,`h = ${f(h)} ${u}`,fs*.4,0)+seg([0,-hp/2],[r,-hp/2])+lab(r/2,-hp/2,`r = ${f(r)} ${u}`,0,fs*.9)+lab(r/2,0,`g = ${f(g_)} ${u}`,fs*.5,-fs*.3)}
  else{g+=`<defs><radialGradient id="sg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${shade(p.col,1.7)}"/><stop offset="1" stop-color="${shade(p.col,.7)}"/></radialGradient></defs><circle cx="${T(0,0)[0]}" cy="${T(0,0)[1]}" r="${rx}" fill="url(#sg)" ${st}/>`+
   `<path d="M${pt(-r,0)} A${rx} ${ryk} 0 0 0 ${pt(r,0)}" fill="none" ${st}/>`+(p.showHidden?`<path d="M${pt(r,0)} A${rx} ${ryk} 0 0 0 ${pt(-r,0)}" ${dash}/>`:'');
   if(p.showDims)g+=seg([0,0],[r,0])+`<circle cx="${T(0,0)[0]}" cy="${T(0,0)[1]}" r="4" fill="#0f172a"/>`+lab(r/2,0,`r = ${f(r)} ${u}`,0,-fs*.9)}
  if(p.showFormula)lines.forEach((t,i)=>g+=Draw.t(W/2,tH+av+fs*1.2+i*fs*1.25,t,p,{fs:fs*.85}));
  return Draw.title(p,W)+g}});

// ---------- Redes (desarrollos planos) ----------
const netOf=p=>{const k=p.kind,a=p.a,w=p.w,d=p.d,h=p.h,r=p.r,u=p.unit,y=(x,yy,ww,hh)=>({pts:[[x,-yy],[x+ww,-yy],[x+ww,-yy-hh],[x,-yy-hh]]}),I=[],Lb=[],L=[];
 if(k==='cube'){[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]].forEach(([c,rw])=>I.push(y(c*a,rw*a,a,a)));Lb.push([[1.5*a,0],`a = ${f(a)} ${u}`,0,-1]);L.push(`Área total = 6·a² = ${f(6*a*a)} ${u}²`,`Volumen = a³ = ${f(a**3)} ${u}³`)}
 else if(k==='box'){I.push(y(d,0,w,d),y(0,d,d,h),y(d,d,w,h),y(d+w,d,d,h),y(2*d+w,d,w,h),y(d,d+h,w,d));Lb.push([[d+w/2,0],`a = ${f(w)} ${u}`,0,-1],[[d,-d/2],`b = ${f(d)} ${u}`,-1,0],[[0,-(d+h/2)],`c = ${f(h)} ${u}`,-1,0]);
  L.push(`Área total = 2·(a·b + a·c + b·c) = ${f(2*(w*d+w*h+d*h))} ${u}²`,`Volumen = a·b·c = ${f(w*d*h)} ${u}³`)}
 else if(k==='pyr'){const s=Math.sqrt(h*h+a*a/4);I.push(y(0,0,a,a),{pts:[[0,0],[a,0],[a/2,s]]},{pts:[[a,0],[a,-a],[a+s,-a/2]]},{pts:[[a,-a],[0,-a],[a/2,-a-s]]},{pts:[[0,-a],[0,0],[-s,-a/2]]});
  Lb.push([[a/2,-a],`a = ${f(a)} ${u}`,0,1]);L.push(`Apotema g = √(h² + (a/2)²) = ${f(s)} ${u}`,`Área total = a² + 2·a·g = ${f(a*a+2*a*s)} ${u}²`,`Volumen = ⅓·a²·h = ${f(a*a*h/3)} ${u}³`)}
 else if(k==='cyl'){const c=2*PI*r;I.push(y(0,0,c,h),{c:[c/2,r],r},{c:[c/2,-h-r],r});Lb.push([[c/2,0],`2·π·r = ${f(c)} ${u}`,0,-1],[[c,-h/2],`h = ${f(h)} ${u}`,1,0]);L.push(`Área total = 2·π·r·(r + h) = ${f(2*PI*r*(r+h))} ${u}²`,`Volumen = π·r²·h = ${f(PI*r*r*h)} ${u}³`)}
 else{const g=Math.sqrt(r*r+h*h),th=360*r/g,pts=[[0,0]];for(let i=0;i<=40;i++){const q=(-90-th/2+th*i/40)*D;pts.push([g*Math.cos(q),g*Math.sin(q)])}I.push({pts},{c:[0,-g-r],r});
  Lb.push([[g*Math.cos((-90-th/2)*D)/2,g*Math.sin((-90-th/2)*D)/2],`g = ${f(g)} ${u}`,-1,0],[[0,-g/2],`${f(th)}°`,0,0]);L.push(`Generatriz g = √(r² + h²) = ${f(g)} ${u}`,`Ángulo del sector = 360°·r / g = ${f(th)}°`,`Área total = π·r·(r + g) = ${f(PI*r*(r+g))} ${u}²`)}
 return{I,Lb,L}};
Registry.register({id:'solid-net',category:'solids',name:'Redes (desarrollo plano)',icon:'✂',description:'Desarrollo plano de cubo, prisma, pirámide, cilindro y cono',
 parameters:[S('kind','Cuerpo','cube','Cuerpo',[['cube','Cubo'],['box','Prisma rectangular'],['pyr','Pirámide cuadrangular'],['cyl','Cilindro'],['cone','Cono']]),
  P('a','Lado (cm)',3,1,8,'Medidas',{step:.5,show:p=>['cube','pyr'].includes(p.kind)}),P('w','Ancho a (cm)',4,1,8,'Medidas',{step:.5,show:p=>p.kind==='box'}),P('d','Fondo b (cm)',2,1,8,'Medidas',{step:.5,show:p=>p.kind==='box'}),
  P('h','Alto (cm)',3,1,8,'Medidas',{step:.5,show:p=>['box','pyr','cyl','cone'].includes(p.kind)}),P('r','Radio (cm)',1.5,.5,5,'Medidas',{step:.5,show:p=>['cyl','cone'].includes(p.kind)}),
  K('showNum','Numerar las caras',false,'Mostrar'),K('showDims','Medidas',true,'Mostrar'),K('showFormula','Área y volumen',true,'Mostrar'),Registry.h.UN(),
  C('col','Color de las caras','#fbbf24','Estilo'),P('strokeW','Grosor de las líneas',2.5,1,8,'Estilo',{style:true,step:.5}),P('size','Tamaño (%)',85,30,100,'Estilo',{style:true}),...ts()],
 render(p,W,H){const N=netOf(p),fs=p.fontSize,xs=[],ys=[];N.I.forEach(s=>{if(s.pts)s.pts.forEach(q=>{xs.push(q[0]);ys.push(q[1])});else{xs.push(s.c[0]-s.r,s.c[0]+s.r);ys.push(s.c[1]-s.r,s.c[1]+s.r)}});
  const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),below=p.showFormula?fs*(N.L.length*1.25+.6):0,m=view(p,W,H,Math.max(x1-x0,y1-y0)/2*1.1,below,(x0+x1)/2,(y0+y1)/2),st=`stroke="#0f172a" stroke-width="${p.strokeW}" stroke-linejoin="round"`;let g='';
  N.I.forEach((s,i)=>{const col=shade(p.col,[1,1.2,.9][i%3]);if(s.pts)g+=`<polygon points="${s.pts.map(q=>m.T(q).join(',')).join(' ')}" fill="${col}" ${st}/>`;else{const c=m.T(s.c);g+=`<circle cx="${c[0]}" cy="${c[1]}" r="${s.r*m.k}" fill="${col}" ${st}/>`}
   if(p.showNum){const c=s.pts?[s.pts.reduce((a,q)=>a+q[0],0)/s.pts.length,s.pts.reduce((a,q)=>a+q[1],0)/s.pts.length]:s.c;g+=Draw.t(...m.T(c),i+1,p,{b:'central',w:700})}});
  if(p.showDims)N.Lb.forEach(([q,t,dx,dy])=>{const c=m.T(q);g+=Draw.t(c[0]+dx*fs*.5,c[1]+dy*fs*.8,t,p,{c:'#dc2626',w:700,fs:fs*.8,b:'central',a:dx>0?'start':dx<0?'end':'middle'})});
  if(p.showFormula)N.L.forEach((t,i)=>g+=Draw.t(W/2,m.tH+m.av+fs*1.2+i*fs*1.25,t,p,{fs:fs*.85}));
  return Draw.title(p,W)+g}});
})();
