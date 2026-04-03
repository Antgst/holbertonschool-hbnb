from app import create_app
from app.services import facade

# The WSGI application used by Flask commands and local development.
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
