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

This document serves as a **blueprint for implementation** and ensures architectural consistency throughout development.

---

## 📌 Project Scope

HBnB Evolution is a simplified AirBnB-like application that enables:

- **User Management** (registration, profile update, admin role)
- **Place Management** (property listing with price and geolocation)
- **Review Management** (users can review places)
- **Amenity Association** (places linked to amenities)

The system follows a **Layered Architecture** and applies the **Facade Design Pattern** to enforce separation of concerns and maintainability.

---

# 2️⃣ High-Level Architecture

## 📦 High-Level Package Diagram

<p align="center">
  <img src="./docs/high_level/High_level_package_diagram_HBNB.png" width="900"/>
</p>

<p align="center">
  <a href="./docs/high_level/High_level_package_diagram_HBNB.pdf">📄 View Full PDF Version</a>
</p>

---

## 🎯 Purpose of the Diagram

This diagram illustrates:

- Global system architecture
- Dependency direction between layers
- Clear separation of responsibilities

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
- Implements business rules
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

# 3️⃣ Business Logic Layer

## 📊 Detailed Class Diagram

<p align="center">
  <img src="./docs/class_diagram/Class_diagram_for_business_Logic_Layer_HBNB.png" width="900"/>
</p>

<p align="center">
  <a href="./docs/class_diagram/Class_diagram_for_business_Logic_Layer_HBNB.pdf">📄 View Full PDF Version</a>
</p>

---

## 🔑 Core Entities

### BaseModel (Abstract)
- id  
- created_at  
- updated_at  

Ensures consistency and reuse.

### User
- first_name  
- last_name  
- email  
- is_admin  

### Place
- name  
- description  
- price  
- latitude  
- longitude  

### Review
- rating (1–5)  
- text  

### Amenity
- name  

---

## 🔗 Relationships

- User (1) → (*) Place  
- User (1) → (*) Review  
- Place (1) → (*) Review  
- Place (*) ↔ (*) Amenity  

---

## ⚙ Business Rules

- Rating must be between 1 and 5  
- Only registered users can create places  
- Only registered users can write reviews  
- Review must reference an existing place  

---

# 4️⃣ API Interaction Flow

---

# SD-01 — User Registration (POST `/users`)

<p align="center">
  <img src="./docs/sequence_diagrams/Sequence_SD01_User_Registration.png" width="900"/>
</p>

<p align="center">
  <a href="./docs/sequence_diagrams/Sequence_SD01_User_Registration.pdf">📄 View Full PDF Version</a>
</p>

## Flow Summary

1. Client sends POST request  
2. Email uniqueness verified  
3. User entity created  
4. User persisted  
5. 201 Created returned  

---

# SD-02 — Place Creation (POST `/places`)

<p align="center">
  <img src="./docs/sequence_diagrams/Sequence_SD02_Place_Creation.png" width="900"/>
</p>

<p align="center">
  <a href="./docs/sequence_diagrams/Sequence_SD02_Place_Creation.pdf">📄 View Full PDF Version</a>
</p>

## Flow Summary

1. Authenticated request received  
2. Owner existence validated  
3. Place entity created  
4. Place persisted  
5. 201 Created returned  

---

# SD-03 — Review Submission (POST `/places/{id}/reviews`)

<p align="center">
  <img src="./docs/sequence_diagrams/Sequence_SD03_Review_Submission.png" width="900"/>
</p>

<p align="center">
  <a href="./docs/sequence_diagrams/Sequence_SD03_Review_Submission.pdf">📄 View Full PDF Version</a>
</p>

## Flow Summary

1. Place existence verified  
2. User existence verified  
3. Rating validated  
4. Review created  
5. 201 Created returned  

---

# SD-04 — Fetching Places (GET `/places`)

<p align="center">
  <img src="./docs/sequence_diagrams/Sequence_SD04_Fetching_Places.png" width="900"/>
</p>

<p align="center">
  <a href="./docs/sequence_diagrams/Sequence_SD04_Fetching_Places.pdf">📄 View Full PDF Version</a>
</p>

## Flow Summary

1. Client sends GET request  
2. Filters applied  
3. Data retrieved  
4. 200 OK returned  

---

# 5️⃣ Design Principles Applied

- Layered Architecture  
- Separation of Concerns  
- Facade Pattern  
- Dependency Direction Control  
- Database Isolation  
- BaseModel Abstraction  

---

# 6️⃣ Conclusion

This document consolidates the architectural and design foundation of HBnB Evolution.

It defines structure, relationships, responsibilities, and interaction flows to ensure implementation clarity and maintainability.

---

## 👥 Authors

- Antoine Gousset – GitHub: [Antgst](https://github.com/Antgst)  
- Gwendal Boisard – GitHub: [Gwendal-B](https://github.com/Gwendal-B)  
- Yonas Houriez – GitHub: [Ausaryu](https://github.com/Ausaryu)  

See `AUTHORS`.
