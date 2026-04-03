import re
from app.models.base_model import BaseModel
from app import db, bcrypt

email_validation = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')


class User(BaseModel):
    """User entity with validation and password hashing helpers."""
    __tablename__ = 'users'

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    # Relationships
    places = db.relationship(
        'Place',
        back_populates='owner',
        cascade='all, delete-orphan',
        lazy='select'
    )

    reviews = db.relationship(
        'Review',
        back_populates='user',
        cascade='all, delete-orphan',
        lazy='select'
    )

    def __init__(self, first_name, last_name, email, password, is_admin=False):
        """Validate user fields before storing the hashed password."""
        super().__init__()
        self.first_name = self._validate_non_empty(
            first_name, 'first_name', max_len=50)
        self.last_name = self._validate_non_empty(
            last_name, 'last_name', max_len=50)
        self.email = self._validate_email(email)
        self.is_admin = is_admin
        self.hash_password(password)

    @staticmethod
    def _validate_non_empty(value, field_name, max_len=None):
        """Reject blank values and optionally enforce a max length."""
        if not value or not str(value).strip():
            raise ValueError(f"'{field_name}' is required and cannot be empty")
        if max_len and len(str(value)) > max_len:
            raise ValueError(
                f"'{field_name}' must not exceed {max_len} characters")
        return value

    @staticmethod
    def _validate_email(email):
        """Validate the email format expected by the API."""
        if not email or not str(email).strip():
            raise ValueError("'email' is required and cannot be empty")
        if not email_validation.match(email):
            raise ValueError("Invalid email format")
        return email

    def hash_password(self, password):
        """Hashes the password before storing it."""
        if not password or not str(password).strip():
            raise ValueError("'password' is required and cannot be empty")
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        """Verifies if the provided password matches the hashed password."""
        return bcrypt.check_password_hash(self.password, password)
