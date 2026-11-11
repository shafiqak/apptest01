// ---- Tasbeeh counter (saved on the device) ----
const DHIKR=[
 ['سُبْحَانَ ٱللَّٰهِ','Subhan Allah','Glory be to Allah'],
 ['ٱلْحَمْدُ لِلَّٰهِ','Alhamdulillah','All praise is for Allah'],
 ['ٱللَّٰهُ أَكْبَرُ','Allahu Akbar','Allah is the Greatest'],
 ['أَسْتَغْفِرُ ٱللَّٰهَ','Astaghfirullah','I seek forgiveness from Allah'],
 ['لَا إِلَٰهَ إِلَّا ٱللَّٰهُ','La ilaha illallah','There is no god but Allah']];
const TS={d:0,t:33,c:0,tot:{}};
try{Object.assign(TS,JSON.parse(localStorage.getItem('tasbeeh')||'{}'))}catch(e){}
const saveTS=()=>{try{localStorage.setItem('tasbeeh',JSON.stringify(TS))}catch(e){}};
function drawTasbeeh(){
  const d=DHIKR[TS.d],C=2*Math.PI*90,pct=TS.t?Math.min(1,TS.c/TS.t):0,done=TS.t&&TS.c>=TS.t;
  $('#tbody').innerHTML=
   '<div class="chips">'+DHIKR.map((x,i)=>'<button class="chip'+(i===TS.d?' on':'')+'" data-d="'+i+'">'+x[1]+'</button>').join('')+'</div>'+
   '<div id="tar" lang="ar" dir="rtl">'+d[0]+'</div><div id="ten">'+d[2]+'</div>'+
   '<button id="tbtn" data-act="tap"><svg viewBox="0 0 200 200"><circle class="rb" cx="100" cy="100" r="90"/><circle class="rp" cx="100" cy="100" r="90" transform="rotate(-90 100 100)" stroke-dasharray="'+C+'" stroke-dashoffset="'+(C*(1-pct))+'"/>'+
   '<text class="cnt" x="100" y="118">'+TS.c+'</text><text class="of" x="100" y="145">'+(done?'Done · tap to restart':TS.t?'of '+TS.t:'tap to count')+'</text></svg></button>'+
   '<div id="tmeta">All-time for this dhikr: '+(TS.tot[TS.d]||0).toLocaleString('en-US')+'</div>'+
   '<div class="chips" style="justify-content:center">'+[33,99,100,0].map(n=>'<button class="chip'+(TS.t===n?' on':'')+'" data-t="'+n+'">'+(n||'∞')+'</button>').join('')+'</div>'+
   '<div id="tact"><button class="btn ghost" data-act="reset">Reset</button></div>';
}
$('#v-tasbeeh').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.d!=null){TS.d=+b.dataset.d;TS.c=0}
  else if(b.dataset.t!=null){TS.t=+b.dataset.t;TS.c=0}
  else if(b.dataset.act==='reset')TS.c=0;
  else if(b.dataset.act==='tap'){
    if(TS.t&&TS.c>=TS.t)TS.c=0;
    TS.c++;TS.tot[TS.d]=(TS.tot[TS.d]||0)+1;
    if(navigator.vibrate)navigator.vibrate(TS.t&&TS.c>=TS.t?[60,40,60]:12);
  }
  saveTS();drawTasbeeh();
});
drawTasbeeh();
