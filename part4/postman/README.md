# 🧪 API Testing Guide

This document explains how to reset the demo data, start the API, run the Postman test suite, and interpret the results.

---

## 📌 Purpose

The goal of this test workflow is to validate that the API behaves correctly across:

- authentication
- permissions
- CRUD operations
- input validation
- edge cases
- integration scenarios
- cascade deletion behavior

The Postman collection acts as a **non-regression suite** for the project.

---

## 📂 Required files

Make sure you have the following files available:

```text
postman/
├── HBnB_API_Exhaustive_Postman_Collection.json
└── HBnB_API_Local_Environment.json
```

---

## 🔄 Step 1 — Reset demo data and start the project

Before running the Postman collection, always reset the demo data and restart the application.

From the `part4` directory, run:

```bash
./hbnb.sh all
```

This command is expected to:

- reset the demo data
- start the Flask API
- start the front-end server

This step is important because the Postman collection creates and deletes resources during execution.  
Without a clean reset, previous runs may pollute the database and produce false failures.

---

## 🚀 Step 2 — Verify that the API is running

Before opening Postman, verify that the API responds correctly.

Example:

```bash
curl http://127.0.0.1:5000/api/v1/
```

Expected result:

- the API responds
- no startup traceback appears in the terminal
- no import or syntax errors are present

If the API does not start properly, do **not** launch the collection yet.

---

## 📮 Step 3 — Open Postman

Use **Postman Desktop** if possible.

Then:

1. import the collection file:
   - `HBnB_API_Exhaustive_Postman_Collection.json`
2. import the environment file:
   - `HBnB_API_Local_Environment.json`
3. select the environment:
   - **HBnB Local API**

---

## ⚙️ Step 4 — Check the local environment

Make sure the environment contains the correct local values.

Typical required values:

```text
baseUrl = http://127.0.0.1:5000
adminEmail = antoine.gousset@hbnb.test
adminPassword = Test1234!
seededUserEmail = sebastien.vallier@hbnb.test
seededUserPassword = Test1234!
nonexistentUuid = 00000000-0000-0000-0000-000000000000
```

Important:

- do **not** manually fill dynamic IDs or tokens
- the collection generates and stores them automatically during execution

Examples of variables that should remain automatic:

```text
adminToken
ownerToken
reviewerToken
placeId
reviewId
amenityId
```

---

## ▶️ Step 5 — Run the full collection

Run the **entire collection**, not a single folder in isolation.

Recommended order:

```text
00 - Bootstrap & Public checks
01 - Users
02 - Amenities
03 - Places
04 - Reviews
05 - Integration & cascade
```

This order matters because later requests depend on data created by earlier requests.

---

## ✅ What a green run means

A fully green run means the API passed the complete validation suite.

Expected result:

```text
142 passed
0 failed
0 errors
```

A green run indicates that the API is behaving correctly for the scenarios covered by the collection, including:

- public endpoints
- protected endpoints
- admin-only operations
- owner restrictions
- review permissions
- invalid payload rejection
- duplicate prevention
- cascade deletion

It does **not** mean the project is perfect, but it does mean the tested behavior is coherent and stable.

---

## ❌ What to do if tests fail

If one or more tests fail:

1. open the failed request
2. read the expected status code
3. compare it with the actual status code
4. inspect the response body
5. check the Flask terminal logs
6. fix one issue at a time

Do not start patching multiple files blindly.

---

## ⚠️ Common causes of false failures

A failed run does not always mean the backend is broken.

Frequent causes:

- API not started
- wrong `baseUrl`
- wrong seed credentials
- stale database state
- collection re-run without reset
- wrong Postman environment selected

If many tests fail at once, reset the data and restart the project before investigating deeper.

---

## 🧼 Recommended workflow

Use this workflow every time:

```text
1. Stop the running servers
2. Run ./hbnb.sh all
3. Verify the API is available
4. Open Postman
5. Select HBnB Local API
6. Run the full collection
7. Inspect failures only if needed
```

---

## 🛡️ Why this matters

This testing setup gives the project:

- repeatability
- faster debugging
- confidence before code changes
- safer refactoring
- proof that the API has been seriously tested

It also makes it much easier to detect regressions after modifying routes, permissions, validation rules, or business logic.

---

## 📎 Notes

- Always reset before a full run
- Always use the correct local environment
- Always run the complete collection for a reliable validation
- Treat this suite as a regression safety net for the API

---
