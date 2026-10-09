// Ángulos: ángulo con transportador y rectas cortadas (opuestos por el vértice, correspondientes, alternos, conjugados)
(()=>{
const {P,C,K,S}=Registry.h,ts=()=>Registry.h.ts(26),f=x=>Draw.fmt(x+0),{pol,D}=Draw.v,{view,ln,arc,ang,dot,sq}=Draw.g;
const KINDS=[['acute','Agudo (menor que 90°)'],['right','Recto (90°)'],['obtuse','Obtuso (entre 90° y 180°)'],['straight','Llano (180°)'],['reflex','Cóncavo (entre 180° y 360°)'],['full','Completo (360°)'],['custom','Personalizado (0° a 360°)']];
const PRE={acute:45,right:90,obtuse:120,straight:180,reflex:270,full:360},LIM={acute:[1,89],right:[90,90],obtuse:[91,179],straight:[180,180],reflex:[181,359],full:[360,360],custom:[0,360]};
const CLS=m=>m===0?'Ángulo nulo':m<90?'Ángulo agudo':m===90?'Ángulo recto':m<180?'Ángulo obtuso':m===180?'Ángulo llano':m<360?'Ángulo cóncavo (mayor que 180°)':'Ángulo completo (360°)';
const RNG={acute:'0° < α < 90°',right:'α = 90°',obtuse:'90° < α < 180°',straight:'α = 180°',reflex:'180° < α < 360°',full:'α = 360°'};

// ---------- Ángulo ----------
Registry.register({id:'angle',category:'circles',name:'Ángulo',icon:'∠',description:'Ángulo de cualquier medida, con arco, nombre, transportador y complemento o suplemento',
 parameters:[S('kind','Tipo de ángulo','acute','Ángulo',KINDS),{key:'_t',type:'text',def:'acute',show:()=>false},
  P('m','Medida del ángulo (°)',45,p=>LIM[p.kind][0],p=>LIM[p.kind][1],'Ángulo',{show:p=>!['right','straight','full'].includes(p.kind)}),
  P('ori','Orientación del primer lado (°)',0,0,359,'Ángulo'),S('sent','Sentido de medición','ccw','Ángulo',[['ccw','Antihorario ↺'],['cw','Horario ↻']]),P('len','Largo de los lados',6,3,10,'Ángulo',{step:.5}),
  S('nm','Nombre del ángulo','alpha','Mostrar',[['alpha','α'],['abc','∠ABC'],['none','Sin nombre']]),K('showVal','Mostrar la medida',true,'Mostrar'),K('showPts','Puntos A, B y C',true,'Mostrar'),K('showClass','Escribir la clasificación',false,'Mostrar'),
  K('showComp','Complemento o suplemento (punteado)',false,'Mostrar'),K('prot','Transportador',false,'Mostrar'),K('arrows','Flechas en los lados',true,'Mostrar'),K('fillSec','Rellenar el sector angular',false,'Mostrar'),
  C('col','Color de los lados','#1e293b','Estilo'),C('col2','Color del ángulo','#dc2626','Estilo'),P('strokeW','Grosor de las líneas',3,1,10,'Estilo',{style:true}),P('size','Tamaño (%)',80,30,100,'Estilo',{style:true}),...ts()],
 normalize(p){if(p._t!==p.kind){if(PRE[p.kind]!=null)p.m=PRE[p.kind];p._t=p.kind}const[l,h]=LIM[p.kind];p.m=Math.min(h,Math.max(l,p.m))},
 render(p,W,H){const L=p.len,fs=p.fontSize,sg=p.sent==='ccw'?1:-1,mm=p.m,o=p.ori,V=[0,0],A=pol(o,L),Cc=pol(o+sg*mm,L),ra=L*.32,Rp=L*.92,st=sg>0?o:o-mm,lw=Math.max(2,p.strokeW*.8),
  pts=[V,A,Cc].concat(p.prot?[pol(o+sg*90,Rp),pol(o+sg*180,Rp),pol(o,Rp)]:[]),bx=pts.map(q=>q[0]),by=pts.map(q=>q[1]),cx=(Math.min(...bx)+Math.max(...bx))/2,cy=(Math.min(...by)+Math.max(...by))/2,
  ex=Math.max(Math.max(...bx)-Math.min(...bx),Math.max(...by)-Math.min(...by))/2,below=p.showClass?fs*1.9:0,m=view(p,W,H,Math.max(ex,L*.45)*1.3,below,cx,cy),T=m.T;let g='';
  if(p.prot){const a0=sg>0?o:o-180,col='#0ea5e9';g+=`<path d="${arc(m,V,Rp,a0,180,'sector')}" fill="${col}" fill-opacity=".1" stroke="${col}" stroke-width="1.5"/>`;
   for(let d=0;d<=180;d++){const th=o+sg*d,l=d%10===0?Rp*.12:d%5===0?Rp*.08:Rp*.045,A1=T(pol(th,Rp)),B1=T(pol(th,Rp-l));g+=`<line x1="${A1[0]}" y1="${A1[1]}" x2="${B1[0]}" y2="${B1[1]}" stroke="${col}" stroke-width="${d%10===0?1.6:1}"/>`;
    if(d%10===0){g+=Draw.t(...T(pol(th,Rp*.78)),d,p,{c:col,fs:fs*.5,b:'central'});g+=Draw.t(...T(pol(th,Rp*.6)),180-d,p,{c:col,fs:fs*.4,b:'central'})}}}
  if(p.fillSec&&mm>0)g+=`<path d="${arc(m,V,ra*1.45,st,mm,'sector')}" fill="${p.col2}" fill-opacity=".22"/>`;
  const ray=q=>{const a=T(V),b=T(q);return p.arrows?Draw.arrow(a[0],a[1],b[0],b[1],p.col,lw):ln(m,V,q,p.col,lw)};
  g+=ray(A);if(mm%360!==0)g+=ray(Cc);
  const name=p.nm==='alpha'?'α':p.nm==='abc'?'∠ABC':'',txt=[name,p.showVal?`${f(mm)}°`:''].filter(Boolean).join(' = ');
  if(mm===90)g+=sq(m,V,A,Cc,ra*.7,p.col2,lw)+(txt?Draw.t(...T(pol(o+sg*45,ra*1.6)),txt,p,{c:p.col2,w:700,b:'central',fs:fs*.85}):'');
  else if(mm>0)g+=ang(m,p,V,st,mm,ra,p.col2,txt);
  if(p.showComp&&mm>0&&mm<180){const tgt=mm<90?90:180,cl=tgt-mm,d0=o+sg*tgt,rr=ra*1.45;g+=ln(m,V,pol(d0,L*.85),p.col2,lw*.7,'7 5')+ang(m,{...p,strokeW:p.strokeW*.8},V,sg>0?o+mm:o+sg*tgt,cl,rr,p.col2,`${f(cl)}°`).replace('fill="none"','fill="none" stroke-dasharray="5 4"')}
  if(p.showPts){g+=dot(m,p,A,'A',p.col2)+dot(m,p,V,'B',p.col2,[-.7,-.7]);if(mm%360!==0)g+=dot(m,p,Cc,'C',p.col2)}
  if(p.showClass)g+=Draw.t(W/2,m.tH+m.av+fs*1.3,CLS(mm)+(RNG[p.kind]?` (${RNG[p.kind]})`:''),p,{fs:fs*.85,w:700});
  return Draw.title(p,W)+g}});

// ---------- Rectas cortadas ----------
const POS=[[0,1],[1,0],[2,3],[3,2]];
const RELP={corr:['Ángulos correspondientes',true,[[0,4],[1,5],[2,6],[3,7]]],ai:['Alternos internos',true,[[2,5],[3,4]]],ae:['Alternos externos',true,[[0,7],[1,6]]],ci:['Conjugados internos',false,[[2,4],[3,5]]],ce:['Conjugados externos',false,[[0,6],[1,7]]],opv:['Opuestos por el vértice',true,[[0,3],[1,2],[4,7],[5,6]]]};
const RELX={opv:['Opuestos por el vértice',true,[[0,3],[1,2]]],adj:['Adyacentes (suplementarios)',false,[[0,1],[1,3],[3,2],[2,0]]]};
const PC=['#2563eb','#dc2626','#16a34a','#f59e0b'];
Registry.register({id:'angle-lines',category:'circles',name:'Rectas cortadas por una transversal',icon:'⫽',description:'Dos rectas que se cortan, o dos paralelas y una transversal, con los pares de ángulos',
 parameters:[S('mode','Figura','parallel','Rectas',[['parallel','Dos paralelas y una transversal'],['cross','Dos rectas que se cortan']]),P('theta','Ángulo θ de la transversal (°)',65,10,170,'Rectas'),P('sep','Distancia entre las paralelas',4,2,8,'Rectas',{step:.5,show:p=>p.mode==='parallel'}),
  S('relP','Pares de ángulos a destacar','custom','Ángulos',[['custom','Elegir los ángulos a mano'],...Object.entries(RELP).map(([k,v])=>[k,v[0]])],p=>p.mode==='parallel'),
  S('relX','Pares de ángulos a destacar','custom','Ángulos',[['custom','Elegir los ángulos a mano'],...Object.entries(RELX).map(([k,v])=>[k,v[0]])],p=>p.mode==='cross'),
  ...[...Array(8).keys()].map(i=>K('ang'+i,`Ángulo ∠${i+1}`,i<4,'Ángulos visibles',p=>(p.mode==='parallel'?p.relP:p.relX)==='custom'&&i<(p.mode==='parallel'?8:4))),
  K('showVal','Mostrar la medida de cada ángulo',true,'Mostrar'),K('showRel','Escribir la relación entre los ángulos',true,'Mostrar'),K('showNames','Nombrar las rectas (L₁, L₂, T)',true,'Mostrar'),
  C('col','Color de las rectas','#1e293b','Estilo'),P('strokeW','Grosor de las rectas',3,1,10,'Estilo',{style:true}),P('size','Tamaño (%)',85,30,100,'Estilo',{style:true}),...ts(24)],
 render(p,W,H){const par=p.mode==='parallel',th=p.theta,s=Math.sin(th*D),cot=Math.cos(th*D)/s,sep=par?p.sep:0,fs=p.fontSize,V1=[0,sep/2],V2=par?[-sep*cot,-sep/2]:null,Lh=Math.max(5,(par?Math.abs(sep*cot):0)+3.5),
  e=Math.max(par?sep/s*.5+1:3,2.4),u=pol(th),tA=[V1[0]+u[0]*e,V1[1]+u[1]*e],tB=par?[V2[0]-u[0]*e,V2[1]-u[1]*e]:[V1[0]-u[0]*e,V1[1]-u[1]*e],
  ends=[[-Lh,V1[1]],[Lh,V1[1]],tA,tB].concat(par?[[-Lh,-sep/2],[Lh,-sep/2]]:[]),bx=ends.map(q=>q[0]),by=ends.map(q=>q[1]),cx=(Math.min(...bx)+Math.max(...bx))/2,cy=(Math.min(...by)+Math.max(...by))/2,
  ex=Math.max(Math.max(...bx)-Math.min(...bx),Math.max(...by)-Math.min(...by))/2,rel=par?p.relP:p.relX,R=rel!=='custom'?(par?RELP:RELX)[rel]:null,below=R&&p.showRel?fs*(R[2].length*1.25+.8):0,
  m=view(p,W,H,ex*1.15,below,cx,cy),lw=Math.max(2,p.strokeW*.8),ra=Math.min(1.15,(par?sep:3.2)*.3+.2);let g='';
  g+=ln(m,[-Lh,V1[1]],[Lh,V1[1]],p.col,lw)+(par?ln(m,[-Lh,-sep/2],[Lh,-sep/2],p.col,lw):'')+ln(m,tA,tB,p.col,lw);
  if(par)[V1[1],-sep/2].forEach(y=>[0,.35].forEach(dx=>{const x=Lh*.8-dx;g+=`<polyline points="${[[x-.22,y+.2],[x,y],[x-.22,y-.2]].map(q=>m.T(q).join(',')).join(' ')}" fill="none" stroke="${p.col}" stroke-width="${lw*.8}"/>`}));
  if(p.showNames){g+=Draw.t(...m.T([Lh*.93,V1[1]+.55]),par?'L₁':'L₁',p,{w:700,fs:fs*.85})+(par?Draw.t(...m.T([Lh*.93,-sep/2+.55]),'L₂',p,{w:700,fs:fs*.85}):'')+Draw.t(...m.T([tA[0]+.4,tA[1]+.2]),'T',p,{w:700,fs:fs*.85})}
  const vals=[180-th,th,th,180-th],vis=i=>R?R[2].flat().includes(i):!!p['ang'+i],pairOf=i=>R?R[2].findIndex(q=>q.includes(i)):-1,starts=[th,0,180,th+180],spans=[180-th,th,th,180-th];
  for(let i=0;i<(par?8:4);i++){if(!vis(i))continue;const Vx=i<4?V1:V2,q=i%4,pi=pairOf(i),col=pi>=0?PC[pi%4]:(q===1||q===2?'#2563eb':'#dc2626');
   g+=ang(m,p,Vx,starts[q],spans[q],ra,col,`∠${i+1}${p.showVal?' = '+f(vals[q])+'°':''}`)}
  if(R&&p.showRel)R[2].forEach((pr,i)=>g+=Draw.t(W/2,m.tH+m.av+fs*1.25+i*fs*1.25,`${R[0]}: ∠${pr[0]+1} ${R[1]?'=':'+'} ∠${pr[1]+1}${R[1]?'':' = 180°'}${p.showVal?`  (${f(vals[pr[0]%4])}° ${R[1]?'=':'+'} ${f(vals[pr[1]%4])}°)`:''}`,{...p,textColor:PC[i%4]},{fs:fs*.8,w:700}));
  return Draw.title(p,W)+g}});
})();
