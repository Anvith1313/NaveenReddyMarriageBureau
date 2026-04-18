# Admin Sync Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three confirmed data sync bugs so that liked profiles, expressed interests, and admin-created member records all persist correctly to Firestore and are visible on both the main site and admin portal in real time.

**Architecture:** All fixes are pure Firestore read/write additions inside existing functions in `Main/index.html` and `Admin/index.html`. No new collections or schema changes. Admin sync relies on existing `onSnapshot` listeners — fixes ensure data actually reaches Firestore so those listeners fire correctly.

**Tech Stack:** Vanilla JS, Firebase v9 modular SDK (loaded via CDN), Firestore, Firebase Auth

---

## File Map

| File | What changes |
|------|-------------|
| `Main/index.html` | `toggleSave()` — add Firestore write + load on login; `sendInt()` — add proper error handling; `_applyLogin()` — load `savedProfiles` from user doc |
| `Admin/index.html` | `addNewOfflineMember()` — use `setDoc` with email-derived ID instead of `addDoc`; link admin profiles to auth via `linkedEmail` field |

---

## Task 1: Persist liked/saved profiles to Firestore

**Files:**
- Modify: `Main/index.html` — `toggleSave()` function (~line 3335), `_applyLogin()` function (~line 3049)

### Background
`toggleSave(u, e)` currently only updates `ST.savedProfiles` in memory. On page refresh or re-login, the list is empty. The fix writes to `users/{uid}.savedProfiles` (an array field) every time the list changes, and reads it back at login.

- [ ] **Step 1: Find the exact line numbers**

Open `Main/index.html` and search for `function toggleSave` and `function _applyLogin`. Note the line numbers — they will be near 3335 and 3049 based on current analysis.

- [ ] **Step 2: Replace `toggleSave` with Firestore-persisting version**

Find this code in `Main/index.html`:
```js
function toggleSave(u,e){
  if(e) e.stopPropagation();
  if(!ST.savedProfiles) ST.savedProfiles=[];
  const idx=ST.savedProfiles.indexOf(u);
  if(idx>-1){
    ST.savedProfiles.splice(idx,1);
    toast('Removed from saved profiles.');
  } else {
    ST.savedProfiles.push(u);
    toast('❤ Profile saved!');
  }
  updateLikedBadge();
  renderCard();
}
```

Replace with:
```js
function toggleSave(u,e){
  if(e) e.stopPropagation();
  if(!ST.savedProfiles) ST.savedProfiles=[];
  const idx=ST.savedProfiles.indexOf(u);
  if(idx>-1){
    ST.savedProfiles.splice(idx,1);
    toast('Removed from saved profiles.');
  } else {
    ST.savedProfiles.push(u);
    toast('Profile saved!');
  }
  updateLikedBadge();
  renderCard();
  // Persist to Firestore so admin can see it and it survives refresh
  if(window.FIREBASE_READY && ST.user && ST.user.uid){
    const {doc,updateDoc,db}=window.FB;
    updateDoc(doc(db,'users',ST.user.uid),{savedProfiles:ST.savedProfiles})
      .catch(err=>console.warn('Could not save liked profiles:',err));
  }
}
```

- [ ] **Step 3: Load `savedProfiles` from Firestore on login**

Find `function _applyLogin` (or the section where `ST.user` is set after login/verification). Look for the block that calls `loadInterestsFromFirestore()` or sets up listeners. Add the `savedProfiles` load immediately after the user document is read.

Find the code that looks like this (inside `checkVerification` or Google login or email login, after `getDoc` returns):
```js
const prof = snap.exists() ? {...snap.data(), uid} : ST.user;
ST.user = prof;
```

After `ST.user = prof;`, add:
```js
// Restore liked profiles from Firestore
ST.savedProfiles = Array.isArray(prof.savedProfiles) ? prof.savedProfiles : [];
updateLikedBadge();
```

Do this in ALL three login paths:
1. `checkVerification()` — email verification flow
2. `doLogin()` — email/password login
3. `doGoogleSignIn()` — Google OAuth login

Search for each occurrence of `ST.user=` after a `getDoc` or `snap.data()` call to find all three.

- [ ] **Step 4: Manual test — browser**

