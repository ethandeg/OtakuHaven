let usersAnimeFromGenre = null
const userAnime = []
genreBlocks = document.querySelectorAll('.genre-block')
let index = 0;


for (let genreBlock of genreBlocks) {
    genreBlock.addEventListener('click', handleGenre)
}



//Function for liking/unliking genres
function handleGenre(e) {
    let target = Array.from(e.target.classList)
    if (this.dataset.liked === 'false' && target.includes("like-btn")) {
        likeGenre(e, this)
    }
    else if (this.dataset.liked === 'true' && target.includes('like-btn')) {
        deleteGenre(e, this)
    }
}




//unliking genres
async function deleteGenre(e, inst) {
    res = await axios({
        method: 'delete',
        url: '/categories/unlike',
        headers: { 'Content-type': 'application/json' },
        data:
            { 'genre_id': inst.dataset.id }
    })
    if (res.status === 200) {
        console.log(`You don't like ${e.target.previousElementSibling.textContent}:(`)
        inst.dataset.liked = 'false'
        e.target.textContent = 'Like'
    }
}
//liking genre
async function likeGenre(e, inst) {
    let res = await axios.post('/categories/liked', {
        'genre_id': inst.dataset.id
    })

    if (res.status === 201) {
        console.log(`You officially like ${e.target.previousElementSibling.textContent}`)
        inst.dataset.liked = 'true'
        e.target.textContent = 'Unlike'
        return
    }
}

//************** */
//end of genres

//Handling Anime//
async function generateAnime() {
    usersAnimeFromGenre = await Anime.getAnime()

    for (let i = 0; i < usersAnimeFromGenre.length; i++) {
        let fullRow = document.createElement('div')
        fullRow.classList.add('full-row')
        fullRow.innerHTML = `<h6>${usersAnimeFromGenre[i].genre}</h6>`
        document.querySelector('.container').append(fullRow)
        for (let j = 0; j < usersAnimeFromGenre[i].anime.length; j++) {
            let anime = new Anime(usersAnimeFromGenre[i].anime[j])
            userAnime.push(anime)
            let animeBlock = document.createElement('div')
            animeBlock.classList.add('anime-block')
            animeBlock.dataset.id = Number(anime.mal_id)
            animeBlock.dataset.liked = anime.liked
            animeBlock.dataset.wished = anime.wished
            animeBlock.setAttribute('id', index)
            index++;
            animeBlock.innerHTML = anime.create()
            fullRow.append(animeBlock)
            animeBlock.addEventListener('click', handleAnimeClicks)
        }
    }

}

async function handleAnimeClicks(e) {
    if (e.target.className === 'like-btn') {
        console.log(e.target)
        console.log(this)
        if (this.dataset.liked === "false") {
            likeAnime(this, e.target)
        }
        else if (this.dataset.liked === "true") {
            unLikeAnime(this, e.target)
        }
    }

    if (e.target.className === 'wish-btn') {
        console.log(e.target)
        console.log(this)
        if (this.dataset.wished === 'false') {
            wishAnime(this, e.target)
        }
        else if (this.dataset.wished === 'true') {
            unWishAnime(this, e.target)
        }
    }
}







async function likeAnime(int, target) {
    await userAnime[Number(int.id)].like()
    int.dataset.liked = true
    target.textContent = "unlike"
}

async function unLikeAnime(int, target) {
    await userAnime[Number(int.id)].unLike()
    int.dataset.liked = false
    target.textContent = 'Like'
}


async function wishAnime(int, target) {
    await userAnime[Number(int.id)].wish()
    int.dataset.wished = true
    target.textContent = "unwish"
}

async function unWishAnime(int, target) {
    await userAnime[Number(int.id)].unWish()
    int.dataset.wished = false
    target.textContent = 'Wish'
}