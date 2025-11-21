# OneNote Parity Gap Analysis

This document tracks the gaps between our app and Microsoft OneNote, organized by priority.

## Status Legend
- ✅ Complete and tested
- 🚧 In progress
- ⏳ Planned
- ❌ Not started

---

## P1: Visual Polish & Navigation (CRITICAL)

### Design System
- ✅ Migrate from shadcn/ui to Fluent UI v9
- ✅ Implement Fluent design tokens (typography, spacing, colors, shadows)
- ✅ Add light/dark theme support (auto-detect system preference)
- 🚧 Consistent spacing grid and elevation system (partially done)
- 🚧 Fluent motion and transitions (basic implementation)

### Navigation & Layout
- 🚧 Notebook sidebar with color-coded tabs (basic sidebar implemented)
- ⏳ Page list with thumbnails/previews
- ✅ Quick search in header bar
- ✅ Command palette (Ctrl+K)
- ⏳ Contextual toolbars that appear on selection
- ⏳ Breadcrumb navigation
- 🚧 Collapsible sections in sidebar (basic implementation)

### Accessibility
- ✅ Full keyboard navigation (Tab, Arrow keys, Enter, Esc)
- 🚧 ARIA labels for all interactive elements (partial)
- ⏳ Screen reader support (Narrator, NVDA, JAWS)
- ✅ Focus indicators and focus management
- 🚧 High contrast mode support (via Fluent UI)
- ✅ Keyboard shortcuts parity with OneNote (Ctrl+K, Ctrl+P, Ctrl+Shift+F)

---

## P2: Canvas Page Model (CRITICAL)

### Freeform Layout
- ✅ Canvas-style pages (not just flowing document)
- ✅ Movable text/media containers
- ✅ Resizable containers with drag handles
- ✅ Grid snapping and alignment guides (20px grid)
- ⏳ Multi-select containers (Shift+Click, Ctrl+Click)
- ✅ Z-order management (bring to front/send to back)
- ✅ Container anchoring and positioning

### Implementation
- 🚧 TipTap NodeViews for positioned blocks (basic blocks implemented)
- ✅ Drag-and-drop with visual feedback
- ✅ Resize handles with constraints
- ✅ Snap-to-grid with visual guides
- ⏳ Selection box for multi-select
- ✅ Yjs sync for container positions/sizes

---

## P3: Inking System (HIGH PRIORITY)

### Core Inking
- ✅ Pressure-sensitive pen input
- ⏳ Tilt support for shading
- ✅ Pen tool (various sizes and colors)
- ✅ Highlighter tool (semi-transparent)
- ✅ Eraser tool (stroke eraser)
- ⏳ Lasso selection tool
- ✅ Ink smoothing and stroke optimization (quadratic curves)

### Advanced Features
- ⏳ Shape recognition (circles, squares, arrows)
- ⏳ Ink-to-text conversion
- ⏳ Ink-to-shape conversion
- ✅ Ink layering with content
- ⏳ Ink replay/animation
- ✅ Yjs sync for ink strokes
- 🚧 GPU-accelerated rendering (HTML5 Canvas)

---

## P4: Attachments & PDF (HIGH PRIORITY)

### PDF Printout
- ✅ Insert PDF as printout (paged images)
- ✅ PDF.js integration for rendering
- ⏳ Annotate/ink on PDF pages
- ⏳ OCR text overlay for searchability
- ⏳ Page reordering within printout
- ⏳ Extract pages from printout

### File Attachments
- ⏳ Attach any file type
- ⏳ Thumbnail generation for images/PDFs
- ⏳ Preview pane for common formats
- ⏳ Open in default application
- ⏳ S3-compatible storage integration
- ⏳ Drag-and-drop file upload
- ⏳ Paste images from clipboard

### Media
- ⏳ Image resize/crop in-place
- ⏳ Audio recording with timeline anchors
- ⏳ Video embedding
- ⏳ Screen clipping tool

---

## P5: Search (HIGH PRIORITY)

### Global Search
- ✅ Fast full-text search across all content
- ✅ Search in titles, body text, tags
- ⏳ OCR text search in images
- ⏳ PDF content search
- ⏳ Handwriting search (if feasible)
- ⏳ Search filters (notebook, author, date, type)
- ✅ Search highlighting in results
- ⏳ Recent searches

### Implementation
- 🚧 Meilisearch or Postgres FTS integration (client-side search implemented)
- 🚧 Real-time indexing on content changes (client-side)
- ⏳ OCR pipeline with Tesseract
- ✅ Search result ranking
- ✅ Instant search (as-you-type)

---

## P6: History & Versioning (MEDIUM PRIORITY)

