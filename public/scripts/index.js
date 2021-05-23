const userNameSubmit = document.querySelector('#userSearch_home-form');
const userNameInput = document.querySelector('#username');


userNameSubmit.addEventListener('submit', (e)=>{
    e.preventDefault();

    console.log(userNameInput.value);
    window.location.href = `../views/repoPage.html?username=${userNameInput.value}`;

})

