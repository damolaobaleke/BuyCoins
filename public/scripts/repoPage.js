const username = document.querySelector('.search-input');
const formSubmit = document.querySelector('#username-search');
const profileAvatar = document.querySelector('.profile-avatar')
const navProfile = document.querySelector('.profile')
const fullName = document.querySelector('.full-name');
const userName = document.querySelector('.username')
const userBio = document.querySelector('.bio')

const repoName = document.querySelector('.repo-name')
const programmingLang = document.querySelector('.programming-lang');
const repoStarsCount = document.querySelector('.stars');
const repoForksCount = document.querySelector('.forks');
const repoTotal = document.querySelector('.repo-amount');
const lastUpdated = document.querySelector('.date-updated');

let monthsInyear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]
const repos = document.querySelector('.repo-row');


username.addEventListener('click', ()=>{
    username.style.background = "white"
})

formSubmit.addEventListener('submit', (event)=>{
    event.preventDefault();
    console.log(username.value)

    getUser(username.value);
    getUserRepos(username.value);
})

const requestConfig ={
    headers:{'Accept': 'application/vnd.github.v3+json'},
    method:'GET',
}

const getUser = async(username)=>{
    const res  = await fetch(`https://api.github.com/users/${username}`, requestConfig);
    const data = await res.json();
    console.log(data);

    //Message key returned usually when no user found.
    data.message ? noUserFound() : setUserProfileInfo(data.avatar_url, data.avatar_url,data.name, data.login, data.bio, data.public_repos)

}

let getUserRepos =async(value)=>{
    const res  = await fetch(`https://api.github.com/users/${value}/repos?per_page=20`, requestConfig);
    const data = await res.json();
    console.log(data)

    data.map((repo)=>{
        //ISO 8601 format to date 
        let date = new Date(repo.updated_at);
       
        console.log(`Name:${repo.name}, Updated Day: ${date.getDay()}, Updated Mth ${monthsInyear[date.getMonth()]} , Language: ${repo.language}, Forks: ${repo.forks} Stars: ${repo.stargazers_count}`)

        for(let key in repo){
            if(repo[key] !== null){
                return createElements(repo.name, repo.description, repo.language, repo.stargazers_count,repo.forks, "Updated on " + date.getDay() + " " + monthsInyear[date.getMonth()])
            }else{
                return createElements(repo.name, " ", " ", repo.stargazers_count,repo.forks, "Updated on " + date.getDay() + " " + monthsInyear[date.getMonth()])
            }
        }
        
    })
}

const setUserProfileInfo=(profAvatar, navAvatar, name, username, bio, repoCount)=>{
    profileAvatar.src = profAvatar
    navProfile.src = navAvatar
    fullName.textContent = name
    userName.textContent = username
    userBio.textContent = bio
    repoTotal.textContent = repoCount
}

const setRepos=()=>{}

const createElements=(repoName, repoDescription,programmingLang, repoStars, repoForks, lastUpdated)=>{
    const repoRow = `
        <div class="repos">
            <h3 class="repo-name">${repoName}</h3>
            <p class="repo-description">${repoDescription}</p>
            <div class="d-flex">
                <span class="language ${programmingLang}"></span> <p class="programming-lang ml-2 mr-2">${programmingLang}</p>
                <span><i class="far fa-star" style="color:#576069;"></i> </span><p class="stars ml-1 mr-3">${repoStars}</p>
                <span><svg aria-label="fork" class="repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg></span>
                <p class="forks ml-1 mr-3">${repoForks}</p>
                <p class="date-updated mx-2">${lastUpdated}</p>
            </div>

            <hr>        
        </div>`

    let div = document.createElement('div')
    div.innerHTML = repoRow;
    document.body.append(div)

    //insert the div el with repos before the first child element "repo-row" .arg1, el to insert , arg2 pos
    repos.insertBefore(div, repos.childNodes[0]) 
}

function noUserFound(){
    let div = document.createElement('div')
    const nouser = '<h1 style="font-size:36px;">No user found</h1>'
    div.innerHTML = nouser;
    document.body.append(div)
    repos.insertBefore(div, repos.childNodes[0]) 
}

let addActiveClass=()=>{
    let tabItem = document.querySelectorAll('.tab-item-nav')[1]
    let repoTabAnchorTag = document.querySelector('#repo-tab-anchor');

    repoTabAnchorTag.addEventListener('click', (e)=>{
        e.preventDefault();
    })

    tabItem.addEventListener('click', ()=>{
        tabItem.classList.add('active')
    })
}


//===== Gets username from index.html based on query parameters
const urlParams = new URLSearchParams(window.location.search);
const indexUsername = urlParams.get('username');

if(indexUsername){
    getUser(indexUsername);
    getUserRepos(indexUsername);
}else{
   alert('no value in username input, pls enter a username on the home page\nor in the navbar search\nThanks !')
   console.log('no value in username query parameter')
}
//=====