1. Open `Main/index.html` in browser (via `npx serve Main` or by opening directly)
2. Log in with a test account
3. Browse to a profile and tap the heart/bookmark icon
4. Open browser DevTools → Application → Firestore (or Firebase Console → Firestore → users → your UID)
5. Confirm `savedProfiles` array now appears in the user document and contains the profile UID
6. Refresh the page, log in again
7. Confirm the liked profile is still shown in the Liked page (not empty)
8. Open Admin portal — find that user's record — confirm `savedProfiles` field is visible

Expected: field appears in Firestore within 1-2 seconds of tapping the heart.

- [ ] **Step 5: Commit**

```bash
git add Main/index.html
git commit -m "fix: persist liked/saved profiles to Firestore users doc

toggleSave now writes savedProfiles array to Firestore on every change.
_applyLogin loads savedProfiles from user document on login so the list
survives page refresh and is visible to admin."
```

---

## Task 2: Fix silent interest failures with proper error handling

**Files:**
- Modify: `Main/index.html` — `sendInt()` function (~line 3318)

### Background
`sendInt()` uses `.catch(e => console.warn(...))` — if the Firestore write fails (permission error, network drop), the user sees "Interest sent!" but nothing was written. Admin sees nothing. Fix: use `async/await` with a visible error toast on failure.

- [ ] **Step 1: Find and replace `sendInt`**

Find this code in `Main/index.html`:
```js
function sendInt(toU){
  if(ST.interests.some(i=>(i.from===ST.user.u&&i.to===toU)||(i.from===toU&&i.to===ST.user.u))){toast('Interest already expressed.');return;}
  const int={from:ST.user.u,to:toU,status:'pending',date:new Date().toISOString().split('T')[0],fromName:ST.user.name,toName:(ST.profiles.find(p=>p.u===toU)||{}).name||toU};
  ST.interests.push(int);
  // Persist to Firestore
  if(window.FIREBASE_READY){
    const {doc,setDoc,db,collection,addDoc}=window.FB;
    const intId=ST.user.u+'_'+toU+'_'+Date.now();
    setDoc(doc(db,'interests',intId),{...int,id:intId}).catch(e=>console.warn('Interest save failed:',e));
    // Notification for the recipient
    addDoc(collection(db,'notifications'),{uid:toU,type:'interest_received',fromUid:ST.user.u,fromName:ST.user.name,msg:ST.user.name+' has expressed interest in your profile.',read:false,ts:new Date().toISOString()}).catch(()=>{});
  }
  toast('Your interest has been conveyed. Our bureau will be in touch.');
  nextCard();
}
```

Replace with:
```js
async function sendInt(toU){
  if(ST.interests.some(i=>(i.from===ST.user.u&&i.to===toU)||(i.from===toU&&i.to===ST.user.u))){toast('Interest already expressed.');return;}
  const int={from:ST.user.u,to:toU,status:'pending',date:new Date().toISOString().split('T')[0],fromName:ST.user.name,toName:(ST.profiles.find(p=>p.u===toU)||{}).name||toU};
  if(window.FIREBASE_READY){
    try{
      const {doc,setDoc,db,collection,addDoc}=window.FB;
      const intId=ST.user.u+'_'+toU+'_'+Date.now();
      await setDoc(doc(db,'interests',intId),{...int,id:intId});
      ST.interests.push(int);
      addDoc(collection(db,'notifications'),{uid:toU,type:'interest_received',fromUid:ST.user.u,fromName:ST.user.name,msg:ST.user.name+' has expressed interest in your profile.',read:false,ts:new Date().toISOString()}).catch(()=>{});
      toast('Your interest has been conveyed. Our bureau will be in touch.');
      nextCard();
    }catch(e){
      console.error('Interest save failed:',e);
      toast('Could not send your interest — please check your connection and try again. If this persists, call us at +91 72079 99985.');
    }
  } else {
    ST.interests.push(int);
    toast('Your interest has been conveyed. Our bureau will be in touch.');
    nextCard();
  }
}
```

- [ ] **Step 2: Also fix `sendIntFromLiked`**

Find `function sendIntFromLiked(u)` (~line 4059). It calls `sendInt(u)`. Since `sendInt` is now `async`, this is fine — no change needed. Just verify it still calls `sendInt(u)` without modification.

