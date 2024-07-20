#!/usr/bin/env python3

# Standard library imports
from sqlalchemy import desc as DESC
from werkzeug.utils import secure_filename
import os


# Remote library imports
from flask import request, jsonify, make_response
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask import session

# Local imports
from config import app, db, api, jwt
# Add your model imports
from models import User, Blog, Comment, Channel, UserChannel


# Views go here!
class HomeResource(Resource):
    def get(self):
        if 'view_count' not in session:
            session['view_count'] = 0

        view_count = session['view_count']
        blog_count = 5

        if view_count >= blog_count:
            return make_response(jsonify({'message': 'Please sign up or log in to view more blogs'}), 200)
        
        page = request.args.get('page', 1, type=int)
        paginated_blogs = Blog.query.order_by(DESC(Blog.id)).paginate(page=page,per_page=blog_count)

        blogs = [blog.to_dict(rules=('-channel', '-user')) for blog in paginated_blogs.items]

        # Update the session view count
        session['view_count'] += len(blogs)

        response = {
            'blogs': blogs,
            'has_next': paginated_blogs.has_next,
            'has_prev': paginated_blogs.has_prev,
            'next_page': paginated_blogs.next_num if paginated_blogs.has_next else None,
            'prev_page': paginated_blogs.prev_num if paginated_blogs.has_prev else None,
            'total_pages': paginated_blogs.pages,
            'current_page': paginated_blogs.page
        }
        return make_response(jsonify(response), 200)

#login
class AuthResource(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=user.id)
            return make_response({"access_token": access_token}, 200)
        return {'message': 'Invalid credentials'}, 401
