---
description: Specifies standards for RestController classes, including API route mappings, HTTP method annotations, dependency injection, and error handling with ApiResponse and GlobalExceptionHandler.
globs: **/src/main/java/com/example/controllers/*.java
---
- Must annotate controller classes with @RestController.
- Must specify class-level API routes with @RequestMapping, e.g. ("/api/user").
- Class methods must use best practice HTTP method annotations, e.g, create = @postMapping("/create"), etc.
- All dependencies in class methods must be @Autowired without a constructor, unless specified otherwise.
- Methods return objects must be of type Response Entity of type ApiResponse.
- All class method logic must be implemented in a try..catch block(s).
- Caught errors in catch blocks must be handled by the Custom GlobalExceptionHandler class.