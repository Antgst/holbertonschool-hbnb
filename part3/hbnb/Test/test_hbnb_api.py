"""
HBnB API - Test Suite Complet
Tests unitaires pour les endpoints: Users, Amenities, Places, Reviews
Utilisation: python -m pytest Test/test_hbnb_api.py -v
          ou: python -m unittest Test/test_hbnb_api -v
"""

import unittest
import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'  ))

from app import create_app, db


class BaseTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app("config.TestingConfig")
        self.client = self.app.test_client()
        with self.app.app_context():
            db.drop_all()
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def post_json(self, url, data, headers=None):
        return self.client.post(url, data=json.dumps(data),
                                content_type='application/json',
                                headers=headers or {})

    def put_json(self, url, data, headers=None):
        return self.client.put(url, data=json.dumps(data),
                               content_type='application/json',
                               headers=headers or {})

    def get_token(self, email, password):
        resp = self.post_json('/api/v1/auth/login',
                              {"email": email, "password": password})
        return resp.get_json().get('access_token')

    def auth_header(self, token):
        return {"Authorization": f"Bearer {token}"}

    def create_admin_and_token(self, email="admin@test.com", password="adminpass"):
        from app.models.user import User
        with self.app.app_context():
            admin = User(first_name="Admin", last_name="Root",
                         email=email, password=password, is_admin=True)
            db.session.add(admin)
            db.session.commit()
            admin_id = admin.id
        token = self.get_token(email, password)
        return admin_id, token

    def create_regular_user_and_token(self, email="user@test.com", password="userpass",
                                       first_name="John", last_name="Doe"):
        from app.models.user import User
        with self.app.app_context():
            user = User(first_name=first_name, last_name=last_name,
                        email=email, password=password, is_admin=False)
            db.session.add(user)
            db.session.commit()
            user_id = user.id
        token = self.get_token(email, password)
        return user_id, token

    def create_user(self, first_name="John", last_name="Doe",
                    email="john.doe@example.com", password="secret",
                    admin_token=None):
        if admin_token is None:
            _, admin_token = self.create_admin_and_token()
        return self.post_json('/api/v1/users/',
                              {"first_name": first_name, "last_name": last_name,
                               "email": email, "password": password},
                              headers=self.auth_header(admin_token))

    def create_amenity(self, name="WiFi", headers=None):
        return self.post_json('/api/v1/amenities/', {"name": name}, headers=headers)

    def create_place(self, owner_id, amenity_ids=None, headers=None, **kwargs):
        data = {"title": kwargs.get("title", "Nice Place"),
                "description": kwargs.get("description", "A great spot"),
                "price": kwargs.get("price", 99.9),
                "latitude": kwargs.get("latitude", 48.8566),
                "longitude": kwargs.get("longitude", 2.3522),
                "owner_id": owner_id, "amenities": amenity_ids or []}
        return self.post_json('/api/v1/places/', data, headers=headers)

    def create_review(self, user_id, place_id, text="Great!", rating=5, headers=None):
        return self.post_json('/api/v1/reviews/',
                              {"text": text, "rating": rating,
                               "user_id": user_id, "place_id": place_id},
                              headers=headers)


# ====================================================================== #
#                           USERS TESTS                                   #
# ====================================================================== #

class TestUserCreation(BaseTestCase):
    def test_create_user_success(self):
        _, admin_token = self.create_admin_and_token()
        resp = self.create_user(admin_token=admin_token)
        self.assertEqual(resp.status_code, 201)
        data = resp.get_json()
        self.assertIn('id', data)
        self.assertEqual(data['first_name'], 'John')

    def test_create_user_no_token_returns_401(self):
        resp = self.post_json('/api/v1/users/',
                              {"first_name": "J", "last_name": "D",
                               "email": "j@t.com", "password": "p"})
        self.assertEqual(resp.status_code, 401)

    def test_create_user_non_admin_returns_403(self):
        _, user_token = self.create_regular_user_and_token()
        resp = self.post_json('/api/v1/users/',
                              {"first_name": "J", "last_name": "D",
                               "email": "j2@t.com", "password": "p"},
                              headers=self.auth_header(user_token))
        self.assertEqual(resp.status_code, 403)

    def test_create_user_duplicate_email(self):
        _, admin_token = self.create_admin_and_token()
        self.create_user(admin_token=admin_token)
        resp = self.create_user(admin_token=admin_token)
        self.assertEqual(resp.status_code, 400)

    def test_create_user_missing_first_name(self):
        _, admin_token = self.create_admin_and_token()
        resp = self.post_json('/api/v1/users/',
                              {"last_name": "D", "email": "x@t.com", "password": "p"},
                              headers=self.auth_header(admin_token))
        self.assertEqual(resp.status_code, 400)

    def test_create_user_missing_email(self):
        _, admin_token = self.create_admin_and_token()
        resp = self.post_json('/api/v1/users/',
                              {"first_name": "J", "last_name": "D", "password": "p"},
                              headers=self.auth_header(admin_token))
        self.assertEqual(resp.status_code, 400)


