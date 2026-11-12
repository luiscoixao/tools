/* =====================================================================
   MOTEUR DE JEU — carte d'aventure, épisodes en 5 temps, mini-jeux,
   indices en 3 crans, album, révisions espacées, boss, défi éclair
   ===================================================================== */
const CH=[];                       // chapitres (îles), remplis par les fichiers content/*.js
function chapter(def){CH.push(def);}
const $=id=>document.getElementById(id);

/* ---------- KaTeX ---------- */
function math(el){if(el&&window.renderMathInElement){try{renderMathInElement(el,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false,preProcess:m=>m.replace(/(\d),(\d)/g,'$1{,}$2').replace(/−/g,'-')});}catch(e){}}}
function loadScript(srcs,cb){const s=document.createElement('script');s.src=srcs[0];s.onload=cb;s.onerror=()=>{if(srcs.length>1)loadScript(srcs.slice(1),cb);};document.head.appendChild(s);}
function startKatex(){
  const J='https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/',U='https://unpkg.com/katex@0.16.11/dist/';
  loadScript([J+'katex.min.js',U+'katex.min.js'],()=>loadScript([J+'contrib/auto-render.min.js',U+'contrib/auto-render.min.js'],()=>{math(document.body);renderTiles();if(document.fonts)document.fonts.ready.then(renderTiles);}));
}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

/* ---------- Profils ---------- */
const PKEY='mathnb-profiles',AVATARS=['🦊','🐼','🦁','🐯','🐸','🐙','🦉','🐨','🐧','🦄'];
let P=null;try{P=JSON.parse(localStorage.getItem(PKEY))}catch(e){}
const profKey=id=>id==='p1'?'mathnb-v1':'mathnb-v1-'+id;
const me=()=>P&&P.list.find(x=>x.id===P.current);
function saveP(){try{localStorage.setItem(PKEY,JSON.stringify(P))}catch(e){}}
const KEY=P?profKey(P.current):'mathnb-v1',GOAL=50;

