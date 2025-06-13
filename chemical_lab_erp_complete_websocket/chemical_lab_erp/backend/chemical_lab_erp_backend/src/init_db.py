from src.main import app, db, User, Supplier, Product

def init_database():
    with app.app_context():
        db.create_all()

        # Clear existing data
        User.query.delete()
        Supplier.query.delete()
        Product.query.delete()
        db.session.commit()

        # Create sample users
        users_data = [
            {'username': 'admin', 'password': 'admin123', 'email': 'admin@lab.com', 'full_name': 'Administrateur', 'role': 'Admin'},
            {'username': 'coord', 'password': 'coord123', 'email': 'coord@lab.com', 'full_name': 'Coordinateur Lab', 'role': 'Coordinateur'},
            {'username': 'prof', 'password': 'prof123', 'email': 'prof@lab.com', 'full_name': 'Professeur Martin', 'role': 'Enseignant'},
            {'username': 'tech', 'password': 'tech123', 'email': 'tech@lab.com', 'full_name': 'Technicien Lab', 'role': 'Technicien'},
            {'username': 'visit', 'password': 'visit123', 'email': 'visit@lab.com', 'full_name': 'Visiteur', 'role': 'Visiteur'}
        ]

        for user_data in users_data:
            user = User(
                username=user_data['username'],
                email=user_data['email'],
                full_name=user_data['full_name'],
                role=user_data['role']
            )
            user.set_password(user_data['password'])
            db.session.add(user)

        # Create sample suppliers
        suppliers_data = [
            {
                'name': 'Sigma-Aldrich',
                'code': 'SIG001',
                'contact_person': 'Marie Dubois',
                'email': 'contact@sigma-aldrich.com',
                'phone': '+33 1 23 45 67 89',
                'website': 'www.sigma-aldrich.com',
                'supplier_type': 'Premium',
                'reliability_score': 4.8,
                'specialties': 'Produits chimiques de haute pureté, réactifs analytiques'
            },
            {
                'name': 'VWR International',
                'code': 'VWR001',
                'contact_person': 'Jean Martin',
                'email': 'contact@vwr.com',
                'phone': '+33 1 34 56 78 90',
                'website': 'www.vwr.com',
                'supplier_type': 'Standard',
                'reliability_score': 4.5,
                'specialties': 'Équipements de laboratoire, consommables'
            },
            {
                'name': 'Merck KGaA',
                'code': 'MER001',
                'contact_person': 'Sophie Laurent',
                'email': 'contact@merck.com',
                'phone': '+33 1 45 67 89 01',
                'website': 'www.merck.com',
                'supplier_type': 'Premium',
                'reliability_score': 4.9,
                'specialties': 'Produits pharmaceutiques, biotechnologie'
            }
        ]

        for supplier_data in suppliers_data:
            supplier = Supplier(**supplier_data)
            db.session.add(supplier)

        # Create sample products
        products_data = [
            {
                'name': 'Acide Sulfurique',
                'reference': 'H2SO4-98',
                'cas_number': '7664-93-9',
                'formula': 'H₂SO₄',
                'molecular_weight': 98.08,
                'category': 'Acides',
                'supplier_id': 1,
                'unit_price': 25.50,
                'stock_quantity': 15.5,
                'min_stock_level': 5.0,
                'storage_conditions': 'Stocker dans un endroit frais et sec, à l\'abri de la lumière',
                'safety_info': 'H314: Provoque des brûlures de la peau et des lésions oculaires graves'
            },
            {
                'name': 'Éthanol Absolu',
                'reference': 'ETH-ABS-99',
                'cas_number': '64-17-5',
                'formula': 'C₂H₅OH',
                'molecular_weight': 46.07,
                'category': 'Solvants',
                'supplier_id': 2,
                'unit_price': 18.75,
                'stock_quantity': 8.2,
                'min_stock_level': 10.0,
                'storage_conditions': 'Stocker à température ambiante, à l\'abri des sources d\'ignition',
                'safety_info': 'H225: Liquide et vapeurs très inflammables'
            },
            {
                'name': 'Hydroxyde de Sodium',
                'reference': 'NAOH-PURE',
                'cas_number': '1310-73-2',
                'formula': 'NaOH',
                'molecular_weight': 39.997,
                'category': 'Bases',
                'supplier_id': 3,
                'unit_price': 12.30,
                'stock_quantity': 25.0,
                'min_stock_level': 5.0,
                'storage_conditions': 'Stocker dans un récipient hermétique, à l\'abri de l\'humidité',
                'safety_info': 'H314: Provoque des brûlures de la peau et des lésions oculaires graves'
            }
        ]

        for product_data in products_data:
            product = Product(**product_data)
            db.session.add(product)

        db.session.commit()
        print("Database initialized with complete sample data")

if __name__ == '__main__':
    init_database()
