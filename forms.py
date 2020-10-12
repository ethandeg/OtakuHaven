from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Email, Length, InputRequired, Optional


class UserForm(FlaskForm):
    """Form for creating a new and logging in user user"""

    username = StringField('Username', validators=[InputRequired(message="A username is required to create your account"), Length(max=30, message="30 is the maximum character size for a username")])
    password = PasswordField('Password', validators=[InputRequired(message="You are required to create a password"), Length(min=4, max=50, message="Your password should be between 4 and 50 characters")])