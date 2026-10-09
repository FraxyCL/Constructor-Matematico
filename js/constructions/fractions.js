(()=>{
const col=(key,label,def)=>({key,label,def,type:'color',group:'Estilo',style:true});
const rg=(key,label,def,min,max,group,style)=>({key,label,def,min,max,group,type:'range',style});
Registry.register({
 id:'fraction-circle',category:'fractions',name:'Fracción circular',icon:'🥧',description:'Círculo dividido en sectores iguales',
 parameters:[rg('den','Denominador (partes)',8,1,24,'Fracción'),rg('num','Numerador (partes pintadas)',3,0,p=>p.den,'Fracción'),
  col('colorOn','Partes pintadas','#3b82f6'),col('colorOff','Partes sin pintar','#ffffff'),col('stroke','Contorno','#1e293b'),
  rg('strokeW','Grosor del contorno',3,0,12,'Estilo',true),rg('gap','Separación entre sectores',0,0,20,'Estilo',true),rg('size','Tamaño de la figura (%)',80,30,100,'Estilo',true),
  {key:'showLabels',label:'Numerar los sectores',type:'check',def:false,group:'Etiquetas'},...Registry.infoParams(),...Registry.textStyle()],
 normalize(p){p.num=Math.min(p.num,p.den)},
 render(p,W,H){const fs=p.fontSize,tH=Draw.titleH(p),av=H-tH-Draw.belowH(p),d=Math.min(W,av)*p.size/100,r=Math.max(1,d/2-p.gap),cx=W/2,cy=tH+av/2,n=p.den;let g='';
  for(let i=0;i<n;i++){const a0=-Math.PI/2+i*2*Math.PI/n,a1=a0+2*Math.PI/n,am=(a0+a1)/2,ox=n>1?Math.cos(am)*p.gap:0,oy=n>1?Math.sin(am)*p.gap:0,fill=i<p.num?p.colorOn:p.colorOff,st=`stroke="${p.stroke}" stroke-width="${p.strokeW}" stroke-linejoin="round"`;
   g+=n===1?`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${st}/>`:`<path d="M${cx+ox} ${cy+oy}L${cx+ox+r*Math.cos(a0)} ${cy+oy+r*Math.sin(a0)}A${r} ${r} 0 ${a1-a0>Math.PI?1:0} 1 ${cx+ox+r*Math.cos(a1)} ${cy+oy+r*Math.sin(a1)}Z" fill="${fill}" ${st}/>`;
   if(p.showLabels)g+=Draw.t(cx+ox+r*.68*Math.cos(am),cy+oy+r*.68*Math.sin(am),i+1,p,{fs:Math.min(fs*.7,r*.25),b:'central'})}
  return Draw.title(p,W)+g+Draw.below(p,cx,cy+d/2+fs*.4,p.num,p.den)}
});
Registry.register({
 id:'fraction-rect',category:'fractions',name:'Fracción rectangular',icon:'▦',description:'Rectángulo dividido en filas y columnas',
 parameters:[rg('rows','Filas',3,1,20,'Fracción'),rg('cols','Columnas',4,1,20,'Fracción'),rg('num','Partes pintadas',3,0,p=>p.rows*p.cols,'Fracción'),
  {key:'order',label:'Llenar por',type:'select',def:'rows',group:'Relleno',options:[['rows','Filas (horizontal)'],['cols','Columnas (vertical)']]},
  {key:'hFrom',label:'Comenzar desde',type:'select',def:'left',group:'Relleno',options:[['left','Izquierda'],['right','Derecha']]},
  {key:'vFrom',label:'Y desde',type:'select',def:'top',group:'Relleno',options:[['top','Arriba'],['bottom','Abajo']]},
  col('colorOn','Partes pintadas','#f97316'),col('colorOff','Partes sin pintar','#ffffff'),col('stroke','Contorno','#1e293b'),
  rg('strokeW','Grosor del contorno',3,0,12,'Estilo',true),rg('ratio','Proporción de celda (ancho/alto)',1,.3,3,'Estilo',true),rg('size','Tamaño de la figura (%)',80,30,100,'Estilo',true),
  {key:'showLabels',label:'Numerar las celdas',type:'check',def:false,group:'Etiquetas'},...Registry.infoParams(),...Registry.textStyle()],
 normalize(p){p.num=Math.min(p.num,p.rows*p.cols)},
 render(p,W,H){const fs=p.fontSize,tH=Draw.titleH(p),av=H-tH-Draw.belowH(p),s=p.size/100,R=p.rows,C=p.cols,k=Math.min(W*s/(C*p.ratio),av*s/R),cw=p.ratio*k,ch=k,x0=(W-C*cw)/2,y0=tH+(av-R*ch)/2;
  const cell={};for(let i=0;i<p.num;i++){let r=p.order==='rows'?Math.floor(i/C):i%R,c=p.order==='rows'?i%C:Math.floor(i/R);if(p.hFrom==='right')c=C-1-c;if(p.vFrom==='bottom')r=R-1-r;cell[r*C+c]=1}
  let g='';for(let r=0;r<R;r++)for(let c=0;c<C;c++){const x=x0+c*cw,y=y0+r*ch;
   g+=`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="${cell[r*C+c]?p.colorOn:p.colorOff}" stroke="${p.stroke}" stroke-width="${p.strokeW}"/>`;
   if(p.showLabels){const o=p.order==='rows'?(p.vFrom==='bottom'?R-1-r:r)*C+(p.hFrom==='right'?C-1-c:c):(p.hFrom==='right'?C-1-c:c)*R+(p.vFrom==='bottom'?R-1-r:r);g+=Draw.t(x+cw/2,y+ch/2,o+1,p,{fs:Math.min(fs*.7,cw*.4,ch*.4),b:'central'})}}
  return Draw.title(p,W)+g+Draw.below(p,W/2,y0+R*ch+fs*.4,p.num,R*C)}
});
})();
