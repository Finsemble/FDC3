(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function a(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}})();const l=[{id:"fdc3.channel.1",type:"user",displayMetadata:{name:"Channel 1",color:"red",glyph:"1"}},{id:"fdc3.channel.2",type:"user",displayMetadata:{name:"Channel 2",color:"orange",glyph:"2"}},{id:"fdc3.channel.3",type:"user",displayMetadata:{name:"Channel 3",color:"yellow",glyph:"3"}},{id:"fdc3.channel.4",type:"user",displayMetadata:{name:"Channel 4",color:"green",glyph:"4"}},{id:"fdc3.channel.5",type:"user",displayMetadata:{name:"Channel 5",color:"cyan",glyph:"5"}},{id:"fdc3.channel.6",type:"user",displayMetadata:{name:"Channel 6",color:"blue",glyph:"6"}},{id:"fdc3.channel.7",type:"user",displayMetadata:{name:"Channel 7",color:"magenta",glyph:"7"}},{id:"fdc3.channel.8",type:"user",displayMetadata:{name:"Channel 8",color:"purple",glyph:"8"}}],p={type:"ResolverIntents",appIntents:[{apps:[{appId:"trading-view-chart",description:"TradingView is a social network for traders and investors on Stock, Futures and Forex markets!",icons:[{src:"https://apps.connectifi-interop.com/tradingviewChart/icon.png"}],title:"TradingView Chart"},{appId:"adaptabledemo",instanceId:"324587329238y7r59824",description:"AdapTable is a powerful data grid with a range of advanced features",icons:[{src:"https://apps.connectifi-interop.com/adaptableDemo/icon.png"}],title:"AdapTable"}],intent:{name:"ViewInstrument",displayName:"View Instrument"}}],source:{appId:"fdc3-demo",instanceId:"fdc3-demo-instance"}};let i=l[2].id,o=!0;const u=c=>{var t,r;const n=new MessageChannel;n.port1.onmessage=({data:d})=>{switch(d.type){case"Fdc3UserInterfaceChannelSelected":i=d.channel;case"Fdc3UserInterfaceHandshake":{n.port1.postMessage({type:"Fdc3UserInterfaceChannels",channels:l,selected:i});break}}};const{target:s}=c;s&&(s.disabled=!0);const a=document.querySelector("#channel-iframe");(t=a.parentElement)==null||t.setAttribute("data-visible","true");const e=document.getElementById("dimensions-btn-channel");e.setAttribute("data-visible","true"),e.addEventListener("click",()=>{o=!o,n.port1.postMessage({type:"Fdc3UserInterfaceChannelResize",expanded:o}),a.setAttribute("data-expanded",`${o}`),e.textContent=o?"Collapse":"Expand"}),(r=a.contentWindow)==null||r.postMessage({type:"Fdc3UserInterfaceHello"},"*",[n.port2])},f=c=>{var e,t;const n=new MessageChannel;n.port1.onmessage=({data:r})=>{switch(r.type){case"Fdc3UserInterfaceHandshake":{n.port1.postMessage(p);break}}};const{target:s}=c;s&&(s.disabled=!0);const a=document.querySelector("#resolver-iframe");(e=a.parentElement)==null||e.setAttribute("data-visible","true"),(t=a.contentWindow)==null||t.postMessage({type:"Fdc3UserInterfaceHello"},"*",[n.port2])};window.addEventListener("load",()=>{document.getElementById("send-btn-channel").addEventListener("click",u),document.getElementById("send-btn-resolver").addEventListener("click",f)});