/*! Meemoo Iframework http://meemoo.org/ - v0.3.5 - 2019-11-11 (5:42:38 PM PST)
* Copyright (c) 2019 Forrest Oliphant; Licensed MIT, AGPL */
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i},w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var I=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=I(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&I(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return I(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n}),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return n===void 0},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};M.unescape=w.invert(M.escape);var S={escape:RegExp("["+w.keys(M.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(M.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(S[n],function(t){return M[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,w);var c=function(n){return e.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
(function(){var t=this;var e=t.Backbone;var i=[];var r=i.push;var s=i.slice;var n=i.splice;var a;if(typeof exports!=="undefined"){a=exports}else{a=t.Backbone={}}a.VERSION="1.0.0";var h=t._;if(!h&&typeof require!=="undefined")h=require("underscore");a.$=t.jQuery||t.Zepto||t.ender||t.$;a.noConflict=function(){t.Backbone=e;return this};a.emulateHTTP=false;a.emulateJSON=false;var o=a.Events={on:function(t,e,i){if(!l(this,"on",t,[e,i])||!e)return this;this._events||(this._events={});var r=this._events[t]||(this._events[t]=[]);r.push({callback:e,context:i,ctx:i||this});return this},once:function(t,e,i){if(!l(this,"once",t,[e,i])||!e)return this;var r=this;var s=h.once(function(){r.off(t,s);e.apply(this,arguments)});s._callback=e;return this.on(t,s,i)},off:function(t,e,i){var r,s,n,a,o,u,c,f;if(!this._events||!l(this,"off",t,[e,i]))return this;if(!t&&!e&&!i){this._events={};return this}a=t?[t]:h.keys(this._events);for(o=0,u=a.length;o<u;o++){t=a[o];if(n=this._events[t]){this._events[t]=r=[];if(e||i){for(c=0,f=n.length;c<f;c++){s=n[c];if(e&&e!==s.callback&&e!==s.callback._callback||i&&i!==s.context){r.push(s)}}}if(!r.length)delete this._events[t]}}return this},trigger:function(t){if(!this._events)return this;var e=s.call(arguments,1);if(!l(this,"trigger",t,e))return this;var i=this._events[t];var r=this._events.all;if(i)c(i,e);if(r)c(r,arguments);return this},stopListening:function(t,e,i){var r=this._listeners;if(!r)return this;var s=!e&&!i;if(typeof e==="object")i=this;if(t)(r={})[t._listenerId]=t;for(var n in r){r[n].off(e,i,this);if(s)delete this._listeners[n]}return this}};var u=/\s+/;var l=function(t,e,i,r){if(!i)return true;if(typeof i==="object"){for(var s in i){t[e].apply(t,[s,i[s]].concat(r))}return false}if(u.test(i)){var n=i.split(u);for(var a=0,h=n.length;a<h;a++){t[e].apply(t,[n[a]].concat(r))}return false}return true};var c=function(t,e){var i,r=-1,s=t.length,n=e[0],a=e[1],h=e[2];switch(e.length){case 0:while(++r<s)(i=t[r]).callback.call(i.ctx);return;case 1:while(++r<s)(i=t[r]).callback.call(i.ctx,n);return;case 2:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a);return;case 3:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a,h);return;default:while(++r<s)(i=t[r]).callback.apply(i.ctx,e)}};var f={listenTo:"on",listenToOnce:"once"};h.each(f,function(t,e){o[e]=function(e,i,r){var s=this._listeners||(this._listeners={});var n=e._listenerId||(e._listenerId=h.uniqueId("l"));s[n]=e;if(typeof i==="object")r=this;e[t](i,r,this);return this}});o.bind=o.on;o.unbind=o.off;h.extend(a,o);var d=a.Model=function(t,e){var i;var r=t||{};e||(e={});this.cid=h.uniqueId("c");this.attributes={};h.extend(this,h.pick(e,p));if(e.parse)r=this.parse(r,e)||{};if(i=h.result(this,"defaults")){r=h.defaults({},r,i)}this.set(r,e);this.changed={};this.initialize.apply(this,arguments)};var p=["url","urlRoot","collection"];h.extend(d.prototype,o,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(t){return h.clone(this.attributes)},sync:function(){return a.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return h.escape(this.get(t))},has:function(t){return this.get(t)!=null},set:function(t,e,i){var r,s,n,a,o,u,l,c;if(t==null)return this;if(typeof t==="object"){s=t;i=e}else{(s={})[t]=e}i||(i={});if(!this._validate(s,i))return false;n=i.unset;o=i.silent;a=[];u=this._changing;this._changing=true;if(!u){this._previousAttributes=h.clone(this.attributes);this.changed={}}c=this.attributes,l=this._previousAttributes;if(this.idAttribute in s)this.id=s[this.idAttribute];for(r in s){e=s[r];if(!h.isEqual(c[r],e))a.push(r);if(!h.isEqual(l[r],e)){this.changed[r]=e}else{delete this.changed[r]}n?delete c[r]:c[r]=e}if(!o){if(a.length)this._pending=true;for(var f=0,d=a.length;f<d;f++){this.trigger("change:"+a[f],this,c[a[f]],i)}}if(u)return this;if(!o){while(this._pending){this._pending=false;this.trigger("change",this,i)}}this._pending=false;this._changing=false;return this},unset:function(t,e){return this.set(t,void 0,h.extend({},e,{unset:true}))},clear:function(t){var e={};for(var i in this.attributes)e[i]=void 0;return this.set(e,h.extend({},t,{unset:true}))},hasChanged:function(t){if(t==null)return!h.isEmpty(this.changed);return h.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?h.clone(this.changed):false;var e,i=false;var r=this._changing?this._previousAttributes:this.attributes;for(var s in t){if(h.isEqual(r[s],e=t[s]))continue;(i||(i={}))[s]=e}return i},previous:function(t){if(t==null||!this._previousAttributes)return null;return this._previousAttributes[t]},previousAttributes:function(){return h.clone(this._previousAttributes)},fetch:function(t){t=t?h.clone(t):{};if(t.parse===void 0)t.parse=true;var e=this;var i=t.success;t.success=function(r){if(!e.set(e.parse(r,t),t))return false;if(i)i(e,r,t);e.trigger("sync",e,r,t)};R(this,t);return this.sync("read",this,t)},save:function(t,e,i){var r,s,n,a=this.attributes;if(t==null||typeof t==="object"){r=t;i=e}else{(r={})[t]=e}if(r&&(!i||!i.wait)&&!this.set(r,i))return false;i=h.extend({validate:true},i);if(!this._validate(r,i))return false;if(r&&i.wait){this.attributes=h.extend({},a,r)}if(i.parse===void 0)i.parse=true;var o=this;var u=i.success;i.success=function(t){o.attributes=a;var e=o.parse(t,i);if(i.wait)e=h.extend(r||{},e);if(h.isObject(e)&&!o.set(e,i)){return false}if(u)u(o,t,i);o.trigger("sync",o,t,i)};R(this,i);s=this.isNew()?"create":i.patch?"patch":"update";if(s==="patch")i.attrs=r;n=this.sync(s,this,i);if(r&&i.wait)this.attributes=a;return n},destroy:function(t){t=t?h.clone(t):{};var e=this;var i=t.success;var r=function(){e.trigger("destroy",e,e.collection,t)};t.success=function(s){if(t.wait||e.isNew())r();if(i)i(e,s,t);if(!e.isNew())e.trigger("sync",e,s,t)};if(this.isNew()){t.success();return false}R(this,t);var s=this.sync("delete",this,t);if(!t.wait)r();return s},url:function(){var t=h.result(this,"urlRoot")||h.result(this.collection,"url")||U();if(this.isNew())return t;return t+(t.charAt(t.length-1)==="/"?"":"/")+encodeURIComponent(this.id)},parse:function(t,e){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return this.id==null},isValid:function(t){return this._validate({},h.extend(t||{},{validate:true}))},_validate:function(t,e){if(!e.validate||!this.validate)return true;t=h.extend({},this.attributes,t);var i=this.validationError=this.validate(t,e)||null;if(!i)return true;this.trigger("invalid",this,i,h.extend(e||{},{validationError:i}));return false}});var v=["keys","values","pairs","invert","pick","omit"];h.each(v,function(t){d.prototype[t]=function(){var e=s.call(arguments);e.unshift(this.attributes);return h[t].apply(h,e)}});var g=a.Collection=function(t,e){e||(e={});if(e.url)this.url=e.url;if(e.model)this.model=e.model;if(e.comparator!==void 0)this.comparator=e.comparator;this._reset();this.initialize.apply(this,arguments);if(t)this.reset(t,h.extend({silent:true},e))};var m={add:true,remove:true,merge:true};var y={add:true,merge:false,remove:false};h.extend(g.prototype,o,{model:d,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return a.sync.apply(this,arguments)},add:function(t,e){return this.set(t,h.defaults(e||{},y))},remove:function(t,e){t=h.isArray(t)?t.slice():[t];e||(e={});var i,r,s,n;for(i=0,r=t.length;i<r;i++){n=this.get(t[i]);if(!n)continue;delete this._byId[n.id];delete this._byId[n.cid];s=this.indexOf(n);this.models.splice(s,1);this.length--;if(!e.silent){e.index=s;n.trigger("remove",n,this,e)}this._removeReference(n)}return this},set:function(t,e){e=h.defaults(e||{},m);if(e.parse)t=this.parse(t,e);if(!h.isArray(t))t=t?[t]:[];var i,s,a,o,u,l;var c=e.at;var f=this.comparator&&c==null&&e.sort!==false;var d=h.isString(this.comparator)?this.comparator:null;var p=[],v=[],g={};for(i=0,s=t.length;i<s;i++){if(!(a=this._prepareModel(t[i],e)))continue;if(u=this.get(a)){if(e.remove)g[u.cid]=true;if(e.merge){u.set(a.attributes,e);if(f&&!l&&u.hasChanged(d))l=true}}else if(e.add){p.push(a);a.on("all",this._onModelEvent,this);this._byId[a.cid]=a;if(a.id!=null)this._byId[a.id]=a}}if(e.remove){for(i=0,s=this.length;i<s;++i){if(!g[(a=this.models[i]).cid])v.push(a)}if(v.length)this.remove(v,e)}if(p.length){if(f)l=true;this.length+=p.length;if(c!=null){n.apply(this.models,[c,0].concat(p))}else{r.apply(this.models,p)}}if(l)this.sort({silent:true});if(e.silent)return this;for(i=0,s=p.length;i<s;i++){(a=p[i]).trigger("add",a,this,e)}if(l)this.trigger("sort",this,e);return this},reset:function(t,e){e||(e={});for(var i=0,r=this.models.length;i<r;i++){this._removeReference(this.models[i])}e.previousModels=this.models;this._reset();this.add(t,h.extend({silent:true},e));if(!e.silent)this.trigger("reset",this,e);return this},push:function(t,e){t=this._prepareModel(t,e);this.add(t,h.extend({at:this.length},e));return t},pop:function(t){var e=this.at(this.length-1);this.remove(e,t);return e},unshift:function(t,e){t=this._prepareModel(t,e);this.add(t,h.extend({at:0},e));return t},shift:function(t){var e=this.at(0);this.remove(e,t);return e},slice:function(t,e){return this.models.slice(t,e)},get:function(t){if(t==null)return void 0;return this._byId[t.id!=null?t.id:t.cid||t]},at:function(t){return this.models[t]},where:function(t,e){if(h.isEmpty(t))return e?void 0:[];return this[e?"find":"filter"](function(e){for(var i in t){if(t[i]!==e.get(i))return false}return true})},findWhere:function(t){return this.where(t,true)},sort:function(t){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");t||(t={});if(h.isString(this.comparator)||this.comparator.length===1){this.models=this.sortBy(this.comparator,this)}else{this.models.sort(h.bind(this.comparator,this))}if(!t.silent)this.trigger("sort",this,t);return this},sortedIndex:function(t,e,i){e||(e=this.comparator);var r=h.isFunction(e)?e:function(t){return t.get(e)};return h.sortedIndex(this.models,t,r,i)},pluck:function(t){return h.invoke(this.models,"get",t)},fetch:function(t){t=t?h.clone(t):{};if(t.parse===void 0)t.parse=true;var e=t.success;var i=this;t.success=function(r){var s=t.reset?"reset":"set";i[s](r,t);if(e)e(i,r,t);i.trigger("sync",i,r,t)};R(this,t);return this.sync("read",this,t)},create:function(t,e){e=e?h.clone(e):{};if(!(t=this._prepareModel(t,e)))return false;if(!e.wait)this.add(t,e);var i=this;var r=e.success;e.success=function(s){if(e.wait)i.add(t,e);if(r)r(t,s,e)};t.save(null,e);return t},parse:function(t,e){return t},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0;this.models=[];this._byId={}},_prepareModel:function(t,e){if(t instanceof d){if(!t.collection)t.collection=this;return t}e||(e={});e.collection=this;var i=new this.model(t,e);if(!i._validate(t,e)){this.trigger("invalid",this,t,e);return false}return i},_removeReference:function(t){if(this===t.collection)delete t.collection;t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,r){if((t==="add"||t==="remove")&&i!==this)return;if(t==="destroy")this.remove(e,r);if(e&&t==="change:"+e.idAttribute){delete this._byId[e.previous(e.idAttribute)];if(e.id!=null)this._byId[e.id]=e}this.trigger.apply(this,arguments)}});var _=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","indexOf","shuffle","lastIndexOf","isEmpty","chain"];h.each(_,function(t){g.prototype[t]=function(){var e=s.call(arguments);e.unshift(this.models);return h[t].apply(h,e)}});var w=["groupBy","countBy","sortBy"];h.each(w,function(t){g.prototype[t]=function(e,i){var r=h.isFunction(e)?e:function(t){return t.get(e)};return h[t](this.models,r,i)}});var b=a.View=function(t){this.cid=h.uniqueId("view");this._configure(t||{});this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()};var x=/^(\S+)\s*(.*)$/;var E=["model","collection","el","id","attributes","className","tagName","events"];h.extend(b.prototype,o,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();this.stopListening();return this},setElement:function(t,e){if(this.$el)this.undelegateEvents();this.$el=t instanceof a.$?t:a.$(t);this.el=this.$el[0];if(e!==false)this.delegateEvents();return this},delegateEvents:function(t){if(!(t||(t=h.result(this,"events"))))return this;this.undelegateEvents();for(var e in t){var i=t[e];if(!h.isFunction(i))i=this[t[e]];if(!i)continue;var r=e.match(x);var s=r[1],n=r[2];i=h.bind(i,this);s+=".delegateEvents"+this.cid;if(n===""){this.$el.on(s,i)}else{this.$el.on(s,n,i)}}return this},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid);return this},_configure:function(t){if(this.options)t=h.extend({},h.result(this,"options"),t);h.extend(this,h.pick(t,E));this.options=t},_ensureElement:function(){if(!this.el){var t=h.extend({},h.result(this,"attributes"));if(this.id)t.id=h.result(this,"id");if(this.className)t["class"]=h.result(this,"className");var e=a.$("<"+h.result(this,"tagName")+">").attr(t);this.setElement(e,false)}else{this.setElement(h.result(this,"el"),false)}}});a.sync=function(t,e,i){var r=k[t];h.defaults(i||(i={}),{emulateHTTP:a.emulateHTTP,emulateJSON:a.emulateJSON});var s={type:r,dataType:"json"};if(!i.url){s.url=h.result(e,"url")||U()}if(i.data==null&&e&&(t==="create"||t==="update"||t==="patch")){s.contentType="application/json";s.data=JSON.stringify(i.attrs||e.toJSON(i))}if(i.emulateJSON){s.contentType="application/x-www-form-urlencoded";s.data=s.data?{model:s.data}:{}}if(i.emulateHTTP&&(r==="PUT"||r==="DELETE"||r==="PATCH")){s.type="POST";if(i.emulateJSON)s.data._method=r;var n=i.beforeSend;i.beforeSend=function(t){t.setRequestHeader("X-HTTP-Method-Override",r);if(n)return n.apply(this,arguments)}}if(s.type!=="GET"&&!i.emulateJSON){s.processData=false}if(s.type==="PATCH"&&window.ActiveXObject&&!(window.external&&window.external.msActiveXFilteringEnabled)){s.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")}}var o=i.xhr=a.ajax(h.extend(s,i));e.trigger("request",e,o,i);return o};var k={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};a.ajax=function(){return a.$.ajax.apply(a.$,arguments)};var S=a.Router=function(t){t||(t={});if(t.routes)this.routes=t.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var $=/\((.*?)\)/g;var T=/(\(\?)?:\w+/g;var H=/\*\w+/g;var A=/[\-{}\[\]+?.,\\\^$|#\s]/g;h.extend(S.prototype,o,{initialize:function(){},route:function(t,e,i){if(!h.isRegExp(t))t=this._routeToRegExp(t);if(h.isFunction(e)){i=e;e=""}if(!i)i=this[e];var r=this;a.history.route(t,function(s){var n=r._extractParameters(t,s);i&&i.apply(r,n);r.trigger.apply(r,["route:"+e].concat(n));r.trigger("route",e,n);a.history.trigger("route",r,e,n)});return this},navigate:function(t,e){a.history.navigate(t,e);return this},_bindRoutes:function(){if(!this.routes)return;this.routes=h.result(this,"routes");var t,e=h.keys(this.routes);while((t=e.pop())!=null){this.route(t,this.routes[t])}},_routeToRegExp:function(t){t=t.replace(A,"\\$&").replace($,"(?:$1)?").replace(T,function(t,e){return e?t:"([^/]+)"}).replace(H,"(.*?)");return new RegExp("^"+t+"$")},_extractParameters:function(t,e){var i=t.exec(e).slice(1);return h.map(i,function(t){return t?decodeURIComponent(t):null})}});var I=a.History=function(){this.handlers=[];h.bindAll(this,"checkUrl");if(typeof window!=="undefined"){this.location=window.location;this.history=window.history}};var N=/^[#\/]|\s+$/g;var P=/^\/+|\/+$/g;var O=/msie [\w.]+/;var C=/\/$/;I.started=false;h.extend(I.prototype,o,{interval:50,getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getFragment:function(t,e){if(t==null){if(this._hasPushState||!this._wantsHashChange||e){t=this.location.pathname;var i=this.root.replace(C,"");if(!t.indexOf(i))t=t.substr(i.length)}else{t=this.getHash()}}return t.replace(N,"")},start:function(t){if(I.started)throw new Error("Backbone.history has already been started");I.started=true;this.options=h.extend({},{root:"/"},this.options,t);this.root=this.options.root;this._wantsHashChange=this.options.hashChange!==false;this._wantsPushState=!!this.options.pushState;this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var e=this.getFragment();var i=document.documentMode;var r=O.exec(navigator.userAgent.toLowerCase())&&(!i||i<=7);this.root=("/"+this.root+"/").replace(P,"/");if(r&&this._wantsHashChange){this.iframe=a.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow;this.navigate(e)}if(this._hasPushState){a.$(window).on("popstate",this.checkUrl)}else if(this._wantsHashChange&&"onhashchange"in window&&!r){a.$(window).on("hashchange",this.checkUrl)}else if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)}this.fragment=e;var s=this.location;var n=s.pathname.replace(/[^\/]$/,"$&/")===this.root;if(this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!n){this.fragment=this.getFragment(null,true);this.location.replace(this.root+this.location.search+"#"+this.fragment);return true}else if(this._wantsPushState&&this._hasPushState&&n&&s.hash){this.fragment=this.getHash().replace(N,"");this.history.replaceState({},document.title,this.root+this.fragment+s.search)}if(!this.options.silent)return this.loadUrl()},stop:function(){a.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl);clearInterval(this._checkUrlInterval);I.started=false},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(t){var e=this.getFragment();if(e===this.fragment&&this.iframe){e=this.getFragment(this.getHash(this.iframe))}if(e===this.fragment)return false;if(this.iframe)this.navigate(e);this.loadUrl()||this.loadUrl(this.getHash())},loadUrl:function(t){var e=this.fragment=this.getFragment(t);var i=h.any(this.handlers,function(t){if(t.route.test(e)){t.callback(e);return true}});return i},navigate:function(t,e){if(!I.started)return false;if(!e||e===true)e={trigger:e};t=this.getFragment(t||"");if(this.fragment===t)return;this.fragment=t;var i=this.root+t;if(this._hasPushState){this.history[e.replace?"replaceState":"pushState"]({},document.title,i)}else if(this._wantsHashChange){this._updateHash(this.location,t,e.replace);if(this.iframe&&t!==this.getFragment(this.getHash(this.iframe))){if(!e.replace)this.iframe.document.open().close();this._updateHash(this.iframe.location,t,e.replace)}}else{return this.location.assign(i)}if(e.trigger)this.loadUrl(t)},_updateHash:function(t,e,i){if(i){var r=t.href.replace(/(javascript:|#).*$/,"");t.replace(r+"#"+e)}else{t.hash="#"+e}}});a.history=new I;var j=function(t,e){var i=this;var r;if(t&&h.has(t,"constructor")){r=t.constructor}else{r=function(){return i.apply(this,arguments)}}h.extend(r,i,e);var s=function(){this.constructor=r};s.prototype=i.prototype;r.prototype=new s;if(t)h.extend(r.prototype,t);r.__super__=i.prototype;return r};d.extend=g.extend=S.extend=b.extend=I.extend=j;var U=function(){throw new Error('A "url" property or function must be specified')};var R=function(t,e){var i=e.error;e.error=function(r){if(i)i(t,r,e);t.trigger("error",t,r,e)}}}).call(this);
/*
//@ sourceMappingURL=backbone-min.map
*/
(function() {
// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Hold reference to Underscore.js and Backbone.js in the closure in order
// to make things work even if they are removed from the global namespace
var _ = this._;
var Backbone = this.Backbone;

// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
// window.Store is deprectated, use Backbone.LocalStorage instead
Backbone.LocalStorage = window.Store = function(name) {
  this.name = name;
  var store = this.localStorage().getItem(this.name);
  this.records = (store && store.split(",")) || [];
};

_.extend(Backbone.LocalStorage.prototype, {

  // Save the current state of the **Store** to *localStorage*.
  save: function() {
    this.localStorage().setItem(this.name, this.records.join(","));
  },

  // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
  // have an id of it's own.
  create: function(model) {
    if (!model.id) {
        model.id = guid();
        model.set(model.idAttribute, model.id);
    }
    this.localStorage().setItem(this.name+"-"+model.id, JSON.stringify(model));
    this.records.push(model.id.toString());
    this.save();
    return model;
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
    this.localStorage().setItem(this.name+"-"+model.id, JSON.stringify(model));
    if (!_.include(this.records, model.id.toString())) this.records.push(model.id.toString()); this.save();
    return model;
  },

  // Retrieve a model from `this.data` by id.
  find: function(model) {
    return JSON.parse(this.localStorage().getItem(this.name+"-"+model.id));
  },

  // Return the array of all models currently in storage.
  findAll: function() {
    return _(this.records).chain()
        .map(function(id){return JSON.parse(this.localStorage().getItem(this.name+"-"+id));}, this)
        .compact()
        .value();
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model) {
    this.localStorage().removeItem(this.name+"-"+model.id);
    this.records = _.reject(this.records, function(record_id){return record_id == model.id.toString();});
    this.save();
    return model;
  },

  localStorage: function() {
      return localStorage;
  }

});

// localSync delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
// window.Store.sync and Backbone.localSync is deprectated, use Backbone.LocalStorage.sync instead
Backbone.LocalStorage.sync = window.Store.sync = Backbone.localSync = function(method, model, options, error) {
  var store = model.localStorage || model.collection.localStorage;

  // Backwards compatibility with Backbone <= 0.3.3
  if (typeof options == 'function') {
    options = {
      success: options,
      error: error
    };
  }

  var resp;

  switch (method) {
    case "read":    resp = model.id != undefined ? store.find(model) : store.findAll(); break;
    case "create":  resp = store.create(model);                            break;
    case "update":  resp = store.update(model);                            break;
    case "delete":  resp = store.destroy(model);                           break;
  }

  if (resp) {
    options.success(resp);
  } else {
    options.error("Record not found");
  }
};

Backbone.ajaxSync = Backbone.sync;

Backbone.getSyncMethod = function(model) {
	if(model.localStorage || (model.collection && model.collection.localStorage))
	{
		return Backbone.localSync;
	}

	return Backbone.ajaxSync;
};

// Override 'Backbone.sync' to default to localSync,
// the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
Backbone.sync = function(method, model, options, error) {
	return Backbone.getSyncMethod(model).apply(this, [method, model, options, error]);
};

})();

(function() {

    /**
     * mapping of special keycodes to their corresponding keys
     *
     * everything in this dictionary cannot use keypress events
     * so it has to be here to map to the correct keycodes for
     * keyup/keydown events
     *
     * @type {Object}
     */
    var _MAP = {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            20: 'capslock',
            27: 'esc',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            45: 'ins',
            46: 'del',
            91: 'meta',
            93: 'meta',
            224: 'meta'
        },

        /**
         * mapping for special characters so they can support
         *
         * this dictionary is only used incase you want to bind a
         * keyup or keydown event to one of these keys
         *
         * @type {Object}
         */
        _KEYCODE_MAP = {
            106: '*',
            107: '+',
            109: '-',
            110: '.',
            111 : '/',
            186: ';',
            187: '=',
            188: ',',
            189: '-',
            190: '.',
            191: '/',
            192: '`',
            219: '[',
            220: '\\',
            221: ']',
            222: '\''
        },

        /**
         * this is a mapping of keys that require shift on a US keypad
         * back to the non shift equivelents
         *
         * this is so you can use keyup events with these keys
         *
         * note that this will only work reliably on US keyboards
         *
         * @type {Object}
         */
        _SHIFT_MAP = {
            '~': '`',
            '!': '1',
            '@': '2',
            '#': '3',
            '$': '4',
            '%': '5',
            '^': '6',
            '&': '7',
            '*': '8',
            '(': '9',
            ')': '0',
            '_': '-',
            '+': '=',
            ':': ';',
            '\"': '\'',
            '<': ',',
            '>': '.',
            '?': '/',
            '|': '\\'
        },

        /**
         * this is a list of special strings you can use to map
         * to modifier keys when you specify your keyboard shortcuts
         *
         * @type {Object}
         */
        _SPECIAL_ALIASES = {
            'option': 'alt',
            'command': 'meta',
            'return': 'enter',
            'escape': 'esc'
        },

        /**
         * variable to store the flipped version of _MAP from above
         * needed to check if we should use keypress or not when no action
         * is specified
         *
         * @type {Object|undefined}
         */
        _REVERSE_MAP,

        /**
         * a list of all the callbacks setup via Mousetrap.bind()
         *
         * @type {Object}
         */
        _callbacks = {},

        /**
         * direct map of string combinations to callbacks used for trigger()
         *
         * @type {Object}
         */
        _direct_map = {},

        /**
         * keeps track of what level each sequence is at since multiple
         * sequences can start out with the same sequence
         *
         * @type {Object}
         */
        _sequence_levels = {},

        /**
         * variable to store the setTimeout call
         *
         * @type {null|number}
         */
        _reset_timer,

        /**
         * temporary state where we will ignore the next keyup
         *
         * @type {boolean|string}
         */
        _ignore_next_keyup = false,

        /**
         * are we currently inside of a sequence?
         * type of action ("keyup" or "keydown" or "keypress") or false
         *
         * @type {boolean|string}
         */
        _inside_sequence = false;

    /**
     * loop through the f keys, f1 to f19 and add them to the map
     * programatically
     */
    for (var i = 1; i < 20; ++i) {
        _MAP[111 + i] = 'f' + i;
    }

    /**
     * loop through to map numbers on the numeric keypad
     */
    for (i = 0; i <= 9; ++i) {
        _MAP[i + 96] = i;
    }

    /**
     * cross browser add event method
     *
     * @param {Element|HTMLDocument} object
     * @param {string} type
     * @param {Function} callback
     * @returns void
     */
    function _addEvent(object, type, callback) {
        if (object.addEventListener) {
            return object.addEventListener(type, callback, false);
        }

        object.attachEvent('on' + type, callback);
    }

    /**
     * takes the event and returns the key character
     *
     * @param {Event} e
     * @return {string}
     */
    function _characterFromEvent(e) {

        // for keypress events we should return the character as is
        if (e.type == 'keypress') {
            return String.fromCharCode(e.which);
        }

        // for non keypress events the special maps are needed
        if (_MAP[e.which]) {
            return _MAP[e.which];
        }

        if (_KEYCODE_MAP[e.which]) {
            return _KEYCODE_MAP[e.which];
        }

        // if it is not in the special map
        return String.fromCharCode(e.which).toLowerCase();
    }

    /**
     * should we stop this event before firing off callbacks
     *
     * @param {Event} e
     * @return {boolean}
     */
    function _stop(e) {
        var element = e.target || e.srcElement,
            tag_name = element.tagName;

        // if the element has the class "mousetrap" then no need to stop
        if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
            return false;
        }

        // stop for input, select, and textarea
        return tag_name == 'INPUT' || tag_name == 'SELECT' || tag_name == 'TEXTAREA' || (element.contentEditable && element.contentEditable == 'true');
    }

    /**
     * checks if two arrays are equal
     *
     * @param {Array} modifiers1
     * @param {Array} modifiers2
     * @returns {boolean}
     */
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }

    /**
     * resets all sequence counters except for the ones passed in
     *
     * @param {Object} do_not_reset
     * @returns void
     */
    function _resetSequences(do_not_reset) {
        do_not_reset = do_not_reset || {};

        var active_sequences = false,
            key;

        for (key in _sequence_levels) {
            if (do_not_reset[key]) {
                active_sequences = true;
                continue;
            }
            _sequence_levels[key] = 0;
        }

        if (!active_sequences) {
            _inside_sequence = false;
        }
    }

    /**
     * finds all callbacks that match based on the keycode, modifiers,
     * and action
     *
     * @param {string} character
     * @param {Array} modifiers
     * @param {Event|Object} e
     * @param {boolean=} remove - should we remove any matches
     * @param {string=} combination
     * @returns {Array}
     */
    function _getMatches(character, modifiers, e, remove, combination) {
        var i,
            callback,
            matches = [],
            action = e.type;

        // if there are no events related to this keycode
        if (!_callbacks[character]) {
            return [];
        }

        // if a modifier key is coming up on its own we should allow it
        if (action == 'keyup' && _isModifier(character)) {
            modifiers = [character];
        }

        // loop through all callbacks for the key that was pressed
        // and see if any of them match
        for (i = 0; i < _callbacks[character].length; ++i) {
            callback = _callbacks[character][i];

            // if this is a sequence but it is not at the right level
            // then move onto the next match
            if (callback.seq && _sequence_levels[callback.seq] != callback.level) {
                continue;
            }

            // if the action we are looking for doesn't match the action we got
            // then we should keep going
            if (action != callback.action) {
                continue;
            }

            // if this is a keypress event and the meta key and control key
            // are not pressed that means that we need to only look at the
            // character, otherwise check the modifiers as well
            //
            // chrome will not fire a keypress if meta or control is down
            // safari will fire a keypress if meta or meta+shift is down
            // firefox will fire a keypress if meta or control is down
            if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {

                // remove is used so if you change your mind and call bind a
                // second time with a new function the first one is overwritten
                if (remove && callback.combo == combination) {
                    _callbacks[character].splice(i, 1);
                }

                matches.push(callback);
            }
        }

        return matches;
    }

    /**
     * takes a key event and figures out what the modifiers are
     *
     * @param {Event} e
     * @returns {Array}
     */
    function _eventModifiers(e) {
        var modifiers = [];

        if (e.shiftKey) {
            modifiers.push('shift');
        }

        if (e.altKey) {
            modifiers.push('alt');
        }

        if (e.ctrlKey) {
            modifiers.push('ctrl');
        }

        if (e.metaKey) {
            modifiers.push('meta');
        }

        return modifiers;
    }

    /**
     * actually calls the callback function
     *
     * if your callback function returns false this will use the jquery
     * convention - prevent default and stop propogation on the event
     *
     * @param {Function} callback
     * @param {Event} e
     * @returns void
     */
    function _fireCallback(callback, e) {
        if (callback(e) === false) {
            if (e.preventDefault) {
                e.preventDefault();
            }

            if (e.stopPropagation) {
                e.stopPropagation();
            }

            e.returnValue = false;
            e.cancelBubble = true;
        }
    }

    /**
     * handles a character key event
     *
     * @param {string} character
     * @param {Event} e
     * @returns void
     */
    function _handleCharacter(character, e) {

        // if this event should not happen stop here
        if (_stop(e)) {
            return;
        }

        var callbacks = _getMatches(character, _eventModifiers(e), e),
            i,
            do_not_reset = {},
            processed_sequence_callback = false;

        // loop through matching callbacks for this key event
        for (i = 0; i < callbacks.length; ++i) {

            // fire for all sequence callbacks
            // this is because if for example you have multiple sequences
            // bound such as "g i" and "g t" they both need to fire the
            // callback for matching g cause otherwise you can only ever
            // match the first one
            if (callbacks[i].seq) {
                processed_sequence_callback = true;

                // keep a list of which sequences were matches for later
                do_not_reset[callbacks[i].seq] = 1;
                _fireCallback(callbacks[i].callback, e);
                continue;
            }

            // if there were no sequence matches but we are still here
            // that means this is a regular match so we should fire that
            if (!processed_sequence_callback && !_inside_sequence) {
                _fireCallback(callbacks[i].callback, e);
            }
        }

        // if you are inside of a sequence and the key you are pressing
        // is not a modifier key then we should reset all sequences
        // that were not matched by this key event
        if (e.type == _inside_sequence && !_isModifier(character)) {
            _resetSequences(do_not_reset);
        }
    }

    /**
     * handles a keydown event
     *
     * @param {Event} e
     * @returns void
     */
    function _handleKey(e) {

        // normalize e.which for key events
        // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
        e.which = typeof e.which == "number" ? e.which : e.keyCode;

        var character = _characterFromEvent(e);

        // no character found then stop
        if (!character) {
            return;
        }

        if (e.type == 'keyup' && _ignore_next_keyup == character) {
            _ignore_next_keyup = false;
            return;
        }

        _handleCharacter(character, e);
    }

    /**
     * determines if the keycode specified is a modifier key or not
     *
     * @param {string} key
     * @returns {boolean}
     */
    function _isModifier(key) {
        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
    }

    /**
     * called to set a 1 second timeout on the specified sequence
     *
     * this is so after each key press in the sequence you have 1 second
     * to press the next key before you have to start over
     *
     * @returns void
     */
    function _resetSequenceTimer() {
        clearTimeout(_reset_timer);
        _reset_timer = setTimeout(_resetSequences, 1000);
    }

    /**
     * reverses the map lookup so that we can look for specific keys
     * to see what can and can't use keypress
     *
     * @return {Object}
     */
    function _getReverseMap() {
        if (!_REVERSE_MAP) {
            _REVERSE_MAP = {};
            for (var key in _MAP) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_MAP.hasOwnProperty(key)) {
                    _REVERSE_MAP[_MAP[key]] = key;
                }
            }
        }
        return _REVERSE_MAP;
    }

    /**
     * picks the best action based on the key combination
     *
     * @param {string} key - character for key
     * @param {Array} modifiers
     * @param {string=} action passed in
     */
    function _pickBestAction(key, modifiers, action) {

        // if no action was picked in we should try to pick the one
        // that we think would work best for this key
        if (!action) {
            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
        }

        // modifier keys don't work as expected with keypress,
        // switch to keydown
        if (action == 'keypress' && modifiers.length) {
            action = 'keydown';
        }

        return action;
    }

    /**
     * binds a key sequence to an event
     *
     * @param {string} combo - combo specified in bind call
     * @param {Array} keys
     * @param {Function} callback
     * @param {string=} action
     * @returns void
     */
    function _bindSequence(combo, keys, callback, action) {

        // start off by adding a sequence level record for this combination
        // and setting the level to 0
        _sequence_levels[combo] = 0;

        // if there is no action pick the best one for the first key
        // in the sequence
        if (!action) {
            action = _pickBestAction(keys[0], []);
        }

        /**
         * callback to increase the sequence level for this sequence and reset
         * all other sequences that were active
         *
         * @param {Event} e
         * @returns void
         */
        var _increaseSequence = function(e) {
                _inside_sequence = action;
                ++_sequence_levels[combo];
                _resetSequenceTimer();
            },

            /**
             * wraps the specified callback inside of another function in order
             * to reset all sequence counters as soon as this sequence is done
             *
             * @param {Event} e
             * @returns void
             */
            _callbackAndReset = function(e) {
                _fireCallback(callback, e);

                // we should ignore the next key up if the action is key down
                // or keypress.  this is so if you finish a sequence and
                // release the key the final key will not trigger a keyup
                if (action !== 'keyup') {
                    _ignore_next_keyup = _characterFromEvent(e);
                }

                // weird race condition if a sequence ends with the key
                // another sequence begins with
                setTimeout(_resetSequences, 10);
            },
            i;

        // loop through keys one at a time and bind the appropriate callback
        // function.  for any key leading up to the final one it should
        // increase the sequence. after the final, it should reset all sequences
        for (i = 0; i < keys.length; ++i) {
            _bindSingle(keys[i], i < keys.length - 1 ? _increaseSequence : _callbackAndReset, action, combo, i);
        }
    }

    /**
     * binds a single keyboard combination
     *
     * @param {string} combination
     * @param {Function} callback
     * @param {string=} action
     * @param {string=} sequence_name - name of sequence if part of sequence
     * @param {number=} level - what part of the sequence the command is
     * @returns void
     */
    function _bindSingle(combination, callback, action, sequence_name, level) {

        // make sure multiple spaces in a row become a single space
        combination = combination.replace(/\s+/g, ' ');

        var sequence = combination.split(' '),
            i,
            key,
            keys,
            modifiers = [];

        // if this pattern is a sequence of keys then run through this method
        // to reprocess each pattern one key at a time
        if (sequence.length > 1) {
            return _bindSequence(combination, sequence, callback, action);
        }

        // take the keys from this pattern and figure out what the actual
        // pattern is all about
        keys = combination === '+' ? ['+'] : combination.split('+');

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            // normalize key names
            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            // if this is not a keypress event then we should
            // be smart about using shift keys
            // this will only work for US keyboards however
            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
                key = _SHIFT_MAP[key];
                modifiers.push('shift');
            }

            // if this key is a modifier then add it to the list of modifiers
            if (_isModifier(key)) {
                modifiers.push(key);
            }
        }

        // depending on what the key combination is
        // we will try to pick the best event for it
        action = _pickBestAction(key, modifiers, action);

        // make sure to initialize array if this is the first time
        // a callback is added for this key
        if (!_callbacks[key]) {
            _callbacks[key] = [];
        }

        // remove an existing match if there is one
        _getMatches(key, modifiers, {type: action}, !sequence_name, combination);

        // add this call back to the array
        // if it is a sequence put it at the beginning
        // if not put it at the end
        //
        // this is important because the way these are processed expects
        // the sequence ones to come first
        _callbacks[key][sequence_name ? 'unshift' : 'push']({
            callback: callback,
            modifiers: modifiers,
            action: action,
            seq: sequence_name,
            level: level,
            combo: combination
        });
    }

    /**
     * binds multiple combinations to the same callback
     *
     * @param {Array} combinations
     * @param {Function} callback
     * @param {string|undefined} action
     * @returns void
     */
    function _bindMultiple(combinations, callback, action) {
        for (var i = 0; i < combinations.length; ++i) {
            _bindSingle(combinations[i], callback, action);
        }
    }

    // start!
    _addEvent(document, 'keypress', _handleKey);
    _addEvent(document, 'keydown', _handleKey);
    _addEvent(document, 'keyup', _handleKey);

    var mousetrap = {

        /**
         * binds an event to mousetrap
         *
         * can be a single key, a combination of keys separated with +,
         * an array of keys, or a sequence of keys separated by spaces
         *
         * be sure to list the modifier keys first to make sure that the
         * correct key ends up getting bound (the last key in the pattern)
         *
         * @param {string|Array} keys
         * @param {Function} callback
         * @param {string=} action - 'keypress', 'keydown', or 'keyup'
         * @returns void
         */
        bind: function(keys, callback, action) {
            _bindMultiple(keys instanceof Array ? keys : [keys], callback, action);
            _direct_map[keys + ':' + action] = callback;
            return this;
        },

        /**
         * unbinds an event to mousetrap
         *
         * the unbinding sets the callback function of the specified key combo
         * to an empty function and deletes the corresponding key in the
         * _direct_map dict.
         *
         * the keycombo+action has to be exactly the same as
         * it was defined in the bind method
         *
         * TODO: actually remove this from the _callbacks dictionary instead
         * of binding an empty function
         *
         * @param {string|Array} keys
         * @param {string} action
         * @returns void
         */
        unbind: function(keys, action) {
            if (_direct_map[keys + ':' + action]) {
                delete _direct_map[keys + ':' + action];
                this.bind(keys, function() {}, action);
            }
            return this;
        },

        /**
         * triggers an event that has already been bound
         *
         * @param {string} keys
         * @param {string=} action
         * @returns void
         */
        trigger: function(keys, action) {
            _direct_map[keys + ':' + action]();
            return this;
        },

        /**
         * resets the library back to its initial state.  this is useful
         * if you want to clear out the current keyboard shortcuts and bind
         * new ones - for example if you switch to another page
         *
         * @returns void
         */
        reset: function() {
            _callbacks = {};
            _direct_map = {};
            return this;
        }
    };

    // expose mousetrap to the global object
    window.Mousetrap = mousetrap;

    // expose mousetrap as an AMD module
    if (typeof define == 'function' && define.amd) {
        define('mousetrap', function() { return mousetrap; });
    }
}) ();

