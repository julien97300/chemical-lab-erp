import logging
from flask import request
from time import time

def setup_monitoring(app):
    @app.before_request
    def start_timer():
        request.start_time = time()

    @app.after_request
    def log_request(response):
        if not hasattr(request, 'start_time'):
            return response
        duration = time() - request.start_time
        logging.info(f"{request.method} {request.path} {response.status_code} {duration:.4f}s")
        return response
