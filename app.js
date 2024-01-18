
        // Function to get URL parameters
        function getUrlParameter(name) {
            name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        // Get username from URL parameter
        const username = getUrlParameter('username');

        let currentPage = 1;
        let repositoriesPerPage = 10;
        let totalRepositories = 0;
        let repositories = [];

        function updatePerPage() {
            repositoriesPerPage = parseInt(document.getElementById('perPage').value);
            currentPage = 1; // Reset to first page when changing repositories per page
            fetchUserDetails();
            fetchRepositories();
        }

        function filterRepositories() {
            const searchValue = document.getElementById('search').value.toLowerCase();
            const filteredRepositories = repositories.filter(repo =>
                repo.name.toLowerCase().includes(searchValue)
            );
            displayRepositories(filteredRepositories);
        }

        function fetchUserDetails() {
            const userUrl = `https://api.github.com/users/${username}`;
            
            fetch(userUrl)
                .then(response => response.json())
                .then(user => {
                    displayUserDetails(user);
                })
                .catch(error => console.error('Error fetching user details:', error));
        }

        function fetchRepositories() {
            const url = `https://api.github.com/users/${username}/repos?per_page=${repositoriesPerPage}&page=${currentPage}`;
            
            // Show loader
            document.getElementById('loader').style.display = 'block';

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    totalRepositories = data.length;
                    repositories = data;
                    displayRepositories(data);
                })
                .catch(error => console.error('Error fetching repositories:', error))
                .finally(() => {
                    // Hide loader
                    document.getElementById('loader').style.display = 'none';
                });
        }

        function displayUserDetails(user) {
            const userDetailsDiv = document.getElementById('userDetails');
            userDetailsDiv.innerHTML = `
                <h2>${user.name}</h2>
                <p>Username: ${user.login}</p>
                <p>Followers: ${user.followers}</p>
                <p>Following: ${user.following}</p>
            `;
        }

        function displayRepositories(repos) {
            const repositoriesDiv = document.getElementById('repositories');
            repositoriesDiv.innerHTML = ''; // Clear previous content

            repos.forEach(repo => {
                const repoDiv = document.createElement('div');
                repoDiv.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>Topics: ${repo.topics.join(', ')}</p>
                `;
                repositoriesDiv.appendChild(repoDiv);
            });
        }

        // Initial fetch
        fetchUserDetails();
        fetchRepositories();
    