class TestUserRetrieval(BaseTestCase):
    def test_get_all_users_empty(self):
        resp = self.client.get('/api/v1/users/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json(), [])

    def test_get_user_by_id_success(self):
        user_id = self.create_user().get_json()['id']
        resp = self.client.get(f'/api/v1/users/{user_id}')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()['id'], user_id)

    def test_get_user_by_invalid_id(self):
        resp = self.client.get('/api/v1/users/nonexistent-id')
        self.assertEqual(resp.status_code, 404)


class TestUserUpdate(BaseTestCase):
    def test_update_user_own_name(self):
        user_id, token = self.create_regular_user_and_token()
        resp = self.put_json(f'/api/v1/users/{user_id}',
                             {"first_name": "Updated", "last_name": "Name"},
                             headers=self.auth_header(token))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()['first_name'], 'Updated')

    def test_update_user_email_as_regular_returns_400(self):
        user_id, token = self.create_regular_user_and_token()
        resp = self.put_json(f'/api/v1/users/{user_id}',
                             {"email": "hacked@example.com"},
                             headers=self.auth_header(token))
        self.assertEqual(resp.status_code, 400)

    def test_update_other_user_returns_403(self):
        _, token = self.create_regular_user_and_token(email="u1@t.com")
        other_id, _ = self.create_regular_user_and_token(email="u2@t.com")
        resp = self.put_json(f'/api/v1/users/{other_id}',
                             {"first_name": "Hacked"},
                             headers=self.auth_header(token))
        self.assertEqual(resp.status_code, 403)

    def test_update_no_token_returns_401(self):
        user_id, _ = self.create_regular_user_and_token()
        resp = self.put_json(f'/api/v1/users/{user_id}', {"first_name": "X"})
        self.assertEqual(resp.status_code, 401)

    def test_admin_can_update_email(self):
        _, admin_token = self.create_admin_and_token()
        user_id, _ = self.create_regular_user_and_token(email="target@t.com")
        resp = self.put_json(f'/api/v1/users/{user_id}',
                             {"email": "new@t.com"},
                             headers=self.auth_header(admin_token))
        self.assertEqual(resp.status_code, 200)


# ====================================================================== #
#                         AMENITIES TESTS                                  #
# ====================================================================== #

class TestAmenityCreation(BaseTestCase):
    def test_create_amenity_success(self):
        _, admin_token = self.create_admin_and_token()
        resp = self.create_amenity("WiFi", headers=self.auth_header(admin_token))
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.get_json()['name'], 'WiFi')

    def test_create_amenity_no_token_returns_401(self):
        resp = self.post_json('/api/v1/amenities/', {"name": "Pool"})
        self.assertEqual(resp.status_code, 401)

    def test_create_amenity_non_admin_returns_403(self):
        _, user_token = self.create_regular_user_and_token()
        resp = self.create_amenity("Pool", headers=self.auth_header(user_token))
        self.assertEqual(resp.status_code, 403)

    def test_create_amenity_duplicate(self):
        _, admin_token = self.create_admin_and_token()
        h = self.auth_header(admin_token)
        self.create_amenity("Pool", headers=h)
        resp = self.create_amenity("Pool", headers=h)
        self.assertEqual(resp.status_code, 400)


