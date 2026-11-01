/* Tuiles colorées de l'écran principal */
const DS=`stroke="currentColor" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
const DT=`fill="currentColor" font-family="Times New Roman,serif" font-style="italic" font-size="16" font-weight="bold"`;
const DRAW={
  dice:`<rect x="10" y="22" width="40" height="40" rx="9" ${DS}/><rect x="52" y="14" width="40" height="40" rx="9" transform="rotate(12 72 34)" ${DS}/>
    <circle cx="22" cy="34" r="4" fill="currentColor"/><circle cx="38" cy="50" r="4" fill="currentColor"/><circle cx="30" cy="42" r="4" fill="currentColor"/>
    <g transform="rotate(12 72 34)"><circle cx="63" cy="25" r="4" fill="currentColor"/><circle cx="81" cy="25" r="4" fill="currentColor"/><circle cx="63" cy="43" r="4" fill="currentColor"/><circle cx="81" cy="43" r="4" fill="currentColor"/></g>`,
  parab:`<line x1="6" y1="70" x2="94" y2="70" ${DS} stroke-width="2"/><line x1="50" y1="80" x2="50" y2="4" ${DS} stroke-width="2"/>
    <path d="M18 8 Q50 120 82 8" ${DS}/><line x1="8" y1="62" x2="92" y2="18" ${DS} stroke-width="2.4" stroke-dasharray="5 5"/>`,
  geometry:`<path d="M14 68 L82 68 L82 10 Z" ${DS}/><path d="M72 68 L72 58 L82 58" ${DS} stroke-width="2"/>
    <text x="40" y="34" ${DT} font-style="normal">c</text><text x="87" y="44" ${DT}>b</text><text x="44" y="83" ${DT}>a</text>`,
  trig:`<circle cx="46" cy="46" r="26" ${DS}/>
    <line x1="8" y1="46" x2="90" y2="46" ${DS} stroke-width="2"/><path d="M84 41 L90 46 L84 51" ${DS} stroke-width="2"/>
    <line x1="46" y1="82" x2="46" y2="6" ${DS} stroke-width="2"/><path d="M41 12 L46 6 L51 12" ${DS} stroke-width="2"/>
    <line x1="46" y1="46" x2="66" y2="29" ${DS} stroke-width="2.4"/><circle cx="66" cy="29" r="3.5" fill="currentColor"/>`,
  stats:`${[22,36,50,66].map((h,i)=>`<rect x="${16+i*19}" y="${74-h}" width="13" height="${h}" rx="3" fill="currentColor" opacity="${.55+i*.15}"/>`).join('')}
    <line x1="8" y1="76" x2="94" y2="76" ${DS}/>`,
  venn:`<circle cx="38" cy="42" r="27" fill="currentColor" fill-opacity=".25" ${DS}/><circle cx="62" cy="42" r="27" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="3.2"/>
    <text x="21" y="48" ${DT} font-size="18">A</text><text x="69" y="48" ${DT} font-size="18">B</text>`,
};
const TILE={ana:{tex:"f'(x)",alt:'f′(x)'},int:{tex:'\\displaystyle\\int dx',alt:'∫ dx'},alg:{tex:'(a+b)^2',alt:'(a+b)²'},geo:{draw:'geometry'},tri:{draw:'trig'},
 sta:{draw:'stats'},pro:{draw:'dice'},mat:{tex:'\\vec u+\\vec v',alt:'u⃗+v⃗'},rac:{tex:'\\sqrt{x+1}',alt:'√(x+1)'},pui:{tex:'A^{-x}',alt:'A⁻ˣ'},
 ens:{draw:'venn'},fon:{draw:'parab'},sui:{tex:'u_{n+1}',alt:'uₙ₊₁'},exp:{tex:'e^{x}',alt:'eˣ'},pct:{tex:'+20\\%',alt:'+20 %'}};
function renderTiles(){
  document.querySelectorAll('#map .tile').forEach(t=>{
    const x=t.querySelector('.tex');if(!x)return;const T0=TILE[t.dataset.key];
    if(window.katex&&!x.dataset.done){try{katex.render(T0.tex,x,{throwOnError:false});x.dataset.done=1;}catch(e){}}
    x.style.transform='none';const a=x.parentElement;
    const s=Math.min(a.clientWidth*.92/x.scrollWidth,a.clientHeight*.9/x.scrollHeight,1.8);
    if(isFinite(s)&&s>0)x.style.transform=`scale(${s})`;
  });
}
