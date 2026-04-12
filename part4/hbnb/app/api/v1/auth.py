from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token
from app.services import facade

api = Namespace('auth', description='Authentication operations')

# Model for input validation
login_model = api.model('Login', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password')
})


def get_login_credentials():
    """Read login credentials safely from the request payload."""
    credentials = api.payload or {}
    return credentials.get('email'), credentials.get('password')


@api.route('/login')
class Login(Resource):
    """Authentication endpoint returning a JWT token."""

    @api.expect(login_model)
    def post(self):
        """Validate credentials and return a signed access token."""
        email, password = get_login_credentials()

        if not email or not password:
            return {'error': 'email and password are required'}, 400

        user = facade.get_user_by_email(email)
        if not user or not user.verify_password(password):
            return {'error': 'Invalid credentials'}, 401

        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"is_admin": user.is_admin}
        )
        return {'access_token': access_token}, 200
