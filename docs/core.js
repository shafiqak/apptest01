// ---- settings (the admin page will edit these later) ----
const CFG={city:'Bengaluru',lat:12.9716,lon:77.5946,
  madhhab:'shafii',   // hanafi | shafii | maliki | hanbali (Asr shadow: Hanafi x2, others x1)
  theme:'dark',       // dark | light | auto
  notify:{on:0,before:10,azan:1,namaz:1,friday:1,azkar:0,daily:0,sound:'default'},   // Android app only
  asrFactor:1,        // 1 = Shafi/Maliki/Hanbali, 2 = Hanafi
  hijriAdjust:0,      // moon-sighting correction in days (-2..+2)
  offsets:{fajr:0,dhuhr:0,asr:0,maghrib:0,isha:0},
  // namaz (jamaat) times: 'after' = minutes after azan, 'at' = fixed clock time (24h)
  namaz:{fajr:{after:15},dhuhr:{at:'13:00'},asr:{at:'16:00'},maghrib:{after:5},isha:{at:'20:00'}},
  jumuah:'13:00',   // replaces Dhuhr namaz on Fridays
  eid:'08:30'};    // Eid namaz, shown on 1 Shawwal and 10 Dhul Hijjah // minutes added to calculated azan times
const NATIVE=!!(window.Capacitor&&typeof Capacitor.isNativePlatform==='function'&&Capacitor.isNativePlatform());
const WEB=location.protocol.startsWith('http');
let saved=null;try{saved=JSON.parse(localStorage.getItem('cfg'))}catch(e){}
if(saved){Object.assign(CFG,saved);if(!saved.madhhab)CFG.madhhab=CFG.asrFactor===2?'hanafi':'shafii'}
else if(WEB){CFG.namaz={};CFG.jumuah='';CFG.eid='';CFG.madhhab='hanafi';CFG.asrFactor=2}   // public app: no masjid-specific times until the user enters their own
const NAMES=[['fajr','الفجر','FAJR'],['dhuhr','الظهر','DHUHR'],['asr','العصر','ASR'],['maghrib','المغرب','MAGHRIB'],['isha','العشاء','ISHA']];

// ---- azan times: astronomical calculation, works offline (Karachi: Fajr/Isha 18°) ----
const rad=Math.PI/180,sin=a=>Math.sin(a*rad),cos=a=>Math.cos(a*rad),tan=a=>Math.tan(a*rad);
const fix=(a,b)=>{a-=b*Math.floor(a/b);return a<0?a+b:a};
function prayers(date){
  const tz=-date.getTimezoneOffset()/60;
  const jd=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/864e5+2440587.5-CFG.lon/360;
  const D=jd-2451545,g=fix(357.529+.98560028*D,360),q=fix(280.459+.98564736*D,360);
  const L=fix(q+1.915*sin(g)+.02*sin(2*g),360),e=23.439-3.6e-7*D;
  const RA=fix(Math.atan2(cos(e)*sin(L),cos(L))/rad,360)/15;
  const eqt=fix(q/15-RA+12,24)-12,dec=Math.asin(sin(e)*sin(L))/rad;
  const noon=12-eqt-CFG.lon/15+tz,lat=CFG.lat;
  const at=(ang,ccw)=>{const t=Math.acos((-sin(ang)-sin(lat)*sin(dec))/(cos(lat)*cos(dec)))/rad/15;return noon+(ccw?-t:t)};
  const asrAng=-Math.atan(1/(CFG.asrFactor+tan(Math.abs(lat-dec))))/rad;
  const h={sunrise:at(.833,1),fajr:at(18,1),dhuhr:noon+.0,asr:at(asrAng,0),maghrib:at(.833,0),isha:at(18,0)};
  const day=new Date(date.getFullYear(),date.getMonth(),date.getDate()),out={};
  for(const k in h)out[k]=new Date(day.getTime()+Math.round(h[k]*60+(CFG.offsets[k]||0))*6e4);
  return out;
}
// ---- Hijri (Umm al-Qura via browser Intl) ----
const adj=d=>new Date(d.getTime()+CFG.hijriAdjust*864e5);
const hparts=d=>{const p=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'numeric',year:'numeric'}).formatToParts(adj(d));const g=t=>+p.find(x=>x.type===t).value;return{d:g('day'),m:g('month'),y:g('year')}};
const hName=(d,loc)=>new Intl.DateTimeFormat(loc+'-u-ca-islamic-umalqura-nu-latn',{month:'long'}).format(adj(d));
const noonOf=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate(),12);
const fmt=d=>{let h=d.getHours(),m=d.getMinutes(),ap=h>=12?'PM':'AM';h=h%12||12;return[h+':'+String(m).padStart(2,'0'),ap]};
const $=s=>document.querySelector(s);

