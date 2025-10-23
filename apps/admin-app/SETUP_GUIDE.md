# Admin App - Setup & Implementation Guide

## ✅ What's Been Built

### 1. Project Foundation
- ✅ Next.js 15 app with App Router at `apps/admin-app/`
- ✅ TypeScript configuration
- ✅ Nx project integration with proper `project.json`
- ✅ styled-components with server-side rendering
- ✅ Theme system (reusing tokens from `apps/website`)
- ✅ Environment variables template (`.env.example`)

### 2. Authentication
- ✅ NextAuth.js setup with email magic link
- ✅ Resend integration for sending login emails
- ✅ Login page (`/auth/signin`)
- ✅ Verification page (`/auth/verify`)
- ✅ JWT sessions (no database required for sessions)
- ✅ Protected routes middleware

### 3. Database Schema
- ✅ Complete Supabase Postgres schema (`src/lib/db/schema.sql`)
  - Users, Clients, Projects
  - Invoices with TPS/TVQ support
  - LinkedIn posts and comments
  - Engagement metrics
  - Settings
- ✅ TypeScript types matching database (`src/types/database.ts`)
- ✅ Supabase client configuration

### 4. Dashboard UI
- ✅ Main layout with sidebar navigation
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Dashboard page with stats cards and activity feed
- ✅ LinkedIn page (manual post entry + AI comment generator)
- ✅ Clients page with card grid layout
- ✅ Projects page with status filters
- ✅ Invoices page with TPS/TVQ calculations
- ✅ Settings page for preferences

### 5. Accessibility
- ✅ WCAG 2.1 AA foundation
- ✅ Focus-visible outlines
- ✅ Reduced motion support in global CSS
- ✅ Keyboard navigation ready
- ✅ Semantic HTML structure

### 6. Dependencies Added
```json
{
  "next-auth": "^4.24.11",
  "@supabase/supabase-js": "^2.48.1",
  "@aws-sdk/client-s3": "^3.714.0",
  "@react-pdf/renderer": "^4.2.0",
  "openai": "^4.81.0",
  "@notionhq/client": "^2.2.16",
  "react-hook-form": "^7.54.2",
  "react-hot-toast": "^2.4.1",
  "lucide-react": "^0.469.0"
}
```

## 🚀 Next Steps to Make It Functional

### Phase 1: Database Setup (Priority: HIGH)

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com
   # Create new project (region: us-east-1)
   # Copy URL and keys
   ```

2. **Run Schema Migration**
   ```sql
   -- In Supabase SQL Editor, run:
   -- apps/admin-app/src/lib/db/schema.sql
   ```

3. **Add Environment Variables**
   ```bash
   cp apps/admin-app/.env.example apps/admin-app/.env.local
   # Fill in:
   # - NEXT_PUBLIC_SUPABASE_URL
   # - NEXT_PUBLIC_SUPABASE_ANON_KEY
   # - SUPABASE_SERVICE_ROLE_KEY
   ```

### Phase 2: Authentication Setup (Priority: HIGH)

1. **Configure Resend**
   - Sign up at https://resend.com
   - Verify domain `arianeguay.ca` in GoDaddy DNS
   - Add SPF/DKIM records
   - Get API key

2. **Setup NextAuth**
   ```bash
   # Generate secret:
   openssl rand -base64 32
   
   # Add to .env.local:
   NEXTAUTH_SECRET=<generated-secret>
   NEXTAUTH_URL=http://localhost:3001
   RESEND_API_KEY=re_xxx
   RESEND_FROM_EMAIL=hello@arianeguay.ca
   ```

### Phase 3: OpenAI Integration (Priority: MEDIUM)

1. **Get OpenAI API Key**
   - Go to https://platform.openai.com
   - Create API key
   - Add to `.env.local`

2. **Implement Comment Generator API Route**
   ```typescript
   // apps/admin-app/src/app/api/linkedin/generate-comments/route.ts
   import OpenAI from 'openai';
   
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });
   
   export async function POST(req: Request) {
     const { postContent, tone } = await req.json();
     
     const response = await openai.chat.completions.create({
       model: 'gpt-4o-mini',
       messages: [
         {
           role: 'system',
           content: `Generate 3 LinkedIn comments in ${tone} tone for a Quebec freelance developer.`,
         },
         { role: 'user', content: postContent },
       ],
     });
     
     return Response.json({ comments: response.choices });
   }
   ```

### Phase 4: CRUD Operations (Priority: HIGH)

Implement API routes for each entity:

```
apps/admin-app/src/app/api/
  ├── clients/
  │   ├── route.ts          # GET (list), POST (create)
  │   └── [id]/route.ts     # GET, PUT, DELETE
  ├── projects/
  │   ├── route.ts
  │   └── [id]/route.ts
  ├── invoices/
  │   ├── route.ts
  │   └── [id]/
  │       ├── route.ts
  │       └── pdf/route.ts  # Generate PDF
  └── linkedin/
      ├── posts/route.ts
      └── comments/route.ts
