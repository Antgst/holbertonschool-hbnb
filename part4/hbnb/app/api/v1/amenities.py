from flask_restx import Namespace, Resource, fields
from app.services import facade
from flask_jwt_extended import jwt_required, get_jwt

api = Namespace('amenities', description='Amenity operations')

amenity_model = api.model('Amenity', {
    'name': fields.String(required=True, description='Name of the amenity')
})


def validate_amenity_payload(data):
    """Ensure the amenity payload contains a non-empty name."""
    if not data or not data.get('name') or not str(data['name']).strip():
        return "'name' is required and cannot be empty"
    return None


def amenity_to_dict(amenity):
    """Serialize an amenity without repeating the same mapping."""
    return {'id': amenity.id, 'name': amenity.name}


@api.route('/')
class AmenityList(Resource):
    @api.response(200, 'List of amenities retrieved successfully')
    def get(self):
        """Retrieve a list of all amenities"""
        amenities = facade.get_all_amenities()
        return [amenity_to_dict(amenity) for amenity in amenities], 200

    @jwt_required()
    @api.doc(security='BearerAuth')
    @api.expect(amenity_model)
    @api.response(201, 'Amenity successfully created')
    @api.response(400, 'Invalid input data')
    def post(self):
        """Create an amenity — admin only"""
        claims = get_jwt()
        if not claims.get('is_admin', False):
            return {'error': 'Admin privileges required'}, 403

        amenity_data = api.payload or {}
        error = validate_amenity_payload(amenity_data)
        if error:
            return {'error': error}, 400

        if facade.get_amenity_by_name(amenity_data['name']):
            return {'error': 'Amenity already registered'}, 400

        try:
            new_amenity = facade.create_amenity(amenity_data)
        except ValueError as e:
            return {'error': str(e)}, 400

        return amenity_to_dict(new_amenity), 201


@api.route('/<amenity_id>')
class AmenityResource(Resource):
    @api.response(200, 'Amenity details retrieved successfully')
    @api.response(404, 'Amenity not found')
    def get(self, amenity_id):
        """Get amenity by ID (public)"""
        amenity = facade.get_amenity(amenity_id)
        if not amenity:
            api.abort(404, f"Amenity {amenity_id} not found")
        return amenity_to_dict(amenity), 200

    @jwt_required()
    @api.doc(security='BearerAuth')
    @api.expect(amenity_model)
    @api.response(200, 'Amenity updated successfully')
    @api.response(400, 'Invalid input data')
    @api.response(401, 'Authentication required')
    @api.response(403, 'Admin privileges required')
    @api.response(404, 'Amenity not found')
    def put(self, amenity_id):
        """Update an amenity — admin only"""
        claims = get_jwt()
        if not claims.get('is_admin', False):
            return {'error': 'Admin privileges required'}, 403

        amenity_data = api.payload or {}
        error = validate_amenity_payload(amenity_data)
        if error:
            return {'error': error}, 400

        try:
            updated_amenity = facade.update_amenity(amenity_id, amenity_data)
        except ValueError as e:
            return {'error': str(e)}, 400

        if not updated_amenity:
            api.abort(404, f"Amenity {amenity_id} not found")
        return amenity_to_dict(updated_amenity), 200
