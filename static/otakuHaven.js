
// document.querySelector('.container').addEventListener('click', addLikedGenre)



// async function addLikedGenre(e) {
//     if (e.target.dataset.liked === 'false' && e.target.tagName === 'BUTTON') {
//         let res = await axios.post('/categories/liked', {
//             'genre_id': e.target.dataset.id,
//         })

//         if (res.status === 201) {
//             console.log(`You officially like ${e.target.previousElementSibling.textContent}`)
//             e.target.dataset.liked = 'true'
//         } else {
//             console.log('Something went wrong')
//         }
//     }

//     }

sendGenres = document.querySelectorAll('.content button')

for(let sendGenre of sendGenres){
    sendGenre.addEventListener('click', postGenre)
}

async function postGenre(e){
    if(e.target.dataset.liked === 'false'){
        let res = await axios.post('/categories/liked', {
            'genre_id': e.target.dataset.id
        })

        if(res.status === 201) {
            console.log(`You officially like ${e.target.previousElementSibling.textContent}`)
            e.target.dataset.liked = 'true'
            return
        }
    }
    else if(e.target.dataset.liked === 'true'){
        let res = await axios.delete('/categories/unlike', {
            'genre_id': e.target.dataset.id
        })
        if(res.status === 200){
            console.log(`You don't like ${e.target.previousElementSibling.textContent} anymore`)
            e.target.dataset.liked = 'false'
            return
        }
    }
}

