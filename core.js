const V=(()=>{const q=new URLSearchParams(location.search).get('v'),b=document.body.dataset.v;let v=b&&b!=='auto'?b:(q||(()=>{try{return localStorage.getItem('pl_v')}catch(e){}})()||'corp');if(v!=='mod')v='corp';try{localStorage.setItem('pl_v',v)}catch(e){}document.body.classList.add('v-'+v);return v})();
const HOME=V==='mod'?'moderne.html':'index.html';
const pimg=(k,c)=>'<img class="cut '+(c||'')+'" src="'+P[k].img+'" alt="Platinum '+P[k].name+'" loading="lazy">';
(function(){
 const here=location.pathname.split('/').pop()||'index.html';
 const nav=[[HOME,'Accueil',''],['produits.html','Produits','<span class="pst n">11</span>'],[HOME+'#nuancier','Nuancier','<span class="pst g">nouveau</span>'],['revendeurs.html','Revendeurs','<span class="pst b">pro</span>'],[HOME+'#contact','Contact','']];
 const act=h=>h.split('#')[0].split('?')[0]===here&&!h.includes('#')?' class="act"':'';
 document.getElementById('hdr').innerHTML='<header class="top" id="top-h"><a class="logo" href="'+HOME+'" aria-label="Platinum, accueil"><img src="img/logo.png" alt="Platinum"></a><nav aria-label="Menu principal">'+nav.map(n=>'<a href="'+n[0]+'"'+act(n[0])+'>'+n[1]+n[2]+'</a>').join('')+'</nav><div class="hr"><a class="cta" href="revendeurs.html">Devenir revendeur</a><button class="burger" type="button" aria-label="Ouvrir le menu">☰</button></div></header><div class="menu" id="menu"><button class="mx" type="button" aria-label="Fermer">✕</button>'+nav.map(n=>'<a href="'+n[0]+'">'+n[1]+n[2]+'</a>').join('')+'</div>';
 const other=V==='mod'?'corp':'mod',u=new URL(location.href);u.searchParams.set('v',other);u.hash='';
 if(here==='index.html'||here==='moderne.html'||here==='')u.pathname=u.pathname.replace(/[^/]*$/,other==='mod'?'moderne.html':'index.html');
 const sw=document.createElement('a');sw.className='vswitch';sw.href=u.pathname.split('/').pop()+u.search;
 sw.innerHTML=V==='mod'?'<span class="vs-i">🏢</span><span><small>Passer en</small>Version corporate</span>':'<span class="vs-i">🎨</span><span><small>Découvrir la</small>Version moderne</span>';document.body.appendChild(sw);
 const f=document.getElementById('ftr');if(f)f.innerHTML='<footer class="ft"><div class="wrap fg"><div><img src="img/logo.png" alt="Platinum" class="flogo"><p>Fabrication de peintures pour le bâtiment. Le Nom de la Qualité.</p></div><div><h4>Gammes</h4>'+Object.keys(CAT).map(c=>'<a href="produits.html?cat='+c+'">'+CAT[c][0]+'</a>').join('')+'</div><div><h4>Produits</h4>'+ORDER.slice(0,6).map(k=>'<a href="produit.html?p='+k+'">'+P[k].name+'</a>').join('')+'</div><div><h4>Contact</h4><a href="revendeurs.html">Espace revendeurs</a><a href="'+HOME+'#contact">Nous écrire</a><a href="'+FB+'" target="_blank" rel="noopener">Facebook · Platinum Algérie</a></div></div><div class="wrap fb"><span>© Platinum Algérie</span><span>Maquette réalisée par Webminds</span></div></footer>';
 // demo banner
 const b=document.createElement('div');b.id='wm-demo';b.setAttribute('role','note');b.innerHTML='Maquette de démonstration réalisée par Webminds · Proposition non officielle, aucun formulaire n\'est enregistré';document.body.appendChild(b);
 const m=document.getElementById('menu');
 document.addEventListener('click',e=>{if(e.target.closest('.burger'))m.classList.add('open');if(e.target.closest('.mx')||e.target.closest('.menu a'))m.classList.remove('open')});
 const th=document.getElementById('top-h');const s=()=>th.classList.toggle('solid',scrollY>30);addEventListener('scroll',s,{passive:true});s();
 const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.08});
 window.reveal=()=>document.querySelectorAll('.rv:not([data-o])').forEach(e=>{e.dataset.o=1;io.observe(e)});reveal();
})();
function okForm(f,msg){const b=f.querySelector('button[type=submit]'),t=b.textContent;b.textContent=msg;b.disabled=true;b.classList.add('done');setTimeout(()=>{f.reset();b.textContent=t;b.disabled=false;b.classList.remove('done')},3200)}
const WILAYAS='Adrar,Chlef,Laghouat,Oum El Bouaghi,Batna,Béjaïa,Biskra,Béchar,Blida,Bouira,Tamanrasset,Tébessa,Tlemcen,Tiaret,Tizi Ouzou,Alger,Djelfa,Jijel,Sétif,Saïda,Skikda,Sidi Bel Abbès,Annaba,Guelma,Constantine,Médéa,Mostaganem,M\'Sila,Mascara,Ouargla,Oran,El Bayadh,Illizi,Bordj Bou Arréridj,Boumerdès,El Tarf,Tindouf,Tissemsilt,El Oued,Khenchela,Souk Ahras,Tipaza,Mila,Aïn Defla,Naâma,Aïn Témouchent,Ghardaïa,Relizane,Timimoun,Bordj Badji Mokhtar,Ouled Djellal,Béni Abbès,In Salah,In Guezzam,Touggourt,Djanet,El M\'Ghair,El Meniaa'.split(',');
// Modern effect: paint strokes (drag to paint)
function Paint(cv,getColor){
 const host=cv.parentElement,ctx=cv.getContext('2d');let W,H,dpr=Math.min(devicePixelRatio||1,2),down=false,last=null,drips=[];
 const size=()=>{const r=host.getBoundingClientRect();const img=W?ctx.getImageData(0,0,cv.width,cv.height):null;W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};
 size();addEventListener('resize',size);
 const pos=e=>{const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 function stroke(a,b,col,w){const n=Math.max(1,Math.hypot(b.x-a.x,b.y-a.y)/3);for(let i=0;i<n;i++){const t=i/n,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
   for(let j=0;j<6;j++){ctx.globalAlpha=.18+Math.random()*.25;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x+(Math.random()-.5)*w*.9,y+(Math.random()-.5)*w*.35,w*(.18+Math.random()*.12),0,6.283);ctx.fill()}}
  ctx.globalAlpha=1;if(Math.random()<.04)drips.push({x:b.x+(Math.random()-.5)*w*.5,y:b.y,len:20+Math.random()*90,v:.6+Math.random(),w:3+Math.random()*5,col})}
 host.addEventListener('pointerdown',e=>{if(e.target.closest('a,button,input,select,textarea,.chip'))return;if(e.pointerType==='touch'&&!host.classList.contains('painting'))return;down=true;last=pos(e)});
 addEventListener('pointerup',()=>{down=false;last=null});
 host.addEventListener('pointermove',e=>{if(!down)return;const p=pos(e);stroke(last,p,getColor(),innerWidth<700?34:52);last=p});
 function auto(){} 
 function loop(){drips=drips.filter(d=>d.len>0);drips.forEach(d=>{ctx.fillStyle=d.col;ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(d.x,d.y,d.w/2,0,6.283);ctx.fill();d.y+=d.v;d.len-=d.v});ctx.globalAlpha=1;requestAnimationFrame(loop)}loop();
 cv.demo=(col)=>{let x=W*.08,y=H*.72;const pts=[];for(let i=0;i<40;i++)pts.push({x:x+i*(W*.84/40),y:y+Math.sin(i/5)*H*.05-i*H*.004});let i=1;const t=setInterval(()=>{if(i>=pts.length){clearInterval(t);return}stroke(pts[i-1],pts[i],col,innerWidth<700?34:52);i++},18)};
 cv.clear=()=>ctx.clearRect(0,0,W,H);
 return cv;
}
