(this["webpackJsonprl-playground"]=this["webpackJsonprl-playground"]||[]).push([[0],{71:function(t,e,i){t.exports=i(79)},76:function(t,e,i){},77:function(t,e,i){},79:function(t,e,i){"use strict";i.r(e);var n=i(0),r=i.n(n),a=i(48),l=i.n(a),o=(i(76),i(2)),s=i(3),c=i(51),u=i(49),h=i(52),d=(i(77),i(5)),f=function(){function t(e,i){Object(o.a)(this,t),this.algorithm=i,this.state=void 0,this.state=e}return Object(s.a)(t,[{key:"doStep",value:function(){var t,e=this.state,i=this.algorithm.chooseAction(this.state),n=null!==(t=this.state.getNeighbor(i))&&void 0!==t?t:this.state,r=n.reward;this.state=n,this.algorithm.afterAction(e,i,r,n)}}]),t}(),v=i(50);function m(t){return new Promise((function(e){return setTimeout(e,t)}))}function g(t){var e=t.length;return t[Math.floor(Math.random()*e)]}function y(t){for(var e=[],i=0;i<t;i++)e.push(i);return e}var w=["north","east","west","south"],p=function(){function t(){Object(o.a)(this,t),this.directionValues=void 0,this.directionValues={north:0,east:0,south:0,west:0}}return Object(s.a)(t,[{key:"get",value:function(t){return this.directionValues[t]}},{key:"set",value:function(t,e){this.directionValues[t]=e}},{key:"getMaximum",value:function(){var t=this,e=Math.max.apply(Math,Object(v.a)(w.map((function(e){return t.directionValues[e]}))));return{direction:g(w.filter((function(i){return t.directionValues[i]===e}))),directionValue:e}}}]),t}(),b=function(){function t(e,i){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;Object(o.a)(this,t),this.discountFactor=e,this.learningRate=i,this.explorationFactor=n,this.iteration=0,this.reductionFactor=1}return Object(s.a)(t,[{key:"chooseGreedyAction",value:function(t){var e=new p;w.forEach((function(i){var n,r=t.getNeighbor(i);e.set(i,null!==(n=null===r||void 0===r?void 0:r.value)&&void 0!==n?n:Number.NEGATIVE_INFINITY)}));var i=e.getMaximum().direction;return t.policy=i,i}},{key:"chooseRandomAction",value:function(){return g(w)}},{key:"updateReductionFactor",value:function(){this.iteration++,this.reductionFactor*=.99999956,this.iteration%1e6===0&&console.log("reductionFactor",this.reductionFactor)}},{key:"chooseAction",value:function(t){return this.updateReductionFactor(),Math.random()<this.explorationFactor*this.reductionFactor?this.chooseRandomAction():this.chooseGreedyAction(t)}},{key:"afterAction",value:function(t,e,i,n){var r=(1-this.learningRate)*t.value+this.learningRate*(n.reward+this.discountFactor*n.value);t.value=r}},{key:"startNewEpisode",value:function(){}},{key:"endEpisode",value:function(){}}]),t}(),x=function(){function t(e,i,n,r,a,l,s,c,u){Object(o.a)(this,t),this.stateTensor=e,this._x=i,this._y=n,this._t=r,this.isValid=a,this.reward=l,this.value=s,this.q=c,this.policy=u}return Object(s.a)(t,[{key:"getNeighbor",value:function(t){var e,i=this._x,n=this._y,r=this._t;switch(t){case"north":e=[i,n-1,r+1];break;case"east":e=[1+i,n,r+1];break;case"south":e=[i,n+1,r+1];break;case"west":e=[i-1,n,r+1];break;default:throw new Error("Unknown direction: ".concat(t))}var a=e,l=Object(d.a)(a,3),o=l[0],s=l[1],c=l[2],u=this.stateTensor.get(o,s,c);return null===u?null:u.isValid?u:null}},{key:"t",get:function(){return this._t}},{key:"x",get:function(){return this._x}},{key:"y",get:function(){return this._y}}]),t}(),S=function(){function t(e,i,n,r){var a=this;Object(o.a)(this,t),this.maxX=e,this.maxY=i,this.maxTimer=n,this.state3DList=void 0,this.state3DList=new Array(e).fill(null).map((function(t,e){return new Array(i).fill(null).map((function(t,i){return new Array(n).fill(null).map((function(t,n){var l=r(e,i,n),o=l.isValid,s=l.reward,c=l.value,u=l.policy,h=l.q;return new x(a,e,i,n,null===o||void 0===o||o,null!==s&&void 0!==s?s:0,null!==c&&void 0!==c?c:0,null!==h&&void 0!==h?h:new p,null!==u&&void 0!==u?u:g(w))}))}))}))}return Object(s.a)(t,[{key:"get",value:function(t,e,i){if(0<=t&&t<this.maxX&&0<=e&&e<this.maxY){var n=i%this.maxTimer;return this.state3DList[t][e][n]}return null}},{key:"unsafeGet",value:function(t,e,i){var n=this.get(t,e,i);if(null===n)throw new Error("Could not return state for (x,y,t)=(".concat(t,",").concat(e,",").concat(i,")"));return n}}]),t}();var k=i(16),T=i.n(k),E=function(){function t(e,i,n,r,a,l){Object(o.a)(this,t),this.agent=e,this.stateTensor=i,this.cellSize=r,this.cellPadding=a,this.mazeCellRenderer=l,this.cellStriding=void 0,this.canvasSize=void 0,this.halfCellSize=void 0,this.ctx=null,this.doTimeTravel=!1,this.viewMode="value",this.doStartNewEpisode=!1,this.stepCounter=0,this.stepCounterDOMElem=null,this.timer=0,this.timerDOMElem=null,this.positions=void 0,this.cellStriding=r+a,this.canvasSize=n*this.cellStriding+a,this.positions=function(t,e){var i=[],n=!0,r=!1,a=void 0;try{for(var l,o=t[Symbol.iterator]();!(n=(l=o.next()).done);n=!0){var s=l.value,c=!0,u=!1,h=void 0;try{for(var d,f=e[Symbol.iterator]();!(c=(d=f.next()).done);c=!0){var v=d.value;i.push([s,v])}}catch(m){u=!0,h=m}finally{try{c||null==f.return||f.return()}finally{if(u)throw h}}}}catch(m){r=!0,a=m}finally{try{n||null==o.return||o.return()}finally{if(r)throw a}}return i}(y(n),y(n)),this.halfCellSize=r/2,this.getCellColor=this.getCellColor.bind(this),this.getTriangleVisibility=this.getTriangleVisibility.bind(this),this.draw=this.draw.bind(this)}return Object(s.a)(t,[{key:"setup",value:function(){this.stepCounterDOMElem=document.getElementById("stepCounter"),this.timerDOMElem=document.getElementById("timer");var t=document.getElementById("canvas");t.width=this.canvasSize,t.height=this.canvasSize,this.ctx=t.getContext("2d")}},{key:"getCellColor",value:function(t){return this.mazeCellRenderer.getColor(this.viewMode,t)}},{key:"getTriangleColor",value:function(t,e){return this.mazeCellRenderer.getTriangleColor(this.viewMode,t,e)}},{key:"getTriangleVisibility",value:function(t){return this.mazeCellRenderer.showTriangles(this.viewMode,t)}},{key:"draw",value:function(){if(null===this.ctx)throw new Error("canvas 2d context is null! Is setup called before draw?");this.timer=this.agent.state.t;var t=!0,e=!1,i=void 0;try{for(var n,r=this.positions[Symbol.iterator]();!(t=(n=r.next()).done);t=!0){var a=n.value,l=Object(d.a)(a,2),o=l[0],s=l[1],c=this.stateTensor.unsafeGet(o,s,this.timer);if(this.ctx.resetTransform(),this.ctx.translate(this.cellStriding*o+this.cellPadding,this.cellStriding*s+this.cellPadding),this.getTriangleVisibility(c)){var u=!0,h=!1,f=void 0;try{for(var v,m=w[Symbol.iterator]();!(u=(v=m.next()).done);u=!0){var g=v.value;switch(this.ctx.fillStyle=this.getTriangleColor(g,c),this.ctx.beginPath(),this.ctx.moveTo(this.halfCellSize,this.halfCellSize),g){case"north":this.ctx.lineTo(0,0),this.ctx.lineTo(this.cellSize,0);break;case"east":this.ctx.lineTo(this.cellSize,0),this.ctx.lineTo(this.cellSize,this.cellSize);break;case"south":this.ctx.lineTo(this.cellSize,this.cellSize),this.ctx.lineTo(0,this.cellSize);break;case"west":this.ctx.lineTo(0,this.cellSize),this.ctx.lineTo(0,0)}this.ctx.closePath(),this.ctx.fill()}}catch(y){h=!0,f=y}finally{try{u||null==m.return||m.return()}finally{if(h)throw f}}}else this.ctx.fillStyle=this.getCellColor(c),this.ctx.fillRect(0,0,this.cellSize,this.cellSize)}}catch(y){e=!0,i=y}finally{try{t||null==r.return||r.return()}finally{if(e)throw i}}this.ctx.resetTransform(),this.ctx.translate(this.cellPadding+this.agent.state.x*this.cellStriding+this.cellSize/2,this.cellPadding+this.agent.state.y*this.cellStriding+this.cellSize/2),this.ctx.fillStyle="green",this.ctx.beginPath(),this.ctx.arc(0,0,this.cellSize/2.2,0,2*Math.PI),this.ctx.fill(),window.requestAnimationFrame(this.draw)}},{key:"update",value:function(){if(this.stepCounter++,this.doStartNewEpisode&&(this.doStartNewEpisode=!1),this.doTimeTravel){this.doTimeTravel=!1;for(var t=0;t<5e6;t++)this.stepCounter++,this.agent.doStep()}this.agent.doStep()}},{key:"updateHTML",value:function(){if(null===this.stepCounterDOMElem)throw new Error("stepCounter DOM Element is null! Is setup called before draw?");if(null===this.timerDOMElem)throw new Error("timer DOM Element is null! Is setup called before draw?");this.stepCounterDOMElem.innerHTML=this.stepCounter.toString(),this.timerDOMElem.innerHTML=this.timer.toString()}},{key:"start",value:function(){return T.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:this.setup(),window.requestAnimationFrame(this.draw);case 2:return this.update(),this.updateHTML(),t.next=7,T.a.awrap(m(40));case 7:t.next=2;break;case 9:case"end":return t.stop()}}),null,this)}}]),t}(),C=i(17),O=function(){function t(e){Object(o.a)(this,t),this.stateTensor=e,this.colorScale=C.b(C.a).domain([0,1])}return Object(s.a)(t,[{key:"getColor",value:function(t,e){if(!e.isValid)return"#444";switch(t){case"reward":return this.colorScale(e.reward);case"value":return this.colorScale(e.value);case"simple":case"policy":case"q-function":return"darkgray"}}},{key:"getTriangleColor",value:function(t,e,i){if(!i.isValid)return"#444";switch(t){case"policy":for(var n=0,r=i.x,a=i.y,l=i.t,o=0;o<15;o++)n+=this.stateTensor.unsafeGet(r,a,l+o).policy===e?1:0;return this.colorScale(n/15);case"q-function":return this.colorScale(i.q.get(e));case"reward":case"simple":case"value":return"red"}}},{key:"showTriangles",value:function(t,e){if(!e.isValid)return!1;switch(t){case"policy":case"q-function":return!0;case"reward":case"simple":case"value":return!1}}}]),t}(),M=function(t){function e(t){var i;Object(o.a)(this,e),(i=Object(c.a)(this,Object(u.a)(e).call(this,t))).renderHandler=void 0;var n=function(t){for(var e=[0,0],i=[],n=new Array(16).fill(null).map((function(t){return new Array(16).fill(null)})),r=0;r<16;r++)for(var a=0;a<16;a++){var l=t[a].charAt(r);n[r][a]=l,"\u20ac"===l&&i.push([r,a]),"$"===l&&(e=[r,a])}var o=i.length,s=new S(16,16,179,(function(t,e,r){var a=n[t][e],l=Object(d.a)(i[Math.floor(r*o/179)],2),s=l[0],c=l[1];return{isValid:"#"!==a,reward:t===s&&e===c?1:0,value:5}})),c=e,u=Object(d.a)(c,2),h=u[0],v=u[1],m=s.unsafeGet(h,v,0);return{stateTensor:s,agent:new f(m,new b(.3,.5))}}([".........#......",".........#......",".........#.\u20ac....","...#####.####...","...#........#...","...#........#...","...#..##....#...","...#.########...","...#..##....#...","...#..$.....#...","...#......\u20ac.#...","...#........#...","...##########...","................","................","................"]),r=n.stateTensor,a=n.agent;return i.renderHandler=new E(a,r,16,30,2,new O(r)),console.log(r),console.log(a),i}return Object(h.a)(e,t),Object(s.a)(e,[{key:"render",value:function(){var t=this;return r.a.createElement("div",{className:"App"},r.a.createElement("h1",null,"RL Playground"),r.a.createElement("select",{onChange:function(e){t.renderHandler.viewMode=e.target.options[e.target.selectedIndex].text}},r.a.createElement("option",null,"value"),r.a.createElement("option",null,"reward"),r.a.createElement("option",null,"simple"),r.a.createElement("option",null,"policy"),r.a.createElement("option",null,"q-function")),r.a.createElement("button",{type:"button",onClick:function(){return t.renderHandler.doTimeTravel=!0}},"time travel"),r.a.createElement("button",{type:"button",onClick:function(){return t.renderHandler.doStartNewEpisode=!0}},"reset"),r.a.createElement("p",null,"iteration: ",r.a.createElement("i",{id:"stepCounter"}),r.a.createElement("br",null),"timer: ",r.a.createElement("i",{id:"timer"},"55")),r.a.createElement("canvas",{id:"canvas",style:{backgroundColor:"gray"}}))}},{key:"componentDidMount",value:function(){this.renderHandler.start().then()}}]),e}(r.a.PureComponent);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(M,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()}))}},[[71,1,2]]]);
//# sourceMappingURL=main.2fef620f.chunk.js.map