class TestAmenityRetrieval(BaseTestCase):
    def test_get_all_amenities_empty(self):
        resp = self.client.get('/api/v1/amenities/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json(), [])

    def test_get_amenity_by_id_success(self):
        _, admin_token = self.create_admin_and_token()
        amenity_id = self.create_amenity(
            "Parking", headers=self.auth_header(admin_token)
        ).get_json()['id']
        resp = self.client.get(f'/api/v1/amenities/{amenity_id}')
        self.assertEqual(resp.status_code, 200)

    def test_get_amenity_by_invalid_id(self):
        resp = self.client.get('/api/v1/amenities/nonexistent-id')
        self.assertEqual(resp.status_code, 404)


class TestAmenityUpdate(BaseTestCase):
    def test_update_amenity_success(self):
        _, admin_token = self.create_admin_and_token()
        h = self.auth_header(admin_token)
        amenity_id = self.create_amenity("Old", headers=h).get_json()['id']
        resp = self.put_json(f'/api/v1/amenities/{amenity_id}',
                             {"name": "New"}, headers=h)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()['name'], 'New')

    def test_update_amenity_non_admin_returns_403(self):
        _, admin_token = self.create_admin_and_token()
        _, user_token = self.create_regular_user_and_token()
        amenity_id = self.create_amenity(
            "WiFi", headers=self.auth_header(admin_token)
        ).get_json()['id']
        resp = self.put_json(f'/api/v1/amenities/{amenity_id}',
                             {"name": "Hacked"},
                             headers=self.auth_header(user_token))
        self.assertEqual(resp.status_code, 403)

    def test_update_amenity_duplicate_name_returns_400(self):
        _, admin_token = self.create_admin_and_token()
        h = self.auth_header(admin_token)
        self.create_amenity("WiFi", headers=h)
        a2_id = self.create_amenity("Pool", headers=h).get_json()['id']
        resp = self.put_json(f'/api/v1/amenities/{a2_id}',
                             {"name": "WiFi"}, headers=h)
        self.assertEqual(resp.status_code, 400)


# ====================================================================== #
#                           PLACES TESTS                                   #
# ====================================================================== #

class TestPlaceCreation(BaseTestCase):
    def test_create_place_success(self):
        owner_id, owner_token = self.create_regular_user_and_token()
        resp = self.create_place(owner_id, headers=self.auth_header(owner_token))
        self.assertEqual(resp.status_code, 201)
        data = resp.get_json()
        self.assertEqual(data['owner']['id'], owner_id)

    def test_create_place_no_token_returns_401(self):
        owner_id, _ = self.create_regular_user_and_token()
        resp = self.create_place(owner_id)
        self.assertEqual(resp.status_code, 401)

    def test_create_place_wrong_owner_returns_403(self):
        owner_id, _ = self.create_regular_user_and_token(email="o@t.com")
        _, other_token = self.create_regular_user_and_token(email="x@t.com")
        resp = self.create_place(owner_id, headers=self.auth_header(other_token))
        self.assertEqual(resp.status_code, 403)

    def test_create_place_negative_price(self):
        owner_id, owner_token = self.create_regular_user_and_token()
        resp = self.create_place(owner_id, price=-10.0,
                                  headers=self.auth_header(owner_token))
        self.assertEqual(resp.status_code, 400)

    def test_create_place_invalid_latitude(self):
        owner_id, owner_token = self.create_regular_user_and_token()
        resp = self.create_place(owner_id, latitude=91.0,
                                  headers=self.auth_header(owner_token))
        self.assertEqual(resp.status_code, 400)

    def test_create_place_boundary_latitude(self):
        owner_id, owner_token = self.create_regular_user_and_token()
        resp = self.create_place(owner_id, latitude=90.0,
                                  headers=self.auth_header(owner_token))
        self.assertEqual(resp.status_code, 201)


class TestPlaceRetrieval(BaseTestCase):
    def test_get_all_places_empty(self):
        resp = self.client.get('/api/v1/places/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json(), [])

    def test_get_place_by_id_success(self):
        owner_id, owner_token = self.create_regular_user_and_token()
        place_id = self.create_place(
            owner_id, headers=self.auth_header(owner_token)
        ).get_json()['id']
        resp = self.client.get(f'/api/v1/places/{place_id}')
        self.assertEqual(resp.status_code, 200)

    def test_get_place_by_invalid_id(self):
        resp = self.client.get('/api/v1/places/nonexistent-id')
        self.assertEqual(resp.status_code, 404)


class TestPlaceUpdate(BaseTestCase):
    def test_update_place_success(self):
        owner_id, owner_token = self.create_regular_user_and_token()
        h = self.auth_header(owner_token)
        place_id = self.create_place(owner_id, headers=h).get_json()['id']
        resp = self.put_json(f'/api/v1/places/{place_id}',
                             {"title": "Updated", "price": 150.0,
                              "latitude": 45.0, "longitude": 10.0},
                             headers=h)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()['title'], 'Updated')

    def test_update_place_not_owner_returns_403(self):
        owner_id, owner_token = self.create_regular_user_and_token(email="o@t.com")
        _, other_token = self.create_regular_user_and_token(email="x@t.com")
        place_id = self.create_place(
            owner_id, headers=self.auth_header(owner_token)
        ).get_json()['id']
        resp = self.put_json(f'/api/v1/places/{place_id}',
                             {"title": "Stolen"},
                             headers=self.auth_header(other_token))
        self.assertEqual(resp.status_code, 403)

    def test_admin_can_update_any_place(self):
        owner_id, owner_token = self.create_regular_user_and_token()
        _, admin_token = self.create_admin_and_token()
        place_id = self.create_place(
            owner_id, headers=self.auth_header(owner_token)
        ).get_json()['id']
        resp = self.put_json(f'/api/v1/places/{place_id}',
                             {"title": "Admin Override", "price": 200.0,
                              "latitude": 0.0, "longitude": 0.0},
                             headers=self.auth_header(admin_token))
        self.assertEqual(resp.status_code, 200)


