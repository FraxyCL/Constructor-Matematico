// Razones trigonométricas: triángulo rectángulo, circunferencia goniométrica y tabla de ángulos notables
(()=>{
const {P,C,K,S}=Registry.h,ts=()=>Registry.h.ts(24),D=Math.PI/180,{rot,add,sub,mul,unit,pol}=Draw.v,{view,ln,sq,dot,ang,between,arc,circ,sideLab}=Draw.g;
const TN={sin:'sen',cos:'cos',tan:'tan',csc:'cosec',sec:'sec',cot:'cotan'};
const mkNf=d=>x=>(Math.round(x*10**d)/10**d+0).toLocaleString('es-CL',{maximumFractionDigits:d});

// ---------- Triángulo rectángulo ----------
const geo=p=>{let opp,adj,hyp,th;if(p.mode==='ang'){th=p.theta;hyp=p.hyp;opp=hyp*Math.sin(th*D);adj=hyp*Math.cos(th*D)}else{const x=p.lx,y=p.ly;opp=p.ref==='A'?y:x;adj=p.ref==='A'?x:y;hyp=Math.hypot(x,y);th=Math.atan2(opp,adj)/D}return{opp,adj,hyp,th}};
const RT=[['rsin','sin','opp','hyp'],['rcos','cos','adj','hyp'],['rtan','tan','opp','adj'],['rcsc','csc','hyp','opp'],['rsec','sec','hyp','adj'],['rcot','cot','adj','opp']];
Registry.register({id:'trig-ratios',category:'theorems',name:'Razones trigonométricas',icon:'📐',description:'Seno, coseno, tangente y sus recíprocas en un triángulo rectángulo, con cálculo de un lado',
 parameters:[S('mode','Datos del triángulo','ang','Triángulo',[['ang','Ángulo y hipotenusa'],['legs','Los dos catetos']]),S('ref','Ángulo de referencia (θ)','A','Triángulo',[['A','En el vértice A (izquierda)'],['C','En el vértice C (arriba)']]),
  P('theta','Ángulo θ (°)',35,5,85,'Triángulo',{show:p=>p.mode==='ang'}),P('hyp','Hipotenusa (cm)',10,2,20,'Triángulo',{step:.5,show:p=>p.mode==='ang'}),
  P('lx','Cateto horizontal AB (cm)',8,1,20,'Triángulo',{step:.5,show:p=>p.mode==='legs'}),P('ly','Cateto vertical BC (cm)',6,1,20,'Triángulo',{step:.5,show:p=>p.mode==='legs'}),P('rot','Giro de la figura (°)',0,0,359,'Triángulo'),
  S('find','Lado que se pide calcular (x)','none','Resolución',[['none','Ninguno (mostrar todas las medidas)'],['opp','Cateto opuesto'],['adj','Cateto adyacente'],['hyp','Hipotenusa']]),
  K('sdO','Cateto opuesto',true,'Lados visibles'),K('sdA','Cateto adyacente',true,'Lados visibles'),K('sdH','Hipotenusa',true,'Lados visibles'),K('showVal','Mostrar las medidas',true,'Lados visibles'),S('lab','Nombre de los lados','words','Lados visibles',[['words','Cateto opuesto, adyacente, hipotenusa'],['letters','a, b, c']]),K('colorSides','Colorear los lados',true,'Lados visibles'),
  K('anT','Ángulo θ',true,'Ángulos visibles'),K('anR','Ángulo recto',true,'Ángulos visibles'),K('anO','El otro ángulo agudo',false,'Ángulos visibles'),K('showPts','Nombrar los vértices A, B y C',true,'Mostrar'),
  K('rsin','Seno (sen θ)',true,'Razones a escribir'),K('rcos','Coseno (cos θ)',true,'Razones a escribir'),K('rtan','Tangente (tan θ)',true,'Razones a escribir'),K('rcsc','Cosecante',false,'Razones a escribir'),K('rsec','Secante',false,'Razones a escribir'),K('rcot','Cotangente',false,'Razones a escribir'),P('dec','Decimales',3,0,5,'Razones a escribir'),Registry.h.UN(),
  C('col','Color del triángulo','#fef3c7','Estilo'),C('stroke','Color del contorno','#1e293b','Estilo'),P('strokeW','Grosor del contorno',3,1,10,'Estilo',{style:true}),P('size','Tamaño de la figura (%)',75,30,100,'Estilo',{style:true}),...ts()],
 render(p,W,H){const G=geo(p),fs=p.fontSize,u=p.unit,nf=mkNf(p.dec),xx=p.ref==='A'?G.adj:G.opp,yy=p.ref==='A'?G.opp:G.adj,th=p.rot*D,R=q=>rot(q,th),[A,B,Cc]=[[0,0],[xx,0],[xx,yy]].map(R),
  seg={opp:p.ref==='A'?[B,Cc]:[A,B],adj:p.ref==='A'?[A,B]:[B,Cc],hyp:[A,Cc]},COL={opp:'#dc2626',adj:'#16a34a',hyp:'#2563eb'},W3=p.lab==='words',
  SN={opp:W3?'cateto opuesto':'a',adj:W3?'cateto adyacente':'b',hyp:W3?'hipotenusa':'c'},Ls=[],tv=nf(G.th),vs=k=>p.find===k?'x':nf(G[k]);
  RT.forEach(([key,fn,n,d])=>{if(p[key])Ls.push(`${TN[fn]} θ = ${SN[n]} / ${SN[d]} = ${vs(n)} / ${vs(d)} = ${nf(G[n]/G[d])}`)});
  if(p.find==='opp')Ls.push(`sen θ = x / ${nf(G.hyp)}   →   x = ${nf(G.hyp)} · sen ${tv}° = ${nf(G.opp)} ${u}`);else if(p.find==='adj')Ls.push(`cos θ = x / ${nf(G.hyp)}   →   x = ${nf(G.hyp)} · cos ${tv}° = ${nf(G.adj)} ${u}`);else if(p.find==='hyp')Ls.push(`sen θ = ${nf(G.opp)} / x   →   x = ${nf(G.opp)} / sen ${tv}° = ${nf(G.hyp)} ${u}`);
  const all=[A,B,Cc],xs=all.map(q=>q[0]),ys=all.map(q=>q[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),fl=fs*.78,below=Ls.length?Ls.length*fl*1.35+fs*.4:0,
   m=view(p,W,H,Math.max(x1-x0,y1-y0)/2*1.25,below,(x0+x1)/2,(y0+y1)/2),lw=Math.max(2,p.strokeW*.8),cen=[(A[0]+B[0]+Cc[0])/3,(A[1]+B[1]+Cc[1])/3];let g=`<polygon points="${all.map(q=>m.T(q).join(',')).join(' ')}" fill="${p.col}" stroke="${p.stroke}" stroke-width="${p.strokeW}" stroke-linejoin="round"/>`;
  [['opp','sdO'],['adj','sdA'],['hyp','sdH']].forEach(([k,sd])=>{const[P1,P2]=seg[k];if(p.colorSides)g+=ln(m,P1,P2,COL[k],lw*1.3);
   if(p[sd])g+=sideLab(m,p,P1,P2,p.showVal?`${SN[k]} = ${p.find===k?'x':nf(G[k])+' '+u}`:SN[k],p.colorSides?COL[k]:p.textColor,cen,1.0)});
  const rr=Math.min(xx,yy)*.22,thV=p.ref==='A'?A:Cc,oV=p.ref==='A'?Cc:A;
  if(p.anT){const[s0,sp]=p.ref==='A'?between(A,B,Cc):between(Cc,B,A);g+=ang(m,p,thV,s0,sp,rr,'#7c3aed',`θ = ${tv}°`)}
  if(p.anO){const[s0,sp]=p.ref==='A'?between(Cc,B,A):between(A,B,Cc);g+=ang(m,p,oV,s0,sp,rr,'#0891b2',`${nf(90-G.th)}°`)}
  if(p.anR)g+=sq(m,B,A,Cc,Math.min(xx,yy)*.12,'#7c3aed',lw);
  if(p.showPts)[[A,'A'],[B,'B'],[Cc,'C']].forEach(([q,t])=>g+=dot(m,p,q,t,p.stroke,unit(sub(q,cen))));
  Ls.forEach((t,i)=>g+=Draw.t(W/2,m.tH+m.av+fl*1.3+i*fl*1.35,t,p,{fs:fl}));
  return Draw.title(p,W)+g}});

// ---------- Circunferencia goniométrica ----------
const piStr=deg=>{for(const d of [1,2,3,4,6,8,12]){const n=Math.round(deg*d/180);if(Math.abs(deg*d/180-n)<1e-9){if(n===0)return'0';const ns=n===1?'':String(n);return d===1?ns+'π':ns+'π/'+d}}return Draw.fmt(deg*D)+' rad'};
Registry.register({id:'trig-circle',category:'theorems',name:'Circunferencia goniométrica',icon:'◔',description:'Seno, coseno y tangente como segmentos en la circunferencia de radio 1',
 parameters:[P('th','Ángulo θ (°)',40,0,360,'Ángulo'),S('au','Medida del ángulo','deg','Ángulo',[['deg','Grados'],['rad','Radianes (fracción de π)']]),
  K('shSin','Seno (segmento vertical)',true,'Razones'),K('shCos','Coseno (segmento horizontal)',true,'Razones'),K('shTan','Tangente (sobre x = 1)',true,'Razones'),P('dec','Decimales',3,0,5,'Razones'),
  K('shArc','Arco del ángulo',true,'Mostrar'),K('shPt','Coordenadas del punto P',true,'Mostrar'),K('shVals','Escribir los valores',true,'Mostrar'),K('shSpecial','Marcar ángulos notables',false,'Mostrar'),K('shSigns','Signos por cuadrante',false,'Mostrar'),K('shNums','Numeración de los ejes',true,'Mostrar'),
  C('colSin','Color del seno','#dc2626','Estilo'),C('colCos','Color del coseno','#16a34a','Estilo'),C('colTan','Color de la tangente','#9333ea','Estilo'),C('stroke','Color de la circunferencia','#1e293b','Estilo'),P('strokeW','Grosor de las líneas',3,1,10,'Estilo',{style:true}),P('size','Tamaño de la figura (%)',85,30,100,'Estilo',{style:true}),...ts()],
 render(p,W,H){const fs=p.fontSize,th=p.th,c=Math.cos(th*D),s=Math.sin(th*D),nf=mkNf(p.dec),near0=Math.abs(c)<1e-9,t=near0?NaN:s/c,lw=Math.max(2,p.strokeW*.8),Ls=[],O=[0,0],Pp=[c,s];
  if(p.shVals){const r=[];if(p.shSin)r.push(`sen θ = ${nf(s)}`);if(p.shCos)r.push(`cos θ = ${nf(c)}`);if(p.shTan)r.push(`tan θ = ${near0?'no definida':nf(t)}`);if(r.length)Ls.push(r.join('      '))}
  const below=Ls.length?fs*1.9:0,m=view(p,W,H,1.7,below,0,0),T=m.T;let g='';const ax=Draw.arrow;
  if(p.shSigns)[[1,1,'I','(+, +)'],[-1,1,'II','(−, +)'],[-1,-1,'III','(−, −)'],[1,-1,'IV','(+, −)']].forEach(([sx,sy,r,t])=>g+=Draw.t(...T([sx*.55,sy*.5+.07]),r,p,{c:'#94a3b8',w:700,fs:fs*.9,b:'central'})+Draw.t(...T([sx*.55,sy*.5-.1]),t,p,{c:'#94a3b8',fs:fs*.6,b:'central'}));
  const a1=T([-1.5,0]),a2=T([1.5,0]),b1=T([0,-1.5]),b2=T([0,1.5]);g+=ax(a1[0],a1[1],a2[0],a2[1],'#475569',2)+ax(b1[0],b1[1],b2[0],b2[1],'#475569',2)+circ(m,O,1,`fill="none" stroke="${p.stroke}" stroke-width="${p.strokeW}"`);
  if(p.shNums)[[1,0,'1'],[-1,0,'−1'],[0,1,'1'],[0,-1,'−1']].forEach(([x,y,t])=>g+=Draw.t(...T([x+(y?.1:0),y+(x?-.1:0)]),t,p,{fs:fs*.65,b:'central',c:'#475569',a:y?'start':'middle'}));
  if(p.shSpecial)[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330].forEach(a=>{const q=pol(a,1.14),Q=T(q);g+=ln(m,pol(a,.97),pol(a,1.03),p.stroke,2)+Draw.t(Q[0],Q[1],a+'°',p,{fs:fs*.5,b:'central',c:'#64748b'})});
  if(p.shTan&&!near0){const ty=Math.max(-1.55,Math.min(1.55,t)),far=[1,ty];g+=ln(m,O,far,'#94a3b8',1.5,'6 5')+ln(m,[1,0],far,p.colTan,lw*1.3);g+=Draw.t(...T([1.12,ty/2]),'tan',p,{c:p.colTan,w:700,fs:fs*.7,b:'central',a:'start'})}
  if(p.shCos)g+=ln(m,O,[c,0],p.colCos,lw*1.3)+Draw.t(...T([c/2,-.1*(s>=0?1:-1)]),'cos',p,{c:p.colCos,w:700,fs:fs*.7,b:'central'});
  if(p.shSin)g+=ln(m,[c,0],Pp,p.colSin,lw*1.3)+Draw.t(...T([c+.1*(c>=0?1:-1),s/2]),'sen',p,{c:p.colSin,w:700,fs:fs*.7,b:'central',a:c>=0?'start':'end'});
  g+=ln(m,O,Pp,p.stroke,lw)+(p.shCos||p.shSin?ln(m,Pp,[c,0],'#94a3b8',1.2,'4 4'):'');
  if(p.shArc&&th>0)g+=ang(m,p,O,0,th,.24,'#7c3aed',p.au==='deg'?`${nf(th)}°`:piStr(th));
  g+=dot(m,p,Pp,p.shPt?`P(${nf(c)}, ${nf(s)})`:'P','#7c3aed',[c>=0?1:-1,s>=0?.5:-.5])+dot(m,p,O,'O',p.stroke,[-.7,-.7]);
  Ls.forEach((t,i)=>g+=Draw.t(W/2,m.tH+m.av+fs*1.3,t,p,{fs:fs*.85,w:700}));
  return Draw.title(p,W)+g}});

// ---------- Tabla de ángulos notables ----------
const Z=(n,d)=>d?[n,d]:[n];
const TAB={q1:{ang:[0,30,45,60,90],sin:[Z('0'),Z('1','2'),Z('√2','2'),Z('√3','2'),Z('1')],cos:[Z('1'),Z('√3','2'),Z('√2','2'),Z('1','2'),Z('0')],tan:[Z('0'),Z('√3','3'),Z('1'),Z('√3'),Z('n.d.')],
  csc:[Z('n.d.'),Z('2'),Z('√2'),Z('2√3','3'),Z('1')],sec:[Z('1'),Z('2√3','3'),Z('√2'),Z('2'),Z('n.d.')],cot:[Z('n.d.'),Z('√3'),Z('1'),Z('√3','3'),Z('0')]},
 axes:{ang:[0,90,180,270,360],sin:[Z('0'),Z('1'),Z('0'),Z('−1'),Z('0')],cos:[Z('1'),Z('0'),Z('−1'),Z('0'),Z('1')],tan:[Z('0'),Z('n.d.'),Z('0'),Z('n.d.'),Z('0')],csc:[Z('n.d.'),Z('1'),Z('n.d.'),Z('−1'),Z('n.d.')],sec:[Z('1'),Z('n.d.'),Z('−1'),Z('n.d.'),Z('1')],cot:[Z('n.d.'),Z('0'),Z('n.d.'),Z('0'),Z('n.d.')]}};
const num=(k,a)=>{const r=a*D,v={sin:Math.sin(r),cos:Math.cos(r),tan:Math.tan(r),csc:1/Math.sin(r),sec:1/Math.cos(r),cot:1/Math.tan(r)}[k];return Math.abs(v)>1e9||!isFinite(v)?'n.d.':mkNf(3)(Math.abs(v)<1e-12?0:v)};
Registry.register({id:'trig-table',category:'theorems',name:'Tabla de ángulos notables',icon:'▦',description:'Valores exactos y decimales de las razones trigonométricas para 0°, 30°, 45°, 60° y 90°',
 parameters:[S('set','Ángulos','q1','Tabla',[['q1','0°, 30°, 45°, 60° y 90°'],['axes','0°, 90°, 180°, 270° y 360°']]),S('form','Valores','exact','Tabla',[['exact','Exactos (fracciones y raíces)'],['dec','Decimales'],['both','Exactos y decimales']]),P('dec','Decimales',3,1,5,'Tabla',{show:p=>p.form!=='exact'}),
  K('rsin','Seno',true,'Filas'),K('rcos','Coseno',true,'Filas'),K('rtan','Tangente',true,'Filas'),K('rcsc','Cosecante',false,'Filas'),K('rsec','Secante',false,'Filas'),K('rcot','Cotangente',false,'Filas'),
  K('zebra','Filas alternadas',true,'Estilo'),C('head','Color del encabezado','#dbeafe','Estilo'),C('border','Color de los bordes','#475569','Estilo'),P('size','Ancho de la tabla (%)',90,40,100,'Estilo',{style:true}),...ts(26)],
 render(p,W,H){const T=TAB[p.set],rows=RT.filter(r=>p[r[0]]).map(r=>r[1]),nc=T.ang.length+1,nr=rows.length+1,tH=Draw.titleH(p),both=p.form==='both',nf=mkNf(p.dec),
  rh0=p.fontSize*(both?3.4:2.7),r=Math.min(1,W*p.size/100/(p.fontSize*3.4*nc),(H-tH-p.fontSize*2)/(nr*rh0)),fs=p.fontSize*r,rh=rh0*r,cw=fs*3.4,x0=(W-cw*nc)/2,y0=tH+(H-tH-nr*rh)/2,q={...p,fontSize:fs};let g='';
  const cell=(x,y,w,h,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${p.border}" stroke-width="1.5"/>`,stack=(x,y,n,d,f2)=>{const w=Math.max(n.length,d.length)*f2*.55+f2*.4;return Draw.t(x,y-f2*.12,n,q,{fs:f2,b:'auto'})+`<line x1="${x-w/2}" x2="${x+w/2}" y1="${y}" y2="${y}" stroke="${p.textColor}" stroke-width="1.4"/>`+Draw.t(x,y+f2*.95,d,q,{fs:f2})};
  for(let i=0;i<nr;i++)for(let j=0;j<nc;j++){const x=x0+j*cw,y=y0+i*rh,head=i===0||j===0;g+=cell(x,y,cw,rh,head?p.head:(p.zebra&&i%2===0?'#f1f5f9':'#ffffff'));const cx=x+cw/2,cy=y+rh/2;
   if(i===0)g+=Draw.t(cx,cy,j===0?'θ':T.ang[j-1]+'°',q,{b:'central',w:700});else if(j===0)g+=Draw.t(cx,cy,TN[rows[i-1]]+' θ',q,{b:'central',w:700});
   else{const k=rows[i-1],v=T[k][j-1],a=T.ang[j-1];if(p.form==='dec')g+=Draw.t(cx,cy,num(k,a),q,{b:'central'});
    else{const ex=v.length===2?null:v[0];if(both){if(ex!=null)g+=Draw.t(cx,cy-fs*.55,ex,q,{b:'central'});else g+=stack(cx,cy-fs*.5,v[0],v[1],fs*.9);if(num(k,a)!=='n.d.')g+=Draw.t(cx,cy+fs*.85,'≈ '+num(k,a),q,{b:'central',fs:fs*.7,c:'#64748b'})}
     else if(ex!=null)g+=Draw.t(cx,cy,ex,q,{b:'central'});else g+=stack(cx,cy-fs*.1,v[0],v[1],fs)}}}
  if(rows.some(k=>T[k].some(v=>v[0]==='n.d.')))g+=Draw.t(W/2,y0+nr*rh+fs*1.3,'n.d. = no definida',q,{fs:fs*.75,c:'#64748b'});
  return Draw.title(p,W)+g}});
})();
