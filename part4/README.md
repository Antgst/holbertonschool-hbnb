# 🏡 HBnB — Part 4 : Front-End Web Client, Premium UI & End-to-End API Integration

## 📚 Table of Contents

- [📌 Overview](#-overview)
- [✨ Main Features](#-main-features)
- [🗂️ Project Structure](#️-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [🚀 Running the Application](#-running-the-application)
- [🔐 Authentication](#-authentication)
- [👤 Demo Accounts](#-demo-accounts)
- [🖥️ Front-End Pages](#️-front-end-pages)
- [🌐 API Endpoints](#-api-endpoints)
  - [Auth](#auth)
  - [Users](#users)
  - [Amenities](#amenities)
  - [Places](#places)
  - [Reviews](#reviews)
- [🎨 UI / UX Highlights](#-ui--ux-highlights)
- [🗃️ Demo Data](#️-demo-data)
- [🧪 Running the Tests](#-running-the-tests)
- [📮 Postman Test Suite](#-postman-test-suite)
- [⚙️ Configuration](#️-configuration)
- [📎 Notes](#-notes)
- [👥 Authors](#-authors)

---

## 📌 Overview

Part 4 turns the HBnB project into a complete **full-stack demo application** by connecting a polished front-end interface to the authenticated REST API built in the previous parts.

This version includes:

- a premium multi-page front-end
- JWT-based login
- dynamic place listing
- detailed place pages with host, amenities, gallery, and reviews
- review submission for authenticated users
- a hosts directory
- seeded demo data with real images
- an exhaustive Postman non-regression suite

The application is designed to be run locally with:
- a Flask API on `http://127.0.0.1:5000`
- a static front-end on `http://127.0.0.1:5500`

---

## ✨ Main Features

- **JWT authentication** with login endpoint and protected actions
- **Public catalog of places**
- **Detailed place pages** with:
  - host card
  - amenities panel with icons
  - image gallery / lightbox
  - review summary
  - full review list
- **Authenticated review creation**
- **Hosts directory** built from seeded data
- **Premium UI styling** with premium burgundy / ivory / gold design system
- **Theme toggle**
- **Reveal animations and smoother visual transitions**
- **Seeded demo environment** with users, places, amenities, reviews, host photos, and place images
- **Postman collection** for end-to-end API validation

---

## 🗂️ Project Structure

```bash
part4/
├── AUTHORS
├── README.md
├── add_review.html
├── hosts.html
├── index.html
├── login.html
├── place.html
├── scripts.js
├── styles.css
├── hbnb.sh
├── docs/
│   └── readme.md
├── postman/
│   ├── HBnB_API_Exhaustive_Postman_Collection.json
│   ├── HBnB_API_Local_Environment.json
│   └── README.md
└── hbnb/
    ├── app/
    │   ├── __init__.py
    │   ├── api/
    │   │   └── v1/
    │   │       ├── auth.py
    │   │       ├── users.py
    │   │       ├── amenities.py
    │   │       ├── places.py
    │   │       └── reviews.py
    │   ├── models/
    │   │   ├── __init__.py
    │   │   ├── base_model.py
    │   │   ├── user.py
    │   │   ├── amenity.py
    │   │   ├── place.py
    │   │   ├── place_image.py
    │   │   └── review.py
    │   ├── persistence/
    │   │   ├── __init__.py
    │   │   └── repository.py
    │   └── services/
    │       ├── __init__.py
    │       └── facade.py
    ├── Scripts/
    │   ├── Schema.sql
    │   ├── Initial_data.sql
    │   └── Test_crud.sql
    ├── Test/
    │   └── test_hbnb_api.py
    ├── instance/
    │   └── development.db
    ├── images/
    │   ├── backgrounds/
    │   ├── hosts/
    │   └── places/
    ├── config.py
    ├── requirements.txt
    ├── run.py
    └── seed_demo.py
```

---

## 🛠️ Tech Stack

### Back-end
- Flask
- Flask-RESTX
- Flask-JWT-Extended
- Flask-Bcrypt
- Flask-SQLAlchemy
- Flask-CORS
- SQLite

### Front-end
- HTML5
- CSS3
- Vanilla JavaScript

### Testing
- unittest / pytest
- Postman

---

## 📦 Installation

### 1. Go to the back-end directory

```bash
cd part4/hbnb
```

### 2. Create and activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 🚀 Running the Application

The easiest way to run the full project is from the `part4/` directory.

### Reset demo data only

```bash
./hbnb.sh reset
```

### Start the API and front-end only

```bash
./hbnb.sh start
```

### Reset demo data and start everything

```bash
./hbnb.sh all
```

### Stop running servers

```bash
./hbnb.sh stop
```

### Local URLs

```text
Front-end: http://127.0.0.1:5500/index.html
API:       http://127.0.0.1:5000/api/v1/
Swagger:   http://127.0.0.1:5000/api/v1/
```

---

## 🔐 Authentication

The API uses **JWT tokens** for protected operations.

### Login request

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "antoine.gousset@hbnb.test",
  "password": "Test1234!"
}
```

### Login response

```json
{
  "access_token": "<JWT>"
}
```

Protected endpoints must receive:

```http
Authorization: Bearer <JWT>
```

On the front-end, login is handled through `login.html`, and the token is stored in a cookie for authenticated flows.

---

## 👤 Demo Accounts

The seeded environment provides a shared password for all demo users:

```text
Password: Test1234!
```

Example accounts:

| Role        | Email                         |
|-------------|-------------------------------|
| Admin       | `antoine.gousset@hbnb.test`   |
| Regular user| `Léa.gousset@hbnb.test`       |
| Regular user| `sebastien.vallier@hbnb.test` |
| Regular user| `patricia.lebrun@hbnb.test`   |
| Regular user| `benjy.guerin@hbnb.test`      |
| Regular user| `micael.pinho@hbnb.test`      |
| Regular user| `melissandre.moreau@hbnb.test`|
| Regular user| `brice.travers@hbnb.test`     |

---

## 🖥️ Front-End Pages

| File              | Purpose |
|-------------------|---------|
| `index.html`      | Main catalog of places |
| `place.html`      | Detailed view of a selected place |
| `login.html`      | Login form |
| `add_review.html` | Review submission page |
| `hosts.html`      | Hosts directory |
| `scripts.js`      | Front-end logic, API calls, UI rendering, auth, animations |
| `styles.css`      | Global visual system and responsive styling |

### Main front-end behaviors

- fetches places from the API
- displays ratings and review summaries
- builds place cards dynamically
- builds host cards dynamically
- renders place galleries and lightbox
- conditionally shows review actions depending on authentication
- applies theme switching
- handles form submission and error states
- manages reveal animations and richer visual feedback

---

## 🌐 API Endpoints

### Auth

| Method | Endpoint             | Auth   | Description |
|--------|----------------------|--------|-------------|
| POST   | `/api/v1/auth/login` | Public | Authenticate user and return a JWT |

### Users

| Method | Endpoint              | Auth          | Description |
|--------|-----------------------|---------------|-------------|
| GET    | `/api/v1/users/`      | Public        | List all users |
| POST   | `/api/v1/users/`      | Admin only    | Create a user |
| GET    | `/api/v1/users/<id>`  | Public        | Get user by ID |
| PUT    | `/api/v1/users/<id>`  | Self or admin | Update a user |

### Amenities

| Method | Endpoint                  | Auth       | Description |
|--------|---------------------------|------------|-------------|
| GET    | `/api/v1/amenities/`      | Public     | List all amenities |
| POST   | `/api/v1/amenities/`      | Admin only | Create an amenity |
| GET    | `/api/v1/amenities/<id>`  | Public     | Get amenity by ID |
| PUT    | `/api/v1/amenities/<id>`  | Admin only | Update an amenity |

### Places

| Method | Endpoint                      | Auth           | Description |
|--------|-------------------------------|----------------|-------------|
| GET    | `/api/v1/places/`             | Public         | List all places |
| POST   | `/api/v1/places/`             | JWT required   | Create a place |
| GET    | `/api/v1/places/<id>`         | Public         | Get place by ID |
| PUT    | `/api/v1/places/<id>`         | Owner or admin | Update a place |
| DELETE | `/api/v1/places/<id>`         | Owner or admin | Delete a place |
| GET    | `/api/v1/places/<id>/reviews` | Public         | Get reviews for one place |

### Reviews

| Method | Endpoint                 | Auth            | Description |
|--------|--------------------------|-----------------|-------------|
| GET    | `/api/v1/reviews/`       | Public          | List all reviews |
| POST   | `/api/v1/reviews/`       | JWT required    | Create a review |
| GET    | `/api/v1/reviews/<id>`   | Public          | Get review by ID |
| PUT    | `/api/v1/reviews/<id>`   | Author or admin | Update a review |
| DELETE | `/api/v1/reviews/<id>`   | Author or admin | Delete a review |

### Business rules enforced by the API

- only admins can create users
- only admins can create or update amenities
- a regular user can only update their own profile
- a place can only be updated or deleted by its owner or an admin
- a user cannot review their own place
- a user cannot review the same place twice
- a review author cannot be spoofed through `user_id` in the payload
- `user_id` and `place_id` are immutable in review updates

---

## 🎨 UI / UX Highlights

This Part 4 is not only functional. It also introduces a more polished and visually coherent user experience.

### Notable UI choices

- premium color palette
- dynamic hero background system
- host profile cards with photos
- place rating badge / review summary blocks
- amenities displayed with dedicated iconography
- gallery lightbox on place pages
- dark / light theme toggle
- animated content reveal
- clearer empty, loading, and form states

The goal is to move from a purely technical prototype to a much more convincing product demo.

---

## 🗃️ Demo Data

The seeded dataset includes:

- **8 users**
- **25 amenities**
- **8 places**
- **3 images per place**
- **host portraits**
- **multiple reviews with varied ratings**

This makes the application immediately usable after reset, without manual data entry.

---

## 🧪 Running the Tests

The project includes a back-end test suite.

From `part4/hbnb`:

```bash
python3 -m pytest Test/test_hbnb_api.py -v
```

Or:

```bash
python3 -m unittest Test/test_hbnb_api.py -v
```

The tests cover the main API behavior, validation rules, authorization logic, and business constraints.

---

## 📮 Postman Test Suite

A dedicated Postman folder is included:

```text
postman/
├── HBnB_API_Exhaustive_Postman_Collection.json
├── HBnB_API_Local_Environment.json
└── README.md
```

This suite is designed to validate:

- public endpoints
- protected endpoints
- authentication
- permissions
- edge cases
- cascade behavior
- invalid payload handling
- core business rules

### Recommended workflow

1. reset the demo data
2. start the application
3. import the Postman collection
4. select the local environment
5. run the full collection

Expected current result for a clean green run:

```text
142 passed
0 failed
0 errors
```

---

## ⚙️ Configuration

The Flask app uses:

| Config class        | DB URI                     | Usage |
|---------------------|----------------------------|-------|
| `DevelopmentConfig` | `sqlite:///development.db` | local run |
| `TestingConfig`     | `sqlite:///:memory:`       | tests |

Other important points:

- JWT secret and app secret can be overridden with environment variables
- CORS is enabled for local front-end origins on ports `5500` and `5501`

---

## 📎 Notes

- If you change the data model, reset the seeded database before testing again
- If the front-end appears broken after API changes, verify the JSON shape returned by the endpoints
- Always run a clean Postman test collection after a back-end change
- `hbnb.sh all` is the most reliable local workflow for this part

---

## 👥 Authors

- **Antoine Gousset** — [GitHub](https://github.com/Antgst)
- **Gwendal Boisard** — [GitHub](https://github.com/Gwendal-B)
- **Yonas Houriez** — [GitHub](https://github.com/Ausaryu)

See `AUTHORS`.
