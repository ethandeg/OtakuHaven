class Anime {
    constructor(animeObj) {
        this.title = animeObj.title;
        this.image_url = animeObj.image_url,
            this.mal_id = animeObj.mal_id,
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
                                        <li>${this.liked}</li>
                                        <button class = 'wish-btn'>${wishBtnText}</button>
                                        <button class = 'like-btn'>${likeBtnText}</button>
                                    </ul>`
    }


    async like() {
        let res = await axios.post('/anime/like', {
            "mal_id": Number(this.mal_id),
            "title": this.title,
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


    static async getAnimeFromRecommendation() {
        const results = []
        if (this.mal_id) {
            let res = await axios.get('/anime/recommend', {
                "mal_id": Number(this.mal_id)
            })
            for (let i = 0; i < res.data.length; i++) {
                let anime = new Anime(res.data[i])
                results.push(anime)
            }
            console.log(results)
            return results
        } else {
            let res = await axios.get('/anime/recommend')
            for (let i = 0; i < res.data.length; i++) {
                let anime = new Anime(res.data[i])
                results.push(anime)
            }
            console.log(results)
            return results
        }



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
