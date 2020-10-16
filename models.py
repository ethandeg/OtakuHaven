from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_bcrypt import Bcrypt



bcrypt = Bcrypt()
db = SQLAlchemy()


def connect_db(app):
    db.app = app
    db.init_app(app)


"""Models for OtakuHaven"""

class User(db.Model):
    """User"""

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)

    genre = db.relationship('UserGenre')
    liked = db.relationship('LikedAnime')
    wished = db.relationship('WishListAnime')

    @classmethod
    def signup(cls, username, password):
        """Sign up user.

        Hashes password and adds user to system.
        """

        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            password=hashed_pwd,
        )

        db.session.add(user)
        return user

    @classmethod
    def authenticate(cls,username,password):
        """Find user with `username` and `password`.

        This is a class method (call it on the class, not an individual user.)
        It searches for a user whose password hash matches this password
        and, if it finds such a user, returns that user object.

        If can't find matching user (or if password is wrong), returns False.
        """

        user = cls.query.filter_by(username=username).first()

        if user and bcrypt.check_password_hash(user.password, password):
            return user

        return False




class LikedAnime(db.Model):
    """Anime That is liked by a user"""

    __tablename__ = 'likedanime'

    mal_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    title = db.Column(db.Text)
    image_url = db.Column(db.Text)

    user = db.relationship('User')

    def serialize(self):
        """Returns a dict representation of Liked Genre"""
        return {
            'mal_id': self.mal_id,
            'user_id': self.user_id,
            'title': self.title,
            'image_url': self.image_url
        }

class WishListAnime(db.Model):
    """Anime that a user will want to watch later"""

    __tablename__ = 'wishanime'
    mal_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'),primary_key=True)
    title = db.Column(db.Text)
    image_url = db.Column(db.Text)

    user = db.relationship('User')

    def serialize(self):
        """returns dict repr of wished anime"""
        return {
            'mal_id': self.mal_id,
            'user_id': self.user_id,
            'title': self.title,
            'image_url': self.image_url
        }

class UserGenre(db.Model):
    """Genre Id's liked by User Ids"""

    __tablename__ = 'user_genre'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    genre_id = db.Column(db.Integer)

    user = db.relationship('User')

    def serialize(self):
        """Returns a dict representation of Liked Genre"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'genre_id': self.genre_id
        }




