# GitHub Pages Deployment Guide

## 1. Prerequisites & GitHub Repository Settings

ArthaAtlas P2P is configured for static hosting via **GitHub Pages** using GitHub Actions:
- **Repository**: `https://github.com/chirag127/artha-atlas-p2p`
- **Base Subpath**: `/artha-atlas-p2p/`
- **Live Target URL**: `https://chirag127.github.io/artha-atlas-p2p/`

---

## 2. One-Time Setup Instructions

To enable GitHub Pages in your GitHub repository:
1. Open the repository on GitHub: `https://github.com/chirag127/artha-atlas-p2p`
2. Navigate to **Settings** (top navigation bar)
3. In the left sidebar, click on **Pages** (under the "Code and automation" section)
4. Under **Build and deployment**:
   - Change **Source** from *"Deploy from a branch"* to **"GitHub Actions"**
5. Push your commits to `main`:
   ```bash
   git add .
   git commit -m "feat: complete ArthaAtlas P2P educational platform with 100 articles"
   git push origin main
   ```
6. The automated workflow `.github/workflows/deploy.yml` will automatically:
   - Check out code
   - Install dependencies (`npm ci`)
   - Run Vitest financial unit tests
   - Validate all 100 MDX articles and source registers
   - Build static HTML and generate the Pagefind WebAssembly search index
   - Deploy to `https://chirag127.github.io/artha-atlas-p2p/`

---

## 3. Custom Domain Configuration (Optional Future Upgrade)
If you configure a custom domain like `artha-atlas.in`:
1. In `astro.config.mjs`, update:
   - `site: 'https://artha-atlas.in'`
   - `base: '/'`
2. Add your domain in **Settings** > **Pages** > **Custom domain**.
3. Point your DNS records (A and CNAME) to GitHub Pages IP addresses.
