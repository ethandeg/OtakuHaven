from flask import Flask, request, render_template, redirect, flash, session, jsonify, url_for, g, send_file, after_this_request
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, LikedAnime, WishListAnime, UserGenre
from forms import UserForm
from jikan import genres, get_anime_from_genre, search_for_specific_anime, get_full_anime_data, get_recommendations_by_anime, search_upcoming_anime, search_by_season, get_years_and_seasons, search_top_anime, weekdays, today, anime_by_day_of_week, get_dedicated_anime_data
from sqlalchemy.exc import IntegrityError
from pdf import create_pdf, delete_pdf, get_pdfkit_config
from random import sample, choice
import os



CURR_USER_KEY = "curr_user"
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql:///otakuhaven')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'codyisthebestdoggy9999')
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

connect_db(app)
db.create_all()


@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

    else:
        g.user = None
        g.form = UserForm()



def do_login(user):
    """Log in user."""

    session[CURR_USER_KEY] = user.id


def do_logout():
    """Logout user."""

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]


@app.route('/getstarted/genres')
def select_genres():
    """Route to like at least 3 genres, and then move on to animes"""
    if g.user:
        ids = [genre.genre_id for genre in g.user.genre]
        ready = True if len(ids) >= 3 else False
        return render_template('first_time/genres.html', ids=ids, genres=genres, ready=ready)
    else:
        flash("You need to be logged in to do that", "danger")
        return redirect('/login')


@app.route('/getstarted/anime')
def select_anime():
    """Route to like anime based off of genres on the get started series"""
    if g.user:
        likes = [like.mal_id for like in g.user.liked]
        return render_template('first_time/anime.html', likes=likes)
    else:
        flash("You need to be logged in to do that", "danger")
        return redirect('/login')


@app.route('/')
def show_categories():
    """Home Route"""
    return render_template('home.html')


@app.route('/logout')
def logout():
    """Handle logout of user."""
    do_logout()
    flash("You have successfully logged out", "info")
    return redirect('/')

@app.route('/signup', methods=['GET', 'POST'])
def signup_user():
    """Signup New User"""
    form = UserForm()
    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                password=form.password.data,
            )
            db.session.commit()
        except IntegrityError:
            flash("Username already taken", "danger")
            return redirect('/signup')

        do_login(user)
        flash(f"Welcome to Otakuhaven {user.username}",'success')
        return redirect('/')
    else:
        return render_template('signup.html', form=form)


@app.route('/popup/signup', methods=['POST'])
def sign_up_user_from_popup():
    """Signup when from the modal"""
    form = UserForm()
    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                password=form.password.data,
            )
            db.session.commit()

        except IntegrityError:
            return jsonify(error="Username already taken")

        do_login(user)

        return jsonify(message="You are now signed up")
    else:
        return jsonify(error="Username must be less than 30 characters and Password must be between 4-50 characters")


@app.route('/popup/login', methods=['POST'])
def login_user_from_popup():
    """Login from the modal"""
    form = UserForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data,
                                 form.password.data)

        if user:
            do_login(user)
            info = {}
            info["likes"] = [like.mal_id for like in user.liked]
            info["wished"] = [wish.mal_id for wish in user.wished]
            info["genres"] = [genre.genre_id for genre in user.genre]
            return jsonify(info)
        else:
            return jsonify(error="Invalid Username or Password")


@app.route('/login', methods=['POST', 'GET'])
def login_user():
    """Login User"""
    form= UserForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data, form.password.data)

        if user:
            do_login(user)
            flash(f"Hello, {user.username}!", "success")
            return redirect('/')
        else:
            flash("Invalid login credentials", 'danger')
            return redirect('/login')
    
    return render_template('login.html', form=form)

@app.route('/categories/liked', methods=['POST'])
def add_liked_categories():
    """Route for a user to like a genre"""
    if g.user:
        genre_id = int(request.json['genre_id'])
        liked_genre = UserGenre(user_id=g.user.id, genre_id=genre_id)
        db.session.add(liked_genre)
        db.session.commit()
        response_json = jsonify(liked_genre=liked_genre.serialize())
        return (response_json, 201)
    else:
        return jsonify(message='no logged in user')


