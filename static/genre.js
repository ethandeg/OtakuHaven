class Genre {
    constructor(id, name, liked) {
        this.id = id;
        this.name = name;
        this.liked = liked
    }




    create() {
    //     <div class='genre-block' data-id="{{genre_id}}" data-liked = true data-name="{{genre_name}}">
    //     <div class='genre-block__title'>
    //         <h3 class='genre-block__title--title'>{{genre_name}}</h3>
    //     </div>
    //     <div class="genre-block__footer">
    //         <a href="/genres/{{genre_id}}" class = "btn btn-blue"><i class="fa fa-eye" aria-hidden="true"></i> See {{genre_name}} Anime</a>
    //         <button class='btn btn-blue like-btn'><i class="fa fa-star" aria-hidden="true"></i> Unlike</button>
    //     </div>
    // </div>
        let likeBtnText
        if (this.liked == "true") {
            return this.innerHTML = `<div class = "genre-block__title">

                                        <h3 class='genre-block__title--title'>${this.name}</h3>
                 </div>
                 <div class="genre-block__footer">
                     <a href="/genres/${this.id}" class = "btn btn-primary"><i class="fa fa-eye" aria-hidden="true"></i> See ${this.name} Anime</a>
                     <button class='btn btn-secondary like-btn'><i class="fa fa-star" aria-hidden="true"></i> Unlike</button>
                 </div>
             </div>`
        } else {
            return this.innerHTML = `<div class = "genre-block__title">

                                        <h3 class='genre-block__title--title'>${this.name}</h3>
                 </div>
                 <div class="genre-block__footer">
                     <a href="/genres/${this.id}" class = "btn btn-primary"><i class="fa fa-eye" aria-hidden="true"></i> See ${this.name} Anime</a>
                     <button class='btn btn-secondary like-btn'><i class="fa fa-star" aria-hidden="true"></i> Unlike</button>
                 </div>
             </div>`
        }
        
        return this.innerHTML = `<div class = "content">
                                    <span class = "title">${this.name}</span>
                                    <a href="/genres/${this.id}">Learn more about ${this.name}</a>
                                    <button class = "btn btn-blue like-btn">${likeBtnText}</button>

                                </div>`
    }
    static async createGenreButton(genre){
        let link = document.createElement('a')
        link.textContent = genre.name
        // <a href="#" class='btn btn-sm btn-blue mx-small mb-small'>Action</a>
        link.setAttribute('href', `/genres/${genre.mal_id}`)
        link.classList.add('btn')
        link.classList.add('btn-sm')
        link.classList.add('btn-blue')
        link.classList.add('mx-small')
        link.classList.add('mb-small')
        return link
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

}