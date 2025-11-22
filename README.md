# Library Management System

A comprehensive web-based Library Management System built with Spring Boot and Thymeleaf. This application provides a complete solution for managing books, students, allotments, vendors, publications, and subscriptions in a library environment.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Known Issues](#-known-issues)
- [Future Improvements](#-future-improvements)

## ✨ Features

- **User Authentication**: Login and signup with session management
- **Dashboard**: Real-time statistics and activity tracking
- **Book Management**: Full CRUD operations with inventory tracking
- **Student Management**: Manage student records with roll numbers and contact info
- **Allotment System**:
  - Book allotment with automatic fine calculation (20 taka/day)
  - Maximum 3 active books per student
  - 14-day loan period
  - Return book functionality
- **Vendor & Publication Management**: Track suppliers and publishers
- **Subscription Management**: Handle student subscriptions
- **Activity Logging**: Track all system activities (CRUD, login, logout)
- **Responsive Design**: Modern UI with Tailwind CSS

## 🛠 Technology Stack

**Backend:**

- Java 25
- Spring Boot 3.5.7
- Spring Web MVC
- Thymeleaf
- Lombok

**Frontend:**

- HTML5 + Thymeleaf Templates
- Tailwind CSS
- Vanilla JavaScript

**Build Tool:**

- Maven

## 🚀 Quick Start

1. **Prerequisites**: JDK 25, Maven 3.6+
2. **Clone and Run**:
   ```bash
   git clone <repository-url>
   cd LibraryManagementSystem
   ./mvnw spring-boot:run
   ```
3. **Access**: Open http://localhost:1111
4. **Login**: Use dummy data or create a new account

## 📦 Installation

### Prerequisites

- Java Development Kit (JDK) 25
- Maven 3.6+ (or use included Maven Wrapper)
- Modern web browser

### Steps

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd LibraryManagementSystem
   ```
2. **Configure application properties**:

   Create a file named `application.properties` in `src/main/resources/` with the following content:

   ```properties
   spring.application.name=LibraryManagementSystem
   server.port=1111
   ```

   This ensures your application will run on http://localhost:1111.

2. **Verify installation**:

   ```bash
   java -version
   ./mvnw -version
   ```

3. **Run the application**:

   ```bash
   # Using Maven Wrapper (Recommended)
   ./mvnw spring-boot:run

   # OR using Maven
   mvn spring-boot:run

   # OR using IDE
   # Import as Maven project and run LibraryManagementSystemApplication.java
   ```

The application will start on [http://localhost:1111](http://localhost:1111).

## 📖 Usage

### Initial Setup

1. Navigate to `http://localhost:1111`
2. You'll be redirected to the login page
3. The application initializes with dummy data automatically
4. Create a new account or use existing dummy credentials

### Key Operations

**Book Management:**

- Add, edit, delete, and view books
- Track inventory (total and available copies)
- Manage authors, categories, ISBN, and purchase details

**Student Management:**

- Register students with roll numbers
- Manage contact information and departments
- Link students to subscriptions

**Allotment Management:**

- Allot books to students (max 3 active per student)
- Automatic fine calculation for overdue books
- Return books and view allotment history
- Track active, overdue, and returned allotments

**Dashboard:**

- View library statistics (books, students, allotments)
- Monitor recent system activities
- Quick overview of system status


## 🏗 Architecture

### Design Patterns

- **MVC**: Model-View-Controller separation
- **Service Layer**: Business logic separation
- **DTO Pattern**: Data transfer objects
- **Repository Pattern**: In-memory storage with `CopyOnWriteArrayList`

### Data Storage

- **In-Memory**: Thread-safe collections (`CopyOnWriteArrayList`)
- **Session Management**: `HttpSession` for authentication
- **No Database**: Data is lost on application restart

### Security

- Session-based authentication
- ⚠️ Passwords stored in plain text (security risk)

## 🐛 Known Issues

1. **Data Persistence**: All data is lost on application restart (in-memory storage)
2. **Password Security**: Passwords stored in plain text - needs hashing
3. **Input Validation**: Limited input sanitization
4. **Session Management**: Basic implementation without timeout

## 🚀 Future Improvements

### High Priority

- **Database Integration**: Replace in-memory storage with PostgreSQL/MySQL
- **Security**: Implement password hashing (BCrypt), Spring Security, CSRF protection
- **Logging**: Replace debug statements with SLF4J/Logback
- **Error Handling**: Global exception handler and custom exceptions

### Medium Priority

- **Testing**: Unit and integration tests
- **API Documentation**: Swagger/OpenAPI integration
- **Code Quality**: Checkstyle, PMD, SonarQube
- **Performance**: Caching, pagination, query optimization


### ✅ Implemented

- Clean MVC architecture
- Service layer pattern
- DTO pattern for data transfer
- Validation layer
- Thread-safe collections
- Error handling


## 📄 License
This project is part of an educational assignment. Please check with the project owner for licensing information.

**Note**: This is an educational project and is not intended for production use. For production deployments, please implement proper database integration and security measures.  
For project collaboration or inquiries, contact the author on [LinkedIn](https://www.linkedin.com/in/md-soyebuzaman-naim/).
