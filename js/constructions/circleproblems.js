// Problemas de circunferencia: ángulos central, inscrito, semiinscrito y del cuadrilátero (mezclables), ángulo interior y exterior,
// teoremas de las cuerdas, de las secantes y de la tangente y la secante. Cada elemento puede ocultarse, mostrarse con valor/nombre o pedirse como incógnita (x, y) con su solución.
(()=>{
const {P,C,K,S}=Registry.h,ts=()=>Registry.h.ts(24),D=Math.PI/180,f=x=>Draw.fmt(x+0),{add,sub,mul,len,unit,pol,rot}=Draw.v,{view,ln,between,dot,lab,circ}=Draw.g;
const CL={arc:'#f59e0b',cen:'#dc2626',ins:'#16a34a',semi:'#ea580c',cyc:'#9333ea',int:'#0891b2',ext:'#2563eb',tan:'#ea580c',a:'#2563eb',b:'#dc2626',c:'#16a34a',d:'#9333ea'};
const Q=[['off','Oculto'],['val','Solo el valor'],['name','Solo el nombre'],['both','Nombre y valor'],['x','Incógnita x'],['y','Incógnita y']];
const Mq=(key,label,def,group,kinds)=>({key,label,def,group,type:'select',options:Q,show:p=>kinds.includes(p.kind)});
const sh=(...k)=>p=>k.includes(p.kind);
const lbl=(mode,name,val)=>mode==='off'?'':mode==='x'?'x':mode==='y'?'y':mode==='val'?val:mode==='name'?name:`${name} = ${val}`;
const isect=(p1,d1,p2,d2)=>{const c=d1[0]*d2[1]-d1[1]*d2[0],t=((p2[0]-p1[0])*d2[1]-(p2[1]-p1[1])*d2[0])/c;return add(p1,mul(d1,t))};
const N4='ABCD';

Registry.register({id:'circle-problems',category:'circles',name:'Ángulos y teoremas de la circunferencia',icon:'🎯',description:'Ángulos central, inscrito, semiinscrito, interior y exterior; teoremas de las cuerdas, de las secantes y de la tangente y la secante. Con incógnita x o y y su solución',
 parameters:[
  {key:'kind',label:'Tipo de problema',type:'select',def:'mix',group:'Problema',options:[['mix','Ángulos central, inscrito, semiinscrito y del cuadrilátero (mezclados)'],['int','Ángulo interior (dos cuerdas que se cortan)'],['ext','Ángulo exterior (secantes y tangentes)'],['chords','Teorema de las cuerdas'],['secants','Teorema de las secantes'],['tansec','Teorema de la tangente y la secante']]},
  {key:'extType',label:'Rectas que forman el ángulo exterior',type:'select',def:'ss',group:'Problema',show:sh('ext'),options:[['ss','Dos secantes'],['ts','Tangente y secante'],['tt','Dos tangentes']]},
  // arcos
  P('a1','Arco AB (°)',80,10,340,'Medidas',{show:sh('mix','int')}),P('a2','Arco BC (°)',100,10,340,'Medidas',{show:sh('mix','int')}),P('a3','Arco CD (°)',70,10,340,'Medidas',{show:sh('mix','int')}),
  P('exN','Arco menor / cercano (°)',50,10,170,'Medidas',{show:sh('ext')}),P('exF','Arco mayor / lejano (°)',130,20,340,'Medidas',{show:p=>p.kind==='ext'&&p.extType!=='tt'}),
  // longitudes
  P('pa','Segmento PA',4,1,12,'Medidas',{step:.5,show:sh('chords')}),P('pb','Segmento PB',3,1,12,'Medidas',{step:.5,show:sh('chords')}),P('pc','Segmento PC',6,1,12,'Medidas',{step:.5,show:sh('chords')}),
  P('e1','Secante 1: parte externa PA',2,1,10,'Medidas',{step:.5,show:sh('secants')}),P('w1','Secante 1 completa PB',9,2,16,'Medidas',{step:.5,show:sh('secants')}),P('e2','Secante 2: parte externa PC',3,1,10,'Medidas',{step:.5,show:sh('secants')}),
  P('tt','Tangente PT',6,2,14,'Medidas',{step:.5,show:sh('tansec')}),P('te','Secante: parte externa PA',4,1,12,'Medidas',{step:.5,show:sh('tansec')}),
  P('phi','Ángulo entre las dos rectas en P (°)',65,25,155,'Medidas',{show:sh('chords','secants','tansec')}),
  // ---- mezcla ----
  ...[1,2,3,4].map(i=>Mq('mx_arc'+i,`Arco ${N4[i-1]}${N4[i%4]}`,i===1?'val':'off','Arcos',['mix'])),
  ...[1,2,3,4].map(i=>Mq('mx_c'+i,`Central ∠${N4[i-1]}O${N4[i%4]}`,i===1?'val':'off','Ángulos centrales',['mix'])),
  ...[1,2,3,4].map(i=>Mq('mx_i'+i,`Inscrito ∠${N4[i-1]}${N4[(i+1)%4]}${N4[i%4]}`,i===1?'x':'off','Ángulos inscritos (sobre un arco)',['mix'])),
  ...[1,2,3,4].map(i=>Mq('mx_s'+i,`Semiinscrito ∠(t,${N4[i-1]}${N4[i%4]})`,'off','Ángulos semiinscritos (tangente y cuerda)',['mix'])),
  ...[1,2,3,4].map(i=>Mq('mx_q'+i,`Del cuadrilátero, vértice ${N4[i-1]}`,'off','Ángulos del cuadrilátero inscrito',['mix'])),
  // ---- interior ----
  ...[1,2,3,4].map(i=>Mq('in_arc'+i,`Arco ${N4[i-1]}${N4[i%4]}`,i===1||i===3?'val':'off','Arcos',['int'])),
  ...[['APB'],['BPC'],['CPD'],['DPA']].map(([n],i)=>Mq('in_a'+(i+1),`Ángulo ∠${n}`,i===0?'x':'off','Ángulos en P',['int'])),
  // ---- exterior ----
  Mq('ex_near','Arco menor / cercano','val','Elementos',['ext']),Mq('ex_far','Arco mayor / lejano','val','Elementos',['ext']),Mq('ex_p','Ángulo ∠P','x','Elementos',['ext']),
  // ---- cuerdas ----
  Mq('ch_pa','Segmento PA','val','Elementos',['chords']),Mq('ch_pb','Segmento PB','val','Elementos',['chords']),Mq('ch_pc','Segmento PC','val','Elementos',['chords']),Mq('ch_pd','Segmento PD (se calcula)','x','Elementos',['chords']),
  // ---- secantes ----
  Mq('sc_pa','Parte externa PA','val','Elementos',['secants']),Mq('sc_pb','Secante completa PB','val','Elementos',['secants']),Mq('sc_pc','Parte externa PC','val','Elementos',['secants']),Mq('sc_pd','Secante completa PD (se calcula)','x','Elementos',['secants']),
  Mq('sc_ab','Parte interna AB','off','Elementos',['secants']),Mq('sc_cd','Parte interna CD','off','Elementos',['secants']),
  // ---- tangente-secante ----
  Mq('ts_pt','Tangente PT','val','Elementos',['tansec']),Mq('ts_pa','Parte externa PA','val','Elementos',['tansec']),Mq('ts_pb','Secante completa PB (se calcula)','x','Elementos',['tansec']),Mq('ts_ab','Parte interna AB','off','Elementos',['tansec']),
  // ---- mostrar ----
  K('showSol','Escribir la solución paso a paso de las incógnitas',true,'Mostrar'),K('showThm','Escribir el teorema que se usa',true,'Mostrar'),K('showPts','Nombrar los puntos',true,'Mostrar'),K('showO','Mostrar el centro O',false,'Mostrar'),K('showFill','Rellenar el círculo',true,'Mostrar'),
  P('rot','Giro de la figura (°)',0,0,359,'Posición'),K('flipH','Espejo horizontal (voltear izquierda ↔ derecha)',false,'Posición'),K('flipV','Espejo vertical (voltear arriba ↔ abajo)',false,'Posición'),
  P('arcS','Tamaño del arco de los ángulos (%)',100,40,200,'Posición',{style:true}),P('angPad','Separación entre el arco y el texto (px)',3,0,30,'Posición',{style:true}),
  {key:'unit',label:'Unidad de medida',type:'text',def:'cm',group:'Mostrar'},
  C('fill','Color de relleno','#dbeafe','Estilo'),P('op','Opacidad del relleno (%)',45,0,100,'Estilo',{style:true}),C('stroke','Color de la circunferencia','#1e3a8a','Estilo'),P('strokeW','Grosor de línea',3,1,12,'Estilo',{style:true}),P('size','Tamaño de la figura (%)',80,30,100,'Estilo',{style:true}),...ts()],

 normalize(p){
  // los tres primeros arcos dejan al cuarto con lo que sobra (mínimo 10°)
  let a=[p.a1,p.a2,p.a3];for(let k=2;k>=0&&a[0]+a[1]+a[2]>350;k--)a[k]=Math.max(10,a[k]-(a[0]+a[1]+a[2]-350));[p.a1,p.a2,p.a3]=a;
  p.exF=Math.max(p.exF,p.exN+10);p.exF=Math.min(p.exF,350-p.exN);if(p.exF<=p.exN)p.exN=Math.max(10,p.exF-10);
  p.w1=Math.max(p.w1,p.e1+1);p.e2=Math.min(p.e2,Math.round(.9*Math.sqrt(p.e1*p.w1)*2)/2);p.e2=Math.max(1,p.e2);
  p.te=Math.min(p.te,p.tt-.5)},

 render(p,W,H){
  const fs=p.fontSize,u=p.unit,kind=p.kind,th=p.rot*D,Tf=q=>rot([p.flipH?-q[0]:q[0],p.flipV?-q[1]:q[1]],th),T0=Draw.title(p,W);
  const O=[0,0];let R=1,els=[],P0={},draw,thm='';
  const dx=el=>el.kind==='deg'?`${f(el.val)}°`:`${f(el.val)} ${u}`,E=(id,name,val,kind2,mode,col,extra={})=>({id,name,val,kind:kind2,mode,col,...extra});
  const txt=el=>lbl(el.mode,el.name,dx(el));
  const unk=()=>{const o={};els.forEach(e=>{if(e.mode==='x'||e.mode==='y')o[e.mode]=e});return o};

  // ===== utilidades de dibujo (todo se transforma con Tf al final) =====
  let m;const T=q=>Tf(q),L=(a,b,col,w,d)=>ln(m,T(a),T(b),col,w,d),lw=()=>Math.max(2,p.strokeW*.8);
  const arcPts=(a1,sp,r)=>[...Array(Math.max(8,Math.ceil(Math.abs(sp)/4))+1)].map((_,i,A)=>T(pol(a1+sp*i/(A.length-1),r)));
  const poly=(pts,col,w)=>`<polyline points="${pts.map(q=>m.T(q).join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const outward=q=>{const a=T(q),o=T(O),d=sub(a,o);return len(d)>1e-9?unit(d):[0,1]};
  const pt=(q,name,col,dir)=>dot(m,p,T(q),name,col,dir||outward(q));
  const arcHi=(a1,sp,col)=>poly(arcPts(a1,sp,R),col,p.strokeW*1.9);
  const arcLab=(a1,sp,t,col)=>t?lab(m,p,T(pol(a1+sp/2,R)),outward(pol(a1+sp/2,R)),t,col):'';
  // marca de ángulo con el texto pegado al arco
  const mark=(V,t1,sp,rho,col,t)=>{const r2=rho*p.arcS/100;let o=poly([...Array(25)].map((_,i)=>T(add(V,pol(t1+sp*i/24,r2)))),col,Math.max(2,p.strokeW*.7));if(!t)return o;
   const fz=fs*.85,w=t.length*fz*.56,h=fz*1.1,a=m.T(T(V)),b=m.T(T(add(V,pol(t1+sp/2,1)))),dl=Math.hypot(b[0]-a[0],b[1]-a[1])||1,d=[(b[0]-a[0])/dl,(b[1]-a[1])/dl],dist=r2*m.k+p.angPad+w/2*Math.abs(d[0])+h/2*Math.abs(d[1]);
   return o+Draw.t(a[0]+d[0]*dist,a[1]+d[1]*dist,t,p,{c:col,w:700,b:'central',fs:fz})};
  const markBetween=(V,U,Wp,rho,col,t)=>{const[s0,sp]=between(V,U,Wp);return mark(V,s0,sp,rho,col,t)};
  const segLab=(A,B,t,col,side)=>{if(!t)return '';const md=mul(add(A,B),.5),d=unit(sub(B,A)),n=[-d[1]*side,d[0]*side],m1=T(md),m2=T(add(md,mul(n,.01))),dir=unit(sub(m2,m1));return lab(m,p,m1,dir,t,col)};
  // cota (corchete paralelo) para los segmentos completos de una secante
  const dim=(A,B,t,col,side,off)=>{if(!t)return '';const d=unit(sub(B,A)),n=[-d[1]*side,d[0]*side],a2=add(A,mul(n,off)),b2=add(B,mul(n,off));return L(A,a2,col,1.3)+L(B,b2,col,1.3)+L(a2,b2,col,lw()*.9)+segLab(a2,b2,t,col,side)};
  const base=()=>(p.showFill?circ(m,T(O),R,`fill="${p.fill}" fill-opacity="${p.op/100}"`):'')+circ(m,T(O),R,`fill="none" stroke="${p.stroke}" stroke-width="${p.strokeW}"`);

  // ================= escenas =================
  if(kind==='mix'||kind==='int'){
   const a=[p.a1,p.a2,p.a3,Math.max(10,360-p.a1-p.a2-p.a3)],tA=90-a[0]/2,t=[tA,tA+a[0],tA+a[0]+a[1],tA+a[0]+a[1]+a[2]],V=t.map(x=>pol(x,1)),nx=i=>(i+1)%4,pv=i=>(i+3)%4;
   P0={A:V[0],B:V[1],C:V[2],D:V[3]};
   if(kind==='mix'){
    for(let i=0;i<4;i++)els.push(E('arc'+i,`arco ${N4[i]}${N4[nx(i)]}`,a[i],'deg',p['mx_arc'+(i+1)],CL.arc,{i,t:'arc'}));
    for(let i=0;i<4;i++)els.push(E('c'+i,`∠${N4[i]}O${N4[nx(i)]}`,a[i],'deg',p['mx_c'+(i+1)],CL.cen,{i,t:'cen'}));
    for(let i=0;i<4;i++)els.push(E('i'+i,`∠${N4[i]}${N4[(i+2)%4]}${N4[nx(i)]}`,a[i]/2,'deg',p['mx_i'+(i+1)],CL.ins,{i,t:'ins',v:(i+2)%4}));
    for(let i=0;i<4;i++)els.push(E('s'+i,`∠(t,${N4[i]}${N4[nx(i)]})`,a[i]/2,'deg',p['mx_s'+(i+1)],CL.semi,{i,t:'semi'}));
    for(let i=0;i<4;i++)els.push(E('q'+i,`∠${N4[pv(i)]}${N4[i]}${N4[nx(i)]}`,(a[nx(i)]+a[(i+2)%4])/2,'deg',p['mx_q'+(i+1)],CL.cyc,{i,t:'cyc'}));
    thm='Central = arco   ·   Inscrito = ½ · arco   ·   Semiinscrito = ½ · arco   ·   Cuadrilátero inscrito: ángulos opuestos suman 180°';
    draw=()=>{let g=base(),mk='';const act=els.filter(e=>e.mode!=='off'),has=t2=>act.some(e=>e.t===t2);
     if(has('cyc'))for(let i=0;i<4;i++)g+=L(V[i],V[nx(i)],CL.cyc,lw()*.7);
     act.forEach(e=>{const i=e.i,col=e.col,w=lw();
      if(e.t==='arc'){g+=arcHi(t[i],a[i],col);mk+=arcLab(t[i],a[i],txt(e),col)}
      else if(e.t==='cen'){g+=L(O,V[i],col,w)+L(O,V[nx(i)],col,w);mk+=mark(O,t[i],a[i],.3,col,txt(e))}
      else if(e.t==='ins'){const v=e.v;g+=L(V[v],V[i],col,w)+L(V[v],V[nx(i)],col,w);mk+=markBetween(V[v],V[i],V[nx(i)],.2,col,txt(e))}
      else if(e.t==='semi'){const tv=pol(t[i]+90);g+=L(sub(V[i],mul(tv,.75)),add(V[i],mul(tv,.75)),CL.tan,w)+L(V[i],V[nx(i)],col,w);mk+=markBetween(V[i],add(V[i],tv),V[nx(i)],.2,col,txt(e))}
      else if(e.t==='cyc'){mk+=markBetween(V[i],V[pv(i)],V[nx(i)],.2,col,txt(e))}});
     const showO=p.showO||has('cen');return g+mk+(showO?pt(O,p.showPts?'O':'',p.stroke,[-.7,-.7]):'')+(p.showPts?V.map((q,i)=>pt(q,N4[i],p.stroke)).join(''):V.map(q=>pt(q,'',p.stroke)).join(''))};
   }else{
    const Pp=isect(V[0],sub(V[2],V[0]),V[1],sub(V[3],V[1])),ap=[(a[0]+a[2])/2,(a[1]+a[3])/2,(a[0]+a[2])/2,(a[1]+a[3])/2];
    for(let i=0;i<4;i++)els.push(E('arc'+i,`arco ${N4[i]}${N4[nx(i)]}`,a[i],'deg',p['in_arc'+(i+1)],CL.arc,{i,t:'arc'}));
    [['APB',0,1],['BPC',1,2],['CPD',2,3],['DPA',3,0]].forEach(([n,u1,u2],i)=>els.push(E('p'+i,`∠${n}`,ap[i],'deg',p['in_a'+(i+1)],CL.int,{i,t:'ang',u1,u2})));
    P0.P=Pp;thm='Ángulo interior = ½ · (arco que abarca + arco que abarca su opuesto por el vértice)';
    draw=()=>{let g=base(),mk='';g+=L(V[0],V[2],CL.ext,lw())+L(V[1],V[3],CL.ext,lw());
     els.forEach(e=>{if(e.mode==='off')return;const i=e.i;if(e.t==='arc'){g+=arcHi(t[i],a[i],e.col);mk+=arcLab(t[i],a[i],txt(e),e.col)}else mk+=markBetween(Pp,V[e.u1],V[e.u2],.22,e.col,txt(e))});
     return g+mk+(p.showO?pt(O,p.showPts?'O':'',p.stroke,[-.7,-.7]):'')+(p.showPts?V.map((q,i)=>pt(q,N4[i],p.stroke)).join('')+pt(Pp,'P',CL.ext,[0,1]):V.map(q=>pt(q,'',p.stroke)).join(''))};
   }
  }
  else if(kind==='ext'){
   const typ=p.extType,N=p.exN,F=typ==='tt'?360-p.exN:p.exF;let Pp,pts2;
   if(typ==='ss'){const A=pol(N/2),Cc=pol(-N/2),B=pol(180-F/2),Dd=pol(180+F/2);Pp=isect(A,sub(B,A),Cc,sub(Dd,Cc));P0={A,B,C:Cc,D:Dd,P:Pp};
    els.push(E('near','arco AC',N,'deg',p.ex_near,CL.arc,{a1:-N/2,sp:N}),E('far','arco BD',F,'deg',p.ex_far,CL.arc,{a1:180-F/2,sp:F}));
    draw=()=>{let g=base(),mk='';g+=L(Pp,B,CL.ext,lw())+L(Pp,Dd,CL.ext,lw());els.slice(0,2).forEach(e=>{if(e.mode!=='off'){g+=arcHi(e.a1,e.sp,e.col);mk+=arcLab(e.a1,e.sp,txt(e),e.col)}});
     if(els[2].mode!=='off')mk+=markBetween(Pp,A,Cc,Math.min(.4,len(sub(A,Pp))*.7),CL.int,txt(els[2]));
     return g+mk+(p.showO?pt(O,p.showPts?'O':'',p.stroke,[-.7,-.7]):'')+(p.showPts?[['A',A],['B',B],['C',Cc],['D',Dd]].map(([n,q])=>pt(q,n,p.stroke)).join('')+pt(Pp,'P',CL.ext,[1,0]):'')}}
   else if(typ==='ts'){const Tt=pol(-N/2),A=pol(N/2),B=pol(-N/2-F);Pp=isect(Tt,pol(-N/2+90),A,sub(B,A));P0={T:Tt,A,B,P:Pp};
    els.push(E('near','arco TA',N,'deg',p.ex_near,CL.arc,{a1:-N/2,sp:N}),E('far','arco TB',F,'deg',p.ex_far,CL.arc,{a1:-N/2-F,sp:F}));
    draw=()=>{let g=base(),mk='';g+=L(Pp,Tt,CL.tan,lw())+L(Pp,B,CL.ext,lw());els.slice(0,2).forEach(e=>{if(e.mode!=='off'){g+=arcHi(e.a1,e.sp,e.col);mk+=arcLab(e.a1,e.sp,txt(e),e.col)}});
     if(els[2].mode!=='off')mk+=markBetween(Pp,Tt,A,Math.min(.4,len(sub(A,Pp))*.7),CL.int,txt(els[2]));
     return g+mk+(p.showO?pt(O,p.showPts?'O':'',p.stroke,[-.7,-.7]):'')+(p.showPts?[['T',Tt],['A',A],['B',B]].map(([n,q])=>pt(q,n,p.stroke)).join('')+pt(Pp,'P',CL.ext,[1,0]):'')}}
   else{const T1=pol(N/2),T2=pol(-N/2);Pp=[1/Math.cos(N/2*D),0];P0={T1,T2,P:Pp};
    els.push(E('near','arco menor',N,'deg',p.ex_near,CL.arc,{a1:-N/2,sp:N}),E('far','arco mayor',F,'deg',p.ex_far,CL.arc,{a1:N/2,sp:F}));
    draw=()=>{let g=base(),mk='';g+=L(Pp,T1,CL.tan,lw())+L(Pp,T2,CL.tan,lw());els.slice(0,2).forEach(e=>{if(e.mode!=='off'){g+=arcHi(e.a1,e.sp,e.col);mk+=arcLab(e.a1,e.sp,txt(e),e.col)}});
     if(els[2].mode!=='off')mk+=markBetween(Pp,T1,T2,.25,CL.int,txt(els[2]));
     return g+mk+(p.showO?pt(O,p.showPts?'O':'',p.stroke,[-.7,-.7]):'')+(p.showPts?pt(T1,'T₁',p.stroke)+pt(T2,'T₂',p.stroke)+pt(Pp,'P',CL.ext,[1,0]):'')}}
   els.push(E('p','∠P',(F-N)/2,'deg',p.ex_p,CL.int));
   // el ángulo es el último elemento; en este orden: near, far, P
   thm=typ==='tt'?'Ángulo entre dos tangentes = ½ · (arco mayor − arco menor) = 180° − arco menor':'Ángulo exterior = ½ · (arco mayor − arco menor)';
  }
  else{ // teoremas con longitudes
   const phi=p.phi*D,u1=[1,0],v1=[Math.cos(phi),Math.sin(phi)],cc=(ox,oy2)=>[ox,oy2];let A,B,Cc,Dd,Oc,seg=[];
   if(kind==='chords'){const a=p.pa,b=p.pb,c=p.pc,d=a*b/c,ox=(b-a)/2,oy=((d-c)/2-ox*Math.cos(phi))/Math.sin(phi);Oc=[ox,oy];R=Math.sqrt(ox*ox+oy*oy+a*b);
    A=mul(u1,-a);B=mul(u1,b);Cc=mul(v1,-c);Dd=mul(v1,d);P0={P:[0,0],A,B,C:Cc,D:Dd};
    els.push(E('pa','PA',a,'len',p.ch_pa,CL.a,{s:[[0,0],A]}),E('pb','PB',b,'len',p.ch_pb,CL.b,{s:[[0,0],B]}),E('pc','PC',c,'len',p.ch_pc,CL.c,{s:[[0,0],Cc]}),E('pd','PD',d,'len',p.ch_pd,CL.d,{s:[[0,0],Dd]}));
    thm='Teorema de las cuerdas: PA · PB = PC · PD';
    draw=()=>{let g=base(),mk='';g+=L(A,B,p.stroke,lw()*.6)+L(Cc,Dd,p.stroke,lw()*.6);els.forEach(e=>{g+=L(e.s[0],e.s[1],e.col,lw()*1.5)});
     [['pa',1],['pb',1],['pc',-1],['pd',-1]].forEach(([id,sd])=>{const e=els.find(q=>q.id===id);if(e.mode!=='off')mk+=segLab(e.s[0],e.s[1],txt(e),e.col,sd)});
     return g+mk+(p.showO?pt(Oc,p.showPts?'O':'',p.stroke,[-.7,-.7]):'')+(p.showPts?[['A',A],['B',B],['C',Cc],['D',Dd]].map(([n,q])=>pt(q,n,p.stroke)).join('')+pt([0,0],'P',p.stroke,[0,1]):'')};}
   else if(kind==='secants'){const e1=p.e1,w1=p.w1,e2=p.e2,w2=e1*w1/e2,ox=(e1+w1)/2,oy=((e2+w2)/2-ox*Math.cos(phi))/Math.sin(phi);Oc=[ox,oy];R=Math.sqrt(ox*ox+oy*oy-e1*w1);
    A=mul(u1,e1);B=mul(u1,w1);Cc=mul(v1,e2);Dd=mul(v1,w2);P0={P:[0,0],A,B,C:Cc,D:Dd};
    els.push(E('pa','PA',e1,'len',p.sc_pa,CL.a,{s:[[0,0],A]}),E('pb','PB',w1,'len',p.sc_pb,CL.b,{s:[[0,0],B]}),E('pc','PC',e2,'len',p.sc_pc,CL.c,{s:[[0,0],Cc]}),E('pd','PD',w2,'len',p.sc_pd,CL.d,{s:[[0,0],Dd]}),
     E('ab','AB',w1-e1,'len',p.sc_ab,CL.a,{s:[A,B]}),E('cd','CD',w2-e2,'len',p.sc_cd,CL.c,{s:[Cc,Dd]}));
    thm='Teorema de las secantes: PA · PB = PC · PD   (parte externa × secante completa)';
    draw=()=>{let g=base(),mk='';g+=L([0,0],B,p.stroke,lw()*.7)+L([0,0],Dd,p.stroke,lw()*.7);
     els.forEach(e=>{if(e.mode!=='off'&&e.id!=='pb'&&e.id!=='pd')g+=L(e.s[0],e.s[1],e.col,lw()*1.4)});
     [['pa',1],['ab',1],['pc',-1],['cd',-1]].forEach(([id,sd])=>{const e=els.find(q=>q.id===id);if(e.mode!=='off')mk+=segLab(e.s[0],e.s[1],txt(e),e.col,sd)});
     [['pb',-1],['pd',1]].forEach(([id,sd])=>{const e=els.find(q=>q.id===id);if(e.mode!=='off')mk+=dim(e.s[0],e.s[1],txt(e),e.col,sd,.12*R)});
     return g+mk+(p.showO?pt(Oc,p.showPts?'O':'',p.stroke,[-.7,-.7]):'')+(p.showPts?[['A',A],['B',B],['C',Cc],['D',Dd]].map(([n,q])=>pt(q,n,p.stroke)).join('')+pt([0,0],'P',p.stroke,[-1,0]):'')};}
   else{const t=p.tt,e=p.te,w=t*t/e,ox=(e+w)/2,oy=(t-ox*Math.cos(phi))/Math.sin(phi);Oc=[ox,oy];R=Math.sqrt(ox*ox+oy*oy-t*t);
    const Tt=mul(v1,t);A=mul(u1,e);B=mul(u1,w);P0={P:[0,0],T:Tt,A,B};
    els.push(E('pt','PT',t,'len',p.ts_pt,CL.tan,{s:[[0,0],Tt]}),E('pa','PA',e,'len',p.ts_pa,CL.a,{s:[[0,0],A]}),E('pb','PB',w,'len',p.ts_pb,CL.b,{s:[[0,0],B]}),E('ab','AB',w-e,'len',p.ts_ab,CL.a,{s:[A,B]}));
    thm='Teorema de la tangente y la secante: PT² = PA · PB   (la tangente al cuadrado es la parte externa × la secante completa)';
    draw=()=>{let g=base(),mk='';g+=L([0,0],Tt,CL.tan,lw()*.8)+L([0,0],B,p.stroke,lw()*.7);
     els.forEach(e2=>{if(e2.mode!=='off'&&e2.id!=='pt'&&e2.id!=='pb')g+=L(e2.s[0],e2.s[1],e2.col,lw()*1.4)});
     [['pt',1],['pa',1],['ab',1]].forEach(([id,sd])=>{const e2=els.find(q=>q.id===id);if(e2.mode!=='off')mk+=segLab(e2.s[0],e2.s[1],txt(e2),e2.col,sd)});
     {const e2=els.find(q=>q.id==='pb');if(e2.mode!=='off')mk+=dim(e2.s[0],e2.s[1],txt(e2),e2.col,-1,.12*R)}
     return g+mk+(p.showO?pt(Oc,p.showPts?'O':'',p.stroke,[-.7,-.7]):'')+(p.showPts?pt(Tt,'T',p.stroke)+pt(A,'A',p.stroke)+pt(B,'B',p.stroke)+pt([0,0],'P',p.stroke,[-1,0]):'')};}
   // la circunferencia se dibuja con su centro real
   O[0]=Oc[0];O[1]=Oc[1];
  }

  // ===== soluciones de las incógnitas =====
  const sol=[],U=unk(),byId=id=>els.find(e=>e.id===id),vs=e=>e.kind==='deg'?`${f(e.val)}°`:`${f(e.val)}`;
  const vis=e=>e&&(e.mode==='val'||e.mode==='both');
  const line=(arr)=>arr.join('   →   ');
  const solve=(e,x)=>{const X=x;let o;
   if(kind==='mix'){const a=els.filter(q=>q.t==='arc').map(q=>q.val),i=e.i;
    if(e.t==='arc'){const c=els.find(q=>q.t==='cen'&&q.i===i&&vis(q)),n=els.find(q=>q.t==='ins'&&q.i===i&&vis(q)),s=els.find(q=>q.t==='semi'&&q.i===i&&vis(q));
     if(c)o=`${e.name} = ${c.name} = ${vs(c)}`;else if(n)o=`${e.name} = 2 · ${n.name} = 2 · ${vs(n)} = ${vs(e)}`;else if(s)o=`${e.name} = 2 · ${s.name} = 2 · ${vs(s)} = ${vs(e)}`;else o=`${e.name} = ${vs(e)}`}
    else if(e.t==='cen')o=`${e.name} = arco ${N4[i]}${N4[(i+1)%4]} = ${vs(e)}`;
    else if(e.t==='ins')o=`${e.name} = ½ · arco ${N4[i]}${N4[(i+1)%4]} = ½ · ${f(a[i])}° = ${vs(e)}`;
    else if(e.t==='semi')o=`${e.name} = ½ · arco ${N4[i]}${N4[(i+1)%4]} = ½ · ${f(a[i])}° = ${vs(e)}`;
    else{const j=(i+1)%4,k=(i+2)%4;o=`${e.name} = ½ · (arco ${N4[j]}${N4[k]} + arco ${N4[k]}${N4[(k+1)%4]}) = ½ · (${f(a[j])}° + ${f(a[k])}°) = ${vs(e)}`}}
   else if(kind==='int'){const a=els.filter(q=>q.t==='arc').map(q=>q.val),i=e.i;
    if(e.t==='ang'){const j=[0,1,2,3][i],p1=i%2===0?[0,2]:[1,3];o=`${e.name} = ½ · (arco ${N4[p1[0]]}${N4[(p1[0]+1)%4]} + arco ${N4[p1[1]]}${N4[(p1[1]+1)%4]}) = ½ · (${f(a[p1[0]])}° + ${f(a[p1[1]])}°) = ${vs(e)}`}
    else{const par=(i+2)%4,an=els.find(q=>q.t==='ang'&&(q.i%2)===(i%2)&&vis(q)),ap=els.find(q=>q.id==='arc'+par);
     o=an?`2 · ${an.name} = ${e.name} + arco ${N4[par]}${N4[(par+1)%4]}   →   ${e.name} = 2 · ${vs(an)} − ${f(ap.val)}° = ${vs(e)}`:`${e.name} = ${vs(e)}`}}
   else if(kind==='ext'){const nr=byId('near'),fr=byId('far'),pa=byId('p');
    if(e.id==='p')o=`${e.name} = ½ · (${fr.name} − ${nr.name}) = ½ · (${f(fr.val)}° − ${f(nr.val)}°) = ${vs(e)}`;
    else if(e.id==='far'){o=p.extType==='tt'?`${e.name} = 180° + ${pa.name} = 180° + ${vs(pa)} = ${vs(e)}`:`${e.name} = 2 · ${pa.name} + ${nr.name} = 2 · ${vs(pa)} + ${f(nr.val)}° = ${vs(e)}`}
    else o=p.extType==='tt'?`${e.name} = 180° − ${pa.name} = 180° − ${vs(pa)} = ${vs(e)}`:`${e.name} = ${fr.name} − 2 · ${pa.name} = ${f(fr.val)}° − 2 · ${vs(pa)} = ${vs(e)}`}
   else{const g=id=>byId(id);
    if(kind==='chords'||kind==='secants'){const pairs={pa:['pb','pc','pd',0],pb:['pa','pc','pd',0],pc:['pd','pa','pb',1],pd:['pc','pa','pb',1]};
     if(e.id in pairs){const[oth,n1,n2]=pairs[e.id],a=g(oth),b=g(n1),c=g(n2);o=`${e.name} · ${a.name} = ${b.name} · ${c.name}   →   ${e.name} = ${vs(b)} · ${vs(c)} / ${vs(a)} = ${vs(e)} ${u}`}
     else if(e.id==='ab')o=`AB = PB − PA = ${vs(g('pb'))} − ${vs(g('pa'))} = ${vs(e)} ${u}`;else o=`CD = PD − PC = ${vs(g('pd'))} − ${vs(g('pc'))} = ${vs(e)} ${u}`}
    else{const pt2=g('pt'),pa=g('pa'),pb=g('pb');
     if(e.id==='pt')o=`PT² = PA · PB   →   ${e.name} = √(${vs(pa)} · ${vs(pb)}) = ${vs(e)} ${u}`;
     else if(e.id==='pa')o=`PT² = PA · PB   →   ${e.name} = ${vs(pt2)}² / ${vs(pb)} = ${vs(e)} ${u}`;
     else if(e.id==='pb')o=`PT² = PA · PB   →   ${e.name} = ${vs(pt2)}² / ${vs(pa)} = ${vs(e)} ${u}`;
     else o=`AB = PB − PA = ${vs(pb)} − ${vs(pa)} = ${vs(e)} ${u}`}}
   return `${X}:  ${o}   →   ${X} = ${vs(e)}${e.kind==='len'?' '+u:''}`};
  const Ls=[];if(p.showThm&&thm)Ls.push(thm);
  if(p.showSol)['x','y'].forEach(k=>{if(U[k])Ls.push(solve(U[k],k))});

  // ===== composición =====
  const pts=Object.values(P0).map(T),oc=T(O),all=[...pts,[oc[0]-R,oc[1]-R],[oc[0]+R,oc[1]+R],[oc[0]-R,oc[1]+R],[oc[0]+R,oc[1]-R]],xs=all.map(q=>q[0]),ys=all.map(q=>q[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),
   fl=fs*.78,below=Ls.length?Ls.length*fl*1.4+fs*.5:0;
  m=view(p,W,H,Math.max(x1-x0,y1-y0)/2*1.22,below,(x0+x1)/2,(y0+y1)/2);
  const g=draw();
  return T0+g+Ls.map((t,i)=>Draw.t(W/2,m.tH+m.av+fl*1.3+i*fl*1.4,t,p,{fs:Math.min(fl,W*.96/(t.length*.5)),w:i===0&&p.showThm?400:700,c:i===0&&p.showThm?'#64748b':undefined})).join('')}});
})();
