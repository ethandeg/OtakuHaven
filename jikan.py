import requests
import json
from random import shuffle
import datetime

JIKAN_BASE_URL = 'https://api.jikan.moe/v3'

genres = [
    {
        'id': 1,
        'name': 'Action',
        "pages": [i for i in range(1, 39)]
    },
    {
        'id': 2,
        'name': 'Adventure',
        "pages": [i for i in range(1, 31)]
    },
    {
        'id': 3,
        'name': 'Cars',
        "pages": [i for i in range(1, 3)]
    },
    {
        'id': 4,
        'name': 'Comedy',
        "pages": [i for i in range(1, 61)]
    },
    {
        'id': 5,
        'name': 'Dementia',
        "pages": [i for i in range(1, 6)]
    },
    {
        'id': 6,
        'name': 'Demons',
        "pages": [i for i in range(1, 6)]
    },
    {
        'id': 7,
        'name': 'Mystery',
        "pages": [i for i in range(1, 9)]
    },
    {
        'id': 8,
        'name': 'Drama',
        "pages": [i for i in range(1, 27)]
    },
    {
        'id': 9,
        'name': 'Ecchi',
        "pages": [i for i in range(1, 9)]
    },
    {
        'id': 10,
        'name': 'Fantasy',
        "pages": [i for i in range(1, 33)]
    },
    {
        'id': 11,
        'name': 'Game',
        "pages": [i for i in range(1, 5)]
    },
    {
        'id': 12,
        'name': 'Hentai',
        "pages": [i for i in range(1, 15)]
    },
    {
        'id': 13,
        'name': 'Historical',
        "pages": [i for i in range(1, 13)]
    },
    {
        'id': 14,
        'name': 'Horror',
        "pages": [i for i in range(1, 6)]
    },
    {
        'id': 15,
        'name': 'Kids',
        "pages": [i for i in range(1, 28)]
    },
    {
        'id': 16,
        'name': 'Magic',
        "pages": [i for i in range(1, 12)]
    },
    {
        'id': 17,
        'name': 'Martial Arts',
        "pages": [i for i in range(1, 6)]
    },
    {
        'id': 18,
        'name': 'Mecha',
        "pages": [i for i in range(1, 12)]
    },
    {
        'id': 19,
        'name': 'Music',
        "pages": [i for i in range(1, 24)]
    },
    {
        'id': 20,
        'name': 'Parody',
        "pages": [i for i in range(1, 8)]
    },
    {
        'id': 21,
        'name': 'Samurai',
        "pages": [i for i in range(1, 4)]
    },
    {
        'id': 22,
        'name': 'Romance',
        "pages": [i for i in range(1, 20)]
    },
    {
        'id': 23,
        'name': 'School',
        "pages": [i for i in range(1, 18)]
    },
    {
        'id': 24,
        'name': 'Sci-Fi',
        "pages": [i for i in range(1, 27)]
    },
    {
        'id': 25,
        'name': 'Shoujo',
        "pages": [i for i in range(1, 8)]
    },
    {
        'id': 26,
        'name': 'Shoujo Ai',
        "pages": [i for i in range(1, 2)]
    },
    {
        'id': 27,
        'name': 'Shounen',
        "pages": [i for i in range(1, 21)]
    },
    {
        'id': 28,
        'name': 'Shounen Ai',
        "pages": [i for i in range(1, 2)]
    },
    {
        'id': 29,
        'name': 'Space',
        "pages": [i for i in range(1, 6)]
    },
    {
        'id': 30,
        'name': 'Sports',
        "pages": [i for i in range(1, 9)]
    },
    {
        'id': 31,
        'name': 'Super Power',
        "pages": [i for i in range(1, 8)]
    },
    {
        'id': 32,
        'name': 'Vampire',
        "pages": [i for i in range(1, 3)]
    },
    {
        'id': 33,
        'name': 'Yaoi',
        "pages": [i for i in range(1, 2)]
    },
    {
        'id': 34,
        'name': 'Yuri',
        "pages": [i for i in range(1, 2)]
    },
    {
        'id': 35,
        'name': 'Harem',
        "pages": [i for i in range(1, 5)]
    },
    {
        'id': 36,
        'name': 'Slice of Life',
        "pages": [i for i in range(1, 20)]
    },
    {
        'id': 37,
        'name': 'Supernatural',
        "pages": [i for i in range(1, 16)]
    },
    {
        'id': 38,
        'name': 'Military',
        "pages": [i for i in range(1, 7)]
    },
    {
        'id': 39,
        'name': 'Police',
        "pages": [i for i in range(1, 4)]
    },
    {
        'id': 40,
        'name': 'Psychological',
        "pages": [i for i in range(1, 5)]
    },
    {
        'id': 41,
        'name': 'Thriller',
        "pages": [i for i in range(1, 3)]
    },
    {
        'id': 42,
        'name': 'Seinen',
        "pages": [i for i in range(1, 10)]
    },
    {
        'id': 43,
        'name': 'Josei',
        "pages": [i for i in range(1, 2)]
    },
]

