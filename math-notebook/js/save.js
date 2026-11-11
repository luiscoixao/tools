/* =====================================================================
   SAUVEGARDE DU PARCOURS
   - chargé AVANT le moteur : répare une progression perdue à partir des copies de secours
   - copies de secours automatiques (3 dernières journées) dans l'appareil
   - fichier de sauvegarde à enregistrer (Fichiers / iCloud) et à restaurer
   - les données ne sont jamais effacées lors d'une mise à jour : on ne fait qu'ajouter des champs
   ===================================================================== */
const SAVE_VERSION=3;
const BKEY='mathnb-backups';
(function recover(){
  try{
    const P0=JSON.parse(localStorage.getItem('mathnb-profiles')||'null');
    const key=P0?(P0.current==='p1'?'mathnb-v1':'mathnb-v1-'+P0.current):'mathnb-v1';
    let cur=null;try{cur=JSON.parse(localStorage.getItem(key)||'null');}catch(e){cur=null;}
    const B=JSON.parse(localStorage.getItem(BKEY)||'{}');
    const list=(B[key]||[]);
    if((!cur||typeof cur!=='object')&&list.length){localStorage.setItem(key,list[list.length-1].s);window._recovered=true;}
    if(!P0&&B['mathnb-profiles']&&B['mathnb-profiles'].length){localStorage.setItem('mathnb-profiles',B['mathnb-profiles'].slice(-1)[0].s);window._recovered=true;}
  }catch(e){}
})();
function autoBackup(key,str){
  try{
    const B=JSON.parse(localStorage.getItem(BKEY)||'{}'),d=new Date().toISOString().slice(0,10);
    const keep=(k,s)=>{const L=B[k]=B[k]||[];if(L.length&&L[L.length-1].d===d)L[L.length-1].s=s;else L.push({d,s});while(L.length>3)L.shift();};
    keep(key,str);const p=localStorage.getItem('mathnb-profiles');if(p)keep('mathnb-profiles',p);
    localStorage.setItem(BKEY,JSON.stringify(B));
  }catch(e){}
}
/* tout ce qui appartient à l'appli, sauf les copies et la banque (re-téléchargeable) */
function snapshot(){
  const data={};
  for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('mathnb-')&&k!==BKEY&&k!=='mathnb-bank')data[k]=localStorage.getItem(k);}
  return {app:'mathematiques',version:SAVE_VERSION,date:new Date().toISOString(),data};
}
function exportSave(){
  const snap=snapshot(),txt=JSON.stringify(snap);
  const name='maths-sauvegarde-'+new Date().toISOString().slice(0,10)+'.json';
  try{
    const file=new File([txt],name,{type:'application/json'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({files:[file],title:'Sauvegarde Mathématiques'}).then(done).catch(()=>dl());}
    else dl();
  }catch(e){dl();}
  function dl(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);done();}
  function done(){st.lastExport=today();save();toast('💾 Sauvegarde créée');}
}
function copySave(){
  const txt=JSON.stringify(snapshot());
  (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>{st.lastExport=today();save();toast('📋 Code de sauvegarde copié : colle-le dans Notes');}).catch(()=>toast('Copie impossible ici'));
}
function applySave(txt){
  let snap;try{snap=JSON.parse(txt);}catch(e){toast('❌ Fichier illisible');return;}
  if(!snap||snap.app!=='mathematiques'||!snap.data){toast('❌ Ce n\'est pas une sauvegarde de l\'appli');return;}
  const n=Object.keys(snap.data).length,d=(snap.date||'').slice(0,10);
  sheet(`<div class="sh-h">📥 Restaurer cette sauvegarde ?<small>du ${d.split('-').reverse().join('/')} · ${n} élément${n>1?'s':''}</small></div>
    <p>Ta progression actuelle sera <b>remplacée</b> par celle de la sauvegarde (une copie de secours de l'état actuel est gardée).</p>
    <button class="cta" id="rsok">Oui, restaurer</button><button class="lnk" id="rsno">Annuler</button>`);
  $('rsno').onclick=()=>$('sheetw').classList.remove('open');
  $('rsok').onclick=()=>{try{autoBackup(KEY,localStorage.getItem(KEY)||'{}');Object.entries(snap.data).forEach(([k,v])=>localStorage.setItem(k,v));}catch(e){toast('❌ Restauration impossible');return;}location.reload();};
}
function importSave(){
  const inp=document.createElement('input');inp.type='file';inp.accept='.json,application/json,text/plain';
  inp.onchange=()=>{const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>applySave(String(r.result));r.readAsText(f);};
  inp.click();
}
function pasteSave(){
  sheet(`<div class="sh-h">📋 Coller un code de sauvegarde</div><textarea id="pst" rows="6" style="width:100%;border-radius:14px;border:2px solid #e4e2ee;padding:10px;font:14px monospace"></textarea><button class="cta" id="pstok" style="margin-top:10px">Restaurer</button>`);
  $('pstok').onclick=()=>applySave($('pst').value.trim());
}
function saveSheet(){
  const last=st.lastExport?today()-st.lastExport:null;
  sheet(`<div class="sh-h">💾 Sauvegarde<small>${last==null?'Aucune sauvegarde externe pour l\'instant':last===0?'Dernière sauvegarde : aujourd\'hui':`Dernière sauvegarde : il y a ${last} jour${last>1?'s':''}`}</small></div>
    <p>Ta progression est enregistrée dans l'appli, avec des copies de secours automatiques. Les mises à jour ne l'effacent pas.</p>
    <p>⚠️ Mais supprimer l'icône de l'écran d'accueil ou effacer les données de Safari l'efface. <b>Garde une sauvegarde dans Fichiers ou iCloud.</b></p>
    <button class="cta" id="svx">💾 Enregistrer une sauvegarde</button>
    <button class="prow" id="svc" style="margin-top:10px">📋 Copier le code de sauvegarde</button>
    <button class="prow" id="svi">📥 Restaurer depuis un fichier</button>
    <button class="prow" id="svp">📋 Restaurer depuis un code collé</button>`);
  $('svx').onclick=exportSave;$('svc').onclick=copySave;$('svi').onclick=importSave;$('svp').onclick=pasteSave;
}
/* migration douce : on complète, on ne supprime jamais */
/* reprise de la progression de l'ancienne version (avant la carte des îles) */
function migrateOld(){
  if(st.migOld)return 0;
  let n=0;const mark=(id,stars,m)=>{if(!NOT(id))return;if(!st.nodes[id]){st.nodes[id]=Math.max(1,Math.min(3,stars||1));n++;}st.cards[id]=1;if(st.m[id]==null)st.m[id]=m;};
  const lv=st.lv||{},best=st.best||{};
  if(lv.int)for(let i=1;i<=Math.min(3,lv.int);i++)mark('int'+i,2,.6);
  const all={geo:['geo1','geo2','geo3'],pro:['pro1','pro2']};
  Object.entries(best).forEach(([k,b])=>{if(!b||k==='int'||k==='review'||k==='test')return;
    (all[k]||[k+'1']).forEach(id=>mark(id,b,b>=3?.7:b===2?.55:.4));});
  st.migOld=1;return n;
}
function migrate(){
  st.m=st.m||{};st.mis=st.mis||{};
  const n=migrateOld();
  if(n)setTimeout(()=>toast(`🔁 Ancienne progression récupérée : ${n} notion${n>1?'s':''}`),900);
  if((st.v||0)<SAVE_VERSION)st.v=SAVE_VERSION;
  save();if(n)home();
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();}catch(e){}
}
