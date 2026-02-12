# 🏗 HBnB Evolution – Technical Documentation (Part 1)

---

# 1️⃣ Introduction

## 📌 Purpose of This Document

This document provides a comprehensive technical blueprint for the **HBnB Evolution** application.  
It consolidates all architectural diagrams and design decisions produced in the previous tasks into a single structured reference.

This document will guide the implementation phase by:

- Defining the overall system architecture  
- Describing the core business entities and their relationships  
- Explaining API interaction flows  
- Clarifying key design decisions  

It serves as a **reference document throughout development** to ensure consistency, correctness, and maintainability.

---

## 📌 Project Overview

HBnB Evolution is a simplified AirBnB-like application that enables:

- **User Management** (registration, profile updates, administrator roles)
- **Place Management** (property listing with location, price, amenities)
- **Review Management** (users can review visited places)

The system is designed following a **layered architecture** and implements the **Facade design pattern** to ensure proper separation of concerns.

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

This diagram illustrates the global architecture of the system and the dependency direction between layers.

It provides a macro-level view of how components interact while maintaining clear separation of responsibilities.

---

## 🧱 Architectural Layers

### 🔹 Presentation Layer
- Exposes REST API endpoints
- Handles HTTP requests and responses
- Performs input validation
- Contains no business logic

### 🔹 Business Logic Layer
- Contains core entities (User, Place, Review, Amenity)
- Implements validation rules
- Applies business constraints
- Orchestrated through a Facade

### 🔹 Persistence Layer
- Handles data storage and retrieval
- Abstracted from the business layer
- Ensures database isolation

---

## 🧩 Facade Pattern

The Facade acts as a **single entry point** to the Business Logic Layer.

### Why?
- Reduces coupling between Presentation and Business layers
- Simplifies controller logic
- Centralizes orchestration of use cases

---

## 📐 Design Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| Layered architecture | Clear separation of responsibilities |
| Facade pattern | Centralized access to business operations |
| Dependency direction control | Prevent circular dependencies |
| Database isolation | Flexibility to change storage technology |

---

# 3️⃣ Business Logic Layer Design

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

- Core entities
- Attributes and behaviors
- Relationships and cardinalities
- Inheritance structure

It represents the heart of the application logic.

---

## 🧍 Core Entities

### User
- id
- first_name
- last_name
- email
- is_admin

**Responsibilities:**
- Register
- Update profile
- Own places
- Write reviews

---

### Place
- id
- name
- description
- price
- latitude
- longitude

**Responsibilities:**
- Belongs to a User
- Contains Amenities
- Receives Reviews

---

### Review
- id
- rating (1–5)
- text

**Responsibilities:**
- Linked to a User
- Linked to a Place

---

### Amenity
- id
- name

**Responsibilities:**
- Associated with multiple Places

---

### BaseModel (Abstract)

Provides:
- id
- created_at
- updated_at

Purpose:
- Promote consistency
- Avoid duplication
- Centralize shared attributes

---

## 🔗 Relationships & Cardinalities

- A **User** can own multiple Places (1 → *)
- A **Place** belongs to exactly one User
- A **Place** can have multiple Reviews (1 → *)
- A **Review** belongs to one User and one Place
- A **Place** can have multiple Amenities (* ↔ *)

---

## ⚙ Business Constraints

- Rating must be between 1 and 5
- Only registered users can create places
- Only registered users can write reviews
- A review must reference an existing place

---

## 📐 Design Impact on Implementation

- Entities will be implemented as Python classes
- Validation logic resides in Business Layer
- Controllers must not contain business rules
- Facade methods correspond to use cases

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

Describes how a new user is created in the system.

## Interaction Flow

1. Client sends POST request
2. Controller validates input
3. Controller calls Facade
4. Facade creates User entity
5. Entity validated and stored
6. Response returned (201 Created)

## Possible Errors

- Missing required fields
- Invalid email format
- Duplicate user

---

# SD-02 — Place Creation (POST `/places`)

<p align="center">
  <img src="./Sequence_SD02_Place_Creation.png" width="900"/>
</p>

<p align="center">
  <a href="./Sequence_SD02_Place_Creation.pdf">📄 View Full PDF Version</a>
</p>

## Purpose

Describes how a user creates a new place.

## Interaction Flow

1. Client sends POST request
2. Authentication verified
3. Controller calls Facade
4. Facade validates owner existence
5. Place entity created
6. Response returned

## Possible Errors

- Unauthorized user
- Invalid coordinates
- Missing required fields

---

# SD-03 — Review Submission (POST `/places/{id}/reviews`)

<p align="center">
  <img src="./Sequence_SD03_Review_Submission.png" width="900"/>
</p>

<p align="center">
  <a href="./Sequence_SD03_Review_Submission.pdf">📄 View Full PDF Version</a>
</p>

## Purpose

Describes how a user submits a review for a place.

## Interaction Flow

1. Client sends POST request
2. Controller verifies place existence
3. Facade validates user and rating
4. Review created
5. Response returned

## Possible Errors

- Invalid rating
- Place not found
- Unauthorized user

---

# SD-04 — Fetching Places (GET `/places`)

<p align="center">
  <img src="./Sequence_SD04_Fetching_Places.png" width="900"/>
</p>

<p align="center">
  <a href="./Sequence_SD04_Fetching_Places.pdf">📄 View Full PDF Version</a>
</p>

## Purpose

Describes how the system retrieves a list of places.

## Interaction Flow

1. Client sends GET request
2. Controller calls Facade
3. Facade queries persistence layer
4. Places returned
5. Response returned (200 OK)

---

# 5️⃣ Design Principles Applied

- Layered Architecture  
- Separation of Concerns  
- Facade Pattern  
- Dependency Direction Control  
- Database Isolation  
- Entity Inheritance (BaseModel abstraction)

---

# 6️⃣ Final Review Checklist

✔ All diagrams included (PNG + PDF links)  
✔ Each diagram explained  
✔ Clear architecture description  
✔ Consistent terminology  
✔ Business rules identified  
✔ Implementation impact clarified  

---

# 📌 Conclusion

This document consolidates the architectural foundation of HBnB Evolution.

It defines structure, responsibilities, and interaction flows, ensuring that the implementation phase can proceed with clarity and consistency.
