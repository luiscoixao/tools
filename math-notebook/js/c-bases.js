/* =====================================================================
   ÎLES « LES BASES » : Puissances, Racines, Pourcentages, Ensembles, Algèbre
   ===================================================================== */
const G1='🏝️ Les bases';
const nb=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'\\,');

/* ------------------------------ PUISSANCES ------------------------------ */
chapter({key:'pui',label:'Puissances',icon:'⚡',group:G1,c:['#f87171','#dc2626','#7f1d1d'],notions:[
{id:'pui1',title:'Multiplier des puissances',
 hook:`<p>Une rumeur circule : chaque personne la raconte à <b>2</b> nouvelles personnes chaque heure.</p><p>Au bout de combien d'heures dépasse-t-elle <b>1 000</b> personnes ? 🤫</p>`,
 play:{text:'Fais avancer les heures : chaque bloc est une personne qui apprend la rumeur.',mount:mSlider({
   sliders:[{id:'n',label:'h',min:0,max:12,val:1,col:'#dc2626'}],
   draw:v=>blocksFig(2,v.n,'#ef4444'),read:v=>`$2^{${v.n}}=${v.n>1?Array(Math.min(v.n,6)).fill(2).join('\\times')+(v.n>6?'\\times\\dots':'')+'=':''}${nb(2**v.n)}$`,
   task:'🎯 Trouve la première heure où on dépasse <b>1 000</b> personnes.',goal:v=>2**v.n>1000&&2**(v.n-1)<=1000,got:'Plus de 1 000 personnes !',
   win:r`$2^{10}=1024$ : en 10 heures seulement ! Remarque : $2^3\times2^2=(2\times2\times2)\times(2\times2)=2^{5}$. Quand on multiplie, <b>on additionne les exposants</b>.`})},
 rule:r`<p>$a^n$ = $a$ multiplié $n$ fois par lui-même.</p><div class="legend"><div>$a^m\times a^n=a^{m+n}$ <small>(on additionne)</small></div><div>$\dfrac{a^m}{a^n}=a^{m-n}$ <small>(on soustrait)</small></div><div>$(a^m)^n=a^{m\times n}$ <small>(on multiplie)</small></div></div>`,
 ex:()=>{const a=pick([2,3,5]),p=ri(3,6),q=ri(2,5),d=ri(2,3);return {title:r`Simplifier $\dfrac{${a}^{${p}}\times ${a}^{${q}}}{${a}^{${d}}}$`,lines:[r`En haut, on multiplie : on additionne les exposants → $${a}^{${p}+${q}}=${a}^{${p+q}}$`,r`On divise par $${a}^{${d}}$ : on soustrait → $${a}^{${p+q}-${d}}$`,r`Résultat : $${a}^{${p+q-d}}$ ✅`]};},
 mine:()=>{const p=ri(2,4),q=ri(2,3);return {q:r`Remets les étapes dans l'ordre pour calculer $(2^{${p}})^{${q}}\times2$`,steps:[r`$(2^{${p}})^{${q}}=2^{${p*q}}$`,r`$2^{${p*q}}\times2^1=2^{${p*q+1}}$`,r`$2^{${p*q+1}}=${2**(p*q+1)}$`]};},
 drill:[
  function mul(){const a=pick([2,3,5,7,10]),p=ri(-3,7),q=ri(2,8);return QQ(r`$${a}^{${p}}\times${a}^{${q}}$ ?`,r`${a}^{${p+q}}`,[r`${a}^{${p*q}}`,r`${a*a}^{${p+q}}`,r`${a}^{${p-q}}`],r`On additionne les exposants : $${p}+${q}=${p+q}$.`,['Multiplier des puissances de même base…','… on additionne les exposants.']);},
  function div(){const a=pick([2,3,10]),p=ri(5,9),q=ri(1,4);return QQ(r`$\dfrac{${a}^{${p}}}{${a}^{${q}}}$ ?`,r`${a}^{${p-q}}`,[r`${a}^{${p+q}}`,r`1^{${p-q}}`,r`${a}^{${q-p}}`],r`On soustrait : $${p}-${q}=${p-q}$.`,['Diviser, c\'est l\'inverse de multiplier.','On soustrait les exposants : haut − bas.']);},
  function pp(){const a=pick([2,3,5]),p=ri(2,4),q=ri(2,3);return QQ(r`$(${a}^{${p}})^{${q}}$ ?`,r`${a}^{${p*q}}`,[r`${a}^{${p+q}}`,r`${a*q}^{${p}}`,r`${a}^{${p**q}}`],r`$${q}$ paquets de $${p}$ facteurs : $${p}\times${q}=${p*q}$.`,['Écris-le en entier : c\'est '+a+'^'+p+' répété '+q+' fois.','On multiplie les exposants.']);},
  function val(){const a=pick([2,3,4,5,10]),n=ri(2,a===2?7:4);return QQ(r`Combien vaut $${a}^{${n}}$ ?`,String(a**n),[String(a*n),String(a**(n-1)),String(a**n+a)],r`$${Array(n).fill(a).join('\\times')}=${a**n}$.`,[`Multiplie ${a} par lui-même ${n} fois.`,`Pas ${a}×${n} !`]);},
 ],
 games:[()=>({type:'match',q:'Relie chaque calcul à son résultat',pairs:shuffle([[r`$2^3\times2^2$`,r`$2^5$`],[r`$(2^3)^2$`,r`$2^6$`],[r`$\dfrac{2^7}{2^3}$`,r`$2^4$`],[r`$2^3\times2^0$`,r`$2^3$`]]),why:'Multiplier : on additionne ; diviser : on soustrait ; puissance de puissance : on multiplie.'})]},
{id:'pui2',title:'Exposants zéro et négatifs',
 hook:`<p>$10^3=1000$, $10^2=100$, $10^1=10$… </p><p>Mais alors, que valent $10^0$ et $10^{-1}$ ? 🤔</p>`,
 play:{text:'Descends l\'exposant pas à pas et observe ce qui se passe à chaque marche.',mount:mSlider({
   sliders:[{id:'n',label:'n',min:-3,max:4,val:3,col:'#dc2626'}],
   draw:v=>{let s='';for(let k=4;k>=v.n;k--){s+=`<div class="stairs"><b>$10^{${k}}$</b> = ${String(10**k).replace('.',',')}</div>`;}return `<div class="stairw">${s}</div>`;},
   read:v=>v.n<3?'⬇ à chaque marche : <b>÷ 10</b>':'',
   task:'🎯 Descends jusqu\'à $10^{-2}$.',goal:v=>v.n===-2,got:'Tu as découvert le secret !',
   win:r`À chaque marche on divise par 10. Donc $10^0=1$ et $10^{-2}=\dfrac{1}{100}$. Un exposant négatif, c'est <b>l'inverse</b>.`})},
 rule:r`<div class="legend"><div>$a^0=1$ <small>(pour tout $a\neq0$)</small></div><div>$a^{-n}=\dfrac{1}{a^n}$</div></div><p>Exemple : $2^{-3}=\dfrac{1}{2^3}=\dfrac18$.</p>`,
 ex:()=>{const a=pick([2,3,5]),n=ri(2,3);return {title:r`Calculer $${a}^{-${n}}$`,lines:[r`Exposant négatif → on prend l'inverse : $\dfrac{1}{${a}^{${n}}}$`,r`$${a}^{${n}}=${a**n}$`,r`Donc $${a}^{-${n}}=\dfrac{1}{${a**n}}$ ✅`]};},
 drill:[
  function neg(){const a=pick([2,3,4,5,10]),n=ri(1,3);return QQ(r`$${a}^{-${n}}$ ?`,r`\dfrac{1}{${a**n}}`,[String(-(a**n)),String(-a*n),r`\dfrac{1}{${a*n}}`],r`$${a}^{-${n}}=\dfrac{1}{${a}^{${n}}}=\dfrac1{${a**n}}$.`,['Le signe − de l\'exposant ne rend pas le nombre négatif !','Exposant négatif = inverse.']);},
  function zero(){const a=pick(['7','2026','0{,}5','\\pi','(-3)']);return QQ(r`$${a}^{0}$ ?`,'1',['0',a,'impossible'],r`Tout nombre non nul à la puissance 0 vaut 1.`,['Pense à l\'escalier : 10¹ = 10, puis on divise par 10…']);},
  function mix(){const n=ri(2,5),m=ri(1,n-1);return QQ(r`$10^{${m}}\times10^{-${n}}$ ?`,r`10^{${m-n}}`,[r`10^{${m+n}}`,r`10^{-${m*n}}`,r`10^{${n-m}}`],r`$${m}+(-${n})=${m-n}$.`,['Même règle que d\'habitude : on additionne les exposants.']);},
  function tenneg(){const n=ri(1,4);return QQ(r`$10^{-${n}}$ en écriture décimale ?`,'0{,}'+'0'.repeat(n-1)+'1',['-'+10**n,'0{,}'+'0'.repeat(n)+'1',String(10**n)],r`$10^{-${n}}=\dfrac{1}{${10**n}}$ : le 1 est au ${n}ᵉ rang après la virgule.`,['Divise 1 par 10, '+n+' fois.']);},
 ]},
{id:'pui3',title:'La notation scientifique',
 hook:`<p>Le Soleil est à <b>150 000 000 km</b>. Un virus mesure <b>0,000 000 1 m</b>.</p><p>Comment écrire ces nombres sans se perdre dans les zéros ? 🔭🦠</p>`,
 play:{text:'Fais glisser l\'exposant et regarde la virgule se déplacer.',mount:mSlider({
   sliders:[{id:'k',label:'n',min:-7,max:9,val:0,col:'#dc2626'}],
   draw:v=>`<div class="bignum">${(1.5*10**v.k).toLocaleString('fr-FR',{maximumFractionDigits:9})}</div>`,
   read:v=>`$1{,}5\\times10^{${v.k}}$`,
   task:'🎯 Écris la distance Terre-Soleil : 150 000 000 km.',goal:v=>v.k===8,got:'150 millions de km !',
   win:r`$1{,}5\times10^{8}$ : l'exposant dit <b>de combien de rangs</b> la virgule se déplace (vers la droite si positif, vers la gauche si négatif).`})},
 rule:r`<p>Écriture scientifique : $a\times10^n$ avec $1\leq a<10$.</p><div class="legend"><div>$52\,000=5{,}2\times10^{4}$ <small>(virgule de 4 rangs)</small></div><div>$0{,}003=3\times10^{-3}$</div></div>`,
 drill:[
  function big(){const a=ri(11,99)/10,n=ri(3,8);const s=nb(Math.round(a*10**n));return QQ(r`Écriture scientifique de $${s}$ ?`,r`${String(a).replace('.','{,}')}\times10^{${n}}`,[r`${String(a).replace('.','{,}')}\times10^{${n+1}}`,r`${String(a).replace('.','{,}')}\times10^{${-n}}`,r`${Math.round(a*10)}\times10^{${n-1}}`],r`On place la virgule après le 1ᵉʳ chiffre : elle s'est déplacée de $${n}$ rangs.`,['Il faut un seul chiffre (non nul) avant la virgule.','Compte de combien de rangs tu déplaces la virgule.']);},
  function small(){const a=ri(11,99)/10,n=ri(2,6);const d=(a*10**-n).toFixed(n+1).replace('.','{,}');return QQ(r`Écriture scientifique de $${d}$ ?`,r`${String(a).replace('.','{,}')}\times10^{-${n}}`,[r`${String(a).replace('.','{,}')}\times10^{${n}}`,r`${String(a).replace('.','{,}')}\times10^{-${n+1}}`,r`${String(a).replace('.','{,}')}\times10^{-${n-1}}`],r`La virgule se déplace de $${n}$ rangs vers la droite : exposant $-${n}$.`,['Petit nombre → exposant négatif.']);},
  function cmp(){const n=ri(2,6);return QQ(r`Lequel est le plus grand ?`,r`2\times10^{${n}}`,[r`9\times10^{${n-1}}`,r`9{,}9\times10^{${n-2}}`,r`5\times10^{-${n}}`],r`C'est l'exposant qui compte en premier : $10^{${n}}$ bat $10^{${n-1}}$.`,['Compare d\'abord les exposants.']);},
 ],
 games:[()=>({type:'match',q:'Relie chaque nombre à son écriture',pairs:shuffle([[r`$1000$`,r`$10^{3}$`],[r`$0{,}01$`,r`$10^{-2}$`],[r`$1$`,r`$10^{0}$`],[r`$0{,}1$`,r`$10^{-1}$`]]),why:'Exposant = nombre de zéros (positif) ou rang après la virgule (négatif).'})]},
]});

