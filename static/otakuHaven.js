let usersAnimeFromGenre = null
let genreBlocks = document.querySelectorAll('.genre-block')
// const form = document.querySelector('#search-by-name-form')
let animeModal = document.querySelector("#animeModal")
let closeBtn = document.querySelectorAll('.close')
let loginModal = document.querySelector('#loginModal')
let loginSignupLink = document.querySelector('#login-signup-link')
let loginForm = document.querySelector('#login-form')
let topPage = 0;
let genrePages = []
const animeContainer = document.querySelector('.anime-container')
let genreIds = []
let mainNav = document.getElementById('js-menu');
let navBarToggle = document.getElementById('js-navbar-toggle');
let bySearch = document.querySelector('#search-by-name-block');
let formBlock = document.querySelector('#form-block')
let bySeason = document.querySelector('#search-by-season-block')
let byTop = document.querySelector('#search-by-top-block')

navBarToggle.addEventListener('click', function () {
    mainNav.classList.toggle('active');
});


for (let close of closeBtn) {
    close.addEventListener('click', function (e) {
        animeModal.style.display = "none";
        document.querySelector('.anime-modal__container').innerHTML = ''
        if (loginModal) {
            loginModal.style.display = "none";
        }

    })
}

window.onclick = function (e) {
    if (e.target == animeModal || e.target == loginModal) {
        animeModal.style.display = "none";
        document.querySelector('.anime-modal__container').innerHTML = ''
        if (loginModal) {
            loginModal.style.display = "none";
        }
    }
}

if (bySearch) {
    bySearch.addEventListener('click', function (e) {
        let html = `<form action="anime/search" class = "form" id="search-by-name-form">
                        <input type="text" name="query" id="query" placeholder="Search by Name">
                        <button class ="btn btn-secondary"><i class="fa fa-search" aria-hidden="true"></i> Search</button>`
        console.log(html)
        formBlock.innerHTML = html
        let form = document.querySelector('#search-by-name-form')
        form.addEventListener('submit', generateAnimeFromSearch)
    })
}

if (bySeason) {
    bySeason.addEventListener('click', function (e) {
        let html = `<form id ="seasonForm">
                        <select name ="year" id ="year"></select>
                        <select name = "season" id = "season"></select>
                        <button class = "btn btn-secondary"><i class="fa fa-search" aria-hidden="true"></i> Search</button>`
        formBlock.innerHTML = html
        let form = document.querySelector('#seasonForm')
        const yearInput = document.querySelector('#year')
        const seasonInput = document.querySelector('#season')
        fillYears(yearInput)
        fillSeasons(seasonInput, yearInput)
        yearInput.addEventListener('change', async function () {
            fillSeasons(seasonInput, yearInput)
        })


        form.addEventListener('submit', async function (e) {
            e.preventDefault()
            cleanSearchResults()
            createLoader(animeContainer)
            generateAnimeFromSeason(yearInput.value, seasonInput.value)
            removeLoader(document.querySelector('.loader'))
        })
    })

}

if (byTop) {
    byTop.addEventListener('click', function () {
        let html = `    <form id="idForm">
        <select name="subtype" id="subtype">
            <option value="airing">Airing</option>
            <option value="upcoming">Upcoming</option>
            <option value="tv">TV</option>
            <option value="movie">Movie</option>
            <option value="ova">OVA</option>
            <option value="special">Special</option>
            <option value="bypopularity">By Popularity</option>
            <option value="favorite">Favorite</option>
        </select>
        <button class = "btn btn-secondary"><i class="fa fa-search" aria-hidden="true"></i> Search</button>
    </form>`

        formBlock.innerHTML = html;
        let form = document.querySelector('#idForm')
        form.addEventListener('submit', async function (e) {
            e.preventDefault()
            let typeValue = document.querySelector('#subtype').value;
            cleanSearchResults()
            topPage = 0;
            generateTopAnime(typeValue)


        })
    })
}


