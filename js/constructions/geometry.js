// Geometría: triángulos, cuadriláteros y polígonos regulares. Figuras estáticas (no arrastrables).
(()=>{
const L='ABCDEFGHIJKLMNOPQRST',{D,add,sub,mul,len,unit,mid,rot:rotp,foot}=Draw.v;
const {P,C,K}=Registry.h;
const on=(...t)=>p=>t.includes(p.type);
const common=(cnt,max)=>[C('fill','Color de relleno','#93c5fd','Apariencia'),P('op','Opacidad del relleno (%)',60,0,100,'Apariencia',{style:true}),
 C('stroke','Color del contorno','#1e3a8a','Apariencia'),P('strokeW','Grosor del contorno',3,1,12,'Apariencia',{style:true}),
 P('size','Tamaño de la figura (%)',75,30,100,'Apariencia',{style:true}),P('rot','Orientación (°)',0,0,359,'Apariencia'),
 K('showV','Mostrar vértices',true,'Mostrar'),K('showN','Nombres de vértices',true,'Mostrar'),K('showM','Medidas de los lados',false,'Mostrar'),K('showA','Ángulos interiores',false,'Mostrar'),
 {key:'unit',label:'Unidad de medida',type:'text',def:'cm',group:'Mostrar'},...Registry.vis(cnt,max),...Registry.textStyle()];
const diags=(V,c)=>{const o=[],n=V.length;for(let i=0;i<n;i++)for(let j=i+2;j<n;j++)if(!(i===0&&j===n-1))o.push({a:V[i],b:V[j],c,d:'6 5'});return o};

// Rotulado reutilizable (ángulos, medidas, vértices y nombres) respetando la visibilidad selectiva. S = vértices en pantalla; k = px por unidad.
Draw.marks=(S,p,k,col,ln,sx,rv)=>{const n=S.length,fs=p.fontSize,c=mul(S.reduce(add,[0,0]),1/n),cw=S.reduce((a,q,i)=>a+q[0]*S[(i+1)%n][1]-S[(i+1)%n][0]*q[1],0)>0,sw=Math.max(1.5,ln*.6);let g='';
 if(p.showA)S.forEach((Pt,i)=>{if(p['angV'+i]===false)return;const Q=S[(i+n-1)%n],R=S[(i+1)%n],u1=unit(sub(cw?Q:R,Pt)),u2=unit(sub(cw?R:Q,Pt)),ang=Math.acos(Math.max(-1,Math.min(1,u1[0]*u2[0]+u1[1]*u2[1])))/D,r=Math.min(len(sub(R,Pt)),len(sub(Q,Pt)))*.22,a=add(Pt,mul(u1,r)),b=add(Pt,mul(u2,r)),st=`fill="none" stroke="${col}" stroke-width="${sw}"`;
  g+=Math.abs(ang-90)<.01?`<polyline points="${a} ${add(a,mul(u2,r))} ${b}" ${st}/>`:`<path d="M${a} A${r} ${r} 0 0 0 ${b}" ${st}/>`;
  const l=add(Pt,mul(unit(add(u1,u2)),r*1.9));g+=Draw.t(l[0],l[1],Draw.fmt(ang)+'°',p,{fs:fs*.6,b:'central'})});
 if(p.showM)S.forEach((Pt,i)=>{if(p['sideV'+i]===false)return;const R=S[(i+1)%n],m=mid(Pt,R),l=add(m,mul(unit(sub(m,c)),fs*.8));g+=Draw.t(l[0],l[1],Draw.fmt(len(sub(R,Pt))/k)+' '+p.unit,p,{fs:fs*.7,b:'central'})});
 if(p.showV)S.forEach(q=>g+=`<circle cx="${q[0]}" cy="${q[1]}" r="${rv||ln*1.5+2}" fill="${col}"/>`);
 if(p.showN)S.forEach((q,i)=>{const l=add(q,mul(unit(sub(q,c)),fs*.95));g+=Draw.t(l[0],l[1],L[i]+sx,p,{b:'central',w:700})});
 return g};
// Motor común: V = vértices en antihorario (unidades, y hacia arriba); aux = segmentos auxiliares [{a,b,c,d}]
function build(p,W,H,V,aux=[]){
 const th=p.rot*D,pts=V.map(v=>rotp(v,th)),mk=aux.filter(s=>s.pt),ax=aux.filter(s=>!s.pt).map(s=>({...s,a:rotp(s.a,th),b:rotp(s.b,th),ea:s.ea&&rotp(s.ea,th),eb:s.eb&&rotp(s.eb,th)})),
  all=pts.concat(ax.flatMap(s=>[s.a,s.b])),xs=all.map(q=>q[0]),ys=all.map(q=>q[1]),
  x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),tH=Draw.titleH(p),av=H-tH,fs=p.fontSize,pad=p.showN||p.showM?fs*2.2:fs*.6,
  k=Math.max(.01,Math.min((W*p.size/100-pad)/((x1-x0)||1),(av*p.size/100-pad)/((y1-y0)||1))),
  M=q=>[W/2+(q[0]-(x0+x1)/2)*k,tH+av/2-(q[1]-(y0+y1)/2)*k],S=pts.map(M),n=S.length,c=mul(S.reduce(add,[0,0]),1/n),ln=p.strokeW;
 let g=`<clipPath id="cpg"><rect width="${W}" height="${H}"/></clipPath><polygon points="${S.map(q=>q.join(',')).join(' ')}" fill="${p.fill}" fill-opacity="${p.op/100}" stroke="${p.stroke}" stroke-width="${ln}" stroke-linejoin="round"/>`;
 const sl=(a,b,s,x='')=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${s.c}" stroke-width="${Math.max(1.5,ln*.6)}" stroke-dasharray="${s.d||'8 6'}" ${x}/>`,X2='stroke-opacity=".55" clip-path="url(#cpg)"';
 ax.forEach(s=>{const a=M(s.a),b=M(s.b);g+=sl(a,b,s);if(s.ea)g+=sl(M(s.ea),a,s,X2)+sl(b,M(s.eb),s,X2)});
 g+=Draw.marks(S,p,k,p.stroke,ln,'');
 mk.forEach(s=>{const q=M(rotp(s.pt,th));g+=`<circle cx="${q[0]}" cy="${q[1]}" r="${ln*1.3+3}" fill="${s.c}" stroke="#fff" stroke-width="1.5"/>`+Draw.t(q[0]+fs*.6,q[1]-fs*.6,s.lab,p,{a:'start',c:s.c,w:700})});
 return Draw.title(p,W)+g}

// ---------- Triángulos ----------
const PRE={eq:{se:6},iso:{sb:6,sl:5},esc:{s1:4,s2:5,s3:6},rect:{c1:3,c2:4},acu:{sb:6,angA:70,angB:60},obt:{sb:6,angA:110,angB:30}};
function triAux(p,V){const o=[],S={alt:[],med:[],bis:[],mtz:[]},mx=Math.max(...[0,1,2].map(i=>len(sub(V[(i+1)%3],V[i])))),
 sg=(k,a,b,c,x)=>{const s=Registry.seg(a,b,c,undefined,x);S[k].push(s);o.push(s)};
 for(let i=0;i<3;i++){const A=V[i],B=V[(i+1)%3],Cc=V[(i+2)%3];
  if(p.alt){const f=foot(A,B,Cc),d=sub(Cc,B),t=((A[0]-B[0])*d[0]+(A[1]-B[1])*d[1])/(d[0]*d[0]+d[1]*d[1]);sg('alt',A,f,'#dc2626',p.xAlt);if(t<0)o.push(Registry.seg(B,f,'#94a3b8','3 4'));if(t>1)o.push(Registry.seg(Cc,f,'#94a3b8','3 4'))}
  if(p.med)sg('med',A,mid(B,Cc),'#16a34a',p.xMed);
  if(p.bis){const u=len(sub(Cc,A)),v=len(sub(B,A));sg('bis',A,mul(add(mul(B,u),mul(Cc,v)),1/(u+v)),'#9333ea',p.xBis)}
  if(p.mtz){const m=mid(B,Cc),d=sub(Cc,B),n=mul(unit([-d[1],d[0]]),mx*.35);sg('mtz',sub(m,n),add(m,n),'#ea580c',p.xMtz)}}
 // Centros notables: se marcan solo si las 3 rectas del tipo están activas y su dibujo (con prolongación) realmente llega al punto
 if(p.showCen){const[A,B,Cc]=V,a=len(sub(B,Cc)),b=len(sub(Cc,A)),c=len(sub(A,B)),q=z=>z[0]*z[0]+z[1]*z[1],d2=2*(A[0]*(B[1]-Cc[1])+B[0]*(Cc[1]-A[1])+Cc[0]*(A[1]-B[1])),
  O=[(q(A)*(B[1]-Cc[1])+q(B)*(Cc[1]-A[1])+q(Cc)*(A[1]-B[1]))/d2,(q(A)*(Cc[0]-B[0])+q(B)*(A[0]-Cc[0])+q(Cc)*(B[0]-A[0]))/d2],
  cen={alt:['H',sub(add(add(A,B),Cc),mul(O,2)),'#dc2626'],med:['G',mul(add(add(A,B),Cc),1/3),'#16a34a'],bis:['I',mul(add(add(mul(A,a),mul(B,b)),mul(Cc,c)),1/(a+b+c)),'#9333ea'],mtz:['O',O,'#ea580c']},
  hit=(z,s)=>{const u=s.ea||s.a,w=s.eb||s.b,e=sub(w,u),t=((z[0]-u[0])*e[0]+(z[1]-u[1])*e[1])/(e[0]*e[0]+e[1]*e[1]);return t>=-1e-6&&t<=1+1e-6};
  Object.keys(cen).forEach(k=>{if(p[k]&&S[k].length===3&&S[k].every(s=>hit(cen[k][1],s)))o.push({pt:cen[k][1],lab:cen[k][0],c:cen[k][2]})})}
 return o}

Registry.register({id:'triangle',category:'geometry',name:'Triángulos',icon:'△',description:'Triángulos por clasificación con rectas notables',
 parameters:[{key:'type',label:'Tipo de triángulo',type:'select',def:'eq',group:'Tipo',options:[['eq','Equilátero'],['iso','Isósceles'],['esc','Escaleno'],['rect','Rectángulo'],['acu','Acutángulo'],['obt','Obtusángulo']]},
  {key:'_t',type:'text',def:'eq',show:()=>false},
  P('se','Lado (cm)',6,1,20,'Medidas',{step:.5,show:on('eq')}),P('sb','Base AB (cm)',6,1,20,'Medidas',{step:.5,show:on('iso','acu','obt')}),P('sl','Lados iguales (cm)',5,1,20,'Medidas',{step:.5,show:on('iso')}),
  P('c1','Cateto AB (cm)',3,1,20,'Medidas',{step:.5,show:on('rect')}),P('c2','Cateto AC (cm)',4,1,20,'Medidas',{step:.5,show:on('rect')}),
  P('s1','Lado AB (cm)',4,1,20,'Medidas',{step:.5,show:on('esc')}),P('s2','Lado BC (cm)',5,1,20,'Medidas',{step:.5,show:on('esc')}),P('s3','Lado CA (cm)',6,1,20,'Medidas',{step:.5,show:on('esc')}),
  P('angA','Ángulo en A (°)',70,p=>p.type==='obt'?91:50,p=>p.type==='obt'?170:89,'Medidas',{show:on('acu','obt')}),
  P('angB','Ángulo en B (°)',60,p=>p.type==='obt'?5:50,p=>p.type==='obt'?Math.min(80,179-p.angA):89,'Medidas',{show:on('acu','obt')}),
  K('alt','Alturas',false,'Rectas notables'),Registry.extParam('xAlt','Prolongar alturas (%)',p=>p.alt),K('med','Medianas',false,'Rectas notables'),Registry.extParam('xMed','Prolongar medianas (%)',p=>p.med),K('bis','Bisectrices',false,'Rectas notables'),Registry.extParam('xBis','Prolongar bisectrices (%)',p=>p.bis),K('mtz','Mediatrices',false,'Rectas notables'),Registry.extParam('xMtz','Prolongar mediatrices (%)',p=>p.mtz),K('showCen','Marcar centros notables (H, G, I, O)',true,'Rectas notables',p=>p.alt||p.med||p.bis||p.mtz),...common(3)],
 normalize(p){if(p._t!==p.type){Object.assign(p,PRE[p.type]);p._t=p.type}
  if(p.type==='esc'){const f=(a,b,c)=>Math.min(a,+(b+c-.1).toFixed(1));p.s1=f(p.s1,p.s2,p.s3);p.s2=f(p.s2,p.s1,p.s3);p.s3=f(p.s3,p.s1,p.s2)}
  if(p.type==='iso')p.sl=Math.max(p.sl,+(p.sb/2+.1).toFixed(1));
  if(p.type==='acu'||p.type==='obt'){const o=p.type==='obt';p.angA=Math.min(o?170:89,Math.max(o?91:50,p.angA));p.angB=Math.min(o?Math.min(80,179-p.angA):89,Math.max(o?5:50,p.angB))}},
 render(p,W,H){let a,b,c,V;const t=p.type;
  if(t==='acu'||t==='obt'){const A=p.angA*D,B=p.angB*D;c=p.sb;b=c*Math.sin(B)/Math.sin(Math.PI-A-B);V=[[0,0],[c,0],[b*Math.cos(A),b*Math.sin(A)]]}
  else{if(t==='eq')a=b=c=p.se;else if(t==='iso'){c=p.sb;a=b=p.sl}else if(t==='rect'){c=p.c1;b=p.c2;a=Math.hypot(b,c)}else{c=p.s1;a=p.s2;b=p.s3}
   const x=(b*b+c*c-a*a)/(2*c);V=[[0,0],[c,0],[x,Math.sqrt(Math.max(0,b*b-x*x))]]}
  return build(p,W,H,V,triAux(p,V))}});

// ---------- Cuadriláteros ----------
const quad=p=>{const w=p.w,h=p.h,th=p.ang*D;
 switch(p.type){case 'sq':return[[0,0],[w,0],[w,w],[0,w]];case 'rc':return[[0,0],[w,0],[w,h],[0,h]];
  case 'rb':case 'rd':{const s=p.type==='rb'?w:h,d=[s*Math.cos(th),s*Math.sin(th)];return[[0,0],[w,0],add([w,0],d),d]}
  case 'tz':{const o=p.trap==='iso'?(w-p.top)/2:p.trap==='rect'?0:p.shift;return[[0,0],[w,0],[o+p.top,h],[o,h]]}
  default:return[[0,0],[p.d1/2,p.k/100*p.d2],[0,p.d2],[-p.d1/2,p.k/100*p.d2]]}};
Registry.register({id:'quadrilateral',category:'geometry',name:'Cuadriláteros',icon:'▱',description:'Cuadrado, rectángulo, rombo, romboide, trapecio y cometa',
 parameters:[{key:'type',label:'Tipo de cuadrilátero',type:'select',def:'rc',group:'Tipo',options:[['sq','Cuadrado'],['rc','Rectángulo'],['rb','Rombo'],['rd','Romboide / paralelogramo'],['tz','Trapecio'],['ck','Cometa (deltoide)']]},
  {key:'trap',label:'Clase de trapecio',type:'select',def:'iso',group:'Tipo',show:on('tz'),options:[['iso','Isósceles'],['rect','Rectángulo'],['esc','Escaleno']]},
  P('w','Base / lado (cm)',6,1,20,'Medidas',{step:.5,show:on('sq','rc','rb','rd','tz')}),P('h','Alto / segundo lado (cm)',4,1,20,'Medidas',{step:.5,show:on('rc','rd','tz')}),
  P('ang','Ángulo en A (°)',60,20,160,'Medidas',{show:on('rb','rd')}),P('top','Base menor (cm)',3,1,20,'Medidas',{step:.5,show:on('tz')}),
  P('shift','Desplazamiento (cm)',1,0,10,'Medidas',{step:.5,show:p=>p.type==='tz'&&p.trap==='esc'}),
  P('d1','Diagonal horizontal (cm)',5,1,20,'Medidas',{step:.5,show:on('ck')}),P('d2','Diagonal vertical (cm)',7,1,20,'Medidas',{step:.5,show:on('ck')}),P('k','Posición del cruce (%)',40,20,80,'Medidas',{show:on('ck')}),
  K('showD','Mostrar diagonales',false,'Mostrar'),...common(4)],
 render(p,W,H){const V=quad(p);return build(p,W,H,V,p.showD?diags(V,'#64748b'):[])}});

// ---------- Polígonos regulares ----------
Registry.register({id:'polygon',category:'geometry',name:'Polígonos regulares',icon:'⬠',description:'Polígonos regulares de 3 a 20 lados',
 parameters:[P('n','Número de lados',5,3,20,'Medidas'),P('len','Longitud del lado (cm)',4,1,20,'Medidas',{step:.5}),K('showD','Mostrar diagonales',false,'Mostrar'),...common(p=>p.n,20)],
 render(p,W,H){const n=p.n,R=p.len/(2*Math.sin(Math.PI/n)),V=[...Array(n)].map((_,i)=>{const a=-Math.PI/2-Math.PI/n+i*2*Math.PI/n;return[R*Math.cos(a),R*Math.sin(a)]});
  return build(p,W,H,V,p.showD?diags(V,'#64748b'):[])}});
})();
