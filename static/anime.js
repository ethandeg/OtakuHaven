class Anime {
    constructor(animeObj) {
        this.title = animeObj.title;
        this.image_url = animeObj.image_url;
        this.mal_id = animeObj.mal_id;
        this.liked = animeObj.liked;
        this.wished = animeObj.wished;
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

        return this.innerHtml = `<div class="anime-block__image">
        <img src="${this.image_url}"
            alt="${this.title}">
    </div>
    <div class="anime-block__title">
        <h3 class="anime-block__title-header">${this.title}</h3>
    </div>
    <div class="anime-block__buttons">
        <button class='btn btn-primary' data-type = "like-anime">${likeBtnText}</button>
        <button class='btn btn-secondary' data-type = "wish-anime">${wishBtnText}</button>
    </div>`
    }

    static async createFullData(obj){
        // let likeBtnText
        // let wishBtnText
        // if (obj.liked === true) {
        //     likeBtnText = 'unlike'
        // } else {
        //     likeBtnText = 'like'
        // }
        // if (obj.wished === true) {
        //     wishBtnText = 'unwish'
        // } else {
        //     wishBtnText = 'wish'
        // }

        let html = `<ul class = "list">
                    <li>${obj.title}</li>
                    <li>${obj.aired}</li>
                    <li>${obj.episodes}</li>
                    <li>${obj.image_url}</li>
                    <li>${obj.liked}</li>
                    <li>${obj.mal_id}</li>
                    <li>${obj.score}</li>
                    <li>${obj.status}</li>
                    <li>${obj.synopsis}</li>
                    <li>${obj.trailer_url}</li>
                    <li>${obj.wished}</li>
                </ul>
                `
        

        return html

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
            let res = await axios.get('/api/anime/recommend', {
                "mal_id": Number(this.mal_id)
            })
            for (let i = 0; i < res.data.length; i++) {
                let anime = new Anime(res.data[i])
                results.push(anime)
            }
            console.log(results)
            return results
        } else {
            let res = await axios.get('/api/anime/recommend')
            for (let i = 0; i < res.data.length; i++) {
                let anime = new Anime(res.data[i])
                results.push(anime)
            }
            console.log(results)
            return results
        }



    }


    static async getAnimeRecommendationsFromGenre() {
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
