// Pruebas automáticas: node tests/smoke.js
// 1) carga los scripts en el orden de index.html  2) genera TODAS las construcciones con sus variantes (casillas y listas)  3) revisa el panel y el lienzo de la app con un DOM simulado  4) valida resultados matemáticos conocidos
const fs=require('fs'),vm=require('vm'),path=require('path'),root=path.join(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
let bad=0,n=0;const ck=(m,c)=>{if(!c){bad++;console.log('FALLA:',m)}};
const el=()=>({innerHTML:'',textContent:'',style:{setProperty(){}},classList:{toggle(){},add(){},remove(){},contains(){return false}},clientWidth:1000,clientHeight:800,addEventListener(){},dataset:{}}),nodes={};
global.document={querySelector:s=>nodes[s]||(nodes[s]=el()),querySelectorAll:()=>[],body:el(),addEventListener(){},createElement:()=>el()};global.localStorage={getItem(){return null},setItem(){}};global.addEventListener=()=>{};
const srcs=[...read('index.html').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);srcs.forEach(s=>vm.runInThisContext(read(s),{filename:s}));
const R=vm.runInThisContext('Registry'),S=vm.runInThisContext('State'),App=vm.runInThisContext('App'),items=Object.values(R.items);
const mk=(c,v={},w={})=>{const p={...R.defaults(c),...v};c.normalize&&c.normalize(p);Object.assign(p,w);return p};
const run=(id,v,w)=>{const c=R.get(id);n++;const s=c.render(mk(c,v,w),800,800);if(/NaN|undefined|Infinity/.test(s)){bad++;console.log('NaN/undefined en',id,JSON.stringify(v||{}).slice(0,70))}return s};
// 1+2: variantes de cada construcción
items.forEach(c=>{const vs=[{}],all={};c.parameters.forEach(q=>{if(q.type==='check')all[q.key]=true;if(q.type==='select')q.options.forEach(o=>vs.push({[q.key]:o[0]}))});vs.push(all);
 c.parameters.filter(q=>q.type==='check').forEach(q=>vs.push({[q.key]:!q.def}));vs.push({data:''},{data:'5'});
 vs.forEach(v=>{try{run(c.id,v)}catch(e){bad++;console.log('ERROR',c.id,JSON.stringify(v).slice(0,70),e.message)}})});
// 3: panel y lienzo (incluye temas)
App.init();items.forEach(c=>{S.cur=c.id;S.p();try{App.panel();App.draw();const h=nodes['#panel'].innerHTML;ck('panel '+c.id,h.length>200&&!/undefined|NaN/.test(h))}catch(e){bad++;console.log('ERROR app',c.id,e.message)}});
['dark','gray'].forEach(t=>{S.canvas.theme=t;App.draw();ck('tema '+t,nodes['#paper'].innerHTML.includes('filter="url(#fx)"'))});S.canvas.theme='light';
// 4: resultados matemáticos
const has=(s,t)=>s.includes(t),val=(s,re)=>{const m=s.match(re);return m?parseFloat(m[1].replace(',','.')):NaN},near=(a,b,t)=>Math.abs(a-b)<t;
let s=run('triangle',{type:'esc',med:true,bis:true,alt:true,mtz:true});ck('G,I,H visibles',has(s,'>G<')&&has(s,'>I<')&&has(s,'>H<'));
s=run('triangle',{type:'obt',alt:true});ck('H oculto sin prolongar',!has(s,'>H<'));s=run('triangle',{type:'obt',alt:true,xAlt:500});ck('H con prolongación',has(s,'>H<'));
s=run('triangle',{type:'esc',showA:true,showM:true,angV0:'off',angV2:'off',sideV1:'off'});ck('visibilidad selectiva',(s.match(/°/g)||[]).length===1&&(s.match(/ cm/g)||[]).length===2);
s=run('circle',{showDia:true,showCho:true,showArc:true,showPA:true,kind:'disc'});ck('circunferencia',['d = 8 cm','arco FG = 90°','L = 2·π·r','A = π·r²'].every(t=>has(s,t)));
const cls=v=>(run('circle-two',v).match(/>([^<]*(?:exteriores|secantes|Tangentes|interiores|concéntricas|coincidentes))</)||[])[1];ck('posiciones relativas',cls({dist:9})==='Circunferencias exteriores'&&cls({dist:7})==='Tangentes exteriores'&&cls({dist:5})==='Circunferencias secantes'&&cls({dist:1})==='Tangentes interiores'&&cls({dist:0})==='Circunferencias concéntricas');
s=run('stat-table',{});ck('tabla de frecuencias',has(s,'Total')&&has(s,'>13<'));
s=run('solid-poly',{kind:'cube',showFormula:true});ck('cubo',has(s,'96 cm²')&&has(s,'64 cm³'));
s=run('angle-lines',{relP:'ai'});ck('alternos internos',has(s,'Alternos internos: ∠3 = ∠6')&&has(s,'∠4 = ∠5'));
const ar=(v,w)=>run('area-compose',v,w);
s=ar({},{rH:true,pH:true,rT:true,pT:true});ck('cuadrado−círculo: área',near(val(s,/achurada ≈ ([\d,]+)/),64-16*Math.PI,.01));ck('cuadrado−círculo: perímetro',near(val(s,/región achurada ≈ ([\d,]+)/),32+8*Math.PI,.05));
s=ar({preset:'lens'});ck('lente',near(val(s,/achurada ≈ ([\d,]+)/),32*Math.acos(.5)-2*Math.sqrt(48),.01));
s=ar({preset:'circSq'});ck('círculo−cuadrado inscrito',near(val(s,/achurada ≈ ([\d,]+)/),16*Math.PI-32,.01));
s=ar({preset:'track'});ck('pista: área y perímetro',near(val(s,/total de la figura ≈ ([\d,]+)/),32+4*Math.PI,.01)&&near(val(s,/Perímetro de la figura ≈ ([\d,]+)/),16+4*Math.PI,.05));
s=ar({preset:'rosette'});ck('cuadrado con 4 círculos',near(val(s,/achurada ≈ ([\d,]+)/),64-16*Math.PI,.01));
// teoremas y trigonometría
s=run('pyth');ck('pitágoras 3-4-5',has(s,'a² + b² = c²')&&has(s,'3² + 4² = 9 + 16 = 25 = 5²')&&has(s,'terna pitagórica'));
s=run('pyth',{find:'c'});ck('pitágoras: hipotenusa x',has(s,'c = √(3² + 4²) = √25 = 5 cm')&&has(s,'c = x')&&has(s,'c² = x²'));
const pp=mk(R.get('pyth'),{trip:'51213'});ck('terna 5-12-13',pp.a===5&&pp.b===12);const pc=mk(R.get('pyth'),{},{a:6});R.get('pyth').normalize(pc);ck('medidas libres al editar',pc.trip==='custom');
s=run('pyth-proof');ck('demostración',has(s,'c² = a² + b²')&&has(s,'25 = 9 + 16'));
s=run('thales-lines');ck('thales paralelas: razón',has(s,'razón = 1,5'));s=run('thales-lines',{find:'AB'});ck('thales paralelas: despeje',has(s,'x = ')&&has(s,'AB = x'));
s=run('thales-triangle');ck('thales triángulo: razón',has(s,'razón = 0,4'));s=run('thales-triangle',{find:'DE'});ck('thales: DE',has(s,'= 2,4 cm')&&has(s,'DE = x'));
s=run('thales-triangle',{fig:'x'});ck('thales en X',has(s,'AB / AD = AC / AE = BC / DE'));
s=run('trig-ratios');ck('razones 35°',has(s,'0,574')&&has(s,'0,819')&&has(s,'0,7'));s=run('trig-ratios',{find:'opp'});ck('trig despeje',has(s,'x = 10 · sen 35° = 5,736 cm'));
s=run('trig-circle',{th:30});ck('circunferencia goniométrica',has(s,'sen θ = 0,5')&&has(s,'cos θ = 0,866'));s=run('trig-circle',{th:90});ck('tan 90° no definida',has(s,'no definida'));
s=run('trig-table',{form:'both'});ck('tabla notables',has(s,'√3')&&has(s,'≈ 0,866'));
// nueva versión: encabezado, modos de rotulado por elemento y espejo
ck('encabezado',read('index.html').includes('Profesor Michael Núñez²'));
s=run('triangle',{type:'esc',showA:true,angV0:'both',angV1:'name',angV2:'off'});ck('ángulos: nombre y valor / solo nombre / oculto',/α = [\d,]+°/.test(s)&&has(s,'>β<')&&!has(s,'γ'));
s=run('triangle',{type:'esc',showM:true,sideV0:'name',sideV1:'both',sideV2:'val'});ck('lados: modos',has(s,'>AB<')&&/BC = [\d,]+ cm/.test(s)&&/>[\d,]+ cm</.test(s));
s=run('pyth',{squares:false,mA:'val',mB:'name',mC:'off'});ck('pitágoras: lados por modo',has(s,'>3 cm<')&&has(s,'>b<')&&!has(s,'c = ')&&!has(s,'>c<'));
s=run('pyth',{squares:false,nA:'both',nB:'name',nC:'both'});ck('pitágoras: ángulos por modo',/α = 36,87°/.test(s)&&has(s,'>β<')&&has(s,'γ = 90°'));
s=run('pyth',{nC:'mark'});ck('ángulo recto solo marca',!has(s,'γ'));
s=run('trig-ratios',{mO:'name',mH:'val',mA:'off',nT:'name',nR:'both',nO:'both'});ck('trigonometría: modos',has(s,'>cateto opuesto<')&&has(s,'>10 cm<')&&!has(s,'>cateto adyacente = ')&&has(s,'>θ<')&&has(s,'γ = 90°')&&/φ = 55°/.test(s));
const tx=(s)=>{const m=s.match(/<polygon points="([^"]+)"/);return m[1].split(' ').map(q=>q.split(',').map(Number))};
const ref=tx(run('pyth',{squares:false})),fh=tx(run('pyth',{squares:false,flipH:true})),fv=tx(run('pyth',{squares:false,flipV:true}));
ck('espejo horizontal (pitágoras)',ref.every((q,i)=>near(fh[i][0],800-q[0],.01)&&near(fh[i][1],q[1],.01)));const sy=Math.min(...ref.map(q=>q[1]))+Math.max(...ref.map(q=>q[1]));ck('espejo vertical (pitágoras)',ref.every((q,i)=>near(fv[i][0],q[0],.01)&&near(fv[i][1],sy-q[1],.01)));
const rt=tx(run('trig-ratios')),rth=tx(run('trig-ratios',{flipH:true}));ck('espejo horizontal (trigonometría)',rt.every((q,i)=>near(rth[i][0],800-q[0],.01)&&near(rth[i][1],q[1],.01)));
const g1=tx(run('triangle',{type:'esc'})),g2=tx(run('triangle',{type:'esc',flipH:true}));ck('espejo en geometría',g1.every((q,i)=>near(g2[i][0],800-q[0],.01)&&near(g2[i][1],q[1],.01)));
s=run('triangle',{type:'obt',alt:true,xAlt:500,flipH:true,rot:30});ck('espejo + centros',has(s,'>H<'));
s=run('thales-lines',{sg0:'name',sg1:'val',sg2:'off'});ck('thales paralelas: modos',has(s,'>AB<')&&/>[\d,]+ cm</.test(s));
s=run('thales-triangle',{s0:'val',s1:'name',s2:'off',s3:'off',s4:'off',s5:'off'});ck('thales triángulo: modos',has(s,'>2 cm<')&&has(s,'>DB<')&&!has(s,'AE = '));
s=run('angle-lines',{ang0:'name',ang1:'val',ang2:'both',ang3:'off'});ck('rectas cortadas: modos',has(s,'>∠1<')&&has(s,'>65°<')&&has(s,'∠3 = 65°')&&!has(s,'∠4'));
s=run('circle',{lmRad:'name',showDia:true,lmDia:'val'});ck('circunferencia: modos',has(s,'>r<')&&!has(s,'r = 4 cm')&&has(s,'>8 cm<'));
s=run('circle-angles',{kind:'inscribed',lm:'both'});ck('ángulos en la circunferencia: modos',has(s,'∠ACB = 60°')&&has(s,'arco AB = 120°'));
// MCM
const mc=(v)=>run('mcm',v);
s=mc({});ck('MCM(6, 8) = 24',has(s,'MCM(6, 8) = 24'));
s=mc({nums:'4 6 10',method:'ladder'});ck('MCM de 3 números (60) y escalera',has(s,'MCM(4, 6, 10) = 60')&&has(s,'2² · 3 · 5'));
s=mc({nums:'12, 18; 30; 45',method:'factors'});ck('MCM de 4 números y factores',has(s,'= 180')&&has(s,'2² · 3² · 5'));
s=mc({nums:'6 8',method:'list'});ck('lista de múltiplos',has(s,'M(6)')&&has(s,'>24<'));
s=mc({nums:'3 4',method:'jumps',more:true});ck('saltos, 2.º múltiplo común',has(s,'MCM = 12')&&has(s,'>24<'));
s=mc({nums:'23 29',method:'list'});ck('MCM grande: aviso en lista',has(s,'demasiados múltiplos')&&has(s,'667'));
s=mc({nums:'99991 99989 99971',method:'ladder'});ck('MCM enorme (BigInt)',has(s,'MCM(99991, 99989, 99971) = 999.510.'));
s=mc({nums:'5'});ck('un solo número: aviso',has(s,'al menos dos números'));
s=mc({nums:'7 7',method:'bars'});ck('números iguales',has(s,'MCM(7, 7) = 7'));
// Factores primos
const pf=(v)=>run('primefactors',v);
s=pf({});ck('60 = 2² · 3 · 5 (árbol)',has(s,'60 = 2² · 3 · 5')&&has(s,'60 = 2 · 2 · 3 · 5'));
s=pf({nums:'97'});ck('97 es primo',has(s,'97 es un número primo'));
s=pf({nums:'1'});ck('1 no es primo ni compuesto',has(s,'1 no es primo ni compuesto'));
s=pf({nums:'360',strat:'pair',dir:'right'});ck('360 en pares, árbol a la derecha',has(s,'360 = 2³ · 3² · 5'));
s=pf({nums:'360',method:'ladder'});ck('escalera 360',has(s,'>360<')&&has(s,'>5<'));
s=pf({nums:'360',method:'pow'});ck('burbujas 360',has(s,'>2³<')&&has(s,'>3²<'));
s=pf({nums:'36 48 90',showCount:true,showList:true});ck('3 números: divisores',has(s,'Cantidad de divisores: (2+1) · (2+1) = 9')&&has(s,'Divisores de 36:'));
const cnt=(s)=>(s.match(/<circle/g)||[]).length;ck('niveles visibles',cnt(pf({lev:1}))===1&&cnt(pf({lev:2}))===3&&cnt(pf({lev:20}))===cnt(pf({}))&&cnt(pf({}))===7);
s=pf({nums:'65536'});ck('2^16 cabe',has(s,'2¹⁶'));s=pf({nums:'99991'});ck('primo grande',has(s,'es un número primo'));
// MCD
const gd=(v)=>run('mcd',v);
s=gd({});ck('MCD(12, 18) = 6',has(s,'MCD(12, 18) = 6')&&has(s,'12 = 6 × 2'));
s=gd({nums:'12 18 30',method:'divs'});ck('MCD de 3 números y divisores',has(s,'MCD(12, 18, 30) = 6')&&has(s,'Divisores de 30'));
s=gd({nums:'48 180',method:'euclid'});ck('Euclides 48 y 180',has(s,'MCD(48, 180) = 12')&&has(s,'180 = 48 · 3 + 36')&&has(s,'36 = 12 · 3 + 0'));
s=gd({nums:'48 180 100',method:'euclid'});ck('Euclides encadenado',has(s,'MCD(48, 180, 100) = 4'));
s=gd({nums:'36 60 84',method:'factors'});ck('MCD por factores',has(s,'MCD(36, 60, 84) = 12')&&has(s,'2² · 3'));
s=gd({nums:'36 60 84',method:'ladder'});ck('MCD por escalera',has(s,'= 2 · 2 · 3 = 12'));
s=gd({nums:'8 15',method:'ladder'});ck('primos entre sí (escalera)',has(s,'primos entre sí')&&has(s,'No hay ningún primo'));
s=gd({nums:'12 18',method:'rect'});ck('cuadrados de Euclides',has(s,'mide 6'));
s=gd({nums:'12 18',method:'bars',test:4});ck('bloque de prueba que no sirve',has(s,'4 no divide a todos')&&has(s,'sobra 2'));
s=gd({nums:'12 18',showRel:true});ck('relación MCD × MCM',has(s,'6 × 36 = 216 = 12 × 18'));
for(const m of ['bars','rect','divs','euclid','factors','ladder']){s=gd({nums:'99991 99989',method:m});ck('MCD grande/primos, '+m,has(s,'MCD(99991, 99989) = 1'))}
s=gd({nums:'1 1',method:'factors'});ck('MCD de unos',has(s,'= 1'));
s=gd({nums:'7'});ck('MCD un solo número',has(s,'al menos dos'));
// Fracción rectangular impropia
const fr=(v)=>run('fraction-rect',v);
s=fr({rows:1,cols:4,num:7,showMixed:true});ck('7/4 = 1 3/4',has(s,'7/4 = 1 3/4')&&(s.match(/<rect/g)||[]).length>=8);
s=fr({rows:1,cols:3,num:5,showMixed:true});ck('5/3 = 1 2/3',has(s,'5/3 = 1 2/3'));
s=fr({rows:1,cols:4,num:8});ck('8/4 = 2',has(s,'8/4 = 2'));
s=fr({rows:1,cols:4,num:3});ck('propia sin mixto',!has(s,'entero'));
const fills=(s,c)=>(s.match(new RegExp('fill="'+c+'"','g'))||[]).length;
ck('celdas pintadas = numerador',fills(fr({rows:2,cols:3,num:11}),'#f97316')===11);
// Combinatoria
const cm=(id,v)=>run(id,v);
s=cm('comb-mult',{});ck('principio multiplicativo 3 × 2 = 6',has(s,'3 × 2 = 6 combinaciones')&&has(s,'roja – negro'));
s=cm('comb-mult',{method:'table'});ck('tabla de doble entrada',has(s,'>Polera<')&&has(s,'>6<'));
s=cm('comb-mult',{st:'A: 1, 2, 3\nB: x, y\nC: p, q, r, s',method:'boxes'});ck('3 elecciones: 3 × 2 × 4 = 24',has(s,'3 × 2 × 4 = 24'));
s=cm('comb-mult',{st:'A: 1,2,3,4,5,6,7,8\nB: 1,2,3,4,5,6,7,8\nC: 1,2,3,4,5,6,7,8'});ck('árbol demasiado grande: aviso',has(s,'demasiados'));
s=cm('comb-perm',{});ck('P(3) = 6',has(s,'P(3) = 3! = 6'));
s=cm('comb-perm',{el:'A B C D E',r:3,method:'boxes'});ck('P(5, 3) = 60',has(s,'P(5, 3) = 5! / (5−3)! = 60')&&has(s,'5 × 4 × 3 = 60'));
s=cm('comb-perm',{el:'MAMA',kind:'rep'});ck('anagramas de MAMA = 6',has(s,'4! / (2! · 2!) = 6'));
s=cm('comb-perm',{el:'A B C D',kind:'circ'});ck('circulares: (4−1)! = 6',has(s,'(4−1)! = 3! = 6'));
s=cm('comb-perm',{el:'A B C D E F',r:6,method:'list'});ck('720 ordenaciones en lista',has(s,'P(6) = 6! = 720')&&has(s,'ABCDEF')&&has(s,'FEDCBA'));
s=cm('comb-comb',{});ck('C(4, 2) = 6',has(s,'C(4, 2) = 4! / (2! · 2!) = 6')&&has(s,'{A, B}')&&has(s,'{C, D}'));
s=cm('comb-comb',{method:'pascal',el:'A B C D E',r:2});ck('Pascal C(5, 2) = 10',has(s,'>10<')&&has(s,'= 10'));
s=cm('comb-comb',{method:'rel',el:'A B C D',r:3});ck('P(4,3)/3! = C(4,3)',has(s,'24 ordenaciones en total ÷ 6 = 4 grupos'));
s=cm('comb-comb',{method:'tree',el:'A B C D E',r:3});ck('árbol de combinaciones C(5,3) = 10',has(s,'= 10')&&has(s,'>A, B, C<'));
// Estadística extra
s=cm('stat-stem',{});ck('tallo y hojas: n = 16',has(s,'n = 16 datos')&&has(s,'mediana = 34')&&has(s,'Clave: 3 | 5 significa 35'));
s=cm('stat-stem',{data2:'10 14 18 22 25',n1:'A',n2:'B'});ck('tallo y hojas espalda con espalda',has(s,'A: mediana')&&has(s,'B: mediana = 18'));
s=cm('stat-box',{});ck('caja: Q de Curso A',has(s,'Mín 4 · Q₁ 5 · Me 7 · Q₃ 8 · Máx 10 · RIC 3'));
s=cm('stat-box',{data:'A; 2 4 5 6 6 7 8 9 10 30',whisk:'iqr',orient:'v'});ck('caja: valor atípico 30 fuera del bigote',has(s,'Máx 30')&&has(s,'<circle'));
s=cm('stat-freqmean',{});ck('frecuencias: media 7 y moda 7',has(s,'112 / 16 = 7')&&has(s,'Moda: 7  (fi = 4)')&&has(s,'Mediana = 7'));
s=cm('stat-freqmean',{group:'classes',data:'12 15 17 21 23 24 27 31 33 34 38 41 45 46 52 58',width:10});ck('intervalos: marca de clase y media 33,13',has(s,'[10, 20[')&&has(s,'530 / 16 = 33,13'));
s=cm('stat-center',{});ck('media, mediana y moda',has(s,'= 60 / 10 = 6')&&has(s,'Moda = 6'));
s=cm('stat-center',{data:'2 3 3 5 8 8 9 12'});ck('dos modas y mediana de dos datos',has(s,'Moda = 3 y 8')&&has(s,'= 6,5'));
// Triángulo rectángulo a medida
const tf=(v)=>run('trig-free',v);
s=tf({});ck('a medida: θ=35 y c=10 completan catetos',has(s,'8,19 cm')&&has(s,'5,74 cm')&&has(s,'55°')&&!has(s,'no forman'));
s=tf({theta:'30',hyp:'',opp:'5',rsin:true});ck('a medida: 30° y cateto 5 → hipotenusa 10',has(s,'>10 cm<')&&has(s,'sen θ = cateto opuesto / hipotenusa = 5 / 10 = 0,5'));
s=tf({theta:'',opp:'3',adj:'4',hyp:'5',nT:'both'});ck('a medida: 3-4-5 da θ = 36,87°',has(s,'θ = 36,87°'));
s=tf({theta:'30',opp:'9',adj:'4',hyp:'5'});ck('a medida: datos imposibles se dibujan igual con aviso',has(s,'no forman un triángulo')&&has(s,'>9 cm<')&&has(s,'>5 cm<')&&has(s,'>4 cm<')&&has(s,'30°'));
s=tf({theta:'80',opp:'3',adj:'4',hyp:'5'});ck('a medida: ángulo incompatible con catetos',has(s,'no forman un triángulo')&&has(s,'80°'));
s=tf({theta:'120',opp:'',hyp:''});ck('a medida: ángulo imposible no rompe',has(s,'no forman un triángulo')&&has(s,'120°'));
s=tf({theta:'60',opp:'5√3',adj:'5',hyp:'10',mO:'both',nT:'both',lab:'letters'});ck('a medida: raíz escrita y consistente',has(s,'a = 5√3 cm')&&!has(s,'no forman'));
s=tf({theta:'α',phi:'β',opp:'a',adj:'b',hyp:'c',nT:'both',nO:'both',mO:'both'});ck('a medida: solo letras',has(s,'θ = α')&&has(s,'φ = β')&&has(s,'cateto opuesto = a'));
s=tf({mO:'off',mA:'off',mH:'off',nT:'off',nO:'off',nR:'off'});ck('a medida: todo oculto',!has(s,'cm')&&!has(s,'°'));
s=tf({theta:'35',hyp:'10',fill:false,opp:'',adj:''});ck('a medida: sin completar no inventa valores',!has(s,'8,19')&&has(s,'>10 cm<'));
s=tf({basis:'legs',opp:'3',adj:'4',theta:'35',hyp:''});ck('a medida: dibujo con los catetos',has(s,'no forman un triángulo')&&has(s,'>3 cm<'));
// Ángulos y teoremas de la circunferencia
const cpb=(v)=>run('circle-problems',v);
s=cpb({});ck('circunferencia: inscrito x = ½ arco',has(s,'x:  ∠ACB = ½ · arco AB = ½ · 80° = 40°')&&has(s,'x = 40°'));
s=cpb({mx_i1:'off',mx_c1:'x',mx_arc1:'val'});ck('circunferencia: central x = arco',has(s,'x:  ∠AOB = arco AB = 80°'));
s=cpb({mx_i1:'val',mx_arc1:'x',mx_c1:'off'});ck('circunferencia: arco x = 2 · inscrito',has(s,'x:  arco AB = 2 · ∠ACB = 2 · 40° = 80°'));
s=cpb({mx_i1:'off',mx_s1:'x',mx_q1:'y'});ck('circunferencia: semiinscrito y cuadrilátero (x e y)',has(s,'x:  ∠(t,AB) = ½ · arco AB = ½ · 80° = 40°')&&has(s,'y:  ∠DAB = ½ · (arco BC + arco CD) = ½ · (100° + 70°) = 85°'));
s=cpb({kind:'int'});ck('ángulo interior: ½(80° + 70°) = 75°',has(s,'x:  ∠APB = ½ · (arco AB + arco CD) = ½ · (80° + 70°) = 75°'));
s=cpb({kind:'int',in_a1:'val',in_arc1:'x',in_arc3:'val'});ck('ángulo interior: arco desconocido',has(s,'x:  2 · ∠APB = arco AB + arco CD')&&has(s,'= 80°'));
s=cpb({kind:'ext'});ck('ángulo exterior (dos secantes) = 40°',has(s,'x:  ∠P = ½ · (arco BD − arco AC) = ½ · (130° − 50°) = 40°'));
s=cpb({kind:'ext',extType:'tt',exN:120});ck('dos tangentes: 60°',has(s,'= ½ · (240° − 120°) = 60°')&&has(s,'180° − arco menor'));
s=cpb({kind:'ext',extType:'ts',exN:40,exF:150});ck('tangente y secante (ángulo): 55°',has(s,'(150° − 40°) = 55°'));
s=cpb({kind:'ext',ex_p:'val',ex_far:'x'});ck('ángulo exterior: arco lejano desconocido',has(s,'x:  arco BD = 2 · ∠P + arco AC = 2 · 40° + 50° = 130°'));
s=cpb({kind:'chords'});ck('cuerdas: PD = 2 cm',has(s,'PD · PC = PA · PB')&&has(s,'PD = 4 · 3 / 6 = 2 cm')&&has(s,'x = 2 cm'));
s=cpb({kind:'chords',ch_pa:'x',ch_pd:'val'});ck('cuerdas: PA desconocido = 4 cm',has(s,'PA = 6 · 2 / 3 = 4 cm'));
s=cpb({kind:'secants'});ck('secantes: PD = 6 cm',has(s,'PD = 2 · 9 / 3 = 6 cm'));
s=cpb({kind:'secants',sc_pa:'x',sc_pb:'y',sc_pd:'val'});ck('secantes: dos incógnitas',has(s,'PA = 3 · 6 / 9 = 2 cm')&&has(s,'PB = 3 · 6 / 2 = 9 cm'));
s=cpb({kind:'tansec'});ck('tangente y secante: PB = 6²/4 = 9 cm',has(s,'PB = 6² / 4 = 9 cm'));
s=cpb({kind:'tansec',ts_pt:'x',ts_pb:'val'});ck('tangente y secante: PT = √(4·9) = 6',has(s,'PT = √(4 · 9) = 6 cm'));
s=cpb({kind:'tansec',ts_pb:'val',ts_pa:'x',ts_pt:'val'});ck('tangente y secante: PA = 36/9 = 4',has(s,'PA = 6² / 9 = 4 cm'));
s=cpb({mx_arc1:'off',mx_c1:'off',mx_i1:'off',showThm:false,showSol:false});ck('circunferencia: todo oculto sin texto de ángulos',!has(s,'°'));
for(const k of ['mix','int','ext','chords','secants','tansec'])for(const fl of [false,true]){s=cpb({kind:k,flipH:fl,flipV:fl,rot:33,showO:true});ck('circunferencia: '+k+' rotada/espejo',has(s,'<circle'))}
console.log(bad?`\n${bad} FALLAS`:'\nTodo en orden',`(${n} renders, ${items.length} construcciones)`);process.exit(bad?1:0);