/* ------------------------------ RACINES ------------------------------ */
chapter({key:'rac',label:'Racines',icon:'🌱',group:G1,c:['#facc15','#ca8a04','#854d0e'],notions:[
{id:'rac1',title:'La racine carrée',
 hook:`<p>Un potager carré a une aire de <b>81 m²</b>.</p><p>Combien de mètres de clôture faut-il pour <b>un côté</b> ? 🥕</p>`,
 play:{text:'Change l\'aire du carré et regarde son côté.',mount:mSlider({sliders:[{id:'n',label:'aire',min:1,max:100,val:20,col:'#ca8a04'}],
   draw:v=>sqFig(v.n),read:v=>`$\\sqrt{${v.n}}\\approx${fmt(Math.round(Math.sqrt(v.n)*100)/100)}$`,
   task:'🎯 Trouve l\'aire du potager dont le côté vaut exactement 9.',goal:v=>v.n===81,got:'Le côté vaut 9 !',
   win:r`$\sqrt{81}=9$ car $9^2=81$. La racine carrée, c'est <b>le côté d'un carré</b> dont on connaît l'aire.`})},
 rule:r`<p>$\sqrt{a}$ est le nombre <b>positif</b> dont le carré vaut $a$.</p><div class="legend"><div>$\sqrt{49}=7$ car $7^2=49$</div><div>$(\sqrt a)^2=a$</div><div>$\sqrt{a}$ n'existe que pour $a\geq0$</div></div>`,ruleFig:sqFig(49),
 drill:[
  function sq(){const r0=ri(2,15);return QQ(r`$\sqrt{${r0*r0}}$ ?`,String(r0),[String(r0*r0/2),String(r0+1),String(-r0)],r`$${r0}^2=${r0*r0}$.`,['Quel nombre multiplié par lui-même donne '+r0*r0+' ?','Une racine carrée est toujours positive.']);},
  function sqsq(){const a=ri(2,13);return QQ(r`$(\sqrt{${a}})^2$ ?`,String(a),[String(a*a),r`\sqrt{${a}}`,String(2*a)],r`Le carré « défait » la racine.`,['Carré et racine sont des opérations inverses.']);},
  function encadre(){const k=ri(3,9),n=k*k+ri(1,2*k);return QQ(r`$\sqrt{${n}}$ est compris entre…`,`$${k}$ et $${k+1}$`,[`$${k-1}$ et $${k}$`,`$${k+1}$ et $${k+2}$`,`$${Math.floor(n/2)}$ et $${Math.floor(n/2)+1}$`],r`$${k}^2=${k*k}<${n}<${(k+1)**2}=${k+1}^2$.`,['Cherche les carrés parfaits autour de '+n+'.']);},
 ],
 games:[()=>{const n=pick([20,30,50,60,90]);return {type:'line',q:`Place $\\sqrt{${n}}$ sur la droite (à 0,2 près)`,min:0,max:10,step:.1,tick:1,start:0,ans:Math.round(Math.sqrt(n)*10)/10,tol:.25,why:`$\\sqrt{${n}}\\approx${fmt(Math.round(Math.sqrt(n)*100)/100)}$ (entre $${Math.floor(Math.sqrt(n))}^2$ et $${Math.ceil(Math.sqrt(n))}^2$).`};}]},
{id:'rac2',title:'Simplifier une racine',
 hook:`<p>Ta calculatrice affiche $\\sqrt{72}=6\\sqrt2$.</p><p>D'où sort ce 6 ? 🧐</p>`,
 play:{text:'Teste plusieurs façons de découper 72 en un carré × autre chose.',mount:mTaps({taps:['4 × 18','9 × 8','36 × 2'],
   draw:i=>sqFig([4,9,36][i]),read:i=>[r`$\sqrt{72}=\sqrt{4}\times\sqrt{18}=2\sqrt{18}$ <small>(on peut encore simplifier…)</small>`,r`$\sqrt{72}=\sqrt9\times\sqrt8=3\sqrt8$ <small>(encore simplifiable)</small>`,r`$\sqrt{72}=\sqrt{36}\times\sqrt2=6\sqrt2$ ✅`][i],
   task:'👆 Essaie les 3 découpages.',got:'Le plus grand carré gagne !',win:r`$\sqrt{a\times b}=\sqrt a\times\sqrt b$. Pour simplifier, on cherche <b>le plus grand carré caché</b> : $72=36\times2$ → $6\sqrt2$.`})},
 rule:r`<p>$\sqrt{a\times b}=\sqrt a\times\sqrt b$</p><p>On cherche le <b>plus grand carré</b> qui divise le nombre : $\sqrt{50}=\sqrt{25\times2}=5\sqrt2$.</p><p class="muted">Carrés à connaître : 4, 9, 16, 25, 36, 49, 64, 81, 100.</p>`,
 ex:()=>{const [k,s]=pick([[3,4],[2,5],[5,4],[3,5]]);return {title:r`Simplifier $\sqrt{${k*s*s}}$`,lines:[r`Plus grand carré qui divise ${k*s*s} : $${s*s}$`,r`$\sqrt{${k*s*s}}=\sqrt{${s*s}\times${k}}$`,r`$=\sqrt{${s*s}}\times\sqrt{${k}}=${s}\sqrt{${k}}$ ✅`]};},
 mine:()=>({q:r`Remets dans l'ordre pour simplifier $\sqrt{48}$`,steps:[r`$48=16\times3$`,r`$\sqrt{48}=\sqrt{16}\times\sqrt3$`,r`$\sqrt{48}=4\sqrt3$`]}),
 drill:[
  function simp(){const [k,s]=pick([[2,3],[3,2],[5,2],[2,5],[3,4],[7,2],[2,4],[6,3],[5,3]]);const n=k*s*s;return QQ(r`Simplifie $\sqrt{${n}}$`,r`${s}\sqrt{${k}}`,[r`${k}\sqrt{${s}}`,r`${s*s}\sqrt{${k}}`,r`${s}\sqrt{${k*s}}`],r`$\sqrt{${n}}=\sqrt{${s*s}\times${k}}=${s}\sqrt{${k}}$.`,['Cherche un carré (4, 9, 16, 25…) qui divise '+n+'.','√(carré × reste) = √carré × √reste.']);},
  function prod(){const [a,b]=pick([[2,8],[3,12],[5,20],[2,18],[3,27],[6,6]]);const v=Math.sqrt(a*b);return QQ(r`$\sqrt{${a}}\times\sqrt{${b}}$ ?`,String(v),[r`\sqrt{${a+b}}`,String(a*b),String(v+1)],r`$\sqrt{${a}\times${b}}=\sqrt{${a*b}}=${v}$.`,['On peut tout mettre sous une seule racine.']);},
  function quo(){const s=ri(2,6),k=pick([2,3]);return QQ(r`$\dfrac{\sqrt{${s*s*k}}}{\sqrt{${k}}}$ ?`,String(s),[String(s*s),r`\sqrt{${s}}`,String(s*k)],r`$\sqrt{\dfrac{${s*s*k}}{${k}}}=\sqrt{${s*s}}=${s}$.`,['Même règle pour la division : √a ÷ √b = √(a÷b).']);},
 ]},
{id:'rac3',title:'Les pièges des racines',
 hook:`<p>$\\sqrt9+\\sqrt{16}=3+4=7$</p><p>Mais $\\sqrt{9+16}=\\sqrt{25}=5$ !</p><p>Alors, a-t-on le droit d'« éclater » une racine sur une somme ? 😈</p>`,
 play:{text:'Compare √(a² + b²) et a + b. Sont-ils un jour égaux ?',mount:mSlider({sliders:[{id:'a',label:'a',min:0,max:12,val:3,col:'#f97316'},{id:'b',label:'b',min:0,max:12,val:4,col:'#0d9488'}],
   draw:v=>`<div class="cmp2"><div><small>$\\sqrt{a^2+b^2}$</small><b>${fmt(Math.round(Math.hypot(v.a,v.b)*100)/100)}</b></div><div><small>$a+b$</small><b>${v.a+v.b}</b></div></div>`,
   task:'🎯 Trouve d\'autres valeurs que 3 et 4 qui donnent une racine entière.',goal:v=>Number.isInteger(Math.hypot(v.a,v.b))&&v.a*v.b>0&&!((v.a===3&&v.b===4)||(v.a===4&&v.b===3)),got:'Un nouveau triplet !',
   win:r`$\sqrt{a^2+b^2}$ est toujours <b>plus petit</b> que $a+b$ (sauf si l'un vaut 0). Donc $\sqrt{a+b}\neq\sqrt a+\sqrt b$ !`})},
 rule:r`<div class="legend"><div>✅ $\sqrt{a\times b}=\sqrt a\times\sqrt b$</div><div>❌ $\sqrt{a+b}\neq\sqrt a+\sqrt b$</div><div>Rendre rationnel : $\dfrac{1}{\sqrt a}=\dfrac{\sqrt a}{a}$</div></div>`,
 drill:[
  function trap(){const [a,b]=pick([[9,16],[36,64],[25,144],[64,36],[16,9]]);const s=Math.sqrt(a+b);return QQ(r`$\sqrt{${a}+${b}}$ ?`,String(s),[String(Math.sqrt(a)+Math.sqrt(b)),String(a+b),String(s+1)],r`On calcule d'abord la somme : $\sqrt{${a+b}}=${s}$.`,['Que vaut ce qu\'il y a sous la racine ?']);},
  function ratio(){const a=pick([2,3,5,7]);return QQ(r`$\dfrac{1}{\sqrt{${a}}}$ s'écrit aussi…`,r`\dfrac{\sqrt{${a}}}{${a}}`,[r`\sqrt{${a}}`,r`\dfrac{${a}}{\sqrt{${a}}}`,r`\dfrac{1}{${a}}`],r`On multiplie en haut et en bas par $\sqrt{${a}}$ : $\dfrac{\sqrt{${a}}}{${a}}$.`,['Multiplie le haut et le bas par la même racine.']);},
  function tf(){const ok=Math.random()<.5;const [a,b]=pick([[4,9],[2,8],[3,12]]);return QQ(ok?r`$\sqrt{${a}}\times\sqrt{${b}}=\sqrt{${a*b}}$ ?`:r`$\sqrt{${a}}+\sqrt{${b}}=\sqrt{${a+b}}$ ?`,ok?'<span>✅ Vrai</span>':'<span>❌ Faux</span>',[ok?'<span>❌ Faux</span>':'<span>✅ Vrai</span>','<span>Ça dépend</span>'],ok?'Le produit « passe » sous la racine.':'La somme ne passe pas sous la racine.',['Produit : oui. Somme : non.']);},
 ]},
]});