// Spectrum Colorpicker v1.1.0
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT

(function (window, $, undefined) {
    var defaultOpts = {

        // Callbacks
        beforeShow: noop,
        move: noop,
        change: noop,
        show: noop,
        hide: noop,

        // Options
        color: false,
        flat: false,
        showInput: false,
        showButtons: true,
        clickoutFiresChange: false,
        showInitial: false,
        showPalette: false,
        showPaletteOnly: false,
        showSelectionPalette: true,
        localStorageKey: false,
        appendTo: "body",
        maxSelectionSize: 7,
        cancelText: "cancel",
        chooseText: "choose",
        preferredFormat: false,
        className: "",
        showAlpha: false,
        theme: "sp-light",
        palette: ['fff', '000'],
        selectionPalette: [],
        disabled: false
    },
    spectrums = [],
    IE = !!/msie/i.exec( window.navigator.userAgent ),
    rgbaSupport = (function() {
        function contains( str, substr ) {
            return !!~('' + str).indexOf(substr);
        }

        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background-color:rgba(0,0,0,.5)';
        return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
    })(),
    replaceInput = [
        "<div class='sp-replacer'>",
            "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
            "<div class='sp-dd'>&#9660;</div>",
        "</div>"
    ].join(''),
    markup = (function () {

        // IE does not support gradients with multiple stops, so we need to simulate
        //  that for the rainbow slider with 8 divs that each have a single gradient
        var gradientFix = "";
        if (IE) {
            for (var i = 1; i <= 6; i++) {
                gradientFix += "<div class='sp-" + i + "'></div>";
            }
        }

        return [
            "<div class='sp-container sp-hidden'>",
                "<div class='sp-palette-container'>",
                    "<div class='sp-palette sp-thumb sp-cf'></div>",
                "</div>",
                "<div class='sp-picker-container'>",
                    "<div class='sp-top sp-cf'>",
                        "<div class='sp-fill'></div>",
                        "<div class='sp-top-inner'>",
                            "<div class='sp-color'>",
                                "<div class='sp-sat'>",
                                    "<div class='sp-val'>",
                                        "<div class='sp-dragger'></div>",
                                    "</div>",
                                "</div>",
                            "</div>",
                            "<div class='sp-hue'>",
                                "<div class='sp-slider'></div>",
                                gradientFix,
                            "</div>",
                        "</div>",
                        "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
                    "</div>",
                    "<div class='sp-input-container sp-cf'>",
                        "<input class='sp-input' type='text' spellcheck='false'  />",
                    "</div>",
                    "<div class='sp-initial sp-thumb sp-cf'></div>",
                    "<div class='sp-button-container sp-cf'>",
                        "<a class='sp-cancel' href='#'></a>",
                        "<button class='sp-choose'></button>",
                    "</div>",
                "</div>",
            "</div>"
        ].join("");
    })();

    function paletteTemplate (p, color, className) {
        var html = [];
        for (var i = 0; i < p.length; i++) {
            var tiny = tinycolor(p[i]);
            var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
            c += (tinycolor.equals(color, p[i])) ? " sp-thumb-active" : "";

            var swatchStyle = rgbaSupport ? ("background-color:" + tiny.toRgbString()) : "filter:" + tiny.toFilter();
            html.push('<span title="' + tiny.toRgbString() + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
        }
        return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
    }

    function hideAll() {
        for (var i = 0; i < spectrums.length; i++) {
            if (spectrums[i]) {
                spectrums[i].hide();
            }
        }
    }

    function instanceOptions(o, callbackContext) {
        var opts = $.extend({}, defaultOpts, o);
        opts.callbacks = {
            'move': bind(opts.move, callbackContext),
            'change': bind(opts.change, callbackContext),
            'show': bind(opts.show, callbackContext),
            'hide': bind(opts.hide, callbackContext),
            'beforeShow': bind(opts.beforeShow, callbackContext)
        };

        return opts;
    }

    function spectrum(element, o) {

        var opts = instanceOptions(o, element),
            flat = opts.flat,
            showSelectionPalette = opts.showSelectionPalette,
            localStorageKey = opts.localStorageKey,
            theme = opts.theme,
            callbacks = opts.callbacks,
            resize = throttle(reflow, 10),
            visible = false,
            dragWidth = 0,
            dragHeight = 0,
            dragHelperHeight = 0,
            slideHeight = 0,
            slideWidth = 0,
            alphaWidth = 0,
            alphaSlideHelperWidth = 0,
            slideHelperHeight = 0,
            currentHue = 0,
            currentSaturation = 0,
            currentValue = 0,
            currentAlpha = 1,
            palette = opts.palette.slice(0),
            paletteArray = $.isArray(palette[0]) ? palette : [palette],
            selectionPalette = opts.selectionPalette.slice(0),
            maxSelectionSize = opts.maxSelectionSize,
            draggingClass = "sp-dragging";

        var doc = element.ownerDocument,
            body = doc.body,
            boundElement = $(element),
            disabled = false,
            container = $(markup, doc).addClass(theme),
            dragger = container.find(".sp-color"),
            dragHelper = container.find(".sp-dragger"),
            slider = container.find(".sp-hue"),
            slideHelper = container.find(".sp-slider"),
            alphaSliderInner = container.find(".sp-alpha-inner"),
            alphaSlider = container.find(".sp-alpha"),
            alphaSlideHelper = container.find(".sp-alpha-handle"),
            textInput = container.find(".sp-input"),
            paletteContainer = container.find(".sp-palette"),
            initialColorContainer = container.find(".sp-initial"),
            cancelButton = container.find(".sp-cancel"),
            chooseButton = container.find(".sp-choose"),
            isInput = boundElement.is("input"),
            shouldReplace = isInput && !flat,
            replacer = (shouldReplace) ? $(replaceInput).addClass(theme).addClass(opts.className) : $([]),
            offsetElement = (shouldReplace) ? replacer : boundElement,
            previewElement = replacer.find(".sp-preview-inner"),
            initialColor = opts.color || (isInput && boundElement.val()),
            colorOnShow = false,
            preferredFormat = opts.preferredFormat,
            currentPreferredFormat = preferredFormat,
            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange;


        function applyOptions() {

            container.toggleClass("sp-flat", flat);
            container.toggleClass("sp-input-disabled", !opts.showInput);
            container.toggleClass("sp-alpha-enabled", opts.showAlpha);
            container.toggleClass("sp-buttons-disabled", !opts.showButtons || flat);
            container.toggleClass("sp-palette-disabled", !opts.showPalette);
            container.toggleClass("sp-palette-only", opts.showPaletteOnly);
            container.toggleClass("sp-initial-disabled", !opts.showInitial);
            container.addClass(opts.className);

            reflow();
        }

        function initialize() {

            if (IE) {
                container.find("*:not(input)").attr("unselectable", "on");
            }

            applyOptions();

            if (shouldReplace) {
                boundElement.after(replacer).hide();
            }

            if (flat) {
                boundElement.after(container).hide();
            }
            else {

                var appendTo = opts.appendTo === "parent" ? boundElement.parent() : $(opts.appendTo);
                if (appendTo.length !== 1) {
                    appendTo = $("body");
                }

                appendTo.append(container);
            }

            if (localStorageKey && window.localStorage) {

                // Migrate old palettes over to new format.  May want to remove this eventually.
                try {
                    var oldPalette = window.localStorage[localStorageKey].split(",#");
                    if (oldPalette.length > 1) {
                        delete window.localStorage[localStorageKey];
                        $.each(oldPalette, function(i, c) {
                             addColorToSelectionPalette(c);
                        });
                    }
                }
                catch(e) { }

                try {
                    selectionPalette = window.localStorage[localStorageKey].split(";");
                }
                catch (e) { }
            }

            offsetElement.bind("click.spectrum touchstart.spectrum", function (e) {
                if (!disabled) {
                    toggle();
                }

                e.stopPropagation();

                if (!$(e.target).is("input")) {
                    e.preventDefault();
                }
            });

            if(boundElement.is(":disabled") || (opts.disabled === true)) {
                disable();
            }

            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
            container.click(stopPropagation);

            // Handle user typed input
            textInput.change(setFromTextInput);
            textInput.bind("paste", function () {
                setTimeout(setFromTextInput, 1);
            });
            textInput.keydown(function (e) { if (e.keyCode == 13) { setFromTextInput(); } });

            cancelButton.text(opts.cancelText);
            cancelButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                hide("cancel");
            });

            chooseButton.text(opts.chooseText);
            chooseButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (isValid()) {
                    updateOriginalInput(true);
                    hide();
                }
            });

            draggable(alphaSlider, function (dragX, dragY, e) {
                currentAlpha = (dragX / alphaWidth);
                if (e.shiftKey) {
                    currentAlpha = Math.round(currentAlpha * 10) / 10;
                }

                move();
            });

            draggable(slider, function (dragX, dragY) {
                currentHue = parseFloat(dragY / slideHeight);
                move();
            }, dragStart, dragStop);

            draggable(dragger, function (dragX, dragY) {
                currentSaturation = parseFloat(dragX / dragWidth);
                currentValue = parseFloat((dragHeight - dragY) / dragHeight);
                move();
            }, dragStart, dragStop);

            if (!!initialColor) {
                set(initialColor);

                // In case color was black - update the preview UI and set the format
                // since the set function will not run (default color is black).
                updateUI();
                currentPreferredFormat = preferredFormat || tinycolor(initialColor).format;

                addColorToSelectionPalette(initialColor);
            }
            else {
                updateUI();
            }

            if (flat) {
                show();
            }

            function palletElementClick(e) {
                if (e.data && e.data.ignore) {
                    set($(this).data("color"));
                    move();
                }
                else {
                    set($(this).data("color"));
                    updateOriginalInput(true);
                    move();
                    hide();
                }

                return false;
            }

            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            paletteContainer.delegate(".sp-thumb-el", paletteEvent, palletElementClick);
            initialColorContainer.delegate(".sp-thumb-el:nth-child(1)", paletteEvent, { ignore: true }, palletElementClick);
        }

        function addColorToSelectionPalette(color) {
            if (showSelectionPalette) {
                var colorRgb = tinycolor(color).toRgbString();
                if ($.inArray(colorRgb, selectionPalette) === -1) {
                    selectionPalette.push(colorRgb);
                    while(selectionPalette.length > maxSelectionSize) {
                        selectionPalette.shift();
                    }
                }

                if (localStorageKey && window.localStorage) {
                    try {
                        window.localStorage[localStorageKey] = selectionPalette.join(";");
                    }
                    catch(e) { }
                }
            }
        }

        function getUniqueSelectionPalette() {
            var unique = [];
            var p = selectionPalette;
            var paletteLookup = {};
            var rgb;

            if (opts.showPalette) {

                for (var i = 0; i < paletteArray.length; i++) {
                    for (var j = 0; j < paletteArray[i].length; j++) {
                        rgb = tinycolor(paletteArray[i][j]).toRgbString();
                        paletteLookup[rgb] = true;
                    }
                }

                for (i = 0; i < p.length; i++) {
                    rgb = tinycolor(p[i]).toRgbString();

                    if (!paletteLookup.hasOwnProperty(rgb)) {
                        unique.push(p[i]);
                        paletteLookup[rgb] = true;
                    }
                }
            }

            return unique.reverse().slice(0, opts.maxSelectionSize);
        }

        function drawPalette() {

            var currentColor = get();

            var html = $.map(paletteArray, function (palette, i) {
                return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i);
            });

            if (selectionPalette) {
                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection"));
            }

            paletteContainer.html(html.join(""));
        }

        function drawInitial() {
            if (opts.showInitial) {
                var initial = colorOnShow;
                var current = get();
                initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial"));
            }
        }

        function dragStart() {
            if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
                reflow();
            }
            container.addClass(draggingClass);
        }

        function dragStop() {
            container.removeClass(draggingClass);
        }

        function setFromTextInput() {
            var tiny = tinycolor(textInput.val());
            if (tiny.ok) {
                set(tiny);
            }
            else {
                textInput.addClass("sp-validation-error");
            }
        }

        function toggle() {
            if (visible) {
                hide();
            }
            else {
                show();
            }
        }

        function show() {
            var event = $.Event('beforeShow.spectrum');

            if (visible) {
                reflow();
                return;
            }

            boundElement.trigger(event, [ get() ]);

            if (callbacks.beforeShow(get()) === false || event.isDefaultPrevented()) {
                return;
            }

            hideAll();
            visible = true;

            $(doc).bind("click.spectrum", hide);
            $(window).bind("resize.spectrum", resize);
            replacer.addClass("sp-active");
            container.removeClass("sp-hidden");

            if (opts.showPalette) {
                drawPalette();
            }
            reflow();
            updateUI();

            colorOnShow = get();

            drawInitial();
            callbacks.show(colorOnShow);
            boundElement.trigger('show.spectrum', [ colorOnShow ]);
        }

        function hide(e) {

            // Return on right click
            if (e && e.type == "click" && e.button == 2) { return; }

            // Return if hiding is unnecessary
            if (!visible || flat) { return; }
            visible = false;

            $(doc).unbind("click.spectrum", hide);
            $(window).unbind("resize.spectrum", resize);

            replacer.removeClass("sp-active");
            container.addClass("sp-hidden");

            var colorHasChanged = !tinycolor.equals(get(), colorOnShow);

            if (colorHasChanged) {
                if (clickoutFiresChange && e !== "cancel") {
                    updateOriginalInput(true);
                }
                else {
                    revert();
                }
            }

            callbacks.hide(get());
            boundElement.trigger('hide.spectrum', [ get() ]);
        }

        function revert() {
            set(colorOnShow, true);
        }

        function set(color, ignoreFormatChange) {
            if (tinycolor.equals(color, get())) {
                return;
            }

            var newColor = tinycolor(color);
            var newHsv = newColor.toHsv();

            currentHue = newHsv.h;
            currentSaturation = newHsv.s;
            currentValue = newHsv.v;
            currentAlpha = newHsv.a;

            updateUI();

            if (newColor.ok && !ignoreFormatChange) {
                currentPreferredFormat = preferredFormat || newColor.format;
            }
        }

        function get(opts) {
            opts = opts || { };
            return tinycolor.fromRatio({
                h: currentHue,
                s: currentSaturation,
                v: currentValue,
                a: Math.round(currentAlpha * 100) / 100
            }, { format: opts.format || currentPreferredFormat });
        }

        function isValid() {
            return !textInput.hasClass("sp-validation-error");
        }

        function move() {
            updateUI();

            callbacks.move(get());
            boundElement.trigger('move.spectrum', [ get() ]);
        }

        function updateUI() {

            textInput.removeClass("sp-validation-error");

            updateHelperLocations();

            // Update dragger background color (gradients take care of saturation and value).
            var flatColor = tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
            dragger.css("background-color", flatColor.toHexString());

            // Get a format that alpha will be included in (hex and names ignore alpha)
            var format = currentPreferredFormat;
            if (currentAlpha < 1) {
                if (format === "hex" || format === "hex3" || format === "hex6" || format === "name") {
                    format = "rgb";
                }
            }

            var realColor = get({ format: format }),
                realHex = realColor.toHexString(),
                realRgb = realColor.toRgbString();

            // Update the replaced elements background color (with actual selected color)
            if (rgbaSupport || realColor.alpha === 1) {
                previewElement.css("background-color", realRgb);
            }
            else {
                previewElement.css("background-color", "transparent");
                previewElement.css("filter", realColor.toFilter());
            }

            if (opts.showAlpha) {
                var rgb = realColor.toRgb();
                rgb.a = 0;
                var realAlpha = tinycolor(rgb).toRgbString();
                var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

                if (IE) {
                    alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
                }
                else {
                    alphaSliderInner.css("background", "-webkit-" + gradient);
                    alphaSliderInner.css("background", "-moz-" + gradient);
                    alphaSliderInner.css("background", "-ms-" + gradient);
                    alphaSliderInner.css("background", gradient);
                }
            }


            // Update the text entry input as it changes happen
            if (opts.showInput) {
                textInput.val(realColor.toString(format));
            }

            if (opts.showPalette) {
                drawPalette();
            }

            drawInitial();
        }

        function updateHelperLocations() {
            var s = currentSaturation;
            var v = currentValue;

            // Where to show the little circle in that displays your current selected color
            var dragX = s * dragWidth;
            var dragY = dragHeight - (v * dragHeight);
            dragX = Math.max(
                -dragHelperHeight,
                Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight)
            );
            dragY = Math.max(
                -dragHelperHeight,
                Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight)
            );
            dragHelper.css({
                "top": dragY,
                "left": dragX
            });

            var alphaX = currentAlpha * alphaWidth;
            alphaSlideHelper.css({
                "left": alphaX - (alphaSlideHelperWidth / 2)
            });

            // Where to show the bar that displays your current selected hue
            var slideY = (currentHue) * slideHeight;
            slideHelper.css({
                "top": slideY - slideHelperHeight
            });
        }

        function updateOriginalInput(fireCallback) {
            var color = get();

            if (isInput) {
                boundElement.val(color.toString(currentPreferredFormat)).change();
            }

            var hasChanged = !tinycolor.equals(color, colorOnShow);
            colorOnShow = color;

            // Update the selection palette with the current color
            addColorToSelectionPalette(color);
            if (fireCallback && hasChanged) {
                callbacks.change(color);
                boundElement.trigger('change.spectrum', [ color ]);
            }
        }

        function reflow() {
            dragWidth = dragger.width();
            dragHeight = dragger.height();
            dragHelperHeight = dragHelper.height();
            slideWidth = slider.width();
            slideHeight = slider.height();
            slideHelperHeight = slideHelper.height();
            alphaWidth = alphaSlider.width();
            alphaSlideHelperWidth = alphaSlideHelper.width();

            if (!flat) {
                container.css("position", "absolute");
                container.offset(getOffset(container, offsetElement));
            }

            updateHelperLocations();
        }

        function destroy() {
            boundElement.show();
            offsetElement.unbind("click.spectrum touchstart.spectrum");
            container.remove();
            replacer.remove();
            spectrums[spect.id] = null;
        }

        function option(optionName, optionValue) {
            if (optionName === undefined) {
                return $.extend({}, opts);
            }
            if (optionValue === undefined) {
                return opts[optionName];
            }

            opts[optionName] = optionValue;
            applyOptions();
        }

        function enable() {
            disabled = false;
            boundElement.attr("disabled", false);
            offsetElement.removeClass("sp-disabled");
        }

        function disable() {
            hide();
            disabled = true;
            boundElement.attr("disabled", true);
            offsetElement.addClass("sp-disabled");
        }

        initialize();

        var spect = {
            show: show,
            hide: hide,
            toggle: toggle,
            reflow: reflow,
            option: option,
            enable: enable,
            disable: disable,
            set: function (c) {
                set(c);
                updateOriginalInput();
            },
            get: get,
            destroy: destroy,
            container: container
        };

        spect.id = spectrums.push(spect) - 1;

        return spect;
    }

    /**
    * checkOffset - get the offset below/above and left/right element depending on screen position
    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
    */
    function getOffset(picker, input) {
        var extraY = 0;
        var dpWidth = picker.outerWidth();
        var dpHeight = picker.outerHeight();
        var inputHeight = input.outerHeight();
        var doc = picker[0].ownerDocument;
        var docElem = doc.documentElement;
        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
        var offset = input.offset();
        offset.top += inputHeight;

        offset.left -=
            Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offset.left + dpWidth - viewWidth) : 0);

        offset.top -=
            Math.min(offset.top, ((offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
            Math.abs(dpHeight + inputHeight - extraY) : extraY));

        return offset;
    }

    /**
    * noop - do nothing
    */
    function noop() {

    }

    /**
    * stopPropagation - makes the code only doing this a little easier to read in line
    */
    function stopPropagation(e) {
        e.stopPropagation();
    }

    /**
    * Create a function bound to a given object
    * Thanks to underscore.js
    */
    function bind(func, obj) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 2);
        return function () {
            return func.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    /**
    * Lightweight drag helper.  Handles containment within the element, so that
    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
    */
    function draggable(element, onmove, onstart, onstop) {
        onmove = onmove || function () { };
        onstart = onstart || function () { };
        onstop = onstop || function () { };
        var doc = element.ownerDocument || document;
        var dragging = false;
        var offset = {};
        var maxHeight = 0;
        var maxWidth = 0;
        var hasTouch = ('ontouchstart' in window);

        var duringDragEvents = {};
        duringDragEvents["selectstart"] = prevent;
        duringDragEvents["dragstart"] = prevent;
        duringDragEvents[(hasTouch ? "touchmove" : "mousemove")] = move;
        duringDragEvents[(hasTouch ? "touchend" : "mouseup")] = stop;

        function prevent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        function move(e) {
            if (dragging) {
                // Mouseup happened outside of window
                if (IE && document.documentMode < 9 && !e.button) {
                    return stop();
                }

                var touches = e.originalEvent.touches;
                var pageX = touches ? touches[0].pageX : e.pageX;
                var pageY = touches ? touches[0].pageY : e.pageY;

                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

                if (hasTouch) {
                    // Stop scrolling in iOS
                    prevent(e);
                }

                onmove.apply(element, [dragX, dragY, e]);
            }
        }
        function start(e) {
            var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);
            var touches = e.originalEvent.touches;

            if (!rightclick && !dragging) {
                if (onstart.apply(element, arguments) !== false) {
                    dragging = true;
                    maxHeight = $(element).height();
                    maxWidth = $(element).width();
                    offset = $(element).offset();

                    $(doc).bind(duringDragEvents);
                    $(doc.body).addClass("sp-dragging");

                    if (!hasTouch) {
                        move(e);
                    }

                    prevent(e);
                }
            }
        }
        function stop() {
            if (dragging) {
                $(doc).unbind(duringDragEvents);
                $(doc.body).removeClass("sp-dragging");
                onstop.apply(element, arguments);
            }
            dragging = false;
        }

        $(element).bind(hasTouch ? "touchstart" : "mousedown", start);
    }

    function throttle(func, wait, debounce) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var throttler = function () {
                timeout = null;
                func.apply(context, args);
            };
            if (debounce) clearTimeout(timeout);
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    }


    /**
    * Define a jQuery plugin
    */
    var dataID = "spectrum.id";
    $.fn.spectrum = function (opts, extra) {

        if (typeof opts == "string") {

            var returnValue = this;
            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function () {
                var spect = spectrums[$(this).data(dataID)];
                if (spect) {

                    var method = spect[opts];
                    if (!method) {
                        throw new Error( "Spectrum: no such method: '" + opts + "'" );
                    }

                    if (opts == "get") {
                        returnValue = spect.get();
                    }
                    else if (opts == "container") {
                        returnValue = spect.container;
                    }
                    else if (opts == "option") {
                        returnValue = spect.option.apply(spect, args);
                    }
                    else if (opts == "destroy") {
                        spect.destroy();
                        $(this).removeData(dataID);
                    }
                    else {
                        method.apply(spect, args);
                    }
                }
            });

            return returnValue;
        }

        // Initializing a new instance of spectrum
        return this.spectrum("destroy").each(function () {
            var spect = spectrum(this, opts);
            $(this).data(dataID, spect.id);
        });
    };

    $.fn.spectrum.load = true;
    $.fn.spectrum.loadOpts = {};
    $.fn.spectrum.draggable = draggable;
    $.fn.spectrum.defaults = defaultOpts;

    $.spectrum = { };
    $.spectrum.localization = { };
    $.spectrum.palettes = { };

    $.fn.spectrum.processNativeColorInputs = function () {
        var colorInput = $("<input type='color' value='!' />")[0];
        var supportsColor = colorInput.type === "color" && colorInput.value != "!";

        if (!supportsColor) {
            $("input[type=color]").spectrum({
                preferredFormat: "hex6"
            });
        }
    };
    // TinyColor v0.9.14
    // https://github.com/bgrins/TinyColor
    // 2013-02-24, Brian Grinstead, MIT License

    (function(root) {

        var trimLeft = /^[\s,#]+/,
            trimRight = /\s+$/,
            tinyCounter = 0,
            math = Math,
            mathRound = math.round,
            mathMin = math.min,
            mathMax = math.max,
            mathRandom = math.random;

        function tinycolor (color, opts) {

            color = (color) ? color : '';
            opts = opts || { };

            // If input is already a tinycolor, return itself
            if (typeof color == "object" && color.hasOwnProperty("_tc_id")) {
               return color;
            }
            var rgb = inputToRGB(color);
            var r = rgb.r,
                g = rgb.g,
                b = rgb.b,
                a = rgb.a,
                roundA = mathRound(100*a) / 100,
                format = opts.format || rgb.format;

            // Don't let the range of [0,255] come back in [0,1].
            // Potentially lose a little bit of precision here, but will fix issues where
            // .5 gets interpreted as half of the total, instead of half of 1
            // If it was supposed to be 128, this was already taken care of by `inputToRgb`
            if (r < 1) { r = mathRound(r); }
            if (g < 1) { g = mathRound(g); }
            if (b < 1) { b = mathRound(b); }

            return {
                ok: rgb.ok,
                format: format,
                _tc_id: tinyCounter++,
                alpha: a,
                toHsv: function() {
                    var hsv = rgbToHsv(r, g, b);
                    return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: a };
                },
                toHsvString: function() {
                    var hsv = rgbToHsv(r, g, b);
                    var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
                    return (a == 1) ?
                      "hsv("  + h + ", " + s + "%, " + v + "%)" :
                      "hsva(" + h + ", " + s + "%, " + v + "%, "+ roundA + ")";
                },
                toHsl: function() {
                    var hsl = rgbToHsl(r, g, b);
                    return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: a };
                },
                toHslString: function() {
                    var hsl = rgbToHsl(r, g, b);
                    var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
                    return (a == 1) ?
                      "hsl("  + h + ", " + s + "%, " + l + "%)" :
                      "hsla(" + h + ", " + s + "%, " + l + "%, "+ roundA + ")";
                },
                toHex: function(allow3Char) {
                    return rgbToHex(r, g, b, allow3Char);
                },
                toHexString: function(allow3Char) {
                    return '#' + rgbToHex(r, g, b, allow3Char);
                },
                toRgb: function() {
                    return { r: mathRound(r), g: mathRound(g), b: mathRound(b), a: a };
                },
                toRgbString: function() {
                    return (a == 1) ?
                      "rgb("  + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ")" :
                      "rgba(" + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ", " + roundA + ")";
                },
                toPercentageRgb: function() {
                    return { r: mathRound(bound01(r, 255) * 100) + "%", g: mathRound(bound01(g, 255) * 100) + "%", b: mathRound(bound01(b, 255) * 100) + "%", a: a };
                },
                toPercentageRgbString: function() {
                    return (a == 1) ?
                      "rgb("  + mathRound(bound01(r, 255) * 100) + "%, " + mathRound(bound01(g, 255) * 100) + "%, " + mathRound(bound01(b, 255) * 100) + "%)" :
                      "rgba(" + mathRound(bound01(r, 255) * 100) + "%, " + mathRound(bound01(g, 255) * 100) + "%, " + mathRound(bound01(b, 255) * 100) + "%, " + roundA + ")";
                },
                toName: function() {
                    return hexNames[rgbToHex(r, g, b, true)] || false;
                },
                toFilter: function(secondColor) {
                    var hex = rgbToHex(r, g, b);
                    var secondHex = hex;
                    var alphaHex = Math.round(parseFloat(a) * 255).toString(16);
                    var secondAlphaHex = alphaHex;
                    var gradientType = opts && opts.gradientType ? "GradientType = 1, " : "";

                    if (secondColor) {
                        var s = tinycolor(secondColor);
                        secondHex = s.toHex();
                        secondAlphaHex = Math.round(parseFloat(s.alpha) * 255).toString(16);
                    }

                    return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr=#" + pad2(alphaHex) + hex + ",endColorstr=#" + pad2(secondAlphaHex) + secondHex + ")";
                },
                toString: function(format) {
                    format = format || this.format;
                    var formattedString = false;
                    if (format === "rgb") {
                        formattedString = this.toRgbString();
                    }
                    if (format === "prgb") {
                        formattedString = this.toPercentageRgbString();
                    }
                    if (format === "hex" || format === "hex6") {
                        formattedString = this.toHexString();
                    }
                    if (format === "hex3") {
                        formattedString = this.toHexString(true);
                    }
                    if (format === "name") {
                        formattedString = this.toName();
                    }
                    if (format === "hsl") {
                        formattedString = this.toHslString();
                    }
                    if (format === "hsv") {
                        formattedString = this.toHsvString();
                    }

                    return formattedString || this.toHexString();
                }
            };
        }

        // If input is an object, force 1 into "1.0" to handle ratios properly
        // String input requires "1.0" as input, so 1 will be treated as 1
        tinycolor.fromRatio = function(color, opts) {
            if (typeof color == "object") {
                var newColor = {};
                for (var i in color) {
                    if (color.hasOwnProperty(i)) {
                        if (i === "a") {
                            newColor[i] = color[i];
                        }
                        else {
                            newColor[i] = convertToPercentage(color[i]);
                        }
                    }
                }
                color = newColor;
            }

            return tinycolor(color, opts);
        };

        // Given a string or object, convert that input to RGB
        // Possible string inputs:
        //
        //     "red"
        //     "#f00" or "f00"
        //     "#ff0000" or "ff0000"
        //     "rgb 255 0 0" or "rgb (255, 0, 0)"
        //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
        //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
        //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
        //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
        //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
        //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
        //
        function inputToRGB(color) {

            var rgb = { r: 0, g: 0, b: 0 };
            var a = 1;
            var ok = false;
            var format = false;

            if (typeof color == "string") {
                color = stringInputToObject(color);
            }

            if (typeof color == "object") {
                if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
                    rgb = rgbToRgb(color.r, color.g, color.b);
                    ok = true;
                    format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
                }
                else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
                    color.s = convertToPercentage(color.s);
                    color.v = convertToPercentage(color.v);
                    rgb = hsvToRgb(color.h, color.s, color.v);
                    ok = true;
                    format = "hsv";
                }
                else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
                    color.s = convertToPercentage(color.s);
                    color.l = convertToPercentage(color.l);
                    rgb = hslToRgb(color.h, color.s, color.l);
                    ok = true;
                    format = "hsl";
                }

                if (color.hasOwnProperty("a")) {
                    a = color.a;
                }
            }

            a = parseFloat(a);

            // Handle invalid alpha characters by setting to 1
            if (isNaN(a) || a < 0 || a > 1) {
                a = 1;
            }

            return {
                ok: ok,
                format: color.format || format,
                r: mathMin(255, mathMax(rgb.r, 0)),
                g: mathMin(255, mathMax(rgb.g, 0)),
                b: mathMin(255, mathMax(rgb.b, 0)),
                a: a
            };
        }



        // Conversion Functions
        // --------------------

        // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
        // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

        // `rgbToRgb`
        // Handle bounds / percentage checking to conform to CSS color spec
        // <http://www.w3.org/TR/css3-color/>
        // *Assumes:* r, g, b in [0, 255] or [0, 1]
        // *Returns:* { r, g, b } in [0, 255]
        function rgbToRgb(r, g, b){
            return {
                r: bound01(r, 255) * 255,
                g: bound01(g, 255) * 255,
                b: bound01(b, 255) * 255
            };
        }

        // `rgbToHsl`
        // Converts an RGB color value to HSL.
        // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
        // *Returns:* { h, s, l } in [0,1]
        function rgbToHsl(r, g, b) {

            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);

            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, l = (max + min) / 2;

            if(max == min) {
                h = s = 0; // achromatic
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }

                h /= 6;
            }

            return { h: h, s: s, l: l };
        }

        // `hslToRgb`
        // Converts an HSL color value to RGB.
        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
        // *Returns:* { r, g, b } in the set [0, 255]
        function hslToRgb(h, s, l) {
            var r, g, b;

            h = bound01(h, 360);
            s = bound01(s, 100);
            l = bound01(l, 100);

            function hue2rgb(p, q, t) {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            if(s === 0) {
                r = g = b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return { r: r * 255, g: g * 255, b: b * 255 };
        }

        // `rgbToHsv`
        // Converts an RGB color value to HSV
        // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
        // *Returns:* { h, s, v } in [0,1]
        function rgbToHsv(r, g, b) {

            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);

            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, v = max;

            var d = max - min;
            s = max === 0 ? 0 : d / max;

            if(max == min) {
                h = 0; // achromatic
            }
            else {
                switch(max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return { h: h, s: s, v: v };
        }

        // `hsvToRgb`
        // Converts an HSV color value to RGB.
        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
        // *Returns:* { r, g, b } in the set [0, 255]
         function hsvToRgb(h, s, v) {

            h = bound01(h, 360) * 6;
            s = bound01(s, 100);
            v = bound01(v, 100);

            var i = math.floor(h),
                f = h - i,
                p = v * (1 - s),
                q = v * (1 - f * s),
                t = v * (1 - (1 - f) * s),
                mod = i % 6,
                r = [v, q, p, p, t, v][mod],
                g = [t, v, v, q, p, p][mod],
                b = [p, p, t, v, v, q][mod];

            return { r: r * 255, g: g * 255, b: b * 255 };
        }

        // `rgbToHex`
        // Converts an RGB color to hex
        // Assumes r, g, and b are contained in the set [0, 255]
        // Returns a 3 or 6 character hex
        function rgbToHex(r, g, b, allow3Char) {

            var hex = [
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];

            // Return a 3 character hex if possible
            if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
                return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
            }

            return hex.join("");
        }

        // `equals`
        // Can be called with any tinycolor input
        tinycolor.equals = function (color1, color2) {
            if (!color1 || !color2) { return false; }
            return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
        };
        tinycolor.random = function() {
            return tinycolor.fromRatio({
                r: mathRandom(),
                g: mathRandom(),
                b: mathRandom()
            });
        };


        // Modification Functions
        // ----------------------
        // Thanks to less.js for some of the basics here
        // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>


        tinycolor.desaturate = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.s -= ((amount || 10) / 100);
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        };
        tinycolor.saturate = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.s += ((amount || 10) / 100);
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        };
        tinycolor.greyscale = function(color) {
            return tinycolor.desaturate(color, 100);
        };
        tinycolor.lighten = function(color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.l += ((amount || 10) / 100);
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        };
        tinycolor.darken = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.l -= ((amount || 10) / 100);
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        };
        tinycolor.complement = function(color) {
            var hsl = tinycolor(color).toHsl();
            hsl.h = (hsl.h + 180) % 360;
            return tinycolor(hsl);
        };


        // Combination Functions
        // ---------------------
        // Thanks to jQuery xColor for some of the ideas behind these
        // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

        tinycolor.triad = function(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
            ];
        };
        tinycolor.tetrad = function(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
            ];
        };
        tinycolor.splitcomplement = function(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
                tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
            ];
        };
        tinycolor.analogous = function(color, results, slices) {
            results = results || 6;
            slices = slices || 30;

            var hsl = tinycolor(color).toHsl();
            var part = 360 / slices;
            var ret = [tinycolor(color)];

            for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
                hsl.h = (hsl.h + part) % 360;
                ret.push(tinycolor(hsl));
            }
            return ret;
        };
        tinycolor.monochromatic = function(color, results) {
            results = results || 6;
            var hsv = tinycolor(color).toHsv();
            var h = hsv.h, s = hsv.s, v = hsv.v;
            var ret = [];
            var modification = 1 / results;

            while (results--) {
                ret.push(tinycolor({ h: h, s: s, v: v}));
                v = (v + modification) % 1;
            }

            return ret;
        };

        // Readability Functions
        // ---------------------
        // <http://www.w3.org/TR/AERT#color-contrast>

        // `readability`
        // Analyze the 2 colors and returns an object with the following properties:
        //    `brightness`: difference in brightness between the two colors
        //    `color`: difference in color/hue between the two colors
        tinycolor.readability = function(color1, color2) {
            var a = tinycolor(color1).toRgb();
            var b = tinycolor(color2).toRgb();
            var brightnessA = (a.r * 299 + a.g * 587 + a.b * 114) / 1000;
            var brightnessB = (b.r * 299 + b.g * 587 + b.b * 114) / 1000;
            var colorDiff = (
                Math.max(a.r, b.r) - Math.min(a.r, b.r) +
                Math.max(a.g, b.g) - Math.min(a.g, b.g) +
                Math.max(a.b, b.b) - Math.min(a.b, b.b)
            );

            return {
                brightness: Math.abs(brightnessA - brightnessB),
                color: colorDiff
            };
        };

        // `readable`
        // http://www.w3.org/TR/AERT#color-contrast
        // Ensure that foreground and background color combinations provide sufficient contrast.
        // *Example*
        //    tinycolor.readable("#000", "#111") => false
        tinycolor.readable = function(color1, color2) {
            var readability = tinycolor.readability(color1, color2);
            return readability.brightness > 125 && readability.color > 500;
        };

        // `mostReadable`
        // Given a base color and a list of possible foreground or background
        // colors for that base, returns the most readable color.
        // *Example*
        //    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
        tinycolor.mostReadable = function(baseColor, colorList) {
            var bestColor = null;
            var bestScore = 0;
            var bestIsReadable = false;
            for (var i=0; i < colorList.length; i++) {

                // We normalize both around the "acceptable" breaking point,
                // but rank brightness constrast higher than hue.

                var readability = tinycolor.readability(baseColor, colorList[i]);
                var readable = readability.brightness > 125 && readability.color > 500;
                var score = 3 * (readability.brightness / 125) + (readability.color / 500);

                if ((readable && ! bestIsReadable) ||
                    (readable && bestIsReadable && score > bestScore) ||
                    ((! readable) && (! bestIsReadable) && score > bestScore)) {
                    bestIsReadable = readable;
                    bestScore = score;
                    bestColor = tinycolor(colorList[i]);
                }
            }
            return bestColor;
        };


        // Big List of Colors
        // ------------------
        // <http://www.w3.org/TR/css3-color/#svg-color>
        var names = tinycolor.names = {
            aliceblue: "f0f8ff",
            antiquewhite: "faebd7",
            aqua: "0ff",
            aquamarine: "7fffd4",
            azure: "f0ffff",
            beige: "f5f5dc",
            bisque: "ffe4c4",
            black: "000",
            blanchedalmond: "ffebcd",
            blue: "00f",
            blueviolet: "8a2be2",
            brown: "a52a2a",
            burlywood: "deb887",
            burntsienna: "ea7e5d",
            cadetblue: "5f9ea0",
            chartreuse: "7fff00",
            chocolate: "d2691e",
            coral: "ff7f50",
            cornflowerblue: "6495ed",
            cornsilk: "fff8dc",
            crimson: "dc143c",
            cyan: "0ff",
            darkblue: "00008b",
            darkcyan: "008b8b",
            darkgoldenrod: "b8860b",
            darkgray: "a9a9a9",
            darkgreen: "006400",
            darkgrey: "a9a9a9",
            darkkhaki: "bdb76b",
            darkmagenta: "8b008b",
            darkolivegreen: "556b2f",
            darkorange: "ff8c00",
            darkorchid: "9932cc",
            darkred: "8b0000",
            darksalmon: "e9967a",
            darkseagreen: "8fbc8f",
            darkslateblue: "483d8b",
            darkslategray: "2f4f4f",
            darkslategrey: "2f4f4f",
            darkturquoise: "00ced1",
            darkviolet: "9400d3",
            deeppink: "ff1493",
            deepskyblue: "00bfff",
            dimgray: "696969",
            dimgrey: "696969",
            dodgerblue: "1e90ff",
            firebrick: "b22222",
            floralwhite: "fffaf0",
            forestgreen: "228b22",
            fuchsia: "f0f",
            gainsboro: "dcdcdc",
            ghostwhite: "f8f8ff",
            gold: "ffd700",
            goldenrod: "daa520",
            gray: "808080",
            green: "008000",
            greenyellow: "adff2f",
            grey: "808080",
            honeydew: "f0fff0",
            hotpink: "ff69b4",
            indianred: "cd5c5c",
            indigo: "4b0082",
            ivory: "fffff0",
            khaki: "f0e68c",
            lavender: "e6e6fa",
            lavenderblush: "fff0f5",
            lawngreen: "7cfc00",
            lemonchiffon: "fffacd",
            lightblue: "add8e6",
            lightcoral: "f08080",
            lightcyan: "e0ffff",
            lightgoldenrodyellow: "fafad2",
            lightgray: "d3d3d3",
            lightgreen: "90ee90",
            lightgrey: "d3d3d3",
            lightpink: "ffb6c1",
            lightsalmon: "ffa07a",
            lightseagreen: "20b2aa",
            lightskyblue: "87cefa",
            lightslategray: "789",
            lightslategrey: "789",
            lightsteelblue: "b0c4de",
            lightyellow: "ffffe0",
            lime: "0f0",
            limegreen: "32cd32",
            linen: "faf0e6",
            magenta: "f0f",
            maroon: "800000",
            mediumaquamarine: "66cdaa",
            mediumblue: "0000cd",
            mediumorchid: "ba55d3",
            mediumpurple: "9370db",
            mediumseagreen: "3cb371",
            mediumslateblue: "7b68ee",
            mediumspringgreen: "00fa9a",
            mediumturquoise: "48d1cc",
            mediumvioletred: "c71585",
            midnightblue: "191970",
            mintcream: "f5fffa",
            mistyrose: "ffe4e1",
            moccasin: "ffe4b5",
            navajowhite: "ffdead",
            navy: "000080",
            oldlace: "fdf5e6",
            olive: "808000",
            olivedrab: "6b8e23",
            orange: "ffa500",
            orangered: "ff4500",
            orchid: "da70d6",
            palegoldenrod: "eee8aa",
            palegreen: "98fb98",
            paleturquoise: "afeeee",
            palevioletred: "db7093",
            papayawhip: "ffefd5",
            peachpuff: "ffdab9",
            peru: "cd853f",
            pink: "ffc0cb",
            plum: "dda0dd",
            powderblue: "b0e0e6",
            purple: "800080",
            red: "f00",
            rosybrown: "bc8f8f",
            royalblue: "4169e1",
            saddlebrown: "8b4513",
            salmon: "fa8072",
            sandybrown: "f4a460",
            seagreen: "2e8b57",
            seashell: "fff5ee",
            sienna: "a0522d",
            silver: "c0c0c0",
            skyblue: "87ceeb",
            slateblue: "6a5acd",
            slategray: "708090",
            slategrey: "708090",
            snow: "fffafa",
            springgreen: "00ff7f",
            steelblue: "4682b4",
            tan: "d2b48c",
            teal: "008080",
            thistle: "d8bfd8",
            tomato: "ff6347",
            turquoise: "40e0d0",
            violet: "ee82ee",
            wheat: "f5deb3",
            white: "fff",
            whitesmoke: "f5f5f5",
            yellow: "ff0",
            yellowgreen: "9acd32"
        };

        // Make it easy to access colors via `hexNames[hex]`
        var hexNames = tinycolor.hexNames = flip(names);


        // Utilities
        // ---------

        // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
        function flip(o) {
            var flipped = { };
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    flipped[o[i]] = i;
                }
            }
            return flipped;
        }

        // Take input from [0, n] and return it as [0, 1]
        function bound01(n, max) {
            if (isOnePointZero(n)) { n = "100%"; }

            var processPercent = isPercentage(n);
            n = mathMin(max, mathMax(0, parseFloat(n)));

            // Automatically convert percentage into number
            if (processPercent) {
                n = parseInt(n * max, 10) / 100;
            }

            // Handle floating point rounding errors
            if ((math.abs(n - max) < 0.000001)) {
                return 1;
            }

            // Convert into [0, 1] range if it isn't already
            return (n % max) / parseFloat(max);
        }

        // Force a number between 0 and 1
        function clamp01(val) {
            return mathMin(1, mathMax(0, val));
        }

        // Parse an integer into hex
        function parseHex(val) {
            return parseInt(val, 16);
        }

        // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
        // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
        function isOnePointZero(n) {
            return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
        }

        // Check to see if string passed in is a percentage
        function isPercentage(n) {
            return typeof n === "string" && n.indexOf('%') != -1;
        }

        // Force a hex value to have 2 characters
        function pad2(c) {
            return c.length == 1 ? '0' + c : '' + c;
        }

        // Replace a decimal with it's percentage value
        function convertToPercentage(n) {
            if (n <= 1) {
                n = (n * 100) + "%";
            }

            return n;
        }

        var matchers = (function() {

            // <http://www.w3.org/TR/css3-values/#integers>
            var CSS_INTEGER = "[-\\+]?\\d+%?";

            // <http://www.w3.org/TR/css3-values/#number-value>
            var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

            // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
            var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

            // Actual matching.
            // Parentheses and commas are optional, but not required.
            // Whitespace can take the place of commas or opening paren
            var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
            var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

            return {
                rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
                rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
                hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
                hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
                hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
                hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            };
        })();

        // `stringInputToObject`
        // Permissive string parsing.  Take in a number of formats, and output an object
        // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
        function stringInputToObject(color) {

            color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
            var named = false;
            if (names[color]) {
                color = names[color];
                named = true;
            }
            else if (color == 'transparent') {
                return { r: 0, g: 0, b: 0, a: 0 };
            }

            // Try to match string input using regular expressions.
            // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
            // Just return an object and let the conversion functions handle that.
            // This way the result will be the same whether the tinycolor is initialized with string or object.
            var match;
            if ((match = matchers.rgb.exec(color))) {
                return { r: match[1], g: match[2], b: match[3] };
            }
            if ((match = matchers.rgba.exec(color))) {
                return { r: match[1], g: match[2], b: match[3], a: match[4] };
            }
            if ((match = matchers.hsl.exec(color))) {
                return { h: match[1], s: match[2], l: match[3] };
            }
            if ((match = matchers.hsla.exec(color))) {
                return { h: match[1], s: match[2], l: match[3], a: match[4] };
            }
            if ((match = matchers.hsv.exec(color))) {
                return { h: match[1], s: match[2], v: match[3] };
            }
            if ((match = matchers.hex6.exec(color))) {
                return {
                    r: parseHex(match[1]),
                    g: parseHex(match[2]),
                    b: parseHex(match[3]),
                    format: named ? "name" : "hex"
                };
            }
            if ((match = matchers.hex3.exec(color))) {
                return {
                    r: parseHex(match[1] + '' + match[1]),
                    g: parseHex(match[2] + '' + match[2]),
                    b: parseHex(match[3] + '' + match[3]),
                    format: named ? "name" : "hex"
                };
            }

            return false;
        }

        root.tinycolor = tinycolor;

    })(this);



    $(function () {
        if ($.fn.spectrum.load) {
            $.fn.spectrum.processNativeColorInputs();
        }
    });


    function log(){window.console&&(log=Function.prototype.bind?Function.prototype.bind.call(console.log,console):function(){Function.prototype.apply.call(console.log,console,arguments)},log.apply(this,arguments))};


})(window, jQuery);

