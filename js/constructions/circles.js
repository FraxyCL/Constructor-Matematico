// Circunferencia: círculo y sus elementos, tangentes desde un punto, ángulos en la circunferencia, dos circunferencias y corona circular
(()=>{
const {P,C,K,M,S}=Registry.h;
const ts=()=>Registry.h.ts(24);
const UN=()=>({key:'unit',label:'Unidad de medida',type:'text',def:'cm',group:'Mostrar'});
const xp=(key,label,show)=>({...Registry.extParam(key,label,show),group:'Rectas'});
const circStyle=()=>[C('fill','Color de relleno','#93c5fd','Estilo'),P('op','Opacidad del relleno (%)',35,0,100,'Estilo',{style:true}),C('stroke','Color del contorno','#1e3a8a','Estilo'),P('strokeW','Grosor de línea',3,1,12,'Estilo',{style:true}),P('size','Tamaño de la figura (%)',80,30,100,'Estilo',{style:true}),...ts()];
const D=Math.PI/180,f=x=>Draw.fmt(x+0),{add,sub,mul,len,unit,pol,span}=Draw.v,
 CL={rad:'#dc2626',dia:'#16a34a',cho:'#9333ea',arc:'#f59e0b',sec:'#0891b2',tan:'#ea580c',ext:'#64748b',sct:'#a855f7',seg:'#14b8a6'};
const {X2,defs,view,ln,lineS,arc,ang,between,dot,lab,sq,circ}=Draw.g;

// ---------- Circunferencia y círculo ----------
Registry.register({id:'circle',category:'circles',name:'Circunferencia y círculo',icon:'⭕',description:'Radio, diámetro, cuerda, arco, secante, tangente, recta exterior, sector y segmento',
 parameters:[{key:'kind',label:'Figura',type:'select',def:'circ',group:'Figura',options:[['circ','Circunferencia (solo contorno)'],['disc','Círculo (con relleno)']]},P('r','Radio (cm)',4,1,10,'Figura',{step:.5}),
  K('showCenter','Centro O',true,'Elementos'),K('showRad','Radio',true,'Elementos'),P('radAng','Ángulo del radio (°)',40,0,359,'Elementos',{show:p=>p.showRad}),M('lmRad','Texto del radio','both','Elementos',p=>p.showRad),
  K('showDia','Diámetro',false,'Elementos'),P('diaAng','Ángulo del diámetro (°)',0,0,179,'Elementos',{show:p=>p.showDia}),M('lmDia','Texto del diámetro','both','Elementos',p=>p.showDia),
  K('showCho','Cuerda',false,'Elementos'),P('c1','Extremo 1 de la cuerda (°)',200,0,359,'Elementos',{show:p=>p.showCho}),P('c2','Extremo 2 de la cuerda (°)',340,0,359,'Elementos',{show:p=>p.showCho}),M('lmCho','Texto de la cuerda','both','Elementos',p=>p.showCho),
  K('showArc','Arco',false,'Elementos'),P('a1','Inicio del arco (°)',30,0,359,'Elementos',{show:p=>p.showArc}),P('a2','Fin del arco (°)',120,0,359,'Elementos',{show:p=>p.showArc}),M('lmArc','Texto del arco','both','Elementos',p=>p.showArc),
  K('showSec','Secante',false,'Rectas'),P('s1','Primer punto de corte (°)',110,0,359,'Rectas',{show:p=>p.showSec}),P('s2','Segundo punto de corte (°)',250,0,359,'Rectas',{show:p=>p.showSec}),xp('xSec','Prolongar secante (%)',p=>p.showSec),
  K('showTan','Tangente',false,'Rectas'),P('tAng','Punto de tangencia (°)',270,0,359,'Rectas',{show:p=>p.showTan}),K('showPerp','Radio y ángulo recto en la tangencia',true,'Rectas',p=>p.showTan),xp('xTan','Prolongar tangente (%)',p=>p.showTan),
  K('showExt','Recta exterior',false,'Rectas'),P('extDist','Distancia de la recta al centro (cm)',6,p=>p.r+.5,20,'Rectas',{step:.5,show:p=>p.showExt}),P('extAng','Orientación de la recta (°)',60,0,359,'Rectas',{show:p=>p.showExt}),xp('xExt','Prolongar recta exterior (%)',p=>p.showExt),
  K('showSct','Sector circular',false,'Regiones'),P('sA1','Inicio del sector (°)',0,0,359,'Regiones',{show:p=>p.showSct}),P('sA2','Fin del sector (°)',60,0,359,'Regiones',{show:p=>p.showSct}),M('lmSct','Texto del sector','val','Regiones',p=>p.showSct),
  K('showSeg','Segmento circular',false,'Regiones'),P('gA1','Inicio del segmento (°)',200,0,359,'Regiones',{show:p=>p.showSeg}),P('gA2','Fin del segmento (°)',340,0,359,'Regiones',{show:p=>p.showSeg}),
  K('showPts','Puntos con nombre (A, B, C…)',true,'Mostrar'),K('showPA','Mostrar longitud y área',false,'Mostrar'),UN(),...circStyle()],
 normalize(p){p.extDist=Math.max(p.extDist,p.r+.5)},
 render(p,W,H){const r=p.r,fs=p.fontSize,disc=p.kind==='disc',u=p.unit,below=p.showPA?fs*(disc?3.4:1.9):0,E=Math.max(1.4*r,p.showExt?p.extDist*1.1:0),m=view(p,W,H,E,below),O=[0,0],lw=Math.max(2,p.strokeW*.8),
  sA=span(p.sA1,p.sA2),sG=span(p.gA1,p.gA2),sR=span(p.a1,p.a2);let g=defs(W,H),pts='',lb='';
  if(disc)g+=circ(m,O,r,`fill="${p.fill}" fill-opacity="${p.op/100}"`);
  if(p.showSct&&sA>0)g+=`<path d="${arc(m,O,r,p.sA1,sA,'sector')}" fill="${CL.sct}" fill-opacity=".5"/>`;
  if(p.showSeg&&sG>0)g+=`<path d="${arc(m,O,r,p.gA1,sG,'chord')}" fill="${CL.seg}" fill-opacity=".5"/>`;
  g+=circ(m,O,r,`fill="none" stroke="${p.stroke}" stroke-width="${p.strokeW}"`);
  if(p.showArc&&sR>0)g+=`<path d="${arc(m,O,r,p.a1,sR)}" fill="none" stroke="${CL.arc}" stroke-width="${p.strokeW*1.8}" stroke-linecap="round"/>`;
  const line=(a,b,col,x)=>lineS(m,Registry.seg(a,b,col,undefined,x),col,lw);
  if(p.showSec){const S=pol(p.s1,r),T=pol(p.s2,r),d=unit(sub(T,S));if(len(sub(T,S))>1e-6)g+=line(sub(S,mul(d,.3*r)),add(T,mul(d,.3*r)),CL.sec,p.xSec)}
  if(p.showExt){const F=pol(p.extAng,p.extDist),v=pol(p.extAng+90);g+=line(sub(F,mul(v,.9*r)),add(F,mul(v,.9*r)),CL.ext,p.xExt)}
  if(p.showTan){const T=pol(p.tAng,r),v=pol(p.tAng+90);g+=line(sub(T,mul(v,.9*r)),add(T,mul(v,.9*r)),CL.tan,p.xTan);if(p.showPerp)g+=ln(m,O,T,CL.tan,lw*.7,'6 4')+sq(m,T,O,add(T,v),Math.min(.5,.15*r),CL.tan,lw)}
  if(p.showCho)g+=ln(m,pol(p.c1,r),pol(p.c2,r),CL.cho,lw);
  if(p.showDia)g+=ln(m,pol(p.diaAng+180,r),pol(p.diaAng,r),CL.dia,lw);
  if(p.showRad)g+=ln(m,O,pol(p.radAng,r),CL.rad,lw);
  {const tx=(k,nm,v)=>Draw.lbl(p[k],nm,v),L1=tx('lmRad','r',`${f(r)} ${u}`),L2=tx('lmDia','d',`${f(2*r)} ${u}`);
   if(p.showRad&&L1)lb+=lab(m,p,pol(p.radAng,r/2),pol(p.radAng+90),L1,CL.rad);
   if(p.showDia&&L2)lb+=lab(m,p,pol(p.diaAng,r/2),pol(p.diaAng-90),L2,CL.dia);
   if(p.showCho){const M0=mul(add(pol(p.c1,r),pol(p.c2,r)),.5),L3=tx('lmCho','DE',`${f(2*r*Math.sin(span(p.c1,p.c2)/2*D))} ${u}`);if(L3)lb+=lab(m,p,M0,len(M0)>1e-6?unit(M0):[0,1],L3,CL.cho)}
   if(p.showArc&&sR>0){const L4=tx('lmArc','arco FG',`${f(sR)}°`);if(L4)lb+=lab(m,p,pol(p.a1+sR/2,r),pol(p.a1+sR/2),L4,CL.arc)}
   if(p.showSct&&sA>0){const L5=tx('lmSct','α',`${f(sA)}°`);if(L5)lb+=lab(m,p,pol(p.sA1+sA/2,r*.55),[0,0],L5,'#fff')}}
  if(p.showCenter)pts+=dot(m,p,O,p.showPts?'O':'',p.stroke,[-.7,-.7]);
  if(p.showPts){const d=(a,n,c)=>pts+=dot(m,p,pol(a,r),n,c);
   if(p.showRad)d(p.radAng,'A',CL.rad);if(p.showDia){d(p.diaAng+180,'B',CL.dia);d(p.diaAng,'C',CL.dia)}if(p.showCho){d(p.c1,'D',CL.cho);d(p.c2,'E',CL.cho)}
   if(p.showArc){d(p.a1,'F',CL.arc);d(p.a2,'G',CL.arc)}if(p.showSec){d(p.s1,'H',CL.sec);d(p.s2,'I',CL.sec)}if(p.showTan)d(p.tAng,'T',CL.tan)}
  if(p.showPA){const y=m.tH+m.av+fs*1.3;g+=Draw.t(W/2,y,`Longitud de la circunferencia: L = 2·π·r = ${f(2*Math.PI*r)} ${u}`,p,{fs:fs*.8});if(disc)g+=Draw.t(W/2,y+fs*1.2,`Área del círculo: A = π·r² = ${f(Math.PI*r*r)} ${u}²`,p,{fs:fs*.8})}
  return Draw.title(p,W)+g+pts+lb}});

// ---------- Tangentes desde un punto exterior ----------
Registry.register({id:'circle-tangents',category:'circles',name:'Tangentes desde un punto exterior',icon:'⌖',description:'Las dos tangentes trazadas desde un punto exterior, con radios y ángulos rectos',
 parameters:[P('r','Radio (cm)',3,1,10,'Figura',{step:.5}),P('dist','Distancia del punto P al centro (cm)',7,p=>p.r+.5,20,'Figura',{step:.5}),P('ang','Posición del punto P (°)',0,0,359,'Figura'),K('showDisc','Rellenar círculo',true,'Figura'),
  K('showOP','Segmento OP',true,'Elementos'),K('showRadii','Radios a los puntos de tangencia',true,'Elementos'),K('showRight','Ángulos rectos',true,'Elementos'),xp('xTan','Prolongar tangentes (%)'),
  K('showPts','Puntos con nombre (O, P, T₁, T₂)',true,'Mostrar'),K('showLen','Mostrar PT₁ = PT₂',true,'Mostrar'),UN(),...circStyle()],
 normalize(p){p.dist=Math.max(p.dist,p.r+.5)},
 render(p,W,H){const r=p.r,d=p.dist,fs=p.fontSize,al=Math.acos(r/d)/D,O=[0,0],Pp=pol(p.ang,d),T1=pol(p.ang+al,r),T2=pol(p.ang-al,r),c=pol(p.ang,(d-r)/2),m=view(p,W,H,(d+r)/2*1.3,p.showLen?fs*1.8:0,c[0],c[1]),lw=Math.max(2,p.strokeW*.8);
  let g=defs(W,H);if(p.showDisc)g+=circ(m,O,r,`fill="${p.fill}" fill-opacity="${p.op/100}"`);g+=circ(m,O,r,`fill="none" stroke="${p.stroke}" stroke-width="${p.strokeW}"`);
  if(p.showOP)g+=ln(m,O,Pp,CL.ext,lw*.7,'6 4');
  if(p.showRadii)g+=ln(m,O,T1,CL.rad,lw)+ln(m,O,T2,CL.rad,lw);
  [T1,T2].forEach(T=>{g+=lineS(m,Registry.seg(Pp,T,CL.tan,undefined,p.xTan),CL.tan,lw);if(p.showRight)g+=sq(m,T,O,Pp,Math.min(.5,.15*r),CL.tan,lw)});
  if(p.showPts)g+=dot(m,p,O,'O',p.stroke,[-.7,-.7])+dot(m,p,Pp,'P',CL.tan,pol(p.ang))+dot(m,p,T1,'T₁',CL.tan)+dot(m,p,T2,'T₂',CL.tan);
  if(p.showLen)g+=Draw.t(W/2,m.tH+m.av+fs*1.3,`PT₁ = PT₂ = √(OP² − r²) = ${f(Math.sqrt(d*d-r*r))} ${p.unit}`,p,{fs:fs*.85});
  return Draw.title(p,W)+g}});

// ---------- Ángulos en la circunferencia ----------
Registry.register({id:'circle-angles',category:'circles',name:'Ángulos en la circunferencia',icon:'∠',description:'Ángulo central, inscrito y semiinscrito, con su arco y la relación entre ellos',
 parameters:[{key:'kind',label:'Tipo de ángulo',type:'select',def:'inscribed',group:'Ángulo',options:[['central','Ángulo central'],['inscribed','Ángulo inscrito'],['semi','Ángulo semiinscrito']]},
  P('r','Radio (cm)',4,1,10,'Ángulo',{step:.5}),P('a','Posición del punto A (°)',20,0,359,'Ángulo'),P('b','Posición del punto B (°)',140,0,359,'Ángulo'),P('cAng','Posición del vértice C (°)',260,0,359,'Ángulo',{show:p=>p.kind==='inscribed'}),
  K('showCentral','Mostrar el ángulo central correspondiente',true,'Mostrar',p=>p.kind!=='central'),K('showArc','Resaltar el arco AB',true,'Mostrar'),S('lm','Texto de los ángulos y del arco','val','Mostrar',[['off','Sin texto'],['val','Solo el valor'],['name','Solo el nombre'],['both','Nombre y valor']]),K('showRel','Mostrar la relación (fórmula)',true,'Mostrar'),K('showPts','Puntos con nombre',true,'Mostrar'),K('showDisc','Rellenar círculo',false,'Mostrar'),...circStyle()],
 normalize(p){if(span(p.a,p.b)===0)p.b=(p.a+30)%360;if(p.kind==='inscribed'){const lim=360-span(p.a,p.b),o=span(p.b,p.cAng),mg=Math.min(5,lim/2);if(o<mg||o>lim-mg)p.cAng=Math.round((p.b+lim/2)%360)}},
 render(p,W,H){const r=p.r,fs=p.fontSize,s=span(p.a,p.b),A=pol(p.a,r),B=pol(p.b,r),O=[0,0],Cc=pol(p.cAng,r),m=view(p,W,H,1.45*r,p.showRel?fs*1.9:0),lw=Math.max(2,p.strokeW*.8),val=(x,nm)=>Draw.lbl(p.lm,nm,`${f(x)}°`),rays=(V,Q,col,d)=>Q.map(q=>ln(m,V,q,col,lw,d)).join('');
  let g='',pts='',rel='';if(p.showDisc)g+=circ(m,O,r,`fill="${p.fill}" fill-opacity="${p.op/100}"`);g+=circ(m,O,r,`fill="none" stroke="${p.stroke}" stroke-width="${p.strokeW}"`);
  if(p.showArc)g+=`<path d="${arc(m,O,r,p.a,s)}" fill="none" stroke="${CL.arc}" stroke-width="${p.strokeW*1.8}" stroke-linecap="round"/>`;
  const cen=p.kind==='central'||p.showCentral;
  if(cen)g+=rays(O,[A,B],CL.rad,p.kind==='central'?0:'6 4')+ang(m,p,O,p.a,s,.3*r,CL.rad,val(s,'∠AOB'));
  if(p.kind==='central')rel=`∠AOB = arco AB = ${f(s)}°`;
  else if(p.kind==='inscribed'){g+=rays(Cc,[A,B],CL.dia);const[st,sp]=between(Cc,A,B);g+=ang(m,p,Cc,st,sp,.22*r,CL.dia,val(s/2,'∠ACB'));rel=`∠ACB = ½ · arco AB = ½ · ${f(s)}° = ${f(s/2)}°`}
  else{const v=pol(p.a+90);g+=ln(m,A,B,CL.dia,lw)+ln(m,sub(A,mul(v,.9*r)),add(A,mul(v,.9*r)),CL.tan,lw);const[st,sp]=between(A,add(A,v),B);g+=ang(m,p,A,st,sp,.22*r,CL.dia,val(s/2,'α'));rel=`∠(tangente, AB) = ½ · arco AB = ½ · ${f(s)}° = ${f(s/2)}°`}
  {const at=Draw.lbl(p.lm,'arco AB',`${f(s)}°`);if(p.showArc&&at)g+=lab(m,p,pol(p.a+s/2,r),pol(p.a+s/2),at,CL.arc)}
  if(p.showPts){pts+=dot(m,p,A,'A',p.stroke)+dot(m,p,B,'B',p.stroke);if(cen)pts+=dot(m,p,O,'O',p.stroke,[-.7,-.7]);if(p.kind==='inscribed')pts+=dot(m,p,Cc,'C',p.stroke)}
  if(p.showRel)g+=Draw.t(W/2,m.tH+m.av+fs*1.3,rel,p,{fs:fs*.85});
  return Draw.title(p,W)+g+pts}});

// ---------- Dos circunferencias ----------
Registry.register({id:'circle-two',category:'circles',name:'Dos circunferencias',icon:'∞',description:'Posiciones relativas de dos circunferencias',
 parameters:[P('r1','Radio de la circunferencia 1 (cm)',4,1,10,'Figuras',{step:.5}),P('r2','Radio de la circunferencia 2 (cm)',3,1,10,'Figuras',{step:.5}),P('dist','Distancia entre los centros (cm)',5,0,20,'Figuras',{step:.5}),
  K('showFill','Rellenar círculos',true,'Mostrar'),K('showCen','Centros O₁ y O₂',true,'Mostrar'),K('showLC','Recta de los centros y distancia',true,'Mostrar'),K('showRadii','Radios',false,'Mostrar'),K('showInt','Puntos de intersección o tangencia',true,'Mostrar'),K('showClass','Escribir la posición relativa',true,'Mostrar'),UN(),
  C('c1','Color de la circunferencia 1','#2563eb','Estilo'),C('c2','Color de la circunferencia 2','#dc2626','Estilo'),P('op','Opacidad del relleno (%)',25,0,100,'Estilo',{style:true}),P('strokeW','Grosor de línea',3,1,12,'Estilo',{style:true}),P('size','Tamaño de la figura (%)',80,30,100,'Estilo',{style:true}),...ts()],
 render(p,W,H){const{r1,r2,dist:d}=p,fs=p.fontSize,e=1e-9,x0=Math.min(-r1,d-r2),x1=Math.max(r1,d+r2),hy=Math.max(r1,r2),c=(x0+x1)/2,m=view(p,W,H,Math.max((x1-x0)/2,hy)*1.2,p.showClass?fs*1.8:0,c,0),O1=[0,0],O2=[d,0],lw=Math.max(2,p.strokeW*.8);
  let g='',pts='';const cc=(O,r,col)=>(p.showFill?circ(m,O,r,`fill="${col}" fill-opacity="${p.op/100}"`):'')+circ(m,O,r,`fill="none" stroke="${col}" stroke-width="${p.strokeW}"`);
  g+=cc(O1,r1,p.c1)+cc(O2,r2,p.c2);
  if(p.showLC&&d>e)g+=ln(m,O1,O2,'#64748b',lw*.7,'6 4')+lab(m,p,mul(add(O1,O2),.5),[0,-1],`d = ${f(d)} ${p.unit}`,'#475569');
  if(p.showRadii)g+=ln(m,O1,pol(90,r1),p.c1,lw)+ln(m,O2,add(O2,pol(90,r2)),p.c2,lw)+lab(m,p,pol(90,r1/2),[-1,0],`r₁ = ${f(r1)}`,p.c1)+lab(m,p,add(O2,pol(90,r2/2)),[1,0],`r₂ = ${f(r2)}`,p.c2);
  if(p.showCen)pts+=dot(m,p,O1,'O₁',p.c1,[-.7,-.7])+(d>e?dot(m,p,O2,'O₂',p.c2,[.7,-.7]):'');
  if(p.showInt&&d>e){const a=(r1*r1-r2*r2+d*d)/(2*d),h2=r1*r1-a*a;if(h2>-e&&a>=-r1-e){const h=Math.sqrt(Math.max(0,h2));pts+=h>1e-6?dot(m,p,[a,h],'P','#111827',[0,1])+dot(m,p,[a,-h],'Q','#111827',[0,-1]):dot(m,p,[a,0],'T','#111827',[0,1])}}
  let cl;if(d<e)cl=Math.abs(r1-r2)<e?'Circunferencias coincidentes':'Circunferencias concéntricas';else if(d>r1+r2+e)cl='Circunferencias exteriores';else if(Math.abs(d-r1-r2)<e)cl='Tangentes exteriores';else if(d>Math.abs(r1-r2)+e)cl='Circunferencias secantes';else if(Math.abs(d-Math.abs(r1-r2))<e)cl='Tangentes interiores';else cl='Circunferencias interiores';
  if(p.showClass)g+=Draw.t(W/2,m.tH+m.av+fs*1.3,cl,p,{w:700});
  return Draw.title(p,W)+g+pts}});

// ---------- Corona circular ----------
Registry.register({id:'circle-annulus',category:'circles',name:'Corona circular',icon:'◎',description:'Región entre dos circunferencias concéntricas',
 parameters:[P('R','Radio exterior R (cm)',5,2,10,'Figura',{step:.5}),P('r','Radio interior r (cm)',3,1,p=>p.R-.5,'Figura',{step:.5}),K('showR','Mostrar los radios R y r',true,'Mostrar'),K('showW','Mostrar el ancho (R − r)',false,'Mostrar'),K('showPA','Mostrar el área',false,'Mostrar'),UN(),...circStyle()],
 normalize(p){p.r=Math.min(p.r,p.R-.5)},
 render(p,W,H){const{R,r}=p,fs=p.fontSize,m=view(p,W,H,1.25*R,p.showPA?fs*1.9:0),O=[0,0],o=m.T(O),Rp=R*m.k,rp=r*m.k,lw=Math.max(2,p.strokeW*.8),u=p.unit;
  let g=`<path fill-rule="evenodd" fill="${p.fill}" fill-opacity="${p.op/100}" d="M${o[0]-Rp} ${o[1]}a${Rp} ${Rp} 0 1 0 ${2*Rp} 0a${Rp} ${Rp} 0 1 0 ${-2*Rp} 0ZM${o[0]-rp} ${o[1]}a${rp} ${rp} 0 1 0 ${2*rp} 0a${rp} ${rp} 0 1 0 ${-2*rp} 0Z"/>`+circ(m,O,R,`fill="none" stroke="${p.stroke}" stroke-width="${p.strokeW}"`)+circ(m,O,r,`fill="none" stroke="${p.stroke}" stroke-width="${p.strokeW}"`);
  if(p.showR)g+=ln(m,O,pol(135,R),CL.rad,lw)+ln(m,O,pol(225,r),CL.dia,lw)+lab(m,p,pol(135,R*.75),pol(45),`R = ${f(R)} ${u}`,CL.rad)+lab(m,p,pol(225,r*.5),pol(135),`r = ${f(r)} ${u}`,CL.dia);
  if(p.showW)g+=ln(m,pol(0,r),pol(0,R),CL.arc,lw*1.4)+lab(m,p,pol(0,(R+r)/2),[0,1],`${f(R-r)} ${u}`,CL.arc);
  if(p.showPA)g+=Draw.t(W/2,m.tH+m.av+fs*1.3,`Área de la corona: A = π·(R² − r²) = ${f(Math.PI*(R*R-r*r))} ${u}²`,p,{fs:fs*.85});
  return Draw.title(p,W)+g+dot(m,p,O,'O',p.stroke,[-.7,-.7])}});
})();
