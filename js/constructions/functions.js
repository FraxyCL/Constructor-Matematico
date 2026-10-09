// Funciones: plano cartesiano, función lineal/afín (y sistemas), parábola y vectores
(()=>{
const {P,C,K}=Registry.h;
const ts=()=>Registry.h.ts(20);
const f=x=>Draw.fmt(x+0),PT=/([A-Za-z]\w*)?\s*\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)/g,NUM=/(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)/g;
const planeParams=()=>[P('xmin','X mínimo',-10,-50,p=>p.xmax-1,'Plano'),P('xmax','X máximo',10,p=>p.xmin+1,50,'Plano'),P('ymin','Y mínimo',-10,-50,p=>p.ymax-1,'Plano'),P('ymax','Y máximo',10,p=>p.ymin+1,50,'Plano'),
 P('step','Separación de marcas',1,.5,10,'Plano',{step:.5}),K('equal','Escala 1:1 (mismas unidades en X e Y)',true,'Plano'),K('axes','Mostrar ejes',true,'Plano'),K('grid','Mostrar cuadrícula',true,'Plano'),K('nums','Mostrar numeración',true,'Plano'),
 {key:'xl',label:'Nombre del eje X',type:'text',def:'x',group:'Plano'},{key:'yl',label:'Nombre del eje Y',type:'text',def:'y',group:'Plano'},C('gridC','Color de cuadrícula','#d1d5db','Plano'),C('axisC','Color de ejes','#111827','Plano')];
// Plano base: body(c) recibe {X,Y,L,R,T,B,clip} y devuelve el contenido; los ejes se dibujan debajo de él
function plane(p,W,H,body){const fs=p.fontSize,tH=Draw.titleH(p),m=fs*1.8,aw=W-2*m,ah=H-tH-2*m;let ux=aw/(p.xmax-p.xmin),uy=ah/(p.ymax-p.ymin);if(p.equal)ux=uy=Math.min(ux,uy);
 const X=x=>W/2+(x-(p.xmin+p.xmax)/2)*ux,Y=y=>tH+m+ah/2-(y-(p.ymin+p.ymax)/2)*uy,L=X(p.xmin),R=X(p.xmax),T=Y(p.ymax),B=Y(p.ymin),ax=Math.min(Math.max(X(0),L),R),ay=Math.min(Math.max(Y(0),T),B),
  tk=(a,b)=>{const o=[];for(let v=Math.ceil(a/p.step-1e-9);v*p.step<=b+1e-9&&o.length<200;v++)o.push(+(v*p.step).toFixed(6));return o},gl=`stroke="${p.gridC}" stroke-width="1"`;
 let g=`<clipPath id="cp"><rect x="${L}" y="${T}" width="${R-L}" height="${B-T}"/></clipPath>`;
 if(p.grid){tk(p.xmin,p.xmax).forEach(v=>g+=`<line x1="${X(v)}" x2="${X(v)}" y1="${T}" y2="${B}" ${gl}/>`);tk(p.ymin,p.ymax).forEach(v=>g+=`<line x1="${L}" x2="${R}" y1="${Y(v)}" y2="${Y(v)}" ${gl}/>`)}
 g+=`<rect x="${L}" y="${T}" width="${R-L}" height="${B-T}" fill="none" ${gl}/>`;
 if(p.axes)g+=Draw.arrow(L,ay,R+fs*.6,ay,p.axisC,2)+Draw.arrow(ax,B,ax,T-fs*.6,p.axisC,2)+Draw.t(R+fs*1.1,ay+fs*.35,p.xl,p,{w:700})+Draw.t(ax,T-fs*.9,p.yl,p,{w:700});
 g+=body({X,Y,L,R,T,B,clip:s=>`<g clip-path="url(#cp)">${s}</g>`});
 if(p.nums){const a=`stroke="${p.axisC}" stroke-width="1.5"`;
  tk(p.xmin,p.xmax).forEach(v=>{if(v)g+=`<line x1="${X(v)}" x2="${X(v)}" y1="${ay-4}" y2="${ay+4}" ${a}/>`+Draw.t(X(v),ay+fs*1.05,f(v),p,{fs:fs*.8})});
  tk(p.ymin,p.ymax).forEach(v=>{if(v)g+=`<line x1="${ax-4}" x2="${ax+4}" y1="${Y(v)}" y2="${Y(v)}" ${a}/>`+Draw.t(ax-fs*.45,Y(v),f(v),p,{fs:fs*.8,a:'end',b:'central'})});
  g+=Draw.t(ax-fs*.45,ay+fs*1.05,'0',p,{fs:fs*.8,a:'end'})}
 return Draw.title(p,W)+g}
const pt=(c,p,x,y,lab,col)=>x<p.xmin||x>p.xmax||y<p.ymin||y>p.ymax?'':`<circle cx="${c.X(x)}" cy="${c.Y(y)}" r="${p.ptR}" fill="${col}" stroke="#fff" stroke-width="1.5"/>`+(lab?Draw.t(c.X(x)+p.ptR+p.fontSize*.2,c.Y(y)-p.ptR-p.fontSize*.2,lab,p,{a:'start',fs:p.fontSize*.85}):'');
const poly=(c,p,pts,col)=>c.clip(`<polyline points="${pts.map(q=>c.X(q[0])+','+c.Y(q[1])).join(' ')}" fill="none" stroke="${col}" stroke-width="${p.lw}" stroke-linejoin="round"/>`);
const style=()=>[C('col','Color principal','#2563eb','Estilo'),P('lw','Grosor de línea',3,1,10,'Estilo',{style:true}),P('ptR','Tamaño de puntos',5,2,12,'Estilo',{style:true})];
const terms=(a,b,c,lead)=>{let s=lead+' = ';[[a,'x²'],[b,'x'],[c,'']].forEach(([v,u])=>{if(!v)return;const first=s===lead+' = ',m=Math.abs(v);s+=(first?(v<0?'-':''):(v<0?' - ':' + '))+((m===1&&u)?'':Draw.fmt(m))+u});return s.endsWith('= ')?s+'0':s};

Registry.register({id:'cartesian',category:'functions',name:'Plano cartesiano',icon:'✛',description:'Plano con ejes, cuadrícula, puntos y coordenadas',
 parameters:[{key:'pts',label:'Puntos, ej.: A(2,3); B(-3,1)',type:'text',def:'A(2,3); B(-3,1); C(-2,-4)',group:'Puntos'},K('coord','Mostrar coordenadas',true,'Puntos'),
  {key:'join',label:'Unir puntos',type:'select',def:'no',group:'Puntos',options:[['no','No unir'],['open','Línea quebrada'],['close','Polígono cerrado']]},...style(),...planeParams(),...ts()],
 render(p,W,H){return plane(p,W,H,c=>{const q=[...p.pts.matchAll(PT)].map(m=>({n:m[1]||'',x:+m[2],y:+m[3]}));let g='';
  if(p.join!=='no'&&q.length>1){const a=q.map(z=>[z.x,z.y]);if(p.join==='close')a.push(a[0]);g+=poly(c,p,a,p.col)}
  q.forEach(z=>g+=pt(c,p,z.x,z.y,z.n+(p.coord?`(${f(z.x)}, ${f(z.y)})`:''),p.col));return g})}});

Registry.register({id:'fn-linear',category:'functions',name:'Función lineal y afín',icon:'📈',description:'y = mx + n, con intersecciones, pendiente y sistema de dos rectas',
 parameters:[P('m','Pendiente m',2,-10,10,'Función',{step:.5}),P('n','Coeficiente de posición n',1,-10,10,'Función',{step:.5}),
  {key:'fn',label:'Notación',type:'select',def:'y',group:'Función',options:[['y','y ='],['f(x)','f(x) =']]},
  K('showEq','Mostrar ecuación',true,'Función'),K('showInt','Puntos de intersección con los ejes',true,'Función'),K('showSlope','Triángulo de pendiente',false,'Función'),
  K('two','Agregar segunda recta (sistema)',false,'Segunda recta'),P('m2','Pendiente m₂',-1,-10,10,'Segunda recta',{step:.5,show:p=>p.two}),P('n2','Coeficiente n₂',3,-10,10,'Segunda recta',{step:.5,show:p=>p.two}),
  K('showX','Punto de intersección de las rectas',true,'Segunda recta',p=>p.two),C('col2','Color de la segunda recta','#dc2626','Estilo'),...style(),...planeParams(),...ts()],
 render(p,W,H){const fs=p.fontSize;return plane(p,W,H,c=>{let g='';const ls=[[p.m,p.n,p.col]];if(p.two)ls.push([p.m2,p.n2,p.col2]);
  ls.forEach(([m,n,col],i)=>{g+=poly(c,p,[[p.xmin,m*p.xmin+n],[p.xmax,m*p.xmax+n]],col);
   if(p.showEq)g+=Draw.t(c.L+fs*.5,c.T+fs*1.4*(i+1),terms(0,m,n,p.fn),p,{a:'start',c:col,w:700});
   if(p.showInt){g+=pt(c,p,0,n,`(0, ${f(n)})`,col);if(m)g+=pt(c,p,-n/m,0,`(${f(-n/m)}, 0)`,col)}
   if(p.showSlope&&i===0)g+=c.clip(`<polyline points="${c.X(0)},${c.Y(n)} ${c.X(1)},${c.Y(n)} ${c.X(1)},${c.Y(n+m)}" fill="none" stroke="${col}" stroke-width="${Math.max(1.5,p.lw*.6)}" stroke-dasharray="6 4"/>`)+Draw.t(c.X(.5),c.Y(n)+fs,'1',p,{fs:fs*.8,c:col})+Draw.t(c.X(1)+fs*.5,c.Y(n+m/2),f(m),p,{fs:fs*.8,c:col,a:'start',b:'central'})});
  if(p.two&&p.showX&&p.m!==p.m2){const x=(p.n2-p.n)/(p.m-p.m2),y=p.m*x+p.n;g+=pt(c,p,x,y,`(${f(x)}, ${f(y)})`,'#111827')}
  return g})}});

Registry.register({id:'fn-parabola',category:'functions',name:'Parábola',icon:'∪',description:'y = ax² + bx + c con vértice, eje de simetría y raíces',
 parameters:[P('a','Coeficiente a',1,-5,5,'Función',{step:.25}),P('b','Coeficiente b',0,-10,10,'Función',{step:.5}),P('c','Coeficiente c',-4,-10,10,'Función',{step:.5}),
  K('showEq','Mostrar ecuación',true,'Función'),K('showV','Mostrar vértice',true,'Función'),K('showAxis','Eje de simetría',true,'Función'),K('showRoots','Raíces (cortes con el eje X)',true,'Función'),K('showY','Corte con el eje Y',false,'Función'),
  ...style(),...planeParams(),...ts()],
 render(p,W,H){const fs=p.fontSize,{a,b,c:cc}=p;return plane(p,W,H,c=>{let s=[];for(let i=0;i<=400;i++){const x=p.xmin+(p.xmax-p.xmin)*i/400;s.push([x,a*x*x+b*x+cc])}
  let g=poly(c,p,s,p.col);if(p.showEq)g+=Draw.t(c.L+fs*.5,c.T+fs*1.4,terms(a,b,cc,'y'),p,{a:'start',c:p.col,w:700});
  if(a){const h=-b/(2*a),k=cc-b*b/(4*a),d=b*b-4*a*cc;
   if(p.showAxis)g+=c.clip(`<line x1="${c.X(h)}" x2="${c.X(h)}" y1="${c.T}" y2="${c.B}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="7 5"/>`);
   if(p.showV)g+=pt(c,p,h,k,`V(${f(h)}, ${f(k)})`,'#dc2626');
   if(p.showRoots&&d>=0)[...new Set([(-b-Math.sqrt(d))/(2*a),(-b+Math.sqrt(d))/(2*a)].map(x=>+x.toFixed(9)))].forEach(x=>g+=pt(c,p,x,0,`(${f(x)}, 0)`,'#16a34a'))}
  if(p.showY)g+=pt(c,p,0,cc,`(0, ${f(cc)})`,'#ea580c');return g})}});

Registry.register({id:'vectors',category:'functions',name:'Vectores',icon:'➚',description:'Vectores en el plano, suma y componentes',
 parameters:[{key:'vecs',label:'Vectores, ej.: 3,2; -2,4 (máx. 6)',type:'text',def:'3,2; -2,4',group:'Vectores'},K('chain','Encadenar (punta a cola)',false,'Vectores'),K('sum','Mostrar vector suma',false,'Vectores'),
  K('names','Mostrar nombres (u, v, w…)',true,'Vectores'),K('comp','Mostrar componentes',true,'Vectores'),C('colR','Color del vector suma','#dc2626','Estilo'),...style().slice(1,2),...planeParams(),...ts()],
 render(p,W,H){const fs=p.fontSize,V=[...p.vecs.matchAll(NUM)].map(m=>[+m[1],+m[2]]).slice(0,6),PAL=['#2563eb','#16a34a','#9333ea','#ea580c','#0891b2','#be185d'],N='uvwabc';
  return plane(p,W,H,c=>{let g='',cx=0,cy=0;const lab=(x1,y1,x2,y2,t,col)=>{const dx=x2-x1,dy=y2-y1,l=Math.hypot(dx,dy)||1;return t?Draw.t((x1+x2)/2-dy/l*fs*.9,(y1+y2)/2+dx/l*fs*.9,t,p,{c:col,w:700,b:'central',fs:fs*.9}):''};
   V.forEach(([x,y],i)=>{const a=p.chain?[cx,cy]:[0,0],b=[a[0]+x,a[1]+y],x1=c.X(a[0]),y1=c.Y(a[1]),x2=c.X(b[0]),y2=c.Y(b[1]);
    g+=Draw.arrow(x1,y1,x2,y2,PAL[i],p.lw)+lab(x1,y1,x2,y2,(p.names?N[i]:'')+(p.comp?(p.names?' = ':'')+`(${f(x)}, ${f(y)})`:''),PAL[i]);cx+=x;cy+=y});
   if(p.sum&&V.length>1){const x2=c.X(cx),y2=c.Y(cy);g+=Draw.arrow(c.X(0),c.Y(0),x2,y2,p.colR,p.lw,'9 6')+lab(c.X(0),c.Y(0),x2,y2,(p.names?'R':'')+(p.comp?(p.names?' = ':'')+`(${f(cx)}, ${f(cy)})`:''),p.colR)}
   return g})}});
Registry.planeParams=planeParams;Draw.plane=plane;
})();