/*!
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {

  // Detect touch support
  $.support.touch = 'ontouchend' in document;

  // Ignore browsers without touch support
  if (!$.support.touch) {
    return;
  }

  var mouseProto = $.ui.mouse.prototype,
      _mouseInit = mouseProto._mouseInit,
      touchHandled;

  /**
   * Simulate a mouse event based on a corresponding touch event
   * @param {Object} event A touch event
   * @param {String} simulatedType The corresponding mouse event
   */
  function simulateMouseEvent (event, simulatedType) {

    // Ignore multi-touch events
    if (event.originalEvent.touches.length > 1) {
      return;
    }

    event.preventDefault();

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
    
    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,    // type
      true,             // bubbles                    
      true,             // cancelable                 
      window,           // view                       
      1,                // detail                     
      touch.screenX,    // screenX                    
      touch.screenY,    // screenY                    
      touch.clientX,    // clientX                    
      touch.clientY,    // clientY                    
      false,            // ctrlKey                    
      false,            // altKey                     
      false,            // shiftKey                   
      false,            // metaKey                    
      0,                // button                     
      null              // relatedTarget              
    );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
  }

  /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
  mouseProto._touchStart = function (event) {

    var self = this;

    // Ignore the event if another widget is already being handled
    if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
      return;
    }

    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;

    // Track movement to determine if interaction was a click
    self._touchMoved = false;

    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');

    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');
  };

  /**
   * Handle the jQuery UI widget's touchmove events
   * @param {Object} event The document's touchmove event
   */
  mouseProto._touchMove = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Interaction was not a click
    this._touchMoved = true;

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
  };

  /**
   * Handle the jQuery UI widget's touchend events
   * @param {Object} event The document's touchend event
   */
  mouseProto._touchEnd = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Simulate the mouseup event
    simulateMouseEvent(event, 'mouseup');

    // Simulate the mouseout event
    simulateMouseEvent(event, 'mouseout');

    // If the touch interaction did not move, it should trigger a click
    if (!this._touchMoved) {

      // Simulate the click event
      simulateMouseEvent(event, 'click');
    }

    // Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false;
  };

  /**
   * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
   * This method extends the widget with bound touch event handlers that
   * translate touch events to mouse events and pass them to the widget's
   * original mouse event handling methods.
   */
  mouseProto._mouseInit = function () {
    
    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element
      .bind('touchstart', $.proxy(self, '_touchStart'))
      .bind('touchmove', $.proxy(self, '_touchMove'))
      .bind('touchend', $.proxy(self, '_touchEnd'));

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
  };

})(jQuery);
//  Added by stlsmiths 6/13/2011
//  re-define Array.indexOf, because IE doesn't know it ...
//
//  from http://stellapower.net/content/javascript-support-and-arrayindexof-ie
	if (!Array.indexOf) {
		Array.prototype.indexOf = function (obj, start) {
			for (var i = (start || 0); i < this.length; i++) {
				if (this[i] === obj) {
					return i;
				}
			}
			return -1;
		}
	}