```

**Example Client API:**
```typescript
// apps/admin-app/src/app/api/clients/route.ts
import { getServiceSupabase } from '../../../lib/db/supabase';

export async function GET() {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json(data);
}

export async function POST(req: Request) {
  const supabase = getServiceSupabase();
  const body = await req.json();
  
  const { data, error } = await supabase
    .from('clients')
    .insert(body)
    .select()
    .single();
  
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json(data);
}
```

### Phase 5: PDF Generation (Priority: MEDIUM)

1. **Setup AWS S3**
   ```bash
   # Create bucket: ag-admin-app-prod (us-east-1)
   # Add credentials to .env.local
   ```

2. **Implement Invoice PDF Route**
   ```typescript
   // apps/admin-app/src/app/api/invoices/[id]/pdf/route.ts
   import { Document, Page, Text, pdf } from '@react-pdf/renderer';
   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
   
   // Create PDF document component
   // Upload to S3
   // Return signed URL
   ```

### Phase 6: Vercel Cron Jobs (Priority: LOW)

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/engagement-rollup",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/invoice-reminders",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

### Phase 7: Contentful Integration (Priority: LOW)

```typescript
// apps/admin-app/src/lib/contentful.ts
import { createClient } from 'contentful-management';

const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
});

export async function publishProject(projectData: any) {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
  const environment = await space.getEnvironment('master');
  
  // Create/update entry
  // Publish
}
```

## 📦 Installation & Run

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp apps/admin-app/.env.example apps/admin-app/.env.local

# Start dev server
pnpm dev:admin

# Build for production
pnpm build:admin
```

The app will run at http://localhost:3001

## 🔐 Security Checklist

- [ ] All API keys in environment variables
- [ ] Supabase RLS policies enabled
- [ ] S3 bucket policies set (private for invoices)
- [ ] NextAuth secret generated and secure
- [ ] CORS configured properly
- [ ] Rate limiting on API routes
- [ ] Input validation with Zod
- [ ] SQL injection protection (using Supabase client)

## 📊 Testing Plan

1. **Authentication Flow**
   - [ ] Magic link email sent
   - [ ] Login successful
   - [ ] Protected routes redirect to login

2. **CRUD Operations**
   - [ ] Create client
   - [ ] Update client
   - [ ] Delete client
   - [ ] Same for projects, invoices

3. **LinkedIn Features**
   - [ ] Add post manually
   - [ ] Generate comments with different tones
   - [ ] Copy comment to clipboard

4. **Invoice Generation**
   - [ ] Create invoice with line items
   - [ ] Calculate TPS/TVQ correctly
   - [ ] Generate PDF
   - [ ] Upload to S3

5. **Accessibility**
   - [ ] Keyboard navigation works
   - [ ] Screen reader compatible
   - [ ] Focus indicators visible
   - [ ] Reduced motion respected

## 🎨 Design System

All tokens are inherited from `apps/website/src/theme`:

- **Colors**: Brand primary `#8C0F48`, accent `#F6C2D4`
- **Typography**: Manrope (display), Inter (body)
- **Spacing**: 4px base unit
- **Shadows**: Subtle elevations
- **Radius**: 8-12px for cards
- **Motion**: 150-320ms transitions

## 🚀 Deployment

```bash
# Build
pnpm build:admin

# Deploy to Vercel
vercel --prod

# Environment variables to set in Vercel:
# - All from .env.local
# - NEXTAUTH_URL=https://admin.arianeguay.ca
```

## 📝 Remaining TODOs

### High Priority
- [ ] Implement all CRUD API routes
- [ ] Connect UI to real data (replace demo data)
- [ ] Add form validation with react-hook-form + Zod
- [ ] Add toast notifications (react-hot-toast)
- [ ] Implement error boundaries
- [ ] Add loading states

### Medium Priority
- [ ] PDF generation with @react-pdf/renderer
- [ ] S3 upload for PDFs
- [ ] OpenAI integration for comments
- [ ] Seed data script
- [ ] Invoice numbering auto-increment
- [ ] Client/Project relationship selectors

### Low Priority
- [ ] Notion sync implementation
- [ ] Contentful push functionality
- [ ] Email sending via Resend
- [ ] Engagement metrics tracking
- [ ] Dark mode toggle
- [ ] i18n with next-i18next

## 📞 Support

For questions or issues:
- Check the `.env.example` for required variables
- Review the database schema in `src/lib/db/schema.sql`
- Consult the decisions in `prompts/admin-app/generate_admin_app_decisions.md`