- [ ] **Step 3: Manual test — browser**

1. Log in to main site with test account
2. Browse to a profile and click "Express Interest"
3. Open Firebase Console → Firestore → `interests` collection
4. Confirm a new document appears with the correct `from`, `to`, `status: 'pending'` fields
5. Open Admin portal → Interests section
6. Confirm the interest record appears in admin (may need to click Reload/refresh in admin)
7. To test error handling: temporarily disable your internet connection, express interest on another profile — confirm you see the error toast, NOT the success toast

- [ ] **Step 4: Commit**

```bash
git add Main/index.html
git commit -m "fix: sendInt uses async/await with user-visible error on Firestore failure

Interest is now only added to local state after confirmed Firestore write.
Users see a clear error message with phone number if write fails, instead
of false 'interest sent' confirmation."
```

---

## Task 3: Fix admin-created member ID collision with self-registration

**Files:**
- Modify: `Admin/index.html` — `addNewOfflineMember()` function (~line 1640)

### Background
Admin uses `addDoc(collection(db,'users'), newP)` which creates a document with a random Firestore auto-ID. When that person later self-registers via Firebase Auth, `setDoc(doc(db,'users',cred.user.uid), np)` creates a **second** document with their Auth UID. Admin sees duplicates; neither document is complete. Fix: admin creates documents using a deterministic ID (email-based slug) and stores `linkedEmail`. When user self-registers, signup checks for an existing admin-created doc by email and merges data instead of creating a blank new doc.

- [ ] **Step 1: Update admin member creation to use email-based doc ID**

In `Admin/index.html`, find `addNewOfflineMember` and replace the Firestore write:
```js
// FIND this:
const {addDoc,collection,db}=window.FB;
const docRef=await addDoc(collection(db,'users'),newP);
newP.uid=docRef.id;
```

Replace with:
```js
// REPLACE with:
const {setDoc,doc,db}=window.FB;
// Use email-based slug as doc ID so self-registration can find and merge it
const emailSlug = newP.email ? newP.email.toLowerCase().replace(/[^a-z0-9]/g,'_') : 'offline_'+Date.now();
const docId = 'offline_'+emailSlug;
newP.uid = docId;
newP.linkedEmail = newP.email ? newP.email.toLowerCase() : '';
await setDoc(doc(db,'users',docId), newP);
```

- [ ] **Step 2: Update main site signup to check for existing admin profile**

In `Main/index.html`, find the signup completion function (around line 3014-3020) that does:
```js
const cred=await createUserWithEmailAndPassword(auth,email,pass);
np.uid=cred.user.uid;
await setDoc(doc(db,'users',cred.user.uid),np);
```

Replace with:
```js
const cred=await createUserWithEmailAndPassword(auth,email,pass);
np.uid=cred.user.uid;

// Check if admin pre-created a profile for this email
const emailSlug=email.toLowerCase().replace(/[^a-z0-9]/g,'_');
const offlineDocId='offline_'+emailSlug;
const {getDoc}=window.FB;
const existingSnap=await getDoc(doc(db,'users',offlineDocId)).catch(()=>null);
if(existingSnap && existingSnap.exists()){
  // Merge: auth profile wins for auth fields, keep admin data for profile fields
  const adminData=existingSnap.data();
  const merged={
    ...adminData,      // admin-filled profile data (name, dob, etc.)
    ...np,             // new signup data (email, password-set fields)
    uid:cred.user.uid, // always use auth UID going forward
    linkedEmail:email.toLowerCase(),
    mergedFromOffline:offlineDocId,
    mergedAt:new Date().toISOString()
  };
  await setDoc(doc(db,'users',cred.user.uid),merged);
  // Mark the offline doc as merged so admin knows
  const {updateDoc}=window.FB;
  await updateDoc(doc(db,'users',offlineDocId),{status:'merged',mergedToUid:cred.user.uid}).catch(()=>{});
} else {
  // No existing admin profile — fresh registration
  await setDoc(doc(db,'users',cred.user.uid),np);
}
```

- [ ] **Step 3: Update admin `onSnapshot` to hide merged offline docs**