var Parser = (function (scope) {
	function object(o) {
		function F() {}
		F.prototype = o;
		return new F();
	}

	var TNUMBER = 0;
	var TOP1 = 1;
	var TOP2 = 2;
	var TVAR = 3;
	var TFUNCALL = 4;

	function Token(type_, index_, prio_, number_) {
		this.type_ = type_;
		this.index_ = index_ || 0;
		this.prio_ = prio_ || 0;
		this.number_ = (number_ !== undefined && number_ !== null) ? number_ : 0;
		this.toString = function () {
			switch (this.type_) {
			case TNUMBER:
				return this.number_;
			case TOP1:
			case TOP2:
			case TVAR:
				return this.index_;
			case TFUNCALL:
				return "CALL";
			default:
				return "Invalid Token";
			}
		};
	}

	function Expression(tokens, ops1, ops2, functions) {
		this.tokens = tokens;
		this.ops1 = ops1;
		this.ops2 = ops2;
		this.functions = functions;
	}

	// Based on http://www.json.org/json2.js
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            "'" : "\\'",
            '\\': '\\\\'
        };

	function escapeValue(v) {
		if (typeof v === "string") {
			escapable.lastIndex = 0;
	        return escapable.test(v) ?
	            "'" + v.replace(escapable, function (a) {
	                var c = meta[a];
	                return typeof c === 'string' ? c :
	                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	            }) + "'" :
	            "'" + v + "'";
		}
		return v;
	}

	Expression.prototype = {
		simplify: function (values) {
			values = values || {};
			var nstack = [];
			var newexpression = [];
			var n1;
			var n2;
			var f;
			var L = this.tokens.length;
			var item;
			var i = 0;
			for (i = 0; i < L; i++) {
				item = this.tokens[i];
				var type_ = item.type_;
				if (type_ === TNUMBER) {
					nstack.push(item);
				}
				else if (type_ === TVAR && (item.index_ in values)) {
					item = new Token(TNUMBER, 0, 0, values[item.index_]);
					nstack.push(item);
				}
				else if (type_ === TOP2 && nstack.length > 1) {
					n2 = nstack.pop();
					n1 = nstack.pop();
					f = this.ops2[item.index_];
					item = new Token(TNUMBER, 0, 0, f(n1.number_, n2.number_));
					nstack.push(item);
				}
				else if (type_ === TOP1 && nstack.length > 0) {
					n1 = nstack.pop();
					f = this.ops1[item.index_];
					item = new Token(TNUMBER, 0, 0, f(n1.number_));
					nstack.push(item);
				}
				else {
					while (nstack.length > 0) {
						newexpression.push(nstack.shift());
					}
					newexpression.push(item);
				}
			}
			while (nstack.length > 0) {
				newexpression.push(nstack.shift());
			}

			return new Expression(newexpression, object(this.ops1), object(this.ops2), object(this.functions));
		},

		substitute: function (variable, expr) {
			if (!(expr instanceof Expression)) {
				expr = new Parser().parse(String(expr));
			}
			var newexpression = [];
			var L = this.tokens.length;
			var item;
			var i = 0;
			for (i = 0; i < L; i++) {
				item = this.tokens[i];
				var type_ = item.type_;
				if (type_ === TVAR && item.index_ === variable) {
					for (var j = 0; j < expr.tokens.length; j++) {
						var expritem = expr.tokens[j];
						var replitem = new Token(expritem.type_, expritem.index_, expritem.prio_, expritem.number_);
						newexpression.push(replitem);
					}
				}
				else {
					newexpression.push(item);
				}
			}

			var ret = new Expression(newexpression, object(this.ops1), object(this.ops2), object(this.functions));
			return ret;
		},

		evaluate: function (values) {
			values = values || {};
			var nstack = [];
			var n1;
			var n2;
			var f;
			var L = this.tokens.length;
			var item;
			var i = 0;
			for (i = 0; i < L; i++) {
				item = this.tokens[i];
				var type_ = item.type_;
				if (type_ === TNUMBER) {
					nstack.push(item.number_);
				}
				else if (type_ === TOP2) {
					n2 = nstack.pop();
					n1 = nstack.pop();
					f = this.ops2[item.index_];
					nstack.push(f(n1, n2));
				}
				else if (type_ === TVAR) {
					if (item.index_ in values) {
						nstack.push(values[item.index_]);
					}
					else if (item.index_ in this.functions) {
						nstack.push(this.functions[item.index_]);
					}
					else {
						throw new Error("undefined variable: " + item.index_);
					}
				}
				else if (type_ === TOP1) {
					n1 = nstack.pop();
					f = this.ops1[item.index_];
					nstack.push(f(n1));
				}
				else if (type_ === TFUNCALL) {
					n1 = nstack.pop();
					f = nstack.pop();
					if (f.apply && f.call) {
						if (Object.prototype.toString.call(n1) == "[object Array]") {
							nstack.push(f.apply(undefined, n1));
						}
						else {
							nstack.push(f.call(undefined, n1));
						}
					}
					else {
						throw new Error(f + " is not a function");
					}
				}
				else {
					throw new Error("invalid Expression");
				}
			}
			if (nstack.length > 1) {
				throw new Error("invalid Expression (parity)");
			}
			return nstack[0];
		},

		toString: function (toJS) {
			var nstack = [];
			var n1;
			var n2;
			var f;
			var L = this.tokens.length;
			var item;
			var i = 0;
			for (i = 0; i < L; i++) {
				item = this.tokens[i];
				var type_ = item.type_;
				if (type_ === TNUMBER) {
					nstack.push(escapeValue(item.number_));
				}
				else if (type_ === TOP2) {
					n2 = nstack.pop();
					n1 = nstack.pop();
					f = item.index_;
					if (toJS && f == "^") {
						nstack.push("Math.pow(" + n1 + "," + n2 + ")");
					}
					else {
						nstack.push("(" + n1 + f + n2 + ")");
					}
				}
				else if (type_ === TVAR) {
					nstack.push(item.index_);
				}
				else if (type_ === TOP1) {
					n1 = nstack.pop();
					f = item.index_;
					if (f === "-") {
						nstack.push("(" + f + n1 + ")");
					}
					else {
						nstack.push(f + "(" + n1 + ")");
					}
				}
				else if (type_ === TFUNCALL) {
					n1 = nstack.pop();
					f = nstack.pop();
					nstack.push(f + "(" + n1 + ")");
				}
				else {
					throw new Error("invalid Expression");
				}
			}
			if (nstack.length > 1) {
				throw new Error("invalid Expression (parity)");
			}
			return nstack[0];
		},

		variables: function () {
			var L = this.tokens.length;
			var vars = [];
			for (var i = 0; i < L; i++) {
				var item = this.tokens[i];
				if (item.type_ === TVAR && (vars.indexOf(item.index_) == -1)) {
					vars.push(item.index_);
				}
			}

			return vars;
		},

		toJSFunction: function (param, variables) {
			var f = new Function(param, "with(Parser.values) { return " + this.simplify(variables).toString(true) + "; }");
			return f;
		}
	};

	function add(a, b) {
		return Number(a) + Number(b);
	}
	function sub(a, b) {
		return a - b; 
	}
	function mul(a, b) {
		return a * b;
	}
	function div(a, b) {
		return a / b;
	}
	function mod(a, b) {
		return a % b;
	}
	function concat(a, b) {
		return "" + a + b;
	}

	function neg(a) {
		return -a;
	}

	function random(a) {
		return Math.random() * (a || 1);
	}
	function fac(a) { //a!
		a = Math.floor(a);
		var b = a;
		while (a > 1) {
			b = b * (--a);
		}
		return b;
	}

	// TODO: use hypot that doesn't overflow
	function pyt(a, b) {
		return Math.sqrt(a * a + b * b);
	}

	function append(a, b) {
		if (Object.prototype.toString.call(a) != "[object Array]") {
			return [a, b];
		}
		a = a.slice();
		a.push(b);
		return a;
	}

	function Parser() {
		this.success = false;
		this.errormsg = "";
		this.expression = "";

		this.pos = 0;

		this.tokennumber = 0;
		this.tokenprio = 0;
		this.tokenindex = 0;
		this.tmpprio = 0;

		this.ops1 = {
			"sin": Math.sin,
			"cos": Math.cos,
			"tan": Math.tan,
			"asin": Math.asin,
			"acos": Math.acos,
			"atan": Math.atan,
			"sqrt": Math.sqrt,
			"log": Math.log,
			"abs": Math.abs,
			"ceil": Math.ceil,
			"floor": Math.floor,
			"round": Math.round,
			"-": neg,
			"exp": Math.exp
		};

		this.ops2 = {
			"+": add,
			"-": sub,
			"*": mul,
			"/": div,
			"%": mod,
			"^": Math.pow,
			",": append,
			"||": concat
		};

		this.functions = {
			"random": random,
			"fac": fac,
			"min": Math.min,
			"max": Math.max,
			"pyt": pyt,
			"pow": Math.pow,
			"atan2": Math.atan2
		};

		this.consts = {
			"E": Math.E,
			"PI": Math.PI
		};
	}

	Parser.parse = function (expr) {
		return new Parser().parse(expr);
	};

	Parser.evaluate = function (expr, variables) {
		return Parser.parse(expr).evaluate(variables);
	};

	Parser.Expression = Expression;

	Parser.values = {
		sin: Math.sin,
		cos: Math.cos,
		tan: Math.tan,
		asin: Math.asin,
		acos: Math.acos,
		atan: Math.atan,
		sqrt: Math.sqrt,
		log: Math.log,
		abs: Math.abs,
		ceil: Math.ceil,
		floor: Math.floor,
		round: Math.round,
		random: random,
		fac: fac,
		exp: Math.exp,
		min: Math.min,
		max: Math.max,
		pyt: pyt,
		pow: Math.pow,
		atan2: Math.atan2,
		E: Math.E,
		PI: Math.PI
	};

	var PRIMARY      = 1 << 0;
	var OPERATOR     = 1 << 1;
	var FUNCTION     = 1 << 2;
	var LPAREN       = 1 << 3;
	var RPAREN       = 1 << 4;
	var COMMA        = 1 << 5;
	var SIGN         = 1 << 6;
	var CALL         = 1 << 7;
	var NULLARY_CALL = 1 << 8;

	Parser.prototype = {
		parse: function (expr) {
			this.errormsg = "";
			this.success = true;
			var operstack = [];
			var tokenstack = [];
			this.tmpprio = 0;
			var expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
			var noperators = 0;
			this.expression = expr;
			this.pos = 0;

			while (this.pos < this.expression.length) {
				if (this.isOperator()) {
					if (this.isSign() && (expected & SIGN)) {
						if (this.isNegativeSign()) {
							this.tokenprio = 2;
							this.tokenindex = "-";
							noperators++;
							this.addfunc(tokenstack, operstack, TOP1);
						}
						expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
					}
					else if (this.isComment()) {

					}
					else {
						if ((expected & OPERATOR) === 0) {
							this.error_parsing(this.pos, "unexpected operator");
						}
						noperators += 2;
						this.addfunc(tokenstack, operstack, TOP2);
						expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
					}
				}
				else if (this.isNumber()) {
					if ((expected & PRIMARY) === 0) {
						this.error_parsing(this.pos, "unexpected number");
					}
					var token = new Token(TNUMBER, 0, 0, this.tokennumber);
					tokenstack.push(token);

					expected = (OPERATOR | RPAREN | COMMA);
				}
				else if (this.isString()) {
					if ((expected & PRIMARY) === 0) {
						this.error_parsing(this.pos, "unexpected string");
					}
					var token = new Token(TNUMBER, 0, 0, this.tokennumber);
					tokenstack.push(token);

					expected = (OPERATOR | RPAREN | COMMA);
				}
				else if (this.isLeftParenth()) {
					if ((expected & LPAREN) === 0) {
						this.error_parsing(this.pos, "unexpected \"(\"");
					}

					if (expected & CALL) {
						noperators += 2;
						this.tokenprio = -2;
						this.tokenindex = -1;
						this.addfunc(tokenstack, operstack, TFUNCALL);
					}

					expected = (PRIMARY | LPAREN | FUNCTION | SIGN | NULLARY_CALL);
				}
				else if (this.isRightParenth()) {
				    if (expected & NULLARY_CALL) {
						var token = new Token(TNUMBER, 0, 0, []);
						tokenstack.push(token);
					}
					else if ((expected & RPAREN) === 0) {
						this.error_parsing(this.pos, "unexpected \")\"");
					}

					expected = (OPERATOR | RPAREN | COMMA | LPAREN | CALL);
				}
				else if (this.isComma()) {
					if ((expected & COMMA) === 0) {
						this.error_parsing(this.pos, "unexpected \",\"");
					}
					this.addfunc(tokenstack, operstack, TOP2);
					noperators += 2;
					expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
				}
				else if (this.isConst()) {
					if ((expected & PRIMARY) === 0) {
						this.error_parsing(this.pos, "unexpected constant");
					}
					var consttoken = new Token(TNUMBER, 0, 0, this.tokennumber);
					tokenstack.push(consttoken);
					expected = (OPERATOR | RPAREN | COMMA);
				}
				else if (this.isOp2()) {
					if ((expected & FUNCTION) === 0) {
						this.error_parsing(this.pos, "unexpected function");
					}
					this.addfunc(tokenstack, operstack, TOP2);
					noperators += 2;
					expected = (LPAREN);
				}
				else if (this.isOp1()) {
					if ((expected & FUNCTION) === 0) {
						this.error_parsing(this.pos, "unexpected function");
					}
					this.addfunc(tokenstack, operstack, TOP1);
					noperators++;
					expected = (LPAREN);
				}
				else if (this.isVar()) {
					if ((expected & PRIMARY) === 0) {
						this.error_parsing(this.pos, "unexpected variable");
					}
					var vartoken = new Token(TVAR, this.tokenindex, 0, 0);
					tokenstack.push(vartoken);

					expected = (OPERATOR | RPAREN | COMMA | LPAREN | CALL);
				}
				else if (this.isWhite()) {
				}
				else {
					if (this.errormsg === "") {
						this.error_parsing(this.pos, "unknown character");
					}
					else {
						this.error_parsing(this.pos, this.errormsg);
					}
				}
			}
			if (this.tmpprio < 0 || this.tmpprio >= 10) {
				this.error_parsing(this.pos, "unmatched \"()\"");
			}
			while (operstack.length > 0) {
				var tmp = operstack.pop();
				tokenstack.push(tmp);
			}
			if (noperators + 1 !== tokenstack.length) {
				//print(noperators + 1);
				//print(tokenstack);
				this.error_parsing(this.pos, "parity");
			}

			return new Expression(tokenstack, object(this.ops1), object(this.ops2), object(this.functions));
		},

		evaluate: function (expr, variables) {
			return this.parse(expr).evaluate(variables);
		},

		error_parsing: function (column, msg) {
			this.success = false;
			this.errormsg = "parse error [column " + (column) + "]: " + msg;
			throw new Error(this.errormsg);
		},

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

		addfunc: function (tokenstack, operstack, type_) {
			var operator = new Token(type_, this.tokenindex, this.tokenprio + this.tmpprio, 0);
			while (operstack.length > 0) {
				if (operator.prio_ <= operstack[operstack.length - 1].prio_) {
					tokenstack.push(operstack.pop());
				}
				else {
					break;
				}
			}
			operstack.push(operator);
		},

		isNumber: function () {
			var r = false;
			var str = "";
			while (this.pos < this.expression.length) {
				var code = this.expression.charCodeAt(this.pos);
				if ((code >= 48 && code <= 57) || code === 46) {
					str += this.expression.charAt(this.pos);
					this.pos++;
					this.tokennumber = parseFloat(str);
					r = true;
				}
				else {
					break;
				}
			}
			return r;
		},

		// Ported from the yajjl JSON parser at http://code.google.com/p/yajjl/
		unescape: function(v, pos) {
			var buffer = [];
			var escaping = false;

			for (var i = 0; i < v.length; i++) {
				var c = v.charAt(i);
	
				if (escaping) {
					switch (c) {
					case "'":
						buffer.push("'");
						break;
					case '\\':
						buffer.push('\\');
						break;
					case '/':
						buffer.push('/');
						break;
					case 'b':
						buffer.push('\b');
						break;
					case 'f':
						buffer.push('\f');
						break;
					case 'n':
						buffer.push('\n');
						break;
					case 'r':
						buffer.push('\r');
						break;
					case 't':
						buffer.push('\t');
						break;
					case 'u':
						// interpret the following 4 characters as the hex of the unicode code point
						var codePoint = parseInt(v.substring(i + 1, i + 5), 16);
						buffer.push(String.fromCharCode(codePoint));
						i += 4;
						break;
					default:
						throw this.error_parsing(pos + i, "Illegal escape sequence: '\\" + c + "'");
					}
					escaping = false;
				} else {
					if (c == '\\') {
						escaping = true;
					} else {
						buffer.push(c);
					}
				}
			}
	
			return buffer.join('');
		},

		isString: function () {
			var r = false;
			var str = "";
			var startpos = this.pos;
			if (this.pos < this.expression.length && this.expression.charAt(this.pos) == "'") {
				this.pos++;
				while (this.pos < this.expression.length) {
					var code = this.expression.charAt(this.pos);
					if (code != "'" || str.slice(-1) == "\\") {
						str += this.expression.charAt(this.pos);
						this.pos++;
					}
					else {
						this.pos++;
						this.tokennumber = this.unescape(str, startpos);
						r = true;
						break;
					}
				}
			}
			return r;
		},

		isConst: function () {
			var str;
			for (var i in this.consts) {
				if (true) {
					var L = i.length;
					str = this.expression.substr(this.pos, L);
					if (i === str) {
						this.tokennumber = this.consts[i];
						this.pos += L;
						return true;
					}
				}
			}
			return false;
		},

		isOperator: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 43) { // +
				this.tokenprio = 0;
				this.tokenindex = "+";
			}
			else if (code === 45) { // -
				this.tokenprio = 0;
				this.tokenindex = "-";
			}
			else if (code === 124) { // |
				if (this.expression.charCodeAt(this.pos + 1) === 124) {
					this.pos++;
					this.tokenprio = 0;
					this.tokenindex = "||";
				}
				else {
					return false;
				}
			}
			else if (code === 42) { // *
				this.tokenprio = 1;
				this.tokenindex = "*";
			}
			else if (code === 47) { // /
				this.tokenprio = 2;
				this.tokenindex = "/";
			}
			else if (code === 37) { // %
				this.tokenprio = 2;
				this.tokenindex = "%";
			}
			else if (code === 94) { // ^
				this.tokenprio = 3;
				this.tokenindex = "^";
			}
			else {
				return false;
			}
			this.pos++;
			return true;
		},

		isSign: function () {
			var code = this.expression.charCodeAt(this.pos - 1);
			if (code === 45 || code === 43) { // -
				return true;
			}
			return false;
		},

		isPositiveSign: function () {
			var code = this.expression.charCodeAt(this.pos - 1);
			if (code === 43) { // -
				return true;
			}
			return false;
		},

		isNegativeSign: function () {
			var code = this.expression.charCodeAt(this.pos - 1);
			if (code === 45) { // -
				return true;
			}
			return false;
		},

		isLeftParenth: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 40) { // (
				this.pos++;
				this.tmpprio += 10;
				return true;
			}
			return false;
		},

		isRightParenth: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 41) { // )
				this.pos++;
				this.tmpprio -= 10;
				return true;
			}
			return false;
		},

		isComma: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 44) { // ,
				this.pos++;
				this.tokenprio = -1;
				this.tokenindex = ",";
				return true;
			}
			return false;
		},

		isWhite: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 32 || code === 9 || code === 10 || code === 13) {
				this.pos++;
				return true;
			}
			return false;
		},

		isOp1: function () {
			var str = "";
			for (var i = this.pos; i < this.expression.length; i++) {
				var c = this.expression.charAt(i);
				if (c.toUpperCase() === c.toLowerCase()) {
					if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
						break;
					}
				}
				str += c;
			}
			if (str.length > 0 && (str in this.ops1)) {
				this.tokenindex = str;
				this.tokenprio = 5;
				this.pos += str.length;
				return true;
			}
			return false;
		},

		isOp2: function () {
			var str = "";
			for (var i = this.pos; i < this.expression.length; i++) {
				var c = this.expression.charAt(i);
				if (c.toUpperCase() === c.toLowerCase()) {
					if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
						break;
					}
				}
				str += c;
			}
			if (str.length > 0 && (str in this.ops2)) {
				this.tokenindex = str;
				this.tokenprio = 5;
				this.pos += str.length;
				return true;
			}
			return false;
		},

		isVar: function () {
			var str = "";
			for (var i = this.pos; i < this.expression.length; i++) {
				var c = this.expression.charAt(i);
				if (c.toUpperCase() === c.toLowerCase()) {
					if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
						break;
					}
				}
				str += c;
			}
			if (str.length > 0) {
				this.tokenindex = str;
				this.tokenprio = 4;
				this.pos += str.length;
				return true;
			}
			return false;
		},

		isComment: function () {
			var code = this.expression.charCodeAt(this.pos - 1);
			if (code === 47 && this.expression.charCodeAt(this.pos) === 42) {
				this.pos = this.expression.indexOf("*/", this.pos) + 2;
				if (this.pos === 1) {
					this.pos = this.expression.length;
				}
				return true;
			}
			return false;
		}
	};

	scope.Parser = Parser;
	return Parser
})(typeof exports === 'undefined' ? {} : exports);

