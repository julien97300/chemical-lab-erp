from flask import Blueprint, request, jsonify
from src.services.chat_service import ChatService
from src.utils.logger import setup_logger

chat_bp = Blueprint('chat', __name__)
logger = setup_logger(__name__)

@chat_bp.route('/chat/messages', methods=['GET'])
def get_messages():
    try:
        room = request.args.get('room', 'general')
        limit = int(request.args.get('limit', 50))
        messages = ChatService.get_messages(room=room, limit=limit)
        return jsonify({'messages': [m.to_dict() for m in reversed(messages)]})
    except Exception as e:
        logger.error(f"Error fetching chat messages: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@chat_bp.route('/chat/messages', methods=['POST'])
def add_message():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        room = data.get('room', 'general')
        message_text = data.get('message')
        if not user_id or not message_text:
            return jsonify({'error': 'User ID and message are required'}), 400
        message = ChatService.add_message(user_id, room, message_text)
        return jsonify(message.to_dict()), 201
    except Exception as e:
        logger.error(f"Error adding chat message: {e}")
        return jsonify({'error': 'Internal server error'}), 500
