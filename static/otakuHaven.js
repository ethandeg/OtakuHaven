let usersAnimeFromGenre = null
let genreBlocks = document.querySelectorAll('.genre-block')
const form = document.querySelector('.form')
let animeModal = document.querySelector("#animeModal")
let closeBtn = document.querySelectorAll('.close')
let loginModal = document.querySelector('#loginModal')
let loginSignupLink = document.querySelector('#login-signup-link')
let loginForm = document.querySelector('#login-form')

// closeBtn.onclick = function(){
//     animeModal.style.display = "none";
//     loginModal.style.display = "none";
//     // modal.removeEventListener("click", handleAnimeClicks)
// }
for (let close of closeBtn){
    close.addEventListener('click', function(e){
        animeModal.style.display = "none";
        if(loginModal){
            loginModal.style.display = "none";
        }
        
    })
}

window.onclick = function(e){
    if(e.target == animeModal || e.target == loginModal){
        animeModal.style.display = "none";
        if(loginModal){
            loginModal.style.display = "none";
        }
        // modal.removeEventListener("click", handleAnimeClicks)
    }
}
//************************* */
//LOGIN LOGICE FOR SINGUPING/LOGGING IN AND UPDATING ANIME/GENRES
if(loginSignupLink){
    loginSignupLink.addEventListener('click',function(e){
        e.preventDefault()
        let loginBtn = document.querySelector('#login-btn')
        if(loginForm.dataset.type === "login"){
            loginForm.dataset.type = "signup"
            loginBtn.textContent = "Signup"
            loginSignupLink.textContent = "Already have an account? Click here to login."
        } else {
            loginForm.dataset.type = "login"
            loginSignupLink.textContent = "Don't have an account yet? Click here to sign up!"
            loginBtn.textContent = "Login"
        }
    })
}

if(loginForm){
    loginForm.addEventListener('submit', async function(e){
        e.preventDefault()
        if(loginForm.dataset.type === 'login'){
            let res = await axios.post('/login', {
                "username": document.querySelector('#username').value,
                "password": document.querySelector('#password').value,
                "csrf_token": document.querySelector('#csrf_token').value
            })
        console.log(res)
        let animeBlocks = document.querySelectorAll('.anime-block')
           if(animeBlocks){
               for(animeBlock of animeBlocks){
                   if(Array.from(res.data.likes).includes(Number(animeBlock.dataset.id))){
                       let data = JSON.parse(animeBlock.dataset.anime)
                       data.liked = true
                       let anime = new Anime(data)
                       animeBlock.innerHTML = anime.create()
                       animeBlock.dataset.anime = JSON.stringify(data)
                   }
                   if(Array.from(res.data.wished).includes(Number(animeBlock.dataset.id))){
                       let data = JSON.parse(animeBlock.dataset.anime)
                       data.wished = true
                       let anime = new Anime(data)
                       animeBlock.innerHTML = anime.create()
                       animeBlock.dataset.anime = JSON.stringify(data)
                   }
               }
           }
           let genreBlocks = document.querySelectorAll(".genre-block")
           if(genreBlocks){
               for(genBlock of genreBlocks){
                   if(Array.from(res.data.genres).includes(Number(genBlock.dataset.id))){
                       genBlock.dataset.liked = true
                       let gen = new Genre(Number(genBlock.dataset.id), genBlock.dataset.name, genBlock.dataset.liked)
                       genBlock.innerHTML = gen.create()
                   }
               }
           }
            if(res.status === 200){
                loginModal.style.display = "none"
            }
        } else {
            let res = await axios.post('/signup', {
                "username": document.querySelector('#username').value,
                "password": document.querySelector('#password').value,
                "csrf_token": document.querySelector('#csrf_token').value
            })
            if(res.status === 200){
                loginModal.style.display = "none"
                console.log(res)
            }
        }
    })
}
//************************************************************** */
for (let genreBlock of genreBlocks) {
    genreBlock.addEventListener('click', handleGenreClick)
}
//handling search for specific anime
if (form) {
    form.addEventListener('submit', generateAnimeFromSearch)
}


async function generateAnimeFromSearch(e) {
    e.preventDefault()
    const searchResults = document.querySelector('.search-results')
    let text = document.querySelector('#query').value;
    let data = await API.getAnimeBySearch(text)
    searchResults.innerHTML = '';
    document.querySelector('#query').textContent = ''
    let row = document.createElement('div')
    row.innerHTML = `<h3>${text}</h3>`
    searchResults.append(row)
    for (let i = 0; i < data.length; i++) {
        let anime = data[i]
        let animeBlock = document.createElement('div')
        animeBlock.classList.add('anime-block')
        animeBlock.dataset.id = Number(anime.mal_id)
        animeBlock.dataset.anime = JSON.stringify(anime)
        animeBlock.innerHTML = anime.create()
        row.append(animeBlock)
        animeBlock.addEventListener('click', handleAnimeClicks)
    }

}

//Handling search for anime based on a recommendation from another