$(function(){
  
  var template = 
    '<div class="showpanel">'+
      '<button class="button show-load icon-folder-open">app</button>'+
    '</div>'+
    '<div class="panel">'+
      '<div class="choosepanel">'+
        '<button class="button show-load icon-folder-open">app</button>'+
        '<button class="button close icon-cancel" title="close menu"></button>'+
      '</div>'+
      '<div class="menu menu-load">'+
        '<div class="controls">'+
          '<form class="loadfromgist">'+
            '<input class="loadfromgistinput" name="loadfromgistinput" placeholder="load app from gist url" type="text" />'+
            '<button class="loadfromgistsubmit icon-ok" type="submit">load</button>'+
          '</form>'+
        '</div>'+
        '<div class="listing">'+
          '<button class="button newblank icon-doc" title="new blank app">new</button>'+
          '<div class="currentapp">'+
          '</div>'+
          '<div class="localapps">'+
            '<h1>Saved Apps</h1>'+
          '</div>'+
          '<div class="examples">'+
            '<h1>Examples</h1>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>';

  var currentTemplate = 
    '<h1>Current App</h1>'+
    '<div class="info">'+
      '<h2 title="url, click to edit" class="seturl editable"></h2>' +
      '<p title="title, click to edit" class="settitle editable"></p>' +
      '<p title="description, click to edit" class="setdescription editable"></p>' +
    '</div>'+
    '<div class="savecontrols">'+
      '<button class="savelocal icon-install">save local</button>'+
      '<button class="forklocal icon-split" title="save as... copy app and save under a new name">fork</button>'+
      '<button class="savegist icon-globe-1" title="save app to gist.github.com anonymously">save public</button>'+
      '<button class="deletelocal icon-trash" title="delete local app"></button>'+
    '</div>'+
    '<div class="permalink" title="last publicly saved version">'+
    '</div>';

  // requestAnimationFrame shim from http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame    || 
      window.oRequestAnimationFrame      || 
      window.msRequestAnimationFrame     || 
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
  }());    
  
  var IframeworkView = Backbone.View.extend({
    tagName: "div",
    className: "app",
    template: _.template(template),
    currentTemplate: _.template(currentTemplate),
    frameCount: 0, // HACK to not use same name in Firefox
    NativeNodes: {},
    plugins: {},
    events: {
      "click .close" :         "closePanels",
      "click .show-load" :      "showLoad",

      "click .newblank":       "newBlank",

      "submit .loadfromgist":  "loadFromGist",
      "click .savegist":       "saveGist",
      "click .savelocal":      "saveLocal",
      "click .forklocal":      "forkLocal",
      "click .deletelocal":    "deleteLocal",

      "blur .settitle":        "setTitle",
      "blur .setdescription":  "setDescription",
      "blur .seturl":          "setUrl"
    },
    initialize: function () {
      this.render();
      $('body').prepend(this.el);
      
      // Hide panels
      this.closePanels();

      // After all of the .js is loaded, this.allLoaded will be triggered to finish the init
      this.once("allLoaded", this.loadLocalApps, this);
    },
    allLoaded: function () {
      this.trigger("allLoaded");

      // Start animation loop
      window.requestAnimationFrame( this.renderAnimationFrame.bind(this) );
    },
    render: function () {
      this.$el.html(this.template());
      return this;
    },
    renderAnimationFrame: function (timestamp) {
      // Safari doesn't pass timestamp
      timestamp = timestamp !== undefined ? timestamp : Date.now();
      // Queue next frame
      window.requestAnimationFrame( this.renderAnimationFrame.bind(this) );
      // Hit graph, which hits nodes
      if (this.graph && this.graph.view) {
        this.graph.view.renderAnimationFrame(timestamp);
      }
    },
    graph: null,
    shownGraph: null,
    // Thanks http://www.madebypi.co.uk/labs/colorutils/examples.html :: red.equal(7, true);
    wireColors: ["#FF9292", "#00C2EE", "#DCA761", "#8BB0FF", "#96BD6D", "#E797D7", "#29C6AD"],
    wireColorIndex: 0,
    selectedPort: null,
    getWireColor: function () {
      var color = this.wireColors[this.wireColorIndex];
      this.wireColorIndex++;
      if (this.wireColorIndex > this.wireColors.length-1) {
        this.wireColorIndex = 0;
      }
      return color;
    },
    addMenu: function(name, html, icon){
      var self = this;

      var menu = $('<div class="menu menu-'+name+'"></div>')
        .append(html)
        .hide();
      this.$(".panel").append(menu);

      var showButton = $('<button class="button show-'+name+'">'+name+'</button>')
        .click( function(){
          self.showPanel(name);
          // menu.show();
        });
      if (icon) {
        showButton.addClass(icon);
      }
      this.$(".showpanel").append(showButton);
      this.$(".choosepanel > .close").before(showButton.clone(true));
    },
    addMenuSection: function(name, html, parentMenu){
      var title = $("<h1>").text(name);
      this.$(".menu-"+parentMenu+" .listing").append(title, html);
    },
    loadGraph: function (graph) {
      // Load a new parent graph

      if (this.graph) {
        this.graph.remove();
        this.graph = null;
      }
      this.wireColorIndex = 0;
      this.graph = new Iframework.Graph(graph);
      if (graph["info"] && graph["info"]["title"]) {
        document.title = "Meemoo: "+graph["info"]["title"];
      }

      this.updateCurrentInfo();

      this.shownGraph = this.graph;

      return this.graph;
    },
    showGraph: function (graph) {
      // Show a child graph / subgraph / macro
      if (this.shownGraph && this.shownGraph.view) {
        this.shownGraph.view.$el.hide();
      }
      if (!graph.view) {
        graph.initializeView();
      }
      this.shownGraph = graph;
      this.shownGraph.view.$el.show();
      // Rerender edges once
      if (!this.shownGraph.view.unhidden) {
        this.shownGraph.view.unhidden = true;
        this.shownGraph.view.rerenderEdges();
      }
    },
    gotMessage: function (e) {
      if (Iframework.graph) {
        var node = Iframework.graph.get("nodes").get(e.data.nodeid);
        // TODO: iframes in subgraphs?
        if (node) {
          for (var name in e.data) {
            if (e.data.hasOwnProperty(name)) {
              var info = e.data[name];
              switch (name) {
                case "message":
                  node.sendFromFrame(info);
                  break;
                case "info":
                  node.infoLoaded(info);
                  break;
                case "addInput":
                  node.addInput(info);
                  break;
                case "addOutput":
                  node.addOutput(info);
                  break;
                case "stateReady":
                  node.iframeLoaded();
                  break;
                case "set":
                  node.setValues(info);
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
    },
    _exampleGraphs: [],
    _loadedExample: null,
    loadExampleApps: function (examples) {
      this._exampleGraphs = this._exampleGraphs.concat(examples);

      // Make example links:
      var exampleLinks = "";
      for (var i=0; i<examples.length; i++) {
        var url = examples[i]["info"]["url"];
        if (url) {
          exampleLinks += '<a href="#example/'+url+'" title="'+examples[i]["info"]["title"]+": "+examples[i]["info"]["description"]+'">'+url+'</a> <br />';
        }
      }
      this.$(".menu-load .examples").append(exampleLinks);

      // None shown
      if (!this.graph){
        if (this._loadedExample) {
          // Router tried to load this already, try again
          this.loadExample(this._loadedExample);
        } else if (!this._loadedLocal && !this._loadedLocal && !this._loadedGist) {
          // Load first example
          // Iframework.loadGraph(this._exampleGraphs[0]);
          // Load new graph
          this.newBlank();
        }
      }
    },
    loadExample: function (url) {
      this._loadedExample = url;
      for (var i=0; i<this._exampleGraphs.length; i++) {
        if (this._exampleGraphs[i]["info"]["url"] === url) {
          // reset localStorage version
          this._loadedLocalApp = null;
          // load graph
          this.loadGraph(this._exampleGraphs[i]);
          this.analyze("load", "example", url);
          return true;
        }
      }
    },
    closePanels: function() {
      this.$(".showpanel").show();
      this.$(".panel").hide();
      this.$(".graph").css("right", "0px");

      this.$(".menu").hide();
    },
    showPanel: function( menu ) {
      this.$(".menu").hide();

      this.$(".showpanel").hide();
      this.$(".panel").show();
      this.$(".graph").css("right", "350px");

      if (menu) {
        if ( this.$(".menu-"+menu).length > 0 ) {
          this.$(".menu-"+menu).show();
          this.trigger("showmenu:"+menu);
        } else {
          // HACK for when menu plugin isn't added yet
          var self = this;
          _.delay(function(){
            self.$(".menu-"+menu).show();
            self.trigger("showmenu:"+menu);
          }, 1000);
        }
      }
    },
    showLoad: function() {
      this.showPanel();
      this.$(".menu-load").show();
    },
    loadFromGist: function () {
      var gistid = this.loadFromGistId( this.$(".loadfromgistinput").val() );
      if ( gistid ) {
        $(".loadfromgistinput").blur();

        if (this.router) {
          this.router.navigate("gist/"+gistid);
        }

        // Input placeholder
        this.$(".loadfromgistinput")
          .val("")
          .attr("placeholder", "loading...");
        window.setTimeout(function(){
          this.$(".loadfromgistinput")
            .attr("placeholder", "load app from gist url");
        }, 1500);
      }
      return false;
    },
    loadFromGistId: function (gistid) {
      this._loadedGist = gistid;
      // "https://gist.github.com/2439102" or just "2439102"
      var split = gistid.split("/"); // ["https:", "", "gist.github.com", "2439102"]
      if (split.length > 3 && split[2] === "gist.github.com") {
        gistid = split[split.length-1];
      }

      // Load gist to json to app
      $.ajax({
        url: 'https://api.github.com/gists/'+gistid,
        type: 'GET',
        dataType: 'jsonp'
      })
      .success( function(gistdata) {
        var graphs = [];
        for (var file in gistdata.data.files) {
          if (gistdata.data.files.hasOwnProperty(file)) {
            var graph = JSON.parse(gistdata.data.files[file].content);
            if (graph) {
              var gisturl = gistdata.data.html_url;
              // Insert a reference to the parent
              if (!graph.info.parents || !graph.info.parents.push) {
                graph.info.parents = [];
              }
              // Only if this gist url isn't already in graph's parents
              if (graph.info.parents.indexOf(gisturl) === -1) {
                graph.info.parents.push(gisturl);
              }
              graphs.push(graph);
            }
          }
        }
        if (graphs.length > 0) {
          // reset localStorage version
          // FIXME
          // Iframework._loadedLocalApp = null;
          // load graph
          Iframework.loadGraph(graphs[0]);
          Iframework.closePanels();
        }
      })
      .error( function(e) {
        console.warn("gist load error", e);
      });

      this.analyze("load", "gist", gistid);

      return gistid;
    },
    saveGist: function () {
      // Save app to gist
      var graph = this.graph.toJSON();
      var data = {
        "description": "meemoo app: "+graph["info"]["title"],
        "public": true
      };
      data["files"] = {};
      var filename = graph["info"]["url"]+".json";
      data["files"][filename] = {
        "content": JSON.stringify(graph, null, "  ")
      };

      // Button
      this.$(".savegist")
        .prop('disabled', true)
        .text("saving...");

      $.ajax({
        url: 'https://api.github.com/gists',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data)
      })
      .success(function(e){
        // Save gist url to graph's info.parents
        var info = Iframework.graph.get("info");
        if (!info.hasOwnProperty("parents") || !info.parents.push) {
          graph.info.parents = [];
        }
        graph.info.parents.push(e.html_url);
        // Save local with new gist reference
        Iframework.saveLocal();
        // Show new permalink
        Iframework.updateCurrentInfo();

        Iframework.analyze("save", "gist", e.id);
      })
      .error(function(e){
        var description = "meemoo app: " + Iframework.graph.toJSON()["info"]["title"];
        Iframework.$(".permalink").html('api is down (;_;) copy your app source code to <a href="https://gist.github.com/?description='+encodeURIComponent(description)+'" target="_blank">gist.github.com</a>');
        console.warn("gist save error", e);
      })
      .complete(function(e){
        // Button
        this.$(".savegist")
          .prop('disabled', false)
          .text("save public");
      });
    },
    loadLocalApps: function () {
      // Load apps from local storage
      this._localApps = new Iframework.LocalApps();
      this._localApps.fetch({
        success: function(e) {
          Iframework._localApps.each(function(app){
            app.initializeView();
          });
          // None shown
          if (!Iframework.graph){
            if (Iframework._loadedLocal) {
              // Router tried to load this already, try again
              Iframework.loadLocal(Iframework._loadedLocal);
            }
          }
        },
        error: function (e) {
          console.warn("error loading local apps");
        }
      });
    },
    _loadedLocal: null,
    _loadedLocalApp: null,
    loadLocal: function (url) {
      this._loadedLocal = url;
      if (this._localApps) {
        var app = this._localApps.getByUrl(url);
        if (app) {
          app.load();
          return true;
        }
        else {
          // Didn't find matching url
          console.warn("Didn't find local app with matching url.");
          this.newBlank();
          return false;
        }
      } else {
        // Local apps not loaded yet
        return false;
      }
    },
    setKey: function (current) {
      var key = window.prompt("Enter a url key", current);
      if (key) {
        key = this.encodeKey(key);
        this.graph.setInfo("url", key);
      }
      return key;
    },
    encodeKey: function (key) {
      key = key.toLowerCase().replace(/ /g, "-");
      key = encodeURIComponent(key);
      return key;
    },
    saveLocal: function () {
      if (!this.graph.get("info")){
        this.graph.set({
          info: {}
        });
      }
      while (!this.graph.get("info").hasOwnProperty("url") || this.graph.get("info")["url"]==="") {
        var keysuggestion;
        if (this.graph.get("info").hasOwnProperty("title") && this.graph.get("info")["title"]!=="") {
          keysuggestion = this.graph.get("info")["title"];
        } else {
          keysuggestion = "app-" + new Date().getTime();
        }
        if(!this.setKey(keysuggestion)){
          // cancel
          return false;
        }
      }
      var currentAppGraph = JSON.parse(JSON.stringify(this.graph));
      var key = currentAppGraph["info"]["url"];
      var app;
      if (this._loadedLocalApp) {
        if (this._localApps.getByUrl(key) && this._localApps.getByUrl(key) !== this._loadedLocalApp) {
          if (window.confirm("\""+key+"\" already exists as a local app. Do you want to replace it?")) {
            app = this._localApps.updateOrCreate(currentAppGraph);
          } else {
            return false;
          }
        } else {
          // New name
          app = this._loadedLocalApp;
          app.save({graph:currentAppGraph});
          app.trigger("change");
        }
      } else {
        // Overwrite?
        if (this._localApps.getByUrl(key) && !window.confirm("\""+key+"\" already exists as a local app. Do you want to replace it?")) {
          return false;
        }
        app = this._localApps.updateOrCreate(currentAppGraph);
      }

      this._loadedLocalApp = app;

      this.analyze("save", "local", "x");

      // To show when url changes
      this.updateCurrentInfo();

      // URL hash
      Iframework.router.navigate("local/"+key);
      return app;
    },
    forkLocal: function(){
      // This makes it save the app as a new local app
      this._loadedLocalApp = null;
      // Suggested name
      var url = this.graph.get("info")["url"]+"-copy";
      this.setKey(url);
      // Do the overwrite checks and save
      this.saveLocal();
    },
    deleteLocal: function () {
      if (this._loadedLocalApp) {
        this._loadedLocalApp.destroy();
        this._loadedLocalApp = null;
      }
    },
    setTitle: function () {
      var input = this.$(".currentapp .info .settitle").text();
      if (input !== this.graph.get("info")["title"]) {
        this.graph.setInfo("title", input);
      }
    },
    setDescription: function () {
      var input = this.$(".currentapp .info .setdescription").text();
      if (input !== this.graph.get("info")["description"]) {
        this.graph.setInfo("description", input);
      }
    },
    setUrl: function () {
      var input = this.$(".currentapp .info .seturl").text();
      input = this.encodeKey(input);
      if (input !== this.graph.get("info")["url"]) {
        this.graph.setInfo("url", input);
      }
    },
    updateCurrentInfo: function () {
      var graph = this.graph.toJSON();
      this.$(".currentapp")
        .html( this.currentTemplate(graph) );

      this.$(".currentapp .seturl")
        .text(decodeURIComponent(graph["info"]["url"]));
      this.$(".currentapp .settitle")
        .text(graph["info"]["title"]);
      this.$(".currentapp .setdescription")
        .text(graph["info"]["description"]);

      this.$(".editable")
        .attr("contenteditable", "true");

      if (graph.info.hasOwnProperty("parents")) {
        var parents = graph.info.parents;
        if (parents.length > 0) {
          var last = parents[parents.length-1];
          var split = last.split("/");
          if (split.length > 0) {
            var id = split[split.length-1];
            var gisturl = "https://app.meemoo.org/#gist/"+id;
            var gisturlE = encodeURIComponent(gisturl);
            var titleE = encodeURIComponent(graph["info"]["title"]);

            var gistUrlSelect = $('<span />')
              .text(gisturl)
              .click(function(e){
                // Click-to-select from http://stackoverflow.com/a/987376/592125
                var range;
                if (document.body.createTextRange) { // ms
                  range = document.body.createTextRange();
                  range.moveToElementText(e.target);
                  range.select();
                } else if (window.getSelection) {
                  var selection = window.getSelection();
                  range = document.createRange();
                  range.selectNodeContents(e.target);
                  selection.removeAllRanges();
                  selection.addRange(range);
                }
              });

            var gistLink = $('<a title="your saved gist" target="_blank" class="share icon-github"></a>')
              .attr("href", last);
            var fbLink = $('<a title="share on facebook" target="_blank" class="share icon-facebook-rect"></a>')
              .attr("href", 'https://www.facebook.com/sharer.php?u='+gisturlE+'&t='+titleE);
            var tweet = " " + graph["info"]["title"] + " #meemoo " + graph["info"]["description"];
            // url is shortened to 20
            if (tweet.length >= 120) {
              tweet = tweet.substr(0,115) + "...";
            }
            tweet = gisturl + tweet;
            var twitterLink = $('<a title="post to twitter" target="_blank" class="share icon-twitter-bird"></a>')
              .attr("href", 'https://twitter.com/intent/tweet?text='+encodeURIComponent(tweet));

            this.$(".currentapp .permalink")
              .empty()
              .append(gistUrlSelect).append(" ")
              .append(gistLink)
              .append(fbLink)
              .append(twitterLink);
          }
        }
      }

      if (this._loadedLocalApp) {
        this.$(".currentapp .deletelocal").show();
      } else  {
        this.$(".currentapp .deletelocal").hide();
      }
    },
    newBlank: function () {
      // HACK maybe a better way to load a blank graph with defaults?
      this.loadGraph({"info":{"author":"meemoo","title":"Untitled","description":"Meemoo app description","parents":[],"url":""},"nodes":[],"edges":[]});
      // reset localStorage version
      this._loadedLocalApp = null;

      this.showPanel("library");

      // URL hash
      Iframework.router.navigate("new");
    },
    analyze: function (group, type, id) {
      // Google analytics
      // _gaq.push(['_trackEvent', group, type, id]);
    }

  });

  // Start app
  window.Iframework = new IframeworkView();
  
  // Listen for /info messages from nodes
  window.addEventListener("message", Iframework.gotMessage, false);

});

$(function(){

  Iframework.util = {
    // From YUI3 via http://stackoverflow.com/a/7390555/592125
    types: {
      'undefined'        : 'undefined',
      'number'           : 'number',
      'boolean'          : 'boolean',
      'string'           : 'string',
      '[object Function]': 'function',
      '[object RegExp]'  : 'regexp',
      '[object Array]'   : 'array',
      '[object Date]'    : 'date',
      '[object Error]'   : 'error',
      '[object HTMLCanvasElement]': 'HTMLCanvasElement',
      '[object ImageData]': 'ImageData'
    },
    type: function(o) {
      return this.types[typeof o] || this.types[Object.prototype.toString.call(o)] || (o ? 'object' : 'null');
    },
    imageTypes: ["png", "gif", "jpg", "jpeg", "webp"],
    isImageURL: function(url) {
      var fileTypeSplit = url.split(".");
      if (fileTypeSplit.length > 1) {
        var fileType = fileTypeSplit[fileTypeSplit.length-1];
        return (this.imageTypes.indexOf(fileType) > -1);
      }
      return false;
    },
    imageDrop: function(event, ui){
      // Used in image.js and variable-animation.js
      // TODO only drop to top

      // Don't deal with dropped file
      if (!ui) { return false; }

      // Don't also drop on graph
      event.stopPropagation();

      var self = event.data.self;

      var type = ui.helper.data("meemoo-drag-type");
      if ( !type || type !== "canvas" ) { return false; }

      var inputName = event.data.inputName;
      if ( !inputName ) { return false; }

      var canvas;

      var url = ui.helper.data("meemoo-image-url");
      if (url) {
        // Load big image instead of thumbnail
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = function(){
          canvas = document.createElement("canvas");
          var context = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          // Hit own input with image
          self.receive(inputName, canvas);
        };
        img.src = url;
      } else {
        canvas = ui.helper.data("meemoo-drag-canvas");
        if ( !canvas) { return false; }
        // Hit own input with image
        self.receive(inputName, canvas);
      }

    },
    fitAndCopy: function(source, target){
      // source and target 2d canvases

      var w = target.width;
      var h = target.height;
      var ratio = w/h;

      var inWidth = source.width;
      var inHeight = source.height;
      var inRatio = inWidth/inHeight;

      var sx, sy, sw, sh;

      if (ratio >= inRatio) {
        sw = inWidth;
        sh = Math.floor(inWidth/ratio);
        sx = 0;
        sy = Math.floor((inHeight-sh)/2);
      } else {
        sw = Math.floor(inHeight*ratio);
        sh = inHeight;
        sx = Math.floor((inWidth-sw)/2);
        sy = 0;
      }

      var context = target.getContext("2d");
      context.drawImage(source, sx, sy, sw, sh, 0, 0, w, h);
    }

  };

});

$(function(){
  
  Iframework.Event = Backbone.Model.extend({
    defaults: function () {
      return {
        action: "",
        args: {}
      };
    },
    initialize: function () {
    }
  });

  Iframework.EventsHistory = Backbone.Collection.extend({
    model: Iframework.Event
  });
  
  // binding undo to ctrl+z
  Mousetrap.bind(['command+z', 'ctrl+z'], function(e) {
    // TODO work with subgraph
    // actual graph shown by iframework
    var graph = window.Iframework.shownGraph;
    // get the last event (stack top)
    var event = graph.eventsHistory.last();

    // what kind of action ocurred?
    if (event.get("action") === "removeNode") {
      var node = event.get("args").node;
      // make sure the node will use the same id
      var originalIndex = graph.usedIds.indexOf(node.get("id"));
      graph.usedIds.splice(originalIndex, 1);
      // add the node again
      graph.addNode(node);
      // add input and output ports
      var i;
      for (i=0; i<node.Inputs.length; i++) {
        node.view.addInput(node.Inputs.at(i));
      }
      for (i=0; i<node.Outputs.length; i++) {
        node.view.addOutput(node.Outputs.at(i));
      }
      // add edges
      var edges = event.get("args").edges;
      for (i=0; i<edges.length; i++) {
        graph.addEdge(edges[i]);
      }
    }
    // updates the events stack
    graph.eventsHistory.pop();
  });

});
$(function(){

  Iframework.LocalApp = Backbone.Model.extend({
    initializeView: function () {
      if (!this.view) {
        this.view = new Iframework.LocalAppView({model:this});
      }
      return this.view;
    },
    load: function(){
      
      Iframework._loadedLocalApp = this;
      // Clone graph
      var graph = JSON.parse(JSON.stringify(this.get("graph")));
      Iframework.loadGraph(graph);

      //DEBUG
      // Iframework.showLoad();
    },
    toJSON: function () {
      return {
        id: this.id,
        graph: this.get("graph")
      };
    }
  });

  Iframework.LocalApps = Backbone.Collection.extend({
    model: Iframework.LocalApp,
    localStorage: new Backbone.LocalStorage("LocalApps"),
    getByUrl: function (url) {
      var app = this.find(function(app){
        return app.get("graph")["info"]["url"] === url;
      });
      return app;
    },
    updateOrCreate: function (graph) {
      var app;
      app = this.find(function(app){
        return app.get("graph")["info"]["url"] === graph["info"]["url"];
      });
      if (app) {
        app.save({graph:graph});
        app.trigger("change");
      } else {
        app = this.create({graph:graph});
        app.initializeView();
      }
      return app;
    }

  });
    
});

$(function(){

  var template = 
    '<a class="url" href="#local/<%= graph.info.url %>"></a> - '+
    '<a class="macro" title="load as subgraph into current graph" href="#">sub</a> ';
    // '<div class="info">'+
    //   '<h2 class="title"><%= graph.info.title %></h2>' +
    //   '<p class="description"><%= graph.info.description %></p>' +
    // '</div>';

  Iframework.LocalAppView = Backbone.View.extend({
    tagName: "div",
    className: "localapp",
    template: _.template(template),
    events: {
      "click .macro": "loadAsMacro"
    },
    initialize: function () {
      this.render();
      Iframework.$(".localapps").append( this.el );

      this.model.on('change', this.update, this);
      this.model.on('destroy', this.remove, this);

      return this;
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      this.$(".url").text( decodeURIComponent(this.model.get("graph")["info"]["url"]) );
      // this.$(".info").hide();
    },
    update: function () {
      this.render();
      Iframework.updateCurrentInfo();
    },
    loadAsMacro: function (event) {
      event.preventDefault();

      Iframework.shownGraph.addNode({
        src: "meemoo:subgraph/subgraph",
        state: {
          label: decodeURIComponent(this.model.get("graph")["info"]["url"]),
          graph: this.model.get("graph")
        }
      });

      return false;
    },
    remove: function () {
      this.$el.remove();
    }

  });

});

$(function(){

  Iframework.Graph = Backbone.Model.extend({
    loaded: false,
    defaults: {
      info: {
        author: "meemoo",
        title: "Untitled",
        description: "Meemoo app description",
        parents: [],
        url: ""
      },
      nodes: [],
      edges: []
    },
    usedIds: [],
    edgeCount: 0,
    eventsHistory: [],
    isSubgraph: false,
    // loadingNodes: [],
    initialize: function () {
      // Is this a subgraph?
      var parentGraph = this.get("parentGraph");
      if (parentGraph) {
        this.isSubgraph = true;
        this.parentGraph = parentGraph;
      }
      //
      this.usedIds = [];
      // Convert arrays into Backbone Collections
      if (this.attributes.nodes) {
        var nodes = this.attributes.nodes;
        this.attributes.nodes = new Iframework.Nodes();
        for (var i=0; i<nodes.length; i++) {
          var node = this.makeNode(nodes[i]);
          if (node) {
            this.addNode(node);
          }
        }
      }
      if (this.attributes.edges) {
        var edges = this.attributes.edges;
        this.attributes.edges = new Iframework.Edges();
        for (var j=0; j<edges.length; j++) {
          edges[j].parentGraph = this;
          var edge = new Iframework.Edge(edges[j]);
          this.addEdge(edge);
        }
      }
      this.eventsHistory = new Iframework.EventsHistory();

      var self = this;
      _.defer(function(){
        self.testLoaded();
      });

      // Change event
      this.on("change", this.graphChanged);
    },
    testLoaded: function(){
      var allLoaded = true;
      this.get("nodes").each(function(node){
        if (node.hasOwnProperty("lazyLoadType")) {
          if (!Iframework.NativeNodes.hasOwnProperty(node.lazyLoadType)) {
            // That nativenode's js hasn't loaded yet
            allLoaded = false;
          } else {
            if (node.view && !node.Native) {
              node.view.initializeNative();
            }
          }
        }
      }, this);
      if (allLoaded) {
        this.initializeView();
      }
      return allLoaded;
    },
    initializeView: function() {
      if (!this.view) {
        this.view = new Iframework.GraphView({model:this});
      }
    },
    setInfo: function (key, val) {
      var info = this.get("info");
      info[key] = val;
      this.trigger("change");
    },
    makeNode: function (info) {
      if (!info.src){
        return false;
      }
      info.parentGraph = this;
      var node;
      // Test if image
      if (Iframework.util.isImageURL(info.src)) {
        // Probably an image
        var src = info.src;
        info.src = "meemoo:image/in";
        if (!info.state){
          info.state = {};
        }
        info.state.url = src;
      }
      // Test if native
      var srcSplit = info.src.split(":");
      if (srcSplit.length < 2) {
        // No protocol
        return false;
      }
      if (srcSplit[0] === "meemoo") {
        // Native type node
        var id = srcSplit[srcSplit.length-1];
        var path = id.split("/");
        id = path.join("-");

        // Load js if needed
        // HACK only for loading meemoo:group/node
        //   from src/nodes/group-node.js 
        //   to Iframework.NativeNodes[group-node]
        var self = this;
        if (path[0] && path[1]) {
          yepnope([
            {
              test: Iframework.NativeNodes.hasOwnProperty(path[0]),
              nope: "src/nodes/"+path[0]+".js"
            },
            {
              test: Iframework.NativeNodes.hasOwnProperty(path[0]+"-"+path[1]),
              nope: "src/nodes/"+path[0]+"-"+path[1]+".js",
              complete: function() {
                _.defer(function(){
                  self.testLoaded();
                });
              }
            }
          ]);
        }
        // Native node
        node = new Iframework.NodeBox(info);
        node.lazyLoadType = id;
      } else {
        // Iframe type node
        node = new Iframework.NodeBoxIframe(info);
      }
      return node;
    },
    addNode: function (node) {
      if (!node.cid) {
        // input is not a Iframework.Node model
        node = this.makeNode(node);
        if (!node) {
          return false;
        }
      }

      var count = this.get("nodes").length;
      // Give id if not defined or NaN
      var nodeId = parseInt(node.get('id'), 10);
      if (nodeId !== nodeId) {
        node.set({"id": count});
      }
      // Make sure node id is unique
      while ( this.usedIds.indexOf(node.get('id')) >= 0 ) {
        count++;
        node.set({"id": count});
      }
      this.usedIds.push( node.get('id') );

      var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var randomKey = "";
      for (var i=0; i<5; i++) {
        randomKey += keyStr.charAt( Math.floor(Math.random()*keyStr.length) );
      }

      // Iframework.frameCount works around a FF bug with recycling iframes with the same name
      node.frameIndex = "frame_"+node.get('id')+"_"+(Iframework.frameCount++)+randomKey+"_through";

      this.get("nodes").add(node);

      if (this.view) {
        this.view.addNode(node);
      }

      this.trigger("change");

      return node;
    },
    addEdge: function (edge) {
      // Make sure edge is unique
      var isDupe = this.get("edges").any(function(_edge) {
        return ( _edge.get('source')[0] === edge.get('source')[0] && _edge.get('source')[1] === edge.get('source')[1] && _edge.get('target')[0] === edge.get('target')[0] && _edge.get('target')[1] === edge.get('target')[1] );
      });
      if (isDupe) {
        console.warn("duplicate edge ignored", edge);
        return false;
      } else {
        this.trigger("change");
        return this.get("edges").add(edge);
      }
    },
    remove: function() {
      // Called from IframeworkView.loadGraph
      this.get("nodes").each(function(node){
        node.remove(false);
      });
      if (this.view) {
        this.view.remove();
      }
    },
    removeNode: function (node) {
      var connected = [];

      // Disconnect edges
      this.get("edges").each(function (edge) {
        if (edge.Source && edge.Target) {
          if (edge.Source.parentNode === node || edge.Target.parentNode === node) {
            connected.push(edge);
          }
        }
      }, this);

      _.each(connected, function(edge){
        edge.remove();
      });

      if (this.view) {
        this.view.removeNode(node);
      }

      this.get("nodes").remove(node);

      this.eventsHistory.add( 
        new Iframework.Event({
          action: "removeNode", 
          args: {
            "node": node, 
            "edges": connected
          }
        })
      );

      this.trigger("change");
    },
    removeEdge: function (edge) {
      edge.disconnect();
      this.get("edges").remove(edge);
      if (this.view) {
        this.view.removeEdge(edge);
      }
      this.trigger("change");
    },
    checkLoaded: function () {
      // Called from NodeBoxView.initializeNative()
      for (var i=0; i<this.get("nodes").length; i++) {
        if (this.get("nodes").at(i).loaded === false) { 
          return false; 
        }
      }
      this.loaded = true;
      
      // Connect edges when all modules have loaded (+.5 seconds)
      var self = this;
      setTimeout(function(){
        self.connectEdges();
      }, 500);
      
      return true;
    },
    reconnectEdges: function () {
      for(var i=0; i<this.get("edges").length; i++) {
        // Disconnect them first to be sure not doubled
        this.get("edges").at(i).disconnect();
      }
      // Connect edges when all modules have loaded (+.5 seconds)
      var self = this;
      _.delay(function(){
        self.connectEdges();
      }, 500);
    },
    connectEdges: function () {
      // Connect edges
      this.get("edges").each(function(edge){
        if (!edge.connected) {
          edge.connect();
        }
      });

      // Set state of nodes
      this.get("nodes").each(function(node){
        node.setState();
      });
    },
    graphChanged: function () {
      Iframework.trigger("change", this);
      // if (Iframework.$(".source").is(":visible")) {
      //   window.setTimeout(function(){
      //     Iframework.sourceRefresh();
      //   }, 100);
      // }
    },
    toJSON: function () {
      return {
        info: this.get("info"),
        nodes: this.get("nodes"),
        edges: this.get("edges")
      };
    }
  });
  
  Iframework.Graphs = Backbone.Collection.extend({
    model: Iframework.Graph
  });

});

$(function(){

  var template = 
    '<div class="edges">'+
      '<svg class="edgesSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300"></svg>'+
    '</div>'+
    '<div class="nodes" />'+
    '<div class="iframework-graph-nav" style="display:none;">'+
      '<button class="show-parent-graph">back to parent graph</button>'+
    '</div>';

  Iframework.GraphView = Backbone.View.extend({
    tagName: "div",
    className: "graph",
    template: _.template(template),
    events: {
      "click":           "click",
      "dragenter":       "ignoreDrag",
      "dragover":        "ignoreDrag",
      "drop":            "drop",
      "selectablestart": "selectableStart",
      "selectablestop":  "selectableStop",
      "click .show-parent-graph": "showParentGraph"
    },
    unhidden: false,
    initialize: function () {
      this.render();
      if (this.model.isSubgraph) {
        this.$(".iframework-graph-nav").show();
        this.$el.hide();
      }
      Iframework.$el.prepend(this.el);

      this.edgesSvg = this.$('.edgesSvg')[0];

      // HACK Panel visible?
      if ( Iframework.$(".panel").is(":visible") ){
        this.$el.css("right", "350px");
      }

      this.model.get("nodes").each( this.addNode.bind(this) );

      // Drag helper from module library
      this.$el.droppable({ 
        accept: ".addnode, .canvas, .meemoo-plugin-images-thumbnail"
      });

      // Thanks Stu Cox http://stackoverflow.com/a/14578826/592125
      var supportsTouch = 'ontouchstart' in document;
      if (!supportsTouch) {
        // Selectable messes up scroll on touch devices
        this.$el.selectable({
          filter: ".module",
          delay: 20
        });
      }

      this.resizeEdgeSVG();

    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    renderAnimationFrame: function (timestamp) {
      // Hit all nodes
      this.model.get("nodes").each(function(node){
        if (node.view.Native) {
          node.view.Native.renderAnimationFrame(timestamp);
        }
      });
    },
    click: function (event) {
      // Hide dis/connection boxes
      $(".edge-edit").remove();
      Iframework.selectedPort = null;
      
      // Deactivate modules
      this.$(".module").removeClass("active");
      // Deselect modules
      this.$(".module").removeClass("ui-selected");
    },
    ignoreDrag: function (event) {
      event.originalEvent.stopPropagation();
      event.originalEvent.preventDefault();
    },
    drop: function (event, ui) {
      this.ignoreDrag(event);

      // Drop files
      var dt = event.originalEvent.dataTransfer;
      if (dt) {
        var files = dt.files;
        if ( dt.files.length > 0 ) {
          var file = dt.files[0];
          var split = file.type.split("/");
          var o = {
            x: this.el.scrollLeft + event.originalEvent.clientX + 10,
            y: this.el.scrollTop + event.originalEvent.clientY + 35
          };
          if (split[0]==="image"){
            o.src = "meemoo:image/in";
            o.state = { url: window.URL.createObjectURL( file ) };
            Iframework.shownGraph.addNode( o );
          } else if (split[0]==="video"){
            o.src = "meemoo:video/player";
            o.state = { url: window.URL.createObjectURL( file ) };
            Iframework.shownGraph.addNode( o );
          } else if (split[0]==="text"){
            var reader = new FileReader();
            reader.onload = function(e) {
              o.src = "meemoo:ui/textarea";
              o.state = { value: e.target.result };
              Iframework.shownGraph.addNode( o );
            };
            reader.readAsText(file);
          }
        }
      }

      // Drop images or mods from libraries
      if (!ui) {return false;}

      var type = ui.helper.data("meemoo-drag-type");
      if (!type) {return false;}

      var options = {
        x: Math.round(this.el.scrollLeft + ui.offset.left + 10),
        y: Math.round(this.el.scrollTop + ui.offset.top + 35)
      };

      switch(type){
        case "library-module":
          var module = ui.draggable.data("module");
          if (module) {
            // Add module
            module.view.dragAddNode( options );
          }
          break;
        case "canvas":
          var canvas = ui.helper.data("meemoo-drag-canvas");
          // Copy canvas
          if (canvas) {
            options.src = "meemoo:image/in";
            options.canvas = canvas;
            var url = ui.helper.data("meemoo-image-url");
            if (url && url.slice(0,4)==="http") {
              // Dragged from public image library
              options.state = {};
              options.state.url = url;
            }
            Iframework.shownGraph.addNode( options );
          }
          break;
        default:
          break;
      }
      return false;
    },
    addNode: function (node) {
      this.$(".nodes").append( node.initializeView().el );
      // Render the native view
      if (node.lazyLoadType) {
        node.view.initializeNative();
      }
    },
    addEdge: function (edge) {
      edge.initializeView();

      if (edge.Source.view) {
        edge.Source.view.resetRelatedEdges();
      }
      if (edge.Target.view) {
        edge.Target.view.resetRelatedEdges();
      }
    },
    remove: function(){
      this.$el.remove();
    },
    removeNode: function (node) {
      if (node.view) {
        node.view.remove();
      }
    },
    removeEdge: function (edge) {
      if (edge.Source && edge.Source.view) {
        edge.Source.view.resetRelatedEdges();
      }
      if (edge.Target && edge.Target.view) {
        edge.Target.view.resetRelatedEdges();
      }
      if (edge.view) {
        edge.view.remove();
      }
    },
    resizeEdgeSVG: _.debounce( function () {
      // _.debounce keeps it from getting called more than needed
      var svg = this.$('.edgesSvg')[0];
      // Don't choke on off-screen svg
      var rect;
      try {
        rect = svg.getBBox();
      } catch (e) {
        return;
      }
      var width = rect.x + rect.width + 100;
      var height = rect.y + rect.height + 100;
      if (width === 100 && height === 100) {
        // So wires on new graph show up
        width = this.$el.width();
        height = this.$el.height();
      }
      // Only get bigger
      if (svg.getAttribute("width") < width) {
        svg.setAttribute("width", Math.round(width));
      }
      if (svg.getAttribute("height") < height) {
        svg.setAttribute("height", Math.round(height));
      }
    }, 100),
    selectableStart: function () {
      // Add a mask so that iframes don't steal mouse
      this.maskFrames();
    },
    selectableStop: function (event) {
      // Remove iframe masks
      this.unmaskFrames();
    },
    selectAll: function () {
      this.$(".module").addClass("ui-selected");
    },
    selectNone: function () {
      this.$(".module").removeClass("ui-selected");
    },
    cut: function(){
      // Copy selected
      this.copy();
      var i;
      for (i=0; i<Iframework._copied.nodes.length; i++) {
        // HACK offset cut for pasting in same spot
        Iframework._copied.nodes[i].x -= 50;
        Iframework._copied.nodes[i].y -= 50;
      }
      // Delete selected
      var uiselected = this.$(".module.ui-selected");
      for (i=0; i<uiselected.length; i++) {
        $(uiselected[i]).data("iframework-node-view").removeModel();
      }
    },
    copy: function(){
      var copied = {nodes:[],edges:[]};
      var uiselected = this.$(".module.ui-selected");
      var i, selected;

      // Copy selected nodes
      for (i=0; i<uiselected.length; i++) {
        selected = $(uiselected[i]).data("iframework-node-view").model;
        copied.nodes.push( JSON.parse(JSON.stringify(selected)) );
      }

      // Copy common edges
      this.model.get("edges").each(function(edge){
        var sourceSelected, targetSelected = false;
        for (i=0; i<uiselected.length; i++) {
          selected = $(uiselected[i]).data("iframework-node-view").model;
          if (edge.Source.node === selected) {
            sourceSelected = true;
          }
          if (edge.Target.node === selected) {
            targetSelected = true;
          }
        }
        if (sourceSelected && targetSelected) {
          copied.edges.push( JSON.parse(JSON.stringify(edge)) );
        }
      }, this);
      // Save these to Iframework so can paste to other graphs
      Iframework._copied = copied;
    },
    paste: function(){
      var copied = Iframework._copied;
      if (copied && copied.nodes.length > 0) {
        var newNodes = [];
        // Select none
        this.$(".module").removeClass("ui-selected");
        for (var i=0; i<copied.nodes.length; i++) {
          var oldNode = JSON.parse(JSON.stringify( copied.nodes[i] ));
          // Offset pasted
          oldNode.x += 50;
          oldNode.y += 50;
          oldNode.parentGraph = this.model;
          var newNode = this.model.addNode(oldNode);
          newNode.copiedFrom = oldNode.id;
          newNodes.push(newNode);
          // Select pasted
          if (newNode.view) {
            newNode.view.select();
          }
        }
        // Add edges
        for (var j=0; j<copied.edges.length; j++) {
          var oldEdge = JSON.parse(JSON.stringify( copied.edges[j] ));
          var newEdge = {source:[],target:[]};
          for (var k=0; k<newNodes.length; k++) {
            var node = newNodes[k];
            if (oldEdge.source[0] === node.copiedFrom) {
              newEdge.source[0] = node.id;
            }
            if (oldEdge.target[0] === node.copiedFrom) {
              newEdge.target[0] = node.id;
            }
          }
          newEdge.source[1] = oldEdge.source[1];
          newEdge.target[1] = oldEdge.target[1];
          newEdge.parentGraph = this.model;
          newEdge = new Iframework.Edge( newEdge );
          this.model.addEdge(newEdge);
        }
      }
    },
    maskFrames: function () {
      $(".iframe-type").append( '<div class="iframemask" />' );
    },
    unmaskFrames: function () {
      $(".iframemask").remove();
    },
    showParentGraph: function () {
      if (this.model.parentGraph) {
        Iframework.showGraph( this.model.parentGraph );
      }
    },
    rerenderEdges: function () {
      this.model.get("edges").each(function(edge){
        if (edge.view) {
          edge.view.redraw();
        }
      }, this);
    }
    
  });

});

$(function(){

  Iframework.Node = Backbone.Model.extend({
    send: function (message) {
      // Send message out to connected nodes
    },
    receive: function (message) {
      // Get message from another node
    },
    //iframe only
    sendFromFrame: function(){},
    iframeLoaded: function(){}

  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});

$(function(){

  Iframework.NodeView = Backbone.View.extend({
    send: function(message) {
      this.model.send(message);
    },
    receive: function(message) {
      this.model.receive(message);
    }
  });

});

$(function(){

  Iframework.NodeBox = Iframework.Node.extend({
    loaded: false,
    defaults: function() {
      return {
        src: "",
        x: 100,
        y: 400,
        z: 0,
        w: 200,
        h: 210,
        state: {}
      };
    },
    info: {
      title: "native-node",
      description: "extend me"
    },
    initialize: function () {
      this.Inputs = new Iframework.PortsIn();
      this.Outputs = new Iframework.PortsOut();

      this.parentGraph = this.get("parentGraph");

      // Change event
      this.on("change", this.nodeChanged);
    },
    initializeView: function () {
      // Called from GraphView.addNode
      this.view = new Iframework.NodeBoxView({model:this});
      return this.view;
    },
    send: function (name, value) {
      // Send message out to connected modules
      // Defer to make this safe for infinite loops
      var self = this;
      _.defer(function(){
        self.trigger("send:"+name, value);
      });
    },
    receive: function (name, value) {
      // The listener that hits this is added in the edge
      if (this.view.Native) {
        this.view.Native.receive(name, value);
      }
    },
    infoLoaded: function (info) {
      this.info = info;
      if (this.view) {
        this.view.infoLoaded(info);
      }
    },
    setState: function () {
      var state = this.get("state");
      if (state && this.view.Native){
        for (var name in state) {
          var eqSet = this.setEquation(name, state[name]);
          if (!eqSet) {
            this.receive(name, state[name]);
          }
        }
      }
    },
    addInput: function (info) {
      if (info.id === undefined) {
        info.id = info.name;
      }
      info.parentNode = this;
      // Name must be unique
      var replace = this.Inputs.get(info.id);
      if (replace) {
        replace.set(info);
        return;
      }
      var newPort = new Iframework.PortIn(info);
      newPort.isIn = true;
      newPort.node = this;
      newPort.parentGraph = this.parentGraph;
      this.Inputs.add(newPort);
      if (this.view) {
        this.view.addInput(newPort);
      }
      // Set state to post defaults
      var currentState = this.get("state");
      if ( info.hasOwnProperty("default") && info["default"] !== "" && !currentState.hasOwnProperty(info.name) ) {
        currentState[info.name] = info["default"];
      }
      return newPort;
    },
    addOutput: function (info) {
      if (info.id === undefined) {
        info.id = info.name;
      }
      info.parentNode = this;
      // Name must be unique
      var replace = this.Outputs.get(info.id);
      if (replace) {
        replace.set(info);
        return;
      }
      var newPort = new Iframework.PortOut(info);
      newPort.isIn = false;
      newPort.node = this;
      newPort.parentGraph = this.parentGraph;
      this.Outputs.add(newPort);
      if (this.view) {
        this.view.addOutput(newPort);
      }
      return newPort;
    },
    nodeChanged: function () {
      if (this.parentGraph) {
        this.parentGraph.trigger("change");
      }
    },
    remove: function (fromView) {
      if (fromView) {
        // Called from NodeBoxView.removeModel
        // User initiated undo, so make it undoable
        this.parentGraph.removeNode(this);
      } else {
        // Called from Graph.remove
        // Just remove it
        if (this.view) {
          this.view.remove();
        }
      }
    },
    setValues: function(info) {
      for (var name in info) {
        this.setValue(name, info[name]);
      }
      this.nodeChanged();
    },
    setValue: function(name, value) {
      this.setEquation(name, value);
      this.get("state")[name] = value;
      this.nodeChanged();
    },
    setEquation: function (name, value) {
      if (!this.view.Native) { return; }
      var input = this.Inputs.get(name);
      if (!input) { return; }
      var type = input.get("type");
      if ( type === "int" || type === "float" || type === "number" ) {
        if (value && value.toString().substr(0,1) === "=") {
          this.view.Native.setEquation(name, value.substr(1));
          return true;
        } else {
          this.view.Native.setEquation(name);
        }
      }
    },
    toString: function() {
      if (this.info) {
        return "Native node "+this.get("id")+": "+this.info.title;
      } else {
        return "Native node "+this.get("id");
      }
    },
    toJSON: function () {
      return {
        id: this.id,
        src: this.get("src"),
        x: this.get("x"),
        y: this.get("y"),
        w: this.get("w"),
        h: this.get("h"),
        state: this.get("state")
      };
    }

  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});

$(function(){

  var template = 
    '<div class="module" style="left:<%= get("x")-10 %>px;top:<%= get("y")-30 %>px;width:<%= get("w")+20 %>px;height:<%= get("h")+40 %>px;" >'+
      '<div class="outer"></div>'+
      '<div class="ports ports-in"></div>'+
      '<div class="ports ports-out"></div>'+
      '<h1 class="title">'+
        '<span class="module-icon module-icon-small"></span>'+
        '<span class="node-box-title-name">...</span>'+
      '</h1>'+
      '<button title="show controls" type="button" class="showcontrols icon-left-open"></button>'+
      '<div class="controls">'+
        '<button title="remove module" type="button" class="remove icon-trash"></button>'+
        '<a title="view source" type="button" class="viewsource button icon-cog"></a>'+
        '<button title="hide controls" type="button" class="hidecontrols icon-right-open"></button>'+
      '</div>'+
      '<div class="inner"></div>'+
    '</div>';

  // var innerTemplate = '<div class="info" />';

  Iframework.NodeBoxView = Iframework.NodeView.extend({
    tagName: "div",
    className: "node",
    template: _.template(template),
    // innerTemplate: _.template(innerTemplate),
    events: {
      "dragstart .module":   "dragStart",
      "drag .module":        "drag",
      "dragstop .module":    "dragStop",
      "resizestart .module": "resizestart",
      "resize .module":      "resize",
      "resizestop .module":  "resizestop",
      "mousedown .module, .title": "mousedown",
      "click .module, .title": "click",
      "click .showcontrols": "showControls",
      "click .hidecontrols": "hideControls",
      "click .remove":       "removeModel"
    },
    initialize: function () {
      this.render();
      this.$(".module")
        .data({"iframework-node-view": this})
        .draggable({ 
          handle: "h1",
          helper: function(event) {
            var node = $(this);
            return $('<div class="ui-draggable-helper" style="width:'+node.width()+'px; height:'+node.height()+'px">');
          }
        })
        .resizable({ 
          minHeight: 100, 
          minWidth: 100, 
          helper: "ui-draggable-helper"
        });

      // View source button
      if (this.model.lazyLoadType) {
        this.$(".viewsource").attr({
          "href": "src/nodes/"+this.model.lazyLoadType+".js",
          "target": "_blank"
        });
      } else {
        this.$(".viewsource").hide();
      }

      // Disable selection for better drag+drop
      this.$("h1").disableSelection();

      // Bring newest to top
      this.mousedown();

    },
    initializeNative: function () {
      // Called from GraphView.addNode
      if (!this.Native){
        if (Iframework.NativeNodes.hasOwnProperty(this.model.lazyLoadType)) {
          this.Native = new Iframework.NativeNodes[this.model.lazyLoadType]({model:this.model});
          this.$(".inner").append( this.Native.$el );
          // Check if all modules are loaded
          this.model.loaded = true;
          this.model.parentGraph.checkLoaded();
        } else {
          // console.warn("No native node found.");
        }
      }
    },
    render: function () {
      this.$el.html(this.template(this.model));
      return this;
    },
    infoLoaded: function (info) {
      this.$('h1')
        .attr("title", this.model.get("id") + ": " + (info.author ? "by "+info.author+": " : "" ) + info.description);
      this.$('.node-box-title-name')
        .text(info.title);

      if (this.model.lazyLoadType) {
        this.$(".module-icon").addClass("module-icon-"+this.model.lazyLoadType);
      }
    },
    _alsoDrag: [],
    _dragDelta: {},
    dragStart: function(event, ui){
      if (event.target !== this.$(".module")[0]) { return; }

      // Add a mask so that iframes don't steal mouse
      this.model.parentGraph.view.maskFrames();

      // Select
      if (!this.$(".module").hasClass("ui-selected")){
        this.click(event);
      }

      // Make helper and save start position of all other selected
      var self = this;
      this._alsoDrag = [];
      this.model.parentGraph.view.$(".ui-selected").each(function() {
        if (self.$(".module")[0] !== this) {
          var el = $(this);
          var position = {
            left: parseInt( el.css('left'), 10 ), 
            top: parseInt( el.css('top'), 10 )
          };
          el.data("ui-draggable-alsodrag-initial", position);
          // Add helper
          var helper = $('<div class="ui-draggable-helper">').css({
            width: el.width(),
            height: el.height(),
            left: position.left,
            top: position.top
          });
          el.parent().append(helper);
          el.data("ui-draggable-alsodrag-helper", helper);
          // Add to array
          self._alsoDrag.push(el);
        }
      });
    },
    drag: function(event, ui){
      if (event.target !== this.$(".module")[0]) { return; }

      // Drag other helpers
      if (this._alsoDrag.length) {
        var self = $(event.target).data("ui-draggable");
        var op = self.originalPosition;
        var delta = {
          top: (self.position.top - op.top) || 0, 
          left: (self.position.left - op.left) || 0
        };

        _.each(this._alsoDrag, function(el){
          var initial = el.data("ui-draggable-alsodrag-initial");
          var helper = el.data("ui-draggable-alsodrag-helper");
          helper.css({
            left: initial.left + delta.left,
            top: initial.top + delta.top
          });
        });
      }
    },
    dragStop: function(event, ui){
      if (event.target !== this.$(".module")[0]) { return; }

      var x = parseInt(ui.position.left, 10);
      var y = parseInt(ui.position.top, 10);
      this.moveToPosition(x,y);
      // Also drag
      if (this._alsoDrag.length) {
        _.each(this._alsoDrag, function(el){
          var initial = el.data("ui-draggable-alsodrag-initial");
          var helper = el.data("ui-draggable-alsodrag-helper");
          var node = el.data("iframework-node-view");
          // Move other node
          node.moveToPosition(parseInt(helper.css("left"), 10), parseInt(helper.css("top"), 10));
          // Remove helper
          helper.remove();
          el.data("ui-draggable-alsodrag-initial", null);
          el.data("ui-draggable-alsodrag-helper", null);
        });
        this._alsoDrag = [];
      }

      // Remove iframe masks
      this.model.parentGraph.view.unmaskFrames();
    },
    moveToPosition: function(x, y){
      this.$(".module").css({
        left: x,
        top: y
      });
      this.model.set({
        x: x + 10,
        y: y + 30
      });
    },
    resizestart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      this.model.parentGraph.view.maskFrames();
    },
    resize: function (event, ui) {
    },
    resizestop: function (event, ui) {
      // Remove iframe masks
      this.model.parentGraph.view.unmaskFrames();
      
      // Set model w/h
      var newW = ui.size.width;
      var newH = ui.size.height;
      this.model.set({
        w: newW - 20,
        h: newH - 40
      });
      if (this.Native) {
        this.Native.resize(newW,newH);
      }
      this.model.parentGraph.view.resizeEdgeSVG();
    },
    mousedown: function (event, ui) {
      // Bring to top
      var topZ = 0;
      $("div.module").each(function(){
        var thisZ = Number($(this).css("z-index"));
        if (thisZ > topZ) { 
          topZ = thisZ; 
        }
      });
      this.$(".module")
        .css("z-index", topZ+1);

      if (event) {
        // Don't select
        event.stopPropagation();
      }

    },
    click: function (event) {
      // Select
      if (event.ctrlKey || event.metaKey) {
        // Command key is pressed, toggle selection
        this.$(".module").toggleClass("ui-selected");
      } else {
        // Command key isn't pressed, deselect others and select this one
        this.model.parentGraph.view.$(".ui-selected").removeClass("ui-selected");
        this.$(".module").addClass("ui-selected");
      }

      // Don't fire click on graph
      event.stopPropagation();
    },
    select: function (event) {
      // Called from code
      this.$(".module").addClass("ui-selected");
    },
    addInput: function (port) {
      this.$(".ports-in").append( port.initializeView().el );
    },
    addOutput: function (port) {
      this.$(".ports-out").append( port.initializeView().el );
    },
    showControls: function () {
      this.$(".showcontrols").hide();
      this.$(".controls").show();
    },
    hideControls: function () {
      this.$(".showcontrols").show();
      this.$(".controls").hide();
    },
    removeModel: function () {
      this.model.remove(true);
    },
    remove: function () {
      // Called from GraphView.removeNode
      if (this.Native) {
        this.Native.remove();
      }
      this.$el.remove();
    },
    refresh: function () {
    },
    popout: function () {
    }

  });

});

$(function(){

  var template = '<div class="info" />';

  Iframework.NodeBoxNativeView = Backbone.View.extend({
    tagName: "div",
    className: "nativenode",
    template: _.template(template),
    info: {
      title: "native-node-view",
      description: "extend me"
    },
    inputs: {},
    outputs: {},
    initialize: function () {
      this.render();

      // Info
      this.model.infoLoaded(this.info);

      // Ports
      for (var inputname in this.inputs) {
        if (this.inputs.hasOwnProperty(inputname)) {
          var inInfo = this.inputs[inputname];
          inInfo.name = inputname;
          this.model.addInput(inInfo);
        }
      }
      for (var outputname in this.outputs) {
        if (this.outputs.hasOwnProperty(outputname)) {
          var outInfo = this.outputs[outputname];
          outInfo.name = outputname;
          this.model.addOutput(outInfo);
        }
      }

      this.initializeCategory();
      this.initializeModule();

      return this;
    },
    initializeCategory: function(){
      // for example, override in nodes/image.js
    },
    initializeModule: function(){
      // for example, override in nodes/image-combine.js
    },
    render: function () {
      this.$el.html(this.template(this.model));
      return this;
    },
    redraw: function (timestamp) {
      // Do everything that will cause a redraw here
    },
    _triggerRedraw: false,
    _lastRedraw: 0,
    renderAnimationFrame: function (timestamp) {
      // Get a tick from GraphView.renderAnimationFrame()
      // this._valueChanged is set by NodeBox.receive()
      if (this._triggerRedraw) {
        this._triggerRedraw = false;
        this.redraw(timestamp);
        this._lastRedraw = timestamp;
      }
    },
    set: function (name, value) {
      // Sets own state, use sparingly
      this.model.setValue(name, value);
    },
    send: function (name, value) {
      this.model.send(name, value);
    },
    setEquation: function (name, value) {
      if (!this.equations) {
        this.equations = {};
      }
      if (value) {
        try {
          var expression = Parser.parse(value);
          // var func = expression.toJSFunction();
          this.equations[name] = expression;
          if (value.indexOf('x') === -1) {
            // Without x, evaluate equation as initial information
            this.receive(name, 0);
          }
        } catch (error) {
          // If equation doesn't parse, pass through val
          this.equations[name] = function(vars){return vars.x;};
        }
      } else {
        if (this.equations[name]) {
          this.equations[name] = undefined;
        }
      }
    },
    receive: function (name, value) {
      if (this.equations && this.equations[name]){
        value = this.equations[name].evaluate({x:value});
      }
      if (this["input"+name]){
        this["input"+name](value);
        // Must manually set _triggerRedraw in that function if needed
      } else {
        this["_"+name] = value;
        // Will trigger a NodeBoxNativeView.redraw() on next renderAnimationFrame
        this._triggerRedraw = true;
      }
    },
    toString: function() {
      return "Native view: "+this.model.get("id")+": "+this.info.title;
    },
    resize: function(w,h) {
      // Called from NodeBoxView.resizestop()
    },
    connectEdge: function(edge) {
      // Called from Edge.connect();
    },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
    },
    remove: function(){
      // Called from NodeBoxView.remove();
    }

  });

});

$(function(){

  Iframework.NodeBoxIframe = Iframework.NodeBox.extend({
    initializeView: function () {
      // Called from GraphView.addNode();
      this.view = new Iframework.NodeBoxIframeView({model:this});
      return this.view;
    },
    info: {
      title: "iframe-node",
      description: "extend me"
    },
    sendFromFrame: function (message) {
      var name = message.output;
      var value = message.value;
      // Convert pixels message to canvas
      if (Iframework.util.type(message.value) === "ImageData") {
        value = this.makeCanvas(value);
      }
      this.send(name, value);
    },
    receive: function (name, value) {
      if (this.view && this.view.iframeloaded) {
        // Convert canvas message to pixels
        if (Iframework.util.type(value) === "HTMLCanvasElement") {
          try {
            value = value.getContext("2d").getImageData(0, 0, value.width, value.height);
          } catch (e) {
            // Dirty canvas
            return false;
          }
        }
        var m = {};
        m[name] = value;
        this.view.iframe.contentWindow.postMessage(m, "*");
      } else {
        console.error("wat "+this.id+" "+this.frameIndex);
      }
    },
    setState: function () {
      var state = this.get("state");
      if (state) {
        this.receive({setState: state});
      }
    },
    iframeLoaded: function () {
      this.loaded = true;
      this.parentGraph.checkLoaded();
    },
    toString: function() {
      if (this.info) {
        return "Iframe node "+this.get("id")+": "+this.info.title;
      } else {
        return "Iframe node "+this.get("id");
      }
    },
    makeCanvas: function(imageData) {
      if (!this.canvas) {
        // Make internal canvas to pass
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext('2d');
      }
      if (this.canvas.width !== imageData.width || this.canvas.height !== imageData.height) {
        // Resize if needed
        this.canvas.width = imageData.width;
        this.canvas.height = imageData.height;
      }
      this.context.putImageData(imageData, 0, 0);
      return this.canvas;
    }

  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});

$(function(){

  // var innerTemplate = '<iframe class="iframe" name="<%= frameIndex %>" src="<%= get("src") %>"></iframe>';

  Iframework.NodeBoxIframeView = Iframework.NodeBoxView.extend({
    // innerTemplate: _.template(innerTemplate),
    initialize: function () {
      // "super"
      Iframework.NodeBoxView.prototype.initialize.call(this);

      // Add refresh button
      this.$("button.remove")
        .after(
          $('<button title="reload iframe" type="button" class="refresh icon-cw"></button>')
        );
      // Add refresh event
      this.events["click .refresh"] = "refresh";

      // .inner style for css
      this.$(".inner").addClass("iframe-type");

      var self = this;
      this.iframe.onload = function () {
        self.iframeloaded = true;
      };
    },
    render: function () {
      this.$el.html(this.template(this.model));

      this.iframe = document.createElement("iframe");

      $(this.iframe).attr({
        "class": "iframe",
        "name": this.model.frameIndex,
        "src": this.model.get("src")
      });

      this.$(".inner").html( this.iframe );
      return this;
    },
    refresh: function () {
      this.$("iframe")[0].src = this.model.get("src");
    }

  });

});

$(function(){

  Iframework.Port = Backbone.Model.extend({
    defaults: {
      name: "",
      type: "",
      description: "",
      "default": null
    },
    initialize: function () {
      if (this.get("type")==="") {
        // No type set, connect to anything
        this.set("type", "all");
      }
      this.parentNode = this.get("parentNode");
      // To sanitize data:image/gif types for css class
      // this.set( "type_class", this.get("type").split("/")[0].replace(":", "_") );
      this.set( "type_class", this.get("type").split(":")[0] );
      this.Edges = new Iframework.Edges();

    },
    // Ports keep track of connected edges
    connect: function (edge) {
      this.Edges.add(edge);
    },
    disconnect: function (edge) {
      this.Edges.remove(edge);
    },
    remove: function () {
      // Disconnect edges
      while(this.Edges.length > 0) {
        var edge = this.Edges.at(0);
        this.parentNode.parentGraph.removeEdge(edge);
      }
      // Remove view
      if (this.view) {
        this.view.remove();
      }
    }
  });
  
  Iframework.Ports = Backbone.Collection.extend({
    model: Iframework.Port
  });

});

$(function(){
    
  var popupTemplate =
    '<div class="edge-edit">'+
      '<button title="close" class="close icon-cancel"></button>'+
      '<h2><%= name %> (<%= type %>)</h2>'+
      '<p><%= description %></p>'+
      // '<p><button class="publish-port">Publish</button></p>'+
    '</div>';

  var edgeEditTemplate =
    '<div class="edge-edit-item" id="<%= model.cid %>">'+
      '<span><%= label() %></span>'+
      '<button title="disconnect" class="disconnect icon-scissors" type="button"></button>'+
    '</div>';

  var accepts = {};

  Iframework.PortView = Backbone.View.extend({
    tagName: "div",
    className: "port",
    popupTemplate: _.template(popupTemplate),
    edgeEditTemplate: _.template(edgeEditTemplate),
    events: {
      "mousedown":                   "highlightEdge",
      "click .hole":                 "clickhole",
      "dragstart .hole":             "dragstart",
      "drag .hole, .holehelper":     "drag",
      "dragstop .hole, .holehelper": "dragstop",
      "dragstart .plugend":          "unplugstart",
      "drag .plugend":               "unplugdrag",
      "dragstop .plugend":           "unplugstop",
      "drop":                        "drop",
      "click .disconnect":           "disconnect",
      "submit .manualinput":         "manualinput"
      // "click .publish-port":         "publishPort"
    },
    initialize: function () {
      this.render();
      return this;
    },
    dragstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      this.model.node.parentGraph.view.maskFrames();
      
      // Highlight matching ins or outs
      $("div.ports-"+(this.model.isIn ? "out" : "in")+" span.hole")
        .addClass('fade');
      $("div.ports-"+(this.model.isIn ? "out" : "in")+" span.hole-" + this.model.get('type_class'))
        .addClass('highlight');
      
      // Edge preview
      var edgePreview = new Iframework.EdgeView();
      Iframework.edgePreview = edgePreview;
      this.drag(event, ui);
      this.$('.plugend').show();

      // Don't drag module
      event.stopPropagation();
    },
    drag: function (event, ui) {
      if (Iframework.edgePreview) {
        var dragX = ui.offset.left + Iframework.shownGraph.view.el.scrollLeft;
        var dragY = ui.offset.top + 8 + Iframework.shownGraph.view.el.scrollTop;
        var thisX = this.portOffsetLeft();
        var thisY = this.portOffsetTop();
        
        // Edge preview
        var positions = {
          fromX: (this.model.isIn ? dragX-2 : thisX),
          fromY: (this.model.isIn ? dragY : thisY),
          toX: (this.model.isIn ? thisX : dragX+20),
          toY: (this.model.isIn ? thisY : dragY)
        };
        Iframework.edgePreview.setPositions(positions);
        Iframework.edgePreview.redraw();
      }
      // Don't drag module
      event.stopPropagation();
    },
    dragstop: function (event, ui) {
      // Remove iframe masks
      this.model.node.parentGraph.view.unmaskFrames();

      $(".hole").removeClass("fade highlight");
      
      // Edge preview
      Iframework.edgePreview.remove();
      Iframework.edgePreview = undefined;
      if (this.relatedEdges().length < 1){
        this.$('.plugend').hide();
      }

      // Don't drag module
      event.stopPropagation();
    },
    drop: function (event, ui) {
      // HACK will drop always fire before dragstop?
      if (this.armDelete) {
        // Don't disconnect or reconnect wire dragged back to same port
        this.armDelete = false;
      } else {
        // Connect wire
        var from = $(ui.draggable).data("model");
        var to = this.model;
        var source = (this.model.isIn ? from : to);
        var target = (this.model.isIn ? to : from);
        var edge = new Iframework.Edge({
          source: [source.node.get("id"), source.get("name")],
          target: [target.node.get("id"), target.get("name")],
          parentGraph: this.model.parentGraph
        });
        if (Iframework.edgePreview) {
          edge._color = Iframework.edgePreview._color;
        }
        if (edge.parentGraph.addEdge(edge)){
          edge.connect();
        }
      }
      // Don't bubble
      event.stopPropagation();
    },
    unpluggingEdge: null,
    armDeleteTimeout: null,
    armDelete: false,
    topConnectedEdge: function () {
      var topConnected;
      var topZ = 0;
      _.each(this.relatedEdges(), function(edge){
        if (edge.view._z >= topZ) {
          topZ = edge.view._z;
          topConnected = edge;
        }
      }, this);
      return topConnected;
    },
    unplugstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      this.model.node.parentGraph.view.maskFrames();

      // Find top connected wire
      var lastConnected = this.topConnectedEdge();
      if (!lastConnected) { return false; }

      this.unpluggingEdge = lastConnected;
      this.unpluggingEdge.view.dim();
      if (this.relatedEdges().length===1) {
        this.$(".plugend").hide();
      }

      var thatPort = this.model.isIn ? this.unpluggingEdge.Source : this.unpluggingEdge.Target;
      this.$(".plugend").data("model", thatPort);
      
      // Highlight related ins or outs
      $("div.ports-"+(this.model.isIn ? "in" : "out")+" span.hole-" + this.model.get('type_class'))
        .addClass('highlight');
      
      // Edge preview
      var edgePreview = new Iframework.EdgeView();
      edgePreview.setColor(this.unpluggingEdge.view._color);
      Iframework.edgePreview = edgePreview;

      this.armDelete = true;

      // Don't drag module
      event.stopPropagation();
    },
    unplugdrag: function (event, ui) {
      if (Iframework.edgePreview && this.unpluggingEdge) {
        var dragX = ui.offset.left + Iframework.shownGraph.view.el.scrollLeft;
        var dragY = ui.offset.top + 6 + Iframework.shownGraph.view.el.scrollTop;
        var thatPortView = this.model.isIn ? this.unpluggingEdge.Source.view : this.unpluggingEdge.Target.view;
        var thatX = thatPortView.portOffsetLeft();
        var thatY = thatPortView.portOffsetTop();
        
        // Edge preview
        var positions = {
          fromX: (this.model.isIn ? thatX : dragX-2),
          fromY: (this.model.isIn ? thatY : dragY),
          toX: (this.model.isIn ? dragX+20 : thatX),
          toY: (this.model.isIn ? dragY : thatY)
        };
        Iframework.edgePreview.setPositions(positions);
        Iframework.edgePreview.redraw();
      }
      // Don't drag module
      event.stopPropagation();
    },
    unplugstop: function (event, ui) {
      if (this.armDelete && this.unpluggingEdge) {
        this.model.parentGraph.removeEdge(this.unpluggingEdge);
      } else {
        this.$(".plugend").show();
        this.unpluggingEdge.view.undim();
      }
      this.armDelete = false;
      this.unpluggingEdge = null;

      this.dragstop(event, ui);
    },
    clickhole: function (event) {
      // Hide previous connected edges editor
      $('div.edge-edit').remove();
        
      var hole = this.$(".hole");
          
      // Show connected edges editor
      var isIn = this.model.isIn;
      var portName = this.model.get("name");
  
      var popupEl = this.popupTemplate(this.model.toJSON());
      popupEl = $(popupEl);
      this.$el.append(popupEl);

      // Close button
      popupEl.children("button.close")
        .button({
          icons: {
            primary: "icon-cancel"
          },
          text: false
        })
        .click(function(){
          $('div.edge-edit').remove();
          Iframework.selectedPort = null;
        });

      var typeabbr = this.model.get("type").substring(0,3);
      if (isIn) {
        var showForm = false;
        var inputForm = $('<form />')
          .attr({
            "id": this.model.node.id + "_" + this.model.get("name"),
            "class": "manualinput"
          });
        if (typeabbr === "int" || typeabbr === "num" || typeabbr === "flo" ) {
          showForm = true;
          inputForm.append(
            $("<input />").attr({
              "type": "number",
              "min": hole.data("min"),
              "max": hole.data("max"),
              "step": "any",
              "value": this.model.node.get("state")[this.model.get("name")]
            })
          );
        } else if (typeabbr === "col" || typeabbr === "str") {
          showForm = true;
          inputForm.append(
            $("<input />").attr({
              "type": "text",
              "maxlength": hole.data("max"),
              "value": this.model.node.get("state")[this.model.get("name")]
            })
          );
        } else if (typeabbr === "boo") {
          showForm = true;
          var val = this.model.node.get("state")[this.model.get("name")];
          val = (Boolean(val) && val !== "false");
          inputForm.append(
            $("<input />")
              .attr({
                "type": "checkbox",
                "checked": val
              })
          );
        } else if (typeabbr === "ban") {
          inputForm.append("<label>Send bang:</label> ");
          showForm = true;
        }
        if (showForm) {
          inputForm.append(
            $("<button></button>")
              .html("send")
              .attr({
                "type": "submit",
                "class": "send",
                "title": "send value to module"
              })
              .button({
                icons: {
                  primary: "icon-ok"
                },
                text: false
              })
          );
          popupEl.append(inputForm);
        }
      }
      $("#select_"+this.model.id)
        .button({
          icons: {
            primary: "ui-icon-power"
          }
        });
      if (this.relatedEdges().length > 0) {
        popupEl.append('<h2>disconnect</h2>');
        _.each(this.relatedEdges(), function (edge) {
          var edgeEditEl = this.edgeEditTemplate(edge.view);
          popupEl.append(edgeEditEl);
        }, this);
      }

      // This input's options
      if (this.model.get("options") && this.model.get("options").length > 0) {
        this.$('input').autocomplete({
          minLength: 0,
          source: this.model.get("options")
        });
      }

      // Don't fire click on graph
      event.stopPropagation();
    },
    manualinput: function (event) {
      var inputname = this.model.get("name");
      var val;
      if (this.$(".manualinput").children("input")){
        val = this.$(".manualinput").children("input").val();
      }
      if (this.$(".manualinput").children("input:checkbox").length > 0) {
        if (this.$(".manualinput").children("input:checkbox").is(':checked')) {
          val = true;
        } else {
          val = false;
        }
      }
      if (this.model.get("type") === "int") {
        val = parseInt(val, 10);
      }
      if (this.model.get("type") === "number" || this.model.get("type") === "float") {
        val = parseFloat(val);
      }
      if (val === undefined) {
        val = "!";
      }
      var message = {};
      message[inputname] = val;
      this.model.node.receive(message);
      this.model.node.get("state")[inputname] = val;
      this.model.node.trigger("change");
      // $('div.edge-edit').remove();
      return false;
    },
    disconnect: function (event) {
      //HACK
      var edge = this.model.parentGraph.get("edges").getByCid( $(event.target).parents(".edge-edit-item").attr("id") );
      if (edge) {
        this.model.parentGraph.removeEdge(edge);
      }
      $('div.edge-edit').remove();
      Iframework.selectedPort = null;

      // Don't bubble
      event.stopPropagation();
    },
    portOffsetLeft: function () {
      var holeoffset = this.$('.hole').offset();
      if (holeoffset) {
        // HACK
        return holeoffset.left + 7 + this.model.parentNode.parentGraph.view.el.scrollLeft;
      } else {
        return 0;
      }
    },
    portOffsetTop: function () {
      var holeoffset = this.$('.hole').offset();
      if (holeoffset) {
        // HACK
        return holeoffset.top + 10 + this.model.parentNode.parentGraph.view.el.scrollTop;
      } else {
        return 0;
      }
    },
    _relatedEdges: null,
    relatedEdges: function () {
      // Resets to null on dis/connect
      if ( this._relatedEdges === null ) {
        this._relatedEdges = this.model.parentGraph.get("edges").filter( function (edge) {
          return ( edge.Source === this.model || edge.Target === this.model );
        }, this);
        // Toggle plugends
        if (this._relatedEdges.length >= 1) {
          this.$(".plugend").show();
        } else {
          this.$(".plugend").hide();
        }
        this.model.node.view.resetRelatedEdges();
      }
      return this._relatedEdges;
    },
    resetRelatedEdges: function () {
      this._relatedEdges = null;
      this.relatedEdges();
    },
    highlightEdge: function () {
      if (this.relatedEdges().length > 0) {
        // Find top connected wire
        var topConnected = this.topConnectedEdge();
        if (topConnected && topConnected.view) {
          topConnected.view.highlight();
        }
      }
    },
    highlight: function () {
      // Called by edge view
      var plugend = this.$(".plugend");
      plugend.addClass("highlight");
      setTimeout(function(){
        plugend.removeClass("highlight");
      }, 1000);
    },
    publishPort: function () {
      // i/o
    }//,
    // remove: function () {
    // }

  });

});

$(function(){

  Iframework.PortIn = Iframework.Port.extend({
    defaults: {
      name: "",
      type: "",
      description: "",
      "default": null
    },
    initializeView: function () {
      this.view = new Iframework.PortInView({model:this});
      return this.view;
    }
  });
  
  Iframework.PortsIn = Backbone.Collection.extend({
    model: Iframework.PortIn
  });

});

$(function(){

  var portInTemplate = 
    '<div class="portshown portshown-in">'+
      '<span class="hole hole-in hole-<%= type_class %> icon-login"></span>'+
      '<span class="label"><%= name %></span>'+
    '</div>'+
    '<span class="plugend plugend-in plugend-<%= type_class %>"></span>';

  Iframework.PortInView = Iframework.PortView.extend({
    tagName: "div",
    className: "port",
    portInTemplate: _.template(portInTemplate),
    events: {
      "mousedown":                   "highlightEdge",
      "click .hole":                 "clickhole",
      "dragstart .hole":             "dragstart",
      "drag .hole, .holehelper":     "drag",
      "dragstop .hole, .holehelper": "dragstop",
      "dragstart .plugend":          "unplugstart",
      "drag .plugend":               "unplugdrag",
      "dragstop .plugend":           "unplugstop",
      "drop":                        "drop",
      "click .disconnect":           "disconnect",
      "submit .manualinput":         "manualinput"
      // "click .publish-port":         "publishPort"
    },
    render: function () {
      this.$el.html( this.portInTemplate(this.model.toJSON()) );
      this.$el.addClass("port-in");
      this.$(".hole")
        .draggable({
          helper: function (e) {
            return $('<span class="holehelper holehelper-out" />');
          }
        });
      this.$(".plugend")
        .draggable({
          helper: function (e) {
            return $('<span class="plugendhelper plugendhelper-in" />');
          }
        });

      // Drag from hole
      this.$(".hole")
        .data({
          model: this.model
        });
        
      // The whole port is droppable
      var accept = "";
      var type = this.model.get("type_class");
      if (type === "all" || type === "bang"){
        // Anything can hit an in bang
        accept = ".hole-out, .plugend-in";
      } else {
        accept = ".hole-out.hole-all, .hole-out.hole-"+type+", .plugend-in.plugend-all, .plugend-in.plugend-"+type;
      }
      if (type === "string"){
        // HACK to allow int and float -> string
        accept += ", .hole-out.hole-int, .hole-out.hole-float, .plugend-in.plugend-int, .plugend-in.plugend-float";
      }
      if (type === "int" || type === "float" || type === "number") {
        // HACK to allow all int float number to connect
        accept += ", .hole-out.hole-int, .hole-out.hole-float, .hole-out.hole-number, .plugend-in.plugend-int, .plugend-in.plugend-float, .plugend-in.plugend-number";
      }
      this.$el.droppable({
        "hoverClass": "drophover",
        "accept": accept
      });

      this.$(".plugend").hide();

      // Disable selection for better drag+drop
      this.$(".portshown").disableSelection();
      
    },
    dragstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      this.model.node.parentGraph.view.maskFrames();
      
      // Highlight matching ins or outs
      $("div.ports-"+(this.model.isIn ? "out" : "in")+" span.hole")
        .addClass('fade');
      $("div.ports-"+(this.model.isIn ? "out" : "in")+" span.hole-" + this.model.get('type_class'))
        .addClass('highlight');
      
      // Edge preview
      var edgePreview = new Iframework.EdgeView();
      Iframework.edgePreview = edgePreview;
      this.drag(event, ui);
      this.$('.plugend').show();

      // Don't drag module
      event.stopPropagation();
    },
    drag: function (event, ui) {
      if (Iframework.edgePreview) {
        var dragX = ui.offset.left + Iframework.shownGraph.view.el.scrollLeft;
        var dragY = ui.offset.top + 8 + Iframework.shownGraph.view.el.scrollTop;
        var thisX = this.portOffsetLeft();
        var thisY = this.portOffsetTop();
        
        // Edge preview
        var positions = {
          fromX: (this.model.isIn ? dragX-2 : thisX),
          fromY: (this.model.isIn ? dragY : thisY),
          toX: (this.model.isIn ? thisX : dragX+20),
          toY: (this.model.isIn ? thisY : dragY)
        };
        Iframework.edgePreview.setPositions(positions);
        Iframework.edgePreview.redraw();
      }
      // Don't drag module
      event.stopPropagation();
    },
    dragstop: function (event, ui) {
      // Remove iframe masks
      this.model.node.parentGraph.view.unmaskFrames();

      $(".hole").removeClass("fade highlight");
      
      // Edge preview
      Iframework.edgePreview.remove();
      Iframework.edgePreview = undefined;
      if (this.relatedEdges().length < 1){
        this.$('.plugend').hide();
      }

      // Don't drag module
      event.stopPropagation();
    },
    drop: function (event, ui) {
      // HACK will drop always fire before dragstop?
      if (this.armDelete) {
        // Don't disconnect or reconnect wire dragged back to same port
        this.armDelete = false;
      } else {
        // Connect wire
        var from = $(ui.draggable).data("model");
        var to = this.model;
        var source = (this.model.isIn ? from : to);
        var target = (this.model.isIn ? to : from);
        var edge = new Iframework.Edge({
          source: [source.node.id, source.id],
          target: [target.node.id, target.id],
          parentGraph: this.model.parentNode.parentGraph
        });
        if (Iframework.edgePreview) {
          edge._color = Iframework.edgePreview._color;
        }
        if (edge.parentGraph.addEdge(edge)){
          edge.connect();
        }
      }
      // Don't bubble
      event.stopPropagation();
    },
    unpluggingEdge: null,
    armDeleteTimeout: null,
    armDelete: false,
    topConnectedEdge: function () {
      var topConnected;
      var topZ = 0;
      _.each(this.relatedEdges(), function(edge){
        if (edge.view._z >= topZ) {
          topZ = edge.view._z;
          topConnected = edge;
        }
      }, this);
      return topConnected;
    },
    unplugstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      this.model.node.parentGraph.view.maskFrames();

      // Find top connected wire
      var lastConnected = this.topConnectedEdge();
      if (!lastConnected) { return false; }

      this.unpluggingEdge = lastConnected;
      this.unpluggingEdge.view.dim();
      if (this.relatedEdges().length===1) {
        this.$(".plugend").hide();
      }

      var thatPort = this.model.isIn ? this.unpluggingEdge.Source : this.unpluggingEdge.Target;
      this.$(".plugend").data("model", thatPort);
      
      // Highlight related ins or outs
      $("div.ports-"+(this.model.isIn ? "in" : "out")+" span.hole-" + this.model.get('type_class'))
        .addClass('highlight');
      
      // Edge preview
      var edgePreview = new Iframework.EdgeView();
      edgePreview.setColor(this.unpluggingEdge.view._color);
      Iframework.edgePreview = edgePreview;

      this.armDelete = true;

      // Don't drag module
      event.stopPropagation();
    },
    unplugdrag: function (event, ui) {
      if (Iframework.edgePreview && this.unpluggingEdge) {
        var dragX = ui.offset.left + Iframework.shownGraph.view.el.scrollLeft;
        var dragY = ui.offset.top + 6 + Iframework.shownGraph.view.el.scrollTop;
        var thatPortView = this.model.isIn ? this.unpluggingEdge.Source.view : this.unpluggingEdge.Target.view;
        var thatX = thatPortView.portOffsetLeft();
        var thatY = thatPortView.portOffsetTop();
        
        // Edge preview
        var positions = {
          fromX: (this.model.isIn ? thatX : dragX-2),
          fromY: (this.model.isIn ? thatY : dragY),
          toX: (this.model.isIn ? dragX+20 : thatX),
          toY: (this.model.isIn ? dragY : thatY)
        };
        Iframework.edgePreview.setPositions(positions);
        Iframework.edgePreview.redraw();
      }
      // Don't drag module
      event.stopPropagation();
    },
    unplugstop: function (event, ui) {
      if (this.armDelete && this.unpluggingEdge) {
        this.model.parentGraph.removeEdge(this.unpluggingEdge);
      } else {
        this.$(".plugend").show();
        this.unpluggingEdge.view.undim();
      }
      this.armDelete = false;
      this.unpluggingEdge = null;

      this.dragstop(event, ui);
    },
    clickhole: function (event) {
      // Hide previous connected edges editor
      $('div.edge-edit').remove();
        
      var hole = this.$(".hole");
          
      // Show connected edges editor
      var isIn = this.model.isIn;
      var portName = this.model.get("name");
      
      var popupEl = this.popupTemplate(this.model.toJSON());
      popupEl = $(popupEl);
      this.$el.append(popupEl);

      // Close button
      popupEl.children("button.close")
        .click(function(){
          $('div.edge-edit').remove();
          Iframework.selectedPort = null;
        });

      var typeabbr = this.model.get("type").substring(0,3);

      var showForm = false;
      var inputForm = $('<form />')
        .attr({
          "id": this.model.node.id + "_" + this.model.get("name"),
          "class": "manualinput",
          "novalidate": ""
        });
      if (typeabbr === "int" || typeabbr === "num" || typeabbr === "flo" ) {
        showForm = true;
        inputForm.append(
          $("<input />").attr({
            // "type": "number",
            // "min": hole.data("min"),
            // "max": hole.data("max"),
            // "step": "any",
            "value": this.model.node.get("state")[this.model.get("name")],
            "title": 'use equations like "=x*100" to change all incoming values'
          })
        );
      } else if (typeabbr === "col") {
        // Use the spectrum event instead of standard form submit
        showForm = true;
        var color = this.model.node.get("state")[this.model.get("name")];
        var input = $("<input />")
          .attr({
            "type": "text",
            "maxlength": 140,
            "value": color,
            "style": "width: 90%"
          });
        inputForm.append( input );
        // Has to be after added to page
        var self = this;
        input
          .spectrum({
            // color: color,
            showInitial: true,
            showInput: true,
            showAlpha: true,
            showPalette: true,
            palette: [
              Iframework.wireColors,
              ["red", "green", "blue", "purple", "cyan", "magenta", "yellow"],
              ["black", "#333", "#666", "#999", "#AAA", "#CCC", "white"]
            ],
            showSelectionPalette: true,
            localStorageKey: "iframework.settings.colorPalette",
            change: function(color) {
              // TODO change to toString when https://github.com/bgrins/spectrum/issues/92 fixed
              var str = color.toRgbString(); 
              input.val( str );
              self.model.node.receive(portName, str);
              self.model.node.setValue(portName, str);
            },
            hide: function(color) {
              input.show();
            },
            beforeShow: function () {
              input.spectrum("set", input.val());
              input.hide();
            }
          })
          .show(); // Unhide
      } else if (typeabbr === "str") {
        showForm = true;
        inputForm.append(
          $("<input />").attr({
            "type": "text",
            "maxlength": hole.data("max"),
            "value": this.model.node.get("state")[this.model.get("name")]
          })
        );
      } else if (typeabbr === "arr") {
        showForm = true;
        var a = this.model.node.get("state")[this.model.get("name")];
        if (Iframework.util.type(a) !== "array") { a = []; }
        var s = "";
        for (var i=0; i<a.length; i++) {
          s += (i>0 ? ", " : "") + a[i];
        }
        inputForm.append(
          $("<input />").attr({
            "type": "text",
            "value": s
          })
        );
      } else if (typeabbr === "boo") {
        showForm = true;
        var val = this.model.node.get("state")[this.model.get("name")];
        val = (Boolean(val) && val !== "false");
        inputForm.append(
          $("<input />")
            .attr({
              "type": "checkbox",
              "checked": val
            })
        );
      } else if (typeabbr === "ban") {
        inputForm.append("<label>Send bang:</label> ");
        showForm = true;
      }
      if (showForm) {
        inputForm.append(
          $("<button></button>")
            .attr({
              "type": "submit",
              "class": "send icon-ok",
              "title": "send value to module"
            })
        );
        popupEl.append(inputForm);
      }
        
      $("#select_"+this.model.id)
        .button({
          icons: {
            primary: "ui-icon-power"
          }
        });
      if (this.relatedEdges().length > 0) {
        popupEl.append('<h2>disconnect</h2>');
        _.each(this.relatedEdges(), function (edge) {
          var edgeEditEl = this.edgeEditTemplate(edge.view);
          popupEl.append(edgeEditEl);
        }, this);
      }

      // This input's options
      if (this.model.get("options") && this.model.get("options").length > 0) {
        this.$('input').autocomplete({
          minLength: 0,
          source: this.model.get("options")
        });
      }

      // Don't fire click on graph
      event.stopPropagation();
    },
    manualinput: function (event) {
      var inputname = this.model.get("name");
      var type = this.model.get("type");
      var typeabbr = type.substring(0,3);

      var val;
      var saveToState = true;
      if (this.$(".manualinput").children("input")){
        val = this.$(".manualinput").children("input").val();
      }
      if (this.$(".manualinput").children("input:checkbox").length > 0) {
        if (this.$(".manualinput").children("input:checkbox").is(':checked')) {
          val = true;
        } else {
          val = false;
        }
      }
      if (type === "int" || type === "number" || type === "float") {
        if (typeof val === "string" && val.toString().substr(0,1)==="=") {
          // Try to parse equation
        } else if (type === "int") {
          val = parseInt(val, 10);
        } else if (type === "number" || type === "float") {
          val = parseFloat(val);
        }
      }
      if (typeabbr === "arr") {
        try {
          val = JSON.parse( "[" + val + "]" );
        } catch (error) {
          // boo
          return false;
        }
      }
      if (val === undefined) {
        // Bang
        val = "!";
        saveToState = false;
      }
      if (saveToState) {
        this.model.node.setValue(inputname, val);
      }
      this.model.node.receive(inputname, val);
      return false;
    },
    disconnect: function (event) {
      //HACK
      var edge = this.model.parentGraph.get("edges").getByCid( $(event.target).parents(".edge-edit-item").attr("id") );
      if (edge) {
        this.model.parentGraph.removeEdge(edge);
      }
      $('div.edge-edit').remove();
      Iframework.selectedPort = null;

      // Don't bubble
      event.stopPropagation();
    },
    _relatedEdges: null,
    relatedEdges: function () {
      // Resets to null on dis/connect
      if ( this._relatedEdges === null ) {
        this._relatedEdges = this.model.parentGraph.get("edges").filter( function (edge) {
          return ( edge.Source === this.model || edge.Target === this.model );
        }, this);
        // Toggle plugends
        if (this._relatedEdges.length >= 1) {
          this.$(".plugend").show();
        } else {
          this.$(".plugend").hide();
        }
        // this.model.node.view.resetRelatedEdges();
      }
      return this._relatedEdges;
    },
    resetRelatedEdges: function () {
      this._relatedEdges = null;
      this.relatedEdges();
    },
    highlightEdge: function () {
      if (this.relatedEdges().length > 0) {
        // Find top connected wire
        var topConnected = this.topConnectedEdge();
        if (topConnected && topConnected.view) {
          topConnected.view.highlight();
        }
      }
    },
    highlight: function () {
      // Called by edge view
      var plugend = this.$(".plugend");
      plugend.addClass("highlight");
      setTimeout(function(){
        plugend.removeClass("highlight");
      }, 1000);
    },
    publishPort: function () {
      // Make breakout
      var breakout = this.model.parentNode.parentGraph.addNode({
        src: "meemoo:subgraph/input",
        x: 100,
        y: 100,
        w: 80,
        h: 60,
        state: {
          label: this.model.id
        },
        parentGraph: this.model.parentNode.parentGraph
      });
      // Connect edge
      var edge = new Iframework.Edge({
        source: [breakout.id, "data"], 
        target: [this.model.parentNode.id, this.model.id],
        parentGraph: this.model.parentNode.parentGraph
      });
      this.model.parentNode.parentGraph.addEdge( edge );
    }

  });

});

$(function(){

  Iframework.PortOut = Iframework.Port.extend({
    defaults: {
      name: "",
      type: "",
      description: "",
      "default": null
    },
    initializeView: function () {
      this.view = new Iframework.PortOutView({model:this});
      return this.view;
    }
  });
  
  Iframework.PortsOut = Backbone.Collection.extend({
    model: Iframework.PortOut
  });

});

$(function(){
    
  var portOutTemplate = 
    '<div class="portshown portshown-out">'+
      '<span class="label"><%= name %></span>'+
      '<span class="hole hole-out hole-<%= type_class %> icon-logout"></span>'+
    '</div>'+
    '<span class="plugend plugend-out plugend-<%= type_class %>"></span>';
    
  // var popupTemplate =
  //   '<div class="edge-edit">'+
  //     '<button class="close">close</button>'+
  //     '<h2><%= name %> (<%= type %>)</h2>'+
  //     '<p><%= description %></p>'+
  //   '</div>';

  // var edgeEditTemplate =
  //   '<div class="edge-edit-item" id="<%= model.cid %>">'+
  //     '<span><%= label() %></span>'+
  //     '<button class="disconnect" type="button">disconnect</button>'+
  //   '</div>';

  Iframework.PortOutView = Iframework.PortView.extend({
    tagName: "div",
    className: "port",
    portOutTemplate: _.template(portOutTemplate),
    // popupTemplate: _.template(popupTemplate),
    // edgeEditTemplate: _.template(edgeEditTemplate),
    events: {
      "mousedown":                   "highlightEdge",
      "click .hole":                 "clickhole",
      "dragstart .hole":             "dragstart",
      "drag .hole, .holehelper":     "drag",
      "dragstop .hole, .holehelper": "dragstop",
      "dragstart .plugend":          "unplugstart",
      "drag .plugend":               "unplugdrag",
      "dragstop .plugend":           "unplugstop",
      "drop":                        "drop",
      "click .disconnect":           "disconnect"
      // "click .publish-port":         "publishPort"
    },
    render: function () {
      this.$el.html( this.portOutTemplate(this.model.toJSON()) );
      this.$el.addClass("port-out");
      this.$(".hole")
        .draggable({
          helper: function (e) {
            return $('<span class="holehelper holehelper-in" />');
          }
        });
      this.$(".plugend")
        .draggable({
          helper: function (e) {
            return $('<span class="plugendhelper plugendhelper-out" />');
          }
        });

      // Drag from hole
      this.$(".hole")
        .data({
          model: this.model
        });
        
      // The whole port is droppable
      var accept = "";
      var type = this.model.get("type_class");
      if (type === "all"){
        accept = ".hole-in, .plugend-out";
      } else {
        accept = ".hole-in.hole-all, .hole-in.hole-"+type+", .plugend-out.plugend-all, .plugend-out.plugend-"+type;
        // Anything can hit an in bang
        accept += ", .hole-in.hole-bang, .plugend-out.plugend-string";
      }
      if (type === "int" || type === "float" || type === "number") {
        // Allow int and float -> string
        accept += ", .hole-in.hole-string, .plugend-out.plugend-string";
        // Allow all int float number to connect
        accept += ", .hole-in.hole-int, .hole-in.hole-float, .hole-out.hole-number, .plugend-out.plugend-int, .plugend-out.plugend-float, .plugend-out.plugend-number";
      }
      this.$el.droppable({
        "hoverClass": "drophover",
        "accept": accept
      });

      this.$(".plugend").hide();

      // Disable selection for better drag+drop
      this.$(".portshown").disableSelection();
      
    },
    dragstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      this.model.node.parentGraph.view.maskFrames();
      
      // Highlight matching ins or outs
      $("div.ports-"+(this.model.isIn ? "out" : "in")+" span.hole")
        .addClass('fade');
      $("div.ports-"+(this.model.isIn ? "out" : "in")+" span.hole-" + this.model.get('type_class'))
        .addClass('highlight');
      
      // Edge preview
      var edgePreview = new Iframework.EdgeView();
      Iframework.edgePreview = edgePreview;
      this.drag(event, ui);
      this.$('.plugend').show();

      // Don't drag module
      event.stopPropagation();
    },
    drag: function (event, ui) {
      if (Iframework.edgePreview) {
        var dragX = ui.offset.left + Iframework.shownGraph.view.el.scrollLeft;
        var dragY = ui.offset.top + 8 + Iframework.shownGraph.view.el.scrollTop;
        var thisX = this.portOffsetLeft();
        var thisY = this.portOffsetTop();
        
        // Edge preview
        var positions = {
          fromX: (this.model.isIn ? dragX-2 : thisX),
          fromY: (this.model.isIn ? dragY : thisY),
          toX: (this.model.isIn ? thisX : dragX+20),
          toY: (this.model.isIn ? thisY : dragY)
        };
        Iframework.edgePreview.setPositions(positions);
        Iframework.edgePreview.redraw();
      }
      // Don't drag module
      event.stopPropagation();
    },
    dragstop: function (event, ui) {
      // Remove iframe masks
      this.model.node.parentGraph.view.unmaskFrames();

      $(".hole").removeClass("fade highlight");
      
      // Edge preview
      Iframework.edgePreview.remove();
      Iframework.edgePreview = undefined;
      if (this.relatedEdges().length < 1){
        this.$('.plugend').hide();
      }

      // Don't drag module
      event.stopPropagation();
    },
    drop: function (event, ui) {
      // HACK will drop always fire before dragstop?
      if (this.armDelete) {
        // Don't disconnect or reconnect wire dragged back to same port
        this.armDelete = false;
      } else {
        // Connect wire
        var from = $(ui.draggable).data("model");
        var to = this.model;
        var source = (this.model.isIn ? from : to);
        var target = (this.model.isIn ? to : from);
        var edge = new Iframework.Edge({
          source: [source.node.id, source.id],
          target: [target.node.id, target.id],
          parentGraph: this.model.parentNode.parentGraph
        });
        if (Iframework.edgePreview) {
          edge._color = Iframework.edgePreview._color;
        }
        if (edge.parentGraph.addEdge(edge)){
          edge.connect();
        }
      }
      // Don't bubble
      event.stopPropagation();
    },
    unpluggingEdge: null,
    armDeleteTimeout: null,
    armDelete: false,
    topConnectedEdge: function () {
      var topConnected;
      var topZ = 0;
      _.each(this.relatedEdges(), function(edge){
        if (edge.view && edge.view._z >= topZ) {
          topZ = edge.view._z;
          topConnected = edge;
        }
      }, this);
      return topConnected;
    },
    unplugstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      this.model.node.parentGraph.view.maskFrames();

      // Find top connected wire
      var lastConnected = this.topConnectedEdge();
      if (!lastConnected) { return false; }

      this.unpluggingEdge = lastConnected;
      this.unpluggingEdge.view.dim();
      if (this.relatedEdges().length===1) {
        this.$(".plugend").hide();
      }

      var thatPort = this.model.isIn ? this.unpluggingEdge.Source : this.unpluggingEdge.Target;
      this.$(".plugend").data("model", thatPort);
      
      // Highlight related ins or outs
      $("div.ports-"+(this.model.isIn ? "in" : "out")+" span.hole-" + this.model.get('type_class'))
        .addClass('highlight');
      
      // Edge preview
      var edgePreview = new Iframework.EdgeView();
      edgePreview.setColor(this.unpluggingEdge.view._color);
      Iframework.edgePreview = edgePreview;

      this.armDelete = true;

      // Don't drag module
      event.stopPropagation();
    },
    unplugdrag: function (event, ui) {
      if (Iframework.edgePreview && this.unpluggingEdge) {
        var dragX = ui.offset.left + Iframework.shownGraph.view.el.scrollLeft;
        var dragY = ui.offset.top + 6 + Iframework.shownGraph.view.el.scrollTop;
        var thatPortView = this.model.isIn ? this.unpluggingEdge.Source.view : this.unpluggingEdge.Target.view;
        var thatX = thatPortView.portOffsetLeft();
        var thatY = thatPortView.portOffsetTop();
        
        // Edge preview
        var positions = {
          fromX: (this.model.isIn ? thatX : dragX-2),
          fromY: (this.model.isIn ? thatY : dragY),
          toX: (this.model.isIn ? dragX+20 : thatX),
          toY: (this.model.isIn ? dragY : thatY)
        };
        Iframework.edgePreview.setPositions(positions);
        Iframework.edgePreview.redraw();
      }
      // Don't drag module
      event.stopPropagation();
    },
    unplugstop: function (event, ui) {
      if (this.armDelete && this.unpluggingEdge) {
        this.model.parentGraph.removeEdge(this.unpluggingEdge);
      } else {
        this.$(".plugend").show();
        this.unpluggingEdge.view.undim();
      }
      this.armDelete = false;
      this.unpluggingEdge = null;

      this.dragstop(event, ui);
    },
    clickhole: function (event) {
      // Hide previous connected edges editor
      $('div.edge-edit').remove();
        
      var hole = this.$(".hole");
          
      // Show connected edges editor
      var isIn = this.model.isIn;
      var portName = this.model.get("name");
      
      var popupEl = this.popupTemplate(this.model.toJSON());
      popupEl = $(popupEl);
      this.$el.append(popupEl);

      // Close button
      popupEl.children("button.close")
        .click(function(){
          $('div.edge-edit').remove();
          Iframework.selectedPort = null;
        });

      var typeabbr = this.model.get("type").substring(0,3);
      
      $("#select_"+this.model.id)
        .button({
          icons: {
            primary: "ui-icon-power"
          }
        });
      if (this.relatedEdges().length > 0) {
        popupEl.append('<h2>disconnect</h2>');
        _.each(this.relatedEdges(), function (edge) {
          var edgeEditEl = this.edgeEditTemplate(edge.view);
          popupEl.append(edgeEditEl);
        }, this);
      }

      // This input's options
      if (this.model.get("options") && this.model.get("options").length > 0) {
        this.$('input').autocomplete({
          minLength: 0,
          source: this.model.get("options")
        });
      }

      // Don't fire click on graph
      event.stopPropagation();
    },
    disconnect: function (event) {
      //HACK
      var edge = this.model.parentGraph.get("edges").getByCid( $(event.target).parents(".edge-edit-item").attr("id") );
      if (edge) {
        this.model.parentGraph.removeEdge(edge);
      }
      $('div.edge-edit').remove();
      Iframework.selectedPort = null;

      // Don't bubble
      event.stopPropagation();
    },
    _relatedEdges: null,
    relatedEdges: function () {
      // Resets to null on dis/connect
      if ( this._relatedEdges === null ) {
        this._relatedEdges = this.model.parentGraph.get("edges").filter( function (edge) {
          return ( edge.Source === this.model || edge.Target === this.model );
        }, this);
        // Toggle plugends
        if (this._relatedEdges.length >= 1) {
          this.$(".plugend").show();
        } else {
          this.$(".plugend").hide();
        }
        // this.model.node.view.resetRelatedEdges();
      }
      return this._relatedEdges;
    },
    resetRelatedEdges: function () {
      this._relatedEdges = null;
      this.relatedEdges();
    },
    highlightEdge: function () {
      if (this.relatedEdges().length > 0) {
        // Find top connected wire
        var topConnected = this.topConnectedEdge();
        if (topConnected && topConnected.view) {
          topConnected.view.highlight();
        }
      }
    },
    highlight: function () {
      // Called by edge view
      var plugend = this.$(".plugend");
      plugend.addClass("highlight");
      setTimeout(function(){
        plugend.removeClass("highlight");
      }, 1000);
    },
    publishPort: function () {
      // Make breakout
      var breakout = this.model.parentNode.parentGraph.addNode({
        src: "meemoo:subgraph/output",
        x: 500,
        y: 500,
        w: 80,
        h: 60,
        state: {
          label: this.model.id
        },
        parentGraph: this.model.parentNode.parentGraph
      });
      // Connect edge
      var edge = new Iframework.Edge({
        source: [this.model.parentNode.id, this.model.id], 
        target: [breakout.id, "data"],
        parentGraph: this.model.parentNode.parentGraph
      });
      this.model.parentNode.parentGraph.addEdge( edge );
    }

  });

});

// Module is used for Iframework.Library and has info about ins and outs
// Node is used by Graph, and has info about x, y, w, h

$(function(){

  Iframework.Module = Backbone.Model.extend({
    defaults: {
      "src": "",
      "info": {}
    },
    initialize: function () {
      var srcSplit = this.get("src").split(":");
      this.isNative = (srcSplit[0] === "meemoo");
      if (this.isNative) {
        this.groupAndName = srcSplit[1].split("/");
      }
    },
    initializeView: function () {
      if (!this.view) {
        this.view = new Iframework.ModuleView({model:this});
      }
      return this.view;
    },
    toJSON: function () {
      return {
        "src": this.get("src"),
        "info": this.get("info")
      };
    }
  });
  
  Iframework.Modules = Backbone.Collection.extend({
    model: Iframework.Module,
    findOrAdd: function (node) {
      var module;
      module = this.find(function(module){
        return module.get("src") === node.get("src");
      });
      if (!module) {
        module = new Iframework.Module({"node":node});
        this.add(module);
      }
      return module;
    }
  });

});

$(function(){

  var template = 
    '<div class="addnode button module-icon" title="<%= info.description %>"></div>' +
    '<h2 class="title" title="<%= src %>"><%= info.title %></h2>';

  Iframework.ModuleView = Backbone.View.extend({
    tagName: "div",
    className: "library-module",
    template: _.template(template),
    events: {
      "click .addnode":     "addNode",
      "dragstart .addnode": "dragStart",
      "dragstop .addnode":  "dragStop"
    },
    initialize: function () {
      this.render();

      var self = this;
      this.$(".addnode")
        .data({module: this.model})
        .draggable({
          helper: function () {
            var h = $('<div class="addnode-drag-helper module-icon" />')
              .data({
                "meemoo-drag-type": "library-module"
              });
              // .text( self.model.get("info")["title"]);
            if (self.model.isNative) {
              h.addClass("module-icon-"+self.model.groupAndName[0]+"-"+self.model.groupAndName[1]);
            }
            $(".app").append(h);
            return h;
          }
        });
      
      if (this.model.isNative) {
        this.$(".addnode").addClass("module-icon-"+this.model.groupAndName[0]+"-"+this.model.groupAndName[1]);
      }

      return this;
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
    },
    addNode: function(options) {
      Iframework.$(".addbyurlinput").val( this.model.get("src") );
      Iframework.addByUrl(options);
    },
    dragAddNode: function(options) {
      // options has x and y from GraphView.drop()
      options.src = this.model.get("src");
      Iframework.shownGraph.addNode( options );
    },
    dragStart: function() {
      Iframework.shownGraph.view.maskFrames();
    },
    dragStop: function() {
      Iframework.shownGraph.view.unmaskFrames();
    }

  });

});

$(function(){

  Iframework.Edge = Backbone.Model.extend({
    defaults: {
      source: [0, "default"], 
      target: [0, "default"]
    },
    initialize: function () {
      this.parentGraph = this.get("parentGraph");
    },
    initializeView: function () {
      this.view = new Iframework.EdgeView({model:this});
      return this.view;
    },
    Source: null,
    Target: null,
    connectTryCount: 5,
    connected: false,
    connect: function () {
      // Called from graph.connectEdges()
      try {
        this.Source = this.parentGraph.get("nodes").get( this.get("source")[0] ).Outputs.get( this.get("source")[1] );
        this.Target = this.parentGraph.get("nodes").get( this.get("target")[0] ).Inputs.get( this.get("target")[1] );
      } catch (e) {
        console.warn("Edge source or target port not found, try #"+this.connectTryCount+": "+this.toString());
        if (this.connectTryCount > 0) {
          this.connectTryCount--;
          var self = this;
          _.delay(function(){
            self.connect();
          }, 1000);
        }
        return false;
      }
      if (!this.Source || !this.Target) {
        return false;
      }
      this.Source.connect(this);
      this.Target.connect(this);
      this.Source.node.receive({
        connect: { 
          source: [this.Source.node.id, this.Source.id],
          target: [this.Target.node.id, this.Target.id]
        }
      });
      if (this.parentGraph.view) {
        this.parentGraph.view.addEdge(this);
      }
      if (this.Target.node.view && this.Target.node.view.Native) {
        this.Target.node.view.Native.connectEdge(this);
      }
      this.connected = true;

      // Set up listener
      this.Source.node.on( "send:"+this.Source.id, this.send, this );

      return this;
    },
    send: function (value) {
      this.Target.node.receive( this.Target.id, value );
    },
    disconnect: function () {
      // Called from graph.removeEdge()
      if (this.Source && this.Target) {
        this.Source.disconnect(this);
        this.Target.disconnect(this);
        this.Source.node.receive({
          disconnect: { 
            source: [this.Source.node.id, this.Source.id],
            target: [this.Target.node.id, this.Target.id]
          }
        });
        if (this.Target.node.view && this.Target.node.view.Native) {
          this.Target.node.view.Native.disconnectEdge(this);
        }
      }
      if (this.view) {
        this.view.remove();
      }

      // Remove listener
      this.Source.node.off( "send:"+this.Source.id, this.send, this );

      this.connected = false;
    },
    remove: function(){
      this.parentGraph.removeEdge(this);
    },
    toJSON: function () {
      return {
        source: this.get("source"),
        target: this.get("target")
      };
    },
    toString: function(){
      return this.get("source")[0]+":"+this.get("source")[1]+"->"+this.get("target")[0]+":"+this.get("target")[1];
    }
  });
  
  Iframework.Edges = Backbone.Collection.extend({
    model: Iframework.Edge
  });

});

$(function(){

  Iframework.EdgeView = Backbone.View.extend({
    tagName: "div",
    className: "edge",
    // template: _.template(template),
    positions: null,
    graphSVGElement: null,
    // This is the only view that doesn't follow the Backbone convention, for the sake of the universal SVG
    elementGroup: null,
    elementWire: null,
    elementShadow: null,
    isPreview: false,
    initialize: function () {
      if (this.model) {
        this.graphSVGElement = this.model.parentGraph.view.edgesSvg;
      } else {
        // Preview edge
        this.graphSVGElement = Iframework.shownGraph.view.edgesSvg;
      }
      this.positions = {fromX: 0, fromY: 0, toX: 0, toY: 0};
      if (!this.model) {
        this.isPreview = true;
      }
      if (this.model && this.model._color) {
        this._color = this.model._color;
      }
      this.render();

      if (this.model) {
        // Used to know which wire is on top when pulling from plugend
        this._z = this.model.parentGraph.edgeCount++;

        $(this.elementWire)
          .data({
            "model": this.model
          })
          .click( function(event){
            $(event.target).data("model").view.click(event);
          });

        // Listen for changes to redraw
        if (this.model.Source) {
          this.model.Source.parentNode.on("change:x change:y change:w change:h", this.redraw, this);
        }
        if (this.model.Target) {
          this.model.Target.parentNode.on("change:x change:y", this.redraw, this);
        }
      }
    },
    render: function () {
      this.calcPositions();

      this.elementGroup = this.makeSVG('g', {
        "transform": "translate("+this.svgX()+","+this.svgY()+")",
        "class": "wire-group"+(this.isPreview ? " preview" : "")
      });

      this.elementShadow = this.makeSVG('path', {
        "class": "wire-shadow",
        "d": this.svgPathShadow()
      });
      this.elementWire = this.makeSVG('path', {
        "class": "wire",
        "d": this.svgPath(),
        "stroke": this.color()
      });

      this.elementGroup.appendChild(this.elementShadow);
      this.elementGroup.appendChild(this.elementWire);

      this.graphSVGElement.appendChild(this.elementGroup);

      // Unhide port plugends
      if (this.model) {
        this.model.Source.view.$(".plugend").show();
        this.model.Target.view.$(".plugend").show();
        this.model.parentGraph.view.resizeEdgeSVG();
      }

      return this;
    },
    redraw: function () {
      this.calcPositions();
      $(this.elementGroup).attr( "transform", "translate("+this.svgX()+", "+this.svgY()+")" );
      $(this.elementWire).attr( "d", this.svgPath() );
      $(this.elementShadow).attr( "d", this.svgPathShadow() );

      if (this.model) {
        this.model.parentGraph.view.resizeEdgeSVG();
      } else {
        Iframework.shownGraph.view.resizeEdgeSVG();
      }
    },
    remove: function () {
      $(this.elementGroup).remove();
    },
    setPositions: function (_positions) {
      this.positions = _positions;
    },
    calcPositions: function () {
      if (this.model) {
        // Connected edge
        var sourceName = this.model.get("source")[1];
        var targetName = this.model.get("target")[1];
        this.positions.fromX = this.model.Source.view.portOffsetLeft('out', sourceName);
        this.positions.fromY = this.model.Source.view.portOffsetTop('out', sourceName);
        this.positions.toX = this.model.Target.view.portOffsetLeft('in', targetName);
        this.positions.toY = this.model.Target.view.portOffsetTop('in', targetName);
      }
    },
    svgX: function () {
      return Math.min(this.positions.toX, this.positions.fromX) - 50;
    },
    svgY: function () {
      return Math.min(this.positions.toY, this.positions.fromY) - 25;
    },
    svgW: function () {
      return Math.abs(this.positions.toX - this.positions.fromX) + 100;
    },
    svgH: function () {
      return Math.abs(this.positions.toY - this.positions.fromY) + 50;
    },
    pathStraight: 35,
    pathCurve: 60,
    svgPath: function () {
      var fromX = this.positions.fromX - this.svgX();
      var fromY = this.positions.fromY - this.svgY();
      var toX = this.positions.toX - this.svgX();
      var toY = this.positions.toY - this.svgY();
      return "M "+ fromX +" "+ fromY +
        " L "+ (fromX+this.pathStraight) +" "+ fromY +
        " C "+ (fromX+this.pathCurve) +" "+ fromY +" "+ (toX-this.pathCurve) +" "+ toY +" "+ (toX-this.pathStraight) +" "+ toY +
        " L "+ toX +" "+ toY;
    },
    svgPathShadow: function () {
      // Same as svgPath() but y+1
      var fromX = this.positions.fromX - this.svgX();
      var fromY = this.positions.fromY - this.svgY() + 1;
      var toX = this.positions.toX - this.svgX();
      var toY = this.positions.toY - this.svgY() + 1;
      return "M "+ fromX +" "+ fromY +
        " L "+ (fromX+this.pathStraight) +" "+ fromY +
        " C "+ (fromX+this.pathCurve) +" "+ fromY +" "+ (toX-this.pathCurve) +" "+ toY +" "+ (toX-this.pathStraight) +" "+ toY +
        " L "+ toX +" "+ toY;
    },
    color: function () {
      if (this._color) {
        return this._color;
      }
      if (this.model) {
        // Connected
        this._color = Iframework.getWireColor();
        return this._color;
      } else {
        // Preview
        return Iframework.wireColors[Iframework.wireColorIndex];
      }
    },
    setColor: function(c) {
      this._color = c;
      $(this.elementWire).attr( "stroke", c );
    },
    label: function () {
      return this.model.get("source")[0] +":"+ this.model.get("source")[1] + 
        '<span class="wiresymbol" style="color:' + this._color + '">&rarr;</span>' + 
        this.model.get("target")[0] +":"+ this.model.get("target")[1];
    },
    // Thanks bobince http://stackoverflow.com/a/3642265/592125
    makeSVG: function(tag, attrs) {
      var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (var k in attrs) {
        if (k === "xlink:href") {
          // Pssh namespaces...
          el.setAttributeNS('http://www.w3.org/1999/xlink','href', attrs[k]);
        } else {
          el.setAttribute(k, attrs[k]);
        }
      }
      return el;
    },
    dim: function(){
      $(this.elementGroup).attr("opacity", 0.2);
    },
    undim: function(){
      $(this.elementGroup).attr("opacity", 1);
    },
    click: function(event) {
      // If not on top already
      if (this._z < this.model.parentGraph.edgeCount-1) {
        // Bring to top (z-order of SVG can't be done with CSS)
        this.graphSVGElement.appendChild(this.elementGroup);
        this._z = this.model.parentGraph.edgeCount++;
      }
      this.highlight();
    },
    highlight: function() {
      // Highlight edge and plugends
      var shadow = $(this.elementShadow);
      shadow.attr("class", "wire-shadow highlight");
      setTimeout(function(){
        shadow.attr("class", "wire-shadow");
      }, 1000);
      if (this.model.Source.view) {
        this.model.Source.view.highlight();
      }
      if (this.model.Target.view) {
        this.model.Target.view.highlight();
      }
    }


  });

});

$(function(){
  
  // Router
  var IframeworkRouter = Backbone.Router.extend({
    routes: {
      "example/:url": "loadExample", // #example/url
      "new":          "newBlank",
      "local/:url":   "loadLocal",
      "gist/https://gist.github.com/:user/:id": "loadGistUgly", // Redirects
      "gist/:id":     "loadGist", 
      "*path":        "default"
    },
    loadExample: function(url) {
      Iframework.loadExample(url);
    },
    loadGistUgly: function (id) {
      this.navigate("gist/"+id, {replace: true});
      this.loadGist(id);
    },
    loadLocal: function(url) {
      Iframework.loadLocal(url);
    },
    loadGist: function(id) {
      Iframework.loadFromGistId(id);
    },
    newBlank: function() {
      Iframework.newBlank();
    },
    'default': function() {

    }
  });
  Iframework.router = new IframeworkRouter();
  Backbone.history.start();
    
});
// extends src/node-box-native-view.js

$(function(){

  var template = 
    // '<canvas id="canvas-<%= id %>" class="canvas" width="500" height="500" style="max-width:100%;" />'+
    '<div class="info" />';

  Iframework.NativeNodes["image"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    canvas: null,
    context: null,
    initializeCategory: function() {
      // Add popout button to box
      var self = this;
      this.model.view.$("button.remove")
        .after(
          $('<button title="popout" type="button" class="popout icon-popup"></button>')
            // .button({ icons: { primary: "icon-popup" }, text: false })
            .click(function(){
              self.popout();
            })
        );

      this.canvas = document.createElement("canvas");
      this.canvas.width = 10;
      this.canvas.height = 10;
      this.context = this.canvas.getContext('2d');

      $(this.canvas)
        .attr({
          "class": "canvas",
          "id": "canvas-"+this.model.id
        })
        .css({
          maxWidth: "100%",
          cursor: "pointer"
        })
        .draggable({
          cursor: "pointer",
          cursorAt: { top: -10, left: -10 },
          helper: function( event ) {
            var helper = $( '<div class="drag-image"><h2>Copy this</h2></div>' )
              .data({
                "meemoo-drag-type": "canvas",
                "meemoo-source-node": self
              });
            $(document.body).append(helper);
            _.delay(function(){
              self.dragCopyCanvas(helper);
            }, 100);
            return helper;
          }
        });

      // If there is an image input
      var firstImageInput;
      for (var name in this.inputs) {
        if (this.inputs[name].type==="image"){
          firstImageInput = name;
          break;
        }
      }

      // Setup droppable
      if (firstImageInput) {
        // Add drop indicator (shown in CSS)
        this.$el.append('<div class="drop-indicator"><p class="icon-login">input '+firstImageInput+'</p></div>');
        
        // Make droppable        
        this.$el.droppable({
          accept: ".canvas, .meemoo-plugin-images-thumbnail",
          tolerance: "pointer",
          hoverClass: "drop-hover",
          activeClass: "drop-active",
          // Don't also drop on graph
          greedy: true
        });
        this.$el.on("drop", {"self": this, "inputName": firstImageInput}, Iframework.util.imageDrop);
      }

      this.$el.prepend(this.canvas);
    },
    dragCopyCanvas: function(helper) {
      if (!helper) { return; }
      var canvasCopy = document.createElement("canvas");
      canvasCopy.width = this.canvas.width;
      canvasCopy.height = this.canvas.height;
      canvasCopy.getContext("2d").drawImage(this.canvas, 0, 0);
      helper.data("meemoo-drag-canvas", canvasCopy);
      helper.append(canvasCopy);
    },
    scale: function(){
      // canvas is shown at this scaling factor
      // useful for absolute positioning other elements over the canvas
      return this.$(".canvas").width() / this.canvas.width;
    },
    outputs: {
      image: {
        type: "image"
      }
    },
    _smoothing: true,
    inputsmoothing: function (s) {
      this._smoothing = s;
      // HACK browser-specific stuff
      this.context.webkitImageSmoothingEnabled = s;
      this.context.mozImageSmoothingEnabled = s;
    },
    exportImage: function(){
      try {
        var url = this.canvas.toDataURL();
        window.open(url);
      } catch (e) {
        // Maybe it is dirty with non-CORS data
      }
    },
    popout: function() {
      if (this.w) {
        // Toggle
        this.popin();
        return false;
      }

      // Cache local canvas
      this.localCanvas = this.canvas;
      this.localContext = this.context;
      // $(this.localCanvas).hide();

      // Open new window to about:blank
      this.w = window.open("", "meemooRemoteWindow", "menubar=no,location=no,resizable=yes,scrollbars=no,status=no");
      var self = this;
      this.w.addEventListener("unload", function(){
        self.popin();
      });

      // Popin other
      if (Iframework.popoutModule && Iframework.popoutModule !== this) {
        Iframework.popoutModule.popin();
      }
      Iframework.popoutModule = this;
      // TODO: fade out other canvas?
      this.w.document.body.innerHTML = "";

      // Make new canvas
      this.canvas = this.w.document.createElement("canvas");
      this.canvas.width = this.localCanvas.width;
      this.canvas.height = this.localCanvas.height;
      this.context = this.canvas.getContext('2d');
      this.context.drawImage(this.localCanvas, 0, 0);
      this.w.document.body.appendChild(this.canvas);

      // Full-screen styling
      this.w.document.body.style.backgroundColor="black";
      this.w.document.body.style.overflow = "hidden";
      this.w.document.body.style.margin="0px";
      this.w.document.body.style.padding="0px";
      this.w.document.title = "meemoo.org";
      this.canvas.style.position="absolute";
      this.canvas.style.top="0px";
      this.canvas.style.left="0px";
      this.canvas.style.width="100%";

      // Smoothing on new canvas
      this.inputsmoothing(this._smoothing);

      return false;
    },
    popin: function() {
      if (this.w) {
        this.w = null;
      }
      this.canvas = this.localCanvas;
      this.context = this.localContext;
      // $(this.canvas).show();

      // Smoothing on canvas (only matters if it changed while out)
      this.inputsmoothing(this._smoothing);

      return false;
    }    
    // showResizer: function(translateX, translateY, scale, rotate){
    //   if (!this.resizer) {
    //     this.resizer = $('<div class="resizer">');
    //     this.$el.append(this.resizer);        
    //   }
    //   var sizedScale = this.scale();
    //   this.resizer
    //     .css({
    //       position: "absolute",
    //       border: "1px solid black",
    //       top: translateX * sizedScale,
    //       left: translateY * sizedScale,
    //       width: 20,
    //       height: 20
    //     });
    //     // .hide();
    //   var self = this;
    //   // $(this.canvas)
    //   //   .mouseover(function(){
    //   //     self.resizer.show();
    //   //   })
    //   //   .mouseout(function(){
    //   //     self.resizer.hide();
    //   //   });
    //   if (translateX || translateY) {
    //     this.resizer.draggable({});
    //   }
    //   if (scale) {
    //     this.resizer.resizable({});
    //   }
    // }
    // togglePreview: function(e){
    //   if (e.target.checked) {
    //     this.$el.prepend(this.canvas);
    //   } else {
    //     this.$("canvas").remove();
    //   }
    // }

  });


});

