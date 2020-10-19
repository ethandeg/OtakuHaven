from flask import Flask, request, render_template, redirect, flash, session, jsonify, url_for,g
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User,LikedAnime,WishListAnime, UserGenre
from forms import UserForm
from jikan import genres, get_anime_from_genre
from sqlalchemy.exc import IntegrityError
from random import sample

CURR_USER_KEY = "curr_user"
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///otakuhaven'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['SECRET_KEY'] = 'CodyIsTheBestDoggy92384721'
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

def do_login(user):
    """Log in user."""

    session[CURR_USER_KEY] = user.id

def do_logout():
    """Logout user."""

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]

@app.route('/')
def show_categories():
    if g.user:
        ids = [genre.genre_id for genre in g.user.genre]
        if len(ids) >= 3:
        #     genre = sample(ids,3)
        #     # animes = get_anime_from_genre(genre[0])
        #     animes = [get_anime_from_genre(gen) for gen in genre]

            return redirect('/anime')
        else:
            return render_template('index.html', genres=genres, ids=ids)
    else:
        return "no logged in user"


@app.route('/logout')
def logout():
    """Handle logout of user."""
    do_logout()
    return redirect('/login')


@app.route('/signup', methods=['GET', 'POST'])
def sign_up_user():
    form = UserForm()
    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                password=form.password.data,
            )
            db.session.commit()

        except IntegrityError:
            flash("Username already taken", 'danger')
            return render_template('signup.html', form=form)

        do_login(user)

        return redirect("/")
    else:
        return render_template('signup.html',form=form)

@app.route('/login', methods=['GET', 'POST'])
def login_user():

    form = UserForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data,
                                 form.password.data)

        if user:
            do_login(user)
            flash(f"Hello, {user.username}!", "success")
            return redirect("/")

        flash("Invalid credentials.", 'danger')

    return render_template('login.html', form=form)

@app.route('/categories/liked', methods=['POST'])
def add_liked_categories():
    genre_id = int(request.json['genre_id'])
    liked_genre = UserGenre(user_id = g.user.id, genre_id=genre_id)
    db.session.add(liked_genre)
    db.session.commit()
    response_json = jsonify(liked_genre=liked_genre.serialize())
    return (response_json, 201)

@app.route('/categories/unlike', methods=['DELETE'])
def remove_liked_category():
    genre_id = int(request.json['genre_id'])
    unliked_genre = UserGenre.query.filter_by(user_id = g.user.id, genre_id=genre_id).first()
    db.session.delete(unliked_genre)
    db.session.commit()
    json_message = {"message": "deleted"}
    return jsonify(json_message)

@app.route('/anime')
def show_anime():
    if g.user:
        return render_template('anime.html')
    else:
        return 'no logged in user'

@app.route('/anime', methods=['POST'])
def get_anime():
    if g.user:
        likes = [like.mal_id for like in g.user.liked]
        wished = [wish.mal_id for wish in g.user.wished]
        ids = [genre.genre_id for genre in g.user.genre]
        if len(ids) >= 3:
            genre = sample(ids, 3)
            animes = [get_anime_from_genre(gen,likes,wished) for gen in genre]
            return jsonify(animes)
        else:
            genre = sample(ids, len(ids))
            animes = [get_anime_from_genre(gen,likes,wished) for gen in genre]
            return jsonify(animes)
    else:
        return jsonify(message= "not logged in")

@app.route('/test')
def test():
    return render_template('test.html')


@app.route('/anime/like', methods=['POST'])
def like_anime():
    if g.user:
        mal_id = int(request.json['mal_id'])
        title = request.json['title']
        image_url = request.json['image_url']
        liked_anime= LikedAnime(mal_id=mal_id,user_id = g.user.id, image_url=image_url, title=title)
        db.session.add(liked_anime)
        db.session.commit()
        response_json = jsonify(liked_anime=liked_anime.serialize())
        return (response_json, 201)
    else:
        return jsonify(message='not logged in')

@app.route('/anime/unlike', methods=['DELETE'])
def delete_liked_anime():
    if g.user:
        mal_id = int(request.json['mal_id'])
        unliked_anime = LikedAnime.query.filter_by(user_id = g.user.id ,mal_id=mal_id).first()
        db.session.delete(unliked_anime)
        db.session.commit()
        json_message = {"message": "deleted"}
        return jsonify(json_message)
    else:
        return jsonify(message='no logged in user')

@app.route('/anime/wishlist', methods=['POST'])
def add_anime_to_wishlist():
    if g.user:
        mal_id = int(request.json['mal_id'])
        title = request.json['title']
        image_url = request.json['image_url']
        wished_anime = WishListAnime(user_id = g.user.id, mal_id=mal_id,title=title,image_url=image_url)
        db.session.add(wished_anime)
        db.session.commit()
        response_json = jsonify(wish_anime=wished_anime.serialize())
        return (response_json, 201)
    else:
        return jsonify(message='no logged in user')

@app.route('/anime/wishlist', methods=['DELETE'])
def unwish_anime():
    if g.user:
        mal_id = int(request.json['mal_id'])
        unwished_anime = WishListAnime.query.filter_by(user_id = g.user.id, mal_id=mal_id).first()
        db.session.delete(unwished_anime)
        db.session.commit()
        return jsonify(message="deleted")
    else:
        return jsonify(message='no logged in user')

@app.route('/user/liked')
def show_user_liked_anime():
    if g.user:
        return render_template('liked.html')
    

    else:
        return jsonify(message='no logged in user')
