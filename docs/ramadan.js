// ---- Occasions: Ramadan companion. Guides are DRAFTS pending imam review. ----
const rget=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const rput=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let RB=+rget('rbuf',0);                       // minutes before Fajr azan when Sehri ends
const DAYMS=864e5;
const gdate=d=>d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const tstr=d=>fmt(d).join(' ');
function ramadan(now){
  const t=noonOf(now),h=hparts(t);let start;
  if(h.m===9)start=new Date(t.getTime()-(h.d-1)*DAYMS);
  else{let d=new Date(t.getTime()+DAYMS);for(let i=0;i<420;i++,d=new Date(d.getTime()+DAYMS)){const p=hparts(d);if(p.m===9&&p.d===1){start=d;break}}}
  return{start,len:mlen(start),day:h.m===9?h.d:0,year:hparts(start).y,until:h.m===9?0:Math.round((start-t)/DAYMS)};
}
const sehriOf=d=>new Date(prayers(d).fajr.getTime()-RB*6e4);
const iftarOf=d=>prayers(d).maghrib;

// extra duas, searchable together with the others in Duas
Object.assign(DD,{
 q97:{t:`Surah Al-Qadr`,q:`97:1-5`},
 r_intent:{t:`Intention for the fast`,ar:`وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ`,tr:`Wa bisawmi ghadin nawaytu min shahri ramadan`,en:`I intend to fast tomorrow in the month of Ramadan.`,src:`Commonly taught wording. The intention is in the heart and no wording is required. ${HS}`},
 r_iftar:{t:`Breaking the fast (Iftar)`,ar:`ٱللَّٰهُمَّ لَكَ صُمْتُ وَعَلَىٰ رِزْقِكَ أَفْطَرْتُ`,tr:`Allahumma laka sumtu wa ’ala rizqika aftartu`,en:`O Allah, for You I fasted and with Your provision I break my fast.`,src:`Abu Dawud (a mursal narration; scholars differ on its grading, reviewer to confirm). ${HS}`,
  alts:[{l:`After breaking the fast`,ar:`ذَهَبَ ٱلظَّمَأُ وَٱبْتَلَّتِ ٱلْعُرُوقُ وَثَبَتَ ٱلْأَجْرُ إِنْ شَاءَ ٱللَّٰهُ`,tr:`Dhahaba az-zama’u wabtallatil-’uruqu wa thabatal-ajru in sha’ Allah`,en:`The thirst has gone, the veins are moistened, and the reward is certain, if Allah wills.`,src:`Abu Dawud. ${HS}`}]},
 r_hilal:{t:`On seeing the new moon`,ar:`ٱللَّٰهُمَّ أَهِلَّهُ عَلَيْنَا بِٱلْأَمْنِ وَٱلْإِيمَانِ، وَٱلسَّلَامَةِ وَٱلْإِسْلَامِ، رَبِّي وَرَبُّكَ ٱللَّٰهُ`,tr:`Allahumma ahillahu ’alayna bil-amni wal-iman, was-salamati wal-islam, rabbi wa rabbukallah`,en:`O Allah, bring it over us with security and faith, with safety and Islam. My Lord and your Lord is Allah.`,src:`Tirmidhi, Darimi. ${HS}`},
 r_qadr:{t:`Dua for Laylat al-Qadr`,ar:`ٱللَّٰهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ ٱلْعَفْوَ فَٱعْفُ عَنِّي`,tr:`Allahumma innaka ’afuwwun tuhibbul-’afwa fa’fu ’anni`,en:`O Allah, You are Pardoning and love to pardon, so pardon me.`,src:`Tirmidhi, Ibn Majah (from ’A’ishah). ${HS}`}
});

