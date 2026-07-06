/* ============================================================
   SAVOR — 3D Digital Food Menu
   ============================================================ */

/* ---------- MENU DATA ---------- */
const DISHES = [
  { emoji:'🥗', name:'Garden Aurora',      cat:'starter', tag:'Starter', price:14, desc:'Heirloom greens, citrus pearls & toasted seeds.' },
  { emoji:'🍜', name:'Midnight Ramen',     cat:'main',    tag:'Main',    price:22, desc:'36-hour tonkotsu broth, black garlic oil, soft egg.' },
  { emoji:'🍕', name:'Volcano Margherita', cat:'main',    tag:'Main',    price:19, desc:'Wood-fired, San Marzano, buffalo mozzarella, basil.' },
  { emoji:'🍣', name:'Ocean Constellation',cat:'starter', tag:'Starter', price:26, desc:'Chef-selected nigiri flight with yuzu & wasabi bloom.' },
  { emoji:'🍔', name:'Gold Standard Burger',cat:'main',   tag:'Main',    price:21, desc:'Dry-aged beef, truffle aioli, aged cheddar, brioche.' },
  { emoji:'🍝', name:'Saffron Tangle',     cat:'main',    tag:'Main',    price:24, desc:'Hand-rolled pasta, saffron cream, seared scallop.' },
  { emoji:'🍰', name:'Cloud Nine',         cat:'dessert', tag:'Dessert', price:12, desc:'Vanilla bean cloud cake, raspberry mist, gold dust.' },
  { emoji:'🍫', name:'Dark Matter',        cat:'dessert', tag:'Dessert', price:13, desc:'70% molten chocolate sphere, salted caramel core.' },
  { emoji:'🍨', name:'Frozen Nebula',      cat:'dessert', tag:'Dessert', price:11, desc:'Liquid-nitrogen gelato, torched meringue swirl.' },
  { emoji:'🍹', name:'Sunset Elixir',      cat:'drink',   tag:'Drink',   price:15, desc:'Passionfruit, smoked rosemary, sparkling finish.' },
  { emoji:'☕', name:'Velvet Roast',       cat:'drink',   tag:'Drink',   price:7,  desc:'Single-origin pour-over, notes of cocoa & fig.' },
  { emoji:'🍷', name:'Ruby Reserve',       cat:'drink',   tag:'Drink',   price:18, desc:'Aged reserve red, decanted tableside on request.' },
];

/* ---------- BUILD CARDS ---------- */
const cardsEl = document.getElementById('cards');
cardsEl.innerHTML = DISHES.map((d,i)=>`
  <article class="card" data-cat="${d.cat}" style="transition-delay:${(i%4)*70}ms">
    <span class="card-emoji">${d.emoji}</span>
    <span class="card-tag">${d.tag}</span>
    <h3 class="card-name">${d.name}</h3>
    <p class="card-desc">${d.desc}</p>
    <div class="card-foot">
      <span class="card-price">$${d.price}</span>
      <button class="card-add" aria-label="Add ${d.name}">+</button>
    </div>
  </article>
`).join('');

/* ---------- 3D TILT ON CARDS ---------- */
const cards = [...document.querySelectorAll('.card')];
cards.forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - .5) * -14;
    const ry = (px - .5) * 16;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    card.style.setProperty('--mx', `${px*100}%`);
    card.style.setProperty('--my', `${py*100}%`);
  });
  card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
});

/* ---------- FILTERS ---------- */
document.querySelectorAll('.filter').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelector('.filter.active')?.classList.remove('active');
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c=>{
      const show = f==='all' || c.dataset.cat===f;
      c.classList.toggle('hide', !show);
    });
  });
});

/* ---------- ADD-TO-ORDER MICRO FEEDBACK ---------- */
cardsEl.addEventListener('click', e=>{
  const btn = e.target.closest('.card-add');
  if(!btn) return;
  btn.textContent = '✓';
  btn.style.background = 'var(--gold)';
  btn.style.color = 'var(--bg)';
  setTimeout(()=>{ btn.textContent='+'; btn.style.background=''; btn.style.color=''; }, 900);
});

/* ---------- SCROLL REVEAL ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
},{ threshold:.15 });
document.querySelectorAll('[data-reveal], .card').forEach(el=>io.observe(el));

/* ---------- NAV ON SCROLL ---------- */
const nav = document.getElementById('nav');
addEventListener('scroll', ()=>{ nav.classList.toggle('scrolled', scrollY > 40); });

