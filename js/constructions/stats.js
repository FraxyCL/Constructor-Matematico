// Datos y estadística: barras, circular, pictograma, tabla de frecuencias, histograma, diagrama de puntos y dispersión
(()=>{
const {P,C,K,T,A,S}=Registry.h,ts=()=>Registry.h.ts(24),f=x=>Draw.fmt(x+0),{pol,D}=Draw.v,{view,arc}=Draw.g;
const PAL=['#3b82f6','#ef4444','#22c55e','#f59e0b','#8b5cf6','#06b6d4','#ec4899','#84cc16','#f97316','#64748b'];
const rows=s=>String(s).split('\n').map(l=>l.trim()).filter(Boolean),num=x=>parseFloat(String(x).replace(',','.')),
 catData=s=>rows(s).map(l=>{const i=l.search(/[;:]/);return i<0?[l,NaN]:[l.slice(0,i).trim(),num(l.slice(i+1))]}).filter(d=>!isNaN(d[1])&&d[0]),
 nums=s=>(String(s).match(/-?\d+(?:[.,]\d+)?/g)||[]).map(num);
const nice=(mx,n=5)=>{const raw=(mx||1)/n,mg=Math.pow(10,Math.floor(Math.log10(raw))),r=raw/mg,st=(r<=1?1:r<=2?2:r<=5?5:10)*mg;return{st,top:(Math.ceil(mx/st-1e-9)*st)||st}};
const tk=(a,b,st)=>{const o=[];for(let v=Math.ceil(a/st-1e-9)*st;v<=b+1e-9&&o.length<60;v+=st){const w=+v.toFixed(10);o.push({v:w,t:f(w)})}return o};
const empty=(p,W,H)=>Draw.t(W/2,H/2,'Escribe los datos en el panel',p,{c:'#94a3b8'});
const meas=a=>{const s=[...a].sort((x,y)=>x-y),n=s.length,mean=s.reduce((x,y)=>x+y,0)/n,med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2,c=new Map();s.forEach(v=>c.set(v,(c.get(v)||0)+1));const mc=Math.max(...c.values());
 return{mean,med,modes:mc>1?[...c].filter(q=>q[1]===mc).map(q=>q[0]):[],range:s[n-1]-s[0]}};
const statBox=(p,x,y,a)=>{const m=meas(a),fs=p.fontSize;return [`Media = ${f(m.mean)}`,`Mediana = ${f(m.med)}`,`Moda = ${m.modes.length?m.modes.map(f).join('; '):'no hay'}`,`Rango = ${f(m.range)}`].map((t,i)=>Draw.t(x,y+i*fs*1.15,t,p,{a:'end',fs:fs*.8})).join('')};
// Ejes con escala numérica: xr/yr = rangos; xt/yt = marcas [{v,t}]
function plot(p,W,H,xr,yr,xt,yt,o={}){const fs=p.fontSize,tH=Draw.titleH(p),x0=(o.padL||fs*2.6)+(p.ytitle?fs*1.4:0),y0=H-(fs*2+(p.xtitle?fs*1.4:0)),w=W-x0-fs*1.5,h=y0-tH-fs*1.2,
 X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0-(v-yr[0])/(yr[1]-yr[0])*h,gl='stroke="#cbd5e1" stroke-width="1"',ax=`stroke="${p.textColor}" stroke-width="2"`;let g='';
 if(p.grid){if(o.gridX)xt.forEach(q=>g+=`<line x1="${X(q.v)}" x2="${X(q.v)}" y1="${y0}" y2="${y0-h}" ${gl}/>`);if(o.gridY!==false&&!o.noY)yt.forEach(q=>g+=`<line x1="${x0}" x2="${x0+w}" y1="${Y(q.v)}" y2="${Y(q.v)}" ${gl}/>`)}
 g+=`<line x1="${x0}" y1="${y0}" x2="${x0+w}" y2="${y0}" ${ax}/>`+(o.noY?'':`<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0-h}" ${ax}/>`);
 xt.forEach(q=>g+=Draw.t(X(q.v),y0+fs*1.1,q.t,p,{fs:fs*.8})+`<line x1="${X(q.v)}" x2="${X(q.v)}" y1="${y0}" y2="${y0+5}" ${ax}/>`);
 if(!o.noY)yt.forEach(q=>g+=Draw.t(x0-fs*.4,Y(q.v),q.t,p,{fs:fs*.8,a:'end',b:'central'})+`<line x1="${x0-5}" x2="${x0}" y1="${Y(q.v)}" y2="${Y(q.v)}" ${ax}/>`);
 if(p.xtitle)g+=Draw.t(x0+w/2,H-fs*.3,p.xtitle,p,{w:700,fs:fs*.9});
 if(p.ytitle&&!o.noY)g+=`<g transform="rotate(-90 ${fs*.8} ${y0-h/2})">`+Draw.t(fs*.8,y0-h/2,p.ytitle,p,{w:700,fs:fs*.9})+'</g>';
 return{g,X,Y,x0,y0,w,h,tH}}
const ex=`"Fútbol; 12\nBásquetbol; 8\nTenis; 5\nNatación; 9"`;
const DATA=(key='data',label='Datos (una línea por categoría: nombre; valor)')=>A(key,label,"Fútbol; 12\nBásquetbol; 8\nTenis; 5\nNatación; 9",'Datos',6);

// ---------- Gráfico de barras ----------
Registry.register({id:'stat-bars',category:'data',name:'Gráfico de barras',icon:'📊',description:'Barras verticales u horizontales a partir de categorías y valores',
 parameters:[DATA(),K('hor','Barras horizontales',false,'Datos'),T('xtitle','Título del eje de categorías','Deporte','Ejes'),T('ytitle','Título del eje de valores','Estudiantes','Ejes'),K('grid','Cuadrícula',true,'Ejes'),K('showVals','Valor sobre cada barra',true,'Ejes'),
  P('gap','Separación entre barras (%)',30,0,80,'Estilo',{style:true}),K('varied','Un color distinto por barra',false,'Estilo'),C('col','Color de las barras','#3b82f6','Estilo'),...ts()],
 render(p,W,H){const d=catData(p.data);if(!d.length)return empty(p,W,H);const fs=p.fontSize,n=d.length,hor=p.hor,mx=nice(Math.max(...d.map(q=>q[1]),0)),b=p.gap/200,
  cats=d.map((q,i)=>({v:hor?n-i-.5:i+.5,t:q[0]})),vals=tk(0,mx.top,mx.st),
  pl=plot(p,W,H,hor?[0,mx.top]:[0,n],hor?[0,n]:[0,mx.top],hor?vals:cats,hor?cats:vals,{padL:hor?fs*Math.min(9,Math.max(...d.map(q=>q[0].length))*.55+.8):0,gridX:hor,gridY:!hor});
  let g=pl.g;d.forEach(([k,v],i)=>{v=Math.max(v,0);const col=p.varied?PAL[i%PAL.length]:p.col;
   if(hor){g+=`<rect x="${pl.X(0)}" y="${pl.Y(n-i-b)}" width="${pl.X(v)-pl.X(0)}" height="${pl.Y(n-i-1+b)-pl.Y(n-i-b)}" fill="${col}"/>`;if(p.showVals)g+=Draw.t(pl.X(v)+fs*.3,pl.Y(n-i-.5),f(v),p,{a:'start',b:'central',w:700,fs:fs*.85})}
   else{g+=`<rect x="${pl.X(i+b)}" y="${pl.Y(v)}" width="${pl.X(i+1-b)-pl.X(i+b)}" height="${pl.Y(0)-pl.Y(v)}" fill="${col}"/>`;if(p.showVals)g+=Draw.t(pl.X(i+.5),pl.Y(v)-fs*.4,f(v),p,{w:700,fs:fs*.85})}});
  return Draw.title(p,W)+g}});

// ---------- Gráfico circular ----------
Registry.register({id:'stat-pie',category:'data',name:'Gráfico circular',icon:'🥧',description:'Sectores proporcionales con nombre, valor y porcentaje',
 parameters:[DATA(),P('hole','Agujero central (donut, %)',0,0,80,'Datos'),P('start','Ángulo de inicio (°)',90,0,359,'Datos'),
  K('showName','Mostrar el nombre',true,'Etiquetas'),K('showVal','Mostrar el valor',false,'Etiquetas'),K('showPct','Mostrar el porcentaje',true,'Etiquetas'),S('place','Ubicación de las etiquetas','out','Etiquetas',[['out','Fuera del círculo'],['in','Dentro del sector']]),
  P('size','Tamaño del gráfico (%)',80,30,100,'Estilo',{style:true}),...ts()],
 render(p,W,H){const d=catData(p.data).filter(q=>q[1]>0),tot=d.reduce((a,q)=>a+q[1],0);if(!tot)return empty(p,W,H);const m=view(p,W,H,1.75),ri=p.hole/100,Q=(a,r)=>m.T(pol(a,r)),R=m.k;let g='',cum=0;
  d.forEach(([k,v],i)=>{const sp=360*v/tot,a1=p.start-cum-sp,md=a1+sp/2,col=PAL[i%PAL.length];cum+=sp;
   if(d.length===1)g+=`<path fill-rule="evenodd" fill="${col}" d="${arc(m,[0,0],1,0,360)} ${ri>0?arc(m,[0,0],ri,0,360):''}"/>`;
   else g+=`<path d="M${Q(a1,1)} A${R} ${R} 0 ${sp>180?1:0} 0 ${Q(a1+sp,1)} ${ri>0?`L${Q(a1+sp,ri)} A${R*ri} ${R*ri} 0 ${sp>180?1:0} 1 ${Q(a1,ri)}`:`L${m.T([0,0])}`}Z" fill="${col}" stroke="#fff" stroke-width="2"/>`;
   const vp=[p.showVal?f(v):'',p.showPct?f(100*v/tot)+' %':''].filter(Boolean).join(' · '),t=p.showName?k+(vp?': '+vp:''):vp;if(!t)return;
   if(p.place==='out'){const cx=Math.cos(md*D);g+=Draw.t(...Q(md,1.14),t,p,{a:cx>.15?'start':cx<-.15?'end':'middle',b:'central',fs:p.fontSize*.85})}
   else if(sp>10)g+=Draw.t(...Q(md,(1+ri)/2),t,p,{b:'central',c:'#fff',w:700,fs:p.fontSize*.75})});
  return Draw.title(p,W)+g}});

// ---------- Pictograma ----------
Registry.register({id:'stat-picto',category:'data',name:'Pictograma',icon:'🔣',description:'Filas de símbolos; cada símbolo representa una cantidad',
 parameters:[DATA(),P('per','Cada símbolo representa (unidades)',2,1,100,'Datos'),T('legend','Texto de la leyenda','estudiantes','Datos'),
  S('sym','Símbolo','ci','Estilo',[['ci','Círculo'],['sq','Cuadrado'],['st','Estrella'],['tr','Triángulo']]),K('partial','Mostrar fracciones de símbolo',true,'Estilo'),K('varied','Un color por fila',false,'Estilo'),C('col','Color de los símbolos','#f59e0b','Estilo'),K('showVals','Mostrar el valor al final',true,'Estilo'),...ts()],
 render(p,W,H){const d=catData(p.data);if(!d.length)return empty(p,W,H);const fs=p.fontSize,tH=Draw.titleH(p),n=d.length,lw=fs*Math.min(9,Math.max(...d.map(q=>q[0].length))*.58+1),x0=lw+fs*.8,right=W-fs*(p.showVals?3:1.5),bot=H-fs*3.4,
  rh=Math.min((bot-tH-fs)/n,fs*3.4),Mx=Math.max(...d.map(q=>Math.ceil(q[1]/p.per-1e-9)),1),s=Math.min(rh*.75,(right-x0)/(Mx*1.15)),y0=tH+fs*.8+((bot-tH-fs)-n*rh)/2;let g='',cid=0;
  const sym=(x,y,col,fr,sz=s)=>{const r=sz/2;let e;if(p.sym==='ci')e=`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;else if(p.sym==='sq')e=`<rect x="${x-r}" y="${y-r}" width="${sz}" height="${sz}" fill="${col}"/>`;
   else if(p.sym==='tr')e=`<polygon points="${x},${y-r} ${x+r},${y+r} ${x-r},${y+r}" fill="${col}"/>`;
   else e=`<polygon points="${[...Array(10)].map((_,i)=>{const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.42:r;return(x+q*Math.cos(a))+','+(y+q*Math.sin(a))}).join(' ')}" fill="${col}"/>`;
   if(fr>=.999)return e;const id='pc'+(cid++);return `<clipPath id="${id}"><rect x="${x-r}" y="${y-r}" width="${sz*fr}" height="${sz}"/></clipPath><g clip-path="url(#${id})">${e}</g>`};
  d.forEach(([k,v],i)=>{const y=y0+i*rh+rh/2,col=p.varied?PAL[i%PAL.length]:p.col,q=v/p.per,full=Math.floor(q+1e-9),fr=q-full,part=p.partial&&fr>.04;g+=Draw.t(lw,y,k,p,{a:'end',b:'central'});
   for(let j=0;j<full;j++)g+=sym(x0+s/2+j*s*1.15,y,col,1);if(part)g+=sym(x0+s/2+full*s*1.15,y,col,fr);
   if(p.showVals)g+=Draw.t(x0+(full+(part?1:0))*s*1.15+fs*.2,y,f(v),p,{a:'start',b:'central',w:700})});
  g+=sym(W/2-fs*3,H-fs*1.5,p.col,1,fs*1.1)+Draw.t(W/2-fs*2.2,H-fs*1.5,`= ${f(p.per)} ${p.legend}`,p,{a:'start',b:'central',fs:fs*.9});
  return Draw.title(p,W)+g}});

// ---------- Tabla de frecuencias ----------
Registry.register({id:'stat-table',category:'data',name:'Tabla de frecuencias',icon:'▦',description:'Frecuencia absoluta, relativa, porcentual y acumulada',
 parameters:[S('source','Tipo de datos','raw','Datos',[['raw','Lista de datos (se cuentan solos)'],['cat','Categoría; frecuencia']]),A('data','Datos (lista separada por espacios o ; — o «categoría; frecuencia» por línea)',"4 5 5 6 7 7 7 8 8 9 9 9 10",'Datos',5),T('h0','Título de la primera columna','Dato','Datos'),
  K('showFr','Frecuencia relativa (fr)',true,'Columnas'),K('fracFr','Escribir fr como fracción',false,'Columnas',p=>p.showFr),K('showPct','Porcentaje (%)',true,'Columnas'),K('showF','Frecuencia acumulada (F)',false,'Columnas'),K('showTot','Fila de totales',true,'Columnas'),
  K('zebra','Filas alternadas',true,'Estilo'),C('head','Color del encabezado','#dbeafe','Estilo'),C('border','Color de los bordes','#475569','Estilo'),P('size','Ancho de la tabla (%)',90,40,100,'Estilo',{style:true}),...ts(26)],
 render(p,W,H){let rs;if(p.source==='raw'){let tk=String(p.data).split(/[;\n]+/).map(x=>x.trim()).filter(Boolean);const fl=tk.flatMap(x=>x.split(/\s+/));if(fl.every(x=>!isNaN(num(x))))tk=fl;
   const allNum=tk.every(x=>!isNaN(num(x))),cnt=new Map();tk.forEach(x=>{const k=allNum?num(x):x;cnt.set(k,(cnt.get(k)||0)+1)});let ks=[...cnt.keys()];if(allNum)ks.sort((a,b)=>a-b);rs=ks.map(k=>[typeof k==='number'?f(k):k,cnt.get(k)])}else rs=catData(p.data);
  if(!rs.length)return empty(p,W,H);const N=rs.reduce((a,q)=>a+q[1],0)||1;let acc=0;const cum=rs.map(q=>(acc+=q[1]));
  const cols=[{h:p.h0,w:Math.max(5,...rs.map(q=>String(q[0]).length*.6+2)),v:i=>rs[i][0],t:'Total'},{h:'f',w:4,v:i=>f(rs[i][1]),t:f(N)}];
  if(p.showFr)cols.push({h:'fr',w:p.fracFr?5.5:5,v:i=>p.fracFr?`${f(rs[i][1])}/${f(N)}`:f(rs[i][1]/N),t:p.fracFr?`${f(N)}/${f(N)}`:'1'});
  if(p.showPct)cols.push({h:'%',w:5,v:i=>f(100*rs[i][1]/N)+' %',t:'100 %'});if(p.showF)cols.push({h:'F',w:4,v:i=>f(cum[i]),t:''});
  const nr=rs.length+1+(p.showTot?1:0),sw=cols.reduce((a,c)=>a+c.w,0),tH=Draw.titleH(p),r=Math.min(1,W*p.size/100/(sw*p.fontSize),(H-tH-p.fontSize*2)/(nr*p.fontSize*1.9)),fs=p.fontSize*r,q={...p,fontSize:fs},rh=fs*1.9,
   x0=(W-sw*fs)/2,y0=tH+(H-tH-nr*rh)/2;let g='';
  const cell=(x,y,w,t,fill,b)=>`<rect x="${x}" y="${y}" width="${w}" height="${rh}" fill="${fill}" stroke="${p.border}" stroke-width="1.5"/>`+Draw.t(x+w/2,y+rh/2,t,q,{b:'central',w:b?700:400});
  for(let ri=0;ri<nr;ri++){let x=x0;const y=y0+ri*rh,isH=ri===0,isT=p.showTot&&ri===nr-1;cols.forEach(c=>{const w=c.w*fs;g+=cell(x,y,w,isH?c.h:isT?c.t:c.v(ri-1),isH?p.head:isT?p.head:(p.zebra&&ri%2===0?'#f1f5f9':'#ffffff'),isH||isT);x+=w})}
  return Draw.title(p,W)+g}});

// ---------- Histograma ----------
Registry.register({id:'stat-hist',category:'data',name:'Histograma',icon:'▇',description:'Datos agrupados en intervalos, con polígono de frecuencias',
 parameters:[A('data','Datos (números separados por espacios, ; o líneas)',"12 15 18 21 22 25 27 30 31 34 35 38 41 44 47",'Datos',5),P('cw','Ancho de cada intervalo',10,1,50,'Intervalos'),P('cx0','Inicio del primer intervalo',10,-100,100,'Intervalos'),
  K('poly','Polígono de frecuencias',false,'Mostrar'),K('showVals','Frecuencia sobre cada barra',true,'Mostrar'),K('showStats','Media, mediana, moda y rango',false,'Mostrar'),T('xtitle','Título del eje horizontal','Edad','Ejes'),T('ytitle','Título del eje vertical','Frecuencia','Ejes'),K('grid','Cuadrícula',true,'Ejes'),C('col','Color de las barras','#60a5fa','Estilo'),...ts()],
 render(p,W,H){const a=nums(p.data);if(!a.length)return empty(p,W,H);const fs=p.fontSize,x0=p.cx0,mx=Math.max(...a);let cw=Math.max(.1,p.cw),n=Math.floor((mx-x0)/cw+1e-9)+1;if(n<1)n=1;if(n>40){cw=(mx-x0)/39.5;n=40}
  const c=Array(n).fill(0);a.forEach(v=>{if(v>=x0){const i=Math.floor((v-x0)/cw+1e-9);if(i<n)c[i]++}});const st=Math.max(1,nice(Math.max(...c)).st),top=Math.max(st,Math.ceil(Math.max(...c)/st)*st),
   xt=[...Array(n+1)].map((_,i)=>({v:x0+i*cw,t:f(x0+i*cw)})).filter((_,i)=>n<=16||i%2===0),pl=plot(p,W,H,[x0-(p.poly?cw/2:0),x0+n*cw+(p.poly?cw/2:0)],[0,top],xt,tk(0,top,st),{});
  let g=pl.g;c.forEach((v,i)=>{g+=`<rect x="${pl.X(x0+i*cw)}" y="${pl.Y(v)}" width="${pl.X(x0+(i+1)*cw)-pl.X(x0+i*cw)}" height="${pl.Y(0)-pl.Y(v)}" fill="${p.col}" stroke="${p.textColor}" stroke-width="1.5"/>`;if(p.showVals&&v)g+=Draw.t(pl.X(x0+(i+.5)*cw),pl.Y(v)-fs*.35,v,p,{w:700,fs:fs*.85})});
  if(p.poly){const pts=[[x0-cw/2,0],...c.map((v,i)=>[x0+(i+.5)*cw,v]),[x0+n*cw+cw/2,0]].map(q=>pl.X(q[0])+','+pl.Y(q[1]));g+=`<polyline points="${pts.join(' ')}" fill="none" stroke="#dc2626" stroke-width="3"/>`+pts.map(s=>{const[x,y]=s.split(',');return `<circle cx="${x}" cy="${y}" r="4" fill="#dc2626"/>`}).join('')}
  if(p.showStats)g+=statBox(p,pl.x0+pl.w-fs*.5,pl.tH+fs*1.6,a);
  return Draw.title(p,W)+g}});

// ---------- Diagrama de puntos ----------
Registry.register({id:'stat-dots',category:'data',name:'Diagrama de puntos',icon:'⁝',description:'Un punto por dato apilado sobre una recta numérica',
 parameters:[A('data','Datos (números separados por espacios, ; o líneas)',"3 4 4 5 5 5 6 6 7 9",'Datos',5),T('xtitle','Título del eje','Número de hermanos','Ejes'),K('showMean','Marcar la media (▲)',true,'Mostrar'),K('showStats','Media, mediana, moda y rango',false,'Mostrar'),C('col','Color de los puntos','#ef4444','Estilo'),...ts()],
 render(p,W,H){const a=nums(p.data);if(!a.length)return empty(p,W,H);const fs=p.fontSize,lo=Math.floor(Math.min(...a))-1,hi=Math.ceil(Math.max(...a))+1,stp=(hi-lo)>25?nice(hi-lo,10).st:1,cnt=new Map();a.forEach(v=>cnt.set(v,(cnt.get(v)||0)+1));
  const pl=plot(p,W,H,[lo,hi],[0,1],tk(lo,hi,stp),[],{noY:true,padT:2}),mxs=Math.max(...cnt.values()),rd=Math.min(pl.w/(hi-lo)*.42,(pl.h*.85)/(mxs*2.1),fs*.9);let g=pl.g;
  cnt.forEach((k,v)=>{for(let j=0;j<k;j++)g+=`<circle cx="${pl.X(v)}" cy="${pl.y0-rd*(2*j+1.2)}" r="${rd}" fill="${p.col}"/>`});
  const m=meas(a);if(p.showMean){const x=pl.X(m.mean);g+=`<polygon points="${x},${pl.y0+3} ${x-8},${pl.y0+17} ${x+8},${pl.y0+17}" fill="#1e40af"/>`}
  if(p.showStats)g+=statBox(p,pl.x0+pl.w-fs*.5,pl.tH+fs*1.6,a);
  return Draw.title(p,W)+g}});

// ---------- Diagrama de dispersión ----------
Registry.register({id:'stat-scatter',category:'data',name:'Diagrama de dispersión',icon:'⁘',description:'Pares (x, y) con recta de regresión opcional',
 parameters:[A('data','Puntos (un par «x; y» por línea)',"1; 2\n2; 3.5\n3; 3\n4; 5.5\n5; 6\n6; 7.5\n7; 8",'Datos',6),T('xtitle','Título del eje X','Horas de estudio','Ejes'),T('ytitle','Título del eje Y','Nota','Ejes'),K('grid','Cuadrícula',true,'Ejes'),
  K('reg','Recta de regresión (mínimos cuadrados)',true,'Mostrar'),K('showEq','Escribir ecuación y coeficiente r',true,'Mostrar',p=>p.reg),P('ptR','Tamaño de los puntos',6,2,14,'Estilo',{style:true}),C('col','Color de los puntos','#2563eb','Estilo'),...ts()],
 render(p,W,H){const d=rows(p.data).map(nums).filter(q=>q.length>=2).map(q=>[q[0],q[1]]);if(d.length<1)return empty(p,W,H);const fs=p.fontSize,rg=(arr)=>{const lo=Math.min(...arr),hi=Math.max(...arr),st=nice((hi-lo)||1,6).st;return[Math.floor(lo/st-1e-9)*st,Math.ceil(hi/st+1e-9)*st,st]};
  const[xa,xb,xs]=rg(d.map(q=>q[0])),[ya,yb,ys]=rg(d.map(q=>q[1])),pl=plot(p,W,H,[xa,xb],[ya,yb],tk(xa,xb,xs),tk(ya,yb,ys),{gridX:true});let g=pl.g;
  if(p.reg&&d.length>1){const n=d.length,mx=d.reduce((s,q)=>s+q[0],0)/n,my=d.reduce((s,q)=>s+q[1],0)/n,sxy=d.reduce((s,q)=>s+(q[0]-mx)*(q[1]-my),0),sxx=d.reduce((s,q)=>s+(q[0]-mx)**2,0),syy=d.reduce((s,q)=>s+(q[1]-my)**2,0);
   if(sxx>0){const b=sxy/sxx,a0=my-b*mx,r=syy>0?sxy/Math.sqrt(sxx*syy):0;g+=`<clipPath id="sc"><rect x="${pl.x0}" y="${pl.y0-pl.h}" width="${pl.w}" height="${pl.h}"/></clipPath><line clip-path="url(#sc)" x1="${pl.X(xa)}" y1="${pl.Y(a0+b*xa)}" x2="${pl.X(xb)}" y2="${pl.Y(a0+b*xb)}" stroke="#dc2626" stroke-width="3"/>`;
    if(p.showEq)g+=Draw.t(pl.x0+fs*.6,pl.tH+fs*1.6,`y = ${f(b)}·x ${a0<0?'−':'+'} ${f(Math.abs(a0))}`,p,{a:'start',c:'#dc2626',w:700,fs:fs*.85})+Draw.t(pl.x0+fs*.6,pl.tH+fs*2.9,`r = ${f(r)}`,p,{a:'start',c:'#dc2626',fs:fs*.85})}}
  d.forEach(q=>g+=`<circle cx="${pl.X(q[0])}" cy="${pl.Y(q[1])}" r="${p.ptR}" fill="${p.col}" stroke="#fff" stroke-width="1.5"/>`);
  return Draw.title(p,W)+g}});
})();
