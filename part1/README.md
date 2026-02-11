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

*(To be completed in Task 1)*

This section will include:

- Detailed class diagram
- Entity attributes
- Relationships and cardinalities
- Core methods and constraints

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

---

# ✅ Deliverables Summary

- ✔ High-Level Package Diagram
- ⏳ Detailed Class Diagram (Business Layer)
- ⏳ Sequence Diagrams
- ⏳ Final Documentation Compilation
