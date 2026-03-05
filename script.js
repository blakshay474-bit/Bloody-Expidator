// ========== BLOODY EXPEDITOR - Forensic Serology Platform ==========

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCursor();
    initClock();
    initHeader();
    initMobileNav();
    initStatCounters();
    initCaseFilters();
    initCaseSearch();
    initCaseModals();
    initBloodDistChart();
    initMatchDonut();
    initBarCharts();
    initProcessingChart();
    initMetricRings();
    initTimeline();
    initPastAnalysisChart();
    initProbabilityCalc();
    initCorrelationMatrix();
    initCooccurrenceChart();
    initBloodParticles();
    initScrollAnimations();
});

// ========== PRELOADER ==========
function initPreloader() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => { preloader.classList.add('hidden'); }, 2500);
}

// ========== CUSTOM CURSOR ==========
function initCursor() {
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    if (!cursor || !trail) return;
    let mx = 0, my = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.transform = `translate(${mx - 10}px, ${my - 10}px)`; });
    function animateTrail() { tx += (mx - tx) * 0.15; ty += (my - ty) * 0.15; trail.style.transform = `translate(${tx - 4}px, ${ty - 4}px)`; requestAnimationFrame(animateTrail); }
    animateTrail();
    document.querySelectorAll('a, button, select, input, .case-card, .fluid-card, .matrix-cell').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.style.transform += ' scale(1.6)');
        el.addEventListener('mouseleave', () => {});
    });
}

// ========== LIVE CLOCK ==========
function initClock() {
    const clockEl = document.getElementById('clockTime');
    function update() {
        const now = new Date();
        clockEl.textContent = now.toUTCString().split(' ')[4];
    }
    update(); setInterval(update, 1000);
}

// ========== HEADER ==========
function initHeader() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-section') === current));
    });
}

// ========== MOBILE NAV ==========
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('mobileNavOverlay');
    hamburger.addEventListener('click', () => overlay.classList.toggle('open'));
    overlay.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', () => overlay.classList.remove('open')));
}

// ========== STAT COUNTERS ==========
function initStatCounters() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const suffix = el.dataset.suffix || '';
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) { current = target; clearInterval(timer); }
                    el.textContent = Math.floor(current).toLocaleString() + suffix;
                }, 25);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-value[data-count]').forEach(el => observer.observe(el));
}

// ========== CASE FILTERS ==========
function initCaseFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.case-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.4s ease';
                } else { card.classList.add('hidden'); }
            });
        });
    });
}

// ========== CASE SEARCH ==========
function initCaseSearch() {
    const input = document.getElementById('caseSearch');
    const cards = document.querySelectorAll('.case-card');
    input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const id = card.dataset.case.toLowerCase();
            card.classList.toggle('hidden', !text.includes(q) && !id.includes(q));
        });
    });
}

