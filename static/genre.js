class Genre {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    // async likeGenre() {
    //     let res = await axios.post('/categories/liked', {
    //         'genre_id': this.id
    //     })
    //     console.log(res)
    //     return res
    // }

    // async deleteGenre() {
    //     res = await axios({
    //         method: 'delete',
    //         url: '/categories/unlike',
    //         headers: { 'Content-type': 'application/json' },
    //         data:
    //             { 'genre_id': this.id }
    //     })
    //     console.log(res)
    //     return res
    // }
}