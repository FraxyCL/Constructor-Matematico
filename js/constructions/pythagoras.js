// Teorema de Pitágoras: figura con cuadrados sobre los lados (con resolución de un lado desconocido) y demostración visual por reordenamiento
(()=>{
const {P,C,K,S}=Registry.h,ts=()=>Registry.h.ts(24),f=x=>Draw.fmt(x+0),{D,add,sub,mul,unit,rot}=Draw.v,{view,ln,sq,dot,ang,between,sideLab}=Draw.g;
const TR={'345':[3,4],'51213':[5,12],'81517':[8,15],'72425':[7,24],'6810':[6,8]};
const trip=()=>[S('trip','Terna / medidas','345','Triángulo',[['345','Terna 3 · 4 · 5'],['51213','Terna 5 · 12 · 13'],['81517','Terna 8 · 15 · 17'],['72425','Terna 7 · 24 · 25'],['6810','Terna 6 · 8 · 10'],['custom','Medidas libres']]),{key:'_t',type:'text',def:'345',show:()=>false},
 P('a','Cateto a (cm)',3,1,25,'Triángulo',{step:.5}),P('b','Cateto b (cm)',4,1,25,'Triángulo',{step:.5})];
const tripNorm=p=>{if(p._t!==p.trip){if(TR[p.trip]){p.a=TR[p.trip][0];p.b=TR[p.trip][1]}p._t=p.trip}else if(TR[p.trip]&&(p.a!==TR[p.trip][0]||p.b!==TR[p.trip][1])){p.trip='custom';p._t='custom'}};
const poly=(m,pts,fill,p)=>`<polygon points="${pts.map(q=>m.T(q).join(',')).join(' ')}" fill="${fill}" fill-opacity="${p.op/100}" stroke="${p.stroke}" stroke-width="${p.strokeW}" stroke-linejoin="round"/>`;
const style=()=>[C('colTri','Color del triángulo','#fde68a','Estilo'),C('colA','Color del cuadrado de a','#93c5fd','Estilo'),C('colB','Color del cuadrado de b','#86efac','Estilo'),C('colC','Color del cuadrado de c','#fca5a5','Estilo'),C('stroke','Color del contorno','#1e293b','Estilo'),
 P('strokeW','Grosor del contorno',3,1,10,'Estilo',{style:true}),P('op','Opacidad de los colores (%)',85,10,100,'Estilo',{style:true}),P('size','Tamaño de la figura (%)',80,30,100,'Estilo',{style:true}),...ts()];

Registry.register({id:'pyth',category:'theorems',name:'Teorema de Pitágoras',icon:'📐',description:'Triángulo rectángulo con cuadrados sobre los lados, cálculo de un lado desconocido y desarrollo',
 parameters:[...trip(),S('find','Lado que se pide calcular (x)','none','Resolución',[['none','Ninguno (mostrar todas las medidas)'],['c','Hipotenusa c'],['a','Cateto a'],['b','Cateto b']]),P('rot','Giro de la figura (°)',0,0,359,'Triángulo'),
  K('squares','Cuadrados sobre los lados',true,'Cuadrados'),K('sqLabel','Área de cada cuadrado',true,'Cuadrados',p=>p.squares),K('sqGrid','Cuadrícula unitaria dentro de los cuadrados',false,'Cuadrados',p=>p.squares),
  K('lsA','Lado a',true,'Lados visibles'),K('lsB','Lado b',true,'Lados visibles'),K('lsC','Lado c',true,'Lados visibles'),K('showVal','Mostrar las medidas',true,'Lados visibles'),
  K('anA','Ángulo en A (α)',false,'Ángulos visibles'),K('anB','Ángulo en B (β)',false,'Ángulos visibles'),K('anC','Ángulo recto en C',true,'Ángulos visibles'),
  K('showPts','Nombrar los vértices A, B y C',true,'Mostrar'),K('showEq','Escribir el teorema',true,'Mostrar'),K('showSteps','Escribir el desarrollo numérico',true,'Mostrar'),Registry.h.UN(),...style()],
 normalize:tripNorm,
 render(p,W,H){const a=p.a,b=p.b,c=Math.hypot(a,b),u=p.unit,fs=p.fontSize,th=p.rot*D,R=q=>rot(q,th),Ap=[0,b],Bp=[a,0],Cp=[0,0],nn=[b/c,a/c],
  S0=p.squares?{a:[Cp,Bp,[a,-a],[0,-a]],b:[Cp,Ap,[-b,b],[-b,0]],c:[Ap,Bp,add(Bp,mul(nn,c)),add(Ap,mul(nn,c))]}:{},SQ={};Object.keys(S0).forEach(k=>SQ[k]=S0[k].map(R));
  const T3=[Ap,Bp,Cp].map(R),[A,B,Cc]=T3,all=[...T3,...Object.values(SQ).flat()],xs=all.map(q=>q[0]),ys=all.map(q=>q[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),
   real={a,b,c},val=k=>p.find===k?'x':f(real[k])+' '+u,sqv=k=>p.find===k?'x²':f(real[k]**2)+' '+u+'²',Ls=[];
  if(p.showEq)Ls.push(p.find==='none'?'a² + b² = c²':p.find==='c'?'c² = a² + b²':p.find==='a'?'a² = c² − b²':'b² = c² − a²');
  if(p.showSteps){if(p.find==='none')Ls.push(`${f(a)}² + ${f(b)}² = ${f(a*a)} + ${f(b*b)} = ${f(a*a+b*b)} = ${f(c)}²`);else if(p.find==='c')Ls.push(`c = √(${f(a)}² + ${f(b)}²) = √${f(a*a+b*b)} = ${f(c)} ${u}`);
   else if(p.find==='a')Ls.push(`a = √(${f(c)}² − ${f(b)}²) = √${f(c*c-b*b)} = ${f(a)} ${u}`);else Ls.push(`b = √(${f(c)}² − ${f(a)}²) = √${f(c*c-a*a)} = ${f(b)} ${u}`);
   if([a,b,c].every(v=>Math.abs(v-Math.round(v))<1e-9))Ls.push('Los tres lados son enteros: es una terna pitagórica')}
  const below=Ls.length?Ls.length*fs*1.3+fs*.4:0,m=view(p,W,H,Math.max(x1-x0,y1-y0)/2*1.12,below,(x0+x1)/2,(y0+y1)/2),lw=Math.max(2,p.strokeW*.8),cen=[(A[0]+B[0]+Cc[0])/3,(A[1]+B[1]+Cc[1])/3];let g='';
  [['a',p.colA],['b',p.colB],['c',p.colC]].forEach(([k,col])=>{if(SQ[k])g+=poly(m,SQ[k],col,p)});g+=poly(m,T3,p.colTri,p);
  if(p.squares&&p.sqGrid){const G=(O,uu,vv,s)=>{let o='';for(let i=1;i<s;i++){const o1=add(O,mul(uu,i)),o2=add(O,mul(vv,i));o+=ln(m,R(o1),R(add(o1,mul(vv,s))),p.stroke,1,0,'stroke-opacity=".45"')+ln(m,R(o2),R(add(o2,mul(uu,s))),p.stroke,1,0,'stroke-opacity=".45"')}return o};
   g+=G(Cp,[1,0],[0,-1],a)+G(Cp,[0,1],[-1,0],b)+G(Ap,unit(sub(Bp,Ap)),nn,c)}
  const lsOn={a:p.lsA,b:p.lsB,c:p.lsC},sd=k=>p.showVal?`${k} = ${val(k)}`:k;
  if(!p.squares)[['a',B,Cc],['b',Cc,A],['c',A,B]].forEach(([k,P1,P2])=>{if(lsOn[k])g+=sideLab(m,p,P1,P2,sd(k),p.stroke,cen,1.1)});
  else[['a','a²'],['b','b²'],['c','c²']].forEach(([k,nm])=>{const q=SQ[k],cc=m.T([q.reduce((s,z)=>s+z[0],0)/4,q.reduce((s,z)=>s+z[1],0)/4]),ls=[];if(lsOn[k])ls.push(sd(k));if(p.sqLabel)ls.push(`${nm} = ${sqv(k)}`);
   ls.forEach((t,i)=>g+=Draw.t(cc[0],cc[1]+(i-(ls.length-1)/2)*fs*1.15,t,p,{b:'central',w:700,fs:fs*.8}))});
  const aA=Math.atan2(a,b)/D,aB=Math.atan2(b,a)/D,rr=Math.min(a,b)*.2;
  if(p.anA){const[s0,sp]=between(A,B,Cc);g+=ang(m,p,A,s0,sp,rr,'#dc2626',p.showVal?`α = ${f(aA)}°`:'α')}if(p.anB){const[s0,sp]=between(B,A,Cc);g+=ang(m,p,B,s0,sp,rr,'#2563eb',p.showVal?`β = ${f(aB)}°`:'β')}
  if(p.anC)g+=sq(m,Cc,B,A,Math.min(a,b)*.16,'#dc2626',lw);
  if(p.showPts)[[A,'A'],[B,'B'],[Cc,'C']].forEach(([q,nm])=>g+=dot(m,p,q,nm,p.stroke,unit(sub(q,cen))));
  Ls.forEach((t,i)=>g+=Draw.t(W/2,m.tH+m.av+fs*1.2+i*fs*1.3,t,p,{fs:fs*.9,w:i===0&&p.showEq?700:400}));
  return Draw.title(p,W)+g}});

// ---------- Demostración visual ----------
Registry.register({id:'pyth-proof',category:'theorems',name:'Pitágoras: demostración visual',icon:'🧩',description:'Cuatro triángulos iguales ordenados de dos maneras dentro de un cuadrado de lado a + b',
 parameters:[...trip(),S('variant','Disposición','both','Figura',[['both','Las dos, lado a lado'],['c','Cuadrado inclinado (c²)'],['ab','Dos cuadrados (a² y b²)']]),
  K('showLab','Medidas a y b bajo la base',true,'Mostrar'),K('showAreas','Área de cada región',true,'Mostrar'),K('showText','Escribir la igualdad de áreas',true,'Mostrar'),Registry.h.UN(),...style()],
 normalize:tripNorm,
 render(p,W,H){const a=p.a,b=p.b,c=Math.hypot(a,b),s=a+b,u=p.unit,fs=p.fontSize,both=p.variant==='both',gap=s*.3,panels=both?['c','ab']:[p.variant],polys=[],labs=[],Ls=[];
  panels.forEach((v,i)=>{const o=both?i*(s+gap):0,X=(x,y)=>[o+x,y];
   if(v==='c'){const P1=X(a,0),P2=X(s,a),P3=X(s-a,s),P4=X(0,s-a);polys.push([[P1,P2,P3,P4],p.colC]);[[X(0,0),P1,P4],[X(s,0),P2,P1],[X(s,s),P3,P2],[X(0,s),P4,P3]].forEach(t=>polys.push([t,p.colTri]));labs.push([X(s/2,s/2),'c²',c*c])}
   else{polys.push([[X(0,0),X(a,0),X(a,a),X(0,a)],p.colA],[[X(a,a),X(s,a),X(s,s),X(a,s)],p.colB]);[[X(0,a),X(a,a),X(a,s)],[X(0,a),X(a,s),X(0,s)],[X(a,0),X(s,0),X(s,a)],[X(a,0),X(s,a),X(a,a)]].forEach(t=>polys.push([t,p.colTri]));labs.push([X(a/2,a/2),'a²',a*a],[X(a+b/2,a+b/2),'b²',b*b])}});
  if(p.showText){Ls.push(`Cuadrado grande: (a + b)² = ${f(s*s)} ${u}²`);if(panels.includes('c'))Ls.push(`c² + 4·(a·b/2) = ${f(c*c)} + ${f(2*a*b)} = ${f(s*s)}`);if(panels.includes('ab'))Ls.push(`a² + b² + 4·(a·b/2) = ${f(a*a)} + ${f(b*b)} + ${f(2*a*b)} = ${f(s*s)}`);if(both)Ls.push(`Por lo tanto: c² = a² + b²   →   ${f(c*c)} = ${f(a*a)} + ${f(b*b)}`)}
  const tw=both?2*s+gap:s,below=Ls.length?Ls.length*fs*1.3+fs*.4:0,m=view(p,W,H,Math.max(tw,s)/2*1.12,below,tw/2,s/2),lw=Math.max(2,p.strokeW*.8);let g='';
  polys.forEach(([q,col])=>g+=poly(m,q,col,p));panels.forEach((_,i)=>{const o=both?i*(s+gap):0;g+=`<polygon points="${[[o,0],[o+s,0],[o+s,s],[o,s]].map(q=>m.T(q).join(',')).join(' ')}" fill="none" stroke="${p.stroke}" stroke-width="${p.strokeW*1.4}" stroke-linejoin="round"/>`;
   if(p.showLab){const t1=m.T([o+a/2,0]),t2=m.T([o+a+b/2,0]);g+=Draw.t(t1[0],t1[1]+fs*1.2,`a = ${f(a)} ${u}`,p,{fs:fs*.8,w:700})+Draw.t(t2[0],t2[1]+fs*1.2,`b = ${f(b)} ${u}`,p,{fs:fs*.8,w:700})}});
  if(p.showAreas)labs.forEach(([q,nm,v])=>g+=Draw.t(...m.T(q),`${nm} = ${f(v)}`,p,{b:'central',w:700,fs:fs*.85}));
  Ls.forEach((t,i)=>g+=Draw.t(W/2,m.tH+m.av+fs*1.4+i*fs*1.3,t,p,{fs:fs*.85,w:i===Ls.length-1&&both?700:400}));
  return Draw.title(p,W)+g}});
})();
