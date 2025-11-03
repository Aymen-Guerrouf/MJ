# 🗺️ Sparks Hub - Navigation Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APP STRUCTURE                                │
└─────────────────────────────────────────────────────────────────────┘

📱 App.js
   └─ NavigationContainer
       └─ Stack Navigator
           ├─ SignIn
           ├─ SignUp
           └─ HomeTab ──────────────────────────────────────────┐
                                                                 │
┌────────────────────────────────────────────────────────────────────┤
│ 🏠 HomeTab (Bottom Tabs)                                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📍 Map Tab          ⚡ Events Tab     🎨 Spaces Tab    👤 Profile │
│                                            │                        │
│                                            └─ SpacesStack           │
│                                                    │                │
└────────────────────────────────────────────────────┼────────────────┘
                                                     │
┌────────────────────────────────────────────────────┼────────────────┐
│ 🎨 SpacesStack (Stack Navigator)                   │                │
├────────────────────────────────────────────────────┴────────────────┤
│                                                                      │
│  1️⃣ SpacesScreen (Hub Selector)                                     │
│     ├─ Sharing Experiences                                          │
│     ├─ Virtual School                                               │
│     └─ Sparks Hub ──────────────────────────┐                       │
│                                              │                       │
│  2️⃣ SharingExperiencesScreen                 │                       │
│     └─ ExperienceStoryDetailScreen          │                       │
│                                              │                       │
│  3️⃣ VirtualSchoolScreen                      │                       │
│     └─ VideoPlayerScreen                    │                       │
│                                              │                       │
│  ╔═══════════════════════════════════════════╩═════════════════════╗│
│  ║ 🌟 SPARKS HUB NAVIGATION                                        ║│
│  ╠═════════════════════════════════════════════════════════════════╣│
│  ║                                                                  ║│
│  ║  4️⃣ SparksHubScreen (Main Hub)                                   ║│
│  ║     │                                                            ║│
│  ║     ├─→ [View Spark] ──→ SparkDetailScreen                      ║│
│  ║     │                                                            ║│
│  ║     └─→ [Your Turn] ──→ CreateSparkScreen                       ║│
│  ║                              │                                   ║│
│  ║                              └─→ [Success] ──→ MySparkScreen     ║│
│  ║                                                                  ║│
│  ║  5️⃣ CreateSparkScreen (Form)                                     ║│
│  ║     • Upload images                                              ║│
│  ║     • Fill all fields                                            ║│
│  ║     • Submit                                                     ║│
│  ║     └─→ Navigate to MySpark                                      ║│
│  ║                                                                  ║│
│  ║  6️⃣ MySparkScreen (User's Project)                               ║│
│  ║     │                                                            ║│
│  ║     ├─→ [Look for Supervisors] (if status: pending)             ║│
│  ║     │     └─→ SupervisorsListScreen (NOT YET IMPLEMENTED)       ║│
│  ║     │                                                            ║│
│  ║     ├─→ [View in Hub] (if status: public)                       ║│
│  ║     │     └─→ SparkDetailScreen                                 ║│
│  ║     │                                                            ║│
│  ║     └─→ [Delete] → Confirmation → Delete Spark                  ║│
│  ║                                                                  ║│
│  ║  7️⃣ SparkDetailScreen (Full Details)                             ║│
│  ║     • View all spark information                                ║│
│  ║     • See supervisor (if assigned)                              ║│
│  ║     • Back to hub                                               ║│
│  ║                                                                  ║│
│  ╚═════════════════════════════════════════════════════════════════╝│
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 User Journey Maps

### Journey 1: First-Time User Creates Spark

```
1. User opens app
2. Taps "Spaces" tab (bottom navigation)
3. Sees three space cards
4. Taps "Sparks Hub" card
5. Sees empty state or existing public sparks
6. Taps "Your Turn" FAB (floating action button)
7. Fills out create form:
   - Add image(s)
   - Enter title
   - Write description
   - Select category
   - Describe problem
   - Describe solution
   - Define target market
   - Choose business model
8. Taps "Create Spark"
9. Success! Navigates to "My Spark" screen
10. Sees spark with "Draft" status
11. Taps "Look for Supervisors" (to be implemented)
```

---

### Journey 2: Viewing Public Sparks

```
1. User navigates to Sparks Hub
2. Sees grid of public sparks
3. Swipes through category filters
4. Taps a category chip (e.g., "AI")
5. Sees filtered sparks
6. Taps on a spark card
7. Views full spark details
8. Reads problem, solution, market info
9. Sees supervisor information (if assigned)
10. Taps back to return to hub
```

---

### Journey 3: Managing My Spark

```
1. User navigates to Sparks Hub
2. From anywhere, navigates to "My Spark"
   (or creates shortcut in profile - to be added)
3. Sees their spark with current status:

   IF STATUS = "Draft" (pending):
   ├─→ Can edit spark (not implemented yet)
   ├─→ Can delete spark
   └─→ Can "Look for Supervisors"

   IF STATUS = "Under Review" (pending_review):
   ├─→ Sees "Request sent" alert
   ├─→ Shows which supervisor
   └─→ Cannot send more requests (blocked)

   IF STATUS = "Public":
   ├─→ Sees "Project is Public" badge
   ├─→ Shows assigned supervisor
   └─→ Can "View in Sparks Hub"

4. Pull down to refresh status
```

---

## 📊 Screen States Matrix

| Screen          | Empty State               | Loading        | Error        | Success            |
| --------------- | ------------------------- | -------------- | ------------ | ------------------ |
| **SparksHub**   | "No Sparks Yet" with icon | Spinner        | N/A          | Grid of cards      |
| **CreateSpark** | N/A                       | Button spinner | Alert dialog | Navigate away      |
| **MySpark**     | "No Spark Yet" CTA        | Spinner        | N/A          | Full spark display |
| **SparkDetail** | N/A                       | Spinner        | "Not found"  | Full details       |

---

## 🎨 Component Tree

```
SparksHubScreen
├─ Header
│  ├─ Title
│  └─ Subtitle
├─ Categories ScrollView
│  └─ CategoryChip[] (x12)
├─ Sparks ScrollView
│  └─ SparkCard[]
│     ├─ Image
│     ├─ CategoryBadge
│     ├─ Title
│     ├─ Description
│     └─ Footer
│        ├─ Owner
│        └─ SupervisorBadge (conditional)
└─ FloatingActionButton ("Your Turn")

CreateSparkScreen
├─ Header (with back button)
├─ Form ScrollView
│  ├─ ImageUploadSection
│  │  └─ ImageBox[] (max 3)
│  ├─ TitleInput
│  ├─ DescriptionInput
│  ├─ CategoryChips
│  ├─ ProblemStatementInput
│  ├─ SolutionInput
│  ├─ TargetMarketInput
│  ├─ BusinessModelChips
│  └─ SubmitButton
└─ KeyboardAvoidingView

MySparkScreen
├─ Header (back + delete)
├─ Content ScrollView
│  ├─ HeroImage
│  ├─ StatusBadge
│  ├─ TitleSection
│  ├─ DescriptionSection
│  ├─ ProblemSection
│  ├─ SolutionSection
│  ├─ TargetMarketSection
│  ├─ BusinessModelSection
│  ├─ SupervisorCard (conditional)
│  ├─ PendingRequestAlert (conditional)
│  └─ ActionButton (conditional by status)
└─ EmptyState (if no spark)

SparkDetailScreen
├─ Header (with back)
└─ Content ScrollView
   ├─ HeroImage
   ├─ TitleSection
   │  ├─ CategoryBadge
   │  ├─ Title
   │  └─ MetaRow (owner + supervised badge)
   ├─ Description
   ├─ ProblemCard (with icon)
   ├─ SolutionCard (with icon)
   ├─ TargetMarketCard (with icon)
   ├─ BusinessModelCard (with icon)
   └─ SupervisorCard (if exists)
      ├─ Header (icon + info)
      ├─ Bio
      └─ ExpertiseTags
```

---

## 🔄 Data Flow

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │
       │ 1. User Action
       ↓
┌─────────────┐
│  apiCall()  │ ← Uses auth token from AsyncStorage
└──────┬──────┘
       │
       │ 2. HTTP Request
       ↓
┌─────────────┐
│   Backend   │ ← Your Express API
│   API       │
└──────┬──────┘
       │
       │ 3. Response
       ↓
┌─────────────┐
│  Component  │ ← Updates state
│   State     │
└──────┬──────┘
       │
       │ 4. Re-render
       ↓
┌─────────────┐
│     UI      │ ← Shows data to user
└─────────────┘
```

---

## 🎯 Navigation Commands Reference

### From Anywhere:

```javascript
// Go to Sparks Hub
navigation.navigate("Spaces", {
  screen: "SparksHub",
});

// Go to My Spark
navigation.navigate("Spaces", {
  screen: "MySpark",
});

// Go to Create Spark
navigation.navigate("Spaces", {
  screen: "CreateSpark",
});

// Go to Spark Detail
navigation.navigate("Spaces", {
  screen: "SparkDetail",
  params: { sparkId: "abc123" },
});
```

### Within SpacesStack:

```javascript
// From SparksHub to Detail
navigation.navigate("SparkDetail", { sparkId: spark._id });

// From anywhere to Create
navigation.navigate("CreateSpark");

// From Create to MySpark (after success)
navigation.navigate("MySpark");

// Go back
navigation.goBack();
```

---

## 📱 Screen Transitions

```
SparksHub ─────────┐
    │              │
    │ Tap Spark    │ Tap "Your Turn"
    ↓              ↓
SparkDetail    CreateSpark
    │              │
    │ Back         │ Submit Success
    │              ↓
    │          MySpark
    │              │
    │              │ "Look for Supervisors"
    │              ↓
    │         [Supervisors - Not Yet]
    │              │
    └──────────────┘
         Back
```

---

## 🎨 Color Coding by Status

```
┌─────────────────┬─────────┬──────────┬──────────────┐
│ Status          │ Color   │ Icon     │ User Action  │
├─────────────────┼─────────┼──────────┼──────────────┤
│ pending         │ 🟡 Amber │ create   │ Send Request │
│ pending_review  │ 🔵 Blue  │ time     │ Wait         │
│ public          │ 🟢 Green │ checkmark│ View in Hub  │
└─────────────────┴─────────┴──────────┴──────────────┘
```

---

## 🚀 Quick Start Testing

```bash
# 1. Start backend
cd backend
npm run dev

# 2. Start frontend
cd Frontend/msj-app
npm start

# 3. Test flow:
✓ Open app
✓ Tap Spaces → Sparks Hub
✓ Tap "Your Turn"
✓ Fill form → Submit
✓ Check "My Spark"
✓ Go back to hub
✓ Tap any spark to view details
```

---

**Navigation is smooth and intuitive! 🎯**
