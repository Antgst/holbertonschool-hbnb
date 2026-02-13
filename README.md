# 🏗 HBnB Evolution – Technical Documentation (Part 1)

---

# 📘 1. Introduction

## 🎯 Objective

This document defines the complete architectural and technical blueprint of the **HBnB Evolution** application.

It provides:

- The high-level layered architecture
- The detailed business logic design
- The interaction flow across layers
- The UML diagrams required to guide implementation

This documentation serves as the reference foundation for future implementation phases.

---

# 🧱 2. High-Level Architecture

## 📦 Architecture Overview

HBnB Evolution follows a strict **three-layer architecture**:

1. **Presentation Layer**
2. **Business Logic Layer**
3. **Persistence Layer**

Communication between the Presentation Layer and the Business Logic Layer is controlled through a **Facade pattern** to ensure separation of concerns and dependency direction control.

---

## 🔹 Layer Responsibilities

### 1️⃣ Presentation Layer

Responsibilities:

- Expose API endpoints
- Handle HTTP requests and responses
- Perform input validation (format-level only)
- Call the Business Logic via the Facade
- Return serialized responses

Constraints:

- No business rules
- No direct database access

---

### 2️⃣ Business Logic Layer

Responsibilities:

- Contain domain models
- Implement business rules
- Validate domain constraints
- Manage entity relationships
- Coordinate persistence operations via repositories

Constraints:

- No HTTP handling
- No direct knowledge of client requests

---

### 3️⃣ Persistence Layer

Responsibilities:

- Store and retrieve data from the database
- Implement repository or DAO pattern
- Abstract database access

Constraints:

- No business logic
- No API logic

---

# 🧠 3. Business Logic – Class Design

All entities share the following common attributes:

- `id: UUID`
- `created_at: datetime`
- `updated_at: datetime`

---

## 👤 User Entity

### Attributes

- id
- first_name
- last_name
- email
- password
- is_admin (boolean)
- created_at
- updated_at

### Responsibilities

- Register
- Update profile
- Delete account

### Relationships

- One User → Many Places
- One User → Many Reviews

---

## 🏠 Place Entity

### Attributes

- id
- title
- description
- price
- latitude
- longitude
- owner_id (User)
- created_at
- updated_at

### Responsibilities

- Create place
- Update place
- Delete place
- List places

### Relationships

- Many Places → One User (owner)
- One Place → Many Reviews
- Many-to-Many with Amenity

---

## ⭐ Review Entity

### Attributes

- id
- rating
- comment
- user_id
- place_id
- created_at
- updated_at

### Responsibilities

- Create review
- Update review
- Delete review
- List reviews by place

### Relationships

- Many Reviews → One User
- Many Reviews → One Place

---

## 🛠 Amenity Entity

### Attributes

- id
- name
- description
- created_at
- updated_at

### Responsibilities

- Create amenity
- Update amenity
- Delete amenity
- List amenities

### Relationships

- Many-to-Many with Place

---

# 🔁 4. Sequence Diagrams – API Interaction Flows

The following interactions must be represented using UML sequence diagrams in the final documentation.

Each diagram must include:

- Client
- Presentation Layer
- Facade
- Business Model
- Persistence Layer
- Database

---

## 1️⃣ User Registration – POST /users

Flow:

1. Client sends registration request.
2. Presentation layer validates request format.
3. Presentation calls `Facade.register_user()`.
4. Business layer validates domain rules.
5. Persistence layer stores the user.
6. Response returned to client.

---

## 2️⃣ Place Creation – POST /places

Flow:

1. Client sends place creation request.
2. Presentation validates request structure.
3. Facade verifies owner existence.
4. Business logic validates constraints.
5. Persistence saves place.
6. Response returned.

---

## 3️⃣ Review Submission – POST /reviews

Flow:

1. Client sends review data.
2. Presentation validates format.
3. Business layer checks:
   - User exists
   - Place exists
4. Review is persisted.
5. Confirmation returned.

---

## 4️⃣ Fetch Places – GET /places

Flow:

1. Client sends fetch request.
2. Presentation forwards to Facade.
3. Business layer retrieves places.
4. Persistence queries database.
5. Serialized response returned.

---

# 🗄 5. Persistence Requirements

- All entities must be persisted in a database.
- Each entity must have a unique identifier.
- Creation and update timestamps are mandatory.
- Database implementation will be defined in Part 3.

---

# 📐 6. Design Principles Applied

- Layered Architecture
- Facade Pattern
- Separation of Concerns
- Single Responsibility Principle
- Controlled dependency direction
- UML standard notation compliance

---

# ✅ 7. Requirement Coverage

✔ User Management implemented  
✔ Place Management implemented  
✔ Review Management implemented  
✔ Amenity Management implemented  
✔ Unique IDs included  
✔ Audit fields included  
✔ CRUD operations covered  
✔ Relationships accurately modeled  
✔ Layer communication clearly defined  

---

# 📎 Conclusion

This document provides a complete technical blueprint for HBnB Evolution.

It defines:

- System structure
- Business entities
- Relationships
- API interaction flows
- Architectural constraints

It will serve as the foundation for the implementation phases of the project.
