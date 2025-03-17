---
description: Defines the structure and implementation of service classes, enforcing the use of interfaces, ServiceImpl classes, DTOs for data transfer, and transactional management.
globs: **/src/main/java/com/example/services/*.java
---
- Service classes must be of type interface.
- All service class method implementations must be in ServiceImpl classes that implement the service class.
- All ServiceImpl classes must be annotated with @Service.
- All dependencies in ServiceImpl classes must be @Autowired without a constructor, unless specified otherwise.
- Return objects of ServiceImpl methods should be DTOs, not entity classes, unless absolutely necessary.
- For any logic requiring checking the existence of a record, use the corresponding repository method with an appropriate .orElseThrow lambda method.
- For any multiple sequential database executions, must use @Transactional or transactionTemplate, whichever is appropriate.