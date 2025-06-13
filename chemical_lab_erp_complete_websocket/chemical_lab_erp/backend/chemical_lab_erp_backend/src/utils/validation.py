import re

def validate_email(email):
    pattern = r'^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$'
    return re.match(pattern, email) is not None

def validate_username(username):
    return isinstance(username, str) and 3 <= len(username) <= 30

def validate_password(password):
    return isinstance(password, str) and len(password) >= 6

def sanitize_input(value):
    if isinstance(value, str):
        return value.strip()
    return value
