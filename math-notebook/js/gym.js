/* =====================================================================
   GYM MATHS : 2 minutes d'échauffement, 8 petits exercices variés
   calcul éclair, suites logiques, estimation, nombre mystère…
   chaque exercice a son astuce, propre au calcul demandé
   ===================================================================== */
const N=v=>String(v);
const GYM=[
 ['➕ Calcul éclair',function add(){const a=ri(23,89),b=ri(12,69),d=Math.floor(b/10)*10,u=b%10;
   return DX(QQ(`$${a}+${b}$ ?`,N(a+b),[N(a+b+10),N(a+b-10),N(a+b+1)],`$${a}+${d}=${a+d}$, puis $+${u}$ : $${a+b}$.`,['Ajoute d\'abord les dizaines, puis les unités.']),
     {tip:`Dizaines d'abord : $${a}+${d}=${a+d}$, puis les unités : $${a+d}+${u}=${a+b}$.`});}],
 ['✖️ Table express',function mul(){const k=pick(['9','5','11','4','25']);let n,g,tip;
   if(k==='9'){n=ri(12,49);g=n*9;tip=`× 9 = × 10 − une fois : $${n*10}-${n}=${g}$.`;}
   else if(k==='5'){n=ri(14,98)*2;g=n*5;tip=`× 5 = × 10 ÷ 2 : $${n*10}\\div2=${g}$.`;}
   else if(k==='11'){do{n=ri(12,72);}while(Math.floor(n/10)+n%10>9);const a=Math.floor(n/10),b=n%10;g=n*11;tip=`× 11 : on écarte les chiffres et on met leur somme au milieu : ${a} (${a}+${b}) ${b} → $${g}$.`;}
   else if(k==='4'){n=ri(13,49);g=n*4;tip=`× 4 = le double du double : $${n}\\to${2*n}\\to${g}$.`;}
   else{n=ri(3,19)*4;g=n*25;tip=`× 25 = × 100 ÷ 4 : $${n*100}\\div4=${g}$.`;}
   return DX(QQ(`$${n}\\times${k}$ ?`,N(g),[N(g+n),N(g-n),N(g+10)],tip,['Il y a un raccourci : cherche-le !']),{tip});}],
 ['💯 Complément à 100',function cpl(){const n=ri(13,87),up=Math.ceil(n/10)*10===n?n+10:Math.ceil(n/10)*10;
   return DX(QQ(`Combien faut-il ajouter à $${n}$ pour faire $100$ ?`,N(100-n),[N(110-n),N(90-n),N(101-n)],`$${n}+${100-n}=100$.`,['Va d\'abord à la dizaine suivante.']),
     {tip:`Par étapes : $${n}\\to${up}$ (+${up-n}), puis $${up}\\to100$ (+${100-up}) : $${100-n}$ en tout.`});}],
 ['🔢 Suite logique',function seq(){const k=pick(['add','mul','sq','fib','sub']);let s,g,tip;
   if(k==='add'){const a=ri(2,20),r=ri(3,12);s=[0,1,2,3].map(i=>a+i*r);g=a+4*r;tip=`On ajoute $${r}$ à chaque fois : $${s[3]}+${r}=${g}$.`;}
   else if(k==='sub'){const a=ri(60,99),r=ri(3,9);s=[0,1,2,3].map(i=>a-i*r);g=a-4*r;tip=`On retire $${r}$ à chaque fois : $${s[3]}-${r}=${g}$.`;}
   else if(k==='mul'){const a=ri(1,5),q=pick([2,3]);s=[0,1,2,3].map(i=>a*q**i);g=a*q**4;tip=`Chaque terme est multiplié par $${q}$ : $${s[3]}\\times${q}=${g}$.`;}
   else if(k==='sq'){const a=ri(1,6);s=[0,1,2,3].map(i=>(a+i)**2);g=(a+4)**2;tip=`Ce sont les carrés : $${a}^2, ${a+1}^2, ${a+2}^2, ${a+3}^2$… donc $${a+4}^2=${g}$.`;}
   else{const a=ri(1,4),b=ri(a+1,7);s=[a,b,a+b,a+2*b];g=2*a+3*b;tip=`Chaque terme est la somme des deux précédents : $${s[2]}+${s[3]}=${g}$.`;}
   return DX(QQ(`Quel nombre vient après : $${s.join('\\,;\\;')}\\,;\\;\\ldots$ ?`,N(g),[N(g+1),N(g-2),N(g+s[3]-s[2])].filter(x=>x!==N(g)),tip,['Regarde comment on passe d\'un nombre au suivant.']),{tip});}],
 ['🎯 Estimation',function est(){const a=pick([19,21,29,31,39,41,49,51,59,61,99,101]),b=pick([19,21,29,31,49,51,99]),ra=Math.round(a/10)*10,rb=Math.round(b/10)*10,g=ra*rb;
   return DX(QQ(`Sans poser le calcul : $${a}\\times${b}$ est proche de…`,N(g),[N(g*10),N(g/10),N(ra+rb)],`$${a}\\times${b}=${a*b}$, très proche de $${g}$.`,['Arrondis chaque nombre à la dizaine.']),
     {tip:`On arrondit : $${a}\\approx${ra}$ et $${b}\\approx${rb}$, donc $${ra}\\times${rb}=${g}$.`});}],
 ['⚖️ Le plus grand',function cmp(){const F=[[1,2],[2,3],[3,4],[3,5],[4,5],[5,8],[2,5],[5,6],[7,10],[3,8]];let x,y;do{x=pick(F);y=pick(F);}while(x===y||x[0]*y[1]===y[0]*x[1]);
   const fx=`\\dfrac{${x[0]}}{${x[1]}}`,fy=`\\dfrac{${y[0]}}{${y[1]}}`,big=x[0]*y[1]>y[0]*x[1];
   return DX(QQ(`Quelle fraction est la plus grande ?`,big?fx:fy,[big?fy:fx,'<span>Elles sont égales</span>'],`$${x[0]}\\times${y[1]}=${x[0]*y[1]}$ et $${y[0]}\\times${x[1]}=${y[0]*x[1]}$.`,['Produit en croix.']),
     {tip:`Produit en croix : $${x[0]}\\times${y[1]}=${x[0]*y[1]}$ contre $${y[0]}\\times${x[1]}=${y[0]*x[1]}$ : le plus grand gagne.`});}],
 ['🕵️ Nombre mystère',function mys(){let k,D,c;do{k=pick([6,7,8,9,12]);D=ri(2,9)*10;c=[];for(let v=D;v<=D+9;v++)if(v%k===0)c.push(v);}while(c.length!==1);const n=c[0];
   const others=shuffle([D,D+1,D+2,D+3,D+4,D+5,D+6,D+7,D+8,D+9].filter(v=>v!==n)).slice(0,3);
   return DX(QQ(`Je suis dans la table de $${k}$ et je suis entre $${D}$ et $${D+9}$. Qui suis-je ?`,N(n),others.map(N),`$${k}\\times${n/k}=${n}$.`,[`Récite la table de ${k}.`]),
     {tip:`Table de $${k}$ autour de $${D}$ : $${k}\\times${n/k}=${n}$, c'est le seul entre $${D}$ et $${D+9}$.`});}],
 ['% Pourcentage flash',function pc(){const t=pick([10,20,25,50,5]);const x=t===25?ri(2,30)*4:t===5?ri(2,30)*20:ri(3,40)*10,g=x*t/100;
   const tip={10:`10 % = ÷ 10 : $${x}\\div10=${g}$.`,20:`20 % = 10 % × 2 : $${x/10}\\times2=${g}$.`,25:`25 % = un quart = ÷ 4 : $${x}\\div4=${g}$.`,50:`50 % = la moitié : $${g}$.`,5:`5 % = la moitié de 10 % : $${x/10}\\div2=${g}$.`}[t];
   return DX(QQ(`$${t}\\,\\%$ de $${x}$ ?`,N(g),[N(g*2),N(g/2),N(g+t)].filter(v=>v!==N(g)),tip,['Pense à une fraction simple.']),{tip});}],
 ['🟦 Carré malin',function sq(){const five=Math.random()<.5;let n,g,tip;
   if(five){const a=ri(1,9);n=a*10+5;g=n*n;tip=`Pour un nombre en 5 : $${a}\\times${a+1}=${a*(a+1)}$, puis on colle $25$ : $${g}$.`;}
   else{const u=ri(1,9);n=10+u;g=n*n;tip=`$(10+${u})^2=100+${20*u}+${u*u}=${g}$.`;}
   return DX(QQ(`$${n}^2$ ?`,N(g),[N(g+10),N(g-n),N(2*n)],tip,['Il y a un raccourci.']),{tip});}],
 ['❓ Opération cachée',function op(){const a=ri(3,12),b=ri(2,9);const o=pick(['+','-','\\times']);const r=o==='+'?a+b:o==='-'?a-b:a*b;
   const opts=['+','-','\\times','\\div'];return DX(QQ(`$${a}\\;?\\;${b}=${r}$. Quelle opération ?`,o,opts.filter(x=>x!==o),`$${a}${o}${b}=${r}$.`,['Teste chaque opération.']),
     {tip:`Teste : $${a}+${b}=${a+b}$, $${a}-${b}=${a-b}$, $${a}\\times${b}=${a*b}$. Seule « $${o}$ » donne $${r}$.`});}],
 ['➗ Divisible ?',function div(){const n=ri(1000,9999),k=pick([3,9]),ok=n%k===0,s=String(n).split('').reduce((x,y)=>x+ +y,0);
   return DX(QQ(`$${String(n).replace(/(\d)(\d{3})$/,'$1\\,$2')}$ est-il divisible par $${k}$ ?`,ok?'<span>Oui</span>':'<span>Non</span>',[ok?'<span>Non</span>':'<span>Oui</span>'],`Somme des chiffres : $${s}$.`,['Additionne ses chiffres.']),
     {tip:`Somme des chiffres : $${String(n).split('').join('+')}=${s}$. ${s%k===0?`$${s}$ est dans la table de $${k}$ : oui.`:`$${s}$ n'est pas dans la table de $${k}$ : non.`}`});}],
 ['✂️ Moitié',function half(){const n=ri(51,499)*2,h=Math.floor(n/100)*100,r=n-h;
   return DX(QQ(`La moitié de $${n}$ ?`,N(n/2),[N(n/2+5),N(n/2-10),N(n*2)],`$${n}\\div2=${n/2}$.`,['Coupe le nombre en morceaux faciles.']),
     {tip:`En morceaux : moitié de $${h}$ = $${h/2}$, moitié de $${r}$ = $${r/2}$, total $${n/2}$.`});}],
];
function startGym(){
  const picks=shuffle(GYM.slice()).slice(0,8);
  openSession({mode:'gym',title:'🏋️ Gym maths',color:'#06b6d4',
    queue:picks.map(([lab,g])=>({kind:'item',label:lab,it:vary({...g(),gen:g.name},['qcm','qcm','input'])})),
    onEnd:()=>{const ok=S.nq-[...S.missed].length;st.gym=st.gym||{best:0,n:0,last:''};const rec=st.gym.best;st.gym.best=Math.max(rec,ok);st.gym.n++;st.gym.last=dayStr(new Date());
      endScreen({title:ok>=7?'Cerveau bien échauffé !':ok>=5?'Bon échauffement !':'Échauffement fait !',emoji:'🏋️',bonus:10,
        extra:`<p class="muted">${ok} / ${S.nq} du premier coup${ok>rec&&st.gym.n>1?` · 🏆 nouveau record`:''}. Quelques minutes par jour suffisent : c'est la régularité qui muscle le calcul.</p>`});}});
}
function gymBtn(){const b=$('gymBtn');if(!b)return;const done=st.gym&&st.gym.last===dayStr(new Date());
  b.innerHTML=`<span>🏋️ Gym maths</span><small>${done?'✅ Fait aujourd\'hui · encore une série ?':'2 min pour échauffer ton cerveau'}</small>`;b.onclick=startGym;}
