from app.persistence.repository import SQLAlchemyRepository, UserRepository


class HBnBFacade:
    """Single entry point used by the API layer to access business actions."""
    def __init__(self):
        """Prepare lazy repository slots for every main resource."""
        self._user_repo_instance = None
        self._amenity_repo_instance = None
        self._place_repo_instance = None
        self._review_repo_instance = None

    def _get_sqlalchemy_repo(self, current_repo, model_module, model_name):
        """Create a repository lazily the first time it is needed."""
        if current_repo is not None:
            return current_repo

        module = __import__(model_module, fromlist=[model_name])
        model = getattr(module, model_name)
        return SQLAlchemyRepository(model)

    # ------------------------------------------------------------------ #
    #  Lazy repo properties
    # ------------------------------------------------------------------ #

    @property
    def user_repo(self):
        """Return the lazily initialized user repository."""
        if self._user_repo_instance is None:
            self._user_repo_instance = UserRepository()
        return self._user_repo_instance

    @user_repo.setter
    def user_repo(self, value):
        """Allow tests or setup code to replace the user repository."""
        self._user_repo_instance = value

    @property
    def amenity_repo(self):
        """Return the lazily initialized amenity repository."""
        self._amenity_repo_instance = self._get_sqlalchemy_repo(
            self._amenity_repo_instance,
            'app.models.amenity',
            'Amenity'
        )
        return self._amenity_repo_instance

    @amenity_repo.setter
    def amenity_repo(self, value):
        """Allow tests or setup code to replace the amenity repository."""
        self._amenity_repo_instance = value

    @property
    def place_repo(self):
        """Return the lazily initialized place repository."""
        self._place_repo_instance = self._get_sqlalchemy_repo(
            self._place_repo_instance,
            'app.models.place',
            'Place'
        )
        return self._place_repo_instance

    @place_repo.setter
    def place_repo(self, value):
        """Allow tests or setup code to replace the place repository."""
        self._place_repo_instance = value

    @property
    def review_repo(self):
        """Return the lazily initialized review repository."""
        self._review_repo_instance = self._get_sqlalchemy_repo(
            self._review_repo_instance,
            'app.models.review',
            'Review'
        )
        return self._review_repo_instance

    @review_repo.setter
    def review_repo(self, value):
        """Allow tests or setup code to replace the review repository."""
        self._review_repo_instance = value

    # ------------------------------------------------------------------ #
    #  Users
    # ------------------------------------------------------------------ #

    def create_user(self, user_data):
        """Create a user and let the model hash the password."""
        from app.models.user import User
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        """Return one user by id."""
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email):
        """Return one user by email address."""
        return self.user_repo.get_by_email(email)

    def get_all_users(self):
        """Return every user stored in the application."""
        return self.user_repo.get_all()

    def update_user(self, user_id, user_data):
        """Update user fields while preserving email uniqueness."""
        user = self.user_repo.get(user_id)
        if not user:
            return None

        if "email" in user_data and user_data['email'] != user.email:
            if self.get_user_by_email(user_data['email']):
                raise ValueError("Email already registered")

        if "password" in user_data:
            user.hash_password(user_data.pop("password"))
            from app import db
            db.session.commit()

        if user_data:
            self.user_repo.update(user_id, user_data)

        return self.user_repo.get(user_id)

    # ------------------------------------------------------------------ #
    #  Amenities
    # ------------------------------------------------------------------ #

    def create_amenity(self, amenity_data):
        """Create a new amenity after API-level validation."""
        from app.models.amenity import Amenity
        amenity = Amenity(**amenity_data)
        self.amenity_repo.add(amenity)
        return amenity

    def get_amenity(self, amenity_id):
        """Return one amenity by id."""
        return self.amenity_repo.get(amenity_id)

    def get_amenity_by_name(self, name):
        """Return one amenity by its unique name."""
        return self.amenity_repo.get_by_attribute('name', name)

    def get_all_amenities(self):
        """Return every amenity stored in the application."""
        return self.amenity_repo.get_all()

    def update_amenity(self, amenity_id, amenity_data):
        """Update an amenity while keeping its name unique."""
        amenity = self.amenity_repo.get(amenity_id)
        if not amenity:
            return None

        if 'name' in amenity_data:
            existing = self.get_amenity_by_name(amenity_data['name'])
            if existing and existing.id != amenity_id:
                raise ValueError("Amenity already registered")

        self.amenity_repo.update(amenity_id, amenity_data)
        return self.amenity_repo.get(amenity_id)

    # ------------------------------------------------------------------ #
    #  Places
    # ------------------------------------------------------------------ #

    def create_place(self, place_data):
        """Create a place and attach any existing amenities."""
        owner = self.user_repo.get(place_data['owner_id'])
        if not owner:
            raise ValueError("Owner not found")

        if not place_data.get('title'):
            raise ValueError("Title is required")

        amenity_ids = place_data.pop('amenities', [])

        from app.models.place import Place
        new_place = Place(
            title=place_data['title'],
            description=place_data.get('description', ""),
            price=place_data['price'],
            latitude=place_data['latitude'],
            longitude=place_data['longitude'],
            owner=owner
        )

        for amenity_id in amenity_ids:
            amenity = self.amenity_repo.get(amenity_id)
            if amenity:
                new_place.add_amenity(amenity)

        self.place_repo.add(new_place)
        return new_place

    def get_place(self, place_id):
        """Return one place by id."""
        return self.place_repo.get(place_id)

    def get_all_places(self):
        """Return every place stored in the application."""
        return self.place_repo.get_all()

    def update_place(self, place_id, place_data):
        """Update only the mutable fields exposed by the API."""
        place = self.place_repo.get(place_id)
        if not place:
            return None

        allowed_fields = {'title', 'description', 'price', 'latitude', 'longitude'}
        filtered_data = {key: value for key, value in place_data.items() if key in allowed_fields}

        place.update(filtered_data)
        return self.place_repo.get(place_id)

    def delete_place(self, place_id):
        """Delete one place by id."""
        return self.place_repo.delete(place_id)

    # ------------------------------------------------------------------ #
    #  Reviews
    # ------------------------------------------------------------------ #

    def create_review(self, review_data):
        """Create a review linked to an existing user and place."""
        user = self.get_user(review_data['user_id'])
        place = self.get_place(review_data['place_id'])

        if not user:
            raise ValueError("User not found")
        if not place:
            raise ValueError("Place not found")

        from app.models.review import Review
        new_review = Review(
            text=review_data['text'],
            rating=review_data['rating'],
            place=place,
            user=user
        )
        self.review_repo.add(new_review)
        return new_review

    def get_review(self, review_id):
        """Return one review by id."""
        return self.review_repo.get(review_id)

    def get_all_reviews(self):
        """Return every review stored in the application."""
        return self.review_repo.get_all()

    def get_reviews_by_place(self, place_id):
        """Load all reviews for one place with a direct SQL query."""
        from app.models.review import Review
        return Review.query.filter_by(place_id=place_id).all()

    def get_review_by_user_and_place(self, user_id, place_id):
        """Check whether a user already reviewed a specific place."""
        from app.models.review import Review
        return Review.query.filter_by(
            user_id=user_id,
            place_id=place_id
        ).first()

    def update_review(self, review_id, review_data):
        """Update only the review fields allowed by the API."""
        review = self.review_repo.get(review_id)
        if not review:
            return None

        allowed_fields = {'text', 'rating'}
        filtered_data = {key: value for key, value in review_data.items() if key in allowed_fields}

        review.update(filtered_data)
        return self.review_repo.get(review_id)

    def delete_review(self, review_id):
        """Delete one review by id."""
        return self.review_repo.delete(review_id)
