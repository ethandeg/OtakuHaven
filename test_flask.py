
import os
from unittest import TestCase

from models import db, User, LikedAnime, WishListAnime, UserGenre

os.environ['DATABASE_URL'] = "postgresql:///OtakuHaven-test"

from app import app, CURR_USER_KEY, do_login

db.create_all()

app.config['WTF_CSRF_ENABLED'] = False

class UserFlowTestCase(TestCase):
    """Test User Views"""

    def setUp(self):
        """Create test client, add sample data."""

        db.drop_all()
        db.create_all()


        self.testuser = User.signup(username="root",
                                    password="root"
                                    )
        self.testuser_id = 8989
        self.testuser.id = self.testuser_id

        wishlist_anime = WishListAnime(mal_id=21, user_id=self.testuser.id, title="One Piece", image_url = "https://cdn.myanimelist.net/images/anime/6/73245.jpg?s=f792b8c9e28534ae455d06b15e686a14")
        db.session.add(wishlist_anime)
        db.session.commit()
        like_anime = LikedAnime(mal_id=21, user_id=self.testuser.id, title="One Piece", image_url = "https://cdn.myanimelist.net/images/anime/6/73245.jpg?s=f792b8c9e28534ae455d06b15e686a14")
        db.session.add(like_anime)
        db.session.commit()

    def tearDown(self):
        resp = super().tearDown()
        db.session.rollback()
        return resp


    def test_home_route(self):
        with app.test_client() as client:
            resp = client.get("/", follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('Welcome to OtakuHaven!', html)


    def test_genre_route(self):
        with app.test_client() as client:
            resp = client.get("/genres")
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("Anime Genres", html)

    def test_specific_genre_route(self):
        with app.test_client() as client:
            resp = client.get('/genres/1')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("Action Anime", html)

    def test_get_started_no_login(self):
        with app.test_client() as client:
            resp = client.get("/getstarted/genres", follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("You need to be logged in to do that", html)

    def test_get_started_w_login(self):
        with app.test_client() as client:
            d = {"username": "admin", "password": "admin"}
            resp = client.post('/signup', data=d, follow_redirects=True)
            res = client.get('/getstarted/genres', follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn("Choose at least 3 genres", html)

    def test_recommendations_no_login(self):
        with app.test_client() as client:
            resp = client.get('/anime')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertNotIn('full-row', html)

    def test_signup_and_logout(self):
        with app.test_client() as client:
            d = {"username": "admin", "password": "admin"}
            resp = client.post('/signup', data=d, follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("Welcome to Otakuhaven admin", html)

            res = client.get('/logout', follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn("You have successfully logged out",html)

    def test_login_and_logout(self):
        with app.test_client() as client:
            d = {"username": "root", "password": "root"}
            resp = client.post('/login', data=d, follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("Hello, root!", html)

            res = client.get('/logout', follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn("You have successfully logged out",html)