/* ---------- État ---------- */
let st={};try{st=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
st=Object.assign({xp:0,streak:0,last:'',todayDate:'',todayXp:0,nodes:{},cards:{},boss:{},chest:{},speed:{},srs:[],seen:{},tu:{},daily:''},st);
if(st.err&&st.err.length){st.err.forEach(e=>st.srs.push({it:{...e,type:'qcm'},box:0,due:today()}));delete st.err;}
function save(){try{const s=JSON.stringify(st);localStorage.setItem(KEY,s);if(window.autoBackup)autoBackup(KEY,s);}catch(e){}}
function today(){const d=new Date();return Math.floor((d-d.getTimezoneOffset()*6e4)/864e5);}
function dayStr(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function checkDay(){
  const t=dayStr(new Date());if(st.todayDate!==t){st.todayDate=t;st.todayXp=0;}
  const y=new Date();y.setDate(y.getDate()-1);
  if(st.last&&st.last!==t&&st.last!==dayStr(y))st.streak=0;
}
function markDay(){const t=dayStr(new Date());if(st.last!==t){st.streak=(st.streak||0)+1;st.last=t;}}
const lvlOf=xp=>Math.floor(xp/100)+1;

/* ---------- Banque en ligne (réserve débloquée à chaque niveau) ---------- */
const PER_LEVEL=10;let BANK={v:0,q:[]};try{BANK=JSON.parse(localStorage.getItem('mathnb-bank'))||BANK}catch(e){}
function bankOrder(){const g={};(BANK.q||[]).forEach(x=>(g[x.chap]=g[x.chap]||[]).push(x));const ls=Object.values(g),o=[];for(let i=0;o.length<(BANK.q||[]).length;i++)ls.forEach(l=>{if(l[i])o.push(l[i]);});return o;}
function bankItems(key){if(st.bankN==null)st.bankN=PER_LEVEL*lvlOf(st.xp);return bankOrder().slice(0,st.bankN).filter(x=>x.chap===key).map(x=>({q:x.q,a:x.a,why:x.why,hint:x.hint,img:x.img||'',bubbles:x.a.every(t=>t.length<40)}));}
function reserveLeft(){return Math.max(0,(BANK.q||[]).length-(st.bankN||0));}
function syncBank(){fetch('bank.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(b=>{if(!b||!(b.v>(BANK.v||0)))return;BANK=b;try{localStorage.setItem('mathnb-bank',JSON.stringify(b))}catch(e){}home();}).catch(()=>{});}

/* ---------- Anti-répétition ---------- */
function lru(key,fns){const tu=st.tu[key]=st.tu[key]||{};const n=fns.map((f,i)=>[f.name||String(i),f]);n.sort((x,y)=>(tu[x[0]]||0)-(tu[y[0]]||0)||Math.random()-.5);tu[n[0][0]]=Date.now()+Math.random();return n[0][1];}
function fresh(key,fn){const seen=st.seen[key]=st.seen[key]||[];let q;for(let i=0;i<15;i++){q=fn();const s=(q.q||q.title||'')+'|'+(q.a?q.a[0]:q.ans||'')+'|'+((q.img||'').length);if(!seen.includes(s)){seen.push(s);break;}}if(seen.length>400)seen.splice(0,seen.length-400);return q;}

/* ---------- Accès aux notions ---------- */
const chapOf=k=>CH.find(c=>c.key===k);
const nodeDone=id=>(st.nodes[id]||0)>0;
function chapProgress(c){return c.notions.filter(n=>nodeDone(n.id)).length;}
function notionUnlocked(c,i){return i===0||nodeDone(c.notions[i-1].id);}
function bossUnlocked(c){return c.notions.every(n=>nodeDone(n.id));}
function nextNotion(){
  const test=st.test&&st.test.res||{};
  const order=[...CH.filter(c=>test[c.key]===false),...CH];
  for(const c of order){const i=c.notions.findIndex(n=>!nodeDone(n.id));if(i>=0)return {c,n:c.notions[i],i};}
  for(const c of CH) if(!st.boss[c.key]) return {c,boss:true};
  return null;
}

/* =====================================================================
   FORMATS DE JEU
   ===================================================================== */
function numVal(s){s=String(s).replace(/\$/g,'').replace('{,}','.').replace(/\\,/g,'').replace(/−/g,'-').replace(/^(-?\d+),(\d+)$/,'$1.$2').replace(/^[a-zA-Z]\s*=\s*/,'').replace(/\^\{?\\circ\}?/,'').replace(/\\text\{[^}]*\}/g,'').trim();return /^-?\d+(\.\d+)?$/.test(s)?parseFloat(s):null;}
/* transforme un exercice « QCM » en un format varié */
function vary(it,allow){
  if(it.type) return it;
  const fm=allow||['qcm','qcm','tf','input'];
  let f=pick(fm);
  if(f==='input'&&numVal(it.a[0])===null) f='qcm';
  if(f==='tf'&&it.a.length<2) f='qcm';
  if(f==='tf'){const truth=Math.random()<.5;return {...it,type:'tf',prop:truth?it.a[0]:pick(it.a.slice(1)),truth};}
  if(f==='input') return {...it,type:'input',ans:numVal(it.a[0])};
  return {...it,type:'qcm'};
}
function hintsOf(s){const h=[];if(s.hints)h.push(...s.hints);else if(s.hint)h.push(s.hint);return h;}

/* ---------- rendu d'un exercice ---------- */
function renderItem(s,box,onAnswer){
  const H=hintsOf(s);let used=0;
  const head=`${s.img?`<div class="qimg">${s.img}</div>`:''}<div class="q">${s.q||''}</div>`;
  const GL=typeof glossFor==='function'?glossFor((s.q||'')+' '+(s.prop||'')):[];
  box.innerHTML=head+(GL.length?`<div class="gl">${GL.map(g=>`<button class="glc keep" data-g="${GLOSS.indexOf(g)}">❓ ${g[1]}</button>`).join('')}</div>`:'')+`<div class="hints"></div><div class="zone"></div>`+
    `<div class="hrow"><button class="coursbtn keep" id="cb">📖 Cours</button>${S&&S.mode==='prob'?'<button class="coursbtn keep calcb" id="calcb">🧮 Calculatrice</button>':''}<button class="hintbtn" id="hb">💡 Coup de pouce</button><button class="solbtn" id="sb">🔍 Solution</button>${s.idk?'<button class="idk" id="idkb">🤷 Je ne sais pas</button>':''}</div>`;
  if(box.querySelector('#calcb'))box.querySelector('#calcb').onclick=()=>calcSheet(s.type==='input');
  const zone=box.querySelector('.zone'),hz=box.querySelector('.hints'),hb=box.querySelector('#hb'),sb=box.querySelector('#sb');
  if(!H.length) hb.style.display='none';
  box.querySelectorAll('.glc').forEach(b=>b.onclick=()=>{const g=GLOSS[+b.dataset.g];sheet(`<div class="defcard"><div class="rc-top">📚 Définition</div><div class="rc-t">${g[1]}</div><p>${g[2]}</p>${g[3]?`<p class="defex">Exemple : ${g[3]}</p>`:''}</div>`);});
  box.querySelector('#cb').onclick=()=>{const x=s.nid&&NOT(s.nid);
    if(x)sheet(`<div class="rcard" style="--k:${x.c.c[1]}"><div class="rc-top">📖 Cours · ${x.c.label}</div><div class="rc-t">${x.n.title}</div>${x.n.ruleFig?`<div class="lfig">${x.n.ruleFig}</div>`:''}<div class="rc-b">${x.n.rule}</div></div><p class="muted" style="text-align:center">Ferme cette fiche pour revenir à l'exercice.</p>`);
    else if(s.tip){sheet(`<div class="tipbox"><b>💡 L'astuce</b>${s.tip}</div><p class="muted" style="text-align:center">Ferme cette fiche pour revenir à l'exercice.</p>`);math($('sheetw'));}
    else if(S&&S.chap)openAlbum(S.chap);};
  hb.onclick=()=>{if(used<H.length){hz.insertAdjacentHTML('beforeend',`<div class="hintbox on">${used===0?'💡':'🧭'} ${H[used]}</div>`);math(hz);used++;s.penalty=used;}
    if(used>=H.length){hb.style.display='none';} else hb.textContent='🧭 Méthode';};
  sb.onclick=()=>{s.penalty=9;finish(false,true);};
  if(s.idk) box.querySelector('#idkb').onclick=()=>finish(false,true);
  if(s.autoHint&&H.length){hz.insertAdjacentHTML('beforeend',`<div class="hintbox on">🎁 Indice offert : ${H[0]}</div>`);used=1;if(used>=H.length)hb.style.display='none';else hb.textContent='🧭 Méthode';}
  let done=false;
  function finish(ok,gaveUp,info){if(done)return;done=true;box.querySelectorAll('button').forEach(b=>{if(!b.classList.contains('keep'))b.disabled=true;});box.querySelectorAll('.hrow > :not(.coursbtn)').forEach(b=>b.remove());onAnswer(ok,gaveUp,info);}
  const T=s.type||'qcm';
  if(T==='qcm'){
    const base=s.a.map((t,i)=>({t,ok:i===0,src:(s.src||[])[i]})),opts=s.order?s.order.map(i=>base[i]):shuffle(base);
    zone.innerHTML=`<div class="opts ${s.bubbles!==false&&s.a.every(x=>x.length<46)?'bubbles':''}"></div>`;
    const o=zone.firstChild;
    opts.forEach(x=>{const b=document.createElement('button');b.className='opt';b.innerHTML=x.t;b.dataset.ok=x.ok?1:0;
      b.onclick=()=>{b.classList.add(x.ok?'ok':'ko');if(!x.ok){b.classList.add('shake');const g=o.querySelector('[data-ok="1"]');g.classList.add('ok');}finish(x.ok,false,{pick:x.t,src:x.src});};o.appendChild(b);});
  }else if(T==='tf'){
    zone.innerHTML=`<div class="tfcard" id="tfc"><div class="tflab">Proposition</div><div class="tfprop">${s.prop}</div><div class="tfsw">← Faux · Vrai →</div></div>
      <div class="tfbtns"><button class="opt tfno" data-v="0">❌ Faux</button><button class="opt tfyes" data-v="1">✅ Vrai</button></div>`;
    const card=zone.querySelector('#tfc');
    const choose=v=>{const ok=(v===1)===s.truth;card.classList.add(v?'goR':'goL');zone.querySelector(v?'.tfyes':'.tfno').classList.add(ok?'ok':'ko');
      if(!ok)zone.querySelector(v?'.tfno':'.tfyes').classList.add('ok');finish(ok,false,{said:v});};
    zone.querySelectorAll('.tfbtns .opt').forEach(b=>b.onclick=()=>choose(+b.dataset.v));
    let x0=null;card.addEventListener('pointerdown',e=>{x0=e.clientX;card.setPointerCapture(e.pointerId);});
    card.addEventListener('pointermove',e=>{if(x0!==null)card.style.transform=`translateX(${e.clientX-x0}px) rotate(${(e.clientX-x0)/20}deg)`;});
    card.addEventListener('pointerup',e=>{const d=e.clientX-x0;x0=null;card.style.transform='';if(Math.abs(d)>70&&!done)choose(d>0?1:0);});
  }else if(T==='input'){
    zone.innerHTML=`<div class="inp"><span id="iv">&nbsp;</span></div><div class="kpad">${['7','8','9','4','5','6','1','2','3','−','0',','].map(k=>`<button class="key">${k}</button>`).join('')}<button class="key del">⌫</button><button class="key okk">Valider</button></div>`;
    let v='';const iv=zone.querySelector('#iv');window._setAns=x=>{v=String(x).slice(0,12);iv.textContent=v||' ';};
    zone.querySelectorAll('.key').forEach(k=>k.onclick=()=>{
      const t=k.textContent;
      if(k.classList.contains('okk')){if(!v)return;const n=parseFloat(v.replace(',','.').replace('−','-'));const ok=Math.abs(n-s.ans)<1e-6;iv.parentNode.classList.add(ok?'ok':'ko');finish(ok,false,{val:n});return;}
      if(k.classList.contains('del'))v=v.slice(0,-1);else if(t==='−'){v=v.startsWith('−')?v.slice(1):'−'+v;}else if(v.length<9)v+=t;
      iv.textContent=v||' ';});
  }else if(T==='match'){
    const L=s.pairs.map((p,i)=>({t:p[0],i})),R=shuffle(s.pairs.map((p,i)=>({t:p[1],i})));
    zone.innerHTML=`<div class="match"><div class="mcol">${L.map(x=>`<button class="mt" data-s="L" data-i="${x.i}">${x.t}</button>`).join('')}</div><div class="mcol">${R.map(x=>`<button class="mt" data-s="R" data-i="${x.i}">${x.t}</button>`).join('')}</div></div>`;
    let sel=null,err=0,ok=0;
    zone.querySelectorAll('.mt').forEach(b=>b.onclick=()=>{
      if(b.classList.contains('ok'))return;
      if(!sel||sel.dataset.s===b.dataset.s){if(sel)sel.classList.remove('sel');sel=b;b.classList.add('sel');return;}
      if(sel.dataset.i===b.dataset.i){[sel,b].forEach(x=>{x.classList.remove('sel');x.classList.add('ok');x.classList.add('keep');});sound(true);ok++;sel=null;if(ok===s.pairs.length){s.penalty=Math.min(3,err);finish(true);}}
      else{err++;sound(false);[sel,b].forEach(x=>{x.classList.add('ko','shake');setTimeout(()=>x.classList.remove('ko','shake','sel'),450);});sel=null;}
    });
  }else if(T==='order'){
    const items=shuffle(s.steps.map((t,i)=>({t,i})));
    zone.innerHTML=`<div class="ord-ans"></div><div class="ord-src">${items.map(x=>`<button class="ost" data-i="${x.i}">${x.t}</button>`).join('')}</div>`;
    let k=0,err=0;const ans=zone.querySelector('.ord-ans');
    zone.querySelectorAll('.ost').forEach(b=>b.onclick=()=>{
      if(+b.dataset.i===k){ans.insertAdjacentHTML('beforeend',`<div class="ost ok">${k+1}. ${b.innerHTML}</div>`);b.remove();k++;sound(true);if(k===s.steps.length){s.penalty=Math.min(3,err);finish(true);}}
      else{err++;sound(false);b.classList.add('ko','shake');setTimeout(()=>b.classList.remove('ko','shake'),450);}
    });
  }else if(T==='line'){
    const st0=s.start!=null?s.start:(s.min+s.max)/2;
    zone.innerHTML=`<div class="nline"><div class="nl-val" id="nv"></div><input type="range" min="${s.min}" max="${s.max}" step="${s.step||1}" value="${st0}" id="nr">
      <div class="nl-ticks">${Array.from({length:Math.round((s.max-s.min)/(s.tick||s.step||1))+1},(_,i)=>`<span>${s.fmt?s.fmt(s.min+i*(s.tick||s.step||1)):String(+(s.min+i*(s.tick||s.step||1)).toFixed(3)).replace('.',',')}</span>`).join('')}</div>
      <button class="bigbtn" id="nok">Valider</button></div>`;
    const r=zone.querySelector('#nr'),nv=zone.querySelector('#nv');
    const show=()=>{nv.textContent=String(+(+r.value).toFixed(3)).replace('.',',');};r.oninput=show;show();
    zone.querySelector('#nok').onclick=()=>{const ok=Math.abs(+r.value-s.ans)<=(s.tol||1e-6);r.disabled=true;nv.classList.add(ok?'okc':'koc');finish(ok);};
  }
  math(box);
}

/* =====================================================================
   SESSION (épisode, boss, révision, entraînement, éclair, test)
   ===================================================================== */
let S=null;
const $L=()=>$('lesson'),$B=()=>$('lbody'),$F=()=>$('fb');
function openSession(o){
  S=Object.assign({done:0,combo:0,gained:0,missed:new Set(),nq:0,lives:null,fixed:0},o);
  S.nq=S.queue.filter(x=>x.kind==='item').length;
  document.documentElement.style.setProperty('--c',S.color||'#7c3aed');
  $('lmemo').style.visibility=S.chap?'':'hidden';
  $L().classList.add('open');document.body.style.overflow='hidden';
  step();
}
function closeSession(){$L().classList.remove('open');$F().className='fb';document.body.style.overflow='';S=null;clearInterval(window._spd);home();}
function bar(){$('lBar').style.width=(S.done/(S.done+S.queue.length)*100)+'%';
  $('combo').innerHTML=S.lives!=null?'❤️'.repeat(S.lives)+'🤍'.repeat(3-S.lives):S.combo>=2?'🔥×'+S.combo:'';}
function kicker(t){return `<div class="kicker">${S.title}${t?' · '+t:''}</div>`;}
function cta(txt,fn,cls){$F().className='fb '+(cls||'neutral')+' show';$F().innerHTML=(typeof txt==='string'?'':'')+`<button class="cta">${txt}</button>`;$F().querySelector('.cta').onclick=fn;}
function next(){S.queue.shift();S.done++;step();}

function step(){
  bar();$F().className='fb';
  const s=S.queue[0];const B=$B();
  if(!s) return S.onEnd();
  B.scrollTop=0;
  if(s.kind==='hook'){
    B.innerHTML=kicker('🎯 L\'énigme')+`<div class="hook">${s.fig?`<div class="lfig">${s.fig}</div>`:''}${s.html}</div><p class="muted">Pas de panique : tu vas le découvrir en jouant 👇</p>`;
    math(B);cta('C\'est parti !',next);
  }else if(s.kind==='play'){
    B.innerHTML=kicker('🕹️ Je manipule')+`<div class="q">${s.text}</div><div class="play"></div>`;
    math(B);cta('Continuer',()=>{});$F().querySelector('.cta').disabled=true;
    let fin=false;
    s.mount(B.querySelector('.play'),msg=>{if(fin)return;fin=true;sound(true);
      $F().className='fb good show';$F().innerHTML=`<h3>${pick(['Bien vu !','Tu l\'as trouvé !','Génial !'])}</h3><p>${msg}</p><button class="cta">Continuer</button>`;
      math($F());$F().querySelector('.cta').onclick=next;});
  }else if(s.kind==='rule'){
    const has=st.cards[s.id];
    if(s.recap){B.innerHTML=kicker('🩹 Petit rappel')+`<p class="muted">${s.why||'Revoyons la règle, puis on reprend.'}</p><div class="rcard" style="--k:${S.color}"><div class="rc-top">${S.icon||'⭐'} Carte n°${s.num}</div><div class="rc-t">${s.title}</div>${s.fig?`<div class="lfig">${s.fig}</div>`:''}<div class="rc-b">${s.html}</div></div>`;math(B);cta('Compris, je reprends 💪',next);return;}
    B.innerHTML=kicker('💡 La règle')+`<div class="rcard" style="--k:${S.color}"><div class="rc-top">${S.icon||'⭐'} Carte n°${s.num}</div><div class="rc-t">${s.title}</div>${s.fig?`<div class="lfig">${s.fig}</div>`:''}<div class="rc-b">${s.html}</div></div>`;
    math(B);
    cta(has?'Continuer':'✨ Ajouter à mon album',()=>{if(!st.cards[s.id]){st.cards[s.id]=1;save();sparkle();}next();});
  }else if(s.kind==='alt'){
    const x=NOT(s.id),tips=topMis(s.id).slice(0,2);
    B.innerHTML=kicker('🧑‍🏫 Je t\'explique autrement')+`${s.why?`<p class="muted">${s.why}</p>`:''}<div class="altcard"><div class="rc-t">${x.n.title}</div><div class="rc-b">${ALT[s.id]||x.n.rule}</div></div>${tips.length?`<div class="prof"><div class="prof-h">⚠️ Attention à ton erreur habituelle</div>${tips.map(t=>`<div class="prof-t">${t.msg}</div>`).join('')}</div>`:''}`;
    math(B);cta('J\'ai compris 👍',next);
  }else if(s.kind==='ex'){
    B.innerHTML=kicker(s.label?'👀 '+s.label:'👣 Exemple guidé')+`<div class="q">${s.title}</div>${s.fig?`<div class="qimg">${s.fig}</div>`:''}<div class="exl">${s.lines.map(l=>`<div class="exs">${l}</div>`).join('')}</div>`;
    math(B);const rows=[...B.querySelectorAll('.exs')];let k=0;
    const go=()=>{if(k<rows.length){rows[k].classList.add('on');rows[k].scrollIntoView({behavior:'smooth',block:'nearest'});k++;}
      if(k<rows.length) cta('Étape suivante ▶',go); else cta('Compris !',next);};
    go();
  }else if(s.kind==='item'){
    if(!s.it&&s.gen) s.it=genFor(s.nid,s.gen.fmts,s.gen.boost,s.gen.tier);
    if(S.autoHint&&s.it&&!['match','order','line'].includes(s.it.type)){s.it.autoHint=true;S.autoHint=false;}
    const it=s.it;
    const tl=it.tier&&S.mode!=='speed'&&S.mode!=='test'?`<span class="tier t${it.tier}">${TLAB[it.tier]}</span>`:'';
    B.innerHTML=kicker((s.label||'')+(s.label?'':'')+(s.label?'':(it.type==='tf'?'⚡ Vrai ou faux ?':it.type==='match'?'🔗 Relie les paires':it.type==='order'?'🧩 Remets dans l\'ordre':it.type==='line'?'📏 Place sur la droite':it.type==='input'?'⌨️ Calcule':'🎮 À toi')))+tl+'<div class="ibox"></div>';
    renderItem(it,B.querySelector('.ibox'),(ok,gaveUp,info)=>answered(s,ok,gaveUp,info));
  }
}
function adaptAfter(s,ok){
  const it=s.it;let id=s.nid||it.nid;
  if(S.mode==='speed'||S.mode==='test')return;
  if(id){updM(id,ok?(it.penalty?(it.penalty>=9?.2:.6):1):0);S.lastNid=id;} else id=S.lastNid;
  if(!id)return;
  S.adj=S.adj||0;
  if(ok){S.okRun=(S.okRun||0)+1;S.missRun=0;if(S.okRun>=2){if(S.adj<1){S.adj++;S.lvlMsg='📈 Ça roule : on corse un peu !';}S.okRun=0;}}
  else{S.missRun=(S.missRun||0)+1;S.okRun=0;if(S.adj>-1){S.adj--;S.lvlMsg='📉 On simplifie un peu.';}
    if(S.missRun>=2&&S.mode!=='boss'&&S.mode!=='test'&&S.mode!=='review'){
      S.remedied=S.remedied||{};const pre=PRE[id];
      let ins=[];
      if(!S.remedied[id]){S.remedied[id]=1;ins=profRemedy(id,'Deux erreurs de suite : je t\'explique autrement.');S.lvlMsg='🧑‍🏫 Je vais t\'expliquer autrement.';}
      else if(pre&&!S.remedied[pre]&&(mastery(pre)??0)<.7){S.remedied[pre]=1;const x=NOT(pre);
        ins=[{kind:'rule',recap:true,id:x.n.id,num:notionNum(x.c,x.n),title:x.n.title,html:x.n.rule,fig:x.n.ruleFig,why:`Le blocage vient peut-être d'une notion de base : <b>${x.n.title}</b>.`},{kind:'item',nid:pre,gen:{fmts:['qcm'],tier:1},label:'🩹 Petit rappel'}];
        S.lvlMsg='🩹 Petit détour pour consolider la base.';}
      if(ins.length)S.queue.splice(1,0,...ins);
      S.autoHint=true;S.missRun=0;}}
}
function answered(s,ok,gaveUp,info){
  const it=s.it,F=$F();
  const diag=!ok&&!gaveUp&&S.mode!=='speed'?diagnose(s,info):null;if(diag)recordMis(s.nid||it.nid,diag);
  if(S.onItem) S.onItem(s,ok);
  S.lvlMsg='';adaptAfter(s,ok);
  if(ok){
    sound(true);S.combo++;
    const g=Math.max(0,(it.penalty?10-3*it.penalty:10))+(S.combo>=3?5:0);S.gained+=g;
    if(S.mode==='review') srsHit(s.srs,true);
    F.className='fb good show';
    F.innerHTML=`<h3>${pick(['Bravo !','Exact !','Parfait !','Bien vu !','Yes !'])}${S.combo>=3?' 🔥 '+S.combo+' d\'affilée':''}${g?` <small>+${g} XP</small>`:''}</h3>${tipOf(it)?`<p>💡 ${tipOf(it)}</p>`:it.why?`<p>${it.why}</p>`:''}${S.lvlMsg?`<p class="lvlmsg">${S.lvlMsg}</p>`:''}<button class="cta">Continuer</button>`;
    F.querySelector('.cta').onclick=next;
  }else{
    if(!gaveUp) sound(false);S.combo=0;S.missed.add(s);
    if(S.mode==='review') srsHit(s.srs,false); else if(S.mode!=='speed'&&S.mode!=='gym') srsAdd(it);
    if(S.lives!=null){S.lives--;}
    const good=it.type==='tf'?(it.truth?'Vrai':'Faux'):it.type==='input'?String(it.a[0]):it.type==='match'||it.type==='order'?'':it.type==='line'?String(it.ans).replace('.',','):it.a[0];
    F.className='fb bad show';
    F.innerHTML=`<h3>${gaveUp?'Voici la solution 🔍':'Pas tout à fait…'}</h3>${diag?`<div class="diag"><b>🧐 Ton erreur</b><br>${diag.msg}</div>`:''}${solFig(it)}${good?`<p class="goodans">${it.errline?'🔍 L\'erreur est ici : ':'✅ Bonne réponse : '}${good}</p>`:''}${stepsHTML(it)}${tipHTML(it)}${S.lvlMsg?`<p class="lvlmsg">${S.lvlMsg}</p>`:''}<button class="cta">${S.lives===0?'Voir le résultat':S.retry?'Je la reverrai':'Continuer'}</button>`;
    F.querySelector('.cta').onclick=()=>{if(S.lives===0){S.queue=[];step();return;}if(S.retry){const x=S.queue.shift();x.it={...x.it,penalty:0,autoHint:false};S.queue.push({...x,it:vary(stripType(x.it))});step();}else next();};
  }
  math(F);bar();
}
function solFig(it){const f=it.sol||(/^(geo|mat|tri)\d/.test(it.nid||'')?it.img:'');return f?`<div class="solfig">${f}</div>`:'';}
function stripType(it){if(it.type==='tf'||it.type==='input'){const c={...it};delete c.type;delete c.prop;delete c.truth;delete c.ans;return c;}return it;}

/* ---------- fin de session commune ---------- */
function endScreen(o){
  const first=S.nq-[...S.missed].length;
  const stars=S.nq?(first===S.nq?3:first>=S.nq-1?2:1):3;
  checkDay();markDay();
  const lvB=lvlOf(st.xp),before=st.todayXp;
  const total=Math.max(0,S.gained+(o.bonus||0)+(stars===3&&o.perfect?10:0));
  st.xp+=total;st.todayXp+=total;
  let extra=o.extra||'';
  const lvA=lvlOf(st.xp);
  if(lvA>lvB){const add=Math.min(PER_LEVEL*(lvA-lvB),reserveLeft());st.bankN=(st.bankN||PER_LEVEL*lvB)+PER_LEVEL*(lvA-lvB);
    extra+=`<div class="unlock lvup">🏅 <b>Niveau ${lvA} atteint !</b>${add?`<br>🔓 ${add} nouvelles questions débloquées`:''}</div>`;}
  if(o.after) o.after(stars);
  save();
  $('lBar').style.width='100%';$('combo').textContent='';
  $B().innerHTML=`<div class="end"><div class="big">${o.emoji||(stars===3?'🏆':'🎉')}</div><h2>${o.title||(stars===3?'Sans faute !':'Bien joué !')}</h2>
    ${o.noStars?'':`<div class="endstars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>`}
    <div class="row"><div class="box"><b>+${total}</b>XP</div>${S.nq&&!o.noCount?`<div class="box"><b>${first}/${S.nq}</b>du 1er coup</div>`:''}<div class="box"><b>🔥 ${st.streak}</b>jour${st.streak>1?'s':''}</div></div>
    ${extra}${['notion','practice','review','boss'].includes(S.mode)&&!o.noProf?profBilan():''}${before<GOAL&&st.todayXp>=GOAL?'<p><b>🎯 Objectif du jour atteint !</b> Reviens demain pour garder ta série.</p>':''}</div>`;
  cta(o.btn||'Retour à la carte',o.btnFn||closeSession);
  if(o.confetti!==false) confetti();
  return stars;
}

/* ---------- Épisode d'une notion (méthode en 5 temps) ---------- */
function notionNum(c,n){let k=0;for(const x of CH){for(const y of x.notions){k++;if(y===n)return k;}}return k;}
function startNotion(c,i){
  const n=c.notions[i],K=n.id,mk=f=>fresh(K,Array.isArray(f)?lru(K,f):f);
  const replay=nodeDone(n.id);
  const q=[];
  if(!replay||Math.random()<.5) q.push({kind:'hook',html:n.hook,fig:n.hookFig});
  if(n.play) q.push({kind:'play',text:n.play.text,mount:n.play.mount});
  q.push({kind:'rule',id:n.id,num:notionNum(c,n),title:n.title,html:n.rule,fig:n.ruleFig});
  if(replay&&((mastery(n.id)??1)<.4||topMis(n.id).length))q.push({kind:'alt',id:n.id,why:'La dernière fois, cette notion t\'a posé des difficultés. Voyons-la sous un autre angle.'});
  if(n.ex){const e=typeof n.ex==='function'?n.ex():n.ex;q.push({kind:'ex',...e});}
  if(n.mine){const m=typeof n.mine==='function'?n.mine():n.mine;q.push({kind:'item',label:'✍️ À toi de faire les étapes',it:{type:'order',...m}});}
  const D=n.drill;const nb=replay?6:5;
  for(let k=0;k<nb;k++){
    const fmts=k<2?['qcm']:k<4?['qcm','tf','input']:['input','qcm','tf'];
    q.push({kind:'item',nid:n.id,gen:{fmts}});
  }
  if(n.games) n.games.forEach(g=>{if(Math.random()<.85)q.splice(q.length-1,0,{kind:'item',it:g()});});
  openSession({mode:'notion',title:c.label,icon:c.icon,color:c.c[1],chap:c.key,queue:q,retry:true,
    onEnd:()=>{const stars=endScreen({bonus:20,perfect:true,
      after:s=>{const was=st.nodes[n.id]||0;st.nodes[n.id]=Math.max(was,s);if(!was)srsAdd(genFor(n.id,['qcm']),today()+1);},
      extra:replay?'':(i+1<c.notions.length?`<div class="unlock">🔓 Prochaine étape : <b>${c.notions[i+1].title}</b></div>`:`<div class="unlock">👑 Le <b>boss de l'île</b> t'attend !</div>`),
      btn:i+1<c.notions.length&&!replay?'▶ Notion suivante':'Retour à la carte',
      btnFn:i+1<c.notions.length&&!replay?()=>{closeSession();startNotion(c,i+1);}:closeSession});}});
}

/* ---------- Boss ---------- */
function startBoss(c){
  const q=[];const ns=shuffle(c.notions);
  for(let k=0;k<7;k++){const n=ns[k%ns.length];q.push({kind:'item',label:'👑 Boss',nid:n.id,gen:{fmts:['qcm','tf','input'],boost:1}});}
  openSession({mode:'boss',title:c.label+' · Boss',icon:c.icon,color:c.c[2],chap:c.key,queue:q,lives:3,
    onEnd:()=>{
      if(S.lives<=0){endScreen({title:'Le boss a gagné… cette fois !',emoji:'💥',noStars:true,noCount:true,confetti:false,extra:'<p>Revois les notions de l\'île puis retente ta chance : tu y es presque.</p>'});return;}
      const first=!st.boss[c.key];
      endScreen({title:'Boss vaincu !',emoji:'👑',bonus:first?50:20,
        after:()=>{st.boss[c.key]=1;},
        extra:first?`<div class="unlock lvup">🎁 <b>Coffre ouvert : +50 XP</b><br>♾️ L'entraînement libre de l'île est débloqué.</div>`:''});}});
}
/* ---------- Entraînement libre ---------- */
function startPractice(c){
  const q=[];const bank=bankItems(c.key);
  for(let k=0;k<8;k++){
    let it;
    if(bank.length&&Math.random()<.35){const seen=st.seen[c.key]=st.seen[c.key]||[];const b=shuffle(bank).sort((x,y)=>seen.includes(x.q)-seen.includes(y.q))[0];seen.push(b.q);it=b;}
    else{const ns=c.notions,w=ns.map(n=>1.3-(mastery(n.id)??.5));let r0=Math.random()*w.reduce((a,b)=>a+b,0),n=ns[0];for(let j=0;j<ns.length;j++){r0-=w[j];if(r0<=0){n=ns[j];break;}}
      q.push({kind:'item',nid:n.id,gen:{}});continue;}
    q.push({kind:'item',it:vary(it)});
  }
  openSession({mode:'practice',title:c.label+' · Entraînement',icon:c.icon,color:c.c[1],chap:c.key,queue:q,retry:true,onEnd:()=>endScreen({bonus:15})});
}
/* ---------- Révisions espacées ---------- */
const BOX=[0,1,3,7,16,35];
function srsAdd(it,due){
  it=stripType(it);if(it.type==='match'||it.type==='order'||it.type==='line')return;
  if(st.srs.some(x=>x.it.q===it.q&&x.it.a&&it.a&&x.it.a[0]===it.a[0]))return;
  st.srs.push({it:{q:it.q,a:it.a,why:it.why,hint:it.hint,hints:it.hints,img:it.img,sol:it.sol,steps:it.steps,tip:it.tip,errs:it.errs,src:it.src,gen:it.gen,chap:S&&S.chap,nid:it.nid,bubbles:it.bubbles},box:0,due:due!=null?due:today()});
  if(st.srs.length>160)st.srs.splice(0,st.srs.length-160);save();
}
function srsDue(){const t=today();return st.srs.filter(x=>x.due<=t);}
function srsHit(e,ok){if(!e)return;if(ok){e.box=Math.min(BOX.length-1,e.box+1);e.due=today()+BOX[e.box];S.fixed++;}else{e.box=0;e.due=today()+1;}save();}
function startReview(){
  const due=shuffle(srsDue()).slice(0,8);if(!due.length)return;
  openSession({mode:'review',title:'🧠 Révisions',color:'#e11d48',queue:due.map(e=>({kind:'item',srs:e,nid:e.it.nid,label:'🧠 '+((chapOf(e.it.chap)||{}).label||'Révision'),it:vary({...e.it})})),
    onEnd:()=>endScreen({title:S.fixed?`${S.fixed} notion${S.fixed>1?'s':''} consolidée${S.fixed>1?'s':''} !`:'Révision terminée',emoji:'🧠',bonus:10,
      extra:`<p class="muted">Ce que tu as réussi reviendra plus tard (dans 1, 3, 7, 16 puis 35 jours) : c'est ce qui ancre dans la mémoire.</p>`})});
}
/* ---------- Défi éclair (60 s) ---------- */
function startSpeed(c,daily){
  const n0=c.notions;let t=60,score=0;
  const mkQ=()=>{const n=pick(n0);const it=fresh(n.id,lru(n.id,n.drill));return {kind:'item',label:'⚡ Éclair',it:{...it,type:'qcm',hint:null,hints:null,why:''}};};
  openSession({mode:'speed',title:'⚡ Défi éclair · '+c.label,color:'#f59e0b',chap:c.key,queue:[mkQ(),mkQ(),mkQ()],
    onItem:(s,ok)=>{if(ok)score++;S.queue.push(mkQ());},
    onEnd:()=>{}});
  S.nq=0;
  const tick=()=>{t--;$('combo').innerHTML=`⏱️ ${t}s · ✅ ${score}`;if(t<=0){clearInterval(window._spd);S.queue=[];S.gained=score*5*(daily?2:1);
    const rec=st.speed[c.key]||0;st.speed[c.key]=Math.max(rec,score);if(daily)st.daily=dayStr(new Date());
    endScreen({title:`${score} bonne${score>1?'s':''} réponse${score>1?'s':''} !`,emoji:'⚡',noStars:true,
      extra:score>rec?`<div class="unlock lvup">🏆 Nouveau record ! (ancien : ${rec})</div>`:`<p class="muted">Ton record : ${rec}</p>`+(daily?'<p>🎁 Défi du jour : XP doublés !</p>':'')});}};
  clearInterval(window._spd);window._spd=setInterval(tick,1000);
  // en mode éclair, on enchaîne sans écran d'explication
  const oldNext=next;
  S.onItem=(s,ok)=>{if(ok)score++;S.queue.push(mkQ());setTimeout(()=>{if(S&&S.mode==='speed'){S.queue.shift();S.done++;step();}},ok?250:700);};
}

/* ---------- Test de niveau ---------- */
function startTest(){
  const q=CH.map(c=>{const n=pick(c.notions);return {kind:'item',label:'📝 '+c.label,chap:c.key,nid:n.id,it:{...genFor(n.id,['input','qcm'],0,2),idk:true}};});
  const res={};
  openSession({mode:'test',title:'📝 Test de niveau',color:'#7c3aed',queue:q,
    onItem:(s,ok)=>{res[s.chap]=ok;const m=st.m[s.nid];st.m[s.nid]=ok?Math.max(m??0,.6):Math.min(m??1,.2);},
    onEnd:()=>{const score=Object.values(res).filter(Boolean).length;st.test={date:dayStr(new Date()),res,score};testList();st.tests.push({d:dayStr(new Date()),score,n:CH.length});snapProgress();S.gained=score*5;
      endScreen({title:score<=CH.length*.35?'Bases à consolider':score<=CH.length*.7?'Niveau Première':'Niveau Terminale',emoji:score>=CH.length*.7?'🏆':score>=CH.length*.35?'💪':'🌱',noStars:true,
        extra:`<p><b>${score}/${CH.length}</b> bonnes réponses</p><div class="chips2">${CH.map(c=>`<span class="chip2 ${res[c.key]?'ok':'ko'}">${res[c.key]?'✓':'↺'} ${c.label}</span>`).join('')}</div><p class="muted">Les îles marquées ↺ passent en tête de ton aventure.</p>`});}});
}

/* =====================================================================
   ACCUEIL : bandeau + carte d'aventure
   ===================================================================== */
function home(){if(typeof gymBtn==='function')gymBtn();
  checkDay();
  const h=new Date().getHours(),nm=me();
  $('hello').textContent=(h<18?'Bonjour':'Bonsoir')+(nm?' '+nm.name:'')+' ! 👋';
  $('pbtn').textContent=nm?nm.av:'🙂';
  $('sStreak').textContent='🔥 '+st.streak+' jour'+(st.streak>1?'s':'');
  $('sXp').textContent='⭐ '+st.xp+' XP';$('sLvl').textContent='🏅 Niv. '+lvlOf(st.xp);
  $('gTxt').textContent=Math.min(st.todayXp,GOAL)+' / '+GOAL+' XP'+(st.todayXp>=GOAL?' ✓':'');
  $('gBar').style.width=Math.min(100,st.todayXp/GOAL*100)+'%';
  const due=srsDue().length,nx=nextNotion(),go=$('go'),go2=$('go2');
  const adv=()=>nx?(nx.boss?startBoss(nx.c):startNotion(nx.c,nx.i)):startPractice(pick(CH));
  const advTxt=nx?(nx.boss?`👑 Boss : ${nx.c.label}`:`${nx.c.icon} ${nx.n.title}`):'♾️ Entraînement libre';
  go2.style.display='none';
  if(due>=3){
    go.innerHTML=`<span class="go-k">🧠 Révisions du jour</span><span class="go-t">${due} question${due>1?'s':''} à revoir <span class="go-a">→</span></span><span class="go-s">2 min · c'est ce qui fait retenir</span>`;go.onclick=startReview;
  }else{
    go.innerHTML=`<span class="go-k">▶ Continuer l'aventure</span><span class="go-t">${advTxt} <span class="go-a">→</span></span><span class="go-s">≈ 4 min · ${nx&&!nx.boss?nx.c.label:'à toi de jouer'}</span>`;go.onclick=adv;
  }
  const dailyDone=st.daily===dayStr(new Date());
  const started=CH.filter(c=>chapProgress(c)>0);const dc=(started.length?started:CH)[new Date().getDate()%((started.length?started:CH).length)];
  $('daily').innerHTML=dailyDone?`⚡ Défi éclair du jour réussi ✓`:`⚡ <b>Défi éclair du jour</b> · ${dc.label} · XP ×2`;
  $('daily').onclick=()=>startSpeed(dc,!dailyDone);
  const xpN=lvlOf(st.xp)*100-st.xp,left=(BANK.q||[]).length?reserveLeft():0;
  $('nxt').innerHTML=`🏅 Niveau ${lvlOf(st.xp)+1} dans <b>${xpN} XP</b>${left?` · 🔓 +${Math.min(PER_LEVEL,left)} questions`:''}`;
  drawMap();
  if(typeof snapProgress==='function'){snapProgress();testNag();}
  const nag=$('saveNag');if(nag){const l=st.lastExport;nag.style.display=st.xp>=200&&(l==null||today()-l>=7)?'block':'none';}
}
function drawMap(){
  const M=$('map');let html='',grp='';
  CH.forEach((c,ci)=>{
    if(c.group!==grp){if(grp)html+='</div>';grp=c.group;html+=`<h2 class="grp">${grp}</h2><div class="grid">`;}
    const done=chapProgress(c),tot=c.notions.length,T0=TILE[c.key]||{},todo=st.test&&st.test.res[c.key]===false&&!st.boss[c.key];
    html+=`<div class="tile${st.boss[c.key]?' done':''}${todo?' todo':''}" data-ci="${ci}" data-key="${c.key}" role="button" style="--t1:${c.c[0]};--t2:${c.c[1]};--t3:${c.c[2]}">
      <button class="mbtn" data-k="${c.key}" aria-label="Cartes">🃏</button>
      <div class="st"><span class="lvdots">${'●'.repeat(done)}${'○'.repeat(tot-done)}${st.boss[c.key]?' 👑':''}</span></div>
      <div class="art">${T0.draw?`<svg viewBox="0 0 100 84">${DRAW[T0.draw]}</svg>`:`<div class="tex">${T0.alt||c.icon}</div>`}</div>
      <div class="lbl">${c.label}</div></div>`;
  });
  M.innerHTML=html+'</div>';
  M.querySelectorAll('.tile').forEach(t=>t.addEventListener('click',()=>openIsland(CH[+t.dataset.ci])));
  M.querySelectorAll('.mbtn').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openAlbum(b.dataset.k);}));
  renderTiles();
}
function pathHTML(c){
  const ci=CH.indexOf(c);let html='<div class="path">';
  const nodes=[...c.notions.map((n,i)=>({t:'n',n,i})),{t:'boss'},{t:'prac'}];
  nodes.forEach((x,k)=>{
    const f=[.5,.78,.95,.78,.5,.22,.05,.22][k%8];
    let cls='node',lab='',ic='';
    if(x.t==='n'){const d=nodeDone(x.n.id),u=notionUnlocked(c,x.i);cls+=d?' done':u?' cur':' lock';ic=d?'★'.repeat(st.nodes[x.n.id]):String(x.i+1);const mm=mastery(x.n.id);lab=x.n.title+(mm!=null?`<span class="mg"><i style="width:${Math.round(mm*100)}%;background:${mm<.35?'#e11d48':mm<.7?'#f59e0b':'#16a34a'}"></i></span><small class="mgt">maîtrise ${Math.round(mm*100)} %</small>`:'');}
    else if(x.t==='boss'){const u=bossUnlocked(c);cls+=' boss'+(st.boss[c.key]?' done':u?' cur':' lock');ic='👑';lab='Boss';}
    else{const u=!!st.boss[c.key];cls+=' prac'+(u?'':' lock');ic='♾️';lab='Entraînement';}
    html+=`<div class="nrow${f>.5?' rev':''}" style="${f>.5?`padding-right:calc((100% - 68px)*${(1-f).toFixed(2)})`:`padding-left:calc((100% - 68px)*${f})`}"><button class="${cls}" data-c="${ci}" data-t="${x.t}" data-i="${x.i??''}"><span>${ic}</span></button><span class="nlab">${lab}</span></div>`;
  });
  return html+'</div>';
}
function openIsland(c){
  const done=chapProgress(c);
  sheet(`<div class="island" style="--t1:${c.c[0]};--t2:${c.c[1]};--t3:${c.c[2]};margin:0">
    <div class="ihead"><span class="iicon">${c.icon}</span><div class="itxt"><b>${c.label}</b><small>${done}/${c.notions.length} notions${st.boss[c.key]?' · 👑 boss vaincu':''}</small></div>
    <button class="album1" id="isa" aria-label="Cartes">🃏</button><button class="spd" id="iss" aria-label="Défi éclair">⚡</button></div>${pathHTML(c)}</div>`);
  const W=$('sheetw');
  $('isa').onclick=()=>openAlbum(c.key);
  $('iss').onclick=()=>{W.classList.remove('open');startSpeed(c,false);};
  W.querySelectorAll('.node').forEach(b=>b.onclick=()=>{
    const t=b.dataset.t;
    if(b.classList.contains('lock')){toast(t==='n'?'🔒 Termine d\'abord la notion précédente':t==='boss'?'🔒 Termine toutes les notions de l\'île':'🔒 Bats d\'abord le boss');return;}
    W.classList.remove('open');
    if(t==='n')startNotion(c,+b.dataset.i);else if(t==='boss')startBoss(c);else startPractice(c);
  });
}

