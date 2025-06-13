from services.supplier_service import SupplierService
from utils.logger import setup_logger
from flask import Blueprint, request, jsonify
from utils.validation import sanitize_input

supplier_bp = Blueprint('supplier', __name__)
logger = setup_logger(__name__)

@supplier_bp.route('/suppliers', methods=['GET'])
def get_suppliers():
    try:
        suppliers = SupplierService.get_all_suppliers()
        return jsonify({'suppliers': [s.to_dict() for s in suppliers]})
    except Exception as e:
        logger.error(f"Error fetching suppliers: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@supplier_bp.route('/suppliers/<int:supplier_id>', methods=['GET'])
def get_supplier(supplier_id):
    try:
        supplier = SupplierService.get_supplier_by_id(supplier_id)
        if not supplier:
            return jsonify({'error': 'Supplier not found'}), 404
        return jsonify(supplier.to_dict())
    except Exception as e:
        logger.error(f"Error fetching supplier {supplier_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@supplier_bp.route('/suppliers', methods=['POST'])
def create_supplier():
    try:
        data = request.get_json()
        data = {k: sanitize_input(v) for k, v in data.items()}
        supplier = SupplierService.create_supplier(**data)
        return jsonify(supplier.to_dict()), 201
    except Exception as e:
        logger.error(f"Error creating supplier: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@supplier_bp.route('/suppliers/<int:supplier_id>', methods=['PUT'])
def update_supplier(supplier_id):
    try:
        data = request.get_json()
        data = {k: sanitize_input(v) for k, v in data.items()}
        supplier = SupplierService.update_supplier(supplier_id, **data)
        return jsonify(supplier.to_dict())
    except Exception as e:
        logger.error(f"Error updating supplier {supplier_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@supplier_bp.route('/suppliers/<int:supplier_id>', methods=['DELETE'])
def delete_supplier(supplier_id):
    try:
        SupplierService.delete_supplier(supplier_id)
        return jsonify({'message': 'Supplier deleted'})
    except Exception as e:
        logger.error(f"Error deleting supplier {supplier_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500
from flask import Blueprint, request, jsonify
from src.services.supplier_service import SupplierService
from src.utils.logger import setup_logger
from src.utils.validation import sanitize_input

supplier_bp = Blueprint('supplier', __name__)
logger = setup_logger(__name__)

@supplier_bp.route('/suppliers', methods=['GET'])
def get_suppliers():
    try:
        suppliers = SupplierService.get_all_suppliers()
        return jsonify({'suppliers': [s.to_dict() for s in suppliers]})
    except Exception as e:
        logger.error(f"Error fetching suppliers: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@supplier_bp.route('/suppliers/<int:supplier_id>', methods=['GET'])
def get_supplier(supplier_id):
    try:
        supplier = SupplierService.get_supplier_by_id(supplier_id)
        if not supplier:
            return jsonify({'error': 'Supplier not found'}), 404
        return jsonify(supplier.to_dict())
    except Exception as e:
        logger.error(f"Error fetching supplier {supplier_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@supplier_bp.route('/suppliers', methods=['POST'])
def create_supplier():
    try:
        data = request.get_json()
        data = {k: sanitize_input(v) for k, v in data.items()}
        supplier = SupplierService.create_supplier(**data)
        return jsonify(supplier.to_dict()), 201
    except Exception as e:
        logger.error(f"Error creating supplier: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@supplier_bp.route('/suppliers/<int:supplier_id>', methods=['PUT'])
def update_supplier(supplier_id):
    try:
        data = request.get_json()
        data = {k: sanitize_input(v) for k, v in data.items()}
        supplier = SupplierService.update_supplier(supplier_id, **data)
        return jsonify(supplier.to_dict())
    except Exception as e:
        logger.error(f"Error updating supplier {supplier_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@supplier_bp.route('/suppliers/<int:supplier_id>', methods=['DELETE'])
def delete_supplier(supplier_id):
    try:
        SupplierService.delete_supplier(supplier_id)
        return jsonify({'message': 'Supplier deleted'})
    except Exception as e:
        logger.error(f"Error deleting supplier {supplier_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500