# ====================================================================== #
#                           REVIEWS TESTS                                  #
# ====================================================================== #

class TestReviewCreation(BaseTestCase):
    def _setup(self):
        owner_id, owner_token = self.create_regular_user_and_token(email="o@t.com")
        reviewer_id, reviewer_token = self.create_regular_user_and_token(
            email="r@t.com")
        place_id = self.create_place(
            owner_id, headers=self.auth_header(owner_token)
        ).get_json()['id']
        return reviewer_id, reviewer_token, place_id

    def test_create_review_success(self):
        reviewer_id, reviewer_token, place_id = self._setup()
        resp = self.create_review(reviewer_id, place_id,
                                   headers=self.auth_header(reviewer_token))
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.get_json()['user_id'], reviewer_id)

    def test_create_review_no_token_returns_401(self):
        reviewer_id, _, place_id = self._setup()
        resp = self.create_review(reviewer_id, place_id)
        self.assertEqual(resp.status_code, 401)

    def test_create_review_own_place_returns_400(self):
        owner_id, owner_token = self.create_regular_user_and_token()
        place_id = self.create_place(
            owner_id, headers=self.auth_header(owner_token)
        ).get_json()['id']
        resp = self.create_review(owner_id, place_id,
                                   headers=self.auth_header(owner_token))
        self.assertEqual(resp.status_code, 400)

    def test_create_review_duplicate_returns_400(self):
        reviewer_id, reviewer_token, place_id = self._setup()
        h = self.auth_header(reviewer_token)
        self.create_review(reviewer_id, place_id, headers=h)
        resp = self.create_review(reviewer_id, place_id, text="Again", headers=h)
        self.assertEqual(resp.status_code, 400)

    def test_create_review_invalid_rating(self):
        reviewer_id, reviewer_token, place_id = self._setup()
        resp = self.create_review(reviewer_id, place_id, rating=6,
                                   headers=self.auth_header(reviewer_token))
        self.assertEqual(resp.status_code, 400)

    def test_create_review_rating_min(self):
        reviewer_id, reviewer_token, place_id = self._setup()
        resp = self.create_review(reviewer_id, place_id, rating=1,
                                   headers=self.auth_header(reviewer_token))
        self.assertEqual(resp.status_code, 201)


class TestReviewRetrieval(BaseTestCase):
    def test_get_all_reviews_empty(self):
        resp = self.client.get('/api/v1/reviews/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json(), [])

    def test_get_reviews_by_place(self):
        owner_id, owner_token = self.create_regular_user_and_token(email="o@t.com")
        r1_id, r1_token = self.create_regular_user_and_token(email="r1@t.com")
        r2_id, r2_token = self.create_regular_user_and_token(email="r2@t.com")
        place_id = self.create_place(
            owner_id, headers=self.auth_header(owner_token)
        ).get_json()['id']
        self.create_review(r1_id, place_id, headers=self.auth_header(r1_token))
        self.create_review(r2_id, place_id, headers=self.auth_header(r2_token))
        resp = self.client.get(f'/api/v1/places/{place_id}/reviews')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.get_json()), 2)


