(window.webpackJsonp=window.webpackJsonp||[]).push([[53],{"155":function(e,n,t){"use strict";t.r(n),t.d(n,"taro_rich_text_core",(function(){return o}));var i=t(52),o=function(){function r(e){var n=this;Object(i.g)(this,e),this.renderNode=function(e){if("type"in e&&"text"===e.type)return(e.text||"").replace(/&nbsp;/g," ");if("name"in e&&e.name){var t=e.name,o=e.attrs,a=e.children,c={},u=[];if(o&&"object"==typeof o){var f=function(e){var n=o[e];if("style"===e&&"string"==typeof n){var t=n.split(";").map((function(e){return e.trim()})).filter((function(e){return e})),i={};return t.forEach((function(e){if(e){var n=/(.+): *(.+)/g.exec(e);if(n){var t=n[1],o=n[2],a=t.replace(/-([a-z])/g,(function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];return e[1].toUpperCase()}));i[a]=o}}})),Object.keys(i).length&&(c.style=i),"continue"}c[e]=n};for(var p in o)f(p)}return a&&a.length&&(u=a.map((function(e){return n.renderNode(e)}))),Object(i.e)(t,c,u)}return null}}return r.prototype.render=function(){var e=this.nodes,n=this.renderNode;return Array.isArray(e)?Object(i.e)(i.a,null,e.map((function(e){return n(e)}))):Object(i.e)(i.a,{"innerHTML":e})},r}()}}]);