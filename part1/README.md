# 🏗 HBnB Evolution – Technical Documentation (Part 1)

---

# 1️⃣ Introduction

## 📌 Purpose of This Document

This document compiles all architectural diagrams and explanatory notes produced in the previous tasks into a single comprehensive technical reference.

Its objective is to:

- Define the overall system architecture  
- Describe the core business logic structure  
- Explain API interaction flows  
- Justify design decisions  

This document serves as a **blueprint for implementation** and will guide development phases to ensure architectural consistency and clarity.

---

## 📌 Project Scope

HBnB Evolution is a simplified AirBnB-like application that enables:

- **User Management** (registration, profile update, admin role)
- **Place Management** (property listing with price and geolocation)
- **Review Management** (users can review places)
- **Amenity Association** (places linked to amenities)

The system follows a **Layered Architecture** and applies the **Facade Design Pattern** to enforce separation of concerns and maintain maintainability.

---

# 2️⃣ High-Level Architecture

## 📦 High-Level Package Diagram

<p align="center">
  <img src="./High_level_package_diagram_HBNB.png" width="900"/>
</p>

<p align="center">
  <a href="./High_level_package_diagram_HBNB.pdf">📄 View Full PDF Version</a>
</p>

---

## 🎯 Purpose of the Diagram

This diagram presents the global architecture of the application and illustrates the dependency direction between layers.

It ensures clear separation of responsibilities and controlled interactions.

---

## 🔑 Key Components

- Presentation Layer
- Business Logic Layer
- Persistence Layer
- Facade

---

## 🧱 Layer Responsibilities

### Presentation Layer
- Handles HTTP requests and responses
- Performs input validation
- Delegates business operations to the Facade
- Contains no domain logic

### Business Logic Layer
- Contains domain entities
- Implements business rules and validation
- Coordinates use cases via the Facade

### Persistence Layer
- Responsible for data storage and retrieval
- Abstracted from business logic
- Ensures database independence

---

## 📐 Design Decisions & Rationale

| Design Choice | Rationale |
|---------------|-----------|
| Layered architecture | Clear separation of concerns |
| Facade pattern | Centralized orchestration of business logic |
| Dependency control | Prevent circular dependencies |
| Database isolation | Flexibility for future storage changes |

---

## 🏛 Architectural Role

This architecture ensures:

- Maintainability
- Testability
- Scalability
- Clear responsibility boundaries

---

# 3️⃣ Business Logic Layer

## 📊 Detailed Class Diagram

<p align="center">
  <img src="./Class_diagram_for_business_Logic_Layer_HBNB.png" width="900"/>
</p>

<p align="center">
  <a href="./Class_diagram_for_business_Logic_Layer_HBNB.pdf">📄 View Full PDF Version</a>
</p>

---

## 🎯 Purpose of the Diagram

This diagram defines:

- Core domain entities
- Attributes
- Relationships
- Inheritance hierarchy
- Business constraints

It represents the structural foundation of the domain model.

---

## 🔑 Key Classes

### BaseModel (Abstract)
Shared attributes:
- id
- created_at
- updated_at

Purpose:
- Avoid duplication
- Ensure consistency across entities

---

### User
Attributes:
- id
- first_name
- last_name
- email
- is_admin

Responsibilities:
- Own places
- Submit reviews

---

### Place
Attributes:
- id
- name
- description
- price
- latitude
- longitude

Responsibilities:
- Belongs to a User
- Linked to Amenities
- Receives Reviews

---

### Review
Attributes:
- id
- rating (1–5)
- text

Responsibilities:
- Linked to a User
- Linked to a Place

---

### Amenity
Attributes:
- id
- name

Responsibilities:
- Associated with multiple Places

---

## 🔗 Relationships & Cardinalities

- User (1) → (*) Place
- Place (1) → (*) Review
- User (1) → (*) Review
- Place (*) ↔ (*) Amenity

---

## ⚙ Business Rules

- Rating must be between 1 and 5
- Only registered users can create places
- Only registered users can write reviews
- Review must reference an existing place

---

## 📐 Design Rationale

- Entities encapsulate business rules
- Relationships enforce domain integrity
- Inheritance promotes reuse

---

## 🏛 Architectural Role

