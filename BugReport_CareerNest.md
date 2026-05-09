# CareerNest — Full Bug Report, Fixes & Test Cases

> Session: April 29–30, 2026 | Platform: CareerNest (MERN Stack + Vite)

---

## 1. AUTHENTICATION & REGISTRATION

### BUG-01 — CAPTCHA input had wrong placeholder text
- **File:** `Login.jsx`, `Register.jsx`
- **Bug:** Both captcha inputs used `t('chat_placeholder')` → showed "Type a message..." instead of a verification prompt
- **Fix:** Added `captcha_placeholder` key to `LanguageContext.jsx` (English + Hindi). Updated both files to use `t('captcha_placeholder')`
- **Test Case:**
  - Open `/login` → captcha field placeholder must read "Enter verification code"
  - Open `/register` → same field must read "Enter verification code"
  - Switch language to Hindi → placeholder must read "सत्यापन कोड दर्ज करें"

---

### BUG-02 — Duplicate "Mobile Number" field in Register form
- **File:** `Register.jsx`
- **Bug:** Form had both `mobile` and `phone` fields — two separate number inputs, only `phone` sent to backend
- **Fix:** Removed the redundant `mobile` state and input group. Verification screen updated to say "phone number" not "mobile number"
- **Test Case:**
  - Open `/register` → only ONE phone number field should appear
  - Submit registration → backend receives `phone` field correctly
  - No `mobile` field in network payload

---

### BUG-03 — Login blocked by email verification requirement (no verify flow in UI)
- **File:** `backend/routes/auth.js`
- **Status:** Backend correctly gates login on `isVerified: true`. Verification endpoint `GET /api/auth/verify/:id` exists and works.
- **Test Case:**
  - Register new user → get userId in response
  - `GET http://localhost:5000/api/auth/verify/<userId>` → response: `{ message: "Email verified successfully!" }`
  - Login should now succeed with 200 and JWT token

---

## 2. SEEKER DASHBOARD

### BUG-04 — `profileViews` and timestamp recalculated on every render
- **File:** `SeekerDashboard.jsx`
- **Bug:** `Math.random()` and `new Date()` called inline in JSX → value changed on every parent re-render causing visible flicker
- **Fix:** Wrapped both in `useMemo(() => ..., [])` — computed once on mount, frozen for the component lifetime
- **Test Case:**
  - Login as seeker → note Profile Views number
  - Click any tab and come back to Overview
  - Profile Views number must NOT change between visits

---

### BUG-05 — Stats grid could render as 1, 2, or 3 columns unpredictably
- **File:** `SeekerDashboard.jsx`
- **Bug:** `gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'` — at 900px wide the 4 cards could collapse to 3+1 or 2+2
- **Fix:** Changed to `repeat(4, 1fr)` with `minHeight: 160px` on each card — always 4 equal-height columns
- **Test Case:**
  - Open dashboard at 1024px width → 4 cards in one row, same height
  - Resize to 900px → CSS media query kicks in: 2-col grid
  - All 4 cards same height in all layouts

---

### BUG-06 — Bar chart bars with 0 count had zero height (invisible)
- **File:** `SeekerDashboard.jsx`
- **Bug:** Sunday activity = 0 → `height: 0%` → completely invisible bar
- **Fix:** `height: activity[i] === 0 ? 4 : (activity[i]/max)*100` + `minHeight: 4px` in CSS; zero bars shown in grey with reduced opacity
- **Test Case:**
  - Open Seeker Dashboard → Momentum Tracker chart
  - Sunday bar (count: 0) must still be visible as a thin grey stub
  - All 7 bars must be visible, bottom-aligned

---

