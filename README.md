# Paper & Ink Bookstore

A responsive online bookstore built with React, Spring Boot, and MySQL.

**GitHub repository description:** Responsive online bookstore with React, Spring Boot, and MySQL. Includes a searchable book catalogue, account registration and login, and INR pricing.

## Screenshots

### Login
![Paper & Ink login page](./screenshots/login.png)

### Registration
![Paper & Ink registration page](./screenshots/registration.png)

### Home
![Paper & Ink home page](./screenshots/home.png)

### Catalogue
![Paper & Ink catalogue page](./screenshots/catalogue.png)

## Features

- Responsive home page, catalogue, sign-in, and registration screens.
- Signed-out visitors start on the login page; successful sign-in opens the home page.
- Catalogue category filters and title/author search.
- Book prices are shown in Indian rupees (INR).
- Add-to-bag and wishlist interactions.
- Spring Boot REST API for book listings, registration, and login.
- MySQL persistence for books and customer accounts. Passwords are stored as BCrypt hashes.
- Browser-only registration and login are available when the API is offline; passwords are stored as salted PBKDF2 hashes in browser storage. These accounts do not sync to MySQL.

## Requirements

- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8+

## Run locally

1. Start MySQL. The application connects to `jdbc:mysql://localhost:3306/bookstore_db` by default and can create the database if it does not exist.
2. From the project root, install frontend dependencies and start Vite:

   ```bash
   npm install
   npm run dev
   ```

3. In another terminal, start the API:

   ```bash
   cd backend
   mvn spring-boot:run
   ```

The website is available at `http://localhost:5173` and the REST API at `http://localhost:8080/api`.
Vite forwards `/api` requests to Spring Boot during local development.

### Database configuration

Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` environment variables to override the MySQL defaults. Hibernate creates or updates the `books` and `store_users` tables on startup. The starter catalogue is inserted or refreshed on startup, with sample prices converted using an approximate rate of ₹83 per US dollar.

### API

- `GET /api/books`
- `POST /api/auth/register` — `firstName`, `lastName`, `email`, `password`
- `POST /api/auth/login` — `email`, `password`

Registration and login return the public user profile and never return the password hash.
