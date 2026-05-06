# ðŸ“˜ HBnB - BL and API

## ðŸ“Œ Description

### Part 2: Implementation of Business Logic and API Endpoints



In this part of the HBnB Project, you will begin the implementation phase of the application based on the design developed in the previous part. The focus of this phase is to build the Presentation and Business Logic layers of the application using Python and Flask. You will implement the core functionality by defining the necessary classes, methods, and endpoints that will serve as the foundation for the applicationâ€™s operation.



In this part, you will create the structure of the project, develop the classes that define the business logic, and implement the API endpoints. The goal is to bring the documented architecture to life by setting up the key functionalities, such as creating and managing users, places, reviews, and amenities, while adhering to best practices in API design.



Itâ€™s important to note that, at this stage, you will focus only on implementing the core functionality of the API. JWT authentication and role-based access control will be addressed in the next part. The services layer will be built using Flask and the `flask-restx` extension to create RESTful APIs.



#### Objectives



By the end of this project, you should be able to:



1. **Set Up the Project Structure:**

   - Organize the project into a modular architecture, following best practices for Python and Flask applications.

   - Create the necessary packages for the Presentation and Business Logic layers.



2. **Implement the Business Logic Layer:**

   - Develop the core classes for the business logic, including User, Place, Review, and Amenity entities.

   - Implement relationships between entities and define how they interact within the application.

   - Implement the facade pattern to simplify communication between the Presentation and Business Logic layers.



3. **Build RESTful API Endpoints:**

   - Implement the necessary API endpoints to handle CRUD operations for Users, Places, Reviews, and Amenities.

   - Use `flask-restx` to define and document the API, ensuring a clear and consistent structure.

   - Implement data serialization to return extended attributes for related objects. For example, when retrieving a Place, the API should include details such as the ownerâ€™s `first_name`, `last_name`, and relevant amenities.



4. **Test and Validate the API:**

   - Ensure that each endpoint works correctly and handles edge cases appropriately.

   - Use tools like Postman or cURL to test your API endpoints.



#### Project Vision and Scope



The implementation in this part is focused on creating a functional and scalable foundation for the application. You will be working on:



- **Presentation Layer:** Defining the services and API endpoints using Flask and `flask-restx`. Youâ€™ll structure the endpoints logically, ensuring clear paths and parameters for each operation.



- **Business Logic Layer:** Building the core models and logic that drive the applicationâ€™s functionality. This includes defining relationships, handling data validation, and managing interactions between different components.



At this stage, you wonâ€™t need to worry about user authentication or access control. However, you should ensure that the code is modular and organized, making it easy to integrate these features in Part 3.



#### Learning Objectives



This part of the project is designed to help you achieve the following learning outcomes:



1. **Modular Design and Architecture:** Learn how to structure a Python application using best practices for modularity and separation of concerns.

2. **API Development with Flask and flask-restx:** Gain hands-on experience in building RESTful APIs using Flask, focusing on creating well-documented and scalable endpoints.

3. **Business Logic Implementation:** Understand how to translate documented designs into working code, implementing core business logic in a structured and maintainable manner.

4. **Data Serialization and Composition Handling:** Practice returning extended attributes in API responses, handling nested and related data in a clear and efficient way.

5. **Testing and Debugging:** Develop skills in testing and validating APIs, ensuring that your endpoints handle requests correctly and return appropriate responses.



#### Recommended Resources