/* ---------- Album de cartes ---------- */
function openAlbum(key){
  const list=key?[chapOf(key)]:CH;
  let h='';list.forEach(c=>{h+=`<h3 style="color:${c.c[1]}">${c.icon} ${c.label}</h3><div class="cards">`;
    c.notions.forEach(n=>{const has=st.cards[n.id];h+=`<button class="mini ${has?'':'locked'}" data-id="${n.id}" style="--k:${c.c[1]}">${has?`<b>${n.title}</b>`:'<b>?</b><small>à découvrir</small>'}</button>`;});h+='</div>';});
  sheet(`<div class="sh-h">🃏 ${key?'Cartes · '+chapOf(key).label:'Mon album'}<small>${Object.keys(st.cards).length}/${CH.reduce((a,c)=>a+c.notions.length,0)} cartes</small></div>${h}`);
  document.querySelectorAll('#sheet .mini').forEach(b=>b.onclick=()=>{if(b.classList.contains('locked'))return;
    const c=CH.find(c=>c.notions.some(n=>n.id===b.dataset.id)),n=c.notions.find(n=>n.id===b.dataset.id);
    sheet(`<div class="rcard" style="--k:${c.c[1]}"><div class="rc-top">${c.icon} ${c.label}</div><div class="rc-t">${n.title}</div>${n.ruleFig?`<div class="lfig">${n.ruleFig}</div>`:''}<div class="rc-b">${n.rule}</div></div><button class="lnk" id="back">← Retour à l'album</button>`);
    $('back').onclick=()=>openAlbum(key);});
}
function sheet(html){
  let w=$('sheetw');w.innerHTML=`<div class="memo-sheet" id="sheet"><div class="sh-x"><button class="x" id="shx">✕</button></div>${html}</div>`;
  math(w);requestAnimationFrame(()=>w.classList.add('open'));
  w.onclick=e=>{if(e.target===w||e.target.id==='shx')w.classList.remove('open');};
}

