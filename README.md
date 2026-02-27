# FinFlow AI 📰

> **AI-curated finance news, market analysis, and investing guides for Tier-1 investors.**

FinFlow AI is a modern, full-stack blog platform built with **Next.js 16** and **MongoDB**. It leverages OpenAI to automatically generate high-quality financial articles, supports category browsing, moderated comments, an admin dashboard, and is fully optimized for SEO.

---

## ✨ Features

- ⚡ **AI-Powered Content** — Automatically generates finance articles using OpenAI GPT-4o via a secure cron automation endpoint
- 🗂️ **Category Browsing** — Filter posts by finance categories (Markets, Investing, Crypto, etc.)
- 💬 **Moderated Comments** — Readers can submit comments; admins approve before they go live
- 🛡️ **Admin Dashboard** — Create, edit, publish, and delete blog posts; manage comments
- 🗺️ **SEO Optimized** — Dynamic sitemap, robots.txt, and canonical URLs baked in
- 📱 **Responsive Design** — Mobile-first layout with Tailwind CSS v4
- 🏷️ **Ad Integration** — Google AdSense banner and anchor ad slots ready to configure

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + Lucide React |
| Database | MongoDB Atlas via Mongoose |
| Validation | Zod v4 |
| AI | OpenAI GPT-4o |
| Server Actions | next-safe-action |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- An [OpenAI API key](https://platform.openai.com/api-keys)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/finfllow.git
cd finfllow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/finflow?retryWrites=true&w=majority

# OpenAI API Key (GPT-4o)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Secret token to protect the cron automation endpoint
# Generate one with: openssl rand -base64 32
CRON_SECRET=your-super-secret-cron-token-here

# Base URL (used for sitemap & canonical URLs)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Site name
NEXT_PUBLIC_SITE_NAME=FinFlow AI
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
finfllow/
├── public/                   # Static assets
├── src/
│   ├── actions/              # Next.js server actions
│   │   ├── blog.actions.ts   # Blog fetch helpers
│   │   ├── comment.actions.ts# Comment submit / approve / delete
│   │   └── post.actions.ts   # Admin post CRUD
│   ├── app/                  # Next.js App Router pages
│   │   ├── admin/            # Admin dashboard (posts, comments)
│   │   ├── api/              # API routes (cron automation)
│   │   ├── blog/             # Public blog post pages
│   │   ├── category/         # Category filter pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   ├── sitemap.ts        # Dynamic sitemap
│   │   └── robots.ts         # robots.txt
│   ├── components/           # Reusable UI components
│   │   ├── ads/              # AdSense banner & anchor components
│   │   ├── blog/             # BlogCard, CommentForm, etc.
│   │   └── ui/               # Shared UI (Skeleton, Tabs, etc.)
│   ├── lib/                  # Utilities
│   │   ├── mongodb.ts        # Mongoose connection helper
│   │   ├── validations.ts    # Zod schemas
│   │   └── utils.ts          # Categories & helpers
│   └── models/               # Mongoose models
│       ├── Blog.ts           # Blog post schema
│       └── Comment.ts        # Comment schema
├── .env.local.example        # Environment variable template
├── next.config.ts            # Next.js configuration
└── package.json
```

---

## 🤖 AI Content Automation

FinFlow AI includes a protected cron endpoint that automatically generates and publishes financial articles using GPT-4o.

**Trigger manually:**
```bash
curl -X POST http://localhost:3000/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Schedule with a cron service** (e.g., [cron-job.org](https://cron-job.org) or Vercel Cron Jobs):
```
POST https://your-domain.com/api/cron
Authorization: Bearer YOUR_CRON_SECRET
```

> ⚠️ Keep your `CRON_SECRET` private. Anyone with this token can trigger article generation.

---

## 🔑 Admin Panel

Access the admin panel at `/admin` to:

- ✍️ **Manually create posts** with a rich form
- ✅ **Publish / unpublish** articles
- 🗑️ **Delete** posts
- 💬 **Approve or reject** reader comments

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🌐 Deployment

This project is optimized for deployment on **Vercel**.

1. Push your repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local.example` in the Vercel dashboard
4. Deploy!

For automated article generation, configure a **Vercel Cron Job** in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 8 * * *"
    }
  ]
}
```

---

## 📄 License

This project is private and proprietary. All rights reserved.
