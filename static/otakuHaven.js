
document.querySelector('.container').addEventListener('click', addLikedGenre)



async function addLikedGenre(e) {
    if (e.target.dataset && e.target.tagName === 'BUTTON') {
        let res = await axios.post('/categories/liked', {
            'genre_id': e.target.dataset.id,
        })

        if (res.status === 201) {
            console.log(`You officially like ${e.target.previousElementSibling.textContent}`)
        } else {
            console.log('Something went wrong')
        }
    }


}