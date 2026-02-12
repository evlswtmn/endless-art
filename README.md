# CareTracker

Caregiver Expense & Deduction Tracker — track medical mileage, expenses, and tax deductions for the people you care for.

## What It Does

- **IRS-Compliant Mileage Logging** — date, destination, medical purpose, miles, odometer readings, who was transported
- **Medical Expense Tracking** — copays, prescriptions, equipment, insurance, therapy costs by category
- **Running Deduction Totals** — real-time estimated tax savings based on your state, AGI, and federal bracket
- **Multiple Care Recipients** — track expenses and trips for multiple dependents
- **Shift Schedule Calendar** — overlay your rotating shift pattern to spot appointment conflicts
- **Appointment Management** — schedule and track medical appointments with conflict detection
- **Data Export** — backup your records as JSON, import from backups
- **Mobile-First** — designed to work on your phone at the point of care

## Who It's For

Working caregivers who transport family members to medical appointments and pay out-of-pocket medical expenses. If you're one of the 53 million unpaid caregivers in the US and you work a shift job, this is built for you.

## How It Works

Pure HTML/CSS/JavaScript. No server, no accounts, no subscriptions. All data stays on your device in localStorage. Open `index.html` in any browser or deploy to any static host (GitHub Pages, Netlify, Vercel) for free.

## Quick Start

1. Open `index.html` in your browser
2. Walk through the setup wizard (your info, care recipients, shift pattern)
3. Start logging trips and expenses
4. Watch your estimated deductions grow

## Tax Notes

- Medical mileage is deductible at the IRS standard rate (currently ~$0.22/mile)
- Medical expenses above 7.5% of your Adjusted Gross Income (AGI) are deductible if you itemize
- This is an estimation tool — always consult a qualified tax professional for your specific situation
- Keep contemporaneous records (log trips at or near the time of travel) for IRS compliance

## Deployment

This is a static site. No build step required.

**GitHub Pages:** Push to a repo, enable Pages in Settings, done.

**Netlify/Vercel:** Drag and drop the folder. Done.

**Local:** Just open `index.html` in a browser.

## License

MIT