async function generateAnimeFromRecommendation() {
    let res = await Anime.getAnimeFromRecommendation()
    const searchResults = document.querySelector('.search-results')
    searchResults.innerHTML = '';
    let row = document.createElement('div')
    row.innerHTML = `<h3>Anime for You</h3>`
    searchResults.append(row)
    for (let i = 0; i < res.length; i++) {
        let anime = res[i]
        let animeBlock = document.createElement('div')
        animeBlock.classList.add('anime-block')
        animeBlock.dataset.id = Number(anime.mal_id)
        animeBlock.dataset.anime = JSON.stringify(anime)
        animeBlock.innerHTML = anime.create()
        row.append(animeBlock)
        animeBlock.addEventListener('click', handleAnimeClicks)
    }
}

//Function for liking/unliking genres
async function handleGenreClick(e) {
    let target = Array.from(e.target.classList)
    //like genre
    if (this.dataset.liked === 'false' && target.includes("like-btn")) {
        let res = await API.likeGenre(this.dataset.id)
        if (res.status === 201) {
            console.log(`You officially like ${this.dataset.name}`)
            this.dataset.liked = 'true'
            e.target.textContent = 'Unlike'
            return res
        }
        else if (res.data.message === "no logged in user"){
            loginModal.style.display = "block";
        }
    }
    //unlike genre
    else if (this.dataset.liked === 'true' && target.includes('like-btn')) {
        let res = await API.unLikeGenre(this.dataset.id)
        if (res.status === 200) {
            console.log(`You don't like ${this.dataset.name}:(`)
            this.dataset.liked = 'false'
            e.target.textContent = 'Like'
        }
    }
}


//************** */
//end of genres

//Handling Anime//

async function generateAnimeFromSpecificGenre(genre_id) {
    usersAnimeFromGenre = await Genre.getAnimeFromSpecificGenre(genre_id)
    let row = document.createElement('div')
    row.classList.add('row')
    row.innerHTML = `<h6>${usersAnimeFromGenre.genre.name}</h6>`
    document.querySelector('.container').append(row)
    for (let i = 0; i < usersAnimeFromGenre.anime.length; i++) {
        let anime = usersAnimeFromGenre.anime[i]
        let animeBlock = document.createElement('div')
        animeBlock.classList.add('anime-block')
        animeBlock.dataset.id = Number(anime.mal_id)
        animeBlock.dataset.anime = JSON.stringify(anime)
        animeBlock.innerHTML = anime.create()
        row.append(animeBlock)
        animeBlock.addEventListener('click', handleAnimeClicks)
    }
}


async function generateAnimeFromUpcomming(){
    document.querySelector('.search-results').innerHTML = ''
    let res = await API.getUpcomingAnime()
    let row = document.createElement('div')
    row.classList.add('row')
    row.innerHTML = "<h3>Upcomming Anime</h3>"
    document.querySelector('.search-results').append(row)
    for(let i = 0; i < res.length; i++){
        let anime = res[i]
        let animeBlock = document.createElement('div')
        animeBlock.classList.add('anime-block')
        animeBlock.dataset.id = Number(anime.mal_id)
        animeBlock.dataset.anime = JSON.stringify(anime)
        animeBlock.innerHTML = anime.create()
        row.append(animeBlock)
        animeBlock.addEventListener('click', handleAnimeClicks)
    }
}


async function generateRecommendedAnimeFromGenre() {
    usersAnimeFromGenre = await Anime.getAnimeRecommendationsFromGenre()

    for (let i = 0; i < usersAnimeFromGenre.length; i++) {
        let fullRow = document.createElement('div')
        fullRow.classList.add('full-row')
        fullRow.innerHTML = `<h6>${usersAnimeFromGenre[i].genre.name}</h6>`
        document.querySelector('.container').append(fullRow)
        for (let j = 0; j < usersAnimeFromGenre[i].anime.length; j++) {
            let anime = usersAnimeFromGenre[i].anime[j]
            let animeBlock = document.createElement('div')
            animeBlock.classList.add('anime-block')
            animeBlock.dataset.id = Number(anime.mal_id)
            animeBlock.dataset.anime = JSON.stringify(anime)
            animeBlock.innerHTML = anime.create()
            fullRow.append(animeBlock)
            animeBlock.addEventListener('click', handleAnimeClicks)
        }
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
                if(res.status === 201){
                data.liked = true
                anime.liked = true
                this.dataset.anime = JSON.stringify(data)
                e.target.textContent = "unlike"
                console.log(res)
                return res
            }
            else if(res.data.message === "not logged in"){
                loginModal.style.display = "block";
            }
        }
        else if (data.liked === true) {
            let res = await anime.unLike()
            data.liked = false
            anime.liked = false
            this.dataset.anime = JSON.stringify(data)
            e.target.textContent = 'like'
            return res
        }
    }

    if (e.target.dataset.type === 'wish-anime') {
        data = JSON.parse(this.dataset.anime)
        let anime = new Anime(data)
        if (data.wished === false) {
            let res = await anime.wish()
            if(res.status === 201){
                data.wished = true
                anime.wished = true
                this.dataset.anime = JSON.stringify(data)
                e.target.textContent = "unwish"
                return res

            }
            else if (res.data.message === "not logged in"){
                loginModal.style.display = "block"
            }

        }
        else if (data.wished === true) {
            let res = await anime.unWish()
            data.wished = false
            anime.wished = false
            this.dataset.anime = JSON.stringify(data)
            e.target.textContent = 'wish'
            return res
        }
    }

    if (e.target.tagName === 'IMG') {
        animeModal.dataset.anime = this.dataset.anime
        animeModal.style.display = "block";
        data = JSON.parse(this.dataset.anime)
        let res = await API.getFullAnimeData(data.mal_id)
        let insides = await Anime.createFullData(res.data)
        animeModal.innerHTML = insides;
        let list = document.querySelector('.list')

        for(let i = 0; i < res.data.genres.length; i++){
            let genre = await Genre.createGenreButton(res.data.genres[i])
            list.append(genre)

        }
        // modal.addEventListener('click', handleAnimeClicks)
        
    } 


}


