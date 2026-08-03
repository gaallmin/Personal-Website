document.addEventListener('DOMContentLoaded', function () {
    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.boxWdesc, .proj-box, .skill-item').forEach(el => {
        observer.observe(el);
    });

    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .boxWdesc, .proj-box, .skill-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .boxWdesc.animate-in, .proj-box.animate-in, .skill-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .boxWdesc.animate-in:nth-child(1) { transition-delay: 0.1s; }
        .boxWdesc.animate-in:nth-child(2) { transition-delay: 0.2s; }
        .boxWdesc.animate-in:nth-child(3) { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);

    // GitHub projects functionality (keeping existing)
    const username = 'gaallmin';
    const pinnedRepos = ['gaallmin', 'AI-Powered-Sketch-Illustration-Search-Service-for-Designers'];

    function fetchGitHubProjects() {
        fetch(`https://api.github.com/users/${username}/repos?sort=created&direction=desc`)
            .then(response => response.json())
            .then(repos => {
                displayProjects(repos);
            })
            .catch(error => console.error('Error fetching GitHub projects:', error));
    }

    function displayProjects(repos) {
        const recentProjectsContainer = document.querySelector('#recent-projects .projects-list');
        const pinnedProjectsContainer = document.querySelector('#pinned-projects .projects-list');

        if (recentProjectsContainer || pinnedProjectsContainer) {
            repos.forEach(repo => {
                const tags = repo.topics.map(topic => `<span class="project-tag">${topic}</span>`).join(' ');
                const projectItem = `
                    <div class="project-item">
                        <div class="project-preview" style="background-image: url('https://via.placeholder.com/600x200');"></div>
                        <h2>${repo.name}</h2>
                        <p>${repo.description}</p>
                        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                        <div class="project-tags">
                            ${tags}
                        </div>
                    </div>
                `;

                if (pinnedRepos.includes(repo.name) && pinnedProjectsContainer) {
                    pinnedProjectsContainer.innerHTML += projectItem;
                } else if (recentProjectsContainer) {
                    recentProjectsContainer.innerHTML += projectItem;
                }
            });
        }
    }

    fetchGitHubProjects();

    // ---------------------------------------------------------------
    // Theme toggle (light / dark, persisted in localStorage)
    // ---------------------------------------------------------------
    (function initThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        const root = document.documentElement;
        const stored = localStorage.getItem('theme');

        if (stored === 'dark') {
            root.setAttribute('data-theme', 'dark');
        }

        function updateIcon() {
            if (!toggleBtn) return;
            const icon = toggleBtn.querySelector('.theme-icon');
            const isDark = root.getAttribute('data-theme') === 'dark';
            if (icon) icon.textContent = isDark ? '☀️' : '🌙';
        }

        updateIcon();

        if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
                const isDark = root.getAttribute('data-theme') === 'dark';
                if (isDark) {
                    root.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                } else {
                    root.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                }
                updateIcon();
            });
        }
    })();

    // ---------------------------------------------------------------
    // Animated stat tiles (count-up on scroll into view)
    // ---------------------------------------------------------------
    (function initStatCounters() {
        const statEls = document.querySelectorAll('.stat-number[data-target]');
        if (!statEls.length) return;

        function animateCount(el) {
            const target = parseFloat(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1400;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(target * eased);
                el.textContent = value + suffix;
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target + suffix;
                }
            }
            requestAnimationFrame(tick);
        }

        const statObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    animateCount(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        statEls.forEach(el => statObserver.observe(el));
    })();

    // ---------------------------------------------------------------
    // Interactive career timeline
    // ---------------------------------------------------------------
    (function initCareerTimeline() {
        const nodesContainer = document.getElementById('timeline-nodes');
        const detailContainer = document.getElementById('timeline-detail');
        if (!nodesContainer || !detailContainer) return;

        const TIMELINE_DATA = [
            {
                date: '2021 – 2023',
                company: 'The Ankh',
                title: 'Data Analyst',
                location: 'Seoul, South Korea',
                bullets: [
                    'Implemented ETL pipelines in PostgreSQL and automated reservation workflows, cutting manual reporting by 35%',
                    'Built analytics dashboards and ran customer review analysis (text mining, sentiment analysis) that shaped menu design and staffing decisions'
                ]
            },
            {
                date: '2022 – 2024',
                company: 'OUTTA',
                title: 'Chief Operating Officer, Deep Learning Mentor',
                location: 'Spain · South Korea · Canada · US',
                bullets: [
                    'Co-founded a global AI education NGO, scaling an AI bootcamp to 900+ applicants in 2 weeks via A/B-tested campaigns',
                    'Designed and delivered an applied ML curriculum (regression, classification, pandas, scikit-learn, TensorFlow), lifting course completion and satisfaction by 20%'
                ]
            },
            {
                date: 'Apr – Jul 2025',
                company: 'SK Enmove',
                title: 'Project Intern',
                location: 'Seoul, South Korea',
                bullets: [
                    'Delivered AI/Digital-Transformation consultations to 25+ cross-functional teams, guiding adoption of Power BI dashboards and RAG-based decision-support chatbots',
                    'Contributed to full-lifecycle BI analysis for supply chain optimisation, from requirements gathering to prototyping'
                ]
            },
            {
                date: 'May 2026 – present',
                company: 'Deciphex',
                title: 'Data Science Intern, Clinical AI / Skin AI',
                location: 'Dublin, Ireland',
                current: true,
                bullets: [
                    'Own an LLM-based coherency-check QA pipeline for finalised histopathology reports, running in production on AWS Bedrock',
                    'Reduced self-refutations ~63% across prompt versions through decision-first (existence-before-severity) evaluation design',
                    'Cut low-severity flags 32 → 14 with a gate-based reasoning frame; built a gold-standard evaluation dataset',
                    'Collaborate directly with subspecialist pathologists on computational-pathology feature annotation'
                ]
            }
        ];

        let activeIndex = TIMELINE_DATA.length - 1;

        function renderDetail(index) {
            const item = TIMELINE_DATA[index];
            detailContainer.innerHTML = `
                <div class="timeline-detail-card">
                    <div class="timeline-detail-header">
                        <span class="company">${item.company}</span>
                        <span class="date">${item.date}</span>
                    </div>
                    <div class="timeline-detail-title">${item.title}</div>
                    <div class="timeline-detail-location">${item.location}</div>
                    <ul>${item.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
                </div>
            `;
        }

        function renderNodes() {
            nodesContainer.innerHTML = TIMELINE_DATA.map((item, i) => `
                <button class="timeline-node${i === activeIndex ? ' active' : ''}${item.current ? ' current' : ''}" data-index="${i}" type="button">
                    <span class="node-dot"></span>
                    <span class="node-date">${item.date}</span>
                    <span class="node-label">${item.company}</span>
                </button>
            `).join('');

            nodesContainer.querySelectorAll('.timeline-node').forEach(btn => {
                btn.addEventListener('click', function () {
                    activeIndex = parseInt(this.getAttribute('data-index'), 10);
                    nodesContainer.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('active'));
                    this.classList.add('active');
                    renderDetail(activeIndex);
                });
            });
        }

        renderNodes();
        renderDetail(activeIndex);
    })();

    // ---------------------------------------------------------------
    // Skill radar chart (SVG, single-series magnitude, hover -> linked projects)
    // ---------------------------------------------------------------
    (function initSkillRadar() {
        const container = document.getElementById('skill-radar');
        const detail = document.getElementById('skill-radar-detail');
        if (!container || !detail) return;

        const SKILLS = [
            { label: 'ML & Deep Learning', value: 90, projects: ['Sketch Image Classification System', 'Agriculture Price Forecast'] },
            { label: 'LLM & GenAI Engineering', value: 88, projects: ['Deciphex coherency-check pipeline', 'ESG policy RAG chatbot (SK Enmove)'] },
            { label: 'Data Engineering & SQL', value: 78, projects: ['The Ankh ETL pipelines', 'Interest Seeker Service'] },
            { label: 'Cloud & MLOps (AWS)', value: 70, projects: ['Deciphex (AWS Bedrock)', 'Big Data & Cloud certifications'] },
            { label: 'Leadership & Communication', value: 92, projects: ['OUTTA (COO)', 'AI Playground (Founder)'] }
        ];

        const size = 320;
        const center = size / 2;
        const maxRadius = size / 2 - 56;
        const angleStep = (Math.PI * 2) / SKILLS.length;

        function pointFor(index, radiusRatio) {
            const angle = angleStep * index - Math.PI / 2;
            return [
                center + Math.cos(angle) * maxRadius * radiusRatio,
                center + Math.sin(angle) * maxRadius * radiusRatio
            ];
        }

        const rings = [0.25, 0.5, 0.75, 1].map(ratio => {
            const pts = SKILLS.map((_, i) => pointFor(i, ratio).join(',')).join(' ');
            return `<polygon points="${pts}" class="radar-ring" />`;
        }).join('');

        const axes = SKILLS.map((_, i) => {
            const [x, y] = pointFor(i, 1);
            return `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" class="radar-axis" />`;
        }).join('');

        const dataPts = SKILLS.map((s, i) => pointFor(i, s.value / 100).join(',')).join(' ');

        const labels = SKILLS.map((s, i) => {
            const [x, y] = pointFor(i, 1.2);
            return `<text x="${x}" y="${y}" class="radar-label" text-anchor="middle" dominant-baseline="middle">${s.label}</text>`;
        }).join('');

        const nodes = SKILLS.map((s, i) => {
            const [x, y] = pointFor(i, s.value / 100);
            return `<circle cx="${x}" cy="${y}" r="7" class="radar-node" data-index="${i}" tabindex="0" role="button" aria-label="${s.label}: ${s.value}%" />`;
        }).join('');

        container.innerHTML = `
            <svg viewBox="0 0 ${size} ${size}" class="radar-svg">
                ${rings}
                ${axes}
                <polygon points="${dataPts}" class="radar-shape" />
                ${labels}
                ${nodes}
            </svg>
        `;

        function showDetail(index) {
            const s = SKILLS[index];
            detail.innerHTML = `
                <strong>${s.label} — ${s.value}%</strong>
                <span class="radar-detail-caption">Related work:</span>
                <ul>${s.projects.map(p => `<li>${p}</li>`).join('')}</ul>
            `;
        }

        container.querySelectorAll('.radar-node').forEach(node => {
            const idx = parseInt(node.getAttribute('data-index'), 10);
            node.addEventListener('mouseenter', () => showDetail(idx));
            node.addEventListener('focus', () => showDetail(idx));
            node.addEventListener('click', () => showDetail(idx));
        });
    })();

    // ---------------------------------------------------------------
    // Project filter bar (projects.html)
    // ---------------------------------------------------------------
    (function initProjectFilter() {
        const filterBar = document.getElementById('project-filter-bar');
        if (!filterBar) return;

        const buttons = filterBar.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.proj-summary-bullet > li[data-tags]');

        buttons.forEach(btn => {
            btn.addEventListener('click', function () {
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filter = this.getAttribute('data-filter');

                items.forEach(item => {
                    const tags = (item.getAttribute('data-tags') || '').split(',');
                    const match = filter === 'all' || tags.includes(filter);
                    item.style.display = match ? '' : 'none';
                });
            });
        });
    })();
});

