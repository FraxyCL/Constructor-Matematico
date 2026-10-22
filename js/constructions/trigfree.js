// Triángulo rectángulo a medida: cualquier ángulo, cateto e hipotenusa (aunque no sean compatibles); cada medida se muestra u oculta a gusto
(()=>{
const {P,C,K,T,S,M}=Registry.h,ts=()=>Registry.h.ts(24),D=Math.PI/180,{rot,add,sub,mul,unit,pol}=Draw.v,{view,ln,sq,dot,ang,between,sideLab}=Draw.g;
const TN={sin:'sen',cos:'cos',tan:'tan'};
const mkNf=d=>x=>(Math.round(x*10**d)/10**d+0).toLocaleString('es-CL',{maximumFractionDigits:d});
const N=s=>parseFloat(String(s).replace(',','.'));
// Lo escrito: número (5,5), fracción (3/4), raíz (5√3, √2/2) o cualquier texto (x, a, ?)
const parseV=s=>{s=String(s==null?'':s).trim();if(!s)return{t:'',v:null};
 const m=s.replace(/\s+/g,'').match(/^(\d+(?:[.,]\d+)?)?(?:√(\d+(?:[.,]\d+)?))?(?:\/(\d+(?:[.,]\d+)?))?$/);
 if(!m||(!m[1]&&!m[2]))return{t:s,v:null};
 const d=m[3]?N(m[3]):1;if(!d)return{t:s,v:null};
 return{t:s,v:(m[1]?N(m[1]):1)*(m[2]?Math.sqrt(N(m[2])):1)/d}};
const okA=x=>x.v!==null&&x.v>0&&x.v<90,okL=x=>x.v!==null&&x.v>0;

// Resuelve la forma del dibujo y lo que se puede completar; nunca se detiene por datos incompatibles
function solve(p){
 const I={th:parseV(p.theta),ph:parseV(p.phi),op:parseV(p.opp),ad:parseV(p.adj),hy:parseV(p.hyp)};
 const cand={angle:()=>okA(I.th)?I.th.v:okA(I.ph)?90-I.ph.v:null,
  legs:()=>okL(I.op)&&okL(I.ad)?Math.atan2(I.op.v,I.ad.v)/D:null,
  oh:()=>okL(I.op)&&okL(I.hy)&&I.op.v<I.hy.v?Math.asin(I.op.v/I.hy.v)/D:null,
  ah:()=>okL(I.ad)&&okL(I.hy)&&I.ad.v<I.hy.v?Math.acos(I.ad.v/I.hy.v)/D:null};
 const order=['angle','legs','oh','ah'],vals=order.map(k=>cand[k]()).filter(v=>v!==null);
 let th=p.basis!=='auto'?cand[p.basis]():null;if(th===null)th=vals.length?vals[0]:null;
 let bad=false;
 if(vals.length>1&&Math.max(...vals)-Math.min(...vals)>.5)bad=true;
 if(I.th.v!==null&&!okA(I.th))bad=true;if(I.ph.v!==null&&!okA(I.ph))bad=true;
 if(okA(I.th)&&okA(I.ph)&&Math.abs(I.th.v+I.ph.v-90)>.5)bad=true;
 if(okL(I.hy)&&((okL(I.op)&&I.op.v>=I.hy.v)||(okL(I.ad)&&I.ad.v>=I.hy.v)))bad=true;
 const known=th!==null,shape=known?th:35;
 // escala para completar longitudes
 let H=null;if(known){if(okL(I.hy))H=I.hy.v;else if(okL(I.op))H=I.op.v/Math.sin(shape*D);else if(okL(I.ad))H=I.ad.v/Math.cos(shape*D)}
 const C={th:known?shape:null,ph:known?90-shape:null,op:H!==null?H*Math.sin(shape*D):null,ad:H!==null?H*Math.cos(shape*D):null,hy:H};
 return{I,C,shape,known,bad};
}

Registry.register({id:'trig-free',category:'theorems',name:'Triángulo rectángulo a medida',icon:'✏️',description:'Triángulo rectángulo con el ángulo, los catetos y la hipotenusa que tú escribas (incluso valores imposibles), mostrando u ocultando cada medida',
 parameters:[T('theta','Ángulo θ (grados; número, raíz como 5√3, o letra como x)','35','Medidas que escribes'),T('phi','Otro ángulo agudo φ','','Medidas que escribes'),
  T('opp','Cateto opuesto a θ','','Medidas que escribes'),T('adj','Cateto adyacente a θ','','Medidas que escribes'),T('hyp','Hipotenusa','10','Medidas que escribes'),
  K('fill','Calcular los datos que dejo en blanco',true,'Medidas que escribes'),K('showWarn','Avisar si los datos no forman un triángulo posible',true,'Medidas que escribes'),
  S('basis','El dibujo se hace con','auto','Dibujo',[['auto','Lo primero que se pueda (ángulo, luego catetos, luego hipotenusa)'],['angle','El ángulo (θ o φ)'],['legs','Los dos catetos'],['oh','Cateto opuesto e hipotenusa'],['ah','Cateto adyacente e hipotenusa']]),
  S('ref','Ángulo de referencia (θ)','A','Dibujo',[['A','En el vértice A (izquierda)'],['C','En el vértice C (arriba)']]),
  P('rot','Giro de la figura (°)',0,0,359,'Dibujo'),K('flipH','Espejo horizontal (voltear izquierda ↔ derecha)',false,'Dibujo'),K('flipV','Espejo vertical (voltear arriba ↔ abajo)',false,'Dibujo'),
  M('mO','Cateto opuesto','val','Lados: qué texto mostrar'),M('mA','Cateto adyacente','val','Lados: qué texto mostrar'),M('mH','Hipotenusa','val','Lados: qué texto mostrar'),S('lab','Nombre de los lados','words','Lados: qué texto mostrar',[['words','Cateto opuesto, adyacente, hipotenusa'],['letters','a, b, c']]),K('colorSides','Colorear los lados',true,'Lados: qué texto mostrar'),
  M('nT','Ángulo θ','val','Ángulos: qué texto mostrar'),M('nO','El otro ángulo agudo (φ)','val','Ángulos: qué texto mostrar'),M('nR','Ángulo recto (90°)','mark','Ángulos: qué texto mostrar',undefined,Registry.h.LMR),P('arcS','Tamaño del arco del ángulo (%)',100,30,200,'Ángulos: posición del texto',{style:true}),P('angPad','Separación entre el arco y el texto (px)',3,0,30,'Ángulos: posición del texto',{style:true}),K('showPts','Nombrar los vértices A, B y C',true,'Mostrar'),
  K('rsin','Escribir sen θ',false,'Razones a escribir'),K('rcos','Escribir cos θ',false,'Razones a escribir'),K('rtan','Escribir tan θ',false,'Razones a escribir'),P('dec','Decimales de lo calculado',2,0,5,'Razones a escribir'),Registry.h.UN(),
  C('col','Color del triángulo','#fef3c7','Estilo'),C('stroke','Color del contorno','#1e293b','Estilo'),P('strokeW','Grosor del contorno',3,1,10,'Estilo',{style:true}),P('size','Tamaño de la figura (%)',75,30,100,'Estilo',{style:true}),...ts()],
 render(p,W,H){const fs=p.fontSize,u=p.unit,nf=mkNf(p.dec),S0=solve(p),{I,C:Cm,shape,bad}=S0,hy=10,opp=hy*Math.sin(shape*D),adj=hy*Math.cos(shape*D),
  xx=p.ref==='A'?adj:opp,yy=p.ref==='A'?opp:adj,th=p.rot*D,R=q=>rot([p.flipH?-q[0]:q[0],p.flipV?-q[1]:q[1]],th),[A,B,Cc]=[[0,0],[xx,0],[xx,yy]].map(R),
  seg={opp:p.ref==='A'?[B,Cc]:[A,B],adj:p.ref==='A'?[A,B]:[B,Cc],hyp:[A,Cc]},COL={opp:'#dc2626',adj:'#16a34a',hyp:'#2563eb'},W3=p.lab==='words',
  SN={opp:W3?'cateto opuesto':'a',adj:W3?'cateto adyacente':'b',hyp:W3?'hipotenusa':'c'},KEY={opp:'op',adj:'ad',hyp:'hy'};
  // texto de cada medida: lo escrito, o lo calculado si estaba en blanco
  const sideTxt=k=>{const q=I[KEY[k]];if(q.t)return q.v!==null?`${q.t} ${u}`:q.t;return p.fill&&Cm[KEY[k]]!==null?`${nf(Cm[KEY[k]])} ${u}`:''};
  const angTxt=k=>{const q=I[k];if(q.t)return q.v!==null?`${q.t}°`:q.t;return p.fill&&Cm[k]!==null?`${nf(Cm[k])}°`:''};
  const num=k=>I[k].v!==null?I[k].v:(p.fill&&Cm[k]!==null?Cm[k]:null),
   lbl=(mode,name,val)=>val?Draw.lbl(mode,name,val):(mode==='name'||mode==='both'?name:'');
  const Ls=[];
  [['rsin','sin','op','hy','opp','hyp'],['rcos','cos','ad','hy','adj','hyp'],['rtan','tan','op','ad','opp','adj']].forEach(([key,fn,n,d,nn,dd])=>{const a=num(n),b=num(d);if(p[key]&&a!==null&&b!==null&&b!==0)Ls.push(`${TN[fn]} θ = ${SN[nn]} / ${SN[dd]} = ${nf(a)} / ${nf(b)} = ${nf(a/b)}`)});
  if(p.showWarn&&bad)Ls.push('⚠ Estos datos no forman un triángulo rectángulo posible (se dibuja tal como se escribió)');
  const all=[A,B,Cc],xs=all.map(q=>q[0]),ys=all.map(q=>q[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),fl=fs*.78,below=Ls.length?Ls.length*fl*1.35+fs*.4:0,
   m=view(p,W,H,Math.max(x1-x0,y1-y0)/2*1.25,below,(x0+x1)/2,(y0+y1)/2),lw=Math.max(2,p.strokeW*.8),cen=[(A[0]+B[0]+Cc[0])/3,(A[1]+B[1]+Cc[1])/3];
  let g=`<polygon points="${all.map(q=>m.T(q).join(',')).join(' ')}" fill="${p.col}" stroke="${p.stroke}" stroke-width="${p.strokeW}" stroke-linejoin="round"/>`;
  const md={opp:p.mO,adj:p.mA,hyp:p.mH};
  ['opp','adj','hyp'].forEach(k=>{const[P1,P2]=seg[k];if(p.colorSides)g+=ln(m,P1,P2,COL[k],lw*1.3);const t=lbl(md[k],SN[k],sideTxt(k));if(t)g+=sideLab(m,p,P1,P2,t,p.colorSides?COL[k]:p.textColor,cen,1.0)});
  const rr=Math.min(hy*.2,Math.min(xx,yy)*.9)*p.arcS/100,thV=p.ref==='A'?A:Cc,oV=p.ref==='A'?Cc:A;
  // arco + texto pegado al arco: el centro del texto se coloca justo después del arco, sobre la bisectriz, según el tamaño real del texto
  const angle=(V,s0,sp,col,txt)=>{let o=ang(m,p,V,s0,sp,rr,col,'');if(!txt)return o;const fz=fs*.85,w=txt.length*fz*.56,h=fz*1.1,a=m.T(V),b=m.T(add(V,pol(s0+sp/2,1))),dl=Math.hypot(b[0]-a[0],b[1]-a[1])||1,d=[(b[0]-a[0])/dl,(b[1]-a[1])/dl],
    dist=rr*m.k+p.angPad+w/2*Math.abs(d[0])+h/2*Math.abs(d[1]),Q=[a[0]+d[0]*dist,a[1]+d[1]*dist];
   if(sp<30)o+=`<rect x="${Q[0]-w/2-4}" y="${Q[1]-h/2-2}" width="${w+8}" height="${h+4}" rx="${fz*.3}" fill="${p.col}" fill-opacity=".92"/>`;
   return o+Draw.t(Q[0],Q[1],txt,p,{c:col,w:700,b:'central',fs:fz})};
  if(p.nT!=='off'){const[s0,sp]=p.ref==='A'?between(A,B,Cc):between(Cc,B,A);g+=angle(thV,s0,sp,'#7c3aed',lbl(p.nT,'θ',angTxt('th')))}
  if(p.nO!=='off'){const[s0,sp]=p.ref==='A'?between(Cc,B,A):between(A,B,Cc);g+=angle(oV,s0,sp,'#0891b2',lbl(p.nO,'φ',angTxt('ph')))}
  if(p.nR!=='off'){g+=sq(m,B,A,Cc,Math.min(xx,yy,hy*.8)*.15,'#7c3aed',lw);const t=Draw.lbl(p.nR,'γ','90°');if(t)g+=Draw.t(...m.T(add(B,mul(unit(add(sub(A,B),sub(Cc,B))),Math.min(xx,yy,hy*.8)*.34))),t,p,{c:'#7c3aed',w:700,b:'central',fs:fs*.75})}
  if(p.showPts)[[A,'A'],[B,'B'],[Cc,'C']].forEach(([q,t])=>g+=dot(m,p,q,t,p.stroke,unit(sub(q,cen))));
  Ls.forEach((t,i)=>g+=Draw.t(W/2,m.tH+m.av+fl*1.3+i*fl*1.35,t,p,{fs:Math.min(fl,W*.94/(t.length*.5)),c:t[0]==='⚠'?'#b45309':undefined}));
  return Draw.title(p,W)+g}});
})();