//************************* */
//LOGIN LOGIC FOR SINGUPING/LOGGING IN AND UPDATING ANIME/GENRES
if (loginSignupLink) {
    loginSignupLink.addEventListener('click', function (e) {
        e.preventDefault()
        let loginBtn = document.querySelector('#login-btn')
        if (loginForm.dataset.type === "login") {
            loginForm.dataset.type = "signup"
            loginBtn.textContent = "Signup"
            loginSignupLink.textContent = "Already have an account? Click here to login."
            document.querySelector('#login-title').textContent = "Sign Up"
        } else {
            loginForm.dataset.type = "login"
            loginSignupLink.textContent = "Don't have an account yet? Click here to sign up!"
            loginBtn.textContent = "Login"
            document.querySelector('#login-title').textContent = "Login"
        }
    })
}

if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault()
        if (loginForm.dataset.type === 'login') {
            let res = await axios.post('/popup/login', {
                "username": document.querySelector('#username').value,
                "password": document.querySelector('#password').value,
                "csrf_token": document.querySelector('#csrf_token').value
            })
            console.log(res)
            if(res.data.error){
                document.querySelector(".errors").textContent = res.data.error
                return
            }
            let animeBlocks = document.querySelectorAll('.anime-block')
            if (animeBlocks) {
                for (animeBlock of animeBlocks) {
                    if (Array.from(res.data.likes).includes(Number(animeBlock.dataset.id))) {
                        let data = JSON.parse(animeBlock.dataset.anime)
                        data.liked = true
                        let anime = new Anime(data)
                        animeBlock.innerHTML = anime.create()
                        animeBlock.dataset.anime = JSON.stringify(data)
                    }
                    if (Array.from(res.data.wished).includes(Number(animeBlock.dataset.id))) {
                        let data = JSON.parse(animeBlock.dataset.anime)
                        data.wished = true
                        let anime = new Anime(data)
                        animeBlock.innerHTML = anime.create()
                        animeBlock.dataset.anime = JSON.stringify(data)
                    }
                }
            }
            let genreBlocks = document.querySelectorAll(".genre-block")
            if (genreBlocks) {
                for (genBlock of genreBlocks) {
                    if (Array.from(res.data.genres).includes(Number(genBlock.dataset.id))) {
                        genBlock.dataset.liked = true
                        let gen = new Genre(Number(genBlock.dataset.id), genBlock.dataset.name, genBlock.dataset.liked)
                        genBlock.innerHTML = gen.create()
                    }
                }
            }
            if (res.status === 200) {
                loginModal.style.display = "none"
                changeNavBarAndFooterOnLogin()
            }
        } else {
            let res = await axios.post('/popup/signup', {
                "username": document.querySelector('#username').value,
                "password": document.querySelector('#password').value,
                "csrf_token": document.querySelector('#csrf_token').value
            })
            if(res.data.error){
                document.querySelector(".errors").textContent = res.data.error
                return
            }
            if (res.status === 200) {
                loginModal.style.display = "none"
                console.log(res)
                changeNavBarAndFooterOnLogin()
            }
        }
    })
}
//************************************************************** */
for (let genreBlock of genreBlocks) {
    if (genreBlock.dataset.liked == "true") { genreIds.push(Number(genreBlock.dataset.id)) }
    genreBlock.addEventListener('click', handleGenreClick)
}
//handling search for specific anime



async function generateAnimeFromSearch(e) {
    e.preventDefault()
    let text = document.querySelector('#query').value;
    cleanSearchResults()
    createLoader(animeContainer)
    let data = await API.getAnimeBySearch(text)
    removeLoader(document.querySelector('.loader'))
    document.querySelector('#query').textContent = ''
    generateAnime(animeContainer, data)

}

//Handling search for anime based on a recommendation from another

async function generateAnimeFromRecommendation(id) {
    cleanSearchResults()
    createLoader(animeContainer)
    let res = await API.getAnimeFromRecommendation(id)
    removeLoader(document.querySelector('.loader'))
    if(res.length > 0){
        generateAnime(animeContainer, res)
    } else {
        animeContainer.innerHTML = "<h3>No recommendations for this Anime</h3>"
    }
    
}