// ========== CASE MODALS ==========
function initCaseModals() {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    const closeBtn = document.getElementById('modalClose');

    const caseData = {
        case1: {
            title: 'The Riverside Homicide', id: 'BX-2024-001', bloodType: 'A+',
            summary: 'A 34-year-old male found deceased near the river bank with multiple blunt force trauma injuries. Blood spatter analysis indicated a struggle at the scene.',
            evidence: [
                { label: 'Blood Type', value: 'A+ (Victim), A+ (Scene Stains)' },
                { label: 'Spatter Pattern', value: 'Medium velocity impact, cast-off present' },
                { label: 'DNA Profile', value: '13/16 STR loci matched suspect' },
                { label: 'Secretor Status', value: 'Secretor (ABH antigens in saliva)' }
            ],
            findings: ['Impact spatter consistent with blunt weapon', 'Transfer stains on suspect clothing matched victim blood type', 'DNA confirmed suspect presence at scene', 'Saliva on victim clothing identified via amylase test'],
            resolution: 'Suspect identified through CODIS match. Blood evidence combined with DNA profile provided conclusive link. Conviction obtained with 99.9997% certainty of match.'
        },
        case2: {
            title: 'Downtown Assault Investigation', id: 'BX-2024-015', bloodType: 'O-',
            summary: 'Multiple victims in a downtown altercation. Complex scene with multiple blood sources requiring deconvolution analysis.',
            evidence: [
                { label: 'Blood Types', value: 'O- (Victim 1), B+ (Victim 2)' },
                { label: 'Secretor Test', value: 'Non-secretor (suspect saliva)' },
                { label: 'Mixed Sample', value: '3-person mixture detected' },
                { label: 'Trace Evidence', value: 'Saliva on broken glass' }
            ],
            findings: ['Differential extraction separated male and female DNA', 'Non-secretor status narrows suspect pool to 20% of population', 'Blood trail mapped suspect exit route', 'Saliva evidence placed suspect at bar 30 mins before incident'],
            resolution: 'Investigation ongoing. Suspect identified through non-secretor status combined with witness testimony. Awaiting full DNA confirmation from degraded samples.'
        },
        case3: {
            title: 'Cold Case: The Warehouse Incident', id: 'BX-2019-042', bloodType: 'B+',
            summary: 'Originally investigated in 2019, this cold case was reopened after new luminol testing revealed previously hidden blood evidence in the warehouse.',
            evidence: [
                { label: 'Blood Type', value: 'B+ (Newly discovered stains)' },
                { label: 'Luminol Result', value: 'Positive chemiluminescence in 3 areas' },
                { label: 'STR Profile', value: 'Partial profile (8/13 loci) from degraded sample' },
                { label: 'Sample Age', value: '~5 years, significant degradation' }
            ],
            findings: ['Luminol revealed cleanup attempt with bleach', 'Degraded DNA yielded partial STR profile', 'Blood type B+ matched missing person report', 'Spatter geometry indicated victim was standing when struck'],
            resolution: 'Partial DNA profile entered into CODIS. Familial DNA search identified potential relative. Case under active review with new forensic techniques being applied.'
        },
        case4: {
            title: 'DNA Linkage: Serial Assault Cases', id: 'BX-2023-078', bloodType: 'AB+',
            summary: 'Three separate assault cases across different jurisdictions linked through common DNA profile found in blood evidence.',
            evidence: [
                { label: 'Blood Type', value: 'AB+ (Perpetrator - all 3 scenes)' },
                { label: 'STR Match', value: '16/16 loci matched across cases' },
                { label: 'Random Match Prob', value: '1 in 4.2 billion' },
                { label: 'CODIS Status', value: 'Confirmed match in database' }
            ],
            findings: ['AB+ blood type (3.4% population) provided initial linkage hypothesis', 'Full 16-locus STR profile confirmed single source', 'Combined Probability of Inclusion exceeded 99.99999%', 'Behavioral analysis consistent with single perpetrator'],
            resolution: 'Suspect arrested based on CODIS hit. Full DNA profile match with random match probability of 1 in 4.2 billion. All three cases resulted in successful prosecution.'
        },
        case5: {
            title: 'The Apartment Complex Murder', id: 'BX-2024-033', bloodType: 'O+',
            summary: 'Domestic violence case with complex scene reconstruction. Victim and suspect blood intermixed throughout apartment.',
            evidence: [
                { label: 'Blood Types', value: 'O+ (Victim), A+ (Suspect)' },
                { label: 'Precipitin Test', value: 'Confirmed human origin' },
                { label: 'Electrophoresis', value: 'PGM and EsD typing completed' },
                { label: 'Volume Estimate', value: '~2.3L blood loss at scene' }
            ],
            findings: ['Victim blood (O+) predominantly in kitchen area', 'Suspect blood (A+) found near entry and on broken glass', 'Blood trail indicates victim attempted to flee', 'Estimated blood volume loss consistent with fatal hemorrhage'],
            resolution: 'Electrophoretic analysis in progress. Preliminary ABO typing clearly separates victim and suspect contributions. Suspect currently in custody pending full DNA results.'
        },
        case6: {
            title: 'Reopened: Parking Garage Attack', id: 'BX-2018-091', bloodType: 'A-',
            summary: '2018 cold case resolved using genetic genealogy combined with touch DNA analysis on dried blood.',
            evidence: [
                { label: 'Blood Type', value: 'A- (6.3% of population)' },
                { label: 'Touch DNA', value: 'Extracted from dried stain on railing' },
                { label: 'Genealogy', value: 'GEDmatch identified 3rd cousin' },
                { label: 'Sample Condition', value: '5+ years old, partially degraded' }
            ],
            findings: ['A- blood type already narrowed pool significantly', 'SNP array genotyping from touch DNA successful', 'Genetic genealogy traced family tree to suspect', 'Confirmatory STR testing matched suspect reference sample'],
            resolution: 'Genetic genealogy identified suspect through familial connections. Subsequent buccal swab confirmed full STR match. Case demonstrated power of combining classical serology with modern genomics.'
        }
    };

    document.querySelectorAll('.case-detail-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const c = caseData[btn.dataset.modal];
            if (!c) return;
            content.innerHTML = `
                <h2>${c.title}</h2>
                <span class="modal-case-id">${c.id} | Blood Type: ${c.bloodType}</span>
                <div class="modal-section"><h4>Case Summary</h4><p>${c.summary}</p></div>
                <div class="modal-section"><h4>Evidence Analysis</h4>
                    <div class="modal-evidence-grid">${c.evidence.map(e => `<div class="modal-ev-item"><strong>${e.label}</strong><span>${e.value}</span></div>`).join('')}</div>
                </div>
                <div class="modal-section"><h4>Key Findings</h4><ul>${c.findings.map(f => `<li>${f}</li>`).join('')}</ul></div>
                <div class="modal-section"><h4>Resolution</h4><p>${c.resolution}</p></div>
            `;
            overlay.classList.add('open');
        });
    });
    closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
}

