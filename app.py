from flask import Flask, request, render_template, redirect, flash, session, jsonify, url_for,g
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User,LikedAnime,WishListAnime, UserGenre
from forms import UserForm
from jikan import genres
from sqlalchemy.exc import IntegrityError

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
    return render_template('index.html', genres=genres)

@app.route('/secret')
def secret_page():
    if g.user:
        return render_template('secret.html')
    else:
        return redirect('/login')

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