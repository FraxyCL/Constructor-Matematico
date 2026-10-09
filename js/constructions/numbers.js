// Números: recta numérica y equivalencia de fracciones
(()=>{
const {P,C,K}=Registry.h;
const ts=()=>Registry.h.ts(24);
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const fr=Draw.fr;
const sec=(cx,cy,r,n,k,p)=>{let g='';const st=`stroke="${p.stroke}" stroke-width="${p.strokeW}" stroke-linejoin="round"`;
 for(let i=0;i<n;i++){const a0=-Math.PI/2+i*2*Math.PI/n,a1=a0+2*Math.PI/n,f=i<k?p.colorOn:p.colorOff;
  g+=n===1?`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" ${st}/>`:`<path d="M${cx} ${cy}L${cx+r*Math.cos(a0)} ${cy+r*Math.sin(a0)}A${r} ${r} 0 ${a1-a0>Math.PI?1:0} 1 ${cx+r*Math.cos(a1)} ${cy+r*Math.sin(a1)}Z" fill="${f}" ${st}/>`}return g};
const tok=s=>{s=s.trim();let m=s.match(/^(-?\d+)\s*\/\s*(\d+)$/);if(m&&+m[2])return{v:m[1]/m[2],n:+m[1],d:+m[2]};const v=Number(s.replace(',','.'));return s&&!isNaN(v)?{v,t:s}:null};

Registry.register({id:'numberline',category:'fractions',name:'Recta numérica',icon:'↔',description:'Recta numérica con enteros, decimales o fracciones y puntos marcados',
 parameters:[P('min','Valor mínimo',0,-20,p=>p.max-1,'Recta'),P('max','Valor máximo',2,p=>p.min+1,20,'Recta'),P('div','Divisiones por unidad',4,1,12,'Recta'),
  {key:'mode',label:'Marcas intermedias como',type:'select',def:'frac',group:'Recta',options:[['frac','Fracciones'],['dec','Decimales'],['none','Sin numerar']]},
  K('simp','Simplificar fracciones',true,'Recta',p=>p.mode==='frac'),K('nums','Mostrar numeración',true,'Recta'),
  {key:'marks',label:'Puntos a marcar (separados por ;)',type:'text',def:'1/4; 3/4; 5/4',group:'Puntos'},
  C('col','Color de los puntos','#dc2626','Estilo'),C('lineC','Color de la recta','#111827','Estilo'),P('lw','Grosor de la recta',3,1,10,'Estilo',{style:true}),P('ptR','Tamaño de puntos',7,3,14,'Estilo',{style:true}),...ts()],
 render(p,W,H){const fs=p.fontSize,tH=Draw.titleH(p),m=W*.07,y=tH+(H-tH)/2+fs,span=p.max-p.min,X=v=>m+(v-p.min)/span*(W-2*m),sp=(W-2*m)/(span*p.div),sk=Math.max(1,Math.ceil(fs*1.8/(sp*p.div)));
  let g=Draw.arrow(W*.04,y,W*.96,y,p.lineC,p.lw)+Draw.arrow(W*.96,y,W*.04,y,p.lineC,p.lw).replace(/<line[^>]*\/>/,'');
  for(let i=p.min*p.div;i<=p.max*p.div;i++){const v=i/p.div,x=X(v),I=i%p.div===0,h=I?fs*.55:fs*.3;
   g+=`<line x1="${x}" x2="${x}" y1="${y-h}" y2="${y+h}" stroke="${p.lineC}" stroke-width="${I?p.lw:Math.max(1,p.lw*.6)}"/>`;
   if(!p.nums)continue;
   if(I){if(v%sk===0)g+=Draw.t(x,y+fs*1.7,v,p,{w:700})}
   else if(sp>=fs*1.3){if(p.mode==='dec')g+=Draw.t(x,y+fs*1.5,Draw.fmt(v),p,{fs:fs*.8});
    else if(p.mode==='frac'){const q=p.simp?gcd(i,p.div):1;g+=fr(x,y+fs*1.4,i/q,p.div/q,fs*.75,p)}}}
  p.marks.split(';').map(tok).forEach(t=>{if(!t||t.v<p.min||t.v>p.max)return;const x=X(t.v);
   g+=`<circle cx="${x}" cy="${y}" r="${p.ptR}" fill="${p.col}" stroke="#fff" stroke-width="2"/>`+(t.d?fr(x,y-fs*1.9,t.n,t.d,fs,p,p.col):Draw.t(x,y-fs*1.2,Draw.fmt(t.v),p,{c:p.col,w:700}))});
  return Draw.title(p,W)+g}});

Registry.register({id:'fraction-equiv',category:'fractions',name:'Equivalencia de fracciones',icon:'🟰',description:'Fracciones equivalentes por amplificación o simplificación',
 parameters:[P('num','Numerador',3,0,p=>p.den,'Fracción'),P('den','Denominador',4,1,12,'Fracción'),
  {key:'mode',label:'Operación',type:'select',def:'amp',group:'Fracción',options:[['amp','Amplificar (×k)'],['sim','Simplificar (÷MCD)']]},
  P('k1','Factor de amplificación',2,2,p=>Math.max(2,Math.floor(48/p.den)),'Fracción',{show:p=>p.mode==='amp'}),
  K('three','Agregar tercera fracción equivalente',false,'Fracción',p=>p.mode==='amp'),
  P('k2','Segundo factor',3,2,p=>Math.max(2,Math.floor(48/p.den)),'Fracción',{show:p=>p.mode==='amp'&&p.three}),
  {key:'model',label:'Representación',type:'select',def:'bar',group:'Fracción',options:[['bar','Barras alineadas'],['circ','Círculos']]},
  C('colorOn','Partes pintadas','#3b82f6','Estilo'),C('colorOff','Partes sin pintar','#ffffff','Estilo'),C('stroke','Contorno','#1e293b','Estilo'),
  P('strokeW','Grosor del contorno',2,0,10,'Estilo',{style:true}),P('size','Tamaño (%)',80,40,100,'Estilo',{style:true}),
  K('guides','Líneas guía de alineación',true,'Mostrar',p=>p.model==='bar'),K('showOps','Mostrar ×k / ÷MCD',true,'Mostrar'),K('showEq','Mostrar igualdad',true,'Mostrar',p=>p.model==='bar'),{key:'title',label:'Título (opcional)',type:'text',def:'',group:'Mostrar'},...ts().filter(q=>q.key!=='title')],
 normalize(p){p.num=Math.min(p.num,p.den);const m=Math.max(2,Math.floor(48/p.den));p.k1=Math.min(p.k1,m);p.k2=Math.min(p.k2,m)},
 render(p,W,H){const fs=p.fontSize,s=p.size/100,tH=Draw.titleH(p),av=H-tH,g0=gcd(p.num,p.den)||1,
  Ls=p.mode==='amp'?[[p.num,p.den],[p.num*p.k1,p.den*p.k1]].concat(p.three?[[p.num*p.k2,p.den*p.k2]]:[]):[[p.num,p.den],[p.num/g0,p.den/g0]],
  ops=p.mode==='amp'?['×'+p.k1,'×'+p.k2]:['÷'+g0],nb=Ls.length;let g='';
  if(p.model==='bar'){const lw=fs*3.2,Wb=W*s-lw,x0=(W-W*s)/2+lw,bh=Math.min(av*s/(nb*1.8),W*.14),gap=bh*.7,eq=p.showEq?fs*1.8:0,tot=nb*bh+(nb-1)*gap,y0=tH+(av-tot-eq)/2;
   Ls.forEach(([n,d],i)=>{const y=y0+i*(bh+gap);for(let j=0;j<d;j++)g+=`<rect x="${x0+j*Wb/d}" y="${y}" width="${Wb/d}" height="${bh}" fill="${j<n?p.colorOn:p.colorOff}" stroke="${p.stroke}" stroke-width="${p.strokeW}"/>`;
    g+=fr(x0-lw/2,y+bh/2,n,d,fs,p)+(i>0&&p.showOps?Draw.t(x0+Wb+fs*.4,y+bh/2,ops[i-1],p,{a:'start',b:'central',c:'#64748b',w:700}):'')});
   if(p.guides)for(let j=1;j<Ls[0][1];j++){const x=x0+j*Wb/Ls[0][1];g+=`<line x1="${x}" x2="${x}" y1="${y0}" y2="${y0+tot}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="5 4"/>`}
   if(p.showEq)g+=Draw.t(W/2,y0+tot+fs*1.5,Ls.map(([n,d])=>n+'/'+d).join('  =  '),p,{w:700})}
  else{const slot=W*s/nb,r=Math.min(slot*.4,(av-fs*3.6)*s/2),cy=tH+(av-fs*3.2)/2;
   Ls.forEach(([n,d],i)=>{const cx=W/2+(i-(nb-1)/2)*slot;g+=sec(cx,cy,r,d,n,p)+fr(cx,cy+r+fs*1.5,n,d,fs,p);
    if(i<nb-1)g+=Draw.t(cx+slot/2,cy+fs*.4,'=',p,{fs:fs*1.5})+(p.showOps?Draw.t(cx+slot/2,cy-fs*.8,ops[i]||ops[0],p,{fs:fs*.8,c:'#64748b'}):'')})}
  return Draw.title(p,W)+g}});
})();
