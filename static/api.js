class API {
    constructor() {

    }

    static async getAnimeFromSpecificGenre(genre_id) {
        let res = await axios.get(`/api/genres/${genre_id}`)
        let genre = new Genre(res.data.id, res.data.genre)
        let newObj = { "genre": genre, "anime": [], page: res.data.page }
        for (let i = 0; i < res.data.anime.length; i++) {
            let anime = new Anime(res.data.anime[i])
            newObj.anime.push(anime)
        }
        return newObj
    }

    static async getAnimeFromRecommendation(mal_id) {
        const results = []
        if (mal_id) {
            let res = await axios.get(`/api/anime/recommend?mal_id=${mal_id}`)
            for (let i = 0; i < res.data.length; i++) {
                let anime = new Anime(res.data[i])
                results.push(anime)
            }
            return results
        } else {
            let res = await axios.get('/api/anime/recommend')
            for (let i = 0; i < res.data.length; i++) {
                let anime = new Anime(res.data[i])
                results.push(anime)
            }
            return results
        }



    }

    static async getAnimeRecommendationsFromGenre() {
        const results = []
        let res = await axios.get('/api/getanime/genre')
        let data = res.data
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
        return results
    }

    static async getAnimeBySearch(query) {
        let res = await axios.get(`/anime/search?query=${query}`)
        const results = []
        for (let i = 0; i < res.data.length; i++) {
            let anime = new Anime(res.data[i])
            results.push(anime)
        }
        return results
    }

    static async getFullAnimeData(id) {
        let res = await axios.get(`/api/anime/${id}`)
        return res
    }

    static async getUpcomingAnime() {
        let res = await axios.get('/api/anime/upcoming')
        const results = []
        for (let i = 0; i < res.data.length; i++) {
            let anime = new Anime(res.data[i])
            results.push(anime)
        }
        return results
    }

    static async getSeasonForm() {
        let res = await axios.get('/api/create_season_form')
        return res
    }

    static async getAnimeFromSeason(year, season) {
        const results = []
        let res = await axios.get(`/api/anime/anime_by_season?year=${year}&season=${season}`)

        for (let i = 0; i < res.data.length; i++) {
            let anime = new Anime(res.data[i])
            results.push(anime)
        }
        return results
    }
    static async getTopAnime(subtype, page) {
        const results = []
        let res = await axios.get(`/api/anime/top?subtype=${subtype}&page=${page}`)
        if (res.data.message === 'page not found') {
            return "page not found"
        } else {
            for (let i = 0; i < res.data.length; i++) {
                let anime = new Anime(res.data[i])
                results.push(anime)
            }
            return results
        }

    }

    static async getAnimeByDay(day) {
        const results = []
        if (day) {
            let res = await axios.get(`/api/anime/day?day=${day}`)
            for (let i = 0; i < res.data.length; i++) {
                let anime = new Anime(res.data[i])
                results.push(anime)
            }
            return results

        } else {
            let res = await axios.get(`/api/anime/day`)
            for (let i = 0; i < res.data.length; i++) {
                let anime = new Anime(res.data[i])
                results.push(anime)
            }
            return results
        }

    }

    static async getDedicatedAnimeData(id) {
        let res = await axios.get(`/api/anime/dedicated?mal_id=${id}`)
        return res.data
    }

    static async getGenericRecommendation() {
        let res = await axios.get(`/api/anime/recommendations`)
        if (res.data.genre) {
            let results = {
                "anime": [],
                "genre": null
            }
            let genre = new Genre(res.data.id, res.data.genre, true)
            results.genre = genre
            for (let i = 0; i < res.data.anime.length; i++) {
                let anime = new Anime(res.data.anime[i])
                results.anime.push(anime)
            }
            return results


        }

        else if (res.data.message === "no more") {
            return res.data.message
        }

        else {
            let results = { title: null, anime: [] }
            results.title = res.data[1]
            for (let i = 0; i < res.data[0].length; i++) {
                let anime = new Anime(res.data[0][i])
                results.anime.push(anime)
            }
            if (results.anime.length === 0) {
                return "no recommendations for this anime"
            }
            return results
        }
    }

}