@app.route('/categories/unlike', methods=['DELETE'])
def remove_liked_category():
    """Route for a user to unlike a genre"""
    genre_id = int(request.json['genre_id'])
    unliked_genre = UserGenre.query.filter_by(
        user_id=g.user.id, genre_id=genre_id).first()
    db.session.delete(unliked_genre)
    db.session.commit()
    json_message = {"message": "deleted"}
    return jsonify(json_message)


@app.route('/anime')
def show_anime():
    """Ultimate recommendations route"""
    if g.user:
        session['picked'] = {
                        'anime':[],
                        'genres': []
                        }
        print(session['picked'])
        return render_template('anime.html')
    else:
        flash("It is recommended to create an account or login to get better recommendations", "info")
        return render_template('anime.html')


@app.route('/api/getanime/genre')
def get_anime():
    """Get JSON response for the anime for specific genres"""
    if g.user:
        likes = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        ids = [genre.genre_id for genre in g.user.genre]
        if len(ids) >= 3:
            genre = sample(ids, 3)
            animes = [get_anime_from_genre(gen, likes, wished)
                      for gen in genre]
            return jsonify(animes)
        else:
            genre = sample(ids, len(ids))
            animes = [get_anime_from_genre(gen, likes, wished)
                      for gen in genre]
            return jsonify(animes)
    else:
        return jsonify(message="not logged in")





@app.route('/anime/like', methods=['POST'])
def like_anime():
    """Route for a user to like an anime"""
    if g.user:
        mal_id = int(request.json['mal_id'])
        title = request.json['title']
        image_url = request.json['image_url']
        liked_anime = LikedAnime(
            mal_id=mal_id, user_id=g.user.id, image_url=image_url, title=title)
        db.session.add(liked_anime)
        db.session.commit()
        response_json = jsonify(liked_anime=liked_anime.serialize())
        return (response_json, 201)
    else:
        return jsonify(message='not logged in')


@app.route('/anime/unlike', methods=['DELETE'])
def delete_liked_anime():
    """Route for a user to unlike an anime"""
    if g.user:
        mal_id = int(request.json['mal_id'])
        unliked_anime = LikedAnime.query.filter_by(
            user_id=g.user.id, mal_id=mal_id).first()
        db.session.delete(unliked_anime)
        db.session.commit()
        json_message = {"message": "deleted"}
        return jsonify(json_message)
    else:
        return jsonify(message='no logged in user')


@app.route('/anime/wishlist', methods=['POST'])
def add_anime_to_wishlist():
    """Route for user to add an anime to their wishlist"""
    if g.user:
        mal_id = int(request.json['mal_id'])
        title = request.json['title']
        image_url = request.json['image_url']
        wished_anime = WishListAnime(
            user_id=g.user.id, mal_id=mal_id, title=title, image_url=image_url)
        db.session.add(wished_anime)
        db.session.commit()
        response_json = jsonify(wish_anime=wished_anime.serialize())
        return (response_json, 201)
    else:
        return jsonify(message='not logged in')


@app.route('/anime/wishlist', methods=['DELETE'])
def unwish_anime():
    """route for user to unwish"""
    if g.user:
        mal_id = int(request.json['mal_id'])
        unwished_anime = WishListAnime.query.filter_by(
            user_id=g.user.id, mal_id=mal_id).first()
        db.session.delete(unwished_anime)
        db.session.commit()
        return jsonify(message="deleted")
    else:
        return jsonify(message='no logged in user')


@app.route('/user/liked')
def show_user_liked_anime():
    """show user's liked anime"""
    if g.user:
        wished = [wish.mal_id for wish in g.user.wished]
        return render_template('liked.html', wished=wished)

    else:
        return "no logged in user"