/* ------------------------------ POURCENTAGES ------------------------------ */
chapter({key:'pct',label:'Pourcentages',icon:'🏷️',group:G1,c:['#34d399','#059669','#064e3b'],notions:[
{id:'pct1',title:'Prendre un pourcentage',
 hook:`<p>Un jean à <b>80 €</b> est soldé <b>−25 %</b>.</p><p>Combien économises-tu, de tête ? 👖</p>`,
 play:{text:'Fais varier le pourcentage et regarde la part de la barre.',mount:mSlider({sliders:[{id:'t',label:'%',min:0,max:100,step:5,val:10,col:'#059669'}],
   draw:v=>svgBox(`<rect x="20" y="50" width="260" height="46" rx="10" fill="#e5e7eb"/><rect x="20" y="50" width="${2.6*v.t}" height="46" rx="10" fill="#10b981"/><text x="150" y="40" class="ax big">80 €</text><text x="${20+1.3*v.t}" y="80" class="ax big" fill="#fff">${v.t?fmt(0.8*v.t)+' €':''}</text>`,300,110),
   read:v=>`$${v.t}\\,\\%$ de $80=80\\times\\dfrac{${v.t}}{100}=${fmt(0.8*v.t)}$ €`,
   task:'🎯 Trouve l\'économie pour −25 %.',goal:v=>v.t===25,got:'20 € économisés !',
   win:r`25 % = un quart : $80\div4=20$ €. Astuces : <b>10 %</b> = ÷ 10, <b>50 %</b> = ÷ 2, <b>25 %</b> = ÷ 4.`})},
 rule:r`<p>$t\,\%$ de $N$ $=N\times\dfrac{t}{100}$</p><div class="legend"><div>10 % → ÷ 10</div><div>50 % → ÷ 2</div><div>25 % → ÷ 4</div><div>1 % → ÷ 100</div></div>`,
 drill:[
  function of(){const t=pick([5,10,15,20,25,30,40,50,75]),N=pick([40,60,80,120,200,240,300,500]);const v=t*N/100;return QQ(r`$${t}\,\%$ de $${N}$ ?`,fmt(v),[fmt(v*10),fmt(N-v),fmt(v+t)],r`$${N}\times${fmt(t/100)}=${fmt(v)}$.`,['Calcule d\'abord 10 % (÷10), puis ajuste.',`${t} % = ${fmt(t/100)}`]);},
  function part(){const N=pick([20,40,50,80,200]),t=pick([10,20,25,50,75]);const p=t*N/100;return QQ(r`$${fmt(p)}$ sur $${N}$, c'est quel pourcentage ?`,`${t}\\,\\%`,[`${fmt(p)}\\,\\%`,`${fmt(t/2)}\\,\\%`,`${Math.min(100,t+25)}\\,\\%`],r`$\dfrac{${fmt(p)}}{${N}}=${fmt(t/100)}$, soit $${t}\,\%$.`,['Fais part ÷ total, puis × 100.']);},
  function eco(){const P=pick([30,60,80,120,150]),t=pick([10,20,30,40]);return QQ(r`Un article à $${P}$ € est soldé $-${t}\,\%$. L'économie ?`,fmt(P*t/100)+' €',[fmt(P*(100-t)/100)+' €',fmt(t)+' €',fmt(P*t/1000)+' €'],r`$${P}\times${fmt(t/100)}=${fmt(P*t/100)}$ €.`,['L\'économie, c\'est '+t+' % du prix.']);},
 ]},
{id:'pct2',title:'Le coefficient multiplicateur',
 hook:`<p>Un prix de <b>50 €</b> augmente de <b>20 %</b>.</p><p>Peut-on trouver le nouveau prix en <b>une seule</b> multiplication ? ✖️</p>`,
 play:{text:'Choisis une hausse ou une baisse, et regarde par quoi on multiplie.',mount:mSlider({sliders:[{id:'t',label:'%',min:-60,max:100,step:5,val:20,col:'#059669'}],
   draw:v=>evoFig(100,100+v.t),read:v=>`${v.t>=0?'Hausse':'Baisse'} de $${Math.abs(v.t)}\\,\\%$ → $\\times\\,${fmt(1+v.t/100)}$`,
   task:'🎯 Trouve le coefficient d\'une <b>baisse de 30 %</b>.',goal:v=>v.t===-30,got:'× 0,7 !',
   win:r`Baisser de 30 %, c'est garder 70 % : $\times0{,}7$. Monter de 20 %, c'est $\times1{,}2$.`})},
 rule:r`<div class="legend"><div>Hausse de $t\,\%$ : $\times\left(1+\dfrac{t}{100}\right)$</div><div>Baisse de $t\,\%$ : $\times\left(1-\dfrac{t}{100}\right)$</div></div><p>+20 % → × 1,2 · −15 % → × 0,85</p>`,
 ex:()=>{const P=pick([40,80,120]),t=pick([15,25,35]);return {title:r`Prix de $${P}$ € après $+${t}\,\%$`,fig:evoFig(P,P*(1+t/100),'+'+t+' %'),lines:[r`Coefficient : $1+\dfrac{${t}}{100}=${fmt(1+t/100)}$`,r`$${P}\times${fmt(1+t/100)}=${fmt(P*(1+t/100))}$ €`,r`✅ Une seule multiplication !`]};},
 drill:[
  function coef(){const up=Math.random()<.5,t=pick([2,5,8,12,15,20,30,45,60]);const c=fmt(1+(up?t:-t)/100);return QQ(r`Coefficient multiplicateur d'une ${up?'hausse':'baisse'} de $${t}\,\%$ ?`,c,[fmt(1+(up?-t:t)/100),fmt(t/100),fmt(t)],r`$1${up?'+':'-'}${fmt(t/100)}=${c}$.`,['Hausse : 1 + t/100. Baisse : 1 − t/100.']);},
  function rev(){const c=pick([[1.05,'+5'],[0.8,'−20'],[1.5,'+50'],[0.97,'−3'],[2,'+100']]);return QQ(r`Multiplier par $${fmt(c[0])}$, c'est une évolution de…`,c[1]+'\\,\\%',[(c[1].startsWith('+')?'−':'+')+c[1].slice(1)+'\\,\\%',fmt(c[0])+'\\,\\%',(c[1].startsWith('+')?'+':'−')+fmt(Math.abs(c[0]*100))+'\\,\\%'],r`$${fmt(c[0])}-1=${fmt(c[0]-1)}$ → $${c[1]}\,\%$.`,['Enlève 1 au coefficient.']);},
  function np(){const P=pick([20,40,60,80,150,200]),up=Math.random()<.5,t=pick([10,25,50,15]);const v=P*(1+(up?t:-t)/100);return QQ(r`$${P}$ € ${up?'augmente':'baisse'} de $${t}\,\%$. Nouveau prix ?`,fmt(v)+' €',[fmt(P*(1+(up?-t:t)/100))+' €',fmt(P+(up?t:-t))+' €',fmt(P*t/100)+' €'],r`$${P}\times${fmt(1+(up?t:-t)/100)}=${fmt(v)}$ €.`,['Multiplie par le coefficient.'],evoFig(P,v,(up?'+':'−')+t+' %'));},
  function orig(){const t=pick([20,25,50]),P=pick([40,80,100,120]);const after=P*(1+t/100);return QQ(r`Après une hausse de $${t}\,\%$, un prix vaut $${fmt(after)}$ €. Prix de départ ?`,fmt(P)+' €',[fmt(after*(1-t/100))+' €',fmt(after-t)+' €',fmt(after/(1-t/100))+' €'],r`On divise par le coefficient : $${fmt(after)}\div${fmt(1+t/100)}=${P}$ €. (Enlever ${t} % ne marche pas !)`,['Pour revenir en arrière, on DIVISE par le coefficient.']);},
 ]},
{id:'pct3',title:'Évolutions successives',
 hook:`<p>Un article baisse de <b>50 %</b>, puis remonte de <b>50 %</b>.</p><p>Revient-il à son prix de départ ? 🎢</p>`,
 play:{text:'Enchaîne deux évolutions sur 100 €.',mount:mSlider({sliders:[{id:'a',label:'1ʳᵉ',min:-50,max:50,step:10,val:20,col:'#059669'},{id:'b',label:'2ᵉ',min:-50,max:50,step:10,val:-20,col:'#e11d48'}],
   draw:v=>{const x=100*(1+v.a/100),y=x*(1+v.b/100);const mx=Math.max(100,x,y);const h=t=>110*t/mx;return svgBox(`${[[100,'départ','#94a3b8'],[x,'après 1','#10b981'],[y,'après 2','#0284c7']].map(([t,l,c],i)=>`<rect x="${30+i*90}" y="${140-h(t)}" width="60" height="${h(t)}" rx="8" fill="${c}"/><text x="${60+i*90}" y="${132-h(t)}" class="ax big">${fmt(Math.round(t*100)/100)}</text><text x="${60+i*90}" y="160" class="ax">${l}</text>`).join('')}`,300,170);},
   read:v=>`$${fmt(1+v.a/100)}\\times${fmt(1+v.b/100)}=${fmt((1+v.a/100)*(1+v.b/100))}$ → ${(((1+v.a/100)*(1+v.b/100)-1)*100>=0?'+':'')}${fmt(Math.round(((1+v.a/100)*(1+v.b/100)-1)*10000)/100)} %`,
   task:'🎯 Teste −50 % puis +50 %.',goal:v=>v.a===-50&&v.b===50,got:'Surprise : 75 € !',
   win:r`$0{,}5\times1{,}5=0{,}75$ : on a <b>perdu 25 %</b>. Les pourcentages ne s'additionnent pas, <b>les coefficients se multiplient</b>.`})},
 rule:r`<p>Évolutions successives : on <b>multiplie</b> les coefficients.</p><div class="legend"><div>+10 % puis +10 % : $1{,}1\times1{,}1=1{,}21$ → +21 %</div><div>−50 % puis +50 % : $0{,}5\times1{,}5=0{,}75$ → −25 %</div></div>`,
 mine:()=>({q:'Remets dans l\'ordre : +20 % puis −10 %, évolution totale ?',steps:[r`Coefficients : $1{,}2$ et $0{,}9$`,r`$1{,}2\times0{,}9=1{,}08$`,r`$1{,}08-1=0{,}08$ → $+8\,\%$`]}),
 drill:[
  function succ(){const a=pick([10,20,25,50,-10,-20,-50]),b=pick([10,20,-10,-20,30,-30]);const c=(1+a/100)*(1+b/100),t=Math.round((c-1)*10000)/100;const s=t=>(t>0?'+':t<0?'−':'')+fmt(Math.abs(t))+'\\,\\%';return QQ(r`$${a>0?'+':''}${a}\,\%$ puis $${b>0?'+':''}${b}\,\%$ : évolution totale ?`,s(t),[s(a+b),s(t+1),s(a*b/100||5)],r`$${fmt(1+a/100)}\times${fmt(1+b/100)}=${fmt(c)}$ → $${s(t)}$.`,['Transforme chaque pourcentage en coefficient.','Multiplie les deux coefficients.']);},
  function rate(){const v0=pick([20,40,50,80,200]),t=pick([10,20,25,50,-20,-25,-10]);const v1=v0*(1+t/100);return QQ(r`Un prix passe de $${v0}$ à $${fmt(v1)}$. Taux d'évolution ?`,(t>0?'+':'−')+Math.abs(t)+'\\,\\%',[(t>0?'+':'−')+fmt(Math.abs(v1-v0))+'\\,\\%',(t>0?'−':'+')+Math.abs(t)+'\\,\\%',(t>0?'+':'−')+fmt(Math.round(Math.abs(v1-v0)/v1*1000)/10)+'\\,\\%'],r`$\dfrac{${fmt(v1)}-${v0}}{${v0}}=${fmt(t/100)}$.`,['(arrivée − départ) ÷ départ.'],evoFig(v0,v1));},
  function twice(){const t=pick([10,20,30]);const c=(1+t/100)**2;return QQ(r`Deux hausses successives de $${t}\,\%$ : hausse totale ?`,'+'+fmt(Math.round((c-1)*10000)/100)+'\\,\\%',['+'+2*t+'\\,\\%','+'+t+'\\,\\%','+'+t*t+'\\,\\%'],r`$${fmt(1+t/100)}^2=${fmt(c)}$.`,['Ce n\'est pas '+2*t+' % !']);},
 ]},
]});

