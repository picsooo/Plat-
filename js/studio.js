import * as THREE from './three.module.min.js';
import {OrbitControls} from './OrbitControls.js';

const PALETTE=[
 ['Neutres',[['Blanc pur','#f6f4ef'],['Ivoire','#efe6d2'],['Lin','#e4d8c3'],['Sable','#d9c09a'],['Greige','#bfb3a2'],['Gris perle','#c9cbcd'],['Gris béton','#8f9296'],['Anthracite','#3a3d42']]],
 ['Chauds',[['Pêche','#f1c6a8'],['Corail','#e9765a'],['Terracotta','#c4623f'],['Ocre','#c98f3a'],['Moutarde','#d6a933'],['Bordeaux','#7c2235'],['Rose poudré','#e3b7b2'],['Caramel','#b07a4b']]],
 ['Frais',[['Céladon','#9fbfa7'],['Sauge','#8e9e82'],['Vert forêt','#2f5a44'],['Bleu ciel','#a9c9e2'],['Azur','#3d7cc9'],['Bleu nuit','#1f3a6e'],['Lavande','#a48cc8'],['Prune','#6b3b6e']]]
];
const ALLC=PALETTE.flatMap(g=>g[1]);
const cname=h=>(ALLC.find(c=>c[1].toLowerCase()===h.toLowerCase())||[h])[0];

const ROOMS={
 salon:{label:'Salon',ico:'🛋️',inside:true},
 chambre:{label:'Chambre',ico:'🛏️',inside:true},
 cuisine:{label:'Cuisine',ico:'🍳',inside:true},
 facade:{label:'Façade',ico:'🏠',inside:false}
};
const PRESETS={
 inside:[['Douceur','#efe6d2','#e4d8c3','#d9c09a','#efe6d2','#f6f4ef'],['Méditerranée','#f6f4ef','#3d7cc9','#f6f4ef','#a9c9e2','#f6f4ef'],['Terre','#e4d8c3','#c4623f','#e4d8c3','#d9c09a','#f6f4ef'],['Nature','#f6f4ef','#8e9e82','#e4d8c3','#9fbfa7','#f6f4ef'],['Élégance','#c9cbcd','#1f3a6e','#c9cbcd','#bfb3a2','#f6f4ef'],['Audace','#efe6d2','#7c2235','#efe6d2','#d6a933','#f6f4ef']],
 facade:[['Classique','#efe6d2','#8f9296','#f6f4ef','#7c2235'],['Méditerranée','#f6f4ef','#c98f3a','#3d7cc9','#3d7cc9'],['Moderne','#c9cbcd','#3a3d42','#3a3d42','#3a3d42'],['Sahara','#d9c09a','#b07a4b','#f6f4ef','#2f5a44']]
};
const PRODUCT={mur:['Suten Plus','Peinture intérieure satinée','sutenplus'],plafond:['Suten','Peinture intérieure satinée','suten'],facade:['Joker Plus','Peinture façade respirante','joker'],soubassement:['EasyCoat Plus EXT','Enduit de finition extérieur','easycoat'],menuiserie:['Joker Plus','Peinture façade','joker'],porte:['Joker Plus','Peinture façade','joker']};

const el=id=>document.getElementById(id);
const wrap=el('stage');
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
wrap.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(72,1,.05,200);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.enablePan=false;controls.autoRotate=true;controls.autoRotateSpeed=.6;
controls.addEventListener('start',()=>{controls.autoRotate=false;el('hint3d')?.classList.add('gone')});

function size(){const r=wrap.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}
addEventListener('resize',size);

