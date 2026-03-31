from app.models.base_model import BaseModel
from app import db


class PlaceImage(BaseModel):
    __tablename__ = 'place_images'

    url = db.Column(db.String(255), nullable=False)
    place_id = db.Column(db.String(36), db.ForeignKey('places.id'), nullable=False)

    place = db.relationship(
        'Place',
        back_populates='images',
        lazy='select'
    )

    def __init__(self, url, place):
        super().__init__()
        self.url = url
        self.place = place
