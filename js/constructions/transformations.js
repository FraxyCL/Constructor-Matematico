// Transformaciones isométricas sobre el plano cartesiano: traslación, rotación y reflexión (simetría axial)
(()=>{
const {P,C,K}=Registry.h;
const ts=()=>Registry.h.ts(20);
const D=Math.PI/180,f=x=>Draw.fmt(x+0),PT=/\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)/g;
const FIG={tri:[[1,1],[4,2],[2,4]],sq:[[1,1],[3,1],[3,3],[1,3]],rc:[[1,1],[5,1],[5,3],[1,3]],L:[[1,1],[3,1],[3,2],[2,2],[2,4],[1,4]],pent:[[1,1],[4,1],[4,3],[2.5,4.5],[1,3]]};
const fig=p=>{let a=p.fig==='custom'?[...p.fpts.matchAll(PT)].map(m=>[+m[1],+m[2]]).slice(0,20):FIG[p.fig];if(!a||a.length<3)a=FIG.tri;return a.map(q=>[q[0]+p.ox,q[1]+p.oy])};
const figParams=()=>[{key:'fig',label:'Figura inicial',type:'select',def:'tri',group:'Figura',options:[['tri','Triángulo escaleno'],['sq','Cuadrado'],['rc','Rectángulo'],['L','Figura en L'],['pent','Pentágono (casa)'],['custom','Personalizada']]},
 {key:'fpts',label:'Vértices, ej.: (1,1); (4,1); (2,3)',type:'text',def:'(1,1); (4,1); (2,3)',group:'Figura',show:p=>p.fig==='custom'},
 P('ox','Mover figura en X',0,-10,10,'Figura',{step:.5}),P('oy','Mover figura en Y',0,-10,10,'Figura',{step:.5})];
const rest=()=>[K('showO','Mostrar figura original',true,'Mostrar'),K('showI','Mostrar figura transformada',true,'Mostrar'),K('showLinks','Segmentos de correspondencia',false,'Mostrar'),K('showV','Mostrar vértices',true,'Mostrar'),K('showN',"Nombres de vértices (A, A')",true,'Mostrar'),
 K('showA','Ángulos interiores',false,'Mostrar'),K('showM','Medidas de los lados',false,'Mostrar'),{key:'unit',label:'Unidad de medida',type:'text',def:'u',group:'Mostrar'},...Registry.vis(p=>fig(p).length,20),
 C('colO','Color figura original','#2563eb','Estilo'),C('colI','Color figura transformada','#dc2626','Estilo'),P('op','Opacidad del relleno (%)',30,0,100,'Estilo',{style:true}),P('lw','Grosor de línea',3,1,10,'Estilo',{style:true}),P('ptR','Tamaño de puntos',5,2,12,'Estilo',{style:true}),
 ...Registry.planeParams().filter(q=>q.key!=='equal'),...ts()];
const layers=(c,p,A,B)=>{const k=c.X(1)-c.X(0),tp=q=>[c.X(q[0]),c.Y(q[1])],ln=(a,b,s)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${s}/>`,
 pg=(Q,col,sx)=>{const S=Q.map(tp);return c.clip(`<polygon points="${S.map(z=>z.join(',')).join(' ')}" fill="${col}" fill-opacity="${p.op/100}" stroke="${col}" stroke-width="${p.lw}" stroke-linejoin="round"/>`)+Draw.marks(S,p,k,col,p.lw,sx,p.ptR)};
 let g='';if(p.showLinks)A.forEach((q,i)=>g+=c.clip(ln(tp(q),tp(B[i]),'stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 4"')));
 if(p.showO)g+=pg(A,p.colO,'');if(p.showI)g+=pg(B,p.colI,"'");return g};
const plane=(p,W,H,fn)=>Draw.plane({...p,equal:true},W,H,fn);

Registry.register({id:'tr-translate',category:'transforms',name:'Traslación',icon:'➡',description:'Traslación de una figura según un vector',
 parameters:[...figParams(),P('dx','Desplazamiento horizontal (x)',4,-15,15,'Vector',{step:.5}),P('dy','Desplazamiento vertical (y)',2,-15,15,'Vector',{step:.5}),K('showVec','Mostrar vector de traslación',true,'Vector'),C('colV','Color del vector','#16a34a','Vector'),...rest()],
 render(p,W,H){return plane(p,W,H,c=>{const A=fig(p),B=A.map(q=>[q[0]+p.dx,q[1]+p.dy]);let g=layers(c,p,A,B);
  if(p.showVec){const a=[c.X(A[0][0]),c.Y(A[0][1])],b=[c.X(B[0][0]),c.Y(B[0][1])];g+=Draw.arrow(a[0],a[1],b[0],b[1],p.colV,p.lw)+Draw.t((a[0]+b[0])/2,(a[1]+b[1])/2-p.fontSize*.6,`v = (${f(p.dx)}, ${f(p.dy)})`,p,{c:p.colV,w:700})}
  return g})}});

Registry.register({id:'tr-rotate',category:'transforms',name:'Rotación',icon:'↻',description:'Rotación de una figura en torno a un centro',
 parameters:[...figParams(),P('cx','Centro de rotación (x)',0,-10,10,'Rotación',{step:.5}),P('cy','Centro de rotación (y)',0,-10,10,'Rotación',{step:.5}),P('ang','Ángulo de giro (°)',90,0,360,'Rotación'),
  {key:'sense',label:'Sentido',type:'select',def:'ccw',group:'Rotación',options:[['ccw','Antihorario ↺'],['cw','Horario ↻']]},
  K('showC','Mostrar centro',true,'Rotación'),K('showArc','Mostrar arco, radios y ángulo',true,'Rotación'),P('arcV','Vértice del arco (1 = A)',1,1,p=>fig(p).length,'Rotación',{show:p=>p.showArc}),C('colV','Color del arco y del centro','#16a34a','Rotación'),...rest()],
 render(p,W,H){return plane(p,W,H,c=>{const A=fig(p),th=(p.sense==='ccw'?1:-1)*p.ang*D,B=A.map(q=>{const x=q[0]-p.cx,y=q[1]-p.cy;return[p.cx+x*Math.cos(th)-y*Math.sin(th),p.cy+x*Math.sin(th)+y*Math.cos(th)]});
  let g=layers(c,p,A,B);const O=[c.X(p.cx),c.Y(p.cy)];
  if(p.showArc&&p.ang>0){const i=Math.min(p.arcV,A.length)-1,s0=[c.X(A[i][0]),c.Y(A[i][1])],s1=[c.X(B[i][0]),c.Y(B[i][1])],r=Math.hypot(s0[0]-O[0],s0[1]-O[1]);
   if(r>4){const f0=Math.atan2(-(s0[1]-O[1]),s0[0]-O[0]),pt=j=>[O[0]+r*Math.cos(f0+th*j/40),O[1]-r*Math.sin(f0+th*j/40)],pl=[...Array(35)].map((_,j)=>pt(j).join(',')).join(' '),a=pt(34),b=pt(40),m=[O[0]+r*.55*Math.cos(f0+th/2),O[1]-r*.55*Math.sin(f0+th/2)],rd=q=>`<line x1="${O[0]}" y1="${O[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${p.colV}" stroke-width="1.5" stroke-dasharray="6 4"/>`;
    g+=rd(s0)+rd(s1)+`<polyline points="${pl}" fill="none" stroke="${p.colV}" stroke-width="${p.lw}"/>`+Draw.arrow(a[0],a[1],b[0],b[1],p.colV,p.lw)+Draw.t(m[0],m[1],p.ang+'°',p,{c:p.colV,w:700,b:'central'})}}
  if(p.showC)g+=`<circle cx="${O[0]}" cy="${O[1]}" r="${p.ptR+1}" fill="${p.colV}" stroke="#fff" stroke-width="1.5"/>`+Draw.t(O[0]+p.fontSize*.5,O[1]+p.fontSize*1.1,'O',p,{c:p.colV,w:700,a:'start'});
  return g})}});

const refl=(q,a,k)=>a==='v'?[2*k-q[0],q[1]]:a==='h'?[q[0],2*k-q[1]]:a==='d1'?[q[1]-k,q[0]+k]:[k-q[1],k-q[0]];
Registry.register({id:'tr-reflect',category:'transforms',name:'Reflexión (simetría axial)',icon:'⇋',description:'Reflexión de una figura respecto de un eje de simetría',
 parameters:[...figParams(),{key:'axis',label:'Tipo de eje',type:'select',def:'v',group:'Eje de simetría',options:[['v','Vertical (x = k)'],['h','Horizontal (y = k)'],['d1','Diagonal creciente (y = x + k)'],['d2','Diagonal decreciente (y = −x + k)']]},
  P('axk','Posición del eje (k)',0,-10,10,'Eje de simetría',{step:.5}),K('showAx','Mostrar eje',true,'Eje de simetría'),K('showAxEq','Mostrar ecuación del eje',true,'Eje de simetría',p=>p.showAx),C('colV','Color del eje','#16a34a','Eje de simetría'),...rest()],
 render(p,W,H){return plane(p,W,H,c=>{const A=fig(p),k=p.axk,B=A.map(q=>refl(q,p.axis,k));let g=layers(c,p,A,B);
  if(p.showAx){const E={v:[[k,p.ymin],[k,p.ymax]],h:[[p.xmin,k],[p.xmax,k]],d1:[[p.xmin,p.xmin+k],[p.xmax,p.xmax+k]],d2:[[p.xmin,k-p.xmin],[p.xmax,k-p.xmax]]}[p.axis],fs=p.fontSize;
   g+=c.clip(`<line x1="${c.X(E[0][0])}" y1="${c.Y(E[0][1])}" x2="${c.X(E[1][0])}" y2="${c.Y(E[1][1])}" stroke="${p.colV}" stroke-width="${p.lw}" stroke-dasharray="10 6"/>`);
   if(p.showAxEq){const sg=(k<0?' − ':' + ')+f(Math.abs(k)),eq={v:'x = '+f(k),h:'y = '+f(k),d1:'y = x'+(k?sg:''),d2:'y = −x'+(k?sg:'')}[p.axis],x0=p.xmax-1,y0=p.axis==='d1'?x0+k:k-x0;
    if(p.axis==='v')g+=Draw.t(c.X(k)+fs*.4,c.T+fs,eq,p,{a:'start',c:p.colV,w:700});else if(p.axis==='h')g+=Draw.t(c.R-fs*.4,c.Y(k)-fs*.5,eq,p,{a:'end',c:p.colV,w:700});
    else if(y0>=p.ymin&&y0<=p.ymax)g+=Draw.t(c.X(x0),c.Y(y0)-fs*.7,eq,p,{a:'end',c:p.colV,w:700})}}
  return g})}});
})();
