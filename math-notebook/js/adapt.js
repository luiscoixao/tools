/* =====================================================================
   MOTEUR ADAPTATIF
   - jauge de maîtrise par notion (moyenne glissante des réponses)
   - 3 niveaux de difficulté (1 facile · 2 moyen · 3 défi) choisis selon la maîtrise
     et ajustés en direct (2 réussites → plus dur, erreur → plus facile)
   - détour automatique par les prérequis après 2 erreurs d'affilée
   - points faibles et séance ciblée
   ===================================================================== */
const NOT=id=>{for(const c of CH)for(const n of c.notions)if(n.id===id)return {c,n};return null;};
function addGen(id,tier,fn){const x=NOT(id);if(!x)return;x.n.drill.push(fn);(TIER[id]=TIER[id]||{})[fn.name]=tier;}

/* ---------- niveaux de difficulté des générateurs ---------- */
const TIER={
 pui1:{val:1,mul:1,div:2,pp:2},pui2:{zero:1,tenneg:1,neg:2,mix:2},pui3:{big:1,small:2,cmp:3},
 rac1:{sq:1,sqsq:1,encadre:2},rac2:{prod:1,simp:2,quo:2},rac3:{tf:1,trap:2,ratio:3},
 pct1:{of:1,eco:1,part:2},pct2:{coef:1,np:2,rev:2,orig:3},pct3:{rate:1,twice:2,succ:3},
 ens1:{tf:1,home:2},ens2:{inter:1,card:2},ens3:{mem:1,ineq:2},
 alg1:{lin:1,ineq:2,both:3},alg2:{dev:1,fac:2,fac2:2,mental:3},alg3:{pn:1,sq:1,com:2},
 fon1:{img:1,read:1,ante:2},fon2:{inc:1,slope:2,eq:2},fon3:{nsol:1,vertex:2,roots:3},
 sui1:{un:1,raison:1},sui2:{type:1,un:2},sui3:{g:1,ga:2},
 geo1:{hyp:1,leg:2,isr:3},geo2:{disk:1,tri:1,trap:2},geo3:{third:1,rect:1,iso:2},
 mat1:{norm:1,ab:1,mid:2},mat2:{sum:1,k:1,col:2},mat3:{dot:1,perp:2},
 tri1:{val:1,sign:2},tri2:{d2r:1,r2d:1},tri3:{rem:1,cs:2},
 sta1:{mean:1,w:2,miss:3},sta2:{rg:1,med:1,med2:2},sta3:{tot:1,freq:2},
 pro1:{dice:1,comp:1,ur:2},pro2:{two:1,ind:2,chain:2},pro3:{avg:1,E:2,all:2},
 ana1:{var1:1,at:2,tan:3},ana2:{ref:1,mono1:1,poly:2},ana3:{sgnq:1,ext:2,maxv:3},
 exp1:{v0:1,dk:2},exp2:{mul:1,dv:2,pw:2},exp3:{inv:1,rules:2,solve:3},
 int1:{rect:1,carreaux:1,tri:1,bornes:1,trap:2,signe:2,chasles:2,demidisque:3},
 int2:{prim:1,primref:1,primsum:2,deriveF:2,primpoly:2,primexp:3,cond:3,pente:3},
 int3:{calc:1,neg:1,calcaff:2,calcx2:2,calcexp:3,calcln:3,moyenne:3,entre:3},
};
/* ---------- prérequis (pour les détours de remédiation) ---------- */
const PRE={pui2:'pui1',pui3:'pui2',rac1:'pui1',rac2:'rac1',rac3:'rac2',pct2:'pct1',pct3:'pct2',ens3:'ens1',
 alg2:'alg1',alg3:'alg2',fon1:'alg1',fon2:'fon1',fon3:'alg3',sui1:'fon2',sui2:'pui1',sui3:'sui1',
 geo1:'rac1',mat1:'geo1',mat2:'mat1',mat3:'mat2',tri1:'geo1',tri2:'tri1',tri3:'geo1',
 sta2:'sta1',sta3:'pct1',pro2:'pro1',pro3:'pro2',ana1:'fon2',ana2:'pui1',ana3:'ana2',
 exp1:'ana2',exp2:'pui1',exp3:'exp2',int1:'geo2',int2:'ana2',int3:'int2'};

