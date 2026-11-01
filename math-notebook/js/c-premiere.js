/* =====================================================================
   ÎLES « PREMIÈRE » : Fonctions, Suites, Géométrie, Vecteurs, Trigo, Stats, Probas
   ===================================================================== */
const G2='🌋 Première';
const sgn=v=>v<0?String(v):'+'+v;
const lin=(a,b)=>`${a===1?'':a===-1?'-':fmt(a).replace('−','-').replace(',','{,}')}x${b?(b>0?'+'+b:b):''}`;

/* ------------------------------ FONCTIONS ------------------------------ */
chapter({key:'fon',label:'Fonctions',icon:'📈',group:G2,c:['#a3e635','#65a30d','#365314'],notions:[
{id:'fon1',title:'Une fonction, c\'est une machine',
 hook:`<p>Un taxi coûte <b>3 €</b> de prise en charge + <b>2 €</b> par km.</p><p>Combien pour <b>7 km</b> ? Et peut-on le lire sur un graphique ? 🚕</p>`,
 play:{text:'Fais rouler le taxi : choisis la distance.',mount:mSlider({sliders:[{id:'x',label:'km',min:0,max:10,val:2,col:'#65a30d'}],
   draw:v=>plot({f:x=>2*x+3,x0:-.5,x1:10.5,y0:-1,y1:25,ystep:5,xstep:2,col:'#65a30d',over:(X,Y)=>`<line x1="${X(v.x)}" y1="${Y(0)}" x2="${X(v.x)}" y2="${Y(2*v.x+3)}" stroke="#f97316" stroke-width="3" stroke-dasharray="6 4"/><line x1="${X(0)}" y1="${Y(2*v.x+3)}" x2="${X(v.x)}" y2="${Y(2*v.x+3)}" stroke="#f97316" stroke-width="3" stroke-dasharray="6 4"/><circle cx="${X(v.x)}" cy="${Y(2*v.x+3)}" r="8" fill="#f97316"/>`}),
   read:v=>`$f(${v.x})=2\\times${v.x}+3=${2*v.x+3}$ €`,task:'🎯 Trouve le prix pour 7 km.',goal:v=>v.x===7,got:'17 € !',
   win:r`$f(x)=2x+3$ : on <b>entre</b> $x$ (les km), la machine <b>sort</b> $f(x)$ (le prix). Sur le graphique : on monte de $x$ jusqu'à la courbe, puis on lit à gauche.`})},
 rule:r`<p>Une fonction $f$ associe à chaque nombre $x$ un nombre $f(x)$, son <b>image</b>.</p><div class="legend"><div>Calculer $f(3)$ : remplacer $x$ par $3$</div><div>Lire $f(3)$ : monter de $x=3$ jusqu'à la courbe, lire la hauteur</div><div>Un <b>antécédent</b> de 5 : un $x$ tel que $f(x)=5$</div></div>`,
 drill:[
  function img(){const t=pick([[x=>3*x-5,'3x-5'],[x=>x*x+2*x,'x^2+2x'],[x=>-2*x+7,'-2x+7'],[x=>x*x-x+1,'x^2-x+1'],[x=>(x-1)**2,'(x-1)^2'],[x=>2*x*x-3,'2x^2-3']]);const x0=ri(-3,5),v=t[0](x0);return QQ(r`$f(x)=${t[1]}$. Combien vaut $f(${x0})$ ?`,String(v),[String(v+2),String(-v||1),String(x0)],r`On remplace $x$ par $(${x0})$ : $f(${x0})=${v}$.`,['Remplace chaque x par '+x0+', avec des parenthèses.','Attention : (−a)² est positif.']);},
  function read(){const a=pick([1,2,-1]),b=ri(0,3),x0=ri(1,3);const f=x=>a*x+b+ (a<0?4:0);return QQ(r`Lis $f(${x0})$ sur le graphique.`,String(f(x0)),[String(x0),String(f(x0)+1),String(f(x0+1))],r`On part de $x=${x0}$, on monte jusqu'à la courbe : hauteur $${f(x0)}$.`,['Pars de '+x0+' sur l\'axe horizontal.'],plot({f,x0:-.5,x1:5.5,y0:-1,y1:9,col:'#65a30d',over:(X,Y)=>`<circle cx="${X(x0)}" cy="${Y(f(x0))}" r="6" fill="#f97316"/>`}));},
  function ante(){const a=ri(2,5),b=ri(-6,6),x=ri(-3,6),y=a*x+b;return QQ(r`$f(x)=${lin(a,b)}$. Quel est l'antécédent de $${y}$ ?`,String(x),[String(a*y+b),String(y),String(x+1)],r`On résout $${lin(a,b)}=${y}$ : $x=${x}$.`,['On cherche x tel que f(x) = '+y+'.']);},
 ]},
{id:'fon2',title:'Les droites',
 hook:`<p>Pourquoi certaines droites <b>montent</b>, d'autres <b>descendent</b>, certaines plus raides que d'autres ? 📐</p>`,
 play:{text:'Règle les deux nombres a et b de la droite y = ax + b.',mount:mSlider({sliders:[{id:'a',label:'a',min:-3,max:3,step:.5,val:1,col:'#65a30d'},{id:'b',label:'b',min:-3,max:5,val:0,col:'#f97316'}],
   draw:v=>plot({f:x=>v.a*x+v.b,x0:-1,x1:5,y0:-3,y1:6,col:'#65a30d',over:(X,Y)=>`<circle cx="${X(0)}" cy="${Y(4)}" r="7" fill="none" stroke="#e11d48" stroke-width="3"/><circle cx="${X(4)}" cy="${Y(0)}" r="7" fill="none" stroke="#e11d48" stroke-width="3"/>`}),
   read:v=>`$y=${lin(v.a,v.b)||'0'}$`,task:'🎯 Fais passer la droite par les deux cercles rouges.',goal:v=>v.a===-1&&v.b===4,got:'Pile dans les cercles !',
   win:r`$b=4$ : c'est là où la droite <b>coupe l'axe vertical</b>. $a=-1$ : quand $x$ avance de 1, $y$ <b>descend</b> de 1. $a$ est la <b>pente</b>.`})},
 rule:r`<p>Droite $y=ax+b$ :</p><div class="legend"><div>$b$ : ordonnée à l'origine (coupe l'axe vertical)</div><div>$a$ : pente — on monte de $a$ quand $x$ avance de 1</div><div>Pente entre deux points : $a=\dfrac{y_B-y_A}{x_B-x_A}$</div></div>`,ruleFig:plot({f:x=>.5*x+1,x0:-1,x1:5,y0:-1,y1:4,col:'#65a30d'}),
 ex:()=>{const A=[ri(0,2),ri(0,3)],dx=ri(1,3),a=ri(-2,3)||1,B=[A[0]+dx,A[1]+a*dx];return {title:r`Pente de la droite passant par $A(${A})$ et $B(${B})$`,lines:[r`$y_B-y_A=${B[1]}-${A[1]}=${B[1]-A[1]}$`,r`$x_B-x_A=${B[0]}-${A[0]}=${dx}$`,r`$a=\dfrac{${B[1]-A[1]}}{${dx}}=${a}$ ✅`]};},
 drill:[
  function slope(){const A=[ri(-2,3),ri(-2,4)],dx=pick([1,2,4]),a=pick([-2,-1,.5,1,2,3]),B=[A[0]+dx,A[1]+a*dx];return QQ(r`Pente de la droite passant par $(${A[0]}\,;${A[1]})$ et $(${B[0]}\,;${fmt(B[1]).replace('−','-')})$ ?`,fmt(a).replace('−','-').replace(',','{,}'),[fmt(-a).replace('−','-').replace(',','{,}'),fmt(1/a).replace('−','-').replace(',','{,}'),String(B[1]-A[1])],r`$\dfrac{${fmt(B[1])}-(${A[1]})}{${B[0]}-(${A[0]})}=${fmt(a).replace(',','{,}')}$.`,['Différence des y ÷ différence des x.']);},
  function eq(){const a=pick([-2,-1,.5,1,2,3]),b=ri(-2,4);return QQ('Équation de cette droite ?',`y=${lin(a,b)}`,[`y=${lin(-a,b)}`,`y=${lin(a,-b)}`,`y=${lin(b||1,a)}`],r`Elle coupe l'axe vertical en $${b}$ et monte de $${fmt(a)}$ quand $x$ avance de 1.`,['Où coupe-t-elle l\'axe vertical ?','De combien monte-t-elle quand x avance de 1 ?'],plot({f:x=>a*x+b,x0:-1,x1:5,y0:-3,y1:7,col:'#65a30d'}));},
  function inc(){const a=pick([-3,-1,2,4,-.5]);return QQ(r`La fonction $f(x)=${lin(a,2)}$ est…`,a>0?'croissante':'décroissante',[a>0?'décroissante':'croissante','constante'],a>0?'Pente positive : la droite monte.':'Pente négative : la droite descend.',['Regarde le signe du nombre devant x.']);},
 ]},
{id:'fon3',title:'Paraboles et discriminant',
 hook:`<p>Tu lances un ballon. Sa trajectoire est une <b>parabole</b>.</p><p>Touche-t-elle le sol <b>deux fois</b>, <b>une fois</b>, ou <b>jamais</b> ? Un seul nombre le dit. 🏀</p>`,
 play:{text:'Monte ou descends la parabole y = x² − 2x + c.',mount:mSlider({sliders:[{id:'c',label:'c',min:-3,max:3,step:.5,val:-2,col:'#65a30d'}],
   draw:v=>plot({f:x=>x*x-2*x+v.c,x0:-2,x1:4,y0:-4,y1:6,col:'#65a30d'}),
   read:v=>{const D=4-4*v.c;return `$\\Delta=b^2-4ac=4-4\\times(${fmt(v.c)})=${fmt(D)}$ → <b>${D>0?'2 points':D===0?'1 point':'aucun point'}</b> sur l'axe`;},
   task:'🎯 Fais que la parabole <b>touche</b> l\'axe en un seul point.',goal:v=>v.c===1,got:'Δ = 0 !',
   win:r`Le <b>discriminant</b> $\Delta=b^2-4ac$ prédit tout : $\Delta>0$ deux solutions, $\Delta=0$ une seule, $\Delta<0$ aucune.`})},
 rule:r`<p>Pour $ax^2+bx+c=0$ : $\Delta=b^2-4ac$</p><div class="legend"><div>$\Delta>0$ : 2 solutions $x=\dfrac{-b\pm\sqrt\Delta}{2a}$</div><div>$\Delta=0$ : 1 solution $x=\dfrac{-b}{2a}$</div><div>$\Delta<0$ : aucune</div></div>`,
 ex:()=>{const r1=ri(-4,2),r2=r1+ri(1,5),b=-(r1+r2),c=r1*r2,D=b*b-4*c;return {title:r`Résoudre $x^2${sgn(b)}x${sgn(c)}=0$`,fig:plot({f:x=>x*x+b*x+c,x0:r1-1.5,x1:r2+1.5,y0:-D/4-1,y1:Math.max(4,c+2),ystep:Math.ceil((D/4+5)/6),col:'#65a30d'}),lines:[r`$\Delta=(${b})^2-4\times1\times(${c})=${D}$`,r`$\Delta>0$ : deux solutions, $\sqrt\Delta=${Math.sqrt(D)}$`,r`$x=\dfrac{${-b}\pm${Math.sqrt(D)}}{2}$`,r`$x_1=${r1}$ et $x_2=${r2}$ ✅`]};},
 drill:[
  function nsol(){const t=pick([[1,-5,6],[1,2,1],[2,1,3],[1,0,-9],[3,-6,3],[1,4,5],[2,-3,1]]);const D=t[1]**2-4*t[0]*t[2],n=D>0?2:D===0?1:0;return QQ(r`Nombre de solutions de $${t[0]===1?'':t[0]}x^2${t[1]?sgn(t[1])+'x':''}${sgn(t[2])}=0$ ?`,String(n),['0','1','2','3'].filter(x=>x!==String(n)),r`$\Delta=${t[1]}^2-4\times${t[0]}\times(${t[2]})=${D}$.`,['Calcule Δ = b² − 4ac.','Regarde son signe.']);},
  function roots(){const r1=ri(-5,3),r2=r1+ri(1,6),b=-(r1+r2),c=r1*r2;return QQ(r`Solutions de $x^2${b?sgn(b)+'x':''}${sgn(c)}=0$ ?`,`${r1}\\text{ et }${r2}`,[`${-r1}\\text{ et }${-r2}`,`${r1}\\text{ seulement}`,`${b}\\text{ et }${c}`],r`$\Delta=${b*b-4*c}$, $x=\dfrac{${-b}\pm${Math.sqrt(b*b-4*c)}}{2}$.`,['Calcule Δ puis applique la formule.','Astuce : les deux solutions ont pour somme '+(-b)+' et pour produit '+c+'.']);},
  function vertex(){const h=pick([-3,-2,-1,1,2,3,4]),k=ri(-4,4);return QQ(r`Sommet de $y=(x${sgn(-h)})^2${sgn(k)}$ ?`,`(${h}\\,;${k})`,[`(${-h}\\,;${k})`,`(${k}\\,;${h})`,`(${h}\\,;${-k})`],r`Le carré est nul en $x=${h}$ ; là, $y=${k}$.`,['Pour quel x la parenthèse est-elle nulle ?'],plot({f:x=>(x-h)**2+k,x0:h-3,x1:h+3,y0:Math.min(k,0)-1,y1:k+6,col:'#65a30d'}));},
 ]},
]});

