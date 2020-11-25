# OtakuHaven
## API
* https://jikan.docs.apiary.io/#
## Tech Stack
#### Backend
* Python
* Flask
* PostgreSQL
* Flask SQLAlchemy
* Jinja
* WTForms
#### Frontend
*The only frontend library used for this project was axios for API calls. The rest of the frontend was handled with vanilla css and javascript*
* Vanilla Javascript
* CSS, CSS Flexbox
* Axios
* HTML

## Use
OtakuHaven is the ultimate web application for anime lovers. It is meant to take anime/genres that you like, and give recommendations for new ones to find. It also allows you to seamlessly view information/trailers for the anime with a click of a button, and add anime you would like to see to a wishlist that can be downloaded as a pdf so you can have it with you next time you are having an anime night with the friends!

## Functionality
#### Search Functionality
The app works by giving the user recommendations for anime based on what they like directly upon the landing page. The user can then like an anime, add it to their wishlist, view more information, or view recommendations for the specific anime. Also, there are some advanced search mechanics where you can search by:
* name
* year and season
* anime airing that day
* upcomming anime
* top anime from many different categories

#### Recommendations
The recommendations page allows for side scolling rows of anime based off of recommendations on the user's likes, with the ability to generate more rows as they please. The app randomly chooses an anime the user likes, or a genre they like, and creates recommendations for it.

#### Wishlist and Liked Anime

The user has dedicated pages to house their wishlist anime, as well as their liked anime. That way, they can view it anytime to make changes if neccessary. An added bonus to the wishlist is the user can have a pdf of their wishlist generated and downloaded so they can take it on the go and never arrive unpreprared to an anime night.

#### Seamless and Fluid

The app generates anime dynamically through javascript, so searching for or requesting more anime doesn't require the page to load, you need just submit a form, or click a button and more anime comes right to you as well. A modal popup when an anime is clicked to display more information is optimized for streamlined anime searching.

#### Genre functionality

If the user has specific genres they like, they can like those genres, to improve the apps functionality of recommendations, as well as view anime in those recommendations, with an infinite scroll capability (via button click) at the bottom of the page so users can scroll and browse through every anime a genre has to offer.

## User Flow

The user will arrive on the landing page, with anime being displayed based off of a top anime category (because a non logged in user doesn't have liked anime yet).

If they try to like or wishlist an anime, a login modal will popup to allow for an easy login. From the home page the user can search for anime in many different ways.

#### Recommended Flow for a First Time User

Once visiting the page for the first time, it is recommended to create an account, so that way the app can track your interests. Next, you will want to click the "Get Started" button. This button will take you through a wizard which will have you like at least 3 genres of anime, then give you recommendations for anime based off of those 3 genres, like some of the anime add others to your wishlist and click next.

The next page is the bread and butter of the app, the recommendations page. This will give you side scrolling rows of anime that is recommended to the user specifically based off of their interests. 

As you find some anime that look interesting, click on the images to learn more about them and watch their trailer, if they seem interesting then add them to your wishlist!

On your wishlist page, you may then download the wishlist as a pdf so that way you can take your wishlist on the go with you.





