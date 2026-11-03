---
name: JS Exam Guide
description: A warm-paper study notebook for ITDS241 JavaScript revision, with one red-orange pen for emphasis.
colors:
  paper: "#faf7f2"
  paper-raised: "#fffdf9"
  paper-sunk: "#f3eee5"
  paper-deep: "#ebe4d7"
  rule: "#e4dccd"
  rule-strong: "#cfc4b0"
  ink: "#2a2118"
  ink-soft: "#5c5043"
  ink-faint: "#75695a"
  pen-red: "#c4411a"
  pen-red-deep: "#9c3010"
  pen-red-wash: "#fbe9e1"
  pen-red-line: "#efc4b3"
  highlighter: "#e8a21a"
  right-green: "#1f7a45"
  right-green-wash: "#e3f2e8"
  wrong-red: "#b3261e"
  wrong-red-wash: "#fbe6e4"
  caution-brown: "#7a4e00"
  caution-wash: "#fbf0d4"
  code-teal: "#0e6b5c"
  code-amber: "#8a5200"
  night-paper: "#1b1713"
  night-code-wash: "rgba(0, 0, 0, 0.25)"
  scrim: "rgba(30, 22, 14, 0.45)"
  print-rule: "#bbb"
typography:
  display:
    fontFamily: "IBM Plex Sans Thai, Leelawadee UI, Noto Sans Thai, Tahoma, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "IBM Plex Sans Thai, Leelawadee UI, Noto Sans Thai, Tahoma, system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 3vw, 2.3rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  headline-sm:
    fontFamily: "IBM Plex Sans Thai, Leelawadee UI, Noto Sans Thai, Tahoma, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.3
  title-lg:
    fontFamily: "IBM Plex Sans Thai, Leelawadee UI, Noto Sans Thai, Tahoma, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "IBM Plex Sans Thai, Leelawadee UI, Noto Sans Thai, Tahoma, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 600
    lineHeight: 1.3
  lead:
    fontFamily: "IBM Plex Sans Thai, Leelawadee UI, Noto Sans Thai, Tahoma, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 500
    lineHeight: 1.7
  body:
    fontFamily: "IBM Plex Sans Thai, Leelawadee UI, Noto Sans Thai, Tahoma, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.8
  body-sm:
    fontFamily: "IBM Plex Sans Thai, Leelawadee UI, Noto Sans Thai, Tahoma, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "IBM Plex Mono, Cascadia Mono, Consolas, Courier New, monospace"
    fontSize: "0.78rem"
    fontWeight: 500
    lineHeight: 1.7
  label:
    fontFamily: "IBM Plex Mono, Cascadia Mono, Consolas, Courier New, monospace"
    fontSize: "0.85rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  pill: "99px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.pen-red}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.55rem 1.1rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.pen-red-deep}"
  button-secondary:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.55rem 1.1rem"
    height: "2.75rem"
  button-secondary-hover:
    backgroundColor: "{colors.paper-sunk}"
  card:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  chip:
    backgroundColor: "{colors.paper-sunk}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.sm}"
    padding: "0.05rem 0.5rem"
  answer-option:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.8rem 1rem"
  answer-option-correct:
    backgroundColor: "{colors.right-green-wash}"
    textColor: "{colors.ink}"
  answer-option-wrong:
    backgroundColor: "{colors.wrong-red-wash}"
    textColor: "{colors.ink}"
---

# Design System: JS Exam Guide

## Overview

**Creative North Star: "The Study Notebook"**

A well-kept revision notebook: warm paper, dark brown ink, and a single red-orange pen used to mark what matters. The page is built to be read for a long time, usually by a student the night before an exam, so legibility comes before every other decision. Type is large, line height is generous (1.8 for body text), and contrast is high.

The system is calm and sure of itself. Surfaces are flat paper, separated by thin rules rather than shadows. Controls respond clearly but never play: a button presses in slightly, a correct answer gets a quiet green wash, a wrong one gets a soft shake. There is no glow, no gradient decoration, no emoji, no bento grid, and no purple or blue anywhere. The look is deliberately unlike generic AI-made study sites (navy plus yellow, small text, decorative fake code images).

