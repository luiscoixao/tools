/* Bibliothèque : outils, traceur, animations réutilisables */
const r=String.raw;
/* ================= SONS ================= */
let AC=null;
function sound(ok){
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const notes=ok?[523,659,784]:[220,165];
    notes.forEach((f,i)=>{
      const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+i*.09;
      o.type=ok?'triangle':'sine';o.frequency.value=f;
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.18,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.22);
      o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.25);
    });
  }catch(e){}
}

/* ================= GÉOMÉTRIE INTERACTIVE ================= */
const GC={a:'#f97316',b:'#14b8a6',c:'#8b5cf6',ink:'#1f1b3a',soft:'#f3f0ff'};
function svgPt(svg,ev){const p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}

/* figures pour les questions */
function figRight(a,b,c){
  const x0=70,y0=170,x1=250,y1=40;
  return `<svg viewBox="0 0 300 210" class="fig">
    <path d="M${x0} ${y0} L${x1} ${y0} L${x0} ${y1} Z" fill="${GC.soft}" stroke="${GC.ink}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M${x0} ${y0-18} h18 v18" fill="none" stroke="${GC.ink}" stroke-width="3"/>
    <text x="${(x0+x1)/2}" y="${y0+32}" class="sl" fill="${GC.a}">${a}</text>
    <text x="${x0-26}" y="${(y0+y1)/2+9}" class="sl" fill="${GC.b}">${b}</text>
    <text x="${(x0+x1)/2+22}" y="${(y0+y1)/2-8}" class="sl" fill="${GC.c}">${c}</text></svg>`;
}
function figTri(p,q,r){
  return `<svg viewBox="0 0 320 220" class="fig">
    <path d="M40 180 L280 180 L190 40 Z" fill="${GC.soft}" stroke="${GC.ink}" stroke-width="4" stroke-linejoin="round"/>
    <text x="160" y="212" class="sl" fill="${GC.a}">${p}</text>
    <text x="256" y="104" class="sl" fill="${GC.b}">${q}</text>
    <text x="96" y="100" class="sl" fill="${GC.c}">${r}</text></svg>`;
}
function figArea(){
  return `<svg viewBox="0 0 320 200" class="fig">
    <path d="M30 160 L290 160 L110 56 Z" fill="#ccfbf1" stroke="${GC.ink}" stroke-width="4" stroke-linejoin="round"/>
    <line x1="110" y1="56" x2="110" y2="160" stroke="${GC.b}" stroke-width="3" stroke-dasharray="7 6"/>
    <path d="M110 146 h14 v14" fill="none" stroke="${GC.b}" stroke-width="2.5"/>
    <text x="160" y="192" class="sl" fill="${GC.a}">10</text>
    <text x="94" y="116" class="sl" fill="${GC.b}">4</text></svg>`;
}
function figAngles(){
  return `<svg viewBox="0 0 320 210" class="fig">
    <path d="M40 180 L280 180 L130 50 Z" fill="${GC.soft}" stroke="${GC.ink}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M40 180 L90 180 A50 50 0 0 0 68.5 138.9 Z" fill="${GC.a}" opacity=".85"/>
    <path d="M280 180 L235 180 A45 45 0 0 1 245.9 150.5 Z" fill="${GC.b}" opacity=".85"/>
    <text x="118" y="172" class="sl" fill="${GC.a}" font-size="22">50°</text>
    <text x="210" y="172" class="sl" fill="${GC.b}" font-size="22">60°</text>
    <text x="134" y="98" class="sl" fill="${GC.c}">?</text></svg>`;
}

/* 1. toucher l'hypoténuse */
function mountHyp(box,done){
  const x0=70,y0=200,x1=270,y1=50;
  const side=(k,a,b,c,d)=>`<g data-s="${k}"><line class="side pulse" x1="${a}" y1="${b}" x2="${c}" y2="${d}"/><line class="hit" x1="${a}" y1="${b}" x2="${c}" y2="${d}"/></g>`;
  box.innerHTML=`<svg viewBox="0 0 320 250" class="fig">
    <path d="M${x0} ${y0} L${x1} ${y0} L${x0} ${y1} Z" fill="${GC.soft}"/>
    <path d="M${x0} ${y0-22} h22 v22" fill="none" stroke="${GC.ink}" stroke-width="3"/>
    ${side('a',x0,y0,x1,y0)}${side('b',x0,y0,x0,y1)}${side('c',x1,y0,x0,y1)}
    <text id="hl" x="${(x0+x1)/2+30}" y="${(y0+y1)/2-12}" class="sl" fill="${GC.c}" opacity="0">c</text>
  </svg><div class="hint" id="hint">👆 Touche le côté <b>le plus long</b>, en face de l'angle droit ⬛</div>`;
  const hint=box.querySelector('#hint');
  box.querySelectorAll('g[data-s]').forEach(g=>{
    g.addEventListener('click',()=>{
      const ln=g.querySelector('.side');
      if(g.dataset.s==='c'){
        box.querySelectorAll('.side').forEach(x=>x.classList.remove('pulse'));
        ln.classList.add('ok');box.querySelector('#hl').setAttribute('opacity','1');
        hint.innerHTML='✨ Voici <b>l\'hypoténuse</b> !';
        done(`L'<b>hypoténuse</b> est le plus grand côté d'un triangle rectangle. Elle est toujours <b>en face de l'angle droit</b>.`);
      }else{
        sound(false);ln.classList.add('ko');setTimeout(()=>ln.classList.remove('ko'),600);
        hint.innerHTML='Presque ! Ce côté <b>touche</b> l\'angle droit. Cherche celui d\'<b>en face</b> 👀';
      }
    });
  });
}

/* 2. Pythagore avec curseurs */
function mountPyth(box,done){
  box.innerHTML=`<svg class="fig" id="pf"></svg>
    <div class="eq" id="peq"></div>
    <label class="sld" style="--k:${GC.a}"><span>a</span><input type="range" min="1" max="8" step="1" value="2" id="sa"><b id="va">2</b></label>
    <label class="sld" style="--k:${GC.b}"><span>b</span><input type="range" min="1" max="8" step="1" value="2" id="sb"><b id="vb">2</b></label>
    <div class="hint" id="ph">🎯 Défi : règle <b style="color:${GC.a}">a</b> et <b style="color:${GC.b}">b</b> pour que <b style="color:${GC.c}">c</b> tombe juste (un nombre entier)</div>`;
  const svg=box.querySelector('#pf'),sa=box.querySelector('#sa'),sb=box.querySelector('#sb');
  let moves=0,won=false;
  function draw(){
    const a=+sa.value,b=+sb.value,u=20,c=Math.hypot(a,b),c2=a*a+b*b,ok=Number.isInteger(c);
    box.querySelector('#va').textContent=a;box.querySelector('#vb').textContent=b;
    let s='';
    for(let i=0;i<a;i++)for(let j=0;j<a;j++)s+=`<rect x="${i*u}" y="${j*u}" width="${u}" height="${u}" fill="${GC.a}" stroke="#fff" stroke-width="2" rx="3"/>`;
    for(let i=0;i<b;i++)for(let j=0;j<b;j++)s+=`<rect x="${-(i+1)*u}" y="${-(j+1)*u}" width="${u}" height="${u}" fill="${GC.b}" stroke="#fff" stroke-width="2" rx="3"/>`;
    const P=[a*u,0],Q=[0,-b*u],n=[b*u,-a*u];
    const H=[P,Q,[Q[0]+n[0],Q[1]+n[1]],[P[0]+n[0],P[1]+n[1]]];
    s+=`<polygon points="${H.map(p=>p.join(',')).join(' ')}" fill="${GC.c}" fill-opacity="${ok?.95:.75}" stroke="#fff" stroke-width="3"/>`;
    s+=`<polygon points="0,0 ${P.join(',')} ${Q.join(',')}" fill="#fff" stroke="${GC.ink}" stroke-width="4" stroke-linejoin="round"/>`;
    s+=`<path d="M0 ${-Math.min(14,b*u/3)} h${Math.min(14,a*u/3)} v${Math.min(14,b*u/3)}" fill="none" stroke="${GC.ink}" stroke-width="2.5"/>`;
    const fs=Math.max(16,Math.min(30,u*Math.min(a,b)*.55));
    s+=`<text x="${a*u/2}" y="${a*u/2+10}" class="sl" style="font-size:${Math.max(16,a*u*.4)}px;stroke:rgba(0,0,0,.25);stroke-width:2px" fill="#fff">${a*a}</text>`;
    s+=`<text x="${-b*u/2}" y="${-b*u/2+10}" class="sl" style="font-size:${Math.max(16,b*u*.4)}px;stroke:rgba(0,0,0,.25);stroke-width:2px" fill="#fff">${b*b}</text>`;
    const cx=(P[0]+Q[0]+n[0])/2,cy=(P[1]+Q[1]+n[1])/2;
    s+=`<text x="${cx}" y="${cy+12}" class="sl" style="font-size:${Math.max(18,c*u*.35)}px;stroke:rgba(0,0,0,.25);stroke-width:2px" fill="#fff">${c2}</text>`;
    const pad=20,minX=-b*u-pad,maxX=(a+b)*u+pad,minY=-(a+b)*u-pad,maxY=a*u+pad;
    svg.setAttribute('viewBox',`${minX} ${minY} ${maxX-minX} ${maxY-minY}`);
    svg.style.maxHeight='46vh';
    svg.innerHTML=s;
    const cTxt=ok?`<span class="ok">c = ${c} 🎉</span>`:`c ≈ ${c.toFixed(2).replace('.',',')}`;
    box.querySelector('#peq').innerHTML=`<span style="color:${GC.a}">${a*a}</span> + <span style="color:${GC.b}">${b*b}</span> = <span style="color:${GC.c}">${c2}</span> → ${cTxt}`;
    if(ok&&!won){
      won=true;
      box.querySelector('#ph').innerHTML='🏆 Trouvé ! Les carrés <b style="color:#f97316">orange</b> + <b style="color:#14b8a6">verts</b> remplissent exactement le <b style="color:#8b5cf6">violet</b>.';
      done(`${a}² + ${b}² = ${c}², donc <b>c = ${c}</b>. C'est le <b>théorème de Pythagore</b> : $a^2+b^2=c^2$.`);
    }else if(!won&&moves>=8){
      box.querySelector('#ph').innerHTML='💡 Petit coup de pouce : essaie <b>a = 3</b> et <b>b = 4</b>';
    }
  }
  [sa,sb].forEach(x=>x.addEventListener('input',()=>{moves++;draw();}));
  draw();
}