// ========== BLOOD DISTRIBUTION CHART ==========
function initBloodDistChart() {
    const canvas = document.getElementById('bloodDistChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = 280 * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth, h = 280;

    const data = [
        { label: 'O+', value: 842, color: '#dc2626' },
        { label: 'A+', value: 715, color: '#ef4444' },
        { label: 'B+', value: 348, color: '#b91c1c' },
        { label: 'O-', value: 277, color: '#991b1b' },
        { label: 'A-', value: 198, color: '#7f1d1d' },
        { label: 'AB+', value: 156, color: '#450a0a' },
        { label: 'B-', value: 92, color: '#881337' },
        { label: 'AB-', value: 45, color: '#4c0519' }
    ];

    const max = Math.max(...data.map(d => d.value));
    const barW = (w - 80) / data.length - 10;
    const chartH = h - 60;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateBars();
                observer.unobserve(canvas);
            }
        });
    }, { threshold: 0.3 });
    observer.observe(canvas);

    function animateBars() {
        let progress = 0;
        function draw() {
            progress = Math.min(progress + 0.02, 1);
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#1a1a2e';
            for (let i = 0; i <= 4; i++) {
                const y = 20 + (chartH / 4) * i;
                ctx.fillRect(40, y, w - 60, 1);
                ctx.fillStyle = '#6b6b80';
                ctx.font = '10px Inter';
                ctx.textAlign = 'right';
                ctx.fillText(Math.round(max - (max / 4) * i), 35, y + 4);
                ctx.fillStyle = '#1a1a2e';
            }
            data.forEach((d, i) => {
                const x = 50 + i * (barW + 10);
                const barH = (d.value / max) * chartH * progress;
                const y = 20 + chartH - barH;
                const grad = ctx.createLinearGradient(x, y, x, 20 + chartH);
                grad.addColorStop(0, d.color);
                grad.addColorStop(1, d.color + '44');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
                ctx.fill();
                ctx.fillStyle = '#a1a1b5';
                ctx.font = '11px JetBrains Mono';
                ctx.textAlign = 'center';
                ctx.fillText(d.label, x + barW / 2, h - 10);
                if (progress >= 0.95) {
                    ctx.fillStyle = '#f1f1f5';
                    ctx.font = '10px JetBrains Mono';
                    ctx.fillText(d.value, x + barW / 2, y - 8);
                }
            });
            if (progress < 1) requestAnimationFrame(draw);
        }
        draw();
    }
}

