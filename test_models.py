from unittest import TestCase
from sqlalchemy import exc
from models import db, User, LikedAnime, WishListAnime, UserGenre
import os


os.environ['DATABASE_URL'] = "postgresql:///OtakuHaven-test"


from app import app

db.create_all()

class UserModelTestCase(TestCase):
    def setUp(self):
        db.drop_all()
        db.create_all()

        u1 = User.signup("root", "root")
        u1id = 1111
        u1.id = u1id

        u2 = User.signup("admin", "admin")

        u2id = 2222
        u2.id = u2id
        db.session.commit()

        
        self.u1 = u1
        self.u1id = u1id

        self.u2 = u2
        self.u2id = u2id
        self.client = app.test_client()

    def tearDown(self):
        res = super().tearDown()
        db.session.rollback()
        return res

    def test_user_model(self):
            """Does basic model work?"""

            u = User(
                username="testuser",
                password="HASHED_PASSWORD"
            )

            db.session.add(u)
            db.session.commit()

            # User should have no messages & no followers
            self.assertEqual(len(u.liked), 0)
            self.assertEqual(len(u.wished), 0)
            self.assertEqual(len(u.genre), 0)

    def test_anime_user_likes_then_delete(self):
        anime = LikedAnime(mal_id=21, user_id=self.u1id, title="One Piece", image_url='https://cdn.myanimelist.net/images/anime/6/73245.jpg?s=f792b8c9e28534ae455d06b15e686a14')
        db.session.add(anime)
        db.session.commit()
        self.assertEqual(len(self.u1.liked), 1)
        delete_anime = LikedAnime.query.filter_by(user_id=self.u1id, mal_id=21).first()
        db.session.delete(delete_anime)
        db.session.commit()
        self.assertEqual(len(self.u1.liked), 0)

    def test_anime_user_wished_then_delete(self):
        anime = WishListAnime(mal_id=21, user_id=self.u1id, title="One Piece", image_url='https://cdn.myanimelist.net/images/anime/6/73245.jpg?s=f792b8c9e28534ae455d06b15e686a14')
        db.session.add(anime)
        db.session.commit()
        self.assertEqual(len(self.u1.wished), 1)
        delete_anime = WishListAnime.query.filter_by(user_id=self.u1id, mal_id=21).first()
        db.session.delete(delete_anime)
        db.session.commit()
        self.assertEqual(len(self.u1.wished), 0)

    def test_genre_user_like_then_delete(self):
        genre = UserGenre(id=1, user_id=self.u1id,genre_id=1)
        db.session.add(genre)
        db.session.commit()
        self.assertEqual(len(self.u1.genre),1)
        db.session.delete(genre)
        db.session.commit()
        self.assertEqual(len(self.u1.genre), 0)


    def test_invalid_username_signup(self):

        invalid = User.signup("root", "test")
        uid = 123456789
        invalid.id = uid
        with self.assertRaises(exc.IntegrityError) as context:
            db.session.commit()

    def test_invalid_password_signup(self):
        with self.assertRaises(ValueError) as context:
            User.signup("testtest", None)

    
    def test_valid_authentication(self):
        u = User.authenticate(self.u1.username, "root")
        self.assertIsNotNone(u)
        self.assertEqual(u.id, self.u1id)
    
    def test_invalid_username(self):
        self.assertFalse(User.authenticate("badusername", "root"))

    def test_wrong_password(self):
        self.assertFalse(User.authenticate(self.u1.username, "badpassword"))



        