/* 3. aire du triangle : on déplace le sommet */
function mountArea(box,done){
  const u=30,X0=20,Y0=170,base=8,hh=4;
  box.innerHTML=`<svg viewBox="0 0 280 210" class="fig" id="af"></svg>
    <div class="eq">Aire = <span style="color:${GC.a}">8</span> × <span style="color:${GC.b}">4</span> ÷ 2 = <span class="ok" id="av">16</span></div>
    <div class="hint" id="ah">👆 Fais glisser le <b>point violet</b> : l'aire change-t-elle ?</div>`;
  const svg=box.querySelector('#af');
  let ax=X0+2*u,travel=0,last=ax,drag=false,won=false;
  function draw(){
    let g='';
    for(let i=0;i<base;i++)for(let j=0;j<hh;j++)g+=`<rect x="${X0+i*u}" y="${Y0-(j+1)*u}" width="${u}" height="${u}" fill="none" stroke="#e4e2ee" stroke-width="1.5"/>`;
    const top=Y0-hh*u;
    svg.innerHTML=`${g}
      <rect x="${X0}" y="${top}" width="${base*u}" height="${hh*u}" fill="none" stroke="#c9c5dc" stroke-width="2.5" stroke-dasharray="8 6"/>
      <path d="M${X0} ${Y0} L${X0+base*u} ${Y0} L${ax} ${top} Z" fill="#99f6e4" fill-opacity=".85" stroke="${GC.ink}" stroke-width="4" stroke-linejoin="round"/>
      <line x1="${ax}" y1="${top}" x2="${ax}" y2="${Y0}" stroke="${GC.b}" stroke-width="3" stroke-dasharray="6 5"/>
      <text x="${X0+base*u/2}" y="${Y0+30}" class="sl" fill="${GC.a}">8</text>
      <text x="${ax+(ax>X0+base*u-30?-18:18)}" y="${Y0-hh*u/2+8}" class="sl" fill="${GC.b}">4</text>
      <circle cx="${ax}" cy="${top}" r="16" fill="${GC.c}" stroke="#fff" stroke-width="4" class="grab"/>
      <circle cx="${ax}" cy="${top}" r="30" fill="transparent" class="grab"/>`;
  }
  function move(ev){
    const p=svgPt(svg,ev);ax=Math.max(X0-20,Math.min(X0+base*u+20,p.x));
    travel+=Math.abs(ax-last);last=ax;draw();
    if(!won&&travel>4*u){
      won=true;
      box.querySelector('#ah').innerHTML='😮 L\'aire reste <b>16</b>, quelle que soit la forme !';
      done(`L'aire d'un triangle ne dépend que de sa <b>base</b> et de sa <b>hauteur</b> : c'est toujours la moitié du rectangle, $\\dfrac{\\text{base}\\times\\text{hauteur}}{2}$.`);
    }
  }
  svg.addEventListener('pointerdown',e=>{drag=true;svg.setPointerCapture(e.pointerId);move(e);});
  svg.addEventListener('pointermove',e=>{if(drag)move(e);});
  svg.addEventListener('pointerup',()=>drag=false);
  svg.addEventListener('pointercancel',()=>drag=false);
  draw();
}

/* 4. découper les trois angles */
function mountAngles(box,done){
  const A=[40,170],B=[280,170],C=[140,40],M=[160,250],R=34;
  const V=[A,B,C],cols=[GC.a,GC.b,GC.c];
  const ang=(p,q)=>Math.atan2(q[1]-p[1],q[0]-p[0]);
  const sec=V.map((v,i)=>{
    const o=V.filter((_,j)=>j!==i);
    let s=ang(v,o[0]),e=ang(v,o[1]);
    let d=e-s;while(d<0)d+=2*Math.PI;
    if(d>Math.PI){[s,e]=[e,s];d=2*Math.PI-d;}
    return {v,s,d};
  });
  const path=(v,s,d)=>`M${v[0]} ${v[1]} L${v[0]+R*Math.cos(s)} ${v[1]+R*Math.sin(s)} A${R} ${R} 0 0 1 ${v[0]+R*Math.cos(s+d)} ${v[1]+R*Math.sin(s+d)} Z`;
  box.innerHTML=`<svg viewBox="0 0 320 290" class="fig" id="gf">
    <path d="M${A} L${B} L${C} Z" fill="${GC.soft}" stroke="${GC.ink}" stroke-width="4" stroke-linejoin="round" id="tri"/>
    <line x1="40" y1="${M[1]}" x2="280" y2="${M[1]}" stroke="${GC.ink}" stroke-width="3" stroke-dasharray="6 6" id="ln" opacity=".25"/>
    ${sec.map((s,i)=>`<path id="w${i}" d="${path(s.v,s.s,s.d)}" fill="${cols[i]}" stroke="#fff" stroke-width="2"/>`).join('')}
    <text id="t180" x="160" y="${M[1]-46}" class="sl" fill="${GC.ink}" opacity="0">180°</text>
  </svg>
  <button class="bigbtn" id="cut">✂️ Découper les 3 angles</button>
  <div class="hint">Les 3 coins colorés sont les <b>angles</b> du triangle.</div>`;
  box.querySelector('#cut').onclick=e=>{
    e.target.disabled=true;e.target.style.opacity='.4';
    let cum=Math.PI;
    const tg=sec.map(s=>{const t=cum;cum+=s.d;return t-s.s;});
    const t0=performance.now(),D=1400;
    (function step(now){
      let t=Math.min(1,(now-t0)/D);t=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
      sec.forEach((s,i)=>{
        const px=s.v[0]+(M[0]-s.v[0])*t,py=s.v[1]+(M[1]-s.v[1])*t;
        box.querySelector('#w'+i).setAttribute('transform',`translate(${px} ${py}) rotate(${tg[i]*180/Math.PI*t}) translate(${-s.v[0]} ${-s.v[1]})`);
      });
      if(t<1)requestAnimationFrame(step);
      else{
        box.querySelector('#ln').setAttribute('opacity','1');
        box.querySelector('#t180').setAttribute('opacity','1');
        done(`Mis bout à bout, les 3 angles forment un <b>demi-tour</b> : leur somme fait toujours <b>180°</b>, quel que soit le triangle.`);
      }
    })(t0);
  };
}