// ========== MATCH DONUT ==========
function initMatchDonut() {
    const canvas = document.getElementById('matchDonut');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 200 * dpr; canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);
    const cx = 100, cy = 100, r = 70, lw = 20;
    const data = [
        { value: 87.3, color: '#dc2626' },
        { value: 8.2, color: '#7f1d1d' },
        { value: 4.5, color: '#333' }
    ];

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animateDonut(); observer.unobserve(canvas); }
        });
    }, { threshold: 0.5 });
    observer.observe(canvas);

    function animateDonut() {
        let progress = 0;
        function draw() {
            progress = Math.min(progress + 0.02, 1);
            ctx.clearRect(0, 0, 200, 200);
            let start = -Math.PI / 2;
            data.forEach(d => {
                const angle = (d.value / 100) * Math.PI * 2 * progress;
                ctx.beginPath();
                ctx.arc(cx, cy, r, start, start + angle);
                ctx.strokeStyle = d.color;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.stroke();
                start += angle + 0.04;
            });
            if (progress < 1) requestAnimationFrame(draw);
        }
        draw();
    }
}

// ========== BAR CHARTS ==========
function initBarCharts() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.bar-fill').forEach(bar => {
                    bar.style.width = bar.dataset.width + '%';
                    bar.classList.add('animated');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    const chartEl = document.getElementById('crimeBarChart');
    if (chartEl) observer.observe(chartEl);
}

// ========== PROCESSING CHART ==========
function initProcessingChart() {
    const canvas = document.getElementById('processingChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = 250 * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth, h = 250;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const values = [185, 210, 245, 278, 312, 295, 340, 365, 380, 352, 410, 445];
    const max = Math.max(...values) * 1.15;
    const pad = { left: 50, right: 20, top: 20, bottom: 40 };
    const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animateLine(); observer.unobserve(canvas); }
        });
    }, { threshold: 0.3 });
    observer.observe(canvas);

    function animateLine() {
        let progress = 0;
        function draw() {
            progress = Math.min(progress + 0.025, 1);
            ctx.clearRect(0, 0, w, h);
            // Grid
            ctx.strokeStyle = '#1a1a2e'; ctx.lineWidth = 1;
            for (let i = 0; i <= 4; i++) {
                const y = pad.top + (ch / 4) * i;
                ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
                ctx.fillStyle = '#6b6b80'; ctx.font = '10px Inter'; ctx.textAlign = 'right';
                ctx.fillText(Math.round(max - (max / 4) * i), pad.left - 8, y + 4);
            }
            // Month labels
            months.forEach((m, i) => {
                const x = pad.left + (cw / (months.length - 1)) * i;
                ctx.fillStyle = '#6b6b80'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
                ctx.fillText(m, x, h - 10);
            });
            // Area fill
            const drawn = Math.ceil(values.length * progress);
            ctx.beginPath();
            ctx.moveTo(pad.left, pad.top + ch);
            for (let i = 0; i < drawn; i++) {
                const x = pad.left + (cw / (values.length - 1)) * i;
                const y = pad.top + ch - (values[i] / max) * ch;
                if (i === 0) ctx.lineTo(x, y); else ctx.lineTo(x, y);
            }
            const lastX = pad.left + (cw / (values.length - 1)) * (drawn - 1);
            ctx.lineTo(lastX, pad.top + ch);
            ctx.closePath();
            const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
            grad.addColorStop(0, 'rgba(220,38,38,0.2)');
            grad.addColorStop(1, 'rgba(220,38,38,0)');
            ctx.fillStyle = grad;
            ctx.fill();
            // Line
            ctx.beginPath();
            for (let i = 0; i < drawn; i++) {
                const x = pad.left + (cw / (values.length - 1)) * i;
                const y = pad.top + ch - (values[i] / max) * ch;
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2.5; ctx.stroke();
            // Dots
            for (let i = 0; i < drawn; i++) {
                const x = pad.left + (cw / (values.length - 1)) * i;
                const y = pad.top + ch - (values[i] / max) * ch;
                ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#dc2626'; ctx.fill();
                ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff'; ctx.fill();
            }
            if (progress < 1) requestAnimationFrame(draw);
        }
        draw();
    }
}

