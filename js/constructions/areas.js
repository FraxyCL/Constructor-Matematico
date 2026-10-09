// Perímetro y área: composición de figuras (cuadrados, círculos, sectores, polígonos…) con regiones achuradas, huecos y cálculo de áreas y perímetros
(()=>{
const {P,C,K,S,A}=Registry.h,ts=()=>Registry.h.ts(24),f=x=>Draw.fmt(x+0),D=Math.PI/180,PI=Math.PI,{view,arc,ln}=Draw.g;
const N=6,COL=['#93c5fd','#fca5a5','#86efac','#fde68a','#c4b5fd','#a5f3fc'];
const TY=[['none','— (sin figura)'],['sq','Cuadrado'],['rc','Rectángulo'],['ci','Círculo'],['sc','Semicírculo'],['se','Sector circular'],['tr','Triángulo isósceles'],['rt','Triángulo rectángulo'],['pg','Polígono regular']];
const NAMES={sq:'Cuadrado',rc:'Rectángulo',ci:'Círculo',sc:'Semicírculo',se:'Sector circular',tr:'Triángulo isósceles',rt:'Triángulo rectángulo',pg:'Polígono regular'};
const A1={sq:'Lado',rc:'Ancho',ci:'Radio',sc:'Radio',se:'Radio',tr:'Base',rt:'Cateto horizontal',pg:'Radio de la circunferencia circunscrita'},
 B1={rc:'Alto (cm)',tr:'Altura (cm)',rt:'Cateto vertical (cm)',se:'Amplitud del sector (°)',pg:'Número de lados'},R1={sc:'Orientación del arco (°)',se:'Ángulo inicial (°)'};
const DEF={sq:{a:6},rc:{a:8,b:4},ci:{a:3},sc:{a:3,r:90},se:{a:4,b:90,r:0},tr:{a:6,b:4},rt:{a:6,b:4},pg:{a:3,b:6}};
const ROLES=[['fill','Con color'],['hatch','Achurada'],['hole','Hueco (se resta)']];
const slot=i=>{const g='Figura '+(i+1),on=p=>p['t'+i]!=='none',has=l=>p=>on(p)&&l.includes(p['t'+i]);return[
 S('t'+i,'Tipo de figura',['sq','ci'][i]||'none',g,TY),{key:'_t'+i,type:'text',def:['sq','ci'][i]||'none',show:()=>false},
 P('x'+i,'Centro: posición X',0,-15,15,g,{step:.5,show:on}),P('y'+i,'Centro: posición Y',0,-15,15,g,{step:.5,show:on}),
 P('a'+i,p=>(A1[p['t'+i]]||'Medida')+' (cm)',[8,4][i]||4,.5,20,g,{step:.5,show:on}),
 P('b'+i,p=>B1[p['t'+i]]||'',4,p=>p['t'+i]==='pg'?3:p['t'+i]==='se'?5:.5,p=>p['t'+i]==='pg'?12:p['t'+i]==='se'?360:20,g,{step:.5,show:has(['rc','se','tr','rt','pg'])}),
 P('r'+i,p=>R1[p['t'+i]]||'Rotación (°)',0,0,359,g,{show:p=>on(p)&&p['t'+i]!=='ci'}),
 S('k'+i,'Función en el dibujo',i===0?'hatch':i===1?'hole':'fill',g,ROLES,on),{...C('c'+i,'Color de relleno',COL[i],g),show:p=>on(p)&&p['k'+i]==='fill'}]};
const none={t0:'none',t1:'none',t2:'none',t3:'none',t4:'none',t5:'none'};
const PRE={
 sqCircle:{t0:'sq',x0:0,y0:0,a0:8,r0:0,k0:'hatch',t1:'ci',x1:0,y1:0,a1:4,k1:'hole'},
 circSq:{t0:'ci',x0:0,y0:0,a0:4,k0:'hatch',t1:'pg',x1:0,y1:0,a1:4,b1:4,r1:45,k1:'hole'},
 track:{t0:'rc',x0:0,y0:0,a0:8,b0:4,r0:0,k0:'fill',t1:'sc',x1:-4,y1:0,a1:2,r1:180,k1:'fill',t2:'sc',x2:4,y2:0,a2:2,r2:0,k2:'fill',rH:false,rT:true,pT:true},
 lens:{t0:'ci',x0:-2,y0:0,a0:4,k0:'hatch',t1:'ci',x1:2,y1:0,a1:4,k1:'hatch',hmode:'inter'},
 rosette:{t0:'sq',x0:0,y0:0,a0:8,r0:0,k0:'hatch',t1:'ci',x1:-2,y1:-2,a1:2,k1:'hole',t2:'ci',x2:2,y2:-2,a2:2,k2:'hole',t3:'ci',x3:-2,y3:2,a3:2,k3:'hole',t4:'ci',x4:2,y4:2,a4:2,k4:'hole'}};
// ---- modelo geométrico ----
const build=p=>{const S=[];for(let i=0;i<N;i++){const t=p['t'+i];if(!t||t==='none')continue;const x=p['x'+i],y=p['y'+i],a=p['a'+i],b=p['b'+i],r=p['r'+i],o={t,x,y,a,b,r,k:p['k'+i],c:p['c'+i]};
  const q=pts=>{const c=Math.cos(r*D),s=Math.sin(r*D);return pts.map(v=>[x+v[0]*c-v[1]*s,y+v[0]*s+v[1]*c])};
  if(t==='sq')o.pts=q([[-a/2,-a/2],[a/2,-a/2],[a/2,a/2],[-a/2,a/2]]);else if(t==='rc')o.pts=q([[-a/2,-b/2],[a/2,-b/2],[a/2,b/2],[-a/2,b/2]]);
  else if(t==='tr')o.pts=q([[-a/2,-b/2],[a/2,-b/2],[0,b/2]]);else if(t==='rt')o.pts=q([[-a/2,-b/2],[a/2,-b/2],[-a/2,b/2]]);
  else if(t==='pg'){const n=Math.max(3,Math.round(b));o.n=n;o.pts=q([...Array(n)].map((_,j)=>[a*Math.cos((90+360*j/n)*D),a*Math.sin((90+360*j/n)*D)]))}
  S.push(o)}return S};
const inside=(s,x,y)=>{if(s.pts){const q=s.pts,n=q.length;for(let i=0;i<n;i++){const A=q[i],B=q[(i+1)%n];if((B[0]-A[0])*(y-A[1])-(B[1]-A[1])*(x-A[0])<-1e-9)return false}return true}
 const dx=x-s.x,dy=y-s.y;if(dx*dx+dy*dy>s.a*s.a)return false;if(s.t==='ci')return true;if(s.t==='sc')return dx*Math.cos(s.r*D)+dy*Math.sin(s.r*D)>=-1e-9;
 return (((Math.atan2(dy,dx)/D-s.r)%360+360)%360)<=s.b+1e-9};
const region=(p,S)=>{const hs=S.filter(s=>s.k==='hatch'),fl=S.filter(s=>s.k!=='hole'),ho=S.filter(s=>s.k==='hole'),nh=(x,y)=>!ho.some(s=>inside(s,x,y));
 return{H:(x,y)=>hs.length>0&&(p.hmode==='inter'?hs.every(s=>inside(s,x,y)):hs.some(s=>inside(s,x,y)))&&nh(x,y),T:(x,y)=>fl.some(s=>inside(s,x,y))&&nh(x,y)}};
const bbox=S=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;S.forEach(s=>(s.pts||[[s.x-s.a,s.y-s.a],[s.x+s.a,s.y+s.a]]).forEach(q=>{a=Math.min(a,q[0]);c=Math.max(c,q[0]);b=Math.min(b,q[1]);d=Math.max(d,q[1])}));return[a,b,c,d]};
// álgebra de intervalos en y para una columna x (exacta para figuras convexas y sectores): área sin error de malla en y
const nm=a=>{a=a.filter(q=>q[1]-q[0]>1e-12).sort((u,v)=>u[0]-v[0]);const o=[];a.forEach(q=>{const l=o[o.length-1];if(l&&q[0]<=l[1]+1e-12)l[1]=Math.max(l[1],q[1]);else o.push([q[0],q[1]])});return o};
const iInter=(a,b)=>{const o=[];a.forEach(u=>b.forEach(v=>{const lo=Math.max(u[0],v[0]),hi=Math.min(u[1],v[1]);if(hi>lo)o.push([lo,hi])}));return nm(o)};
const iSub=(a,b)=>{let o=a;b.forEach(v=>{const r=[];o.forEach(u=>{if(v[1]<=u[0]||v[0]>=u[1])r.push(u);else{if(v[0]>u[0])r.push([u[0],v[0]]);if(v[1]<u[1])r.push([v[1],u[1]])}});o=r});return o};
const hp=(iv,nx,ny,px,py,x)=>{const c=nx*(x-px);if(Math.abs(ny)<1e-12)return c>=-1e-12?iv:[];const yb=py-c/ny;return iInter(iv,ny>0?[[yb,1e9]]:[[-1e9,yb]])};
const sIv=(s,x)=>{if(s.pts){const q=s.pts,ys=[];q.forEach((A,i)=>{const B=q[(i+1)%q.length];if(Math.min(A[0],B[0])<=x&&x<=Math.max(A[0],B[0])){if(Math.abs(B[0]-A[0])<1e-12)ys.push(A[1],B[1]);else ys.push(A[1]+(x-A[0])/(B[0]-A[0])*(B[1]-A[1]))}});return ys.length?[[Math.min(...ys),Math.max(...ys)]]:[]}
 const d=s.a*s.a-(x-s.x)**2;if(d<=0)return[];const w=Math.sqrt(d),c=[[s.y-w,s.y+w]];if(s.t==='ci')return c;const co=a=>Math.cos(a*D),si=a=>Math.sin(a*D);
 if(s.t==='sc')return hp(c,co(s.r),si(s.r),s.x,s.y,x);const b=Math.min(s.b,360),e=s.r+b;if(b>=359.99)return c;
 if(b<=180)return hp(hp(c,-si(s.r),co(s.r),s.x,s.y,x),si(e),-co(e),s.x,s.y,x);
 return iSub(c,hp(hp(c,-si(e),co(e),s.x,s.y,x),si(s.r),-co(s.r),s.x,s.y,x))};
const tot=a=>a.reduce((s,q)=>s+q[1]-q[0],0);
const areas=(p,S,bb)=>{const n=5000,dx=(bb[2]-bb[0])/n,hsS=S.filter(s=>s.k==='hatch'),hoS=S.filter(s=>s.k==='hole'),flS=S.filter(s=>s.k!=='hole');let ah=0,at=0;
 for(let i=0;i<n;i++){const x=bb[0]+(i+.5)*dx,ho=nm(hoS.flatMap(s=>sIv(s,x)));at+=tot(iSub(nm(flS.flatMap(s=>sIv(s,x))),ho));
  if(hsS.length){const hs=hsS.map(s=>sIv(s,x)),u=p.hmode==='inter'?hs.reduce((a,b)=>iInter(a,b)):nm(hs.flat());ah+=tot(iSub(u,ho))}}return{H:ah*dx,T:at*dx}};
// muestras del contorno de cada figura: [x, y, normal exterior, longitud]; un punto es borde de la región si a un lado está dentro y al otro fuera
const outl=(s,h0)=>{const o=[],pp=(x,y,nx,ny,ds)=>o.push([x,y,nx,ny,ds]);
 const seg=(A,B,nx,ny)=>{const L=Math.hypot(B[0]-A[0],B[1]-A[1]),n=Math.max(1,Math.ceil(L/h0));for(let i=0;i<n;i++){const t=(i+.5)/n;pp(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,nx,ny,L/n)}};
 const arcS=(a1,sp)=>{const L=s.a*sp*D,n=Math.max(1,Math.ceil(L/h0));for(let i=0;i<n;i++){const a=(a1+sp*(i+.5)/n)*D;pp(s.x+s.a*Math.cos(a),s.y+s.a*Math.sin(a),Math.cos(a),Math.sin(a),L/n)}};
 const E=a=>[s.x+s.a*Math.cos(a*D),s.y+s.a*Math.sin(a*D)];
 if(s.pts){const q=s.pts;q.forEach((A,i)=>{const B=q[(i+1)%q.length],L=Math.hypot(B[0]-A[0],B[1]-A[1])||1;seg(A,B,(B[1]-A[1])/L,-(B[0]-A[0])/L)})}
 else if(s.t==='ci')arcS(0,360);
 else if(s.t==='sc'){arcS(s.r-90,180);seg(E(s.r+90),E(s.r-90),-Math.cos(s.r*D),-Math.sin(s.r*D))}
 else{const sp=Math.min(s.b,360);arcS(s.r,sp);if(sp<359.99){seg([s.x,s.y],E(s.r),Math.sin(s.r*D),-Math.cos(s.r*D));seg([s.x,s.y],E(s.r+sp),-Math.sin((s.r+sp)*D),Math.cos((s.r+sp)*D))}}
 return o};
const perims=(S,R,h0,eps)=>{let ph=0,pt=0;S.forEach(s=>outl(s,h0).forEach(([x,y,nx,ny,ds])=>{const x1=x+nx*eps,y1=y+ny*eps,x2=x-nx*eps,y2=y-ny*eps;if(R.H(x1,y1)!==R.H(x2,y2))ph+=ds;if(R.T(x1,y1)!==R.T(x2,y2))pt+=ds}));return{H:ph,T:pt}};
// área y perímetro de cada figura por separado (fórmulas)
const meas=s=>{const{a,b}=s;switch(s.t){case'sq':return[a*a,4*a];case'rc':return[a*b,2*(a+b)];case'ci':return[PI*a*a,2*PI*a];case'sc':return[PI*a*a/2,PI*a+2*a];case'se':return[PI*a*a*b/360,2*a+PI*a*b/180];
 case'tr':return[a*b/2,a+2*Math.sqrt(a*a/4+b*b)];case'rt':return[a*b/2,a+b+Math.hypot(a,b)];default:{const n=s.n;return[n*a*a*Math.sin(2*PI/n)/2,n*2*a*Math.sin(PI/n)]}}};
const edges={sq:[0],rc:[0,1],tr:[0],rt:[0,2],pg:[0]};

Registry.register({id:'area-compose',category:'area',name:'Figuras combinadas',icon:'📏',description:'Mezcla figuras, achura regiones, resta huecos y calcula áreas y perímetros',
 parameters:[S('preset','Ejemplos listos','sqCircle','Ejemplos',[['custom','Personalizado (configuro las figuras yo)'],['sqCircle','Cuadrado con círculo inscrito (achurar el exterior)'],['circSq','Círculo con cuadrado inscrito (achurar el exterior)'],['track','Pista: rectángulo con dos semicírculos'],['lens','Lente: intersección de dos círculos'],['rosette','Cuadrado con cuatro círculos recortados']]),
  {key:'_pre',type:'text',def:'sqCircle',show:()=>false},...[0,1,2,3,4,5].flatMap(slot),
  S('hmode','Con varias figuras achuradas, achurar','union','Achurado',[['union','La unión de todas'],['inter','Solo la zona común (intersección)']]),
  P('hang','Ángulo de las líneas (°)',45,0,179,'Achurado',{style:true}),P('hsp','Separación de las líneas (px)',9,4,30,'Achurado',{style:true}),P('hw','Grosor de las líneas',1.5,.5,5,'Achurado',{style:true,step:.5}),C('hcol','Color del achurado','#1e3a8a','Achurado'),
  K('rH','Área de la región achurada',true,'Resultados'),K('rT','Área total de la figura',false,'Resultados'),K('pH','Perímetro de la región achurada',false,'Resultados'),K('pT','Perímetro de la figura total',false,'Resultados'),K('calc','Fórmulas de cada figura (A y P)',false,'Resultados'),
  K('showDims','Medidas sobre las figuras',false,'Mostrar'),K('showGrid','Cuadrícula de fondo (1 unidad)',false,'Mostrar'),Registry.h.UN(),
  C('stroke','Color del contorno','#1e293b','Estilo'),P('strokeW','Grosor del contorno',3,1,10,'Estilo',{style:true}),P('op','Opacidad de los colores (%)',75,10,100,'Estilo',{style:true}),P('size','Tamaño de la figura (%)',80,30,100,'Estilo',{style:true}),...ts()],
 normalize(p){let pre=false;if(p._pre!==p.preset){if(PRE[p.preset]){Object.assign(p,none,{rH:true,rT:false,pH:false,pT:false,hmode:'union'},PRE[p.preset]);pre=true}p._pre=p.preset}
  for(let i=0;i<N;i++){if(p['_t'+i]!==p['t'+i]){const d=DEF[p['t'+i]];if(d&&!pre){if(d.a!=null)p['a'+i]=d.a;if(d.b!=null)p['b'+i]=d.b;if(d.r!=null)p['r'+i]=d.r}p['_t'+i]=p['t'+i]}}},
 render(p,W,H){const S=build(p),fs=p.fontSize,u=p.unit;if(!S.length)return Draw.t(W/2,H/2,'Agrega una figura en el panel',p,{c:'#94a3b8'});
  const bb=bbox(S),sz=Math.max(bb[2]-bb[0],bb[3]-bb[1],1e-6),R=region(p,S),hasH=S.some(s=>s.k==='hatch'),L=[];let aH=0,aT=0,pH=0,pT=0;
  if(p.rH||p.rT){const r=areas(p,S,bb);aH=r.H;aT=r.T}if(p.pH||p.pT){const r=perims(S,R,sz/1500,sz*1e-8);pH=r.H;pT=r.T}
  if(p.rH&&hasH)L.push(`Área achurada ≈ ${f(aH)} ${u}²`);if(p.rT)L.push(`Área total de la figura ≈ ${f(aT)} ${u}²`);if(p.pH&&hasH)L.push(`Perímetro de la región achurada ≈ ${f(pH)} ${u}`);if(p.pT)L.push(`Perímetro de la figura ≈ ${f(pT)} ${u}`);
  if(p.calc)S.forEach(s=>{const[a,pp]=meas(s);L.push(`${NAMES[s.t]}${s.k==='hole'?' (se resta)':''}: A = ${f(a)} ${u}², P = ${f(pp)} ${u}`)});
  const below=L.length?L.length*fs*1.25+fs*.5:0,m=view(p,W,H,sz/2*1.2,below,(bb[0]+bb[2])/2,(bb[1]+bb[3])/2),
   el=(s,a)=>{if(s.t==='ci'){const c=m.T([s.x,s.y]);return `<circle cx="${c[0]}" cy="${c[1]}" r="${s.a*m.k}" ${a}/>`}
    if(s.pts)return `<polygon points="${s.pts.map(q=>m.T(q).join(',')).join(' ')}" ${a}/>`;
    return `<path d="${arc(m,[s.x,s.y],s.a,s.t==='sc'?s.r-90:s.r,s.t==='sc'?180:Math.min(s.b,360),'sector')}" ${a}/>`};
  const holes=S.filter(s=>s.k==='hole'),hs=S.filter(s=>s.k==='hatch'),mk=holes.length?' mask="url(#mh)"':'';
  let g=`<defs><pattern id="hp" patternUnits="userSpaceOnUse" width="${p.hsp}" height="${p.hsp}" patternTransform="rotate(${p.hang})"><line x1="0" y1="0" x2="0" y2="${p.hsp}" stroke="${p.hcol}" stroke-width="${p.hw}"/></pattern>`+
   (holes.length?`<mask id="mh" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>${holes.map(s=>el(s,'fill="#000"')).join('')}</mask>`:'')+
   (p.hmode==='inter'?hs.map((s,i)=>`<clipPath id="hc${i}">${el(s,'')}</clipPath>`).join(''):'')+`</defs>`;
  if(p.showGrid){const x0=Math.floor(bb[0])-1,x1=Math.ceil(bb[2])+1,y0=Math.floor(bb[1])-1,y1=Math.ceil(bb[3])+1;for(let x=x0;x<=x1;x++)g+=ln(m,[x,y0],[x,y1],'#cbd5e1',1);for(let y=y0;y<=y1;y++)g+=ln(m,[x0,y],[x1,y],'#cbd5e1',1)}
  g+=`<g${mk}>`+S.filter(s=>s.k==='fill').map(s=>el(s,`fill="${s.c}" fill-opacity="${p.op/100}"`)).join('');
  if(p.hmode==='inter'&&hs.length>1)g+=hs.reduce((acc,s,i)=>`<g clip-path="url(#hc${i})">${acc}</g>`,`<rect width="${W}" height="${H}" fill="url(#hp)"/>`);
  else g+=hs.map(s=>el(s,`fill="${p.hcol}" fill-opacity=".08"`)+el(s,'fill="url(#hp)"')).join('');
  g+='</g>'+S.map(s=>el(s,`fill="none" stroke="${p.stroke}" stroke-width="${p.strokeW}" stroke-linejoin="round"`)).join('');
  if(p.showDims)S.forEach(s=>{const c0=m.T([s.x,s.y]);
   if(!s.pts){const a0=s.t==='ci'?0:s.t==='sc'?s.r:s.r+Math.min(s.b,360)/2,B=[s.x+s.a*Math.cos(a0*D),s.y+s.a*Math.sin(a0*D)],q=m.T(B);g+=ln(m,[s.x,s.y],B,'#dc2626',2,'5 4')+Draw.t((c0[0]+q[0])/2,(c0[1]+q[1])/2-fs*.5,`r = ${f(s.a)}`,p,{c:'#dc2626',w:700,fs:fs*.8})}
   else(edges[s.t]||[0]).forEach(i=>{const A=s.pts[i],B=s.pts[(i+1)%s.pts.length],a=m.T(A),b=m.T(B),mm=[(a[0]+b[0])/2,(a[1]+b[1])/2],d=[mm[0]-c0[0],mm[1]-c0[1]],l=Math.hypot(...d)||1;g+=Draw.t(mm[0]+d[0]/l*fs*.9,mm[1]+d[1]/l*fs*.9,`${f(Math.hypot(B[0]-A[0],B[1]-A[1]))} ${u}`,p,{c:'#dc2626',w:700,fs:fs*.8,b:'central'})})});
  L.forEach((t,i)=>g+=Draw.t(W/2,m.tH+m.av+fs*1.1+i*fs*1.25,t,p,{fs:fs*.85}));
  return Draw.title(p,W)+g}});
})();
