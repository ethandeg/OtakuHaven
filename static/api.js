class API{
    constructor(){
        
    }

    static async likeGenre(id){
        let res = await axios.post('/categories/liked', {
            'genre_id': id
        })
        return res
    }

    static async unLikeGenre(id){
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

    static async likeAnime(id, title, image_url){
        let res = await axios.post('/anime/like', {
            "mal_id": Number(id),
            "title": title,
            "image_url": image_url
        })
        console.log(res)
        return res
    }

}