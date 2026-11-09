// ---- shell: bottom navigation and views (phone layout only; the display shows Home only) ----
const VIEWS=['home','salah','duas','occ','more','qibla','tasbeeh'];
const MADHHAB={hanafi:'Hanafi',shafii:'Shafi’i',maliki:'Maliki',hanbali:'Hanbali'};
function refreshShell(){
  $('#qshort span').textContent='Qibla '+Math.round(qiblaInfo(CFG.lat,CFG.lon).brg)+'°';
  if(typeof SM!=='undefined'&&(CFG.madhhab==='hanafi'||CFG.madhhab==='shafii'))SM=CFG.madhhab;
  if(typeof renderSalah==='function')renderSalah(location.hash.split('/')[1]);
  drawQibla();
}
function show(name,sub){
  if(!PHONE||!VIEWS.includes(name))name='home';
  VIEWS.forEach(v=>(v==='home'?$('#stage'):$('#v-'+v)).classList.toggle('hide',v!==name));
  const tab=(name==='qibla'||name==='tasbeeh')?'more':name;
  document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.go===tab));
  if(name==='salah')renderSalah(sub);
  const el=name==='home'?null:$('#v-'+name);if(el)el.scrollTop=0;
}
const route=()=>{const p=location.hash.slice(1).split('/');show(p[0],p[1])};
addEventListener('hashchange',route);
$('#qshort').addEventListener('click',e=>e.stopPropagation());   // do not open settings when tapping the Qibla shortcut
$('#mset').onclick=openSettings;
refreshShell();route();
