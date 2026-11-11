/* =====================================================================
   LE PROF : diagnostic des erreurs, explications alternatives,
   exemples résolus, bilan de séance, écran « Mon prof »
   ===================================================================== */

/* ---------- erreurs typiques : ERRS['notion:générateur'][i] = explication du distracteur n°i ---------- */
const ERRS={
 'pui1:mul':['Tu as <b>multiplié</b> les exposants : quand on multiplie des puissances de même base, on les <b>additionne</b>.','Tu as multiplié les bases : la base reste la même, seuls les exposants s\'additionnent.','Tu as soustrait les exposants : ça, c\'est pour la division.'],
 'pui1:div':['Tu as additionné : pour <b>diviser</b>, on <b>soustrait</b> les exposants.','La base ne change pas : seuls les exposants se soustraient.','Attention à l\'ordre : exposant du haut <b>moins</b> exposant du bas.'],
 'pui1:pp':['Puissance de puissance : on <b>multiplie</b> les exposants, on ne les additionne pas.','Le nombre extérieur s\'applique à l\'exposant, pas à la base.','On multiplie les exposants, on ne les élève pas à la puissance.'],
 'pui1:val':['$a^n$ n\'est pas $a\\times n$ : c\'est $a$ multiplié $n$ fois par lui-même.','Il manque un facteur : compte bien les multiplications.','Erreur de calcul : refais la multiplication pas à pas.'],
 'pui2:neg':['Le signe − de l\'exposant ne rend pas le nombre négatif : il veut dire « <b>inverse</b> ».','$a^{-n}$ n\'est pas $-a\\times n$ : c\'est $\\dfrac1{a^n}$.','Tu as calculé $a\\times n$ au lieu de $a^n$ sous la fraction.'],
 'pui2:zero':['Tout nombre non nul à la puissance 0 vaut <b>1</b>, pas 0.','Puissance 0 : « aucun facteur », le résultat est 1, pas le nombre lui-même.','C\'est possible : $a^0=1$ (regarde l\'escalier des puissances de 10).'],
 'pct1:of':['Erreur de virgule : 10 % = diviser par 10.','Tu as calculé ce qui <b>reste</b>, pas le pourcentage demandé.','On multiplie par $\\dfrac t{100}$, on n\'ajoute pas $t$.'],
 'pct2:coef':['Inversé : hausse → $1+\\dfrac t{100}$ ; baisse → $1-\\dfrac t{100}$.','Tu as oublié le « 1 » : le coefficient garde aussi le prix de départ.','Le coefficient est proche de 1 ; ce n\'est pas le pourcentage lui-même.'],
 'pct2:orig':['Enlever le même pourcentage ne ramène pas au départ : il faut <b>diviser</b> par le coefficient.','On ne soustrait pas un pourcentage comme un nombre d\'euros.','Tu as divisé par le coefficient d\'une baisse au lieu de celui d\'une hausse.'],
 'pct3:succ':['Tu as <b>additionné</b> les pourcentages : des évolutions successives se <b>multiplient</b> (on multiplie les coefficients).','Presque : refais le produit des deux coefficients.','On multiplie les coefficients (comme 1,2 × 0,9), pas les pourcentages.'],
 'pct3:twice':['Deux hausses de $t\\,\\%$ ne font pas $2t\\,\\%$ : la 2ᵉ s\'applique à un prix déjà augmenté.','Tu n\'as compté qu\'une seule hausse.','On multiplie les coefficients (1,1 × 1,1), pas les pourcentages.'],
 'rac1:sq':['La racine carrée n\'est pas la moitié : cherche le nombre qui, au carré, redonne le nombre.','Vérifie en mettant au carré : ça ne redonne pas le bon nombre.','Une racine carrée est toujours <b>positive</b>.'],
 'rac2:simp':['Inversé : c\'est la racine du carré qui sort devant ($\\sqrt{9}=3$).','Le carré sort sous forme de sa racine, pas tel quel.','Tu n\'as pas fini : il reste un carré sous la racine.'],
 'rac3:trap':['$\\sqrt{a+b}\\neq\\sqrt a+\\sqrt b$ : calcule d\'abord la somme sous la racine.','Tu as oublié de prendre la racine.','Erreur de calcul.'],
 'alg1:lin':['Erreur de signe en faisant passer un nombre de l\'autre côté.','En passant de l\'autre côté, $+b$ devient $-b$ (et inversement).','Tu as oublié de diviser par le nombre devant $x$.'],
 'alg2:dev':['Tu as oublié le <b>double produit</b> $2ab$ (les deux rectangles du carré découpé !).','Le double produit vaut $2ab$, pas $ab$.','Le dernier terme $b^2$ est toujours positif.'],
 'alg2:fac':['$(x-a)^2$ donne $x^2-2ax+a^2$, pas $x^2-a^2$.','On factorise avec la racine de $b^2$, pas avec $b^2$.','$(x+a)^2$ ne contient pas de signe −.'],
 'alg3:sq':['Il y a aussi une solution <b>négative</b> : $(-a)^2=a^2$.','$x^2=k$ ne se résout pas en divisant par 2 : on prend la racine.','La solution est la racine, pas le double.'],
 'alg3:pn':['Erreur de signe : $x-a=0$ donne $x=a$ (et $x+a=0$ donne $x=-a$).','Ce n\'est pas le produit des nombres : chaque parenthèse donne une solution.','Les deux parenthèses peuvent valoir 0 : il y a deux solutions.'],
 'fon1:img':['Erreur de calcul : refais le calcul pas à pas.','Erreur de signe : attention, le carré d\'un négatif est positif.','Ça, c\'est la valeur de $x$, pas $f(x)$.'],
 'fon2:slope':['Erreur de signe : garde le même ordre en haut et en bas, $(y_B-y_A)\\div(x_B-x_A)$.','Inversé : la pente, c\'est $\\Delta y\\div\\Delta x$, pas l\'inverse.','N\'oublie pas de diviser par $\\Delta x$.'],
 'fon3:roots':['Erreur de signe dans $\\dfrac{-b\\pm\\sqrt\\Delta}{2a}$ : n\'oublie pas le $-b$.','Ici $\\Delta>0$ : il y a <b>deux</b> solutions.','$b$ et $c$ ne sont pas les solutions de l\'équation.'],
 'sui1:un':['Décalage d\'un rang : $u_n=u_0+nr$ (on part de $u_0$, il y a $n$ pas).','On ajoute $r$ à chaque pas : ce n\'est pas tout multiplier.','Un pas de trop : compte $n$ pas depuis $u_0$.'],
 'sui2:un':['Suite géométrique : on <b>multiplie</b> par $q$, on n\'ajoute pas.','Décalage d\'un rang : $u_n=u_0\\times q^n$.','$q^n$ n\'est pas $n\\times q$.'],
 'geo1:hyp':['On n\'additionne pas les côtés : on additionne leurs <b>carrés</b>, puis on prend la racine.','Vérifie avec $a^2+b^2=c^2$.','Vérifie avec $a^2+b^2=c^2$.'],
 'geo1:leg':['On soustrait les <b>carrés</b>, pas les longueurs.','Le côté cherché est forcément plus petit que l\'hypoténuse.','Vérifie : hypoténuse² − côté².'],
 'geo2:tri':['Tu as oublié de <b>diviser par 2</b> : un triangle, c\'est la moitié d\'un rectangle.','L\'aire est un produit, pas une somme.','On divise par 2, pas par 4.'],
 'mat1:ab':['Inversé : c\'est <b>arrivée − départ</b> ($B-A$).','On soustrait les coordonnées, on ne les additionne pas.','Les $x$ et les $y$ sont inversés.'],
 'mat1:norm':['On n\'additionne pas les coordonnées : la norme vaut $\\sqrt{x^2+y^2}$.','Tu as oublié la racine carrée.','Erreur de calcul.'],
 'mat3:dot':['Le produit scalaire est un <b>nombre</b> : on additionne les deux produits.','On multiplie $x$ avec $x$ et $y$ avec $y$, pas en croix.','Erreur de calcul.'],
 'tri3:cs':['Tu as fait $1-\\cos$ : il faut $1-\\cos^2$, puis prendre la racine.','Tu as oublié la racine carrée à la fin.','$\\sin$ et $\\cos$ ne sont pas égaux en général.'],
 'sta1:mean':['Tu as oublié de <b>diviser</b> par le nombre de valeurs.','Erreur de calcul.','Ça, c\'est la médiane (valeur du milieu), pas la moyenne.'],
 'sta1:w':['Tu as oublié les coefficients.','Il faut diviser par la <b>somme des coefficients</b>.','Erreur de calcul.'],
 'sta2:med':['Tu as pris la valeur du milieu sans <b>ranger</b> les données d\'abord.','Ça, c\'est la moyenne.','Décalage : la médiane est la valeur centrale une fois rangées.'],
 'pro1:ur':['Ça, c\'est la probabilité d\'une boule bleue.','On divise par le <b>total</b> des boules, pas par les autres.','Il y a plusieurs boules rouges : compte-les toutes.'],
 'pro2:ind':['« Et » avec des événements indépendants : on <b>multiplie</b>, on n\'additionne pas.','Il faut tenir compte des deux événements.','On multiplie les deux probabilités.'],
 'pro3:E':['$E=n\\times p$ : tu as oublié $n$.','$E=n\\times p$ : tu as oublié $p$.','Ça, c\'est le nombre moyen d\'<b>échecs</b>.'],
 'ana1:at':['Tu as calculé $f(a)$, pas la pente $f\'(a)$.','Tu as oublié de dériver le terme $bx$.','Erreur de calcul.'],
 'ana2:mono1':['Tu as oublié de multiplier par l\'exposant.','Tu as oublié d\'enlever 1 à l\'exposant.','Ça, c\'est le sens des primitives : en dérivant, l\'exposant <b>descend</b>.'],
 'ana2:poly':['La dérivée d\'une constante est <b>0</b>.','$(ax^2)\'=2ax$ : n\'oublie pas le 2.','La dérivée de $bx$ est $b$, pas 0.'],
 'exp2:mul':['On <b>additionne</b> les exposants, on ne les multiplie pas.','$e^a\\times e^b$ n\'a pas de 2 devant.','On additionne les exposants, on ne les soustrait pas.'],
 'int1:rect':['L\'aire est un produit hauteur × largeur, pas une somme.','La largeur vaut $b-a$, pas $b$.','Erreur de calcul.'],
 'int1:tri':['Triangle : n\'oublie pas de diviser par 2.','La hauteur vaut $m\\times b$ (la valeur de la fonction au bout).','On divise par 2, pas par 4.'],
 'int2:prim':['Tu as oublié de <b>diviser</b> par le nouvel exposant.','Ça, c\'est la <b>dérivée</b>, pas une primitive.','Il faut augmenter l\'exposant de 1.'],
 'int3:calc':['C\'est $F(b)-F(a)$ : une <b>différence</b>, pas une somme.','Tu as dérivé au lieu de prendre une primitive.','Tu as oublié de soustraire $F(a)$.'],
};
/* diagnostic automatique quand aucune erreur typique n'est connue */
function dNum(s){return numVal(String(s).replace(/\^\{?\\circ\}?|°|\s*€|\\%|%/g,''));}
function autoDiag(good,bad){
  const g=dNum(good),b=dNum(bad);if(g===null||b===null||g===b)return null;
  const F=v=>String(v).replace('.',',');
  if([10,100,1000].includes(Math.abs(b-g))&&Math.abs(g)>=10)return `Tu as trouvé ${F(b)} au lieu de ${F(g)} : un écart de ${Math.abs(b-g)} pile, c'est une <b>petite erreur d'addition</b> (une retenue ?). Refais le calcul posé.`;
  if(Math.abs(b+g)<1e-9)return 'Erreur de <b>signe</b> : relis chaque signe − de ton calcul.';
  if(g!==0&&Math.abs(b/g-10)<1e-9||Math.abs(b/g-.1)<1e-9)return 'Erreur de <b>virgule</b> : tu as un facteur 10 de trop ou de moins.';
  if(Math.abs(b-g*g)<1e-9&&g>1)return 'Tu as oublié la <b>racine carrée</b> (ou mis au carré en trop).';
  if(g>=0&&Math.abs(b*b-g)<1e-9)return 'Tu as pris la racine en trop (ou oublié de mettre au carré).';
  if(Math.abs(b-2*g)<1e-9)return 'Tu as le <b>double</b> du bon résultat : un « ÷ 2 » oublié ?';
  if(Math.abs(2*b-g)<1e-9)return 'Tu as la <b>moitié</b> du bon résultat : un facteur 2 oublié ?';
  if(Math.abs(b-g)<=2)return `Tu as trouvé ${F(b)} au lieu de ${F(g)} : tu étais tout près, c'est une petite <b>erreur de calcul</b>. Refais-le pas à pas.`;
  return null;
}
function diagnose(s,info){
  const it=s.it;if(!info)return null;
  let src=null,bad=null;
  if(it.type==='qcm'){src=info.src;bad=info.pick;}
  else if(it.type==='tf'&&it.truth===false&&info.said===1){src=(it.src||[])[it.a.indexOf(it.prop)];bad=it.prop;}
  else if(it.type==='input'){bad=String(info.val);}
  if(it.errs&&src>0&&it.errs[src-1])return {msg:it.errs[src-1],key:(it.nid||s.nid)+':'+it.gen+':'+src};
  const E=ERRS[(it.nid||s.nid)+':'+it.gen];
  if(E&&src>0&&E[src-1])return {msg:E[src-1],key:(it.nid||s.nid)+':'+it.gen+':'+src};
  const d=bad!=null?autoDiag(it.a?it.a[0]:it.ans,bad):null;
  return d?{msg:d,key:'auto:'+d.slice(0,20)}:null;
}
function recordMis(nid,d){
  if(!nid||!d)return;st.mis=st.mis||{};const m=st.mis[nid]=st.mis[nid]||{};
  m[d.key]=m[d.key]||{n:0,msg:d.msg};m[d.key].n++;m[d.key].last=today();
  if(S){(S.mis=S.mis||[]).push({nid,msg:d.msg});}
}
function topMis(nid){const m=(st.mis||{})[nid];if(!m)return [];return Object.values(m).filter(x=>today()-(x.last||0)<30).sort((a,b)=>b.n-a.n);}

