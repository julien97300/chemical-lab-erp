import sys
import os
import pytest

# Add the src directory to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from services.user_service import UserService
from models.user import User
from main import app, db

@pytest.fixture(scope='module')
def test_client():
    app.config['TESTING'] = True
    with app.test_client() as testing_client:
        with app.app_context():
            db.create_all()
            yield testing_client
            db.drop_all()

def test_create_user(test_client):
    user = UserService.create_user(
        username='testuser',
        email='testuser@example.com',
        full_name='Test User',
        role='Visiteur',
        password='testpassword'
    )
    assert user.username == 'testuser'
    assert user.email == 'testuser@example.com'

def test_get_user_by_id(test_client):
    user = UserService.get_user_by_id(1)
    assert user is not None
    assert user.username == 'testuser'

def test_update_user(test_client):
    user = UserService.update_user(1, full_name='Updated User')
    assert user.full_name == 'Updated User'

def test_delete_user(test_client):
    UserService.delete_user(1)
    user = UserService.get_user_by_id(1)
    assert user is None
