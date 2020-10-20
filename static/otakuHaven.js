let usersAnimeFromGenre = null
const genreBlocks = document.querySelectorAll('.genre-block')



for (let genreBlock of genreBlocks) {
    genreBlock.addEventListener('click', handleGenreClick)
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
async function generateAnimeFromGenre() {
    usersAnimeFromGenre = await Anime.getAnimeFromGenre()

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
    if (e.target.className === 'like-btn') {
        console.log(this)
        data = JSON.parse(this.dataset.anime)
        let anime = new Anime(data)
        if (data.liked === false) {
            let res = await anime.like()
            data.liked = true
            anime.liked = true
            this.dataset.anime = JSON.stringify(data)
            e.target.textContent = "unlike"
            console.log(res)
            return res
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

    if (e.target.className === 'wish-btn') {
        data = JSON.parse(this.dataset.anime)
        let anime = new Anime(data)
        if (data.wished === false) {
            let res = await anime.wish()
            data.wished = true
            anime.wished = true
            this.dataset.anime = JSON.stringify(data)
            e.target.textContent = "unwish"
            return res
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
}

function getBlocks() {
    const blocks = document.querySelectorAll('.anime-block')
    for (let block of blocks) {
        block.addEventListener('click', handleAnimeClicks)
    }
}