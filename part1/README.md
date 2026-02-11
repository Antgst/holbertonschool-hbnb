# 🏗 HBnB Evolution – Technical Documentation (Part 1)

## 📌 Overview

This document provides the architectural and design blueprint for the **HBnB Evolution** application.  
It defines the system structure, core business entities, and interaction flow across layers.

The application follows a **layered architecture** and applies the **Facade design pattern** to ensure separation of concerns and maintainability.

---

# 1️⃣ High-Level Architecture

## 📦 High-Level Package Diagram

<p align="center">
  <img src="./High_level_package_diagram_HBNB.png" alt="High-Level Package Diagram" width="900"/>
</p>

<p align="center">
  <a href="./High_level_package_diagram_HBNB.pdf">📄 View Full PDF Version</a>
</p>

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

### 🔹 Facade Pattern
- Provides a unified interface to the business layer  
- Called exclusively by the presentation layer  
- Orchestrates application use cases  
- Decouples presentation from persistence

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

<p align="center">
  <img src="./Class_diagram_for_business_Logic_Layer_HBNB.png" alt="Business Logic Class Diagram" width="900"/>
</p>

<p align="center">
  <a href="./Class_diagram_for_business_Logic_Layer_HBNB.pdf">📄 View Full PDF Version</a>
</p>

---

## 🧱 Core Entities

### 🔹 BaseModel (Abstract)
Provides shared attributes for all entities:
- `id: UUID4`
- `created_at: datetime`
- `updated_at: datetime`
- `update()`

---

### 🔹 User
Represents a system account (regular or admin).

**Attributes**
- `first_name: string`
- `last_name: string`
- `email: string`
- `password: string`
- `is_admin: bool`

**Methods**
- `update_profile()`

---

### 🔹 Place
Represents a property listing owned by a user.

**Attributes**
- `title: string`
- `description: string`
- `price: float`
- `latitude: float`
- `longitude: float`
- `owner_id: UUID4`

**Methods**
- `update()`
- `add_amenity(amenity: Amenity)`
- `remove_amenity(amenity: Amenity)`

---

### 🔹 Review
Represents feedback written by a user for a specific place.

**Attributes**
- `rating: int`
- `comment: string`
- `user_id: UUID4`
- `place_id: UUID4`

**Methods**
- `update()`

---

### 🔹 Amenity
Represents a feature that can be associated with places.

**Attributes**
- `name: string`
- `description: string`

**Methods**
- `update()`

---

## 🔗 Relationships and Cardinalities

- A **User owns 0..*** Places; each Place has **1 owner**.
- A **Place has 0..*** Reviews; each Review targets **1 Place**.
- A **User writes 0..*** Reviews; each Review is written by **1 User**.
- **Places and Amenities are many-to-many (0..* ↔ 0..*)**.

---

# 3️⃣ Sequence Diagrams

*(To be completed in Task 2)*

The following API calls will be documented:

- User registration
- Place creation
- Review submission
- Fetching places list

Each sequence diagram will illustrate:
- Layer interactions
- Facade orchestration
- Repository and database communication

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
- ✔ Detailed Class Diagram (Business Layer)
- ⏳ Sequence Diagrams
- ⏳ Final Documentation Compilation
