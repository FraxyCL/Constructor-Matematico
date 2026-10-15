// Utilidades compartidas por todas las construcciones. Cargar justo después de registry.js.
// Registry.h : constructores de parámetros  |  Draw.v : vectores 2D  |  Draw.arrow / Draw.fr : flecha y fracción apilada  |  Draw.g : dibujo sobre mapa unidades→píxeles
Registry.h={
 P:(key,label,def,min,max,group,o={})=>({key,label,def,min,max,group,type:'range',...o}),
 C:(key,label,def,group)=>({key,label,def,group,type:'color',style:true}),
 K:(key,label,def,group,show)=>({key,label,def,group,type:'check',show}),
 T:(key,label,def,group,show)=>({key,label,def,group,type:'text',show}),
 A:(key,label,def,group,rows=5,show)=>({key,label,def,group,type:'area',rows,show}),
 S:(key,label,def,group,options,show)=>({key,label,def,group,type:'select',options,show}),
 ts:(size=24)=>Registry.textStyle().map(q=>q.key==='fontSize'?{...q,def:size,min:8}:q),
 UN:(def='cm')=>({key:'unit',label:'Unidad de medida',type:'text',def,group:'Mostrar'})
};
// Rotulado de ángulos y lados: cada elemento elige 'off' | 'val' (solo valor) | 'name' (solo nombre) | 'both' (nombre = valor)
Registry.h.LM=[['off','Oculto'],['val','Solo el valor'],['name','Solo el nombre'],['both','Nombre y valor']];
Registry.h.LMR=[['off','Oculto'],['mark','Solo la marca del ángulo recto'],['val','Solo el valor'],['name','Solo el nombre'],['both','Nombre y valor']];
Registry.h.M=(key,label,def,group,show,opts)=>({key,label,def,group,type:'select',options:opts||Registry.h.LM,show});
Draw.lbl=(mode,name,val)=>mode==='val'?val:mode==='name'?name:mode==='both'?`${name} = ${val}`:'';
Draw.GR='αβγδεζηθικλμνξπρστυφ'.split('');
(()=>{
const D=Math.PI/180,add=(a,b)=>[a[0]+b[0],a[1]+b[1]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],mul=(a,k)=>[a[0]*k,a[1]*k],len=a=>Math.hypot(a[0],a[1]),unit=a=>mul(a,1/(len(a)||1)),mid=(a,b)=>mul(add(a,b),.5),
 rot=(a,t)=>[a[0]*Math.cos(t)-a[1]*Math.sin(t),a[0]*Math.sin(t)+a[1]*Math.cos(t)],
 foot=(p,a,b)=>{const d=sub(b,a);return add(a,mul(d,((p[0]-a[0])*d[0]+(p[1]-a[1])*d[1])/(d[0]*d[0]+d[1]*d[1])))},
 pol=(a,r=1)=>[r*Math.cos(a*D),r*Math.sin(a*D)],span=(a,b)=>((b-a)%360+360)%360;
Draw.v={D,add,sub,mul,len,unit,mid,rot,foot,pol,span};
Draw.arrow=(x1,y1,x2,y2,c,w,d)=>{const a=Math.atan2(y2-y1,x2-x1),h=w*3.5+6;
 return `<line x1="${x1}" y1="${y1}" x2="${x2-Math.cos(a)*h*.8}" y2="${y2-Math.sin(a)*h*.8}" stroke="${c}" stroke-width="${w}"${d?` stroke-dasharray="${d}"`:''}/><polygon points="${x2},${y2} ${x2-h*Math.cos(a-.4)},${y2-h*Math.sin(a-.4)} ${x2-h*Math.cos(a+.4)},${y2-h*Math.sin(a+.4)}" fill="${c}"/>`};
// fracción apilada centrada en x, con la barra en y
Draw.fr=(x,y,n,d,f,p,c)=>{const w=f*(String(Math.max(Math.abs(n),d)).length*.55+.5);
 return Draw.t(x,y-f*.3,n,p,{fs:f,c})+`<line x1="${x-w/2}" x2="${x+w/2}" y1="${y}" y2="${y}" stroke="${c||p.textColor}" stroke-width="${Math.max(1,f/14)}"/>`+Draw.t(x,y+f*.95,d,p,{fs:f,c})};
// m: mapa unidades→píxeles (y hacia arriba), centrado en (cx,cy); E = semiancho en unidades; below = alto reservado abajo
const X2='stroke-opacity=".55" clip-path="url(#cpg)"',defs=(W,H)=>`<clipPath id="cpg"><rect width="${W}" height="${H}"/></clipPath>`;
const view=(p,W,H,E,below=0,cx=0,cy=0)=>{const tH=Draw.titleH(p),av=H-tH-below,k=Math.min(W,av)*p.size/100/(2*E);return{k,tH,av,T:q=>[W/2+(q[0]-cx)*k,tH+av/2-(q[1]-cy)*k]}};
const ln=(m,a,b,col,w,d,o='')=>{const A=m.T(a),B=m.T(b);return `<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${col}" stroke-width="${w}"${d?` stroke-dasharray="${d}"`:''} ${o}/>`};
const lineS=(m,s,col,w)=>ln(m,s.a,s.b,col,w)+(s.ea?ln(m,s.ea,s.a,col,w,0,X2)+ln(m,s.b,s.eb,col,w,0,X2):'');
const arc=(m,c,r,a1,sp,close)=>{const s=m.T(add(c,pol(a1,r))),e=m.T(add(c,pol(a1+sp,r))),R=r*m.k;
 return sp>=359.99?`M${s} A${R} ${R} 0 1 0 ${m.T(add(c,pol(a1+180,r)))} A${R} ${R} 0 1 0 ${s}`:`M${close==='sector'?m.T(c)+' L'+s:s} A${R} ${R} 0 ${sp>180?1:0} 0 ${e}${close?' Z':''}`};
const ang=(m,p,V,t1,sp,r,col,txt)=>`<polyline points="${[...Array(25)].map((_,i)=>m.T(add(V,pol(t1+sp*i/24,r))).join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="${Math.max(2,p.strokeW*.7)}"/>`+(txt?Draw.t(...m.T(add(V,pol(t1+sp/2,r*1.75))),txt,p,{c:col,w:700,b:'central',fs:p.fontSize*.85}):'');
const between=(V,U,W)=>{const a=Math.atan2(U[1]-V[1],U[0]-V[0])/D,b=Math.atan2(W[1]-V[1],W[0]-V[0])/D,d=((b-a+540)%360)-180;return d>=0?[a,d]:[b,-d]};
const dot=(m,p,q,name,col,dir)=>{const a=m.T(q),d=dir||unit(q),o=p.fontSize*.95;return `<circle cx="${a[0]}" cy="${a[1]}" r="${p.strokeW*1.3+2}" fill="${col}" stroke="#fff" stroke-width="1.5"/>`+(name?Draw.t(a[0]+d[0]*o,a[1]-d[1]*o,name,p,{c:col,w:700,b:'central'}):'')};
const lab=(m,p,q,dir,txt,col)=>{const a=m.T(q),o=p.fontSize*.9;return Draw.t(a[0]+dir[0]*o,a[1]-dir[1]*o,txt,p,{c:col,w:700,b:'central',fs:p.fontSize*.85})};
const sq=(m,V,A,B,s,col,w)=>{const u=unit(sub(A,V)),v=unit(sub(B,V)),a=add(V,mul(u,s)),c=add(V,mul(v,s));return `<polyline points="${[a,add(a,mul(v,s)),c].map(q=>m.T(q).join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="${Math.max(1.5,w*.6)}"/>`};
const circ=(m,c,r,a)=>{const o=m.T(c);return `<circle cx="${o[0]}" cy="${o[1]}" r="${r*m.k}" ${a}/>`};
// texto alineado con el segmento P1–P2, fuera de la figura (se aleja del punto ref); k = distancia en alturas de letra
const sideLab=(m,p,P1,P2,t,col,ref,k=1,fsz)=>{fsz=fsz||p.fontSize*.8;const a=m.T(P1),b=m.T(P2),r=m.T(ref),c=[(a[0]+b[0])/2,(a[1]+b[1])/2],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;let n=[-dy/l,dx/l];if(n[0]*(c[0]-r[0])+n[1]*(c[1]-r[1])<0)n=[-n[0],-n[1]];
 const x=c[0]+n[0]*fsz*k*1.1,y=c[1]+n[1]*fsz*k*1.1;let an=Math.atan2(dy,dx)*180/Math.PI;if(an>90)an-=180;if(an<-90)an+=180;
 return `<g transform="rotate(${an} ${x} ${y})">${Draw.t(x,y,t,p,{c:col,w:700,b:'central',fs:fsz})}</g>`};
Draw.g={X2,defs,view,ln,lineS,arc,ang,between,dot,lab,sq,circ,sideLab};
})();
