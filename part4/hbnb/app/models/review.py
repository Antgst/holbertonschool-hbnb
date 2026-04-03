from app.models.base_model import BaseModel
from app import db


class Review(BaseModel):
    """Review entity linking one user to one place feedback entry."""
    __tablename__ = 'reviews'
    __table_args__ = (
        db.CheckConstraint('rating BETWEEN 1 AND 5', name='check_review_rating'),
        db.UniqueConstraint('user_id', 'place_id', name='uq_review_user_place'),
        )

    text = db.Column(db.String(1024), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    place_id = db.Column(db.String(36), db.ForeignKey('places.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)

    # Relationships
    place = db.relationship('Place', back_populates='reviews')
    user = db.relationship('User', back_populates='reviews')

    def __init__(self, text, rating, place, user):
        """Validate the review content before saving relationships."""
        super().__init__()
        if not text or not str(text).strip():
            raise ValueError("'text' is required and cannot be empty")
        self.validate_rating(rating)
        self.text = text
        self.rating = rating
        self.place = place
        self.user = user

    @staticmethod
    def validate_rating(rating):
        """Keep ratings inside the accepted 1 to 5 range."""
        if not isinstance(rating, int) or not (1 <= rating <= 5):
            raise ValueError("Rating must be an integer between 1 and 5")

    def update(self, data):
        """Revalidate editable fields before applying a partial update."""
        if 'text' in data:
            if not data['text'] or not str(data['text']).strip():
                raise ValueError("'text' is required and cannot be empty")
        if 'rating' in data:
            self.validate_rating(data['rating'])
        super().update(data)
