/* =====================================================================
   DESSINS DE GÉOMÉTRIE : figure de la question + figure de la correction
   (la correction reprend le dessin avec la réponse tracée dessus)
   ===================================================================== */
const GOOD='#16a34a';
const _n=v=>Math.round(v*10)/10;
function _cap(t,W,y){return t?`<text x="${W/2}" y="${y}" text-anchor="middle" font-size="17" font-weight="800" fill="${INK}">${t}</text>`:'';}

/* triangle dessiné avec ses VRAIS angles. ang=[gauche, droite, haut] en degrés
   o.lab=[...] textes (null = rien), o.col=[...], o.right=index de l'angle droit,
   o.iso=true : marques sur les côtés égaux, o.ext={lab,col} : angle extérieur à droite, o.cap : légende */
function angFig(ang,o={}){
  const D=Math.PI/180,[A,B]=ang,C=180-A-B,k=Math.sin(B*D)/Math.sin(C*D);
  const P=[[0,0],[1,0],[k*Math.cos(A*D),k*Math.sin(A*D)]];
  const ex=o.ext?.55:0,xs=[0,1+ex,P[2][0]],ys=[0,P[2][1]];
  const W=320,H=o.cap?236:210,m=34,bw=Math.max(...xs)-Math.min(...xs),bh=Math.max(...ys);
  const s=Math.min((W-2*m)/bw,(H-(o.cap?30:0)-2*m)/Math.max(bh,.2)),ox=m-Math.min(...xs)*s+((W-2*m)-bw*s)/2,oy=H-(o.cap?30:0)-m;
  const S=p=>[ox+p[0]*s,oy-p[1]*s],Q=P.map(S),col=o.col||[GC.a,GC.b,GC.c];
  let g=`<path d="M${Q[0]} L${Q[1]} L${Q[2]} Z" fill="${GC.soft}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  const unit=(p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy);return [dx/l,dy/l];};
  const wedge=(p,u1,u2,deg,c,lab,big)=>{
    if(o.right===big){const k2=16;return `<path d="M${p[0]+k2*u1[0]} ${p[1]+k2*u1[1]} L${p[0]+k2*(u1[0]+u2[0])} ${p[1]+k2*(u1[1]+u2[1])} L${p[0]+k2*u2[0]} ${p[1]+k2*u2[1]}" fill="none" stroke="${INK}" stroke-width="3"/>`;}
    const r=deg<35?40:30,a=[p[0]+r*u1[0],p[1]+r*u1[1]],b=[p[0]+r*u2[0],p[1]+r*u2[1]],sw=(u1[0]*u2[1]-u1[1]*u2[0])>0?1:0;
    let bis=[u1[0]+u2[0],u1[1]+u2[1]];const l=Math.hypot(...bis)||1;bis=[bis[0]/l,bis[1]/l];const rl=deg<35?66:deg>110?44:54;
    let t=`<path d="M${p} L${a} A${r} ${r} 0 0 ${sw} ${b} Z" fill="${c}" opacity=".8"/>`;
    if(lab!=null)t+=`<text x="${p[0]+rl*bis[0]}" y="${p[1]+rl*bis[1]+7}" text-anchor="middle" font-size="${lab==='?'?26:19}" font-weight="900" fill="${c}" paint-order="stroke" stroke="#fff" stroke-width="4">${lab}</text>`;
    return t;};
  const lab=o.lab||[];
  [[0,1,2],[1,0,2],[2,0,1]].forEach(([i,j,l2])=>{g+=wedge(Q[i],unit(Q[i],Q[j]),unit(Q[i],Q[l2]),[A,B,C][i],col[i],lab[i],i);});
  if(o.iso)[[0,2],[1,2]].forEach(([i,j])=>{const mx=(Q[i][0]+Q[j][0])/2,my=(Q[i][1]+Q[j][1])/2,u=unit(Q[i],Q[j]);g+=`<line x1="${mx-9*u[1]}" y1="${my+9*u[0]}" x2="${mx+9*u[1]}" y2="${my-9*u[0]}" stroke="${INK}" stroke-width="3"/>`;});
  if(o.ext){const E=S([1+ex,0]);g+=`<line x1="${Q[1][0]}" y1="${Q[1][1]}" x2="${E[0]}" y2="${E[1]}" stroke="${INK}" stroke-width="4" stroke-dasharray="9 7" stroke-linecap="round"/>`;
    g+=wedge(Q[1],unit(Q[1],E),unit(Q[1],Q[2]),180-B,o.ext.col||GC.c,o.ext.lab,-1);}
  return `<svg viewBox="0 0 ${W} ${H}" class="fig">${g}${_cap(o.cap,W,H-10)}</svg>`;
}

/* repère quadrillé à l'échelle (les angles droits restent droits)
   éléments : {v:[de,à],c,l,dash} flèche · {p:[x,y],c,l} point · {s:[p,q],c,dash} segment · {ra:[P,u,v]} angle droit */
function gridFig(els,cap){
  const pts=[[0,0]];els.forEach(e=>{if(e.v||e.s)pts.push(...(e.v||e.s));if(e.p)pts.push(e.p);});
  const x0=Math.min(...pts.map(p=>p[0]))-1,x1=Math.max(...pts.map(p=>p[0]))+1,y0=Math.min(...pts.map(p=>p[1]))-1,y1=Math.max(...pts.map(p=>p[1]))+1;
  const W=300,H=cap?262:232,p=16,ch=cap?30:0,s=Math.min((W-2*p)/(x1-x0),(H-ch-2*p)/(y1-y0));
  const ox=(W-(x1-x0)*s)/2,oy=(H-ch+(y1-y0)*s)/2,X=x=>ox+(x-x0)*s,Y=y=>oy-(y-y0)*s;
  let g='';
  if(x1-x0<=24){for(let x=Math.ceil(x0);x<=x1;x++)g+=`<line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}" stroke="#eeecf5"/>`;
    for(let y=Math.ceil(y0);y<=y1;y++)g+=`<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" stroke="#eeecf5"/>`;}
  g+=`<line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1)}" y2="${Y(0)}" stroke="${INK}" stroke-width="2"/><line x1="${X(0)}" y1="${Y(y0)}" x2="${X(0)}" y2="${Y(y1)}" stroke="${INK}" stroke-width="2"/>`;
  g+=`<text x="${X(1)}" y="${Y(0)+16}" class="ax" text-anchor="middle">1</text><text x="${X(0)-8}" y="${Y(1)+5}" class="ax" text-anchor="end">1</text>`;
  const T=(x,y,t,c,sz)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${sz||18}" font-weight="900" fill="${c}" paint-order="stroke" stroke="#fff" stroke-width="4">${t}</text>`;
  els.forEach((e,i)=>{
    if(e.s)g+=`<line x1="${X(e.s[0][0])}" y1="${Y(e.s[0][1])}" x2="${X(e.s[1][0])}" y2="${Y(e.s[1][1])}" stroke="${e.c||INK}" stroke-width="${e.w||3}" ${e.dash?'stroke-dasharray="6 5"':''}/>`+(e.l?T((X(e.s[0][0])+X(e.s[1][0]))/2+(e.lx||0),(Y(e.s[0][1])+Y(e.s[1][1]))/2+(e.ly||0),e.l,e.c||INK,16):'');
    if(e.ra){const [P,u,v]=e.ra,lu=Math.hypot(...u),lv=Math.hypot(...v),k=14/s,a=[P[0]+k*u[0]/lu,P[1]+k*u[1]/lu],b=[a[0]+k*v[0]/lv,a[1]+k*v[1]/lv],c=[P[0]+k*v[0]/lv,P[1]+k*v[1]/lv];
      g+=`<path d="M${X(a[0])} ${Y(a[1])} L${X(b[0])} ${Y(b[1])} L${X(c[0])} ${Y(c[1])}" fill="none" stroke="${INK}" stroke-width="2.5"/>`;}
    if(e.v){const id='g'+i+Math.random().toString(36).slice(2,6),[f,t]=e.v,dx=X(t[0])-X(f[0]),dy=Y(t[1])-Y(f[1]),l=Math.hypot(dx,dy)||1;
      g+=`<defs><marker id="${id}" markerWidth="4.5" markerHeight="4.5" refX="3" refY="2.25" orient="auto"><path d="M0 0 L4.5 2.25 L0 4.5 Z" fill="${e.c}"/></marker></defs><line x1="${X(f[0])}" y1="${Y(f[1])}" x2="${X(t[0])}" y2="${Y(t[1])}" stroke="${e.c}" stroke-width="4" marker-end="url(#${id})" ${e.dash?'stroke-dasharray="7 5"':''}/>`;
      if(e.l)g+=T((X(f[0])+X(t[0]))/2-dy/l*16,(Y(f[1])+Y(t[1]))/2+dx/l*16+6,e.l,e.c,17);}
    if(e.p){g+=`<circle cx="${X(e.p[0])}" cy="${Y(e.p[1])}" r="6" fill="${e.c||INK}"/>`;if(e.l)g+=T(X(e.p[0]),Y(e.p[1])-12,e.l,e.c||INK,16);}
  });
  return `<svg viewBox="0 0 ${W} ${H}" class="fig">${g}${_cap(cap,W,H-10)}</svg>`;
}

