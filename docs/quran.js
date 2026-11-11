// ---- Quran reader (text embedded in data/*.json, works offline) ----
const QD={},QP={},QF={surahs:'data/surahs.json',ar:'data/ar.json',en:'data/en.json',tr:'data/tr.json',ur:'data/ur.json'};
const qload=k=>QD[k]?Promise.resolve(QD[k]):(QP[k]||(QP[k]=fetch(QF[k]).then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>QD[k]=d).catch(e=>{delete QP[k];throw e})));
function qtext(kind,ref){const d=QD[kind];if(!d)return null;const m=ref.match(/^(\d+):(\d+)(?:-(\d+))?$/);return d[m[1]-1].slice(m[2]-1,+(m[3]||m[2])).join(' ')}
let QS={tr:0,en:1,ur:0,size:3.4},QL=null,QB=[],QKEEP=null,QTAB='s';
try{Object.assign(QS,JSON.parse(localStorage.getItem('qset')||'{}'));QL=JSON.parse(localStorage.getItem('qlast')||'null');QB=JSON.parse(localStorage.getItem('qbook')||'[]')}catch(e){}
const saveQ=()=>{try{localStorage.setItem('qset',JSON.stringify(QS))}catch(e){}};
const saveB=()=>{try{localStorage.setItem('qbook',JSON.stringify(QB))}catch(e){}};
const isSaved=(s,a)=>QB.some(b=>b[0]===s&&b[1]===a);
const PRAYER_SURAHS=[1,103,105,106,107,108,109,110,111,112,113,114];
// first verse of each juz (checked against quran-meta, Hafs)
const JUZ=[[1,1],[2,142],[2,253],[3,93],[4,24],[4,148],[5,82],[6,111],[7,88],[8,41],[9,93],[11,6],[12,53],[15,1],[17,1],[18,75],[21,1],[23,1],[25,21],[27,56],[29,46],[33,31],[36,28],[39,32],[41,47],[46,1],[51,31],[58,1],[67,1],[78,1]];
// verses of hope, remembrance, gratitude and patience for the verse of the day
const DAILY=['2:152','2:153','2:186','2:201','2:255','2:286','3:8','3:139','3:159','3:173','6:162','7:23','12:87','13:28','14:7','16:97','17:80','18:10','20:114','21:87','23:118','25:74','29:69','39:10','39:53','40:60','49:13','51:56','57:4','65:2-3','93:3-5','94:5-6','96:1-5','103:1-3','112:1-4'];
const dailyRef=()=>{const n=new Date(),d=Math.floor((new Date(n.getFullYear(),n.getMonth(),n.getDate())-new Date(n.getFullYear(),0,0))/864e5);return DAILY[d%DAILY.length]};
const qcredits=()=>`<p class="src">Arabic text: The Noble Qur’an Encyclopedia (quranenc.com). Transliteration and English translation (Saheeh International), and the Urdu translation (Abul A’la Maududi): Tanzil, <a href="https://tanzil.net" target="_blank" rel="noopener">tanzil.net</a>. Compiled by quran-json, CC BY-SA 4.0. The text has not been changed.</p>`;
const snip=(t,n)=>esc(t.length>n?t.slice(0,n).replace(/\s+\S*$/,'')+'…':t);
const star=on=>`<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.8 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></svg>`;

