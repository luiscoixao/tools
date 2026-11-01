/* =====================================================================
   MANIPULATIONS INTERACTIVES GÉNÉRIQUES + DESSINS
   ===================================================================== */
/* question avec indices en 2 crans (le 3e cran = la solution) */
function QQ(q,good,bad,why,hints,img,extra){const o=Q(q,good,bad,why,'',img,extra);o.hint=null;o.hints=hints;return o;}
const fmt=v=>String(+(+v).toFixed(3)).replace('.',',').replace('-','−');

/* curseurs + dessin + objectif */
function mSlider(cfg){
  return function(box,done){
    box.innerHTML=`<div class="mfig"></div><div class="eq mread"></div>${cfg.sliders.map(s=>`<label class="sld" style="--k:${s.col||'var(--c)'}"><span>${s.label}</span><input type="range" min="${s.min}" max="${s.max}" step="${s.step||1}" value="${s.val}" data-id="${s.id}"><b></b></label>`).join('')}<div class="hint mtask">${cfg.task||''}</div>`;
    let moves=0,won=false;
    const ins=[...box.querySelectorAll('input')];
    function vals(){const v={};ins.forEach(i=>v[i.dataset.id]=+i.value);return v;}
    function draw(){
      const v=vals();ins.forEach(i=>i.nextElementSibling.textContent=(cfg.show?cfg.show(i.dataset.id,+i.value):fmt(i.value)));
      box.querySelector('.mfig').innerHTML=cfg.draw(v);
      const rd=box.querySelector('.mread');rd.innerHTML=cfg.read?cfg.read(v):'';math(rd);math(box.querySelector('.mfig'));
      if(!won&&moves>0&&cfg.goal&&cfg.goal(v)){won=true;box.querySelector('.mtask').innerHTML='🎉 '+(cfg.got||'Trouvé !');done(typeof cfg.win==='function'?cfg.win(v):cfg.win);}
      else if(!won&&cfg.help&&moves>=(cfg.helpAt||10)) box.querySelector('.mtask').innerHTML='💡 '+cfg.help;
    }
    ins.forEach(i=>i.addEventListener('input',()=>{moves++;draw();}));
    draw();math(box.querySelector('.mtask'));
  };
}
/* boutons à toucher (exploration libre) : on gagne après avoir tout essayé */
function mTaps(cfg){
  return function(box,done){
    const seen=new Set();
    box.innerHTML=`<div class="mfig"></div><div class="eq mread"></div><div class="tapz">${cfg.taps.map((t,i)=>`<button class="bigbtn tap" data-i="${i}">${t}</button>`).join('')}</div><div class="hint mtask">${cfg.task||''}</div>`;
    const show=i=>{box.querySelector('.mfig').innerHTML=cfg.draw(i);const rd=box.querySelector('.mread');rd.innerHTML=cfg.read(i);math(rd);math(box.querySelector('.mfig'));};
    box.querySelectorAll('.tap').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;seen.add(i);b.classList.add('seen');show(i);
      if(seen.size>=(cfg.need||cfg.taps.length)){box.querySelector('.mtask').innerHTML='🎉 '+(cfg.got||'Bien observé !');done(cfg.win);}});
    show(cfg.start||0);math(box);
  };
}

