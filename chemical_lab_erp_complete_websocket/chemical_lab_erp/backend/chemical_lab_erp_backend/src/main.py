import os
import sys
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
import bcrypt
import jwt
import json
from utils.logger import setup_logger
from utils.monitoring import setup_monitoring
from utils.rate_limiter import RateLimiter
from flask import request, jsonify
from utils.celery_app import make_celery

# Configuration
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost:5432/chemical_lab_erp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy()
db.init_app(app)
CORS(app, origins="*", allow_headers=["Content-Type", "Authorization"])
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True)

# Setup logger
logger = setup_logger(__name__)

# Setup monitoring
setup_monitoring(app)

# Initialize rate limiter
rate_limiter = RateLimiter(calls=100, period=60)

# Setup Celery
celery = make_celery(app)

@app.before_request
def before_request():
    if not rate_limiter.is_allowed(request.remote_addr):
        return jsonify({'error': 'Too many requests'}), 429

# Register blueprints
from routes.user import user_bp
from routes.product import product_bp
from routes.supplier import supplier_bp
from routes.order import order_bp
from routes.chat import chat_bp
from routes.auth import auth_bp

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(product_bp, url_prefix='/api')
app.register_blueprint(supplier_bp, url_prefix='/api')
app.register_blueprint(order_bp, url_prefix='/api')
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    full_name = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='Visiteur')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_online = db.Column(db.Boolean, default=False)
    
    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_online': self.is_online
        }

# SocketIO event handlers for chat
@socketio.on('join_room')
def handle_join_room(data):
    room = data.get('room')
    username = data.get('username')
    if room and username:
        join_room(room)
        logger.info(f"{username} joined room {room}")
        emit('user_joined', {'username': username, 'room': room}, room=room)

@socketio.on('leave_room')
def handle_leave_room(data):
    room = data.get('room')
    username = data.get('username')
    if room and username:
        leave_room(room)
        logger.info(f"{username} left room {room}")
        emit('user_left', {'username': username, 'room': room}, room=room)

@socketio.on('send_message')
def handle_send_message(data):
    user_id = data.get('user_id')
    room = data.get('room')
    message = data.get('message')
    if user_id and room and message:
        # Save message to database
        chat_message = ChatService.add_message(user_id, room, message)
        message_data = chat_message.to_dict()
        emit('receive_message', message_data, room=room)

@socketio.on('user_typing')
def handle_user_typing(data):
    username = data.get('username')
    is_typing = data.get('is_typing')
    room = data.get('room')
    if username and room is not None and is_typing is not None:
        emit('user_typing', {'username': username, 'is_typing': is_typing, 'room': room}, room=room)
