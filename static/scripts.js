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
});

