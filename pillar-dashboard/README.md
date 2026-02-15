# 10-Pillar Management Dashboard

A modern, responsive web application for managing organizational data across 10 customizable pillars. Built with React 19, Tailwind CSS 4, and shadcn/ui components.

## 🎯 Features

### Core Functionality
- **10 Customizable Pillars** - Organize data into logical categories:
  - BAU (deadlines) 📋
  - C.I. (Dev) 💻
  - Comms (Internal) 💬
  - Data 📊
  - Doc / Gov / Ctrls 📋
  - KPIs 📈
  - People (Funds) 👥
  - Risk Mgt ⚠️
  - Stakeholders 🤝
  - Tech 🔧

- **Multi-List Management** - Create unlimited lists within each pillar
- **Dynamic Tables** - Specify custom columns and rows for each list
- **Inline Editing** - Edit any cell directly in the table
- **CSV Import/Export** - Two import modes:
  - Create new list from CSV (with header detection)
  - Upload data to existing list
- **Collapsible Sidebar** - Toggle sidebar visibility (default: open)
- **Auto-Save** - All data persists to browser localStorage
- **Real-Time Statistics** - Dashboard displays total pillars, lists, and rows

### User Interface
- Clean, professional design inspired by Microsoft Fluent Design System
- Responsive layout for desktop and tablet devices
- Smooth animations and transitions
- Toast notifications for user feedback
- Empty states with helpful guidance

## 🚀 Quick Start

### Prerequisites
- Node.js 22.x or higher
- pnpm (or npm/yarn)

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/pillar-dashboard.git
cd pillar-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
# Build the project
pnpm build

# Preview production build
pnpm preview

# Start production server
pnpm start
```

## 📁 Project Structure

```
pillar-dashboard/
├── client/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx     # Pillar navigation sidebar
│   │   │   ├── ListTable.tsx   # Data table component
│   │   │   └── ui/             # shadcn/ui components
│   │   ├── pages/
│   │   │   └── Dashboard.tsx   # Main dashboard page
│   │   ├── lib/
│   │   │   ├── types.ts        # TypeScript type definitions
│   │   │   ├── storage.ts      # localStorage utilities
│   │   │   └── utils.ts        # Helper functions
│   │   ├── contexts/           # React contexts
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # React entry point
│   │   └── index.css           # Global styles & theme
│   └── index.html              # HTML template
├── server/
│   └── index.ts                # Express server
├── package.json                # Dependencies
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── README.md                   # This file
└── DEPLOYMENT_GUIDE.md         # Deployment instructions
```

## 🎨 Design System

### Color Palette
- **Primary:** Blue (#0078d4)
- **Secondary:** Light gray (#f5f5f5)
- **Accent:** Purple (#6b69d6)
- **Destructive:** Red (#d13438)

### Typography
- **Display:** Segoe UI, system fonts
- **Body:** Inter, system fonts
- **Monospace:** Courier New, monospace

### Components
All UI components are built with shadcn/ui and Tailwind CSS:
- Buttons, Inputs, Dialogs
- Cards, Tabs, Dropdowns
- Tables, Forms, Alerts
- And many more...

## 📊 Data Management

### CSV Import Format
```csv
Task,Owner,Status,Due Date
Launch new product,Sarah Chen,In Progress,March 31 2026
Update documentation,John Smith,Pending,April 15 2026
```

### Browser Storage
- Data is stored in browser localStorage
- Storage limit: typically 5-10MB per domain
- Data persists across browser sessions
- Clearing browser data will reset the dashboard

### Exporting Data
- Click the download icon on any list to export as CSV
- CSV files can be imported into Excel, Google Sheets, or other tools

## 🔧 Development

### Available Scripts
```bash
# Development server with hot reload
pnpm dev

# Type checking
pnpm check

# Build for production
pnpm build

# Preview production build
pnpm preview

# Format code
pnpm format
```

### Technology Stack
- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Routing:** Wouter (client-side)
- **State Management:** React hooks
- **Build Tool:** Vite
- **Server:** Express (production)
- **Package Manager:** pnpm

## 📱 Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Deploy to Netlify
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

Quick summary:
1. Push code to GitHub
2. Connect GitHub repository to Netlify
3. Configure build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`
4. Deploy!

### Other Hosting Options
- Vercel
- GitHub Pages
- AWS Amplify
- Firebase Hosting
- Any static hosting service

## 🐛 Troubleshooting

### Data not saving
- Check browser storage is enabled
- Verify localStorage is not full
- Try clearing browser cache and reloading

### CSV import fails
- Ensure CSV is properly formatted (comma-separated)
- Check for special characters or encoding issues
- Verify file size is reasonable (< 5MB)

### Build errors
- Run `pnpm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `pnpm install --force`
- Check Node.js version: `node --version` (should be 22.x+)

## 📝 License
MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing
Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📧 Support
For questions or issues, please create an issue on GitHub or contact the project maintainer.

---

Built with ❤️ using React, Tailwind CSS, and shadcn/ui
