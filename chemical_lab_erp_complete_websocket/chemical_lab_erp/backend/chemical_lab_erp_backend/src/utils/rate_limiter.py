import time
from flask import request, jsonify
from functools import wraps

class RateLimiter:
    def __init__(self, calls=100, period=60):
        self.calls = calls
        self.period = period
        self.clients = {}

    def is_allowed(self, client_id):
        now = time.time()
        if client_id not in self.clients:
            self.clients[client_id] = []
        # Remove timestamps older than period
        self.clients[client_id] = [t for t in self.clients[client_id] if t > now - self.period]
        if len(self.clients[client_id]) < self.calls:
            self.clients[client_id].append(now)
            return True
        return False

def rate_limit(calls=100, period=60):
    limiter = RateLimiter(calls, period)
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            client_ip = request.remote_addr
            if not limiter.is_allowed(client_ip):
                return jsonify({'error': 'Too many requests'}), 429
            return f(*args, **kwargs)
        return wrapped
    return decorator
