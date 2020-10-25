class Genre {
    constructor(id, name) {
        this.id = id;
        this.name = name;
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

}