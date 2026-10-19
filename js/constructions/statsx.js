// Estadística extra: tallo y hojas, gráfico de cajas, tabla de frecuencias con media, y media / mediana / moda con marcas
(()=>{
const {P,C,K,T,A,S}=Registry.h,ts=()=>Registry.h.ts(24),LM=Registry.h.LM,f=x=>Draw.fmt(x+0),fm=x=>x.toLocaleString('es-CL');
const PAL=['#3b82f6','#ef4444','#22c55e','#f59e0b','#8b5cf6','#06b6d4','#ec4899','#84cc16'];
const num=x=>parseFloat(String(x).replace(',','.')),nums=s=>(String(s).match(/-?\d+(?:[.,]\d+)?/g)||[]).map(num);
const med=s=>{const n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2};
const quart=(s,m)=>{const n=s.length;if(m==='linear'){const q=t=>{const h=(n-1)*t,i=Math.floor(h);return s[i]+(h-i)*((s[i+1]??s[i])-s[i])};return[q(.25),q(.75)]}
 const lo=m==='incl'?s.slice(0,Math.ceil(n/2)):s.slice(0,Math.floor(n/2)),hi=m==='incl'?s.slice(Math.floor(n/2)):s.slice(Math.ceil(n/2));return[med(lo.length?lo:s),med(hi.length?hi:s)]};
const modes=a=>{const c=new Map();a.forEach(v=>c.set(v,(c.get(v)||0)+1));const mc=Math.max(...c.values());return{modes:mc>1?[...c].filter(q=>q[1]===mc).map(q=>q[0]):[],mc,c}};
const niceT=(a,b)=>{if(a===b){a-=1;b+=1}const raw=(b-a)/7,mg=Math.pow(10,Math.floor(Math.log10(raw))),r=raw/mg,st=(r<=1?1:r<=2?2:r<=5?5:10)*mg,lo=Math.floor(a/st+1e-9)*st,hi=Math.ceil(b/st-1e-9)*st,l=[];for(let v=lo;v<=hi+st/2&&l.length<40;v+=st)l.push(+v.toFixed(10));return{lo,hi,l}};
const warn=(p,W,H,a,b)=>Draw.t(W/2,H/2-p.fontSize*.7,a,p,{c:'#64748b',fs:p.fontSize*.9})+(b?Draw.t(W/2,H/2+p.fontSize*.8,b,p,{c:'#64748b',fs:p.fontSize*.9}):'');
const lines=(p,W,H,L)=>{const fs=p.fontSize;return L.map((t,i)=>Draw.t(W/2,H-(L.length-i)*fs*1.3+fs*.2,t,p,{fs:Math.min(fs*.9,W*.94/(t.length*.5)),w:i===0?700:400})).join('')};
const belowH=(p,L)=>L.length?L.length*p.fontSize*1.3+p.fontSize*.5:0;
const none=(p,W,H)=>Draw.t(W/2,H/2,'Escribe los datos en el panel',p,{c:'#94a3b8'});

// ================= Tallo y hojas =================
Registry.register({id:'stat-stem',category:'data',name:'Tallo y hojas',icon:'🌿',description:'Diagrama de tallo y hojas, simple o espalda con espalda, con mediana y moda marcadas',
 parameters:[A('data','Datos (números separados por espacios, comas o líneas)','12 15 21 23 23 27 31 34 34 35 38 41 45 46 52 58','Datos',4),
  A('data2','Segundo conjunto (opcional: se dibuja a la izquierda)','','Datos',3),T('n1','Nombre del conjunto 1','','Datos'),T('n2','Nombre del conjunto 2','','Datos',p=>!!p.data2.trim()),
  S('leaf','Cada hoja vale','1','Diagrama',[['1','Unidades (tallo = decenas)'],['0.1','Décimas (tallo = unidades)'],['10','Decenas (tallo = centenas)']]),
  K('split','Dividir cada tallo en dos filas (0–4 y 5–9)',false,'Diagrama'),K('showCount','Frecuencia de cada tallo',false,'Diagrama'),K('showKey','Escribir la clave',true,'Diagrama'),K('showN','Escribir n',true,'Diagrama'),
  K('markMed','Marcar la mediana',true,'Marcas'),K('markMode','Marcar la moda',true,'Marcas'),K('showSum','Escribir mediana y moda',true,'Marcas'),
  C('c1','Color de las hojas','#1e293b','Estilo'),C('c2','Color del 2.º conjunto','#2563eb','Estilo'),C('colMed','Color de la mediana','#2563eb','Estilo'),C('colMode','Color de la moda','#dc2626','Estilo'),P('strokeW','Grosor de la barra',2,1,8,'Estilo',{style:true,step:.5}),...ts()],
 render(p,W,H){const fs=p.fontSize,T0=Draw.title(p,W),u=parseFloat(p.leaf),neg=[];
  const prep=s=>nums(s).filter(v=>{if(v<0){neg.push(v);return false}return true}).map(v=>Math.round(v/u+1e-9)).sort((a,b)=>a-b);
  const A1=prep(p.data),A2=p.data2.trim()?prep(p.data2):[],two=A2.length>0;
  if(!A1.length)return T0+none(p,W,H);
  const all=A1.concat(A2),key=v=>p.split?Math.floor(v/10)*2+((v%10)>=5?1:0):Math.floor(v/10),k0=key(Math.min(...all)),k1=key(Math.max(...all)),nr=k1-k0+1;
  if(nr>60)return T0+warn(p,W,H,'Los datos abarcan demasiados tallos.','Cambia «Cada hoja vale» o revisa los datos.');
  const mkRows=a=>{const r=[...Array(nr)].map(()=>[]);a.forEach(v=>r[key(v)-k0].push(v%10));return r},R1=mkRows(A1),R2=two?mkRows(A2):null;
  const stat=a=>{const m=a.length?med(a):NaN,md=a.length?modes(a):{modes:[]};return{m,md:md.modes}},S1=stat(A1),S2=two?stat(A2):null;
  const Ls=[];if(p.showSum){const d=(s,nm)=>`${nm?nm+': ':''}mediana = ${f(s.m*u)}  ·  moda = ${s.md.length?s.md.map(v=>f(v*u)).join('; '):'no hay'}`;Ls.push(d(S1,p.n1||(two?'Conjunto 1':'')));if(two)Ls.push(d(S2,p.n2||'Conjunto 2'))}
  if(p.showN)Ls.push(`n = ${A1.length}${two?` y ${A2.length}`:' datos'}`);
  if(p.showKey){const kk=u===1?'35':u===.1?'3,5':'350',ex=u===1?'3 | 5':u===.1?'3 | 5':'3 | 5';Ls.push(`Clave: ${ex} significa ${kk}${p.split?'  (las filas de abajo de cada tallo son hojas 5–9)':''}`)}
  if(neg.length)Ls.push('(Los valores negativos no se muestran en este diagrama)');
  const tH=Draw.titleH(p),top=tH+fs*.8,avail=H-tH-belowH(p,Ls)-fs*.4,hd=(p.n1||p.n2)?fs*1.4:0,rh0=Math.min(fs*1.7,(avail-hd)/nr);
  let f2=Math.min(fs,rh0*.62);const maxL=Math.max(...R1.map(r=>r.length),...(R2?R2.map(r=>r.length):[0]),1),ls=f2*1.3,sw=f2*(String(k1).length*.62+1.4),
   need=(two?2:1)*maxL*ls+sw+f2*3+(p.showCount?f2*(two?5:2.5):0);if(need>W*.95){f2*=W*.95/need}
  const ls2=f2*1.3,rh=Math.min(rh0,f2*1.7),y0=top+hd+(avail-hd-nr*rh)/2,sx=W/2-(p.showCount&&!two?f2*1.2:0),stemX=sx;let g='';
  // índices de marca
  const mark=(a,st,row)=>{const mi=new Set(),n=a.length;if(p.markMed&&n){if(n%2)mi.add((n-1)/2);else{mi.add(n/2-1);mi.add(n/2)}}const mv=new Set(p.markMode?st.md:[]);const out=[];let idx=0;
   row.forEach(r=>{out.push(r.map(l=>{const i=idx++;return{l,med:mi.has(i),mode:false}}))});
   // moda: marcar por valor completo
   let rr=0;return out.map((r,ri)=>{const stem=(p.split?Math.floor((ri+k0)/2):ri+k0),half=p.split?(ri+k0)%2:0;return r.map(c=>({...c,mode:mv.has(stem*10+c.l)}))})};
  const M1=mark(A1,S1,R1),M2=two?mark(A2,S2,R2):null;
  if(hd){if(two&&p.n2)g+=Draw.t(stemX-sw/2-f2*.4,top+fs*.6,p.n2,p,{a:'end',w:700,fs:f2,c:p.c2});if(p.n1)g+=Draw.t(stemX+sw/2+f2*.4,top+fs*.6,p.n1,p,{a:'start',w:700,fs:f2,c:p.c1})}
  const leaf=(c,x,y,col,anc)=>{let o='';const fillc=c.mode?p.colMode:c.med?p.colMed:col;if(c.med||c.mode){const rr=f2*.62;o+=`<circle cx="${x+(anc==='end'?-f2*.28:f2*.28)}" cy="${y}" r="${rr}" fill="${c.med?p.colMed:p.colMode}" fill-opacity=".18" stroke="${fillc}" stroke-width="1.8"${c.med&&c.mode?` stroke-dasharray="0"`:''}/>`}
   return o+Draw.t(x+(anc==='end'?-f2*.28:f2*.28),y,c.l,p,{b:'central',fs:f2,c:fillc,w:c.med||c.mode?700:400})};
  for(let i=0;i<nr;i++){const y=y0+i*rh+rh/2,stem=p.split?Math.floor((i+k0)/2):i+k0,showStem=!p.split||(i+k0)%2===0;
   if(showStem)g+=Draw.t(stemX,y,stem,p,{b:'central',fs:f2,w:700});
   M1[i].forEach((c,j)=>g+=leaf(c,stemX+sw/2+f2*.1+j*ls2,y,p.c1,'start'));
   if(two)M2[i].forEach((c,j)=>g+=leaf(c,stemX-sw/2-f2*.1-j*ls2,y,p.c2,'end'));
   if(p.showCount){const cnt=R1[i].length;g+=Draw.t(stemX+sw/2+f2*.4+maxL*ls2+f2*.8,y,cnt,p,{a:'start',b:'central',fs:f2*.8,c:'#64748b'});if(two)g+=Draw.t(stemX-sw/2-f2*.4-maxL*ls2-f2*.8,y,R2[i].length,p,{a:'end',b:'central',fs:f2*.8,c:'#64748b'})}}
  g+=`<line x1="${stemX+sw/2}" x2="${stemX+sw/2}" y1="${y0}" y2="${y0+nr*rh}" stroke="${p.textColor}" stroke-width="${p.strokeW}"/>`+(two?`<line x1="${stemX-sw/2}" x2="${stemX-sw/2}" y1="${y0}" y2="${y0+nr*rh}" stroke="${p.textColor}" stroke-width="${p.strokeW}"/>`:'');
  return T0+g+lines(p,W,H,Ls)}});

// ================= Gráfico de cajas =================
Registry.register({id:'stat-box',category:'data',name:'Gráfico de cajas',icon:'⊢',description:'Caja y bigotes con cuartiles, uno o varios conjuntos, horizontal o vertical',
 parameters:[A('data','Datos (una línea por conjunto: nombre; valores…)','Curso A; 4 5 5 6 6 7 7 7 8 9 10\nCurso B; 3 4 6 6 8 9 9 10 10 12','Datos',5),
  S('quart','Método de los cuartiles','tukey','Cálculo',[['tukey','Mediana de cada mitad (sin incluir la mediana)'],['incl','Mediana de cada mitad (incluyéndola)'],['linear','Interpolación (como Excel)']]),
  S('whisk','Bigotes','minmax','Cálculo',[['minmax','Del mínimo al máximo'],['iqr','Hasta 1,5 × RIC (con valores atípicos)']]),
  S('orient','Orientación','h','Cálculo',[['h','Horizontal'],['v','Vertical']]),
  S('lMin','Mínimo','val','Rótulos',LM),S('lQ1','Primer cuartil (Q₁)','val','Rótulos',LM),S('lMe','Mediana (Me)','val','Rótulos',LM),S('lQ3','Tercer cuartil (Q₃)','val','Rótulos',LM),S('lMax','Máximo','val','Rótulos',LM),
  K('showMean','Marcar la media (×)',false,'Rótulos'),K('showSum','Escribir el resumen de cada conjunto',true,'Rótulos'),K('grid','Cuadrícula',true,'Rótulos'),T('axis','Título del eje (opcional)','','Rótulos'),
  K('varied','Un color distinto por conjunto',true,'Estilo'),C('col','Color (si es uno solo)','#3b82f6','Estilo'),C('colMed','Color de la mediana','#dc2626','Estilo'),P('strokeW','Grosor de las líneas',2.5,1,8,'Estilo',{style:true,step:.5}),P('boxW','Grosor de la caja (%)',55,20,90,'Estilo',{style:true}),...ts()],
 render(p,W,H){const fs=p.fontSize,T0=Draw.title(p,W),G=String(p.data).split('\n').map(l=>l.trim()).filter(Boolean).slice(0,6).map((l,i)=>{const k=l.search(/[;:]/),nm=k<0?'':l.slice(0,k).trim(),v=nums(k<0?l:l.slice(k+1)).sort((a,b)=>a-b);return{nm:nm||(k<0&&i===0?'':`Conjunto ${i+1}`),v}}).filter(g=>g.v.length);
  if(!G.length)return T0+none(p,W,H);
  const hor=p.orient==='h',cols=G.map((_,i)=>p.varied?PAL[i%8]:p.col);
  G.forEach(g=>{const s=g.v,n=s.length,[q1,q3]=quart(s,p.quart),ric=q3-q1,lo=q1-1.5*ric,hi=q3+1.5*ric;g.n=n;g.q1=q1;g.q3=q3;g.me=med(s);g.min=s[0];g.max=s[n-1];g.ric=ric;g.mean=s.reduce((a,b)=>a+b,0)/n;
   if(p.whisk==='iqr'){const inn=s.filter(v=>v>=lo&&v<=hi);g.wl=inn[0];g.wh=inn[inn.length-1];g.out=s.filter(v=>v<lo||v>hi)}else{g.wl=g.min;g.wh=g.max;g.out=[]}});
  const vmin=Math.min(...G.map(g=>g.min)),vmax=Math.max(...G.map(g=>g.max)),tk=niceT(vmin,vmax);
  const Ls=p.showSum?G.map(g=>`${g.nm?g.nm+': ':''}Mín ${f(g.min)} · Q₁ ${f(g.q1)} · Me ${f(g.me)} · Q₃ ${f(g.q3)} · Máx ${f(g.max)} · RIC ${f(g.ric)}`):[],
   tH=Draw.titleH(p),lw=hor?fs*(Math.max(...G.map(g=>g.nm.length),0)*.55+1):0,ax=fs*2.2+(p.axis?fs*1.3:0),bh=belowH(p,Ls),
   ya=tH+fs*1.8,yb=H-bh-ax-fs*.4,xa=fs*1.5+lw+(hor?0:fs*2.2),xb=W-fs*2;
  const V=v=>hor?xa+(v-tk.lo)/(tk.hi-tk.lo)*(xb-xa):yb-(v-tk.lo)/(tk.hi-tk.lo)*(yb-ya),n=G.length,band=hor?(yb-ya)/n:(xb-xa)/n,pt=(v,c)=>hor?`${V(v)} ${c}`:`${c} ${V(v)}`,
   ln=(v1,c1,v2,c2,col,w,d)=>`<line x1="${hor?V(v1):c1}" y1="${hor?c1:V(v1)}" x2="${hor?V(v2):c2}" y2="${hor?c2:V(v2)}" stroke="${col}" stroke-width="${w}"${d?` stroke-dasharray="${d}"`:''}/>`;let g='';
  const gl='#e2e8f0',axc=p.textColor;
  if(p.grid)tk.l.forEach(v=>g+=hor?`<line x1="${V(v)}" x2="${V(v)}" y1="${ya}" y2="${yb}" stroke="${gl}" stroke-width="1"/>`:`<line x1="${xa}" x2="${xb}" y1="${V(v)}" y2="${V(v)}" stroke="${gl}" stroke-width="1"/>`);
  g+=hor?`<line x1="${xa}" x2="${xb}" y1="${yb}" y2="${yb}" stroke="${axc}" stroke-width="2"/>`:`<line x1="${xa}" x2="${xa}" y1="${ya}" y2="${yb}" stroke="${axc}" stroke-width="2"/>`;
  tk.l.forEach(v=>g+=hor?Draw.t(V(v),yb+fs*1.1,f(v),p,{fs:fs*.8})+`<line x1="${V(v)}" x2="${V(v)}" y1="${yb}" y2="${yb+5}" stroke="${axc}" stroke-width="2"/>`:Draw.t(xa-fs*.5,V(v),f(v),p,{fs:fs*.8,a:'end',b:'central'})+`<line x1="${xa-5}" x2="${xa}" y1="${V(v)}" y2="${V(v)}" stroke="${axc}" stroke-width="2"/>`);
  if(p.axis)g+=hor?Draw.t((xa+xb)/2,H-bh-fs*.2,p.axis,p,{w:700,fs:fs*.9}):`<g transform="rotate(-90 ${fs*.8} ${(ya+yb)/2})">`+Draw.t(fs*.8,(ya+yb)/2,p.axis,p,{w:700,fs:fs*.9})+'</g>';
  const labs=[['lMin','Mín','min'],['lQ1','Q₁','q1'],['lMe','Me','me'],['lQ3','Q₃','q3'],['lMax','Máx','max']];
  G.forEach((d,i)=>{const c=(hor?ya:xa)+(i+.5)*band,T=Math.min(band*p.boxW/200,fs*3),col=cols[i],sw=p.strokeW;
   if(G.length>1||d.nm){g+=hor?Draw.t(xa-fs*.5,c,d.nm,p,{a:'end',b:'central',w:700,c:col}):Draw.t(c,yb+fs*2.1,d.nm,p,{w:700,c:col})}
   g+=ln(d.wl,c,d.q1,c,col,sw)+ln(d.q3,c,d.wh,c,col,sw)+ln(d.wl,c-T*.55,d.wl,c+T*.55,col,sw)+ln(d.wh,c-T*.55,d.wh,c+T*.55,col,sw);
   g+=hor?`<rect x="${V(d.q1)}" y="${c-T}" width="${Math.max(1,V(d.q3)-V(d.q1))}" height="${2*T}" fill="${col}" fill-opacity=".22" stroke="${col}" stroke-width="${sw}"/>`:`<rect x="${c-T}" y="${V(d.q3)}" width="${2*T}" height="${Math.max(1,V(d.q1)-V(d.q3))}" fill="${col}" fill-opacity=".22" stroke="${col}" stroke-width="${sw}"/>`;
   g+=ln(d.me,c-T,d.me,c+T,p.colMed,sw*1.4);
   d.out.forEach(v=>g+=`<circle cx="${hor?V(v):c}" cy="${hor?c:V(v)}" r="${Math.max(3,fs*.22)}" fill="none" stroke="${col}" stroke-width="${sw*.7}"/>`);
   if(p.showMean){const x=hor?V(d.mean):c,y=hor?c:V(d.mean),r=fs*.3;g+=`<path d="M${x-r} ${y-r}L${x+r} ${y+r}M${x+r} ${y-r}L${x-r} ${y+r}" stroke="${axc}" stroke-width="${sw*.8}"/>`}
   labs.forEach(([k,nm,key],j)=>{const t=Draw.lbl(p[k],nm,f(key==='min'?d.wl:key==='max'?d.wh:d[key]));if(!t)return;const v=d[key==='min'?'wl':key==='max'?'wh':key];
    if(hor){const up=key==='me'||key==='q3'?-1:1,yy=up<0?c-T-fs*.7:c+T+fs*.95;g+=Draw.t(V(v),yy,t,p,{fs:fs*.78,c:key==='me'?p.colMed:col,w:key==='me'?700:400})}
    else{const left=key==='q1'||key==='q3',xx=left?c-T-fs*.4:c+T+fs*.4;g+=Draw.t(xx,V(v)+(left?0:key==='me'?0:key==='min'?fs*.2:-fs*.2),t,p,{a:left?'end':'start',b:'central',fs:fs*.78,c:key==='me'?p.colMed:col,w:key==='me'?700:400})}})});
  return T0+g+lines(p,W,H,Ls)}});

// ================= Tabla de frecuencias con media =================
const sup=s=>s;
Registry.register({id:'stat-freqmean',category:'data',name:'Tabla de frecuencias con media',icon:'Σ',description:'Frecuencias, conteo con marcas, intervalos con marca de clase y cálculo de la media, mediana y moda',
 parameters:[A('data','Datos (lista de números; o «valor; frecuencia» por línea)','4 5 5 6 7 7 7 8 8 9 9 9 10 7 6 5','Datos',5),
  S('input','Tipo de datos','raw','Datos',[['raw','Lista de datos (se cuentan solos)'],['pairs','Valor; frecuencia (una línea cada uno)']]),
  S('group','Agrupar','values','Datos',[['values','Cada valor por separado'],['classes','En intervalos (marca de clase)']]),
  P('width','Amplitud de cada intervalo',5,1,100,'Datos',{show:p=>p.group==='classes'}),
  K('showTally','Conteo con marcas (||||)',true,'Columnas'),K('showCum','Frecuencia acumulada (Fi)',true,'Columnas'),K('showRel','Frecuencia relativa (hi)',false,'Columnas'),K('showPct','Porcentaje (%)',false,'Columnas'),K('showProd','Columna xi · fi',true,'Columnas'),K('showTot','Fila de totales',true,'Columnas'),
  K('markMed','Marcar la mediana',true,'Marcas'),K('markMode','Marcar la moda',true,'Marcas'),
  K('showMean','Escribir el cálculo de la media',true,'Resultados'),K('showMedian','Escribir la mediana',true,'Resultados'),K('showModeT','Escribir la moda',true,'Resultados'),
  C('colMed','Color de la mediana','#2563eb','Estilo'),C('colMode','Color de la moda','#dc2626','Estilo'),C('head','Color del encabezado','#dbeafe','Estilo'),...ts()],
 render(p,W,H){const fs=p.fontSize,T0=Draw.title(p,W);let rows=[];
  if(p.input==='pairs'){const m=new Map();String(p.data).split('\n').forEach(l=>{const q=nums(l);if(q.length>=2&&q[1]>0)m.set(q[0],(m.get(q[0])||0)+Math.round(q[1]))});rows=[...m].sort((a,b)=>a[0]-b[0]).map(([x,fi])=>({x,fi}))}
  else{const m=new Map();nums(p.data).forEach(v=>m.set(v,(m.get(v)||0)+1));rows=[...m].sort((a,b)=>a[0]-b[0]).map(([x,fi])=>({x,fi}))}
  if(!rows.length)return T0+none(p,W,H);
  const cls=p.group==='classes';let CR=rows;
  if(cls){const w=p.width,mn=rows[0].x,mx=rows[rows.length-1].x,a0=Math.floor(mn/w)*w,b0=(Math.floor(mx/w)+1)*w,m=[];for(let a=a0;a<b0&&m.length<40;a+=w)m.push({a,b:a+w,x:(a+(a+w))/2,fi:0});rows.forEach(r=>{const c=m[Math.min(m.length-1,Math.floor((r.x-a0)/w))];c.fi+=r.fi});CR=m}
  if(CR.length>30)return T0+warn(p,W,H,'Hay demasiadas filas.','Agrupa en intervalos o reduce los datos.');
  const n=CR.reduce((a,r)=>a+r.fi,0);let acc=0;CR.forEach(r=>{acc+=r.fi;r.F=acc;r.h=r.fi/n;r.xf=r.x*r.fi});
  const S=CR.reduce((a,r)=>a+r.xf,0),mean=S/n,mxf=Math.max(...CR.map(r=>r.fi)),modal=CR.filter(r=>r.fi===mxf&&mxf>0),mrow=CR.find(r=>r.F>=n/2),lab=r=>cls?`[${f(r.a)}, ${f(r.b)}[`:f(r.x);
  // mediana exacta (datos sueltos)
  let medV=null;if(!cls){const k1=Math.ceil(n/2),k2=Math.floor(n/2)+1,at=k=>CR.find(r=>r.F>=k).x;medV=n%2?at(k1):(at(n/2)+at(n/2+1))/2}
  const rowAt=k=>CR.find(r=>r.F>=k),medRows=new Set(cls?[mrow]:n%2?[rowAt((n+1)/2)]:[rowAt(n/2),rowAt(n/2+1)]);
  const cols=[{h:cls?'Intervalo':'Dato (xi)',w:cls?lab:r=>f(r.x),k:'lab'}];if(cls)cols.push({h:'Marca (xi)',w:r=>f(r.x)});
  if(p.showTally&&mxf<=40)cols.push({h:'Conteo',tally:true});cols.push({h:'fi',w:r=>String(r.fi),b:true});if(p.showCum)cols.push({h:'Fi',w:r=>String(r.F)});
  if(p.showRel)cols.push({h:'hi',w:r=>f(r.h)});if(p.showPct)cols.push({h:'%',w:r=>f(r.h*100)+' %'});if(p.showProd)cols.push({h:'xi · fi',w:r=>f(r.xf)});
  if(p.markMed||p.markMode)cols.push({h:'Marca',mk:true});
  const Ls=[];
  if(p.showMean){const terms=CR.length<=7?CR.map(r=>`${f(r.x)}·${r.fi}`).join(' + '):'';Ls.push(`Media = Σ xi·fi / n = ${terms?`(${terms}) / ${n} = `:''}${fm(S)} / ${n} = ${f(mean)}`+(cls?'  (aprox., usa marcas de clase)':''))}
  if(p.showMedian)Ls.push(cls?`Clase mediana: ${lab(mrow)}  (primera con Fi ≥ n/2 = ${f(n/2)})`:`Mediana = ${f(medV)}  (n = ${n}, ${n%2?`dato n.º ${(n+1)/2}`:`promedio de los datos n.º ${n/2} y ${n/2+1}`})`);
  if(p.showModeT)Ls.push(mxf>1||CR.length===1?`${cls?'Clase modal':'Moda'}: ${modal.map(lab).join(' y ')}  (fi = ${mxf})`:'No hay moda: todos los valores aparecen una vez');
  const tH=Draw.titleH(p),top=tH+fs*.8,avail=H-tH-belowH(p,Ls)-fs*.6,nr=CR.length+1+(p.showTot?1:0);
  const cwOf=(c,f2)=>c.mk?f2*(cls?16.5:12):c.tally?f2*Math.max(4,Math.ceil(mxf/5)*1.5+.5):f2*Math.max(c.h.length*.65+1.2,...CR.map(r=>(c.w?c.w(r).length:0)*.62+1.2),3);
  let f2=fs;const tot=f2=>cols.reduce((a,c)=>a+cwOf(c,f2),0);while((tot(f2)>W*.95||nr*f2*2>avail)&&f2>5)f2*=.94;
  const rh=f2*2,cws=cols.map(c=>cwOf(c,f2)),x0=(W-cws.reduce((a,b)=>a+b,0))/2,y0=top+(avail-nr*rh)/2;let g='';
  const cell=(x,y,w,t,fill,b,c,al)=>`<rect x="${x}" y="${y}" width="${w}" height="${rh}" fill="${fill}" stroke="#64748b" stroke-width="1.2"/>`+(t===''?'':Draw.t(x+w/2,y+rh/2,t,p,{b:'central',fs:f2,w:b?700:400,c}));
  const tally=(x,y,w,fi)=>{let o='',cx=x+f2*.4;const gg=Math.floor(fi/5),rm=fi%5,sp=f2*.28,hh=rh*.58,yy=y+rh/2-hh/2;
   for(let i=0;i<gg;i++){for(let k=0;k<4;k++)o+=`<line x1="${cx+k*sp}" x2="${cx+k*sp}" y1="${yy}" y2="${yy+hh}" stroke="${p.textColor}" stroke-width="1.6"/>`;o+=`<line x1="${cx-sp*.5}" y1="${yy+hh*.8}" x2="${cx+3.5*sp}" y2="${yy+hh*.2}" stroke="${p.textColor}" stroke-width="1.6"/>`;cx+=4*sp+f2*.45}
   for(let k=0;k<rm;k++)o+=`<line x1="${cx+k*sp}" x2="${cx+k*sp}" y1="${yy}" y2="${yy+hh}" stroke="${p.textColor}" stroke-width="1.6"/>`;return `<rect x="${x}" y="${y}" width="${w}" height="${rh}" fill="#fff" stroke="#64748b" stroke-width="1.2"/>`+o};
  let x=x0;cols.forEach((c,j)=>{g+=cell(x,y0,cws[j],c.h,p.head,true);x+=cws[j]});
  CR.forEach((r,i)=>{const y=y0+(i+1)*rh,isMode=p.markMode&&modal.includes(r)&&(mxf>1||CR.length===1),isMed=p.markMed&&medRows.has(r);
   const fill=isMode&&isMed?'#f5f3ff':isMode?p.colMode+'22':isMed?p.colMed+'22':'#fff';let x=x0;
   cols.forEach((c,j)=>{if(c.tally)g+=tally(x,y,cws[j],r.fi);else if(c.mk){const t=[isMed?'Mediana':'',isMode?(cls?'Clase modal':'Moda'):''].filter(Boolean).join(' y ');g+=cell(x,y,cws[j],t?'◄ '+t:'',fill,true,isMode?p.colMode:p.colMed)}else g+=cell(x,y,cws[j],c.w(r),c.k==='lab'?(fill==='#fff'?'#f1f5f9':fill):fill,c.k==='lab'||c.b);x+=cws[j]})});
  if(p.showTot){const y=y0+(CR.length+1)*rh;let x=x0;cols.forEach((c,j)=>{const t=c.h==='fi'?String(n):c.h==='xi · fi'?f(S):c.h==='hi'?'1':c.h==='%'?'100 %':j===0?'Total':'';g+=cell(x,y,cws[j],t,p.head,true);x+=cws[j]})}
  return T0+g+lines(p,W,H,Ls)}});

// ================= Media, mediana y moda con marcas =================
Registry.register({id:'stat-center',category:'data',name:'Media, mediana y moda',icon:'📍',description:'Diagrama de puntos con la media (▲), la mediana (línea) y la moda (círculo) marcadas, y los datos ordenados',
 parameters:[A('data','Datos (números separados por espacios, comas o líneas)','3 4 4 5 6 6 6 7 9 10','Datos',4),
  K('showChips','Mostrar los datos ordenados',true,'Mostrar'),K('showDots','Mostrar el diagrama de puntos',true,'Mostrar'),
  S('lMean','Media (▲)','both','Marcas',LM),S('lMed','Mediana (línea)','both','Marcas',LM),S('lMode','Moda (círculo)','both','Marcas',LM),
  K('showCalc','Escribir el cálculo de cada medida',true,'Marcas'),
  C('colMean','Color de la media','#dc2626','Estilo'),C('colMed','Color de la mediana','#2563eb','Estilo'),C('colMode','Color de la moda','#16a34a','Estilo'),C('dot','Color de los puntos','#475569','Estilo'),P('strokeW','Grosor de las líneas',2.5,1,8,'Estilo',{style:true,step:.5}),...ts()],
 render(p,W,H){const fs=p.fontSize,T0=Draw.title(p,W),s=nums(p.data).sort((a,b)=>a-b),n=s.length;if(!n)return T0+none(p,W,H);
  const sum=s.reduce((a,b)=>a+b,0),mean=sum/n,me=med(s),md=modes(s),Mo=md.modes,ex=n<=10?s.map(f).join(' + '):'';
  const Ls=[];if(p.showCalc){Ls.push(`Media = ${ex?`(${ex}) / ${n} = `:''}${f(sum)} / ${n} = ${f(mean)}`);Ls.push(`Mediana = ${n%2?`dato central (n.º ${(n+1)/2}) = ${f(me)}`:`promedio de los datos centrales (${f(s[n/2-1])} y ${f(s[n/2])}) = ${f(me)}`}`);Ls.push(`Moda = ${Mo.length?Mo.map(f).join(' y ')+`  (se repite ${md.mc} veces)`:'no hay (ningún dato se repite)'}`)}
  const tH=Draw.titleH(p),top=tH+fs*.8,bh=belowH(p,Ls),avail=H-tH-bh-fs*.6;let g='',y=top;
  if(p.showChips&&n<=60){const cw=f2=>f2*(Math.max(...s.map(v=>f(v).length))*.62+1.1),lay=f2=>{const c=Math.max(1,Math.floor(W*.94/cw(f2)));return{c,h:Math.ceil(n/c)*f2*1.7}};let f2=fs;let a=lay(f2);const cap=p.showDots?avail*.32:avail;while(a.h>cap&&f2>5){f2*=.94;a=lay(f2)}
   const cols=Math.min(a.c,n),x0=(W-cols*cw(f2))/2,midI=new Set(n%2?[(n-1)/2]:[n/2-1,n/2]);
   g+=Draw.t(W/2,y+f2*.2,'Datos ordenados',p,{fs:f2*.85,c:'#64748b'});y+=f2*.9;
   s.forEach((v,i)=>{const xx=x0+(i%cols)*cw(f2),yy=y+Math.floor(i/cols)*f2*1.7,isM=midI.has(i),isMo=Mo.includes(v);
    g+=`<rect x="${xx+cw(f2)*.05}" y="${yy}" width="${cw(f2)*.9}" height="${f2*1.5}" rx="${f2*.3}" fill="${isM?p.colMed:isMo?p.colMode:'#e2e8f0'}" fill-opacity="${isM||isMo?.2:.5}" stroke="${isM?p.colMed:isMo?p.colMode:'#94a3b8'}" stroke-width="${isM||isMo?1.8:1}"/>`+Draw.t(xx+cw(f2)/2,yy+f2*.75,f(v),p,{b:'central',fs:f2,w:isM||isMo?700:400,c:isM?p.colMed:isMo?p.colMode:undefined})});
   y+=a.h+f2*.6}
  if(p.showDots){const tk=niceT(Math.min(s[0],mean),Math.max(s[n-1],mean)),ya=y+fs*.4,yb=top+avail-fs*4.8,xa=fs*2,xb=W-fs*2,X=v=>xa+(v-tk.lo)/(tk.hi-tk.lo)*(xb-xa),ph=yb-ya;
   if(ph<fs*4)g+=warn(p,W,H,'No hay espacio para el diagrama de puntos.','Desactiva «Mostrar los datos ordenados».');
   else{const keys=[...md.c.keys()].sort((a,b)=>a-b),gap=keys.length>1?Math.min(...keys.slice(1).map((k,i)=>X(k)-X(keys[i]))):fs*3,mxc=md.mc,r=Math.max(2,Math.min(fs*.5,gap*.45,(ph*.62)/(2*mxc)));
    g+=`<line x1="${xa}" x2="${xb}" y1="${yb}" y2="${yb}" stroke="${p.textColor}" stroke-width="2"/>`;
    tk.l.forEach(v=>g+=`<line x1="${X(v)}" x2="${X(v)}" y1="${yb}" y2="${yb+5}" stroke="${p.textColor}" stroke-width="2"/>`+Draw.t(X(v),yb+fs*1.15,f(v),p,{fs:fs*.8}));
    // mediana
    const lm=Draw.lbl(p.lMed,'Me',f(me));if(p.lMed!=='off')g+=`<line x1="${X(me)}" x2="${X(me)}" y1="${ya+fs*1.3}" y2="${yb}" stroke="${p.colMed}" stroke-width="${p.strokeW}" stroke-dasharray="8 5"/>`+Draw.t(X(me),ya+fs*.7,lm,p,{c:p.colMed,w:700,fs:fs*.9});
    // moda
    keys.forEach(k=>{const c=md.c.get(k),isMo=Mo.includes(k);for(let j=0;j<c;j++)g+=`<circle cx="${X(k)}" cy="${yb-r-j*2*r}" r="${r}" fill="${p.dot}" fill-opacity=".75"/>`;
     if(isMo&&p.lMode!=='off'){const top2=yb-c*2*r;g+=`<rect x="${X(k)-r*1.5}" y="${top2-r*.6}" width="${r*3}" height="${c*2*r+r*.8}" rx="${r*1.4}" fill="none" stroke="${p.colMode}" stroke-width="${p.strokeW}"/>`+(Math.abs(X(k)-X(me))<fs*3&&p.lMed!=='off'?Draw.t(X(k)+r*1.7,top2-r*1.2,Draw.lbl(p.lMode,'Mo',f(k)),p,{a:'start',c:p.colMode,w:700,fs:fs*.9}):Draw.t(X(k),top2-r*1.2-fs*.1,Draw.lbl(p.lMode,'Mo',f(k)),p,{c:p.colMode,w:700,fs:fs*.9}))}});
    // media
    if(p.lMean!=='off'){const xm=X(mean),tr=fs*.7;const ay=yb+fs*1.7;g+=`<line x1="${xm}" x2="${xm}" y1="${yb}" y2="${ay}" stroke="${p.colMean}" stroke-width="1.2" stroke-dasharray="3 3"/><polygon points="${xm},${ay} ${xm-tr},${ay+tr*1.6} ${xm+tr},${ay+tr*1.6}" fill="${p.colMean}"/>`+Draw.t(xm,ay+tr*1.6+fs*.9,Draw.lbl(p.lMean,'x̄',f(mean)),p,{c:p.colMean,w:700,fs:fs*.9})}}}
  return T0+g+lines(p,W,H,Ls)}});
})();
