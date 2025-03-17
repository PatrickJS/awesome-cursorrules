---
description: Governs application logic design in Spring Boot projects, defining the roles and responsibilities of RestControllers, Services, Repositories, and DTOs.
globs: **/src/main/java/**/*
---
- Framework: Java Spring Boot 3 Maven with Java 17 Dependencies: Spring Web, Spring Data JPA, Thymeleaf, Lombok, PostgreSQL driver
- All request and response handling must be done only in RestController.
- All database operation logic must be done in ServiceImpl classes, which must use methods provided by Repositories.
- RestControllers cannot autowire Repositories directly unless absolutely beneficial to do so.
- ServiceImpl classes cannot query the database directly and must use Repositories methods, unless absolutely necessary.
- Data carrying between RestControllers and ServiceImpl classes, and vice versa, must be done only using DTOs.
- Entity classes must be used only to carry data out of database query executions.