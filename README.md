# 🌟 ElderCare+ – Smart Elderly Care & Medication Management Platform

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![WCAG](https://img.shields.io/badge/WCAG-2.2%20AA%20Compliant-green.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Healthcare without communication, cognitive, or accessibility barriers.**  
> An interconnected, scotopic-friendly, and multilingual healthcare ecosystem designed for elderly individuals, their family guardians, and clinical caregivers.

---

## 🎯 Live Demonstration & Quick Access

- **Local Preview**: [http://localhost:5173/](http://localhost:5173/)
- **Vercel / Netlify Deployment**: Ready for 1-click cloud deployment via `vercel.json` and `netlify.toml`.

### 🔑 Pre-Configured Test Credentials

| Role | Name | Email | Password | Quick Passcode |
|---|---|---|---|---|
| **👵 Elderly Patient** | Eleanor Vance (76) | `eleanor.vance@eldercare.plus` | `Pass1234!` | *1-Click Card* |
| **👩 Family Guardian** | Priya Vance | `priya.vance@familycare.org` | `Pass1234!` | `FAMILY-8492` |
| **🩺 Visiting Nurse (RN)** | Nurse Sarah Jenkins, RN | `sarah.nurse@elderhealth.net` | `Pass1234!` | `CARE-5120` |

---

## 🌟 Hackathon Standout Features

### 1. 🎯 Interactive Visual Arrow Onboarding Tour
- **Directional Bouncing Indicators**: High-contrast bouncing arrows (`👇 Look Here` / `👆 Look at Header Tab`) point directly to the exact feature being explained.
- **Dynamic Tab Switching**: The tour automatically switches tabs in the background so the user is directly looking at the target section.
- **"How to Add Medicines" Step**: Direct modal launcher with step-by-step guidance on scheduling medicine name, dosage, morning/night timings, and food instructions.
- **Multilingual Voice Narration**: Every step is voiced in **English**, **Hindi (हिंदी)**, and **Bengali (বাংলা)**.
- **Permanent Access**: Click `[ 🎯 How It Works ]` anytime from the header or dashboard.

### 2. 🌙 Scotopic Vision (Night Blindness / Nyctalopia) Mode
- Standard dark modes cause extreme glare and disorientation for elderly users suffering from rod photoreceptor degeneration.
- ElderCare+ features a **590nm Amber Scotopic Spectrum** engineered to preserve nighttime dark adaptation, eliminate blue-light haze, and prevent nighttime falls.

### 3. 🗣️ Multilingual Speech & Non-Verbal Communication
- **Tri-Lingual Text-to-Speech (TTS)**: Seamless voice announcements in English, Hindi, and Bengali.
- **Silent Communication Board**: Large pictographic communication cards (*YES*, *NO*, *I NEED WATER*, *I AM IN PAIN*, *CALL FAMILY*) for stroke recovery or non-verbal seniors that instantly speak aloud.

### 4. 💊 Intelligent Medication Management & Adherence Tracking
- Custom dosage scheduling (Morning, Afternoon, Evening, Night) with meal relations.
- 1-click **Taken / Skipped** tracking with audio chimes and celebratory confetti.
- Adherence percentage calculation with consecutive day streak rewards.
- **New Account Starter State**: Empty-state guide with arrow pointing to `+ Add New Medicine` and a 1-click `Load Sample Starter Medicines` button.

### 5. 🔒 Mandatory Passcode Family & Caregiver Sync
- Zero static shared passwords: each member has their own verified account.
- Family members enter `FAMILY-8492` or caregivers enter `CARE-5120` to securely sync with Eleanor Vance's health profile.
- Granular permission control and instantaneous access revocation.

### 6. 🚨 Emergency SOS Lifeline
- 5-second cancelable safety ring with audible warning siren.
- Automatic geolocation coordinate dispatch and emergency contact broadcast.
- Instant first responder vital card (Blood Group O+, Allergies, Attending Physician).

---

## 🚀 How to Make the Website Live (Deployment Guide)

### Option 1: 1-Click Deploy on Vercel (Fastest & Free)

1. Push this repository to your GitHub account (see Git instructions below).
2. Go to **[vercel.com](https://vercel.com/)** and click **"Add New Project"**.
3. Select your `eldercare-plus` GitHub repository.
4. Keep the default settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. Your website is live in ~30 seconds with a free `https://eldercare-plus.vercel.app` URL!

---

### Option 2: Drag & Drop to Netlify (Zero Git Required)

1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Drag and drop the `dist/` folder (or the included `eldercare-plus-live-build.zip`).
3. Netlify will instantly publish your site live with an HTTPS URL!

---

### Option 3: GitHub Pages Deployment

1. In `vite.config.ts`, set `base: './'`.
2. Run `npm run build`.
3. Push the `dist` branch or configure GitHub Pages in **Settings > Pages > Deploy from GitHub Actions**.

---

## 💻 Local Installation & Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/eldercare-plus.git
cd eldercare-plus

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Architecture

```
eldercare-plus/
├── dist/                  # Optimized production build ready for deployment
│   ├── assets/            # Minified JS & CSS bundles
│   ├── index.html         # Production entry point
│   └── _redirects         # SPA routing redirects
├── public/                # Static public assets
│   └── _redirects         # Netlify / Cloudflare SPA fallback
├── src/
│   ├── components/        # React UI components
│   │   ├── AuthPortal.tsx         # Sign in, registration & 1-click access
│   │   ├── GuidedTourModal.tsx    # 6-step visual arrow tour (EN/HI/BN)
│   │   ├── MedicationManager.tsx  # Dose tracker, schedule & empty states
│   │   ├── ElderlyDashboard.tsx   # Eleanor Vance daily patient console
│   │   ├── FamilyDashboard.tsx    # Family adherence monitor
│   │   ├── CaregiverDashboard.tsx # Visiting nurse clinical hub
│   │   ├── EmergencySOSModal.tsx  # Siren & dispatch broadcast
│   │   ├── SilentCommunicationModal.tsx # Non-verbal pictographic board
│   │   ├── AppointmentManager.tsx # Doctor visit schedule
│   │   ├── HealthProfile.tsx      # Clinical vitals & passcode security
│   │   └── Navbar.tsx             # Accessible header with tour & audio dock
│   ├── context/
│   │   ├── AuthContext.tsx        # Authentication & persistent local state
│   │   └── ThemeContext.tsx       # Scotopic 590nm & contrast engine
│   ├── lib/
│   │   ├── supabase.ts            # Client repository & sample datasets
│   │   └── audio.ts               # Synthesized audio feedback engine
│   ├── App.tsx                    # Root routing & layout controller
│   ├── main.tsx                   # React DOM entry
│   └── index.css                  # Global styles & high-contrast themes
├── .gitignore             # Git exclusion rules
├── vercel.json            # Vercel SPA routing & cache configuration
├── netlify.toml           # Netlify SPA build & redirect configuration
├── package.json           # Scripts & dependency definitions
├── tsconfig.json          # Strict TypeScript configuration
└── tailwind.config.js     # Accessible color tokens & utility classes
```

---

## 🛡️ Medical Safety & Privacy Disclaimer

ElderCare+ is an assistive daily routine and adherence management platform. It does not provide medical diagnoses, alter physician prescriptions, or replace certified healthcare practitioners. All emergency features coordinate directly with designated human contacts and official emergency response services.

---

## 👨‍💻 Hackathon Submission Team

Built with ❤️ for seniors, family caregivers, and community healthcare workers.
