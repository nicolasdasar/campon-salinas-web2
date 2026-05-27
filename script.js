/* ═══════════════════════════════════════════════════════════════
   MIRADOR DE SALINAS — WEB 2 v6 — HORIZONTAL HERO SLIDER
   ═══════════════════════════════════════════════════════════════ */

// ─── PRELOADER ───
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => preloader.classList.add('hidden'), 600);
    }
});

// ─── NAV ───
const navEl = document.getElementById('nav');
const hbg = document.getElementById('hbg');
const mm = document.getElementById('mobileMenu');
window.addEventListener('scroll', () => navEl.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
hbg.addEventListener('click', () => { const o = mm.classList.toggle('open'); hbg.classList.toggle('open'); document.body.style.overflow = o ? 'hidden' : ''; });
function closeMenu() { mm.classList.remove('open'); hbg.classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('click', e => { if (mm.classList.contains('open') && !mm.contains(e.target) && !hbg.contains(e.target)) closeMenu(); });

// ─── HERO HORIZONTAL SLIDER ───
const heroTrack = document.getElementById('heroTrack');
const heroSlides = heroTrack.querySelectorAll('.hero-slide');
const heroIndC = document.getElementById('heroIndicators');
const heroCounter = document.getElementById('heroCounter');
const heroPrev = document.getElementById('heroPrev');
const heroNext = document.getElementById('heroNext');
let heroCur = 0, heroInt, heroTotal = heroSlides.length;

// Mark first slide active
heroSlides[0].classList.add('active');
heroCounter.textContent = `1 / ${heroTotal}`;

// Create indicator dots
heroSlides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'hero-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => heroGo(i));
    heroIndC.appendChild(d);
});

function heroGo(n) {
    // Remove old active
    heroSlides[heroCur].classList.remove('active');
    heroSlides[heroCur].querySelector('img').style.transform = 'scale(1.00)';
    heroIndC.children[heroCur].classList.remove('active');

    heroCur = ((n % heroTotal) + heroTotal) % heroTotal;

    // Move track
    heroTrack.style.transform = `translateX(-${heroCur * 100}%)`;

    // Set new active
    heroSlides[heroCur].classList.add('active');
    heroIndC.children[heroCur].classList.add('active');
    heroCounter.textContent = `${heroCur + 1} / ${heroTotal}`;

    // Ken Burns on new slide (reset first)
    const img = heroSlides[heroCur].querySelector('img');
    img.style.transform = 'scale(1.00)';
    void img.offsetWidth;
    img.style.transform = 'scale(1.04)';
}

function heroNextFn() { heroGo(heroCur + 1); }
function heroPrevFn() { heroGo(heroCur - 1); }
function startHero() { heroInt = setInterval(heroNextFn, 5500); }
function stopHero() { clearInterval(heroInt); }
startHero();

// Arrows
heroNext.addEventListener('click', e => { e.stopPropagation(); stopHero(); heroNextFn(); startHero(); });
heroPrev.addEventListener('click', e => { e.stopPropagation(); stopHero(); heroPrevFn(); startHero(); });

// Drag / Swipe
const heroEl = document.getElementById('hero');
let dragStartX = 0, dragStartY = 0, isDragging = false, dragDelta = 0;

heroEl.addEventListener('mousedown', e => {
    if (e.target.closest('.hero-arrow, .hero-dot, .btn-primary, .btn-outline')) return;
    isDragging = true; dragStartX = e.clientX; dragStartY = e.clientY; dragDelta = 0;
    stopHero();
    heroTrack.style.transition = 'none';
});
heroEl.addEventListener('mousemove', e => {
    if (!isDragging) return;
    dragDelta = e.clientX - dragStartX;
    const base = -heroCur * 100;
    const pct = (dragDelta / window.innerWidth) * 100;
    heroTrack.style.transform = `translateX(${base + pct}%)`;
});
heroEl.addEventListener('mouseup', finishDrag);
heroEl.addEventListener('mouseleave', e => { if (isDragging) finishDrag(e); });

