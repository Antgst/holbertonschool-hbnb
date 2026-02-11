## 📦 High-Level Package Diagram

<p align="center">
  <img src="./High_level_package_diagram_HBNB.png" alt="High-Level Package Diagram" width="800"/>
</p>

<p align="center">
  <a href="./High_level_package_diagram_HBNB.pdf">📄 View Full PDF Version</a>
</p>

---

## 🏗 Architecture Overview

- **Presentation Layer**: Exposes API endpoints, controllers, and services. Contains no business logic.
- **Business Logic Layer**: Contains core business rules, domain entities, and the `HBnBFacade`.
- **Facade**: Single entry point called by the presentation layer. Orchestrates application use cases.
- **Persistence Layer**: Handles repositories and ORM/storage. Contains no business logic.
- **Database**: External system accessed exclusively through the persistence layer.