/* disque (aire) ou cercle (périmètre) */
function diskFig(r,area,solved){
  const W=300,H=solved?236:206,cx=150,cy=100,R=80;
  let g=area?`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#99f6e4" stroke="#0d9488" stroke-width="3"/>`:`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="#f97316" stroke-width="7"/>`;
  g+=`<circle cx="${cx}" cy="${cy}" r="4" fill="${INK}"/><line x1="${cx}" y1="${cy}" x2="${cx+R}" y2="${cy}" stroke="${INK}" stroke-width="3"/><text x="${cx+R/2}" y="${cy-8}" text-anchor="middle" font-size="20" font-weight="900" fill="${INK}">r = ${r}</text>`;
  if(!solved)g+=`<text x="${cx}" y="${cy+44}" text-anchor="middle" font-size="26" font-weight="900" fill="${area?'#0f766e':'#c2410c'}">?</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="fig">${g}${solved?_cap(area?`π × ${r}² = ${r*r}π`:`2 × π × ${r} = ${2*r}π`,W,H-10):''}</svg>`;
}

/* trapèze : la correction trace la « base moyenne » */
function trapFig(B,b,h,solved){
  const W=300,H=solved?246:216,u=Math.min(26,230/B,130/h),hh=h*u,x0=(W-B*u)/2,y0=184,xb=x0+(B-b)*u*.35;
  let g=`<path d="M${x0} ${y0} L${x0+B*u} ${y0} L${xb+b*u} ${y0-hh} L${xb} ${y0-hh} Z" fill="#fde68a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  g+=`<line x1="${xb+b*u*.5}" y1="${y0-hh}" x2="${xb+b*u*.5}" y2="${y0}" stroke="#0d9488" stroke-width="2.5" stroke-dasharray="6 4"/>`;
  g+=`<text x="${x0+B*u/2}" y="${y0+24}" text-anchor="middle" font-size="19" font-weight="900" fill="#f97316">B = ${B}</text><text x="${xb+b*u/2}" y="${y0-hh-8}" text-anchor="middle" font-size="19" font-weight="900" fill="#8b5cf6">b = ${b}</text><text x="${xb+b*u*.5+8}" y="${y0-hh*.78+6}" font-size="18" font-weight="900" fill="#0d9488">h = ${h}</text>`;
  if(solved){const mx0=(x0+xb)/2,mx1=(x0+B*u+xb+b*u)/2,my=y0-hh/2;g+=`<line x1="${mx0}" y1="${my}" x2="${mx1}" y2="${my}" stroke="${GOOD}" stroke-width="4" stroke-dasharray="8 5"/><text x="${mx1+6}" y="${my+6}" font-size="17" font-weight="900" fill="${GOOD}">${fmt((B+b)/2)}</text>`;}
  return `<svg viewBox="0 0 ${W} ${H}" class="fig">${g}${solved?_cap(`base moyenne ${fmt((B+b)/2)} × ${h} = ${fmt((B+b)*h/2)}`,W,H-10):''}</svg>`;
}

/* arc de cercle de rayon R et d'angle π/d */
function arcFig(R,d,lab,solved){
  const W=300,H=solved?240:212,cx=150,cy=128,r=76,t=Math.PI/d,ex=cx+r*Math.cos(t),ey=cy-r*Math.sin(t);
  let g=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e4e2ee" stroke-width="3"/><line x1="${cx}" y1="${cy}" x2="${cx+r}" y2="${cy}" stroke="${INK}" stroke-width="3"/><line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${INK}" stroke-width="3"/>`;
  g+=`<path d="M${cx+r} ${cy} A${r} ${r} 0 ${t>Math.PI?1:0} 0 ${ex} ${ey}" fill="none" stroke="#db2777" stroke-width="8" stroke-linecap="round"/>`;
  g+=`<path d="M${cx+22} ${cy} A22 22 0 0 0 ${cx+22*Math.cos(t)} ${cy-22*Math.sin(t)}" fill="none" stroke="#8b5cf6" stroke-width="3"/>`;
  g+=`<text x="${cx+r/2}" y="${cy+22}" text-anchor="middle" font-size="18" font-weight="900" fill="${INK}">R = ${R}</text>`;
  const la=t/2,lx=cx+(r+26)*Math.cos(la),ly=cy-(r+26)*Math.sin(la)+6;
  g+=`<text x="${lx}" y="${ly}" text-anchor="middle" font-size="${solved?18:26}" font-weight="900" fill="#db2777" paint-order="stroke" stroke="#fff" stroke-width="4">${solved?lab:'?'}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="fig">${g}${solved?_cap('longueur = rayon × angle (en radians)',W,H-10):''}</svg>`;
}