/* --- Probabilités interactives --- */
function dieSvg(n,col){
  const P={1:[[50,50]],2:[[28,28],[72,72]],3:[[26,26],[50,50],[74,74]],4:[[28,28],[72,28],[28,72],[72,72]],5:[[26,26],[74,26],[50,50],[26,74],[74,74]],6:[[28,24],[72,24],[28,50],[72,50],[28,76],[72,76]]}[n];
  return `<svg viewBox="0 0 100 100" width="84" height="84"><rect x="6" y="6" width="88" height="88" rx="18" fill="#fff" stroke="${col}" stroke-width="5"/>${P.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${col}"/>`).join('')}</svg>`;
}
const PC='#0284c7';
function mountDice(box,done){
  const cnt=[0,0,0,0,0,0];let N=0,won=false;
  box.innerHTML=`<div style="display:flex;justify-content:center;margin:4px 0 8px" id="die">${dieSvg(6,PC)}</div>
    <svg viewBox="0 0 300 170" class="fig" id="dc"></svg>
    <div class="eq" id="dn">0 lancer</div>
    <div style="display:flex;gap:10px;justify-content:center">
      <button class="bigbtn" id="d1" style="margin:0">🎲 Lancer</button>
      <button class="bigbtn" id="d100" style="margin:0">🚀 ×100</button></div>
    <div class="hint" id="dh">Lance le dé beaucoup de fois. Que deviennent les barres ?</div>`;
  const svg=box.querySelector('#dc');
  function draw(){
    const mx=Math.max(...cnt.map(c=>c/Math.max(N,1)),1/6*1.5);
    let s='';
    const y0=140,H=104,line=y0-H*(1/6)/mx;
    cnt.forEach((c,i)=>{
      const f=N?c/N:0,h=H*f/mx,x=22+i*46;
      s+=`<rect x="${x}" y="${y0-h}" width="34" height="${h}" rx="6" fill="${PC}" opacity="${.55+.07*i}"/>
          <text x="${x+17}" y="${y0+24}" class="sl" style="font-size:20px" fill="${PC}">${i+1}</text>
          <text x="${x+17}" y="${y0-h-6}" style="font:800 12px Nunito;text-anchor:middle" fill="#6b6785">${N?Math.round(f*100)+'%':''}</text>`;
    });
    s+=`<line x1="14" y1="${line}" x2="290" y2="${line}" stroke="#f97316" stroke-width="3" stroke-dasharray="8 6"/>
        <text x="150" y="16" style="font:900 15px Nunito;text-anchor:middle" fill="#f97316">- - -  chance théorique : 1/6 ≈ 17 %</text>
        <line x1="14" y1="${y0}" x2="290" y2="${y0}" stroke="#1f1b3a" stroke-width="3"/>`;
    svg.innerHTML=s;
    box.querySelector('#dn').textContent=N+' lancer'+(N>1?'s':'');
  }
  function roll(k){
    let last=1;
    for(let i=0;i<k;i++){last=1+Math.floor(Math.random()*6);cnt[last-1]++;N++;}
    const d=box.querySelector('#die');d.innerHTML=dieSvg(last,PC);d.classList.remove('shake');void d.offsetWidth;d.classList.add('shake');
    draw();
    if(!won&&N>=100){
      won=true;
      box.querySelector('#dh').innerHTML='🎯 Toutes les barres se rapprochent de la ligne orange !';
      done(`Chaque face a <b>1 chance sur 6</b>. Plus on lance, plus la fréquence approche $\\dfrac16\\approx17\\,\\%$ : c'est ça, une <b>probabilité</b>.`);
    }
  }
  box.querySelector('#d1').onclick=()=>roll(1);
  box.querySelector('#d100').onclick=()=>roll(100);
  draw();
}
function mountTree(box,done){
  const leaves=[['P','P'],['P','F'],['F','P'],['F','F']];
  const seen=new Set();
  const X0=40,X1=150,X2=262,ys=[30,80,130,180],ym=[55,155];
  let s=`<circle cx="${X0}" cy="105" r="10" fill="${PC}"/>`;
  [0,1].forEach(i=>{
    s+=`<line x1="${X0}" y1="105" x2="${X1}" y2="${ym[i]}" stroke="${PC}" stroke-width="4"/>
        <text x="${(X0+X1)/2}" y="${(105+ym[i])/2+(i?22:-8)}" style="font:800 14px Nunito;text-anchor:middle" fill="#6b6785">1/2</text>
        <circle cx="${X1}" cy="${ym[i]}" r="18" fill="#fff" stroke="${PC}" stroke-width="4"/>
        <text x="${X1}" y="${ym[i]+7}" class="sl" style="font-size:20px" fill="${PC}">${i?'F':'P'}</text>`;
    [0,1].forEach(j=>{
      const k=i*2+j;
      s+=`<line x1="${X1+18}" y1="${ym[i]}" x2="${X2-24}" y2="${ys[k]}" stroke="${PC}" stroke-width="4"/>
          <g data-k="${k}" style="cursor:pointer"><rect x="${X2-24}" y="${ys[k]-20}" width="56" height="40" rx="12" fill="#e0f2fe" stroke="${PC}" stroke-width="3" class="lf"/>
          <text x="${X2+4}" y="${ys[k]+8}" class="sl" style="font-size:22px" fill="${PC}">?</text></g>`;
    });
  });
  box.innerHTML=`<svg viewBox="0 0 310 210" class="fig">${s}</svg>
    <div class="hint" id="th">👆 Touche les 4 cases <b>?</b> pour voir tous les résultats possibles</div>`;
  box.querySelectorAll('g[data-k]').forEach(g=>g.addEventListener('click',()=>{
    const k=+g.dataset.k;if(seen.has(k))return;seen.add(k);sound(true);
    g.querySelector('rect').setAttribute('fill','#fef3c7');
    g.querySelector('text').textContent=leaves[k].join('');
    if(seen.size===4){
      box.querySelector('#th').innerHTML='4 issues, toutes avec la même chance : <b>1/4</b> chacune.';
      done(`Avec 2 pièces, il y a <b>4 issues</b> (PP, PF, FP, FF). On <b>multiplie</b> le long des branches : $\\dfrac12\\times\\dfrac12=\\dfrac14$.`);
    }
  }));
}
function figUrn(){
  const balls=[['#e11d48',110,120],['#e11d48',150,110],['#e11d48',130,150],['#2563eb',175,148],['#2563eb',195,118]];
  return `<svg viewBox="0 0 300 200" class="fig">
    <path d="M80 60 Q70 190 150 190 Q230 190 220 60 Z" fill="#f4f2fb" stroke="#1f1b3a" stroke-width="4"/>
    <ellipse cx="150" cy="60" rx="70" ry="12" fill="#fff" stroke="#1f1b3a" stroke-width="4"/>
    ${balls.map(b=>`<circle cx="${b[1]}" cy="${b[2]}" r="17" fill="${b[0]}"/><circle cx="${b[1]-5}" cy="${b[2]-6}" r="5" fill="#fff" opacity=".5"/>`).join('')}</svg>`;
}
/* ================= OUTILS POUR EXERCICES GÉNÉRÉS ================= */
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;}
/* fraction en LaTeX, simplifiée */
function fr(p,q=1){
  if(q<0){p=-p;q=-q;}
  const g=gcd(p,q);p/=g;q/=g;
  if(q===1) return String(p);
  return (p<0?'-':'')+`\\dfrac{${Math.abs(p)}}{${q}}`;
}
/* monôme a·x^n en LaTeX */
function mono(a,n){
  if(a===0) return '0';
  const c=a===1&&n>0?'':a===-1&&n>0?'-':String(a);
  return n===0?String(a):n===1?c+'x':c+`x^{${n}}`;
}
/* fabrique une question : bonne réponse en premier, distracteurs dédoublonnés */
function Q(q,good,bad,why,hint,img,extra){
  const a=[good];
  for(const b of bad){if(a.length>=4)break;if(!a.includes(b))a.push(b);}
  const n=Number(good);
  if(!isNaN(n)) for(const d of [1,-1,2,-2,3,5]){if(a.length>=4)break;const c=String(n+d);if(!a.includes(c))a.push(c);}
  return Object.assign({q,a:a.map(x=>x.startsWith('$')||x.startsWith('<')?x:'$'+x+'$'),why,hint,img,bubbles:true},extra||{});
}

