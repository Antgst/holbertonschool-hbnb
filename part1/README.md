# 🏗 HBnB Evolution – Technical Documentation (Part 1)

---

# 📘 Overview

This document provides the complete architectural and technical foundation of the **HBnB Evolution** application.

It consolidates:

- High-level architecture
- Business Logic design
- API interaction sequence diagrams
- Design decisions and applied principles

The objective is to ensure clarity, structural consistency, and readiness for implementation.

---

# 1️⃣ Project Scope

HBnB Evolution is a simplified AirBnB-like application allowing:

- **User Management** (registration, profile updates, admin role)
- **Place Management** (listing properties with price and geolocation)
- **Review Management** (users reviewing places)
- **Amenity Association** (places linked to amenities)

The system follows:

- **Layered Architecture**
- **Facade Design Pattern**
- Strict dependency direction control

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

- The three architectural layers
- Controlled dependency direction
- The Facade as orchestration layer

### Layers

- **Presentation Layer**
- **Business Logic Layer**
- **Persistence Layer**

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

Defines:

- Core domain entities
- Attributes and inheritance
- Relationships and cardinalities
- Business constraints

---

## 🔑 Core Entities

### BaseModel (Abstract)
- id
- created_at
- updated_at

Ensures attribute consistency and reuse.

---

### User
- first_name
- last_name
- email
- is_admin

Relationships:
- Owns multiple Places
- Writes multiple Reviews

---

### Place
- name
- description
- price
- latitude
- longitude

Relationships:
- Belongs to a User
- Has multiple Reviews
- Linked to multiple Amenities

---

### Review
- rating (1–5)
- text

Relationships:
- Linked to a User
- Linked to a Place

---

### Amenity
- name

Relationships:
- Associated with multiple Places

---

## 🔗 Cardinalities

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
3. Rating validated
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
3. Data retrieved from persistence
4. 200 OK returned

---

# 5️⃣ Architectural Principles Applied

- Layered Architecture
- Separation of Concerns
- Facade Pattern
- Controlled Dependency Direction
- Database Isolation
- Inheritance via BaseModel

---

# 6️⃣ Conclusion

This documentation defines the structural and architectural foundation of HBnB Evolution.

It ensures:

- Maintainability
- Testability
- Scalability
- Clear responsibility boundaries

---

## 👥 Authors

- Antoine Gousset – GitHub: [Antgst](https://github.com/Antgst)
- Gwendal Boisard – GitHub: [Gwendal-B](https://github.com/Gwendal-B)
- Yonas Houriez – GitHub: [Ausaryu](https://github.com/Ausaryu)

See `AUTHORS`.