/* ---------- CUSTOM CURSOR ---------- */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=innerWidth/2, my=innerHeight/2, rxp=mx, ryp=my;
addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
});
(function ringLoop(){
  rxp += (mx-rxp)*.18; ryp += (my-ryp)*.18;
  ring.style.transform = `translate(${rxp}px,${ryp}px) translate(-50%,-50%)`;
  requestAnimationFrame(ringLoop);
})();
document.querySelectorAll('a,button,.card,.filter').forEach(el=>{
  el.addEventListener('mouseenter', ()=>ring.classList.add('hover'));
  el.addEventListener('mouseleave', ()=>ring.classList.remove('hover'));
});

/* ---------- RESERVE FORM ---------- */
document.getElementById('reserve-form').addEventListener('submit', e=>{
  e.preventDefault();
  const note = document.getElementById('reserve-note');
  note.textContent = '✦ Table reserved — a confirmation is on its way. See you tonight.';
  e.target.reset();
});

/* ---------- LOADER ---------- */
addEventListener('load', ()=>{
  setTimeout(()=>document.getElementById('loader').classList.add('done'), 1400);
});

/* ============================================================
   THREE.JS — floating particle & orb background
   ============================================================ */
(function init3D(){
  if(typeof THREE === 'undefined') return;
  const canvas = document.getElementById('bg-canvas');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0705, 0.055);

  const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100);
  camera.position.z = 16;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  /* --- Particle field (golden dust) --- */
  const COUNT = 900;
  const pos = new Float32Array(COUNT*3);
  const spd = new Float32Array(COUNT);
  for(let i=0;i<COUNT;i++){
    pos[i*3]   = (Math.random()-.5)*44;
    pos[i*3+1] = (Math.random()-.5)*34;
    pos[i*3+2] = (Math.random()-.5)*30;
    spd[i] = 0.004 + Math.random()*0.012;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const pMat = new THREE.PointsMaterial({
    color:0xe8b45c, size:0.09, transparent:true, opacity:.85,
    depthWrite:false, blending:THREE.AdditiveBlending
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  /* --- Floating glass orbs --- */
  const orbs = [];
  const orbGeo = new THREE.IcosahedronGeometry(1, 1);
  for(let i=0;i<6;i++){
    const mat = new THREE.MeshStandardMaterial({
      color: i%2 ? 0xe8b45c : 0xf4d9a0,
      roughness:.15, metalness:.9,
      transparent:true, opacity:.28,
      wireframe: i%3===0
    });
    const orb = new THREE.Mesh(orbGeo, mat);
    orb.position.set((Math.random()-.5)*30, (Math.random()-.5)*20, (Math.random()-.5)*14 - 4);
    const s = 0.7 + Math.random()*2.2;
    orb.scale.setScalar(s);
    orb.userData = { rx:(Math.random()-.5)*.006, ry:(Math.random()-.5)*.006, fy:Math.random()*Math.PI*2, amp:.4+Math.random()*.9 };
    scene.add(orb); orbs.push(orb);
  }

  /* --- Lights --- */
  scene.add(new THREE.AmbientLight(0xffffff, .5));
  const key = new THREE.PointLight(0xffd98a, 2.2, 60); key.position.set(10,10,20); scene.add(key);
  const rim = new THREE.PointLight(0xff7a2f, 1.4, 60); rim.position.set(-14,-8,6); scene.add(rim);

  /* --- Pointer parallax --- */
  let tx=0, ty=0;
  addEventListener('mousemove', e=>{
    tx = (e.clientX/innerWidth - .5);
    ty = (e.clientY/innerHeight - .5);
  });

  let scrollN = 0;
  addEventListener('scroll', ()=>{ scrollN = scrollY / (document.body.scrollHeight - innerHeight || 1); });

  let t = 0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.01;

    // particles drift upward, wrap around
    const arr = pGeo.attributes.position.array;
    for(let i=0;i<COUNT;i++){
      arr[i*3+1] += spd[i];
      if(arr[i*3+1] > 17) arr[i*3+1] = -17;
    }
    pGeo.attributes.position.needsUpdate = true;
    points.rotation.y = t*0.02;

    orbs.forEach(o=>{
      o.rotation.x += o.userData.rx;
      o.rotation.y += o.userData.ry;
      o.position.y += Math.sin(t + o.userData.fy) * 0.004 * o.userData.amp;
    });

    // smooth camera parallax from pointer + scroll
    camera.position.x += (tx*6 - camera.position.x)*0.04;
    camera.position.y += (-ty*4 - camera.position.y)*0.04;
    camera.position.z = 16 - scrollN*6;
    camera.lookAt(0,0,0);

    renderer.render(scene, camera);
  }
  if(!reduce) animate(); else renderer.render(scene, camera);

  addEventListener('resize', ()=>{
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();