// ========== METRIC RINGS ==========
function initMetricRings() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.metric-circle').forEach(c => {
                    c.style.strokeDashoffset = c.dataset.offset;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    const card = document.querySelector('.card-metrics');
    if (card) observer.observe(card);
}

// ========== TIMELINE ==========
function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); }
        });
    }, { threshold: 0.2 });
    items.forEach(item => observer.observe(item));
}

// ========== PAST ANALYSIS CHART ==========
function initPastAnalysisChart() {
    const canvas = document.getElementById('pastAnalysisChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = 300 * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth, h = 300;
    const pad = { left: 50, right: 20, top: 20, bottom: 40 };
    const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;

    const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    const datasets = [
        { data: [320, 380, 290, 410, 465, 520, 580], color: '#dc2626' },
        { data: [210, 260, 200, 295, 340, 395, 445], color: '#ef4444' },
        { data: [145, 190, 155, 230, 280, 330, 385], color: '#991b1b' },
        { data: [25, 35, 42, 58, 72, 88, 105], color: '#7f1d1d' }
    ];
    const max = 650;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { drawChart(); observer.unobserve(canvas); }
        });
    }, { threshold: 0.3 });
    observer.observe(canvas);

    function drawChart() {
        let progress = 0;
        function draw() {
            progress = Math.min(progress + 0.02, 1);
            ctx.clearRect(0, 0, w, h);
            // Grid
            for (let i = 0; i <= 5; i++) {
                const y = pad.top + (ch / 5) * i;
                ctx.strokeStyle = '#1a1a2e'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
                ctx.fillStyle = '#6b6b80'; ctx.font = '10px Inter'; ctx.textAlign = 'right';
                ctx.fillText(Math.round(max - (max / 5) * i), pad.left - 8, y + 4);
            }
            years.forEach((yr, i) => {
                const x = pad.left + (cw / (years.length - 1)) * i;
                ctx.fillStyle = '#6b6b80'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
                ctx.fillText(yr, x, h - 10);
            });
            datasets.forEach(ds => {
                const drawn = Math.ceil(ds.data.length * progress);
                ctx.beginPath();
                for (let i = 0; i < drawn; i++) {
                    const x = pad.left + (cw / (ds.data.length - 1)) * i;
                    const y = pad.top + ch - (ds.data[i] / max) * ch;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = ds.color; ctx.lineWidth = 2; ctx.stroke();
                for (let i = 0; i < drawn; i++) {
                    const x = pad.left + (cw / (ds.data.length - 1)) * i;
                    const y = pad.top + ch - (ds.data[i] / max) * ch;
                    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = ds.color; ctx.fill();
                }
            });
            if (progress < 1) requestAnimationFrame(draw);
        }
        draw();
    }
}