const ohdr=(t,back,bt)=>`<a class="back" href="#${back}"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>${bt}</a><h1>${t}</h1>`;
const RMENU=[['calendar','Sehri and Iftar calendar','Times for every day of Ramadan'],['checklist','Daily checklist','Prayers, Quran, dhikr and charity today'],['fasts','Fast tracker','Mark fasted and missed days, track make-ups'],['fasting','Fasting guide','Intention, what breaks the fast, make-ups'],['taraweeh','Taraweeh','What it is and how to pray it'],['qadr','Laylat al-Qadr','Odd nights, worship and dua'],['duas','Ramadan duas','Intention, Iftar, new moon'],['fitrana','Zakat al-Fitr','Fitrana: who pays, when and how much']];
const RPAGES={
 fasting:{t:`Fasting guide`,m:1,b:[
  {h:`What the fast is`,p:`Abstaining from food, drink and marital relations from true dawn (Fajr) until sunset (Maghrib), with the intention to fast for Allah.`},
  {h:`The intention`,p:{hanafi:`The intention is in the heart. For a Ramadan fast it can be made at night, or the next morning before midday if you have not eaten or drunk.`,shafii:`The intention must be made at night, before Fajr, for each day of Ramadan.`}},
  {h:`What breaks the fast`,l:{hanafi:[`Eating or drinking on purpose.`,`Marital relations in the day.`,`Vomiting on purpose (a mouthful or more).`,`The start of menstrual or postnatal bleeding.`],shafii:[`Eating or drinking on purpose.`,`Marital relations in the day.`,`Vomiting on purpose.`,`The start of menstrual or postnatal bleeding.`]}},
  {h:`What does not break it`,l:[`Eating or drinking by mistake, having forgotten you were fasting.`,`Unintentional vomiting.`]},
  {h:`Who may not fast`,l:[`The sick, for as long as the illness lasts.`,`Travellers, for the journey.`,`Women during menstruation and postnatal bleeding. They must not fast and make up the days later.`,`Pregnant and nursing women, and the elderly who cannot fast: the rulings differ, so ask your imam.`]},
  {h:`Making up missed fasts`,p:`Make up each missed day after Ramadan (qada). Use the Fast tracker to keep count.`},
  {h:`Fasting broken on purpose`,p:{hanafi:`Deliberately eating, drinking or having relations in the day of a Ramadan fast calls for a make-up day and also an expiation (kaffarah). Ask your imam for the details.`,shafii:`The expiation (kaffarah) applies to breaking the fast with marital relations. Other deliberate breaks need a make-up day. Ask your imam for the details.`}}],
  refs:`Hanafi: Mukhtasar al-Quduri, Nur al-Idah. Shafi’i: Safinat al-Naja. Quran 2:183-187. ${ST}`},
 taraweeh:{t:`Taraweeh`,b:[
  {h:`What it is`,p:`A voluntary night prayer prayed in Ramadan after Isha, usually in congregation at the masjid. Many masjids recite the Quran through over the month.`},
  {h:`How to pray it`,n:[`Pray after the Isha prayer and its sunnah.`,`Pray in sets of two rakats, ending each set with the salaam.`,`Recite Al-Fatiha and a part of the Quran in each rakat.`,`Many people rest briefly after every four rakats.`,`Pray Witr after Taraweeh (see Rakats for Isha).`]},
  {h:`How many rakats`,p:`Most masjids in India pray 20 rakats; some pray 8, following other narrations. Pray as your masjid prays, and ask your imam about the reasons for each view.`},
  {h:`Women`,p:`Women may pray Taraweeh at home or at the masjid where it is offered.`}],
  refs:`Hanafi: Radd al-Muhtar. Shafi’i: Minhaj al-Talibin. Bukhari, Muslim (night prayer in Ramadan). ${ST}`}
};
function renderOcc(sub,sub2){
  const el=$('#obody'),now=new Date(),r=ramadan(now);
  if((sub2==='qadr'||sub2==='duas')&&!(QD.ar&&QD.en&&QD.tr)){el.innerHTML='<p>Loading…</p>';Promise.all(['ar','en','tr'].map(qload)).then(()=>{if(location.hash.startsWith('#occ'))renderOcc(sub,sub2)}).catch(()=>{el.innerHTML='<p>The Quran data could not be loaded.</p>'});return}
  if(!sub){
    el.innerHTML=`<h1>Occasions</h1>${banner()}<a class="item" href="#occ/ramadan"><div>Ramadan<small>${r.day?`Day ${r.day} of ${r.len}`:`Ramadan ${r.year} starts in about ${r.until} days`}</small></div><span class="c">›</span></a><div class="soon"><b>Coming next:</b> Eid, Hajj and Umrah guides.</div>`;return}
  if(sub!=='ramadan'){renderOcc();return}
  const back=sub2?'occ/ramadan':'occ',bt=sub2?'Ramadan':'Occasions';
  if(!sub2){
    const d0=r.day?now:r.start,T=prayers(d0);
    el.innerHTML=ohdr('Ramadan',back,bt)+banner()+
     `<div class="rbox"><div class="r1">${r.day?`Ramadan day ${r.day} of ${r.len}`:`Ramadan ${r.year} is expected to start about ${gdate(r.start)} (${r.until} days from now)`}</div>`+
     `<div class="rtimes"><div><small>Sehri ends${r.day?'':' (first day)'}</small><b>${tstr(sehriOf(d0))}</b></div><div><small>Iftar${r.day?'':' (first day)'}</small><b>${tstr(T.maghrib)}</b></div></div>`+(r.day?`<div id="rcd" class="rc2"></div>`:'')+`</div>`+
     `<p>Stop eating this long before Fajr azan:</p><div class="chips">`+[0,5,10,15].map(m=>`<button class="chip${RB===m?' on':''}" data-rb="${m}">${m?m+' min':'At Fajr'}</button>`).join('')+`</div><p class="src">The Hijri date follows the calendar and your adjustment in Settings. Confirm the start of Ramadan with your masjid.</p>`+
     RMENU.map(m=>`<a class="item" href="#occ/ramadan/${m[0]}"><div>${m[1]}<small>${m[2]}</small></div><span class="c">›</span></a>`).join('');
    tickRamadan();return;
  }
  let h=ohdr((RMENU.find(m=>m[0]===sub2)||[,'Ramadan'])[1],back,bt)+banner();
  if(sub2==='calendar'){
    h+=`<p>Sehri ends ${RB?RB+' minutes before':'at'} Fajr azan. Iftar is at Maghrib azan.</p><div class="tw"><table class="rtab"><tr><th>Day</th><th>Date</th><th>Sehri ends</th><th>Iftar</th></tr>`;
    for(let i=0;i<r.len;i++){const d=new Date(r.start.getTime()+i*DAYMS),cls=(r.day===i+1?'tdy ':'')+(i>=r.len-10?'last ':'')+(d.getDay()===5?'fri':'');
      h+=`<tr class="${cls}"><td>${i+1}</td><td>${gdate(d)}</td><td>${tstr(sehriOf(d))}</td><td>${tstr(iftarOf(d))}</td></tr>`}
    h+=`</table></div><p class="src">Shaded rows are the last ten days. Gold rows are Fridays.</p>`;
  }else if(sub2==='checklist'){
    const key=ymd(now),all=rget('rchk',{}),done=all[key]||[],fa=rget('rfast',{}),st=(fa[r.year]||{})[r.day];
    const IT=[['sehri','Sehri'],['fajr','Fajr'],['dhuhr','Dhuhr'],['asr','Asr'],['maghrib','Maghrib'],['isha','Isha'],['taraweeh','Taraweeh'],['quran','Read some Quran'],['dhikr','Dhikr and dua'],['charity','Give charity'],['iftar','Iftar dua']];
    h+=`<p>${gdate(now)}${r.day?` · Ramadan day ${r.day}`:''}. ${done.length} of ${IT.length} done.</p>`+
      (r.day?`<div class="chips"><button class="chip${st==='f'?' on':''}" data-fs="f">Fasting today</button><button class="chip${st==='m'?' on':''}" data-fs="m">Not fasting (to make up)</button></div>`:'')+
      IT.map(i=>`<button class="chk${done.includes(i[0])?' on':''}" data-ck="${i[0]}"><span class="bx"></span>${i[1]}</button>`).join('');
  }else if(sub2==='fasts'){
    const fa=rget('rfast',{}),yy=fa[r.year]||{},made=+rget('rqada',0);
    let missed=0,fasted=0;for(const y in fa)for(const d in fa[y]){if(fa[y][d]==='m')missed++;if(y==r.year&&fa[y][d]==='f')fasted++}
    h+=`<p>Ramadan ${r.year}. Tap a day to cycle: fasted, missed, clear.</p><div class="fgrid">`+Array.from({length:r.len},(_,i)=>`<button class="fd ${yy[i+1]||''}" data-fd="${i+1}">${i+1}</button>`).join('')+`</div>`+
      `<div class="rbox"><div class="r1">Fasted: ${fasted} · Missed so far: ${missed} · Made up: ${made}</div><div class="rc2">To make up: ${Math.max(0,missed-made)}</div></div><div class="chips"><button class="chip" data-mu="1">+1 made up</button><button class="chip" data-mu="-1">−1</button></div>`+
      `<p class="src">Saved on this device. Days of menstruation and illness are counted as missed days to make up.</p>`;
  }else if(sub2==='qadr'){
    h+=`<p>Laylat al-Qadr, the Night of Power, is sought in the odd nights of the last ten nights of Ramadan. Many people look for it especially on the 27th night.</p><h2>The nights this year</h2><div class="tw"><table class="rtab"><tr><th>Night</th><th>Begins at sunset on</th><th>Maghrib</th></tr>`+
      [21,23,25,27,29].map(n=>{const d=new Date(r.start.getTime()+(n-2)*DAYMS);return `<tr${n===27?' class="fri"':''}><td>${n}th</td><td>${gdate(d)}</td><td>${tstr(iftarOf(d))}</td></tr>`}).join('')+`</table></div>`+
      `<h2>How to spend it</h2><ul><li>Pray at night (Taraweeh and voluntary prayers).</li><li>Read and reflect on the Quran.</li><li>Make dhikr and dua, and seek forgiveness.</li><li>Many people spend the last ten days in i’tikaf (retreat) in the masjid. Ask your imam about its rules.</li></ul>`+
      `<h2>Recitation and dua</h2>`+dcard('q97')+dcard('r_qadr')+`<p class="src">Bukhari, Muslim (seeking it in the odd nights). ${ST}</p>`;
  }else if(sub2==='duas'){
    h+=['r_intent','r_iftar','r_hilal','r_qadr','q97'].map(dcard).join('')+`<p class="src">${ST}</p>`;
  }else if(sub2==='fitrana'){
    h+=`<p>Zakat al-Fitr (fitrana) is a charity paid at the end of Ramadan, before the Eid prayer.</p>`+body([
      {h:`Who pays`,p:`Every Muslim who has more than their basic needs, for themselves and for the people they support, including children.`},
      {h:`When`,p:`Before the Eid prayer. It may be paid a few days early. If paid after the Eid prayer it counts as ordinary charity.`},
      {h:`What and how much`,p:{hanafi:`Half a sa’ of wheat, or one sa’ of dates, raisins or barley, per person. Its money value may be given instead. Your masjid or local scholars announce the amount in rupees each year.`,shafii:`One sa’ of the staple food of your area per person, given as food. Many scholars of this school do not accept the money value instead. Ask your imam.`}}])+
      `<h2>Calculator</h2><p>Enter this year’s amount per person from your masjid.</p><div class="jrow"><input id="fp" inputmode="decimal" placeholder="Amount per person (₹)"><input id="fn" inputmode="numeric" placeholder="People" value="1"></div><div class="rbox"><div class="r1" id="ftot">Total: –</div></div>`+
      `<p class="src">Hanafi: Radd al-Muhtar. Shafi’i: Minhaj al-Talibin. Bukhari, Muslim (Ibn ’Umar). ${ST}</p>`;
  }else if(RPAGES[sub2]){
    const P=RPAGES[sub2];h+=(P.m?mchips():'')+body(P.b)+`<p class="src">${P.refs}</p>`;
  }else{renderOcc('ramadan');return}
  el.innerHTML=h;
}
function tickRamadan(){
  clearInterval(window.__rt);
  const e=$('#rcd');if(!e)return;
  const go=()=>{const el=$('#rcd');if(!el){clearInterval(window.__rt);return}
    const n=new Date(),T=prayers(n),s=sehriOf(n),i=T.maghrib;let lab,t;
    if(n<s){lab='Sehri ends in';t=s}else if(n<i){lab='Iftar in';t=i}else{lab='Sehri ends in';t=sehriOf(new Date(n.getTime()+DAYMS))}
    const x=Math.max(0,Math.round((t-n)/1000)),p=v=>String(v).padStart(2,'0');el.textContent=lab+' '+p(Math.floor(x/3600))+':'+p(Math.floor(x%3600/60))+':'+p(x%60)};
  go();window.__rt=setInterval(go,1000);
}
$('#obody').addEventListener('click',e=>{
  const b=e.target.closest('[data-rb],[data-ck],[data-fs],[data-fd],[data-mu],[data-sm]');if(!b)return;
  const p=location.hash.slice(1).split('/'),r=ramadan(new Date());
  if(b.dataset.rb!=null){RB=+b.dataset.rb;rput('rbuf',RB)}
  else if(b.dataset.sm){SM=b.dataset.sm}
  else if(b.dataset.ck){const k=ymd(new Date()),all=rget('rchk',{}),a=all[k]||[],i=a.indexOf(b.dataset.ck);i<0?a.push(b.dataset.ck):a.splice(i,1);all[k]=a;rput('rchk',all)}
  else if(b.dataset.fs){const fa=rget('rfast',{});fa[r.year]=fa[r.year]||{};fa[r.year][r.day]=fa[r.year][r.day]===b.dataset.fs?'':b.dataset.fs;rput('rfast',fa)}
  else if(b.dataset.fd){const fa=rget('rfast',{}),d=b.dataset.fd;fa[r.year]=fa[r.year]||{};const c=fa[r.year][d]||'';fa[r.year][d]=c===''?'f':c==='f'?'m':'';rput('rfast',fa)}
  else if(b.dataset.mu){rput('rqada',Math.max(0,+rget('rqada',0)+ +b.dataset.mu))}
  const y=$('#v-occ').scrollTop;renderOcc(p[1],p[2]);$('#v-occ').scrollTop=y;
});
$('#obody').addEventListener('input',e=>{
  if(e.target.id!=='fp'&&e.target.id!=='fn')return;
  const a=parseFloat($('#fp').value),n=parseInt($('#fn').value,10);
  $('#ftot').textContent=(a>0&&n>0)?'Total: ₹'+(a*n).toLocaleString('en-IN',{maximumFractionDigits:2}):'Total: –';
});