/* ================= TRACEUR DE COURBES ================= */
function plot(o){
  const W=320,H=o.h||210,p=24,{f,x0,x1,y0,y1}=o,col=o.col||'#0891b2';
  const X=x=>p+(x-x0)/(x1-x0)*(W-2*p), Y=y=>H-p-(y-y0)/(y1-y0)*(H-2*p);
  const cy=v=>Math.max(y0,Math.min(y1,v));
  let s='';
  for(let x=Math.ceil(x0);x<=x1;x++) s+=`<line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}" stroke="#eeecf5" stroke-width="1"/>`;
  const ys=o.ystep||1;
  for(let y=Math.ceil(y0/ys)*ys;y<=y1;y+=ys) s+=`<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" stroke="#eeecf5" stroke-width="1"/>`;
  if(o.fam) o.fam.forEach(g=>{let d='',pen=false;for(let i=0;i<=120;i++){const x=x0+(x1-x0)*i/120,v=g(x);if(v<y0||v>y1){pen=false;continue;}d+=(pen?' L':' M')+`${X(x).toFixed(1)} ${Y(v).toFixed(1)}`;pen=true;}
    s+=`<path d="${d.trim()}" fill="none" stroke="#c9c5dc" stroke-width="2.4"/>`;});
  if(o.regions) o.regions.forEach(R=>{
    let d=`M${X(R.a)} ${Y(0)}`;for(let i=0;i<=60;i++){const x=R.a+(R.b-R.a)*i/60;d+=` L${X(x)} ${Y(cy(f(x)))}`;}d+=` L${X(R.b)} ${Y(0)} Z`;
    s+=`<path d="${d}" fill="${R.col}" fill-opacity=".4"/>`;
    [R.a,R.b].forEach(x=>s+=`<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(cy(f(x)))}" stroke="${R.col}" stroke-width="2.4" stroke-dasharray="5 4"/>`);
    if(R.txt) s+=`<text x="${X((R.a+R.b)/2)}" y="${Y(f((R.a+R.b)/2)/2)+7}" class="ax big" style="font-size:22px" fill="#1f1b3a">${R.txt}</text>`;
  });
  if(o.g&&o.a!=null){
    let d='';for(let i=0;i<=80;i++){const x=o.a+(o.b-o.a)*i/80;d+=(i?' L':'M')+`${X(x)} ${Y(cy(f(x)))}`;}
    for(let i=80;i>=0;i--){const x=o.a+(o.b-o.a)*i/80;d+=` L${X(x)} ${Y(cy(o.g(x)))}`;}
    s+=`<path d="${d} Z" fill="${col}" fill-opacity=".38"/>`;
  }else if(o.rects){
    const n=o.rects,w=(o.b-o.a)/n;
    for(let i=0;i<n;i++){const xa=o.a+i*w,h=f(xa);
      s+=`<rect x="${X(xa)}" y="${Math.min(Y(h),Y(0))}" width="${X(xa+w)-X(xa)}" height="${Math.abs(Y(h)-Y(0))}" fill="${col}" fill-opacity=".35" stroke="${col}" stroke-width="${n>25?.6:1.4}"/>`;}
  }else if(o.a!=null){
    let d=`M${X(o.a)} ${Y(0)}`;
    for(let i=0;i<=80;i++){const x=o.a+(o.b-o.a)*i/80;d+=` L${X(x)} ${Y(cy(f(x)))}`;}
    d+=` L${X(o.b)} ${Y(0)} Z`;
    s+=`<path d="${d}" fill="${o.neg?'#e11d48':col}" fill-opacity=".38"/>`;
  }
  // axes
  if(y0<=0&&y1>=0) s+=`<line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1)}" y2="${Y(0)}" stroke="#1f1b3a" stroke-width="2.4"/><path d="M${X(x1)-7} ${Y(0)-5} L${X(x1)} ${Y(0)} L${X(x1)-7} ${Y(0)+5}" fill="none" stroke="#1f1b3a" stroke-width="2.4"/>`;
  if(x0<=0&&x1>=0) s+=`<line x1="${X(0)}" y1="${Y(y0)}" x2="${X(0)}" y2="${Y(y1)}" stroke="#1f1b3a" stroke-width="2.4"/><path d="M${X(0)-5} ${Y(y1)+7} L${X(0)} ${Y(y1)} L${X(0)+5} ${Y(y1)+7}" fill="none" stroke="#1f1b3a" stroke-width="2.4"/>`;
  if(o.ticks!==false){
    for(let x=Math.ceil(x0);x<=x1;x+=(o.xstep||1)) if(x!==0&&!(o.a!=null&&o.bounds!==false&&(x===o.a||x===o.b))) s+=`<text x="${X(x)}" y="${Y(0)+16}" class="ax">${x}</text>`;
    for(let y=Math.ceil(y0/ys)*ys;y<=y1;y+=ys) if(y!==0) s+=`<text x="${X(0)-9}" y="${Y(y)+4}" class="ax" text-anchor="end">${y}</text>`;
  }
  // courbe
  if(o.g){let d='',pen=false;for(let i=0;i<=160;i++){const x=x0+(x1-x0)*i/160,v=o.g(x);if(v<y0-.5||v>y1+.5){pen=false;continue;}d+=(pen?' L':' M')+`${X(x).toFixed(1)} ${Y(v).toFixed(1)}`;pen=true;}
    s+=`<path d="${d.trim()}" fill="none" stroke="#f97316" stroke-width="3.4" stroke-linecap="round"/>`;}
  let d='',pen=false;
  for(let i=0;i<=160;i++){const x=x0+(x1-x0)*i/160,v=f(x);if(v<y0-.5||v>y1+.5){pen=false;continue;}d+=(pen?' L':' M')+`${X(x).toFixed(1)} ${Y(v).toFixed(1)}`;pen=true;}
  s+=`<path d="${d.trim()}" fill="none" stroke="#1f1b3a" stroke-width="3.4" stroke-linecap="round"/>`;
  if(o.a!=null&&o.bounds!==false){
    [[o.a,o.la??'a'],[o.b,o.lb??'b']].forEach(([x,l])=>{
      s+=`<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(cy(f(x)))}" stroke="${o.neg?'#e11d48':col}" stroke-width="2.4" stroke-dasharray="5 4"/>`;
      if(l!=='') s+=`<text x="${X(x)}" y="${Y(0)+(o.neg?-8:34)}" class="ax big" fill="${o.neg?'#e11d48':col}">${l}</text>`;
    });
  }
  if(o.fl) s+=`<text x="${X(o.fl[0])}" y="${Y(o.fl[1])}" class="ax big" fill="#1f1b3a">${o.fl[2]}</text>`;
  if(o.inside) s+=`<text x="${X((o.a+o.b)/2)}" y="${Y(o.inside[1])}" class="ax big" fill="${o.neg?'#9f1239':'#0e4f63'}">${o.inside[0]}</text>`;
  if(o.over) s+=o.over(X,Y);
  return `<svg viewBox="0 0 ${W} ${H+(o.a!=null&&!o.neg?14:0)}" class="fig">${s}</svg>`;
}

/* ================= INTÉGRALES — ANIMATIONS ================= */
const IC='#0891b2';
function mountRiemann(box,done){
  const f=x=>x*x/4+1,exact=28/3;
  box.innerHTML=`<div id="rf"></div>
    <div class="eq" id="req"></div>
    <label class="sld" style="--k:${IC}"><span>▮</span><input type="range" min="1" max="60" value="2" id="rn"><b id="rv">2</b></label>
    <div class="hint" id="rh">👉 Augmente le nombre de rectangles</div>`;
  const inp=box.querySelector('#rn');let won=false;
  function draw(){
    const n=+inp.value,w=4/n;let sum=0;for(let i=0;i<n;i++)sum+=f(i*w)*w;
    box.querySelector('#rf').innerHTML=plot({f,x0:-.4,x1:4.6,y0:-.6,y1:5.4,a:0,b:4,rects:n,la:'0',lb:'4',col:IC});
    box.querySelector('#rv').textContent=n;
    const gap=Math.abs(exact-sum);
    box.querySelector('#req').innerHTML=`${n} rectangle${n>1?'s':''} : aire ≈ <b style="color:${IC}">${sum.toFixed(2).replace('.',',')}</b><br><span style="font-size:17px;color:#6b6785">aire exacte : 9,33 · écart ${gap.toFixed(2).replace('.',',')}</span>`;
    if(n>=30&&!won){won=true;
      box.querySelector('#rh').innerHTML='🎯 Avec des rectangles très fins, on tombe presque pile sur l\'aire exacte !';
      done(`Une intégrale, c'est <b>la somme d'une infinité de rectangles infiniment fins</b> sous la courbe. D'où son symbole $\\int$ : un <b>S</b> allongé, pour « <b>S</b>omme ».`);}
  }
  inp.addEventListener('input',draw);draw();
}
function mountBounds(box,done){
  const f=x=>x*x;
  box.innerHTML=`<div id="bf"></div><div class="eq" id="beq"></div>
    <label class="sld" style="--k:#f97316"><span>a</span><input type="range" min="0" max="4" value="1" id="ba"><b id="bav">1</b></label>
    <label class="sld" style="--k:${IC}"><span>b</span><input type="range" min="0" max="4" value="2" id="bb"><b id="bbv">2</b></label>
    <div class="hint" id="bh">🎯 Défi : règle <b>a</b> et <b>b</b> pour que l'aire vaille exactement <b>9</b></div>`;
  const A=box.querySelector('#ba'),B=box.querySelector('#bb');let won=false,moves=0;
  function draw(){
    let a=+A.value,b=+B.value;
    box.querySelector('#bav').textContent=a;box.querySelector('#bbv').textContent=b;
    const lo=Math.min(a,b),hi=Math.max(a,b);
    box.querySelector('#bf').innerHTML=plot({f,x0:-.5,x1:4.5,y0:-1.5,y1:17,ystep:4,a:lo,b:hi,la:'',lb:'',col:IC,fl:[3.9,15.4,'x²']});
    const v=fr(hi**3-lo**3,3);
    box.querySelector('#beq').innerHTML=a>=b?`<span style="color:#6b6785">Mets <b>a</b> plus petit que <b>b</b></span>`:
      `$\\displaystyle\\int_{${a}}^{${b}}x^2dx=\\left[\\frac{x^3}{3}\\right]_{${a}}^{${b}}=\\frac{${b**3}}{3}-\\frac{${a**3}}{3}=${v}$`;
    math(box.querySelector('#beq'));
    if(a<b&&b**3-a**3===27&&!won){won=true;
      box.querySelector('#bh').innerHTML='🏆 Trouvé : de 0 à 3, l\'aire vaut 9 !';
      done(`On a calculé l'aire <b>sans compter les carreaux</b> : une primitive de $x^2$ est $\\frac{x^3}{3}$, et $\\frac{27}{3}-\\frac{0}{3}=9$.`);}
    else if(!won&&moves>=10) box.querySelector('#bh').innerHTML='💡 Coup de pouce : essaie <b>a = 0</b> et <b>b = 3</b>';
  }
  [A,B].forEach(x=>x.addEventListener('input',()=>{moves++;draw();}));draw();
}