$( function() {

  var template = $(
    '<div>'+
      '<div class="sourceedit">'+
        '<textarea />'+
      '</div>'+
      '<div class="controls">'+
        '<button class="button sourcerefresh icon-cw" title="refresh the source code">refresh</button>'+
        '<button class="button sourcecompress icon-bag" title="refresh and compress the source code into one line">compress</button>'+
        '<button class="button sourceapply icon-ok" title="reloads the app">apply changes</button>'+
      '</div>'+
    '</div>'
  );

  var code = template.find("textarea");

  // Add menu
  Iframework.addMenu("source", template, "icon-cog");

  // On change update code view
  Iframework.on("change", function(graph){
    if (Iframework.graph && Iframework.$(".menu-source").is(":visible")) {
      // Bookmark to scroll back to
      var scrollBackTop = code.prop("scrollTop");
      code.val( JSON.stringify(Iframework.graph.toJSON(), null, "  ") );
      code.scrollTop( scrollBackTop );
    }
  });

  var sourceRefresh = function(){
    code.val( JSON.stringify(Iframework.graph, null, "  ") );
  };
  template.find(".sourcerefresh").click(sourceRefresh);

  // On show manu update source
  Iframework.on("showmenu:source", sourceRefresh);

  var sourceCompress = function(){
    code.val( JSON.stringify(Iframework.graph, null, "") );
  };
  template.find(".sourcecompress").click(sourceCompress);

  // Apply source to test graph
  var sourceApply = function(){
    //   try {
    //     var newGraph = JSON.parse( this.$(".sourceedit textarea").val() );
    //     this.loadGraph(newGraph);
    //     this.showSource();
    //     // reset localStorage version
    //     this._loadedLocalApp = null;
    //   } catch (e) {
    //     console.warn("json parse error: "+e);
    //   }
    var graph;
    try {
      graph = JSON.parse( code.val() );
    } catch(error){
      return false;
    }
    if (graph) {
      var g = Iframework.loadGraph(graph);
      // reset localStorage version
      Iframework._loadedLocalApp = null;
      sourceRefresh();
      g.trigger("change");
    }
    return false;
  };
  template.find(".sourceapply").click(sourceApply);

} );

