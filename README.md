# Principal Architecture: React Email & Dynamic PDF System

A high-performance, type-safe orchestration layer for rendering mission-critical HTML emails and pixel-perfect PDF reports using React (TSX) on the backend.

## 1. System Overview

This module treats "Content as Code." By leveraging `@react-email`, we eliminate brittle string concatenation and opaque HTML templates in favor of a declarative, component-based architecture.

- **Deterministic Rendering**: Component-based logic ensures absolute ordering parity for complex, interleaved data structures.
- **Infrastructure Agnostic**: The `EmailRenderer` abstraction decouples template logic from the delivery provider (Mailgun, Resend, SMTP).
- **Pixel-Perfect PDF**: Integrated CSS paged-media rules (`page-break-*`) ensure stability during PDF generation (e.g., via Headless Chrome).

---

## 2. Quick Start & Setup

### 2.1 Dependencies
Install the core rendering and type-safe infrastructure:

```bash
# Core Rendering Engine
npm install react react-dom @react-email/components @react-email/render

# Type Safety
npm install -D @types/react @types/react-dom
```

*Note: If using SWC for runtime execution (recommended), ensure `@swc-node/register` is in your devDependencies.*

### 2.2 Configuration

#### `tsconfig.json`
Add JSX support to your backend compiler:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

#### `.swcrc` (High-Performance Runtime)
To execute `.tsx` directly in Node.js (via `@swc-node/register`):
```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true
    },
    "transform": {
      "react": {
        "runtime": "automatic"
      }
    }
  },
  "module": {
    "type": "commonjs"
  }
}
```

---

## 3. Production Implementation Patterns

### Pattern A: Mailgun (High Volume)
```ts
import EmailRenderer from "./email-templates/EmailRenderer";
import { EmailTemplate } from "./email-templates/utils/email-templates.interfaces";

async function dispatchMailgun(args: IWeeklyUpdateEmailArgs) {
  const html = await EmailRenderer.render(EmailTemplate.WEEKLY_UPDATE_EMAIL, args);
  // Send via mailgun client
  await mailgun.send({
    from: 'onboarding@agencyframework.io',
    to: args.email,
    subject: 'Welcome',
    html: html
  });
}
```

### Pattern B: Resend (Modern DX)
```ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

async function dispatchResend(args: any) {
  const html = await EmailRenderer.render(EmailTemplate.WEEKLY_UPDATE_EMAIL, args);
  await resend.emails.send({
    from: 'onboarding@agencyframework.io',
    to: args.email,
    subject: 'Welcome',
    html: html
  });
}
```

### Pattern C: SMTP / Nodemailer
```ts
import nodemailer from 'nodemailer';

async function dispatchSmtp(args: any) {
  const html = await EmailRenderer.render(EmailTemplate.PASSWORD_RESET, args);
  // Transmit via SMTP Transporter
}
```

---

## 4. Practical Guide: Adding a New Template

To maintain architectural integrity, follow this deterministic workflow:

### Step 1: Create the Component
Create `src/email-templates/templates/NewFeatureEmail.tsx`:

```tsx
import { Section, Text } from "@react-email/components";
import { Layout } from "../components/Layout";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const NewFeatureEmail = ({ featureName, ...layoutProps }) => (
  <Layout previewText={`Check out ${featureName}`} {...layoutProps}>
    <Header appName="AgencyFramework" subtitle="Product Update" />
    <Section style={{ padding: '32px' }}>
      <Text>New feature release: {featureName}</Text>
    </Section>
    <Footer {...layoutProps} />
  </Layout>
);
```

### Step 2: Register in Interfaces
Update `src/email-templates/utils/email-templates.interfaces.ts`:

```ts
export enum EmailTemplate {
  // ... existing
  NEW_FEATURE_EMAIL = 'NEW_FEATURE_EMAIL',
}

export type EmailTemplateArgsMap = {
  // ... existing
  [EmailTemplate.NEW_FEATURE_EMAIL]: { featureName: string; email: string };
};
```

### Step 3: Map in Renderer
Update `src/email-templates/EmailRenderer.ts`:

```ts
import { NewFeatureEmail } from "./templates/NewFeatureEmail";

// Inside templateMap:
[EmailTemplate.NEW_FEATURE_EMAIL]: NewFeatureEmail,
```

---

## 5. Engineering Standards for PDF
1. **Button Visibility**: Always use `@react-email/components` `<Link />`. The `actionButtonStyle` includes `!important` on colors to ensure they survive hardware-agnostic PDF printer drivers.
2. **Page-Break Stability**: Use `pageBreakInside: "avoid"` on tables and card blocks. Wrap critical headers with `pageBreakAfter: "avoid"`.
3. **No Iframe**: Deprecated iframes in favor of high-fidelity link containers in the `EmbedMetricRow`.
