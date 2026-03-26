# 🏌️ Golf Charity Subscription Platform

A full-stack subscription-based golf platform that combines performance tracking, charity contributions, and monthly prize draws. 

Built with **Next.js 16**, **Supabase**, **Stripe**, and **TailwindCSS**.

🚀 **Live Demo:** [https://golf-charity-platform-navy-sigma.vercel.app](https://golf-charity-platform-navy-sigma.vercel.app)

---

## ✨ Features

### 👤 User Features
*   **User authentication** (Signup / Login)
*   **Stripe subscription** (Monthly & Yearly plans)
*   **Golf score tracking** (Stableford format)
*   **Rolling last 5 scores** (oldest removed automatically)
*   **Charity selection & contribution** (adjustable percentages)
*   **Monthly draw participation**
*   **Winnings overview dashboard**

### 🛠 Admin Features
*   **Draw management** (create, simulate, run, and publish)
*   **User management** (view subscriptions and statuses)
*   **Charity management** (add, activate, deactivate)
*   **Winner verification** (approve and mark as paid)
*   **Payout tracking**

---

## 🧰 Tech Stack

*   **Frontend:** Next.js 16 (App Router), React, TailwindCSS
*   **Backend:** Supabase (Postgres + Auth + RLS)
*   **Payments:** Stripe Subscriptions, Stripe Webhooks
*   **Deployment:** Vercel

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```
---
📦 Installation
Clone the repository:
```
Bash
git clone [https://github.com/helloag-p/golf-charity-platform.git](https://github.com/helloag-p/golf-charity-platform.git)
Navigate to the project directory:
```
```
Bash
cd golf-charity-platform
Install dependencies:
```
```
Bash
npm install
Run the development server:
```
```
Bash
npm run dev
```
---
🧪 Testing Checklist
1. Public Visitor

Visit homepage:

Hero section loads
Pricing visible
"Get Started" → signup
"Sign in" → login
2. Signup & Login
Create account
Login
Redirect to dashboard
No subscription → redirect /subscribe
3. Subscription Flow
Click monthly / yearly
Redirect to Stripe
Use test card:
4242 4242 4242 4242
Any future date
Any CVC
After payment → redirect dashboard

Verify in Supabase:

subscriptions table → status = active
4. Score Entry
Add score (1-45)
Add 6 scores
Oldest removed automatically
Delete score

Verify:

scores table → max 5 rows
5. Charity Selection
Select charity
Adjust percentage
Save

Verify:

charity_selections table
6. Draw System (Admin)

Make yourself admin:

UPDATE profiles 
SET role = 'admin'
WHERE email = 'your@email.com';

Go to:

/admin/draws
Create draw
Simulate
Run draw
Publish

Verify:

draws table
winners table
7. Admin Users
/admin/users
Users listed
Subscription status visible
8. Admin Winners
/admin/winners
Approve winner
Mark paid
9. Admin Charities
/admin/charities
Add charity
Deactivate
Activate
10. Winner Verification Flow
Run draw
Approve winner
Mark paid
Check dashboard winnings
11. Responsive Design

Test:

Mobile
Tablet
Desktop

No horizontal scroll
Tap friendly UI

---

🗂 Database Tables
profiles
subscriptions
scores
draws
draw_entries
winners
charities
charity_selections

---

🔐 Access Control
Role	Access
Public	Homepage
User	Dashboard
Admin	Admin Panel
📈 Subscription Plans
Monthly

£9.99 / month

Yearly

£99.99 / year
(2 months free)

---

🏆 Draw Logic
5-number match
4-number match
3-number match

Prize Split:

Match	Pool
5	40%
4	35%
3	25%

---

📱 UI Requirements
Clean modern UI
Mobile-first
Responsive
Smooth animations

---

🚀 Deployment

Deploy using Vercel: https://golf-charity-platform-navy-sigma.vercel.app/

vercel

---

👨‍💻 Author

Parv Agarwal
GitHub: https://github.com/helloag-p

---

📄 License

MIT License

---

🎯 Project Status

✅ Authentication
✅ Subscription System
✅ Stripe Integration
✅ Draw Engine
✅ Admin Dashboard
✅ Charity System
✅ Winner Verification

Production Ready 🚀
