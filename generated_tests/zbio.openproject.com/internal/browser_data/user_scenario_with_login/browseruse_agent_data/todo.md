# QA Automation Plan for OpenProject

## Scenario: WP-Create-Task

- [x] **Step 1: Navigate to the initial URL.** [UI_FLOW_CHANGE]
  - URL: https://zbio.openproject.com/projects/demo-project
  - Validation: Page title or a known element is visible.

- [x] **Step 2: Authenticate the user.** [UI_FLOW_CHANGE]
  - Action: Find and click the "Sign in" or similar link/button.
  - Action: Enter username (`harish@zb.io`) into the username/email field.
  - Action: Enter password (`zbioR00st#123`) into the password field.
  - Action: Click the "Sign in" or "Login" button.
  - Validation: Successful login is indicated by a redirect to a dashboard or the project page, and the absence of login error messages.

- [x] **Step 3: Navigate to the Work packages page.** [UI_FLOW_CHANGE]
  - Action: Find and click the "Work packages" link in the side navigation menu.
  - Validation: The URL contains "/work_packages" and the page heading is "Work packages".

- [x] **Step 4: Initiate creation of a new work package.** [UI_FLOW_CHANGE]
  - Action: Find and click the "+ Create" or similar button.
  - Action: Select "Task" from the dropdown/menu of work package types.
  - Validation: A new work package form/page is displayed for a "Task".

- [x] **Step 5: Set the work package name.** [FORM_FIELD_INPUT]
  - Action: Enter "Auto WP Test Name" into the subject/name field.
  - Validation: The text appears in the input field.

- [x] **Step 6: Set the work package description.** [FORM_FIELD_INPUT]
  - Action: Enter "Auto description for test work package." into the description field.
  - Validation: The text appears in the description area.

- [x] **Step 7: Save the work package.** [UI_FLOW_CHANGE]
  - Action: Find and click the "Save" or "Create" button.
  - Validation: The page redirects to the newly created work package view, or back to the list with a success message.

- [x] **Step 8: Filter for the new work package.** [FORM_FIELD_INPUT]
  - Action: Navigate back to the work packages list if not already there.
  - Action: Find the filter/search input field.
  - Action: Enter "Auto WP Test Name" into the filter field.
  - Validation: The work package list is updated to show only the matching item.

- [ ] **Step 9: Verify the work package exists.** [ASSERTION] - FAILED
  - Action: Check the work packages table for a row containing "Auto WP Test Name".
  - Validation: The row is found.
