---
description: Governs the structure and functionality of repository classes, emphasizing the use of JpaRepository, JPQL queries, and EntityGraphs to prevent N+1 problems.
globs: **/src/main/java/com/example/repositories/*.java
---
- Must annotate repository classes with @Repository.
- Repository classes must be of type interface.
- Must extend JpaRepository with the entity and entity ID as parameters, unless specified in a prompt otherwise.
- Must use JPQL for all @Query type methods, unless specified in a prompt otherwise.
- Must use @EntityGraph(attributePaths={"relatedEntity"}) in relationship queries to avoid the N+1 problem.
- Must use a DTO as The data container for multi-join queries with @Query.