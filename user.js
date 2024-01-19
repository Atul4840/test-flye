
        // Parse the query parameter to get the username
        let urlParams = new URLSearchParams(window.location.search);
        let username = urlParams.get('username');
        if (username.length == 0) {
            alert('Please enter a username')
            document.body.innerHTML = 'none';

        }

        let getuserImage = document.getElementById('userImage');
        let getUserNameElement = document.getElementById('login-user')
        let getUserBioElement = document.getElementById('user-bio');
        let getUserLocationElement = document.getElementById('user-location');
        let getUserLinkElement = document.getElementById('user-link');
        // You can now use the 'username' variable to fetch user data from GitHub API
        // and display it on this page.
        // console.log( username);
        // Perform GitHub API request and display user data here...
        // 5 hazar 6 mahine tak bandhua mazduri
        let currentPage = 1;
        let repositoriesPerPage = 10;
        let totalRepositories = 0;
        let repositories = [];

        // Function to show the loader
        function showLoader() {
            document.getElementById('loader').style.display = 'block';
        }

        // Function to hide the loader
        function hideLoader() {
            document.getElementById('loader').style.display = 'none';
        }


        // Function to per page repositories
        function updatePerPage() {
            repositoriesPerPage = parseInt(document.getElementById('perPage').value);
            currentPage = 1; // Reset to first page when changing repositories per page
            fetchUserDetails();
            fetchRepositories();
        }

        // filter repo

        function filterRepositories() {
            const searchValue = document.getElementById('search').value.toLowerCase();
            const filteredRepositories = repositories.filter(repo =>
                repo.name.toLowerCase().includes(searchValue)
            );
            processRepositories(filteredRepositories);
        }

        // fetch user details

        function fetchUserDetails() {
            const userUrl = `https://api.github.com/users/${username}`;

            fetch(userUrl)
                .then(response => response.json())
                .then(user => {
                    setUser(user)
                })
                .catch(error => console.error('Error fetching user details:', error))
        }


        function fetchRepositories() {
            const url = `https://api.github.com/users/${username}/repos?per_page=${repositoriesPerPage}&page=${currentPage}`;

            // Show loader
            showLoader();
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    totalRepositories = data.length;
                    repositories = data;
                    // Call a function to process the repositories
                    processRepositories(repositories);
                })
                .catch(error => console.error('Error fetching repositories:', error))
                .finally(() => {
                    // Hide loader
                    hideLoader();
                });
        }

        function setUser(user) {
            getuserImage.setAttribute('src', user.avatar_url);
            getUserNameElement.innerText = user.login;
            getUserBioElement.innerText = user.bio;
            getUserLocationElement.innerHTML = `<i id="icon-location" class="fa-solid fa-location-pin"></i> ${user.location}`;
            getUserLinkElement.setAttribute('href', user.html_url);
            getUserLinkElement.innerText = user.html_url

        }

        function processRepositories(repos) {

            // Get the repo-list container
            const repoListContainer = document.querySelector('.repo-list');
            repoListContainer.innerHTML = '';

            // Loop through each repository in the array
            repos.forEach(repo => {
                // Create a new div element for each repository
                const repoDiv = document.createElement('div');
                repoDiv.classList.add('single-repo');

                // Set the repository name
                const repoName = document.createElement('h2');
                repoName.textContent = repo.name;
                repoDiv.appendChild(repoName);

                // Set the repository description
                const repoDescription = document.createElement('h4');
                repoDescription.textContent = repo.description;
                repoDiv.appendChild(repoDescription);

                // Set the programming languages
                const langDiv = document.createElement('div');
                langDiv.classList.add('lang');
                repo.topics.forEach(lang => {
                    const langP = document.createElement('p');
                    langP.textContent = lang;
                    langDiv.appendChild(langP);
                });
                repoDiv.appendChild(langDiv);

                // Append the repository div to the repo-list container
                repoListContainer.appendChild(repoDiv);
            });
        }

        fetchUserDetails();
        fetchRepositories();

    