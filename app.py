from flask import Flask, request, render_template, redirect, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User,LikedAnime,WishListAnime, UserGenre
from jikan import genres

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///otakuhaven'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['SECRET_KEY'] = 'CodyIsTheBestDoggy92384721'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

connect_db(app)
db.create_all()


@app.route('/')
def show_categories():
    return render_template('index.html', genres=genres)

@app.route('/categories/liked', methods=['POST'])
def add_liked_categories():
    genre_id = int(request.json['genre_id'])
    liked_genre = UserGenre(user_id = 1, genre_id=genre_id)
    db.session.add(liked_genre)
    db.session.commit()
    response_json = jsonify(liked_genre=liked_genre.serialize())
    return (response_json, 201)