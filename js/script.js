//where your profile information will appear 
const overview = document.querySelector(".overview");
//your GitHub username
const username = "ksturdevant88";
//Repo list global variable -unordered list 
const repoList= document.querySelector(".repo-list");
//global variable selects the section where all repo info appears (class repos)
const allRepos = document.querySelector(".repos");
// global variable selects where the individual repo data will appear 
const repoData = document.querySelector(".repo-data");
//globabl variable for back to repo button 
const backReposButton = document.querySelector(".view-repos");
//global variable to select search by name 
const filterInput = document.querySelector(".filter-repos");


//async function to fetch infromation from Github profile 
const gitUserInfo = async function () {
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    //resolve JSON response
    const data = await userInfo.json();
    displayUserInfo(data);
  };
  
  gitUserInfo();

  //create new div and give it class user info
  const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
      <figure>
        <img alt="user avatar" src=${data.avatar_url} />
      </figure>
      <div>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Bio:</strong> ${data.bio}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
      </div>
    `;
    overview.append(div);
    gitRepos();
  };

  // async function to fetch repos : needed solution code for this section
  const gitRepos = async function () {
    //sorted updated to last updated and 100 repos per page 
    const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await fetchRepos.json();
    displayRepos(repoData);
  };


  //Display repo infromation- loop and create list item
  const displayRepos = function (repos) {
    //show filterInput element
    filterInput.classList.remove("hide");
    for (const repo of repos) {
      const repoItem = document.createElement("li");
      repoItem.classList.add("repo");
      repoItem.innerHTML = `<h3>${repo.name}</h3>`;
      repoList.append(repoItem);
    }
  };
  //event listener (repolist) click event repolist 
  repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
      const repoName = e.target.innerText;
      getRepoInfo(repoName);
    }
  });

  //async function to get specific repo information 
  const getRepoInfo = async function (repoName) {
    const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    //variable to resolve and save the JSON response
    const repoInfo = await fetchInfo.json();
    //log out repoInfo
   // console.log(repoInfo);
  //variable to fetch data from language_url property 
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();
  //add language to empty array 
  const languages = [];
  for (const language in languageData) {
    languages.push(language);
  }
//function to display specific repo information
  displayRepoInfo(repoInfo, languages);
};


const displayRepoInfo = function (repoInfo, languages) {
  backReposButton.classList.remove("hide");
  repoData.innerHTML = "";
  repoData.classList.remove("hide");
  allRepos.classList.add("hide");
  const div = document.createElement("div");
  //needed solution for this section
  div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;
  repoData.append(div);
};

// click event for back button - back to the repo gallery 
backReposButton.addEventListener("click", function () {
  allRepos.classList.remove("hide");
  repoData.classList.add("hide");
  backReposButton.classList.add("hide");
});

// input event listener to filterInput (e)
filterInput.addEventListener("input", function (e) {
  //variable for search text 
  const searchText = e.target.value;
  //variable repos select all elements with class of repo 
  const repos = document.querySelectorAll(".repo");
  //variable for lowercase value -need help with this from solution 
  const searchLowerText = searchText.toLowerCase();

  for (const repo of repos) { //needed help with this section
    const repoLowerText = repo.innerText.toLowerCase();
    if (repoLowerText.includes(searchLowerText)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});