/* ================= INTÉGRALES — ILLUSTRATIONS ================= */
/* schéma « F ⇄ f » */
function chainFig(F,f,ask){
  return `<div class="chain"><div class="cbox" style="--k:#7c3aed">${ask==='F'?'$F(x)=\\ ?$':'$F(x)='+F+'$'}</div>
    <div class="carrow"><span>dériver ⬇</span><span>⬆ primitiver</span></div>
    <div class="cbox" style="--k:#0891b2">${ask==='f'?'$f(x)=\\ ?$':'$f(x)='+f+'$'}</div></div>`;
}
const dec=v=>String(Math.round(v*100)/100).replace('.',',');

/* ================= INTÉGRALES — EXERCICES GÉNÉRÉS ================= */
const GI={
  /* ---------- Leçon 1 : l'aire ---------- */
  rect(){
    const k=ri(2,5),a=ri(0,2),b=a+ri(2,4),v=k*(b-a);
    return Q(r`Combien vaut $\displaystyle\int_{${a}}^{${b}}${k}\,dx$ ?`,String(v),[String(k+b-a),String(k*b),String(v+k),String(b-a)],
      r`La courbe est la droite horizontale $y=${k}$ : la zone est un <b>rectangle</b>.<br>Hauteur $${k}$ × largeur $${b}-${a}=${b-a}$ → $${v}$.`,
      'Regarde le dessin : c\'est un rectangle. Aire = hauteur × largeur.',
      plot({f:()=>k,x0:-.5,x1:b+1,y0:-.8,y1:k+1.5,a,b,la:String(a),lb:String(b),col:IC,inside:[k+' de haut',k/2]}));
  },
  tri(){
    const m=pick([1,2]),b=pick([2,3,4,5,6]);
    return Q(r`Combien vaut $\displaystyle\int_{0}^{${b}}${mono(m,1)}\,dx$ ?`,fr(m*b*b,2),[String(m*b*b),String(m*b),fr(m*b*b,4),String(b*b)],
      r`La zone est un <b>triangle</b> : base $${b}$, hauteur $${m}\times${b}=${m*b}$.<br>Aire $=\dfrac{${b}\times${m*b}}{2}=${fr(m*b*b,2)}$.`,
      'C\'est un triangle : base × hauteur ÷ 2. La hauteur, c\'est la valeur de la fonction au bout.',
      plot({f:x=>m*x,x0:-.5,x1:b+1,y0:-1,y1:m*b+1.5,ystep:m*b>8?2:1,a:0,b,la:'0',lb:String(b),col:IC}));
  },
  trap(){
    const c=ri(1,3),a=ri(0,2),b=a+ri(2,3),v=((a+c)+(b+c))*(b-a)/2;
    return Q(r`Combien vaut $\displaystyle\int_{${a}}^{${b}}(x+${c})\,dx$ ?`,fr((2*c+a+b)*(b-a),2),[String((b+c)*(b-a)),String((a+c)*(b-a)),fr((2*c+a+b)*(b-a),4),String(b+c)],
      r`La zone est un <b>trapèze</b> : petit côté $${a+c}$, grand côté $${b+c}$, largeur $${b-a}$.<br>Aire $=\dfrac{(${a+c}+${b+c})\times${b-a}}{2}=${fr((2*c+a+b)*(b-a),2)}$.<br>Autre façon : un rectangle $${a+c}\times${b-a}$ + un triangle $\dfrac{${b-a}\times${b-a}}{2}$.`,
      'Coupe la zone en un rectangle (en bas) et un triangle (en haut), puis additionne.',
      plot({f:x=>x+c,x0:-.5,x1:b+1,y0:-1,y1:b+c+1.5,a,b,la:String(a),lb:String(b),col:IC}));
  },
  carreaux(){
    const h=[ri(1,4),ri(1,4),ri(1,4)],v=h[0]+h[1]+h[2],f=x=>x<1?h[0]:x<2?h[1]:h[2];
    return Q(r`La fonction $f$ est « en escalier ». Combien vaut $\displaystyle\int_{0}^{3}f(x)\,dx$ ?`,String(v),[String(Math.max(...h)*3),String(h[2]),String(v+1),String(h[0]*h[1]*h[2])],
      r`On additionne les 3 rectangles de largeur 1 : $${h[0]}+${h[1]}+${h[2]}=${v}$ carreaux.`,
      'Compte simplement les carreaux colorés : chacun vaut 1.',
      plot({f,x0:-.5,x1:4,y0:-.8,y1:5,a:0,b:3,la:'0',lb:'3',col:IC,
        over:(X,Y)=>h.map((v,i)=>Array.from({length:v},(_,j)=>`<rect x="${X(i)}" y="${Y(j+1)}" width="${X(1)-X(0)}" height="${Y(0)-Y(1)}" fill="none" stroke="#fff" stroke-width="2"/>`).join('')).join('')}));
  },
  demidisque(){
    const R=pick([1,2,3,4]);
    if(Math.random()<.5){const P=R*R===1?'':R*R;
      return Q(r`Combien vaut $\displaystyle\int_{0}^{${R}}\sqrt{${R*R}-x^2}\,dx$ ?`,P+r`\dfrac{\pi}{4}`,[P+r`\dfrac{\pi}{2}`,P+r`\pi`,String(R*R)],
        r`La courbe est un <b>quart de cercle</b> de rayon $${R}$ : aire $=\dfrac{\pi\times${R}^2}{4}=${P}\dfrac{\pi}{4}$.`,
        'Regarde la forme : un quart de disque. Aire d\'un disque = π × rayon².',
        plot({f:x=>Math.sqrt(Math.max(0,R*R-x*x)),x0:-1,x1:R+1,y0:-.6,y1:R+.8,a:0,b:R,la:'0',lb:String(R),col:IC}));}
    return Q(r`Combien vaut $\displaystyle\int_{-${R}}^{${R}}\sqrt{${R*R}-x^2}\,dx$ ?`,(R===1?'':R*R)+r`\dfrac{\pi}{2}`,[(R===1?'':R*R)+r`\pi`,(R===1?'':2*R)+r`\pi`,String(R*R),String(2*R)],
      r`La courbe de $\sqrt{${R*R}-x^2}$ est un <b>demi-cercle</b> de rayon $${R}$.<br>Aire d'un disque : $\pi r^2=${R*R===1?'':R*R}\pi$, la moitié → $${R*R===1?'':R*R}\dfrac{\pi}{2}$.`,
      'Regarde la forme : c\'est la moitié d\'un disque. Aire d\'un disque = π × rayon².',
      plot({f:x=>Math.sqrt(Math.max(0,R*R-x*x)),x0:-R-1,x1:R+1,y0:-.6,y1:R+.8,a:-R,b:R,la:String(-R),lb:String(R),col:IC}));
  },
  chasles(){
    const p=ri(2,6),q=ri(2,8),b=ri(1,2),c=b+ri(2,3);
    return Q(r`On sait que $\displaystyle\int_0^{${b}}f(x)\,dx=${p}$ et $\displaystyle\int_{${b}}^{${c}}f(x)\,dx=${q}$. Combien vaut $\displaystyle\int_0^{${c}}f(x)\,dx$ ?`,String(p+q),[String(q-p),String(p*q),String(Math.max(p,q))],
      r`Les deux zones se mettent bout à bout : $${p}+${q}=${p+q}$. C'est la <b>relation de Chasles</b>.`,
      'Regarde le dessin : la grande zone est faite des deux petites.',
      plot({f:x=>1.6+Math.sin(x*1.1)*.7+x*.15,x0:-.5,x1:c+1,y0:-.6,y1:3.6,regions:[{a:0,b,col:'#f97316',txt:String(p)},{a:b,b:c,col:IC,txt:String(q)}]}),{bubbles:true});
  },
  bornes(){
    const a=ri(0,3),b=a+ri(2,4);
    return Q(`Quelle intégrale correspond à la zone colorée ?`,r`$\displaystyle\int_{${a}}^{${b}}f(x)\,dx$`,
      [r`$\displaystyle\int_{${b}}^{${a}}f(x)\,dx$`,r`$\displaystyle\int_{0}^{${b+1}}f(x)\,dx$`,r`$\displaystyle\int_{${a+1}}^{${b}}f(x)\,dx$`],
      r`La zone commence à $x=${a}$ (borne du bas) et s'arrête à $x=${b}$ (borne du haut).`,
      'La borne du bas est l\'endroit où la zone commence, celle du haut où elle s\'arrête.',
      plot({f:x=>2+Math.sin(x*1.3)*.8+x*.2,x0:-.5,x1:b+1.5,y0:-.6,y1:4.5,a,b,la:String(a),lb:String(b),col:IC}),{bubbles:false});
  },
  signe(){
    const t=pick(['pos','neg','nul']),A=.3+Math.random()*.6,w=.6+Math.random();
    const F={pos:x=>1.1+Math.sin(x*w)*A,neg:x=>-1.1-Math.sin(x*w)*A,nul:x=>x*A*1.4}[t];
    const a=t==='nul'?-2:ri(0,1),b=t==='nul'?2:a+2;
    return Q(r`Quel est le signe de $\displaystyle\int_{${a}}^{${b}}f(x)\,dx$ ?`,{pos:'<span>➕ Positive</span>',neg:'<span>➖ Négative</span>',nul:'<span>0️⃣ Nulle</span>'}[t],
      ['<span>➕ Positive</span>','<span>➖ Négative</span>','<span>0️⃣ Nulle</span>'].filter(x=>!x.includes({pos:'Pos',neg:'Nég',nul:'Nul'}[t])),
      {pos:'Toute la zone est <b>au-dessus</b> de l\'axe : l\'intégrale est positive.',
       neg:'Toute la zone est <b>sous</b> l\'axe : elle compte en négatif.',
       nul:'La partie sous l\'axe (négative) compense exactement celle au-dessus : total <b>0</b>.'}[t],
      'Au-dessus de l\'axe : ça compte en plus. En dessous : en moins.',
      t==='nul'?plot({f:F,x0:-2.6,x1:2.6,y0:-2.6,y1:2.6,regions:[{a:-2,b:0,col:'#e11d48'},{a:0,b:2,col:IC}]})
               :plot({f:F,x0:-.5,x1:b+.6,y0:t==='pos'?-.6:-2.2,y1:t==='pos'?2.2:.6,a,b,la:String(a),lb:String(b),neg:t==='neg',col:IC}));
  },

  /* ---------- Leçon 2 : primitives ---------- */
  prim(){
    const n=pick([1,2,3]),k=ri(1,4),a=k*(n+1);
    return Q(r`Une primitive de $f(x)=${mono(a,n)}$ ?`,mono(k,n+1),[mono(a,n+1),mono(a*n,n-1),mono(k,n),mono(a*(n+1),n+1)],
      r`① On ajoute 1 à l'exposant : $x^{${n}}\to x^{${n+1}}$.<br>② On divise par ce nouvel exposant : $${a}\div${n+1}=${k}$.<br>→ $F(x)=${mono(k,n+1)}$. Vérif : $F'(x)=${mono(a,n)}$ ✓`,
      'Fais l\'inverse de la dérivée : ajoute 1 à l\'exposant, puis divise par ce nouvel exposant.',chainFig('',mono(a,n),'F'));
  },
  primsum(){
    const k=ri(1,4),a=2*k,c=ri(1,6);
    return Q(r`Une primitive de $f(x)=${a}x+${c}$ ?`,`${mono(k,2)}+${mono(c,1)}`,[`${mono(a,2)}+${mono(c,1)}`,`${mono(k,2)}+${c}`,String(a),`${mono(a,2)}+${c}`],
      r`On traite chaque morceau :<br>• $${a}x$ → $${a}\times\dfrac{x^2}{2}=${mono(k,2)}$<br>• $${c}$ → $${mono(c,1)}$<br>→ $F(x)=${mono(k,2)}+${mono(c,1)}$.`,
      'Morceau par morceau. Un nombre seul k devient k·x.',chainFig('',`${a}x+${c}`,'F'));
  },
  primpoly(){
    const p=ri(1,3),q=ri(1,4),c=ri(1,5),A=3*p,B=2*q;
    const good=`${mono(p,3)}+${mono(q,2)}+${mono(c,1)}`;
    return Q(r`Une primitive de $f(x)=${A}x^2+${B}x+${c}$ ?`,good,[`${mono(A,3)}+${mono(B,2)}+${mono(c,1)}`,`${mono(p,3)}+${mono(q,2)}+${c}`,`${mono(2*A,1)}+${B}`,`${mono(p,3)}+${mono(B,2)}+${mono(c,1)}`],
      r`Morceau par morceau :<br>• $${A}x^2\to ${A}\times\dfrac{x^3}{3}=${mono(p,3)}$<br>• $${B}x\to ${B}\times\dfrac{x^2}{2}=${mono(q,2)}$<br>• $${c}\to ${mono(c,1)}$`,
      'Applique la règle d\'or à chaque morceau séparément.',chainFig('',`${A}x^2+${B}x+${c}`,'F'));
  },
  primref(){
    const t=pick([
      [r`e^x`,r`e^x`,[r`xe^x`,r`e^{x+1}`,r`\dfrac{e^{x+1}}{x+1}`],r`$e^x$ est sa propre dérivée, donc c'est aussi sa propre primitive.`],
      [r`\dfrac1x`,r`\ln x`,[r`-\dfrac{1}{x^2}`,r`x`,r`\dfrac{1}{x^2}`],r`La dérivée de $\ln x$ est $\dfrac1x$ (pour $x>0$).`],
      [r`\cos x`,r`\sin x`,[r`-\sin x`,r`\cos x`,r`-\cos x`],r`La dérivée de $\sin x$ est $\cos x$.`],
      [r`\sin x`,r`-\cos x`,[r`\cos x`,r`-\sin x`,r`\sin x`],r`La dérivée de $-\cos x$ est $\sin x$.`],
      [String(ri(2,9)),null,null,null],
    ]);
    if(!t[1]){const k=+t[0];t[1]=mono(k,1);t[2]=['0',String(k),r`\dfrac{${k}}{x}`];t[3]=r`La dérivée de $${k}x$ est $${k}$.`;}
    return Q(r`Une primitive de $f(x)=${t[0]}$ ?`,t[1],t[2],t[3],'Cherche la fonction dont la dérivée donne f.',chainFig('',t[0],'F'));
  },
  primexp(){
    const k=ri(2,9);
    return Q(r`Une primitive de $f(x)=e^{${k}x}$ ?`,r`\dfrac{e^{${k}x}}{${k}}`,[r`${k}e^{${k}x}`,r`e^{${k}x}`,r`\dfrac{e^{${k+1}x}}{${k+1}}`],
      r`La dérivée de $e^{${k}x}$ est $${k}e^{${k}x}$ (on « sort » le ${k}).<br>Pour remonter, on divise par $${k}$ : $F(x)=\dfrac{e^{${k}x}}{${k}}$.`,
      `Dérive e^{${k}x} : il apparaît un ${k} devant. Il faut donc le compenser.`,chainFig('',`e^{${k}x}`,'F'));
  },
  deriveF(){
    const p=ri(1,4),q=ri(1,6),F=`${mono(p,3)}+${mono(q,1)}`;
    return Q(r`$F(x)=${F}$ est une primitive de quelle fonction ?`,`${mono(3*p,2)}+${q}`,[`${mono(p,2)}+${q}`,`${mono(3*p,2)}+${mono(q,1)}`,`\\dfrac{${p===1?'':p}x^4}{4}+\\dfrac{${q}x^2}{2}`],
      r`$F$ est une primitive de $f$ veut dire $F'=f$. On dérive : $(${mono(p,3)})'=${mono(3*p,2)}$ et $(${mono(q,1)})'=${q}$.`,
      'Il suffit de dériver F.',chainFig(F,'','f'));
  },
  cond(){
    const k=ri(1,3),c=pick([-2,-1,1,2,3]);
    const fam=[-2,-1,0,1,2,3].map(s=>x=>k*x*x+s);
    return Q(r`Quelle primitive de $f(x)=${mono(2*k,1)}$ vérifie $F(0)=${c}$ ?`,`${mono(k,2)}${c<0?c:'+'+c}`,[`${mono(k,2)}`,`${mono(2*k,2)}${c<0?c:'+'+c}`,`${mono(k,2)}${-c<0?-c:'+'+(-c)}`],
      r`Toutes les primitives de $${mono(2*k,1)}$ sont $${mono(k,2)}+C$ (les courbes grises, décalées en hauteur).<br>$F(0)=C=${c}$ → la courbe colorée passe par $(0\,;${c})$.`,
      'Les primitives ne diffèrent que d\'une constante C. F(0) = C.',
      plot({f:x=>k*x*x+c,x0:-2.5,x1:2.5,y0:-3,y1:6,fam,over:(X,Y)=>`<circle cx="${X(0)}" cy="${Y(c)}" r="7" fill="#f97316" stroke="#fff" stroke-width="3"/>`}),{bubbles:false});
  },
  pente(){
    const h=ri(1,4),up=Math.random()<.5,F=x=>up?-(x-h)*(x-h)/1.5+3:(x-h)*(x-h)/1.5+1;
    const yv=up?3:1;
    return Q(r`Voici la courbe d'une fonction $F$, et $f=F'$. Combien vaut $f(${h})$ ?`,'0',[String(yv),String(h),String(yv===3?1:3)],
      r`$f(${h})=F'(${h})$ est la <b>pente</b> de $F$ en $x=${h}$. Là, la tangente est horizontale : pente $0$.`,
      'f(x) est la pente de la courbe de F au point x. Regarde la tangente.',
      plot({f:F,x0:-.5,x1:h+3,y0:-1,y1:4.2,over:(X,Y)=>`<line x1="${X(h-1.4)}" y1="${Y(yv)}" x2="${X(h+1.4)}" y2="${Y(yv)}" stroke="#f97316" stroke-width="3.5"/><circle cx="${X(h)}" cy="${Y(yv)}" r="6" fill="#f97316"/>`}));
  },

  /* ---------- Leçon 3 : calcul ---------- */
  calc(){
    const n=pick([1,2]),a=pick([0,1]),b=pick([2,3]),v=b**(n+1)-a**(n+1);
    return Q(r`Calcule $\displaystyle\int_{${a}}^{${b}}${mono(n+1,n)}\,dx$`,String(v),[String(b**(n+1)+a**(n+1)),String((n+1)*(b**n-a**n)),String(b**(n+1)),String(v+n+1)],
      r`① Primitive : $F(x)=x^{${n+1}}$.<br>② $F(${b})=${b**(n+1)}$ et $F(${a})=${a**(n+1)}$.<br>③ $${b**(n+1)}-${a**(n+1)}=${v}$.`,
      'Trouve une primitive F, puis calcule F(borne du haut) − F(borne du bas).',
      plot({f:x=>(n+1)*x**n,x0:-.5,x1:b+.8,y0:-1,y1:(n+1)*b**n+1.5,ystep:n===2?5:1,a,b,la:String(a),lb:String(b),col:IC}));
  },
  calcaff(){
    const c=ri(1,4),a=ri(0,2),b=a+ri(1,3),F=x=>x*x+c*x,v=F(b)-F(a);
    return Q(r`Calcule $\displaystyle\int_{${a}}^{${b}}(2x+${c})\,dx$`,String(v),[String(F(b)+F(a)),String(F(b)),String(2*(b-a)),String(v+c)],
      r`① Primitive : $F(x)=x^2+${mono(c,1)}$.<br>② $F(${b})=${F(b)}$ et $F(${a})=${F(a)}$.<br>③ $${F(b)}-${F(a)}=${v}$.`,
      'Primitive de 2x : x². Primitive d\'un nombre c : c·x. Puis F(haut) − F(bas).',
      plot({f:x=>2*x+c,x0:-.5,x1:b+.8,y0:-1,y1:2*b+c+1.5,ystep:2,a,b,la:String(a),lb:String(b),col:IC}));
  },
  calcx2(){
    const a=pick([0,0,1,2]),b=a+ri(1,3);
    return Q(r`Calcule $\displaystyle\int_{${a}}^{${b}}x^2\,dx$`,fr(b**3-a**3,3),[String(b**3-a**3),fr(b*b-a*a,2),String(b*b-a*a),fr(b**3+a**3,3)],
      r`① Primitive : $\dfrac{x^3}{3}$.<br>② En $${b}$ : $\dfrac{${b**3}}{3}$ ; en $${a}$ : $\dfrac{${a**3}}{3}$.<br>③ Résultat : $${fr(b**3-a**3,3)}$.`,
      'Primitive de x² : x³/3.',
      plot({f:x=>x*x,x0:-.5,x1:b+.8,y0:-1,y1:b*b+1.5,ystep:b>3?4:b>2?2:1,a,b,la:String(a),lb:String(b),col:IC}));
  },
  calcexp(){
    const [a,b]=pick([[0,1],[0,2],[0,3],[1,2],[1,3]]),k=ri(1,3),K=k===1?'':k;
    const E=x=>x===0?'1':x===1?'e':`e^{${x}}`,good=a===0?`${K}${k>1?'(':''}${E(b)}-1${k>1?')':''}`:`${K}${k>1?'(':''}${E(b)}-${E(a)}${k>1?')':''}`;
    return Q(r`Calcule $\displaystyle\int_{${a}}^{${b}}${K}e^x\,dx$`,good,[`${K}${E(b)}`,`${K}${k>1?'(':''}${E(b)}+${E(a)}${k>1?')':''}`,`${K}${k>1?'(':''}${E(b)}-${b-a}${k>1?')':''}`,`${E(b)}-${E(a)}`],
      r`① Primitive de $${K}e^x$ : $${K}e^x$.<br>② $F(${b})-F(${a})=${K}e^{${b}}-${K}e^{${a}}$${a===0?' (et $e^0=1$)':''}.<br>≈ $${dec(k*(Math.exp(b)-Math.exp(a)))}$`,
      'La primitive de e^x est e^x. Et n\'oublie pas : e⁰ = 1.',
      plot({f:x=>k*Math.exp(x),x0:-.5,x1:b+.6,y0:-1,y1:k*Math.exp(b)*1.08+1,ystep:Math.ceil(k*Math.exp(b)/5),ticks:true,a,b,la:String(a),lb:String(b),col:IC}),{bubbles:false});
  },
  calcln(){
    const k=pick([1,2]),c=ri(1,4),E=k===1?'e':`e^{${k}}`,Ev=Math.exp(k),C=c===1?'':c;
    return Q(r`Calcule $\displaystyle\int_{1}^{${E}}\dfrac{${c}}{x}\,dx$`,String(c*k),[`${C}${E}`,'0',String(c*k+1),String(k)],
      r`① Primitive de $\dfrac{${c}}{x}$ : $${C}\ln x$.<br>② $${C}\ln(${E})-${C}\ln 1=${C}${c>1?'\\times ':''}${k}-0=${c*k}$.`,
      'Primitive de 1/x : ln x. Et ln 1 = 0, ln(eᵏ) = k.',
      plot({f:x=>c/x,x0:-.3,x1:Ev+.8,y0:-.4,y1:c*1.8,ystep:c>2?2:1,xstep:k>2?4:k>1?2:1,a:1,b:Ev,la:'1',lb:k===1?'e':k===2?'e²':'e³',col:IC}));
  },
  neg(){
    const k=ri(1,3),a=ri(0,2),b=a+ri(2,3),v=-k*(b-a);
    return Q(r`Combien vaut $\displaystyle\int_{${a}}^{${b}}(-${k})\,dx$ ?`,String(v),[String(-v),'0',String(-k)],
      r`La zone est sous l'axe : son aire ($${k}\times${b-a}=${-v}$) compte <b>en négatif</b>. L'intégrale vaut $${v}$.`,
      'Quand la courbe passe sous l\'axe horizontal, l\'aire compte en négatif.',
      plot({f:()=>-k,x0:-.5,x1:b+1,y0:-k-1.2,y1:1.2,a,b,la:String(a),lb:String(b),neg:true}));
  },
  moyenne(){
    const m=pick([1,2,3]),b=pick([2,4,6]),mu=m*b/2;
    return Q(r`Valeur moyenne de $f(x)=${mono(m,1)}$ sur $[0\,;${b}]$ ?`,String(mu),[String(m*b),String(m*b*b/2),String(mu+1)],
      r`Valeur moyenne $=\dfrac{1}{b-a}\displaystyle\int_a^b f(x)\,dx=\dfrac{1}{${b}}\times${m*b*b/2}=${mu}$.<br>C'est la hauteur du <b>rectangle orange</b> qui a la même aire que la zone bleue.`,
      'On calcule l\'intégrale, puis on divise par la largeur de l\'intervalle.',
      plot({f:x=>m*x,x0:-.5,x1:b+1,y0:-1,y1:m*b+1.2,ystep:m*b>9?4:m*b>4?2:1,a:0,b,la:'0',lb:String(b),col:IC,
        over:(X,Y)=>`<rect x="${X(0)}" y="${Y(mu)}" width="${X(b)-X(0)}" height="${Y(0)-Y(mu)}" fill="none" stroke="#f97316" stroke-width="3" stroke-dasharray="7 5"/><text x="${X(b)+6}" y="${Y(mu)+5}" class="ax big" text-anchor="start" fill="#f97316">${mu}</text>`}));
  },
  entre(){
    const k=pick([1,2,3,4]);
    return Q(r`Aire entre $y=${mono(k,1)}$ et $y=x^2$ pour $x$ entre $0$ et $${k}$ ?`,fr(k**3,6),[fr(k**3,2),fr(k**3,3),fr(k**3,12),String(k**3)],
      r`Aire entre deux courbes $=\displaystyle\int_0^{${k}}(\text{haut}-\text{bas})\,dx=\int_0^{${k}}(${mono(k,1)}-x^2)\,dx$<br>$=\left[\dfrac{${k===1?'':k}x^2}{2}-\dfrac{x^3}{3}\right]_0^{${k}}=${fr(k**3,2)}-${fr(k**3,3)}=${fr(k**3,6)}$`,
      'On intègre (courbe du haut − courbe du bas).',
      plot({f:x=>k*x,g:x=>x*x,x0:-.4,x1:k+.6,y0:-.5,y1:k*k+.8,ystep:k>3?4:k>2?2:1,a:0,b:k,la:'0',lb:String(k),col:IC}),{bubbles:false});
  },
};

