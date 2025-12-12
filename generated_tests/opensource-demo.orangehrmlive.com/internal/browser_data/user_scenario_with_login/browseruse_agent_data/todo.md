# Scenario: Attempt to add a user with a non-unique username

- [ ] Navigate to the login page: https://opensource-demo.orangehrmlive.com/
- [ ] [FORM_FIELD_INPUT] Enter username 'Admin'.
- [ ] [FORM_FIELD_INPUT] Enter password 'admin123'.
- [x] [UI_FLOW_CHANGE] Click the 'Login' button.
- [ ] [UI_FLOW_CHANGE] Navigate to the 'Admin' page from the side menu.
- [ ] [UI_FLOW_CHANGE] Click the 'Add' button to go to the 'Add User' page.
- [x] [FORM_FIELD_INPUT] Select 'Admin' for 'User Role'.
- [x] [FORM_FIELD_INPUT] Enter an employee name in the 'Employee Name' field.
- [x] [FORM_FIELD_INPUT] Select 'Enabled' for 'Status'.
- [x] [FORM_FIELD_INPUT] Enter 'Admin' in the 'Username' field.
- [x] [FORM_FIELD_INPUT] Enter a password in the 'Password' field.
- [x] [FORM_FIELD_INPUT] Enter the same password in the 'Confirm Password' field.
- [x] [UI_FLOW_CHANGE] Click the 'Save' button.
- [x] [ASSERTION] Verify the error message 'Username already exists' is displayed.
