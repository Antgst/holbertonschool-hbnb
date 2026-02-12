# 🏗 HBnB Evolution – Technical Documentation (Part 1)

---

# 📘 Overview

This document provides the complete architectural and technical foundation of the **HBnB Evolution** application.

It consolidates:

- High-level architecture
- Business Logic design
- API interaction sequence diagrams
- Design decisions and applied principles

The objective is to ensure clarity, strict alignment with project requirements, and readiness for implementation in subsequent phases.

---

# 1️⃣ Project Scope

HBnB Evolution is a simplified AirBnB-like application allowing:

- **User Management** (registration, update, deletion, administrator role)
- **Place Management** (creation, update, deletion, listing)
- **Review Management** (creation, update, deletion, listing by place)
- **Amenity Management** (creation, update, deletion, listing)

The system follows:

- **Layered Architecture**
- **Facade Design Pattern**
- Controlled dependency direction between layers

All entities are uniquely identified using **UUID4** and include audit fields (`created_at`, `updated_at`).

---

# 2️⃣ High-Level Architecture

## 📦 High-Level Package Diagram

<p align="center">
  <img src="./docs/high_level/High_level_package_diagram_HBNB.png" width="900"/>
</p>

<p align="center">
  <a href="./docs/high_level/High_level_package_diagram_HBNB.pdf">📄 View Full PDF Version</a>
</p>

## 🎯 Purpose

This diagram illustrates:

- The three-layer architecture
- Clear separation of responsibilities
- Controlled communication via the Facade pattern

### Layers

### 1️⃣ Presentation Layer (API / Controllers)
- Handles HTTP requests and responses
- Performs input validation
- Delegates use cases to the Facade
- Contains no domain logic

### 2️⃣ Business Logic Layer (Models + Facade)
- Contains domain entities
- Implements business rules
- Coordinates use cases
- Enforces domain integrity

### 3️⃣ Persistence Layer (Repositories)
- Responsible for data storage and retrieval
- Abstracted from business logic
- Ensures database independence

The Presentation Layer communicates exclusively with the Business Logic Layer through the **Facade**.

---

# 3️⃣ Business Logic Layer

## 📊 Class Diagram

<p align="center">
  <img src="./docs/class_diagram/Class_diagram_for_business_Logic_Layer_HBNB.png" width="900"/>
</p>

<p align="center">
  <a href="./docs/class_diagram/Class_diagram_for_business_Logic_Layer_HBNB.pdf">📄 View Full PDF Version</a>
</p>

## 🎯 Purpose

This diagram defines:

- Core domain entities
- Attributes (strictly aligned with requirements)
- Inheritance hierarchy
- Relationships and multiplicities
- Business constraints

---

## 🔑 Core Entities

### BaseModel (Abstract)

Shared attributes for all entities:

- `id: UUID4`
- `created_at: datetime`
- `updated_at: datetime`

Ensures:

- Unique identification
- Audit tracking
- Reusability

---

### User

Attributes:

- `id: UUID4`
- `first_name: str`
- `last_name: str`
- `email: str`
- `password: str`
- `is_admin: bool`
- `created_at: datetime`
- `updated_at: datetime`

Responsibilities:

- Can register, update, and delete profile
- Owns multiple Places
- Writes multiple Reviews

---

### Place

Attributes:

- `id: UUID4`
- `title: str`
- `description: str`
- `price: float`
- `latitude: float`
- `longitude: float`
- `owner_id: UUID4`
- `created_at: datetime`
- `updated_at: datetime`

Responsibilities:

- Belongs to a User
- Can be created, updated, deleted, and listed
- Linked to multiple Amenities
- Receives multiple Reviews

---

### Review

Attributes:

- `id: UUID4`
- `rating: int`
- `comment: str`
- `user_id: UUID4`
- `place_id: UUID4`
- `created_at: datetime`
- `updated_at: datetime`

Responsibilities:

- Linked to a specific User
- Linked to a specific Place
- Can be created, updated, deleted, and listed by place

---

### Amenity

