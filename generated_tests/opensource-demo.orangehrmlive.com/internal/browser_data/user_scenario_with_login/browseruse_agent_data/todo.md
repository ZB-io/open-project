# Scenario: Attempt to add a user with a non-unique username

- [ ] **[UI_FLOW_CHANGE]** Navigate to the login page: https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
- [x] **[FORM_FIELD_INPUT]** Enter username using UI_SITE_USERNAME.
- [x] **[FORM_FIELD_INPUT]** Enter password using UI_SITE_PASSWORD.
- [x] **[UI_FLOW_CHANGE]** Click the 'Login' button.
- [ ] **[ASSERTION]** Verify successful login by checking for the dashboard.
- [x] **[UI_FLOW_CHANGE]** Navigate to the 'Admin' section from the side menu.
- [x] **[UI_FLOW_CHANGE]** Click the 'Add' button to go to the 'Add User' page.
- [ ] **[ASSERTION]** Verify we are on the 'Add User' page.
- [x] **[FORM_FIELD_INPUT]** Fill the 'User Role' dropdown.
- [x] **[FORM_FIELD_INPUT]** Fill the 'Status' dropdown.
- [x] **[FORM_FIELD_INPUT]** Fill the 'Employee Name' field.
- [x] **[FORM_FIELD_INPUT]** Fill the 'Username' field with 'Admin'.
- [x] **[FORM_FIELD_INPUT]** Fill the 'Password' field.
- [x] **[FORM_FIELD_INPUT]** Fill the 'Confirm Password' field.
- [x] **[UI_FLOW_CHANGE]** Click the 'Save' button.
- [x] **[ASSERTION]** Verify that the error message 'Username already exists' is visible.
