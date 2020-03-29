(this["webpackJsonprl-playground"]=this["webpackJsonprl-playground"]||[]).push([[0],{152:function(t,e,i){t.exports=i(187)},157:function(t,e,i){},158:function(t,e,i){},187:function(t,e,i){"use strict";i.r(e);var n=i(0),a=i.n(n),r=i(9),s=i.n(r),l=(i(157),i(3)),o=i(6),c=i(14),h=i(11),u=i(15),f=i(191),d=(i(158),i(27)),v=new Array(9).fill(null).map((function(t,e){return e}));function m(t){return new Promise((function(e){return setTimeout(e,t)}))}function g(t){for(var e=[],i=0;i<t;i++)e.push(i);return e}var y,S=["reward","value","q-function","policy","policy_aie"];!function(t){t[t.NORTH=0]="NORTH",t[t.EAST=1]="EAST",t[t.SOUTH=2]="SOUTH",t[t.WEST=3]="WEST",t[t.NORTH_EAST=4]="NORTH_EAST",t[t.SOUTH_EAST=5]="SOUTH_EAST",t[t.SOUTH_WEST=6]="SOUTH_WEST",t[t.NORTH_WEST=7]="NORTH_WEST",t[t.STALL=8]="STALL"}(y||(y={}));var p=9,T=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){return 0};Object(l.a)(this,t),this.directionValues=void 0,this.directionValues=v.map(e)}return Object(o.a)(t,[{key:"get",value:function(t){return this.directionValues[t]}},{key:"set",value:function(t,e){this.directionValues[t]=e}},{key:"getMaximum",value:function(){for(var t=0,e=0,i=0;i<p;i++)this.directionValues[i]>e&&(e=this.directionValues[i],t=i);return{direction:t,directionValue:e}}},{key:"add",value:function(t){for(var e=0;e<p;e++)this.directionValues[e]+=t.directionValues[e]}},{key:"sub",value:function(t){for(var e=0;e<p;e++)this.directionValues[e]-=t.directionValues[e]}},{key:"scale",value:function(t){for(var e=0;e<p;e++)this.directionValues[e]*=t}}]),t}(),w=function(t){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){return 1/p};return Object(l.a)(this,e),Object(c.a)(this,Object(h.a)(e).call(this,t))}return Object(u.a)(e,t),Object(o.a)(e,[{key:"normalize",value:function(){var t=this.directionValues.reduce((function(t,e){return e+t}),0);if(0===t)throw new Error("Sum of all elements in StochasticDirectional is Zero, so normalization has failed!");for(var e=0;e<p;e++)this.directionValues[e]/=t}},{key:"check",value:function(){if(0===this.directionValues.reduce((function(t,e){return e+t}),0))throw new Error("Sum of all elements in StochasticDirectional is Zero, so normalization has failed!");var t=!0,e=!1,i=void 0;try{for(var n,a=this.directionValues[Symbol.iterator]();!(t=(n=a.next()).done);t=!0){if(n.value<-1e-5)throw new Error("Elements in StochasticDirectional should not be negative!")}}catch(r){e=!0,i=r}finally{try{t||null==a.return||a.return()}finally{if(e)throw i}}}},{key:"set",value:function(t,i){Object(d.a)(Object(h.a)(e.prototype),"set",this).call(this,t,i)}},{key:"getDirectionByDistribution",value:function(){for(var t=Math.random(),e=0;e<p;e++){var i=this.directionValues[e];if(t<i)return e;t-=i}return console.warn("Encountered non normalized distribution. This could caused by rounding errors!"),p-1}},{key:"getEntropy",value:function(){for(var t=0,e=0;e<p;e++)t-=this.directionValues[e]*Math.log(this.directionValues[e]);return t}}]),e}(T),b=i(13),x=function(){function t(e,i,n){Object(l.a)(this,t),this.stateTensor=i,this.algorithm=n,this.state=void 0,this.state=e}return Object(o.a)(t,[{key:"doStep",value:function(){var t=this.state,e=this.algorithm.chooseAction(this.state),i=this.state.getNeighbor(e),n=i.reward;this.state=i,this.algorithm.afterAction(this.stateTensor,t,e,n,i)}}]),t}(),E=function(){function t(e,i){Object(l.a)(this,t),this.parameterUpdator=e,this.policyUpdator=i}return Object(o.a)(t,[{key:"afterAction",value:function(t,e,i,n,a){this.parameterUpdator.updateParameters(t,e,i,n,a),this.policyUpdator.updatePolicy(t,a)}},{key:"chooseAction",value:function(t){return t.policy.getDirectionByDistribution()}},{key:"startNewEpisode",value:function(){throw Error("Method has to be implemented!")}},{key:"endEpisode",value:function(){throw Error("Method has to be implemented!")}}]),t}(),O=function(){function t(e,i,n,a,r,s,o,c,h){Object(l.a)(this,t),this.stateTensor=e,this._x=i,this._y=n,this._t=a,this.isValid=r,this.reward=s,this.value=o,this.q=c,this.policy=h}return Object(o.a)(t,[{key:"getNeighbor",value:function(t){var e,i=this._x,n=this._y,a=this._t;switch(t){case y.NORTH:e=[i,n-1,a+1];break;case y.EAST:e=[1+i,n,a+1];break;case y.SOUTH:e=[i,n+1,a+1];break;case y.WEST:e=[i-1,n,a+1];break;case y.NORTH_EAST:e=[i+1,n-1,a+1];break;case y.SOUTH_EAST:e=[1+i,n+1,a+1];break;case y.SOUTH_WEST:e=[i-1,n+1,a+1];break;case y.NORTH_WEST:e=[i-1,n-1,a+1];break;case y.STALL:e=[i,n,a+1];break;default:throw new Error("Unknown direction: ".concat(t))}var r=e,s=Object(b.a)(r,3),l=s[0],o=s[1],c=s[2],h=this.stateTensor.get(l,o,c);return null!==h&&h.isValid?h:this.getFutureState()}},{key:"getFutureState",value:function(){var t=this.x,e=this.y,i=this.t;return this.stateTensor.unsafeGet(t,e,i+1)}},{key:"t",get:function(){return this._t}},{key:"x",get:function(){return this._x}},{key:"y",get:function(){return this._y}}]),t}(),k=function(){function t(e,i,n,a){var r=this;Object(l.a)(this,t),this.maxX=e,this.maxY=i,this.maxTimer=n,this.state3DList=void 0,this.state3DList=new Array(e).fill(null).map((function(t,e){return new Array(i).fill(null).map((function(t,i){return new Array(n).fill(null).map((function(t,n){var s=a(e,i,n),l=s.isValid,o=s.reward,c=s.value,h=s.policy,u=s.q;return new O(r,e,i,n,null===l||void 0===l||l,null!==o&&void 0!==o?o:0,null!==c&&void 0!==c?c:0,null!==u&&void 0!==u?u:new T,null!==h&&void 0!==h?h:new w)}))}))}))}return Object(o.a)(t,[{key:"get",value:function(t,e,i){if(0<=t&&t<this.maxX&&0<=e&&e<this.maxY){var n=(i%this.maxTimer+this.maxTimer)%this.maxTimer;return this.state3DList[t][e][n]}return null}},{key:"unsafeGet",value:function(t,e,i){var n=this.get(t,e,i);if(null===n)throw new Error("Could not return state for (x,y,t)=(".concat(t,",").concat(e,",").concat(i,")"));return n}},{key:"sizeX",get:function(){return this.maxX}},{key:"sizeY",get:function(){return this.maxY}},{key:"sizeT",get:function(){return this.maxTimer}}]),t}(),z=function(){function t(e){Object(l.a)(this,t),this.\u0190=e}return Object(o.a)(t,[{key:"updatePolicy",value:function(t,e){var i=this,n=new T((function(t){return e.getNeighbor(t).value})).getMaximum().direction,a=new w((function(t){return t===n?i.\u0190/p+1-i.\u0190:i.\u0190/p}));e.policy=a}}]),t}(),C=function(t){function e(t){var i,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return Object(l.a)(this,e),(i=Object(c.a)(this,Object(h.a)(e).call(this,n))).updateEpsilon=t,i.init=n,i.iteration=0,i.\u0190=n,i}return Object(u.a)(e,t),Object(o.a)(e,[{key:"updatePolicy",value:function(t,i){this.iteration++,this.\u0190=this.updateEpsilon(this.\u0190,this.iteration),Object(d.a)(Object(h.a)(e.prototype),"updatePolicy",this).call(this,t,i)}}]),e}(z),j=function(){function t(e,i){Object(l.a)(this,t),this.learningRate=e,this.discountFactor=i}return Object(o.a)(t,[{key:"updateParameters",value:function(t,e,i,n,a){var r=(1-this.learningRate)*e.value+this.learningRate*(a.reward+this.discountFactor*a.value);e.value=r}}]),t}();var D=i(19),M=i.n(D),P=function(){function t(e,i,n,a,r,s,o){Object(l.a)(this,t),this.agent=e,this.stateTensor=i,this.cellSize=a,this.cellPadding=r,this.mazeCellRenderer=s,this.onTimeTravelProgressChange=o,this.cellStriding=void 0,this.canvasSize=void 0,this.halfCellSize=void 0,this.halfDiagonalSectionSize=void 0,this.ctx=null,this.travelTime=5e6,this.doTimeTravel=!1,this.viewMode=S[0],this.doStartNewEpisode=!1,this.stepCounter=0,this.stepCounterDOMElem=null,this.timer=0,this.timerDOMElem=null,this.positions=void 0,this.cellStriding=a+r,this.canvasSize=n*this.cellStriding+r,this.positions=function(t,e){var i=[],n=!0,a=!1,r=void 0;try{for(var s,l=t[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var o=s.value,c=!0,h=!1,u=void 0;try{for(var f,d=e[Symbol.iterator]();!(c=(f=d.next()).done);c=!0){var v=f.value;i.push([o,v])}}catch(m){h=!0,u=m}finally{try{c||null==d.return||d.return()}finally{if(h)throw u}}}}catch(m){a=!0,r=m}finally{try{n||null==l.return||l.return()}finally{if(a)throw r}}return i}(g(n),g(n)),this.halfCellSize=a/2,this.halfDiagonalSectionSize=a/6,this.getCellColor=this.getCellColor.bind(this),this.getTriangleVisibility=this.getTriangleVisibility.bind(this),this.draw=this.draw.bind(this)}return Object(o.a)(t,[{key:"setup",value:function(){this.stepCounterDOMElem=document.getElementById("stepCounter"),this.timerDOMElem=document.getElementById("timer");var t=document.getElementById("canvas");t.width=this.canvasSize,t.height=this.canvasSize,this.ctx=t.getContext("2d")}},{key:"getCellColor",value:function(t){return this.mazeCellRenderer.getColor(this.viewMode,t)}},{key:"getTriangleColor",value:function(t,e){return this.mazeCellRenderer.getTriangleColor(this.viewMode,t,e)}},{key:"getTriangleVisibility",value:function(t){return this.mazeCellRenderer.showTriangles(this.viewMode,t)}},{key:"draw",value:function(){if(null===this.ctx)throw new Error("canvas 2d context is null! Is setup called before draw?");this.timer=this.agent.state.t;var t=!0,e=!1,i=void 0;try{for(var n,a=this.positions[Symbol.iterator]();!(t=(n=a.next()).done);t=!0){var r=n.value,s=Object(b.a)(r,2),l=s[0],o=s[1],c=this.stateTensor.unsafeGet(l,o,this.timer);if(this.ctx.resetTransform(),this.ctx.translate(this.cellStriding*l+this.cellPadding,this.cellStriding*o+this.cellPadding),this.getTriangleVisibility(c)){this.ctx.translate(this.halfCellSize,this.halfCellSize);for(var h=0;h<4;h++)this.ctx.fillStyle=this.getTriangleColor(h,c),this.ctx.beginPath(),this.ctx.lineTo(-this.halfDiagonalSectionSize,-this.halfDiagonalSectionSize),this.ctx.lineTo(-this.halfDiagonalSectionSize,-this.halfCellSize),this.ctx.lineTo(this.halfDiagonalSectionSize,-this.halfCellSize),this.ctx.lineTo(this.halfDiagonalSectionSize,-this.halfDiagonalSectionSize),this.ctx.closePath(),this.ctx.fill(),this.ctx.rotate(Math.PI/2);for(var u=4;u<8;u++)this.ctx.fillStyle=this.getTriangleColor(u,c),this.ctx.rotate(Math.PI/2),this.ctx.beginPath(),this.ctx.moveTo(this.halfDiagonalSectionSize,-this.halfDiagonalSectionSize),this.ctx.lineTo(this.halfDiagonalSectionSize,-this.halfCellSize),this.ctx.lineTo(this.halfCellSize,-this.halfCellSize),this.ctx.lineTo(this.halfCellSize,-this.halfDiagonalSectionSize),this.ctx.closePath(),this.ctx.fill();this.ctx.fillStyle=this.getTriangleColor(9,c),this.ctx.beginPath(),this.ctx.moveTo(this.halfDiagonalSectionSize,-this.halfDiagonalSectionSize),this.ctx.lineTo(this.halfDiagonalSectionSize,this.halfDiagonalSectionSize),this.ctx.lineTo(-this.halfDiagonalSectionSize,this.halfDiagonalSectionSize),this.ctx.lineTo(-this.halfDiagonalSectionSize,-this.halfDiagonalSectionSize),this.ctx.closePath(),this.ctx.fill()}else this.ctx.fillStyle=this.getCellColor(c),this.ctx.fillRect(0,0,this.cellSize,this.cellSize)}}catch(f){e=!0,i=f}finally{try{t||null==a.return||a.return()}finally{if(e)throw i}}this.ctx.resetTransform(),this.ctx.translate(this.cellPadding+this.agent.state.x*this.cellStriding+this.cellSize/2,this.cellPadding+this.agent.state.y*this.cellStriding+this.cellSize/2),this.ctx.fillStyle="green",this.ctx.beginPath(),this.ctx.arc(0,0,this.cellSize/2.2,0,2*Math.PI),this.ctx.fill(),window.requestAnimationFrame(this.draw)}},{key:"update",value:function(){var t,e,i,n;return M.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:if(this.stepCounter++,this.doStartNewEpisode&&(this.doStartNewEpisode=!1),!this.doTimeTravel){a.next=18;break}this.doTimeTravel=!1,e=0;case 5:if(!(e<this.travelTime)){a.next=17;break}if(this.stepCounter++,this.agent.doStep(),!((i=e/this.travelTime)%.01<1e-7)){a.next=14;break}return null===(n=this.onTimeTravelProgressChange)||void 0===n||n.call(this,i),this.updateHTML(),a.next=14,M.a.awrap(m(1));case 14:e++,a.next=5;break;case 17:null===(t=this.onTimeTravelProgressChange)||void 0===t||t.call(this,0);case 18:this.agent.doStep();case 19:case"end":return a.stop()}}),null,this)}},{key:"updateHTML",value:function(){if(null===this.stepCounterDOMElem)throw new Error("stepCounter DOM Element is null! Is setup called before draw?");if(null===this.timerDOMElem)throw new Error("timer DOM Element is null! Is setup called before draw?");this.stepCounterDOMElem.innerHTML=this.stepCounter.toString(),this.timerDOMElem.innerHTML=this.timer.toString()}},{key:"start",value:function(){return M.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:this.setup(),window.requestAnimationFrame(this.draw);case 2:return t.next=5,M.a.awrap(this.update());case 5:return this.updateHTML(),t.next=8,M.a.awrap(m(40));case 8:t.next=2;break;case 10:case"end":return t.stop()}}),null,this)}}]),t}(),H=i(21),V=function(){function t(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"Accumulated";Object(l.a)(this,t),this.stateTensor=e,this.policyMode=i,this.linScale=H.b(H.a).domain([0,1]),this.powerScale=function(t){return H.b(H.a).domain([0,1])(Math.pow(t,.1))},this.currentTime=0,this.policyBuffer=void 0,this.itNum=10,this.itNumHalf=Math.floor(this.itNum/2),this.maxEntropy=Math.log(p),this.policyBuffer=new k(e.sizeX,e.sizeY,1,(function(){return{policy:new w((function(){return 0}))}})),console.log(this.maxEntropy)}return Object(o.a)(t,[{key:"getColor",value:function(t,e){if(!e.isValid)return"#777";switch(t){case"reward":return this.powerScale(e.reward);case"value":return this.powerScale(e.value);case"policy":case"policy_aie":case"q-function":return"red"}}},{key:"getTriangleColor",value:function(t,e,i){if(!i.isValid)return"#777";switch(t){case"policy_aie":this.currentTime!==i.t&&this.updatePolicyBuffer(i.t);var n=i.x,a=i.y,r=this.policyBuffer.unsafeGet(n,a,0).policy.get(e);return this.linScale(r);case"policy":return this.linScale(i.policy.get(e));case"q-function":return this.linScale(i.q.get(e));case"reward":case"value":return"red"}}},{key:"updatePolicyBuffer",value:function(t){this.currentTime=t;for(var e=0;e<this.policyBuffer.sizeX;e++)for(var i=0;i<this.policyBuffer.sizeY;i++){var n=this.policyBuffer.unsafeGet(e,i,0).policy;n.sub(n);for(var a=0;a<this.itNum;a++)n.add(this.stateTensor.unsafeGet(e,i,this.currentTime-a+this.itNumHalf).policy);n.normalize();var r=(this.maxEntropy-n.getEntropy())/this.maxEntropy;n.scale(r)}}},{key:"showTriangles",value:function(t,e){if(!e.isValid)return!1;switch(t){case"policy":case"policy_aie":case"q-function":return!0;case"reward":case"value":return!1}}}]),t}(),A=function(t){var e=t.width,i=t.children;return a.a.createElement("div",{className:"FlexContainer",style:{display:"flex",justifyContent:"center",width:"100%"}},a.a.createElement("div",{style:{width:e}},i))},_=function(t){function e(t){var i;Object(l.a)(this,e),(i=Object(c.a)(this,Object(h.a)(e).call(this,t))).renderHandler=void 0;var n=function(t){for(var e=[0,0],i=[],n=new Array(16).fill(null).map((function(t){return new Array(16).fill(null)})),a=0;a<16;a++)for(var r=0;r<16;r++){var s=t[r].charAt(a);n[a][r]=s,"\u20ac"===s&&i.push([a,r]),"$"===s&&(e=[a,r])}var l=i.length,o=new k(16,16,179,(function(t,e,a){var r=n[t][e],s=Object(b.a)(i[Math.floor(a*l/179)],2),o=s[0],c=s[1];return{isValid:"#"!==r,reward:t===o&&e===c?1:0,value:5}})),c=e,h=Object(b.a)(c,2),u=h[0],f=h[1],d=o.unsafeGet(u,f,0);return{stateTensor:o,agent:new x(d,o,new E(new j(.3,.5),new C((function(t){return.9999998*t}))))}}([".........#......",".........#......",".........#.\u20ac....","...#####.####...","...#........#...","...#........#...","...#..##....#...","...#.########...","...#..##....#...","...#..$.....#...","...#......\u20ac.#...","...#........#...","...##########...","................","................","................"]),a=n.stateTensor,r=n.agent;return i.renderHandler=new P(r,a,16,30,2,new V(a),(function(t){i.setState({timeTravelProgress:t})})),console.log(a),console.log(r),i.state={timeTravelProgress:0},i}return Object(u.a)(e,t),Object(o.a)(e,[{key:"render",value:function(){var t=this;return a.a.createElement("div",{className:"App bp3-dark"},a.a.createElement("h1",null,"RL Playground"),a.a.createElement(A,null,a.a.createElement(f.b,{fill:!1,vertical:!1},a.a.createElement("div",{className:"bp3-select"},a.a.createElement("select",{onChange:function(e){t.renderHandler.viewMode=e.target.options[e.target.selectedIndex].text}},S.map((function(t){return a.a.createElement("option",{key:t},t)})))),a.a.createElement(f.a,{text:"time travel",onClick:function(){return t.renderHandler.doTimeTravel=!0}}))),a.a.createElement("br",null),a.a.createElement(A,{width:300},a.a.createElement(f.c,{value:this.state.timeTravelProgress,intent:"success",animate:!1})),a.a.createElement("p",null,a.a.createElement("br",null),"iteration: ",a.a.createElement("i",{id:"stepCounter"}),a.a.createElement("br",null),"timer: ",a.a.createElement("i",{id:"timer"},"55")),a.a.createElement("canvas",{id:"canvas",style:{backgroundColor:"#354553",border:"thick double rgb(64, 95, 112)",borderRadius:6}}))}},{key:"componentDidMount",value:function(){this.renderHandler.start().then()}}]),e}(a.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(a.a.createElement(_,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()}))}},[[152,1,2]]]);
//# sourceMappingURL=main.b1d46219.chunk.js.map