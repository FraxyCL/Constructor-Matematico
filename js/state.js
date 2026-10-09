const DEF_CANVAS={preset:'square',w:800,h:800,transparent:false,grid:false,scale:2,theme:'light'};
const State={cur:null,params:{},canvas:{...DEF_CANVAS},
 p(){return this.params[this.cur]||(this.params[this.cur]=Registry.defaults(Registry.get(this.cur)))},
 snap(){return JSON.stringify({cur:this.cur,params:this.params,canvas:this.canvas})},
 load(s){const o=JSON.parse(s);this.cur=o.cur;this.params=o.params;this.canvas=o.canvas}};
