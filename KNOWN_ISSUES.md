# Known Issues - Xie Dynasty Notes

**Last Updated:** November 21, 2025  
**Build:** PR #1 - OneNote Clone Implementation

## Critical Issues (Blocking)

### 1. Auth Token Validation Issue ✅ FIXED

**Priority:** P0 (Critical)  
**Status:** ✅ RESOLVED  
**Discovered:** November 21, 2025  
**Fixed:** November 21, 2025

**Description:**  
After successful login (POST /auth/login returns 200 OK), subsequent requests to protected endpoints returned 401 Unauthorized. PyJWT library requires the "sub" claim to be a string, but backend was encoding it as an integer.

**Root Cause:**  
PyJWT enforces the "sub" claim to be a string per JWT spec. Backend was encoding `user.id` (int) directly, causing `jwt.InvalidTokenError` during token validation.

**Fix Applied:**
1. Modified `create_access_token()` to convert "sub" to string: `to_encode["sub"] = str(to_encode["sub"])`
2. Modified `create_refresh_token()` to convert "sub" to string: `to_encode["sub"] = str(to_encode["sub"])`
3. Modified `get_current_user()` to parse "sub" back to int: `user_id = int(user_id_raw)`

**Files Modified:**
- `/apps/server/app/utils/auth.py` (lines 19-38, 51-80)
- `/apps/server/app/database.py` (line 9)

**Verification:**
```
Backend Logs (After Fix):
INFO: 127.0.0.1:58100 - "POST /auth/register HTTP/1.1" 200 OK
INFO: 127.0.0.1:58100 - "GET /workspaces HTTP/1.1" 200 OK
INFO: 127.0.0.1:58112 - "GET /notebooks/workspace/3 HTTP/1.1" 200 OK
```

**Status:** ✅ RESOLVED - Auth system fully functional

---

## High Priority Issues (Non-Blocking)

### 2. Components Not Integrated into Main UI

**Priority:** P1 (High)  
**Status:** Open  
**Discovered:** November 21, 2025

**Description:**  
88 Fluent UI components have been created but most are not yet wired into the main application UI. They exist as standalone components with proper TypeScript interfaces but lack integration points.

**Impact:**  
Components cannot be tested in real user workflows. Features exist in code but not accessible to users.

**Affected Components:**
- 31 navigation/polish components (dialogs, panels, selectors)
- 50 additional feature components (templates, tags, backgrounds, etc.)
- 4 collaboration components (partially integrated)
- 2 file management components

**Recommended Fix:**
1. Create component gallery page for visual testing (dev-only)
2. Systematically integrate components into main UI routes
3. Add navigation/menu items to access new features
4. Wire up event handlers and state management

### 3. Mock Data in Components

**Priority:** P1 (High)  
**Status:** Open  
**Discovered:** November 21, 2025

**Description:**  
Many components use hardcoded mock data instead of connecting to backend APIs.

**Affected Features:**
- Version history timeline (mock versions)
- Recycle bin (mock deleted items)
- Activity log (mock activities)
- Presence indicators (mock users)
- Comments panel (mock comments)
- Recent pages (mock page list)
- Favorites (mock favorites)

**Impact:**  
Features appear functional but don't persist data or sync with backend.

**Recommended Fix:**
1. Create backend API endpoints for each feature
2. Replace mock data with API calls
3. Add loading states and error handling
4. Implement real-time updates via WebSocket where needed

### 4. Export Uses Placeholder Content

**Priority:** P1 (High)  
**Status:** Open  
**Discovered:** November 21, 2025

**Description:**  
Export functionality (Markdown, HTML, JSON, Plain Text) triggers downloads but uses placeholder content instead of actual editor content.

**Impact:**  
Users cannot export their notes in usable formats.

**Recommended Fix:**
1. Integrate with TipTap editor to extract content
2. Implement proper Markdown serialization
3. Implement proper HTML serialization with styles
4. Add metadata to JSON exports
5. Test export/import round-trip

### 5. PagePreview Security Issue

**Priority:** P1 (High)  
**Status:** Open  
**Discovered:** November 21, 2025

**Description:**  
PagePreview component uses `dangerouslySetInnerHTML` without sanitizing HTML content, creating XSS vulnerability.

**Impact:**  
Malicious HTML in page content could execute arbitrary JavaScript.

**Recommended Fix:**
1. Add DOMPurify or similar HTML sanitizer
2. Sanitize all HTML before rendering with dangerouslySetInnerHTML
3. Consider using TipTap's built-in rendering instead
4. Add Content Security Policy headers

**Code Location:**  
`apps/web/src/components/PagePreview.tsx:89`

---

## Medium Priority Issues

### 6. OCR Search Not Implemented

**Priority:** P2 (Medium)  
**Status:** Open  
**Planned:** P5 roadmap

**Description:**  
Global search works for text content but cannot search text within images or PDFs.

**Impact:**  
Users cannot find content embedded in images or scanned documents.

**Recommended Implementation:**
1. Integrate Tesseract.js for client-side OCR
2. Add OCR processing pipeline for uploaded images
3. Index OCR text in Meilisearch
4. Add "Search in images" filter option

### 7. File Attachments Not Integrated with S3

**Priority:** P2 (Medium)  
**Status:** Open  
**Planned:** P4 roadmap

**Description:**  
FileAttachmentsManager component exists but file uploads don't actually store files in S3.

**Impact:**  
Users cannot attach files to pages.

**Recommended Implementation:**
1. Set up S3 bucket or compatible storage
2. Implement presigned URL generation in backend
3. Add file upload logic in frontend
4. Add file download/preview functionality
5. Implement file deletion and cleanup

### 8. Lasso Selection Tool Not Implemented

