//=============
const usernameInputField = document.querySelector('.search-input');
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
const apiKey = config.apitoken
//======================



//======================
const reqParams =  new URLSearchParams(window.location.search);
let username = reqParams.get('username');

let query = `{
    user(login:"${username}"){
        login
        avatarUrl
        name
        bio
        repositories(first: 20){
          totalCount
          nodes {
            name
            description
            forkCount
            stargazerCount
            updatedAt
            primaryLanguage{
              name
              color
            }
          }
        }
    }
}`


const requestConfig ={
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}` //would use an environment variable on back-end
    },
    method: 'POST',
    body: JSON.stringify({query: query})
}

//==============


//==============
const getInformation = async ()=>{
    console.log(username)
    const res = await fetch('https://api.github.com/graphql', requestConfig);
    const { data } = await res.json();
    console.log(data)

    //profile
    if(data && data.user !== null){
        setUserProfileInfo(data.user.avatarUrl, data.user.avatarUrl, data.user.name, data.user.login, data.user.bio, data.user.repositories.totalCount);
    }else if(data && data.user == null){
        noUserFound();
    }else if(data && data.user.avatarUrl == null){
        setUserProfileInfo(" ", " ", data.user.name, data.user.login, data.user.bio, data.user.repositories.totalCount);
    }else{
        console.log('')
    }

    //repo
    data.user.repositories.nodes.map((repo) =>{
        let date = new Date(repo.updatedAt);
        
        setRepos(repo.name, repo.description, repo.primaryLanguage.name, repo.primaryLanguage.color, repo.stargazerCount, repo.forkCount, date.getDay() + " " + monthsInyear[date.getMonth()]);  
        
    })

}
//==============

if(username){
    getInformation();
}else{
   alert('no value in username input, pls enter a username on the home page\nThanks !')
   console.log('no value in username query parameter')
   window.location.href= "../views/index.html"
}

//==============Events
usernameInputField.addEventListener('click', ()=>{
    usernameInputField.style.background = "white"
})

usernameInputField.addEventListener('input', (e)=>{
    reqParams.set('username', e.target.value);
    history.replaceState(null, null, "?"+reqParams.toString());
    
})

formSubmit.addEventListener('submit', (e)=>{
    e.preventDefault();

    getInformation()
    
})
//==============Events


const setUserProfileInfo =(profAvatar, navAvatar, name, username, bio, repoCount)=>{
    
    profileAvatar.src = profAvatar
    navProfile.src = navAvatar
    fullName.textContent = name
    userName.textContent = username
    userBio.textContent = bio
    repoTotal.textContent = repoCount
}

const setRepos =(repoName, repoDescription, programmingLang, progLangColor ,repoStars, repoForks, lastUpdated)=>{
    const repoRow = `
        <div class="repos">
            <h3 class="repo-name">${repoName}</h3>
            <p class="repo-description">${repoDescription}</p>
            <div class="d-flex">
                <span class="language ${programmingLang}" style="color:${progLangColor};"></span> <p class="programming-lang ml-2 mr-2">${programmingLang}</p>
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
    const nouser = '<h1 style="font-size:36px;">No such user exists</h1>'
    div.innerHTML = nouser;
    document.body.append(div)
    repos.insertBefore(div, repos.childNodes[0]) 
}




