// Teorema de Thales: paralelas cortadas por transversales y triángulo cortado por una paralela a un lado
(()=>{
const {P,C,K,S}=Registry.h,ts=()=>Registry.h.ts(24),f=x=>Draw.fmt(x+0),{D,add,sub,mul,unit,rot}=Draw.v,{view,ln,dot,sideLab}=Draw.g;
// proporción n1/d1 = n2/d2; fi = índice de la incógnita (o -1). Devuelve las líneas de texto (simbólica, numérica y despeje)
const proportion=(nm,v,fi,u)=>{const N=nm.map((t,i)=>i===fi?'x':t),V=v.map((q,i)=>i===fi?'x':f(q)),sym=`${N[0]} / ${N[1]} = ${N[2]} / ${N[3]}`,num=`${V[0]} / ${V[1]} = ${V[2]} / ${V[3]}`;
 if(fi<0)return[sym,num+`   (razón = ${f(v[0]/v[1])})`];const I=[[2,1,3],[0,3,2],[0,3,1],[2,1,0]][fi];return[sym,num,`x = ${f(v[I[0]])} · ${f(v[I[1]])} / ${f(v[I[2]])} = ${f(v[fi])} ${u}`]};
const chev=(m,p,q,dir,col,lw)=>{const d=unit(dir),n=[-d[1],d[0]],t=.28;return `<polyline points="${[add(add(q,mul(d,-t)),mul(n,t*.8)),q,add(add(q,mul(d,-t)),mul(n,-t*.8))].map(z=>m.T(z).join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="${lw}"/>`};
const txt=(p,W,m,Ls)=>Ls.map((t,i)=>Draw.t(W/2,m.tH+m.av+p.fontSize*1.25+i*p.fontSize*1.3,t,p,{fs:p.fontSize*.9,w:i===0?700:400})).join('');
const off=(m,p,M,d,k)=>{const q=m.T(M),l=Math.hypot(...d)||1;return[q[0]+d[0]/l*p.fontSize*k,q[1]-d[1]/l*p.fontSize*k]};

// ---------- Paralelas y transversales ----------
const SEGN=[['AB','BC','CD'],['A′B′','B′C′','C′D′']];
Registry.register({id:'thales-lines',category:'theorems',name:'Thales: paralelas y transversales',icon:'⫴',description:'Tres o cuatro paralelas cortadas por dos transversales: los segmentos son proporcionales',
 parameters:[P('n','Cantidad de paralelas',3,3,4,'Figura'),P('h1','Distancia L₁ – L₂ (cm)',3,1,8,'Figura',{step:.5}),P('h2','Distancia L₂ – L₃ (cm)',2,1,8,'Figura',{step:.5}),P('h3','Distancia L₃ – L₄ (cm)',2,1,8,'Figura',{step:.5,show:p=>p.n>=4}),
  P('t1','Inclinación de la transversal 1 (°)',70,25,155,'Figura'),P('t2','Inclinación de la transversal 2 (°)',110,25,155,'Figura'),P('gap','Separación entre las transversales (cm)',7,3,12,'Figura',{step:.5}),
  S('form','Proporción','seg','Resolución',[['seg','AB / BC = A′B′ / B′C′'],['alt','AB / A′B′ = BC / B′C′']]),S('find','Segmento que se pide calcular (x)','none','Resolución',[['none','Ninguno (mostrar todas las medidas)'],['AB','AB'],['BC','BC'],['A′B′','A′B′'],['B′C′','B′C′']]),
  ...[0,1,2,3,4,5].map(j=>K('sg'+j,`Segmento ${SEGN[j<3?0:1][j%3]}`,true,'Segmentos visibles',p=>j%3<p.n-1)),K('showVal','Mostrar las medidas',true,'Segmentos visibles'),
  K('showPts','Nombrar los puntos',true,'Mostrar'),K('showMarks','Marcas de paralelismo',true,'Mostrar'),K('showEq','Escribir la proporción',true,'Mostrar'),K('showSteps','Escribir el desarrollo numérico',true,'Mostrar'),Registry.h.UN(),
  C('colL','Color de las paralelas','#1e293b','Estilo'),C('colT1','Color de la transversal 1','#2563eb','Estilo'),C('colT2','Color de la transversal 2','#dc2626','Estilo'),P('strokeW','Grosor de las rectas',3,1,10,'Estilo',{style:true}),P('size','Tamaño de la figura (%)',85,30,100,'Estilo',{style:true}),...ts()],
 render(p,W,H){const n=p.n,fs=p.fontSize,u=p.unit,hs=[p.h1,p.h2,p.h3].slice(0,n-1),dc=[0];hs.forEach(h=>dc.push(dc[dc.length-1]+h));
  const T=[{x:0,th:p.t1,col:p.colT1,nm:['A','B','C','D'],side:-1},{x:p.gap,th:p.t2,col:p.colT2,nm:['A′','B′','C′','D′'],side:1}],pt=(t,k)=>[t.x-dc[k]/Math.tan(t.th*D),-dc[k]],lens=T.map(t=>hs.map(h=>h/Math.sin(t.th*D))),
   xs=T.flatMap(t=>dc.map((_,k)=>pt(t,k)[0])),minX=Math.min(...xs)-2,maxX=Math.max(...xs)+2,bot=-dc[n-1],lw=Math.max(2,p.strokeW*.8),e=1.3;
  const names4=p.form==='seg'?['AB','BC','A′B′','B′C′']:['AB','A′B′','BC','B′C′'],v4=p.form==='seg'?[lens[0][0],lens[0][1],lens[1][0],lens[1][1]]:[lens[0][0],lens[1][0],lens[0][1],lens[1][1]],fi=p.find==='none'?-1:names4.indexOf(p.find),
   Ls=[];const pr=proportion(names4,v4,fi,u);if(p.showEq)Ls.push(pr[0]);if(p.showSteps)Ls.push(...pr.slice(1));
  const below=Ls.length?Ls.length*fs*1.3+fs*.4:0,m=view(p,W,H,Math.max((maxX-minX)/2,(Math.abs(bot)+2.8)/2)*1.12,below,(minX+maxX)/2,bot/2);let g='';
  dc.forEach((d,k)=>{g+=ln(m,[minX,-d],[maxX,-d],p.colL,lw)+(p.showMarks?chev(m,p,[maxX-1,-d],[1,0],p.colL,lw*.8)+chev(m,p,[maxX-1.35,-d],[1,0],p.colL,lw*.8):'')+Draw.t(...m.T([minX+.3,-d+.45]),'L'+'₁₂₃₄'[k],p,{w:700,fs:fs*.8})});
  T.forEach(t=>{const dir=[Math.cos(t.th*D),Math.sin(t.th*D)];g+=ln(m,add(pt(t,0),mul(dir,e)),sub(pt(t,n-1),mul(dir,e)),t.col,lw)});
  T.forEach((t,ti)=>{for(let k=0;k<n-1;k++){const j=ti*3+k;if(!p['sg'+j])continue;const M=m.T(mul(add(pt(t,k),pt(t,k+1)),.5)),nm=SEGN[ti][k];
   g+=Draw.t(M[0]+t.side*fs*.8,M[1],p.showVal?`${nm} = ${p.find===nm?'x':f(lens[ti][k])+' '+u}`:nm,p,{c:t.col,w:700,b:'central',fs:fs*.8,a:t.side<0?'end':'start'})}});
  if(p.showPts)T.forEach(t=>dc.forEach((_,k)=>g+=dot(m,p,pt(t,k),t.nm[k],t.col,[t.side*.9,.5])));
  return Draw.title(p,W)+g+txt(p,W,m,Ls)}});

// ---------- Triángulo cortado por una paralela ----------
const TNAMES={tri:['AD','DB','AE','EC','DE','BC','AB','AC'],x:['AB','AD','AC','AE','BC','DE']};
Registry.register({id:'thales-triangle',category:'theorems',name:'Thales: triángulo y paralela a un lado',icon:'△',description:'Una paralela a un lado de un triángulo determina segmentos proporcionales',
 parameters:[S('fig','Figura','tri','Figura',[['tri','Triángulo cortado (D en AB, E en AC)'],['x','Figura en X (D y E al otro lado de A)']]),P('bc','Lado BC (cm)',6,2,15,'Figura',{step:.5}),P('ab','Lado AB (cm)',5,2,15,'Figura',{step:.5}),P('ac','Lado AC (cm)',4.5,2,15,'Figura',{step:.5}),
  P('k','Razón AD / AB (%)',40,10,95,'Figura'),P('rot','Giro de la figura (°)',0,0,359,'Figura'),
  S('form','Proporción','whole','Resolución',[['whole','Partes con el todo (AD / AB = AE / AC)'],['parts','Partes entre sí (AD / DB = AE / EC)']],p=>p.fig==='tri'),S('find','Segmento que se pide calcular (x)','none','Resolución',[['none','Ninguno (mostrar todas las medidas)'],['AD','AD'],['AE','AE'],['DE','DE'],['BC','BC']]),
  ...[0,1,2,3,4,5,6,7].map(i=>({key:'s'+i,label:p=>`Segmento ${TNAMES[p.fig][i]}`,type:'check',def:i<6,group:'Segmentos visibles',show:p=>i<TNAMES[p.fig].length})),K('showVal','Mostrar las medidas',true,'Segmentos visibles'),
  K('showPts','Nombrar los puntos A, B, C, D y E',true,'Mostrar'),K('showMarks','Marcas de paralelismo',true,'Mostrar'),K('showEq','Escribir la proporción',true,'Mostrar'),K('showSteps','Escribir el desarrollo numérico',true,'Mostrar'),Registry.h.UN(),
  C('colT','Color del triángulo','#fde68a','Estilo'),C('colS','Color del triángulo ADE','#93c5fd','Estilo'),C('stroke','Color de los lados','#1e293b','Estilo'),P('strokeW','Grosor de las líneas',3,1,10,'Estilo',{style:true}),P('op','Opacidad de los colores (%)',80,10,100,'Estilo',{style:true}),P('size','Tamaño de la figura (%)',80,30,100,'Estilo',{style:true}),...ts()],
 normalize(p){const g=(a,b,c)=>Math.min(a,+(b+c-.5).toFixed(1));p.bc=g(p.bc,p.ab,p.ac);p.ab=g(p.ab,p.bc,p.ac);p.ac=g(p.ac,p.bc,p.ab)},
 render(p,W,H){const a=p.bc,c=p.ab,b=p.ac,k=p.k/100,fs=p.fontSize,u=p.unit,th=p.rot*D,R=q=>rot(q,th),Ax=(c*c-b*b+a*a)/(2*a),A0=[Ax,Math.sqrt(Math.max(0,c*c-Ax*Ax))],B0=[0,0],C0=[a,0],X=p.fig==='x',sg=X?-1:1,
   D0=add(A0,mul(sub(B0,A0),sg*k)),E0=add(A0,mul(sub(C0,A0),sg*k)),[A,B,Cc,Dd,E]=[A0,B0,C0,D0,E0].map(R),
   V={AB:c,AC:b,BC:a,AD:k*c,DB:(1-k)*c,AE:k*b,EC:(1-k)*b,DE:k*a},SEG={AD:[A,Dd],DB:[Dd,B],AE:[A,E],EC:[E,Cc],DE:[Dd,E],BC:[B,Cc],AB:[A,B],AC:[A,Cc]},names=TNAMES[p.fig];
  let nm,vv;if(X){nm=['AB','AD','AC','AE'];vv=[c,V.AD,b,V.AE];if(p.find==='BC'||p.find==='DE'){nm=['BC','DE','AB','AD'];vv=[a,V.DE,c,V.AD]}}
  else if(p.form==='parts'&&['AD','AE','none'].includes(p.find)){nm=['AD','DB','AE','EC'];vv=[V.AD,V.DB,V.AE,V.EC]}
  else{nm=['AD','AB','AE','AC'];vv=[V.AD,c,V.AE,b];if(p.find==='DE'||p.find==='BC'){nm=['DE','BC','AD','AB'];vv=[V.DE,a,V.AD,c]}}
  const fi=p.find==='none'?-1:nm.indexOf(p.find),pr=proportion(nm,vv,fi,u),Ls=[];
  if(p.showEq)Ls.push(fi<0&&!(p.form==='parts'&&!X)?(X?'AB / AD = AC / AE = BC / DE':'AD / AB = AE / AC = DE / BC'):pr[0]);
  if(p.showSteps){if(fi<0&&!(p.form==='parts'&&!X))Ls.push(X?`${f(c)} / ${f(V.AD)} = ${f(b)} / ${f(V.AE)} = ${f(a)} / ${f(V.DE)}   (razón = ${f(1/k)})`:`${f(V.AD)} / ${f(c)} = ${f(V.AE)} / ${f(b)} = ${f(V.DE)} / ${f(a)}   (razón = ${f(k)})`);else Ls.push(...pr.slice(1))}
  const all=[A,B,Cc,Dd,E],xs=all.map(q=>q[0]),ys=all.map(q=>q[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),below=Ls.length?Ls.length*fs*1.3+fs*.4:0,
   m=view(p,W,H,Math.max(x1-x0,y1-y0)/2*1.15,below,(x0+x1)/2,(y0+y1)/2),lw=Math.max(2,p.strokeW*.8),cen=[(A[0]+B[0]+Cc[0])/3,(A[1]+B[1]+Cc[1])/3],pl=(q,col)=>`<polygon points="${q.map(z=>m.T(z).join(',')).join(' ')}" fill="${col}" fill-opacity="${p.op/100}" stroke="${p.stroke}" stroke-width="${p.strokeW}" stroke-linejoin="round"/>`;
  let g='';g+=pl([A,B,Cc],p.colT)+pl([A,Dd,E],p.colS)+ln(m,Dd,E,p.stroke,p.strokeW);
  if(p.showMarks){const mk=(P1,P2)=>{const M=add(P1,mul(sub(P2,P1),.14)),d=sub(P2,P1);return chev(m,p,M,d,p.stroke,lw*.8)};g+=mk(Dd,E)+mk(B,Cc)}
  names.forEach((nmz,i)=>{if(!p['s'+i])return;const[P1,P2]=SEG[nmz],whole=!X&&(nmz==='AB'||nmz==='AC'),par=nmz==='DE'||nmz==='BC';
   g+=sideLab(m,p,P1,P2,p.showVal?`${nmz} = ${p.find===nmz?'x':f(V[nmz])+' '+u}`:nmz,p.textColor,par?A:cen,whole?2.4:1.0)});
  if(p.showPts)[[A,'A'],[B,'B'],[Cc,'C'],[Dd,'D'],[E,'E']].forEach(([q,t])=>g+=dot(m,p,q,t,p.stroke,unit(sub(q,cen))));
  return Draw.title(p,W)+g+txt(p,W,m,Ls)}});
})();