// ========== PROBABILITY CALCULATOR ==========
function initProbabilityCalc() {
    const btn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('probResults');
    const bloodFreq = {
        general: { 'O+': 37.4, 'O-': 6.6, 'A+': 35.7, 'A-': 6.3, 'B+': 8.5, 'B-': 1.5, 'AB+': 3.4, 'AB-': 0.6 },
        caucasian: { 'O+': 37.0, 'O-': 8.0, 'A+': 33.0, 'A-': 7.0, 'B+': 9.0, 'B-': 2.0, 'AB+': 3.0, 'AB-': 1.0 },
        african: { 'O+': 47.0, 'O-': 4.0, 'A+': 24.0, 'A-': 2.0, 'B+': 18.0, 'B-': 1.0, 'AB+': 4.0, 'AB-': 0.3 },
        hispanic: { 'O+': 53.0, 'O-': 4.0, 'A+': 29.0, 'A-': 2.0, 'B+': 9.0, 'B-': 1.0, 'AB+': 2.0, 'AB-': 0.2 },
        asian: { 'O+': 39.0, 'O-': 1.0, 'A+': 27.0, 'A-': 0.5, 'B+': 25.0, 'B-': 0.4, 'AB+': 7.0, 'AB-': 0.1 }
    };

    btn.addEventListener('click', () => {
        const evBlood = document.getElementById('evidenceBlood').value;
        const susBlood = document.getElementById('suspectBlood').value;
        const evSec = document.getElementById('evidenceSecretor').value;
        const susSec = document.getElementById('suspectSecretor').value;
        const pop = document.getElementById('populationDB').value;

        if (!evBlood || !susBlood) {
            resultsDiv.innerHTML = '<div class="results-placeholder"><p style="color:#ef4444">Please select both blood types to calculate.</p></div>';
            return;
        }

        const isMatch = evBlood === susBlood;
        const secMatch = evSec === susSec;
        const freq = bloodFreq[pop][evBlood];
        const randomMatchProb = freq / 100;
        let combinedProb = randomMatchProb;
        if (evSec && susSec) combinedProb *= secMatch ? (evSec === 'secretor' ? 0.8 : 0.2) : 0;

        const likelihoodRatio = isMatch ? (1 / randomMatchProb).toFixed(1) : 0;
        const popSize = Math.round(1 / combinedProb);
        const evidenceStrength = isMatch ? (combinedProb < 0.02 ? 'Strong' : combinedProb < 0.1 ? 'Moderate' : 'Weak') : 'Exclusionary';
        const barColor = isMatch ? '#10b981' : '#ef4444';
        const barWidth = isMatch ? Math.min((1 - combinedProb) * 100, 99) : 0;

        resultsDiv.innerHTML = `
            <div class="result-content">
                <div class="result-header">
                    <div class="result-status ${isMatch ? 'match' : 'mismatch'}">${isMatch ? '✓ MATCH' : '✗ MISMATCH'}</div>
                    <div class="result-title">${evBlood} vs ${susBlood}</div>
                    <div class="result-subtitle">${isMatch ? 'Blood types are consistent' : 'Blood types do not match — suspect excluded'}</div>
                </div>
                <div class="result-grid">
                    <div class="result-item"><span class="ri-label">Population Frequency</span><span class="ri-value">${freq}%</span></div>
                    <div class="result-item"><span class="ri-label">Random Match Probability</span><span class="ri-value">1 in ${Math.round(1/randomMatchProb)}</span></div>
                    <div class="result-item"><span class="ri-label">Likelihood Ratio</span><span class="ri-value">${likelihoodRatio}:1</span></div>
                    <div class="result-item"><span class="ri-label">Evidence Strength</span><span class="ri-value">${evidenceStrength}</span></div>
                    ${evSec && susSec ? `<div class="result-item"><span class="ri-label">Secretor Match</span><span class="ri-value">${secMatch ? 'Yes' : 'No'}</span></div>
                    <div class="result-item"><span class="ri-label">Combined Discrimination</span><span class="ri-value">1 in ${popSize.toLocaleString()}</span></div>` : ''}
                </div>
                <div class="result-bar">
                    <div class="rb-header"><span>Evidence Weight</span><span>${barWidth.toFixed(1)}%</span></div>
                    <div class="rb-track"><div class="rb-fill" style="width:${barWidth}%;background:${barColor}"></div></div>
                </div>
            </div>
        `;
    });
}

