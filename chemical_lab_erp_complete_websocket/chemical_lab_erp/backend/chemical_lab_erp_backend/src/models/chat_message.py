from datetime import datetime
from main import db

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    room = db.Column(db.String(100), default='general')
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='chat_messages')

    def __repr__(self):
        return f"<ChatMessage {self.id} - User {self.user_id} - Room {self.room}>"

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'room': self.room,
            'message': self.message,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
        }
