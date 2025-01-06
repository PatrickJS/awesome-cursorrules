# Cursor Rules for Project Context Management

By [@kryptobaseddev](https://github.com/kryptobaseddev)

## Overview

This repository contains a comprehensive `.cursorrules` file designed to enhance project management and development workflows when working with Cursor AI Agent. The rules are specifically crafted to maintain consistent project context and break down development tasks into manageable, trackable units.

## Core Concepts

### ProjectDocs Structure

```
ProjectDocs/
├── Build_Notes/
│   ├── active/          # Current build notes
│   ├── completed/       # Finished build notes
│   └── archived/        # Deprecated build notes
└── contexts/
    ├── projectContext.md    # Master project context
    ├── appFlow.md          # Application flow documentation
    ├── authFlow.md         # Authentication flow documentation
    └── ...                 # Additional context files
```

### Key Features

- **Build Notes Management**: Systematic approach to tracking development progress
- **Context Awareness**: Maintains project context to reduce AI hallucinations
- **Task Organization**: Breaks down complex tasks into manageable units
- **Progress Tracking**: Clear system for monitoring task completion
- **Documentation Standards**: Consistent formatting and organization

## Technical Standards

### Code Quality & Style
- Maximum file size of 150 lines; refactor into smaller modules if exceeded
- Functional, declarative programming approach (avoid OOP and classes)
- Semantic variable naming with auxiliary verbs (e.g., `isLoading`, `hasError`)
- Lowercase with dashes for directories and files
- DRY (Don't Repeat Yourself) principles
- Regular code reviews and refactoring sessions

### Stack & Framework Conventions
- Next.js 15+ with App Router and React Server Components (RSC)
- Zustand for state management in client components
- Shadcn UI management using `npx shadcn@latest add`
- Mobile-first approach and responsive design
- Emphasis on server-side logic
- Progressive Web App (PWA) structure

### Project Structure
```
├── app/
│   ├── (auth)/           # Auth-related routes/pages
│   ├── (dashboard)/      # Dashboard routes/pages
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/
│   ├── shared/           # Shared UI components
│   ├── features/         # Feature-specific components
│   └── ui/               # Shadcn UI components
├── lib/
│   ├── supabase/         # Supabase client and utilities
│   ├── constants/        # Global constants
│   ├── hooks/            # Custom React hooks
│   ├── middleware/       # Custom middleware
│   └── utils/           # Shared utility functions
└── ...
```

## Usage

1. **Initial Setup**:
   - Create a `ProjectDocs` folder in your project root
   - Add the `contexts` folder with at least a `projectContext.md` file
   - Set up the `Build_Notes` directory structure

2. **Context Files**:
   - Start with `projectContext.md` containing:
     - Project goals and objectives
     - Tech stack details
     - Integration specifications
     - Architecture overview
   - Add additional context files as needed (e.g., `appFlow.md`, `authFlow.md`)

3. **Build Notes**:
   - Create individual build note files for specific task groups
   - Follow the naming convention: `build-title_phase-#_task-group-name.md`
   - Include task objectives, current state, future state, and implementation plans

4. **Best Practices**:
   - Create separate Cursor Agent chats for each build note
   - Keep context files updated but stable
   - Move completed build notes to the appropriate directory
   - Reference specific context files when working with the Agent

### Build Notes Structure
Each build note should include:
1. **Task Objective**: Brief summary of goals
2. **Current State Assessment**: Description of current project state
3. **Future State Goal**: Description of desired outcome
4. **Implementation Plan**: Numbered steps with checklist tasks
   - Update as tasks are completed
   - Line out non-applicable tasks (never delete)
   - Add new steps/tasks as needed

## Development Standards

### Error Handling & Validation
- Handle errors at function start with guard clauses
- Use if-return patterns to reduce nesting
- Implement Zod for schema validation
- Use react-hook-form with useActionState
- Implement proper error logging and user-friendly messages

### State Management & Data Fetching
- Prefer React Server Components for data fetching
- Use Supabase for real-time data
- Implement preload patterns
- Use Vercel KV for chat history and rate limiting

### Testing & Quality Assurance
- Unit tests for utilities and hooks
- Integration tests for complex components
- End-to-end tests for critical flows
- Local Supabase testing
- Maintain minimum test coverage

## Benefits

- Reduces AI hallucinations through consistent context
- Improves project organization and documentation
- Enhances team collaboration and knowledge sharing
- Maintains development focus and progress tracking
- Provides clear project history and decision documentation

## Customization

The `.cursorrules` file can be customized to match your project's specific needs:
- Modify the project structure to match your workflow
- Adjust coding standards and conventions
- Update documentation requirements
- Add project-specific rules and guidelines

## Getting Started

1. Copy the `.cursorrules` file to your project
2. Set up the `ProjectDocs` directory structure
3. Create your initial `projectContext.md`
4. Begin creating build notes for your tasks

## Contributing

Feel free to fork and modify these rules for your own projects. Contributions and improvements are welcome through pull requests.

## License

MIT License - Feel free to use and modify for your projects.

---

Created by [@kryptobaseddev](https://github.com/kryptobaseddev)