// ========== CORRELATION MATRIX ==========
function initCorrelationMatrix() {
    const container = document.getElementById('correlationMatrix');
    if (!container) return;
    const fluids = ['Blood', 'Saliva', 'Semen', 'Sweat', 'Tears', 'Vag. Sec.', 'Urine'];
    const matrix = [
        [1.00, 0.62, 0.35, 0.71, 0.12, 0.28, 0.18],
        [0.62, 1.00, 0.22, 0.55, 0.31, 0.15, 0.10],
        [0.35, 0.22, 1.00, 0.18, 0.05, 0.72, 0.08],
        [0.71, 0.55, 0.18, 1.00, 0.25, 0.20, 0.35],
        [0.12, 0.31, 0.05, 0.25, 1.00, 0.08, 0.15],
        [0.28, 0.15, 0.72, 0.20, 0.08, 1.00, 0.12],
        [0.18, 0.10, 0.08, 0.35, 0.15, 0.12, 1.00]
    ];

    const size = fluids.length + 1;
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    container.innerHTML = '<div class="matrix-cell header-cell"></div>';
    fluids.forEach(f => { container.innerHTML += `<div class="matrix-cell header-cell">${f}</div>`; });
    matrix.forEach((row, i) => {
        container.innerHTML += `<div class="matrix-cell header-cell">${fluids[i]}</div>`;
        row.forEach(val => {
            const intensity = Math.round(val * 255);
            const r = Math.round(220 * val);
            const g = Math.round(38 * val * 0.3);
            const b = Math.round(38 * val * 0.3);
            const bg = `rgba(${Math.max(r, 20)}, ${g + 15}, ${b + 15}, ${0.15 + val * 0.7})`;
            const textColor = val > 0.5 ? '#fff' : '#a1a1b5';
            container.innerHTML += `<div class="matrix-cell" style="background:${bg};color:${textColor}" title="${fluids[i]} ↔ correlation">${val.toFixed(2)}</div>`;
        });
    });
}

// ========== CO-OCCURRENCE CHART ==========
function initCooccurrenceChart() {
    const canvas = document.getElementById('cooccurrenceChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = 300 * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth, h = 300;
    const pad = { left: 120, right: 20, top: 20, bottom: 30 };

    const pairs = [
        { label: 'Blood + Saliva', value: 62 },
        { label: 'Blood + Sweat', value: 71 },
        { label: 'Semen + Vag. Sec.', value: 72 },
        { label: 'Blood + Semen', value: 35 },
        { label: 'Saliva + Sweat', value: 55 },
        { label: 'Blood + Urine', value: 18 },
        { label: 'Tears + Saliva', value: 31 }
    ];

    const max = 100;
    const barH = 28;
    const gap = 8;
    const chartW = w - pad.left - pad.right;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animateHBars(); observer.unobserve(canvas); }
        });
    }, { threshold: 0.3 });
    observer.observe(canvas);

    function animateHBars() {
        let progress = 0;
        function draw() {
            progress = Math.min(progress + 0.025, 1);
            ctx.clearRect(0, 0, w, h);
            pairs.forEach((p, i) => {
                const y = pad.top + i * (barH + gap);
                ctx.fillStyle = '#a1a1b5'; ctx.font = '11px Inter'; ctx.textAlign = 'right';
                ctx.fillText(p.label, pad.left - 10, y + barH / 2 + 4);
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(pad.left, y, chartW, barH);
                const bw = (p.value / max) * chartW * progress;
                const grad = ctx.createLinearGradient(pad.left, 0, pad.left + chartW, 0);
                grad.addColorStop(0, '#dc2626');
                grad.addColorStop(1, '#7f1d1d');
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.roundRect(pad.left, y, bw, barH, [0, 6, 6, 0]); ctx.fill();
                if (progress > 0.8) {
                    ctx.fillStyle = '#f1f1f5'; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'left';
                    ctx.fillText(p.value + '%', pad.left + bw + 8, y + barH / 2 + 4);
                }
            });
            if (progress < 1) requestAnimationFrame(draw);
        }
        draw();
    }
}

// ========== BLOOD PARTICLES (Canvas Background) ==========
function initBloodParticles() {
    const canvas = document.getElementById('bloodParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);

    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            r: Math.random() * 3 + 1, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.3 + 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 38, 38, ${p.opacity})`; ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    const elements = document.querySelectorAll('.analytics-card, .fluid-card, .pop-reference, .past-analysis, .cooccurrence, .prob-calculator, .prob-results');
    elements.forEach(el => el.classList.add('animate-on-scroll'));
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); }
        });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));
}
