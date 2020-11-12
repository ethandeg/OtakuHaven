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

    static createFullData(obj){
        if(obj.trailer_url){
            
            let html = `
                            <div class = "anime-modal__title"><h2 class="anime-modal__hero--title">${obj.title}</h2></div>
                            <div class = "anime-modal__hero">
                            
                            <iframe src="${obj.trailer_url}" frameborder="2" allowfullscreen="allowfullscreen"></iframe>
                        </div>
                        <div class="anime-modal__data">
                        <a href="/anime/recommendations/${obj.mal_id}" class = "recommendation-link">Get recommendations for this anime</a>
                        <a href="/anime/${obj.mal_id}" class = "dedicated-link">See full anime page</a>
                            <ul class="anime-modal__data--list">
                                <li><strong>Episodes:</strong> ${obj.episodes}</li>
                                <li><strong>Status:</strong> ${obj.status}</li>
                                <li><strong>Aired:</strong> ${obj.aired}</li>
                            </ul>
                            <hr class="divider">
                            <div class="anime-modal__data--synopsis mb-medium">
                                ${obj.synopsis}
                            </div>
                            <div class = "anime-modal__data--genres">
                            <strong>Genres: </strong>
                            </div>
                            <span class = "anime-modal__data--score mb-large"><i class = "fa fa-star" aria-hidden="true"></i>
                                    ${obj.score}</span>
                                    &nbsp;
                            </div>
                            `
            

            return html
        } else{
            let html = `
                            <div class = "anime-modal__title">
                            <h2 class="anime-modal__hero--title">${obj.title}</h2>
                            </div>
                            <div class = "anime-modal__hero" style = "height: 31rem; width: 25rem;">
                            
                            <img src = "${obj.image_url}" alt = "${obj.title}">
                        </div>
                        <div class="anime-modal__data pt-medium">
                        <a href="/anime/recommendations/${obj.mal_id}" class = "recommendation-link">Get recommendations for this anime</a>
                        <a href="/anime/${obj.mal_id}" class = "dedicated-link">See full anime page</a>
                            <ul class="anime-modal__data--list">
                                <li><strong>Episodes:</strong> ${obj.episodes}</li>
                                <li><strong>Status:</strong> ${obj.status}</li>
                                <li><strong>Aired:</strong> ${obj.aired}</li>
                            </ul>
                            <hr class="divider">
                            <div class="anime-modal__data--synopsis mb-medium">
                                ${obj.synopsis}
                            </div>
                            <div class = "anime-modal__data--genres">
                            <strong>Genres: </strong>
                            </div>
                            <span class = "anime-modal__data--score mb-large"><i class = "fa fa-star" aria-hidden="true"></i>
                                    ${obj.score}</span>
                                    &nbsp;
                            </div>
            `


            return html
        }

    }

    static createDedicatedData(obj){
        let producers = obj.producers.join(', ')
        let licensors = obj.licensors.join(', ')
        let studios = obj.studios.join(', ')


        if(obj.trailer_url){
            let html = ` 
            <div class = "anime-modal__title"><h2 class="anime-modal__hero--title">${obj.title}</h2></div>
            <div class = "anime-modal__hero">
            
            <iframe src="${obj.trailer_url}" frameborder="2" allowfullscreen="allowfullscreen"></iframe>
        </div>
        <div class="anime-modal__data">
        <a href="/anime/recommendations/${obj.mal_id}" class = "recommendation-link">Get recommendations for this anime</a>
            <ul class="anime-modal__data--list">
                <li><strong>Episodes:</strong> ${obj.episodes}</li>
                <li><strong>Status:</strong> ${obj.status}</li>
                <li><strong>Aired:</strong> ${obj.aired}</li>
                <li><strong>Duration:</strong> ${obj.duration}</li>
                <li><strong>Rating:</strong> ${obj.rating}</li>
                <li><strong>Broadcast:</strong> ${obj.broadcast}</li>
                <li><strong>Aired:</strong> ${obj.aired}</li>
                <li><strong>Producers:</strong> ${producers}</li>
                <li><strong>Licensors:</strong> ${licensors}</li>
                <li><strong>Studios:</strong> ${studios}</li>
            </ul>
            <hr class="divider">
            <div class="anime-modal__data--synopsis mb-medium">
                ${obj.synopsis}
            </div>
            <div class = "anime-modal__data--genres">
            <strong>Genres: </strong>
            </div>
            <span class = "anime-modal__data--score mb-large"><i class = "fa fa-star" aria-hidden="true"></i>
                    ${obj.score}</span>
                    &nbsp;
            </div>`
            return html
        } else {
            let html = `
            <div class = "anime-modal__title">
            <h2 class="anime-modal__hero--title">${obj.title}</h2>
            </div>
            <div class = "anime-modal__hero" style = "height: 31rem; width: 25rem;">
            
            <img src = "${obj.image_url}" alt = "${obj.title}">
        </div>
        <div class="anime-modal__data pt-medium">
        <a href="/anime/recommendations/${obj.mal_id}" class = "recommendation-link">Get recommendations for this anime</a>
            <ul class="anime-modal__data--list">
                <li><strong>Episodes:</strong> ${obj.episodes}</li>
                <li><strong>Status:</strong> ${obj.status}</li>
                <li><strong>Aired:</strong> ${obj.aired}</li>
                <li><strong>Duration:</strong> ${obj.duration}</li>
                <li><strong>Rating:</strong> ${obj.rating}</li>
                <li><strong>Broadcast:</strong> ${obj.broadcast}</li>
                <li><strong>Aired:</strong> ${obj.aired}</li>
                <li><strong>Producers:</strong> ${producers}</li>
                <li><strong>Licensors:</strong> ${licensors}</li>
                <li><strong>Studios:</strong> ${studios}</li>
            </ul>
            <hr class="divider">
            <div class="anime-modal__data--synopsis mb-medium">
                ${obj.synopsis}
            </div>
            <div class = "anime-modal__data--genres">
            <strong>Genres: </strong>
            </div>
            <span class = "anime-modal__data--score mb-large"><i class = "fa fa-star" aria-hidden="true"></i>
                    ${obj.score}</span>
                    &nbsp;
            </div>`
            return html
        }
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


    static async getAnimeFromRecommendation(mal_id) {
        const results = []
        if (mal_id) {
            let res = await axios.get(`/api/anime/recommend?mal_id=${mal_id}`)
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
        let res = await axios.get('/api/getanime/genre')
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
