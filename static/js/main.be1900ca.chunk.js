(this["webpackJsonprl-playground"]=this["webpackJsonprl-playground"]||[]).push([[0],{153:function(t,e,i){t.exports=i(188)},158:function(t,e,i){},159:function(t,e,i){},188:function(t,e,i){"use strict";i.r(e);var n=i(0),r=i.n(n),a=i(7),l=i.n(a),s=(i(158),i(8)),o=i(9),c=i(79),u=i(74),h=i(80),d=i(192),f=(i(159),i(12)),v=function(){function t(e,i){Object(s.a)(this,t),this.algorithm=i,this.state=void 0,this.state=e}return Object(o.a)(t,[{key:"doStep",value:function(){var t,e=this.state,i=this.algorithm.chooseAction(this.state),n=null!==(t=this.state.getNeighbor(i))&&void 0!==t?t:this.state,r=n.reward;this.state=n,this.algorithm.afterAction(e,i,r,n)}}]),t}(),m=i(78);function g(t){return new Promise((function(e){return setTimeout(e,t)}))}function y(t){var e=t.length;return t[Math.floor(Math.random()*e)]}function w(t){for(var e=[],i=0;i<t;i++)e.push(i);return e}var p=["north","east","west","south"],b=function(){function t(){Object(s.a)(this,t),this.directionValues=void 0,this.directionValues={north:0,east:0,south:0,west:0}}return Object(o.a)(t,[{key:"get",value:function(t){return this.directionValues[t]}},{key:"set",value:function(t,e){this.directionValues[t]=e}},{key:"getMaximum",value:function(){var t=this,e=Math.max.apply(Math,Object(m.a)(p.map((function(e){return t.directionValues[e]}))));return{direction:y(p.filter((function(i){return t.directionValues[i]===e}))),directionValue:e}}}]),t}(),x=function(){function t(e,i){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;Object(s.a)(this,t),this.discountFactor=e,this.learningRate=i,this.explorationFactor=n,this.iteration=0,this.reductionFactor=1}return Object(o.a)(t,[{key:"chooseGreedyAction",value:function(t){var e=new b;p.forEach((function(i){var n,r=t.getNeighbor(i);e.set(i,null!==(n=null===r||void 0===r?void 0:r.value)&&void 0!==n?n:Number.NEGATIVE_INFINITY)}));var i=e.getMaximum().direction;return t.policy=i,i}},{key:"chooseRandomAction",value:function(){return y(p)}},{key:"updateReductionFactor",value:function(){this.iteration++,this.reductionFactor*=.99999956,this.iteration%1e6===0&&console.log("reductionFactor",this.reductionFactor)}},{key:"chooseAction",value:function(t){return this.updateReductionFactor(),Math.random()<this.explorationFactor*this.reductionFactor?this.chooseRandomAction():this.chooseGreedyAction(t)}},{key:"afterAction",value:function(t,e,i,n){var r=(1-this.learningRate)*t.value+this.learningRate*(n.reward+this.discountFactor*n.value);t.value=r}},{key:"startNewEpisode",value:function(){}},{key:"endEpisode",value:function(){}}]),t}(),S=function(){function t(e,i,n,r,a,l,o,c,u){Object(s.a)(this,t),this.stateTensor=e,this._x=i,this._y=n,this._t=r,this.isValid=a,this.reward=l,this.value=o,this.q=c,this.policy=u}return Object(o.a)(t,[{key:"getNeighbor",value:function(t){var e,i=this._x,n=this._y,r=this._t;switch(t){case"north":e=[i,n-1,r+1];break;case"east":e=[1+i,n,r+1];break;case"south":e=[i,n+1,r+1];break;case"west":e=[i-1,n,r+1];break;default:throw new Error("Unknown direction: ".concat(t))}var a=e,l=Object(f.a)(a,3),s=l[0],o=l[1],c=l[2],u=this.stateTensor.get(s,o,c);return null===u?null:u.isValid?u:null}},{key:"t",get:function(){return this._t}},{key:"x",get:function(){return this._x}},{key:"y",get:function(){return this._y}}]),t}(),T=function(){function t(e,i,n,r){var a=this;Object(s.a)(this,t),this.maxX=e,this.maxY=i,this.maxTimer=n,this.state3DList=void 0,this.state3DList=new Array(e).fill(null).map((function(t,e){return new Array(i).fill(null).map((function(t,i){return new Array(n).fill(null).map((function(t,n){var l=r(e,i,n),s=l.isValid,o=l.reward,c=l.value,u=l.policy,h=l.q;return new S(a,e,i,n,null===s||void 0===s||s,null!==o&&void 0!==o?o:0,null!==c&&void 0!==c?c:0,null!==h&&void 0!==h?h:new b,null!==u&&void 0!==u?u:y(p))}))}))}))}return Object(o.a)(t,[{key:"get",value:function(t,e,i){if(0<=t&&t<this.maxX&&0<=e&&e<this.maxY){var n=(i%this.maxTimer+this.maxTimer)%this.maxTimer;return this.state3DList[t][e][n]}return null}},{key:"unsafeGet",value:function(t,e,i){var n=this.get(t,e,i);if(null===n)throw new Error("Could not return state for (x,y,t)=(".concat(t,",").concat(e,",").concat(i,")"));return n}}]),t}();var k=i(32),E=i.n(k),C=function(){function t(e,i,n,r,a,l){Object(s.a)(this,t),this.agent=e,this.stateTensor=i,this.cellSize=r,this.cellPadding=a,this.mazeCellRenderer=l,this.cellStriding=void 0,this.canvasSize=void 0,this.halfCellSize=void 0,this.ctx=null,this.doTimeTravel=!1,this.viewMode="value",this.doStartNewEpisode=!1,this.stepCounter=0,this.stepCounterDOMElem=null,this.timer=0,this.timerDOMElem=null,this.positions=void 0,this.cellStriding=r+a,this.canvasSize=n*this.cellStriding+a,this.positions=function(t,e){var i=[],n=!0,r=!1,a=void 0;try{for(var l,s=t[Symbol.iterator]();!(n=(l=s.next()).done);n=!0){var o=l.value,c=!0,u=!1,h=void 0;try{for(var d,f=e[Symbol.iterator]();!(c=(d=f.next()).done);c=!0){var v=d.value;i.push([o,v])}}catch(m){u=!0,h=m}finally{try{c||null==f.return||f.return()}finally{if(u)throw h}}}}catch(m){r=!0,a=m}finally{try{n||null==s.return||s.return()}finally{if(r)throw a}}return i}(w(n),w(n)),this.halfCellSize=r/2,this.getCellColor=this.getCellColor.bind(this),this.getTriangleVisibility=this.getTriangleVisibility.bind(this),this.draw=this.draw.bind(this)}return Object(o.a)(t,[{key:"setup",value:function(){this.stepCounterDOMElem=document.getElementById("stepCounter"),this.timerDOMElem=document.getElementById("timer");var t=document.getElementById("canvas");t.width=this.canvasSize,t.height=this.canvasSize,this.ctx=t.getContext("2d")}},{key:"getCellColor",value:function(t){return this.mazeCellRenderer.getColor(this.viewMode,t)}},{key:"getTriangleColor",value:function(t,e){return this.mazeCellRenderer.getTriangleColor(this.viewMode,t,e)}},{key:"getTriangleVisibility",value:function(t){return this.mazeCellRenderer.showTriangles(this.viewMode,t)}},{key:"draw",value:function(){if(null===this.ctx)throw new Error("canvas 2d context is null! Is setup called before draw?");this.timer=this.agent.state.t;var t=!0,e=!1,i=void 0;try{for(var n,r=this.positions[Symbol.iterator]();!(t=(n=r.next()).done);t=!0){var a=n.value,l=Object(f.a)(a,2),s=l[0],o=l[1],c=this.stateTensor.unsafeGet(s,o,this.timer);if(this.ctx.resetTransform(),this.ctx.translate(this.cellStriding*s+this.cellPadding,this.cellStriding*o+this.cellPadding),this.getTriangleVisibility(c)){var u=!0,h=!1,d=void 0;try{for(var v,m=p[Symbol.iterator]();!(u=(v=m.next()).done);u=!0){var g=v.value;switch(this.ctx.fillStyle=this.getTriangleColor(g,c),this.ctx.beginPath(),this.ctx.moveTo(this.halfCellSize,this.halfCellSize),g){case"north":this.ctx.lineTo(0,0),this.ctx.lineTo(this.cellSize,0);break;case"east":this.ctx.lineTo(this.cellSize,0),this.ctx.lineTo(this.cellSize,this.cellSize);break;case"south":this.ctx.lineTo(this.cellSize,this.cellSize),this.ctx.lineTo(0,this.cellSize);break;case"west":this.ctx.lineTo(0,this.cellSize),this.ctx.lineTo(0,0)}this.ctx.closePath(),this.ctx.fill()}}catch(y){h=!0,d=y}finally{try{u||null==m.return||m.return()}finally{if(h)throw d}}}else this.ctx.fillStyle=this.getCellColor(c),this.ctx.fillRect(0,0,this.cellSize,this.cellSize)}}catch(y){e=!0,i=y}finally{try{t||null==r.return||r.return()}finally{if(e)throw i}}this.ctx.resetTransform(),this.ctx.translate(this.cellPadding+this.agent.state.x*this.cellStriding+this.cellSize/2,this.cellPadding+this.agent.state.y*this.cellStriding+this.cellSize/2),this.ctx.fillStyle="green",this.ctx.beginPath(),this.ctx.arc(0,0,this.cellSize/2.2,0,2*Math.PI),this.ctx.fill(),window.requestAnimationFrame(this.draw)}},{key:"update",value:function(){if(this.stepCounter++,this.doStartNewEpisode&&(this.doStartNewEpisode=!1),this.doTimeTravel){this.doTimeTravel=!1;for(var t=0;t<1e6;t++)this.stepCounter++,this.agent.doStep()}this.agent.doStep()}},{key:"updateHTML",value:function(){if(null===this.stepCounterDOMElem)throw new Error("stepCounter DOM Element is null! Is setup called before draw?");if(null===this.timerDOMElem)throw new Error("timer DOM Element is null! Is setup called before draw?");this.stepCounterDOMElem.innerHTML=this.stepCounter.toString(),this.timerDOMElem.innerHTML=this.timer.toString()}},{key:"start",value:function(){return E.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:this.setup(),window.requestAnimationFrame(this.draw);case 2:return this.update(),this.updateHTML(),t.next=7,E.a.awrap(g(40));case 7:t.next=2;break;case 9:case"end":return t.stop()}}),null,this)}}]),t}(),O=i(17),M=function(){function t(e){Object(s.a)(this,t),this.stateTensor=e,this.linScale=O.b(O.a).domain([0,1]),this.powerScale=function(t){return O.b(O.a).domain([0,1])(Math.pow(t,.1))}}return Object(o.a)(t,[{key:"getColor",value:function(t,e){if(!e.isValid)return"#444";switch(t){case"reward":return this.powerScale(e.reward);case"value":return this.powerScale(e.value);case"simple":case"policy":case"q-function":return"darkgray"}}},{key:"getTriangleColor",value:function(t,e,i){if(!i.isValid)return"#444";switch(t){case"policy":for(var n=Math.floor(10),r=0,a=i.x,l=i.y,s=i.t,o=0;o<20;o++)r+=this.stateTensor.unsafeGet(a,l,s+o-n).policy===e?1:0;return this.linScale(r/20);case"q-function":return this.linScale(i.q.get(e));case"reward":case"simple":case"value":return"red"}}},{key:"showTriangles",value:function(t,e){if(!e.isValid)return!1;switch(t){case"policy":case"q-function":return!0;case"reward":case"simple":case"value":return!1}}}]),t}(),z=function(t){function e(t){var i;Object(s.a)(this,e),(i=Object(c.a)(this,Object(u.a)(e).call(this,t))).renderHandler=void 0;var n=function(t){for(var e=[0,0],i=[],n=new Array(16).fill(null).map((function(t){return new Array(16).fill(null)})),r=0;r<16;r++)for(var a=0;a<16;a++){var l=t[a].charAt(r);n[r][a]=l,"\u20ac"===l&&i.push([r,a]),"$"===l&&(e=[r,a])}var s=i.length,o=new T(16,16,179,(function(t,e,r){var a=n[t][e],l=Object(f.a)(i[Math.floor(r*s/179)],2),o=l[0],c=l[1];return{isValid:"#"!==a,reward:t===o&&e===c?1:0,value:5}})),c=e,u=Object(f.a)(c,2),h=u[0],d=u[1],m=o.unsafeGet(h,d,0);return{stateTensor:o,agent:new v(m,new x(.3,.5))}}([".........#......",".........#......",".........#.\u20ac....","...#####.####...","...#........#...","...#........#...","...#..##....#...","...#.########...","...#..##....#...","...#..$.....#...","...#......\u20ac.#...","...#........#...","...##########...","................","................","................"]),r=n.stateTensor,a=n.agent;return i.renderHandler=new C(a,r,16,30,2,new M(r)),console.log(r),console.log(a),i}return Object(h.a)(e,t),Object(o.a)(e,[{key:"render",value:function(){var t=this;return r.a.createElement("div",{className:"App"},r.a.createElement("h1",null,"RL Playground"),r.a.createElement("div",{style:{display:"flex",justifyContent:"center",width:"100%"}},r.a.createElement(d.b,{fill:!1,vertical:!1},r.a.createElement("div",{className:"bp3-select .modifier"},r.a.createElement("select",{onChange:function(e){t.renderHandler.viewMode=e.target.options[e.target.selectedIndex].text}},r.a.createElement("option",null,"value"),r.a.createElement("option",null,"reward"),r.a.createElement("option",null,"simple"),r.a.createElement("option",null,"policy"),r.a.createElement("option",null,"q-function"))),r.a.createElement(d.a,{text:"time travel",onClick:function(){return t.renderHandler.doTimeTravel=!0}}))),r.a.createElement("p",null,r.a.createElement("br",null),"iteration: ",r.a.createElement("i",{id:"stepCounter"}),r.a.createElement("br",null),"timer: ",r.a.createElement("i",{id:"timer"},"55")),r.a.createElement("canvas",{id:"canvas",style:{backgroundColor:"gray"}}))}},{key:"componentDidMount",value:function(){this.renderHandler.start().then()}}]),e}(r.a.PureComponent);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(z,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()}))}},[[153,1,2]]]);
//# sourceMappingURL=main.be1900ca.chunk.js.map