from datetime import datetime
from main import db

class Supplier(db.Model):
    __tablename__ = 'suppliers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(100), unique=True, nullable=False)
    contact_person = db.Column(db.String(255))
    email = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    website = db.Column(db.String(255))
    supplier_type = db.Column(db.String(100))
    reliability_score = db.Column(db.Float)
    specialties = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    products = db.relationship('Product', back_populates='supplier', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Supplier {self.name} ({self.code})>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'contact_person': self.contact_person,
            'email': self.email,
            'phone': self.phone,
            'website': self.website,
            'supplier_type': self.supplier_type,
            'reliability_score': self.reliability_score,
            'specialties': self.specialties,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