@app.route('/user/wished')
def show_user_wished_anime():
    """show user's wished anime"""
    if g.user:
        liked = [like.mal_id for like in g.user.liked]
        return render_template('wished.html', liked=liked)

    else:
        return "no logged in user"


@app.route('/anime/search')
def search_anime():
    """Search for a specific anime"""
    query = request.args["query"]
    if g.user:
        liked = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        res = search_for_specific_anime(query, liked, wished)
        return jsonify(res)
    else:
        res = search_for_specific_anime(query)
        return jsonify(res)


@app.route('/api/anime/recommend')
def recommendation_by_anime():
    """JSON response for recommendations of a specific anime"""
    if g.user:
        liked = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        try:
            id = request.args['mal_id']
            res = get_recommendations_by_anime(id, liked, wished)
            return jsonify(res)
        except KeyError:
            if liked:
                id = sample(liked, 1)[0]
                res = get_recommendations_by_anime(
                    id, likes=liked, wished=wished)
                return jsonify(res)
            else:
                res = get_recommendations_by_anime(wished=wished)
                return jsonify(res)
    else:
        try:
            id = request.args['mal_id']
            res = get_recommendations_by_anime(id)
            return jsonify(res)
        except KeyError:
            res = get_recommendations_by_anime()
            return jsonify(res)


@app.route('/genres')
def show_genres():
    """display genres"""
    if g.user:
        ids = [genre.genre_id for genre in g.user.genre]
        return render_template('genres.html', genres=genres, ids=ids)
    else:
        return render_template('genres.html', genres=genres)


@app.route('/genres/<int:genre_id>')
def show_anime_from_genre(genre_id):
    """display anime for specific genre"""
    genre = [genre['name'] for genre in genres if genre_id == genre['id']]
    if g.user:
        ids = [genre.genre_id for genre in g.user.genre]
        return render_template('specific_genre.html', genre_name=genre[0], genre_id=genre_id, ids=ids)
    else:
        return render_template('specific_genre.html', genre_name=genre[0], genre_id=genre_id)


@app.route('/api/genres/<int:genre_id>')
def get_anime_for_one_genre(genre_id):
    """return json anime for a specific anime, automatically paginates"""
    if g.user:
        likes = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        try:
            res = get_anime_from_genre(genre_id, likes, wished)
            return jsonify(res)
        except IndexError:
            return jsonify(message="no more anime for this genre")
    else:
        try:
            res = get_anime_from_genre(genre_id)
            return jsonify(res)
        except IndexError:
            return jsonify(message="no more anime for this genre")


@app.route('/api/anime/<int:mal_id>')
def get_data_for_anime(mal_id):
    """Gets full data for an anime as a json response"""
    if g.user:
        likes = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        res = get_full_anime_data(mal_id, likes, wished)
        return jsonify(res)
    else:
        res = get_full_anime_data(mal_id)
        return jsonify(res)


@app.route('/api/anime/upcoming')
def show_upcoming_anime():
    """JSON response for upcoming anime"""
    if g.user:
        likes = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        res = search_upcoming_anime(likes, wished)
        return jsonify(res)
    else:
        res = search_upcoming_anime()
        return jsonify(res)


@app.route('/api/create_season_form')
def get_season_form():
    """gets years and seasons form"""
    res = get_years_and_seasons()
    return jsonify(res)


@app.route('/api/anime/anime_by_season')
def get_anime_by_season():
    """JSON response for anime searched by a specific year and season"""
    year = int(request.args['year'])
    season = request.args['season']
    if g.user:
        likes = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        res = search_by_season(year, season, likes, wished)
        return jsonify(res)
    else:
        res = search_by_season(year, season)
        return jsonify(res)


@app.route('/api/anime/top')
def get_top_anime():
    """JSON response for searching top anime"""
    subtype = request.args['subtype']
    page = request.args['page']
    if g.user:
        likes = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.liked]
        try:
            res = search_top_anime(subtype, likes, wished, page)
            return jsonify(res)
        except KeyError:
            return jsonify(message="page not found")
    else:
        try:
            res = search_top_anime(subtype=subtype, page=page)
            return jsonify(res)
        except KeyError:
            return jsonify(message="page not found")


