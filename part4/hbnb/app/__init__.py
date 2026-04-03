from flask import Flask
from flask_restx import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Shared Flask extensions are created once and initialized inside create_app.
jwt = JWTManager()
bcrypt = Bcrypt()
db = SQLAlchemy()


def create_app(config_class="config.DevelopmentConfig"):
    """Build and configure the Flask application instance."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Only local frontend origins are allowed to call the API during development.
    CORS(app, resources={r"/api/*": {"origins": [
        "http://127.0.0.1:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5500",
        "http://localhost:5501"
    ]}})

    # Initialize every Flask extension against the same application instance.
    bcrypt.init_app(app)
    jwt.init_app(app)
    db.init_app(app)

    # Deferred imports prevent circular imports during module loading.
    from app.api.v1.users import api as users_ns
    from app.api.v1.amenities import api as amenities_ns
    from app.api.v1.places import api as places_ns
    from app.api.v1.reviews import api as reviews_ns
    from app.api.v1.auth import api as auth_ns

    api = Api(
        app, version='1.0',
        title='HBnB API',
        description='HBnB Application API',
        doc='/api/v1/',
        authorizations={
            'BearerAuth': {
                'type': 'apiKey',
                'in': 'header',
                'name': 'Authorization',
                'description': 'JWT — format: Bearer <token>'
            }
        }
    )

    api.add_namespace(users_ns, path='/api/v1/users')
    api.add_namespace(amenities_ns, path='/api/v1/amenities')
    api.add_namespace(places_ns, path='/api/v1/places')
    api.add_namespace(reviews_ns, path='/api/v1/reviews')
    api.add_namespace(auth_ns, path='/api/v1/auth')

    # Import models before create_all so SQLAlchemy registers every table.
    with app.app_context():
        from app.models import user, place, review, amenity, place_image
        db.create_all()

    return app