Attributes:

- `id: UUID4`
- `name: str`
- `description: str`
- `created_at: datetime`
- `updated_at: datetime`

Responsibilities:

- Can be created, updated, deleted, and listed
- Associated with multiple Places

---

## 🔗 Cardinalities

- User (1) → (*) Place
- User (1) → (*) Review
- Place (1) → (*) Review
- Place (*) ↔ (*) Amenity

All multiplicities are enforced at the Business Logic Layer.

---

## ⚙ Business Rules

- Each entity must have a unique UUID4 identifier
- All entities track creation and update timestamps
- Rating must be between 1 and 5
- Only registered users can create places
- Only registered users can write reviews
- Each review must reference an existing place
- Each place must reference a valid owner (User)

---

# 4️⃣ API Interaction Sequence Diagrams

---

# SD-01 — User Registration (POST `/users`)

<p align="center">
  <img src="./docs/sequence_diagram/Sequence_SD01_User_Registration.png" width="900"/>
</p>

<p align="center">
  <a href="./docs/sequence_diagram/Sequence_SD01_User_Registration.pdf">📄 View Full PDF Version</a>
</p>

### Flow Summary

1. POST request received
2. Email uniqueness verified
3. User entity created
4. Persisted in database
5. 201 Created returned

---

# SD-02 — Place Creation (POST `/places`)

<p align="center">
  <img src="./docs/sequence_diagram/Sequence_SD02_Place_Creation.png" width="900"/>
</p>

<p align="center">
  <a href="./docs/sequence_diagram/Sequence_SD02_Place_Creation.pdf">📄 View Full PDF Version</a>
</p>

### Flow Summary

1. Authenticated request received
2. Owner existence verified
3. Place entity created
4. Persisted
5. 201 Created returned

---

# SD-03 — Review Submission (POST `/places/{id}/reviews`)

<p align="center">
  <img src="./docs/sequence_diagram/Sequence_SD03_Review_Submission.png" width="900"/>
</p>

<p align="center">
  <a href="./docs/sequence_diagram/Sequence_SD03_Review_Submission.pdf">📄 View Full PDF Version</a>
</p>

### Flow Summary

1. Place existence verified
2. User existence verified
3. Rating validated (1–5)
4. Review persisted
5. 201 Created returned

---

# SD-04 — Fetching Places (GET `/places`)

<p align="center">
  <img src="./docs/sequence_diagram/Sequence_SD04_Fetching_Places.png" width="900"/>
</p>

<p align="center">
  <a href="./docs/sequence_diagram/Sequence_SD04_Fetching_Places.pdf">📄 View Full PDF Version</a>
</p>

### Flow Summary

1. GET request received
2. Filters applied
3. Data retrieved from persistence layer
4. 200 OK returned

---

# 5️⃣ Architectural Principles Applied

- Layered Architecture
- Separation of Concerns
- Facade Pattern
- Dependency Direction Control
- Database Isolation
- BaseModel abstraction
- UUID-based identification

---

# 6️⃣ Assumptions & Design Decisions

## Assumptions

- Passwords are assumed to be securely hashed before persistence.
- Authentication mechanism is not detailed in this phase.
- Database implementation will be completed in Part 3.
- Repository layer abstracts storage implementation.

## Design Decisions

- UUID4 ensures global uniqueness.
- Audit fields are centralized in BaseModel.
- Facade centralizes orchestration.
- Entities encapsulate validation logic.

---

# 7️⃣ Conclusion

This document defines the structural and architectural foundation of HBnB Evolution.

It ensures:

- Maintainability
- Scalability
- Business rule traceability
- Strict alignment with project requirements

This documentation will guide implementation in the next phases.

---

## 👥 Authors

- Antoine Gousset – GitHub: [Antgst](https://github.com/Antgst)
- Gwendal Boisard – GitHub: [Gwendal-B](https://github.com/Gwendal-B)
- Yonas Houriez – GitHub: [Ausaryu](https://github.com/Ausaryu)

See `AUTHORS`.
