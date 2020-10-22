import requests
import json

JIKAN_BASE_URL = 'https://api.jikan.moe/v3'

genres = [
    {
        'id': 1,
        'name': 'Action'
    },
    {
        'id': 2,
        'name': 'Adventure'
    },
    {
        'id': 3,
        'name': 'Cars'
    },
    {
        'id': 4,
        'name': 'Comedy'
    },
    {
        'id': 5,
        'name': 'Dementia'
    },
    {
        'id': 6,
        'name': 'Demons'
    },
    {
        'id': 7,
        'name': 'Mystery'
    },
    {
        'id': 8,
        'name': 'Drama'
    },
    {
        'id': 9,
        'name': 'Ecchi'
    },
    {
        'id': 10,
        'name': 'Fantasy'
    },
    {
        'id': 11,
        'name': 'Game'
    },
    {
        'id': 12,
        'name': 'Hentai'
    },
    {
        'id': 13,
        'name': 'Historical'
    },
    {
        'id': 14,
        'name': 'Horror'
    },
    {
        'id': 15,
        'name': 'Kids'
    },
    {
        'id': 16,
        'name': 'Magic'
    },
    {
        'id': 17,
        'name': 'Martial Arts'
    },
    {
        'id': 18,
        'name': 'Mecha'
    },
    {
        'id': 19,
        'name': 'Music'
    },
    {
        'id': 20,
        'name': 'Parody'
    },
    {
        'id': 21,
        'name': 'Samurai'
    },
    {
        'id': 22,
        'name': 'Romance'
    },
    {
        'id': 23,
        'name': 'School'
    },
    {
        'id': 24,
        'name': 'Sci Fi'
    },
    {
        'id': 25,
        'name': 'Shoujo'
    },
    {
        'id': 26,
        'name': 'Shoujo Ai'
    },
    {
        'id': 27,
        'name': 'Shounen'
    },
    {
        'id': 28,
        'name': 'Shounen Ai'
    },
    {
        'id': 29,
        'name': 'Space'
    },
    {
        'id': 30,
        'name': 'Sports'
    },
    {
        'id': 31,
        'name': 'Super Power'
    },
    {
        'id': 32,
        'name': 'Vampire'
    },
    {
        'id': 33,
        'name': 'Yaoi'
    },
    {
        'id': 34,
        'name': 'Yuri'
    },
    {
        'id': 35,
        'name': 'Harem'
    },
    {
        'id': 36,
        'name': 'Slice Of Life'
    },
    {
        'id': 37,
        'name': 'Supernatural'
    },
    {
        'id': 38,
        'name': 'Military'
    },
    {
        'id': 39,
        'name': 'Police'
    },
    {
        'id': 40,
        'name': 'Psychological'
    },
    {
        'id': 41,
        'name': 'Thriller'
    },
    {
        'id': 42,
        'name': 'Seinen'
    },
    {
        'id': 43,
        'name': 'Josei'
    },
]

def get_anime_from_genre(id,likes,wished):
    res = requests.get(f'{JIKAN_BASE_URL}/genre/anime/{id}')
    pretty_json = json.loads(res.text)
    # print(json.dumps(pretty_json, indent=2))
    data = res.json()
    results = {
        "genre": None,
        "id": id,
        "anime": []
        }
    name = [k['name'] for k in genres if k['id'] == id]
    results['genre'] = name[0]
    for result in data['anime']:
        results["anime"].append( {
            "mal_id": result['mal_id'],
            "title": result['title'],
            "image_url": result['image_url'],
            "liked": True if result['mal_id'] in likes else False,
            "wished": True if result['mal_id'] in wished else False
        })
    return results

def search_for_specific_anime(query, likes=[],wished=[]):
    res = requests.get(f'{JIKAN_BASE_URL}/search/anime?q={query}')
    pretty_json = json.loads(res.text)
    data = res.json()['results']
    results = []
    # print(json.dumps(pretty_json, indent=2))
    for result in data:
        results.append({
            "mal_id": result['mal_id'],
            "title": result['title'],
            "image_url": result['image_url'],
            "liked": True if result['mal_id'] in likes else False,
            "wished": True if result['mal_id'] in wished else False
        })

    return results

def get_full_anime_data(id):
    res = requests.get(f'{JIKAN_BASE_URL}/anime/{id}')
    data = res.json()
    print(json.dumps(data, indent=2))



def get_recommendations_by_anime(id=21, likes=[],wished=[]):
    res = requests.get(f'{JIKAN_BASE_URL}/anime/{id}/recommendations')
    results = []
    data = res.json()['recommendations']
    for result in data:
        results.append({
            "mal_id": result["mal_id"],
            "title": result["title"],
            "image_url": result["image_url"],
            "liked": True if result["mal_id"] in likes else False,
            "wished": True if result["mal_id"] in wished else False
        })
    return results


