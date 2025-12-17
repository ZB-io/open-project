# QA Automation for OrangeHRM

## Scenario: Attempt to add a user with a non-unique username

- [ ] **[SETUP]** Navigate to the login page.
- [x] **[SETUP]** Log in with provided credentials.
- [ ] **[SCENARIO_STEP]** Navigate to the 'Add User' page.
- [ ] **[SCENARIO_STEP]** Fill the new user form with necessary details and username 'Admin'.
- [ ] **[SCENARIO_STEP]** Click the 'Save' button.
- [x] **[SCENARIO_STEP]** Verify the error message 'Username already exists' is displayed.
- [x] **[COMPLETE]** Finalize the test and report the result.