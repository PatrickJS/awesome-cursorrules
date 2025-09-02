# PM Cursor Generator

AI-powered Product Management document generator using **Cursor Project Rules** for seamless integration with Cursor's AI capabilities.

## 🎯 Overview

This project provides a modern approach to PM document generation by leveraging Cursor's **Project Rules** system. Instead of complex command palettes, users can simply ask Cursor's AI to create documents, and the AI will follow the predefined templates and product context.

**Note that the Cursor Rules now follow a newer paradigm (no longer .cursorrules), as defined here**: https://docs.cursor.com/en/context/rules

## 🚀 Quick Start

### 📹 **Video Tutorial** (Recommended First Step)
🎥 **[Watch the Setup Tutorial](https://youtu.be/-aZVLptMiuA)** - Learn how to get started in just a few minutes!

### 1. **Download & Setup** (2 minutes)
- Download this repo to a new folder for your project
- No installation required - just need Cursor itself

### 2. **Configure Your Product** (2-10 minutes)
2 options: 
1. Manually edit `.cursor/rules/product-context.mdc` with your product information, you can use the example in the helper-docs directory as a guide.
2. Use the AI helper to automatically generate one:
- Type `@context-generator.mdc` in Cursor
- Describe your product in 1 line
- This will automatically modify the `product-context.mdc` file (there is a backup in the helper-docs directory)
- It is highly recommended to go over this file and make sure it fits your product!

### 3. **Start Creating Documents** (Immediate!)
Simply ask Cursor AI:
- "Create a PRD for user authentication"
- "Generate user stories for checkout process"
- "Make a persona for our target users"
- "Create a roadmap for Q1 features"

## 📋 What You Can Create

- **PRD (Product Requirements Document)**
- **User Stories & Acceptance Criteria**
- **User Personas** (Regular & Skeptical)
- **Product Roadmaps**
- **Epics Generator**
- **RICE Prioritization Analysis**
- **User Journey Maps**
- **Lean Canvas (Product Strategy)**
- **Product Positioning (Elevator Pitch)**
- **KPI to Revenue Connector**
- **Risk Analysis**



## 🎯 How It Works

### **1. Project Rules Integration**
The `.cursor/rules/` files provide:
- **Product Context**: Always included in AI conversations
- **Template Instructions**: Guide AI on document structure
- **Writing Guidelines**: Ensure consistent quality

### **2. AI-Powered Creation**
When you ask Cursor AI to create a document:
1. AI reads the Product-Context from Project Rules
2. AI applies relevant template instructions
3. AI generates structured content
4. AI creates the file with proper naming

### **3. Smart File Management**
- Creates `/product-documents/` folder automatically
- Maintains unique document IDs with timestamps
- Documents are ready for immediate use

## 📁 Project Structure

```
pm-cursor-generator/
├── .cursor/rules/           # Cursor Project Rules
│   ├── product-context.mdc  # Product context (*always* applied)
│   ├── context-generator.mdc    # helps generate your product context
│   ├── prd-template.mdc    # PRD creation instructions
│   ├── user-story-template.mdc
│   ├── persona-template.mdc
│   ├── roadmap-template.mdc
│   ├── epic-generator-template.mdc
│   ├── rice-analysis-template.mdc
│   ├── user-journey-template.mdc
│   ├── lean-canvas-template.mdc
│   ├── product-positioning.mdc
│   ├── kpi-revenues-template.mdc
│   └── risk-analysis-template.mdc
├── product-documents/      # Generated documents (output)
├── alternate-templates/    # alternate versions of templates
|   ├── alternate_read.me  
|   └── etc....
├── helper-docs/    # helper documentation and examples
|   ├── example-product-context.md    # an example of what this should look like  
|   └── etc....     # *.txt files that can add extra information for templates
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add new template rules in `.cursor/rules/`
4. Update documentation as needed
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**🎯 The future of PM document generation is AI-first, context-aware, and seamlessly integrated with your development workflow.** 
Copyright (c) 2025 Ze'ev Abrams (ZeevAbrams)