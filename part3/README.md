# 📘 HBnB - Auth & DB

## 📌 Description

### Part 3: Enhanced Backend with Authentication and Database Integration



Welcome to Part 3 of the **HBnB Project**, where you will extend the backend of the application by introducing **user authentication**, **authorization**, and **database integration** using **SQLAlchemy** and **SQLite** for development. Later, you'll configure **MySQL** for production environments. In this part, you will secure the backend, introduce persistent storage, and prepare the application for a scalable, real-world deployment.



#### Objectives of the Project



1. **Authentication and Authorization**: Implement JWT-based user authentication using **Flask-JWT-Extended** and role-based access control with the `is_admin` attribute for specific endpoints.

2. **Database Integration**: Replace in-memory storage with **SQLite** for development using **SQLAlchemy** as the ORM and prepare for **MySQL** or other production grade **RDBMS**.

3. **CRUD Operations with Database Persistence**: Refactor all CRUD operations to interact with a persistent database.

4. **Database Design and Visualization**: Design the database schema using **mermaid.js** and ensure all relationships between entities are correctly mapped.

5. **Data Consistency and Validation**: Ensure that data validation and constraints are properly enforced in the models.



#### Learning Objectives



By the end of this part, you will:



- Implement **JWT authentication** to secure your API and manage user sessions.

- Enforce **role-based access control** to restrict access based on user roles (regular users vs. administrators).

- Replace in-memory repositories with a **SQLite-based persistence layer** using **SQLAlchemy** for development and configure **MySQL** for production.

- Design and visualize a **relational database schema** using **mermaid.js** to handle relationships between users, places, reviews, and amenities.

- Ensure the backend is secure, scalable, and provides reliable data storage for production environments.



#### Project Context

In the previous parts of the project, you worked with in-memory storage, which is ideal for prototyping but insufficient for production environments. In Part 3, you'll transition to **SQLite**, a lightweight relational database, for development, while preparing the system for **MySQL** in production. This will give you hands-on experience with real-world database systems, allowing your application to scale effectively.



Additionally, you'll introduce **JWT-based authentication** to secure the API, ensuring that only authenticated users can interact with certain endpoints. You will also implement role-based access control to enforce restrictions based on the user's privileges (regular users vs. administrators).



#### Project Resources



Here are some resources that will guide you through this part of the project:



