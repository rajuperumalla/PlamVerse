# PalmVerse User Process Flow

This document outlines the typical user journey through the PalmVerse application.

## 1. Landing and Authentication

1.  **User Visits Home Page (`/`)**:
    *   Sees a prominent Hero Banner ("Unlock the Secrets of Your Palm").
    *   Below the banner, `AuthOptions` component is displayed for Login/Registration alongside a "Spiritual Products Showcase".
    *   User interacts with `AuthOptions`.

2.  **Authentication Process**:
    *   **Option A: Mobile Login/Register**:
        *   User selects "Login with Mobile" or "Create New Account".
        *   Enters mobile number.
        *   Clicks "Send OTP" (or "Register & Send OTP").
        *   (Simulated) OTP is "sent" (e.g., `123456`). A toast confirms this.
        *   User enters the OTP.
        *   Clicks "Verify OTP & Continue" (or "Verify OTP & Register").
    *   **Option B: Google Login**:
        *   User clicks "Continue with Google".
        *   (Simulated) Google login process occurs.
    *   **Outcome**:
        *   `isAuthenticated` and `userName` are set in the application context.
        *   Appropriate role (`isEditor`, `isAdmin`) is set if special credentials are used.
        *   User is redirected to the Palm Input Page (`/palm-input`).

## 2. Palm Details Input & Payment

3.  **User on Palm Input Page (`/palm-input`)**:
    *   Sees a navigation menu: "Home", "Palmistry", "My Reading", "Products", "Remedies".
    *   The `PalmInputForm` is displayed below the menu.
    *   User fills in their details:
        *   Uploads Left Palm Image.
        *   Uploads Right Palm Image.
        *   Enters Date of Birth.
        *   Enters Place of Birth.
        *   (Optional) Enters Time of Birth.
        *   Selects Dominant Hand.
        *   Selects Reading Category.
    *   User clicks the **"Proceed to Payment"** button.

4.  **Pre-Payment Data Handling**:
    *   The current form data (including image previews as data URIs) is saved to **session storage**.
    *   User is redirected to the Payment Page (`/payment`).

5.  **User on Payment Page (`/payment`)**:
    *   Sees simulated payment details (e.g., $9.99).
    *   User clicks the **"Simulate Successful Payment"** button.
    *   `hasPaid` is set to `true` in the application context.
    *   User is redirected back to Palm Input Page (`/palm-input?payment_success=true`).

## 3. Report Generation (Post-Payment)

6.  **User Returns to Palm Input Page (Post-Payment)**:
    *   The `PalmInputForm` loads.
    *   A `useEffect` hook checks for `payment_success=true` and `hasPaid`.
    *   **Scenario A: Auto-Submission (if all required data was in session storage)**:
        *   Form data (including image data URIs) is retrieved from session storage.
        *   If all required fields are present:
            *   The form is effectively auto-submitted.
            *   `createInitialReportPlaceholder` is called (sets report status to `submitted_for_generation`).
            *   `generatePalmReading` AI flow is invoked (simulated).
                *   **On Success**: `updateReportWithGeneratedContent` is called. Report status becomes `approved` with (dummy) content.
                *   **On Failure**: `markReportAsGenerationFailed` is called. Report status becomes `generation_failed` with an error message.
            *   A toast notification appears: "Request Received. Your report is being prepared and will be available under 'My Reading'. Redirecting to Home..."
            *   User is redirected to the Home Page (`/`).
    *   **Scenario B: Manual Completion & Submission**:
        *   If auto-submission doesn't occur (e.g., images were not uploaded before payment, or session data was incomplete):
            *   The form is pre-filled with data available from session storage.
            *   The submit button now reads **"Generate Palm Reading"**.
            *   User must complete any missing fields (especially uploading palm images if not done previously).
            *   User clicks "Generate Palm Reading".
            *   Validation checks if all required fields (including images) are now complete.
            *   If valid:
                *   `createInitialReportPlaceholder` is called (status: `submitted_for_generation`).
                *   `generatePalmReading` AI flow is invoked (simulated).
                    *   **On Success**: `updateReportWithGeneratedContent` is called. Report status becomes `approved` with (dummy) content.
                    *   **On Failure**: `markReportAsGenerationFailed` is called. Report status becomes `generation_failed` with an error message.
                *   A toast notification appears: "Request Received. Your report is being prepared and will be available under 'My Reading'. Redirecting to Home..."
                *   User is redirected to the Home Page (`/`).

## 4. Viewing and Interacting with the Report

7.  **User Navigates to "My Reading" (`/report`)**:
    *   User can access this via the menu on the `/palm-input` page or by directly visiting `/report`.
    *   The `ReportPage` component loads.
    *   It fetches the `currentUserReport` based on `userName` and report status priority (`submitted_for_generation` > `generation_failed` > `pending_review` > `approved`).
    *   **If report status is `approved`**:
        *   The `ReportDisplay` component shows the (dummy) report content.
        *   User sees options to:
            *   "Download as PDF".
            *   "Provide Feedback / Suggest Improvements".
            *   "Start New Reading" (clears payment status, current user's report data, and redirects to `/palm-input`).
    *   **If report status is `submitted_for_generation`**:
        *   A message "Report Generation Initiated" is displayed.
    *   **If report status is `generation_failed`**:
        *   A message "Report Generation Failed" is displayed, along with the error.
    *   **If report status is `pending_review`** (Note: current flow sets directly to `approved` post-generation):
        *   A message "Report Pending Expert Review" would be displayed.
    *   **If no report is found for the user**:
        *   A message "No Report Journey Started Yet" is displayed with a button to "Start Your Palm Reading".

## 5. Admin/Editor Flows (Separate)

*   **Login**:
    *   Users with "editor" or "admin" credentials log in via `AuthOptions` on the Home Page (`/`).
    *   They are redirected to their respective dashboards (`/editor` or `/admin`).
*   **Functionality**:
    *   **Editor (`/editor`)**:
        *   Views dashboard with report statistics.
        *   Accesses "Pending Reviews" workflow (`/editor/workflow`).
        *   Reviews individual reports (`/editor/review/[reportId]`), provides expert analysis, uses AI suggestions, and approves reports.
        *   Views "Approved Reports" (`/editor/approved`).
    *   **Admin (`/admin`)**: (Focus on Ecommerce aspects)
        *   Views dashboard with Ecommerce overview.
        *   Navigates through various Ecommerce management sections (Products, Categories, Orders, Site Info, Settings, Subscribers, Customers) via a nested sidebar menu.
        *   Most Ecommerce sections are currently placeholders indicating future development.
        *   The "Palm Reading Report Workflow" (previously under Admin) is now primarily handled by the "Editor" role. The `/admin/workflow` and `/admin/approved` and `/admin/review/[reportId]` pages are still present but the primary access point from the UI is through the Editor panel.
        
This flow covers the main interactions for a regular user and touches upon the specialized flows for Editors and Admins.
