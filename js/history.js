const History={s:[],i:-1,
 push(){const x=State.snap();if(this.s[this.i]===x)return;this.s=this.s.slice(0,this.i+1);this.s.push(x);if(this.s.length>100)this.s.shift();this.i=this.s.length-1},
 undo(){if(this.i>0){State.load(this.s[--this.i]);return true}},
 redo(){if(this.i<this.s.length-1){State.load(this.s[++this.i]);return true}}};
