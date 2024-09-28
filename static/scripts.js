document.addEventListener('DOMContentLoaded', function () {
    const username = 'gaallmin'; // Replace with your GitHub username
    const pinnedRepos = ['gaallmin', 'AI-Powered-Sketch-Illustration-Search-Service-for-Designers']; // Replace with your pinned repo names

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

            if (pinnedRepos.includes(repo.name)) {
                pinnedProjectsContainer.innerHTML += projectItem;
            } else {
                recentProjectsContainer.innerHTML += projectItem;
            }
        });
    }

    fetchGitHubProjects();
});