### BUG-07 — Application pipeline row right-side squished by unbounded left flex
- **File:** `SeekerDashboard.jsx`
- **Bug:** Left info div had `flex: 1` (grows unbounded) with no `minWidth: 0` constraint; right div had fixed `minWidth: 350px` — caused overflow or squishing on long job titles
- **Fix:** Left div gets `flex: 1; minWidth: 0` + title text truncation (`overflow: hidden; textOverflow: ellipsis`). Right div gets `flexShrink: 0`
- **Test Case:**
  - Apply to a job with a very long title (e.g. "Senior Principal Cloud Infrastructure Engineer")
  - Dashboard pipeline row → long title must truncate with "..." not overflow
  - Status badge and action button must remain fully visible on the right

---

### BUG-08 — Status badge rendered as block element (stretched full width)
- **File:** `SeekerDashboard.jsx`
- **Bug:** Status badge `<span>` was inside a `textAlign: right` div but missing `display: inline-block` → stretched to 100% width like a block
- **Fix:** Added `display: 'inline-block'` to the badge span
- **Test Case:**
  - Pipeline section → status badges ("APPLIED", "INTERVIEW" etc.) must appear as small pill shapes, not full-width bars

---

## 3. RECRUITER DASHBOARD

### BUG-09 — `/api/jobs/myjobs` called before authentication (403 errors)
- **File:** `RecruiterDashboard.jsx`
- **Bug:** `fetchMyJobs()` fired in `useEffect([], [])` regardless of auth state → seeker logins also triggered this recruiter-only endpoint causing 403 errors in console
- **Fix 1:** Added `if (!token || user?.role !== 'recruiter') { setLoading(false); return; }` guard
- **Fix 2:** Changed `useEffect` dependency from `[]` to `[user]` — only runs after user context loads
- **Test Case:**
  - Login as **seeker** → open browser console → NO 403 errors for `/api/jobs/myjobs`
  - Login as **recruiter** → jobs load correctly
  - Hard refresh as recruiter → no race condition, jobs still load

---

### BUG-10 — Stats cards had inconsistent heights (auto-sized)
- **File:** `RecruiterDashboard.jsx`
- **Bug:** `repeat(auto-fit, minmax(200px, 1fr))` + no `minHeight` → cards had different heights based on content
- **Fix:** Changed to `repeat(4, 1fr)` + `minHeight: 140px` + `alignItems: center` + `justifyContent: center`
- **Test Case:**
  - Recruiter dashboard → 4 stats cards at top must all be same height
  - Cards with number "0" must same height as cards with larger numbers

---

### BUG-11 — Calendar header row and cells not properly aligned
- **File:** `RecruiterDashboard.jsx`
- **Bug:** Day name headers used `borderBottom` which offset the cells below them. Cells for days > 31 rendered with visible (empty) boxes. 35 cells total rendered even for months with 28-31 days
- **Fix:** Removed `borderBottom` from headers, used `padding/letterSpacing` instead. Added `opacity: 0; pointerEvents: none` to cells where `dayNum > 31`
- **Test Case:**
  - Recruiter dashboard → Interview Scheduling calendar
  - Day name headers (Mon–Sun) must align with columns below
  - No ghost/empty cells visible beyond day 31 of the month

---

### BUG-12 — Icon buttons (Edit/Duplicate/Delete) caused layout shift on hover
- **File:** `RecruiterDashboard.jsx`
- **Bug:** Buttons had `background: transparent; border: none` — on hover `transform: translateY(-2px)` caused the whole job row to shift
- **Fix:** Replaced with 36×36px icon buttons with `background: rgba(255,255,255,0.04)` border, smooth hover `background` transition (no transform)
- **Test Case:**
  - Recruiter dashboard → job listing row
  - Hover over ✏️ / 📋 / 🗑️ icons → no row shifting
  - All 3 icon buttons same size and vertically centered

---

### BUG-13 — `job.remove()` deprecated in Mongoose 7+ (silent delete failure)
- **File:** `backend/routes/jobs.js`
- **Bug:** `await job.remove()` is removed in Mongoose 7 — delete action would throw uncaught error
- **Fix:** Changed to `await job.deleteOne()`
- **Test Case:**
  - Recruiter dashboard → click 🗑️ delete on a job listing
  - Confirm deletion → job must disappear from list
  - `GET /api/jobs/myjobs` → deleted job must not appear