//Function for liking/unliking genres
async function handleGenreClick(e) {
    let target = Array.from(e.target.classList)
    //like genre
    if (this.dataset.liked === 'false' && target.includes("like-btn")) {
        let res = await Genre.likeGenre(this.dataset.id)
        if (res.status === 201) {
            console.log(`You officially like ${this.dataset.name}`)
            this.dataset.liked = 'true'
            genreIds.push(Number(this.dataset.id))
            checkGetStartedToggle()
            e.target.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i> Unlike'
            return res
        }
        else if (res.data.message === "no logged in user") {
            loginModal.style.display = "block";
        }
    }
    //unlike genre
    else if (this.dataset.liked === 'true' && target.includes('like-btn')) {
        let res = await Genre.unLikeGenre(this.dataset.id)
        if (res.status === 200) {
            console.log(`You don't like ${this.dataset.name}:(`)
            let index = genreIds.indexOf(Number(this.dataset.id))
            if (index > -1) { genreIds.splice(index, 1) }
            checkGetStartedToggle()
            console.log(genreIds)
            this.dataset.liked = 'false'
            e.target.innerHTML = '<i class="fa fa-star-o" aria-hidden="true"></i> Like'
        }
    }
}


//************** */
//end of genres

//Handling Anime//

function createMoreResultsBtn(data, id) {
    removeResultsButton()
    let btn = document.createElement('button')
    btn.dataset.type = data;
    btn.dataset.id = id
    btn.setAttribute('id', "more-results-button")
    btn.classList.add('btn')
    btn.classList.add('btn-primary-outline')
    btn.textContent = 'Get More Anime'
    btn.addEventListener('click', function (e) {
        if (data === "genre") {
            generateAnimeFromSpecificGenre(Number(id))
        }
        else if (id === 'top') {
            generateTopAnime(data)
        }
        else if (data === 'recommendation') {
            generateAnimeFromGenericRecommendation()
        }
    })
    document.querySelector('.container').append(btn)
}

async function generateAnimeFromSpecificGenre(genre_id) {
    createLoader(animeContainer)
    let res = await API.getAnimeFromSpecificGenre(genre_id)
    if (genrePages.includes(res.page)) {
        removeResultsButton()
    } else {
        genrePages.push(res.page)
        generateAnime(animeContainer, res.anime)
        createMoreResultsBtn('genre', genre_id)
    }

    removeLoader(document.querySelector('.loader'))
}


async function generateAnimeFromUpcomming() {
    cleanSearchResults()
    createLoader(animeContainer)
    let res = await API.getUpcomingAnime()
    removeLoader(document.querySelector('.loader'))
    generateAnime(animeContainer, res)
}


async function generateRecommendedAnimeFromGenre() {
    createLoader(animeContainer)
    let res = await API.getAnimeRecommendationsFromGenre()
    for (let i = 0; i < res.length; i++) {
        let fullRow = document.createElement('div')
        fullRow.classList.add('full-row')
        fullRow.innerHTML = `<div class = "mb-small"><h3 class = "sub-display header-background">${res[i].genre.name} Anime</h3></div>`
        animeContainer.append(fullRow)
        generateAnime(fullRow, res[i].anime)

    }
    removeLoader(document.querySelector('.loader'))
}

async function generateDedicatedAnimeData(id) {
    let res = await API.getDedicatedAnimeData(id)
    let html = Anime.createDedicatedData(res)
    document.querySelector('.dedicated-anime').textContent = res.title
    animeContainer.innerHTML = html
    let genreList = document.querySelector('.anime-modal__data--genres')
    for (let i = 0; i < res.genres.length; i++) {
        let genre = await Genre.createGenreButton(res.genres[i])
        genreList.append(genre)

    }

}

