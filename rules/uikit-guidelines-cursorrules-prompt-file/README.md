# UIKit Guidelines .cursorrules Prompt File

Author: MoonAndEye

## What you can build
iOS Application Deployment - App Store distribution package for native iOS applications. Provides production-ready IPA bundle following Apple's submission guidelines. Implements required provisioning profiles, entitlements, and compliance measures for public release.


## Synopsis
Implement Auto Layout using SnapKit, create UI programmatically without using Storyboard/XIB, manage UI components using Factory/Builder patterns, implement standardized ViewModel, and use closure-based event handling mechanisms.


## Overview of .cursorrules prompt
The .cursorrules file provides a comprehensive guide for developing iOS applications using Swift and UIKit. It emphasizes writing maintainable and clean code by following the latest documentation and features. The guidelines focus on implementing responsive layouts using SnapKit, avoiding Storyboards/XIBs, and creating all UI components programmatically. It promotes the use of view composition and custom view subclasses for reusability.

The principles outlined in the file include:
1. Auto Layout: Use SnapKit for responsive layouts, support Dynamic Type and Safe Area.
2. Programmatic UI: Implement UI components directly in code, avoid Storyboards/XIBs.
3. MVC/MVVM Principles: UI components should not directly access models or DTOs. Use ViewController, Factory, or Builder patterns.
4. Event Handling: Pass events using closures, and ensure the closure passes 'self' as a parameter for external object identification.

By adhering to these guidelines, developers can create efficient, scalable, and maintainable iOS applications that follow best practices and Apple's MVC principles.
