from src.services.order_service import OrderService
from src.utils.logger import setup_logger

order_bp = Blueprint('order', __name__)
logger = setup_logger(__name__)

@order_bp.route('/orders', methods=['GET'])
def get_orders():
    try:
        orders = OrderService.get_all_orders()
        return jsonify({'orders': [o.to_dict() for o in orders]})
    except Exception as e:
        logger.error(f"Error fetching orders: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@order_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    try:
        order = OrderService.get_order_by_id(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        return jsonify(order.to_dict())
    except Exception as e:
        logger.error(f"Error fetching order {order_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@order_bp.route('/orders', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        order = OrderService.create_order(**data)
        return jsonify(order.to_dict()), 201
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@order_bp.route('/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    try:
        data = request.get_json()
        order = OrderService.update_order(order_id, **data)
        return jsonify(order.to_dict())
    except Exception as e:
        logger.error(f"Error updating order {order_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@order_bp.route('/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    try:
        OrderService.delete_order(order_id)
        return jsonify({'message': 'Order deleted'})
    except Exception as e:
        logger.error(f"Error deleting order {order_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500
=======
from flask import Blueprint, request, jsonify
from src.services.order_service import OrderService
from src.utils.logger import setup_logger
from src.utils.validation import sanitize_input

order_bp = Blueprint('order', __name__)
logger = setup_logger(__name__)

@order_bp.route('/orders', methods=['GET'])
def get_orders():
    try:
        orders = OrderService.get_all_orders()
        return jsonify({'orders': [o.to_dict() for o in orders]})
    except Exception as e:
        logger.error(f"Error fetching orders: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@order_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    try:
        order = OrderService.get_order_by_id(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        return jsonify(order.to_dict())
    except Exception as e:
        logger.error(f"Error fetching order {order_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@order_bp.route('/orders', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        data = {k: sanitize_input(v) for k, v in data.items()}
        order = OrderService.create_order(**data)
        return jsonify(order.to_dict()), 201
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@order_bp.route('/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    try:
        data = request.get_json()
        data = {k: sanitize_input(v) for k, v in data.items()}
        order = OrderService.update_order(order_id, **data)
        return jsonify(order.to_dict())
    except Exception as e:
        logger.error(f"Error updating order {order_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@order_bp.route('/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    try:
        OrderService.delete_order(order_id)
        return jsonify({'message': 'Order deleted'})
    except Exception as e:
        logger.error(f"Error deleting order {order_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500
