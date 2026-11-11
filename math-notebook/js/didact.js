/* =====================================================================
   CORRECTION EN 3 TEMPS (retour immédiat et détaillé)
   1. Ton erreur : ce que tu as probablement fait
   2. La méthode : étapes titrées (le dessin résolu à côté)
   3. À retenir : la règle ou le raccourci en une ligne
   ===================================================================== */
const TIP={
 pui1:'Même base : on additionne les exposants quand on multiplie, on les soustrait quand on divise.',
 pui2:'a⁰ = 1 et a⁻ⁿ = 1/aⁿ : un exposant négatif fait passer « sous la barre ».',
 pui3:'Notation scientifique : un seul chiffre non nul avant la virgule, puis × 10ⁿ.',
 rac1:'√a, c\'est le nombre positif qui, au carré, donne a.',
 rac2:'On sort les carrés parfaits : √(a²b) = a√b.',
 rac3:'√(a + b) n\'est PAS √a + √b. Mais √(a×b) = √a × √b.',
 pct1:'t % de x, c\'est x × t/100.',
 pct2:'Hausse de t % : × (1 + t/100). Baisse : × (1 − t/100).',
 pct3:'Évolutions successives : on multiplie les coefficients, on n\'additionne pas les pourcentages.',
 ens1:'ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ : chaque famille contient la précédente.',
 ens2:'∩ = dans les deux (« et ») ; ∪ = dans l\'un ou l\'autre (« ou »).',
 ens3:'Crochet tourné vers le nombre : inclus. Tourné vers l\'extérieur : exclu.',
 alg1:'Ce qu\'on fait d\'un côté, on le fait de l\'autre, pour isoler x.',
 alg2:'(a + b)² = a² + 2ab + b² : n\'oublie pas le double produit.',
 alg3:'Un produit est nul si l\'un des facteurs est nul.',
 fon1:'f(a) : on remplace x par a. Antécédent : on cherche x tel que f(x) = la valeur.',
 fon2:'y = ax + b : a est la pente, b l\'endroit où la droite coupe l\'axe vertical.',
 fon3:'Δ = b² − 4ac : positif → 2 solutions, nul → 1, négatif → aucune.',
 sui1:'Arithmétique : on ajoute r à chaque fois. uₙ = u₀ + n×r.',
 sui2:'Géométrique : on multiplie par q à chaque fois. uₙ = u₀ × qⁿ.',
 sui3:'1 + 2 + … + n = n(n + 1)/2 (on associe le premier et le dernier).',
 sta1:'Moyenne = somme des valeurs ÷ nombre de valeurs (pondérée par les effectifs).',
 sta2:'Médiane : on range les valeurs, on prend celle du milieu.',
 sta3:'Regarde toujours où commence l\'axe vertical avant de comparer.',
 pro1:'Probabilité = cas favorables ÷ cas possibles (si tout est équiprobable).',
 pro2:'Dans un arbre : on multiplie le long d\'une branche, on additionne entre branches.',
 pro3:'Loi binomiale : espérance = n × p.',
 ana1:'f′(a) est la pente de la tangente en a.',
 ana2:'(xⁿ)′ = n xⁿ⁻¹ ; la dérivée d\'une somme est la somme des dérivées.',
 ana3:'f′ > 0 : f monte ; f′ < 0 : f descend ; f′ s\'annule au sommet.',
 exp1:'eˣ est toujours positive et e⁰ = 1.',
 exp2:'eᵃ × eᵇ = eᵃ⁺ᵇ : même règle que les puissances.',
 exp3:'ln est l\'inverse de exp : ln(eˣ) = x, et ln(ab) = ln a + ln b.',
 int1:'Une intégrale = l\'aire sous la courbe (comptée en négatif sous l\'axe).',
 int2:'Primitive : on fait la dérivée « à l\'envers » ; on vérifie en redérivant.',
 int3:'∫ₐᵇ f = F(b) − F(a), avec F une primitive de f.',
};
function tipOf(it){return it.tip||TIP[it.nid]||'';}
function stepsHTML(it){
  if(!it.steps||!it.steps.length)return it.why?`<p>${it.why}</p>`:'';
  const pre=it.errline&&it.why?`<p>${it.why}</p>`:'';
  return pre+`<ol class="steps">${it.steps.map(([l,t])=>`<li><b>${l}</b><span>${t}</span></li>`).join('')}</ol>`;
}
function tipHTML(it){const t=tipOf(it);return t?`<div class="tipbox"><b>💡 À retenir</b>${t}</div>`:'';}