/* ---------- maîtrise ---------- */
st.m=st.m||{};
const mastery=id=>st.m[id]??null;
function updM(id,score){const m=st.m[id];st.m[id]=Math.round(((m==null?.35:m)*.7+score*.3)*100)/100;}
function baseTier(id){const m=mastery(id);return m==null?1:m<.35?1:m<.7?2:3;}
/* génère un exercice adapté pour une notion */
function genFor(id,fmts,boost,forced){
  const x=NOT(id);if(!x)return null;
  const T=TIER[id]||{},D=x.n.drill;
  let t=forced||Math.max(1,Math.min(3,baseTier(id)+(boost||0)+(S&&S.adj||0)));
  let pool=[];for(let d=0;d<=2&&!pool.length;d++)pool=D.filter(f=>Math.abs((T[f.name]||2)-t)<=d);
  const fn=lru(id+'#'+t,pool);
  const it=vary(fresh(id,fn),fmts);
  it.nid=id;it.gen=fn.name;it.tier=T[fn.name]||2;return it;
}
const TLAB=['','🟢 Facile','🟠 Moyen','🔴 Défi'];

/* ---------- séance ciblée sur les points faibles ---------- */
function weakList(){return Object.entries(st.m).filter(([id,m])=>NOT(id)).sort((a,b)=>a[1]-b[1]);}
function startFocus(){
  const w=weakList().slice(0,3).map(x=>x[0]);if(!w.length){toast('Joue d\'abord quelques notions !');return;}
  const q=[];const x0=NOT(w[0]);
  q.push({kind:'rule',recap:true,id:x0.n.id,num:notionNum(x0.c,x0.n),title:x0.n.title,html:x0.n.rule,fig:x0.n.ruleFig});
  for(let k=0;k<8;k++){const id=w[k%w.length];q.push({kind:'item',nid:id,label:'🎯 '+NOT(id).n.title,gen:{}});}
  openSession({mode:'practice',title:'🎯 Points faibles',color:'#f97316',chap:x0.c.key,queue:q,retry:true,
    onEnd:()=>endScreen({bonus:15,title:'Séance ciblée terminée !',emoji:'🎯',extra:`<div class="chips2">${w.map(id=>`<span class="chip2 ${mastery(id)>=.5?'ok':'ko'}">${NOT(id).n.title} · ${Math.round(mastery(id)*100)} %</span>`).join('')}</div>`})});
}
function weakSheet(){
  const L=weakList();
  if(!L.length){sheet('<div class="sh-h">🎯 Mes points faibles</div><p class="muted">Joue quelques notions : l\'appli mesurera ta maîtrise de chacune.</p>');return;}
  sheet(`<div class="sh-h">🎯 Ma maîtrise<small>des notions déjà travaillées, des plus fragiles aux plus solides</small></div>
    <div class="mlist">${L.map(([id,m])=>{const x=NOT(id);return `<div class="mrow"><span>${x.c.icon}</span><div><b>${x.n.title}</b><small>${x.c.label}</small><div class="mgauge"><i style="width:${Math.round(m*100)}%;background:${m<.35?'#e11d48':m<.7?'#f59e0b':'#16a34a'}"></i></div></div><em>${Math.round(m*100)} %</em></div>`;}).join('')}</div>
    <button class="cta" id="focusgo" style="margin-top:14px">🎯 Séance ciblée (≈ 4 min)</button>`);
  $('focusgo').onclick=()=>{$('sheetw').classList.remove('open');startFocus();};
}

/* =====================================================================
   NIVEAUX MANQUANTS : nouveaux exercices (surtout des « défis »)
   ===================================================================== */