const yearInput = document.querySelector('#year')
const seasonInput = document.querySelector('#season')
async function fillYears(){
    
    let res = await API.getSeasonForm()
    yearInput.addEventListener('change', fillSeasons)
    for(let i = 0; i < res.data.length; i++){
        let option = document.createElement('option')
        option.value = res.data[i].year
        option.textContent = res.data[i].year
        yearInput.append(option)
       
    }

}



//Event listener for "change" to year input to run fillSeasons with year being value of input

async function fillSeasons(){

    seasonInput.innerHTML = '';
    let res = await API.getSeasonForm()
    for(let i = 0; i < res.data.length; i++){
        if(res.data[i].year === Number(yearInput.value)){
            for(let j = 0; j < res.data[i].seasons.length; j++){
                let option = document.createElement('option')
                option.value = res.data[i].seasons[j]
                option.textContent = res.data[i].seasons[j]
                seasonInput.append(option)
            }
        }
    }
}



document.querySelector('#seasonForm').addEventListener('submit', async function(e){
    e.preventDefault()

    let res = await API.getAnimeFromSeason(yearInput.value,seasonInput.value)
    document.querySelector('.search-results').innerHTML = ''
    let row = document.createElement('div')
    row.classList.add('row')
    row.innerHTML = `<h3>${seasonInput.value} ${yearInput.value} Anime</h3>`
    document.querySelector('.search-results').append(row)
    for(let i = 0; i < res.length; i++){
        let anime = res[i]
        let animeBlock = document.createElement('div')
        animeBlock.classList.add('anime-block')
        animeBlock.dataset.id = Number(anime.mal_id)
        animeBlock.dataset.anime = JSON.stringify(anime)
        animeBlock.innerHTML = anime.create()
        row.append(animeBlock)
        animeBlock.addEventListener('click', handleAnimeClicks)
    }

})

document.querySelector('#idForm').addEventListener('submit', async function(e){
    e.preventDefault()
    const typeValue = document.querySelector('#subtype').value
    document.querySelector('.search-results').innerHTML = ''
    let res = await API.getTopAnime(typeValue)
    let row = document.createElement('div')
    row.classList.add('row')
    row.innerHTML = `<h3>Top ${typeValue} Anime</h3>`
    document.querySelector('.search-results').append(row)
    for(let i = 0; i < res.length; i++){
        let anime = res[i]
        let animeBlock = document.createElement('div')
        animeBlock.classList.add('anime-block')
        animeBlock.dataset.id = Number(anime.mal_id)
        animeBlock.dataset.anime = JSON.stringify(anime)
        animeBlock.innerHTML = anime.create()
        row.append(animeBlock)
        animeBlock.addEventListener('click', handleAnimeClicks)
    }
})

document.querySelector('#day-of-week').addEventListener('click', async function(e){
    e.preventDefault()
    document.querySelector('.search-results').innerHTML = ''
    let res = await API.getAnimeByDay()
    let row = document.createElement('div')
    row.classList.add('row')
    row.innerHTML = `<h3>Anime you can watch today!</h3>`
    document.querySelector('.search-results').append(row)
    for(let i = 0; i < res.length; i++){
        let anime = res[i]
        let animeBlock = document.createElement('div')
        animeBlock.classList.add('anime-block')
        animeBlock.dataset.id = Number(anime.mal_id)
        animeBlock.dataset.anime = JSON.stringify(anime)
        animeBlock.innerHTML = anime.create()
        row.append(animeBlock)
        animeBlock.addEventListener('click', handleAnimeClicks)
    }
})

// function openModal(){

// }

function getBlocks() {
    const blocks = document.querySelectorAll('.anime-block')
    for (let block of blocks) {
        block.addEventListener('click', handleAnimeClicks)
    }
}