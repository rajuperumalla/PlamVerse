# PalmVerse Unified Review Process Flow

This document outlines the end-to-end process for generating a user report, from initial submission through expert review and final delivery. This flow applies to both Palmistry and Numerology services.

## Part 1: User Submits a Request

1.  **Service Selection & Input:**
    *   A user logs in and selects a service (e.g., "Palmistry -> Comprehensive Analysis" or "Numerology -> Business Name").
    *   They are directed to the relevant input page (`/palm-input` or `/numerology-input`).
    *   The user fills out the form with the required details (palm images, name, DOB, etc.).

2.  **Payment Simulation:**
    *   The user clicks "Proceed to Payment".
    *   Current form data is saved to session storage.
    *   The user is redirected to the `/payment` page, where they "pay".
    *   The `hasPaid` flag is set to `true`, and the user is sent back to the input page with a `payment_success=true` query parameter.

3.  **Final Submission (Post-Payment):**
    *   The input page reloads, pre-filled with data from session storage.
    *   **Scenario A (Palmistry - Initial AI Draft):**
        *   If all details are complete, the form is auto-submitted.
        *   The `generatePalmReading` AI flow is called to create an initial draft.
        *   A report placeholder is created with the status `pending_review` and the initial AI content.
    *   **Scenario B (Numerology - Direct to Review):**
        *   If all details are complete, the form is auto-submitted.
        *   A report placeholder is created immediately with the status `pending_review`, without an initial AI draft. The content field is empty or contains a placeholder message.
    *   In both scenarios, the user sees a confirmation toast and is redirected to the home page.

## Part 2: Editor/Admin Review Workflow

This is the core of the quality control process.

4.  **Report Appears in Workflow:**
    *   A new report with status `pending_review` appears in the Editor's "Pending Reviews" queue (`/editor/workflow`).

5.  **Editor Opens the Report:**
    *   The Editor clicks "Review" to navigate to the review page (`/editor/review/[reportId]`).
    *   The page displays all user-submitted data (palm images, numerology details, etc.).
    *   For Palmistry reports, the initial AI-generated draft is also shown for reference.

6.  **Editor Provides Expert Analysis:**
    *   The Editor uses their expertise to analyze the user's data.
    *   They can use the "Get AI Suggestions" tool to get ideas or structure their thoughts. This is an optional helper step.
    *   The Editor writes their comprehensive analysis, interpretations, and specific directives for the AI into the "Expert Analysis & Directives" textarea. This is the most crucial input from the expert.

7.  **Guided AI Generation:**
    *   The Editor clicks the **"Generate Report using My Analysis"** button.
    *   This triggers the relevant Genkit AI flow (e.g., `generatePalmReading` or `generateBusinessNumerologyReport`).
    *   **Crucially, the flow is provided with both the user's original data AND the Editor's expert analysis.** The AI is prompted to use the editor's notes as the primary source for generating the new report.

8.  **Review the AI-Enhanced Draft:**
    *   The newly generated report, which is a synthesis of the AI's power and the editor's expertise, is displayed on the screen.

9.  **Final Approval:**
    *   The Editor reads the final draft. If it meets their quality standards, they click **"Confirm & Approve This Version"**.
    *   This action updates the report's status to `approved` and saves the final, high-quality content.
    *   The Editor is then redirected to the "Approved Reports" page (`/editor/approved`).

## Part 3: User Accesses the Final Report

10. **Viewing the Report:**
    *   At any time, the user can navigate to the "My Reading" page (`/report`).
    *   If the report status is `approved`, the `ReportDisplay` component shows the final, expert-reviewed content.
    *   The user can then download the report as a PDF or provide feedback.

This unified flow ensures that every report delivered to a user has been vetted and enhanced by a human expert, leveraging AI as a powerful assistant rather than the sole author.