### Version History
- ✅ Per-page timeline view
- 🚧 Visual diff between versions (basic preview)
- ✅ Restore to previous version
- ⏳ Per-block history (if feasible)
- ⏳ Snapshot compression and pruning
- ⏳ Cross-session undo depth

### Recycle Bin
- ✅ Soft delete for pages/sections/notebooks
- ✅ Recycle bin UI
- ✅ Restore from recycle bin
- ✅ Permanent delete
- ✅ Auto-purge after 60 days (UI indication)

---

## P7: Collaboration (MEDIUM PRIORITY)

### Real-time Collaboration
- ✅ Yjs CRDT for conflict-free sync
- ✅ Collaborative cursors with names/colors
- ❌ Presence indicators (who's viewing)
- ❌ Active editors list
- ❌ Typing indicators

### Comments & Mentions
- ❌ Comment threads on content
- ❌ @mentions with notifications
- ❌ Resolve/unresolve comments
- ❌ Comment notifications

### Permissions & Sharing
- ❌ Per-workspace permissions
- ❌ Per-notebook permissions
- ❌ Per-section permissions
- ❌ Per-page permissions
- ❌ Role-based access (owner, editor, viewer)
- ❌ Share links with expiration
- ❌ Invite via email
- ❌ Public sharing with password

---

## P8: Import/Export & Capture (MEDIUM PRIORITY)

### Export
- ✅ Export to Markdown
- ✅ Export to HTML
- ⏳ Export to PDF
- ⏳ Export to Word (.docx)
- ⏳ Bulk export (entire notebook)

### Import
- ✅ Import from Markdown
- ✅ Import from HTML
- ✅ Import from Plain Text
- ✅ Import from JSON
- ⏳ Import from Evernote (.enex)
- ⏳ Import from OneNote (best effort)

### Web Clipper
- ⏳ Chrome/Edge extension
- ⏳ Clip full page
- ⏳ Clip selection
- ⏳ Clip screenshot
- ⏳ Simplified article view

### Quick Capture
- ⏳ Desktop tray icon
- ⏳ Global keyboard shortcut
- ⏳ Quick note window
- ⏳ Screenshot to page
- ⏳ Audio quick capture

---

## P9: Platform Packaging (HIGH PRIORITY)

### Windows
- ❌ MSVC build (not GNU cross-compile)
- ❌ MSI installer with WebView2 bootstrapper
- ❌ Code signing certificate
- ❌ Auto-update mechanism
- ❌ ARM64 build
- ❌ Start menu integration
- ❌ File associations (.one files)

### macOS
- ❌ Notarized DMG
- ❌ Code signing
- ❌ Auto-update
- ❌ ARM64 (Apple Silicon) build
- ❌ Universal binary (x64 + ARM64)

### Linux
- ❌ AppImage
- ❌ .deb package
- ❌ .rpm package
- ❌ Flatpak
- ❌ Snap

### Mobile
- ❌ Android APK signed for Play Store
- ❌ iOS IPA signed for App Store
- ❌ Pen integration (Android/iPad)
- ❌ Camera integration
- ❌ Share intents

### CI/CD
- ❌ GitHub Actions for all platforms
- ❌ Automated builds on push
- ❌ Release artifacts
- ❌ Version bumping

---

## P10: Performance & Quality (ONGOING)

### Performance Budgets
- ❌ Cold start < 2s (web/desktop)
- ❌ Editor ready < 1s
- ❌ Typing latency < 50ms
- ❌ Ink latency < 10ms
- ❌ Search results < 200ms
- ❌ Page load < 500ms

### Optimization
- ❌ Block-level Yjs documents (not single huge doc)
- ❌ Lazy load pages
- ❌ Virtualize long lists
- ❌ Throttle decorations and cursors
- ❌ Snapshot compaction
- ❌ Ink rendering optimization
- ❌ Image lazy loading and thumbnails

### Testing
- ❌ Unit tests for core logic
- ❌ Integration tests for API
- ❌ E2E tests with Playwright
- ❌ Offline/online transition tests
- ❌ Concurrent editing tests
- ❌ Performance regression tests
- ❌ Accessibility audit

---

## Additional Features

### Templates & Customization
- ✅ Page templates (meeting notes, to-do, etc.)
- 🚧 Custom templates (basic templates implemented)
- ✅ Page backgrounds (ruled, grid, blank, dotted, graph, cream)
- ✅ Section groups (SectionGroups component)
- ✅ Notebook colors (NotebookColorPicker component with 18 colors)

### Organization
- ✅ Tags with autocomplete (TagsInput component)
- ✅ Favorites/pinned pages (FavoritesPanel component)
- ✅ Recent pages (RecentPages component)
- ✅ Page links (wiki-style) (WikiLinkInput component)
- ✅ Table of contents generation (TableOfContents component)

### Editor Features
- 🚧 Tables with advanced formatting (basic tables implemented)
- ✅ Checkboxes/to-do items with completion tracking (TaskList component)
- ✅ Math equations (LaTeX) (MathEquation component with 8 examples)
- 🚧 Code syntax highlighting (more languages)
- ✅ Embedded web content (iframes) (EmbedContent component)
- ✅ Symbols and special characters picker (SymbolsPicker with 100+ symbols)

### Smart Features
- ✅ Smart paste (detect and format) (SmartPaste component - detects URLs, emails, phone, dates, code, tables, lists)
- ✅ Auto-save indicators (SyncStatusIndicator component)
- ⏳ Conflict resolution UI
- ✅ Offline mode banner (OfflineBanner component)
- ✅ Sync status indicators (SyncStatusIndicator component)
- 🚧 Background sync (Yjs handles this)

---

## Current Status Summary

### What Works
- ✅ Basic rich text editing (bold, italic, headings, lists)
- ✅ Tables and code blocks
- ✅ Yjs real-time collaboration
- ✅ Collaborative cursors
- ✅ Hierarchical structure (workspaces → notebooks → sections → pages)
- ✅ Offline-first with IndexedDB
- ✅ JWT authentication
- ✅ Basic CRUD APIs
- ✅ Fluent UI v9 design system with light/dark themes
- ✅ Command palette (Ctrl+K) and global search (Ctrl+Shift+F)
- ✅ Canvas page model with movable/resizable blocks (?canvas=1)
- ✅ Pressure-sensitive inking system (?ink=1)
- ✅ PDF printout viewer (?pdf=1)
- ✅ Version history timeline with restore
- ✅ Recycle bin with soft delete
- ✅ Export to Markdown, HTML, JSON, Plain Text
- ✅ Import from Markdown, HTML, JSON, Plain Text
- ✅ Page templates (Meeting Notes, To-Do List, Daily Notes)
- ✅ Tags input component with keyboard support
- ✅ Page backgrounds (6 options: blank, ruled, grid, dotted, graph, cream)
- ✅ Favorites/pinned pages panel
- ✅ Recent pages tracking
- ✅ Task list with completion tracking and progress bar
- ✅ Offline mode banner with auto-detection
- ✅ Sync status indicator (saved, syncing, offline, error)
- ✅ Table of contents generation
- ✅ Breadcrumb navigation component
- ✅ Presence indicators (avatars with online status)
- ✅ Comments panel (add/resolve comments with timestamps)
- ✅ Wiki-style page links (search and link to pages)
- ✅ Symbols picker (100+ symbols in 6 categories)
- ✅ Notebook color picker (18 color options)
- ✅ Enhanced sidebar (hierarchical navigation with search)
- ✅ Share dialog (generate links, invite users, permissions)
- ✅ @mentions input (autocomplete user suggestions)
- ✅ Section groups (organize sections into groups)
- ✅ Math equations (LaTeX editor with 8 examples)
- ✅ Smart paste (auto-detect URLs, emails, phone, dates, code, tables, lists)
- ✅ Embed content (YouTube, Google Maps, Spotify, Twitter iframes)

### Critical Gaps Addressed
1. **UI Polish**: ✅ Migrated to Fluent UI v9 with design tokens
2. **Page Model**: ✅ Canvas with movable containers implemented
3. **Inking**: ✅ Pressure-sensitive pen/highlighter/eraser implemented
4. **PDF/Attachments**: ✅ PDF printout viewer implemented (annotations pending)
5. **Search**: ✅ Global search with highlighting implemented (OCR pending)
6. **History**: ✅ Version history UI and recycle bin implemented
7. **Packaging**: ⏳ Still needs MSVC builds and proper installers
8. **Accessibility**: 🚧 Keyboard shortcuts implemented, screen reader support pending
9. **Performance**: ⏳ Not yet optimized, no performance budgets

### Estimated Effort
- **P1 (Visual Polish)**: 2-3 weeks
- **P2 (Canvas Model)**: 3-4 weeks
- **P3 (Inking)**: 4-5 weeks
- **P4 (PDF/Attachments)**: 2-3 weeks
- **P5 (Search)**: 2 weeks
- **P6 (History)**: 1-2 weeks
- **P7 (Collaboration)**: 2 weeks
- **P8 (Import/Export)**: 2-3 weeks
- **P9 (Packaging)**: 1-2 weeks
- **P10 (Performance)**: Ongoing

**Total**: ~20-30 weeks for full OneNote parity

---

## Next Steps

1. Start with P1 (Visual Polish) - migrate to Fluent UI v9
2. Implement P9 (Packaging) - proper Windows MSVC installer
3. Work on P2 (Canvas Model) - foundational architecture
4. Add P3 (Inking) - core differentiator
5. Continue with P4-P8 based on user feedback

---

Last Updated: November 20, 2025
