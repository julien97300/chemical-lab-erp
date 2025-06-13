from models.product import Product
from main import db

class ProductService:
    @staticmethod
    def get_all_products():
        return Product.query.all()

    @staticmethod
    def get_product_by_id(product_id):
        return Product.query.get(product_id)

    @staticmethod
    def create_product(**kwargs):
        product = Product(**kwargs)
        db.session.add(product)
        db.session.commit()
        return product

    @staticmethod
    def update_product(product_id, **kwargs):
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found")
        for key, value in kwargs.items():
            setattr(product, key, value)
        db.session.commit()
        return product

    @staticmethod
    def delete_product(product_id):
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found")
        db.session.delete(product)
        db.session.commit()
