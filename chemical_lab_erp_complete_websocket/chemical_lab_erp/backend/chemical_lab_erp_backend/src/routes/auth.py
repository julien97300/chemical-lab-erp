from flask import Blueprint, request, jsonify
import jwt
from datetime import datetime, timedelta
from services.user_service import UserService
from main import app
from utils.logger import setup_logger

auth_bp = Blueprint('auth', __name__)
logger = setup_logger(__name__)

SECRET_KEY = app.config['SECRET_KEY']

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    user = UserService.authenticate(username, password)
    if not user:
        return jsonify({'error': 'Invalid username or password'}), 401

    token_payload = {
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(token_payload, SECRET_KEY, algorithm='HS256')

    return jsonify({
        'token': token,
        'user': user.to_dict()
    })
