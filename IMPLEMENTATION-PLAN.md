# bengould.org v3 Implementation Plan

## Overview

Major restructure based on design critique. Moving from "clean consultant template" to something that leads with proof and shows the full spectrum of work.

## One-Liner

**"Policy analysis. Political wins."**

Captures duality without being braggy. Two-clause parallel structure.

## Color Palette — Blues

Ben wears light blue oxford + navy slacks. Use that as the palette:

```css
/* Light blue accent (oxford shirt) */
--accent: #5b8ec9;
--accent-hover: #4a7db8;

/* Navy for dark elements (slacks) */
--navy: #1e3a5f;

/* Background options - either keep warm or go cleaner */
--bg: #faf9f7;  /* warm neutral - current */
/* OR */
--bg: #f8fafc;  /* cooler, cleaner */

/* Text */
--text: #1a1a1a;  /* or use navy */
```

## New Page Structure

### 1. Hero (Simpler)
- Name: "Ben Gould"
- One-liner: "Policy analysis. Political wins."
- Short description: "I help advocacy organizations, local governments, and campaigns turn good ideas into real policy."
- CTA: "Get in touch" button
- Photo: Consider using one with more action energy if available, otherwise current headshot is fine

### 2. Featured Proof — Measure FF Case Study
Make this prominent, not buried in a card. Show the arc:

```
BERKELEY MEASURE FF

$267M infrastructure · 60% victory

Drafted the measure → Built coalition → Led campaign → Won

[Brief paragraph about what made this work - designed to pass,
not just to sound good. Endorsements from Mayor, Council supermajority,
Sierra Club, Building Trades, Berkeley Firefighters. Defeated competing measure.]
```

Numbers should be BIG. This is the proof that everything else builds from.

### 3. The Spectrum — "From Technical Analysis to Full Campaigns"

Show the range of intensity, not categories. Something like:

**Technical Analysis**
- LandWatch Monterey County: GHG inventories, EIR analysis, VMT modeling
- Lightweight support for advocacy orgs

**Policy Development**
- Oakland BAC: Budget analysis, recommendations that got implemented
- Oakland Charter Reform: Being a credible threat moved the needle

**Coalition Building**
- Measure FF drafting & stakeholder negotiations (before the campaign)
- Building endorsement coalitions

**Full Campaign Mode**
- Measure FF campaign ($140k raised, 60% victory)
- Mark Humbert for City Council (63% victory)
- Empower Oakland IE for Charlene Wang (59% RCV)

Visual treatment: Maybe a gradient or progression showing intensity levels, with examples at each level.

### 4. Sample Work
Keep the three PDF previews:
- BAC Budget Review Report
- Measure FF Mailer
- Charlene Wang IE Mailer

These are already generated at `/images/samples/`

### 5. Background (Shorter)
Compress the credentials:
- Current: Oakland BAC Commissioner, EcoDataLab President
- Past: Berkeley E&C Commission Chair, Legislative Aide to Councilmember Droste
- Education: UC Berkeley MPP + MS Environmental Engineering

### 6. Contact
- "I'm taking on new policy consulting work."
- ben@bengould.org (prominent)
- Social links
- "Based in Oakland, California"

## Typography

Keep Bricolage Grotesque — it has personality. Already loaded.

Update CSS variables to reference it consistently.

## Key Design Principles

1. **Numbers prominent** — $267M, 60%, 63%, 59% should be visible, not buried
2. **Facts as flex** — Let accomplishments speak without adjectives
3. **Show the spectrum** — Not everyone needs a $267M measure; show you can do lightweight too
4. **Less template-y** — Break away from standard "services grid" format
5. **Blue = trustworthy** — Authentic to Ben, reads as reliable

## Files to Modify

- `index.html` — Major restructure
- `styles.css` — Color palette update, new section styles
- Keep existing: `/images/samples/`, `/images/bgould.jpg`, `/references/`

## LandWatch Content to Add

From previous work (via EcoDataLab partnership since 2021):
- GHG inventories for Monterey County
- CSUMB Master Plan emissions analysis
- City of Monterey zero-carbon strategy
- Pajaro River flood risk / housing policy analysis
- EIR comment letters

External links:
- https://www.montereycountyweekly.com/opinion/mcnow_intro/envisioning-a-zero-carbon-future/article_02135c92-1386-11ed-8ac9-33ccbd0f3bf7.html
- https://www.montereycountyweekly.com/news/local_news/csumb-s-master-plan-drops-greenhouse-gas-emissions-further-ahead-of-california-state-university-board/article_2a8a14a6-d6df-11ec-a7d6-63d837baebaf.html
- https://landwatch.org/issues-actions/monterey-county/north-county/pajaro-river/

## Reference Files

- `BRAND.md` — Full brand identity doc
- `/references/` — PDFs for sample work section
- `/images/samples/` — Generated PNG previews of PDFs

## After Implementation

- Test all three fonts (DM Sans, Plus Jakarta Sans, Bricolage Grotesque) by swapping Google Fonts link
- Ben will refine copy
- Consider adding more action-oriented photos if available
