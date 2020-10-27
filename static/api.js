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
        console.log(res)
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
        console.log(results)
        return results
    }

    static async getFullAnimeData(id) {
        let res = await axios.get(`/api/anime/${id}`)
        console.log(res)
        return res
    }


}