function drawSun(now){const a=prayers(now),s=fmt(a.sunrise),m=fmt(a.maghrib);$('#sun').textContent='Sunrise '+s[0]+' '+s[1]+' · Sunset '+m[0]+' '+m[1]}
function applyTheme(){let t=CFG.theme||'dark';if(t==='auto')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  document.documentElement.dataset.theme=t;const mt=document.querySelector('meta[name=theme-color]');if(mt)mt.content=t==='light'?'#f5f0e1':'#06140f'}
applyTheme();
// ---- moon phase & distance (low-precision astronomical series, offline) ----
function moon(now){
  const T=(now/864e5+2440587.5-2451545)/36525;
  const D=fix(297.8502+445267.1115*T,360),M=fix(357.5291+35999.0503*T,360),Mp=fix(134.9634+477198.8676*T,360),F=fix(93.272+483202.0175*T,360);
  const lm=fix(218.3165+481267.8813*T+6.289*sin(Mp)+1.274*sin(2*D-Mp)+.658*sin(2*D)+.214*sin(2*Mp)-.186*sin(M)-.114*sin(2*F),360);
  const ls=fix(280.4665+36000.7698*T+1.915*sin(M)+.02*sin(2*M),360);
  const dist=385001-20905*cos(Mp)-3699*cos(2*D-Mp)-2956*cos(2*D)-570*cos(2*Mp);
  const psi=fix(lm-ls,360),wax=psi<180,e=wax?psi:360-psi;
  return{k:(1-cos(e))/2,wax,e,dist,age:psi/360*29.53};
}
function drawMoon(now){
  const m=moon(now),R=19*384400/m.dist,a=R*cos(m.e),ax=Math.abs(a).toFixed(2);   // disc size follows real distance
  const lit='M0 '+-R+' A'+R+' '+R+' 0 0 1 0 '+R+' A'+ax+' '+R+' 0 0 '+(a>0?0:1)+' 0 '+-R+'Z';
  $('#moon').innerHTML='<svg viewBox="-22 -22 44 44"><circle r="'+R+'" style="fill:var(--moon-dark);stroke:var(--moon-line)" stroke-width=".6"/><path d="'+lit+'" style="fill:var(--moon-lit)"'+(m.wax?'':' transform="scale(-1,1)"')+'/></svg>'+
    '<div>'+Math.round(m.k*100)+'% lit<br>'+(m.wax?'Waxing':'Waning')+' · day '+Math.round(m.age)+'</div>';
}
const DAY=864e5;
// special days by Hijri month: d = month description, n = [[days], type, text]; type h = holiday, s = special day
const EVT={
 1:{d:'Sacred month · fast the 9th & 10th',n:[[[1],'s','Islamic New Year'],[[10],'h','Ashura']]},
 2:{d:'Second month of the year',n:[]},
 3:{d:'Month of the Prophet’s ﷺ birth',n:[[[12],'h','Mawlid (Eid Milad-un-Nabi)']]},
 4:{d:'Fourth month of the year',n:[[[11],'s','Giyarvin (Gyarvi Sharif)']]},
 5:{d:'Fifth month of the year',n:[]},
 6:{d:'Sixth month of the year',n:[]},
 7:{d:'Sacred month · before Sha’ban',n:[[[1],'s','Rajab begins'],[[27],'s','Isra & Mi’raj (Shab-e-Meraj)']]},
 8:{d:'Month before Ramadan · extra fasting',n:[[[15],'s','Shab-e-Barat']]},
 9:{d:'Month of fasting and the Qur’an',n:[[[1],'s','First day of Ramadan'],[[17],'s','Battle of Badr'],[[21,23,25,27,29],'s','Odd nights · Laylat al-Qadr']]},
 10:{d:'Month of Eid · 6 fasts of Shawwal',n:[[[1],'h','Eid al-Fitr']]},
 11:{d:'Sacred month · before Hajj',n:[]},
 12:{d:'Month of Hajj · first 10 days',n:[[[9],'s','Day of Arafah'],[[10],'h','Eid al-Adha (Bakrid)'],[[11,12,13],'s','Days of Tashreeq']]}
};
function mlen(first){const m=hparts(first).m;let n=1;while(n<31&&hparts(new Date(first.getTime()+n*DAY)).m===m)n++;return n}
function monthFirst(t,off){
  let first=new Date(t.getTime()-(hparts(t).d-1)*DAY);
  for(let i=0;i<Math.abs(off);i++){
    if(off>0)first=new Date(first.getTime()+mlen(first)*DAY);
    else{const p=new Date(first.getTime()-DAY);first=new Date(p.getTime()-(hparts(p).d-1)*DAY)}
  }
  return first;
}
let calOff=0,calTimer=null;
function setCal(off){calOff=Math.max(-60,Math.min(60,off));clearTimeout(calTimer);if(calOff)calTimer=setTimeout(()=>setCal(0),30000);drawCalendar(new Date())}
function drawCalendar(now){
  const t=noonOf(now),h=hparts(t),first=monthFirst(t,calOff),fh=hparts(first),len=mlen(first);
  const ev=EVT[fh.m]||{d:'',n:[]},notes=ev.n.map(x=>x.slice()),mark={};
  if(fh.m===9)for(let d=len;d>=1;d--)if(new Date(first.getTime()+(d-1)*DAY).getDay()===5){notes.push([[d],'s','Jumu’atul-Vida (last Friday)']);break}
  notes.forEach(n=>n[0].forEach(d=>{if(n[1]==='h'||mark[d]!=='h')mark[d]=n[1]}));
  const last=new Date(first.getTime()+(len-1)*DAY),mo=x=>x.toLocaleDateString('en-GB',{month:'short'});
  $('#cal').classList.toggle('ramadan',fh.m===9);
  $('#chead').innerHTML='<button class="nav" data-nav="-1">‹</button><div class="mid"><div class="ar">'+hName(first,'ar')+' '+fh.y+'</div><div class="en">'+hName(first,'en')+' '+fh.y+' AH · '+mo(first)+(mo(last)!==mo(first)?'–'+mo(last):'')+' '+last.getFullYear()+(calOff?' · <span class="tod" data-nav="0">Today</span>':'')+'</div></div><button class="nav" data-nav="1">›</button>';
  const dn=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],de=['SUN','MON','TUE','WED','THU','FRI','SAT'];
  let g=dn.map((a,i)=>'<div class="dn">'+a+'<br>'+de[i]+'</div>').join('');
  for(let i=0;i<first.getDay();i++)g+='<div></div>';
  for(let d=1;d<=len;d++){const gd=new Date(first.getTime()+(d-1)*DAY),dow=gd.getDay();
    g+='<div class="d'+(!calOff&&d===h.d?' today':'')+(dow===5?' fri':'')+(mark[d]==='h'?' hol':mark[d]?' spl':'')+'"><div class="h">'+d+'</div><div class="g">'+gd.getDate()+'</div></div>'}
  $('#grid').innerHTML=g;
  const lab=n=>n[0].length===1?n[0][0]:n[0][0]+'–'+n[0][n[0].length-1];
  $('#notes').innerHTML='<div class="md">'+ev.d+'</div>'+notes.map(n=>'<div class="nt"><i class="'+n[1]+'"></i><b>'+lab(n)+'</b><span>'+n[2]+'</span></div>').join('');
}
$('#cal').addEventListener('click',e=>{const b=e.target.closest('[data-nav]');if(b){const v=+b.dataset.nav;setCal(v===0?0:calOff+v)}});
let tx=null;
$('#cal').addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
$('#cal').addEventListener('touchend',e=>{if(tx==null)return;const dx=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(dx)>60)setCal(calOff+(dx<0?1:-1))});
addEventListener('keydown',e=>{if(e.key==='ArrowRight')setCal(calOff+1);if(e.key==='ArrowLeft')setCal(calOff-1)});
const clockAt=(d,hm)=>{const[h,m]=hm.split(':');return new Date(d.getFullYear(),d.getMonth(),d.getDate(),+h,+m)};
function namazTimes(date,az){
  const o={};
  for(const k in CFG.namaz){const c=CFG.namaz[k];o[k]=c.after!=null?new Date(az[k].getTime()+c.after*6e4):clockAt(date,c.at)}
  if(date.getDay()===5&&CFG.jumuah)o.dhuhr=clockAt(date,CFG.jumuah);
  return o;
}
function drawPrayers(now){
  const az=prayers(now),nm=namazTimes(now,az),fri=now.getDay()===5;
  let next=NAMES.findIndex(n=>(nm[n[0]]||az[n[0]])>now);
  const wrap=next<0;
  if(wrap){const t=new Date(now.getTime()+864e5),a2=prayers(t);next=0;az.fajr=a2.fajr;nm.fajr=namazTimes(t,a2).fajr}
  $('#pr').innerHTML=NAMES.map((n,i)=>{
    const jum=fri&&n[0]==='dhuhr',[at,aa]=fmt(az[n[0]]),nv=nm[n[0]],[nt,na]=nv?fmt(nv):['',''];
    return'<div class="card p'+(i===next?' next':(wrap||i<next)?' done':'')+'"><div class="ar">'+(jum?'الجمعة':n[1])+'</div><div class="en">'+(jum?"JUMU\u2019AH":n[2])+
      '</div><div class="r az"><span>AZAN</span><b>'+at+'<small>'+aa+'</small></b></div>'+(nv?'<div class="r nm"><span>'+(jum?'JUMU\u2019AH':'NAMAZ')+'</span><b>'+nt+'<small>'+na+'</small></b></div>':'')+'</div>'}).join('');
}
let lastMin='',lastDay='';
function tick(){
  const now=new Date(),[tm,ap]=fmt(now);
  $('#time').textContent=tm;$('#sub').innerHTML='<b>'+ap+'</b><span>'+String(now.getSeconds()).padStart(2,'0')+'s</span>';
  const mk=now.getHours()+':'+now.getMinutes(),dk=now.toDateString();
  if(dk!==lastDay){lastDay=dk;const h=hparts(noonOf(now));
    $('#hdate').innerHTML=h.d+' '+hName(noonOf(now),'ar')+'<small>'+hName(noonOf(now),'en')+' '+h.y+' AH</small>';
    $('#gdate').textContent=now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    const eidDay=(h.m===10&&h.d===1)||(h.m===12&&h.d===10),eb=$('#eid');
    if(eidDay&&CFG.eid){const[et,ea]=fmt(clockAt(now,CFG.eid));eb.style.display='block';eb.textContent='عيد مبارك · EID NAMAZ '+et+' '+ea}else eb.style.display='none';
    drawCalendar(now)}
  if(mk!==lastMin){lastMin=mk;drawPrayers(now);drawMoon(now);drawSun(now)}
}
// ---- weather (Open-Meteo, no key). Keeps last good reading if offline ----
const WC={0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Fog',51:'Light drizzle',53:'Drizzle',55:'Drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',80:'Showers',81:'Showers',82:'Heavy showers',95:'Thunderstorm',96:'Thunderstorm',99:'Thunderstorm'};
function showWx(w){$('#wx .city').textContent=CFG.city;$('#wx .t').textContent=Math.round(w.t)+'°C';$('#wx .c').textContent=(WC[w.c]||'')+' · Humidity '+w.h+'%'}
async function weather(){
  try{
    const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude='+CFG.lat+'&longitude='+CFG.lon+'&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto');
    const j=(await r.json()).current,w={t:j.temperature_2m,h:j.relative_humidity_2m,c:j.weather_code};
    showWx(w);try{localStorage.setItem('wx',JSON.stringify(w))}catch(e){}
  }catch(e){try{const w=JSON.parse(localStorage.getItem('wx'));if(w)showWx(w);else{$('#wx .city').textContent=CFG.city;$('#wx .c').textContent='Weather unavailable'}}catch(_){}}
}
// phone layout = touch device; add ?display to force the wide display layout (e.g. a touchscreen on the Pi)
const PHONE=(NATIVE||matchMedia('(pointer:coarse)').matches||/[?&]app/.test(location.search))&&!/[?&]display/.test(location.search);
document.documentElement.classList.toggle('phone',PHONE);
// reload every night at 03:05 so a display picks up files updated from git
(()=>{const n=new Date(),t=new Date(n.getFullYear(),n.getMonth(),n.getDate()+(n.getHours()>=3?1:0),3,5);setTimeout(()=>location.reload(),t-n)})();
function fit(){const H=innerHeight-(PHONE?60:0),r=Math.min(innerWidth/(PHONE?50.4:54),H/96),h=Math.max(96,H/r)+'rem';document.documentElement.style.fontSize=r+'px';$('#stage').style.height=h;document.querySelectorAll('.view').forEach(v=>v.style.height=h)}
// ---- settings sheet ----
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const FLD=['fajr','dhuhr','asr','maghrib','isha'];
const toTxt=c=>!c?'':c.after!=null?'+'+c.after:c.at;
function parseNz(v){v=v.trim();if(/^\+?\d{1,3}$/.test(v))return{after:+v};const m=v.match(/^(\d{1,2}):(\d{2})$/);return m&&+m[1]<24&&+m[2]<60?{at:m[1].padStart(2,'0')+':'+m[2]}:null}
function openSettings(){
  $('#sheet').classList.add('on');$('#q').value='';$('#res').innerHTML='';$('#cur').textContent='Current: '+CFG.city;
  $('#mad').value=CFG.madhhab;$('#thm').value=CFG.theme||'dark';
  $('#nsec').style.display=NATIVE?'block':'none';
  if(NATIVE){const N=CFG.notify||{};['on','before','azan','namaz','friday','azkar','daily'].forEach(k=>$('#nf_'+k).value=String(N[k]??0));$('#nf_sound').value=N.sound||'default';if(typeof updateExactStatus==='function')updateExactStatus()}$('#adj').value=CFG.hijriAdjust;
  FLD.forEach(k=>$('#n_'+k).value=toTxt(CFG.namaz[k]));$('#n_j').value=CFG.jumuah||'';$('#n_e').value=CFG.eid||'';
  if(typeof fillNotif==='function')fillNotif();
}
function setLoc(lat,lon,name){CFG.lat=+(+lat).toFixed(4);CFG.lon=+(+lon).toFixed(4);CFG.city=name;$('#cur').textContent='Current: '+name;$('#res').innerHTML=''}
async function search(){
  const q=$('#q').value.trim();if(!q)return;$('#res').textContent='Searching…';
  try{
    const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?count=8&language=en&name='+encodeURIComponent(q)),j=await r.json();
    if(!j.results){$('#res').textContent='No match. Try another spelling.';return}
    const nm=x=>x.name+(x.admin1?', '+x.admin1:'');
    $('#res').innerHTML=j.results.map((x,i)=>'<div class="hit" data-i="'+i+'">'+esc(nm(x)+', '+x.country)+'</div>').join('');
    $('#res').onclick=e=>{const el=e.target.closest('.hit');if(el){const x=j.results[+el.dataset.i];setLoc(x.latitude,x.longitude,nm(x))}};
  }catch(e){$('#res').textContent='Search needs an internet connection.'}
}
function closeSettings(){
  if(NATIVE)CFG.notify={on:+$('#nf_on').value,before:+$('#nf_before').value,azan:+$('#nf_azan').value,namaz:+$('#nf_namaz').value,friday:+$('#nf_friday').value,azkar:+$('#nf_azkar').value,daily:+$('#nf_daily').value,sound:$('#nf_sound').value};
  CFG.madhhab=$('#mad').value;CFG.asrFactor=CFG.madhhab==='hanafi'?2:1;CFG.theme=$('#thm').value;applyTheme();CFG.hijriAdjust=+$('#adj').value;
  const nz={};FLD.forEach(k=>{const c=parseNz($('#n_'+k).value);if(c)nz[k]=c});CFG.namaz=nz;
  const j=parseNz($('#n_j').value),e=parseNz($('#n_e').value);CFG.jumuah=j&&j.at||'';CFG.eid=e&&e.at||'';
  if(typeof readNotif==='function')readNotif();
  try{localStorage.setItem('cfg',JSON.stringify({lat:CFG.lat,lon:CFG.lon,city:CFG.city,asrFactor:CFG.asrFactor,madhhab:CFG.madhhab,theme:CFG.theme,notify:CFG.notify,notif:CFG.notif,hijriAdjust:CFG.hijriAdjust,namaz:CFG.namaz,jumuah:CFG.jumuah,eid:CFG.eid}))}catch(x){}
  $('#sheet').classList.remove('on');lastDay='';lastMin='';tick();weather();if(typeof refreshShell==='function')refreshShell();
  if(NATIVE&&typeof applyNotifySettings==='function')applyNotifySettings();
}
$('#wx').addEventListener('click',openSettings);
$('#go').onclick=search;$('#q').addEventListener('keydown',e=>{if(e.key==='Enter')search()});$('#done').onclick=closeSettings;
$('#gps').onclick=()=>{if(!navigator.geolocation)return;navigator.geolocation.getCurrentPosition(
  p=>setLoc(p.coords.latitude,p.coords.longitude,'My location ('+p.coords.latitude.toFixed(2)+', '+p.coords.longitude.toFixed(2)+')'),
  ()=>{$('#cur').textContent='Could not get your location. Allow location access, or search for your city.'},{timeout:10000})};
if(WEB&&!saved)setTimeout(()=>{if(PHONE)openSettings()},700);   // first launch: ask for city
// keep the screen on when opened as .../index.html?awake (for a tablet used as a masjid display)
if(/[?&]awake/.test(location.search)&&'wakeLock' in navigator){const lock=()=>navigator.wakeLock.request('screen').catch(()=>{});lock();document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')lock()})}
if('serviceWorker' in navigator&&location.protocol.startsWith('http')&&!NATIVE)navigator.serviceWorker.register('sw.js').catch(()=>{});
addEventListener('resize',fit);fit();tick();setInterval(tick,1000);weather();setInterval(weather,18e5);