$( function () {

  var template = $(
    '<div>'+
      '<div class="controls">'+
        '<form class="addbyurl">'+
          '<input class="addbyurlinput" name="addbyurlinput" placeholder="search or url" type="text" />'+
          '<button class="addbyurlsubmit icon-ok" type="submit">load</button>'+
        '</form>'+
      '</div>'+
      '<div class="listing">'+
      '</div>'+
    '</div>'
  );

  // Add menu
  Iframework.addMenu("library", template, "icon-plus");

  Iframework.loadLibrary = function (library) {

    var autocompleteData = [];

    var accordion = $("<div></div>");

    for (var category in library) {
      if (!library.hasOwnProperty(category)){continue;}
      var section = $('<div class="library-section"></div>');

      // section title
      section.append( $('<h3><a href="#">'+category+"</a></h3>") );

      // section items
      var sectionDiv = $("<div></div>");
      var modules = library[category];
      for (var i = 0; i<modules.length; i++) {
        var module = new Iframework.Module(modules[i]);
        // this.Library.add(module);

        module.initializeView();
        sectionDiv.append(module.view.$el);

        var autocompleteDataItem = {
          value: module.get("src"),
          label: module.get("info").title + " - " + module.get("info").description + " - " + module.get("src"),
          title: module.get("info").title,
          description: module.get("info").description + " - " + module.get("src")
        };
        autocompleteData.push(autocompleteDataItem);
      }
      section.append( sectionDiv );
      accordion.append( section );
    }

    template.find('.listing').append(accordion);
    accordion.children(".library-section")
      .accordion({
        animate: false,
        header: "h3",
        heightStyle: "content",
        collapsible: true,
        active: false
      });

    template.find('.addbyurlinput')
      .autocomplete({
        minLength: 1,
        source: autocompleteData,
        select: function( event, ui ) {
          _.defer(function(){
            Iframework.addByUrl();
          });
        }
      })
      .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        // Custom display
        return $( "<li>" )
          .append( '<a><span style="font-size:120%;">' + item.title + "</span><br>" + item.description + "</a>" )
          .appendTo( ul );
      };
  };

  var addByUrl = Iframework.addByUrl = function() {
    var addByUrlInput = Iframework.$(".addbyurlinput");
    addByUrlInput.blur();

    var url = addByUrlInput.val();
    if (url !== "") {
      var graphEl = Iframework.$(".graph");
      Iframework.shownGraph.addNode({
        "src": url,
        "x": Math.floor(graphEl.scrollLeft() + graphEl.width()/2) - 100,
        "y": Math.floor(graphEl.scrollTop() + graphEl.height()/2) - 100
      });
      addByUrlInput
        .val("")
        .attr("placeholder", "loading...");
      window.setTimeout(function(){
        addByUrlInput
          .attr("placeholder", "search or url");
      }, 1000);
    }
    return false;
  };

  // Form submit action
  template.find(".addbyurl").submit(function(){
    addByUrl();
    return false;
  });

 
  // var library = $('<ul class="dataflow-plugin-library" style="list-style:none; padding-left:0" />');

  // var addNode = function(node, x, y) {
  //   return function(){
  //     // Deselect others
  //     Iframework.currentGraph.view.$(".node").removeClass("ui-selected");
  //     // Find vacant id
  //     var id = 1;
  //     while (Iframework.currentGraph.nodes.get(id)){
  //       id++;
  //     }
  //     // Position
  //     if (x===undefined) {
  //       x = window.scrollX - 100 + Math.floor($(window).width()/2);
  //     }
  //     if (y===undefined) {
  //       y = window.scrollY - 100 + Math.floor($(window).height()/2);
  //     }
  //     // Add node
  //     var newNode = new node.Model({
  //       id: id,
  //       x: x,
  //       y: y,
  //       parentGraph: Iframework.currentGraph
  //     });
  //     Iframework.currentGraph.nodes.add(newNode);
  //     // Select and bring to top
  //     newNode.view.select();
  //   };
  // };

  // var update = function(options){
  //   options = options ? options : {};
  //   options.exclude = options.exclude ? options.exclude : ["base", "base-resizable"];

  //   library.empty();
  //   _.each(Iframework.nodes, function(node, index){
  //     if (options.exclude.indexOf(index) === -1) {
  //       var addButton = $('<a class="button">+</a>')
  //         .attr("title", "click or drag")
  //         .draggable({
  //           helper: function(){
  //             return $('<div class="node helper" style="width:100px; height:100px">'+index+'</div>');
  //           },
  //           stop: function(event, ui) {
  //             addNode(node, ui.position.left, ui.position.top).call();
  //           }
  //         })
  //         .click(addNode(node));
  //       var item = $("<li />")
  //         .append(addButton)
  //         .append(index);
  //         // .append(drag);
  //       library.append(item);
  //     }
  //   });
  // };
  // update();

  // Iframework.addPlugin("library", library);

  // Iframework.plugins.library.update = update;

} );

