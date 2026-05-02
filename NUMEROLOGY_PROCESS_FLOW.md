# PalmVerse Numerology Services - User & Admin Process Flow

This document outlines the typical user journey and administrative process for Numerology services within the PalmVerse application. This flow largely mirrors the Palmistry process.

## 1. Landing, Authentication, and Service Selection

1.  **User Visits Site (`/`) or Navigates**:
    *   User accesses the PalmVerse application.
    *   User authenticates if not already logged in (via `AuthOptions` on Home or directly accessing a protected route).
    *   User navigates to the "Numerology" section via the main menu (e.g., on `/palm-input` or `/numerology-input` pages).

2.  **Numerology Service Selection**:
    *   From the "Numerology" dropdown menu, the user selects a specific service (e.g., "Business Name Numerology Calculator," "Baby Name Numerology," "Personal Life Path & Destiny Report," "Name Correction & Compatibility Checker," "House Number / Address Compatibility").
    *   User is redirected to the `/numerology-input?service=[selected_service_query]` page.

## 2. Numerology Details Input & (Simulated) Payment

3.  **User on Numerology Input Page (`/numerology-input?service=...`)**:
    *   The page displays the selected Numerology service title and description.
    *   A form is presented to collect relevant user details:
        *   **Full Name(s)**: (e.g., Personal Name, Business Name, Baby's Potential Names) - Label will adapt based on service.
        *   **Date of Birth**: (For personal reports, or parent's DOB for baby name, etc.)
        *   **(Optional) Time of Birth**:
        *   Other fields specific to the service (e.g., current address for House Number Numerology, multiple name options for Business/Baby Name services).
    *   User fills in the required details.
    *   User clicks the **"Proceed to Payment"** button.

4.  **Pre-Payment Data Handling**:
    *   The current form data is saved to **session storage**.
    *   User is redirected to the Payment Page (`/payment`).

5.  **User on Payment Page (`/payment`)**:
    *   Sees simulated payment details (e.g., $X.XX based on service).
    *   User clicks the **"Simulate Successful Payment"** button.
    *   `hasPaid` (or a similar flag for numerology services) is set to `true` in the application context.
    *   User is redirected back to Numerology Input Page (`/numerology-input?service=...&payment_success=true`).

## 3. Numerology Report Generation (Post-Payment)

6.  **User Returns to Numerology Input Page (Post-Payment)**:
    *   The form loads.
    *   A `useEffect` hook checks for `payment_success=true` and `hasPaid`.
    *   **Scenario A: Auto-Submission (if all required data was in session storage)**:
        *   Form data is retrieved from session storage.
        *   If all required fields for the selected service are present:
            *   The form is effectively auto-submitted.
            *   A function like `createInitialNumerologyReportPlaceholder` is called (sets report status to `submitted_for_generation`, type: `numerology`).
            *   A toast notification: "Numerology Request Received. Your report is being prepared and will be available under 'My Reading'. Redirecting to Home..."
            *   User is redirected to the Home Page (`/`).
            *   The backend/editor workflow is triggered (see Editor Flows).
    *   **Scenario B: Manual Completion & Submission**:
        *   If auto-submission doesn't occur:
            *   The form is pre-filled with data available from session storage.
            *   The submit button now reads **"Generate [Service Name] Report"**.
            *   User must complete any missing fields.
            *   User clicks "Generate [Service Name] Report".
            *   Validation checks if all required fields are complete.
            *   If valid:
                *   `createInitialNumerologyReportPlaceholder` is called.
                *   A toast notification: "Numerology Request Received. Your report is being prepared..."
                *   User is redirected to the Home Page (`/`).
                *   The backend/editor workflow is triggered.

## 4. Editor Review and AI-Assisted Report Generation (Backend/Admin Flow)

This part happens asynchronously from the user's direct interaction after submission.

7.  **Editor Notification/Workflow**:
    *   A new Numerology report request (status: `submitted_for_generation`, type: `numerology`) appears in the Editor's "Pending Reviews" queue (`/editor/workflow` or a similar specialized queue).

8.  **Editor Review (`/editor/review/[reportId]`)**:
    *   The Editor opens the Numerology report request.
    *   The Editor views:
        *   User-submitted data (Name, DOB, TOB, selected service, any other specific inputs).
    *   The Editor formulates their expert analysis and directives for the AI. This could involve:
        *   Interpreting the numerological significance of the name and birthdate.
        *   Identifying key numbers (Life Path, Destiny, Soul Urge, etc.).
        *   Providing specific points to cover for the selected service (e.g., for Business Name, focus on vibration for success, attraction; for Baby Name, focus on harmony and positive traits).
        *   Utilizing an "AI Suggestion" tool (similar to palmistry) to get preliminary insights or structuring ideas based on the raw data.
    *   The Editor inputs their analysis into an "Expert Numerology Analysis" textarea.

9.  **AI Report Generation (Guided by Editor)**:
    *   The Editor triggers a new AI flow (e.g., `generateNumerologyReport`).
    *   Inputs to this AI flow:
        *   User's Full Name, DOB, TOB.
        *   Selected Numerology Service type.
        *   Editor's "Expert Numerology Analysis" and directives.
        *   Any other specific data collected for the service.
    *   The AI model (e.g., Gemini) generates a draft report based *primarily* on the Editor's analysis, tailored to the selected numerology service.
    *   The generated draft is displayed to the Editor.

10. **Editor Finalization and Approval**:
    *   The Editor reviews the AI-generated Numerology report.
    *   The Editor can:
        *   Make direct edits to the report content.
        *   (Optionally) Request AI to refine the report based on further comments (`refineNumerologyReport` flow).
    *   Once satisfied, the Editor approves the report.
    *   The report status is updated to `approved`.
    *   The `content` field of the report is updated with the final, editor-approved numerology reading.
    *   The `lastUpdateDate` is set.

## 5. Viewing and Interacting with the Numerology Report

11. **User Navigates to "My Reading" (`/report`)**:
    *   User can access this via the menu or by directly visiting `/report`.
    *   The `ReportPage` component loads.
    *   It fetches the `currentUserReport`. The system should be able to distinguish between Palmistry and Numerology reports if they share the same data structure, or manage them separately.
    *   **If report status is `approved`**:
        *   The `ReportDisplay` component shows the Numerology report content.
        *   User sees options to:
            *   "Download as PDF".
            *   "Provide Feedback / Suggest Improvements".
            *   "Start New Reading" (clears relevant status, redirects appropriately).
    *   **If report status is `submitted_for_generation`**:
        *   A message "Numerology Report Generation Initiated" is displayed.
    *   **If report status is `generation_failed`**:
        *   A message "Numerology Report Generation Failed" is displayed, along with an error.
    *   **If report status is `pending_review`**:
        *   A message "Numerology Report Pending Expert Review" is displayed.
    *   **If no report is found for the user for that service type**:
        *   Appropriate guidance is provided.

This flow outlines the core interactions for Numerology services, designed to leverage the existing review and AI-assisted generation infrastructure.
