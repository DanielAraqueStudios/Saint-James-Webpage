# Santiago Leiva | Official Artist Platform 🎵

A cinematic, high-performance web portfolio for electronic music artist **Santiago Leiva**. Combining the bold, industrial aesthetic of top-tier techno visual identities with a highly interactive, taxonomic layout for music releases and tour dates.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-white?logo=framer&logoColor=black&style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deployment-GitHub_Pages-2EA44F?logo=github&style=for-the-badge)

## ✨ Key Features

- **Cinematic Dark Mode**: A custom `zinc-950` design system that provides a premium, immersive user experience.
- **Live Spotify Integration**: Taxonomic music grid that dynamically renders real playable Spotify iframes to showcase releases and playlists directly in the UI.
- **Fluid Interactions**: App-wide animations, layout crossfades, and interactive overlay menus orchestrated by Framer Motion.
- **Tour Engine**: Structured and responsive gig-listing with dynamic states (e.g., Sold Out notifications) and ticket hooks.
- **Static & Fast**: Architected for static export (`output: 'export'`), enabling global CDN distribution and robust hosting via GitHub Pages.

## 🛠️ Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/) / React
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **DevOps:** Automations via GitHub Actions & custom Python scripts

## 🚀 Getting Started (Local Development)

You can easily run this project locally using the custom Python orchestrator, which automatically manages environment paths and boots the Node server.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Python 3.x

### Run Local Environment
1. Clone the repository to your machine.
2. Ensure you are in the root directory.
3. Run the custom orchestrator script:
   ```bash
   python run_dev.py
   ```

*Alternatively, if you prefer the standard Node.js workflow:*
```bash
cd frontend
npm install   # Installs all required dependencies
npm run dev   # Starts the development server at localhost:3000
```

## 📦 Deployment (Production)

This application has a fully automated CI/CD pipeline integrated with **GitHub Pages**.

- Pushing code to the `main` or `master` branch triggers the GitHub Action (`.github/workflows/deploy.yml`).
- The pipeline securely installs dependencies, builds the Next.js static output, and deploys it live.

> **Note:** If you plan to switch to a Server-Side Rendered (SSR) environment like Vercel or a Node VPS in the future, please consult the `frontend/DEPLOYMENT.md` documentation for migration steps.

---

<p align="center">
  <i>Designed & Engineered meticulously for the global stage.</i>
</p>