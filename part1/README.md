# 🏗 HBnB Evolution – Technical Documentation (Part 1)

## 📌 Overview

This document provides the architectural and design blueprint for the **HBnB Evolution** application.  
It defines the system structure, core business entities, and interaction flow across layers.

The application follows a **layered architecture** and applies the **Facade design pattern** to ensure separation of concerns and maintainability.

---

# 1️⃣ High-Level Architecture

## 📦 High-Level Package Diagram

![High-Level Package Diagram](./High_level_package_diagram_HBNB.png)

[📄 View Full PDF Version](./High_level_package_diagram_HBNB.pdf)

---

## 🏗 Layer Responsibilities

### 🔹 Presentation Layer
- Exposes API endpoints, controllers, and services  
- Handles user interaction  
- Contains **no business logic**

### 🔹 Business Logic Layer
- Contains core business rules  
- Defines domain entities (`User`, `Place`, `Review`, `Amenity`)  
- Includes the `HBnBFacade` as the single entry point

### 🔹 Persistence Layer
- Contains repositories and ORM/storage mechanisms  
- Responsible for data access and storage  
- Contains **no business logic**

### 🔹 Database
- External system  
- Accessed exclusively through the persistence layer  

---

# 2️⃣ Business Logic Design

## 📊 Detailed Class Diagram

![Business Logic Class Diagram](./Class_diagram_for_business_Logic_Layer_HBNB.png)

[📄 View Full PDF Version](./Class_diagram_for_business_Logic_Layer_HBNB.pdf)

---

## 🔗 Relationships and Cardinalities

- A **User owns 0..*** Places; each Place has **1 owner**
- A **Place has 0..*** Reviews; each Review targets **1 Place**
- A **User writes 0..*** Reviews; each Review is written by **1 User**
- **Places and Amenities are many-to-many (0..* ↔ 0..*)**

---

# 3️⃣ Sequence Diagrams

---

## SD-01 — User Registration (POST `/users`)

### Purpose
Register a new user account by validating email uniqueness and persisting the user.

### Key Steps
- User sends `POST /users`
- API calls `HBnBFacade.register_user(data)`
- Facade checks email uniqueness via Repository (`SELECT user WHERE email=?`)
- If user exists → return `EMAIL_EXISTS`
- If not → create entity → save → return DTO

### Layer Responsibilities
- **Presentation**: handles HTTP request/response  
- **Business**: validates uniqueness, orchestrates flow, maps to DTO  
- **Persistence**: executes SELECT / INSERT  

### Outputs / Errors
- ✅ 201 Created + UserDTO  
- ❌ 409 Conflict (email already exists)

---

## SD-02 — Place Creation (POST `/places`)

### Purpose
Create a new place listing for an existing user.

### Key Steps
- User sends `POST /places`
- API calls `HBnBFacade.create_place(user_id, place_data)`
- Facade verifies owner exists (`SELECT user WHERE id=?`)
- If not found → return error
- If found → create entity → save → return DTO

### Layer Responsibilities
- **Presentation**: endpoint & response formatting  
- **Business**: owner validation + orchestration  
- **Persistence**: SELECT user + INSERT place  

### Outputs / Errors
- ✅ 201 Created + PlaceDTO  
- ❌ 404 Not Found (user not found)

---

## SD-03 — Review Submission (POST `/places/{id}/reviews`)

### Purpose
Submit a review for a specific place and user.

### Key Steps
- User sends `POST /places/{id}/reviews`
- API calls `HBnBFacade.create_review(user_id, place_id, review_data)`
- Facade validates place exists (`SELECT place WHERE id=?`)
- Facade validates user exists (`SELECT user WHERE id=?`)
- If any missing → return 404
- If valid → create review → save → return DTO

### Layer Responsibilities
- **Presentation**: receives request and returns response  
- **Business**: validates preconditions and orchestrates save  
- **Persistence**: SELECT place + SELECT user + INSERT review  

### Outputs / Errors
- ✅ 201 Created + ReviewDTO  
- ❌ 404 Not Found (place or user not found)

---

## SD-04 — Fetching a List of Places (GET `/places`)

### Purpose
Return a filtered list of places.

### Key Steps
- User sends `GET /places?filters`
- API calls `HBnBFacade.list_places(filters)`
- Facade requests Repository query (`SELECT places WHERE filters...`)
- Repository returns rows → mapped to `Place[]`
- Facade maps entities to `PlaceDTO[]`
- API returns result list

### Layer Responsibilities
- **Presentation**: parses filters and returns response  
- **Business**: orchestrates query and mapping  
- **Persistence**: executes SELECT query  

### Outputs / Errors
- ✅ 200 OK + PlaceDTO[]  
- ✅ 200 OK + empty list if no results  

---

# 📚 Design Principles Applied

- Layered Architecture  
- Separation of Concerns  
- Facade Pattern  
- Dependency Direction Control  
- Database Isolation  
- Entity Inheritance (BaseModel abstraction)

---

# ✅ Deliverables Status

- ✔ High-Level Package Diagram  
- ✔ Detailed Class Diagram  
- ✔ Sequence Diagrams  
- ✔ Explanatory Notes  
