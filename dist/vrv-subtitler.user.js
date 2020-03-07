// ==UserScript==
// @name         VRV Subtitler
// @namespace    http://tampermonkey.net/
// @version      0.1.15
// @description  Display SRT format subtitles on VRV
// @author       sheodox
// @match        https://static.vrv.co/vilos/player.html
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

!function(t){var e={};function n(s){if(e[s])return e[s].exports;var r=e[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,s){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(s,r,function(e){return t[e]}.bind(null,r));return s},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e){t.exports=class{constructor(t,e){this.format=t,this.fileName=e,this.subs=[]}getSubs(t){return this.subs.filter(e=>e.start<=t&&e.end>=t)}timeToMs(t){const[e,n,s]=t.split(":");return 36e5*+e+6e4*+n+1e3*parseFloat(s)}firstSubtitle(){return this.subs.reduce((t,e)=>e.start<t.start?e:t,{start:1/0})}}},function(t,e,n){const s=n(0),r=t=>(t.charAt(0).toLowerCase()+t.substring(1)).replace(" ",""),o=t=>{if(t){t=(t=t.replace(/[&H]/g,"")).padStart(8,"0");const[e,n,s,r,o]=t.match(/([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i),l=t=>parseInt(t,16);return`rgba(${l(o)}, ${l(r)}, ${l(s)}, ${255-l(n)})`}},l=(t,e,n="transparent",s=0,r=0)=>{const o=t||n;shadowBlur=`${r}px`,s*=2,r=`${r}px`;const l=[];for(let t=-1*(e=2*(void 0===e?1:e));t<=e;t++)for(let n=-1*e;n<=e;n++)l.push(`${t}px ${n}px ${r} ${o}`);return`text-shadow: ${l.join(", ")}, ${s}px ${s}px ${r} ${n}`};function i(t,e,n=!1){const s=new RegExp(n?`\\\\${e}\\((.*?)\\)`:`\\\\${e}([^\\\\}]*)`),r=t.match(s);if(r)return{overrides:t.replace(r[0],""),params:n?r[1].split(","):r[1]}}t.exports=class extends s{constructor(t,e){super("ass",e),t=t.replace(/\r\n/g,"\n");try{this.blocks=this.parseBlocks(t),this.subs=this.parseBlock(this.blocks.subs),this.parseInfo(this.blocks.info),this.parseSubTimings(),this.parseStyles(this.parseBlock(this.blocks.styles)),this.parseSubOverrideTags()}catch(t){console.error("ASS PARSE ERROR",t),this.subs=[]}}serialize(){return JSON.stringify({info:this.info,styles:this.styles,subs:this.subs},null,4)}debugInfo(){return[{title:"Number of styles",detail:Object.keys(this.styles).length},{title:"Number of subtitles",detail:this.subs.length}]}parseInfo(){this.info={},this.blocks.info.split("\n").forEach(t=>{const[e,n]=t.split(": ");this.info[r(e)]=n})}parseBlocks(t){const e=t.split(/\n(?=\[)/),n=t=>e.find(e=>{e=e.trim();const[n,s]=e.match(/^\[(.*?)]/);return s===t}).replace(/.*\n/,"").trim();return{info:n("Script Info"),styles:n("V4+ Styles"),subs:n("Events")}}parseBlock(t){const[e,...n]=t.split("\n"),s=(t,e=1/0)=>{let[n,s,r]=t.match(/(\w*): (.*)/);return r=r.split(","),r.length>e&&(r[e-1]=r.slice(e-1).join(","),r.splice(e,1/0)),{type:s,attributes:r}},o=s(e);return n.reduce((t,e)=>{if(!e||";"===e.charAt(0)||0===e.indexOf("Comment: "))return t;const n=s(e,o.attributes.length),l={dataType:n.type.toLowerCase()};return o.attributes.forEach((t,e)=>{t=t.trim();const s=r(t);l[s]=n.attributes[e]}),l.style="*Default"===l.style?"Default":l.style,t.push(l),t},[])}parseSubTimings(){this.subs.forEach(t=>{t.start=this.timeToMs(t.start),t.end=this.timeToMs(t.end)})}parseStyles(t){const e={};t.forEach(t=>{for(const e of Object.keys(t).filter(t=>/colour/i.test(t)))t[e]=o(t[e]);t.name="*Default"===t.name?"Default":t.name;const n=[],{primaryColour:s,secondaryColour:r,outlineColour:i,backColour:a,borderStyle:c,outline:u,shadow:p,fontname:d,fontsize:f,bold:g,italic:x,underline:m,strikeOut:h}=t;s&&n.push(`color: ${s}`),d&&n.push(`font-family: "${d}"`),f&&n.push(`font-size: ${f}pt`),"1"===c?n.push(l(i,u,a,p)):"3"===c&&n.push(`background-color: ${a}`),"-1"===g&&n.push("font-weight: bold"),"-1"===x&&n.push("font-style: italic"),"-1"!==m&&"-1"!==h||n.push(`text-decoration: ${"-1"===m?"underline":""} ${"-1"===h?"line-through":""}`),e[t.name]={inline:n.join(";"),raw:t}}),this.styles=e}parseSubOverrideTags(){this.subs.forEach(t=>{if(t.rawText=t.text,t.text=t.text.replace("\\N","\n"),!/{.+?}/.test(t.text))return;const e=t=>t.replace(/{.*?}/g,"");t.styledText=[];const n=function*(t){const e=/({.*?}[^{]*)/g;let n;for(;null!==(n=e.exec(t));)yield n[1]}(t.text);let s=[];for(const a of n){const n=[],c={text:e(a),fadeIn:0,fadeOut:0,inline:""};let u,p,d,f,g,[x]=a.match(/{.*?}/);function r(t,e=!1,n=(()=>{})){const s=i(x,t,e);s&&(n(s.params),x=s.overrides)}if(r("fscx"),r("fscy"),r("3c",!1,t=>{u=t}),r("4c",!1,t=>{p=t}),r("bord",!1,t=>{d=t}),r("shad",!1,t=>{f=t}),r("blur",!1,t=>{g=3*t}),r("be",!1,t=>{g=5*t}),[u,p,d,f,g].some(t=>void 0!==t)){const e=this.styles[t.style],n=(t,n)=>void 0!==t?t:e.raw[n];e&&(u=n(o(u),"outlineColour"),p=n(o(p),"backColour"),d=n(d,"outline"),f=n(f,"shadow"),s.push(l(u,d,p,f,g)))}r("pos",!0,([t,e])=>{t=+t/+this.info.playResX*100,e=+e/+this.info.playResY*100,n.push(`position: fixed; left: ${t}vw; top: ${e}vh`)}),r("fad",!0,([e,n])=>{c.fadeIn=e,c.fadeOut=n,t.end-=n}),r("fsp",!1,t=>{s.push(`letter-spacing: ${t}px`)}),r("fs",!1,t=>{s.push(`font-size: ${t}pt`)});const m=[];r("u",!1,t=>{m.push("underline")}),r("s",!1,t=>{m.push("line-through")}),s.push(`text-decoration: ${m.length?m.join(" "):"none"}`),r("b",!1,t=>{s.push(`font-weight: ${t?"bold":"normal"}`)}),r("i",!1,t=>{s.push(`font-style: ${t?"italic":"normal"}`)}),r("fn",!1,t=>{s.push(`font-family: "${t}"`)}),r("1c",!1,t=>{s.push(`color: ${o(t)}`)}),r("r",!1,t=>{s=t?[this.styles[t].inline]:[]}),c.inline=s.join(";"),t.styledText.push(c),n.length&&(t.inline=n.join(";"))}t.text=e(t.text)})}}},function(t,e,n){"use strict";function s(){}n.r(e);const r=t=>t;function o(t){return t()}function l(){return Object.create(null)}function i(t){t.forEach(o)}function a(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}const u="undefined"!=typeof window;let p=u?()=>window.performance.now():()=>Date.now(),d=u?t=>requestAnimationFrame(t):s;const f=new Set;function g(t){f.forEach(e=>{e.c(t)||(f.delete(e),e.f())}),0!==f.size&&d(g)}function x(t){let e;return 0===f.size&&d(g),{promise:new Promise(n=>{f.add(e={c:t,f:n})}),abort(){f.delete(e)}}}function m(t,e){t.appendChild(e)}function h(t,e,n){t.insertBefore(e,n||null)}function b(t){t.parentNode.removeChild(t)}function y(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function v(t){return document.createElement(t)}function $(t){return document.createTextNode(t)}function w(){return $(" ")}function k(){return $("")}function S(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function C(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function E(t,e){e=""+e,t.data!==e&&(t.data=e)}function _(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}let j,O,T=0,q={};function I(t,e,n,s,r,o,l,i=0){const a=16.666/s;let c="{\n";for(let t=0;t<=1;t+=a){const s=e+(n-e)*o(t);c+=100*t+`%{${l(s,1-s)}}\n`}const u=c+`100% {${l(n,1-n)}}\n}`,p=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${i}`;if(!q[p]){if(!j){const t=v("style");document.head.appendChild(t),j=t.sheet}q[p]=!0,j.insertRule(`@keyframes ${p} ${u}`,j.cssRules.length)}const d=t.style.animation||"";return t.style.animation=`${d?`${d}, `:""}${p} ${s}ms linear ${r}ms 1 both`,T+=1,p}function R(t,e){t.style.animation=(t.style.animation||"").split(", ").filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")).join(", "),e&&!--T&&d(()=>{if(T)return;let t=j.cssRules.length;for(;t--;)j.deleteRule(t);q={}})}function P(t){O=t}function A(){if(!O)throw new Error("Function called outside component initialization");return O}function M(){const t=A();return(e,n)=>{const s=t.$$.callbacks[e];if(s){const r=_(e,n);s.slice().forEach(e=>{e.call(t,r)})}}}const N=[],B=[],z=[],F=[],L=Promise.resolve();let D=!1;function V(){D||(D=!0,L.then(G))}function U(t){z.push(t)}let J=!1;const H=new Set;function G(){if(!J){J=!0;do{for(let t=0;t<N.length;t+=1){const e=N[t];P(e),Y(e.$$)}for(N.length=0;B.length;)B.pop()();for(let t=0;t<z.length;t+=1){const e=z[t];H.has(e)||(H.add(e),e())}z.length=0}while(N.length);for(;F.length;)F.pop()();D=!1,J=!1,H.clear()}}function Y(t){if(null!==t.fragment){t.update(),i(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(U)}}let X;function Z(){return X||(X=Promise.resolve(),X.then(()=>{X=null})),X}function K(t,e,n){t.dispatchEvent(_(`${e?"intro":"outro"}${n}`))}const Q=new Set;let W;function tt(){W={r:0,c:[],p:W}}function et(){W.r||i(W.c),W=W.p}function nt(t,e){t&&t.i&&(Q.delete(t),t.i(e))}function st(t,e,n,s){if(t&&t.o){if(Q.has(t))return;Q.add(t),W.c.push(()=>{Q.delete(t),s&&(n&&t.d(1),s())}),t.o(e)}}const rt={duration:0};function ot(t,e,n){let o,l,i=e(t,n),c=!1,u=0;function d(){o&&R(t,o)}function f(){const{delay:e=0,duration:n=300,easing:a=r,tick:f=s,css:g}=i||rt;g&&(o=I(t,0,1,n,e,a,g,u++)),f(0,1);const m=p()+e,h=m+n;l&&l.abort(),c=!0,U(()=>K(t,!0,"start")),l=x(e=>{if(c){if(e>=h)return f(1,0),K(t,!0,"end"),d(),c=!1;if(e>=m){const t=a((e-m)/n);f(t,1-t)}}return c})}let g=!1;return{start(){g||(R(t),a(i)?(i=i(),Z().then(f)):f())},invalidate(){g=!1},end(){c&&(d(),c=!1)}}}function lt(t,e,n){let o,l=e(t,n),c=!0;const u=W;function d(){const{delay:e=0,duration:n=300,easing:a=r,tick:d=s,css:f}=l||rt;f&&(o=I(t,1,0,n,e,a,f));const g=p()+e,m=g+n;U(()=>K(t,!1,"start")),x(e=>{if(c){if(e>=m)return d(0,1),K(t,!1,"end"),--u.r||i(u.c),!1;if(e>=g){const t=a((e-g)/n);d(1-t,t)}}return c})}return u.r+=1,a(l)?Z().then(()=>{l=l(),d()}):d(),{end(e){e&&l.tick&&l.tick(1,0),c&&(o&&R(t,o),c=!1)}}}const it="undefined"!=typeof window?window:global;function at(t,e){st(t,1,1,()=>{e.delete(t.key)})}new Set(["allowfullscreen","allowpaymentrequest","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","hidden","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"]);let ct;function ut(t){t&&t.c()}function pt(t,e,n){const{fragment:s,on_mount:r,on_destroy:l,after_update:c}=t.$$;s&&s.m(e,n),U(()=>{const e=r.map(o).filter(a);l?l.push(...e):i(e),t.$$.on_mount=[]}),c.forEach(U)}function dt(t,e){const n=t.$$;null!==n.fragment&&(i(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ft(t,e,n,r,o,a,c=[-1]){const u=O;P(t);const p=e.props||{},d=t.$$={fragment:null,ctx:null,props:a,update:s,not_equal:o,bound:l(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:l(),dirty:c};let f=!1;var g;d.ctx=n?n(t,p,(e,n,...s)=>{const r=s.length?s[0]:n;return d.ctx&&o(d.ctx[e],d.ctx[e]=r)&&(d.bound[e]&&d.bound[e](r),f&&function(t,e){-1===t.$$.dirty[0]&&(N.push(t),V(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}(t,e)),n}):[],d.update(),f=!0,i(d.before_update),d.fragment=!!r&&r(d.ctx),e.target&&(e.hydrate?d.fragment&&d.fragment.l((g=e.target,Array.from(g.childNodes))):d.fragment&&d.fragment.c(),e.intro&&nt(t.$$.fragment),pt(t,e.target,e.anchor),G()),P(u)}"function"==typeof HTMLElement&&(ct=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(t,e,n){this[t]=n}$destroy(){dt(this,1),this.$destroy=s}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}});class gt{$destroy(){dt(this,1),this.$destroy=s}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}function xt(t){const e=t-1;return e*e*e+1}function mt(t,{delay:e=0,duration:n=400,easing:s=r}){const o=+getComputedStyle(t).opacity;return{delay:e,duration:n,easing:s,css:t=>`opacity: ${t*o}`}}function ht(t,{delay:e=0,duration:n=400,easing:s=xt,x:r=0,y:o=0,opacity:l=0}){const i=getComputedStyle(t),a=+i.opacity,c="none"===i.transform?"":i.transform,u=a*(1-l);return{delay:e,duration:n,easing:s,css:(t,e)=>`\n\t\t\ttransform: ${c} translate(${(1-t)*r}px, ${(1-t)*o}px);\n\t\t\topacity: ${a-u*e}`}}function bt(t,e,n){const s=t.slice();return s[21]=e[n],s}function yt(t,e,n){const s=t.slice();return s[18]=e[n],s}function vt(t){let e,n,r,o,l,i,a,c,u,p,d,f,g,x,k,S=t[1].fileName+"",_=t[2]>0?"+":"",j=(t[2]/1e3).toFixed(1)+"",O=t[1].debugInfo(),T=[];for(let e=0;e<O.length;e+=1)T[e]=kt(bt(t,O,e));return{c(){e=v("h2"),e.textContent="Debug Information",n=w(),r=v("dl"),o=v("dt"),o.textContent="Subtitles File",l=v("dd"),i=$(S),a=v("dt"),a.textContent="Alignment",c=v("dd"),u=$(_),p=$(j),d=$(" seconds");for(let t=0;t<T.length;t+=1)T[t].c();f=w(),g=v("a"),x=$("⬇ Download Parsed Subtitles"),C(e,"class","svelte-mdg8y7"),C(o,"class","svelte-mdg8y7"),C(l,"class","svelte-mdg8y7"),C(a,"class","svelte-mdg8y7"),C(c,"class","svelte-mdg8y7"),C(r,"class","svelte-mdg8y7"),C(g,"href",k=t[6]()),C(g,"download","parsed-subtitles.json"),C(g,"class","svelte-mdg8y7")},m(t,s){h(t,e,s),h(t,n,s),h(t,r,s),m(r,o),m(r,l),m(l,i),m(r,a),m(r,c),m(c,u),m(c,p),m(c,d);for(let t=0;t<T.length;t+=1)T[t].m(r,null);h(t,f,s),h(t,g,s),m(g,x)},p(t,e){if(2&e&&S!==(S=t[1].fileName+"")&&E(i,S),4&e&&_!==(_=t[2]>0?"+":"")&&E(u,_),4&e&&j!==(j=(t[2]/1e3).toFixed(1)+"")&&E(p,j),2&e){let n;for(O=t[1].debugInfo(),n=0;n<O.length;n+=1){const s=bt(t,O,n);T[n]?T[n].p(s,e):(T[n]=kt(s),T[n].c(),T[n].m(r,null))}for(;n<T.length;n+=1)T[n].d(1);T.length=O.length}},i:s,o:s,d(t){t&&b(e),t&&b(n),t&&b(r),y(T,t),t&&b(f),t&&b(g)}}}function $t(t){let e,n,r,o,l,a,c,u,p,d,f,g,x,m,y,$,k,E;return{c(){e=v("h2"),e.textContent="Settings",n=w(),r=v("button"),r.textContent="Reselect subtitles",o=w(),l=v("button"),l.textContent="Realign subtitles",a=w(),c=v("br"),u=w(),p=v("input"),d=w(),f=v("label"),f.textContent="Show subs over video",g=w(),x=v("br"),m=w(),y=v("input"),$=w(),k=v("label"),k.textContent="Pause when tray is open",C(e,"class","svelte-mdg8y7"),C(r,"class","svelte-mdg8y7"),C(l,"class","svelte-mdg8y7"),C(c,"class","svelte-mdg8y7"),C(p,"id","show-subs"),C(p,"type","checkbox"),p.checked=!0,C(p,"class","svelte-mdg8y7"),C(f,"for","show-subs"),C(f,"class","svelte-mdg8y7"),C(x,"class","svelte-mdg8y7"),C(y,"id","pause-on-tray"),C(y,"type","checkbox"),C(y,"class","svelte-mdg8y7"),C(k,"for","pause-on-tray"),C(k,"class","svelte-mdg8y7")},m(s,i){h(s,e,i),h(s,n,i),h(s,r,i),h(s,o,i),h(s,l,i),h(s,a,i),h(s,c,i),h(s,u,i),h(s,p,i),h(s,d,i),h(s,f,i),h(s,g,i),h(s,x,i),h(s,m,i),h(s,y,i),y.checked=t[4],h(s,$,i),h(s,k,i),E=[S(r,"click",t[15]),S(l,"click",t[16]),S(p,"change",t[8]("show-subs")),S(y,"change",t[17])]},p(t,e){16&e&&(y.checked=t[4])},i:s,o:s,d(t){t&&b(e),t&&b(n),t&&b(r),t&&b(o),t&&b(l),t&&b(a),t&&b(c),t&&b(u),t&&b(p),t&&b(d),t&&b(f),t&&b(g),t&&b(x),t&&b(m),t&&b(y),t&&b($),t&&b(k),i(E)}}}function wt(t){let e,n,s,r,o=[],l=new Map,i=t[0];const a=t=>t[18].text;for(let e=0;e<i.length;e+=1){let n=yt(t,i,e),s=a(n);l.set(s,o[e]=St(s,n))}return{c(){e=v("h2"),e.textContent="Recent Subtitles",n=w(),s=v("ul");for(let t=0;t<o.length;t+=1)o[t].c();C(e,"class","svelte-mdg8y7"),C(s,"class","recent-subs svelte-mdg8y7")},m(t,l){h(t,e,l),h(t,n,l),h(t,s,l);for(let t=0;t<o.length;t+=1)o[t].m(s,null);r=!0},p(t,e){if(33&e){const n=t[0];tt(),o=function(t,e,n,s,r,o,l,i,a,c,u,p){let d=t.length,f=o.length,g=d;const x={};for(;g--;)x[t[g].key]=g;const m=[],h=new Map,b=new Map;for(g=f;g--;){const t=p(r,o,g),i=n(t);let a=l.get(i);a?s&&a.p(t,e):(a=c(i,t),a.c()),h.set(i,m[g]=a),i in x&&b.set(i,Math.abs(g-x[i]))}const y=new Set,v=new Set;function $(t){nt(t,1),t.m(i,u),l.set(t.key,t),u=t.first,f--}for(;d&&f;){const e=m[f-1],n=t[d-1],s=e.key,r=n.key;e===n?(u=e.first,d--,f--):h.has(r)?!l.has(s)||y.has(s)?$(e):v.has(r)?d--:b.get(s)>b.get(r)?(v.add(s),$(e)):(y.add(r),d--):(a(n,l),d--)}for(;d--;){const e=t[d];h.has(e.key)||a(e,l)}for(;f;)$(m[f-1]);return m}(o,e,a,1,t,n,l,s,at,St,null,yt),et()}},i(t){if(!r){for(let t=0;t<i.length;t+=1)nt(o[t]);r=!0}},o(t){for(let t=0;t<o.length;t+=1)st(o[t]);r=!1},d(t){t&&b(e),t&&b(n),t&&b(s);for(let t=0;t<o.length;t+=1)o[t].d()}}}function kt(t){let e,n,s,r,o=t[21].title+"",l=t[21].detail+"";return{c(){e=v("dt"),n=$(o),s=v("dd"),r=$(l),C(e,"class","svelte-mdg8y7"),C(s,"class","svelte-mdg8y7")},m(t,o){h(t,e,o),m(e,n),h(t,s,o),m(s,r)},p(t,e){2&e&&o!==(o=t[21].title+"")&&E(n,o),2&e&&l!==(l=t[21].detail+"")&&E(r,l)},d(t){t&&b(e),t&&b(s)}}}function St(t,e){let n,s,r,o,l,i,a,c,u,p=e[18].text+"";return{key:t,first:null,c(){n=v("li"),s=v("a"),r=$(p),l=w(),C(s,"target","_blank"),C(s,"href",o=`https://jisho.org/search/${encodeURIComponent(e[18].text.trim())}`),C(s,"rel","noopener noreferrer"),C(s,"class","svelte-mdg8y7"),C(n,"class","svelte-mdg8y7"),this.first=n},m(t,o){h(t,n,o),m(n,s),m(s,r),m(n,l),c=!0,u=S(s,"click",e[14])},p(t,e){(!c||1&e)&&p!==(p=t[18].text+"")&&E(r,p),(!c||1&e&&o!==(o=`https://jisho.org/search/${encodeURIComponent(t[18].text.trim())}`))&&C(s,"href",o)},i(t){c||(U(()=>{a&&a.end(1),i||(i=ot(n,ht,{y:50,duration:200})),i.start()}),c=!0)},o(t){i&&i.invalidate(),a=lt(n,ht,{y:-50,duration:200}),c=!1},d(t){t&&b(n),t&&a&&a.end(),u()}}}function Ct(t){let e,n,s,r,o,l,a,c,u,p,d,f,g,x,y,k,E,_,j,O,T,q;const I=[wt,$t,vt],R=[];function P(t,e){return"recent"===t[3]?0:"settings"===t[3]?1:"debug"===t[3]?2:-1}return~(j=P(t))&&(O=R[j]=I[j](t)),{c(){e=v("div"),n=v("h1"),n.textContent="VRV Subtitler",s=w(),r=v("div"),o=w(),l=v("div"),a=v("button"),c=$("Recent Subtitles"),p=w(),d=v("button"),f=$("Settings"),x=w(),y=v("button"),k=$("Debug"),_=w(),O&&O.c(),C(n,"class","svelte-mdg8y7"),C(r,"class","svelte-mdg8y7"),a.disabled=u="recent"===t[3],C(a,"class","svelte-mdg8y7"),d.disabled=g="settings"===t[3],C(d,"class","svelte-mdg8y7"),y.disabled=E="debug"===t[3],C(y,"class","svelte-mdg8y7"),C(l,"class","tray-tabs svelte-mdg8y7"),C(e,"class","tray svelte-mdg8y7")},m(i,u){h(i,e,u),m(e,n),m(e,s),m(e,r),m(e,o),m(e,l),m(l,a),m(a,c),m(l,p),m(l,d),m(d,f),m(l,x),m(l,y),m(y,k),m(e,_),~j&&R[j].m(e,null),T=!0,q=[S(a,"click",t[11]),S(d,"click",t[12]),S(y,"click",t[13]),S(e,"mouseenter",t[7](!0)),S(e,"mouseleave",t[7](!1))]},p(t,[n]){(!T||8&n&&u!==(u="recent"===t[3]))&&(a.disabled=u),(!T||8&n&&g!==(g="settings"===t[3]))&&(d.disabled=g),(!T||8&n&&E!==(E="debug"===t[3]))&&(y.disabled=E);let s=j;j=P(t),j===s?~j&&R[j].p(t,n):(O&&(tt(),st(R[s],1,1,()=>{R[s]=null}),et()),~j?(O=R[j],O||(O=R[j]=I[j](t),O.c()),nt(O,1),O.m(e,null)):O=null)},i(t){T||(nt(O),T=!0)},o(t){st(O),T=!1},d(t){t&&b(e),~j&&R[j].d(),i(q)}}}function Et(t,e,n){const s=M();let{recentSubs:r=[]}=e,{subtitles:o={}}=e,{alignment:l=0}=e,i="recent",a=!0;return t.$set=t=>{"recentSubs"in t&&n(0,r=t.recentSubs),"subtitles"in t&&n(1,o=t.subtitles),"alignment"in t&&n(2,l=t.alignment)},[r,o,l,i,a,s,function(){const t=new Blob([o.serialize()],{type:"application/json"});return URL.createObjectURL(t)},function(t){return()=>{t&&!a||s("tray-pauser",t)}},function(t){return e=>{s(t,e.target.checked)}},!1,!0,()=>n(3,i="recent"),()=>n(3,i="settings"),()=>n(3,i="debug"),()=>s("define-pauser"),()=>s("restart"),()=>s("realign"),function(){a=this.checked,n(4,a)}]}var _t=class extends gt{constructor(t){var e;super(),document.getElementById("svelte-mdg8y7-style")||((e=v("style")).id="svelte-mdg8y7-style",e.textContent=".tray.svelte-mdg8y7.svelte-mdg8y7{margin-top:0.5rem;width:2vw;background:rgba(255, 255, 255, 0.2);position:fixed;right:0;top:0;color:white;height:calc(100% - 5rem)}.tray.svelte-mdg8y7>.svelte-mdg8y7{visibility:hidden}.tray.svelte-mdg8y7.svelte-mdg8y7:hover{width:40vw;max-width:40rem;background:rgb(33, 39, 55);overflow:auto;border-radius:3px}.tray.svelte-mdg8y7:hover>.svelte-mdg8y7{visibility:visible}.tray.svelte-mdg8y7 h1.svelte-mdg8y7{font-size:2rem;background:rgb(27, 26, 38);padding:0.5rem 0;border-radius:3px;margin:0 0 0.5rem 0;border-bottom:2px solid #f47521}.tray.svelte-mdg8y7 h2.svelte-mdg8y7{margin:0;text-decoration:underline}button.svelte-mdg8y7.svelte-mdg8y7{margin:0.5rem}ul.svelte-mdg8y7.svelte-mdg8y7{list-style:none}a.svelte-mdg8y7.svelte-mdg8y7{color:white;transform:scaleY(0);transform-origin:top;transition:transform 0.5s ease;font-size:1rem;text-decoration:none}a.svelte-mdg8y7.svelte-mdg8y7:hover{color:#0aff8c;cursor:pointer;text-decoration:underline}li.svelte-mdg8y7.svelte-mdg8y7:not(:first-of-type)::before{content:' ';position:relative;background:#f47521;height:0.1rem;width:3.2rem;display:block;margin:0 auto;border-radius:4px}dl.svelte-mdg8y7.svelte-mdg8y7{padding:2rem;text-align:left}dt.svelte-mdg8y7.svelte-mdg8y7{font-weight:bold}dd.svelte-mdg8y7.svelte-mdg8y7{font-style:italic}",m(document.head,e)),ft(this,t,Et,Ct,c,{recentSubs:0,subtitles:1,alignment:2})}};function jt(t,e,n){const s=t.slice();return s[11]=e[n],s}function Ot(t,e,n){const s=t.slice();return s[8]=e[n],s}function Tt(t){let e,n,s=t[0],r=[];for(let e=0;e<s.length;e+=1)r[e]=Pt(Ot(t,s,e));const o=t=>st(r[t],1,1,()=>{r[t]=null});return{c(){for(let t=0;t<r.length;t+=1)r[t].c();e=k()},m(t,s){for(let e=0;e<r.length;e+=1)r[e].m(t,s);h(t,e,s),n=!0},p(t,n){if(13&n){let l;for(s=t[0],l=0;l<s.length;l+=1){const o=Ot(t,s,l);r[l]?(r[l].p(o,n),nt(r[l],1)):(r[l]=Pt(o),r[l].c(),nt(r[l],1),r[l].m(e.parentNode,e))}for(tt(),l=s.length;l<r.length;l+=1)o(l);et()}},i(t){if(!n){for(let t=0;t<s.length;t+=1)nt(r[t]);n=!0}},o(t){r=r.filter(Boolean);for(let t=0;t<r.length;t+=1)st(r[t]);n=!1},d(t){y(r,t),t&&b(e)}}}function qt(t){let e,n=t[8].text+"";return{c(){e=$(n)},m(t,n){h(t,e,n)},p(t,s){1&s&&n!==(n=t[8].text+"")&&E(e,n)},i:s,o:s,d(t){t&&b(e)}}}function It(t){let e,n,s=t[8].styledText,r=[];for(let e=0;e<s.length;e+=1)r[e]=Rt(jt(t,s,e));const o=t=>st(r[t],1,1,()=>{r[t]=null});return{c(){for(let t=0;t<r.length;t+=1)r[t].c();e=k()},m(t,s){for(let e=0;e<r.length;e+=1)r[e].m(t,s);h(t,e,s),n=!0},p(t,n){if(1&n){let l;for(s=t[8].styledText,l=0;l<s.length;l+=1){const o=jt(t,s,l);r[l]?(r[l].p(o,n),nt(r[l],1)):(r[l]=Rt(o),r[l].c(),nt(r[l],1),r[l].m(e.parentNode,e))}for(tt(),l=s.length;l<r.length;l+=1)o(l);et()}},i(t){if(!n){for(let t=0;t<s.length;t+=1)nt(r[t]);n=!0}},o(t){r=r.filter(Boolean);for(let t=0;t<r.length;t+=1)st(r[t]);n=!1},d(t){y(r,t),t&&b(e)}}}function Rt(t){let e,n,s,r,o,l,i=t[11].text+"";return{c(){e=v("span"),n=$(i),C(e,"style",s=t[11].inline)},m(t,s){h(t,e,s),m(e,n),l=!0},p(t,r){(!l||1&r)&&i!==(i=t[11].text+"")&&E(n,i),(!l||1&r&&s!==(s=t[11].inline))&&C(e,"style",s)},i(n){l||(U(()=>{o&&o.end(1),r||(r=ot(e,mt,t[11].fadeIn)),r.start()}),l=!0)},o(n){r&&r.invalidate(),o=lt(e,mt,t[11].fadeOut),l=!1},d(t){t&&b(e),t&&o&&o.end()}}}function Pt(t){let e,n,s,r,o,l,i,a;const c=[It,qt],u=[];function p(t,e){return t[8].styledText?0:1}function d(...e){return t[7](t[8],...e)}return n=p(t),s=u[n]=c[n](t),{c(){e=v("p"),s.c(),r=w(),C(e,"style",o=t[3](t[8])),C(e,"data-sub-style",l=t[8].style),C(e,"title","click to search this phrase on Jisho.org"),C(e,"class","svelte-1w98obp")},m(t,s){h(t,e,s),u[n].m(e,null),m(e,r),i=!0,a=S(e,"click",d)},p(a,d){let f=n;n=p(t=a),n===f?u[n].p(t,d):(tt(),st(u[f],1,1,()=>{u[f]=null}),et(),s=u[n],s||(s=u[n]=c[n](t),s.c()),nt(s,1),s.m(e,r)),(!i||1&d&&o!==(o=t[3](t[8])))&&C(e,"style",o),(!i||1&d&&l!==(l=t[8].style))&&C(e,"data-sub-style",l)},i(t){i||(nt(s),i=!0)},o(t){st(s),i=!1},d(t){t&&b(e),u[n].d(),a()}}}function At(t){let e,n,s=t[1]&&Tt(t);return{c(){e=v("div"),s&&s.c(),C(e,"class","subtitles")},m(t,r){h(t,e,r),s&&s.m(e,null),n=!0},p(t,[n]){t[1]?s?(s.p(t,n),nt(s,1)):(s=Tt(t),s.c(),nt(s,1),s.m(e,null)):s&&(tt(),st(s,1,1,()=>{s=null}),et())},i(t){n||(nt(s),n=!0)},o(t){st(s),n=!1},d(t){t&&b(e),s&&s.d()}}}function Mt(t,e,n){let{current:s=[]}=e,{styles:r={}}=e,{format:o=""}=e,{visible:l=!0}=e;const i=M();function a(t){i("define-pauser"),window.open(`https://jisho.org/search/${encodeURIComponent(t.trim())}`)}return t.$set=t=>{"current"in t&&n(0,s=t.current),"styles"in t&&n(4,r=t.styles),"format"in t&&n(5,o=t.format),"visible"in t&&n(1,l=t.visible)},[s,l,a,function(t){return"srt"===o?`font-size: ${1.5+1.5*(t.line?t.line:1)}rem; text-shadow: -4px -4px 0px rgba(9, 9, 9, 255), -4px -3px 0px rgba(9, 9, 9, 255), -4px -2px 0px rgba(9, 9, 9, 255), -4px -1px 0px rgba(9, 9, 9, 255), -4px 0px 0px rgba(9, 9, 9, 255), -4px 1px 0px rgba(9, 9, 9, 255), -4px 2px 0px rgba(9, 9, 9, 255), -4px 3px 0px rgba(9, 9, 9, 255), -4px 4px 0px rgba(9, 9, 9, 255), -3px -4px 0px rgba(9, 9, 9, 255), -3px -3px 0px rgba(9, 9, 9, 255), -3px -2px 0px rgba(9, 9, 9, 255), -3px -1px 0px rgba(9, 9, 9, 255), -3px 0px 0px rgba(9, 9, 9, 255), -3px 1px 0px rgba(9, 9, 9, 255), -3px 2px 0px rgba(9, 9, 9, 255), -3px 3px 0px rgba(9, 9, 9, 255), -3px 4px 0px rgba(9, 9, 9, 255), -2px -4px 0px rgba(9, 9, 9, 255), -2px -3px 0px rgba(9, 9, 9, 255), -2px -2px 0px rgba(9, 9, 9, 255), -2px -1px 0px rgba(9, 9, 9, 255), -2px 0px 0px rgba(9, 9, 9, 255), -2px 1px 0px rgba(9, 9, 9, 255), -2px 2px 0px rgba(9, 9, 9, 255), -2px 3px 0px rgba(9, 9, 9, 255), -2px 4px 0px rgba(9, 9, 9, 255), -1px -4px 0px rgba(9, 9, 9, 255), -1px -3px 0px rgba(9, 9, 9, 255), -1px -2px 0px rgba(9, 9, 9, 255), -1px -1px 0px rgba(9, 9, 9, 255), -1px 0px 0px rgba(9, 9, 9, 255), -1px 1px 0px rgba(9, 9, 9, 255), -1px 2px 0px rgba(9, 9, 9, 255), -1px 3px 0px rgba(9, 9, 9, 255), -1px 4px 0px rgba(9, 9, 9, 255), 0px -4px 0px rgba(9, 9, 9, 255), 0px -3px 0px rgba(9, 9, 9, 255), 0px -2px 0px rgba(9, 9, 9, 255), 0px -1px 0px rgba(9, 9, 9, 255), 0px 0px 0px rgba(9, 9, 9, 255), 0px 1px 0px rgba(9, 9, 9, 255), 0px 2px 0px rgba(9, 9, 9, 255), 0px 3px 0px rgba(9, 9, 9, 255), 0px 4px 0px rgba(9, 9, 9, 255), 1px -4px 0px rgba(9, 9, 9, 255), 1px -3px 0px rgba(9, 9, 9, 255), 1px -2px 0px rgba(9, 9, 9, 255), 1px -1px 0px rgba(9, 9, 9, 255), 1px 0px 0px rgba(9, 9, 9, 255), 1px 1px 0px rgba(9, 9, 9, 255), 1px 2px 0px rgba(9, 9, 9, 255), 1px 3px 0px rgba(9, 9, 9, 255), 1px 4px 0px rgba(9, 9, 9, 255), 2px -4px 0px rgba(9, 9, 9, 255), 2px -3px 0px rgba(9, 9, 9, 255), 2px -2px 0px rgba(9, 9, 9, 255), 2px -1px 0px rgba(9, 9, 9, 255), 2px 0px 0px rgba(9, 9, 9, 255), 2px 1px 0px rgba(9, 9, 9, 255), 2px 2px 0px rgba(9, 9, 9, 255), 2px 3px 0px rgba(9, 9, 9, 255), 2px 4px 0px rgba(9, 9, 9, 255), 3px -4px 0px rgba(9, 9, 9, 255), 3px -3px 0px rgba(9, 9, 9, 255), 3px -2px 0px rgba(9, 9, 9, 255), 3px -1px 0px rgba(9, 9, 9, 255), 3px 0px 0px rgba(9, 9, 9, 255), 3px 1px 0px rgba(9, 9, 9, 255), 3px 2px 0px rgba(9, 9, 9, 255), 3px 3px 0px rgba(9, 9, 9, 255), 3px 4px 0px rgba(9, 9, 9, 255), 4px -4px 0px rgba(9, 9, 9, 255), 4px -3px 0px rgba(9, 9, 9, 255), 4px -2px 0px rgba(9, 9, 9, 255), 4px -1px 0px rgba(9, 9, 9, 255), 4px 0px 0px rgba(9, 9, 9, 255), 4px 1px 0px rgba(9, 9, 9, 255), 4px 2px 0px rgba(9, 9, 9, 255), 4px 3px 0px rgba(9, 9, 9, 255), 4px 4px 0px rgba(9, 9, 9, 255), 2px 2px 0px rgba(20, 20, 20, 195)`:"ass"===o&&t.style in r?[r[t.style].inline,t.inline||""].join(";"):void 0},r,o,i,t=>a(t.text)]}var Nt=class extends gt{constructor(t){var e;super(),document.getElementById("svelte-1w98obp-style")||((e=v("style")).id="svelte-1w98obp-style",e.textContent="p.svelte-1w98obp{cursor:pointer;color:white;margin:0;padding:0;white-space:pre}p.svelte-1w98obp:hover{color:#0aff8c !important}",m(document.head,e)),ft(this,t,Mt,At,c,{current:0,styles:4,format:5,visible:1})}};class Bt{constructor(){this.video=null,this.reasons=[]}setVideo(t){this.reasons=[],this.video=t}addPauser(t){this.reasons.push(t),this._checkPause()}removePauser(t){const e=this.reasons.indexOf(t);-1!==e&&(this.reasons.splice(e,1),this._checkPause())}_checkPause(){this.reasons.length?this.video.pause():this.video.play()}}var zt=n(1),Ft=n.n(zt),Lt=n(0),Dt=n.n(Lt);class Vt extends Dt.a{constructor(t,e){super("srt",e);const n=t.split("\n\n");this.subs=n.reduce((t,e)=>{let n=e.trim().split("\n");function s(){n.shift()}try{/^\d*$/.test(n[0])&&s();let[e,r]=n[0].replace(/,/g,".").match(/^([\d:\.\-> ]*)/)[0].split(/\-\->/),o=n[0].match(/([a-zA-Z].*)/);o=o&&o.length?o[1]:"";const l=(t=>{const e=o.match(new RegExp(`${t}:([\\d\\.]*)%`));if(e)return parseInt(e[1],10)/100})("line")||1;s(),t.push({start:this.timeToMs(e),end:this.timeToMs(r),text:n.join("\n").replace(/<\/?c.Japanese>/g,""),line:l})}catch(t){}return t},[])}serialize(){return JSON.stringify(this.subs,null,4)}debugInfo(){return[{title:"Number of subtitles",detail:this.subs.length}]}}function Ut(t){let e,n,r,o;return{c(){e=v("label"),e.textContent="Select a subtitle file to begin",n=w(),r=v("input"),C(e,"for","srt-upload"),C(e,"class","svelte-7fhqwx"),C(r,"type","file"),C(r,"id","srt-upload"),C(r,"accept",".srt,.ass,.ssa"),C(r,"class","svelte-7fhqwx")},m(s,l){h(s,e,l),h(s,n,l),h(s,r,l),o=S(r,"change",t[0])},p:s,i:s,o:s,d(t){t&&b(e),t&&b(n),t&&b(r),o()}}}function Jt(t){const e=M();return[function(t){const n=t.target.files[0],s=new FileReader;s.onload=t=>{const s={ass:Ft.a,ssa:Ft.a,srt:Vt},[r,o]=n.name.match(/\.(\w{3})$/);e("subtitles-loaded",new s[o](t.target.result,n.name))},s.readAsText(n)}]}var Ht=class extends gt{constructor(t){var e;super(),document.getElementById("svelte-7fhqwx-style")||((e=v("style")).id="svelte-7fhqwx-style",e.textContent="label.svelte-7fhqwx{background:#fd0;border:none;cursor:pointer;padding:10px;line-height:1;font-weight:bold;color:black;text-transform:uppercase;display:inline-block;margin:2rem}label.svelte-7fhqwx:hover{background:#ffea6d}input.svelte-7fhqwx{display:none}",m(document.head,e)),ft(this,t,Jt,Ut,c,{})}};const{document:Gt}=it;function Yt(t){let e,n,r,o,l,a,c,u,p,d,f,g,x,y,k=t[0].text+"",_="number"==typeof t[2]&&function(t){let e,n,r,o,l,i,a,c,u,p=Math.abs(t[3])+"",d=t[2]>0?"later":"earlier";return{c(){e=v("button"),n=$("Use the last alignment for "),r=v("span"),r.textContent=`${t[1]}`,o=$(" ("),l=$(p),i=$(" seconds "),a=$(d),c=$(")."),C(r,"class","show-name svelte-1c0mlpl"),C(e,"class","svelte-1c0mlpl")},m(s,p){h(s,e,p),m(e,n),m(e,r),m(e,o),m(e,l),m(e,i),m(e,a),m(e,c),u=S(e,"click",t[4])},p:s,d(t){t&&b(e),u()}}}(t);return{c(){e=v("div"),n=v("div"),_&&_.c(),r=w(),o=v("button"),o.textContent="No alignment adjustment.",l=w(),a=v("button"),a.textContent="Enter alignment manually.",c=w(),u=v("button"),p=$("Click when the first line is said:\n\t\t"),d=v("br"),f=w(),g=v("pre"),x=$(k),C(o,"class","svelte-1c0mlpl"),C(a,"class","svelte-1c0mlpl"),C(n,"class","row svelte-1c0mlpl"),C(u,"class","svelte-1c0mlpl"),C(e,"class","alignment-buttons svelte-1c0mlpl")},m(s,i){h(s,e,i),m(e,n),_&&_.m(n,null),m(n,r),m(n,o),m(n,l),m(n,a),m(e,c),m(e,u),m(u,p),m(u,d),m(u,f),m(u,g),m(g,x),y=[S(o,"click",t[10]),S(a,"click",t[5]),S(u,"click",t[6])]},p(t,[e]){"number"==typeof t[2]&&_.p(t,e),1&e&&k!==(k=t[0].text+"")&&E(x,k)},i:s,o:s,d(t){t&&b(e),_&&_.d(),i(y)}}}function Xt(t,e,n){let{firstSubtitle:s={}}=e;const r=M(),o=document.querySelector(".video-title"),l=o?o.textContent:"",i=`last-used-alignment-${l}`,a=GM_getValue(i),c=(a/1e3).toFixed(1);function u(t){const e=document.querySelector("video"),n="number"==typeof t?t:1e3*e.currentTime-s.start-400;GM_setValue(i,n),r("set-align",n)}return t.$set=t=>{"firstSubtitle"in t&&n(0,s=t.firstSubtitle)},[s,l,a,c,function(){u(a)},function(){const t=parseFloat(prompt("Enter an alignment in seconds. Positive numbers mean the subtitles are timed earlier than the video and need to be delayed.",c||""));isNaN(t)||u(1e3*t)},u,r,o,i,()=>u(0)]}var Zt=class extends gt{constructor(t){var e;super(),Gt.getElementById("svelte-1c0mlpl-style")||((e=v("style")).id="svelte-1c0mlpl-style",e.textContent=".alignment-buttons.svelte-1c0mlpl.svelte-1c0mlpl{display:flex;flex-direction:column}.alignment-buttons.svelte-1c0mlpl button.svelte-1c0mlpl{margin:0.5rem;align-self:center}.row.svelte-1c0mlpl.svelte-1c0mlpl{display:flex;flex-direction:row;justify-content:center}.show-name.svelte-1c0mlpl.svelte-1c0mlpl{font-style:italic}",m(Gt.head,e)),ft(this,t,Xt,Yt,c,{firstSubtitle:0})}};const{document:Kt}=it;function Qt(t){let e,n;const s=new Nt({props:{format:t[2].format,styles:t[2].styles,current:t[1],currentTime:t[6],visible:t[5]}});s.$on("define-pauser",t[11]);const r=new _t({props:{recentSubs:t[4],subtitles:t[2],alignment:t[3]}});return r.$on("restart",t[7]),r.$on("tray-pauser",t[10]),r.$on("define-pauser",t[11]),r.$on("realign",t[17]),r.$on("show-subs",t[18]),{c(){ut(s.$$.fragment),e=w(),ut(r.$$.fragment)},m(t,o){pt(s,t,o),h(t,e,o),pt(r,t,o),n=!0},p(t,e){const n={};4&e&&(n.format=t[2].format),4&e&&(n.styles=t[2].styles),2&e&&(n.current=t[1]),32&e&&(n.visible=t[5]),s.$set(n);const o={};16&e&&(o.recentSubs=t[4]),4&e&&(o.subtitles=t[2]),8&e&&(o.alignment=t[3]),r.$set(o)},i(t){n||(nt(s.$$.fragment,t),nt(r.$$.fragment,t),n=!0)},o(t){st(s.$$.fragment,t),st(r.$$.fragment,t),n=!1},d(t){dt(s,t),t&&b(e),dt(r,t)}}}function Wt(t){let e;const n=new Zt({props:{firstSubtitle:t[2].firstSubtitle()}});return n.$on("set-align",t[8]),{c(){ut(n.$$.fragment)},m(t,s){pt(n,t,s),e=!0},p(t,e){const s={};4&e&&(s.firstSubtitle=t[2].firstSubtitle()),n.$set(s)},i(t){e||(nt(n.$$.fragment,t),e=!0)},o(t){st(n.$$.fragment,t),e=!1},d(t){dt(n,t)}}}function te(t){let e;const n=new Ht({});return n.$on("subtitles-loaded",t[9]),{c(){ut(n.$$.fragment)},m(t,s){pt(n,t,s),e=!0},p:s,i(t){e||(nt(n.$$.fragment,t),e=!0)},o(t){st(n.$$.fragment,t),e=!1},d(t){dt(n,t)}}}function ee(t){let e,n,s,r;const o=[te,Wt,Qt],l=[];function i(t,e){return"prompt"===t[0]?0:"align"===t[0]?1:"play"===t[0]?2:-1}return~(n=i(t))&&(s=l[n]=o[n](t)),{c(){e=v("div"),s&&s.c(),C(e,"class","subtitles-app svelte-qdgese")},m(t,s){h(t,e,s),~n&&l[n].m(e,null),r=!0},p(t,[r]){let a=n;n=i(t),n===a?~n&&l[n].p(t,r):(s&&(tt(),st(l[a],1,1,()=>{l[a]=null}),et()),~n?(s=l[n],s||(s=l[n]=o[n](t),s.c()),nt(s,1),s.m(e,null)):s=null)},i(t){r||(nt(s),r=!0)},o(t){st(s),r=!1},d(t){t&&b(e),~n&&l[n].d()}}}function ne(t,e,n){const s=new Bt;let r="prompt",o=[],l=null,i=null,a=-1,c=[],u=!0;function p(){n(0,r="prompt"),n(2,l=null),n(1,o=[])}var d;function f(t){let e=t[t.length-1],s=c[c.length-1];!e||s&&e.text===s.text||n(4,c=[...c,e]),c.length>10&&n(4,c=c.slice(c.length-10))}function g(){"play"===r&&(n(1,o=l.getSubs(1e3*i.currentTime-a)),f(o),requestAnimationFrame(g))}d=()=>{document.addEventListener("visibilitychange",()=>{document.hidden||s.removePauser("define")});let t="";setInterval(()=>{const e=document.querySelector("video").getAttribute("src");e&&e!==t&&(t=e,p())},50)},A().$$.on_mount.push(d);return[r,o,l,a,c,u,"",p,function(t){i=document.querySelector("video"),s.setVideo(i),n(3,a=t.detail),n(4,c=[]),n(0,r="play"),g()},function(t){n(2,l=t.detail),0===l.subs.length?(console.log("subtitles object failed to parse: ",l),alert(`No subtitles were parsed from the selected .${l.format} file, verify nothing is wrong with the file. If it appears normal please submit a bug report with the episode and the subtitles file you used to the issue tracker!`)):n(0,r="align")},function(t){t.detail?s.addPauser("tray"):s.removePauser("tray")},function(){s.addPauser("define")},i,"last-used-alignment",s,f,g,()=>n(0,r="align"),t=>n(5,u=t.detail)]}var se=class extends gt{constructor(t){var e;super(),Kt.getElementById("svelte-qdgese-style")||((e=v("style")).id="svelte-qdgese-style",e.textContent=".subtitles-app.svelte-qdgese{position:relative}.subtitles-app.svelte-qdgese>*{z-index:1000000000}.subtitles-app.svelte-qdgese button{background:#fd0;border:none;cursor:pointer;padding:10px;line-height:1;font-weight:bold;color:black;text-transform:uppercase}.subtitles-app.svelte-qdgese button:disabled{background:#2a3450}.subtitles-app.svelte-qdgese button:not(:disabled):hover{background:#ffea6d}",m(Kt.head,e)),ft(this,t,ne,ee,c,{})}};const re=document.createElement("div");document.body.appendChild(re),re.id="sheodox-vrv-subtitler",re.style.height="100%",re.style.width="100%";new se({target:re})}]);