- **JWT Authentication**: [Flask-JWT-Extended Documentation](https://flask-jwt-extended.readthedocs.io/en/stable/)

- **SQLAlchemy ORM**: [SQLAlchemy Documentation](https://docs.sqlalchemy.org/en/14/)

- **SQLite**: [SQLite Documentation](https://sqlite.org/docs.html)

- **Flask Documentation**: [Flask Official Documentation](https://flask.palletsprojects.com/en/stable/)

- **Mermaid.js for ER Diagrams**: [Mermaid.js Documentation](http://mermaid.js.org/)



#### Structure of the Project

In this part of the project, the tasks are organized in a way that builds progressively towards a complete, secure, and database-backed backend system:



1. **Modify the User Model to Include Password**: You will start by modifying the `User` model to store passwords securely using bcrypt2 and update the user registration logic.

2. **Implement JWT Authentication**: Secure the API using JWT tokens, ensuring only authenticated users can access protected endpoints.

3. **Implement Authorization for Specific Endpoints**: You will implement role-based access control to restrict certain actions (e.g., admin-only actions).

4. **SQLite Database Integration**: Transition from in-memory data storage to **SQLite** as the persistent database during development.

5. **Map Entities Using SQLAlchemy**: Map existing entities (`User`, `Place`, `Review`, `Amenity`) to the database using SQLAlchemy and ensure relationships are well-defined.

6. **Prepare for MySQL in Production**: Towards the end of this phase, you’ll configure the application to use **MySQL** in production and **SQLite** for development.

7. **Database Design and Visualization**: Use **mermaid.js** to create entity-relationship diagrams for your database schema.



Each task is carefully designed to build on previous work and ensure the system transitions smoothly from development to production readiness.



By the end of Part 3, you will have a backend that not only stores data in a persistent and secure database but also ensures that only authorized users can access and modify specific data. You will have implemented industry-standard authentication and database management practices that are crucial for real-world web applications.

---

## 📚 Resources

_No resources detected._

---

## 🎯 Learning Objectives

_No learning objectives detected._

---

## ✅ Requirements

_No requirements detected._

---

## ⚙️ Setup

_No specific setup detected._

---

## 🧠 Quiz

_No quiz detected in the exported HTML._


---

## 🧩 Tasks

<details>
<summary>0. Modify the Application Factory to Include the Configuration</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part3`

**Task details:**

```text
0. Modify the Application Factory to Include the Configuration
Objective
Update the Flask Application Factory to include the configuration object.
Context
In the previous part of the project, we created a
Config
class to handle different configurations in the application, but we weren't using it yet. In this task, you will update the
create_app()
method (following the Application Factory pattern) in the
app/__init__.py
file to receive a configuration, which will be used to instantiate the application.
IMPORTANT
: Before starting the task, be sure to read and understand the resources provided below.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
Flask Documentation:
Application Factories
Flask Documentation:
Configuration Handling
Expected Outcome
By the end of this task, you should have a fully functional Application Factory that can handle different configurations.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part3
Score of the task
5
/5
pts
100.0%
0
correction requests
QA Review
×
0. Modify the Application Factory to Include the Configuration
Commit used:
User:
---
URL:
Click here
ID:
---
Author:
---
Subject:
---
Date:
---
×
Students who are done with "0. Modify the Application Factory to Include the Configuration"
```

</details>

<details>
<summary>1.  Modify the User Model to Include Password Hashing</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part3`

**Task details:**

```text
1.  Modify the User Model to Include Password Hashing
Objective
Update the
User
model to securely store a hashed password using
bcrypt
. Modify the user registration endpoint to accept the
password
field and ensure that it is hashed before storing it. The password should
not
be returned in any
GET
requests.
Context
In previous tasks, the
User
model was created, but it did not handle passwords. In this task, you will enhance the
User
model to support password hashing using
bcrypt
, ensuring passwords are securely stored. Additionally, you will update the user registration endpoint to accept and hash passwords before storing them. Passwords will not be returned in any
GET
requests.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
Flask-Bcrypt Documentation:
Flask-Bcrypt
Password Hashing Best Practices:
OWASP Password Storage Cheat Sheet
Expected Outcome
By the end of this task, the
User
model will securely hash and store passwords using
bcrypt
. The
POST /api/v1/users/
endpoint will accept passwords and securely hash them before storing. Passwords will not be returned in any
GET
requests.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part3
Score of the task
10
/10
pts
100.0%
0
correction requests
QA Review
×
1.  Modify the User Model to Include Password Hashing
Commit used:
User:
---
URL:
Click here
ID:
---
Author:
---
Subject:
---
Date:
---
×
Students who are done with "1.  Modify the User Model to Include Password Hashing"
```

</details>

<details>
<summary>2. Implement JWT Authentication with `flask-jwt-extended`</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part3`

**Task details:**

```text
2. Implement JWT Authentication with `flask-jwt-extended`
Objective
Set up JWT-based authentication for the HBnB application, enabling secure login functionality. This task involves configuring the API to generate and verify JWT tokens using the
flask-jwt-extended
extension. Tokens will be issued upon successful login and required for accessing protected endpoints.
Context
JWT (JSON Web Token) allows secure authentication by providing a token that clients can use to access protected resources without having to re-authenticate on every request. JWT is stateless, meaning the server doesn’t need to store user sessions, making it ideal for scalable applications. JWT tokens also allow embedding additional claims (such as user roles), which is useful for authorization.
In this task, we will set up user login, issue JWT tokens, and use these tokens to protect specific API endpoints.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
JWT Authentication
:
JWT.io
Flask-JWT-Extended Documentation:
Flask-JWT-Extended
JWT Best Practices:
OWASP JWT Security
Expected Outcome
By the end of this task, students will have implemented user login functionality using JWT. They will be able to generate and verify JWT tokens, protect specific API endpoints, and embed claims (like
is_admin
) within the token for future authorization checks.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part3
Score of the task
10
/10
pts
100.0%
0
correction requests
QA Review
×
2. Implement JWT Authentication with `flask-jwt-extended`
Commit used:
User:
---
URL:
Click here
ID:
---
Author:
---
Subject:
---
Date:
---
×
Students who are done with "2. Implement JWT Authentication with `flask-jwt-extended`"
```

</details>

<details>
<summary>3. Implement Authenticated User Access Endpoints</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part3`

**Task details:**

```text
3. Implement Authenticated User Access Endpoints
Objective
Secure various API endpoints to allow only authenticated users to perform specific actions, including creating and modifying places and reviews, as well as updating their own user details. Access will be controlled via JWT authentication, with additional validation to ensure users can only modify data that belongs to them (e.g., places they own, reviews they created).
Context
Authenticated user access is a critical part of securing an API. By ensuring that only authorized users can perform specific actions, the integrity of the data is protected. This task focuses on securing endpoints related to creating and modifying places and reviews, while also allowing users to modify their own data.
In this task, you will:
Secure endpoints to ensure only authenticated users can create, update, and delete resources.
Add logic to validate ownership of places and reviews.
Implement logic to prevent users from reviewing places they own or reviewing a place multiple times.
Verify that public users can access the
PUBLIC
endpoints without a JWT token.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
Flask-JWT-Extended Documentation:
Flask-JWT-Extended
Testing REST APIs with cURL:
Everything cURL
Expected Outcome
By the end of this task, the following endpoints will be secured, allowing only authenticated users to perform actions based on their ownership of places and reviews:
Create, update, and delete places (with ownership checks).
Create and update reviews (with restrictions on reviewing owned places and duplicate reviews).
Modify user details (excluding email and password).
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part3
Score of the task
10
/10
pts
100.0%
0
correction requests
QA Review
×
3. Implement Authenticated User Access Endpoints
Commit used:
User:
---
URL:
Click here
ID:
---
Author:
---
Subject:
---
Date:
---
×
Students who are done with "3. Implement Authenticated User Access Endpoints"
```

</details>

<details>
<summary>4. Implement Administrator Access Endpoints</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part3`

**Task details:**

```text
4. Implement Administrator Access Endpoints
Objective
Restrict access to specific API endpoints so that only users with administrative privileges can perform certain actions. These actions include creating new users, modifying any user's details (including email and password), and adding or modifying amenities. Additionally, administrators can perform the same tasks as authenticated users without being restricted by ownership of places and reviews.
Context
Role-based access control (RBAC) is crucial in API security. Administrators have the highest level of privileges, and this task will allow them to bypass restrictions that regular users face. This includes the ability to manage any user or resource in the system.
In this task, you will:
Implement logic for restricting access to specific endpoints based on the user's role (
is_admin
).
Ensure that administrators can manage user accounts, including creating and modifying user details.
Allow administrators to bypass ownership restrictions for places and reviews.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
Flask-JWT-Extended Documentation:
Flask-JWT-Extended
Bcrypt Documentation:
Flask-Bcrypt
Expected Outcome
By the end of this task, admins will be able to:
Create new users.
Modify any user’s data, including email and password (with validation for unique emails).
Add and modify amenities.
Bypass ownership restrictions on places and reviews.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part3
Score of the task
10
/10
pts
100.0%
0
correction requests
QA Review
×
4. Implement Administrator Access Endpoints
Commit used:
User:
---
URL:
Click here
ID:
---
Author:
---
Subject:
---
Date:
---
×
Students who are done with "4. Implement Administrator Access Endpoints"
```

</details>

<details>
<summary>5. Implement SQLAlchemy Repository</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part3`

**Task details:**

```text
5. Implement SQLAlchemy Repository
Objective
Replace the in-memory repository with a SQLAlchemy-based repository for persistence. In this task, you will create the
SQLAlchemyRepository
and integrate it into the project for managing database interactions. This task will lay the foundation for further model mapping and database setup in subsequent tasks.
Context
In the previous parts of the project, the persistence layer was managed using an in-memory repository. This task introduces SQLAlchemy to persist data in an SQLite database during development, preparing the application for a production-ready relational database. The repository pattern remains the same, but the implementation will now interact with SQLAlchemy for all CRUD operations. Due to the fact that the database has not yet been initialized, this task focuses only on creating the repository. Model mapping and database initialization will follow in the next task.
You will:
Create the SQLAlchemy repository that implements the existing repository interface.
Refactor the existing Facade to utilize the SQLAlchemy-based repository for user operations.
Provide code and detailed instructions for integration, but no database initialization will be performed yet.
Read this guide before start:
Transitioning from In-Memory to Database Persistence: A Step-by-Step Guide
Instructions
->
Find the detailed instructions for this task here
<-
Resources
SQLAlchemy Documentation:
SQLAlchemy
Flask-SQLAlchemy Documentation:
Flask-SQLAlchemy
Expected Outcome
By the end of this task, you will have implemented the
SQLAlchemyRepository
and refactored the Facade to use this new repository for data persistence. However, since the model mapping and database initialization will be performed in the next task, the actual integration testing will be delayed until the next step.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part3
Score of the task
10
/10
pts
100.0%
0
correction requests
QA Review
×
5. Implement SQLAlchemy Repository
Commit used:
User:
---
URL:
Click here
ID:
---
Author:
---
Subject:
---
Date:
---
×
Students who are done with "5. Implement SQLAlchemy Repository"
```

</details>

<details>
<summary>6. Map the User Entity to SQLAlchemy Model</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part3`

**Task details:**

```text
6. Map the User Entity to SQLAlchemy Model
Objective
Map the
User
entity to a SQLAlchemy model, ensuring the correct database relationships, attribute definitions, and CRUD operations are implemented. You will incorporate the ORM functionality within the repository layer, service layer (Facade), and API layer for full integration. The password hashing mechanism from the previous task should remain functional.
Context
In the previous task, the repository was updated to use SQLAlchemy for database persistence, replacing the in-memory repository. This task extends that functionality by mapping the
User
entity to the database using SQLAlchemy. The new
UserRepository
will be responsible for handling user-specific queries, enhancing the flexibility and maintainability of the application.
As we're also using a BaseClass to handle the common attributes for all the Business Logic classes, we'll update this class first to manage the mapping.
In this task, you will:
Map the
BaseModel
class to a SQLAlchemy model, including the
id
,
created_at
and
updated_at
attributes.
Map the
User
entity to a SQLAlchemy model, including attributes like
first_name
,
last_name
,
email
,
password
, and
is_admin
.
Implement the
UserRepository
class to interact with the database using SQLAlchemy.
Refactor the
Facade
to use the
UserRepository
for user-related operations.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
SQLAlchemy Documentation:
SQLAlchemy
Flask-SQLAlchemy Documentation:
Flask-SQLAlchemy
Flask-Bcrypt Documentation:
Flask-Bcrypt
Testing REST APIs with cURL:
Everything cURL
Expected Outcome
By the end of this task, the
User
entity will be fully mapped to a SQLAlchemy model, and the repository pattern will be updated to interact with the database using SQLAlchemy. You will have refactored the
Facade
to use the new
UserRepository
, and the application will now store user data in the database persistently.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part3
Score of the task
10
/10
pts
100.0%
0
correction requests
QA Review
×
6. Map the User Entity to SQLAlchemy Model
Commit used:
User:
---
URL:
Click here
ID:
---
Author:
---
Subject:
---
Date:
---
×
Students who are done with "6. Map the User Entity to SQLAlchemy Model"
```

</details>

<details>
<summary>7. Map the Place, Review, and Amenity Entities</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part3`

**Task details:**

```text
7. Map the Place, Review, and Amenity Entities
Objective
Map the
Place
,
Review
, and
Amenity
entities to SQLAlchemy models. This task requires you to apply the knowledge gained from mapping the
User
entity in the previous task to these new entities. You will implement the core database attributes for each entity, and in subsequent tasks, relationships between entities will be defined. No relationships between these entities should be added at this point.
Context
In the previous tasks, you mapped the
User
entity and implemented the
UserRepository
to interact with the database through SQLAlchemy. Now, you will extend this mapping to the
Place
,
Review
, and
Amenity
entities. These mappings will prepare the foundation for the relationships that will be added later between places, reviews, amenities, and users.
In this task, you will:
Map the core attributes for
Place
,
Review
, and
Amenity
entities.
Ensure that each entity has basic CRUD functionality through the repository pattern.
Follow the same process you used to map the
User
entity in the previous tasks.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
SQLAlchemy Documentation:
SQLAlchemy
Flask-SQLAlchemy Documentation:
Flask-SQLAlchemy
SQLAlchemy Relationship Patterns:
SQLAlchemy ORM Relationships
Expected Outcome
By the end of this task, you should have mapped the
Place
,
Review
, and
Amenity
entities to SQLAlchemy models, ensuring that their basic attributes are stored in the database. The repositories and facade methods should be updated to handle CRUD operations for each entity. No relationships between entities should be implemented yet; this will be done in a later task.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part3
Score of the task
10
/10
pts
100.0%
0
correction requests
QA Review
×
7. Map the Place, Review, and Amenity Entities
Commit used:
User:
---
URL:
Click here
ID:
---
Author:
---
Subject:
---
Date:
---
×
Students who are done with "7. Map the Place, Review, and Amenity Entities"
```

</details>

<details>
<summary>8. Map Relationships Between Entities Using SQLAlchemy</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part3`

**Task details:**

```text
8. Map Relationships Between Entities Using SQLAlchemy
Objective
Map the relationships between the entities using SQLAlchemy. You will define both one-to-many and many-to-many relationships and apply the appropriate constraints and foreign keys in the models. This task will serve as a foundation for linking related data in your application.
Context
Now that you have defined the core entities like
User
,
Place
,
Review
, and
Amenity
, it's time to establish relationships between these entities. These relationships reflect the connections between the real-world concepts represented by the entities (e.g., a
User
can own many
Places
, a
Place
can have many
Reviews
). Defining relationships in the database ensures that related data can be easily queried and manipulated in a structured way.
In this task, you will define relationships between the entities, using SQLAlchemy’s ORM capabilities. Relationships like "one-to-many" and "many-to-many" allow for a clear and efficient organization of data, enforcing the logical structure of the database.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
SQLAlchemy Documentation:
SQLAlchemy
Flask-SQLAlchemy Documentation:
Flask-SQLAlchemy
SQLAlchemy Relationship Patterns:
SQLAlchemy ORM Relationships
Expected Outcome
By the end of this task, you will have successfully mapped the relationships between entities using SQLAlchemy. These relationships will ensure data integrity and allow efficient querying of related data, enabling complex operations such as retrieving all reviews for a place or all places owned by a user. The correct use of
relationship()
,
backref
, and foreign keys will establish clear, bidirectional links between your entities.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part3
Score of the task
10
/10
pts
100.0%
0
correction requests
QA Review
×
8. Map Relationships Between Entities Using SQLAlchemy
Commit used:
User:
---
URL:
Click here
ID:
---
Author:
---
Subject:
---
Date:
---
×
Students who are done with "8. Map Relationships Between Entities Using SQLAlchemy"
```

</details>

<details>
<summary>9. SQL Scripts for Table Generation and Initial Data</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part3`

**Task details:**

```text
9. SQL Scripts for Table Generation and Initial Data
Objective
Create SQL scripts to generate the entire database schema for the HBnB project and populate it with initial data. The scripts should include all tables and relationships necessary to reflect the project’s model and insert the required initial data.
Context
In this task, you will focus on designing the database schema using raw SQL to generate tables and insert initial data. This includes creating tables for
User
,
Place
,
Review
,
Amenity
, and their relationships. The purpose of this task is to practice defining databases independently of any ORM, ensuring you understand how to design tables and relationships at the SQL level.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
SQL Tutorial for Beginners
:
W3Schools SQL Tutorial
Expected Outcome
By the end of this task, you should have:
SQL scripts that generate the full database schema.
Inserted an administrator user and amenities into the database.
Tested CRUD operations to verify correct functionality of the schema and data.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part3
Score of the task
10
/10
pts
100.0%
0
correction requests
QA Review
×
9. SQL Scripts for Table Generation and Initial Data
Commit used:
User:
---
URL:
Click here
ID:
---
Author:
---
Subject:
---
Date:
---
×
Students who are done with "9. SQL Scripts for Table Generation and Initial Data"
```

</details>

<details>
<summary>10. Generate Database Diagrams</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part3`

**Task details:**

```text
10. Generate Database Diagrams
Objective
Create Entity-Relationship (ER) diagrams to visually represent the structure of the database schema for the HBnB project using
Mermaid.js
. This task will help ensure that the database schema is accurately reflected and consistent with previous parts of the project. Students will use Mermaid.js to visualize tables and their relationships in a readable format.
Context
Visualizing database relationships is crucial for understanding the connections between entities. ER diagrams provide a high-level overview of the database's structure and serve as an essential reference for further development or debugging. Mermaid.js is a tool that allows you to create these diagrams in markdown-like syntax, making it easy to integrate them into documentation and collaboration platforms like GitHub or GitLab.
In this task, you will:
Learn to use Mermaid.js to create ER diagrams.
Generate diagrams that represent the
User
,
Place
,
Review
,
Amenity
, and
Place_Amenity
tables, along with their relationships.
Ensure consistency in the schema visualization, using Mermaid.js as the primary tool for diagram generation.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
Mermaid.js Documentation
:
Mermaid.js Official Docs
Live Mermaid.js Editor
:
Mermaid Live Editor
SQLAlchemy Relationship Documentation
:
SQLAlchemy ORM Relationships
Expected Outcome
By the end of this task, you should have:
Created an ER diagram in Mermaid.js that accurately represents the database schema for HBnB.
Understood the various types of relationships (one-to-many, many-to-many) and how they are represented visually.
Exported the diagram to be included in your project documentation.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part3
Score of the task
10
/10
pts
100.0%
0
correction requests
QA Review
×
10. Generate Database Diagrams
Commit used:
User:
---
URL:
Click here
ID:
---
Author:
---
Subject:
---
Date:
---
×
Students who are done with "10. Generate Database Diagrams"
```

</details>


---

## 🧪 Testing

Use the provided task examples and Holberton checker to validate the project.

---

## 👤 Author

Project from Holberton School.

README generated with Antoine's README Factory workflow.