---

## 4. DASHBOARD NAVIGATION

### BUG-14 — Tab bar overflowed (tabs hidden beyond container)
- **File:** `Dashboard.jsx`
- **Bug:** 10 seeker tabs in a `display: flex` row with `fontSize: 1.1rem; padding: 0.5rem 1rem` each → required ~1300px but container is ~1000px → tabs "Career Path" and "Settings" not visible or clickable
- **Fix:** Rewrote tabs as a data-driven array loop. Container gets `overflowX: auto; scrollbarWidth: none`. Each button gets `whiteSpace: nowrap; flexShrink: 0; fontSize: 0.88rem`
- **Test Case:**
  - Login as seeker → all 10 tabs must be visible (scroll horizontally if needed)
  - Click "Career 🚀" tab → Career Path component renders
  - Click "Settings ⚙️" tab → Profile settings renders
  - No tab hidden or cut off

---

### BUG-15 — Active tab underline used fragile pixel math
- **File:** `Dashboard.jsx`
- **Bug:** `position: absolute; bottom: -17px` was hardcoded, tied to `paddingBottom: 1rem` (16px) + 1px border. Any padding change would misalign the indicator
- **Fix:** Replaced absolute-positioned div with `borderBottom: '3px solid var(--color-accent)'` on the button itself + `marginBottom: -1px` — merges perfectly with container border regardless of padding
- **Test Case:**
  - Click each tab → active tab has blue underline flush with the border line
  - No gap or overlap between indicator and border line

---

### BUG-16 — Search bar UI was never rendered (dead state)
- **File:** `Dashboard.jsx`
- **Bug:** `searchQuery`, `suggestions`, `showSuggestions`, `allJobs` state + `handleSearchChange`, `handleSuggestionClick`, `handleSearch` were fully implemented but no `<input>` element existed in JSX — completely dead code
- **Fix:** Added a live search input in the dashboard header (seeker only). Shows autocomplete dropdown from `allJobs`. Submits navigate to `/jobs?search=...`
- **Test Case:**
  - Login as seeker → search box appears top-right of dashboard header
  - Type "engineer" → autocomplete dropdown shows matching jobs
  - Click a suggestion → navigates to `/jobs?search=engineer`
  - Press Enter → navigates to job board with search pre-filled

---

## 5. APPLICATION JOURNEY (My Journey Tab)

### BUG-17 — Left panel fixed 350px width caused overflow on small screens
- **File:** `ApplicationATS.jsx`
- **Bug:** `gridTemplateColumns: '350px 1fr'` — left column never shrinks below 350px, overflows on <700px viewports
- **Fix:** Changed to `minmax(280px, 350px) 1fr` — shrinks to 280px when needed
- **Test Case:**
  - Open "My Journey" tab → resize window to 768px → left panel shrinks, no overflow
  - At 750px → CSS media query stacks panels vertically

---

### BUG-18 — Empty state in right panel collapsed to 0 height
- **File:** `ApplicationATS.jsx`
- **Bug:** Empty state div had `height: 100%` but parent had no fixed height → resolved to 0px → placeholder content invisible
- **Fix:** Changed to `minHeight: 300px` with `textAlign: center`
- **Test Case:**
  - Open "My Journey" tab with NO application selected → right panel shows 📑 icon and instruction text visibly
  - Panel must be at least 300px tall

---

## 6. GLOBAL / CSS

### BUG-19 — `.spinner` animation undefined in global scope
- **File:** `index.css`
- **Bug:** `Auth.css` defined `.spinner` with white border (for auth pages), but `index.css` (used for dashboard) had no `.spinner` definition → dashboard loading spinner had wrong style or no animation
- **Fix:** Added proper `.spinner` definition + `@keyframes spin` + `@keyframes fadeIn` to `index.css`
- **Test Case:**
  - Hard-refresh `/dashboard` while logged in → loading spinner appears (blue top-border, dark ring)
  - Spinner must animate (rotate)

