# Standard library imports
import random
# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from datetime import timedelta
from flask_session import Session
from flask_jwt_extended import JWTManager

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SECRET_KEY'] = "ueyuirhsikshfikshsfd" + str(random.getrandbits(256))
app.config['JWT_SECRET_KEY'] = "hddhfkfshsjhfsjk" + str(random.getrandbits(256))
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)


#app.config['SESSION_USE_SIGNER'] = True
#image upload configurations
app.config['UPLOAD_FOLDER'] = 'uploads/profile_pics'  # Folder where profile pictures will be stored
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'avif'}  # Allowed file extensions
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024  # Maximum file size (8MB)

Session(app)

app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
jwt = JWTManager(app)
api = Api(app)
# Instantiate CORS
#CORS(app)
