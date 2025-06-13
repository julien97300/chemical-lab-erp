from services.product_service import ProductService
from utils.logger import setup_logger
from flask import Blueprint, request, jsonify
from utils.validation import sanitize_input

product_bp = Blueprint('product', __name__)
logger = setup_logger(__name__)

@product_bp.route('/products', methods=['GET'])
def get_products():
    try:
        products = ProductService.get_all_products()
        return jsonify({'products': [p.to_dict() for p in products]})
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@product_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = ProductService.get_product_by_id(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        return jsonify(product.to_dict())
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@product_bp.route('/products', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        # Sanitize inputs
        data = {k: sanitize_input(v) for k, v in data.items()}
        product = ProductService.create_product(**data)
        return jsonify(product.to_dict()), 201
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@product_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        data = request.get_json()
        # Sanitize inputs
        data = {k: sanitize_input(v) for k, v in data.items()}
        product = ProductService.update_product(product_id, **data)
        return jsonify(product.to_dict())
    except Exception as e:
        logger.error(f"Error updating product {product_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@product_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        ProductService.delete_product(product_id)
        return jsonify({'message': 'Product deleted'})
    except Exception as e:
        logger.error(f"Error deleting product {product_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500
from flask import Blueprint, request, jsonify
from services.product_service import ProductService
from utils.logger import setup_logger
from utils.validation import sanitize_input

product_bp = Blueprint('product', __name__)
logger = setup_logger(__name__)

@product_bp.route('/products', methods=['GET'])
def get_products():
    try:
        products = ProductService.get_all_products()
        return jsonify({'products': [p.to_dict() for p in products]})
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@product_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = ProductService.get_product_by_id(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        return jsonify(product.to_dict())
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@product_bp.route('/products', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        # Sanitize inputs
        data = {k: sanitize_input(v) for k, v in data.items()}
        product = ProductService.create_product(**data)
        return jsonify(product.to_dict()), 201
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@product_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        data = request.get_json()
        # Sanitize inputs
        data = {k: sanitize_input(v) for k, v in data.items()}
        product = ProductService.update_product(product_id, **data)
        return jsonify(product.to_dict())
    except Exception as e:
        logger.error(f"Error updating product {product_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@product_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        ProductService.delete_product(product_id)
        return jsonify({'message': 'Product deleted'})
    except Exception as e:
        logger.error(f"Error deleting product {product_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500