/* ---------- explications alternatives : une autre façon de voir chaque notion ---------- */
const ALT={
 pui1:r`<p>🧱 Imagine des <b>Lego</b> : $2^3$, c'est une tour de 3 briques « ×2 ».</p><p>$2^3\times2^2$ : tu poses une tour de 3 sur une tour de 2 → une tour de <b>5</b> briques. Les hauteurs <b>s'additionnent</b>.</p><p>$(2^3)^2$ : tu fais <b>2 tours de 3</b> → $3\times2=6$ briques.</p>`,
 pui2:r`<p>🪜 Descends l'escalier : à chaque marche, on <b>divise par 10</b>.</p><p>$10^2=100 \to 10^1=10 \to 10^0=1 \to 10^{-1}=0{,}1$.</p><p>Le « − » de l'exposant ne rend pas le nombre négatif : il le rend <b>petit</b> (on passe sous la barre de fraction).</p>`,
 pui3:r`<p>🔭 L'exposant compte les <b>sauts de virgule</b>.</p><p>$3{,}2\times10^4$ : la virgule saute 4 fois vers la droite → $32\,000$.</p><p>$3{,}2\times10^{-4}$ : 4 sauts vers la gauche → $0{,}00032$.</p>`,
 rac1:r`<p>🟨 $\sqrt{49}$ pose une seule question : « quel carré a une aire de 49 ? » → un carré de côté <b>7</b>.</p><p>Vérifie toujours dans l'autre sens : $7\times7=49$ ✓.</p>`,
 rac2:r`<p>🎁 Sous la racine, cherche un <b>carré caché</b> (4, 9, 16, 25, 36…) et fais-le sortir : il sort sous la forme de sa racine.</p><p>$\sqrt{50}=\sqrt{25\times2}$ : le 25 sort en devenant 5 → $5\sqrt2$.</p>`,
 rac3:r`<p>⚠️ La racine est un « ascenseur » qui ne marche qu'avec les <b>produits</b>.</p><p>$\sqrt{4\times9}=2\times3$ ✓ mais $\sqrt{9+16}=\sqrt{25}=5$, pas $3+4=7$.</p><p>Règle de survie : sous une racine, on <b>calcule d'abord ce qu'il y a dedans</b>.</p>`,
 pct1:r`<p>🍕 « Pour cent » = « sur 100 ». 25 %, c'est 25 parts d'une pizza coupée en 100… c'est-à-dire <b>un quart</b>.</p><p>Astuce : 10 % → je divise par 10 ; 5 % → la moitié de 10 % ; 20 % → le double de 10 %.</p>`,
 pct2:r`<p>🏷️ Après une baisse de 30 %, il te <b>reste</b> 70 % du prix : tu multiplies par 0,70.</p><p>Après une hausse de 20 %, tu as 100 % + 20 % = 120 % : tu multiplies par 1,20.</p><p>Le coefficient, c'est « ce qui reste » ou « ce que ça devient ».</p>`,
 pct3:r`<p>🎢 −50 % puis +50 % sur 100 € : la baisse donne 50 €. La hausse de 50 % porte sur <b>50 €</b> (et plus sur 100 €) → +25 € → <b>75 €</b>.</p><p>Chaque pourcentage s'applique au <b>nouveau</b> prix : c'est pour ça qu'on <b>multiplie</b> les coefficients ($0{,}5\times1{,}5=0{,}75$).</p>`,
 ens1:r`<p>🪆 Pense aux <b>poupées russes</b> : $\mathbb N$ (0, 1, 2…) est dans $\mathbb Z$ (avec les négatifs), qui est dans $\mathbb Q$ (avec les fractions), qui est dans $\mathbb R$ (avec $\sqrt2$, $\pi$…).</p><p>Pour un nombre, on cherche la plus petite poupée qui le contient.</p>`,
 ens2:r`<p>🎭 Deux clubs : $A\cap B$ (∩, comme un pont) = ceux qui sont <b>dans les deux</b>. $A\cup B$ (∪, comme un panier) = <b>tout le monde</b>, sans compter deux fois.</p>`,
 ens3:r`<p>🚪 Les crochets sont des <b>portes</b> : tournés vers le nombre ( [2 ), la porte est ouverte vers lui, il entre. Tournés vers l'extérieur ( ]2 ), il reste dehors.</p><p>L'infini n'est jamais atteint : toujours un crochet ouvert.</p>`,
 alg1:r`<p>⚖️ Une équation est une <b>balance</b>. Pour savoir combien pèse $x$, on enlève la même chose des deux plateaux, puis on partage en parts égales.</p><p>$3x+2=14$ → j'enlève 2 des deux côtés → $3x=12$ → je partage en 3 → $x=4$.</p>`,
 alg2:r`<p>🟧 $(a+b)^2$, c'est un carré de côté $a+b$. Découpe-le : un carré $a^2$, un carré $b^2$… et <b>deux rectangles</b> $ab$ qu'on oublie souvent.</p><p>Exemple chiffré : $(3+1)^2=16$ et $9+1=10$ seulement : il manque $2\times3\times1=6$.</p>`,
 alg3:r`<p>🧮 Un produit vaut zéro seulement si <b>l'un des facteurs</b> vaut zéro ($5\times0=0$).</p><p>Donc $(x-3)(x+5)=0$ → soit $x-3=0$, soit $x+5=0$ : on résout deux petites équations.</p>`,
 fon1:r`<p>🏭 Une fonction est une <b>machine</b> : tu mets $x$ dedans, elle applique la recette, il sort $f(x)$.</p><p>$f(x)=2x+3$ : « je double, puis j'ajoute 3 ». Avec 4 : $8+3=11$.</p>`,
 fon2:r`<p>⛰️ La pente, c'est la <b>raideur</b> du chemin : de combien je monte quand j'avance d'un pas vers la droite.</p><p>Pente 2 : chaque pas, je monte de 2. Pente −1 : chaque pas, je descends de 1.</p>`,
 fon3:r`<p>🏀 Le discriminant $\Delta$ répond à : « la parabole touche-t-elle le sol ? »</p><p>$\Delta>0$ : elle le traverse (2 points) · $\Delta=0$ : elle le frôle (1 point) · $\Delta<0$ : elle reste en l'air (0 point).</p>`,
 sui1:r`<p>🐷 Une tirelire où tu ajoutes <b>toujours la même somme</b> : 20 €, 25 €, 30 €…</p><p>Après $n$ semaines : départ + $n$ fois l'ajout → $u_n=u_0+nr$.</p>`,
 sui2:r`<p>🪷 Le nénuphar qui <b>double</b> chaque jour : on ne rajoute pas une quantité fixe, on <b>multiplie</b>.</p><p>Après $n$ jours : départ × $2\times2\times\dots$ ($n$ fois) → $u_n=u_0\times q^n$.</p>`,
 sui3:r`<p>🧒 Écris $1+2+\dots+10$ puis, en dessous, $10+9+\dots+1$. Chaque colonne fait <b>11</b>, et il y a 10 colonnes : $110$. Mais on a compté deux fois → $55$.</p>`,
 geo1:r`<p>🪜 Sur chaque côté d'un triangle rectangle, pose un carré. Les deux petits carrés, ensemble, ont <b>exactement la même aire</b> que le grand.</p><p>Côtés 3 et 4 : $9+16=25$ → le grand carré a pour côté 5.</p>`,
 geo2:r`<p>✂️ Coupe un rectangle en diagonale : tu obtiens <b>deux triangles identiques</b>. Chaque triangle vaut donc la moitié du rectangle : $\dfrac{\text{base}\times\text{hauteur}}2$.</p>`,
 geo3:r`<p>✂️ Découpe les 3 coins d'un triangle en papier et colle-les côte à côte : ils forment toujours un <b>demi-tour</b> (une ligne droite), soit 180°.</p><p>📐 L'<b>angle extérieur</b> : prolonge un côté au-delà d'un sommet. L'angle entre ce prolongement et l'autre côté complète l'angle intérieur pour faire 180°. Il vaut donc la <b>somme des deux autres angles</b>.</p>`,
 mat1:r`<p>🤖 Un vecteur, c'est une <b>consigne de déplacement</b> : $(3\,;2)$ = « 3 pas à droite, 2 pas vers le haut ».</p><p>De A à B : on compte les pas, arrivée − départ.</p>`,
 mat2:r`<p>🗺️ Additionner deux vecteurs, c'est faire <b>deux trajets à la suite</b> : 3 pas à droite puis 2 de plus = 5 pas à droite. On ajoute les $x$ ensemble et les $y$ ensemble.</p>`,
 mat3:r`<p>🔦 Le produit scalaire mesure si deux flèches « vont dans le même sens ». Positif : plutôt le même sens. Négatif : plutôt opposés. <b>Zéro</b> : elles se croisent à angle droit.</p>`,
 tri1:r`<p>🎡 Sur la grande roue (rayon 1), ta position a deux nombres : le <b>cos</b> = combien tu es décalé à droite ou à gauche, le <b>sin</b> = à quelle hauteur tu es.</p><p>Tout en haut : décalage 0, hauteur 1 → $\cos=0$, $\sin=1$.</p>`,
 tri2:r`<p>🥧 Prends la ficelle du rayon et pose-la sur le bord du cercle : l'arc obtenu fait <b>1 radian</b>. Un demi-tour contient $\pi\approx3{,}14$ ficelles : $180^\circ=\pi$.</p>`,
 tri3:r`<p>📐 Dans le cercle, le cos et le sin forment un <b>triangle rectangle</b> dont l'hypoténuse est le rayon, qui vaut 1. Pythagore : $\cos^2+\sin^2=1^2$.</p><p>Si $\cos=0{,}6$ : $0{,}36+\sin^2=1$, donc $\sin^2=0{,}64$ et $\sin=0{,}8$.</p>`,
 sta1:r`<p>⚖️ La moyenne, c'est ce que chacun aurait si on <b>partageait tout équitablement</b> : on met tout en commun (somme), puis on partage (÷ nombre).</p>`,
 sta2:r`<p>🧍‍♂️ Range les élèves du plus petit au plus grand : la médiane est celui qui est <b>au milieu de la file</b>. Un géant de 3 m ne la change pas, alors qu'il fait grimper la moyenne.</p>`,
 sta3:r`<p>🔍 Avant de lire un graphique, regarde <b>où commence l'axe</b>. S'il ne part pas de 0, de petites différences paraissent énormes.</p>`,
 pro1:r`<p>🎲 Une probabilité, c'est « combien de cases gagnantes sur combien de cases en tout ». Dé : 6 cases ; « pair » : 3 cases gagnantes → $\dfrac36=\dfrac12$.</p>`,
 pro2:r`<p>🌳 Sur un arbre, chaque chemin est une suite de choix : on <b>multiplie</b> en avançant sur un chemin ($\dfrac12\times\dfrac12$), et on <b>additionne</b> les chemins qui conviennent.</p>`,
 pro3:r`<p>🎰 Répéter $n$ fois la même expérience : en moyenne, tu réussis <b>$n\times p$</b> fois. 100 lancers d'une pièce → environ 50 Piles.</p>`,
 ana1:r`<p>🚴 La dérivée, c'est le <b>compteur de pente</b> du vélo : il indique à chaque endroit si ça monte (positif), si ça descend (négatif) ou si c'est plat (0).</p>`,
 ana2:r`<p>🧰 Pour dériver $x^n$ : « l'exposant <b>descend</b> devant, puis il <b>diminue de 1</b> ». $x^3\to3x^2$, $x^5\to5x^4$. Un nombre seul a une pente nulle : sa dérivée vaut 0.</p>`,
 ana3:r`<p>⛰️ Au sommet d'une colline, le sol est <b>plat</b> : la pente vaut 0. Pour trouver un maximum, on cherche donc où la dérivée s'annule, puis on vérifie que ça monte avant et descend après.</p>`,
 exp1:r`<p>🦠 Plus il y a de bactéries, plus elles se multiplient vite : la vitesse de croissance <b>égale</b> la quantité. C'est exactement $e^x$ : sa pente vaut sa hauteur.</p>`,
 exp2:r`<p>🔁 L'exponentielle suit les mêmes règles que les puissances : $e^3\times e^4=e^{3+4}$, comme $2^3\times2^4=2^7$.</p>`,
 exp3:r`<p>↩️ ln est le <b>bouton « annuler »</b> de l'exponentielle : $\ln(e^5)=5$. Il répond à la question « $e$ puissance combien donne ce nombre ? »</p>`,
 int1:r`<p>🧱 Pour mesurer une forme courbe, on la remplit de <b>bandes très fines</b> et on additionne leurs aires. L'intégrale, c'est le total quand les bandes deviennent infiniment fines.</p>`,
 int2:r`<p>⏪ La primitive, c'est la dérivée <b>à l'envers</b> : « quelle fonction, une fois dérivée, donne celle-ci ? » Pour $x^n$ : l'exposant <b>monte</b> de 1, et on divise par le nouvel exposant.</p>`,
 int3:r`<p>🧮 Comme un compteur kilométrique : la distance parcourue entre 2 h et 5 h = (compteur à 5 h) − (compteur à 2 h). Ici, le compteur, c'est la primitive : $F(b)-F(a)$.</p>`,
};

