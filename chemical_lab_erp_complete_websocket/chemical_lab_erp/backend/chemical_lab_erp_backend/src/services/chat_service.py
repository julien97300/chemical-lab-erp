from models.chat_message import ChatMessage
from main import db

class ChatService:
    @staticmethod
    def get_messages(room='general', limit=50):
        return ChatMessage.query.filter_by(room=room).order_by(ChatMessage.timestamp.desc()).limit(limit).all()

    @staticmethod
    def add_message(user_id, room, message_text):
        message = ChatMessage(user_id=user_id, room=room, message=message_text)
        db.session.add(message)
        db.session.commit()
        return message
