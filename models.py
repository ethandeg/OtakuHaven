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
    password = db.Column(db.String(50), nullable=False)




class LikedAnime(db.Model):
    """Anime That is liked by a user"""

    __tablename__ = 'likedanime'

    mal_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    title = db.Column(db.Text)
    image_url = db.Column(db.Text)

    user = db.relationship('User', backref='liked')

class WishListAnime(db.Model):
    """Anime that a user will want to watch later"""

    __tablename__ = 'wishanime'
    mal_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),primary_key=True)
    title = db.Column(db.Text)
    image_url = db.Column(db.Text)

    user = db.relationship('User', backref='wished')

class UserGenre(db.Model):
    """Genre Id's liked by User Ids"""

    __tablename__ = 'user_genre'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    genre_id = db.Column(db.Integer)

    user = db.relationship('User', backref='genre')

    def serialize(self):
        """Returns a dict representation of Liked Genre"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'genre_id': self.genre_id
            'genre_name': 
        }




