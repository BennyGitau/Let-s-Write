from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates, backref
from config import db
from datetime import datetime
#add validations(email validation, phone number validation), password hashing(use bcrypt), 
from flask_bcrypt import Bcrypt	
from validate_email import validate_email
bcrypt = Bcrypt()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    secondary_email = db.Column(db.String(255))
    profile_pic = db.Column(db.LargeBinary)
    password = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer)
    dob = db.Column(db.String)
    phone_number = db.Column(db.String(10), unique=True)  # Adjusted to varchar to handle phone numbers properly
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    blogs = db.relationship('Blog', backref='user', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='user', lazy=True, cascade='all, delete-orphan')
    channels_created = db.relationship('Channel', backref='owner', lazy=True, cascade='all, delete-orphan')
    user_channels = db.relationship('UserChannel', backref='user', lazy=True, cascade='all, delete-orphan')
    

    serialize_rules = (
        '-id',
        '-password',
        '-blogs',
        '-comments',
        '-channels_created',
        '-user_channels',
        '-created_at',
        '-updated_at',
        '-email',
        '-secondary_email',
        '-dob',
        '-phone_number'

    )

    @validates('email')
    def validate_email(self,key,email):
        if not validate_email(email):
            raise ValueError("Invalid email address")
        return email

    @validates('phone_number')
    def validate_phone_number(self, key, phone_number):
        if len(phone_number) != 10 or not phone_number.isdigit():
            raise ValueError("Invalid phone number")
        return phone_number
     
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

class Blog(db.Model, SerializerMixin):
    __tablename__ = 'blogs'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    topic = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    channel_id = db.Column(db.Integer, db.ForeignKey('channels.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    comments = db.relationship('Comment', backref='blog', lazy=True, cascade='all, delete-orphan')

    serialize_rules = (
        '-comments',  
    )

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    blog_id = db.Column(db.Integer, db.ForeignKey('blogs.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_rules = (
        '-blog_id',
        '-user_id'
        
    )

class Channel(db.Model, SerializerMixin):
    __tablename__ = 'channels'
    
    id = db.Column(db.Integer, primary_key=True)
    channel_name = db.Column(db.String(255), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Adjusted foreign key reference
    blogs = db.relationship('Blog', backref='channel', lazy=True, cascade='all, delete-orphan')
    user_channels = db.relationship('UserChannel', backref='channel', lazy=True, cascade='all, delete-orphan')
    

    serialize_rules = (
        '-user_channels',
        '-blogs'
    )

class UserChannel(db.Model, SerializerMixin):
    __tablename__ = 'user_channel'
    
    id = db.Column(db.Integer, primary_key=True)
    user_alias = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    channel_id = db.Column(db.Integer, db.ForeignKey('channels.id'), nullable=False)


    serialize_rules = (
        '-id',
        '-user_id',
        '-user'
    )

