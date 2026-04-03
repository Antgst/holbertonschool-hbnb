from abc import ABC, abstractmethod
from app import db


class Repository(ABC):
    """Repository contract used by every persistence backend."""
    @abstractmethod
    def add(self, obj):
        """Store one object in the underlying persistence backend."""
        pass

    @abstractmethod
    def get(self, obj_id):
        """Return one object by id or None when it does not exist."""
        pass

    @abstractmethod
    def get_all(self):
        """Return every object managed by the repository."""
        pass

    @abstractmethod
    def update(self, obj_id, data):
        """Apply a partial update to one stored object."""
        pass

    @abstractmethod
    def delete(self, obj_id):
        """Remove one object by id when it exists."""
        pass

    @abstractmethod
    def get_by_attribute(self, attr_name, attr_value):
        """Return the first object matching one attribute value."""
        pass


class InMemoryRepository(Repository):
    """Simple in-memory repository mainly useful for tests."""
    def __init__(self):
        """Initialize the in-memory storage dictionary."""
        self._storage = {}

    def add(self, obj):
        """Store one object by its id."""
        self._storage[obj.id] = obj

    def get(self, obj_id):
        """Return one stored object by id."""
        return self._storage.get(obj_id)

    def get_all(self):
        """Return all currently stored objects."""
        return list(self._storage.values())

    def update(self, obj_id, data):
        """Mutate one stored object with the provided key-value pairs."""
        obj = self.get(obj_id)
        if obj:
            for key, value in data.items():
                setattr(obj, key, value)
            return obj
        return None

    def delete(self, obj_id):
        """Delete one object from memory when it exists."""
        if obj_id in self._storage:
            del self._storage[obj_id]

    def get_by_attribute(self, attr_name, attr_value):
        """Search the in-memory storage for the first matching object."""
        return next(
            (obj for obj in self._storage.values()
             if getattr(obj, attr_name) == attr_value),
            None
        )


class SQLAlchemyRepository(Repository):
    """Generic SQLAlchemy repository for CRUD operations."""
    def __init__(self, model):
        """Bind the repository to one SQLAlchemy model class."""
        self.model = model

    def add(self, obj):
        """Persist one SQLAlchemy model instance."""
        db.session.add(obj)
        db.session.commit()

    def get(self, obj_id):
        """Load one row by primary key."""
        return self.model.query.get(obj_id)

    def get_all(self):
        """Load every row for the bound model."""
        return self.model.query.all()

    def update(self, obj_id, data):
        """Update one row and commit the resulting changes."""
        obj = self.get(obj_id)
        if not obj:
            return None

        if hasattr(obj, 'update'):
            obj.update(data)
        else:
            for key, value in data.items():
                setattr(obj, key, value)
            db.session.commit()

        return obj

    def delete(self, obj_id):
        """Delete one row and commit the transaction."""
        obj = self.get(obj_id)
        if obj:
            db.session.delete(obj)
            db.session.commit()

    def get_by_attribute(self, attr_name, attr_value):
        """Return the first row matching the requested attribute."""
        return self.model.query.filter_by(**{attr_name: attr_value}).first()


class UserRepository(SQLAlchemyRepository):
    """User-specific repository with email lookups."""
    def __init__(self):
        """Bind the repository to the user model."""
        # Deferred import prevents circular imports during module loading.
        from app.models.user import User
        super().__init__(User)

    def get_by_email(self, email):
        """Return the first user with the requested email address."""
        from app.models.user import User
        return User.query.filter_by(email=email).first()

    def get_by_attribute(self, attr_name, attr_value):
        """Reuse the optimized email lookup when possible."""
        if attr_name == 'email':
            return self.get_by_email(attr_value)
        return super().get_by_attribute(attr_name, attr_value)
