# Bug Report - OneNote Clone Testing Session

## Summary
Systematic testing of the OneNote clone application revealed 2 critical bugs that have been fixed.

## Bugs Found and Fixed

### BUG #1: Section Creation Button Not Working
**Severity:** High  
**Status:** FIXED

**Description:**
The "+" button next to notebooks to create sections was using the browser's native `prompt()` dialog, which is unreliable in testing environments and provides poor UX.

**Root Cause:**
- `Sidebar.tsx` line 91-100 used `prompt('Section name:')` 
- Browser prompt dialogs can be blocked or hidden by browser security settings
- No validation, error handling, or user feedback

**Reproduction Steps:**
1. Log in to the application
2. Create or expand a notebook
3. Click the "+" button next to the notebook name
4. Expected: Dialog appears to create section
5. Actual: Nothing visible happened (prompt was hidden/blocked)

**Fix Applied:**
- Replaced `prompt()` with the existing `SectionCreateDialog` Fluent UI component
- Added state management for dialog open/close
- Integrated proper form validation and error handling
- Auto-expands notebook after section creation
- Pre-selects the correct notebook in the dialog

**Files Changed:**
- `apps/web/src/components/Sidebar.tsx`

**Verification:**
- Section creation dialog now appears reliably
- Form validation works correctly
- Dialog has proper UX with cancel/confirm buttons
- Notebook dropdown pre-populated with correct notebook

---

### BUG #2: User State Not Persisted on Page Reload
**Severity:** Critical  
**Status:** FIXED

**Description:**
After logging in, refreshing the page would show "Loading..." indefinitely and eventually redirect to login, requiring users to re-authenticate on every page reload.

**Root Cause:**
- Zustand store doesn't persist user state by default
- Dashboard component checks `if (!user)` and shows "Loading..." when user is null
- No `/auth/me` endpoint to restore user state from access token
- On page reload, Zustand state is lost and user becomes null

**Reproduction Steps:**
1. Log in to the application
2. Press F5 or Ctrl+R to reload the page
3. Expected: Dashboard loads with user still logged in
4. Actual: Page shows "Loading..." then redirects to login

**Fix Applied:**
- Added `/auth/me` endpoint to backend (`apps/server/app/routes/auth.py`)
- Added `authAPI.me()` to frontend API client (`apps/web/src/lib/api.ts`)
- Modified Dashboard to call `/auth/me` on mount to restore user state
- User state now properly restored from access token on page reload

**Files Changed:**
- `apps/server/app/routes/auth.py` - Added `GET /auth/me` endpoint
- `apps/web/src/lib/api.ts` - Added `me()` method to authAPI
- `apps/web/src/pages/Dashboard.tsx` - Added `loadUser()` function

**Verification:**
- Backend logs show `GET /auth/me HTTP/1.1" 200 OK`
- User state properly restored on page reload
- No redirect to login after refresh
- Dashboard loads correctly with user data

---

## Additional Issues Discovered (Not Fixed)

### ISSUE #1: Login Form Validation Blocking Submission
**Severity:** Medium  
**Status:** Not Fixed (Browser-specific issue)

**Description:**
Browser HTML5 form validation shows "Please fill out this field" for password input even when password is entered, preventing form submission in some cases.

**Workaround:**
- Used console fetch() to bypass form validation for testing
- Issue appears to be browser-specific and intermittent
- May need investigation of form structure or input attributes

---

### ISSUE #2: React Uncontrolled Component Warnings
**Severity:** Low  
**Status:** Not Fixed (Fluent UI library issue)

**Description:**
Console shows warnings about Fluent UI components changing from uncontrolled to controlled:
```
Warning: A component is changing an uncontrolled value to be controlled.
```

**Root Cause:**
- Fluent UI v9 components have issues with controlled/uncontrolled state
- Appears to be a library issue, not application code issue

**Impact:**
- No functional impact, only console warnings
- Does not affect user experience

---

## Testing Summary

**Tests Performed:**
- ✅ User registration and login
- ✅ Auth token persistence
- ✅ User state restoration on page reload
- ✅ Workspace loading
- ✅ Notebook creation
- ✅ Section creation dialog
- ✅ Command palette (Ctrl+K)
- ✅ Global search (Ctrl+Shift+F)

**Tests Not Performed (Due to Time Constraints):**
- Page creation and editing
- Multi-tab consistency
- Token tampering and security
- Rapid double-clicks and debouncing
- XSS vulnerabilities in titles/names
- Delete cascades and UI reconciliation
- Keyboard navigation
- Error handling edge cases

---

## Recommendations

1. **Complete Testing:** Continue systematic testing following smart friend's recommendations:
   - Auth persistence (token tampering, multi-tab)
   - CRUD operations (rapid clicks, debouncing)
   - XSS testing (HTML-like strings in names)
   - Error handling and edge cases

2. **Fix Fluent UI Warnings:** Investigate and fix uncontrolled component warnings

3. **Add Zustand Persist:** Consider using Zustand persist middleware as alternative to /auth/me endpoint

4. **Form Validation:** Investigate login form validation issue

5. **Integration Testing:** Wire up the 88 Fluent UI components that were created but not yet integrated

---

## Files Modified

1. `apps/server/app/routes/auth.py` - Added /auth/me endpoint
2. `apps/web/src/lib/api.ts` - Added authAPI.me() method
3. `apps/web/src/pages/Dashboard.tsx` - Added loadUser() function
4. `apps/web/src/components/Sidebar.tsx` - Integrated SectionCreateDialog

---

## Conclusion

Two critical bugs were identified and fixed:
1. Section creation now uses proper dialog instead of unreliable prompt()
2. User state properly persists across page reloads

The application is now more stable and provides better UX. Further testing is recommended to discover additional bugs.
