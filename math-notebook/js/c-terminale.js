/* =====================================================================
   ÎLES « TERMINALE » : Dérivées, Exponentielle & ln, Intégrales
   ===================================================================== */
const G3='🏔️ Terminale';
function tangentFig(f,df,a,o={}){
  return plot({f,x0:o.x0??-3,x1:o.x1??3,y0:o.y0??-1,y1:o.y1??9,ystep:o.ystep||1,col:'#6d28d9',over:(X,Y)=>{
    const m=df(a),y=f(a),L=1.6;return `<line x1="${X(a-L)}" y1="${Y(y-m*L)}" x2="${X(a+L)}" y2="${Y(y+m*L)}" stroke="#f97316" stroke-width="4" stroke-linecap="round"/><circle cx="${X(a)}" cy="${Y(y)}" r="7" fill="#f97316" stroke="#fff" stroke-width="3"/>`;}});
}

/* ------------------------------ DÉRIVÉES ------------------------------ */
chapter({key:'ana',label:'Dérivées',icon:'🚴',group:G3,c:['#8b5cf6','#6d28d9','#4c1d95'],notions:[
{id:'ana1',title:'La dérivée, c\'est la pente',
 hook:`<p>À vélo sur une colline : à quel endroit la pente est-elle <b>la plus raide</b> ? Et où est-elle <b>nulle</b> ? 🚴</p>`,
 play:{text:'Fais glisser le point le long de la courbe y = x². La flèche orange est la tangente.',mount:mSlider({sliders:[{id:'a',label:'x',min:-2.5,max:2.5,step:.5,val:2,col:'#6d28d9'}],
   draw:v=>tangentFig(x=>x*x,x=>2*x,v.a),read:v=>`Pente de la tangente : $f'(${fmt(v.a)})=2\\times${fmt(v.a)}=${fmt(2*v.a)}$`,
   task:'🎯 Trouve l\'endroit où la tangente est horizontale.',goal:v=>v.a===0,got:'Pente nulle !',
   win:r`$f'(a)$ est la <b>pente de la tangente</b> en $a$. Positive : ça monte ; négative : ça descend ; nulle : c'est un <b>sommet ou un creux</b>.`})},
 rule:r`<p>$f'(a)$ = pente de la tangente à la courbe au point d'abscisse $a$.</p><div class="legend"><div>$f'>0$ : $f$ croissante ↗</div><div>$f'<0$ : $f$ décroissante ↘</div><div>Tangente : $y=f'(a)(x-a)+f(a)$</div></div>`,ruleFig:tangentFig(x=>x*x,x=>2*x,1),
 drill:[
  function at(){const b=ri(-4,4),x0=ri(-3,3);return QQ(r`$f(x)=x^2${b?sgn(b)+'x':''}$. Pente de la tangente en $x=${x0}$ ?`,String(2*x0+b),[String(x0*x0+b*x0),String(2*x0),String(2*x0+b+1)],r`$f'(x)=2x${b?sgn(b):''}$, donc $f'(${x0})=${2*x0+b}$.`,['La pente de la tangente, c\'est f\'(a).','Dérive, puis remplace x.']);},
  function var1(){const s=pick([1,-1]);return QQ(`Sur un intervalle, $f'(x)${s>0?'>':'<'}0$. Alors $f$ est…`,s>0?'croissante':'décroissante',[s>0?'décroissante':'croissante','constante','négative'],'Le signe de la dérivée donne le sens de variation.',['Dérivée = pente.']);},
  function tan(){const a=ri(1,3);return QQ(r`Tangente à $y=x^2$ en $x=${a}$ ?`,`y=${2*a}x-${a*a}`,[`y=${2*a}x+${a*a}`,`y=${a}x`,`y=${2*a}x`],r`$y=f'(${a})(x-${a})+f(${a})=${2*a}(x-${a})+${a*a}=${2*a}x-${a*a}$.`,['Formule : y = f\'(a)(x − a) + f(a).'],tangentFig(x=>x*x,x=>2*x,a,{x0:-1,x1:4,y1:12,ystep:2}));},
 ]},
{id:'ana2',title:'Les règles de dérivation',
 hook:`<p>Dériver $x^5$, $3x^2+7x$ ou $e^x$ en 2 secondes ? Il suffit de 4 règles. 🧰</p>`,
 play:{text:'Touche chaque fonction : en noir f, en orange sa dérivée f\'.',mount:mTaps({taps:['x²','x³','e^x','ln x'],
   draw:i=>{const F=[x=>x*x,x=>x**3,Math.exp,x=>Math.log(x)][i],D=[x=>2*x,x=>3*x*x,Math.exp,x=>1/x][i];return plot({f:F,g:D,x0:i===3?0.05:-2,x1:3,y0:-3,y1:8,col:'#6d28d9'});},
   read:i=>[r`$(x^2)'=2x$`,r`$(x^3)'=3x^2$`,r`$(e^x)'=e^x$ : les deux courbes sont confondues !`,r`$(\ln x)'=\dfrac1x$`][i],
   task:'👆 Teste les 4 fonctions.',got:'',win:r`Règle d'or : $(x^n)'=nx^{n-1}$ (on descend l'exposant, on enlève 1). Et $e^x$ est <b>sa propre dérivée</b>.`})},
 rule:r`<div class="legend"><div>$(x^n)'=nx^{n-1}$</div><div>$(k)'=0$ · $(kx)'=k$</div><div>$(u+v)'=u'+v'$ · $(ku)'=ku'$</div><div>$(e^x)'=e^x$ · $(\ln x)'=\dfrac1x$ · $(e^{u})'=u'e^u$</div></div>`,
 ex:()=>{const a=ri(2,5),b=ri(1,9),c=ri(1,9);return {title:r`Dériver $f(x)=${a}x^3+${b}x^2-${c}x+7$`,lines:[r`$(${a}x^3)'=${a}\times3x^2=${3*a}x^2$`,r`$(${b}x^2)'=${2*b}x$`,r`$(-${c}x)'=-${c}$ et $(7)'=0$`,r`$f'(x)=${3*a}x^2+${2*b}x-${c}$ ✅`]};},
 mine:()=>{const a=ri(2,6),n=ri(3,5);return {q:r`Remets dans l'ordre pour dériver $${a}x^{${n}}$`,steps:[r`On descend l'exposant : $${a}\times${n}$`,r`On enlève 1 à l'exposant : $x^{${n-1}}$`,r`Résultat : $${a*n}x^{${n-1}}$`]};},
 drill:[
  function mono1(){const a=ri(2,9),n=ri(2,6);return QQ(r`Dérivée de $${a}x^{${n}}$ ?`,`${a*n}x^{${n-1}}`.replace('x^{1}','x'),[`${a}x^{${n-1}}`.replace('x^{1}','x'),`${a*n}x^{${n}}`,`${a*(n+1)}x^{${n+1}}`],r`$${a}\times${n}x^{${n-1}}=${a*n}x^{${n-1}}$.`.replace('x^{1}','x'),['Descends l\'exposant devant.','Puis enlève 1 à l\'exposant.']);},
  function poly(){const a=ri(1,5),b=ri(-6,6)||2,c=ri(-9,9);return QQ(r`Dérivée de $${a===1?'':a}x^2${sgn(b)}x${sgn(c)}$ ?`,`${2*a}x${sgn(b)}`,[`${2*a}x${sgn(b)}${sgn(c)}`,`${a}x${sgn(b)}`,`${2*a}x`],r`$(${a===1?'':a}x^2)'=${2*a}x$, $(${b}x)'=${b}$, et la constante disparaît.`,['Morceau par morceau.','Une constante a une dérivée nulle.']);},
  function ref(){const t=pick([['e^x','e^x',['xe^{x-1}','1','e']],['\\ln x','\\dfrac1x',['\\ln x','x','e^x']],['e^{3x}','3e^{3x}',['e^{3x}','3xe^{3x}','e^3']],['5x','5',['5x','x','0']],['7','0',['7','1','7x']],['\\sqrt x','\\dfrac{1}{2\\sqrt x}',['\\sqrt x','2\\sqrt x','\\dfrac1x']]]);return QQ(r`Dérivée de $${t[0]}$ ?`,t[1],t[2],'Dérivées de référence à connaître par cœur.',['Revois ta carte « règles de dérivation ».']);},
 ],
 games:[()=>({type:'match',q:'Relie chaque fonction à sa dérivée',pairs:shuffle([[r`$x^3$`,r`$3x^2$`],[r`$e^x$`,r`$e^x$ `],[r`$\ln x$`,r`$\frac1x$`],[r`$5x$`,r`$5$`]]),why:'Les 4 dérivées de base.'})]},
{id:'ana3',title:'Variations et extremums',
 hook:`<p>Le bénéfice d'une petite entreprise est $B(x)=-x^2+10x$ (en milliers d'€), où $x$ est le nombre de produits fabriqués (en centaines).</p><p>Combien en fabriquer pour gagner <b>le plus</b> ? 💰</p>`,
 play:{text:'Fais varier la production et regarde la pente.',mount:mSlider({sliders:[{id:'x',label:'x',min:0,max:10,step:.5,val:2,col:'#6d28d9'}],
   draw:v=>tangentFig(x=>-x*x+10*x,x=>-2*x+10,v.x,{x0:-.5,x1:10.5,y0:-2,y1:30,ystep:5}),read:v=>`$B(${fmt(v.x)})=${fmt(-v.x*v.x+10*v.x)}$ · $B'(${fmt(v.x)})=${fmt(-2*v.x+10)}$`,
   task:'🎯 Trouve le bénéfice maximal.',goal:v=>v.x===5,got:'Maximum : 25 000 € !',
   win:r`Au maximum, la tangente est <b>horizontale</b> : $B'(x)=-2x+10=0$, soit $x=5$. Avant, $B'>0$ (ça monte) ; après, $B'<0$ (ça descend).`})},
 rule:r`<p>Pour trouver un maximum ou un minimum :</p><div class="legend"><div>① Calculer $f'(x)$</div><div>② Résoudre $f'(x)=0$</div><div>③ Si $f'$ change de signe : extremum</div></div><p class="muted">$f'$ passe de + à − : maximum ; de − à + : minimum.</p>`,
 mine:()=>({q:r`Remets dans l'ordre pour trouver le minimum de $f(x)=x^2-6x$`,steps:[r`$f'(x)=2x-6$`,r`$2x-6=0\iff x=3$`,r`$f'$ passe de − à + : minimum en $x=3$`,r`$f(3)=9-18=-9$`]}),
 drill:[
  function ext(){const k=pick([4,6,8,10,12]);return QQ(r`$f'(x)=2x-${k}$. Où $f$ a-t-elle son minimum ?`,`x=${k/2}`,[`x=${k}`,`x=-${k/2}`,`x=2`],r`$2x-${k}=0 \iff x=${k/2}$ ($f'$ passe de − à +).`,['Où la dérivée s\'annule-t-elle ?']);},
  function maxv(){const a=ri(2,6);return QQ(r`Valeur maximale de $f(x)=-x^2+${2*a}x$ ?`,String(a*a),[String(a),String(2*a),String(4*a*a)],r`$f'(x)=-2x+${2*a}=0\iff x=${a}$, puis $f(${a})=-${a*a}+${2*a*a}=${a*a}$.`,['Trouve d\'abord où f\' = 0.','Puis calcule f en ce point.']);},
  function sgnq(){const r1=ri(-3,3);return QQ(r`$f'(x)=x${r1?sgn(-r1):''}$. Sur $]${r1}\,;+\infty[$, $f$ est…`,'croissante',['décroissante','constante','négative'],r`Pour $x>${r1}$, $f'(x)>0$.`,['Quel est le signe de f\' quand x est grand ?']);},
 ]},
]});

