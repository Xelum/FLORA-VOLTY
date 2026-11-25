const sample=document.querySelector('#sample'),tone=document.querySelector('#tone'),cta=document.querySelector('#inquiry'),reduce=matchMedia('(prefers-reduced-motion: reduce)'),swatches=[...document.querySelectorAll('[data-src]')];
function prepare(key){const url='acquisto.html?tinta='+key+'#informazioni';cta.href='#ricontatto';document.body.dataset.tinta=key;document.querySelector('#order-color').href=url}
const viewer=sample.parentElement,coats=[...viewer.querySelectorAll('.coat')],glint=viewer.querySelector('.glint');
let requested=0,finish='hero',shine,lettering;
prepare('hero');
async function setFinish(b){
 const seq=++requested,key=b.dataset.src,name=b.dataset.name;
 const layer=coats.find(x=>x.dataset.finish===key);
 if(layer){layer.loading='eager';try{await layer.decode()}catch(e){if(!layer.naturalWidth)return}}
 if(seq!==requested||finish===key)return;
 finish=key;
 for(const el of coats){el.classList.toggle('on',el.dataset.finish===key)}
 swatches.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
 sample.alt='Flora Volt in '+name;tone.textContent=name;prepare(key);document.querySelector('#finish-count').textContent='0'+(swatches.indexOf(b)+1)+' / 03';
 shine?.cancel();lettering?.cancel();
 if(!reduce.matches&&glint.animate){
 shine=glint.animate([{transform:'translateX(-125%)',opacity:0},{opacity:.58,offset:.4},{transform:'translateX(205%)',opacity:0}],{duration:780,easing:'ease-out'});
 lettering=tone.animate([{opacity:.4,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:320,easing:'ease-out'})
 }
}
const track=document.querySelector('.color-track'),panel=track.firstElementChild,header=document.querySelector('header');
let pin=false,topInset=0,step=0,last=-1,job=0;
function sizeTrack(){
 const viewport=window.visualViewport;
 const visibleHeight=viewport?.height||document.documentElement.clientHeight;
 const usable=visibleHeight-header.offsetHeight;
 topInset=(viewport?.offsetTop||0)+header.offsetHeight+(usable-panel.offsetHeight)/2;
 // Use a naturally scrolling, manually selectable palette when the full panel cannot fit.
 pin=!reduce.matches && panel.offsetHeight+16<=usable;
 step=Math.max(240,Math.round(visibleHeight*.57));
 track.style.setProperty('--pin-top',topInset+'px');track.style.setProperty('--travel',(3*step)+'px');track.classList.toggle('pinned',pin);syncTone();
}
function syncTone(){job=0;if(!pin)return;const delta=topInset-track.getBoundingClientRect().top;
 const n=Math.min(2,Math.max(0,Math.floor(delta/step)));
 if(n!==last){last=n;setFinish(swatches[n])}
}
function queueTone(){if(!job)job=requestAnimationFrame(syncTone)}
swatches.forEach((b,i)=>b.addEventListener('click',()=>{if(pin){const dest=scrollY+track.getBoundingClientRect().top-topInset+(i+.1)*step;window.scrollTo({top:dest,behavior:'instant'});last=i}setFinish(b)}));
addEventListener('scroll',queueTone,{passive:true});addEventListener('resize',sizeTrack);window.visualViewport?.addEventListener('resize',sizeTrack);reduce.addEventListener?.('change',sizeTrack);
if(window.ResizeObserver){const observer=new ResizeObserver(sizeTrack);observer.observe(panel);observer.observe(header)}sizeTrack();
const drive=document.querySelector('.drive'),dock=document.querySelector('.dock'),enter=document.querySelector('#enter'),hint=document.querySelector('.scrollhint');let frame=0;
const limit=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*(3-2*x);
function geom(){return {start:scrollY+drive.getBoundingClientRect().top-parseFloat(getComputedStyle(dock).top||0),span:Math.max(1,drive.offsetHeight-dock.offsetHeight)}}
function render(){frame=0;let {start,span}=geom(),p=limit((scrollY-start)/span),g=ease(limit(p/.56)),c=ease(limit((p-.20)/.73));for(const [k,v] of Object.entries({gate:-102*g+'%',car:.48+.62*c,down:18*c+'px',room:1+.37*c,light:.74+.26*c,titles:1-ease(limit(p/.25)),typey:-p*90+'px',after:ease(limit((p-.62)/.28))}))dock.style.setProperty('--'+k,v);let opened=p>.91;enter.textContent=opened?'Scopri i colori':'Apri il garage';hint.style.opacity=String(1-g)}
function queue(){if(!frame)frame=requestAnimationFrame(render)}addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);render();enter.onclick=()=>{let {start,span}=geom();if((scrollY-start)/span>.91)document.querySelector('#colori').scrollIntoView();else scrollTo({top:start+span,behavior:reduce.matches?'instant':'smooth'})};

const shots=[...document.querySelectorAll('[data-detail]')],slides=[...document.querySelectorAll('.slide')];let shot=0;
function choose(n){shot=(n+shots.length)%shots.length;shots.forEach((el,i)=>{el.setAttribute('aria-pressed',String(i===shot));slides[i].setAttribute('aria-hidden',String(i!==shot))});const selected=shots[shot];document.querySelector('#caption').textContent=selected.dataset.title;document.querySelector('#aboutshot').textContent=selected.dataset.copy;document.querySelector('#count').textContent='0'+(shot+1)}
shots.forEach((b,i)=>{b.onclick=()=>choose(i);b.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();choose(i+(e.key==='ArrowRight'?1:-1));shots[shot].focus()}}});
const gallery=document.querySelector('.slides');let start=null;gallery.onpointerdown=e=>{if(e.pointerType==='touch')start=[e.clientX,e.clientY]};gallery.onpointercancel=()=>start=null;gallery.onpointerup=e=>{if(!start)return;let dx=e.clientX-start[0],dy=e.clientY-start[1];start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)choose(shot+(dx<0?1:-1))};

// A reversible entrance tied to the viewport, with a JS fallback for older browsers.
const readers=[...document.querySelectorAll('.numbers>div,.pad>.tag,.head>h2,.head>p,.tech>h2,.photocaption>h3,.photocaption>p,.cityscape div>p,.lime .head>div,.palette>small,.palette>h3,.tech details')];
readers.forEach(el=>el.classList.add('reader'));
if(!(window.CSS&&CSS.supports('animation-timeline: view()')&&CSS.supports('animation-range: entry 0% entry 100%'))){
 let ticket=0;
 function ink(){ticket=0;const h=innerHeight;const rects=readers.map(el=>el.getBoundingClientRect());
 readers.forEach((el,i)=>{const t=reduce.matches?1:ease(limit((h-rects[i].top)/Math.min(100,h*.14)));el.style.setProperty('--ink',(.22+.78*t).toFixed(3));el.style.setProperty('--rise',((1-t)*16).toFixed(1)+'px')})}
 function update(){if(!ticket)ticket=requestAnimationFrame(ink)}addEventListener('scroll',update,{passive:true});addEventListener('resize',update);reduce.addEventListener?.('change',update);ink()
}
