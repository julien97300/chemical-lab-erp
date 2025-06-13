from models.order import Order
from main import db

class OrderService:
    @staticmethod
    def get_all_orders():
        return Order.query.all()

    @staticmethod
    def get_order_by_id(order_id):
        return Order.query.get(order_id)

    @staticmethod
    def create_order(**kwargs):
        order = Order(**kwargs)
        db.session.add(order)
        db.session.commit()
        return order

    @staticmethod
    def update_order(order_id, **kwargs):
        order = Order.query.get(order_id)
        if not order:
            raise ValueError("Order not found")
        for key, value in kwargs.items():
            setattr(order, key, value)
        db.session.commit()
        return order

    @staticmethod
    def delete_order(order_id):
        order = Order.query.get(order_id)
        if not order:
            raise ValueError("Order not found")
        db.session.delete(order)
        db.session.commit()