/* ------------------------------ EXPONENTIELLE ET LN ------------------------------ */
chapter({key:'exp',label:'Exp & ln',icon:'🚀',group:G3,c:['#fb7185','#e11d48','#881337'],notions:[
{id:'exp1',title:'L\'exponentielle',
 hook:`<p>Une colonie de bactéries grandit d'autant plus vite… qu'elle est grande. 🦠</p><p>Quelle fonction a une pente toujours <b>égale à sa propre valeur</b> ?</p>`,
 play:{text:'Fais glisser le point sur la courbe de eˣ. Compare la hauteur et la pente.',mount:mSlider({sliders:[{id:'a',label:'x',min:-2,max:2,step:.25,val:0,col:'#e11d48'}],
   draw:v=>tangentFig(Math.exp,Math.exp,v.a,{x0:-3,x1:2.5,y0:-.5,y1:8}),read:v=>`hauteur $e^{${fmt(v.a)}}\\approx${fmt(Math.round(Math.exp(v.a)*100)/100)}$ · pente $\\approx${fmt(Math.round(Math.exp(v.a)*100)/100)}$`,
   task:'🎯 Monte jusqu\'à x = 2 et observe.',goal:v=>v.a===2,got:'Toujours égales !',
   win:r`La pente de $e^x$ est <b>toujours égale</b> à sa valeur : $(e^x)'=e^x$. D'où une croissance explosive. Et $e^0=1$, $e\approx2{,}718$.`})},
 rule:r`<div class="legend"><div>$e^0=1$ · $e^1=e\approx2{,}718$</div><div>$e^x>0$ pour tout $x$</div><div>$(e^x)'=e^x$ : croissante</div><div>$e^x\to0$ quand $x\to-\infty$</div></div>`,ruleFig:plot({f:Math.exp,x0:-3,x1:2.2,y0:-.5,y1:8,col:'#e11d48'}),
 drill:[
  function v0(){const t=pick([['e^0','1',['0','e','-1']],['(e^x)\'','e^x',['xe^{x-1}','1','e']],['\\text{le signe de }e^{-5}','<span>positif</span>',['<span>négatif</span>','<span>nul</span>']],['\\lim_{x\\to-\\infty}e^x','0',['-\\infty','1','+\\infty']],['\\lim_{x\\to+\\infty}e^x','+\\infty',['0','1','e']]]);return QQ(r`$${t[0]}$ ?`,t[1],t[2],'Regarde la courbe de eˣ : elle est toujours au-dessus de l\'axe et passe par (0 ; 1).',['Pense à la courbe.'],plot({f:Math.exp,x0:-3,x1:2.2,y0:-.5,y1:8,col:'#e11d48'}));},
  function dk(){const k=ri(2,7);return QQ(r`Dérivée de $e^{${k}x}$ ?`,`${k}e^{${k}x}`,[`e^{${k}x}`,`${k}xe^{${k}x}`,`e^{${k}}`],r`$(e^{u})'=u'e^u$ avec $u=${k}x$.`,['Le nombre devant x « sort » devant.']);},
 ]},
{id:'exp2',title:'Les règles de calcul',
 hook:`<p>$e^3\\times e^4=e^{12}$ ? Tentant… mais faux ! 🙅</p>`,
 play:{text:'Choisis a et b et compare.',mount:mSlider({sliders:[{id:'a',label:'a',min:-3,max:4,val:1,col:'#e11d48'},{id:'b',label:'b',min:-3,max:4,val:2,col:'#f97316'}],
   draw:v=>`<div class="cmp2"><div><small>$e^{${v.a}}\\times e^{${v.b}}$</small><b>${fmt(Math.round(Math.exp(v.a)*Math.exp(v.b)*100)/100)}</b></div><div><small>$e^{${v.a+v.b}}$</small><b>${fmt(Math.round(Math.exp(v.a+v.b)*100)/100)}</b></div></div>`,
   task:'🎯 Trouve a et b (non nuls) pour que le produit vaille exactement 1.',goal:v=>v.a+v.b===0&&v.a!==0,got:'e⁰ = 1 !',
   win:r`$e^a\times e^b=e^{a+b}$ : comme les puissances, on <b>additionne</b> les exposants. Et $e^a\times e^{-a}=e^0=1$.`})},
 rule:r`<div class="legend"><div>$e^a\times e^b=e^{a+b}$</div><div>$\dfrac{e^a}{e^b}=e^{a-b}$ · $e^{-a}=\dfrac1{e^a}$</div><div>$(e^a)^n=e^{na}$</div></div>`,
 drill:[
  function mul(){const a=ri(-4,6),b=ri(-4,6);return QQ(r`$e^{${a}}\times e^{${b}}$ ?`,a+b?`e^{${a+b}}`:'1',[`e^{${a*b}}`,`2e^{${a+b}}`,`e^{${a-b}}`],r`On additionne : $${a}+(${b})=${a+b}$.`,['Comme pour les puissances.']);},
  function dv(){const a=ri(2,8),b=ri(1,6);return QQ(r`$\dfrac{e^{${a}}}{e^{${b}}}$ ?`,`e^{${a-b}}`,[`e^{${a+b}}`,`e^{${fmt(Math.round(a/b*100)/100).replace(',','{,}')}}`,`e^{${b-a}}`],r`On soustrait : $${a}-${b}=${a-b}$.`,['Division → soustraction des exposants.']);},
  function pw(){const a=ri(2,5),n=ri(2,4);return QQ(r`$(e^{${a}})^{${n}}$ ?`,`e^{${a*n}}`,[`e^{${a+n}}`,`${n}e^{${a}}`,`e^{${a**n}}`],r`On multiplie : $${a}\times${n}=${a*n}$.`,['Puissance de puissance.']);},
 ]},
{id:'exp3',title:'Le logarithme ln',
 hook:`<p>Un placement double… mais en <b>combien de temps</b> ? Pour « défaire » une exponentielle, il faut une fonction inverse : <b>ln</b>. 🔄</p>`,
 play:{text:'ln répond à la question : « e à quelle puissance donne x ? »',mount:mSlider({sliders:[{id:'x',label:'x',min:.5,max:9,step:.1,val:1,col:'#e11d48'}],
   draw:v=>plot({f:x=>Math.log(x),x0:-.3,x1:9.5,y0:-1.5,y1:2.6,col:'#e11d48',over:(X,Y)=>`<circle cx="${X(v.x)}" cy="${Y(Math.log(v.x))}" r="7" fill="#f97316"/>`}),read:v=>`$\\ln(${fmt(v.x)})\\approx${fmt(Math.round(Math.log(v.x)*100)/100)}$`,
   task:'🎯 Trouve le x pour lequel ln x = 2.',goal:v=>Math.abs(v.x-7.4)<.15,got:'x ≈ 7,39 = e² !',
   win:r`$\ln x=2 \iff x=e^2\approx7{,}39$. ln « défait » exp : $\ln(e^a)=a$ et $e^{\ln x}=x$. Et $\ln1=0$.`})},
 rule:r`<div class="legend"><div>$\ln x=a\iff x=e^a$</div><div>$\ln1=0$ · $\ln e=1$</div><div>$\ln(ab)=\ln a+\ln b$ · $\ln(a^n)=n\ln a$</div><div>$(\ln x)'=\dfrac1x$</div></div>`,
 drill:[
  function inv(){const k=ri(2,12);const w=Math.random()<.5;return QQ(w?r`$\ln(e^{${k}})$ ?`:r`$e^{\ln ${k}}$ ?`,String(k),[w?`e^{${k}}`:`\\ln ${k}`,'1',`${k}e`],'ln et exp se défont l\'un l\'autre.',['Ce sont deux fonctions réciproques.']);},
  function rules(){const a=ri(2,6),b=ri(2,6),t=pick(['+','n']);return t==='+'?QQ(r`$\ln ${a}+\ln ${b}$ ?`,`\\ln ${a*b}`,[`\\ln ${a+b}`,`\\ln ${a}\\times\\ln ${b}`,String(a*b)],r`$\ln a+\ln b=\ln(ab)$.`,['ln transforme les produits en sommes.']):QQ(r`$\ln(${a}^{${b}})$ ?`,`${b}\\ln ${a}`,[`\\ln ${a*b}`,`${a}\\ln ${b}`,`(\\ln ${a})^{${b}}`],r`$\ln(a^n)=n\ln a$.`,['L\'exposant descend devant.']);},
  function solve(){const k=ri(2,9);return QQ(r`Résous $e^x=${k}$`,`x=\\ln ${k}`,[`x=e^{${k}}`,`x=${k}`,`x=\\dfrac{${k}}{e}`],r`On applique ln des deux côtés : $x=\ln ${k}\approx${fmt(Math.round(Math.log(k)*100)/100)}$.`,['Applique ln des deux côtés.']);},
 ]},
]});

