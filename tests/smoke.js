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
console.log(bad?`\n${bad} FALLAS`:'\nTodo en orden',`(${n} renders, ${items.length} construcciones)`);process.exit(bad?1:0);