Dark mode inverts the notebook into a warm night desk (brown-black paper, cream ink, a lighter coral pen) and is switched by a manual toggle.

**Key Characteristics:**
- Warm paper neutrals tinted toward brown, never cool grey.
- One accent (the red-orange pen) carries all emphasis; green and red appear only as answer feedback.
- Thai-first typography with a monospace voice for code, numbers, and labels.
- Thin rules and tonal steps for structure; shadow is rare.
- Readable on a phone at arm's length, offline, from a single file.

## Colors

A restrained warm palette: paper and ink do 90% of the work, the red-orange pen marks the few things the reader must not miss.

### Primary
- **Pen Red** (#c4411a): the single accent. Primary buttons, the current navigation item, chapter numerals, progress bars, selected answer, the focus ring. Deep variant **Pen Red Deep** (#9c3010) is used for accent text and hover, since it keeps contrast on paper. **Pen Red Wash** (#fbe9e1) and its line (#efc4b3) tint key callouts and selected states.

### Secondary
- **Highlighter** (#e8a21a): appears only as the second stop of the reading-progress bar gradient.

### Neutral
- **Paper** (#faf7f2): page background.
- **Paper Raised** (#fffdf9): cards, rail, answer options.
- **Paper Sunk** (#f3eee5): code boxes, chips, segmented control, hover fills.
- **Paper Deep** (#ebe4d7): progress-bar tracks.
- **Rule** (#e4dccd) and **Rule Strong** (#cfc4b0): hairlines and control borders.
- **Ink** (#2a2118): body text. **Ink Soft** (#5c5043) for secondary text, **Ink Faint** (#75695a) for metadata.

### Feedback
- **Right Green** (#1f7a45) on **Right Green Wash** (#e3f2e8): correct answers and completed sections.
- **Wrong Red** (#b3261e) on **Wrong Red Wash** (#fbe6e4): wrong answers and weak-topic percentages.
- **Caution Brown** (#7a4e00) on **Caution Wash** (#fbf0d4): warning callouts and common-pitfall cards.

### Code syntax
Teal (#0e6b5c) for keywords and tags, amber-brown (#8a5200) for strings and attributes, burnt orange (#b0431a) for numbers, grey-brown for comments (italic), olive (#4a6b1f) for built-ins. No blue or purple.

### Named Rules
**The One Pen Rule.** The red-orange accent is the only decorative colour. Green, red, and amber exist to report answer state and warnings, never to decorate.
**The No Cool Colour Rule.** No blue, purple, or cool grey in the palette or in syntax colours.

## Typography

**Display / Body Font:** IBM Plex Sans Thai (falls back to Leelawadee UI, Noto Sans Thai, Tahoma, system-ui)
**Label / Code Font:** IBM Plex Mono (falls back to Cascadia Mono, Consolas)

**Character:** A humanist Thai sans for sustained reading, paired with a plain monospace that signals "this is code or a number". Fonts load from Google Fonts; offline, the system Thai fallbacks take over without breaking layout.

### Hierarchy
- **Display** (600, clamp 2.2rem to 3.6rem, 1.18): home headline only.
- **Headline** (600, clamp 1.7rem to 2.3rem, 1.3): page titles. Lecture numerals use mono 600 at up to 4.5rem in Pen Red.
- **Headline Small** (600, clamp 1.5rem to 2rem, 1.3): lecture titles under the large numeral.
- **Title Large** (600, 1.4rem, 1.3): home and concept-group section headings.
- **Title** (600, 1.2rem, 1.3): section and card headings.
- **Lead** (500, 1.1rem, 1.7): hero lead, question text, dashboard sub-headings.
- **Body** (400, 1rem, 1.8): lecture text and explanations; reading column capped at 46rem.
- **Body Small** (400, 0.92rem, 1.6): navigation, table cells, secondary text.
- **Label** (500, 0.85rem, mono): kickers, counters, question numbers.
- **Caption** (500, 0.78rem, mono): chips and legends.

### Named Rules
**The Reading First Rule.** Body text is never smaller than 1rem and never tighter than 1.7 line height; small sizes are for metadata only.
**The Mono Means Machine Rule.** Monospace marks code, numbers, and system labels; prose is never set in mono.

## Layout

A fixed left rail (15.5rem) with navigation and settings beside a fluid reading stage; the stage content is capped at 68rem, with lecture text in a 46rem column and a 14.5rem sticky table of contents beside it. Quiz pages pair the question card with a 15rem question-number navigator. Spacing is a relaxed rem rhythm (0.25, 0.5, 1, 1.25, 1.5, 3rem), with generous vertical space between sections.

Responsive breakpoints at 1100px, 900px, and 560px: side panels collapse, the rail becomes a slide-over opened from a sticky top bar, grids drop to one column, and touch targets stay at least 2.25rem to 2.75rem. Content must remain usable at phone width, offline.

## Elevation & Depth

Flat by default. Depth comes from tonal steps (Paper, Paper Raised, Paper Sunk) and 1px rules, not shadows. A soft shadow (`0 1px 2px rgba(42,33,24,.06), 0 8px 24px rgba(42,33,24,.08)`) appears only on chapter-card hover and the final score card. The sticky top bars use a translucent paper blur so content passes beneath them.

### Named Rules
**The Flat Until Touched Rule.** Surfaces are flat at rest; lift and shadow are a response to pointer hover only.

## Shapes

Gently rounded, never pill-shaped except progress tracks. Cards and panels use 14px, the result card and dialog 20px, buttons, inputs, and answer options 10px, chips and number tiles 6px, and small marks (focus ring, inline code, checkbox, legend swatch) 4px. Borders are 1px hairlines (1.5px on answer options so selection reads clearly). Dashed borders mark optional or "note" content such as the author's "หมายเหตุ" callouts.

## Components

### Buttons
- **Shape:** 10px radius, minimum height 2.75rem (2.25rem small).
- **Primary:** Pen Red fill with white text; dark mode swaps to a lighter coral with near-black text.
- **Secondary:** Paper Raised with a Rule Strong border; hover fills Paper Sunk.
- **Hover / Press:** colour shift on hover; pressing scales to 0.97 over 120ms. Calm, no bounce.

### Chips
- Paper Sunk fill, Rule border, 6px radius, mono 0.78rem. The accent variant uses Pen Red Wash with Pen Red Deep text.

### Cards / Containers
- **Corner Style:** 14px. **Background:** Paper Raised. **Border:** 1px Rule. **Padding:** 1.5rem.
- Chapter cards lift 3px and gain a Pen Red Line border on hover.

### Callouts
- Key (Pen Red Wash), warning (Caution Wash), and note (transparent, dashed border). The note variant is how author-added content is labelled "หมายเหตุ".

### Code boxes
- Paper Sunk body, header strip with a copy button, optional output panel separated by a dashed rule. Syntax colours as above.

### Quiz answer options
- Full-width rows with a mono letter key, 10px radius, 1.5px border. Hover tints Pen Red Wash; selected is Pen Red; correct turns Right Green with a one-shot green ring; wrong turns Wrong Red with a short shake. Feedback is never colour-only: a mark icon and text accompany it.

### Navigation
- Left rail links are 10px-rounded rows; the current page gets Pen Red Wash with Pen Red Deep bold text. The in-lecture table of contents marks the current section with a 2px Pen Red bar and read sections with a green check.

### Inputs
- Search field: Paper Raised, 1px Rule Strong border, 10px radius, 2.9rem tall; focus shows a Pen Red border and outline.

## Do's and Don'ts

### Do:
- **Do** keep text at 1rem or larger with a 1.7 to 1.8 line height for anything the student must read.
- **Do** use Pen Red for the single most important thing on a screen and let paper and ink carry the rest.
- **Do** pair every correct/wrong colour with an icon or text.
- **Do** keep the manual light/dark toggle and honour `prefers-reduced-motion`.
- **Do** mark author-added content with a "หมายเหตุ" note callout.

### Don't:
- **Don't** use purple or blue, or cool greys.
- **Don't** use emoji, glow effects, heavy gradients, bento grids, or decorative fake code imagery.
- **Don't** use shadows at rest; lift only on hover.
- **Don't** add a second accent colour for decoration.
- **Don't** shrink body copy to fit more on screen; scroll instead.