$( function() {

  var IMGUR_ID = "9877b5345adf3fc";

  // Shim
  if ( !window.URL ) {
    window.URL = window.webkitURL || window.msURL || window.oURL || false;
  }

  var template = $(
    '<div class="meemoo-plugin-images">'+
      '<div class="listing">'+
        '<h2>Local images (not saved)</h2>'+
        '<span style="position:absolute;width:0px;overflow:hidden;"><input type="file" class="file-input-local" accept="image/*" multiple /></span>'+
        '<button class="localfile icon-camera" title="Not public. From computer (or mobile camera).">Choose local image</button> from computer or mobile camera'+
        '<div class="image-drop local-drop"><div class="drop-indicator"><p>drag image here to hold it</p></div></div>'+
        '<div class="thumbnails local-listing"></div>'+
        '<h2>Imgur images (public)</h2>'+
        '<span style="position:absolute;width:0px;overflow:hidden;"><input type="file" class="file-input-public" accept="image/*" multiple /></span>'+
        '<button class="publicfile icon-camera" title="Import from computer (or mobile camera).">Upload</button>'+
        '<div class="info"></div>'+
        '<div class="image-drop public-drop"><div class="drop-indicator"><p class="icon-globe-1">drag image here to save to Imgur</p></div></div>'+
        '<div class="thumbnails public-listing"></div>'+
      '</div>'+
    '</div>'
  );

  // Add menu
  Iframework.addMenu("images", template, "icon-picture");

  // Set info
  var info = template.find(".info");
  var setInfo = function (string) {
    info.text(string);
  };

  // Open image panel by dragging over show button
  Iframework.$(".show-images").droppable({
    accept: ".canvas, .image",
    tolerance: "pointer",
    activeClass: "drop-indicator",
    over: function (event, ui) {
      $(this).trigger("click");
    }
  });

  // Drop panels
  template.find(".image-drop").droppable({
    accept: ".canvas",
    tolerance: "pointer",
    hoverClass: "drop-hover",
    activeClass: "drop-active",
    // Don't also drop on graph
    greedy: true
  });
  template.find(".public-drop").droppable({
    // also accept img drops
    accept: ".canvas, .image"
  });
  template.find(".local-drop").on("drop", function(event, ui) {
    var image = ui.helper.data("meemoo-drag-canvas");
    if (!image) { return false; }
    var thumbnail = makeThumbnail(image);
    localListing.append( thumbnail );
  });

  // Make thumbnail element
  var makeThumbnail = function(image){
    // image can be Image or Canvas
    var el = $('<div class="meemoo-plugin-images-thumbnail canvas">')
      .append(image)
      .draggable({
        cursor: "pointer",
        cursorAt: { top: -10, left: -10 },
        helper: function( event ) {
          var helper = $( '<div class="drag-image"><h2>Copy this</h2></div>' )
            .data({
              "meemoo-drag-type": "canvas",
              "meemoo-source-image": image
            });
          $(document.body).append(helper);
          _.delay(function(){
            dragCopyCanvas(helper);
          }, 100);
          return helper;
        }
      });
    return el;
  };

  var dragCopyCanvas = function (helper) {
    if (!helper) { return; }
    var image = helper.data("meemoo-source-image");
    var canvasCopy = document.createElement("canvas");
    canvasCopy.width = image.naturalWidth ? image.naturalWidth : image.width;
    canvasCopy.height = image.naturalHeight ? image.naturalHeight : image.height;
    canvasCopy.getContext("2d").drawImage(image, 0, 0);
    helper.data("meemoo-drag-canvas", canvasCopy);
    helper.append(canvasCopy);
  };


  // Local files
  var fileInput = template.find(".file-input-local");
  var localListing = template.find(".local-listing");
  fileInput.change( function (event) {
    // Load local image
    var files = event.target.files;
    for (var i=0; i<files.length; i++) {
      var img = new Image();
      img.src = window.URL.createObjectURL( files[i] );
      var thumbnail = makeThumbnail(img);
      localListing.append( thumbnail );
    }
  });
  template.find(".localfile").click(function(){
    // Trigger 
    fileInput.trigger("click");
  });

  // Native select local files to Imgur
  var fileInputPublic = template.find(".file-input-public");
  fileInputPublic.change( function (event) {
    var files = event.target.files;
    if (files.length < 1) {
      return;
    }
    // Upload them
    setInfo('Uploading...');
    
    function makeSuccess (fileName) {
      return function (response) {
        if (response.success) {
          saveImgurLocal(response.data);
          setInfo('Uploaded ' + fileName + ' :)');
        } else {
          setInfo('Upload ' + fileName + 'failed :(');
        }
      };
    }
    
    function makeError (fileName) {
      return function () {
        setInfo('Upload ' + fileName + 'failed :(');
      };
    }
    
    for (var i = 0, len = files.length; i < len; i++) {
      var file = files[i];
      $.ajax({
        url: 'https://api.imgur.com/3/image',
        type: 'post',
        headers: {
          Authorization: 'Client-ID ' + IMGUR_ID
        },
        data: file,
        processData: false,
        success: makeSuccess(file.name),
        error: makeError(file.name)
      });
    }
  });
  template.find(".publicfile").click(function(){
    // Trigger 
    fileInputPublic.trigger("click");
  });
  
  function enforceHTTPS (url) {
    if (!url) {
      return;
    }
    var linkSplit = url.split(':');
    if (linkSplit[0] === 'http') {
      linkSplit[0] = 'https';
    }
    return linkSplit.join(':');
  }
  
  function saveImgurLocal (data) {
    // Make small thumbnail url
    var thumbSplit = data.link.split('.');
    thumbSplit[thumbSplit.length-2] += 's';
    var linkThumb = thumbSplit.join('.');
    // Make model, add to collection, save to localStorage
    var img = new Iframework.plugins.images.GalleryImage({
      id: data.id,
      deletehash: data.deletehash,
      type: data.type,
      link: enforceHTTPS(data.link),
      linkThumb: enforceHTTPS(linkThumb),
      animated: data.animated,
      gifv: enforceHTTPS(data.gifv),
      mp4: enforceHTTPS(data.mp4),
      webm: enforceHTTPS(data.webm)
    });
    publicImages.add(img);
    img.save();
  }


  // Meemoo drop to Imgur
  template.find(".public-drop").on("drop", function(event, ui) {
    var canvas = ui.helper.data("meemoo-drag-canvas");
    var image = ui.helper.data("meemoo-source-image");
    if (!canvas && !image) { return false; }

    var b64;

    if (canvas) {
      try{
        b64 = canvas.toDataURL().split(',', 2)[1];
      } catch (error) {
        setInfo('Not able to get image data. Right-click "Save as..." or take a screenshot.');
        return false;
      }
    } else if (image) {
      // Make sure data url
      if (image.src.split(':')[0] !== "data") {
        return false;
      }

      var split = image.src.split(',', 2);
      var type = split[0].split(':')[1].split(';')[0];
      var ext = type.split('/')[1];
      b64 = split[1];
    }

    if (!b64) { return false; }
    
    setInfo('Uploading...');

    $.ajax({
      url: 'https://api.imgur.com/3/image',
      type: 'post',
      headers: {
        Authorization: 'Client-ID ' + IMGUR_ID
      },
      data: {
        image: b64,
        type: 'base64',
        title: 'made with meemoo.org',
        description: 'browser-based media hacking https://app.meemoo.org/'
      },
      dataType: 'json',
      success: function(response) {
        if (response.success) {
          saveImgurLocal(response.data);
          setInfo('Upload done :)');
        } else {
          setInfo('Upload failed :( save it to your computer');
        }
      },
      error: function () {
        setInfo('Upload failed :( save it to your computer');
      }
    });
  });


  // Globally-accessible functions
  Iframework.plugins.images = {};

  Iframework.plugins.images.GalleryImage = Backbone.Model.extend({
    initialize: function () {
      this.initializeView();
    },
    initializeView: function () {
      if (!this.view) {
        this.view = new Iframework.plugins.images.GalleryImageView({model:this});
      }
      return this.view;
    }
  });

  Iframework.plugins.images.GalleryImages = Backbone.Collection.extend({
    model: Iframework.plugins.images.GalleryImage,
    localStorage: new Backbone.LocalStorage("GalleryImages")
  });

  var imageTemplate = 
    '<img crossorigin="anonymous" title="drag to graph or image node" />'+
    '<div class="controls">'+
      '<a class="link button icon-link" title="Open image in new window" target="_blank"></a>'+
      '<a class="link-animated button icon-right-open" title="Open gifv in new window" target="_blank" style="display:none;"></a>'+
      '<button class="delete icon-trash" title="Delete image"></button>'+
    '</div>';

  Iframework.plugins.images.GalleryImageView = Backbone.View.extend({
    tagName: "div",
    className: "meemoo-plugin-images-thumbnail",
    template: _.template(imageTemplate),
    events: {
      "click .delete": "destroyModel"
    },
    initialize: function () {
      this.$el.html(this.template(this.model.toJSON()));

      var mainsrc = this.model.get('link');
      this.$(".link").attr("href", mainsrc);

      var animated = this.model.get('animated');
      if (animated) {
        var animatedLink = this.model.get('gifv') || mainsrc;
        this.$(".link-animated")
          .attr("href", animatedLink)
          .css({"display": "inline-block"});
      }

      // Load thumbnail
      var img = this.$("img")[0];
      img.src = this.model.get('linkThumb');

      this.$el.draggable({
        cursor: "pointer",
        cursorAt: { top: -10, left: -10 },
        helper: function( event ) {
          var helper = $( '<div class="drag-image"><h2>Copy this</h2></div>' )
            .data({
              "meemoo-drag-type": "canvas",
              "meemoo-source-image": img,
              "meemoo-image-url": mainsrc
            });
          $(document.body).append(helper);
          _.delay(function(){
            dragCopyCanvas(helper);
          }, 100);
          return helper;
        }
      });

      var publicListing = template.find(".public-listing");
      publicListing.prepend( this.el );

      this.model.on('destroy', this.remove, this);

      return this;
    },
    destroyModel: function () {
      if (!window.confirm("Are you sure you want to delete this image?")) {
        return;
      }
      // Delete imgur file
      var deletehash = this.model.get('deletehash');
      if (deletehash) {
        setInfo('Deleting...');
        var model = this.model;
        $.ajax({
          url: 'https://api.imgur.com/3/image/' + deletehash,
          type: 'delete',
          headers: {
            Authorization: 'Client-ID ' + IMGUR_ID
          },
          success: function(response) {
            if (response.success) {
              model.destroy();
              setInfo('Deleted');
            } else {
              setInfo('Delete failed');
            }
          },
          error: function () {
            setInfo('Delete failed');
          }
        });
        return;
      }
      // Delete localstorage reference
      this.model.destroy();
    },
    remove: function () {
      this.$el.remove();
    }

  });

  // Load local images from local storage
  var publicImages = new Iframework.plugins.images.GalleryImages();
  publicImages.fetch({
    success: function(e) {
      publicImages.each(function(image){
        image.initializeView();
      });
    },
    error: function (e) {
      console.warn("error loading public images");
    }
  });

} );
$(function(){

  // Start
  Iframework.allLoaded();

  // Bind shortcuts
  Mousetrap.bind(['command+a', 'ctrl+a'], function(e) {
    if (Iframework.shownGraph && Iframework.shownGraph.view) {
      e.preventDefault();
      Iframework.shownGraph.view.selectAll();
    }
  });

  Mousetrap.bind(['command+x', 'ctrl+x'], function(e) {
    if (Iframework.shownGraph && Iframework.shownGraph.view) {
      // e.preventDefault();
      Iframework.shownGraph.view.cut();
    }
  });

  Mousetrap.bind(['command+c', 'ctrl+c'], function(e) {
    if (Iframework.shownGraph && Iframework.shownGraph.view) {
      // e.preventDefault();
      Iframework.shownGraph.view.copy();
    }
  });

  Mousetrap.bind(['command+v', 'ctrl+v'], function(e) {
    if (Iframework.shownGraph && Iframework.shownGraph.view) {
      // e.preventDefault();
      Iframework.shownGraph.view.paste();
    }
  });

  // Mousetrap.bind('del', function(e) {
  //   if (Iframework.shownGraph && Iframework.shownGraph.view) {
  //     e.preventDefault();
  //     Iframework.shownGraph.view.deleteSelected();
  //   }
  // });

});