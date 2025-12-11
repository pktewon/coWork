# Co-Work Project Technical Specification (Windsurf Guide)

## 1. Project Overview & Philosophy
* **Context:** Migration and scaling of the legacy `example2` project into an Enterprise-grade SaaS Collaboration Tool.
* **Core Philosophy:**
    1.  **Layered Architecture:** Strict separation of Controller, Service, and Repository.
    2.  **Domain-Driven Packaging:** All related classes (Entity, Repo, Service, Controller, DTO) must be grouped by domain (`user`, `team`, `task`).
    3.  **Security First:** Stateless JWT authentication (Access Token Only) with method-level authorization.

## 2. Tech Stack & strict Constraints
* **Language:** Java 17
* **Framework:** Spring Boot 3.5+
* **Database:** MySQL 8.0 (Use InnoDB engine)
* **ORM:** Spring Data JPA
    * **Rule:** Use **JPA Method Naming Strategy** only (e.g., `findByTeamIdAndStatus`).
    * **Rule:** **Lazy Loading** is mandatory for all `@ManyToOne` and `@OneToMany` relationships.
    * **Rule:** Use `@Enumerated(EnumType.STRING)` for all Enums to ensure database readability.
* **DTO Strategy:**
    * **NEVER** return Entities directly in Controller.
    * Use inner static classes or separate DTO classes (e.g., `TaskRequest.Create`, `TaskResponse.Detail`).
    * Use `@Builder` or static factory methods (`from()`, `of()`) for Entity <-> DTO conversion.
* **Testing:**
    * JUnit 5 + Mockito.
    * Service layer must have unit tests covering "Success" and "Failure" (Exception) scenarios.

## 3. Package Structure
```text
src/main/java/com/cowork/
├── global/
│   ├── config/                 # WebConfig(CORS), SwaggerConfig, SecurityConfig
│   ├── jwt/                    # JwtUtil (Token generation/validation), JwtFilter
│   ├── response/               # ApiResponse<T> (Standard wrapper)
│   ├── exception/              # GlobalExceptionHandler, CustomException(ErrorCode)
│   └── entity/                 # BaseTimeEntity (createdAt, updatedAt)
│
├── domain/
│   ├── user/
│   │   ├── dto/                # LoginRequest, SignupRequest, UserResponse
│   │   ├── entity/             # User.java
│   │   ├── repository/         # UserRepository.java
│   │   └── service/            # UserService.java (Login/Signup logic)
│   ├── team/                   # (Follow same structure)
│   └── task/                   # (Follow same structure)
└── CoworkApplication.java
4. Database Schema & Entity Rules (Detailed)
Common
All Entities must extend BaseTimeEntity (JPA Auditing).

A. Users (users)
id: BigInt, PK, Auto Increment

login_id: Varchar(50), UK, Not Null

password: Varchar(255), Not Null (BCrypt encoded)

nickname: Varchar(50), Not Null

role: Enum(USER, ADMIN), Not Null (Annotate with @Enumerated(EnumType.STRING))

B. Teams (teams)
id: BigInt, PK

name: Varchar(100), Not Null

description: Text

deleted_at: DateTime (Nullable) -> Implement Soft Delete logic in Service

C. TeamMembers (team_members)
Constraints: Unique Index on (user_id, team_id) to prevent duplicate joining.

role: Enum(LEADER, MEMBER), @Enumerated(EnumType.STRING)

user: @ManyToOne(fetch = LAZY)

team: @ManyToOne(fetch = LAZY)

D. Tasks (tasks)
id: BigInt, PK

team: @ManyToOne(fetch = LAZY)

worker: @ManyToOne(fetch = LAZY) (Targeting User)

parent: @ManyToOne(fetch = LAZY) (Nullable, Self-Reference for Subtasks)

title: Varchar(200), Not Null

status: Enum(TODO, IN_PROGRESS, DONE), Default TODO

priority: Enum(LOW, MEDIUM, HIGH), Default MEDIUM

deadline: DateTime

version: Long (Annotate with @Version for Optimistic Locking)

5. Security & Configuration Specs
SecurityConfig
Session Policy: SessionCreationPolicy.STATELESS

Access Control:

Public: /api/auth/** (Login, Join), /swagger-ui/**, /v3/api-docs/**

Private: All other endpoints require authentication.

CORS: Allow http://localhost:3000 (React Frontend). Allow Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS.

application.yml (Template)
YAML

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cowork?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
    username: root
    password: (YOUR_PASSWORD)
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        format_sql: true
        show_sql: true
6. Implementation Roadmap
Setup Phase: Project init, Dependencies (Lombok, Validation, Security, JWT, MySQL), Global Configs.

Domain Phase 1 (User): Auth system (Signup/Login) with JWT issue.

Domain Phase 2 (Team): Team CRUD + Member Invite logic (Leader assignment).

Domain Phase 3 (Task): Task CRUD + Optimistic Lock handling + Method Name Queries.