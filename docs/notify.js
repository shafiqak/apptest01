// ---- Notifications: Android app only (Capacitor LocalNotifications). The web/PWA version cannot schedule reliable alerts. ----
const LN=NATIVE?Capacitor.Plugins.LocalNotifications:null;
const NCH={
  default:{id:'azan-default',name:'Prayer reminders (sound)',description:'Azan and namaz alerts with sound',importance:4,vibration:true},
  vibrate:{id:'azan-vibrate',name:'Prayer reminders (vibrate)',description:'Azan and namaz alerts that vibrate',importance:2,vibration:true},
  silent:{id:'azan-silent',name:'Prayer reminders (silent)',description:'Azan and namaz alerts with no sound',importance:2,vibration:false}
};
const PN=[['fajr','Fajr'],['dhuhr','Dhuhr'],['asr','Asr'],['maghrib','Maghrib'],['isha','Isha']];
let lastSched=0;
async function notifyReady(){
  const p=await LN.checkPermissions();
  if(p.display==='granted')return true;
  return (await LN.requestPermissions()).display==='granted';
}
async function updateExactStatus(){
  if(!NATIVE||!LN)return;
  try{
    const ok=(await LN.checkExactNotificationSetting()).exact_alarm==='granted';
    $('#nf_exact').textContent=ok?'Exact alarm timing is allowed.':'Exact alarm timing is not allowed, so alerts can arrive a few minutes late.';
    $('#nf_btn').style.display=ok?'none':'inline-block';
  }catch(e){}
}
async function scheduleNotifications(){
  if(!NATIVE||!LN)return;
  lastSched=Date.now();
  const N=CFG.notify||{};
  try{
    const pend=await LN.getPending();
    if(pend.notifications.length)await LN.cancel({notifications:pend.notifications});
    if(!N.on)return;
    if(!(await notifyReady()))return;
    for(const k in NCH)await LN.createChannel(NCH[k]);
    const ch=(NCH[N.sound]||NCH.default).id,now=new Date(),out=[];
    const add=(at,title,body)=>{if(at>now)out.push({at,title,body})};
    let daily=null;
    if(N.daily){try{await qload('en');const r=dailyRef();daily=[`Verse of the day (${r})`,qtext('en',r).slice(0,220)]}catch(e){}}
    for(let d=0;d<14;d++){
      const day=new Date(now.getFullYear(),now.getMonth(),now.getDate()+d,12),az=prayers(day),nm=namazTimes(day,az),fri=day.getDay()===5;
      PN.forEach(([k,name])=>{
        const nmn=(k==='dhuhr'&&fri)?'Jumu’ah':name,a=az[k],t=fmt(a).join(' ');
        if(N.before)add(new Date(a.getTime()-N.before*6e4),`${name} azan in ${N.before} minutes`,`Azan at ${t} · ${CFG.city}`);
        if(N.azan)add(a,`${name} azan`,`${t} · ${CFG.city}`);
        if(N.namaz&&nm[k])add(nm[k],`${nmn} namaz`,`${fmt(nm[k]).join(' ')} · ${CFG.city}`);
      });
      if(N.friday&&fri)add(new Date(day.getFullYear(),day.getMonth(),day.getDate(),9,0),'Jumu’ah today',`Dhuhr azan at ${fmt(az.dhuhr).join(' ')}`+(CFG.jumuah?` · Jumu’ah at ${fmt(clockAt(day,CFG.jumuah)).join(' ')}`:''));
      if(N.azkar){add(new Date(az.sunrise.getTime()+15*6e4),'Morning azkar','Time for the morning remembrance');add(new Date(az.asr.getTime()+30*6e4),'Evening azkar','Time for the evening remembrance')}
      if(N.ramadan&&hparts(day).m===9){add(new Date(az.fajr.getTime()-30*6e4),'Sehri ends in 30 minutes',`Fajr azan at ${fmt(az.fajr).join(' ')}`);add(az.maghrib,'Iftar time',`Maghrib azan at ${fmt(az.maghrib).join(' ')} · ${CFG.city}`)}
      if(daily&&d<3)add(new Date(day.getFullYear(),day.getMonth(),day.getDate(),8,0),daily[0],daily[1]);
    }
    out.sort((x,y)=>x.at-y.at);
    let id=1;
    const list=out.slice(0,200).map(n=>({id:id++,title:n.title,body:n.body,channelId:ch,schedule:{at:n.at,allowWhileIdle:true},smallIcon:'ic_stat_namaz',iconColor:'#E3C26A',autoCancel:true}));
    if(list.length)await LN.schedule({notifications:list});
  }catch(e){console.error('notifications',e)}
}
async function applyNotifySettings(){await scheduleNotifications();updateExactStatus()}
if(NATIVE){
  const Cap=Capacitor.Plugins;
  $('#nf_btn').onclick=()=>LN.changeExactNotificationSetting().then(updateExactStatus).catch(()=>{});
  if(Cap.App){
    Cap.App.addListener('backButton',()=>{const h=location.hash;if(h&&h!=='#'&&h!=='#home')history.back();else Cap.App.exitApp()});
    Cap.App.addListener('appStateChange',s=>{if(s.isActive&&Date.now()-lastSched>30*60*1000)scheduleNotifications()});
  }
  scheduleNotifications();
}