In `Admin/index.html`, find the `onSnapshot(collection(db,'users'), ...)` handler (~line 1987). In the forEach where profiles are pushed, add a filter:

Find:
```js
snap.forEach(change=>{
  const d=change.doc.data();
  // ... existing logic
});
```

Add this condition so merged offline docs don't appear as duplicates:
```js
// Skip offline docs that have been merged into an auth account
if(d.status==='merged') return; // skip — real doc is under auth UID
```

Do the same in `loadProfilesFromFirebase` where `snap.forEach` pushes to `window.ST.profiles`:
```js
if(data.status==='deleted') return;
if(data.status==='merged') return; // skip merged offline docs — auth doc is source of truth
```

- [ ] **Step 4: Manual test**

1. In Admin portal, create a new offline member with email `test_merge@example.com`
2. Open Firebase Console → Firestore → `users` — confirm doc ID is `offline_test_merge_example_com`
3. In main site, sign up with the same email `test_merge@example.com`
4. After signup + email verification, open Firestore → `users` → find the new auth UID doc
5. Confirm it has `mergedFromOffline` field pointing to the offline doc
6. Confirm the offline doc now has `status: 'merged'`
7. Open Admin portal → confirm only ONE entry for this person (the auth UID doc), not two

- [ ] **Step 5: Commit**

```bash
git add Main/index.html Admin/index.html
git commit -m "fix: prevent duplicate user docs when admin pre-creates member who self-registers

Admin now creates offline profiles with email-slug doc IDs (offline_*).
Signup flow checks for matching offline doc and merges it into the auth
UID doc if found. Admin portal filters out merged offline docs."
```

---

## Task 4: Verify Firestore security rules allow all required operations

**Files:**
- Read: Firebase Console → Firestore → Rules (check in browser, no file to edit here — rules are in Firebase Console)

- [ ] **Step 1: Open Firebase Console rules**

Go to: https://console.firebase.google.com/project/reddy-elite-matrimony/firestore/rules

- [ ] **Step 2: Verify these rules exist (add any missing)**

The rules must allow:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: owner can read+write own doc; authenticated users can read others (for browsing)
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid;
    }

    // Offline profiles (admin-created): authenticated users can read; only admin writes
    match /users/{uid} {
      // Covered by rule above — admin writes via admin SDK or console
    }

    // Interests: authenticated users can create; parties involved can read
    match /interests/{intId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }

    // Notifications: user can read their own; authenticated can create
    match /notifications/{notId} {
      allow read: if request.auth != null && (resource.data.uid == request.auth.uid || resource.data.uid == '__admin__');
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.uid == request.auth.uid;
    }

    // Stories, appointments, drafts, editRequests: authenticated users
    match /stories/{id} { allow read: if true; allow write: if request.auth != null; }
    match /appointments/{id} { allow read, write: if request.auth != null; }
    match /drafts/{id} { allow read, write: if request.auth != null; }
    match /editRequests/{id} { allow read, write: if request.auth != null; }
  }
}
```

- [ ] **Step 3: Publish updated rules if changes were needed**

Click "Publish" in Firebase Console after any rule changes.

- [ ] **Step 4: Re-run manual tests from Tasks 1-3 with updated rules**

Repeat the heart-tap and express-interest tests to confirm no permission errors appear in browser DevTools console.

- [ ] **Step 5: Commit note (rules are in Firebase, not in git)**

```bash
git commit --allow-empty -m "chore: verify and update Firestore security rules

Rules now explicitly allow authenticated users to write to interests,
notifications, stories, appointments, editRequests, drafts collections.
Users can read all user profiles (needed for browse). Rules published
in Firebase Console for project reddy-elite-matrimony."
```

---

## Self-review checklist

- [x] Bug A (toggleSave never persists) — Task 1 ✓
- [x] Bug B (sendInt silent failures) — Task 2 ✓
- [x] Bug C (admin member ID collision) — Task 3 ✓
- [x] Firestore rules audit — Task 4 ✓
- [x] No placeholders — all code is complete
- [x] Type consistency — `ST.savedProfiles` used consistently as array throughout
- [x] Admin onSnapshot handles merged docs — Task 3 Step 3 ✓