/* ---------- exemple résolu à partir d'un exercice semblable ---------- */
function workedFrom(id,tier){
  const it=genFor(id,['qcm'],0,tier||1);if(!it||!it.why)return null;
  const lines=String(it.why).split(/<br\s*\/?>/).map(x=>x.trim()).filter(Boolean);
  lines.push(`Réponse : ${it.a[0]} ✅`);
  return {kind:'ex',title:'👀 Regarde comment je fais : '+it.q,fig:it.img,lines,label:'Exemple du prof'};
}

/* ---------- séquence de remédiation « je t'explique autrement » ---------- */
function profRemedy(id,why){
  const x=NOT(id);if(!x)return [];
  const q=[{kind:'alt',id,why}];
  const w=workedFrom(id,1);if(w)q.push(w);
  q.push({kind:'item',nid:id,gen:{fmts:['qcm'],tier:1},label:'🧑‍🏫 À toi, sur le même modèle'});
  return q;
}

/* ---------- bilan de séance ---------- */
function profBilan(){
  if(!S)return '';
  const mis=S.mis||[];
  const byMsg={};mis.forEach(m=>{byMsg[m.msg]=(byMsg[m.msg]||0)+1;});
  const tips=Object.entries(byMsg).sort((a,b)=>b[1]-a[1]).slice(0,2);
  const first=S.nq-S.missed.size;
  let h='<div class="prof"><div class="prof-h">🧑‍🏫 Le mot du prof</div>';
  if(!S.nq) return '';
  if(first===S.nq) h+='<p>Sans faute : la notion est acquise. On passera bientôt au niveau supérieur.</p>';
  else if(first>=S.nq*.7) h+='<p>Très bien ! Il reste quelques réglages :</p>';
  else h+='<p>C\'est en se trompant qu\'on apprend. Voici ce qu\'on va travailler :</p>';
  tips.forEach(([m,n])=>{h+=`<div class="prof-t">${n>1?`<b>×${n}</b> `:''}${m}</div>`;});
  if(tips.length) h+='<p class="muted">Ces questions reviendront dans tes révisions, au bon moment.</p>';
  return h+'</div>';
}

