# 10-Pillar Management Dashboard - Deployment Guide

## Quick Start for GitHub & Netlify

### Step 1: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Create a new repository (e.g., `pillar-dashboard`)
3. Choose "Public" or "Private" based on your preference

### Step 2: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit: 10-Pillar Management Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pillar-dashboard.git
git push -u origin main
```

### Step 3: Deploy to Netlify

The repository includes a `netlify.toml` at the root that configures the build automatically. It sets the base directory to `pillar-dashboard/`, runs `pnpm install && pnpm build`, publishes from `dist/public` (matching the Vite output directory), and includes a SPA redirect rule for client-side routing.

#### Option A: Using Netlify UI (Easiest)
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and authorize Netlify
4. Choose your repository
5. Build settings will be auto-detected from `netlify.toml` - no manual configuration needed
6. Click "Deploy site"

#### Option B: Using Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
# Follow prompts and deploy
```

### Step 4: Configure Environment Variables (if needed)
In Netlify dashboard:
1. Go to Site settings → Build & deploy → Environment
2. Add any required environment variables
3. Trigger a new deploy

### Features Included
✅ 10 Customizable Pillars (BAU, C.I., Comms, Data, Doc/Gov/Ctrls, KPIs, People, Risk Mgt, Stakeholders, Tech)
✅ Multi-list management per pillar
✅ Inline cell editing
✅ CSV export/import with two modes (new list or existing list)
✅ Collapsible sidebar (default open)
✅ Local storage persistence
✅ Real-time statistics

### Build & Test Locally
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Project Structure
```
├── netlify.toml              # Netlify build & deploy configuration
└── pillar-dashboard/
    ├── client/
    │   ├── public/           # Static assets
    │   ├── src/
    │   │   ├── components/   # Reusable UI components
    │   │   ├── pages/        # Page components (Dashboard)
    │   │   ├── lib/          # Utilities (types, storage)
    │   │   ├── App.tsx       # Main app component
    │   │   ├── main.tsx      # React entry point
    │   │   └── index.css     # Global styles
    │   └── index.html        # HTML template
    ├── server/               # Express server (dev only, not used on Netlify)
    ├── package.json          # Dependencies
    ├── vite.config.ts        # Vite configuration
    └── tsconfig.json         # TypeScript configuration
```

### Troubleshooting

**Build fails with "Module not found"**
- Run `pnpm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `pnpm install --force`

**Netlify deployment fails**
- Check build logs in Netlify dashboard
- Ensure Node version is 22.x or higher
- Verify `pnpm` is available in build environment
- Ensure the `netlify.toml` at the repository root is present - it configures the base directory, build command, and publish directory automatically

**Data not persisting**
- Dashboard uses browser localStorage
- Data persists across sessions but is device-specific
- Clear browser cache to reset data
- Use "Reset" button in dashboard to reinitialize with default pillars

**CSV import not working**
- Ensure CSV file is properly formatted (comma-separated values)
- First row should contain headers if "Use first row as headers" is checked
- Check browser console for error messages

### Environment Variables
No environment variables are required for basic functionality. The dashboard works entirely client-side with localStorage.

### Performance Tips
- Dashboard handles up to 1000+ rows per list efficiently
- Browser storage limit is typically 5-10MB per domain
- For very large datasets (10,000+ rows), consider exporting to CSV and splitting into multiple lists

### Support
For issues or feature requests, refer to the project README or create an issue on GitHub.
