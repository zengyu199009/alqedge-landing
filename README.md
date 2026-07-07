# AlphaSync Landing Page

**Domain**: [alqedge.com](https://alqedge.com)

AI-Powered US Stock Analysis — Landing page for AlphaSync (源析), a multi-agent stock analysis tool.

## Tech Stack

- **Framework**: Next.js 14 (Static Export)
- **Styling**: Tailwind CSS
- **Animation**: CSS animations + Canvas particles
- **Form**: Email waitlist (client-side toast notification)
- **GeoIP**: Next.js Middleware (Vercel Edge)

## Sections

1. **Hero** — Title, subtitle, email waitlist CTA, particle background
2. **Features** — 3-column cards: Real-Time Data / Multi-Agent Intelligence / Personalized Insights
3. **Trust Badges** — SEC citation claim + investment disclaimer
4. **CTA (Reinforced)** — Early bird pricing ($9/month forever for first 50) + Join Waitlist
5. **Footer** — Copyright, Privacy Policy, Terms of Service, US-only compliance notice

## Deploy to Vercel

### Prerequisites

- A [Vercel](https://vercel.com) account (free tier works)
- The domain `alqedge.com` registered and DNS managed by Vercel

### Steps

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: AlphaSync landing page"
   git remote add origin https://github.com/<your-username>/alqedge-landing.git
   git push -u origin main
   ```

2. **Import to Vercel**

   - Go to [vercel.com/new](https://vercel.com/new)
   - Import the `alqedge-landing` repository
   - Framework preset: **Next.js**
   - Environment variables: none required
   - Click **Deploy**

3. **Configure Domain**

   - In Vercel Dashboard → Project → Settings → Domains
   - Add `alqedge.com`
   - Follow Vercel's DNS instructions (add CNAME record at your DNS provider pointing to `cname.vercel-dns.com`)

4. **GeoIP (Production)**

   The middleware uses `x-vercel-ip-country` header which Vercel provides automatically on the Pro plan or via Cloudflare in front.

   For production with Cloudflare:
   - Add `alqedge.com` to Cloudflare
   - Enable Cloudflare proxy (orange cloud)
   - The middleware will read `cf-ipcountry` header as fallback

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

Output is in `out/` directory (static export).

## Compliance

- ✅ US-only service (GeoIP middleware)
- ✅ Investment disclaimer on every page
- ✅ "Only serves customers in the United States" in footer
- ✅ No investment advice language
- ✅ CCPA-compliant privacy practices
- ✅ English-only (per PRD §1.4 Q4)

## License

Private — AlphaSync project.