/* ------------------------------ INTÉGRALES ------------------------------ */
chapter({key:'int',label:'Intégrales',icon:'🌊',group:G3,c:['#22d3ee','#0891b2','#164e63'],notions:[
{id:'int1',title:'Une intégrale, c\'est une aire',
 hook:`<p>Comment mesurer l'aire d'une forme toute <b>courbée</b>, alors qu'on ne sait calculer que des rectangles ? 🌊</p>`,
 hookFig:plot({f:x=>x*x/4+1,x0:-.4,x1:4.6,y0:-.6,y1:5.4,a:1,b:3.5,col:IC,fl:[3.9,5,'f']}),
 play:{text:'Remplis la zone de rectangles de plus en plus fins.',mount:mountRiemann},
 rule:ANAT+r`<p>$\displaystyle\int_a^b f(x)\,dx$ = <b>l'aire</b> sous la courbe, entre $x=a$ et $x=b$.</p>`,
 ex:()=>EI.aire(),
 drill:[GI.rect,GI.tri,GI.trap,GI.carreaux,GI.demidisque,GI.chasles,GI.bornes,GI.signe]},
{id:'int2',title:'Les primitives',
 hook:`<p>Dériver, c'est passer de $x^3$ à $3x^2$. Mais comment <b>remonter</b> de $3x^2$ à $x^3$ ? ⬆️</p>`,
 play:{text:'Toutes ces courbes ont la même dérivée 2x. Décale la courbe noire.',mount:mSlider({sliders:[{id:'C',label:'C',min:-2,max:4,step:1,val:0,col:IC}],
   draw:v=>plot({f:x=>x*x+v.C,x0:-2.5,x1:2.5,y0:-3,y1:8,col:IC,fam:[-2,-1,0,1,2,3,4].filter(c=>c!==v.C).map(c=>x=>x*x+c),over:(X,Y)=>`<circle cx="${X(0)}" cy="${Y(3)}" r="7" fill="none" stroke="#e11d48" stroke-width="3"/>`}),
   read:v=>`$F(x)=x^2${v.C?sgn(v.C):''}$ → $F'(x)=2x$`,task:'🎯 Fais passer la courbe par le cercle rouge (0 ; 3).',goal:v=>v.C===3,got:'F(0) = 3 !',
   win:r`$x^2$, $x^2+1$, $x^2+3$… ont toutes pour dérivée $2x$ : ce sont <b>les primitives</b> de $2x$, notées $x^2+C$. Une condition (ici $F(0)=3$) fixe $C$.`})},
 rule:chainFig('x^3','3x^2')+r`<div class="legend"><div>$x^n\to\dfrac{x^{n+1}}{n+1}$</div><div>$k\to kx$ · $e^x\to e^x$ · $\dfrac1x\to\ln x$</div><div>Toutes les primitives : $F(x)+C$</div></div>`,
 ex:()=>pick([EI.prim,EI.cond])(),
 drill:[GI.prim,GI.primsum,GI.primpoly,GI.primref,GI.primexp,GI.deriveF,GI.cond,GI.pente]},
{id:'int3',title:'Calculer une intégrale',
 hook:`<p>Compter les carreaux sous une courbe, c'est long et approximatif. Il existe une formule <b>exacte</b> en 3 étapes. 🧮</p>`,
 play:{text:'Voici la courbe de x². Choisis les bornes et regarde le calcul se faire.',mount:mountBounds},
 rule:r`<div class="legend"><div>① Trouver une primitive $F$</div><div>② Calculer $F(b)$ et $F(a)$</div><div>③ Soustraire</div></div>$$\int_a^b f(x)\,dx=F(b)-F(a)$$<p class="muted">Sous l'axe, l'aire compte en négatif.</p>`,
 ex:()=>pick([EI.calc,EI.entre])(),
 mine:()=>{const c=ri(1,4),b=ri(1,3);return {q:r`Remets dans l'ordre pour calculer $\displaystyle\int_0^{${b}}(2x+${c})\,dx$`,steps:[r`Primitive : $F(x)=x^2+${c}x$`,r`$F(${b})=${b*b+c*b}$ et $F(0)=0$`,r`Résultat : $${b*b+c*b}-0=${b*b+c*b}$`]};},
 drill:[GI.calc,GI.calcaff,GI.calcx2,GI.calcexp,GI.calcln,GI.neg,GI.moyenne,GI.entre]},
]});