The Business Logic Layer isolates domain rules from presentation and persistence.

---

## 🛠 Implementation Impact

- Entities implemented as Python classes
- Validation logic resides here
- Controllers remain thin
- Facade methods map to use cases

---

# 4️⃣ API Interaction Flow

---

# SD-01 — User Registration (POST `/users`)

<p align="center">
  <img src="./Sequence_SD01_User_Registration.png" width="900"/>
</p>

<p align="center">
  <a href="./Sequence_SD01_User_Registration.pdf">📄 View Full PDF Version</a>
</p>

## Purpose

Describes how a new user is registered.

---

## Key Components

- Client
- Controller
- Facade
- User Entity
- Persistence Layer

---

## Interaction Flow

1. Client sends POST request
2. Controller validates request data
3. Controller calls Facade
4. Facade creates User entity
5. Entity validated and stored
6. Response returned (201 Created)

---

## Design Rationale

- Validation separated from domain logic
- Facade centralizes orchestration
- Entity enforces business constraints

---

## Architectural Role

Demonstrates how layered architecture enforces separation of concerns.

---

## Implementation Impact

- Controller handles HTTP concerns
- Facade exposes `create_user()` method
- Entity enforces validation rules

---

# SD-02 — Place Creation (POST `/places`)

<p align="center">
  <img src="./Sequence_SD02_Place_Creation.png" width="900"/>
</p>

<p align="center">
  <a href="./Sequence_SD02_Place_Creation.pdf">📄 View Full PDF Version</a>
</p>

## Purpose

Describes how a new place is created.

---

## Key Components

- Client
- Controller
- Facade
- Place Entity
- Persistence Layer

---

## Interaction Flow

1. Client sends POST request
2. Authentication verified
3. Controller calls Facade
4. Owner existence validated
5. Place created
6. Response returned

---

## Design Rationale

- Ownership validated at business level
- Facade enforces use case coordination

---

## Architectural Role

Shows controlled interaction between presentation and business layers.

---

## Implementation Impact

- Requires authenticated user
- Facade exposes `create_place()`

---

# SD-03 — Review Submission (POST `/places/{id}/reviews`)

<p align="center">
  <img src="./Sequence_SD03_Review_Submission.png" width="900"/>
</p>

<p align="center">
  <a href="./Sequence_SD03_Review_Submission.pdf">📄 View Full PDF Version</a>
</p>

## Purpose

Describes review creation process.

---

## Key Components

- Client
- Controller
- Facade
- Review Entity
- Persistence Layer

---

## Interaction Flow

1. Client sends POST request
2. Place existence verified
3. Rating validated
4. Review created
5. Response returned

---

## Design Rationale

- Domain rules enforced in entity
- Persistence isolated from controller

---

## Architectural Role

Ensures business constraints are centralized in BLL.

---

## Implementation Impact

- Facade exposes `create_review()`
- Validation logic in Review entity

---

# SD-04 — Fetching Places (GET `/places`)

<p align="center">
  <img src="./Sequence_SD04_Fetching_Places.png" width="900"/>
</p>

<p align="center">
  <a href="./Sequence_SD04_Fetching_Places.pdf">📄 View Full PDF Version</a>
</p>

## Purpose

Describes retrieval of places list.

---

## Key Components

- Client
- Controller
- Facade
- Persistence Layer

---

## Interaction Flow

1. Client sends GET request
2. Controller calls Facade
3. Data retrieved from persistence
4. Response returned (200 OK)

---

## Design Rationale

- Read operations also pass through Facade
- Ensures architectural consistency

---

## Architectural Role

Demonstrates standardized interaction pattern.

---

## Implementation Impact

- Facade exposes `get_places()`
- Persistence layer handles querying

---

# 5️⃣ Design Principles Applied

- Layered Architecture  
- Separation of Concerns  
- Facade Pattern  
- Dependency Direction Control  
- Database Isolation  
- Entity Inheritance (BaseModel abstraction)

---

# 6️⃣ Conclusion

This document consolidates the architectural and design foundation of HBnB Evolution.

It defines structure, relationships, responsibilities, and interaction flows, ensuring that the implementation phase proceeds with clarity, consistency, and maintainability.