// procedural textures
function canvasTex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}t.anisotropy=8;return t}
const woodTex=()=>canvasTex(1024,1024,(g,w,h)=>{const n=8;for(let i=0;i<n;i++){const y=i*h/n;const base=[154,108,70].map(v=>v+(Math.random()*24-12));g.fillStyle=`rgb(${base})`;g.fillRect(0,y,w,h/n);for(let k=0;k<40;k++){g.strokeStyle=`rgba(60,35,15,${Math.random()*.12})`;g.lineWidth=1+Math.random()*2;g.beginPath();const yy=y+Math.random()*h/n;g.moveTo(0,yy);g.bezierCurveTo(w*.3,yy+Math.random()*6-3,w*.6,yy+Math.random()*6-3,w,yy+Math.random()*4-2);g.stroke()}g.fillStyle='rgba(40,25,10,.35)';g.fillRect(0,y,w,2);const off=Math.random()*w;g.fillRect(off,y,2,h/n)}},[3,3]);
const tileTex=()=>canvasTex(512,512,(g,w,h)=>{g.fillStyle='#e8e4dc';g.fillRect(0,0,w,h);const s=w/4;for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle=`hsl(35,10%,${86+Math.random()*5}%)`;g.fillRect(i*s+2,j*s+2,s-4,s-4)}},[4,3]);
const rugTex=(a,b)=>canvasTex(512,512,(g,w,h)=>{g.fillStyle=a;g.fillRect(0,0,w,h);g.strokeStyle=b;g.lineWidth=14;g.strokeRect(30,30,w-60,h-60);g.lineWidth=4;g.strokeRect(60,60,w-120,h-120);for(let i=0;i<4000;i++){g.fillStyle=`rgba(255,255,255,${Math.random()*.05})`;g.fillRect(Math.random()*w,Math.random()*h,2,2)}});
const grassTex=()=>canvasTex(512,512,(g,w,h)=>{g.fillStyle='#5f8a3e';g.fillRect(0,0,w,h);for(let i=0;i<9000;i++){g.fillStyle=`hsla(${80+Math.random()*30},45%,${28+Math.random()*25}%,.6)`;g.fillRect(Math.random()*w,Math.random()*h,2,4)}},[12,12]);
const roofTex=()=>canvasTex(512,512,(g,w,h)=>{g.fillStyle='#9a4a2e';g.fillRect(0,0,w,h);for(let r=0;r<16;r++){for(let c=0;c<10;c++){g.fillStyle=`hsl(14,${45+Math.random()*10}%,${32+Math.random()*10}%)`;g.beginPath();g.ellipse(c*w/10+(r%2)*w/20+w/20,r*h/16+h/32,w/22,h/30,0,0,Math.PI);g.fill()}}},[3,2]);

const M=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.85,metalness:0},o));
function box(w,h,d,mat,x,y,z,parent){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;(parent||scene).add(m);return m}
function cyl(rt,rb,h,mat,x,y,z,seg=24){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m}

let surfaces={},selected=null,hovered=null,cur='salon',groupNames=[];
function clearScene(){while(scene.children.length){const o=scene.children.pop();o.traverse?.(c=>{c.geometry?.dispose();if(c.material){[].concat(c.material).forEach(m=>{m.map?.dispose();m.dispose()})}})}surfaces={};selected=null;hovered=null}
function surf(key,label,mesh,color){mesh.userData.surface=key;if(!surfaces[key])surfaces[key]={label,meshes:[],color};surfaces[key].meshes.push(mesh);mesh.material=M(color,{roughness:.92});mesh.receiveShadow=true;return mesh}
function wall(key,label,w,h,x,y,z,ry,color){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),M(color));m.position.set(x,y,z);m.rotation.y=ry;scene.add(m);return surf(key,label,m,color)}
function windowOn(x,y,z,ry,w=1.8,h=1.5){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;scene.add(g);
 const glass=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:'#cfe6f5'}));glass.position.z=.01;g.add(glass);
 const fm=M('#f4f2ee',{roughness:.5});[[w+.12,.08,0,h/2],[w+.12,.08,0,-h/2],[.08,h,-w/2,0],[.08,h,w/2,0],[.05,h,0,0]].forEach(([a,b,px,py])=>box(a,b,.08,fm,px,py,.04,g));
 const sill=box(w+.3,.05,.2,fm,0,-h/2-.05,.1,g);return g}
