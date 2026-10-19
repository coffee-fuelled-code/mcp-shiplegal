# ShipLegal MCP Server

Generate professional, jurisdiction-aware privacy policies from your AI assistant.

## What It Does

- Generates complete privacy policies tailored to your business
- Supports GDPR (EU/UK), CCPA (US), Australian Privacy Act, and PIPEDA (Canada)
- Customises based on business type, data collected, and third-party services
- Professional quality, ready to review with legal counsel

## Installation

```bash
npx -y github:coffee-fuelled-code/mcp-shiplegal   # runs it straight from GitHub
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "shiplegal": {
      "command": "npx",
      "args": ["-y", "github:coffee-fuelled-code/mcp-shiplegal"]
    }
  }
}
```

## Tools

### generate_privacy_policy

Generate a privacy policy for your website or app.

**Parameters:**
- `business_name` (string): Your business name
- `website_url` (string): Your website URL
- `business_type` (enum): saas, ecommerce, mobile_app, blog, or agency
- `contact_email` (string): Contact email for privacy inquiries
- `jurisdictions` (array): Which privacy laws to include (us, eu, uk, au, ca, international)
- `data_collected` (array): Types of data you collect (name, email, payment, location, cookies, analytics, social_login, phone, address, usage_data)
- `shares_with_third_parties` (boolean): Whether you share data with third parties
- `third_party_description` (string, optional): Description of third-party services

### list_jurisdictions

List supported jurisdictions, data types, and business types.

## Example

```
> Generate a privacy policy for my SaaS app

I'll create one for you. What's your business name, website URL, and contact email?
What data do you collect? And which regions are your users in?

[Generates a complete, jurisdiction-compliant privacy policy]
```

## Full Legal Document Suite

This MCP server generates privacy policies (free). For Terms of Service, Cookie Policy, and Disclaimer, visit [ShipLegal](https://shiplegal.uncommondigitalgroup.com).

## Made By

[ShipLegal](https://shiplegal.uncommondigitalgroup.com) by [Uncommon Digital Group](https://uncommondigitalgroup.com)