heroEl.addEventListener('touchstart', e => {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartY = e.touches[0].clientY;
    dragDelta = 0;
    stopHero();
    heroTrack.style.transition = 'none';
}, { passive: true });
heroEl.addEventListener('touchmove', e => {
    if (!isDragging) return;
    dragDelta = e.touches[0].clientX - dragStartX;
    const dy = Math.abs(e.touches[0].clientY - dragStartY);
    if (Math.abs(dragDelta) > dy) e.preventDefault();
    const base = -heroCur * 100;
    const pct = (dragDelta / window.innerWidth) * 100;
    heroTrack.style.transform = `translateX(${base + pct}%)`;
}, { passive: false });
heroEl.addEventListener('touchend', finishDrag);

function finishDrag() {
    if (!isDragging) return;
    isDragging = false;
    heroTrack.style.transition = 'transform .7s cubic-bezier(.4,0,.2,1)';
    if (Math.abs(dragDelta) > 60) {
        if (dragDelta < 0) heroNextFn(); else heroPrevFn();
    } else {
        heroTrack.style.transform = `translateX(-${heroCur * 100}%)`;
    }
    startHero();
}

// Prevent link click after drag
heroEl.addEventListener('click', e => {
    if (Math.abs(dragDelta) > 10) e.preventDefault();
});

// ─── SCROLL REVEAL ───
const rvObs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

// ─── COUNTER ANIMATION ───
const cObs = new IntersectionObserver(es => { es.forEach(e => { if (!e.isIntersecting) return; const el = e.target, t = parseInt(el.dataset.count); if (!t) return; let c = 0; const inc = t / 35; const ti = setInterval(() => { c += inc; if (c >= t) { el.textContent = t; clearInterval(ti); } else el.textContent = Math.floor(c); }, 25); cObs.unobserve(el); }); }, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));

// ─── LIGHTBOX ───
const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lightbox-img');

// Set zoom cursor for interactive containers
document.querySelectorAll('.mini-carousel, #hero, .living-render img, .hotspot-wrap img').forEach(el => {
    el.style.cursor = 'zoom-in';
});