/* ================= INTÉGRALES — EXEMPLES GUIDÉS ================= */
const EI={
  aire(){const t=pick(['rect','tri','trap']);
    if(t==='rect'){const k=ri(2,4),a=ri(0,1),b=a+ri(2,3);
      return {title:r`Calculer $\displaystyle\int_{${a}}^{${b}}${k}\,dx$ avec un dessin`,fig:plot({f:()=>k,x0:-.5,x1:b+1,y0:-.8,y1:k+1.5,a,b,la:String(a),lb:String(b),col:IC}),
        lines:[r`La fonction vaut toujours $${k}$ : c'est une droite horizontale.`,r`La zone est un <b>rectangle</b>.`,r`Largeur : $${b}-${a}=${b-a}$ ; hauteur : $${k}$.`,r`Aire $=${b-a}\times${k}=${k*(b-a)}$, donc $\displaystyle\int_{${a}}^{${b}}${k}\,dx=${k*(b-a)}$ ✅`]};}
    if(t==='tri'){const b=ri(2,5);
      return {title:r`Calculer $\displaystyle\int_0^{${b}}x\,dx$ avec un dessin`,fig:plot({f:x=>x,x0:-.5,x1:b+1,y0:-.8,y1:b+1.2,a:0,b,la:'0',lb:String(b),col:IC}),
        lines:[r`La courbe est la droite $y=x$ : elle part de $0$.`,r`La zone est un <b>triangle</b>.`,r`Base : $${b}$ ; hauteur : $f(${b})=${b}$.`,r`Aire $=\dfrac{${b}\times${b}}{2}=${fr(b*b,2)}$ ✅`]};}
    const c=ri(1,2),b=ri(2,3);
    return {title:r`Calculer $\displaystyle\int_0^{${b}}(x+${c})\,dx$ avec un dessin`,fig:plot({f:x=>x+c,x0:-.5,x1:b+1,y0:-.8,y1:b+c+1.2,a:0,b,la:'0',lb:String(b),col:IC}),
      lines:[r`La zone est un <b>trapèze</b> : on la coupe en deux.`,r`En bas, un rectangle : $${b}\times${c}=${b*c}$`,r`En haut, un triangle : $\dfrac{${b}\times${b}}{2}=${fr(b*b,2)}$`,r`Total : $${b*c}+${fr(b*b,2)}=${fr(2*b*c+b*b,2)}$ ✅`]};
  },
  prim(){const p=ri(1,3),q=ri(1,4),c=ri(1,6),A=3*p,B=2*q;
    return {title:r`Trouver une primitive de $f(x)=${A}x^2+${B}x+${c}$`,fig:chainFig('',`${A}x^2+${B}x+${c}`,'F'),
      lines:[r`On traite <b>chaque morceau</b> séparément.`,r`$${A}x^2$ : l'exposant passe de 2 à 3, on divise par 3 → $${mono(p,3)}$`,
        r`$${B}x$ : l'exposant passe de 1 à 2, on divise par 2 → $${mono(q,2)}$`,r`$${c}$ : un nombre seul devient $${mono(c,1)}$`,
        r`Résultat : $F(x)=${mono(p,3)}+${mono(q,2)}+${mono(c,1)}$`,r`✅ Vérification : $F'(x)=${A}x^2+${B}x+${c}$`]};
  },
  cond(){const k=ri(1,2),c=ri(1,3);
    return {title:r`Trouver la primitive de $f(x)=${mono(2*k,1)}$ telle que $F(0)=${c}$`,
      fig:plot({f:x=>k*x*x+c,x0:-2.5,x1:2.5,y0:-3,y1:6,fam:[-2,-1,0,1,2,3].map(s=>x=>k*x*x+s),over:(X,Y)=>`<circle cx="${X(0)}" cy="${Y(c)}" r="7" fill="#f97316" stroke="#fff" stroke-width="3"/>`}),
      lines:[r`Les primitives de $${mono(2*k,1)}$ sont toutes de la forme $${mono(k,2)}+C$.`,r`Sur le dessin : la même courbe, décalée vers le haut ou le bas.`,
        r`On veut $F(0)=${c}$ : $${k===1?'':k}\times0^2+C=${c}$, donc $C=${c}$.`,r`Réponse : $F(x)=${mono(k,2)}+${c}$ ✅`]};
  },
  calc(){const t=pick(['aff','poly']);
    if(t==='aff'){const c=ri(1,3),a=ri(0,1),b=a+ri(2,3),F=x=>x*x+c*x;
      return {title:r`Calculer $\displaystyle\int_{${a}}^{${b}}(2x+${c})\,dx$`,fig:plot({f:x=>2*x+c,x0:-.5,x1:b+.8,y0:-1,y1:2*b+c+1.5,ystep:2,a,b,la:String(a),lb:String(b),col:IC}),
        lines:[r`① Une primitive : $F(x)=x^2+${mono(c,1)}$`,r`② $F(${b})=${b*b}+${c*b}=${F(b)}$`,r`② $F(${a})=${a*a}+${c*a}=${F(a)}$`,r`③ $\displaystyle\int_{${a}}^{${b}}(2x+${c})\,dx=${F(b)}-${F(a)}=${F(b)-F(a)}$ ✅`]};}
    const b=ri(1,2);
    return {title:r`Calculer $\displaystyle\int_0^{${b}}(3x^2+1)\,dx$`,fig:plot({f:x=>3*x*x+1,x0:-.5,x1:b+.7,y0:-1,y1:3*b*b+2.5,ystep:b>1?2:1,a:0,b,la:'0',lb:String(b),col:IC}),
      lines:[r`① Une primitive : $F(x)=x^3+x$`,r`② $F(${b})=${b**3}+${b}=${b**3+b}$ et $F(0)=0$`,r`③ Résultat : $${b**3+b}-0=${b**3+b}$ ✅`]};
  },
  entre(){const k=pick([1,2,3]),K=k===1?'':k;
    return {title:r`Aire entre $y=${mono(k,1)}$ et $y=x^2$ sur $[0\,;${k}]$`,fig:plot({f:x=>k*x,g:x=>x*x,x0:-.3,x1:k+.5,y0:-.3,y1:k*k+.6,ystep:k>2?2:1,a:0,b:k,la:'0',lb:String(k),col:IC}),
      lines:[r`Entre $0$ et $${k}$, la droite $y=${mono(k,1)}$ est <b>au-dessus</b> de $y=x^2$.`,r`Aire $=\displaystyle\int_0^{${k}}(${mono(k,1)}-x^2)\,dx$ (haut − bas)`,
        r`Primitive : $\dfrac{${K}x^2}{2}-\dfrac{x^3}{3}$`,r`$${fr(k**3,2)}-${fr(k**3,3)}=${fr(k**3,6)}$ ✅`]};
  },
};

const ANAT=r`$$\color{#7c3aed}{\int}_{\color{#f97316}{a}}^{\color{#f97316}{b}}\ \color{#0891b2}{f(x)}\ \color{#16a34a}{dx}$$
<div class="legend">
<div><b style="color:#7c3aed">∫</b> un S allongé : « somme »</div>
<div><b style="color:#f97316">a, b</b> les bornes : où la zone commence et s'arrête</div>
<div><b style="color:#0891b2">f(x)</b> la hauteur de la courbe</div>
<div><b style="color:#16a34a">dx</b> une largeur minuscule</div></div>`;

