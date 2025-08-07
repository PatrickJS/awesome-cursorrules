---
description: Guidelines and best practices for building applications with [Beefree SDK](https://docs.beefree.io/beefree-sdk), including installation, authentication, configuration, customization, and template management
globs: **/*.{ts,tsx,js,jsx,html,css}
---

# Beefree SDK Guidelines
Guidelines and best practices for building applications with [Beefree SDK](https://docs.beefree.io/beefree-sdk), including installation, authentication, configuration, customization, and template management.

## Installation Guidelines

### Package Installation
- Install the Beefree SDK package using npm or yarn:
  ```bash
  npm install @beefree.io/sdk
  # or
  yarn add @beefree.io/sdk
  ```

### Dependencies
- Beefree SDK requires the following core dependencies:
  ```json
  {
    "dependencies": {
      "@beefree.io/sdk": "^9.0.2-fix-optional-url-config.0",
      "axios": "^1.10.0",
      "express": "^5.1.0",
      "cors": "^2.8.5",
      "dotenv": "^17.2.0"
    }
  }
  ```

### Environment Setup
- Create a `.env` file in your project root with your Beefree credentials:
  ```env
  BEE_CLIENT_ID=your_client_id_here
  BEE_CLIENT_SECRET=your_client_secret_here
  ```

## Authentication Guidelines

### Proxy Server Setup
- ALWAYS use a proxy server for authentication to protect your credentials
- Create a proxy server file (e.g., `proxy-server.js`) to handle authentication:
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

  // V2 Auth Endpoint
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

### Authentication Process
- Use the V2 authentication endpoint: `https://auth.getbee.io/loginV2`
- Pass the ENTIRE API response to the Beefree SDK, not just the token
- Example authentication call:
  ```typescript
  const token = await fetch('http://localhost:3001/proxy/bee-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid: 'demo-user' })
  }).then(res => res.json());
  ```

## Container Setup Guidelines

### HTML Container
- Create a dedicated container element for the Beefree SDK:
  ```html
  <div id="beefree-sdk-container"></div>
  ```

### CSS Styling
- Style the container to ensure proper display:
  ```css
  #beefree-sdk-container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 600px;
    width: 90%;
    margin: 20px auto;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  ```

### React Container
- For React applications, the following code snippet shows an example using refs to manage the container:
  ```typescript
  const containerRef = useRef<HTMLDivElement>(null);

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
  ```

## Configuration Guidelines

### Required Configuration Parameters
- ALWAYS include the `container` parameter in your configuration:
  ```typescript
  const beeConfig = {
    container: 'beefree-sdk-container', // Required
    language: 'en-US'
  };
  ```

### Optional Configuration Parameters
- Customize your SDK with optional parameters:
  ```typescript
  const beeConfig = {
    container: 'beefree-sdk-container', // Required
    language: 'en-US',
    specialLinks: [
      {
        type: "unsubscribe",
        label: "Unsubscribe",
        link: "http://[unsubscribe]/",
      },
      {
        type: "subscribe",
        label: "Subscribe",
        link: "http://[subscribe]/",
      },
    ],
    mergeTags: [
      {
        name: "First Name",
        value: "[first_name]",
      },
      {
        name: "Last Name",
        value: "[last_name]",
      },
      {
        name: "Email",
        value: "[email]",
      },
    ]
  };
  ```

### Callback Functions
- Implement essential callback functions for proper functionality:
  ```typescript
  const beeConfig = {
    container: 'beefree-sdk-container',
    onSave: function (jsonFile, htmlFile) {
      console.log("Template saved:", jsonFile);
      // Implement custom save logic here
    },
    onAutoSave: function (jsonFile) {
      console.log("Auto-saving template...");
      localStorage.setItem("email.autosave", jsonFile);
    },
    onSend: function (htmlFile) {
      console.log("Email ready to send:", htmlFile);
      // Implement custom send logic here
    },
    onError: function (errorMessage) {
      console.error("Beefree SDK error:", errorMessage);
      // Handle errors appropriately
    }
  };
  ```

## SDK Initialization Guidelines

### Basic Initialization
- Initialize the Beefree SDK with proper error handling:
  ```typescript
  async function initializeBeefree(authResponse) {
    try {
      const bee = new BeefreeSDK(authResponse);
      bee.start(beeConfig, {});
      console.log('Beefree SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Beefree SDK:', error);
    }
  }
  ```

### React Integration
- For React applications, the following code snippet shows an example using useEffect for initialization:
  ```typescript
  useEffect(() => {
    async function initializeEditor() {
      const beeConfig = {
        container: 'beefree-react-demo',
        language: 'en-US',
        onSave: (pageJson: string, pageHtml: string, ampHtml: string | null, templateVersion: number, language: string | null) => {
          console.log('Saved!', { pageJson, pageHtml, ampHtml, templateVersion, language });
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
  ```

## Template Loading Guidelines

### Loading Templates
- Use the `start()` method with template data to load existing templates:
  ```typescript
  // Load template from localStorage
  const selectedTemplate = JSON.parse(localStorage.getItem('currentEmailData'));
  
  if (selectedTemplate) {
    beefreeSDKInstance.start(selectedTemplate);
    console.log('Loaded template from localStorage');
  } else {
    // Start with empty template
              beefreeSDKInstance.start();
          console.log('Started with empty template');
  }
  ```

### Template Storage
- Store templates in localStorage for persistence while testing:
  ```typescript
  // Save template data
  localStorage.setItem('currentEmailData', JSON.stringify(templateData));
  localStorage.setItem('currentEmailName', emailName);
  
  // Load template data
  const emailData = localStorage.getItem('currentEmailData');
  const emailName = localStorage.getItem('currentEmailName');
  ```

### Autosave Functionality
- Implement autosave to prevent data loss:
  ```typescript
  onAutoSave: function (jsonFile) {
    console.log("Auto-saving template...");
    localStorage.setItem("email.autosave", jsonFile);
  }
  ```

## HTML Import Guidelines

### HTML Importer API
- Use the HTML Importer API to convert existing HTML templates to Beefree SDK format
- API endpoint: `https://api.getbee.io/v1/conversion/html-to-json`
- Reference: [HTML Importer API Documentation](https://docs.beefree.io/beefree-sdk/apis/html-importer-api/import-html)

### Import Process
- Convert HTML templates to Beefree SDK's native JSON format:
  ```javascript
  const response = await fetch('https://api.getbee.io/v1/conversion/html-to-json', {
    method: 'POST',
    headers: {
      "Authorization": "Bearer Enter Dev Console API Key as Bearer token",
      "Content-Type": "text/html"
    },
    body: "<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>"
  }); 
  const data = await response.json();
  ```

### Loading Imported Templates
- Load imported templates into the Beefree SDK:
  ```typescript
  const importedTemplate = await importHtmlTemplate(htmlContent);
  beefreeSDK.start(importedTemplate);
  ```

## Error Handling Guidelines

### onError Callback
- ALWAYS implement the `onError` callback to handle SDK errors:
  ```typescript
  onError: function (errorMessage) {
    console.error("Beefree SDK error:", errorMessage);
    // Display user-friendly error message
    document.getElementById('beefree-sdk-container').innerHTML = 
      '<div class="error">Error loading Beefree SDK: ' + errorMessage.message + '</div>';
  }
  ```

### Authentication Error Handling
- Handle authentication failures gracefully:
  ```typescript
  function getBeeToken(callback) {
    fetch('/api/beefree/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: 'your_client_id',
        client_secret: 'your_client_secret',
        uid: beeConfig.uid
      })
    })
    .then(response => {
      if (!response.ok) throw new Error('Auth failed: ' + response.status);
      return response.json();
    })
    .then(data => {
      callback(data);
    })
    .catch(error => {
      console.error('Error getting Beefree token:', error);
      document.getElementById('beefree-sdk-container').innerHTML = 
        '<div class="error">Failed to authenticate with Beefree. Please check your credentials and try again.</div>';
    });
  }
  ```

## Template Change Tracking Guidelines

### Track Message Changes
- Implement template change tracking to monitor changes made by end users
- Reference: [Track Message Changes Documentation](https://docs.beefree.io/beefree-sdk/getting-started/tracking-message-changes)

### Change Detection
- Use the `onChange` callback to track template changes:
  ```typescript
  onChange: function (jsonFile, response) {
  console.log('json', jsonFile);
  console.log('response', response);
    },
  ```

## Customization Guidelines

### UI Customization
Customize the Beefree SDK appearance with:
- [Customized Themes](https://docs.beefree.io/beefree-sdk/other-customizations/appearance/themes)
- [Custom CSS](https://docs.beefree.io/beefree-sdk/other-customizations/appearance/custom-css) 

### Language Customization
- Set the language for internationalization:
  ```typescript
  const beeConfig = {
    container: 'beefree-sdk-container',
    language: 'en-US', // or 'es-ES', 'fr-FR', etc.
  };
  ```

### Merge Tags and Special Links
- Configure merge tags and special links for email personalization:
  ```typescript
  const beeConfig = {
    container: 'beefree-sdk-container',
    mergeTags: [
      { name: "First Name", value: "[first_name]" },
      { name: "Last Name", value: "[last_name]" },
      { name: "Email", value: "[email]" },
      { name: "Company", value: "[company]" }
    ],
    specialLinks: [
      { type: "unsubscribe", label: "Unsubscribe", link: "http://[unsubscribe]/" },
      { type: "subscribe", label: "Subscribe", link: "http://[subscribe]/" },
      { type: "webview", label: "View in Browser", link: "http://[webview]/" }
    ]
  };
  ```
### Other Customizations
Reference the official [Beefree SDK technical documentation](https://docs.beefree.io/beefree-sdk) for a comprehnsive reference of possible customizations.  

## Best Practices

### Performance Optimization
- Initialize the Beefree SDK only when it is actually needed in your application.
- Properly clean up SDK resources when they are no longer required (e.g., when navigating away or closing the editor).
- Handle errors gracefully to prevent application crashes or unexpected behavior.

### Security
- **Never** expose your Beefree SDK client credentials in any frontend or public code.
- Always use a secure backend or proxy server to handle authentication and sensitive operations.
- Validate and sanitize all user inputs before passing them to the SDK to prevent security vulnerabilities.

### User Experience
- Show appropriate loading indicators while the SDK is initializing or performing operations.
- Display clear and helpful error messages to users if something goes wrong.
- Implement automatic saving or progress tracking to prevent data loss.

### Code Organization
- Keep SDK configuration separate from initialization and business logic for better maintainability.
- Use strong typing (e.g., TypeScript or similar) where possible to improve code safety and clarity.
- Ensure robust error handling throughout your integration, regardless of the tech stack or framework used.

## Examples

### Complete React Component
Reference the full project at [beefree-react-demo](https://github.com/BeefreeSDK/beefree-react-demo).
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
        onSave: (pageJson: string, pageHtml: string, ampHtml: string | null, templateVersion: number, language: string | null) => {
          console.log('Saved!', { pageJson, pageHtml, ampHtml, templateVersion, language });
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

### Complete HTML Implementation
Reference the complete project at Beefree SDK [multiple-versions-concept](https://github.com/BeefreeSDK/beefree-sdk-simple-schema/tree/main/multiple-versions-concept).
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Beefree SDK - Email Builder</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
      #beefree-sdk-container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
      }
    </style>
  </head>
  <body>
    <div id="beefree-sdk-container"></div>
    <script src="https://app-rsrc.getbee.io/plugin/BeefreeSDK.js"></script>
    <script type="text/javascript">
      const beeConfig = {
            container: 'beefree-sdk-container',
    uid: 'demo-user-' + Date.now(),
    language: 'en-US',
        onSave: function (jsonFile, htmlFile) {
          console.log("Template saved:", jsonFile);
        },
        onError: function (errorMessage) {
          console.error("Beefree SDK error:", errorMessage);
        }
      };

      function getBeeToken(callback) {
        fetch('/api/beefree/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: 'your_client_id',
            client_secret: 'your_client_secret',
            uid: beeConfig.uid
          })
        })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => {
          console.error('Error getting Beefree token:', error);
        });
      }

      function initializeBeefree(authResponse) {
        BeefreeSDK.create(authResponse, beeConfig, function (beefreeSDKInstance) {
          console.log('Beefree SDK initialized successfully');
          beefreeSDKInstance.start();
        });
      }

      getBeeToken(initializeBeefree);
    </script>
  </body>
</html>
``` 