class TestReviewUpdate(BaseTestCase):
    def _create_review_setup(self):
        owner_id, owner_token = self.create_regular_user_and_token(email="o@t.com")
        reviewer_id, reviewer_token = self.create_regular_user_and_token(
            email="r@t.com")
        place_id = self.create_place(
            owner_id, headers=self.auth_header(owner_token)
        ).get_json()['id']
        review_id = self.create_review(
            reviewer_id, place_id, headers=self.auth_header(reviewer_token)
        ).get_json()['id']
        return reviewer_id, reviewer_token, review_id

    def test_update_review_success(self):
        _, reviewer_token, review_id = self._create_review_setup()
        resp = self.put_json(f'/api/v1/reviews/{review_id}',
                             {"text": "Updated", "rating": 3},
                             headers=self.auth_header(reviewer_token))
        self.assertEqual(resp.status_code, 200)

    def test_update_review_not_author_returns_403(self):
        _, _, review_id = self._create_review_setup()
        _, other_token = self.create_regular_user_and_token(email="x@t.com")
        resp = self.put_json(f'/api/v1/reviews/{review_id}',
                             {"text": "Hacked"},
                             headers=self.auth_header(other_token))
        self.assertEqual(resp.status_code, 403)

    def test_update_review_cannot_change_place_id(self):
        _, reviewer_token, review_id = self._create_review_setup()
        resp = self.put_json(f'/api/v1/reviews/{review_id}',
                             {"place_id": "other"},
                             headers=self.auth_header(reviewer_token))
        self.assertEqual(resp.status_code, 400)


class TestReviewDeletion(BaseTestCase):
    def test_delete_review_success(self):
        owner_id, owner_token = self.create_regular_user_and_token(email="o@t.com")
        reviewer_id, reviewer_token = self.create_regular_user_and_token(
            email="r@t.com")
        place_id = self.create_place(
            owner_id, headers=self.auth_header(owner_token)
        ).get_json()['id']
        review_id = self.create_review(
            reviewer_id, place_id, headers=self.auth_header(reviewer_token)
        ).get_json()['id']
        resp = self.client.delete(f'/api/v1/reviews/{review_id}',
                                   headers=self.auth_header(reviewer_token))
        self.assertEqual(resp.status_code, 200)

    def test_review_gone_after_deletion(self):
        owner_id, owner_token = self.create_regular_user_and_token(email="o@t.com")
        reviewer_id, reviewer_token = self.create_regular_user_and_token(
            email="r@t.com")
        place_id = self.create_place(
            owner_id, headers=self.auth_header(owner_token)
        ).get_json()['id']
        review_id = self.create_review(
            reviewer_id, place_id, headers=self.auth_header(reviewer_token)
        ).get_json()['id']
        self.client.delete(f'/api/v1/reviews/{review_id}',
                            headers=self.auth_header(reviewer_token))
        resp = self.client.get(f'/api/v1/reviews/{review_id}')
        self.assertEqual(resp.status_code, 404)


# ====================================================================== #
#                         INTEGRATION TESTS                                #
# ====================================================================== #

class TestIntegration(BaseTestCase):
    def test_full_workflow(self):
        admin_id, admin_token = self.create_admin_and_token()
        ah = self.auth_header(admin_token)

        owner = self.post_json('/api/v1/users/',
                               {"first_name": "Owner", "last_name": "Full",
                                "email": "owner@ex.com", "password": "pass"},
                               headers=ah).get_json()
        self.assertIn('id', owner)

        amenity = self.create_amenity("Gym", headers=ah).get_json()
        owner_token = self.get_token("owner@ex.com", "pass")

        place = self.create_place(owner['id'], amenity_ids=[amenity['id']],
                                   headers=self.auth_header(owner_token)).get_json()
        self.assertEqual(len(place['amenities']), 1)

        reviewer_id, reviewer_token = self.create_regular_user_and_token(
            email="rev@ex.com")
        review = self.create_review(reviewer_id, place['id'],
                                     headers=self.auth_header(reviewer_token)).get_json()
        self.assertIn('id', review)

        resp = self.client.get(f"/api/v1/places/{place['id']}/reviews")
        self.assertEqual(len(resp.get_json()), 1)

        del_resp = self.client.delete(
            f"/api/v1/reviews/{review['id']}",
            headers=self.auth_header(reviewer_token))
        self.assertEqual(del_resp.status_code, 200)

    def test_place_response_structure(self):
        owner_id, owner_token = self.create_regular_user_and_token()
        place = self.create_place(
            owner_id, headers=self.auth_header(owner_token)
        ).get_json()
        for key in ('id', 'title', 'price', 'latitude', 'longitude', 'owner', 'amenities'):
            self.assertIn(key, place)

    def test_user_list_grows_with_creations(self):
        _, admin_token = self.create_admin_and_token()
        ah = self.auth_header(admin_token)
        for i in range(3):
            self.post_json('/api/v1/users/',
                           {"first_name": f"U{i}", "last_name": "T",
                            "email": f"u{i}@ex.com", "password": "p"},
                           headers=ah)
        resp = self.client.get('/api/v1/users/')
        self.assertEqual(len(resp.get_json()), 4)  # 3 + admin


if __name__ == '__main__':
    unittest.main(verbosity=2)
