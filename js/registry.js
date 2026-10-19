// Registro de construcciones: cada módulo llama Registry.register({id,category,name,icon,description,parameters,render,normalize?})
const Registry={
 cats:[
  {id:'geometry',name:'Geometría',icon:'📐',planned:[]},
  {id:'area',name:'Perímetro y área',icon:'📏',planned:[]},
  {id:'solids',name:'Cuerpos geométricos',icon:'🧊',planned:[]},
  {id:'theorems',name:'Teoremas y trigonometría',icon:'🔺',planned:[]},
  {id:'fractions',name:'Números y fracciones',icon:'🔢',planned:[]},
  {id:'data',name:'Datos y estadística',icon:'📊',planned:[]},
  {id:'combinatorics',name:'Combinatoria',icon:'🎲',planned:[]},
  {id:'functions',name:'Funciones',icon:'📈',planned:[]},
  {id:'transforms',name:'Transformaciones',icon:'🔄',planned:[]},
  {id:'circles',name:'Circunferencia y ángulos',icon:'⭕',planned:[]},
  {id:'constructions',name:'Construcciones',icon:'🧩',planned:['Mediatriz y bisectriz','Centros del triángulo']},
  {id:'other',name:'Otros recursos',icon:'📝',planned:[]}],
 items:{},register(c){this.items[c.id]=c},get(id){return this.items[id]},
 defaults(c){const o={};c.parameters.forEach(q=>o[q.key]=q.def);return o},
 byCat(id){return Object.values(this.items).filter(c=>c.category===id)},
 infoParams:()=>[['showFrac','Mostrar fracción',true],['showDec','Mostrar decimal',false],['showPct','Mostrar porcentaje',false]].map(([key,label,def])=>({key,label,def,type:'check',group:'Etiquetas'})),
 textStyle:()=>[
  {key:'title',label:'Título (opcional)',type:'text',def:'',group:'Etiquetas'},
  {key:'font',label:'Tipo de letra',type:'select',def:'Arial, Helvetica, sans-serif',group:'Texto',style:true,options:[['Arial, Helvetica, sans-serif','Arial'],['Georgia, serif','Georgia'],["'Times New Roman', serif",'Times'],["'Courier New', monospace",'Courier'],["'Trebuchet MS', sans-serif",'Trebuchet']]},
  {key:'fontSize',label:'Tamaño de texto',type:'range',def:28,min:10,max:72,group:'Texto',style:true},
  {key:'textColor',label:'Color de texto',type:'color',def:'#1e293b',group:'Texto',style:true}]
};
// Utilidades de dibujo SVG compartidas por los módulos
const Draw={
 fmt:x=>(Math.round(x*100)/100).toLocaleString('es-CL'),
 esc:s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
 t(x,y,s,p,o={}){return `<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" dominant-baseline="${o.b||'auto'}" font-family="${p.font}" font-size="${o.fs||p.fontSize}" font-weight="${o.w||400}" fill="${o.c||p.textColor}">${this.esc(s)}</text>`},
 titleH:p=>p.title?p.fontSize*2.2:0,
 title(p,W){return p.title?this.t(W/2,p.fontSize*1.5,p.title,p,{w:700,fs:p.fontSize*1.15}):''},
 belowH(p){const f=p.fontSize,i=p.showDec||p.showPct;return (p.showFrac?f*2.6:0)+(i?f*1.3:0)+((p.showFrac||i)?f*.5:0)},
 below(p,x,y,n,d){const f=p.fontSize;let o='';
  if(p.showFrac){const w=f*(String(Math.max(n,d)).length*.6+.8);o+=this.t(x,y+f*.95,n,p)+`<line x1="${x-w/2}" x2="${x+w/2}" y1="${y+f*1.2}" y2="${y+f*1.2}" stroke="${p.textColor}" stroke-width="${Math.max(1.5,f/14)}"/>`+this.t(x,y+f*2.3,d,p);y+=f*2.6}
  const a=[];if(p.showDec)a.push(this.fmt(n/d));if(p.showPct)a.push(this.fmt(n/d*100)+' %');
  return o+(a.length?this.t(x,y+f*.9,a.join('  =  '),p,{fs:f*.85}):'')}
};

// ---- Ayudas reutilizables para cualquier figura con vértices (geometría actual y futura) ----
// Visibilidad selectiva: casillas "Ángulo en A…" y "Lado AB…" (claves angV{i} / sideV{i}); build() las respeta.
// count: nº de vértices (número o p=>número); max: tope de casillas.
Registry.vis=(count,max=count)=>{const cnt=p=>typeof count==='function'?count(p):count,N='ABCDEFGHIJKLMNOPQRST',o=[];
 for(let i=0;i<max;i++)o.push({key:'angV'+i,label:'Ángulo en '+N[i],type:'select',options:Registry.h.LM,def:'val',group:'Ángulos visibles',show:p=>p.showA&&i<cnt(p)});
 for(let i=0;i<max;i++)o.push({key:'sideV'+i,label:p=>'Lado '+N[i]+N[(i+1)%cnt(p)],type:'select',options:Registry.h.LM,def:'val',group:'Lados visibles',show:p=>p.showM&&i<cnt(p)});
 return o};
// Recta auxiliar con prolongación: x = % de prolongación en cada extremo (se recorta al lienzo, no cambia el tamaño de la figura)
Registry.seg=(a,b,c,d,x=0)=>{const s={a,b,c,d};if(x>0){const k=x/100,v=[b[0]-a[0],b[1]-a[1]];s.ea=[a[0]-v[0]*k,a[1]-v[1]*k];s.eb=[b[0]+v[0]*k,b[1]+v[1]*k]}return s};
Registry.extParam=(key,label,show)=>({key,label,type:'range',def:0,min:0,max:500,step:10,group:'Rectas notables',show});
