class Anime {
    constructor(animeObj) {
        this.title = animeObj.title;
        this.image_url = animeObj.image_url,
            this.mal_id = animeObj.mal_id,
            this.episodes = animeObj.episodes,
            this.liked = animeObj.liked
        this.wished = animeObj.wished
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

        return this.innerHtml = `<h6>${this.title}</h6>
                                    <ul>
                                        <li>${this.image_url}</li>
                                        <li>${this.mal_id}</li>
                                        <li>${this.episodes}</li>
                                        <li>${this.liked}</li>
                                        <button class = 'wish-btn'>${wishBtnText}</button>
                                        <button class = 'like-btn'>${likeBtnText}</button>
                                    </ul>`
    }


    async like() {
        let res = await axios.post('/anime/like', {
            "mal_id": Number(this.mal_id),
            "title": this.title,
            "image_url": this.image_url
        })
        console.log(res)
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
        console.log(res)
        return res
    }

    async wish() {
        let res = await axios.post('/anime/wishlist', {
            "mal_id": Number(this.mal_id),
            "title": this.title,
            "image_url": this.image_url
        })
        console.log(res)
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
        console.log(res)
        return res
    }

    static async getAnime() {
        let res = await axios.post('/anime')
        let data = res.data
        console.log(data)
        return data


    }
}

// static async getStories() {
//     // query the /stories endpoint (no auth required)
//     const response = await axios.get(`${BASE_URL}/stories`);

//     // turn plain old story objects from API into instances of Story class
//     const stories = response.data.stories.map((story) => new Story(story));
//     //error handling if data is not there
//     //remove from favorites

//     // build an instance of our own class using the new array of stories
//     const storyList = new StoryList(stories);
//     return storyList;
// }











        // for (let i = 0; i < data.length; i++) {
        //     let animeTitleBlock = document.createElement('div');
        //     animeTitleBlock.classList.add('anime-title-block')
        //     animeTitleBlock.innerHTML = `<h2>${data[i][0][0]}</h2>`
        //     document.querySelector('.container').append(animeTitleBlock)
        //     for (let j = 0; j < data[i][1].length; j++) {
        //         let index = data[i][1][j]
        //         let animeInfoBlock = document.createElement('div')
        //         animeInfoBlock.classList.add('anime-info-block')
        //         animeInfoBlock.dataset.id = index.mal_id
        //         let anime = new Anime(index.title, index.image_url, index.mal_id, index.episodes)
        //         animeInfoBlock.innerHTML = anime.create()
        //         animeTitleBlock.append(animeInfoBlock)
        //     }

        // }