// Click listener for mini-carousels (finds active slide)
document.querySelectorAll('.mini-carousel').forEach(mc => {
    mc.addEventListener('click', e => {
        if (e.target.closest('.mc-arrow, .mc-dots, .mc-dot')) return;
        const activeSlide = mc.querySelector('.mc-slide.active');
        if (activeSlide) {
            const img = activeSlide.querySelector('img');
            if (img) {
                lbImg.src = img.src;
                lbImg.alt = img.alt || 'Mirador de Salinas';
                lb.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        }
    });
});

// Click listener for hero slider (finds active slide)
if (heroEl) {
    heroEl.addEventListener('click', e => {
        if (e.target.closest('.hero-arrow, .hero-dot, .btn-primary, .btn-outline')) return;
        const activeSlide = heroEl.querySelector('.hero-slide.active');
        if (activeSlide) {
            const img = activeSlide.querySelector('img');
            if (img) {
                lbImg.src = img.src;
                lbImg.alt = img.alt || 'Mirador de Salinas';
                lb.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        }
    });
}

// Click listener for static zoomable images
document.querySelectorAll('.living-render img, .hotspot-wrap img').forEach(img => {
    img.addEventListener('click', () => {
        lbImg.src = img.src;
        lbImg.alt = img.alt || 'Mirador de Salinas';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() { lb.classList.remove('open'); document.body.style.overflow = ''; }
lb.addEventListener('click', e => { if (e.target === lb || e.target === lbImg) closeLightbox(); });

// ─── KB DIRECTIONS (for mini carousels) ───
const kbClasses = ['kb-right', 'kb-left', 'kb-up', 'kb-down'];
function setKB(img, slideIndex) {
    kbClasses.forEach(c => img.classList.remove(c));
    void img.offsetWidth;
    img.classList.add(kbClasses[slideIndex % kbClasses.length]);
}

// ─── MINI CAROUSELS ───
document.querySelectorAll('.mini-carousel').forEach(mc => {
    const mcSlides = mc.querySelectorAll('.mc-slide');
    if (mcSlides.length <= 1) return;
    let idx = 0;
    setKB(mcSlides[0].querySelector('img'), 0);

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'mc-dots';
    mcSlides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'mc-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => mcGo(i));
        dotsWrap.appendChild(dot);
    });
    mc.appendChild(dotsWrap);

    const prev = document.createElement('button');
    prev.className = 'mc-arrow mc-prev'; prev.innerHTML = '‹';
    prev.addEventListener('click', () => mcGo((idx - 1 + mcSlides.length) % mcSlides.length));
    mc.appendChild(prev);

    const next = document.createElement('button');
    next.className = 'mc-arrow mc-next'; next.innerHTML = '›';
    next.addEventListener('click', () => mcGo((idx + 1) % mcSlides.length));
    mc.appendChild(next);

    const counter = document.createElement('div');
    counter.className = 'mc-counter';
    counter.textContent = `1 / ${mcSlides.length}`;
    mc.appendChild(counter);

    function mcGo(n) {
        const oldImg = mcSlides[idx].querySelector('img');
        kbClasses.forEach(c => oldImg.classList.remove(c));
        mcSlides[idx].classList.remove('active');
        dotsWrap.children[idx].classList.remove('active');
        idx = n;
        mcSlides[idx].classList.add('active');
        dotsWrap.children[idx].classList.add('active');
        counter.textContent = `${idx + 1} / ${mcSlides.length}`;
        setKB(mcSlides[idx].querySelector('img'), idx);
    }

    let mcInt = setInterval(() => mcGo((idx + 1) % mcSlides.length), 5000);
    mc.addEventListener('mouseenter', () => clearInterval(mcInt));
    mc.addEventListener('mouseleave', () => { mcInt = setInterval(() => mcGo((idx + 1) % mcSlides.length), 5000); });
});

// ─── TIPOLOGÍAS TABS ───
const tTabs = document.querySelectorAll('.tipo-tab');
const tPanels2 = document.querySelectorAll('.tipo-panel');
tTabs.forEach(tab => { tab.addEventListener('click', () => { tTabs.forEach(t => t.classList.remove('active')); tPanels2.forEach(p => p.hidden = true); tab.classList.add('active'); document.getElementById('tipo-' + tab.dataset.tipo).hidden = false; }); });

// ─── UNIT DATA ───
function totalM2(u) {
    const c = parseFloat(u.m2.replace(',', '.'));
    const t = parseFloat(u.terrace.replace(',', '.'));
    return (c + t).toFixed(2).replace('.', ',');
}

const units = [
    { name:'1º B', portal:12, type:'Tipo B', beds:2, baths:2, m2:'67,77', terrace:'12,19', price:'390.000,00 €', oldPrice:'405.000,00 €', plan:'plans_final/page_13_left.png', cat:'2dorm', floor:'Planta 1ª' },
    { name:'1º C', portal:12, type:'Tipo C', beds:1, baths:1, m2:'44,52', terrace:'11,25', price:'260.000,00 €', oldPrice:'275.000,00 €', plan:'plans_final/page_15_left.png', cat:'1dorm', floor:'Planta 1ª' },
    { name:'1º D', portal:12, type:'Tipo D', beds:1, baths:1, m2:'46,79', terrace:'11,25', price:'275.000,00 €', oldPrice:'285.000,00 €', plan:'plans_final/page_15_right.png', cat:'1dorm', floor:'Planta 1ª' },
    { name:'2º B', portal:12, type:'Tipo B', beds:2, baths:2, m2:'67,77', terrace:'12,09', price:'385.000,00 €', oldPrice:'405.000,00 €', plan:'plans_final/page_13_right.png', cat:'2dorm', floor:'Planta 2ª' },
    { name:'2º A', portal:12, type:'Tipo A', beds:3, baths:2, m2:'94,85', terrace:'11,25', price:'525.000,00 €', oldPrice:'550.000,00 €', plan:'plans_final/page_14_right.png', cat:'3dorm', floor:'Planta 2ª' },
    { name:'3º B', portal:12, type:'Tipo B', beds:2, baths:2, m2:'67,77', terrace:'12,19', price:'395.000,00 €', oldPrice:'415.000,00 €', plan:'plans_final/page_13_left.png', cat:'2dorm', floor:'Planta 3ª' },
    { name:'3º C', portal:12, type:'Tipo C', beds:1, baths:1, m2:'44,52', terrace:'11,25', price:'270.000,00 €', oldPrice:'280.000,00 €', plan:'plans_final/page_15_left.png', cat:'1dorm', floor:'Planta 3ª' },
    { name:'3º D', portal:12, type:'Tipo D', beds:1, baths:1, m2:'46,79', terrace:'11,25', price:'280.000,00 €', oldPrice:'290.000,00 €', plan:'plans_final/page_15_right.png', cat:'1dorm', floor:'Planta 3ª' },
    { name:'4º B', portal:12, type:'Tipo B', beds:2, baths:2, m2:'67,77', terrace:'12,09', price:'395.000,00 €', oldPrice:'415.000,00 €', plan:'plans_final/page_13_right.png', cat:'2dorm', floor:'Planta 4ª' },
    { name:'4º A', portal:12, type:'Tipo A', beds:3, baths:2, m2:'94,85', terrace:'11,25', price:'535.000,00 €', oldPrice:'560.000,00 €', plan:'plans_final/page_14_right.png', cat:'3dorm', floor:'Planta 4ª' },
    { name:'5º Ad', portal:12, type:'Ático Dúplex Ad', beds:4, baths:3, m2:'135,06', terrace:'26,78', price:'815.000,00 €', oldPrice:'855.000,00 €', plan:'plans_final/page_12_full.png', cat:'atico', floor:'Planta 5ª-6ª' },
    { name:'5º Bd', portal:12, type:'Ático Dúplex Bd', beds:3, baths:3, m2:'96,01', terrace:'21,23', price:'590.000,00 €', oldPrice:'610.000,00 €', plan:'plans_final/page_16_full.png', cat:'atico', floor:'Planta 5ª-6ª' },
    { name:'1º B', portal:14, type:'Tipo B', beds:2, baths:2, m2:'67,77', terrace:'12,19', price:'390.000,00 €', oldPrice:'405.000,00 €', plan:'plans_final/page_13_left.png', cat:'2dorm', floor:'Planta 1ª' },
    { name:'1º C', portal:14, type:'Tipo C', beds:1, baths:1, m2:'44,52', terrace:'11,25', price:'260.000,00 €', oldPrice:'275.000,00 €', plan:'plans_final/page_15_left.png', cat:'1dorm', floor:'Planta 1ª' },
    { name:'1º D', portal:14, type:'Tipo D', beds:1, baths:1, m2:'46,79', terrace:'11,25', price:'275.000,00 €', oldPrice:'285.000,00 €', plan:'plans_final/page_15_right.png', cat:'1dorm', floor:'Planta 1ª', status:'reservado' },
    { name:'2º B', portal:14, type:'Tipo B', beds:2, baths:2, m2:'67,77', terrace:'12,09', price:'385.000,00 €', oldPrice:'405.000,00 €', plan:'plans_final/page_13_right.png', cat:'2dorm', floor:'Planta 2ª' },
    { name:'2º A', portal:14, type:'Tipo A', beds:3, baths:2, m2:'94,85', terrace:'11,25', price:'525.000,00 €', oldPrice:'550.000,00 €', plan:'plans_final/page_14_right.png', cat:'3dorm', floor:'Planta 2ª' },
    { name:'3º B', portal:14, type:'Tipo B', beds:2, baths:2, m2:'67,77', terrace:'12,19', price:'395.000,00 €', oldPrice:'415.000,00 €', plan:'plans_final/page_13_left.png', cat:'2dorm', floor:'Planta 3ª' },
    { name:'3º C', portal:14, type:'Tipo C', beds:1, baths:1, m2:'44,52', terrace:'11,25', price:'270.000,00 €', oldPrice:'280.000,00 €', plan:'plans_final/page_15_left.png', cat:'1dorm', floor:'Planta 3ª' },
    { name:'3º D', portal:14, type:'Tipo D', beds:1, baths:1, m2:'46,79', terrace:'11,25', price:'280.000,00 €', oldPrice:'290.000,00 €', plan:'plans_final/page_15_right.png', cat:'1dorm', floor:'Planta 3ª' },
    { name:'4º B', portal:14, type:'Tipo B', beds:2, baths:2, m2:'67,77', terrace:'12,09', price:'395.000,00 €', oldPrice:'415.000,00 €', plan:'plans_final/page_13_right.png', cat:'2dorm', floor:'Planta 4ª' },
    { name:'4º A', portal:14, type:'Tipo A', beds:3, baths:2, m2:'94,85', terrace:'11,25', price:'535.000,00 €', oldPrice:'560.000,00 €', plan:'plans_final/page_14_right.png', cat:'3dorm', floor:'Planta 4ª' },
    { name:'5º Ad', portal:14, type:'Ático Dúplex Ad', beds:4, baths:3, m2:'135,06', terrace:'26,78', price:'815.000,00 €', oldPrice:'855.000,00 €', plan:'plans_final/page_12_full.png', cat:'atico', floor:'Planta 5ª-6ª' },
    { name:'5º Bd', portal:14, type:'Ático Dúplex Bd', beds:3, baths:3, m2:'96,01', terrace:'21,23', price:'590.000,00 €', oldPrice:'610.000,00 €', plan:'plans_final/page_16_full.png', cat:'atico', floor:'Planta 5ª-6ª' },
];

// ─── TIPOLOGÍAS UNIT LISTS ───
function renderTipoUnits() {
    const cats = { '1dorm': [], '2dorm': [], '3dorm': [], 'atico': [] };
    units.forEach((u, i) => cats[u.cat].push({ ...u, idx: i }));
    Object.keys(cats).forEach(cat => {
        const list = document.getElementById('units-' + cat);
        if (!list) return;
        list.innerHTML = cats[cat].filter(u => u.status !== 'reservado').map(u => `
            <li onclick="showPlan(${u.idx})">
                <span><strong>${u.name}</strong> — Portal ${u.portal} · ${u.floor} · ${totalM2(u)} m² totales (${u.m2} + ${u.terrace} m² terraza) · ${u.beds} dorm.</span>
                <span class="see-plan">Ver plano →</span>
            </li>
        `).join('');
    });
}
renderTipoUnits();

// ─── CONTACT SELECT ───
(function() {
    const sel = document.getElementById('ct-u');
    if (!sel) return;
    units.forEach(u => {
        const opt = document.createElement('option');
        opt.value = `${u.name} — Portal ${u.portal}`;
        opt.textContent = `${u.name} — P${u.portal} (${u.type} · ${u.m2} m²)`;
        sel.appendChild(opt);
    });
})();

// ─── UNITS GRID ───
function renderUnits() {
    const grid = document.getElementById('units-grid');
    if (!grid) return;
    grid.innerHTML = units.map((u, i) => `
        <div class="unit-card rv${u.status === 'reservado' ? ' unit-reserved' : ''}" style="transition-delay:${Math.min(i * 0.04, 0.4)}s">
            ${u.status === 'reservado' ? '<div class="unit-reserved-badge">Reservado</div>' : ''}
            <div class="unit-portal">Portal ${u.portal} · ${u.floor}</div>
            <div class="unit-name">${u.name} — Portal ${u.portal}</div>
            <div class="unit-type">${u.type}</div>
            <div class="unit-details">
                <span class="unit-det">🛏 ${u.beds} dorm.</span>
                <span class="unit-det">🚿 ${u.baths} baño${u.baths > 1 ? 's' : ''}</span>
            </div>
            <div class="unit-surfaces">
                <div class="unit-surf-row"><span>Superficie total</span><strong>${totalM2(u)} m²</strong></div>
                <div class="unit-surf-row"><span>Sup. construida</span><span>${u.m2} m²</span></div>
                <div class="unit-surf-row"><span>Sup. terraza</span><span>${u.terrace} m²</span></div>
            </div>
            <div class="unit-pricing">
                <div class="unit-old-price">${u.oldPrice}</div>
                <div class="unit-promo-label">Precio exclusivo en promoción</div>
                <div class="unit-promo-price">${u.price}</div>
                <div class="unit-includes">Incluye garaje y trastero</div>
            </div>
            <div class="unit-actions">
                ${u.status === 'reservado' ? '<span class="u-btn" style="background:#aaa;color:white;text-align:center;flex:1;cursor:default">Reservado</span>' : `<button class="u-btn u-btn-plan" onclick="showPlan(${i})">Ver Plano</button>`}
            </div>
        </div>
    `).join('');
    grid.querySelectorAll('.rv').forEach(el => rvObs.observe(el));
}
renderUnits();

// ─── MODALS ───
function showPlan(i) {
    document.getElementById('modal-plan-img').src = units[i].plan;
    document.getElementById('plan-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function showPrice(i) {
    const u = units[i];
    document.getElementById('modal-price-name').textContent = `${u.name} — Portal ${u.portal}`;
    document.getElementById('modal-price-value').innerHTML = `<span style="text-decoration:line-through;color:#999;font-size:1.2rem">${u.oldPrice}</span><br><span style="font-size:.65rem;color:var(--gold);letter-spacing:1px;text-transform:uppercase;font-weight:700">Precio exclusivo en promoción</span><br>${u.price}<br><span style="font-size:.75rem;color:var(--text-dark-soft);margin-top:8px;display:inline-block;font-style:italic">Incluye garaje y trastero</span>`;
    document.getElementById('price-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeModals() {
    document.querySelectorAll('.modal-ov').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
}
document.querySelectorAll('.modal-ov').forEach(ov => { ov.addEventListener('click', e => { if (e.target === ov) closeModals(); }); });

// ─── PAYMENT PLAN ───
function switchPay(opt) {
    const a = document.getElementById('btn-pa'), b = document.getElementById('btn-pb');
    if (opt === 'a') {
        a.classList.add('active'); b.classList.remove('active');
        document.getElementById('s3a').hidden = false; document.getElementById('s3b').hidden = true;
        document.getElementById('pay-sum-txt').innerHTML = '<strong>Resumen (Opción A):</strong> Reserva de 6.000€, 10% arras (máx. 5 meses), 10% al 50% de construcción, y el <strong>80% restante</strong> a la entrega de llaves.';
    } else {
        b.classList.add('active'); a.classList.remove('active');
        document.getElementById('s3a').hidden = true; document.getElementById('s3b').hidden = false;
        document.getElementById('pay-sum-txt').innerHTML = '<strong>Resumen (Opción B):</strong> Reserva de 6.000€, 10% arras (máx. 5 meses), 10% mensualizable desde el inicio de obra hasta la mitad de obra, y el <strong>80% restante</strong> a la entrega de llaves.';
    }
}

// ─── CONTACT FORM ───
function sendContactForm(event) {
    const btn = document.getElementById('btn-submit'), fb = document.getElementById('form-feedback');
    btn.disabled = true; btn.textContent = 'Enviando...'; btn.style.opacity = '0.6';
    setTimeout(() => {
        btn.textContent = '✓ Enviado'; btn.style.background = '#2d7d46';
        fb.style.display = 'block'; fb.style.color = '#2d7d46';
        fb.textContent = 'Hemos recibido su consulta. Nos pondremos en contacto a la mayor brevedad.';
        setTimeout(() => { document.getElementById('contact-form').reset(); btn.disabled = false; btn.textContent = 'Enviar Consulta'; btn.style.opacity = '1'; btn.style.background = ''; fb.style.display = 'none'; }, 5000);
    }, 1500);
}

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => { a.addEventListener('click', function(e) { e.preventDefault(); const t = document.querySelector(this.getAttribute('href')); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });

// ─── ESC ───
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModals(); closeLightbox(); } });
// ─── Arrow keys for hero ───
document.addEventListener('keydown', e => {
    if (document.querySelector('.modal-ov.open, .lightbox.open')) return;
    if (e.key === 'ArrowRight') { stopHero(); heroNextFn(); startHero(); }
    if (e.key === 'ArrowLeft') { stopHero(); heroPrevFn(); startHero(); }
});