/* ---------- écran « Mon prof » ---------- */
function profSheet(){
  const L=weakList(),due=srsDue().length,nx=nextNotion();
  const allMis=[];Object.entries(st.mis||{}).forEach(([nid,m])=>Object.values(m).forEach(x=>{if(NOT(nid)&&today()-(x.last||0)<30)allMis.push({nid,...x});}));
  allMis.sort((a,b)=>b.n-a.n);
  const strong=L.filter(([,m])=>m>=.7).slice(-3).reverse(),weak=L.filter(([,m])=>m<.5).slice(0,3);
  let plan=[];
  if(due)plan.push(`🧠 <b>${due}</b> question${due>1?'s':''} à revoir (2 min)`);
  if(weak.length)plan.push(`🎯 Renforcer <b>${NOT(weak[0][0]).n.title}</b>`);
  if(nx)plan.push(nx.boss?`👑 Affronter le boss <b>${nx.c.label}</b>`:`▶ Découvrir <b>${nx.n.title}</b>`);
  sheet(`<div class="sh-h">🧑‍🏫 Mon prof<small>Ce que j'ai observé de ton travail</small></div>
   <div class="prof"><div class="prof-h">📅 Ton programme du jour</div>${plan.length?plan.map(p=>`<div class="prof-t">${p}</div>`).join(''):'<p>Commence une notion : j\'apprendrai à te connaître.</p>'}</div>
   ${allMis.length?`<div class="prof"><div class="prof-h">🔍 Tes erreurs récurrentes</div>${allMis.slice(0,4).map(x=>`<div class="prof-t"><small>${NOT(x.nid).c.icon} ${NOT(x.nid).n.title} · ${x.n} fois</small><br>${x.msg}<br><button class="lnk mini-go" data-n="${x.nid}">Travailler ça avec moi →</button></div>`).join('')}</div>`:''}
   ${strong.length?`<div class="prof"><div class="prof-h">💪 Tes points forts</div>${strong.map(([id,m])=>`<div class="prof-t">${NOT(id).c.icon} ${NOT(id).n.title} · ${Math.round(m*100)} %</div>`).join('')}</div>`:''}
   ${L.length?`<div class="prof"><div class="prof-h">📊 Maîtrise des notions travaillées</div><div class="mlist">${L.map(([id,m])=>{const x=NOT(id);return `<div class="mrow"><span>${x.c.icon}</span><div><b>${x.n.title}</b><div class="mgauge"><i style="width:${Math.round(m*100)}%;background:${m<.35?'#e11d48':m<.7?'#f59e0b':'#16a34a'}"></i></div></div><em>${Math.round(m*100)} %</em></div>`;}).join('')}</div>
   <button class="cta" id="focusgo" style="margin-top:12px">🎯 Séance ciblée sur mes points faibles</button></div>`:''}`);
  if($('focusgo'))$('focusgo').onclick=()=>{$('sheetw').classList.remove('open');startFocus();};
  document.querySelectorAll('#sheet .mini-go').forEach(b=>b.onclick=()=>{$('sheetw').classList.remove('open');startTutor(b.dataset.n);});
}
/* séance de tutorat sur une notion : autre explication, exemple, exercices progressifs */
function startTutor(id){
  const x=NOT(id);if(!x)return;
  const q=[...profRemedy(id,'On reprend ensemble, autrement.')];
  for(let k=0;k<5;k++)q.push({kind:'item',nid:id,gen:{fmts:k<2?['qcm']:['qcm','tf','input'],tier:k<2?1:k<4?2:0}});
  q.forEach(e=>{if(e.gen&&e.gen.tier===0)delete e.gen.tier;});
  openSession({mode:'practice',title:'🧑‍🏫 Avec le prof · '+x.n.title,color:x.c.c[1],icon:x.c.icon,chap:x.c.key,queue:q,retry:true,
    onEnd:()=>endScreen({bonus:15,title:'Séance avec le prof terminée',emoji:'🧑‍🏫',extra:profBilan()})});
}