---

### BUG-20 — No responsive breakpoints for dashboard grids
- **File:** `index.css`
- **Bug:** Stats grids used `repeat(4, 1fr)` with no responsive fallback — on tablet/mobile cards were too narrow to read
- **Fix:** Added `@media (max-width: 900px)` → 2-col stats; `@media (max-width: 600px)` → 2-col stats + 1-col middle section; `@media (max-width: 750px)` → ATS stacks to 1 col
- **Test Case:**
  - Open dashboard at 1200px → 4 stat cards in one row ✓
  - Resize to 850px → 2 stat cards per row ✓
  - Resize to 550px → 2 stat cards per row, 1-col layout below ✓

---

## SUMMARY TABLE

| ID | File | Severity | Category | Status |
|----|------|----------|----------|--------|
| BUG-01 | Login.jsx, Register.jsx | Low | UI/UX | ✅ Fixed |
| BUG-02 | Register.jsx | Medium | Form | ✅ Fixed |
| BUG-03 | auth.js (backend) | High | Auth | ✅ Documented |
| BUG-04 | SeekerDashboard.jsx | Low | Performance | ✅ Fixed |
| BUG-05 | SeekerDashboard.jsx | Medium | Alignment | ✅ Fixed |
| BUG-06 | SeekerDashboard.jsx | Low | UI | ✅ Fixed |
| BUG-07 | SeekerDashboard.jsx | Medium | Layout | ✅ Fixed |
| BUG-08 | SeekerDashboard.jsx | Low | CSS | ✅ Fixed |
| BUG-09 | RecruiterDashboard.jsx | Critical | API/Auth | ✅ Fixed |
| BUG-10 | RecruiterDashboard.jsx | Medium | Alignment | ✅ Fixed |
| BUG-11 | RecruiterDashboard.jsx | Medium | Calendar | ✅ Fixed |
| BUG-12 | RecruiterDashboard.jsx | Low | UX | ✅ Fixed |
| BUG-13 | jobs.js (backend) | High | Backend | ✅ Fixed |
| BUG-14 | Dashboard.jsx | Critical | Navigation | ✅ Fixed |
| BUG-15 | Dashboard.jsx | Low | CSS | ✅ Fixed |
| BUG-16 | Dashboard.jsx | High | Feature | ✅ Fixed |
| BUG-17 | ApplicationATS.jsx | Medium | Layout | ✅ Fixed |
| BUG-18 | ApplicationATS.jsx | Low | UI | ✅ Fixed |
| BUG-19 | index.css | Medium | CSS | ✅ Fixed |
| BUG-20 | index.css | Medium | Responsive | ✅ Fixed |

---

## QUICK TEST CHECKLIST

### As Seeker
- [ ] Register with one phone field → verify email → login
- [ ] Dashboard loads with spinner → Overview tab visible
- [ ] All 10 tabs visible in tab bar (scroll if needed)
- [ ] Profile Views number stable across tab switches
- [ ] 4 stat cards equal height, same row
- [ ] Momentum Tracker: all 7 bars visible including Sunday (0)
- [ ] Pipeline: long job title truncates with ellipsis
- [ ] Pipeline: status badges appear as pills, not full-width bars
- [ ] Search box in header → type query → autocomplete appears → navigate
- [ ] "My Journey" tab: left panel shows apps, right shows timeline
- [ ] "My Journey" tab: empty right panel shows placeholder with min height
- [ ] No 403 errors in browser console

### As Recruiter
- [ ] Login → no 403 errors in console
- [ ] 4 stat cards equal height
- [ ] Calendar: day headers aligned with columns, no ghost cells
- [ ] Job listing: hover edit/delete icons → no row shift
- [ ] Delete a job → job disappears immediately
- [ ] "+ Post a Job" button navigates to /post-job
- [ ] "Import Templates" seeds 4 jobs
- [ ] Analytics section: 3 columns, evenly spaced

---

*Generated by Antigravity AI — CareerNest debugging session*