**Priority:** P2 (Medium)  
**Status:** Open  
**Planned:** P3 roadmap

**Description:**  
Inking system has pen, highlighter, and eraser but missing lasso selection tool.

**Impact:**  
Users cannot select and manipulate ink strokes.

**Recommended Implementation:**
1. Add lasso drawing mode
2. Implement point-in-polygon detection for stroke selection
3. Add move/resize/delete for selected strokes
4. Add copy/paste for ink selections

### 9. Shape Recognition Not Implemented

**Priority:** P2 (Medium)  
**Status:** Open  
**Planned:** P3 roadmap

**Description:**  
Inking system doesn't recognize hand-drawn shapes and convert them to perfect shapes.

**Impact:**  
Users must draw perfect shapes manually.

**Recommended Implementation:**
1. Implement shape detection algorithms (circles, squares, triangles, arrows)
2. Add confidence threshold for recognition
3. Add UI to accept/reject shape suggestions
4. Support common diagram shapes

### 10. Ink-to-Text Conversion Not Implemented

**Priority:** P2 (Medium)  
**Status:** Open  
**Planned:** P3 roadmap

**Description:**  
Handwritten text cannot be converted to typed text.

**Impact:**  
Users cannot convert handwritten notes to searchable text.

**Recommended Implementation:**
1. Integrate handwriting recognition API (Google Cloud Vision, Azure, etc.)
2. Add "Convert to text" button for ink strokes
3. Add confidence indicator for recognition results
4. Allow manual correction of recognized text

---

## Low Priority Issues

### 11. Web Clipper Extension Not Built

**Priority:** P3 (Low)  
**Status:** Open  
**Planned:** P8 roadmap

**Description:**  
No Chrome extension for clipping web content to notes.

**Impact:**  
Users must manually copy/paste web content.

**Recommended Implementation:**
1. Create Chrome extension manifest
2. Implement content capture (text, images, links)
3. Add notebook/section selector
4. Implement API integration for saving clips

### 12. Proper Installers Not Created

**Priority:** P3 (Low)  
**Status:** Open  
**Planned:** P9 roadmap

**Description:**  
Desktop apps exist but lack proper installers (Windows MSI, macOS DMG, Linux AppImage).

**Impact:**  
Users must manually extract and run executables.

**Recommended Implementation:**
1. Set up Windows code signing certificate
2. Create MSVC MSI installer with WebView2 bundled
3. Create macOS DMG with notarization
4. Create Linux AppImage with auto-update
5. Set up auto-update infrastructure

### 13. Performance Optimization Needed

**Priority:** P3 (Low)  
**Status:** Open  
**Planned:** P10 roadmap

**Description:**  
No performance optimization has been done yet.

**Impact:**  
App may be slow with large notebooks or many pages.

**Recommended Implementation:**
1. Implement virtual scrolling for long page lists
2. Add pagination for search results
3. Lazy load images and attachments
4. Optimize Yjs document size
5. Add service worker for offline caching
6. Implement code splitting for routes

---

## Documentation Issues

### 14. Component Integration Guide Missing

**Priority:** P2 (Medium)  
**Status:** Open

**Description:**  
No documentation on how to integrate the 88 new components into the main UI.

**Recommended Fix:**
Create COMPONENT_INTEGRATION.md with:
- Component catalog with descriptions
- Integration examples for each component
- Props documentation
- State management patterns
- Event handling patterns

### 15. API Documentation Incomplete

**Priority:** P2 (Medium)  
**Status:** Open

**Description:**  
Backend API endpoints lack comprehensive documentation.

**Recommended Fix:**
1. Add OpenAPI/Swagger documentation
2. Document all endpoints with examples
3. Add authentication requirements
4. Document request/response schemas
5. Add error code documentation

---

## Testing Gaps

### 16. No Automated Tests

**Priority:** P2 (Medium)  
**Status:** Open

**Description:**  
No unit tests, integration tests, or E2E tests exist.

**Recommended Implementation:**
1. Add Jest + React Testing Library for component tests
2. Add Playwright for E2E tests
3. Add pytest for backend tests
4. Set up CI/CD pipeline with test automation
5. Aim for >80% code coverage

### 17. No Cross-Browser Testing

**Priority:** P2 (Medium)  
**Status:** Open

**Description:**  
Only tested in Chrome. May have issues in Firefox, Safari, Edge.

**Recommended Implementation:**
1. Test in Firefox, Safari, Edge, Mobile Safari, Mobile Chrome
2. Document browser-specific issues
3. Add polyfills where needed
4. Set up BrowserStack or similar for automated testing

### 18. No Accessibility Audit

**Priority:** P2 (Medium)  
**Status:** Open

**Description:**  
No formal accessibility testing has been performed.

**Recommended Implementation:**
1. Run axe-core accessibility scanner
2. Test with screen readers (NVDA, JAWS, VoiceOver)
3. Verify keyboard navigation for all features
4. Check color contrast ratios
5. Add ARIA labels where missing
6. Test with browser zoom at 200%

---

## Summary

**Total Issues:** 18  
**Critical (P0):** 0 (1 resolved)  
**High (P1):** 4  
**Medium (P2):** 9  
**Low (P3):** 4

**Blocking Issues:** 0 ✅  
**Non-Blocking Issues:** 17

**Resolved Issues:**
1. ✅ Auth token validation (P0) - FIXED

**Immediate Action Required:**
1. ✅ ~~Fix auth token storage/transmission (P0)~~ - COMPLETED
2. Create component gallery for testing (P1)
3. Integrate components into main UI (P1)
4. Connect mock data to backend APIs (P1)
5. Fix export placeholder content (P1)
6. Fix PagePreview XSS vulnerability (P1)
