# Momen Cursor Rules - Build Custom Frontends with Momen Backend-as-a-Service

> **Prebuilt Cursor rules for developing custom frontend applications powered by [Momen.app](https://momen.app) as a headless Backend-as-a-Service (BaaS)**

This repository contains a comprehensive set of **production-ready Cursor rules** that enable AI assistants (Claude, ChatGPT, etc.) to seamlessly integrate with Momen's powerful backend infrastructure. Use these rules to rapidly build full-stack applications with custom frontends while leveraging Momen's enterprise-grade PostgreSQL database, GraphQL API, actionflows, AI agents, and more.

## 🎯 What This Repository Provides

This repository contains **8 specialized rule files** in `.cursor/rules/` that teach AI assistants how to:

1. **Understand Momen's Architecture** - Backend structure, GraphQL endpoints, authentication
2. **Query & Mutate Database** - Auto-generated GraphQL schema from your data model
3. **Execute Backend Logic** - Actionflows for complex, multi-step operations
4. **Integrate Third-party APIs** - Use imported API definitions as backend relays
5. **Leverage AI Agents** - RAG, tool use, multi-modal I/O, structured JSON output
6. **Handle Payments** - Stripe integration for one-time and subscription billing
7. **Manage Binary Assets** - Image/file uploads and management
8. **Fetch Project Schema** - MCP server integration for real-time schema access

## 📦 Included Rule Files

```
.cursor/rules/
├── momen-backend-architecture.mdc      # Core architecture & GraphQL setup
├── momen-database-gql-api-rules.mdc    # Database CRUD operations
├── momen-actionflow-gql-api-rules.mdc  # Backend workflows & business logic
├── momen-tpa-gql-api-rules.mdc         # Third-party API integration
├── momen-ai-agent-gql-api-rules.mdc    # AI agent capabilities
├── momen-stripe-payment-rules.mdc      # Payment processing
└── momen-binary-asset-upload-rules.mdc # File management
```

## 🚀 Quick Start

### Prerequisites

- [Cursor Editor](https://cursor.sh/) or any AI assistant supporting Cursor rules
- A [Momen.app](https://momen.app) account and project
- Basic knowledge of GraphQL and TypeScript/JavaScript

### Step 1: Build Your Backend in Momen

Before using these rules, you need to create your backend infrastructure in Momen:

1. **Sign up** at [Momen.app](https://momen.app) and create a new project
2. **Design your database** - Create tables, define relationships, and set up your data model
3. **Build backend logic** - Create actionflows for complex business logic
4. **Configure integrations** - Set up Stripe payments, AI agents, third-party APIs as needed
5. **Note your credentials**:
   - Your Momen username (email)
   - Your Momen password
   - Your project's `exId` (found in project settings) or project name

> **Tip**: Momen's visual editor makes it easy to design your entire backend without code. Once ready, use these Cursor rules to build a custom frontend that connects to your Momen backend!

### Step 2: Clone This Repository

```bash
git clone https://github.com/privateJiangyaokai/momen-cursor-rules.git
cd momen-cursor-rules
```

### Step 3: Copy Rules to Your Project

Copy the entire `.cursor` directory into your project root:

```bash
cp -r .cursor /path/to/your/project/
```

### Step 4: Configure MCP Server

The MCP server allows AI to automatically fetch your project's latest schema. To configure in Cursor:

1. Open Cursor Settings (⌘ + , on macOS, Ctrl + , on Windows)
2. Search for "MCP" or navigate to **Features → Model Context Protocol**
3. Click **"Edit Config"** or **"Add MCP Server"**
4. Add the Momen MCP server configuration:

```json
{
  "mcpServers": {
    "momen": {
      "command": "npx",
      "args": [
        "-y",
        "momen-mcp@latest"
      ]
    }
  }
}
```

**Alternative**: You can also manually edit the MCP config file:
- **macOS**: `~/Library/Application Support/Cursor/User/globalStorage/mcp-config.json`
- **Windows**: `%APPDATA%\Cursor\User\globalStorage\mcp-config.json`

> **Note**: The MCP server integration enhances AI's ability to understand your Momen project schema but is optional. The core Cursor rules work without it.

### Step 5: Vibe the Frontend

Open your project in Cursor and provide AI with your Momen credentials to start building. Use prompts like:

**Initial Setup**:
```
My Momen project is:  my-ecommerce-app (or exId: abc123xyz)

Build an ecommerce website based on the Momen project's backend structure. 
Use username authentication. 

+ Other misc requirements
e.g. Use Stripe publishable key: pk_test_51RQRPTCO2XREqHNZr8Vz0T1CNciMnXCM4I2qxb3ZYOi4GTHtbPnW8OJxGM9GR9L67jEngDUoBTMWOdr9W2AzMoKa00AzoEc7qr
```

The AI will use your credentials to authenticate, fetch your project schema, and generate production-ready code that perfectly matches your Momen backend structure!

## 🏗️ What is Momen?

[Momen](https://momen.app) is a next-generation **full-stack no-code platform** with a powerful backend designed for headless use. While Momen provides a visual editor for building complete applications, its backend can be used independently as a **Backend-as-a-Service (BaaS)** for custom frontend development.

### Why Use Momen as BaaS?

✅ **Enterprise-Grade PostgreSQL** - Powerful relational database with full ACID compliance  
✅ **Auto-Generated GraphQL API** - Your data model automatically becomes a type-safe GraphQL schema  
✅ **Built-in Backend Logic** - Actionflows for complex workflows without writing backend code  
✅ **Native AI Integration** - Built-in AI agents with RAG, tool use, and structured output  
✅ **Third-party API Relay** - Import OpenAPI specs, use as backend relay with authentication  
✅ **Stripe Integration** - Native payment processing for subscriptions and one-time charges  
✅ **File Storage** - Image and binary asset management with CDN  
✅ **Authentication** - Built-in user management with JWT tokens  
✅ **Real-time Subscriptions** - WebSocket support via GraphQL subscriptions  
✅ **Predictable Pricing** - Project-based pricing, no per-request charges

## 🎓 What are Cursor Rules?

**Cursor Rules** (`.cursor/rules/*.mdc` files) are specialized instructions that teach AI assistants about your project's architecture, APIs, and best practices. They enable AI to:


## 🎓 What are Cursor Rules?

**Cursor Rules** (`.cursor/rules/*.mdc` files) are specialized instructions that teach AI assistants about your project's architecture, APIs, and best practices. They enable AI to:

- Generate accurate code without extensive prompting
- Understand complex backend architectures
- Follow best practices automatically
- Produce production-ready code on first attempt

### Why MDC Format?

The `.mdc` (Markdown with frontmatter) format includes metadata that helps AI understand when and how to apply rules:

```markdown
---
description: Brief description of the rule
alwaysApply: true  # or false for contextual rules
---

# Rule content in markdown...
```

## 📚 Detailed Rule Documentation

### 1. `momen-backend-architecture.mdc`

**Purpose**: Core architecture understanding - always applied  
**Teaches AI**:
- GraphQL API endpoints (HTTP & WebSocket)
- Apollo Client + subscriptions-transport-ws setup
- Authentication token handling
- Project structure and conventions

**Key Concepts**:
```typescript
// HTTP endpoint
https://villa.momen.app/zero/{projectExId}/api/graphql-v2

// WebSocket endpoint
wss://villa.momen.app/zero/{projectExId}/api/graphql-subscription
```

### 2. `momen-database-gql-api-rules.mdc`

**Purpose**: Database operations via auto-generated GraphQL schema  
**Teaches AI**:
- How database tables map to GraphQL types
- Query patterns for fetching data
- Mutation patterns for CRUD operations
- Relationship handling (1:1, 1:N, N:N)
- Filter, sort, and pagination syntax

**Example AI can generate**:
```graphql
query GetPostsWithAuthors($limit: Int) {
  post(limit: $limit, order_by: {created_at: desc}) {
    id
    title
    content
    author {  # Relationship automatically handled
      id
      name
      email
    }
  }
}
```

### 3. `momen-actionflow-gql-api-rules.mdc`

**Purpose**: Execute complex backend workflows  
**Teaches AI**:
- Sync vs async actionflows
- Invoking actionflows via GraphQL
- Handling actionflow arguments and return values
- Polling for async actionflow completion
- Error handling and retries

**Use Cases**:
- Multi-step business logic
- Long-running operations (LLM API calls)
- Database transactions with rollback
- Email sending, notifications
- Complex data transformations

### 4. `momen-tpa-gql-api-rules.mdc`

**Purpose**: Third-party API integration  
**Teaches AI**:
- Using imported OpenAPI definitions
- Backend acts as authenticated relay
- No CORS issues
- Secure credential management

**Benefits**:
- Keep API keys server-side
- Centralized error handling
- Request/response logging
- Rate limiting control

### 5. `momen-ai-agent-gql-api-rules.mdc`

**Purpose**: Leverage built-in AI capabilities  
**Teaches AI**:
- Creating and managing AI agents
- RAG (Retrieval Augmented Generation)
- Tool use / function calling
- Multi-modal input (text, images, audio)
- Structured JSON output
- Streaming responses

**Example AI Agent Features**:
- Document Q&A with vector search
- Image analysis and generation
- Automated decision making
- Data extraction from unstructured text

### 6. `momen-stripe-payment-rules.mdc`

**Purpose**: Payment processing integration  
**Teaches AI**:
- One-time payment flows
- Subscription management
- Webhook handling for payment events
- Order creation and status tracking
- Stripe checkout UI integration

**Supported Operations**:
- Create payment intents
- Handle 3D Secure authentication
- Manage subscriptions (create, upgrade, cancel)
- Process refunds
- Handle payment failures

### 7. `momen-binary-asset-upload-rules.mdc`

**Purpose**: File and image management  
**Teaches AI**:
- Direct file uploads to Momen storage
- Image optimization and transformation
- CDN URL generation
- File metadata management
- Access control for assets

**Supported File Types**:
- Images (JPG, PNG, GIF, WebP)
- Documents (PDF, DOCX, XLSX)
- Videos (MP4, WebM)
- Audio files
- General binary data


**Generated Files**:
```
.momen-mcp/
├── credentials.json
└── config.json
```

## 💡 Usage Examples

### Example 1: Building a Blog with AI Assistant

**You**: "Create a Next.js blog based on the Momen project's backend whose exId is abc91xyY"

## 🛠️ Advanced Workflows

### Combining Multiple Rules

The rules work together intelligently. For example:

**You**: "Build a social media post creation flow with image upload and Stripe payment for premium features"

**AI will use**:
- `momen-backend-architecture.mdc` → Set up Apollo Client
- `momen-database-gql-api-rules.mdc` → Create post mutation
- `momen-binary-asset-upload-rules.mdc` → Handle image upload
- `momen-actionflow-gql-api-rules.mdc` → Multi-step post creation workflow
- `momen-stripe-payment-rules.mdc` → Premium feature paywall
- `momen-ai-agent-gql-api-rules.mdc` → AI-powered content moderation

## 🎯 Best Practices

### 1. Rule Selection

Rules have `alwaysApply` metadata:
- **true**: AI always considers this rule (e.g., architecture)
- **false**: AI applies contextually when relevant

### 2. Keep Schema Updated

Use MCP server to refresh schema whenever your Momen project structure changes:

**You**: "Refresh my Momen project's schema"  
**AI**: Fetches project's latest schema into context

### 3. Leverage Actionflows for Complex Logic

Don't try to implement multi-step business logic in frontend:

❌ **Don't**:
```typescript
// Frontend doing too much
const createOrderWithInventoryCheck = async () => {
  const inventory = await checkInventory(productId);
  if (inventory > 0) {
    const order = await createOrder(...);
    await reduceInventory(productId);
    await sendEmail(...);
  }
};
```

✅ **Do**:
```typescript
// Let backend actionflow handle it
const createOrder = async () => {
  await invokeActionflow('create_order_with_checks', {
    product_id: productId,
    quantity: 1
  });
};
```

### 4. Use Type Safety

AI will generate TypeScript types from GraphQL schema:

```typescript
// AI automatically generates
type Post = {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
  };
};
```

### 5. Handle Real-time Data

Use GraphQL subscriptions for live updates:

```typescript
const POST_SUBSCRIPTION = gql`
  subscription OnNewPost {
    post(
      where: { created_at: { _gte: "now()" } }
    ) {
      id
      title
      author { name }
    }
  }
`;
```

## 🔧 Troubleshooting

### Rules Not Being Applied

**Problem**: AI doesn't seem to use the rules  
**Solutions**:
Be explicit in prompts: "Using Momen backend rules, create..."

### GraphQL Errors

**Problem**: Queries return errors  
**Solutions**:
1. Verify project ID is correct in GraphQL URL
2. Check authentication token in headers
3. Ensure database table/column names match schema
4. Use MCP to refresh schema if structure changed
5. Check Momen project logs for backend errors

### TypeScript Type Errors

**Problem**: Generated code has type mismatches  
**Solutions**:
1. Run GraphQL codegen to update types
2. Ensure Apollo Client is properly configured
3. Check `tsconfig.json` includes generated types
4. Refresh schema and regenerate types

## 📖 Additional Resources

### Momen Documentation
- [Official Momen Docs](https://docs.momen.app/)
- [Quick Start Guide](https://docs.momen.app/starts/starts/)
- [Database Configuration](https://docs.momen.app/data/database/configuration/)
- [Actionflow Guide](https://docs.momen.app/actions/actionflow/overview/)
- [AI Agent Tutorial](https://docs.momen.app/actions/ai/overview/)
- [Stripe Integration](https://docs.momen.app/actions/payment/)

### GraphQL Resources
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Subscriptions Guide](https://www.apollographql.com/docs/react/data/subscriptions/)

### Cursor & AI Development
- [Cursor Official Docs](https://docs.cursor.com/)
- [Awesome Cursor Rules](https://github.com/PatrickJS/awesome-cursorrules)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### Community & Support
- [Momen Twitter/X](https://x.com/Momen_HQ)
- [Momen LinkedIn](https://www.linkedin.com/company/momen-hq/)
- [Momen YouTube](https://www.youtube.com/channel/UCItxhdjDH1L-C5Nhx7_AKYQ)
- Email Support: [hello@momen.app](mailto:hello@momen.app)

## 🤝 Contributing

We welcome contributions to improve these rules! Here's how:

### Adding New Rules

1. Fork this repository
2. Create new `.mdc` file in `.cursor/rules/`
3. Follow the frontmatter format:
```markdown
---
description: Brief description
alwaysApply: true/false
---

# Rule Content
```
4. Test with real AI assistants (Cursor, Claude, etc.)
5. Submit pull request with examples

### Improving Existing Rules

- Fix inaccuracies or outdated information
- Add more examples
- Improve clarity and organization
- Update for new Momen features

### Reporting Issues

- Found a bug in the rules?
- Schema mapping incorrect?
- Missing important use case?

Open an issue with:
- Rule file name
- Expected behavior
- Actual behavior
- Example prompt and output

## 📄 License

This repository is provided under the MIT License. Feel free to use, modify, and distribute these rules in your projects.

**Note**: While these rules are MIT licensed, Momen.app itself is a commercial service. Refer to [Momen's Terms of Service](https://momen.app/terms) for usage rights to the Momen platform.

## 🙏 Acknowledgments

Created by [Yaokai Jiang](https://www.linkedin.com/in/yaokai-jiang-21894924/), Founder of Momen.app

Special thanks to:
- The Cursor team for building an amazing AI-first editor
- Anthropic for Claude and MCP protocol
- The Momen community for feedback and testing

---

**Ready to build your next app?**

1. ⭐ Star this repo
2. 📋 Copy rules to your project
3. 🔌 Configure MCP server
4. 🚀 Start building with AI!

**Questions?** Open an issue or reach out to [hello@momen.app](mailto:hello@momen.app)

---

*Last Updated: November 2025*  
