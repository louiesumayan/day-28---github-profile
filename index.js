const API_URL = 'https://api.github.com/users/';

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

async function getUser(username) {
  try {
    const { data } = await axios(API_URL + username);
    createUserCard(data);
    getRepo(username);
  } catch (err) {
    if (err.response.status == 404) {
      errorCard('No profile found with this username');
    }
  }
}

async function getRepo(username) {
  try {
    const { data } = await axios(API_URL + username + '/repos');
    addReposToCard(data);
  } catch (err) {
    errorCard('Problem fetching repos');
  }
}

function createUserCard(user) {
  const cardHTML = `
 <div class="card">
        <div class="user">
          <img
            src="${user.avatar_url}"
            class="avatar"
          />
          <div class="name">
            <h2>${user.name}</h2>
            <h3 class="user-name">${user.login}</h3>
          </div>
        </div>
        <div class="user-info">
          <p>
            ${user.bio}
          </p>
          <ul>
            <li>${user.followers} <strong>Follower</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
          </ul>

          <div id="repos">

          </div>
        </div>
      </div>
 `;
  main.innerHTML = cardHTML;
}

function errorCard(msg) {
  const cardHTML = `
 <div class='card'>
  <h1>${msg}</h1>
 </div>
 `;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById('repos');

  repos.forEach((repo) => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repo');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.innerHTML = repo.name;

    reposEl.appendChild(repoEl);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);
    search.value = '';
  }
});