async function generateAnimeFromGenericRecommendation() {
    createLoader(animeContainer)
    let res = await API.getGenericRecommendation()
    removeLoader(document.querySelector('.loader'))
    let fullRow = document.createElement('div')
    fullRow.classList.add('full-row')
    console.log(res)
    if (res.genre) {
        let newDiv=document.createElement('div')
        newDiv.classList.add('mb-small')
        newDiv.classList.add('mt-medium')
        newDiv.innerHTML = `<h3 class="sub-display header-background">Because you like ${res.genre.name} Anime</h3>`
        animeContainer.append(newDiv)
        animeContainer.append(fullRow)
        generateAnime(fullRow, res.anime)
        createMoreResultsBtn('recommendation')

    }

    else if (res === 'no more') {
        removeResultsButton()
    }
    else if(res === "no recommendations for this anime"){
        fullRow.innerHTML = `<div class = "mb-small"><h3 class = "sub-display header-background">This anime doesn't come with any recommendations...</h3></div>`
        animeContainer.append(fullRow)
        createMoreResultsBtn('recommendation')
    }

    else {
        let newDiv=document.createElement('div')
        newDiv.classList.add('mb-small')
        newDiv.classList.add('mt-medium')
        newDiv.innerHTML = `<h3 class = "sub-display header-background">Because you like ${res.title}</h3>`
        animeContainer.append(newDiv)
        animeContainer.append(fullRow)
        generateAnime(fullRow, res.anime)
        createMoreResultsBtn('recommendation')
    }
}
//liking/unliking anime
async function handleAnimeClicks(e) {
    if (e.target.dataset.type === 'like-anime') {
        console.log(this)
        data = JSON.parse(this.dataset.anime)
        let anime = new Anime(data)
        if (data.liked === false) {
            let res = await anime.like()
            if (res.status === 201) {
                data.liked = true
                anime.liked = true
                this.dataset.anime = JSON.stringify(data)
                e.target.innerHTML = `<i class="fa fa-thumbs-up" aria-hidden="true"></i> unlike`
                console.log(res)
                return res
            }
            else if (res.data.message === "not logged in") {
                loginModal.style.display = "block";
            }
        }
        else if (data.liked === true) {
            let res = await anime.unLike()
            data.liked = false
            anime.liked = false
            this.dataset.anime = JSON.stringify(data)
            e.target.innerHTML = '<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> like'
            return res
        }
    }

    if (e.target.dataset.type === 'wish-anime') {
        data = JSON.parse(this.dataset.anime)
        let anime = new Anime(data)
        if (data.wished === false) {
            let res = await anime.wish()
            if (res.status === 201) {
                data.wished = true
                anime.wished = true
                this.dataset.anime = JSON.stringify(data)
                e.target.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i> unwish'
                return res

            }
            else if (res.data.message === "not logged in") {
                loginModal.style.display = "block"
            }

        }
        else if (data.wished === true) {
            let res = await anime.unWish()
            data.wished = false
            anime.wished = false
            this.dataset.anime = JSON.stringify(data)
            e.target.innerHTML = '<i class="fa fa-star-o" aria-hidden="true"></i> wish'
            return res
        }
    }

    if (e.target.tagName === 'IMG') {
        animeModal.dataset.anime = this.dataset.anime
        animeModal.style.display = "block";
        data = JSON.parse(this.dataset.anime)
        let res = await API.getFullAnimeData(data.mal_id)
        let insides = await Anime.createFullData(res.data)
        document.querySelector('.anime-modal__container').innerHTML = insides;
        let genreList = document.querySelector('.anime-modal__data--genres')

        for (let i = 0; i < res.data.genres.length; i++) {
            let genre = await Genre.createGenreButton(res.data.genres[i])
            genreList.append(genre)

        }
        // modal.addEventListener('click', handleAnimeClicks)

    }


}



async function fillYears(input) {

    let res = await API.getSeasonForm()

    for (let i = 0; i < res.data.length; i++) {
        let option = document.createElement('option')
        option.value = res.data[i].year
        option.textContent = res.data[i].year
        input.append(option)

    }

}



//Event listener for "change" to year input to run fillSeasons with year being value of input

async function fillSeasons(input, yearInput) {

    input.innerHTML = '';
    let res = await API.getSeasonForm()
    for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].year === Number(yearInput.value)) {
            for (let j = 0; j < res.data[i].seasons.length; j++) {
                let option = document.createElement('option')
                option.value = res.data[i].seasons[j]
                option.textContent = res.data[i].seasons[j]
                input.append(option)
            }
        }
    }
}



async function generateAnimeFromSeason(year, season) {
    let res = await API.getAnimeFromSeason(year, season)
    generateAnime(animeContainer, res)
}