for page in genres:
    shuffle(page["pages"])


    weekdays = {
        0: "monday",
        1: "tuesday",
        2: "wednesday",
        3: "thursday",
        4: "friday",
        5: "saturday",
        6: "sunday"
    }
    today = weekdays[datetime.datetime.today().weekday()]

def get_anime_from_genre(id, likes=[], wished=[]):
    # IndexError if pages ran out
    pages = [k["pages"] for k in genres if k['id'] == id][0]
    page = pages.pop()
    pages.insert(0, page)

    res = requests.get(f'{JIKAN_BASE_URL}/genre/anime/{id}/{page}')
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
        results["anime"].append({
            "mal_id": result['mal_id'],
            "title": result['title'],
            "image_url": result['image_url'],
            "liked": True if result['mal_id'] in likes else False,
            "wished": True if result['mal_id'] in wished else False
        })
    return results


def search_for_specific_anime(query, likes=[], wished=[]):
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


def get_full_anime_data(id, likes=[], wished=[]):
    res = requests.get(f'{JIKAN_BASE_URL}/anime/{id}')
    results = {}
    data = res.json()
    # print(json.dumps(data, indent=2))
    results["title"] = data["title"]
    results["mal_id"] = data["mal_id"]
    results["image_url"] = data["image_url"]
    results["trailer_url"] = data["trailer_url"]
    results["episodes"] = data["episodes"]
    results["status"] = data["status"]
    results["aired"] = data["aired"]["string"]
    results["synopsis"] = data["synopsis"]
    results["score"] = data["score"]
    results["liked"] = True if data["mal_id"] in likes else False
    results["wished"] = True if data["mal_id"] in wished else False
    results["genres"] = []
    for result in data["genres"]:
        result = {"mal_id": result["mal_id"], "name": result["name"]}
        results["genres"].append(result)
    return results


def get_recommendations_by_anime(id=21, likes=[], wished=[]):
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


def search_upcoming_anime(likes=[], wished=[]):
    res = requests.get(f"{JIKAN_BASE_URL}/season/later")
    data = res.json()
    results = []
    for result in data["anime"]:
        results.append({
            "mal_id": result["mal_id"],
            "title": result["title"],
            "image_url": result["image_url"],
            "liked": True if result["mal_id"] in likes else False,
            "wished": True if result["mal_id"] in wished else False
        })
    return results


def get_years_and_seasons():
    res = requests.get(f"{JIKAN_BASE_URL}/season/archive")
    results = []
    data = res.json()
    for result in data["archive"]:
        results.append({
            "year": result["year"],
            "seasons": result["seasons"]
        })
    return results


def search_by_season(year, season, likes=[], wished=[]):
    if season == "Summer":
        res = requests.get(f"{JIKAN_BASE_URL}/season/{year}/summer")
    if season == "Winter":
        res = requests.get(f"{JIKAN_BASE_URL}/season/{year}/winter")
    if season == "Spring":
        res = requests.get(f"{JIKAN_BASE_URL}/season/{year}/spring")
    if season == "Fall":
        res = requests.get(f"{JIKAN_BASE_URL}/season/{year}/fall")
    results = []
    data = res.json()
    for result in data["anime"]:
        results.append({
            "mal_id": result["mal_id"],
            "title": result["title"],
            "image_url": result["image_url"],
            "liked": True if result["mal_id"] in likes else False,
            "wished": True if result["mal_id"] in wished else False
        })
    return results


def search_top_anime(subtype, likes=[], wished=[], page=1):
    res = requests.get(f"{JIKAN_BASE_URL}/top/anime/{page}/{subtype}")
    data = res.json()
    results = []
    for result in data["top"]:
        results.append({
            "mal_id": result["mal_id"],
            "title": result["title"],
            "image_url": result["image_url"],
            "liked": True if result["mal_id"] in likes else False,
            "wished": True if result["mal_id"] in wished else False
        })
    return results

def anime_by_day_of_week(day=today, likes=[], wished=[]):

    res = requests.get(f'{JIKAN_BASE_URL}/schedule/{day}')
    data = res.json()
    results = []
    for result in data[day]:
        results.append({
            "mal_id": result["mal_id"],
            "title": result["title"],
            "image_url": result["image_url"],
            "liked": True if result["mal_id"] in likes else False,
            "wished": True if result["mal_id"] in wished else False
        })
    return results