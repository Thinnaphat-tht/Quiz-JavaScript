# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Students of ITDS241 (the author and classmates) who revise JavaScript before exams. They read the lecture summaries and drill practice questions, usually under time pressure and often on a phone. The midterm round is finished; the guide is kept for reuse and refinement.

## Product Purpose

A single-page exam guide for ITDS241 JavaScript (Lectures 6, 7, 8 and the cheat sheet). It summarizes the lecture content and offers practice and mock quizzes so a student can review and test themselves before an exam.

## Positioning

Content follows the instructor's slides only. Anything the author added beyond the slides is labelled "หมายเหตุ". Every quiz question that asks for a code result has been run for real, so the answer key is verified, not guessed.

## Operating Context

Source lives in `src/` (notes-*.js, quiz-*.js, concepts.js, logic.js, app.js, styles.css, template.html). `node src/build.js` bundles it into one HTML file (`JS-Exam-Guide.html`, copied to `index.html`); `node src/verify.js` checks answers, code outputs, and scoring. Published on GitHub Pages: https://thinnaphat-tht.github.io/Quiz-JavaScript/. Source PDFs (lectures 6-8, cheat sheet) sit in the repo root.

## Capabilities and Constraints

- Single self-contained file; opens directly with no server.
- Must work offline.
- Must be usable on mobile as well as desktop.
- Practice set of 36 questions and a mock set of 20, with scoring.
- Content may reuse slide text; image content from the slides must not be copied (legal reason stated by the user).
- No fabricated images or data.
- Thai interface with English technical terms.

## Brand Commitments

None formal. The user has already rejected generic AI-looking study sites (navy and yellow, small text, decorative fake code images). Light theme with readable text for students. The user previously stated no purple and no blue.

## Evidence on Hand

Lecture PDFs and the cheat sheet PDF in the repo root. Verified answer key via `src/verify.js`. No testimonials, usage numbers, or other outside evidence exist; do not invent any.

## Product Principles

- Faithful to the instructor's slides; added material is always labelled.
- Verified over plausible: every code-output answer is actually run.
- Readability for students comes before decoration.
- Works anywhere a student is: offline, phone, one file.

## Accessibility & Inclusion

Readable type size and contrast for long study sessions; usable on small screens. No further formal standard was set.