/* ---------- Profils : écrans ---------- */
function onboarding(mode){
  const o=$('onb');let av=(mode==='rename'&&me())?me().av:pick(AVATARS);
  o.innerHTML=`<div class="onb-card"><div class="onb-big" id="oav">${av}</div><h2>${mode==='rename'?'Modifier le profil':mode==='add'?'Nouveau profil':'Bienvenue ! 👋'}</h2>
    <p>Comment tu t'appelles ?</p><input id="oname" maxlength="20" placeholder="Ton prénom" value="${mode==='rename'&&me()?me().name:''}" autocomplete="off">
    <p>Choisis ton avatar</p><div class="avs">${AVATARS.map(a=>`<button class="av${a===av?' on':''}">${a}</button>`).join('')}</div>
    <button class="cta" id="ook">C'est parti !</button>${mode!=='first'?'<button class="lnk" id="ocancel">Annuler</button>':''}</div>`;
  o.classList.add('open');
  o.querySelectorAll('.av').forEach(b=>b.onclick=()=>{av=b.textContent;o.querySelectorAll('.av').forEach(x=>x.classList.toggle('on',x===b));$('oav').textContent=av;});
  if($('ocancel'))$('ocancel').onclick=()=>o.classList.remove('open');
  $('ook').onclick=()=>{const name=($('oname').value.trim()||'Champion').slice(0,20);
    if(mode==='rename'){Object.assign(me(),{name,av});saveP();o.classList.remove('open');home();return;}
    if(mode==='first'){P={current:'p1',list:[{id:'p1',name,av}]};saveP();o.classList.remove('open');home();askTest(true);return;}
    const id='p'+Date.now();P.list.push({id,name,av});P.current=id;saveP();try{sessionStorage.setItem('mathnb-asktest','1')}catch(e){}location.reload();};
}
function askTest(first){
  const o=$('onb');
  o.innerHTML=`<div class="onb-card"><div class="onb-big">🗺️</div><h2>${first?'Ravi de te connaître, '+me().name+' !':'Test de niveau'}</h2>
    <p>Un petit test de <b>${CH.length} questions</b> (≈ 5 min), une par île, pour savoir par où commencer ton aventure.</p>
    <button class="cta" id="tgo">📝 Tester mon niveau</button><button class="lnk" id="tno">${first?'Plus tard, je commence l\'aventure':'Annuler'}</button></div>`;
  o.classList.add('open');$('tgo').onclick=()=>{o.classList.remove('open');startTest();};$('tno').onclick=()=>o.classList.remove('open');
}
function profileSheet(){
  const o=$('onb');
  o.innerHTML=`<div class="onb-card"><h2>Profils</h2><div class="plist">${P.list.map(p=>`<button class="prow${p.id===P.current?' on':''}" data-id="${p.id}"><span>${p.av}</span>${p.name}${p.id===P.current?' <small>(actif)</small>':''}</button>`).join('')}</div>
    <button class="prow add" id="padd">➕ Nouveau profil</button><button class="prow" id="pedit">✏️ Modifier mon prénom / avatar</button>
    <button class="prow" id="palb">🃏 Mon album de cartes</button><button class="prow" id="psave">💾 Sauvegarder / restaurer</button><button class="prow" id="ptest">📝 ${st.test?'Repasser':'Passer'} le test de niveau</button>
    <button class="lnk" id="pclose">Fermer</button></div>`;
  o.classList.add('open');
  o.querySelectorAll('.prow[data-id]').forEach(b=>b.onclick=()=>{if(b.dataset.id===P.current){o.classList.remove('open');return;}P.current=b.dataset.id;saveP();location.reload();});
  $('padd').onclick=()=>onboarding('add');$('pedit').onclick=()=>onboarding('rename');$('ptest').onclick=()=>askTest(false);
  $('palb').onclick=()=>{o.classList.remove('open');openAlbum();};$('psave').onclick=()=>{o.classList.remove('open');saveSheet();};$('pclose').onclick=()=>o.classList.remove('open');
}

