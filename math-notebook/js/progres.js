/* =====================================================================
   MESURER LA PROGRESSION
   - maîtrise globale enregistrée chaque jour (courbe)
   - test de niveau conseillé toutes les 2 semaines (points sur la courbe)
   ===================================================================== */
function globalMastery(){let s=0,n=0;CH.forEach(c=>c.notions.forEach(x=>{s+=st.m[x.id]||0;n++;}));return n?Math.round(s/n*100):0;}
function snapProgress(){st.mh=st.mh||{};const d=dayStr(new Date());st.mh[d]=globalMastery();const k=Object.keys(st.mh).sort();while(k.length>180)delete st.mh[k.shift()];}
function testList(){if(!st.tests&&st.test)st.tests=[{d:st.test.date,score:st.test.score,n:CH.length}];return st.tests||[];}
function daysSince(d){return d?Math.round((new Date(dayStr(new Date()))-new Date(d))/864e5):999;}
function progressChart(){
  const mh=Object.entries(st.mh||{}).sort(),T=testList();
  if(mh.length<2&&T.length<2)return '<p class="muted">La courbe apparaîtra après quelques jours de travail et tes premiers tests.</p>';
  const dates=[...mh.map(x=>x[0]),...T.map(t=>t.d)].sort(),d0=new Date(dates[0]),d1=new Date(dates[dates.length-1]),span=Math.max(1,(d1-d0)/864e5);
  const W=320,H=170,l=34,r=10,t=12,b=26,X=d=>l+((new Date(d)-d0)/864e5)/span*(W-l-r),Y=v=>t+(1-v/100)*(H-t-b);
  let g='';[0,25,50,75,100].forEach(v=>g+=`<line x1="${l}" x2="${W-r}" y1="${Y(v)}" y2="${Y(v)}" stroke="#eeecf5"/><text x="${l-6}" y="${Y(v)+4}" font-size="10" text-anchor="end" fill="#8b8aa3">${v}%</text>`);
  if(mh.length>1)g+=`<polyline fill="none" stroke="#0ea5e9" stroke-width="3" stroke-linejoin="round" points="${mh.map(([d,v])=>X(d)+','+Y(v)).join(' ')}"/>`;
  T.forEach(x=>{const v=Math.round(x.score/(x.n||CH.length)*100);g+=`<circle cx="${X(x.d)}" cy="${Y(v)}" r="6" fill="#7c3aed" stroke="#fff" stroke-width="2"/>`;});
  const f=s=>s.slice(8,10)+'/'+s.slice(5,7);g+=`<text x="${l}" y="${H-6}" font-size="10" fill="#8b8aa3">${f(dates[0])}</text><text x="${W-r}" y="${H-6}" font-size="10" text-anchor="end" fill="#8b8aa3">${f(dates[dates.length-1])}</text>`;
  const first=mh.length?mh[0][1]:0,last=mh.length?mh[mh.length-1][1]:0;
  return `<svg viewBox="0 0 ${W} ${H}" class="fig" style="max-width:100%">${g}</svg>
   <p class="muted" style="margin:4px 0 0"><span style="color:#0ea5e9">━</span> maîtrise globale (${last} %${mh.length>1?`, ${last-first>=0?'+':''}${last-first} pts depuis le début`:''}) &nbsp; <span style="color:#7c3aed">●</span> tests de niveau</p>`;
}
function progressHTML(){
  const T=testList(),last=T[T.length-1],ds=last?daysSince(last.d):999;
  return `<div class="prof"><div class="prof-h">📈 Ta progression</div>${progressChart()}
   <button class="prow" id="testgo" style="margin-top:8px">📝 ${ds>=14?'Faire le test de progression (conseillé)':`Refaire un test (dernier il y a ${ds} j)`}</button></div>`;
}
function testNag(){const n=$('testNag');if(!n)return;const T=testList(),last=T[T.length-1];n.style.display=st.xp>=150&&(!last||daysSince(last.d)>=14)?'block':'none';}
