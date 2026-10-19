#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// ── Helpers ──
const today = () => new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
function dataList(types) {
    const labels = {
        name: "Full name", email: "Email address",
        payment: "Payment and billing information (credit card numbers, billing address)",
        location: "Geographic location data",
        cookies: "Cookies and similar tracking technologies",
        analytics: "Usage analytics and behavioral data",
        social_login: "Information from social login providers (e.g., Google, Facebook)",
        phone: "Phone number", address: "Physical / mailing address",
        usage_data: "Device information, browser type, IP address, and operating system",
    };
    return types.map((t) => `- ${labels[t]}`).join("\n");
}
function businessDescription(inputs) {
    const types = {
        saas: "a software-as-a-service (SaaS) platform", ecommerce: "an e-commerce platform",
        mobile_app: "a mobile application", blog: "a content and publishing platform",
        agency: "a professional services business",
    };
    return types[inputs.businessType] || "a digital platform";
}
// ── Jurisdiction clauses ──
function gdprClause(inputs) {
    return `\n## Your Rights Under GDPR (EU/UK)\n\nIf you are located in the European Economic Area (EEA) or United Kingdom, you have the following rights under the General Data Protection Regulation (GDPR):\n\n- **Right of access** — You can request a copy of the personal data we hold about you.\n- **Right to rectification** — You can ask us to correct inaccurate or incomplete data.\n- **Right to erasure** — You can ask us to delete your personal data in certain circumstances.\n- **Right to restrict processing** — You can ask us to limit how we use your data.\n- **Right to data portability** — You can request your data in a structured, machine-readable format.\n- **Right to object** — You can object to our processing of your data for certain purposes.\n- **Right to withdraw consent** — Where processing is based on consent, you can withdraw it at any time.\n\nTo exercise any of these rights, contact us at ${inputs.contactEmail}. We will respond within 30 days.\n\n**Legal Basis for Processing:** We process your personal data based on one or more of the following: your consent, performance of a contract, compliance with a legal obligation, or our legitimate interests.\n\n**Data Transfers:** If we transfer your data outside the EEA/UK, we ensure appropriate safeguards are in place (e.g., Standard Contractual Clauses).`;
}
function ccpaClause(inputs) {
    return `\n## Your Rights Under CCPA/CPRA (California)\n\nIf you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):\n\n- **Right to know** — You can request details about the personal information we collect, use, and share.\n- **Right to delete** — You can request deletion of your personal information, subject to certain exceptions.\n- **Right to correct** — You can request correction of inaccurate personal information.\n- **Right to opt-out of sale/sharing** — You can opt out of the sale or sharing of your personal information. We do not sell your personal information.\n- **Right to non-discrimination** — We will not discriminate against you for exercising your privacy rights.\n\nTo exercise these rights, contact us at ${inputs.contactEmail}. We will verify your identity before processing your request and respond within 45 days.`;
}
function australianClause(inputs) {
    return `\n## Your Rights Under the Australian Privacy Act\n\nIf you are located in Australia, your personal information is handled in accordance with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth).\n\n- You may request access to, and correction of, your personal information at any time.\n- If you believe we have breached the APPs, you may lodge a complaint with us at ${inputs.contactEmail}. We will investigate and respond within 30 days.\n- If you are not satisfied with our response, you may escalate your complaint to the Office of the Australian Information Commissioner (OAIC) at www.oaic.gov.au.`;
}
function pipedaClause(inputs) {
    return `\n## Your Rights Under PIPEDA (Canada)\n\nIf you are located in Canada, your personal information is handled in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA).\n\n- You have the right to access your personal information held by us and to challenge its accuracy.\n- We will obtain your meaningful consent before collecting, using, or disclosing your personal information, except where permitted by law.\n- You may withdraw your consent at any time, subject to legal or contractual restrictions.\n\nTo exercise your rights or file a complaint, contact us at ${inputs.contactEmail}.`;
}
function jurisdictionClauses(inputs) {
    const clauses = [];
    if (inputs.jurisdictions.includes("eu") || inputs.jurisdictions.includes("uk"))
        clauses.push(gdprClause(inputs));
    if (inputs.jurisdictions.includes("us"))
        clauses.push(ccpaClause(inputs));
    if (inputs.jurisdictions.includes("au"))
        clauses.push(australianClause(inputs));
    if (inputs.jurisdictions.includes("ca"))
        clauses.push(pipedaClause(inputs));
    return clauses.join("\n");
}
// ── Privacy Policy Generator ──
function generatePrivacyPolicy(inputs) {
    const thirdPartySection = inputs.sharesWithThirdParties
        ? `\n## Third-Party Services\n\nWe share certain information with third-party service providers to operate our business. ${inputs.thirdPartyDescription || "These may include payment processors, analytics providers, email delivery services, and cloud hosting providers."}\n\nWe require all third parties to respect the security of your personal data and to treat it in accordance with applicable law.`
        : `\n## Third-Party Services\n\nWe do not sell, rent, or share your personal information with third parties for their own marketing purposes. We may use third-party service providers who process data on our behalf under strict confidentiality agreements.`;
    return `# Privacy Policy

**Last updated:** ${today()}

## Introduction

${inputs.businessName} ("we", "us", or "our") operates ${inputs.websiteUrl} (${businessDescription(inputs)}). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.

By using our service, you agree to the collection and use of information in accordance with this policy.

## Information We Collect

We collect the following types of information:

${dataList(inputs.dataCollected)}

## How We Use Your Information

We use the information we collect to:

- Provide, maintain, and improve our service
- Process transactions and send related information
- Send you technical notices, updates, and support messages
- Respond to your comments, questions, and requests
- Monitor and analyse trends, usage, and activities
- Detect, investigate, and prevent fraud and other illegal activities
- Personalise and improve your experience
${thirdPartySection}

## Data Security

We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.

## Data Retention

We retain your personal information for as long as necessary to fulfil the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements.
${jurisdictionClauses(inputs)}

## Children's Privacy

Our service is not directed to individuals under the age of 16. We do not knowingly collect personal information from children.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.

## Contact Us

If you have questions about this Privacy Policy, please contact us at:

**${inputs.businessName}**
Email: ${inputs.contactEmail}

---

*This document was generated by [ShipLegal](https://shiplegal.uncommondigitalgroup.com). For Terms of Service, Cookie Policy, and Disclaimer, visit ShipLegal. This should be reviewed by a qualified legal professional for your specific situation.*`;
}
// ── MCP Server ──
const server = new McpServer({
    name: "shiplegal",
    version: "1.0.0",
});
server.tool("generate_privacy_policy", "Generate a professional, jurisdiction-aware privacy policy for a website or app. Supports GDPR (EU/UK), CCPA (US/California), Australian Privacy Act, and PIPEDA (Canada). Use this when someone needs a privacy policy, wants to know what should be in a privacy policy, or asks about privacy compliance for their website.", {
    business_name: z.string().describe("The name of the business or company"),
    website_url: z.string().describe("The website URL (e.g. https://example.com)"),
    business_type: z.enum(["saas", "ecommerce", "mobile_app", "blog", "agency"]).describe("Type of business"),
    contact_email: z.string().describe("Contact email for privacy inquiries"),
    jurisdictions: z.array(z.enum(["us", "eu", "uk", "au", "ca", "international"])).describe("Jurisdictions to include compliance clauses for"),
    data_collected: z.array(z.enum(["name", "email", "payment", "location", "cookies", "analytics", "social_login", "phone", "address", "usage_data"])).describe("Types of personal data collected"),
    shares_with_third_parties: z.boolean().default(true).describe("Whether data is shared with third-party services"),
    third_party_description: z.string().optional().describe("Description of third-party services used"),
}, async ({ business_name, website_url, business_type, contact_email, jurisdictions, data_collected, shares_with_third_parties, third_party_description }) => {
    const inputs = {
        businessName: business_name,
        websiteUrl: website_url,
        businessType: business_type,
        contactEmail: contact_email,
        jurisdictions,
        dataCollected: data_collected,
        sharesWithThirdParties: shares_with_third_parties,
        thirdPartyDescription: third_party_description || "",
    };
    const policy = generatePrivacyPolicy(inputs);
    return {
        content: [{
                type: "text",
                text: policy,
            }],
    };
});
server.tool("list_jurisdictions", "List the available privacy law jurisdictions that ShipLegal supports for privacy policy generation.", {}, async () => {
    const text = `## Supported Jurisdictions

- **us** — United States (CCPA/CPRA, California)
- **eu** — European Union (GDPR)
- **uk** — United Kingdom (UK GDPR)
- **au** — Australia (Privacy Act 1988)
- **ca** — Canada (PIPEDA)
- **international** — International best practices

## Supported Data Types

name, email, payment, location, cookies, analytics, social_login, phone, address, usage_data

## Supported Business Types

saas, ecommerce, mobile_app, blog, agency

---
*For Terms of Service, Cookie Policy, and Disclaimer, visit [ShipLegal](https://shiplegal.uncommondigitalgroup.com).*`;
    return { content: [{ type: "text", text }] };
});
// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