addGen('pui1',3,function mix3(){const a=pick([2,3,5]),p=ri(2,4),q=ri(2,3),r0=ri(1,5),s=ri(1,4);const e=p*q+r0-s;return QQ(r`Simplifie $\dfrac{(${a}^{${p}})^{${q}}\times${a}^{${r0}}}{${a}^{${s}}}$`,`${a}^{${e}}`,[`${a}^{${p+q+r0-s}}`,`${a}^{${p*q*r0-s}}`,`${a}^{${p*q+r0+s}}`],r`$(${a}^{${p}})^{${q}}=${a}^{${p*q}}$, puis $${p*q}+${r0}-${s}=${e}$.`,['Commence par la parenthèse : on multiplie les exposants.','Puis on additionne en haut et on soustrait le bas.']);});
addGen('pui2',3,function negfrac(){const b=pick([2,3,5,10]),n=ri(2,3);return QQ(r`$\left(\dfrac{1}{${b}}\right)^{-${n}}$ ?`,String(b**n),[`\\dfrac{1}{${b**n}}`,String(-(b**n)),String(b*n)],r`L'exposant négatif retourne la fraction : $\left(\dfrac1{${b}}\right)^{-${n}}=${b}^{${n}}=${b**n}$.`,['Exposant négatif = on prend l\'inverse.','L\'inverse de 1/'+b+', c\'est '+b+'.']);});
addGen('rac1',3,function sqeq(){const k=pick([2,3,5,6,7]),s=ri(2,4);return QQ(r`Solutions de $x^2=${k*s*s}$ ?`,`${s}\\sqrt{${k}}\\text{ et }-${s}\\sqrt{${k}}`,[`${s}\\sqrt{${k}}\\text{ seulement}`,`${k*s*s/2}`,`\\sqrt{${k}}\\text{ et }-\\sqrt{${k}}`],r`$x=\pm\sqrt{${k*s*s}}=\pm${s}\sqrt{${k}}$.`,['Deux nombres ont le même carré : un positif, un négatif.','Puis simplifie la racine.']);});
addGen('rac2',3,function sum3(){const k=pick([2,3,5]),a=ri(2,3),b=a+ri(1,2);return QQ(r`$\sqrt{${a*a*k}}+\sqrt{${b*b*k}}$ ?`,`${a+b}\\sqrt{${k}}`,[`\\sqrt{${(a*a+b*b)*k}}`,`${a*b}\\sqrt{${k}}`,`${a+b}\\sqrt{${2*k}}`],r`$${a}\sqrt{${k}}+${b}\sqrt{${k}}=${a+b}\sqrt{${k}}$ : on simplifie chaque racine, puis on additionne comme « des $\sqrt{${k}}$ ».`,['Simplifie chaque racine séparément.','Ensuite, 2 pommes + 3 pommes…']);});
addGen('pct1',3,function combo(){const a=pick([10,20,25,50]),b=pick([10,20,40,50]),N=pick([200,400,500,1000]);const v=N*a*b/10000;return QQ(r`$${a}\,\%$ de $${b}\,\%$ de $${N}$ ?`,fmt(v),[fmt(N*(a+b)/100),fmt(N*a/100),fmt(v*10)],r`$${N}\times${fmt(b/100)}=${fmt(N*b/100)}$, puis $\times${fmt(a/100)}=${fmt(v)}$.`,['Calcule d\'abord '+b+' % de '+N+'.','Puis prends '+a+' % du résultat.']);});
addGen('ens1',3,function irr(){const t=pick([['\\sqrt9',['\\sqrt2','\\pi','\\sqrt3']],['\\dfrac{22}{7}',['\\pi','\\sqrt5','\\sqrt8']],['\\sqrt{25}',['\\sqrt{10}','\\pi','\\sqrt7']],['0{,}75',['\\sqrt{3}','\\pi','\\sqrt6']]]);return QQ('Lequel est un nombre rationnel (une fraction) ?',t[0],t[1],r`$${t[0]}$ s'écrit comme une fraction ; les autres sont irrationnels.`,['√ d\'un carré parfait est un entier.','π et √2 ne sont pas des fractions.']);});
addGen('ens2',3,function both(){const T=ri(25,35),a=ri(10,18),b=ri(8,15),c=ri(3,Math.min(a,b)-2);const n=T-(a+b-c);if(n<0)return chapOf('ens').notions[1].drill[0]();return QQ(`Classe de ${T} élèves : ${a} font du sport, ${b} de la musique, ${c} les deux. Combien ne font <b>ni l'un ni l'autre</b> ?`,String(n),[String(T-a-b),String(T-c),String(n+c)],r`Au moins un : $${a}+${b}-${c}=${a+b-c}$. Aucun : $${T}-${a+b-c}=${n}$.`,['Dessine les deux cercles qui se chevauchent.','Les '+c+' du milieu ne comptent qu\'une fois.'],vennFig(['S'],['M'],'union'));});
addGen('ens3',3,function inter(){const a=ri(0,3),b=a+ri(3,5),c=ri(a+1,b-1),d=b+ri(1,3);return QQ(r`$[${a}\,;${b}]\cap\,]${c}\,;${d}]$ ?`,`]${c}\\,;${b}]`,[`[${a}\\,;${d}]`,`[${c}\\,;${b}]`,`]${c}\\,;${d}]`],r`La partie commune va de $${c}$ (exclu) à $${b}$ (inclus).`,['Dessine les deux intervalles l\'un sous l\'autre.','Garde seulement la partie commune, avec les bons crochets.']);});
addGen('alg3',3,function pn3(){const p=ri(1,4),q=pick([2,3]),r1=ri(-5,5);return QQ(r`Solutions de $(${q}x-${p})(x${r1>=0?'-':'+'}${Math.abs(r1)})=0$ ?`,`${fr(p,q)}\\text{ et }${r1}`,[`${p}\\text{ et }${r1}`,`${fr(q,p)}\\text{ et }${-r1}`,`-${fr(p,q)}\\text{ et }${-r1}`],r`$${q}x-${p}=0\iff x=${fr(p,q)}$ ; $x${r1>=0?'-':'+'}${Math.abs(r1)}=0\iff x=${r1}$.`,['Chaque parenthèse peut valoir 0.','Pour la première : résous '+q+'x − '+p+' = 0.']);});
addGen('fon1',3,function ff(){const a=ri(2,3),b=ri(-3,3),x0=ri(-1,2);const f=x=>a*x+b,v=f(f(x0));return QQ(r`$f(x)=${lin(a,b)}$. Combien vaut $f(f(${x0}))$ ?`,String(v),[String(f(x0)),String(f(x0)*f(x0)),String(v+a)],r`$f(${x0})=${f(x0)}$, puis $f(${f(x0)})=${v}$.`,['Calcule d\'abord f('+x0+').','Puis applique f au résultat.']);});
addGen('fon2',3,function inter2(){const x=ri(-2,4),a=ri(1,3),c=-ri(1,3),b=ri(-3,3),d=(a-c)*x+b;return QQ(r`Abscisse du point d'intersection de $y=${lin(a,b)}$ et $y=${lin(c,d)}$ ?`,String(x),[String(-x),String(d-b),String(x+1)],r`On résout $${lin(a,b)}=${lin(c,d)}$ : $${a-c}x=${d-b}$, donc $x=${x}$.`,['Au point commun, les deux y sont égaux.','Égalise les deux expressions et résous.'],plot({f:t=>a*t+b,g:t=>c*t+d,x0:x-4,x1:x+4,y0:Math.min(a*x+b,0)-6,y1:a*x+b+6,ystep:2,col:'#65a30d'}));});
addGen('sui1',2,function rang(){const u0=ri(1,9),rr=ri(2,6),n=ri(6,20);const v=u0+n*rr;return QQ(r`$u_0=${u0}$, raison $${rr}$. Pour quel $n$ a-t-on $u_n=${v}$ ?`,String(n),[String(n+1),String(Math.round(v/rr)),String(n-1)],r`$${u0}+${rr}n=${v}\iff ${rr}n=${v-u0}\iff n=${n}$.`,['Écris u_n = u_0 + n r et résous.']);});
addGen('sui1',3,function deux(){const rr=ri(2,6),a=ri(1,4),b=a+ri(2,5),u0=ri(-3,9);return QQ(r`Suite arithmétique : $u_{${a}}=${u0+a*rr}$ et $u_{${b}}=${u0+b*rr}$. Raison ?`,String(rr),[String(u0+b*rr-(u0+a*rr)),String(b-a),String(rr+1)],r`Entre $u_{${a}}$ et $u_{${b}}$ il y a $${b-a}$ pas : $\dfrac{${(b-a)*rr}}{${b-a}}=${rr}$.`,['Combien de « pas » entre les deux termes ?','Divise l\'écart par le nombre de pas.']);});
addGen('sui2',3,function seuil(){const q=pick([2,3]),u0=pick([1,2,5]),L=pick([100,500,1000]);let n=0;while(u0*q**n<=L)n++;return QQ(r`$u_0=${u0}$, $u_{n+1}=${q}u_n$. Premier rang $n$ où $u_n>${L}$ ?`,String(n),[String(n-1),String(n+1),String(Math.round(L/q))],r`$${u0}\times${q}^{${n-1}}=${u0*q**(n-1)}\leq${L}$ mais $${u0}\times${q}^{${n}}=${u0*q**n}>${L}$.`,['Calcule les termes un par un.'],seqFig(Array.from({length:Math.min(n+1,7)},(_,i)=>u0*q**i),'#c026d3'));});
addGen('sui3',3,function pairs(){const n=pick([50,100,20]);return QQ(r`$2+4+6+\dots+${2*n}$ ?`,String(n*(n+1)),[String(n*(n+1)/2),String(2*n*n),String(n*(2*n+1))],r`C'est $2\times(1+2+\dots+${n})=2\times\dfrac{${n}\times${n+1}}{2}=${n*(n+1)}$.`,['Mets 2 en facteur.','Puis Gauss.']);});
addGen('geo2',3,function compo(){const L=ri(4,8),r0=pick([1,2]);return QQ(`Un rectangle ${L} × ${2*r0} surmonté d'un demi-disque de diamètre ${2*r0}. Aire totale ?`,`${2*r0*L}+${r0===1?'\\dfrac{\\pi}{2}':'2\\pi'}`,[`${2*r0*L}+${r0===1?'\\pi':'4\\pi'}`,`${2*r0*L}`,`${2*r0*L+r0*r0}`],r`Rectangle : $${L}\times${2*r0}=${2*r0*L}$. Demi-disque : $\dfrac{\pi\times${r0}^2}{2}$. On additionne.`,['Coupe la figure en deux formes simples.','Un demi-disque, c\'est la moitié de π r².'],svgBox(`<rect x="40" y="90" width="${L*25}" height="${50*r0}" fill="#99f6e4" stroke="${INK}" stroke-width="3"/><path d="M${40+L*25} 90 A${25*r0} ${25*r0} 0 0 1 ${40+L*25} ${90+50*r0}" fill="#5eead4" stroke="${INK}" stroke-width="3"/><text x="${40+L*12}" y="${90+25*r0+6}" class="ax big">${L} × ${2*r0}</text>`,Math.max(260,L*25+40+25*r0+20),90+50*r0+20));});
addGen('geo3',3,function ext(){const a=ri(30,80),b=ri(30,80);return QQ(`Dans un triangle, deux angles valent $${a}^\\circ$ et $${b}^\\circ$. Combien vaut l'angle <b>extérieur</b> au 3ᵉ sommet ?`,`${a+b}^\\circ`,[`${180-a-b}^\\circ`,`${360-a-b}^\\circ`,`${a+b+10}^\\circ`],r`3ᵉ angle : $${180-a-b}^\circ$ ; l'angle extérieur vaut $180-${180-a-b}=${a+b}^\circ$ (la somme des deux autres !).`,['Un angle et son angle extérieur font 180°.']);});
addGen('mat1',3,function dist(){const [dx,dy,d]=pick([[3,4,5],[6,8,10],[5,12,13],[8,6,10]]),A=[ri(-3,3),ri(-3,3)];return QQ(r`Distance $AB$ avec $A(${A[0]}\,;${A[1]})$ et $B(${A[0]+dx}\,;${A[1]+dy})$ ?`,String(d),[String(dx+dy),String(d*d),String(d+1)],r`$\sqrt{${dx}^2+${dy}^2}=\sqrt{${d*d}}=${d}$.`,['Calcule d\'abord les coordonnées de AB.','Puis sa norme : √(x² + y²).']);});
addGen('mat2',3,function lin3(){const a=ri(-3,3),b=ri(-3,3),c=ri(-3,3),d=ri(-3,3);return QQ(r`$\vec u(${a}\,;${b})$, $\vec v(${c}\,;${d})$. Coordonnées de $2\vec u-\vec v$ ?`,`(${2*a-c}\\,;${2*b-d})`,[`(${2*a+c}\\,;${2*b+d})`,`(${a-c}\\,;${b-d})`,`(${2*a-2*c}\\,;${2*b-2*d})`],r`$2\vec u=(${2*a}\,;${2*b})$, puis on retire $\vec v$.`,['Calcule 2u d\'abord.','Puis soustrais x avec x, y avec y.']);});
addGen('mat3',3,function findk(){const a=ri(1,4),b=ri(1,4),c=ri(1,4);const k=a*c/b;if(!Number.isInteger(k))return chapOf('mat').notions[2].drill[0]();return QQ(r`Pour quel $k$ les vecteurs $(${a}\,;${b})$ et $(${c}\,;-k)$ sont-ils perpendiculaires ?`,`k=${k}`,[`k=${-k}`,`k=${a+c}`,`k=${b}`],r`$${a}\times${c}+${b}\times(-k)=0\iff k=${k}$.`,['Perpendiculaires ⟺ produit scalaire nul.','Écris le produit scalaire avec k, puis résous.']);});
addGen('tri1',3,function sym(){const t=pick([[150,'\\cos 150^\\circ','-\\cos 30^\\circ'],[120,'\\sin 120^\\circ','\\sin 60^\\circ'],[210,'\\sin 210^\\circ','-\\sin 30^\\circ'],[330,'\\cos 330^\\circ','\\cos 30^\\circ']]);const o=['-\\cos 30^\\circ','\\sin 60^\\circ','-\\sin 30^\\circ','\\cos 30^\\circ','-\\sin 60^\\circ'].filter(x=>x!==t[2]);return QQ(r`$${t[1]}$ est égal à…`,t[2],shuffle(o).slice(0,3),'Par symétrie sur le cercle : même distance, signe selon le quart où est le point.',['Place le point sur le cercle.','Cherche le point symétrique dans le premier quart.'],circleFig(t[0]));});
function piFrac(p,q){const g=gcd(p,q);p/=g;q/=g;return q===1?(p===1?'\\pi':p+'\\pi'):`\\dfrac{${p===1?'':p}\\pi}{${q}}`;}
addGen('tri2',3,function arc(){const R=ri(2,6),t=pick([['\\dfrac{\\pi}{3}',3],['\\dfrac{\\pi}{2}',2],['\\dfrac{\\pi}{6}',6],['\\pi',1]]);return QQ(r`Longueur d'un arc de rayon $${R}$ et d'angle $${t[0]}$ rad ?`,piFrac(R,t[1]),[String(R),piFrac(R*t[1],1),piFrac(1,R*t[1])],r`Longueur $=$ rayon × angle (en radians) $=${R}\times${t[0]}=${piFrac(R,t[1])}$.`,['En radians, l\'arc vaut rayon × angle.']);});
addGen('tri3',3,function tan3(){const t=pick([['\\dfrac35','\\dfrac45','\\dfrac43','\\dfrac34'],['\\dfrac45','\\dfrac35','\\dfrac34','\\dfrac43'],['\\dfrac{5}{13}','\\dfrac{12}{13}','\\dfrac{12}{5}','\\dfrac{5}{12}']]);return QQ(r`$\cos x=${t[0]}$ et $\sin x=${t[1]}$. Que vaut $\tan x=\dfrac{\sin x}{\cos x}$ ?`,t[2],[t[3],'1',t[1]],r`On divise : les dénominateurs s'en vont.`,['tan = sin ÷ cos.']);});
addGen('sta2',3,function quart(){const vs=Array.from({length:8},()=>ri(1,30)).sort((a,b)=>a-b);return QQ(r`Valeurs rangées : $${vs.join(',\\ ')}$. Premier quartile $Q_1$ ?`,String(vs[1]),[String(vs[2]),String(vs[0]),fmt((vs[3]+vs[4])/2).replace(',','{,}')],r`$Q_1$ : la plus petite valeur telle qu'au moins 25 % des données lui soient inférieures ou égales. $\dfrac{8}{4}=2$ → la 2ᵉ valeur.`,['25 % de 8 valeurs, c\'est 2 valeurs.']);});
addGen('sta3',3,function tab(){const v=[1,2,3],e=[ri(1,5),ri(2,6),ri(1,5)];const s=e[0]+2*e[1]+3*e[2],n=e[0]+e[1]+e[2];return QQ(r`Valeurs $1,2,3$ avec effectifs $${e.join(',\\ ')}$. Moyenne ?`,fmt(Math.round(s/n*100)/100).replace(',','{,}'),['2',fmt(Math.round(n/3*100)/100).replace(',','{,}'),String(s)],r`$\dfrac{1\times${e[0]}+2\times${e[1]}+3\times${e[2]}}{${n}}=\dfrac{${s}}{${n}}$.`,['Chaque valeur compte autant de fois que son effectif.'],barsFig(e,['1','2','3'],'#2563eb'));});
addGen('pro1',3,function dice2(){const t=pick([[7,'\\dfrac16'],[12,'\\dfrac{1}{36}'],[2,'\\dfrac{1}{36}'],[10,'\\dfrac{1}{12}'],[11,'\\dfrac{1}{18}']]);return QQ(`On lance deux dés. Probabilité que la somme fasse $${t[0]}$ ?`,t[1],['\\dfrac16','\\dfrac{1}{36}','\\dfrac{1}{12}','\\dfrac{1}{18}','\\dfrac{1}{11}'].filter(x=>x!==t[1]).slice(0,3),'Il y a 36 issues équiprobables (6 × 6) ; compte celles qui donnent la somme.',['Fais un tableau 6 × 6.','Compte les cases qui donnent '+t[0]+'.']);});
addGen('pro2',3,function cond(){const pa=pick([.4,.5,.6]),pb=pick([.3,.5,.25]);const pab=Math.round(pa*pb*100)/100;return QQ(r`$P(A)=${fmt(pa).replace(',','{,}')}$ et $P(A\cap B)=${fmt(pab).replace(',','{,}')}$. Que vaut $P_A(B)$ (proba de B sachant A) ?`,fmt(pb).replace(',','{,}'),[fmt(pab).replace(',','{,}'),fmt(Math.round(pa*pab*100)/100).replace(',','{,}'),fmt(Math.round((1-pb)*100)/100).replace(',','{,}')],r`$P_A(B)=\dfrac{P(A\cap B)}{P(A)}=\dfrac{${fmt(pab).replace(',','{,}')}}{${fmt(pa).replace(',','{,}')}}=${fmt(pb).replace(',','{,}')}$.`,['« Sachant A » : on se restreint à A.','On divise par P(A).']);});
addGen('pro3',3,function b1(){const n=ri(2,4);return QQ(r`$X\sim\mathcal B(${n}\,;\tfrac12)$. $P(X=1)$ ?`,fr(n,2**n),[fr(1,2**n),'\\dfrac12',fr(1,n),fr(n,2**(n+1))],r`$${n}$ chemins avec un seul succès, chacun de probabilité $\dfrac1{${2**n}}$ : $${fr(n,2**n)}$.`,['Combien de façons d\'avoir 1 seul succès ?','Chaque chemin a pour probabilité (1/2)^'+n+'.']);});
addGen('ana2',3,function prod(){const t=pick([['xe^x','(1+x)e^x',['e^x','xe^x','x+e^x']],['x\\ln x','\\ln x+1',['\\dfrac1x','\\ln x','x+\\dfrac1x']],['x^2e^x','(x^2+2x)e^x',['2xe^x','x^2e^x','2x+e^x']]]);return QQ(r`Dérivée de $${t[0]}$ ?`,t[1],t[2],r`Produit : $(uv)'=u'v+uv'$.`,['C\'est un produit de deux fonctions.','(uv)\' = u\'v + uv\'.']);});
addGen('exp1',3,function sgn3(){const k=ri(1,4);return QQ(r`Résous $e^{x}-e^{${k}}>0$`,`x>${k}`,[`x<${k}`,`x>e^{${k}}`,`x>\\ln ${k}`],r`$e^x>e^{${k}}$ et l'exponentielle est croissante, donc $x>${k}$.`,['L\'exponentielle est croissante : elle garde l\'ordre.']);});
addGen('exp2',3,function mixe(){const a=ri(2,5),b=ri(1,a-1);return QQ(r`Simplifie $\dfrac{e^{${a}x}\times e^{-${b}x}}{e^{x}}$`,a-b-1===0?'1':`e^{${a-b-1===1?'':a-b-1}x}`,[`e^{${a+b+1}x}`,`e^{${a*b}x}`,`e^{${a-b}x}`],r`$${a}x-${b}x-x=${a-b-1}x$.`,['Additionne en haut, soustrais le bas.']);});
