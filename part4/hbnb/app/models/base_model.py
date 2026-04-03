import uuid
from datetime import datetime
from app import db


class BaseModel(db.Model):
    """Shared SQLAlchemy fields and helpers for every model."""

    # This ensures SQLAlchemy does not create a table for BaseModel
    __abstract__ = True

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.now
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.now,
        onupdate=datetime.now
    )

    def __init__(self):
        """Initialize the model with a UUID and timestamps."""
        self.id = str(uuid.uuid4())
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def save(self):
        """Persist the current object after refreshing its timestamp."""
        self.updated_at = datetime.now()
        db.session.commit()

    def update(self, data):
        """Apply a partial update from a plain dictionary."""
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()
