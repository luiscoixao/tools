/* =====================================================================
   GYM MATHS : revoir les fondamentaux en petits exercices ludiques
   8 « muscles » · formats : vrai/faux, relier, QCM
   la séance du jour cible le muscle le plus faible
   ===================================================================== */
/* « Trouve l'erreur » : on touche la ligne fausse d'un calcul */
const GYMM=[
 {k:'pri',l:'➗ Priorités',c:'#f97316',g:[
  function p1(){const a=ri(2,9),b=ri(2,9),c=ri(2,9);return DX(QQ(`$${a}+${b}\\times${c}$ ?`,N(a+b*c),[N((a+b)*c),N(a+b+c),N(a*b+c)],'',['Quelle opération passe en premier ?']),
    {steps:[['D\'abord ×',`$${b}\\times${c}=${b*c}$`],['Puis +',`$${a}+${b*c}=${a+b*c}$`]],tip:'× et ÷ passent avant + et −.',errs:['Tu as calculé de gauche à droite : la <b>multiplication passe avant</b> l\'addition.','Tu as additionné au lieu de multiplier.','Tu as multiplié le mauvais nombre.']});},
  function p3(){const b=pick([2,3,4]),c=pick([2,3,5]),a=b*c*ri(1,4);return DX(QQ(`$${a}\\div${b}\\times${c}$ ?`,N(a/b*c),[fmt(a/(b*c)),N(a/b+c)],'',['× et ÷ ont la même priorité.']),
    {steps:[['Gauche à droite',`$${a}\\div${b}=${a/b}$`],['Puis ×',`$${a/b}\\times${c}=${a/b*c}$`]],tip:'Entre × et ÷, on calcule de gauche à droite.',errs:[`Tu as fait $${b}\\times${c}$ d'abord : entre × et ÷, on va <b>de gauche à droite</b>.`,'Tu as additionné au lieu de multiplier.']});},
 ]},
 {k:'fra',l:'½ Fractions',c:'#8b5cf6',g:[
  function f1(){let b,d;do{b=pick([2,3,4,5,6]);d=pick([2,3,4,5,6]);}while(b===d);const a=ri(1,b-1),c=ri(1,d-1);
    return DX(QQ(`$\\dfrac{${a}}{${b}}+\\dfrac{${c}}{${d}}$ ?`,fr(a*d+c*b,b*d),[fr(a+c,b+d),fr(a+c,b*d),fr(a*c,b*d)],'',['Il faut le même dénominateur.']),
    {steps:[['Même dénominateur',`$\\dfrac{${a*d}}{${b*d}}+\\dfrac{${c*b}}{${b*d}}$`],['Additionne les numérateurs',`$\\dfrac{${a*d+c*b}}{${b*d}}=${fr(a*d+c*b,b*d)}$`]],tip:'On n\'additionne jamais les dénominateurs : on les rend égaux d\'abord.',errs:['Tu as additionné les numérateurs <b>et</b> les dénominateurs : on met d\'abord au même dénominateur.','Tu as mis au même dénominateur, mais oublié d\'ajuster les numérateurs.','Ça, c\'est le produit, pas la somme.']});},
  function f2(){const P=shuffle([['\\dfrac12','0{,}5'],['\\dfrac14','0{,}25'],['\\dfrac34','0{,}75'],['\\dfrac15','0{,}2'],['\\dfrac1{10}','0{,}1'],['\\dfrac25','0{,}4'],['\\dfrac18','0{,}125']]).slice(0,4);
    return {type:'match',q:'Relie chaque fraction à son écriture décimale',pairs:P.map(([x,y])=>[`$${x}$`,`$${y}$`]),why:'Une fraction, c\'est une division : numérateur ÷ dénominateur.',tip:'À connaître par cœur : ½ = 0,5 · ¼ = 0,25 · ¾ = 0,75 · ⅕ = 0,2.'};},
  function f3(){const a=ri(1,5),b=ri(2,7),c=ri(1,5),d=ri(2,7);return DX(QQ(`$\\dfrac{${a}}{${b}}\\div\\dfrac{${c}}{${d}}$ ?`,fr(a*d,b*c),[fr(a*c,b*d),fr(b*c,a*d)].filter(x=>x!==fr(a*d,b*c)),'',['Diviser, c\'est multiplier par…']),
    {steps:[['Inverse la 2ᵉ fraction',`$\\dfrac{${c}}{${d}}\\to\\dfrac{${d}}{${c}}$`],['Multiplie',`$\\dfrac{${a}\\times${d}}{${b}\\times${c}}=${fr(a*d,b*c)}$`]],tip:'Diviser par une fraction = multiplier par son inverse.',errs:['Tu as multiplié : pour diviser, on multiplie par l\'<b>inverse</b>.','Tu as inversé la mauvaise fraction : c\'est la <b>deuxième</b> qu\'on retourne.']});},
 ]},
 {k:'sig',l:'± Signes',c:'#e11d48',g:[
  function s1(){const a=ri(2,9),b=ri(2,9),t=pick([0,1,2,3]);
    const C=[[`(-${a})\\times(-${b})`,a*b,'− × − = +'],[`(-${a})\\times${b}`,-a*b,'− × + = −'],[`-${a}-${b}`,-a-b,'Deux « − » qui se suivent en soustraction : on recule deux fois.'],[`${a}-(-${b})`,a+b,'Soustraire un négatif = ajouter : −(−b) = +b.']][t];
    return DX(QQ(`$${C[0]}$ ?`,N(C[1]),[N(-C[1]),N(t<2?a+b:a-b),N(t<2?-(a+b):b-a)],'',['Attention au signe.']),{tip:C[2]});},
  function s2(){const a=ri(2,9);return DX(QQ(`$-${a}^2$ ?`,N(-a*a),[N(a*a),N(-2*a)],'',['Sur quoi porte le carré ?']),
    {steps:[['Le carré porte sur le nombre',`$${a}^2=${a*a}$`],['On garde le −',`$-${a}^2=-${a*a}$`]],tip:`Sans parenthèses, le carré ne touche pas le signe : $-${a}^2=-${a*a}$, mais $(-${a})^2=${a*a}$.`,errs:['Ça, c\'est $(-'+a+')^2$ : sans parenthèses, le carré ne porte que sur '+a+'.','Le carré, c\'est × lui-même, pas × 2.']});},
 ]},
 {k:'dev',l:'🧮 Développer',c:'#0ea5e9',g:[
  function d1(){const k=ri(2,7),a=ri(1,9);return DX(QQ(`Développe $${k}(x+${a})$`,`${k}x+${k*a}`,[`${k}x+${a}`,`x+${k*a}`,`${k+1}x+${a}`],'',['Le nombre devant multiplie chaque terme.']),
    {steps:[['× le 1ᵉʳ terme',`$${k}\\times x=${k}x$`],['× le 2ᵉ terme',`$${k}\\times${a}=${k*a}$`]],tip:'k(a + b) = ka + kb : on distribue à TOUS les termes.',errs:[`Tu n'as multiplié que le $x$ : $${k}$ multiplie aussi le $${a}$.`,`Tu n'as multiplié que le $${a}$.`,'Tu as additionné au lieu de multiplier.']});},
  function d2(){const a=ri(1,6),b=ri(1,6);return DX(QQ(`Développe $(x+${a})(x+${b})$`,`x^2+${a+b}x+${a*b}`,[`x^2+${a*b}`,`x^2+${a*b}x+${a+b}`,`2x+${a+b}`],'',['Chaque terme de la 1ʳᵉ parenthèse multiplie chaque terme de la 2ᵉ.']),
    {steps:[['4 produits',`$x\\cdot x+x\\cdot${b}+${a}\\cdot x+${a}\\cdot${b}$`],['Regroupe',`$x^2+${a+b}x+${a*b}$`]],tip:'Double distributivité : 4 produits (2 × 2), puis on regroupe.',errs:['Tu as oublié les termes croisés ($'+b+'x$ et $'+a+'x$).','Tu as inversé : la somme va devant $x$, le produit à la fin.','Tu as additionné au lieu de multiplier.']});},
 ]},
 {k:'equ',l:'⚖️ Équations',c:'#16a34a',g:[
  function e1(){const a=ri(2,7),x=ri(-5,9),b=ri(1,12),c=a*x+b;return DX(QQ(`Résous $${a}x+${b}=${c}$`,`x=${x}`,[`x=${fr(c+b,a)}`,`x=${(c-b)}`,`x=${-x}`].filter(v=>v!==`x=${x}`),'',['Isole x étape par étape.']),
    {steps:[['Enlève le +'+b,`$${a}x=${c}-${b}=${c-b}$`],['Divise par '+a,`$x=${c-b}\\div${a}=${x}$`]],tip:'Ce qu\'on fait d\'un côté, on le fait de l\'autre : −'+b+' des deux côtés, puis ÷'+a+'.',errs:[`Tu as ajouté $${b}$ : pour l'enlever, il faut le <b>soustraire</b>.`,`Tu as oublié de diviser par $${a}$.`,'Erreur de signe.']});},
  function e3(){const a=ri(2,9),b=ri(2,9);return DX(QQ(`Résous $\\dfrac{x}{${a}}=${b}$`,`x=${a*b}`,[`x=${fr(b,a)}`,`x=${a+b}`,`x=${b-a}`],'',['Comment défaire une division ?']),
    {steps:[['Multiplie par '+a,`$x=${b}\\times${a}=${a*b}$`]],tip:'Pour défaire « ÷ a », on multiplie par a.',errs:['Tu as divisé : pour défaire une division, on <b>multiplie</b>.','Tu as additionné au lieu de multiplier.']});},
 ]},
 {k:'pro',l:'📏 Proportions',c:'#ca8a04',g:[
  function r1(){const n=pick([2,3,4,5]),u=pick([2,3,4,5,6,8,12]),m=ri(n+1,n+6),it=pick(['cahiers','croissants','billets','stylos']);
    return DX(QQ(`$${n}$ ${it} coûtent $${n*u}$ €. Combien coûtent $${m}$ ${it} ?`,`${m*u}\\text{ €}`,[`${n*u+(m-n)}\\text{ €}`,`${n*u*m}\\text{ €}`,`${m*u+u}\\text{ €}`],'',['Combien coûte un seul ?']),
    {steps:[['Passe par 1',`$${n*u}\\div${n}=${u}$ € l'unité`],['× '+m,`$${u}\\times${m}=${m*u}$ €`]],tip:'Règle de trois : on passe par l\'unité, puis on multiplie.',errs:['Tu as ajouté la différence de quantité : ce n\'est pas proportionnel.',`Tu as multiplié le prix total par $${m}$ : passe d'abord par le prix d'<b>un</b>.`,'Petite erreur de calcul.']});},
  function r2(){const k=pick([10000,25000,50000,100000]),cm=ri(2,8),m=cm*k/100,g=m>=1000?fmt(m/1000)+'\\text{ km}':m+'\\text{ m}';
    return DX(QQ(`Sur une carte au $1/${String(k).replace(/(\d)(\d{3})$/,'$1\\,$2')}$, $${cm}$ cm représentent…`,g,[m>=1000?fmt(m/100)+'\\text{ km}':fmt(m*10)+'\\text{ m}',m>=1000?fmt(m/10000)+'\\text{ km}':fmt(m/10)+'\\text{ m}',cm*k+'\\text{ km}'],'',['1 cm sur la carte = combien en vrai ?']),
    {steps:[['× l\'échelle',`$${cm}\\times${k}=${cm*k}$ cm en vrai`],['Convertis',`$${cm*k}$ cm $=${fmt(m)}$ m${m>=1000?` $=${fmt(m/1000)}$ km`:''}`]],tip:'1 cm sur la carte = k cm en vrai ; 100 000 cm = 1 km.'});},
  function r3(){const v=pick([12,20,30,40,60]),t=pick([[0.5,'30 min'],[1.5,'1 h 30'],[2.5,'2 h 30'],[1.25,'1 h 15'],[0.75,'45 min']]),d=v*t[0];
    return DX(QQ(`$${fmt(d)}$ km en ${t[1]}. Vitesse moyenne ?`,`${v}\\text{ km/h}`,[`${fmt(Math.round(d/(Math.floor(t[0])+(t[0]%1)*60/100)*10)/10)}\\text{ km/h}`,`${fmt(d*t[0])}\\text{ km/h}`,`${v+10}\\text{ km/h}`],'',['Écris la durée en heures décimales.']),
    {steps:[['Durée en heures',`${t[1]} $=${fmt(t[0])}$ h`],['Vitesse = distance ÷ durée',`$${fmt(d)}\\div${fmt(t[0])}=${v}$ km/h`]],tip:'30 min = 0,5 h ; 15 min = 0,25 h ; 45 min = 0,75 h (et pas 0,30 ou 0,45).',errs:[`Erreur de conversion : ${t[1]} ne fait pas ${fmt(Math.floor(t[0])+(t[0]%1)*60/100)} h, mais $${fmt(t[0])}$ h.`,'Tu as multiplié : vitesse = distance <b>÷</b> durée.']});},
 ]},
 {k:'p10',l:'🔟 Puissances & arrondis',c:'#14b8a6',g:[
  function q1(){const a=ri(2,6),b=ri(-4,5),m=Math.random()<.5;const g=m?a+b:a-b;return DX(QQ(`$10^{${a}}${m?'\\times':'\\div'}10^{${b}}$ ?`,`10^{${g}}`,[`10^{${m?a*b:a+b}}`,`10^{${m?a-b:b-a}}`,`100^{${g}}`].filter(x=>x!==`10^{${g}}`),'',['Que fait-on des exposants ?']),
    {steps:[[m?'× : on additionne':'÷ : on soustrait',`$${a}${m?'+':'-'}${PN(b)}=${g}$`]],tip:'10ᵃ × 10ᵇ = 10ᵃ⁺ᵇ ; 10ᵃ ÷ 10ᵇ = 10ᵃ⁻ᵇ.'});},
  function q2(){const d=ri(1,9),k=pick([-5,-4,-3,-2,3,4,5,6]);const s=k<0?'0{,}'+'0'.repeat(-k-1)+d:d+'\\,'.repeat(0)+'0'.repeat(k).replace(/(0{3})$/,'\\,$1');
    return DX(QQ(`$${s}=${d}\\times10^{?}$`,String(k),[String(-k),String(k<0?k+1:k-1),String(k<0?k-1:k+1)],'',['De combien de rangs la virgule bouge-t-elle ?']),
    {steps:[['Compte les rangs',`La virgule se déplace de $${Math.abs(k)}$ rang${Math.abs(k)>1?'s':''} pour arriver à $${d}$.`],['Le signe',k<0?'Nombre plus petit que 1 : exposant négatif.':'Grand nombre : exposant positif.']],tip:'Petit nombre (moins de 1) → exposant négatif ; grand nombre → positif.'});},
  function q3(){const n=ri(10001,99999),x=n/1000,h=Math.random()<.5,g=h?Math.round(n/10)/100:Math.round(n/100)/10,tr=h?Math.floor(n/10)/100:Math.floor(n/100)/10;
    const alt=g===tr?(h?g+0.01:g+0.1):tr;return DX(QQ(`Arrondi de $${fmt(x)}$ au ${h?'centième':'dixième'} ?`,fmt(g),[fmt(alt),fmt(Math.round(x)),fmt(Math.round(n/1000*10)/10===g?x:Math.round(n/10)/100)].filter(v=>v!==fmt(g)),'',['Regarde le chiffre juste après.']),
    {steps:[['Chiffre décisif',`le chiffre après le ${h?'centième':'dixième'} : $${String(n)[h?4:3]}$`],['Décide',+String(n)[h?4:3]>=5?'5 ou plus : on arrondit au-dessus.':'Moins de 5 : on garde.']],tip:'Arrondir : on regarde le chiffre suivant ; 5 ou plus → on monte.'});},
 ]},
 {k:'con',l:'📐 Conversions',c:'#db2777',g:[
  function c1(){const t=pick([['m','cm',100],['km','m',1000],['cm','mm',10],['m','mm',1000],['cm','m',0.01],['mm','cm',0.1]]),x=pick([2,3,5,7,12,25,40,150]),g=x*t[2];
    return DX(QQ(`$${x}$ ${t[0]} $=$ ? ${t[1]}`,fmt(g),[fmt(g*10),fmt(g/10),fmt(x/t[2])].filter(v=>v!==fmt(g)),'',['Combien de rangs entre les deux unités ?']),
    {steps:[['Le rapport',`1 ${t[0]} = $${fmt(t[2])}$ ${t[1]}`],['Multiplie',`$${x}\\times${fmt(t[2])}=${fmt(g)}$`]],tip:'km · hm · dam · m · dm · cm · mm : chaque pas = × 10.'});},
  function c2(){const x=pick([2,3,5,7,12]),t=pick([['m²','cm²',10000],['m²','dm²',100],['km²','m²',1000000]]);
    return DX(QQ(`$${x}$ ${t[0]} $=$ ? ${t[1]}`,String(x*t[2]).replace(/\B(?=(\d{3})+$)/g,'\\,'),[String(x*Math.sqrt(t[2])).replace(/\B(?=(\d{3})+$)/g,'\\,'),String(x*t[2]*10).replace(/\B(?=(\d{3})+$)/g,'\\,')],'',['Pour une aire, chaque rang compte double.']),
    {steps:[['Un carré de côté 1',`1 ${t[0]} = $${Math.sqrt(t[2])}\\times${Math.sqrt(t[2])}$ ${t[1]}`],['Multiplie',`$${x}\\times${t[2]}$`]],tip:'Aires : × 100 à chaque rang (car 10 × 10). Volumes : × 1000.',errs:[`Tu as converti comme une longueur : pour une aire, c'est $${Math.sqrt(t[2])}$ <b>au carré</b>.`,'Un zéro de trop.']});},
  function c3(){const t=pick([['1 h 15','1{,}25','1{,}15'],['2 h 30','2{,}5','2{,}3'],['45 min','0{,}75','0{,}45'],['1 h 45','1{,}75','1{,}45'],['20 min','\\dfrac13','0{,}2']]);
    return DX(QQ(`${t[0]} $=$ ? h`,t[1],[t[2],'1{,}5'].filter(v=>v!==t[1]),'',['1 h = 60 min, pas 100.']),
    {steps:[['Minutes ÷ 60','Une heure a 60 minutes : on divise les minutes par 60.'],['Résultat',`${t[0]} $=${t[1]}$ h`]],tip:'15 min = ¼ h = 0,25 h · 30 min = 0,5 h · 45 min = 0,75 h.',errs:['Une heure fait <b>60</b> minutes, pas 100 : les minutes ne se recopient pas après la virgule.']});},
 ]},
];
function N(v){return String(v);}
function gymM(k){st.gymM=st.gymM||{};return st.gymM[k];}
function weakMuscle(){return GYMM.slice().sort((a,b)=>(gymM(a.k)??.5)-(gymM(b.k)??.5)||Math.random()-.5)[0];}
function gymItem(m){const g=pick(m.g);const o=g();o.gen=g.name;o.mus=m.k;return {kind:'item',label:m.l,it:o.type?o:vary(o,['qcm','qcm','tf'])};}
function startGym(only){
  const w=only||weakMuscle(),others=shuffle(GYMM.filter(m=>m!==w)).slice(0,2);
  const plan=only?Array(8).fill(w):[w,w,w,w,others[0],others[0],others[1],others[1]];
  const used={};const q=shuffle(plan).map(m=>{let x,t=0;do{x=gymItem(m);t++;}while(used[m.k+x.it.gen]&&t<6);used[m.k+x.it.gen]=1;return x;});
  openSession({mode:'gym',title:'🏋️ Gym',color:w.c,queue:q,
    onItem:(s,ok)=>{const k=s.it.mus;if(!k)return;st.gymM=st.gymM||{};const o=st.gymM[k]??.5;st.gymM[k]=Math.round((o*.7+(ok&&!s.it.penalty?1:0)*.3)*100)/100;},
    onEnd:()=>{const ok=S.nq-[...S.missed].length;st.gym=st.gym||{n:0,last:''};st.gym.n++;st.gym.last=dayStr(new Date());
      endScreen({title:ok>=7?'Fondamentaux solides !':ok>=5?'Bonne séance !':'Séance faite !',emoji:'🏋️',bonus:10,
        extra:`<p class="muted">${ok} / ${S.nq} du premier coup. Muscle travaillé : <b>${w.l}</b>.</p>`});}});
}
function gymSheet(){
  const w=weakMuscle();
  sheet(`<div class="sh-h">🏋️ Gym maths<small>Les fondamentaux, en petits exercices</small></div>
    <button class="cta" id="gymGo">▶ Séance du jour · ${w.l}</button>
    <p class="muted" style="text-align:center;margin:8px 0 12px">L'appli cible ton muscle le plus faible. Ou choisis-en un :</p>
    <div class="musc">${GYMM.map((m,i)=>{const v=gymM(m.k);return `<button data-i="${i}" style="--k:${m.c}"><b>${m.l}</b><i><em style="width:${Math.round((v??0)*100)}%"></em></i></button>`;}).join('')}</div>`);
  $('gymGo').onclick=()=>{$('sheetw').classList.remove('open');startGym();};
  document.querySelectorAll('.musc button').forEach(b=>b.onclick=()=>{$('sheetw').classList.remove('open');startGym(GYMM[+b.dataset.i]);});
}
function gymBtn(){const b=$('gymBtn');if(!b)return;const done=st.gym&&st.gym.last===dayStr(new Date());
  b.innerHTML=`<span>🏋️ Gym maths</span><small>${done?'✅ Fait aujourd\'hui · encore une séance ?':'Revois les fondamentaux en 3 minutes'}</small>`;b.onclick=gymSheet;}
