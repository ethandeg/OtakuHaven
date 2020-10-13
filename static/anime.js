export class Anime {
    constructor(title,image_url,mal_id, episodes){
        this.title = title;
        this.image_url = image_url,
        this.mal_id = mal_id,
        this.episodes = episodes
    }

    create() {
        return this.innerHtml = `<h1>${this.title}</h1>
                                    <ul>
                                        <li>${this.image_url}</li>
                                        <li>${this.mal_id}</li>
                                        <li>${this.episodes}</li>
                                        
                                    </ul>`
    }

    static async getAnime(){
            let res = await axios.post('/anime')
            console.log(res)
    }
}