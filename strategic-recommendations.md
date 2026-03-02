# Waypoints — Strategic Recommendations

Three high-impact improvements to make promotion guidance **timely, personalized, and actionable**.

---

## 1. Promotion Timeline — "Your Window"

**Problem:** The app shows where you stand today but not *when it matters*. There's no concept of a promotion eligibility window, so tips and scores feel static instead of urgent.

**Recommendation:** Add a promotion timeline that anchors the entire experience to the user's personal eligibility window.

- **Eligibility countdown.** Calculate the user's promotion window open date from their rank, TIG, and TIS. Show a clear countdown: *"Your window opens in 47 days."* This single number reframes every score gap from "something to improve" to "something to improve by April 15."
- **Time-gated Waypoints.** Today the 3 tip cards are static. Instead, sequence them against the timeline. A tip like "Earn MOS Qual Points" should surface 90 days before the window; "Log your PFT" should surface when PFT season aligns with the window. Tips that aren't time-relevant yet stay hidden — reducing noise.
- **Post-window shift.** Once the window opens, the UX should shift from *preparation mode* to *tracking mode* — showing where the user's score landed relative to the cut, and whether they made board or not.

**Why it matters:** A countdown creates urgency without overloading. The user opens the app and instantly knows: *how much time do I have, and what should I do right now?*

---

## 2. Projected Cut Line — "Where You Need to Be"

**Problem:** The current cut score (1556) is a single static number. In reality, cut scores shift quarter to quarter, and the user needs to plan against a future number — not today's.

**Recommendation:** Replace the single cut line with a projected range the user is actually competing against.

- **Historical cut score data.** Store past cut scores by MOS and quarter (e.g., 0311 E-4: Q1 1540, Q2 1556, Q3 1570). Even 3-4 data points establish a trend.
- **Projected cut line.** Use the trend to project a likely range for the user's window: *"Estimated cut for your window: 1560–1590."* Show this as a band on the existing score history chart alongside the user's composite trajectory.
- **Gap framing.** Instead of "You need 69 more points," say *"Based on trend, you'll likely need 80–110 more points by July."* This is more honest and more motivating — it prevents the false comfort of barely clearing today's number.
- **MOS-specific context.** Cut scores vary wildly by MOS. When a MARADMIN publishes new scores, update the projection and notify the user: *"New cut scores published — your MOS went up 15 pts."*

**Why it matters:** Marines are planning against a moving target. Showing the trajectory — not just the snapshot — helps them set realistic goals and understand the competitive landscape for their specific MOS.

---

## 3. Event-Aware Recommendations — "What's Available to You"

**Problem:** The app tells the user *what* to improve but not *how* or *when they can do it*. Earning MCI credits or attending a course depends on availability and deadlines that exist outside the app.

**Recommendation:** Introduce a lightweight event/opportunity layer that connects score gaps to concrete next steps.

- **Opportunity cards.** When the app identifies a score gap (e.g., Mental Agility is 70% of max), pair the tip with a specific opportunity: *"MarineNet has 3 MCI courses open for enrollment — completing one adds up to 50 pts."* or *"Rifle range qual is scheduled on base April 2–5."*
- **MARADMIN integration.** MARADMINs already have effective dates and an `affectsScore` flag. Use this: when a MARADMIN changes promotion policy, surface it as an event on the timeline with a clear "what this means for your score" callout — which already exists in the detail view but isn't connected to the career tab.
- **Seasonal awareness.** PFT season (Jan–Jun) and CFT season (Jul–Dec) are fixed cycles. The app should know which season it is and surface the right logging prompt. During PFT season, the "Log PFT" button should be prominent; during CFT season, swap it.

**Why it matters:** The gap between "you should improve your rifle score" and "there's a range qual next week" is the difference between information and action. This layer makes Waypoints a tool Marines *use* weekly, not just check occasionally.

---

## Summary

| # | Improvement | Core Idea | User Experience |
|---|------------|-----------|-----------------|
| 1 | Promotion Timeline | Anchor everything to the user's eligibility window | *"47 days — here's what to focus on"* |
| 2 | Projected Cut Line | Show the trend, not just today's number | *"You'll likely need 1560–1590 by July"* |
| 3 | Event-Aware Recs | Connect score gaps to real-world opportunities | *"Rifle qual on base April 2 — that's +30 pts"* |

All three reinforce the same principle: **right information, right time, right action.**
