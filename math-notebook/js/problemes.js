/* =====================================================================
   PROBLÈMES EN PLUSIEURS ÉTAPES
   - guidé : chaque étape est posée (étape 1/3, 2/3…)
   - autonome (problème maîtrisé) : seule la question finale, réponse à taper,
     les étapes deviennent des coups de pouce
   ===================================================================== */
const STP=(q,good,bad,why,tip,errs)=>DX(QQ(q,String(good),bad.map(String),why,[]),{tip,errs});
const PROBS=[
 {k:'solde',t:'Les soldes',i:'🏷️',c:'#f97316',g(){const P=pick([80,120,150,200,250]),t1=pick([20,30,40]),t2=pick([10,20,25,50]),p1=P*(1-t1/100),p2=p1*(1-t2/100),tot=100-(100-t1)*(100-t2)/100;
  return {ctx:`Un manteau coûte <b>${P} €</b>. Il est soldé à <b>−${t1} %</b>, puis une remise de <b>−${t2} %</b> s'applique au prix soldé.`,s:[
   STP(`Par quel nombre multiplie-t-on un prix pour le baisser de ${t1} % ?`,fmt(1-t1/100),[fmt(t1/100),fmt(1+t1/100),fmt(100-t1)],`Baisser de ${t1} %, c'est garder ${100-t1} % : × ${fmt(1-t1/100)}.`,'Baisse de t % : × (1 − t/100).',[`Ça, c'est la part <b>enlevée</b> : on garde ${100-t1} %.`,'Ça, c\'est une <b>hausse</b>.','Pense en décimal : 100 % = 1.']),
   STP('Prix après la première baisse (en €) ?',fmt(p1),[fmt(P-t1),fmt(P*t1/100)],`$${P}\\times${fmt(1-t1/100)}=${fmt(p1)}$`,'Nouveau prix = ancien prix × coefficient.',['On n\'enlève pas '+t1+' €, mais '+t1+' % du prix.','Ça, c\'est le montant de la remise, pas le nouveau prix.']),
   STP('Prix final (en €) ?',fmt(p2),[fmt(P*(1-(t1+t2)/100)),fmt(p1-t2)],`$${fmt(p1)}\\times${fmt(1-t2/100)}=${fmt(p2)}$`,'Remises successives : on multiplie les coefficients.',['Tu as additionné les pourcentages : la 2ᵉ remise porte sur le prix <b>déjà soldé</b>.','On enlève '+t2+' % du prix soldé, pas '+t2+' €.']),
   STP('Baisse totale, en % ?',fmt(tot),[fmt(t1+t2),fmt(tot+5)],`$${fmt(1-t1/100)}\\times${fmt(1-t2/100)}=${fmt((100-tot)/100)}$ : on garde ${fmt(100-tot)} %, donc −${fmt(tot)} %.`,'Les pourcentages successifs ne s\'additionnent pas.',['−'+t1+' % puis −'+t2+' % ne font pas −'+(t1+t2)+' % : la 2ᵉ baisse porte sur un prix plus petit.'])]};}},
 {k:'place',t:'Le placement',i:'🏦',c:'#16a34a',g(){const C=pick([1000,2000,5000]),r=pick([2,3,4,5]),q=1+r/100,u3=Math.round(C*q**3);
  return {ctx:`On place <b>${C} €</b> à <b>${r} %</b> d'intérêts composés par an. On note $u_n$ le capital après $n$ années.`,s:[
   STP('Par combien est multiplié le capital chaque année ?',fmt(q),[fmt(r/100),fmt(1+r),String(r)],`+${r} % : × ${fmt(q)}.`,'Hausse de t % : × (1 + t/100).',['Ça, c\'est seulement l\'intérêt : il faut garder le capital (+ 1).','Pense en décimal : '+r+' % = '+fmt(r/100)+'.']),
   STP('Quelle est la nature de la suite $(u_n)$ ?',`<span>Géométrique de raison ${fmt(q)}</span>`,[`<span>Arithmétique de raison ${C*r/100}</span>`,`<span>Géométrique de raison ${r}</span>`],'On multiplie par le même nombre chaque année : suite géométrique.','× le même nombre → géométrique ; + le même nombre → arithmétique.',['Les intérêts grossissent chaque année (intérêts composés) : on <b>multiplie</b>, on n\'ajoute pas.']),
   STP('Capital après 3 ans (arrondi à l\'euro) ?',u3,[C+3*C*r/100,Math.round(C*q*3)],`$u_3=${C}\\times${fmt(q)}^3\\approx${u3}$`,'Suite géométrique : $u_n=u_0\\times q^n$.',['Ça, ce sont des intérêts <b>simples</b> : ici les intérêts rapportent aussi.','On élève à la puissance 3, on ne multiplie pas par 3.'])]};}},
 {k:'benef',t:'Le bénéfice maximal',i:'💰',c:'#0ea5e9',g(){const m=ri(8,20),b=2*m,c=ri(10,60);
  return {ctx:`Une entreprise fabrique $x$ objets par jour. Son bénéfice (en €) est $B(x)=-x^2+${b}x-${c}$.`,s:[
   STP('$B\'(x)=$ ?',`-2x+${b}`,[`-x+${b}`,`2x+${b}`,`-2x+${b-c}`],'$(x^2)\'=2x$, $(${b}x)\'=${b}$, une constante a une dérivée nulle.','$(x^n)\'=nx^{n-1}$ ; la dérivée d\'une constante est 0.',['La dérivée de $x^2$ est $2x$.','Attention au signe devant $x^2$.','La constante disparaît en dérivant.']),
   STP('Pour quel nombre d\'objets le bénéfice est-il maximal ?',m,[b,m+1,c],`$B'(x)=0 \\iff x=${m}$.`,'Le maximum est là où la dérivée s\'annule (et change de signe).',[`On résout $-2x+${b}=0$ : il faut diviser par 2.`]),
   STP('Bénéfice maximal (en €) ?',m*m-c,[m*m+c,b*m-c],`$B(${m})=-${m*m}+${b*m}-${c}=${m*m-c}$`,'On remplace x par la valeur trouvée dans B(x), pas dans B′(x).',['Attention : $-x^2$ avec $x='+m+'$ donne $-'+m*m+'$.','Tu as oublié le $-x^2$.'])]};}},
 {k:'jardin',t:'Le jardin',i:'🌳',c:'#22c55e',g(){const T=pick([[4,3,5],[12,5,13],[15,8,17]]),k=T[2]===5?pick([2,3,4,6]):1,L=T[0]*k,l=T[1]*k,d=T[2]*k,p=pick([5,8,12,15]);
  return {ctx:`Un jardin rectangulaire mesure <b>${L} m</b> de long. Sa diagonale mesure <b>${d} m</b>. Une clôture coûte <b>${p} € le mètre</b>.`,s:[
   STP('Largeur du jardin (en m) ?',l,[d-L,L+d,Math.round(Math.sqrt(L*L+d*d))],`Pythagore : $${d}^2-${L}^2=${d*d-L*L}$, et $\\sqrt{${d*d-L*L}}=${l}$.`,'La diagonale coupe le rectangle en deux triangles rectangles : Pythagore.',['On soustrait les <b>carrés</b>, pas les longueurs.','La diagonale est l\'hypoténuse : on <b>soustrait</b>.','La diagonale est l\'hypoténuse : on <b>soustrait</b>.']),
   STP('Longueur de la clôture (tour du jardin, en m) ?',2*(L+l),[L+l,L*l],`$2\\times(${L}+${l})=${2*(L+l)}$`,'Périmètre du rectangle = 2 × (longueur + largeur).',['Ça, c\'est un demi-tour.','Ça, c\'est l\'aire.']),
   STP('Coût de la clôture (en €) ?',2*(L+l)*p,[L*l*p,(L+l)*p],`$${2*(L+l)}\\times${p}=${2*(L+l)*p}$`,'Coût = longueur × prix au mètre.',['Tu as pris l\'aire : la clôture fait le <b>tour</b>.','Tu as compté un demi-tour.'])]};}},
 {k:'arbre',t:'Sport et forme',i:'🌲',c:'#7c3aed',g(){const a=pick([.2,.3,.4,.6]),b=pick([.5,.8,.9]),c=pick([.1,.2,.3]),pab=+(a*b).toFixed(4),pb=+(a*b+(1-a)*c).toFixed(4),pc=Math.round(pab/pb*100)/100;
  return {ctx:`Dans un lycée, <b>${a*100} %</b> des élèves font du sport (S). Parmi eux, <b>${b*100} %</b> sont en forme (F). Parmi ceux qui ne font pas de sport, <b>${c*100} %</b> sont en forme.`,s:[
   STP('$P(S\\cap F)$ ?',fmt(pab),[fmt(a+b),fmt(b)],`On suit la branche S puis F : $${fmt(a)}\\times${fmt(b)}=${fmt(pab)}$.`,'Le long d\'une branche, on multiplie.',['Le long d\'une branche, on <b>multiplie</b>.','Ça, c\'est $P_S(F)$ : il faut multiplier par $P(S)$.']),
   STP('$P(F)$ ?',fmt(pb),[fmt(b+c),fmt(pab+c)],`$${fmt(pab)}+${fmt(1-a)}\\times${fmt(c)}=${fmt(pb)}$`,'Probabilités totales : on additionne toutes les branches qui mènent à F.',['On n\'additionne pas des probabilités conditionnelles : il faut les deux branches complètes.','La 2ᵉ branche se multiplie aussi : $'+fmt(1-a)+'\\times'+fmt(c)+'$.']),
   STP('Un élève est en forme. Probabilité qu\'il fasse du sport (arrondie au centième) ?',fmt(pc),[fmt(b),fmt(pab)],`$P_F(S)=\\dfrac{P(S\\cap F)}{P(F)}=\\dfrac{${fmt(pab)}}{${fmt(pb)}}\\approx${fmt(pc)}$`,'$P_F(S)=P(S\\cap F)\\div P(F)$ : on remonte l\'arbre.',['Ça, c\'est $P_S(F)$ : ici on sait qu\'il est <b>en forme</b>.','Il faut encore diviser par $P(F)$.'])]};}},
 {k:'droite',t:'La droite',i:'📈',c:'#ec4899',g(){const a=pick([-3,-2,-1,1,2,3]),b=ri(-5,5),x1=ri(-3,0),x2=x1+ri(1,4),y1=a*x1+b,y2=a*x2+b,xc=ri(1,5),on=Math.random()<.5,yc=a*xc+b+(on?0:pick([-1,1]));
  return {ctx:`On donne les points $A(${x1}\\,;${y1})$ et $B(${x2}\\,;${y2})$.`,s:[
   STP('Coefficient directeur de $(AB)$ ?',a,[-a,fr(x2-x1,y2-y1),y2-y1],`$\\dfrac{${y2}-${PN(y1)}}{${x2}-${PN(x1)}}=\\dfrac{${y2-y1}}{${x2-x1}}=${a}$`,'Coefficient directeur = (y_B − y_A) ÷ (x_B − x_A).',['Erreur de signe : fais bien B − A en haut <b>et</b> en bas.','Tu as inversé : les y en haut, les x en bas.','Il faut diviser par l\'écart des x.']),
   STP('Ordonnée à l\'origine de $(AB)$ ?',b,[y1,y1+a*x1],`$${y1}=${a}\\times${PN(x1)}+b$, donc $b=${b}$.`,'On remplace les coordonnées de A dans y = ax + b et on résout.',['Ça, c\'est l\'ordonnée de A, pas celle du point d\'abscisse 0.','Erreur de signe en isolant b.']),
   STP(`Le point $C(${xc}\\,;${yc})$ est-il sur $(AB)$ ?`,on?'<span>Oui</span>':'<span>Non</span>',[on?'<span>Non</span>':'<span>Oui</span>'],`$${a}\\times${xc}+${PN(b)}=${a*xc+b}$${on?' : c\'est bien '+yc+'.':' et non '+yc+'.'}`,'Un point est sur la droite si ses coordonnées vérifient y = ax + b.')]};}},
 {k:'notes',t:'Les notes de Léa',i:'📝',c:'#e11d48',g(){let n,s,T,x;do{n=[ri(8,16),ri(8,16),ri(8,16),ri(8,16)];s=n.reduce((p,q)=>p+q,0);T=Math.ceil(s/4)+pick([1,2]);x=5*T-s;}while(x>20||s%4);
  return {ctx:`Léa a eu <b>${n.join(' ; ')}</b> à ses 4 premiers contrôles (même coefficient). Elle vise <b>${T} de moyenne</b> après le 5ᵉ.`,s:[
   STP('Sa moyenne actuelle ?',s/4,[s,s/4+1],`$(${n.join('+')})\\div4=${s/4}$`,'Moyenne = somme ÷ nombre de notes.',['Il faut diviser la somme par 4.']),
   STP(`Total de points nécessaire sur 5 contrôles pour une moyenne de ${T} ?`,5*T,[4*T,T+5],`$5\\times${T}=${5*T}$`,'Total visé = moyenne visée × nombre de notes.',['Il y aura <b>5</b> notes, pas 4.','On multiplie, on n\'ajoute pas.']),
   STP('Quelle note doit-elle avoir au 5ᵉ contrôle ?',x,[T,5*T-s/4],`$${5*T}-${s}=${x}$`,'Note nécessaire = total visé − total déjà obtenu.',['Avoir '+T+' au dernier contrôle ne suffit pas toujours : calcule le total.','On retire la <b>somme</b> des notes, pas la moyenne.'])]};}},
 {k:'velo',t:'L\'aller-retour',i:'🚴',c:'#0891b2',g(){const [d,v1,v2]=pick([[60,30,60],[120,40,60],[90,30,45],[60,20,60],[120,60,40]]),t1=d/v1,t2=d/v2,vm=2*d/(t1+t2);
  return {ctx:`Un cycliste fait l'aller (<b>${d} km</b>) à <b>${v1} km/h</b> et le retour à <b>${v2} km/h</b>.`,s:[
   STP('Durée de l\'aller (en h) ?',fmt(t1),[fmt(v1/d),fmt(d*v1)],`$${d}\\div${v1}=${fmt(t1)}$`,'Durée = distance ÷ vitesse.',['Tu as inversé : distance ÷ vitesse.','On divise, on ne multiplie pas.']),
   STP('Durée totale de l\'aller-retour (en h) ?',fmt(t1+t2),[fmt(2*t1),fmt(2*d/((v1+v2)/2))],`$${fmt(t1)}+${d}\\div${v2}=${fmt(t1)}+${fmt(t2)}=${fmt(t1+t2)}$`,'Calcule le retour à part : la vitesse n\'est pas la même.',['Le retour ne se fait pas à la même vitesse.','Calcule chaque trajet séparément.']),
   STP('Vitesse moyenne sur l\'aller-retour (km/h) ?',fmt(vm),[fmt((v1+v2)/2),fmt(v2)],`$${2*d}\\div${fmt(t1+t2)}=${fmt(vm)}$`,'Vitesse moyenne = distance totale ÷ durée totale (jamais la moyenne des vitesses).',['On ne fait pas la moyenne des deux vitesses : on roule plus longtemps à la vitesse lente.','Ça, c\'est la vitesse du retour seul.'])]};}},
 {k:'tang',t:'La tangente',i:'📐',c:'#8b5cf6',g(){const k=ri(-4,4)||1,a=pick([-2,-1,1,2,3]),fa=a*a+k*a,da=2*a+k;
  return {ctx:`Soit $f(x)=x^2${k<0?'':'+'}${k}x$. On cherche la tangente à la courbe au point d'abscisse $${a}$.`,s:[
   STP('$f\'(x)=$ ?',`2x${k<0?'':'+'}${k}`,[`x${k<0?'':'+'}${k}`,`2x`,`2x+${k*k}`],'$(x^2)\'=2x$ et $(kx)\'=k$.','$(x^2)\'=2x$ ; $(kx)\'=k$.',['La dérivée de $x^2$ est $2x$.','La dérivée de $'+k+'x$ est $'+k+'$, pas 0.']),
   STP(`Pente de la tangente : $f'(${a})$ ?`,da,[fa,2*a,-da],`$2\\times${PN(a)}${k<0?'':'+'}${k}=${da}$`,'La pente de la tangente en a, c\'est f′(a).',['Ça, c\'est $f('+a+')$ : la pente, c\'est $f\'('+a+')$.','Tu as oublié le $'+k+'$.','Erreur de signe.']),
   STP('Ordonnée à l\'origine de la tangente ?',fa-a*da,[fa,da],`$y=f'(a)(x-a)+f(a)=${da}(x-${PN(a)})+${PN(fa)}$ ; pour $x=0$ : $${fa-a*da}$.`,'Tangente : y = f′(a)(x − a) + f(a).',['Ça, c\'est $f('+a+')$ : remplace x par 0 dans l\'équation de la tangente.','Ça, c\'est la pente.'])]};}},
];
function probM(k){st.probM=st.probM||{};return st.probM[k]??0;}
function startProblems(){
  const P=shuffle(PROBS.slice()).sort((a,b)=>probM(a.k)-probM(b.k)).slice(0,2),q=[];
  P.forEach(p=>{const g=p.g(),auto=probM(p.k)>=.7,head=`<div class="pctx">${p.i} <b>${p.t}</b><br>${g.ctx}</div>`;
    if(auto){const last=g.s[g.s.length-1];q.push({kind:'item',label:'En autonomie',it:{...vary({...last,q:head+last.q,hints:g.s.slice(0,-1).map((x,i)=>`Étape ${i+1} : ${x.q}`)},['input','qcm']),pk:p.k}});}
    else g.s.forEach((x,i)=>q.push({kind:'item',label:`Étape ${i+1}/${g.s.length}`,it:{...vary({...x,q:head+x.q},i===g.s.length-1?['input','qcm']:['qcm','input']),pk:p.k}}));});
  const res={};
  openSession({mode:'prob',title:'🧩 Problèmes',color:P[0].c,queue:q,
    onItem:(s,ok)=>{const k=s.it.pk;if(!k)return;res[k]=res[k]||[];res[k].push(ok&&!s.it.penalty);},
    onEnd:()=>{Object.entries(res).forEach(([k,v])=>{const r=v.filter(Boolean).length/v.length;st.probM[k]=Math.round((probM(k)*.6+r*.4)*100)/100;});
      endScreen({bonus:15,title:'Problèmes résolus !',emoji:'🧩',extra:`<p class="muted">${P.map(p=>`${p.i} ${p.t} : ${probM(p.k)>=.7?'maîtrisé · la prochaine fois en autonomie':'guidé'}`).join('<br>')}</p>`});}});
}
