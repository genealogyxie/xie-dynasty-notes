# Xie Dynasty Notes

A fully-featured OneNote clone with cross-platform support and server-backed history.

## Features

### Core Functionality
- Rich text editing with TipTap (headings, lists, tables, code blocks, etc.)
- Real-time collaboration with Yjs CRDT
- Offline-first architecture with automatic sync
- Full edit history forever (EverNote-style)
- Hierarchical organization (Workspaces > Notebooks > Sections > Pages)
- File attachments with thumbnails
- Full-text search
- Drawing and inking support
- Tags and favorites
- Drag-and-drop reordering

### Platform Support
- **Web**: Progressive Web App (PWA)
- **Desktop**: Windows, macOS, Linux (via Tauri)
- **Mobile**: Android, iOS (via Capacitor)
- **HarmonyOS**: Phones and PC (via ArkTS WebView wrapper)

### Collaboration
- Real-time multi-user editing
- User presence indicators
- Live cursors with names
- Conflict-free merging (CRDT-based)
- Share links with permissions

### UI/UX
- Polished Fluent Design System styling
- Light and dark themes
- Responsive layout
- Keyboard shortcuts
- Accessibility support

## Architecture

### Monorepo Structure
```
xie-dynasty-notes/
├── apps/
│   ├── web/          # React PWA (main UI)
│   ├── server/       # FastAPI backend
│   ├── desktop/      # Tauri wrapper
│   ├── mobile/       # Capacitor wrapper
│   └── harmony/      # HarmonyOS wrapper docs
└── packages/         # Shared packages (future)
```

### Technology Stack

**Frontend:**
- React 18 + TypeScript
- TipTap (ProseMirror) for rich text editing
- Yjs for CRDT and real-time collaboration
- Zustand for state management
- Tailwind CSS + shadcn/ui components
- Vite for build tooling

**Backend:**
- FastAPI (Python) with async/await
- SQLAlchemy + SQLite/PostgreSQL
- WebSocket for Yjs sync
- JWT authentication
- In-memory storage (proof of concept)

**Platform Wrappers:**
- Tauri (Rust + WebView) for desktop
- Capacitor for mobile
- ArkTS WebView for HarmonyOS

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- Poetry (for Python dependencies)

### Backend Setup

```bash
cd apps/server
poetry install
poetry run fastapi dev app/main.py
```

Backend runs at http://localhost:8000

### Frontend Setup

```bash
cd apps/web
npm install
npm run dev
```

Frontend runs at http://localhost:5173

### Desktop App

```bash
cd apps/desktop
npm install
npm run tauri dev
```

### Mobile App

```bash
cd apps/mobile
npm install
npx cap add android  # or ios
npx cap sync
npx cap open android  # or ios
```

### HarmonyOS App

See `apps/harmony/README.md` for detailed instructions.

## Development

### Database
Currently uses in-memory SQLite for proof of concept. Data will be lost on server restart.

### Environment Variables

**Backend** (`.env` in `apps/server/`):
```
DATABASE_URL=sqlite:///./notes.db
JWT_SECRET=your-secret-key
```

**Frontend** (`.env` in `apps/web/`):
```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## Deployment

### Backend
Deploy to Fly.io, Render, or any Python hosting service.

### Frontend
Deploy to Vercel, Netlify, or any static hosting service.

### Desktop
Build installers for each platform:
```bash
cd apps/desktop
npm run tauri build
```

### Mobile
Build using Android Studio or Xcode.

## Features Roadmap

### Implemented
- ✓ User authentication (register/login)
- ✓ Workspace management
- ✓ Notebook/section/page hierarchy
- ✓ Rich text editing with TipTap
- ✓ Real-time collaboration with Yjs
- ✓ WebSocket sync
- ✓ Offline-first with IndexedDB
- ✓ Full history with doc updates
- ✓ Platform wrappers (Tauri, Capacitor, HarmonyOS docs)

### In Progress
- Drawing/inking canvas
- File attachments with S3 storage
- Full-text search
- OCR for images
- Version history UI
- Tags and favorites UI

### Future
- Web clipper browser extension
- Import from OneNote/Evernote
- Export to PDF/Markdown
- Audio notes
- Handwriting recognition
- End-to-end encryption
- Mobile share targets
- Print support

## Contributing

This is a personal project, but contributions are welcome!

## License

See LICENSE file for details.

## Credits

Built by Gene Xie (genepoolxie@gmail.com) with assistance from Devin AI.
