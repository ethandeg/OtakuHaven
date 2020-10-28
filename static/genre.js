class Genre {
    constructor(id, name, liked) {
        this.id = id;
        this.name = name;
        this.liked = liked
    }


    static async getAnimeFromSpecificGenre(genre_id) {
        let res = await axios.get(`/api/genres/${genre_id}`)
        let genre = new Genre(res.data.id, res.data.genre)
        let newObj = { "genre": genre, "anime": [] }
        for (let i = 0; i < res.data.anime.length; i++) {
            let anime = new Anime(res.data.anime[i])
            newObj.anime.push(anime)
        }
        console.log(newObj)
        return newObj
    }

    create() {
        let likeBtnText
        if (this.liked == "true") {
            likeBtnText = 'unlike'
        } else {
            likeBtnText = 'like'
        }
        
        return this.innerHTML = `<div class = "content">
                                    <span class = "title">${this.name}</span>
                                    <a href="/genres/${this.id}">Learn more about ${this.name}</a>
                                    <button class = "btn btn-blue like-btn">${likeBtnText}</button>

                                </div>`
    }

}