#stay logged in
class AuthorisedUser(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if current_user:
            return jsonify(current_user) , 200
        return jsonify({'message': 'User not found'}), 404
#logout   
class LogoutResource(Resource):
    @jwt_required()
    def delete(self):
        return jsonify({'message': 'Logged out'}), 200
#sign up
# Function to check file extensions and size
def allowed_file(filename):
    if not '.' in filename:
        return False
    file_extension = filename.rsplit('.', 1)[1].lower()
    if file_extension not in app.config['ALLOWED_EXTENSIONS']:
        return False
    file_size = request.content_length
    if file_size > app.config['MAX_CONTENT_LENGTH']:
        return False
    return True

class UserResource(Resource):    
    def post(self):
        data = request.get_json()
        
        username=data['username']
        if User.query.filter_by(username=username).first():
            return {'message': 'Username already exists'}, 400
        email=data['email']
        if User.query.filter_by(email=email).first():
            return {'message': 'Email already exists'}, 400
        password = data['password']

        new_user = User(
            username=username,
            email=email,
        )
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        return make_response(jsonify(new_user.to_dict(only=('id', 'username', 'email'))), 201)
    #updating user information after signing up
    @jwt_required()
    def patch(self):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        user = User.query.filter_by(id=current_user_id).first() 
        if user:
            if 'email' in data:
                user.email = data['email']
            if 'age' in data:
                user.age = data['age']
            if 'dob' in data:
                user.dob = data['dob']
            if 'phone_number' in data:
                user.phone_number = data['phone_number']
            if 'password' in data:
                user.set_password(data['password'])
            if 'profile_pic' in request.files:
                profile_pic = request.files['profile_pic']
                if profile_pic and allowed_file(profile_pic.filename):
                    filename = secure_filename(profile_pic.filename)
                    profile_pic.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                    user.profile_pic = filename  # Store the filename in the database

            db.session.commit()
            return jsonify(user.to_dict())
        return {'message': 'User not found'}, 404
    #deleting user
    @jwt_required()
    def delete(self):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return {'message': 'User deleted'}
        return {'message': 'User not found'}, 404

class BlogResource(Resource):
    #view all blogs or blogs in a particular channel
    @jwt_required()
    def get(self, channel_id=None, id=None):
        current_user_id = get_jwt_identity()

        if channel_id is not None and current_user_id:
            blogs = Blog.query.filter_by(channel_id=channel_id).all()
            return make_response(jsonify([blog.to_dict() for blog in blogs]), 200)
        elif id:
            blog = Blog.query.filter_by(id=id).first()
            if blog:
                return make_response(jsonify(blog.to_dict()), 200)
            return make_response({'message': 'Blog not found'}, 404)
        else:
            blogs = Blog.query.all()
            return make_response(jsonify([blog.to_dict() for blog in blogs]), 200)
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        channel_id = data['channel_id']

        user_channel = UserChannel.query.filter_by(user_id=current_user_id, channel_id=channel_id).first()
        if not user_channel:
            return {'message': 'Unauthorized'}, 401
        
        new_blog = Blog(
            content=data['content'],
            topic=data['topic'],
            title=data['title'],
            user_id=current_user_id,
            channel_id=channel_id
        )
        db.session.add(new_blog)
        db.session.commit()
        return make_response({'message': 'Blog created'}, 201)
    
    def delete(self, blog_id):
        blog = Blog.query.get(blog_id)
        if blog:
            db.session.delete(blog)
            db.session.commit()
            return {'message': 'Blog deleted'}
        return {'message': 'Blog not found'}, 404

class CommentResource(Resource):
    @jwt_required()
    def get(self, blog_id=None):
        comments = Comment.query.filter_by(blog_id=blog_id).all()
        return make_response(jsonify([comment.to_dict(only=('id','body', 'created_at')) for comment in comments]), 200)
    @jwt_required()
    def post(self, blog_id):
        current_user = get_jwt_identity()
        data = request.get_json()

        blog=Blog.query.get(blog_id)
        if not blog:
            return {'message': 'Blog not found'}, 404
        data = request.get_json()
        new_comment = Comment(
            body=data['body'],
            user_id= current_user,
            blog_id=blog_id
        )
        db.session.add(new_comment)
        db.session.commit()
        return make_response(new_comment.to_dict(only=('id', 'body', 'user_id')), 201)
#add identity authentication to allow a user only delete comments they wrote.   
class DeleteCommentResource(Resource):
    def delete(self, comment_id):
        comment = Comment.query.get(comment_id)
        if comment:
            db.session.delete(comment)
            db.session.commit()
            return {'message': 'Comment deleted'}
        return {'message': 'Comment not found'}, 404
api.add_resource(DeleteCommentResource, '/comments/<int:comment_id>')

class ChannelResource(Resource):
    def get(self, channel_id=None):
        if channel_id:
            channel = Channel.query.get(channel_id)
            if channel:
                return jsonify(channel.to_dict(only=('channel_name', 'id')))
            return {'message': 'Channel not found'}, 404
        channels = Channel.query.all()
        return make_response(jsonify([channel.to_dict(only=('id', 'channel_name', 'owner_id')) for channel in channels]), 200)
        
    @jwt_required()
    def post(self):
        data = request.get_json()
        current_user = get_jwt_identity()
        channel_name=data['channel_name']
        channel = Channel.query.filter_by(channel_name=channel_name).first()
        if channel:
            return {'message': 'Channel already exists'}, 409
        new_channel = Channel(
            channel_name = channel_name,
            owner_id =current_user
        )
        db.session.add(new_channel)
        db.session.commit()
#add autocreation of channel in userchannel as the user creates the channel
        user_channel = UserChannel(
            user_id=current_user,#replace with current user
            channel_id=new_channel.id
        )
        db.session.add(user_channel)
        db.session.commit()
        return make_response(jsonify(new_channel.to_dict(only=('id', 'channel_name', 'owner_id'))), 201)
    def delete(self, channel_id):
        channel = Channel.query.get(channel_id)
        if channel:
            db.session.delete(channel)
            db.session.commit()
            return {'message': 'Channel deleted'}
        return {'message': 'Channel not found'}, 404
 #joining a channel   
@app.route('/channels/join', methods=['POST'])
@jwt_required()
def join_channel():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if 'channel_id' not in data:
        return jsonify({'message': 'Channel ID is required'}), 400

    channel_id = data['channel_id']

    user_channel = UserChannel.query.filter_by(user_id=current_user_id, channel_id=channel_id).first()
    if user_channel:
        return jsonify({'message': 'Already joined channel'}), 400

    # Add user to channel_members table
    user_channel = UserChannel(
        user_id=current_user_id,
        channel_id=channel_id
    )
    return jsonify({'message': 'Successfully joined channel'}), 200



# Add resources to API
api.add_resource(HomeResource, '/home')
api.add_resource(LogoutResource, '/logout')
api.add_resource(AuthorisedUser, '/current_user')
api.add_resource(UserResource, '/users', '/users/<int:user_id>')
api.add_resource(BlogResource, '/blogs', '/blogs_by_channel_id/<int:channel_id>', '/blogs/<int:channel_id>/<int:id>', '/blogs/<int:id>')
api.add_resource(CommentResource, '/comments', '/comments/<int:blog_id>')
api.add_resource(ChannelResource, '/channels', '/channels/<int:channel_id>')
api.add_resource(AuthResource, '/login')



if __name__ == '__main__':
    app.run(port=5556, debug=True)