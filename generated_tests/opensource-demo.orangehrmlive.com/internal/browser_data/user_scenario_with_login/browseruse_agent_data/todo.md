# Scenario: Attempt to add a user with a non-unique username

- [ ] **[SETUP]** Navigate to the website: `https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index`
- [x] **[UI_FLOW_CHANGE]** Log in using `UI_SITE_USERNAME` and `UI_SITE_PASSWORD`.
- [x] **[UI_FLOW_CHANGE]** Navigate to the 'Admin' page.
- [x] **[UI_FLOW_CHANGE]** Navigate to the 'Add User' page.
- [x] **[FORM_FIELD_INPUT]** Fill the 'User Role' dropdown.
- [x] **[FORM_FIELD_INPUT]** Fill the 'Employee Name' field.
- [x] **[FORM_FIELD_INPUT]** Fill the 'Status' dropdown.
- [x] **[FORM_FIELD_INPUT]** Fill the 'Username' field with 'Admin'.
- [x] **[FORM_FIELD_INPUT]** Fill the 'Password' field.
- [x] **[FORM_FIELD_INPUT]** Fill the 'Confirm Password' field.
- [x] **[UI_FLOW_CHANGE]** Click the 'Save' button.
- [x] **[ASSERTION]** Verify the error message 'Username already exists' is visible.