import Anime from Anime.js

sendGenres = document.querySelectorAll('.content button')

for(let sendGenre of sendGenres){
    sendGenre.addEventListener('click', postGenre)
}


//Function for liking/unliking genres
function postGenre(e){
    if(e.target.dataset.liked === 'false'){
        likeGenre(e,e.target.dataset.id)
    }
   else if(e.target.dataset.liked === 'true'){
       deleteGenre(e,e.target.dataset.id)
   }
}




//unliking genres
async function deleteGenre(e,id){
    res = await axios({
        method: 'delete',
        url: '/categories/unlike',
        headers: {'Content-type': 'application/json'},
        data:
            {'genre_id': id}
    })
    if(res.status === 200){
        console.log(`You don't like ${e.target.previousElementSibling.textContent}:(`)
        e.target.dataset.liked = 'false'
        e.target.parentElement.parentElement.dataset.liked = 'false'
        e.target.textContent = 'Like'
    }
}
//liking genre
async function likeGenre(e,id){
    let res = await axios.post('/categories/liked', {
        'genre_id': id
    })

    if(res.status === 201) {
        console.log(`You officially like ${e.target.previousElementSibling.textContent}`)
        e.target.dataset.liked = 'true'
        e.target.parentElement.parentElement.dataset.liked = 'true'
        e.target.textContent = 'Unlike'
        return
    }
}