/* ---------- dessins ---------- */
const INK='#1f1b3a';
function svgBox(body,w=300,h=210){return `<svg viewBox="0 0 ${w} ${h}" class="fig">${body}</svg>`;}
/* cercle trigonométrique */
function circleFig(deg,o={}){
  const t=deg*Math.PI/180,R=88,cx=150,cy=112,x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);
  const C=Math.cos(t),Sn=Math.sin(t);
  let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fdf2f8" stroke="#f9a8d4" stroke-width="3"/>
   <line x1="${cx-R-14}" y1="${cy}" x2="${cx+R+14}" y2="${cy}" stroke="${INK}" stroke-width="2"/><line x1="${cx}" y1="${cy+R+14}" x2="${cx}" y2="${cy-R-14}" stroke="${INK}" stroke-width="2"/>
   <text x="${cx+R+4}" y="${cy+16}" class="ax">1</text><text x="${cx-R-8}" y="${cy+16}" class="ax">−1</text><text x="${cx-10}" y="${cy-R-2}" class="ax">1</text>`;
  if(o.tri!==false){
    s+=`<path d="M${cx} ${cy} L${x} ${cy} L${x} ${y} Z" fill="#db2777" fill-opacity=".12"/>`;
    s+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${cy}" stroke="#2563eb" stroke-width="5" stroke-linecap="round"/>`;
    s+=`<line x1="${x}" y1="${cy}" x2="${x}" y2="${y}" stroke="#f97316" stroke-width="5" stroke-linecap="round"/>`;
  }
  const arcL=Math.min(28,R);s+=`<path d="M${cx+arcL} ${cy} A${arcL} ${arcL} 0 ${deg%360>180?1:0} 0 ${cx+arcL*Math.cos(t)} ${cy-arcL*Math.sin(t)}" fill="none" stroke="#db2777" stroke-width="3"/>`;
  s+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${INK}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="8" fill="#db2777" stroke="#fff" stroke-width="3"/>`;
  if(o.vals!==false&&o.tri!==false){
    s+=`<text x="${(cx+x)/2}" y="${cy+(Sn>=0?20:-8)}" class="ax big" fill="#2563eb">cos</text>`;
    s+=`<text x="${x+(C>=0?24:-24)}" y="${(cy+y)/2+5}" class="ax big" fill="#f97316">sin</text>`;
  }
  return svgBox(s,300,224);
}
/* droite graduée avec un point */
function lineFig(min,max,marks,step=1){
  const X=v=>20+(v-min)/(max-min)*260;let s=`<line x1="14" y1="40" x2="290" y2="40" stroke="${INK}" stroke-width="3"/>`;
  for(let v=min;v<=max+1e-9;v+=step)s+=`<line x1="${X(v)}" y1="34" x2="${X(v)}" y2="46" stroke="${INK}" stroke-width="2"/><text x="${X(v)}" y="64" class="ax">${fmt(v)}</text>`;
  marks.forEach(([v,l,c])=>s+=`<circle cx="${X(v)}" cy="40" r="8" fill="${c||'#db2777'}"/><text x="${X(v)}" y="22" class="ax big" fill="${c||'#db2777'}">${l}</text>`);
  return svgBox(s,300,74);
}
/* barres « avant / après » */
function evoFig(v0,v1,l1){
  const mx=Math.max(v0,v1),h0=120*v0/mx,h1=120*v1/mx,c1=v1>=v0?'#16a34a':'#e11d48';
  return svgBox(`<rect x="60" y="${160-h0}" width="70" height="${h0}" rx="8" fill="#94a3b8"/><rect x="170" y="${160-h1}" width="70" height="${h1}" rx="8" fill="${c1}"/>
   <text x="95" y="${150-h0}" class="ax big">${fmt(v0)}</text><text x="205" y="${150-h1}" class="ax big" fill="${c1}">${typeof v1==='number'&&!l1?fmt(v1):'?'}</text>
   <text x="95" y="182" class="ax">avant</text><text x="205" y="182" class="ax">${l1||'après'}</text><line x1="40" y1="160" x2="260" y2="160" stroke="${INK}" stroke-width="3"/>`,300,195);
}
/* carré découpé pour (a+b)² */
function idFig(a,b){
  const u=Math.min(26,190/(a+b)),A=a*u,B=b*u,o=12;
  return svgBox(`<rect x="${o}" y="${o}" width="${A}" height="${A}" fill="#fb923c"/><rect x="${o+A}" y="${o}" width="${B}" height="${A}" fill="#facc15"/>
   <rect x="${o}" y="${o+A}" width="${A}" height="${B}" fill="#facc15"/><rect x="${o+A}" y="${o+A}" width="${B}" height="${B}" fill="#38bdf8"/>
   <rect x="${o}" y="${o}" width="${A+B}" height="${A+B}" fill="none" stroke="${INK}" stroke-width="3"/>
   <text x="${o+A/2}" y="${o+A/2+7}" class="ax big" fill="#fff">a²</text><text x="${o+A+B/2}" y="${o+A/2+7}" class="ax big">ab</text>
   <text x="${o+A/2}" y="${o+A+B/2+7}" class="ax big">ab</text><text x="${o+A+B/2}" y="${o+A+B/2+7}" class="ax big" fill="#fff">b²</text>
   <text x="${o+A/2}" y="${o+A+B+18}" class="ax" fill="#ea580c">a = ${a}</text><text x="${o+A+B/2}" y="${o+A+B+18}" class="ax" fill="#0284c7">b = ${b}</text>`,Math.max(240,A+B+40),A+B+40);
}
/* balance pour les équations */
function balanceFig(L,R,lt,rt){
  const d=Math.max(-1,Math.min(1,(R-L)/Math.max(6,Math.abs(L)+Math.abs(R)))),ang=d*14;
  return svgBox(`<polygon points="150,180 130,210 170,210" fill="${INK}"/><line x1="150" y1="60" x2="150" y2="182" stroke="${INK}" stroke-width="5"/>
   <g transform="rotate(${ang} 150 60)"><line x1="40" y1="60" x2="260" y2="60" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
   <path d="M40 60 L20 110 L90 110 Z" fill="none" stroke="#94a3b8" stroke-width="2"/><path d="M260 60 L210 110 L280 110 Z" fill="none" stroke="#94a3b8" stroke-width="2"/>
   <rect x="14" y="104" width="82" height="34" rx="10" fill="#f97316"/><text x="55" y="127" class="ax big" fill="#fff">${lt}</text>
   <rect x="204" y="104" width="82" height="34" rx="10" fill="#0284c7"/><text x="245" y="127" class="ax big" fill="#fff">${rt}</text></g>`,300,215);
}
/* blocs pour les puissances */
function blocksFig(base,n,col){
  let s='',k=Math.min(base**n,64),cols=Math.min(16,Math.ceil(Math.sqrt(k*2)));
  for(let i=0;i<k;i++)s+=`<rect x="${10+(i%cols)*17}" y="${10+Math.floor(i/cols)*17}" width="14" height="14" rx="3" fill="${col||'#ef4444'}"/>`;
  const rows=Math.ceil(k/cols);
  return svgBox(s+(base**n>64?`<text x="150" y="${rows*17+30}" class="ax big">… ${base**n} blocs en tout</text>`:''),Math.max(120,cols*17+20),rows*17+(base**n>64?44:24));
}
/* carré d'aire n (racine = côté) */
function sqFig(n){const sd=Math.sqrt(n),u=Math.min(18,160/Math.max(sd,1)),L=sd*u;let s='';
  for(let i=0;i<Math.floor(sd);i++)for(let j=0;j<Math.floor(sd);j++)s+=`<rect x="${20+i*u}" y="${20+j*u}" width="${u}" height="${u}" fill="#fde68a" stroke="#fff"/>`;
  return svgBox(`${s}<rect x="20" y="20" width="${L}" height="${L}" fill="#facc15" fill-opacity=".35" stroke="${INK}" stroke-width="3"/><text x="${20+L/2}" y="${20+L/2+6}" class="ax big">aire ${fmt(n)}</text><text x="${20+L/2}" y="${L+42}" class="ax big" fill="#ca8a04">côté = ${fmt(Math.round(sd*1000)/1000)}</text>`,Math.max(220,L+40),L+54);}
/* diagramme de Venn */
function vennFig(A,B,hl){
  const inter=A.filter(x=>B.includes(x)),onlyA=A.filter(x=>!B.includes(x)),onlyB=B.filter(x=>!A.includes(x));
  const f=(c)=>hl==='inter'?(c==='i'?.55:.08):hl==='union'?.4:hl==='A'?(c==='b'?.06:.4):.25;
  return svgBox(`<circle cx="115" cy="100" r="78" fill="#6366f1" fill-opacity="${f('a')}" stroke="#4f46e5" stroke-width="3"/>
   <circle cx="185" cy="100" r="78" fill="#ec4899" fill-opacity="${f('b')}" stroke="#db2777" stroke-width="3"/>
   ${hl==='inter'?`<path d="M150 31 A78 78 0 0 1 150 169 A78 78 0 0 1 150 31 Z" fill="#7c3aed" fill-opacity=".5"/>`:''}
   <text x="70" y="24" class="ax big" fill="#4f46e5">A</text><text x="232" y="24" class="ax big" fill="#db2777">B</text>
   <text x="90" y="106" class="ax big">${onlyA.join(' ')}</text><text x="150" y="106" class="ax big">${inter.join(' ')}</text><text x="210" y="106" class="ax big">${onlyB.join(' ')}</text>`,300,190);
}
/* points d'une suite */
function seqFig(vals,col){
  const mx=Math.max(...vals.map(Math.abs),1),n=vals.length;let s=`<line x1="20" y1="170" x2="290" y2="170" stroke="${INK}" stroke-width="2"/>`;
  vals.forEach((v,i)=>{const x=34+i*(250/Math.max(n-1,1)),y=170-150*v/mx;s+=`<line x1="${x}" y1="170" x2="${x}" y2="${y}" stroke="${col}" stroke-width="2" stroke-dasharray="3 3"/><circle cx="${x}" cy="${y}" r="7" fill="${col}"/><text x="${x}" y="188" class="ax">u${String(i).split('').map(d=>'₀₁₂₃₄₅₆₇₈₉'[d]).join('')}</text><text x="${x}" y="${y-12}" class="ax">${fmt(v)}</text>`;});
  return svgBox(s,300,200);
}
/* tracé de vecteurs sur quadrillage */
function vecFig(vs,rng){
  const [x0,x1,y0,y1]=rng||[-1,7,-1,6],W=300,H=230,p=18;
  const X=x=>p+(x-x0)/(x1-x0)*(W-2*p),Y=y=>H-p-(y-y0)/(y1-y0)*(H-2*p);let s='';
  for(let x=x0;x<=x1;x++)s+=`<line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}" stroke="#eeecf5"/>`;
  for(let y=y0;y<=y1;y++)s+=`<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" stroke="#eeecf5"/>`;
  s+=`<line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1)}" y2="${Y(0)}" stroke="${INK}" stroke-width="2"/><line x1="${X(0)}" y1="${Y(y0)}" x2="${X(0)}" y2="${Y(y1)}" stroke="${INK}" stroke-width="2"/>`;
  vs.forEach((v,i)=>{const id='a'+i+Math.random().toString(36).slice(2,6);
    s+=`<defs><marker id="${id}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="${v.c}"/></marker></defs>
     <line x1="${X(v.from[0])}" y1="${Y(v.from[1])}" x2="${X(v.to[0])}" y2="${Y(v.to[1])}" stroke="${v.c}" stroke-width="4" marker-end="url(#${id})" ${v.dash?'stroke-dasharray="6 5"':''}/>
     ${v.l?`<text x="${(X(v.from[0])+X(v.to[0]))/2-10}" y="${(Y(v.from[1])+Y(v.to[1]))/2-8}" class="ax big" fill="${v.c}">${v.l}</text>`:''}`;});
  return svgBox(s,W,H);
}
