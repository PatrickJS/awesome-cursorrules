# Beefree SDK Integration Guide

This folder contains a comprehensive `.cursorrules` file that provides guidelines and best practices for embedding [Beefree SDK](https://docs.beefree.io/beefree-sdk) into web applications, particularly those in the Martech industry, or those custom-built internally by enterprises with large-scale marketing operations. The frontend of [Beefree SDK](https://docs.beefree.io/beefree-sdk) includes a no-code email, page, and popup builder. The rules file serves as a development companion to ensure a consistent, secure, and efficient integration of the Beefree SDK no-code content editor into your applications.

## What is the .cursorrules file?

The `.cursorrules` file is a configuration file that provides AI-powered coding assistance with specific guidelines for working with the Beefree SDK. It contains:

- **Installation guidelines** for proper SDK setup
- **Authentication best practices** with security considerations
- **Configuration examples** for different use cases
- **Error handling patterns** for robust applications
- **Code examples** in TypeScript, JavaScript, and React
- **Best practices** for performance and security

## Quick Start

### 1. Prerequisites

Before using the Beefree SDK, you'll need:
- A Beefree account with API credentials
- Node.js
- A modern web browser

### 2. Installation

Install the Beefree SDK package:

```bash
npm install @beefree.io/sdk
# or
yarn add @beefree.io/sdk
```

### 3. Environment Setup

Create a `.env` file in your project root:

```env
BEE_CLIENT_ID=your_client_id_here
BEE_CLIENT_SECRET=your_client_secret_here
```

### 4. Basic Implementation

#### HTML Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Beefree SDK Demo</title>
    <style>
        #beefree-sdk-container {
            height: 600px;
            width: 90%;
            margin: 20px auto;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div id="beefree-sdk-container"></div>
    
    <script src="https://app-rsrc.getbee.io/plugin/BeefreeSDK.js"></script>
    <script>
        const beeConfig = {
            container: 'beefree-sdk-container',
            language: 'en-US',
            onSave: function (jsonFile, htmlFile) {
                console.log("Template saved:", jsonFile);
            },
            onError: function (errorMessage) {
                console.error("Beefree SDK error:", errorMessage);
            }
        };

        // Initialize with authentication
        async function initializeBeefree() {
            const token = await fetch('http://localhost:3001/proxy/bee-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: 'demo-user' })
            }).then(res => res.json());

            const bee = new BeefreeSDK(token);
            bee.start(beeConfig, {});
        }

        initializeBeefree();
    </script>
</body>
</html>
```

#### React Implementation

```typescript
import { useEffect, useRef } from 'react';
import BeefreeSDK from '@beefree.io/sdk';

export default function BeefreeEditor() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initializeEditor() {
      const beeConfig = {
        container: 'beefree-react-demo',
        language: 'en-US',
        onSave: (pageJson: string, pageHtml: string) => {
          console.log('Saved!', { pageJson, pageHtml });
        },
        onError: (error: unknown) => {
          console.error('Error:', error);
        }
      };

      const token = await fetch('http://localhost:3001/proxy/bee-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: 'demo-user' })
      }).then(res => res.json());

      const bee = new BeefreeSDK(token);
      bee.start(beeConfig, {});
    }

    initializeEditor();
  }, []);

  return (
    <div
      id="beefree-react-demo"
      ref={containerRef}
      style={{
        height: '600px',
        width: '90%',
        margin: '20px auto',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}
    />
  );
}
```

## Authentication Setup

### Security Best Practice: Proxy Server

Always use a proxy server to protect your credentials. Create a `proxy-server.js` file:

```javascript
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const BEE_CLIENT_ID = process.env.BEE_CLIENT_ID;
const BEE_CLIENT_SECRET = process.env.BEE_CLIENT_SECRET;

app.post('/proxy/bee-auth', async (req, res) => {
  try {
    const { uid } = req.body;
    
    const response = await axios.post(
      'https://auth.getbee.io/loginV2',
      {
        client_id: BEE_CLIENT_ID,
        client_secret: BEE_CLIENT_SECRET,
        uid: uid || 'demo-user'
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
```

Start the proxy server:

```bash
node proxy-server.js
```

## Key Features Covered in .cursorrules

### 1. Container Setup
- Proper HTML container configuration
- CSS styling guidelines
- React integration patterns

### 2. Configuration Options
- Required parameters (container)
- Optional parameters (language, merge tags, special links)
- Callback functions (onSave, onError, onAutoSave, onSend)

### 3. Template Management
- Loading existing templates
- Saving templates to localStorage
- Autosave functionality
- HTML import capabilities

### 4. Error Handling
- Comprehensive error handling patterns
- User-friendly error messages
- Authentication error recovery

### 5. Customization
- UI theming
- Language internationalization
- Merge tags and special links
- Custom CSS integration

## Advanced Features

### Template Loading

```typescript
// Load template from localStorage
const selectedTemplate = JSON.parse(localStorage.getItem('currentEmailData'));

if (selectedTemplate) {
  beefreeSDKInstance.start(selectedTemplate);
  console.log('Loaded template from localStorage');
} else {
  beefreeSDKInstance.start();
  console.log('Started with empty template');
}
```

### HTML Import

```javascript
// Convert HTML to Beefree format
const response = await fetch('https://api.getbee.io/v1/conversion/html-to-json', {
  method: 'POST',
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "text/html"
  },
  body: "<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>"
}); 
const data = await response.json();
```

### Change Tracking

```typescript
const beeConfig = {
  container: 'beefree-sdk-container',
  onChange: function (jsonFile, response) {
    console.log('Template changed:', jsonFile);
    console.log('Response:', response);
  }
};
```

## Best Practices

### Performance
- Initialize SDK only when needed
- Clean up resources properly
- Implement proper error handling

### Security
- Never expose credentials in frontend code
- Use proxy servers for authentication
- Validate user inputs

### User Experience
- Show loading indicators
- Display helpful error messages
- Implement autosave functionality

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify your credentials in `.env`
   - Ensure proxy server is running
   - Check network connectivity

2. **Container Not Found**
   - Verify container ID matches configuration
   - Ensure container exists before SDK initialization

3. **SDK Not Loading**
   - Check browser console for errors
   - Verify Beefree SDK script is loaded
   - Ensure proper initialization order

### Debug Mode

Enable debug logging:

```typescript
const beeConfig = {
  container: 'beefree-sdk-container',
  debug: {
    all: true,                 // Enables all debug features
    inspectJson: true,        // Shows an eye icon to inspect JSON data for rows/modules
    showTranslationKeys: true // Displays translation keys instead of localized strings
  },
  onError: function (errorMessage) {
    console.error("Beefree SDK error:", errorMessage);
  }
};
```

## Resources

- [Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk)
- [HTML Importer API](https://docs.beefree.io/beefree-sdk/apis/html-importer-api/import-html)
- [React Demo Repository](https://github.com/BeefreeSDK/beefree-react-demo)
- [Multiple Versions Concept](https://github.com/BeefreeSDK/beefree-sdk-simple-schema/tree/main/multiple-versions-concept)