async function generateTopAnime(subtype) {
    topPage++
    let res = await API.getTopAnime(subtype, topPage)
    if (res !== "page not found") {
        generateAnime(animeContainer, res)
        createMoreResultsBtn(subtype, 'top')
    } else {
        removeResultsButton()
    }

}


if (document.querySelector('#day-of-week')) {
    document.querySelector('#day-of-week').addEventListener('click', async function () {
        cleanSearchResults()
        createLoader(animeContainer)
        let res = await API.getAnimeByDay()
        removeLoader(document.querySelector('.loader'))
        generateAnime(animeContainer, res)
    })


}

if (document.querySelector('#upcomming-anime')) {
    document.querySelector('#upcomming-anime').addEventListener('click', generateAnimeFromUpcomming)
}

// function openModal(){

// }

function getBlocks() {
    const blocks = document.querySelectorAll('.anime-block')
    for (let block of blocks) {
        block.addEventListener('click', handleAnimeClicks)
    }
}


function generateAnime(div, data) {
    for (let i = 0; i < data.length; i++) {
        let anime = data[i];
        let animeBlock = document.createElement('div')
        animeBlock.classList.add('anime-block');
        animeBlock.dataset.id = Number(anime.mal_id);
        animeBlock.dataset.anime = JSON.stringify(anime);
        animeBlock.innerHTML = anime.create()
        div.append(animeBlock);
        animeBlock.addEventListener('click', handleAnimeClicks)
    }
}

function cleanSearchResults() {
    animeContainer.innerHTML = ''
}

function removeResultsButton() {
    let moreResultsbtn = document.querySelector('#more-results-button')
    if (moreResultsbtn) {
        moreResultsbtn.remove()
    }
}

function checkGetStartedToggle() {
    let nextBtn = document.querySelector('#next-btn')
    if (nextBtn) {
        if (genreIds.length >= 3) {
            nextBtn.style.display = "inline-block"
        } else {
            nextBtn.style.display = "none"
        }
    }



}


function changeNavBarAndFooterOnLogin() {
    let footerLinks = document.querySelector('#footer-links')
    let menu = document.querySelector('#js-menu')
    let signup = document.querySelector('#nav-signup')
    let login = document.querySelector('#nav-login')
    let wishLink = document.createElement('a')
    let likeLink = document.createElement('a')
    let logoutLink = document.createElement('a')
    let wishli = document.createElement('li')
    let likeli = document.createElement('li')
    let logoutli = document.createElement('li')
    let footerLogin = document.querySelector('#footer-login')
    let footerSignup = document.querySelector('#footer-signup')
    let footLike = document.createElement('a')
    let footWish = document.createElement('a')
    let footLogout = document.createElement('a')
    wishLink.classList.add('nav-links')
    likeLink.classList.add('nav-links')
    logoutLink.classList.add('nav-links')
    wishLink.setAttribute('href', '/user/wished')
    likeLink.setAttribute('href', '/user/liked')
    logoutLink.setAttribute('href', '/logout')
    wishLink.textContent = "Wishlist Anime"
    likeLink.textContent = "Liked Anime"
    logoutLink.textContent = "Logout"
    signup.parentElement.remove()
    login.parentElement.remove()
    likeli.append(likeLink)
    wishli.append(wishLink)
    logoutli.append(logoutLink)
    menu.append(likeli)
    menu.append(wishli)
    menu.append(logoutli)
    footLike.setAttribute('href', "/user/liked")
    footLike.innerHTML = "Liked Anime |&nbsp"
    footWish.setAttribute('href', "/user/wished")
    footWish.textContent = " Wishlist Anime |"
    footLogout.setAttribute('href', "/logout")
    footLogout.textContent = ' Logout'
    footerLogin.remove()
    footerSignup.remove()
    footerLinks.append(footLike)
    footerLinks.append(footWish)
    footerLinks.append(footLogout)
    document.querySelector('.footer-remove').remove()

}

function createLoader(container){
    let newDiv = document.createElement('div')
    newDiv.classList.add('loader')
    container.append(newDiv)
}

function removeLoader(div){
    div.remove()
}


async function cleanPicked(){
    let res = await axios({
        method: 'DELETE',
        url: '/cleanpicked',
        headers: { 'Content-type': 'application/json' }
    })
    console.log(res)

}
