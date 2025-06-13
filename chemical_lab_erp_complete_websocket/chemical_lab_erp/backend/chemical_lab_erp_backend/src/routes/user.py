from flask import Blueprint, request, jsonify
from services.user_service import UserService
from utils.logger import setup_logger
from utils.validation import validate_email, validate_username, validate_password, sanitize_input

user_bp = Blueprint('user', __name__)
logger = setup_logger(__name__)

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = UserService.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify(user.to_dict())
    except Exception as e:
        logger.error(f"Error fetching user {user_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@user_bp.route('/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        username = sanitize_input(data.get('username'))
        email = sanitize_input(data.get('email'))
        full_name = sanitize_input(data.get('full_name'))
        role = sanitize_input(data.get('role', 'Visiteur'))
        password = data.get('password')

        if not validate_username(username):
            return jsonify({'error': 'Invalid username'}), 400
        if not validate_email(email):
            return jsonify({'error': 'Invalid email'}), 400
        if not validate_password(password):
            return jsonify({'error': 'Invalid password'}), 400

        user = UserService.create_user(
            username=username,
            email=email,
            full_name=full_name,
            role=role,
            password=password
        )
        return jsonify(user.to_dict()), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.get_json()
        # Sanitize and validate inputs as needed
        if 'username' in data and not validate_username(data['username']):
            return jsonify({'error': 'Invalid username'}), 400
        if 'email' in data and not validate_email(data['email']):
            return jsonify({'error': 'Invalid email'}), 400
        if 'password' in data and not validate_password(data['password']):
            return jsonify({'error': 'Invalid password'}), 400

        user = UserService.update_user(user_id, **data)
        return jsonify(user.to_dict())
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 404
    except Exception as e:
        logger.error(f"Error updating user {user_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        UserService.delete_user(user_id)
        return jsonify({'message': 'User deleted'})
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 404
    except Exception as e:
        logger.error(f"Error deleting user {user_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500