/* ------------------------------ SUITES ------------------------------ */
function stairsFig(n){const u=Math.min(20,230/(n+1));let s='';
  for(let i=0;i<n;i++)for(let j=0;j<=n;j++){const dark=j<=i;s+=`<rect x="${20+i*u}" y="${20+(n-j)*u}" width="${u-2}" height="${u-2}" rx="3" fill="${dark?'#c026d3':'#f5d0fe'}"/>`;}
  return svgBox(s+`<text x="${20+n*u/2}" y="${(n+1)*u+40}" class="ax big">${n} × ${n+1}</text>`,Math.max(200,n*u+40),(n+1)*u+50);}
chapter({key:'sui',label:'Suites',icon:'🪜',group:G2,c:['#e879f9','#c026d3','#701a75'],notions:[
{id:'sui1',title:'Suites arithmétiques',
 hook:`<p>Tu as <b>20 €</b> et tu mets <b>5 €</b> de côté chaque semaine.</p><p>Combien auras-tu dans 10 semaines ? Et dans un an ? 🐷</p>`,
 play:{text:'Règle le départ u₀ et ce que tu ajoutes chaque semaine (r).',mount:mSlider({sliders:[{id:'u',label:'u₀',min:0,max:30,step:5,val:10,col:'#c026d3'},{id:'r',label:'r',min:-5,max:10,val:2,col:'#0284c7'}],
   draw:v=>seqFig(Array.from({length:7},(_,i)=>v.u+i*v.r),'#c026d3'),read:v=>`$u_n=${v.u}+${v.r}n$ → $u_{10}=${v.u+10*v.r}$`,
   task:'🎯 Règle ta tirelire : u₀ = 20 et r = 5.',goal:v=>v.u===20&&v.r===5,got:'70 € dans 10 semaines !',
   win:r`On <b>ajoute</b> toujours le même nombre : $u_n=u_0+nr$. Les points sont <b>alignés</b> ! Dans 52 semaines : $20+52\times5=280$ €.`})},
 rule:r`<p>Suite <b>arithmétique</b> de raison $r$ : on ajoute $r$ à chaque étape.</p><div class="legend"><div>$u_{n+1}=u_n+r$</div><div>$u_n=u_0+nr$</div></div><p class="muted">Points alignés, comme une droite.</p>`,ruleFig:seqFig([2,5,8,11,14],'#c026d3'),
 drill:[
  function un(){const u0=ri(-5,20),rr=pick([-4,-3,-2,2,3,4,5,7]),n=ri(4,15);return QQ(r`Suite arithmétique : $u_0=${u0}$, raison $${rr}$. $u_{${n}}$ ?`,String(u0+n*rr),[String(u0+(n-1)*rr),String(u0*n*rr),String(u0+n*rr+rr)],r`$u_{${n}}=${u0}+${n}\times(${rr})=${u0+n*rr}$.`,['On ajoute '+rr+', '+n+' fois.','u_n = u_0 + n × r.'],seqFig([0,1,2,3].map(i=>u0+i*rr),'#c026d3'));},
  function raison(){const u0=ri(1,9),rr=ri(2,9);const L=[0,1,2,3].map(i=>u0+i*rr);return QQ(r`Raison de la suite $${L.join(',\\ ')},\dots$ ?`,String(rr),[String(L[1]),String(rr+1),String(L[3]-L[0])],r`On ajoute $${rr}$ à chaque fois.`,['Différence entre deux termes qui se suivent.']);},
 ]},
{id:'sui2',title:'Suites géométriques',
 hook:`<p>Un nénuphar double de surface chaque jour. Il couvre tout l'étang en <b>30 jours</b>.</p><p>Quand en couvrait-il la <b>moitié</b> ? 🪷</p>`,
 play:{text:'Choisis par combien on multiplie à chaque étape (q).',mount:mSlider({sliders:[{id:'q',label:'q',min:.5,max:2,step:.1,val:1.2,col:'#c026d3'}],
   draw:v=>seqFig(Array.from({length:7},(_,i)=>Math.round(3*v.q**i*100)/100),'#c026d3'),read:v=>`$u_n=3\\times${fmt(v.q)}^n$`,
   task:'🎯 Fais doubler à chaque étape.',goal:v=>Math.abs(v.q-2)<1e-9,got:'Ça explose !',
   win:r`On <b>multiplie</b> toujours par $q$ : $u_n=u_0\times q^n$. Avec $q>1$ ça grimpe de plus en plus vite ; avec $q<1$ ça s'écrase. (Le nénuphar : au jour 29 !)`})},
 rule:r`<p>Suite <b>géométrique</b> de raison $q$ : on multiplie par $q$.</p><div class="legend"><div>$u_{n+1}=q\times u_n$</div><div>$u_n=u_0\times q^n$</div></div>`,ruleFig:seqFig([1,2,4,8,16],'#c026d3'),
 drill:[
  function un(){const u0=pick([1,2,3,5,10]),q=pick([2,3,-2,10,.5]),n=ri(2,5);const v=u0*q**n;return QQ(r`Suite géométrique : $u_0=${u0}$, raison $${fmt(q).replace(',','{,}')}$. $u_{${n}}$ ?`,fmt(v).replace('−','-').replace(',','{,}'),[fmt(u0+n*q).replace(',','{,}'),fmt(u0*q**(n-1)).replace('−','-').replace(',','{,}'),fmt(u0*n*q).replace('−','-').replace(',','{,}')],r`$${u0}\times(${fmt(q).replace(',','{,}')})^{${n}}=${fmt(v).replace(',','{,}')}$.`,['On multiplie par '+fmt(q)+', '+n+' fois.']);},
  function type(){const t=pick([['4,\\ 9,\\ 14,\\ 19','arithmétique de raison $5$',['géométrique de raison $5$','ni l\'un ni l\'autre']],['3,\\ 6,\\ 12,\\ 24','géométrique de raison $2$',['arithmétique de raison $3$','ni l\'un ni l\'autre']],['81,\\ 27,\\ 9,\\ 3','géométrique de raison $\\dfrac13$',['arithmétique de raison $-54$','géométrique de raison $3$']],['1,\\ 4,\\ 9,\\ 16','ni l\'un ni l\'autre',['arithmétique de raison $3$','géométrique de raison $4$']]]);return QQ(r`La suite $${t[0]},\dots$ est…`,t[1],t[2],'Compare les différences (arithmétique) et les quotients (géométrique).',['On ajoute toujours la même chose, ou on multiplie ?']);},
 ]},
{id:'sui3',title:'La somme de Gauss',
 hook:`<p>À 9 ans, le petit Gauss a calculé $1+2+3+\\dots+100$ en quelques secondes.</p><p>Quelle était son astuce ? 🧒</p>`,
 play:{text:'Deux escaliers identiques, retournés, forment un rectangle. Agrandis-les.',mount:mSlider({sliders:[{id:'n',label:'n',min:2,max:12,val:4,col:'#c026d3'}],
   draw:v=>stairsFig(v.n),read:v=>`Rectangle $${v.n}\\times${v.n+1}=${v.n*(v.n+1)}$, donc $1+\\dots+${v.n}=\\dfrac{${v.n*(v.n+1)}}{2}=${v.n*(v.n+1)/2}$`,
   task:'🎯 Calcule 1 + 2 + … + 10.',goal:v=>v.n===10,got:'55 !',
   win:r`Deux escaliers font un rectangle $n\times(n+1)$ : $1+2+\dots+n=\dfrac{n(n+1)}{2}$. Pour 100 : $\dfrac{100\times101}{2}=5050$.`})},
 rule:r`<p>$1+2+3+\dots+n=\dfrac{n(n+1)}{2}$</p><p class="muted">Astuce de Gauss : on additionne le premier et le dernier, le 2ᵉ et l'avant-dernier… toujours la même somme.</p>`,
 drill:[
  function g(){const n=pick([10,20,30,50,100,40]);return QQ(r`$1+2+\dots+${n}$ ?`,String(n*(n+1)/2),[String(n*n/2),String(n*(n-1)/2),String(n*(n+1))],r`$\dfrac{${n}\times${n+1}}{2}=${n*(n+1)/2}$.`,['Formule de Gauss : n(n+1)/2.']);},
  function ga(){const n=ri(5,12),a=ri(1,5);const s=n*a+n*(n-1)/2;return QQ(r`$${a}+${a+1}+\dots+${a+n-1}$ (soit $${n}$ termes) ?`,String(s),[String(n*(a+n)),String(s+n),String((a+n-1)*n)],r`(premier + dernier) × nombre de termes ÷ 2 $=\dfrac{(${a}+${a+n-1})\times${n}}{2}=${s}$.`,['Associe le premier et le dernier.']);},
 ]},
]});