function lights(inside){
 scene.add(new THREE.HemisphereLight('#fffaf0','#b9a58c',inside?.55:.8));
 const d=new THREE.DirectionalLight('#fff4e0',inside?1.6:2.4);d.position.set(inside?-6:-12,inside?6:16,inside?3:10);d.castShadow=true;d.shadow.mapSize.set(2048,2048);d.shadow.bias=-.0004;const s=d.shadow.camera;s.left=-12;s.right=12;s.top=12;s.bottom=-12;s.far=60;scene.add(d);
 if(inside){const p=new THREE.PointLight('#ffe2b8',.9,9,1.6);p.position.set(0,2.5,0);scene.add(p)}
}
const W=8,D=6,H=2.8;
function shell(colors,floorTex){
 const [a,b,c,d,ceil]=colors;
 wall('murA','Mur du fond',W,H,0,H/2,-D/2,0,a);
 wall('murB','Mur droit',D,H,W/2,H/2,0,-Math.PI/2,b);
 wall('murC','Mur d\'entrée',W,H,0,H/2,D/2,Math.PI,c);
 wall('murD','Mur gauche',D,H,-W/2,H/2,0,Math.PI/2,d);
 const ce=new THREE.Mesh(new THREE.PlaneGeometry(W,D),M(ceil));ce.rotation.x=Math.PI/2;ce.position.y=H;scene.add(ce);surf('plafond','Plafond',ce,ceil);
 const fl=new THREE.Mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshStandardMaterial({map:floorTex,roughness:.7}));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;scene.add(fl);
 // plinths
 const pm=M('#f4f2ee',{roughness:.5});box(W,.1,.02,pm,0,.05,-D/2+.01);box(W,.1,.02,pm,0,.05,D/2-.01);box(.02,.1,D,pm,W/2-.01,.05,0);box(.02,.1,D,pm,-W/2+.01,.05,0);
}
function plant(x,z,s=1){cyl(.22*s,.17*s,.45*s,M('#2b2b2b',{roughness:.4}),x,.225*s,z);const lm=M('#3d7a4a');for(let i=0;i<7;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.22*s,12,10),lm);l.scale.set(1,1.5,.6);l.position.set(x+(Math.random()-.5)*.35*s,(.75+Math.random()*.6)*s,z+(Math.random()-.5)*.35*s);l.rotation.set(Math.random(),Math.random()*6,Math.random());l.castShadow=true;scene.add(l)}}
function frame(x,y,z,ry,w,h,col){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;scene.add(g);box(w,h,.04,M('#1c1c1c',{roughness:.4}),0,0,.02,g);const p=new THREE.Mesh(new THREE.PlaneGeometry(w-.1,h-.1),new THREE.MeshStandardMaterial({map:canvasTex(256,256,(c,ww,hh)=>{const gr=c.createLinearGradient(0,0,ww,hh);gr.addColorStop(0,col[0]);gr.addColorStop(1,col[1]);c.fillStyle=gr;c.fillRect(0,0,ww,hh);c.fillStyle=col[2];c.beginPath();c.arc(ww*.62,hh*.4,ww*.18,0,7);c.fill()}),roughness:.6}));p.position.z=.045;g.add(p)}

