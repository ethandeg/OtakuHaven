class API {
    constructor() {

    }

    static async likeGenre(id) {
        let res = await axios.post('/categories/liked', {
            'genre_id': id
        })
        return res
    }

    static async unLikeGenre(id) {
        let res = await axios({
            method: 'delete',
            url: '/categories/unlike',
            headers: { 'Content-type': 'application/json' },
            data:
                { 'genre_id': id }
        })
        return res
    }

    static async getAnimeBySearch(query) {
        let res = await axios.get(`/anime/search?query=${query}`)
        const results = []
        console.log(res.data)
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

    static async getUpcomingAnime(){
        let res = await axios.get('/api/anime/upcoming')
        const results = []
        for(let i = 0; i < res.data.length; i++){
            let anime = new Anime(res.data[i])
            results.push(anime)
        }
        return results
    }

    static async getSeasonForm(){
        let res = await axios.get('/api/create_season_form')
        return res
    }

    static async getAnimeFromSeason(year,season){
        const results = []
        let res = await axios.get(`/api/anime/anime_by_season?year=${year}&season=${season}`)

        for(let i = 0; i < res.data.length; i++){
            let anime = new Anime(res.data[i])
            results.push(anime)
        }
        return results
    }
    static async getTopAnime(subtype){
        const results = []
        let res = await axios.get(`/api/anime/top?subtype=${subtype}`)
        for(let i = 0; i < res.data.length; i++){
            let anime = new Anime(res.data[i])
            results.push(anime)
        }
        return results
    }

    static async getAnimeByDay(day){
        const results = []
        if(day){
            let res = await axios.get(`/api/anime/day?day=${day}`)
            for(let i = 0; i < res.data.length; i++){
                let anime = new Anime(res.data[i])
                results.push(anime)
            }
            console.log(results)
            return results

        } else {
            let res = await axios.get(`/api/anime/day`)
            for(let i = 0; i < res.data.length; i++){
                let anime = new Anime(res.data[i])
                results.push(anime)
            }
            console.log(results)
            return results
        }
        
    }

}