/* ------------------------------ GÉOMÉTRIE ------------------------------ */
chapter({key:'geo',label:'Géométrie',icon:'📐',group:G2,c:['#2dd4bf','#0d9488','#115e59'],notions:[
{id:'geo1',title:'Le théorème de Pythagore',
 hook:`<p>Une échelle de <b>5 m</b> est posée à <b>3 m</b> du pied d'un mur.</p><p>Jusqu'à quelle hauteur monte-t-elle ? 🪜</p>`,
 play:{text:'Chaque côté porte un carré. Joue avec les curseurs !',mount:mountPyth},
 rule:r`<p>Dans un triangle <b>rectangle</b> : $$a^2+b^2=c^2$$ $c$ = l'<b>hypoténuse</b>, le plus long côté, en face de l'angle droit.</p>`,ruleFig:figRight('a','b','c'),
 ex:{title:'L\'échelle : 5 m de long, à 3 m du mur',fig:figRight(3,'h',5),lines:[r`Triangle rectangle : hypoténuse $5$ (l'échelle)`,r`$3^2+h^2=5^2$`,r`$h^2=25-9=16$`,r`$h=\sqrt{16}=4$ m ✅`]},
 mine:()=>{const [a,b,c]=pick([[6,8,10],[5,12,13],[8,15,17]]);return {q:r`Remets dans l'ordre : hypoténuse d'un triangle rectangle de côtés $${a}$ et $${b}$`,steps:[r`$c^2=${a}^2+${b}^2$`,r`$c^2=${a*a}+${b*b}=${c*c}$`,r`$c=\sqrt{${c*c}}=${c}$`]};},
 drill:[
  function hyp(){const [a,b,c]=pick([[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[7,24,25],[12,16,20]]);return QQ('Combien mesure l\'hypoténuse ?',String(c),[String(a+b),String(c+1),String(c-2)],r`$${a}^2+${b}^2=${a*a+b*b}=${c}^2$.`,['Pythagore : a² + b² = c².','Additionne les carrés, puis prends la racine.'],figRight(a,b,'?'));},
  function leg(){const [a,b,c]=pick([[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15]]);return QQ('Combien mesure le côté manquant ?',String(b),[String(c-a),String(c+a),String(b+1)],r`$${c}^2-${a}^2=${c*c-a*a}=${b}^2$.`,['Ici on connaît l\'hypoténuse.','côté² = hypoténuse² − autre côté².'],figRight(a,'?',c));},
  function isr(){const [p,q,r0,ok]=pick([[5,12,13,1],[6,8,10,1],[4,5,6,0],[7,8,11,0],[9,40,41,1]]);return QQ('Ce triangle est-il rectangle ?',ok?'<span>✅ Oui</span>':'<span>❌ Non</span>',[ok?'<span>❌ Non</span>':'<span>✅ Oui</span>','<span>On ne peut pas savoir</span>'],r`$${p}^2+${q}^2=${p*p+q*q}$ et $${r0}^2=${r0*r0}$ : ${ok?'égaux, il est rectangle':'différents, il ne l\'est pas'}.`,['Teste Pythagore avec le plus grand côté.'],figTri(p,q,r0));},
 ]},
{id:'geo2',title:'Les aires',
 hook:`<p>Pourquoi l'aire d'un triangle est-elle toujours <b>la moitié</b> d'un rectangle ? Même un triangle tout tordu ? 🔺</p>`,
 play:{text:'Le triangle a une base de 8 et une hauteur de 4.',mount:mountArea},
 rule:r`<div class="legend"><div>Rectangle : $L\times\ell$</div><div>Triangle : $\dfrac{\text{base}\times\text{hauteur}}{2}$</div><div>Disque : $\pi r^2$ · périmètre $2\pi r$</div><div>Trapèze : $\dfrac{(B+b)\times h}{2}$</div></div>`,ruleFig:figArea(),
 drill:[
  function tri(){const b=pick([4,6,8,10,12]),h=ri(2,7);return QQ('Aire de ce triangle ?',String(b*h/2),[String(b*h),String(b+h),String(b*h/4)],r`$\dfrac{${b}\times${h}}{2}=${b*h/2}$.`,['Base × hauteur, puis…','… divisé par 2 !'],svgBox(`<path d="M30 160 L${30+b*20} 160 L${60+b*5} ${160-h*18} Z" fill="#99f6e4" stroke="${INK}" stroke-width="3"/><line x1="${60+b*5}" y1="${160-h*18}" x2="${60+b*5}" y2="160" stroke="#0d9488" stroke-width="2" stroke-dasharray="6 4"/><text x="${30+b*10}" y="185" class="ax big" fill="#f97316">${b}</text><text x="${72+b*5}" y="${160-h*9}" class="ax big" fill="#0d9488">${h}</text>`,Math.max(260,b*20+60),195));},
  function disk(){const r0=ri(2,9),w=Math.random()<.5;return QQ(w?`Aire d'un disque de rayon $${r0}$ ?`:`Périmètre d'un cercle de rayon $${r0}$ ?`,w?`${r0*r0}\\pi`:`${2*r0}\\pi`,w?[`${2*r0}\\pi`,`${r0}\\pi`,String(r0*r0)]:[`${r0*r0}\\pi`,`${r0}\\pi`,String(2*r0)],w?r`$\pi r^2=${r0*r0}\pi$.`:r`$2\pi r=${2*r0}\pi$.`,[w?'Aire = π × rayon².':'Périmètre = 2 × π × rayon.']);},
  function trap(){const B=ri(6,10),b=ri(2,5),h=ri(2,6);return QQ(`Aire d'un trapèze de bases $${B}$ et $${b}$, hauteur $${h}$ ?`,fmt((B+b)*h/2),[String((B+b)*h),String(B*b*h),fmt(B*h/2)],r`$\dfrac{(${B}+${b})\times${h}}{2}=${fmt((B+b)*h/2)}$.`,['Moyenne des deux bases × hauteur.']);},
 ]},
{id:'geo3',title:'Les angles du triangle',
 hook:`<p>On dit que les 3 angles d'un triangle font toujours <b>180°</b>.</p><p>Même pour un triangle géant ou minuscule ? Vérifions ✂️</p>`,
 play:{text:'Que se passe-t-il si on assemble les 3 angles d\'un triangle ?',mount:mountAngles},
 rule:r`<p>Somme des angles d'un triangle : $180^\circ$.</p><div class="legend"><div>Triangle isocèle : 2 angles égaux</div><div>Équilatéral : 3 angles de $60^\circ$</div><div>Rectangle : un angle de $90^\circ$</div></div>`,ruleFig:figAngles(),
 drill:[
  function third(){const a=ri(25,80),b=ri(25,150-a);return QQ(`Deux angles valent $${a}^\\circ$ et $${b}^\\circ$. Le troisième ?`,`${180-a-b}^\\circ`,[`${360-a-b}^\\circ`,`${a+b}^\\circ`,`${190-a-b}^\\circ`],r`$180-${a}-${b}=${180-a-b}$.`,['La somme fait 180°.']);},
  function iso(){const a=pick([30,40,50,70,80,100,120]);return QQ(`Triangle isocèle : l'angle au sommet vaut $${a}^\\circ$. Les deux autres ?`,`${(180-a)/2}^\\circ`,[`${180-a}^\\circ`,`${a}^\\circ`,`${(180-a)/2+10}^\\circ`],r`$\dfrac{180-${a}}{2}=${(180-a)/2}$.`,['Les deux angles de base sont égaux.']);},
  function rect(){const a=ri(20,70);return QQ(`Triangle rectangle : un angle aigu vaut $${a}^\\circ$. L'autre ?`,`${90-a}^\\circ`,[`${180-a}^\\circ`,`${a}^\\circ`,`${100-a}^\\circ`],r`$180-90-${a}=${90-a}$.`,['L\'angle droit fait déjà 90°.']);},
 ]},
]});

/* ------------------------------ VECTEURS ------------------------------ */
chapter({key:'mat',label:'Vecteurs',icon:'🧭',group:G2,c:['#4ade80','#16a34a','#14532d'],notions:[
{id:'mat1',title:'Coordonnées d\'un vecteur',
 hook:`<p>Un robot doit aller de A à B. On ne peut lui donner que deux ordres : « avance de … vers la droite » et « monte de … ».</p><p>Lesquels ? 🤖</p>`,
 play:{text:'Déplace le point B. A reste en (1 ; 1).',mount:mSlider({sliders:[{id:'x',label:'xB',min:0,max:7,val:5,col:'#16a34a'},{id:'y',label:'yB',min:0,max:6,val:2,col:'#0284c7'}],
   draw:v=>vecFig([{from:[1,1],to:[v.x,v.y],c:'#16a34a',l:'AB'}]),read:v=>`$\\vec{AB}=(${v.x}-1\\,;${v.y}-1)=(${v.x-1}\\,;${v.y-1})$`,
   task:'🎯 Place B pour que $\\vec{AB}=(3\\,;4)$.',goal:v=>v.x===4&&v.y===5,got:'Le robot est arrivé !',
   win:r`$\vec{AB}=(x_B-x_A\,;y_B-y_A)$ : « arrivée − départ ». Sa longueur (norme) : $\sqrt{3^2+4^2}=5$.`})},
 rule:r`<div class="legend"><div>$\vec{AB}=(x_B-x_A\,;y_B-y_A)$ <small>arrivée − départ</small></div><div>Norme : $\|\vec u\|=\sqrt{x^2+y^2}$</div><div>Milieu de $[AB]$ : moyenne des coordonnées</div></div>`,ruleFig:vecFig([{from:[1,1],to:[4,5],c:'#16a34a',l:'AB'}]),
 drill:[
  function ab(){const A=[ri(-1,3),ri(-1,3)],B=[ri(0,6),ri(0,5)];if(A[0]===B[0]&&A[1]===B[1])B[0]++;const v=[B[0]-A[0],B[1]-A[1]];return QQ(r`$A(${A[0]}\,;${A[1]})$, $B(${B[0]}\,;${B[1]})$. $\vec{AB}$ ?`,`(${v[0]}\\,;${v[1]})`,[`(${-v[0]}\\,;${-v[1]})`,`(${A[0]+B[0]}\\,;${A[1]+B[1]})`,`(${v[1]}\\,;${v[0]})`],r`Arrivée − départ : $(${B[0]}-${A[0]}\,;${B[1]}-${A[1]})$.`,['Coordonnées de B moins celles de A.'],vecFig([{from:A,to:B,c:'#16a34a',l:'AB'}],[Math.min(A[0],B[0],0)-1,Math.max(A[0],B[0])+1,Math.min(A[1],B[1],0)-1,Math.max(A[1],B[1])+1]));},
  function norm(){const [x,y,n]=pick([[3,4,5],[6,8,10],[5,12,13],[0,7,7],[8,6,10],[-3,4,5]]);return QQ(r`Norme de $\vec u(${x}\,;${y})$ ?`,String(n),[String(x+y),String(x*x+y*y),String(n+1)],r`$\sqrt{${x}^2+${y}^2}=\sqrt{${x*x+y*y}}=${n}$.`,['C\'est Pythagore !']);},
  function mid(){const A=[ri(-2,4)*2,ri(-1,3)*2],B=[ri(0,5)*2,ri(0,4)*2];return QQ(r`Milieu de $[AB]$ avec $A(${A[0]}\,;${A[1]})$ et $B(${B[0]}\,;${B[1]})$ ?`,`(${(A[0]+B[0])/2}\\,;${(A[1]+B[1])/2})`,[`(${A[0]+B[0]}\\,;${A[1]+B[1]})`,`(${(B[0]-A[0])/2}\\,;${(B[1]-A[1])/2})`,`(${(A[1]+B[1])/2}\\,;${(A[0]+B[0])/2})`],'On fait la moyenne des x, puis des y.',['Moyenne des abscisses ; moyenne des ordonnées.']);},
 ]},
{id:'mat2',title:'Additionner des vecteurs',
 hook:`<p>Aller de A à B puis de B à C… est-ce le même déplacement qu'aller <b>directement</b> de A à C ? 🗺️</p>`,
 play:{text:'u = (3 ; 1) est fixe. Règle v, mis au bout de u.',mount:mSlider({sliders:[{id:'x',label:'vx',min:-2,max:4,val:1,col:'#0284c7'},{id:'y',label:'vy',min:-1,max:4,val:1,col:'#0284c7'}],
   draw:v=>vecFig([{from:[0,0],to:[3,1],c:'#16a34a',l:'u'},{from:[3,1],to:[3+v.x,1+v.y],c:'#0284c7',l:'v'},{from:[0,0],to:[3+v.x,1+v.y],c:'#f97316',l:'u+v',dash:true}],[-1,8,-1,6]),
   read:v=>`$\\vec u+\\vec v=(3+${v.x}\\,;1+${v.y})=(${3+v.x}\\,;${1+v.y})$`,task:'🎯 Fais que $\\vec u+\\vec v=(5\\,;4)$.',goal:v=>v.x===2&&v.y===3,got:'Arrivé en (5 ; 4) !',
   win:r`On met les flèches <b>bout à bout</b> : c'est la relation de Chasles, $\vec{AB}+\vec{BC}=\vec{AC}$. En coordonnées : <b>x avec x, y avec y</b>.`})},
 rule:r`<div class="legend"><div>Chasles : $\vec{AB}+\vec{BC}=\vec{AC}$</div><div>$(x\,;y)+(x'\,;y')=(x+x'\,;y+y')$</div><div>$k\vec u=(kx\,;ky)$</div><div>Colinéaires $\iff xy'-yx'=0$</div></div>`,
 drill:[
  function sum(){const a=ri(-3,4),b=ri(-3,4),c=ri(-3,4),d=ri(-3,4);return QQ(r`$\vec u(${a}\,;${b})+\vec v(${c}\,;${d})$ ?`,`(${a+c}\\,;${b+d})`,[`(${a*c}\\,;${b*d})`,`(${a-c}\\,;${b-d})`,`(${a+b}\\,;${c+d})`],'x avec x, y avec y.',['Additionne les abscisses, puis les ordonnées.']);},
  function k(){const x=ri(-4,4),y=ri(-4,4),k0=pick([-2,2,3,-1,4]);return QQ(r`$\vec u(${x}\,;${y})$. Coordonnées de $${k0}\vec u$ ?`,`(${k0*x}\\,;${k0*y})`,[`(${k0+x}\\,;${k0+y})`,`(${k0*x}\\,;${y})`,`(${x}\\,;${k0*y})`],'On multiplie chaque coordonnée.',['Chaque coordonnée est multipliée par '+k0+'.']);},
  function col(){const x=ri(1,4),y=ri(1,4),ok=Math.random()<.5,k0=ri(2,3);const v=ok?[k0*x,k0*y]:[k0*x,k0*y+1];return QQ(r`$\vec u(${x}\,;${y})$ et $\vec v(${v[0]}\,;${v[1]})$ sont-ils colinéaires ?`,ok?'<span>Oui</span>':'<span>Non</span>',[ok?'<span>Non</span>':'<span>Oui</span>','<span>On ne peut pas savoir</span>'],r`$${x}\times${v[1]}-${y}\times${v[0]}=${x*v[1]-y*v[0]}$ : ${ok?'nul → colinéaires':'non nul → pas colinéaires'}.`,['Calcule xy\' − yx\'.']);},
 ]},
{id:'mat3',title:'Le produit scalaire',
 hook:`<p>Comment savoir si deux directions sont <b>perpendiculaires</b>… sans rapporteur ni équerre ? 📏</p>`,
 play:{text:'u = (2 ; 1) est fixe. Fais tourner v.',mount:mSlider({sliders:[{id:'x',label:'vx',min:-3,max:3,val:2,col:'#0284c7'},{id:'y',label:'vy',min:-3,max:3,val:2,col:'#0284c7'}],
   draw:v=>vecFig([{from:[0,0],to:[2,1],c:'#16a34a',l:'u'},{from:[0,0],to:[v.x,v.y],c:'#0284c7',l:'v'}],[-4,4,-4,4]),
   read:v=>`$\\vec u\\cdot\\vec v=2\\times${v.x}+1\\times${v.y}=${2*v.x+v.y}$`,task:'🎯 Rends le produit scalaire nul (avec v non nul).',goal:v=>2*v.x+v.y===0&&(v.x||v.y),got:'Angle droit !',
   win:r`Quand $xx'+yy'=0$, les vecteurs sont <b>perpendiculaires</b>. Le produit scalaire mesure « à quel point deux flèches vont dans le même sens ».`})},
 rule:r`<p>$\vec u\cdot\vec v=xx'+yy'$</p><div class="legend"><div>$\vec u\cdot\vec v=0 \iff$ perpendiculaires</div><div>$>0$ : même sens global · $<0$ : sens opposés</div></div>`,
 drill:[
  function dot(){const a=ri(-4,4),b=ri(-4,4),c=ri(-4,4),d=ri(-4,4);return QQ(r`$(${a}\,;${b})\cdot(${c}\,;${d})$ ?`,String(a*c+b*d),[`(${a*c}\\,;${b*d})`,String(a*d+b*c),String(a*c+b*d+2)],r`$${a}\times(${c})+${b}\times(${d})=${a*c+b*d}$.`,['x × x\' + y × y\'.','Le résultat est un nombre, pas un vecteur.']);},
  function perp(){const a=ri(1,4),b=ri(1,4);const ok=Math.random()<.5;const v=ok?[-b,a]:[b,a];return QQ(r`$\vec u(${a}\,;${b})$ et $\vec v(${v[0]}\,;${v[1]})$ sont-ils perpendiculaires ?`,ok?'<span>Oui</span>':'<span>Non</span>',[ok?'<span>Non</span>':'<span>Oui</span>','<span>Seulement s\'ils ont la même longueur</span>'],r`$\vec u\cdot\vec v=${a*v[0]+b*v[1]}$${ok?' : nul !':' : non nul.'}`,['Calcule le produit scalaire.']);},
 ]},
]});

/* ------------------------------ TRIGONOMÉTRIE ------------------------------ */
chapter({key:'tri',label:'Trigo',icon:'🎡',group:G2,c:['#f472b6','#db2777','#9d174d'],notions:[
{id:'tri1',title:'Le cercle trigonométrique',
 hook:`<p>Tu montes dans une grande roue de rayon 1. Elle tourne…</p><p>À quelle <b>hauteur</b> et à quelle <b>distance du centre</b> es-tu ? 🎡</p>`,
 play:{text:'Fais tourner ta cabine.',mount:mSlider({sliders:[{id:'d',label:'°',min:0,max:360,step:5,val:30,col:'#db2777'}],
   draw:v=>circleFig(v.d),read:v=>`<span style="color:#2563eb">$\\cos=${fmt(Math.round(Math.cos(v.d*Math.PI/180)*100)/100)}$</span> &nbsp; <span style="color:#f97316">$\\sin=${fmt(Math.round(Math.sin(v.d*Math.PI/180)*100)/100)}$</span>`,
   task:'🎯 Amène ta cabine tout en haut.',goal:v=>v.d===90,got:'Sommet atteint !',
   win:r`Tout en haut : $\cos=0$ (pas de décalage horizontal), $\sin=1$ (hauteur maximale). Le <b>cos</b> est la position <b>horizontale</b>, le <b>sin</b> la position <b>verticale</b>.`})},
 rule:r`<p>Un angle $x$ donne un point du cercle de rayon 1 :</p><div class="legend"><div><span style="color:#2563eb">$\cos x$</span> = abscisse (horizontal)</div><div><span style="color:#f97316">$\sin x$</span> = ordonnée (vertical)</div><div>Toujours entre $-1$ et $1$</div></div>`,ruleFig:circleFig(40),
 drill:[
  function val(){const t=pick([[0,'\\cos 0','1'],[90,'\\sin 90^\\circ','1'],[180,'\\cos 180^\\circ','-1'],[270,'\\sin 270^\\circ','-1'],[90,'\\cos 90^\\circ','0'],[180,'\\sin 180^\\circ','0']]);return QQ(r`Valeur de $${t[1]}$ ?`,t[2],['0','1','-1','\\dfrac12'].filter(x=>x!==t[2]),'Regarde où est le point sur le cercle : cos = horizontal, sin = vertical.',['Place le point sur le cercle.'],circleFig(t[0]));},
  function sign(){const d=pick([30,60,120,150,210,240,300,330]),c=Math.cos(d*Math.PI/180),s=Math.sin(d*Math.PI/180);const g=`\\cos${c>0?'>':'<'}0\\text{ et }\\sin${s>0?'>':'<'}0`;return QQ(r`Pour ce point, quels sont les signes ?`,g,[`\\cos${c>0?'<':'>'}0\\text{ et }\\sin${s>0?'>':'<'}0`,`\\cos${c>0?'>':'<'}0\\text{ et }\\sin${s>0?'<':'>'}0`,`\\cos${c>0?'<':'>'}0\\text{ et }\\sin${s>0?'<':'>'}0`],'À droite : cos > 0 ; en haut : sin > 0.',['Le point est-il à droite ou à gauche ? En haut ou en bas ?'],circleFig(d));},
 ]},
{id:'tri2',title:'Les radians',
 hook:`<p>Les matheux ne disent pas « 180° » mais « $\\pi$ ». Pourquoi ce drôle de nombre ? 🥧</p>`,
 play:{text:'Fais tourner et regarde l\'angle en radians.',mount:mSlider({sliders:[{id:'d',label:'°',min:0,max:360,step:15,val:45,col:'#db2777'}],
   draw:v=>circleFig(v.d,{tri:false}),read:v=>{const f=fr(v.d,180);return `$${v.d}^\\circ=${f==='0'?'0':(f==='1'?'':f.replace('\\dfrac{','\\dfrac{')).replace(/\\dfrac\{(\d+)\}\{(\d+)\}/,(m,a,b)=>`\\dfrac{${a==='1'?'':a}\\pi}{${b}}`)+(f.includes('dfrac')||f==='0'?'':'\\pi')}$ rad`;},
   task:'🎯 Fais un demi-tour.',goal:v=>v.d===180,got:'π radians !',
   win:r`Un demi-tour $=\pi$ radians $=180^\circ$. Le radian, c'est la <b>longueur de l'arc</b> parcouru sur le cercle de rayon 1 : un demi-cercle mesure $\pi$.`})},
 rule:r`<p>$\pi\text{ rad}=180^\circ$</p><div class="legend"><div>Degrés → radians : $\times\dfrac{\pi}{180}$</div><div>$90^\circ=\dfrac\pi2$ · $60^\circ=\dfrac\pi3$ · $45^\circ=\dfrac\pi4$ · $30^\circ=\dfrac\pi6$</div></div>`,
 drill:[
  function d2r(){const t=pick([[30,'\\dfrac{\\pi}{6}'],[45,'\\dfrac{\\pi}{4}'],[60,'\\dfrac{\\pi}{3}'],[90,'\\dfrac{\\pi}{2}'],[120,'\\dfrac{2\\pi}{3}'],[135,'\\dfrac{3\\pi}{4}'],[270,'\\dfrac{3\\pi}{2}'],[360,'2\\pi']]);const o=['\\dfrac{\\pi}{6}','\\dfrac{\\pi}{4}','\\dfrac{\\pi}{3}','\\dfrac{\\pi}{2}','\\dfrac{2\\pi}{3}','\\pi','2\\pi'].filter(x=>x!==t[1]);return QQ(r`$${t[0]}^\circ$ en radians ?`,t[1],shuffle(o).slice(0,3),r`$${t[0]}\times\dfrac{\pi}{180}=${t[1]}$.`,['180° = π.','Quelle fraction de 180° est-ce ?'],circleFig(t[0],{tri:false}));},
  function r2d(){const t=pick([['\\dfrac{\\pi}{6}',30],['\\dfrac{\\pi}{2}',90],['\\dfrac{3\\pi}{4}',135],['\\dfrac{5\\pi}{6}',150],['\\pi',180],['\\dfrac{4\\pi}{3}',240]]);return QQ(r`$${t[0]}$ radians en degrés ?`,`${t[1]}^\\circ`,[`${t[1]/2}^\\circ`,`${t[1]+30}^\\circ`,`${360-t[1]}^\\circ`],r`On remplace $\pi$ par $180^\circ$.`,['Remplace π par 180.'],circleFig(t[1],{tri:false}));},
 ]},
{id:'tri3',title:'cos² + sin² = 1',
 hook:`<p>On sait que $\\cos x=0{,}6$ et que le point est en haut.</p><p>Comment trouver $\\sin x$ <b>sans calculatrice</b> ? 🔎</p>`,
 play:{text:'Fais tourner : le triangle bleu-orange a toujours une hypoténuse de 1.',mount:mSlider({sliders:[{id:'d',label:'°',min:0,max:90,step:1,val:20,col:'#db2777'}],
   draw:v=>circleFig(v.d),read:v=>{const c=Math.cos(v.d*Math.PI/180),s=Math.sin(v.d*Math.PI/180);return `<span style="color:#2563eb">$\\cos^2=${fmt(Math.round(c*c*100)/100)}$</span> + <span style="color:#f97316">$\\sin^2=${fmt(Math.round(s*s*100)/100)}$</span> $=1$`;},
   task:'🎯 Trouve l\'angle où cos ≈ 0,6 et lis le sinus.',goal:v=>Math.abs(Math.cos(v.d*Math.PI/180)-.6)<.012,got:'cos ≈ 0,6 → sin ≈ 0,8 !',
   win:r`Le cos et le sin sont les <b>côtés d'un triangle rectangle d'hypoténuse 1</b>. Pythagore : $\cos^2x+\sin^2x=1$. Donc $\sin^2x=1-0{,}36=0{,}64$ et $\sin x=0{,}8$.`})},
 rule:r`<p>$$\cos^2x+\sin^2x=1$$ C'est <b>Pythagore</b> dans le cercle de rayon 1.</p><p>Si $\cos x=0{,}6$ (et $\sin x>0$) : $\sin x=\sqrt{1-0{,}36}=0{,}8$.</p>`,ruleFig:circleFig(53),
 ex:()=>{const [c,s]=pick([['\\dfrac35','\\dfrac45',9,25,16],['\\dfrac{5}{13}','\\dfrac{12}{13}',25,169,144],['\\dfrac{8}{17}','\\dfrac{15}{17}',64,289,225]]);return {title:r`$\cos x=${c}$ et $\sin x>0$. Trouver $\sin x$`,lines:[r`$\sin^2x=1-\cos^2x$`,r`$\sin^2x=1-\left(${c}\right)^2$`,r`$\sin x=${s}$ (on garde le positif) ✅`]};},
 mine:()=>({q:r`Remets dans l'ordre : $\cos x=0{,}8$, $\sin x>0$, trouver $\sin x$`,steps:[r`$\sin^2x=1-\cos^2x$`,r`$\sin^2x=1-0{,}64=0{,}36$`,r`$\sin x=\sqrt{0{,}36}=0{,}6$`]}),
 drill:[
  function cs(){const t=pick([['0{,}6','0{,}8','0{,}4','0{,}64'],['0{,}8','0{,}6','0{,}2','0{,}36'],['\\dfrac35','\\dfrac45','\\dfrac25','\\dfrac{16}{25}'],['\\dfrac{5}{13}','\\dfrac{12}{13}','\\dfrac{8}{13}','\\dfrac{144}{169}'],['0','1','-1','\\dfrac12']]);return QQ(r`$\cos x=${t[0]}$ et $\sin x>0$. $\sin x$ ?`,t[1],[t[2],t[3],t[0]],r`$\sin^2x=1-\cos^2x$, puis on prend la racine positive : $${t[1]}$.`,['cos² x + sin² x = 1 (Pythagore dans le cercle).','sin² x = 1 − cos² x, puis racine.']);},
  function rem(){const t=pick([['\\cos\\dfrac{\\pi}{3}','\\dfrac12'],['\\sin\\dfrac{\\pi}{6}','\\dfrac12'],['\\cos\\dfrac{\\pi}{6}','\\dfrac{\\sqrt3}{2}'],['\\sin\\dfrac{\\pi}{3}','\\dfrac{\\sqrt3}{2}'],['\\cos\\dfrac{\\pi}{4}','\\dfrac{\\sqrt2}{2}']]);return QQ(r`Valeur de $${t[0]}$ ?`,t[1],['\\dfrac12','\\dfrac{\\sqrt3}{2}','\\dfrac{\\sqrt2}{2}','1'].filter(x=>x!==t[1]).slice(0,3),'Valeurs à connaître : π/6 → (√3/2 ; 1/2), π/4 → (√2/2 ; √2/2), π/3 → (1/2 ; √3/2).',['Petit angle → cos grand, sin petit.']);},
 ],
 games:[()=>({type:'match',q:'Relie chaque valeur exacte',pairs:shuffle([[r`$\cos\frac{\pi}{3}$`,r`$\frac12$`],[r`$\sin\frac{\pi}{3}$`,r`$\frac{\sqrt3}{2}$`],[r`$\cos\frac{\pi}{4}$`,r`$\frac{\sqrt2}{2}$`],[r`$\sin\frac{\pi}{2}$`,r`$1$`]]),why:'Tableau : π/6, π/4, π/3 → 1/2, √2/2, √3/2.'})]},
]});

/* ------------------------------ STATISTIQUES ------------------------------ */
function barsFig(vals,labels,col,line){const mx=Math.max(...vals,line||0,1);let s='';vals.forEach((v,i)=>{const x=24+i*(250/vals.length),w=250/vals.length-10,h=120*v/mx;s+=`<rect x="${x}" y="${150-h}" width="${w}" height="${h}" rx="6" fill="${col}" opacity="${.6+.4*i/vals.length}"/><text x="${x+w/2}" y="${144-h}" class="ax">${fmt(v)}</text><text x="${x+w/2}" y="170" class="ax big" fill="${col}">${labels[i]}</text>`;});
  if(line!=null){const y=150-120*line/mx;s+=`<line x1="16" y1="${y}" x2="284" y2="${y}" stroke="#f97316" stroke-width="3" stroke-dasharray="8 5"/><text x="284" y="${y-6}" class="ax big" text-anchor="end" fill="#f97316">moy. ${fmt(Math.round(line*100)/100)}</text>`;}
  return svgBox(s+`<line x1="16" y1="150" x2="284" y2="150" stroke="${INK}" stroke-width="3"/>`,300,180);}
chapter({key:'sta',label:'Statistiques',icon:'📊',group:G2,c:['#60a5fa','#2563eb','#1e3a8a'],notions:[
{id:'sta1',title:'La moyenne',
 hook:`<p>Tes notes : <b>8</b>, <b>12</b> et <b>15</b>.</p><p>Combien te faut-il au prochain contrôle pour avoir <b>12 de moyenne</b> ? 🎯</p>`,
 play:{text:'Choisis ta prochaine note et regarde la ligne de moyenne.',mount:mSlider({sliders:[{id:'x',label:'note',min:0,max:20,val:10,col:'#2563eb'}],
   draw:v=>barsFig([8,12,15,v.x],['1','2','3','?'],'#2563eb',(35+v.x)/4),read:v=>`$\\dfrac{8+12+15+${v.x}}{4}=${fmt(Math.round((35+v.x)/4*100)/100)}$`,
   task:'🎯 Obtiens exactement 12 de moyenne.',goal:v=>v.x===13,got:'13 suffit !',
   win:r`Moyenne $=\dfrac{\text{somme}}{\text{nombre}}$. Pour 12 de moyenne sur 4 notes, il faut une somme de $48$ : $48-35=13$.`})},
 rule:r`<p>$\text{moyenne}=\dfrac{\text{somme des valeurs}}{\text{nombre de valeurs}}$</p><p>Avec coefficients : chaque valeur compte autant de fois que son coefficient.</p>`,
 drill:[
  function mean(){const n=ri(3,5),vs=Array.from({length:n},()=>ri(2,20));const s=vs.reduce((a,b)=>a+b,0);return QQ(r`Moyenne de $${vs.join(',\\ ')}$ ?`,fmt(Math.round(s/n*100)/100).replace(',','{,}'),[String(s),fmt(Math.round((s/n+1)*100)/100).replace(',','{,}'),String([...vs].sort((a,b)=>a-b)[Math.floor(n/2)])],r`$${s}\div${n}=${fmt(Math.round(s/n*100)/100).replace(',','{,}')}$.`,['Additionne tout…','… puis divise par '+n+'.'],barsFig(vs,vs.map((_,i)=>i+1),'#2563eb'));},
  function miss(){const t=ri(10,15),a=ri(6,16),b=ri(6,16),x=3*t-a-b;if(x<0||x>20)return chapOf('sta').notions[0].drill[0]();return QQ(r`Notes $${a}$ et $${b}$. Quelle 3ᵉ note pour $${t}$ de moyenne ?`,String(x),[String(t),String(2*t-a-b+t-1),String(x+3)],r`Il faut une somme de $3\times${t}=${3*t}$, donc $${3*t}-${a}-${b}=${x}$.`,['Quelle somme faut-il pour cette moyenne ?']);},
  function w(){const n1=ri(6,16),c1=ri(1,3),n2=ri(8,18),c2=ri(1,4);const m=(n1*c1+n2*c2)/(c1+c2);return QQ(r`Notes : $${n1}$ (coef. $${c1}$) et $${n2}$ (coef. $${c2}$). Moyenne ?`,fmt(Math.round(m*100)/100).replace(',','{,}'),[fmt((n1+n2)/2).replace(',','{,}'),String(n1*c1+n2*c2),fmt(Math.round((m+1)*100)/100).replace(',','{,}')],r`$\dfrac{${n1}\times${c1}+${n2}\times${c2}}{${c1+c2}}=${fmt(Math.round(m*100)/100).replace(',','{,}')}$.`,['Chaque note compte autant de fois que son coefficient.']);},
 ]},
{id:'sta2',title:'La médiane',
 hook:`<p>Dans un groupe, 4 amis ont 10 € d'argent de poche par semaine, et 1 en a 500 €.</p><p>Quel nombre décrit le mieux le groupe ? 💸</p>`,
 play:{text:'Change l\'argent de poche du 5ᵉ ami.',mount:mSlider({sliders:[{id:'x',label:'€',min:10,max:500,step:10,val:20,col:'#2563eb'}],
   draw:v=>barsFig([10,10,10,10,v.x],['A','B','C','D','E'],'#2563eb',(40+v.x)/5),read:v=>`Moyenne : $${fmt((40+v.x)/5)}$ € &nbsp;·&nbsp; Médiane : $10$ €`,
   task:'🎯 Monte E jusqu\'à 300 € ou plus.',goal:v=>v.x>=300,got:'La moyenne s\'envole !',
   win:r`La <b>moyenne</b> est tirée par une valeur extrême ; la <b>médiane</b> (la valeur du milieu) ne bouge pas. Elle représente mieux « l'élève typique ».`})},
 rule:r`<p><b>Médiane</b> : on range les valeurs, on prend celle du milieu.</p><div class="legend"><div>Nombre impair : la valeur centrale</div><div>Nombre pair : moyenne des deux centrales</div><div><b>Étendue</b> : max − min</div></div>`,
 mine:()=>({q:'Remets dans l\'ordre pour trouver la médiane de 9, 2, 7, 4, 5',steps:['On range : 2, 4, 5, 7, 9','Il y a 5 valeurs : on prend la 3ᵉ','Médiane = 5']}),
 drill:[
  function med(){const n=pick([5,7]),vs=Array.from({length:n},()=>ri(1,30));const s=[...vs].sort((a,b)=>a-b);return QQ(r`Médiane de $${vs.join(',\\ ')}$ ?`,String(s[(n-1)/2]),[String(vs[(n-1)/2]),fmt(Math.round(vs.reduce((a,b)=>a+b,0)/n*10)/10).replace(',','{,}'),String(s[(n+1)/2])],r`On range : $${s.join(',\\ ')}$ ; la valeur du milieu est $${s[(n-1)/2]}$.`,['Range d\'abord les valeurs dans l\'ordre !']);},
  function med2(){const vs=[ri(1,5),ri(6,10),ri(11,15),ri(16,25)];const m=(vs[1]+vs[2])/2;return QQ(r`Médiane de $${vs.join(',\\ ')}$ ?`,fmt(m).replace(',','{,}'),[String(vs[1]),String(vs[2]),fmt(vs.reduce((a,b)=>a+b,0)/4).replace(',','{,}')],r`Nombre pair : $\dfrac{${vs[1]}+${vs[2]}}{2}=${fmt(m).replace(',','{,}')}$.`,['4 valeurs : il y en a deux au milieu.']);},
  function rg(){const vs=Array.from({length:5},()=>ri(1,40));return QQ(r`Étendue de $${vs.join(',\\ ')}$ ?`,String(Math.max(...vs)-Math.min(...vs)),[String(Math.max(...vs)),String(Math.max(...vs)+Math.min(...vs)),String(vs[4]-vs[0]===Math.max(...vs)-Math.min(...vs)?1:Math.abs(vs[4]-vs[0]))],'Max − min.',['La plus grande moins la plus petite.']);},
 ]},
{id:'sta3',title:'Lire un graphique (sans se faire avoir)',
 hook:`<p>Une pub montre deux barres : l'une semble <b>3 fois plus haute</b> que l'autre.</p><p>Et pourtant, les ventes ont à peine bougé… Comment ? 🕵️</p>`,
 play:{text:'Fais démarrer l\'axe vertical plus haut.',mount:mSlider({sliders:[{id:'z',label:'axe',min:0,max:95,step:5,val:0,col:'#2563eb'}],
   draw:v=>{const vals=[97,100],z=v.z;const h=t=>130*(t-z)/(100-z);return svgBox(vals.map((t,i)=>`<rect x="${70+i*100}" y="${150-h(t)}" width="70" height="${h(t)}" rx="6" fill="${i?'#2563eb':'#94a3b8'}"/><text x="${105+i*100}" y="${144-h(t)}" class="ax big">${t}</text>`).join('')+`<line x1="40" y1="150" x2="270" y2="150" stroke="${INK}" stroke-width="3"/><text x="34" y="154" class="ax" text-anchor="end">${z}</text><text x="34" y="24" class="ax" text-anchor="end">100</text><line x1="40" y1="20" x2="40" y2="150" stroke="${INK}" stroke-width="2"/>`,300,170);},
   read:v=>`Écart réel : $+3\\,\\%$`,task:'🎯 Fais démarrer l\'axe à 90 ou plus.',goal:v=>v.z>=90,got:'Illusion d\'optique !',
   win:'Un axe qui ne commence pas à 0 <b>exagère les écarts</b>. Toujours vérifier l\'échelle avant de conclure !'})},
 rule:r`<div class="legend"><div>Effectif total : somme de toutes les barres</div><div>Fréquence : $\dfrac{\text{effectif}}{\text{total}}$ (souvent en %)</div><div>⚠️ Vérifie toujours où commence l'axe</div></div>`,
 drill:[
  function tot(){const vs=Array.from({length:4},()=>ri(1,9)),L=['A','B','C','D'];return QQ('Effectif total d\'après le diagramme ?',String(vs.reduce((a,b)=>a+b,0)),[String(Math.max(...vs)),String(vs.reduce((a,b)=>a+b,0)+2),'4'],`On additionne : ${vs.join(' + ')}.`,['Additionne toutes les barres.'],barsFig(vs,L,'#2563eb'));},
  function freq(){const vs=pick([[2,3,5],[4,6,10],[1,4,5],[3,3,4],[5,10,5]]);const t=vs.reduce((a,b)=>a+b,0),i=ri(0,2);return QQ(`Fréquence de la catégorie ${'XYZ'[i]} ?`,fmt(Math.round(vs[i]/t*1000)/10)+'\\,\\%',[String(vs[i])+'\\,\\%',fmt(Math.round(vs[i]/t*100)/100).replace(',','{,}')+'\\,\\%',fmt(Math.round((1-vs[i]/t)*1000)/10)+'\\,\\%'],r`$\dfrac{${vs[i]}}{${t}}=${fmt(Math.round(vs[i]/t*1000)/10)}\,\%$.`,['Effectif ÷ total, puis × 100.'],barsFig(vs,['X','Y','Z'],'#0284c7'));},
 ]},
]});

/* ------------------------------ PROBABILITÉS ------------------------------ */
function binomFig(n){const C=k=>{let r0=1;for(let i=0;i<k;i++)r0=r0*(n-i)/(i+1);return r0;};const ps=Array.from({length:n+1},(_,k)=>C(k)/2**n),mx=Math.max(...ps);
  return svgBox(ps.map((p,k)=>{const w=240/(n+1),x=30+k*w,h=120*p/mx;return `<rect x="${x+2}" y="${150-h}" width="${w-4}" height="${h}" rx="4" fill="${k===n?'#f97316':'#0284c7'}"/><text x="${x+w/2}" y="168" class="ax">${k}</text>`;}).join('')+`<line x1="24" y1="150" x2="280" y2="150" stroke="${INK}" stroke-width="3"/><text x="150" y="186" class="ax">nombre de bonnes réponses</text>`,300,192);}
function urn(r0,b,g){const balls=shuffle([...Array(r0).fill('#e11d48'),...Array(b).fill('#2563eb'),...Array(g||0).fill('#16a34a')]);return svgBox(`<path d="M70 50 Q60 190 150 190 Q240 190 230 50 Z" fill="#f4f2fb" stroke="${INK}" stroke-width="4"/><ellipse cx="150" cy="50" rx="80" ry="12" fill="#fff" stroke="${INK}" stroke-width="4"/>${balls.map((c,i)=>`<circle cx="${100+(i%5)*25+((i/5|0)%2?12:0)}" cy="${170-(i/5|0)*26}" r="11" fill="${c}"/>`).join('')}`,300,200);}
chapter({key:'pro',label:'Probabilités',icon:'🎲',group:G2,c:['#38bdf8','#0284c7','#075985'],notions:[
{id:'pro1',title:'Compter les chances',
 hook:`<p>Au Monopoly, tu lances un dé. Le 6 sort-il plus souvent que les autres ? 🎲</p>`,
 play:{text:'Un dé a 6 faces. Laquelle sort le plus souvent ?',mount:mountDice},
 rule:r`<p>Si toutes les issues ont la même chance : $$P(A)=\dfrac{\text{cas favorables}}{\text{cas possibles}}$$ Toujours entre $0$ (impossible) et $1$ (certain).</p>`,
 drill:[
  function dice(){const t=pick([['un nombre pair','\\dfrac12'],['un nombre supérieur à 4','\\dfrac13'],['un multiple de 3','\\dfrac13'],['un nombre premier','\\dfrac12'],['un 6','\\dfrac16'],['un nombre inférieur à 7','1']]);return QQ(`On lance un dé. Probabilité d'obtenir ${t[0]} ?`,t[1],['\\dfrac12','\\dfrac13','\\dfrac16','\\dfrac23','1'].filter(x=>x!==t[1]).slice(0,3),'Compte les faces qui conviennent, sur 6.',['Liste les faces qui conviennent.','Divise par 6.'],`<div style="display:flex;gap:6px;justify-content:center">${[1,2,3,4,5,6].map(n=>dieSvg(n,PC).replace('width="84" height="84"','width="44" height="44"')).join('')}</div>`);},
  function ur(){const r0=ri(1,5),b=ri(1,5),g=ri(0,3),t=r0+b+g;return QQ('Probabilité de tirer une boule <b style="color:#e11d48">rouge</b> ?',fr(r0,t),[fr(b,t),fr(r0,t-r0),fr(1,t)],`${r0} rouge(s) sur ${t} boules.`,['Compte les rouges, puis le total.'],urn(r0,b,g),{bubbles:true});},
  function comp(){const p=pick([['0{,}3','0{,}7'],['0{,}85','0{,}15'],['\\dfrac27','\\dfrac57'],['0{,}5','0{,}5']]);return QQ(r`$P(A)=${p[0]}$. $P(\bar A)$ (l'événement contraire) ?`,p[1],[p[0]==='0{,}5'?'1':p[0],'1','0'],r`$1-${p[0]}=${p[1]}$.`,['A et son contraire se partagent toute la probabilité (1).']);},
 ]},
{id:'pro2',title:'Arbres et indépendance',
 hook:`<p>Tu lances deux pièces. « Deux Piles » a-t-il autant de chances que « un Pile et un Face » ? 🪙🪙</p>`,
 play:{text:'On lance deux pièces : Pile (P) ou Face (F).',mount:mountTree},
 rule:r`<div class="legend"><div>Sur un arbre : on <b>multiplie</b> le long d'une branche</div><div>On <b>additionne</b> les branches qui conviennent</div><div>Indépendants : $P(A\cap B)=P(A)\times P(B)$</div></div>`,
 drill:[
  function two(){const t=pick([['deux Piles','\\dfrac14'],['exactement un Pile','\\dfrac12'],['au moins un Face','\\dfrac34'],['deux résultats identiques','\\dfrac12']]);return QQ(`On lance 2 pièces. Probabilité d'obtenir ${t[0]} ?`,t[1],['\\dfrac14','\\dfrac12','\\dfrac34','1'].filter(x=>x!==t[1]),'Issues : PP, PF, FP, FF (4, équiprobables).',['Liste les 4 issues.']);},
  function ind(){const a=pick([.2,.3,.5,.4]),b=pick([.5,.6,.2,.3]);return QQ(r`$A$ et $B$ indépendants, $P(A)=${fmt(a).replace(',','{,}')}$, $P(B)=${fmt(b).replace(',','{,}')}$. $P(A\cap B)$ ?`,fmt(Math.round(a*b*100)/100).replace(',','{,}'),[fmt(Math.round((a+b)*100)/100).replace(',','{,}'),fmt(a).replace(',','{,}'),fmt(Math.round(Math.abs(a-b)*100)/100||.1).replace(',','{,}')],r`$${fmt(a).replace(',','{,}')}\times${fmt(b).replace(',','{,}')}=${fmt(Math.round(a*b*100)/100).replace(',','{,}')}$.`,['« Et » + indépendants → on multiplie.']);},
  function chain(){const n=ri(2,4);return QQ(`On lance ${n} pièces. Probabilité de n'obtenir que des Piles ?`,`\\dfrac1{${2**n}}`,[`\\dfrac1{${2*n}}`,'\\dfrac12',`\\dfrac{${n}}{${2**n}}`],r`$\left(\dfrac12\right)^{${n}}=\dfrac1{${2**n}}$.`,['Multiplie 1/2 autant de fois qu\'il y a de pièces.']);},
 ]},
{id:'pro3',title:'Loi binomiale et espérance',
 hook:`<p>Un QCM de 4 questions, 2 choix chacune. Tu réponds <b>au hasard</b>.</p><p>Quelle chance d'avoir <b>tout bon</b> ? Et combien de bonnes réponses en moyenne ? 🎰</p>`,
 play:{text:'Change le nombre de questions et regarde la répartition des scores.',mount:mSlider({sliders:[{id:'n',label:'n',min:1,max:8,val:2,col:'#0284c7'}],
   draw:v=>binomFig(v.n),read:v=>`$P(\\text{tout bon})=\\left(\\dfrac12\\right)^{${v.n}}=\\dfrac{1}{${2**v.n}}$ · en moyenne $E=${v.n}\\times\\dfrac12=${fmt(v.n/2)}$`,
   task:'🎯 Règle le QCM sur 4 questions.',goal:v=>v.n===4,got:'1 chance sur 16 !',
   win:r`Répéter $n$ fois une épreuve à 2 issues (succès de probabilité $p$) : c'est la <b>loi binomiale</b>. En moyenne on obtient $E=np$ succès ; ici $4\times\dfrac12=2$.`})},
 rule:r`<p>$X\sim\mathcal B(n\,;p)$ : nombre de succès en $n$ essais indépendants.</p><div class="legend"><div>$E(X)=np$</div><div>$P(X=n)=p^n$ · $P(X=0)=(1-p)^n$</div><div>$P(X=k)=\dbinom nk p^k(1-p)^{n-k}$</div></div>`,
 drill:[
  function E(){const n=pick([10,20,50,100,30]),p=pick([.1,.2,.25,.5,.3]);return QQ(r`$X\sim\mathcal B(${n}\,;${fmt(p).replace(',','{,}')})$. Espérance de $X$ ?`,fmt(n*p).replace(',','{,}'),[fmt(p).replace(',','{,}'),String(n),fmt(n*(1-p)).replace(',','{,}')],r`$E=np=${n}\times${fmt(p).replace(',','{,}')}=${fmt(n*p).replace(',','{,}')}$.`,['E(X) = n × p.']);},
  function all(){const n=ri(2,5),p=pick([[.5,'\\dfrac12','\\dfrac{1}{2}'],[.1,'0{,}1']]);return QQ(r`$X\sim\mathcal B(${n}\,;${p[1]})$. $P(X=${n})$ (que des succès) ?`,p[0]===.5?`\\dfrac{1}{${2**n}}`:`0{,}${'0'.repeat(n-1)}1`,[p[0]===.5?`\\dfrac{${n}}{${2**n}}`:`0{,}${n}`,p[1],p[0]===.5?`\\dfrac1{${2*n}}`:`${n}\\times0{,}1`],r`$p^{${n}}$ : on multiplie $${n}$ fois $${p[1]}$.`,['Tous les essais doivent réussir : on multiplie.']);},
  function avg(){const n=ri(4,12);return QQ(`Un QCM de ${n} questions à 4 choix, réponses au hasard. Nombre moyen de bonnes réponses ?`,fmt(n/4).replace(',','{,}'),[String(n),fmt(n/2).replace(',','{,}'),'1'],r`$E=np=${n}\times\dfrac14=${fmt(n/4).replace(',','{,}')}$.`,['Chaque question : 1 chance sur 4.']);},
 ]},
]});