function buildSalon(cols){
 shell(cols,woodTex());
 windowOn(-1.2,1.5,-D/2+.01,0,2.2,1.6);
 const fab=M('#3b3f46'),fab2=M('#4a4f57');
 box(3,.42,1,fab,1.2,.31,-1.8);box(3,.75,.22,fab2,1.2,.68,-2.25);box(.22,.6,1,fab2,-.19,.5,-1.8);box(.22,.6,1,fab2,2.59,.5,-1.8);
 [[.3,'#e9765a'],[2.1,'#c9a24a']].forEach(([x,c])=>{const k=box(.55,.45,.15,M(c),x,.75,-2.05);k.rotation.x=-.2});
 for(const x of[0,2.4])for(const z of[-1.4,-2.2])cyl(.03,.03,.1,M('#111'),x,.05,z,8);
 const rug=new THREE.Mesh(new THREE.PlaneGeometry(3.4,2.3),new THREE.MeshStandardMaterial({map:rugTex('#d8cfc0','#9a7b55')}));rug.rotation.x=-Math.PI/2;rug.position.set(1.2,.005,-.6);rug.receiveShadow=true;scene.add(rug);
 box(1.3,.08,.7,M('#5a3a22',{roughness:.5}),1.2,.42,-.6);[[.65,.3],[-.65,.3],[.65,-.3],[-.65,-.3]].forEach(([dx,dz])=>cyl(.025,.025,.38,M('#1a1a1a',{metalness:.6,roughness:.3}),1.2+dx*.9,.19,-.6+dz*.9,8));
 box(2.4,.5,.45,M('#2e2a26',{roughness:.5}),1.2,.25,D/2-.35);box(1.6,.9,.06,M('#0c0c0c',{roughness:.2,metalness:.3}),1.2,1.15,D/2-.4);
 cyl(.02,.02,1.6,M('#1a1a1a',{metalness:.7}),3.4,.8,-2.4,8);const sh=cyl(.22,.3,.3,M('#f3e3c0',{emissive:'#ffdca0',emissiveIntensity:.6}),3.4,1.65,-2.4);
 plant(-3.3,-2.4,1.2);plant(3.5,2.4,.9);
 frame(W/2-.02,1.55,-.6,-Math.PI/2,1.2,.85,['#c98f3a','#7c2235','#efe6d2']);
 box(.9,2.1,.05,M('#e9e5dd',{roughness:.5}),-2.6,1.05,D/2-.03);
}
function buildChambre(cols){
 shell(cols,woodTex());
 windowOn(2.4,1.5,-D/2+.01,0,1.8,1.5);
 box(2.1,.35,2.3,M('#6b4a32',{roughness:.6}),-1,.25,-1.6);box(2,.25,2.2,M('#f2efe8'),-1,.55,-1.6);
 box(2.3,1.1,.12,M('#3e3a36'),-1,.95,-2.78);
 const duv=box(2.02,.08,1.5,M('#a9bcc9'),-1,.7,-1.15);
 [-1.5,-.5].forEach(x=>box(.75,.18,.4,M('#fbf9f4'),x,.75,-2.45));
 [-2.5,.5].forEach(x=>{box(.55,.5,.45,M('#5a3a22',{roughness:.5}),x,.25,-2.6);cyl(.12,.15,.35,M('#efe0c2',{emissive:'#ffd9a0',emissiveIntensity:.5}),x,.68,-2.6)});
 box(2.2,2.3,.65,M('#e8e2d6',{roughness:.5}),W/2-.4,1.15,1.2).rotation.y=Math.PI/2;
 const rug=new THREE.Mesh(new THREE.PlaneGeometry(2.8,1.8),new THREE.MeshStandardMaterial({map:rugTex('#e7ddd0','#b48f6c')}));rug.rotation.x=-Math.PI/2;rug.position.set(-1,.005,0);scene.add(rug);
 plant(3.4,-2.5,1);frame(-W/2+.02,1.6,-.4,Math.PI/2,1,.7,['#9fbfa7','#1f3a6e','#f6f4ef']);
}
function buildCuisine(cols){
 shell(cols,tileTex());
 windowOn(0,1.6,-D/2+.01,0,1.4,1.1);
 const cab=M('#f1eee8',{roughness:.45}),top=M('#2d2d30',{roughness:.25,metalness:.1});
 box(W-.4,.88,.62,cab,0,.44,-D/2+.33);box(W-.4,.05,.65,top,0,.9,-D/2+.33);
 box(.62,.88,3,cab,-W/2+.33,.44,-1.2);box(.65,.05,3,top,-W/2+.33,.9,-1.2);
 box(2.4,.7,.35,cab,-2.6,2.1,-D/2+.18);box(2.4,.7,.35,cab,2.6,2.1,-D/2+.18);
 box(.8,2,.7,M('#c9cbcd',{metalness:.5,roughness:.3}),W/2-.5,1,-D/2+.38);
 box(.9,.03,.5,M('#9aa0a6',{metalness:.8,roughness:.25}),-.9,.93,-D/2+.33);
 box(1.6,.06,.9,M('#6b4a32',{roughness:.5}),.6,.76,.6);[[.7,.38],[-.7,.38],[.7,-.38],[-.7,-.38]].forEach(([dx,dz])=>cyl(.03,.03,.74,M('#1a1a1a'),.6+dx,.37,.6+dz,8));
 [[-.3,1.25],[1.5,1.25],[-.3,-.05],[1.5,-.05]].forEach(([x,z])=>{box(.42,.05,.42,M('#c9a24a',{roughness:.5}),x,.46,z);box(.42,.45,.05,M('#c9a24a'),x,.7,z+(z>.6?.2:-.2))});
 for(let i=0;i<3;i++){cyl(.008,.008,.4,M('#111'),-.2+i*.8,2.6,.6,6);cyl(.08,.13,.16,M('#1c1c1c',{emissive:'#ffcf8a',emissiveIntensity:.4}),-.2+i*.8,2.34,.6)}
 plant(3.4,2.4,.9);
}
function buildFacade(cols){
 const [fac,sou,men,porte]=cols;
 const gr=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshStandardMaterial({map:grassTex(),roughness:1}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;scene.add(gr);
 const path=new THREE.Mesh(new THREE.PlaneGeometry(2,6),M('#cfc7ba'));path.rotation.x=-Math.PI/2;path.position.set(0,.01,7);path.receiveShadow=true;scene.add(path);
 const hw=9,hd=7,hh=5.6;
 const body=box(hw,hh,hd,M(fac),0,hh/2+.9,0);surf('facade','Façade',body,fac);
 const s1=box(hw+.12,.9,hd+.12,M(sou),0,.45,0);surf('soubassement','Soubassement',s1,sou);
 const band=box(hw+.2,.18,hd+.2,M(men),0,hh/2+.9-.1+hh/2-2.8,0);surf('menuiserie','Bandeau et encadrements',band,men);
 const roofG=new THREE.ConeGeometry(Math.hypot(hw,hd)/2+.6,2.2,4,1);const roof=new THREE.Mesh(roofG,new THREE.MeshStandardMaterial({map:roofTex(),roughness:.8}));roof.rotation.y=Math.PI/4;roof.scale.set(1,1,hd/hw);roof.position.y=hh+.9+1.1;roof.castShadow=true;scene.add(roof);
 const glass=new THREE.MeshStandardMaterial({color:'#2a3b4d',roughness:.1,metalness:.6});
 const wins=[];for(const fy of[2.1,4.9])for(const x of[-3,0,3]){if(fy<3&&x===0)continue;wins.push([x,fy])}
 wins.forEach(([x,y])=>{box(1.2,1.4,.05,glass,x,y,hd/2+.03);['t','b','l','r'].forEach(s=>{const f=s==='t'||s==='b'?box(1.45,.14,.14,M(men),x,y+(s==='t'?.77:-.77),hd/2+.07):box(.14,1.68,.14,M(men),x+(s==='l'?-.67:.67),y,hd/2+.07);surf('menuiserie','Bandeau et encadrements',f,men)});const shut=box(.5,1.4,.05,M(porte),x-.95,y,hd/2+.05);surf('porte','Porte et volets',shut,porte);const shut2=box(.5,1.4,.05,M(porte),x+.95,y,hd/2+.05);surf('porte','Porte et volets',shut2,porte)});
 const door=box(1.3,2.3,.08,M(porte),0,2.05,hd/2+.04);surf('porte','Porte et volets',door,porte);
 const dfr=box(1.6,.18,.2,M(men),0,3.3,hd/2+.1);surf('menuiserie','Bandeau et encadrements',dfr,men);
 // side windows
 [-2,2].forEach(z=>{box(.05,1.4,1.2,glass,hw/2+.03,4.9,z);box(.05,1.4,1.2,glass,-hw/2-.03,4.9,z)});
 for(let i=0;i<5;i++){const t=cyl(.12,.16,1.4,M('#6b4a32'),-9+i*.6+Math.random(),.7,-6+Math.random()*2,8);const c=new THREE.Mesh(new THREE.SphereGeometry(1+Math.random()*.4,14,12),M('#3f6b3a'));c.position.set(t.position.x,2.1,t.position.z);c.castShadow=true;scene.add(c)}
 plant(-2.2,hd/2+1,1.3);plant(2.2,hd/2+1,1.3);
}
function setRoom(k,preset){cur=k;clearScene();const R=ROOMS[k];
 scene.background=new THREE.Color(R.inside?'#20242a':'#bcd6ea');scene.fog=R.inside?null:new THREE.Fog('#bcd6ea',30,70);
 lights(R.inside);
 const p=preset||(R.inside?PRESETS.inside[0]:PRESETS.facade[0]);const cols=p.slice(1);
 ({salon:buildSalon,chambre:buildChambre,cuisine:buildCuisine,facade:buildFacade})[k](cols);
 if(R.inside){camera.position.set(.01,1.6,2.7);controls.target.set(0,1.3,0);controls.minDistance=1.2;controls.maxDistance=2.75;controls.minPolarAngle=Math.PI*.3;controls.maxPolarAngle=Math.PI*.62}
 else{camera.position.set(9,6,14);controls.target.set(0,3,0);controls.minDistance=10;controls.maxDistance=22;controls.minPolarAngle=Math.PI*.2;controls.maxPolarAngle=Math.PI*.48}
 controls.autoRotate=true;controls.update();
 select(Object.keys(surfaces)[R.inside?0:0]);
 drawPresets();drawSurfaces();drawSummary();
 document.querySelectorAll('#rooms button').forEach(b=>b.classList.toggle('on',b.dataset.k===k));
}
function tintSel(on){if(!selected)return;surfaces[selected].meshes.forEach(m=>{m.material.emissive=new THREE.Color(on?'#ffffff':'#000000');m.material.emissiveIntensity=on?.06:0})}
let pulse=0;
function select(k){if(selected)tintSel(false);selected=k;pulse=1;drawSurfaces();el('selname').textContent=surfaces[k]?.label||'';}
function paint(hex,all){const keys=all?Object.keys(surfaces).filter(k=>k.startsWith('mur')):[selected];keys.forEach(k=>{surfaces[k].color=hex;surfaces[k].meshes.forEach(m=>{m.material.color.set(hex)})});drawSurfaces();drawSummary()}
// UI
el('rooms').innerHTML=Object.entries(ROOMS).map(([k,r])=>`<button type="button" data-k="${k}"><span>${r.ico}</span>${r.label}</button>`).join('');
el('rooms').onclick=e=>{const b=e.target.closest('button');if(b)setRoom(b.dataset.k)};
el('pal3').innerHTML=PALETTE.map(([g,cs])=>`<div class="pg"><small>${g}</small><div>${cs.map(c=>`<button type="button" class="c3" style="background:${c[1]}" data-c="${c[1]}" title="${c[0]}" aria-label="${c[0]}"></button>`).join('')}</div></div>`).join('');
el('pal3').onclick=e=>{const b=e.target.closest('.c3');if(b){paint(b.dataset.c,el('allw').checked&&selected?.startsWith('mur'));controls.autoRotate=false}};
function drawSurfaces(){el('surfs').innerHTML=Object.entries(surfaces).map(([k,s])=>`<button type="button" class="${k===selected?'on':''}" data-k="${k}"><i style="background:${s.color}"></i>${s.label}</button>`).join('');}
el('surfs').onclick=e=>{const b=e.target.closest('button');if(b)select(b.dataset.k)};
function drawPresets(){const list=ROOMS[cur].inside?PRESETS.inside:PRESETS.facade;el('presets').innerHTML=list.map((p,i)=>`<button type="button" data-i="${i}"><span>${p.slice(1).map(c=>`<i style="background:${c}"></i>`).join('')}</span>${p[0]}</button>`).join('')}
el('presets').onclick=e=>{const b=e.target.closest('button');if(!b)return;const list=ROOMS[cur].inside?PRESETS.inside:PRESETS.facade;const p=list[+b.dataset.i];const keys=Object.keys(surfaces);p.slice(1).forEach((c,i)=>{const k=keys[i];if(k){surfaces[k].color=c;surfaces[k].meshes.forEach(m=>m.material.color.set(c))}});drawSurfaces();drawSummary()};
function drawSummary(){const rows=Object.entries(surfaces).map(([k,s])=>{const pk=k.startsWith('mur')?'mur':k;const pr=PRODUCT[pk]||PRODUCT.mur;return {label:s.label,color:s.color,name:cname(s.color),prod:pr}});
 el('summary').innerHTML=rows.map(r=>`<li><i style="background:${r.color}"></i><span><b>${r.label}</b> · ${r.name}<small>${r.prod[0]} — ${r.prod[1]}</small></span></li>`).join('');
 const txt='Ma combinaison Studio 360 ('+ROOMS[cur].label+') :\n'+rows.map(r=>'- '+r.label+' : '+r.name+' ('+r.prod[0]+')').join('\n');
 try{sessionStorage.setItem('pl_combo',txt)}catch(e){}
}
el('shot').onclick=()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download='platinum-studio-360.png';a.href=renderer.domElement.toDataURL('image/png');a.click()};
el('rot').onclick=()=>{controls.autoRotate=!controls.autoRotate};
// picking
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();let downAt=null;
renderer.domElement.addEventListener('pointerdown',e=>downAt=[e.clientX,e.clientY]);
renderer.domElement.addEventListener('pointerup',e=>{if(!downAt||Math.hypot(e.clientX-downAt[0],e.clientY-downAt[1])>6)return;const r=renderer.domElement.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mv,camera);const hit=ray.intersectObjects(scene.children,true).find(h=>h.object.userData.surface);if(hit)select(hit.object.userData.surface)});
renderer.domElement.addEventListener('pointermove',e=>{const r=renderer.domElement.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mv,camera);const hit=ray.intersectObjects(scene.children,true).find(h=>h.object.userData.surface);renderer.domElement.style.cursor=hit?'pointer':'grab'});
function loop(){requestAnimationFrame(loop);controls.update();
 if(selected&&surfaces[selected]){pulse=Math.max(0,pulse-.02);const v=.05+pulse*.25;surfaces[selected].meshes.forEach(m=>{m.material.emissive.set('#ffffff');m.material.emissiveIntensity=v*.4})}
 renderer.render(scene,camera)}
size();const q=new URLSearchParams(location.search).get('piece');setRoom(ROOMS[q]?q:'salon');loop();
window.__studio={setRoom,paint,select};