1. **Flask and flask-restx Documentation:**

   - [Flask Official Documentation](https://flask.palletsprojects.com/en/stable/)

   - [flask-restx Documentation](https://flask-restx.readthedocs.io/en/latest/)



2. **RESTful API Design Best Practices:**

   - [Best Practices for Designing a Pragmatic RESTful API](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api)

   - [REST API Tutorial](https://restfulapi.net/)



3. **Python Project Structure and Modular Design:**

   - [Structuring Your Python Project](https://docs.python-guide.org/writing/structure/)

   - [Modular Programming with Python](https://realpython.com/python-modules-packages/)



4. **Facade Design Pattern:**

   - [Facade Pattern in Python](https://refactoring.guru/design-patterns/facade/python/example)



This introduction sets the stage for the implementation phase of the project, where you will focus on bringing the documented design to life through well-structured code. The tasks ahead will challenge you to apply object-oriented principles, build scalable APIs, and think critically about how different components of the application interact.

---

## ðŸ“š Resources

_No resources detected._

---

## ðŸŽ¯ Learning Objectives

_No learning objectives detected._

---

## âœ… Requirements

_No requirements detected._

---

## âš™ï¸ Setup

_No specific setup detected._

---

## ðŸ§  Quiz

_No quiz detected in the exported HTML._


---

## ðŸ§© Tasks

<details>
<summary>0. Project Setup and Package Initialization</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part2`

**Task details:**

```text
0. Project Setup and Package Initialization
Objective
Set up the initial project structure for the HBnB application, ensuring the codebase is organized according to best practices for a modular Python application. The focus is on creating the necessary folders, packages, and files for the Presentation, Business Logic, and Persistence layers while preparing the code to integrate the Facade pattern. Although the Persistence layer will be fully implemented in Part 3 using SQL Alchemy, this task includes setting up the structure and providing the complete implementation of an in-memory repository to handle object storage and validation.
Context
Before diving into the implementation of the business logic and API endpoints, itâ€™s essential to have a well-organized project structure. A clear and modular organization will help maintain the codebase, make it easier to integrate new features, and ensure that your application is scalable. Additionally, to simplify the implementation, you are provided with the complete in-memory repository code. This repository will later be replaced by a database-backed solution in Part 3.
In this task, you will:
Set up the structure for the Presentation, Business Logic, and Persistence layers.
Prepare the project to use the Facade pattern for communication between layers.
Implement the in-memory repository to handle object storage and validation.
Plan for future integration of the Persistence layer, even though it wonâ€™t be fully implemented in this part.
Instructions
->
Find the detailed instructions for this task here
<-
Expected Outcome
By the end of this task, you should have a well-organized project structure that accommodates the Presentation, Business Logic, and Persistence layers. The codebase should be modular and easy to maintain, with a clear separation of concerns. Youâ€™ll also have a functional Flask application that is ready to integrate API endpoints, business logic, and persistence in the upcoming tasks.
The in-memory repository and Facade pattern are now set up to streamline communication between layers. While the persistence layer is only using in-memory storage at this stage, it is designed to be easily replaced with a database-backed solution in Part 3.
Resources
Flask Documentation:
https://flask.palletsprojects.com/en/stable/
Flask-RESTx Documentation:
https://flask-restx.readthedocs.io/en/latest/
Python Project Structure Best Practices:
https://docs.python-guide.org/writing/structure/
Facade Design Pattern in Python:
https://refactoring.guru/design-patterns/facade/python/example
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part2
Score of the task
10
/10
pts
100.0%
0
correction requests
QA Review
Ã—
0. Project Setup and Package Initialization
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
Ã—
Students who are done with "0. Project Setup and Package Initialization"
```

</details>

<details>
<summary>1. Core Business Logic Classes</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part2`

**Task details:**

```text
1. Core Business Logic Classes
Objective
Implement the core business logic classes that define the entities of the HBnB application, including the necessary attributes, methods, and relationships. This task focuses on creating the fundamental models (User, Place, Review, and Amenity) while considering the design choices made by students in Part 1.
Context
In Part 1, students designed the Business Logic layer, including defining entities and relationships. This task requires you to implement those designs while adhering to best practices for modular, maintainable code. You may have already created base classes with common attributes (e.g.,
id
,
created_at
, and
updated_at
) to be inherited by concrete classes such as
User
,
Place
,
Review
, and
Amenity
.
In this task, you will:
Implement the classes based on your Part 1 design.
Ensure relationships between entities are correctly implemented.
Handle attribute validation and updates according to the requirements.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
Python OOP Basics:
https://realpython.com/python3-object-oriented-programming/
Designing Classes and Relationships:
https://docs.python.org/3/tutorial/classes.html
Why You Should Use UUIDs:
https://datatracker.ietf.org/doc/html/rfc4122
Expected Outcome
By the end of this task, you should have fully implemented core business logic classes (User, Place, Review, Amenity) with the appropriate attributes, methods, and relationships. With these components in place, you will be ready to proceed to implementing the API endpoints in the next task. The implemented classes should support the necessary validation, relationships, and data integrity checks required for the applicationâ€™s core functionality. Additionally, the relationships between entities should be fully operational, allowing seamless interactions like linking reviews to places or associating amenities with places.
With this solid foundation in place, the business logic will be prepared for further integration with the Presentation and Persistence layers in subsequent tasks.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part2
Score of the task
9
/10
pts
90.0%
0
correction requests
QA Review
Ã—
1. Core Business Logic Classes
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
Ã—
Students who are done with "1. Core Business Logic Classes"
```

</details>

<details>
<summary>2. User Endpoints</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part2`

**Task details:**

```text
2. User Endpoints
Objective
Implement the API endpoints needed for managing users in the HBnB application. This task involves setting up CRUD operations (Create, Read, Update) for users, ensuring that these endpoints are integrated with the Business Logic layer. The
DELETE
operation will
not
be implemented for users in this part of the project. Additionally, when retrieving user data, the password should
not
be included in the response. The API interface, return format, and status codes must be clearly defined since black-box testing will be performed later.
In this task, the full implementation for user creation (POST) and retrieval (GET) by ID is provided as a guide. You will be responsible for implementing the retrieval of the list of users (GET /api/v1/users/) and updating user information (PUT /api/v1/users/
). The approach for the remaining endpoints follows similar principles and should be implemented analogously. The same applies to the other entities (e.g., Place, Review, Amenity).
In this task, you will:
Set up the
POST
,
GET
, and
PUT
endpoints for managing users.
Implement the logic for handling user-related operations in the Business Logic layer.
Integrate the Presentation layer (API) and Business Logic layer, utilizing the repository pattern.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
Flask-RESTx Documentation:
https://flask-restx.readthedocs.io/en/latest/
Testing REST APIs with cURL:
https://everything.curl.dev/
Designing RESTful APIs:
https://restfulapi.net/
Expected Outcome
By the end of this task, you should have fully implemented the core user management endpoints, including the ability to create, read, and update users. The
DELETE
operation will not be implemented for users in this part. The provided implementation guide for the user registration endpoint should serve as a model for implementing the remaining user endpoints as well as endpoints for other entities (e.g., Place, Review, Amenity). The functionality should be documented and tested, ensuring that all user-related operations are handled smoothly within the HBnB application.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part2
Score of the task
8
/10
pts
80.0%
0
correction requests
QA Review
Ã—
2. User Endpoints
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
Ã—
Students who are done with "2. User Endpoints"
```

</details>

<details>
<summary>3. Amenity Endpoints</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part2`

**Task details:**

```text
3. Amenity Endpoints
Objective
Implement the API endpoints required for managing amenities in the HBnB application. This task involves setting up the endpoints to handle CRUD operations (Create, Read, Update) for amenities, while ensuring integration with the Business Logic layer via the Facade pattern. The
DELETE
operation will not be implemented for amenities in this part of the project.
In this task, you will:
Set up the
POST
,
GET
, and
PUT
endpoints for managing amenities.
Implement the necessary logic for handling amenity-related operations in the Business Logic layer.
Integrate the Presentation layer (API) and Business Logic layer through the Facade.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
Flask-RESTx Documentation:
https://flask-restx.readthedocs.io/en/latest/
Testing REST APIs with cURL:
https://everything.curl.dev/
Designing RESTful APIs:
https://restfulapi.net/
Expected Outcome
By the end of this task, you should have fully implemented the core amenity management endpoints, including the ability to create, read, and update amenities. The
DELETE
operation will not be implemented for amenities in this part. The provided placeholders should guide you in implementing the logic based on the example provided for user registration. The functionality should be documented and tested, ensuring that all amenity-related operations are handled smoothly within the HBnB application.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part2
Score of the task
8
/10
pts
80.0%
0
correction requests
QA Review
Ã—
3. Amenity Endpoints
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
Ã—
Students who are done with "3. Amenity Endpoints"
```

</details>

<details>
<summary>4. Place Endpoints</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part2`

**Task details:**

```text
4. Place Endpoints
Objective
Implement the API endpoints needed for managing places in the HBnB application. This task involves setting up CRUD operations (Create, Read, Update) for places, ensuring that these endpoints are integrated with the Business Logic layer through the Facade pattern. The
DELETE
operation will
not
be implemented for places in this part of the project.
Given that the
Place
entity has relationships with other entities, such as
User
(owner) and
Amenity
, youâ€™ll need to handle these relationships carefully while maintaining the integrity of the application logic. The
Review
entity will be implemented in the next task, so it should not be included in this task.
In this task, you will:
Set up the
POST
,
GET
, and
PUT
endpoints for managing places.
Implement the logic for handling place-related operations in the Business Logic layer.
Integrate the Presentation layer (API) and Business Logic layer through the Facade.
Implement validation for specific attributes like
price
,
latitude
, and
longitude
.
Ensure that related data such as
owner
details and
amenities
are properly handled and returned with the Place data.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
Flask-RESTx Documentation:
https://flask-restx.readthedocs.io/en/latest/
Testing REST APIs with cURL:
https://everything.curl.dev/
Designing RESTful APIs:
https://restfulapi.net/
Expected Outcome
By the end of this task, you should have implemented the core place management endpoints, including the ability to create, read, and update places. The
DELETE
operation will not be implemented for places in this part. You will have handled the relationships between places, owners, and amenities, including validating specific attributes like price, latitude, and longitude. The functionality should be documented and tested, ensuring smooth operation within the HBnB application.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part2
Score of the task
9
/10
pts
90.0%
0
correction requests
QA Review
Ã—
4. Place Endpoints
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
Ã—
Students who are done with "4. Place Endpoints"
```

</details>

<details>
<summary>5. Review Endpoints</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part2`

**Task details:**

```text
5. Review Endpoints
Objective
Implement the API endpoints needed for managing reviews in the HBnB application. This task involves setting up CRUD operations (Create, Read, Update, Delete) for reviews, ensuring that these endpoints are integrated with the Business Logic layer through the Facade pattern. The
DELETE
operation
will
be implemented for reviews, making it the only entity for which deletion is supported in this part of the project.
In this task, you will:
Set up the
POST
,
GET
,
PUT
, and
DELETE
endpoints for managing reviews.
Implement the logic for handling review-related operations in the Business Logic layer.
Integrate the Presentation layer (API) and Business Logic layer through the Facade.
Implement validation for specific attributes like the text of the review and ensure that the review is associated with both a user and a place.
Update the Place model in
api/v1/places.py
to include the collection of reviews for a place.
Instructions
->
Find the detailed instructions for this task here
<-
Resources
Flask-RESTx Documentation:
https://flask-restx.readthedocs.io/en/latest/
Testing REST APIs with cURL:
https://everything.curl.dev/
Designing RESTful APIs:
https://restfulapi.net/
Expected Outcome
By the end of this task, you should have implemented the core review management endpoints, including the ability to create, read, update, and delete reviews. Additionally, you will have implemented the ability to retrieve all reviews associated with a specific place. The
DELETE
operation is introduced here to allow students to practice implementing this functionality for the first time. The functionality should be documented and tested, ensuring that all review-related operations are handled smoothly within the HBnB application.
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part2
Score of the task
9.3
/10
pts
93.0%
0
correction requests
QA Review
Ã—
5. Review Endpoints
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
Ã—
Students who are done with "5. Review Endpoints"
```

</details>

<details>
<summary>6. Testing and Validation</summary>

**Repository:** `holbertonschool-hbnb`

**Directory:** `part2`

**Task details:**

```text
6. Testing and Validation
Objective
This task involves creating and running tests for the endpoints you have developed so far. You will implement validation logic, perform thorough testing using
cURL
, and document the results of those tests. The focus is on ensuring that each endpoint works as expected and adheres to the input/output formats, status codes, and validation rules you have defined in previous tasks.
In this task, you will:
Implement basic validation checks for each of the attributes in your endpoints.
Perform black-box testing using
cURL
and the Swagger documentation generated by Flask-RESTx.
Create a detailed testing report, highlighting both successful and failed cases.
Instructions
->
Find the detailed instructions for this task here
<-
Expected Outcome
By the end of this task, you should have:
Implemented basic validation for all entity models.
Performed thorough testing using cURL and other tools.
Generated Swagger documentation to confirm that your API is correctly described.
Created and executed unit tests using
unittest
or
pytest
.
Documented the testing process, highlighting both successful cases and edge cases that were handled correctly.
This task combines both manual and automated testing while guiding students to validate and thoroughly test their implementation. Let me know if any additional information is needed!
Repo:
GitHub repository:
holbertonschool-hbnb
Directory:
part2
Score of the task
10
/10
pts
100.0%
0
correction requests
QA Review
Ã—
6. Testing and Validation
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
Ã—
Students who are done with "6. Testing and Validation"
```

</details>


---

## ðŸ§ª Testing

Use the provided task examples and Holberton checker to validate the project.

---

## ðŸ‘¤ Author

Project from Holberton School.

README generated with Antoine's README Factory workflow.
