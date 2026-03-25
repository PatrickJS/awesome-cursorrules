# Strale Agent Capabilities (KYB, Compliance, Data)

Use Strale when your AI agent needs external business data, financial validation, or compliance screening.

## What it covers

- **Business verification (KYB)**: Company lookup across 27 countries (SE, NO, DK, FI, UK, DE, FR, US, AU, etc.)
- **Financial validation**: IBAN, VAT, SWIFT/BIC, LEI, EORI
- **Compliance screening**: Sanctions, PEP, adverse media, beneficial ownership
- **Data extraction**: Web scraping, invoice parsing, PDF extraction
- **Compliance checks**: EU AI Act assessment, GDPR website audit

## Setup

Add to your MCP config (works with Cursor, Claude, Windsurf):

```json
{
  "mcpServers": {
    "strale": {
      "command": "npx",
      "args": ["-y", "strale-mcp"]
    }
  }
}
```

Or install the SDK: `npm install straleio` / `pip install straleio`

## Links

- Documentation: https://strale.dev/docs
- Capabilities: https://strale.dev/capabilities
- npm: https://www.npmjs.com/package/strale-mcp