function renderQuran(n,a){
  const el=$('#sbody'),want=location.hash;
  const need=['surahs','ar'].concat(!n||QS.en?['en']:[]).concat(n&&QS.tr?['tr']:[]).concat(n&&QS.ur?['ur']:[]);
  el.innerHTML=(n?'':hdr('Quran'))+'<p>Loading…</p>';
  Promise.all(need.map(qload)).then(()=>{if(location.hash!==want)return;n?readSurah(+n,a?+a:0):qhome()})
   .catch(()=>{el.innerHTML=hdr('Quran')+'<p>The Quran data could not be loaded. Check your connection and try again.</p>'});
}
function qhome(){
  const S=QD.surahs,tab=QTAB;
  let h=hdr('Quran')+`<div class="chips">`+[['s','Surahs'],['j','Juz'],['b','Saved'],['f','Search']].map(([k,l])=>`<button class="chip${tab===k?' on':''}" data-qtab="${k}">${l}</button>`).join('')+`</div>`;
  if(tab==='s'){
    const r=dailyRef(),[ds,da]=r.split(':');
    h+=`<a class="vod" href="#salah/quran/${ds}/${da.split('-')[0]}"><h3>Verse of the day · ${esc(S[ds-1][1])} ${r}</h3><div class="arb" lang="ar" dir="rtl" style="font-size:3rem">${qtext('ar',r)}</div><div class="en">${esc(qtext('en',r))}</div></a>`+
      (QL?`<a class="item" href="#salah/quran/${QL.s}"><div>Continue reading<small>${esc(S[QL.s-1][1])}, verse ${QL.a}</small></div><span class="c">›</span></a>`:'')+
      `<div class="jrow"><input id="qjump" placeholder="Go to verse, e.g. 2:255" inputmode="numeric" autocomplete="off"><button class="btn" id="qgo2">Go</button></div>`+
      `<h2>Often recited in prayer</h2><div class="chips">`+PRAYER_SURAHS.map(i=>`<a class="chip" href="#salah/quran/${i}">${esc(S[i-1][1])}</a>`).join('')+`</div>`+
      `<input id="qsearch" placeholder="Filter surahs by name or number" autocomplete="off"><div id="slist">`+
      S.map((s,i)=>`<a class="item" href="#salah/quran/${i+1}" data-q="${esc((i+1)+' '+s[1]+' '+s[2]).toLowerCase()}"><div>${i+1}. ${esc(s[1])}<small>${esc(s[2])} · ${s[3]==='M'?'Meccan':'Medinan'} · ${s[4]} verses</small></div><span class="arn" lang="ar">${s[0]}</span></a>`).join('')+`</div>`;
  }else if(tab==='j'){
    h+=JUZ.map((j,i)=>`<a class="item" href="#salah/quran/${j[0]}/${j[1]}"><div>Juz ${i+1}<small>Starts at ${esc(S[j[0]-1][1])} ${j[0]}:${j[1]}</small></div><span class="arn" lang="ar">${S[j[0]-1][0]}</span></a>`).join('');
  }else if(tab==='b'){
    h+=QB.length?QB.map(b=>`<a class="item" href="#salah/quran/${b[0]}/${b[1]}"><div>${esc(S[b[0]-1][1])} ${b[0]}:${b[1]}<small>${snip(QD.en[b[0]-1][b[1]-1],110)}</small></div><span class="arn" lang="ar">${S[b[0]-1][0]}</span></a>`).join('')
      :`<p>No saved verses yet. Tap the star beside a verse while reading to save it.</p>`;
  }else{
    h+=`<input id="qfind" placeholder="Search the English translation" autocomplete="off"><div id="qres"><p>Type at least three letters.</p></div>`;
  }
  $('#sbody').innerHTML=h+qcredits();
}
function qfind(q){
  const out=[],S=QD.surahs;q=q.toLowerCase();
  for(let s=0;s<114&&out.length<40;s++)for(let a=0;a<QD.en[s].length&&out.length<40;a++)if(QD.en[s][a].toLowerCase().includes(q))out.push([s+1,a+1]);
  $('#qres').innerHTML=out.length?out.map(([s,a])=>`<a class="item" href="#salah/quran/${s}/${a}"><div>${esc(S[s-1][1])} ${s}:${a}<small>${snip(QD.en[s-1][a-1],150)}</small></div><span class="c">›</span></a>`).join('')+(out.length>=40?'<p class="src">Showing the first 40 matches. Use a more specific search for fewer results.</p>':''):'<p>No verses found.</p>';
}
function readSurah(n,hl){
  const S=QD.surahs[n-1],V=QD.ar[n-1],en=QS.en&&QD.en,tr=QS.tr&&QD.tr,ur=QS.ur&&QD.ur,fs=`style="font-size:${QS.size}rem"`;
  let h=`<a class="back" href="#salah/quran"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>Quran</a><h1>${esc(S[1])} <span class="arn" lang="ar">${S[0]}</span></h1><p>${esc(S[2])} · ${S[3]==='M'?'Meccan':'Medinan'} · ${S[4]} verses</p>`+
   `<div class="chips"><button class="chip${QS.en?' on':''}" data-qt="en">English</button><button class="chip${QS.ur?' on':''}" data-qt="ur">Urdu</button><button class="chip${QS.tr?' on':''}" data-qt="tr">Transliteration</button><button class="chip" data-qz="-0.4">A−</button><button class="chip" data-qz="0.4">A+</button></div>`;
  if(n!==1&&n!==9)h+=`<div class="arb bsm" lang="ar" dir="rtl" ${fs}>${QD.ar[0][0]}</div>`;
  V.forEach((t,i)=>{const a=i+1;h+=`<div class="ay${QL&&QL.s===n&&QL.a===a?' mark':''}${hl===a?' flash':''}" id="ay${a}" data-a="${a}"><span class="num">${a}</span><button class="bm${isSaved(n,a)?' on':''}" data-bm="${a}" aria-label="Save verse">${star()}</button><div class="arb" lang="ar" dir="rtl" ${fs}>${t}</div>${tr?`<div class="tr">${esc(tr[n-1][i])}</div>`:''}${en?`<div class="en">${esc(en[n-1][i])}</div>`:''}${ur?`<div class="ur" lang="ur" dir="rtl">${esc(ur[n-1][i])}</div>`:''}</div>`});
  h+=`<div class="qnav">${n>1?`<a class="btn ghost" href="#salah/quran/${n-1}">‹ Previous</a>`:'<span></span>'}${n<114?`<a class="btn" href="#salah/quran/${n+1}">Next ›</a>`:''}</div>`+qcredits();
  $('#sbody').innerHTML=h;
  const v=$('#v-salah');
  if(QKEEP){const x=document.getElementById('ay'+QKEEP.a);if(x)v.scrollTop+=x.getBoundingClientRect().top-v.getBoundingClientRect().top-QKEEP.off;QKEEP=null}
  else if(hl){const x=document.getElementById('ay'+hl);if(x)x.scrollIntoView()}
  else if(QL&&QL.s===n){const x=document.getElementById('ay'+QL.a);if(x)x.scrollIntoView()}else v.scrollTop=0;
}
function qAnchor(){const v=$('#v-salah'),vt=v.getBoundingClientRect().top;for(const x of document.querySelectorAll('#sbody .ay')){const r=x.getBoundingClientRect();if(r.bottom>vt+10)return{a:+x.dataset.a,off:r.top-vt}}return null}
function qgoto(txt){
  const m=txt.trim().match(/^(\d{1,3})\s*[:.\s]?\s*(\d{1,3})?$/);if(!m)return false;
  const s=+m[1],a=m[2]?+m[2]:0;if(s<1||s>114)return false;if(a&&a>QD.surahs[s-1][4])return false;
  location.hash='#salah/quran/'+s+(a?'/'+a:'');return true;
}
$('#sbody').addEventListener('click',e=>{
  const t=e.target.closest('[data-qt],[data-qz],[data-bm],[data-qtab],#qgo2,.ay');if(!t)return;
  const p=location.hash.split('/'),n=+p[2];
  if(t.dataset.qtab){QTAB=t.dataset.qtab;renderQuran();return}
  if(t.id==='qgo2'){if(!qgoto($('#qjump').value))$('#qjump').style.borderColor='var(--hol)';return}
  if(!n)return;
  if(t.dataset.qt){QS[t.dataset.qt]=QS[t.dataset.qt]?0:1;saveQ();QKEEP=qAnchor();renderQuran(n)}
  else if(t.dataset.qz){QS.size=Math.max(2.4,Math.min(6,QS.size+ +t.dataset.qz));saveQ();QKEEP=qAnchor();renderQuran(n)}
  else if(t.dataset.bm){const a=+t.dataset.bm;if(isSaved(n,a))QB=QB.filter(b=>!(b[0]===n&&b[1]===a));else QB.unshift([n,a]);QB=QB.slice(0,200);saveB();t.classList.toggle('on')}
  else{QL={s:n,a:+t.dataset.a};try{localStorage.setItem('qlast',JSON.stringify(QL))}catch(x){}document.querySelectorAll('.ay.mark').forEach(x=>x.classList.remove('mark'));t.classList.add('mark')}
});
$('#sbody').addEventListener('input',e=>{
  if(e.target.id==='qsearch'){const q=e.target.value.trim().toLowerCase();document.querySelectorAll('#slist a').forEach(a=>a.style.display=!q||a.dataset.q.includes(q)?'':'none')}
  else if(e.target.id==='qfind'){const q=e.target.value.trim();if(q.length<3){$('#qres').innerHTML='<p>Type at least three letters.</p>'}else qfind(q)}
});
$('#sbody').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='qjump'){e.preventDefault();if(!qgoto(e.target.value))e.target.style.borderColor='var(--hol)'}});
