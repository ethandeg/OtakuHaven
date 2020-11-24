import requests
import json
from random import shuffle
import datetime
import math

JIKAN_BASE_URL = 'https://api.jikan.moe/v3'

genres = [
    {
        'id': 1,
        'name': 'Action',
        
    },
    {
        'id': 2,
        'name': 'Adventure',
        
    },
    {
        'id': 3,
        'name': 'Cars',
        
    },
    {
        'id': 4,
        'name': 'Comedy',
        
    },
    {
        'id': 5,
        'name': 'Dementia',
        
    },
    {
        'id': 6,
        'name': 'Demons',
        
    },
    {
        'id': 7,
        'name': 'Mystery',
        
    },
    {
        'id': 8,
        'name': 'Drama',
        
    },
    {
        'id': 9,
        'name': 'Ecchi',
        
    },
    {
        'id': 10,
        'name': 'Fantasy',
        
    },
    {
        'id': 11,
        'name': 'Game',
        
    },
    {
        'id': 12,
        'name': 'Hentai',
        
    },
    {
        'id': 13,
        'name': 'Historical',
        
    },
    {
        'id': 14,
        'name': 'Horror',
        
    },
    {
        'id': 15,
        'name': 'Kids',
        
    },
    {
        'id': 16,
        'name': 'Magic',
        
    },
    {
        'id': 17,
        'name': 'Martial Arts',
        
    },
    {
        'id': 18,
        'name': 'Mecha',
        
    },
    {
        'id': 19,
        'name': 'Music',
        
    },
    {
        'id': 20,
        'name': 'Parody',
        
    },
    {
        'id': 21,
        'name': 'Samurai',
        
    },
    {
        'id': 22,
        'name': 'Romance',
        
    },
    {
        'id': 23,
        'name': 'School',
        
    },
    {
        'id': 24,
        'name': 'Sci-Fi',
        
    },
    {
        'id': 25,
        'name': 'Shoujo',
        
    },
    {
        'id': 26,
        'name': 'Shoujo Ai',
        
    },
    {
        'id': 27,
        'name': 'Shounen',
        
    },
    {
        'id': 28,
        'name': 'Shounen Ai',
        
    },
    {
        'id': 29,
        'name': 'Space',
        
    },
    {
        'id': 30,
        'name': 'Sports',
        
    },
    {
        'id': 31,
        'name': 'Super Power',
        
    },
    {
        'id': 32,
        'name': 'Vampire',
        
    },
    {
        'id': 33,
        'name': 'Yaoi',
        
    },
    {
        'id': 34,
        'name': 'Yuri',
        
    },
    {
        'id': 35,
        'name': 'Harem',
        
    },
    {
        'id': 36,
        'name': 'Slice of Life',
        
    },
    {
        'id': 37,
        'name': 'Supernatural',
        
    },
    {
        'id': 38,
        'name': 'Military',
        
    },
    {
        'id': 39,
        'name': 'Police',
        
    },
    {
        'id': 40,
        'name': 'Psychological',
        
    },
    {
        'id': 41,
        'name': 'Thriller',
        
    },
    {
        'id': 42,
        'name': 'Seinen',
        
    },
    {
        'id': 43,
        'name': 'Josei',
        
    },
]




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
    try:
        check = [k["pages"] for k in genres if k['id'] == id]
        if check:
            pages = [k["pages"] for k in genres if k['id'] == id][0]
            page = pages.pop()
            pages.insert(0, page)

            res = requests.get(f'{JIKAN_BASE_URL}/genre/anime/{id}/{page}')
            pretty_json = json.loads(res.text)
            # print(json.dumps(pretty_json, indent=2))
            data = res.json()
            results = {
                "page": page,
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
    except KeyError:
        res = requests.get(f'{JIKAN_BASE_URL}/genre/anime/{id}/1')
        data = res.json()
        if data["item_count"] > 100:
            index = genres[id - 1]
            count = math.ceil(data["item_count"]/100) +1
            index["pages"] = [i for i in range(2, count)]
            shuffle(index['pages'])
            index['pages'].insert(0, 1)
            results = {
                    "page": 1,
                    "genre": index['name'],
                    "id": id,
                    "anime": []
                }
            for result in data['anime']:


                results['anime'].append({
                        "mal_id": result['mal_id'],
                        "title": result['title'],
                        "image_url": result['image_url'],
                        "liked": True if result['mal_id'] in likes else False,
                        "wished": True if result['mal_id'] in wished else False
                })
            return results
        else:
            index = genres[id-1]
            index['pages'] = [1]
            results = {
                "page": 1,
                "genre": index["name"],
                "id": id,
                "anime": []
            }
            for result in data['anime']:
                results['anime'].append({
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
    
    if data["title_english"]:
        results["title"] = data["title_english"]
    else:
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


def get_recommendations_by_anime(id=21, likes=[], wished=[], title=None):
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


def get_dedicated_anime_data(id, likes=[], wished=[]):
    res = requests.get(f"{JIKAN_BASE_URL}/anime/{id}")
    data = res.json()
    results = {}
    if data["title_english"]:
        results["title"] = data["title_english"]
    else:
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
    results["duration"] = data["duration"]
    results["rating"] = data["rating"]
    results["producers"] = []
    for result in data["producers"]:
        results['producers'].append(result["name"])
    results["broadcast"] = data["broadcast"]
    results["studios"] = []
    for result in data["studios"]:
        results["studios"].append(result["name"])
    results["licensors"] = []
    for result in data["licensors"]:
        results["licensors"].append(result["name"])

    return results
