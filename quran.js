// ---- Quran reader (text embedded in data/*.json, works offline) ----
const QD={},QP={},QF={surahs:'data/surahs.json',ar:'data/ar.json',en:'data/en.json',tr:'data/tr.json'};
const qload=k=>QD[k]?Promise.resolve(QD[k]):(QP[k]||(QP[k]=fetch(QF[k]).then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>QD[k]=d)));
function qtext(kind,ref){const d=QD[kind];if(!d)return null;const m=ref.match(/^(\d+):(\d+)(?:-(\d+))?$/);return d[m[1]-1].slice(m[2]-1,+(m[3]||m[2])).join(' ')}
let QS={tr:0,en:1,size:3.4},QL=null,QKEEP=null;
try{Object.assign(QS,JSON.parse(localStorage.getItem('qset')||'{}'));QL=JSON.parse(localStorage.getItem('qlast')||'null')}catch(e){}
const saveQ=()=>{try{localStorage.setItem('qset',JSON.stringify(QS))}catch(e){}};
const PRAYER_SURAHS=[1,103,105,106,107,108,109,110,111,112,113,114];
const qcredits=()=>`<p class="src">Arabic text: The Noble Qur’an Encyclopedia (quranenc.com). Transliteration and English translation (Saheeh International): Tanzil, <a href="https://tanzil.net" target="_blank" rel="noopener">tanzil.net</a>. Compiled by quran-json, CC BY-SA 4.0. The text has not been changed.</p>`;

function renderQuran(n){
  const el=$('#sbody'),want=location.hash;
  const need=['surahs','ar'].concat(n&&QS.en?['en']:[]).concat(n&&QS.tr?['tr']:[]);
  el.innerHTML=(n?'':hdr('Quran'))+'<p>Loading…</p>';
  Promise.all(need.map(qload)).then(()=>{if(location.hash!==want)return;n?readSurah(+n):listSurahs()})
   .catch(()=>{el.innerHTML=hdr('Quran')+'<p>The Quran data could not be loaded. Check your connection and try again.</p>'});
}
function listSurahs(){
  const S=QD.surahs;
  $('#sbody').innerHTML=hdr('Quran')+(QL?`<a class="item" href="#salah/quran/${QL.s}"><div>Continue reading<small>${esc(S[QL.s-1][1])}, verse ${QL.a}</small></div><span class="c">›</span></a>`:'')+
   `<h2>Often recited in prayer</h2><div class="chips">`+PRAYER_SURAHS.map(i=>`<a class="chip" href="#salah/quran/${i}">${esc(S[i-1][1])}</a>`).join('')+`</div>`+
   `<input id="qsearch" placeholder="Search by name or number" autocomplete="off"><div id="slist">`+
   S.map((s,i)=>`<a class="item" href="#salah/quran/${i+1}" data-q="${esc((i+1)+' '+s[1]+' '+s[2]).toLowerCase()}"><div>${i+1}. ${esc(s[1])}<small>${esc(s[2])} · ${s[3]==='M'?'Meccan':'Medinan'} · ${s[4]} verses</small></div><span class="arn" lang="ar">${s[0]}</span></a>`).join('')+`</div>`+qcredits();
}
function readSurah(n){
  const S=QD.surahs[n-1],V=QD.ar[n-1],en=QS.en&&QD.en,tr=QS.tr&&QD.tr,fs=`style="font-size:${QS.size}rem"`;
  let h=`<a class="back" href="#salah/quran"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>Quran</a><h1>${esc(S[1])} <span class="arn" lang="ar">${S[0]}</span></h1><p>${esc(S[2])} · ${S[3]==='M'?'Meccan':'Medinan'} · ${S[4]} verses</p>`+
   `<div class="chips"><button class="chip${QS.en?' on':''}" data-qt="en">Translation</button><button class="chip${QS.tr?' on':''}" data-qt="tr">Transliteration</button><button class="chip" data-qz="-0.4">A−</button><button class="chip" data-qz="0.4">A+</button></div>`;
  if(n!==1&&n!==9)h+=`<div class="arb bsm" lang="ar" dir="rtl" ${fs}>${QD.ar[0][0]}</div>`;
  V.forEach((t,i)=>{h+=`<div class="ay${QL&&QL.s===n&&QL.a===i+1?' mark':''}" id="ay${i+1}" data-a="${i+1}"><span class="num">${i+1}</span><div class="arb" lang="ar" dir="rtl" ${fs}>${t}</div>${tr?`<div class="tr">${esc(tr[n-1][i])}</div>`:''}${en?`<div class="en">${esc(en[n-1][i])}</div>`:''}</div>`});
  h+=`<div class="qnav">${n>1?`<a class="btn ghost" href="#salah/quran/${n-1}">‹ Previous</a>`:'<span></span>'}${n<114?`<a class="btn" href="#salah/quran/${n+1}">Next ›</a>`:''}</div>`+(QS.en||QS.tr?'':'')+qcredits();
  $('#sbody').innerHTML=h;
  const v=$('#v-salah');
  if(QKEEP!=null){v.scrollTop=QKEEP;QKEEP=null}
  else if(QL&&QL.s===n){const a=document.getElementById('ay'+QL.a);if(a)a.scrollIntoView()}else v.scrollTop=0;
}
$('#sbody').addEventListener('click',e=>{
  const t=e.target.closest('[data-qt],[data-qz],.ay');if(!t)return;
  const n=+location.hash.split('/')[2];if(!n)return;
  if(t.dataset.qt){QS[t.dataset.qt]=QS[t.dataset.qt]?0:1;saveQ();QKEEP=$('#v-salah').scrollTop;renderQuran(n)}
  else if(t.dataset.qz){QS.size=Math.max(2.4,Math.min(6,QS.size+ +t.dataset.qz));saveQ();QKEEP=$('#v-salah').scrollTop;renderQuran(n)}
  else{QL={s:n,a:+t.dataset.a};try{localStorage.setItem('qlast',JSON.stringify(QL))}catch(x){}document.querySelectorAll('.ay.mark').forEach(x=>x.classList.remove('mark'));t.classList.add('mark')}
});
$('#sbody').addEventListener('input',e=>{
  if(e.target.id!=='qsearch')return;const q=e.target.value.trim().toLowerCase();
  document.querySelectorAll('#slist a').forEach(a=>a.style.display=!q||a.dataset.q.includes(q)?'':'none');
});