/* ---------- petits effets ---------- */
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.classList.add('on'),30);setTimeout(()=>{d.classList.remove('on');setTimeout(()=>d.remove(),400);},2600);}
function confetti(){const cols=['#8b5cf6','#f97316','#14b8a6','#ec4899','#3b82f6','#22c55e','#eab308'];for(let i=0;i<50;i++){const c=document.createElement('div');c.className='conf';c.style.left=Math.random()*100+'vw';c.style.background=cols[i%7];c.style.animationDuration=(1.6+Math.random()*1.4)+'s';c.style.animationDelay=(Math.random()*.4)+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),3500);}}
function sparkle(){const d=document.createElement('div');d.className='sparkle';d.textContent='🃏✨ Carte ajoutée à ton album !';document.body.appendChild(d);setTimeout(()=>d.remove(),1600);}

/* ---------- Démarrage ---------- */
function boot(){
  $('close').onclick=closeSession;
  $('lmemo').onclick=()=>{if(S&&S.chap)openAlbum(S.chap);};
  $('pbtn').onclick=()=>P?profileSheet():onboarding('first');
  $('albumBtn').onclick=()=>openAlbum();
  $('weakBtn').onclick=profSheet;$('saveBtn').onclick=saveSheet;migrate();
  if(window._recovered)setTimeout(()=>toast('🛟 Progression récupérée depuis la copie de secours'),800);
  home();startKatex();syncBank();
  if(!P)onboarding('first');
  else{let a=null;try{a=sessionStorage.getItem('mathnb-asktest');sessionStorage.removeItem('mathnb-asktest');}catch(e){}if(a)askTest(true);}
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!S)home();});
  window.addEventListener('resize',()=>{clearTimeout(window._rt);window._rt=setTimeout(renderTiles,120);});
}