@app.route('/api/anime/day')
def get_anime_by_day():
    """get anime by day of the week JSON"""
    day = request.args.get("day", today)
    if g.user:
        likes = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        res = anime_by_day_of_week(day, likes, wished)
        return jsonify(res)
    else:
        res = anime_by_day_of_week(day)
        return jsonify(res)


@app.route('/api/createpdf', methods=['POST'])
def create_wishlist_pdf():
    """Creates and downloads pdf of user wishlist"""
    if g.user:
        html = request.form['wished-html']
        create_pdf(html, g.user.username)
        path = f"wishlists\\{g.user.username}.pdf"
        return send_file(path, as_attachment=True)

    else:
        return "no logged in user"

@app.route('/anime/<int:mal_id>')
def show_specific_anime(mal_id):
    """show full anime data on page"""
    if g.user:
        likes = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        liked = True if mal_id in likes else False
        wished = True if mal_id in wished else False
        return render_template('specific_anime.html', liked=liked, wished=wished, mal_id=mal_id)
    else:
        return render_template('specific_anime.html', mal_id=mal_id)
@app.route('/api/anime/dedicated')
def get_all_anime_data():
    """get full anime data"""
    mal_id = request.args["mal_id"]
    if g.user:
        likes = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        res = get_dedicated_anime_data(mal_id,likes,wished)
        return jsonify(res)
    else:
        res = get_dedicated_anime_data(mal_id)
        return jsonify(res)

@app.route('/anime/recommendations/<int:mal_id>')
def show_recommendations_for_anime(mal_id):
    '''page for showing recommendations for specific anime'''
    try:
        title = request.args['title']
    except:
        return redirect(f"/anime/recommendations/{mal_id}?title=This%20Anime")
    if g.user:
        likes = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        if title:
            return render_template('anime-recommendations.html', likes=likes, wished=wished, mal_id=mal_id,title=title)
        else:
            return render_template('anime-recommendations.html','anime-recommendations.html', likes=likes, wished=wished, mal_id=mal_id)
    else:
        if title:
            return render_template('anime-recommendations.html', mal_id=mal_id,title=title)
        else:
            return render_template('anime-recommendations.html', mal_id=mal_id)



@app.route('/api/anime/recommendations')
def get_full_recommendations():
    """This route gives a recommendation response based off of liked animes or genres"""
    if g.user:
        print(session['picked'])
        likes = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        not_picked_likes = [id for id in likes if id not in session['picked']['anime']]
        genre_ids = [genre.genre_id for genre in g.user.genre]
        not_picked_genres = [id for id in genre_ids if id not in session['picked']['genres']]
        recommendations = {
            'anime': not_picked_likes,
            'genres': not_picked_genres
        }
        keys = [k for k in recommendations if recommendations[k]]
        try:
            category = choice(keys)
        except IndexError:
            session['picked']['anime'] = []
            session['picked']['genres'] = []
            not_picked_likes = [id for id in likes if id not in session['picked']['anime']]
            not_picked_genres = [id for id in genre_ids if id not in session['picked']['genres']]
            return jsonify(message='no more')
        if category == "anime":
            mal_id = choice(recommendations['anime'])
            buffer = session['picked']
            buffer['anime'].append(mal_id)
            session['picked'] = buffer
            anime = LikedAnime.query.filter_by(mal_id=mal_id).first()
            title = anime.title
            res = get_recommendations_by_anime(mal_id, likes, wished)
            return jsonify(res,title)
        elif category == "genres":
            mal_id = choice(recommendations['genres'])
            buffer = session['picked']
            buffer['genres'].append(mal_id)
            session['picked'] = buffer
            res = get_anime_from_genre(mal_id, likes, wished)
            return jsonify(res)
    else:
        return "no logged in user" 

@app.route('/cleanpicked', methods=['DELETE'])
def clean_picked():
    session['picked']['anime'] = []
    session['picked']['genres'] = []
    return jsonify(session['picked'])
