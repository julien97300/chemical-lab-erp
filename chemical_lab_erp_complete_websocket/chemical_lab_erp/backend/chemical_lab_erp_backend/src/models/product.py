from datetime import datetime
from main import db

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    reference = db.Column(db.String(100), unique=True, nullable=False)
    cas_number = db.Column(db.String(50))
    formula = db.Column(db.String(100))
    molecular_weight = db.Column(db.Float)
    category = db.Column(db.String(100))
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    unit_price = db.Column(db.Float)
    stock_quantity = db.Column(db.Float)
    min_stock_level = db.Column(db.Float)
    storage_conditions = db.Column(db.Text)
    safety_info = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    supplier = db.relationship('Supplier', back_populates='products')

    def __repr__(self):
        return f"<Product {self.name} ({self.reference})>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'reference': self.reference,
            'cas_number': self.cas_number,
            'formula': self.formula,
            'molecular_weight': self.molecular_weight,
            'category': self.category,
            'supplier_id': self.supplier_id,
            'unit_price': self.unit_price,
            'stock_quantity': self.stock_quantity,
            'min_stock_level': self.min_stock_level,
            'storage_conditions': self.storage_conditions,
            'safety_info': self.safety_info,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
