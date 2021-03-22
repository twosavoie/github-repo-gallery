const overview = document.querySelector(".overview");
const username = "redrambles";
const repoList = document.querySelector(".repo-list");
const allReposContainer = document.querySelector(".repos");
const repoDataContainer = document.querySelector(".repo-data");

const gitUserInfo = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  displayUserInfo(data);
};

gitUserInfo();

const displayUserInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Username:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
  `;
  overview.append(div);
  gitRepos(username);
};

const gitRepos = async function (username) {
  const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await fetchRepos.json();
  displayRepos(repoData);
};

const displayRepos = function (repos) {
  for (const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `
      <h3>${repo.name}</h3>
      <p>Main language: ${repo.language}</p>
      `;
    repoList.append(repoItem);
  }
};

repoList.addEventListener("click", function (e) {
  if (e.target.matches("h3")) {
    const reponame = e.target.innerText;
    getRepoInfo(reponame);
  }
});

const getRepoInfo = async function (reponame) {
  const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${reponame}`);
  const repoData = await fetchInfo.json();

  // Grab languages
  const fetchLanguages = await fetch(repoData.languages_url);
  const languageData = await fetchLanguages.json();

  // Make a list of languages
  const languages = [];
  for (const language in languageData) {
    languages.push(language);
  }

  displayRepoInfo(repoData, languages);
};

const displayRepoInfo = function (repoData, languages) {
  repoDataContainer.innerHTML = "";
  repoDataContainer.classList.remove("hide");
  allReposContainer.classList.add("hide");
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>Name: ${repoData.name}</h3>
    <p>Description: ${repoData.description}</p>
    <p>Default Branch: ${repoData.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoData.html_url}" target="_blank" rel="noreferrer noopener">Visit Repo on GitHub!</a>
  `;
  repoDataContainer.append(div);
};
