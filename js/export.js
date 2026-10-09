// Exporta solo el SVG del lienzo (sin interfaz ni cuadrícula)
const Export={
 svg(){const s=document.querySelector('#paper svg').cloneNode(true),{w,h}=State.canvas;s.setAttribute('xmlns','http://www.w3.org/2000/svg');s.setAttribute('width',w);s.setAttribute('height',h);return new XMLSerializer().serializeToString(s)},
 png(){return new Promise((ok,no)=>{const{w,h,scale}=State.canvas,img=new Image();
  img.onload=()=>{const c=document.createElement('canvas');c.width=w*scale;c.height=h*scale;c.getContext('2d').drawImage(img,0,0,c.width,c.height);c.toBlob(b=>b?ok(b):no(),'image/png')};
  img.onerror=no;img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(this.svg())})},
 async download(kind){try{const b=kind==='png'?await this.png():new Blob([this.svg()],{type:'image/svg+xml'}),a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download=`construccion-${State.cur||'lienzo'}.${kind}`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1e3);toast('✓ '+kind.toUpperCase()+' descargado')}catch(e){toast('No se pudo exportar')}},
 async copy(){try{await navigator.clipboard.write([new ClipboardItem({'image/png':this.png()})]);toast('✓ Imagen copiada al portapapeles')}
  catch(e){toast('Tu navegador no permitió copiar. Usa Descargar PNG')}}
};
