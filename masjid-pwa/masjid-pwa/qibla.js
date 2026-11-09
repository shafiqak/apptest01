// ---- Qibla: bearing and distance to the Kaaba, live compass from the phone sensors ----
const KAABA={lat:21.4225,lon:39.8262};
function qiblaInfo(lat,lon){
  const p1=lat*rad,p2=KAABA.lat*rad,dl=(KAABA.lon-lon)*rad;
  const y=Math.sin(dl)*Math.cos(p2),x=Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl);
  const a=Math.sin((p2-p1)/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
  return{brg:(Math.atan2(y,x)/rad+360)%360,km:2*6371*Math.asin(Math.sqrt(a))};
}
let heading=null;
function buildDial(){
  let s='<circle id="qring" cx="100" cy="100" r="88"/>';
  for(let a=0;a<360;a+=15){const L=a%90===0?0:a%45===0?8:4,r1=88,r2=88-6-L,c=Math.cos((a-90)*rad),d=Math.sin((a-90)*rad);
    s+='<line class="tk" x1="'+(100+r1*c)+'" y1="'+(100+r1*d)+'" x2="'+(100+r2*c)+'" y2="'+(100+r2*d)+'"/>'}
  [['N',0],['E',90],['S',180],['W',270]].forEach(([t,a])=>{const c=Math.cos((a-90)*rad),d=Math.sin((a-90)*rad);
    s+='<text class="'+(t==='N'?'n':'')+'" x="'+(100+66*c)+'" y="'+(100+66*d+4)+'">'+t+'</text>'});
  s+='<g id="qk"><rect x="93" y="9" width="14" height="14" rx="2" fill="#111" stroke="#e3c26a" stroke-width="2"/><line x1="100" y1="23" x2="100" y2="40" stroke="#e3c26a" stroke-width="2"/></g>';
  $('#dial').innerHTML=s;
}
function drawQibla(){
  const q=qiblaInfo(CFG.lat,CFG.lon);
  $('#dial').setAttribute('transform','rotate('+(heading==null?0:-heading)+' 100 100)');
  $('#qk').setAttribute('transform','rotate('+q.brg.toFixed(1)+' 100 100)');
  const diff=heading==null?null:Math.abs(((q.brg-heading+540)%360)-180);
  $('#v-qibla').classList.toggle('ok',diff!=null&&diff<4);
  $('#qinfo').innerHTML='<b>'+Math.round(q.brg)+'°</b> from North · '+Math.round(q.km).toLocaleString('en-US')+' km to Makkah<br><small>'+esc(CFG.city)+'</small>';
}
function onOri(e){
  let h=null;
  if(typeof e.webkitCompassHeading==='number')h=e.webkitCompassHeading;                      // iPhone
  else if(e.alpha!=null&&(e.absolute||e.type==='deviceorientationabsolute'))h=(360-e.alpha)%360; // Android
  if(h==null)return;
  heading=h;drawQibla();
}
function startCompass(){
  const go=()=>{addEventListener('deviceorientationabsolute',onOri,true);addEventListener('deviceorientation',onOri,true);
    $('#qstat').textContent='Hold your phone flat and turn until the Kaaba marker is at the top.'};
  if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function')
    DeviceOrientationEvent.requestPermission().then(r=>{if(r==='granted')go();else $('#qstat').textContent='Compass permission was denied.'}).catch(()=>{$('#qstat').textContent='Compass is not available.'});
  else if('ondeviceorientationabsolute' in window||'ondeviceorientation' in window)go();
  else $('#qstat').textContent='No compass sensor found. Face '+Math.round(qiblaInfo(CFG.lat,CFG.lon).brg)+'° from North.';
}
buildDial();drawQibla();
$('#qgo').onclick=startCompass;
