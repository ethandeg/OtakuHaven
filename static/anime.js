class Anime {
    constructor(animeObj) {
        this.title = animeObj.title;
        this.image_url = animeObj.image_url,
            this.mal_id = animeObj.mal_id,
            this.episodes = animeObj.episodes,
            this.liked = animeObj.liked
        this.wished = animeObj.wished
    }

    create() {
        let likeBtnText
        let wishBtnText
        if (this.liked === true) {
            likeBtnText = 'unlike'
        } else {
            likeBtnText = 'like'
        }
        if (this.wished === true) {
            wishBtnText = 'unwish'
        } else {
            wishBtnText = 'wish'
        }

        return this.innerHtml = `<h6>${this.title}</h6>
                                    <ul>
                                        <li>${this.image_url}</li>
                                        <li>${this.mal_id}</li>
                                        <li>${this.episodes}</li>
                                        <li>${this.liked}</li>
                                        <button class = 'wish-btn'>${wishBtnText}</button>
                                        <button class = 'like-btn'>${likeBtnText}</button>
                                    </ul>`
    }


    async like() {
        let res = await axios.post('/anime/like', {
            "mal_id": Number(this.mal_id),
            "title": this.title,
            "episodes": this.episodes,
            "image_url": this.image_url
        })

        return res
    }

    async unLike() {
        let res = await axios({
            method: 'DELETE',
            url: '/anime/unlike',
            headers: { 'Content-type': 'application/json' },
            data:
                { 'mal_id': Number(this.mal_id) }
        })

        return res
    }

    async wish() {
        let res = await axios.post('/anime/wishlist', {
            "mal_id": Number(this.mal_id),
            "title": this.title,
            "episodes": Number(this.episodes),
            "image_url": this.image_url
        })

        return res
    }

    async unWish() {
        let res = await axios({
            method: 'DELETE',
            url: '/anime/wishlist',
            headers: { 'Content-type': 'application/json' },
            data:
                { 'mal_id': Number(this.mal_id) }
        })

        return res
    }

    static async getAnimeFromGenre() {
        const results = []
        let res = await axios.post('/anime')
        let data = res.data
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            let obj = { "genre": null, "anime": [] }
            let genre = new Genre(data[i].id, data[i].genre)
            obj['genre'] = genre
            for (let j = 0; j < data[i].anime.length; j++) {
                let anime = new Anime(data[i].anime[j])
                obj.anime.push(anime)

            }
            results.push(obj)

        }
        console.log(results)
        return results
    }

}