/* ------------------------------ ENSEMBLES ------------------------------ */
function nestFig(lv,label){
  const sets=[['ℝ','réels','#c7d2fe'],['ℚ','fractions','#a5b4fc'],['ℤ','relatifs','#818cf8'],['ℕ','naturels','#6366f1']];let s='';
  sets.forEach(([n,t,c],i)=>{const x=8+i*22,y=8+i*24,w=284-i*44,h=214-i*54;
    s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${c}" fill-opacity="${i===lv?.95:.3}" stroke="#4f46e5" stroke-width="${i===lv?3.5:1.5}"/><text x="${x+12}" y="${y+18}" class="ax big" text-anchor="start" fill="#312e81">${n} <tspan style="font-size:12px">${t}</tspan></text>`;});
  return svgBox(s+`<text x="150" y="${[214,184,154,114][lv]}" class="ax big" style="font-size:22px" fill="#fff" stroke="#312e81" stroke-width="3" paint-order="stroke">${label}</text>`,300,230);
}
function intervalFig(a,b,lc,rc){const X=v=>30+(v)/(8)*240;return svgBox(`<line x1="20" y1="50" x2="290" y2="50" stroke="${INK}" stroke-width="3"/>${[0,1,2,3,4,5,6,7,8].map(v=>`<line x1="${X(v)}" y1="44" x2="${X(v)}" y2="56" stroke="${INK}" stroke-width="2"/><text x="${X(v)}" y="76" class="ax">${v}</text>`).join('')}
 <line x1="${X(a)}" y1="50" x2="${X(b)}" y2="50" stroke="#4f46e5" stroke-width="9"/><text x="${X(a)}" y="58" class="ax" style="font-size:34px" fill="#4f46e5">${lc?'[':']'}</text><text x="${X(b)}" y="58" class="ax" style="font-size:34px" fill="#4f46e5">${rc?']':'['}</text>`,300,86);}
chapter({key:'ens',label:'Ensembles',icon:'🧩',group:G1,c:['#818cf8','#4f46e5','#312e81'],notions:[
{id:'ens1',title:'Les familles de nombres',
 hook:`<p>$-3$, $0{,}5$, $\\sqrt2$, $7$, $\\pi$…</p><p>Ces nombres vivent-ils tous dans la même maison ? 🏠</p>`,
 play:{text:'Touche chaque nombre pour voir sa plus petite « maison ».',mount:mTaps({taps:['7','−3','0,5','√2','π'],draw:i=>nestFig([3,2,1,0,0][i],['7','−3','0,5','√2','π'][i]),
   read:i=>['$7\\in\\mathbb N$ : entier naturel','$-3\\in\\mathbb Z$ : entier relatif (négatif)','$0{,}5=\\dfrac12\\in\\mathbb Q$ : une fraction','$\\sqrt2\\in\\mathbb R$ : pas une fraction (irrationnel)','$\\pi\\in\\mathbb R$ : irrationnel'][i],
   task:'👆 Touche les 5 nombres.',got:'Toutes les maisons visitées !',win:r`Les ensembles s'emboîtent comme des poupées russes : $\mathbb N\subset\mathbb Z\subset\mathbb Q\subset\mathbb R$.`})},
 rule:r`<div class="legend"><div>$\mathbb N$ : 0, 1, 2, 3…</div><div>$\mathbb Z$ : … −2, −1, 0, 1, 2…</div><div>$\mathbb Q$ : les fractions ($\dfrac12$, $-0{,}75$…)</div><div>$\mathbb R$ : tous ($\sqrt2$, $\pi$…)</div></div>`,ruleFig:nestFig(1,'½'),
 drill:[
  function home(){const t=pick([['-7','\\mathbb Z'],['0{,}25','\\mathbb Q'],['\\pi','\\mathbb R'],['\\dfrac{12}{4}','\\mathbb N'],['\\sqrt{16}','\\mathbb N'],['-\\dfrac23','\\mathbb Q'],['\\sqrt3','\\mathbb R'],['2026','\\mathbb N'],['-0{,}5','\\mathbb Q']]);return QQ(r`Plus petit ensemble contenant $${t[0]}$ ?`,t[1],['\\mathbb N','\\mathbb Z','\\mathbb Q','\\mathbb R'].filter(x=>x!==t[1]),r`Simplifie d'abord si possible, puis cherche la plus petite maison.`,['Est-ce un entier ? positif ? une fraction ?']);},
  function tf(){const t=pick([['\\sqrt4\\in\\mathbb N',true],['-1\\in\\mathbb N',false],['\\dfrac13\\in\\mathbb Z',false],['\\mathbb Z\\subset\\mathbb Q',true],['\\pi\\in\\mathbb Q',false]]);return QQ(r`$${t[0]}$ ?`,t[1]?'<span>✅ Vrai</span>':'<span>❌ Faux</span>',[t[1]?'<span>❌ Faux</span>':'<span>✅ Vrai</span>','<span>Ça dépend</span>'],'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.',['Rappelle-toi les poupées russes.']);},
 ]},
{id:'ens2',title:'Intersection et réunion',
 hook:`<p>Club foot : Léa, Max, Zoé. Club théâtre : Max, Zoé, Tom.</p><p>Qui fait <b>les deux</b> ? Qui fait <b>au moins un</b> club ? ⚽🎭</p>`,
 play:{text:'Touche chaque opération pour voir la zone correspondante.',mount:mTaps({taps:['A ∩ B','A ∪ B'],draw:i=>vennFig([1,2,3,5],[3,5,7],['inter','union'][i]),
   read:i=>[r`$A\cap B=\{3\,;5\}$ : dans A <b>ET</b> dans B`,r`$A\cup B=\{1\,;2\,;3\,;5\,;7\}$ : dans A <b>OU</b> dans B`][i],
   task:'👆 Teste ∩ puis ∪.',got:'',win:r`$\cap$ = <b>ET</b> (la zone commune), $\cup$ = <b>OU</b> (tout, sans doublon).`})},
 rule:r`<div class="legend"><div>$A\cap B$ : <b>ET</b> → éléments communs</div><div>$A\cup B$ : <b>OU</b> → tout réunir sans doublon</div><div>Nombre d'éléments : $|A\cup B|=|A|+|B|-|A\cap B|$</div></div>`,ruleFig:vennFig([1,2,3,5],[3,5,7],'inter'),
 drill:[
  function inter(){const A=shuffle([1,2,3,4,5,6,7,8]).slice(0,4).sort((a,b)=>a-b),B=shuffle([1,2,3,4,5,6,7,8]).slice(0,4).sort((a,b)=>a-b);const S=s=>s.length?'\\{'+s.join(',\\,')+'\\}':'\\varnothing';const I=A.filter(x=>B.includes(x)),U=[...new Set([...A,...B])].sort((a,b)=>a-b);const w=Math.random()<.5;
    return QQ(r`$A=${S(A)}$, $B=${S(B)}$. $A${w?'\\cap ':'\\cup '}B$ ?`,S(w?I:U),[S(w?U:I),S(A.filter(x=>!B.includes(x))),S(B)],w?'Les éléments communs.':'Tout, sans doublon.',[w?'∩ = ET : dans les deux.':'∪ = OU : dans au moins un.'],vennFig(A,B,w?'inter':'union'));},
  function card(){const a=ri(4,9),b=ri(3,8),c=ri(1,Math.min(a,b)-1);return QQ(r`$A$ a $${a}$ éléments, $B$ en a $${b}$, avec $${c}$ en commun. Combien dans $A\cup B$ ?`,String(a+b-c),[String(a+b),String(c),String(a+b+c)],r`$${a}+${b}-${c}=${a+b-c}$ (les communs ne comptent qu'une fois).`,['Si tu additionnes, les communs sont comptés deux fois…']);},
 ]},
{id:'ens3',title:'Les intervalles',
 hook:`<p>« Avoir entre 2 et 5 erreurs »… 2 et 5 sont-ils compris ? 🤔</p><p>En maths, ce sont les <b>crochets</b> qui le disent.</p>`,
 play:{text:'Touche chaque intervalle et regarde les crochets.',mount:mTaps({taps:['[2 ; 5]',']2 ; 5[','[2 ; 5[',']2 ; 5]'],draw:i=>intervalFig(2,5,[1,0,1,0][i],[1,0,0,1][i]),
   read:i=>['2 et 5 <b>inclus</b>','2 et 5 <b>exclus</b>','2 inclus, 5 exclu','2 exclu, 5 inclus'][i],task:'👆 Teste les 4 intervalles.',got:'',win:'Crochet <b>tourné vers le nombre</b> : il est inclus. Crochet <b>tourné vers l\'extérieur</b> : exclu.'})},
 rule:r`<div class="legend"><div>$[2\,;5]$ : $2\leq x\leq5$</div><div>$]2\,;5[$ : $2<x<5$</div><div>$[2\,;+\infty[$ : $x\geq2$ <small>(∞ toujours ouvert)</small></div></div>`,ruleFig:intervalFig(2,5,1,0),
 drill:[
  function mem(){const a=ri(0,4),b=a+ri(2,4),lc=Math.random()<.5,rc=Math.random()<.5;const I=(lc?'[':']')+a+'\\,;'+b+(rc?']':'[');const good=lc?a:(a+0.5);const bad=[lc?a-1:a,rc?b+1:b,b+2];return QQ(r`Quel nombre appartient à $${I}$ ?`,String(good).replace('.','{,}'),bad.map(String).filter(x=>x!==String(good)),'Crochet tourné vers le nombre : inclus ; vers l\'extérieur : exclu.',['Regarde le sens des crochets.'],intervalFig(a,b,lc,rc));},
  function ineq(){const a=ri(-3,5),t=pick([['x\\geq '+a,'['+a+'\\,;+\\infty['],['x>'+a,']'+a+'\\,;+\\infty['],['x<'+a,']-\\infty\\,;'+a+'['],['x\\leq '+a,']-\\infty\\,;'+a+']']]);const all=['['+a+'\\,;+\\infty[',']'+a+'\\,;+\\infty[',']-\\infty\\,;'+a+'[',']-\\infty\\,;'+a+']'];return QQ(r`$${t[0]}$ s'écrit…`,t[1],all.filter(x=>x!==t[1]),'Strict (< ou >) → crochet ouvert ; large (≤ ou ≥) → fermé.',['« ou égal » → crochet fermé.']);},
 ]},
]});

/* ------------------------------ ALGÈBRE ------------------------------ */
chapter({key:'alg',label:'Algèbre',icon:'⚖️',group:G1,c:['#fb923c','#ea580c','#9a3412'],notions:[
{id:'alg1',title:'Résoudre une équation',
 hook:`<p>Sur une balance : <b>3 sacs identiques + 2 kg</b> d'un côté, <b>14 kg</b> de l'autre. Elle est équilibrée.</p><p>Combien pèse un sac ? ⚖️</p>`,
 play:{text:'Essaie différents poids de sac jusqu\'à équilibrer la balance.',mount:mSlider({sliders:[{id:'x',label:'x',min:0,max:8,val:1,col:'#ea580c'}],
   draw:v=>balanceFig(3*v.x+2,14,'3x+2','14'),read:v=>`$3\\times${v.x}+2=${3*v.x+2}$ ${3*v.x+2===14?'=':3*v.x+2<14?'<':'>'} $14$`,
   task:'🎯 Équilibre la balance.',goal:v=>v.x===4,got:'Équilibre !',
   win:r`Sans tâtonner : on enlève 2 kg <b>des deux côtés</b> ($3x=12$), puis on partage en 3 ($x=4$). Une équation est une balance !`})},
 rule:r`<p>Une équation est une <b>balance</b> : on fait toujours <b>la même opération des deux côtés</b>.</p><div class="legend"><div>$3x+2=14$</div><div>$3x=12$ <small>(−2 des deux côtés)</small></div><div>$x=4$ <small>(÷3 des deux côtés)</small></div></div>`,
 ex:()=>{const a=ri(2,6),x=ri(2,9),b=ri(1,9),c=a*x-b;return {title:r`Résoudre $${a}x-${b}=${c}$`,fig:balanceFig(1,1,`${a}x−${b}`,String(c)),lines:[r`On ajoute ${b} des deux côtés : $${a}x=${c+b}$`,r`On divise par ${a} des deux côtés : $x=\dfrac{${c+b}}{${a}}$`,r`$x=${x}$ ✅ Vérif : $${a}\times${x}-${b}=${c}$`]};},
 mine:()=>{const a=ri(2,5),x=ri(2,8),b=ri(2,9);return {q:r`Remets dans l'ordre pour résoudre $${a}x+${b}=${a*x+b}$`,steps:[r`$${a}x=${a*x+b}-${b}$`,r`$${a}x=${a*x}$`,r`$x=\dfrac{${a*x}}{${a}}=${x}$`]};},
 drill:[
  function lin(){const a=ri(2,9),x=ri(-5,9),b=ri(-9,9)||3,c=a*x+b;return QQ(r`Résous $${a}x${b>0?'+':''}${b}=${c}$`,`x=${x}`,[`x=${-x}`,`x=${fmt(Math.round((c+b)/a*100)/100)}`,`x=${c-b}`],r`$${a}x=${c}${b>0?'-':'+'}${Math.abs(b)}=${c-b}$, puis $x=${c-b}\div${a}=${x}$.`,['Commence par enlever le nombre seul des deux côtés.','Ensuite divise par le nombre devant x.']);},
  function both(){const x=ri(1,8),a=ri(4,8),b=ri(1,a-1),c=ri(1,9),d=(a-b)*x+c;return QQ(r`Résous $${a}x+${c}=${b}x+${d}$`,`x=${x}`,[`x=${x+1}`,`x=${fmt(Math.round((d-c)/(a+b)*100)/100)}`,`x=${-x}`],r`On regroupe les $x$ : $${a-b}x=${d-c}$, donc $x=${x}$.`,['Mets tous les x du même côté.','Retire '+b+'x des deux côtés.']);},
  function ineq(){const a=ri(2,6),b=ri(1,12);const t=b/a;return QQ(r`Résous $${a}x-${b}>0$`,`x>${fr(b,a)}`,[`x<${fr(b,a)}`,`x>${b}`,`x>-${fr(b,a)}`],r`$${a}x>${b}$, puis $x>\dfrac{${b}}{${a}}$ (on divise par un positif : le sens ne change pas).`,['Comme une équation…','… mais si on divise par un négatif, on retourne le signe.']);},
 ]},
{id:'alg2',title:'Les identités remarquables',
 hook:`<p>Calcule $101^2$ de tête en 3 secondes. Impossible ? 🧠</p><p>Avec la bonne <b>image</b>, c'est facile.</p>`,
 play:{text:'Un carré de côté a + b se découpe en 4 morceaux. Agrandis-le.',mount:mSlider({sliders:[{id:'a',label:'a',min:1,max:6,val:3,col:'#ea580c'},{id:'b',label:'b',min:1,max:4,val:1,col:'#0284c7'}],
   draw:v=>idFig(v.a,v.b),read:v=>`$(${v.a}+${v.b})^2=${(v.a+v.b)**2}$ et $${v.a}^2+2\\times${v.a}\\times${v.b}+${v.b}^2=${v.a*v.a}+${2*v.a*v.b}+${v.b*v.b}=${(v.a+v.b)**2}$`,
   task:'🎯 Fais un carré de côté 8 ou plus et vérifie le compte.',goal:v=>v.a+v.b>=8,got:'Toujours égal !',
   win:r`$(a+b)^2=a^2+2ab+b^2$ : un grand carré, un petit, et <b>deux rectangles</b> (qu'on oublie souvent !). Donc $101^2=(100+1)^2=10\,000+200+1=10\,201$.`})},
 rule:r`<div class="legend"><div>$(a+b)^2=a^2+2ab+b^2$</div><div>$(a-b)^2=a^2-2ab+b^2$</div><div>$(a-b)(a+b)=a^2-b^2$</div></div>`,ruleFig:idFig(3,2),
 ex:()=>{const n=pick([99,98,51,49,102]);const a=n>=90?100:50,b=Math.abs(n-a),s=n>a?'+':'-';return {title:r`Calculer $${n}^2$ de tête`,lines:[r`$${n}=${a}${s}${b}$`,r`$(${a}${s}${b})^2=${a}^2${s}2\times${a}\times${b}+${b}^2$`,r`$=${a*a}${s}${2*a*b}+${b*b}=${n*n}$ ✅`]};},
 drill:[
  function dev(){const a=ri(2,9),s=pick(['+','-']);return QQ(r`Développe $(x${s}${a})^2$`,`x^2${s}${2*a}x+${a*a}`,[`x^2+${a*a}`,`x^2${s}${a}x+${a*a}`,`x^2${s}${2*a}x${s}${a*a}`],r`$(a${s}b)^2=a^2${s}2ab+b^2$ : $x^2${s}${2*a}x+${a*a}$.`,['Pense au carré découpé : n\'oublie pas les 2 rectangles !','Le « double produit » : 2 × x × '+a+'.']);},
  function fac(){const a=ri(2,12);return QQ(r`Factorise $x^2-${a*a}$`,`(x-${a})(x+${a})`,[`(x-${a})^2`,`(x-${a*a})(x+1)`,`(x+${a})^2`],r`$a^2-b^2=(a-b)(a+b)$ avec $b=${a}$.`,['Reconnais une différence de deux carrés.']);},
  function mental(){const n=pick([99,98,101,102,49,51,999]);const a=n>500?1000:n>=90?100:50,b=Math.abs(n-a);return QQ(r`$${n}^2$ ?`,nb(n*n),[nb(a*a+b*b),nb(n*n+2*b),nb(a*a-b*b)],r`$(${a}${n>a?'+':'-'}${b})^2=${nb(a*a)}${n>a?'+':'-'}${nb(2*a*b)}+${b*b}=${nb(n*n)}$.`,['Écris '+n+' comme '+a+(n>a?' + ':' − ')+b+'.']);},
  function fac2(){const a=ri(2,6);return QQ(r`Factorise $x^2+${2*a}x+${a*a}$`,`(x+${a})^2`,[`(x+${2*a})^2`,`(x+${a})(x-${a})`,`(x+${a*a})^2`],r`$x^2+2\times${a}\times x+${a}^2=(x+${a})^2$.`,['Reconnais a² + 2ab + b².']);},
 ]},
{id:'alg3',title:'Le produit nul',
 hook:`<p>$(x-3)(x+5)=0$</p><p>Peut-on trouver $x$ <b>sans rien développer</b> ? 🕵️</p>`,
 play:{text:'Fais varier x et regarde chaque parenthèse.',mount:mSlider({sliders:[{id:'x',label:'x',min:-7,max:6,val:0,col:'#ea580c'}],
   draw:v=>`<div class="cmp2"><div><small>$x-3$</small><b>${v.x-3}</b></div><div><small>$x+5$</small><b>${v.x+5}</b></div><div><small>produit</small><b style="color:${(v.x-3)*(v.x+5)===0?'#16a34a':'inherit'}">${(v.x-3)*(v.x+5)}</b></div></div>`,
   task:'🎯 Trouve une valeur qui rend le produit nul.',goal:v=>(v.x-3)*(v.x+5)===0,got:'Produit nul !',
   win:r`Un produit est nul dès qu'<b>un de ses facteurs</b> est nul : $x-3=0$ ou $x+5=0$, donc $x=3$ <b>ou</b> $x=-5$. Deux solutions !`})},
 rule:r`<p>$A\times B=0 \iff A=0$ <b>ou</b> $B=0$.</p><p>👉 Pour résoudre, on <b>factorise d'abord</b> : $x^2-4x=0 \iff x(x-4)=0 \iff x=0$ ou $x=4$.</p>`,
 mine:()=>({q:r`Remets dans l'ordre pour résoudre $x^2-9=0$`,steps:[r`$x^2-9=(x-3)(x+3)$`,r`$(x-3)(x+3)=0$`,r`$x-3=0$ ou $x+3=0$`,r`$x=3$ ou $x=-3$`]}),
 drill:[
  function pn(){const a=ri(-6,6),b=ri(-6,6);if(a===b)return GA3.pn();const P=v=>v>0?`(x-${v})`:v<0?`(x+${-v})`:'x';return QQ(r`Solutions de $${P(a)}${P(b)}=0$ ?`,`${a}\\text{ et }${b}`,[`${-a}\\text{ et }${-b}`,`${a*b}`,`${a}\\text{ seulement}`],r`Produit nul : $x=${a}$ ou $x=${b}$.`,['Quand est-ce que chaque parenthèse vaut 0 ?']);},
  function com(){const a=ri(2,9);return QQ(r`Solutions de $x^2-${a}x=0$ ?`,`0\\text{ et }${a}`,[`${a}\\text{ seulement}`,`${-a}\\text{ et }0`,`\\sqrt{${a}}`],r`On factorise par $x$ : $x(x-${a})=0$, donc $x=0$ ou $x=${a}$.`,['Factorise par x.','Puis produit nul.']);},
  function sq(){const a=ri(2,9);return QQ(r`Solutions de $x^2=${a*a}$ ?`,`${a}\\text{ et }-${a}`,[`${a}\\text{ seulement}`,`${a*a/2}`,`${2*a}`],r`$x^2-${a*a}=(x-${a})(x+${a})=0$.`,['N\'oublie pas la solution négative !']);},
 ]},
]});
const GA3={pn:()=>chapOf('alg').notions[2].drill[0]()};
