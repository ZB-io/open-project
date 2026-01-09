# Gherkin Scenario Execution: Attempt to add a user with a non-unique username

- [ ] **Background: Log in and navigate to the 'Add User' page.**
  - [ ] Navigate to the login page: `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login` [UI_FLOW_CHANGE]
  - [ ] Input username 'Admin' [FORM_FIELD_INPUT]
  - [ ] Input password 'admin123' [FORM_FIELD_INPUT]
  - [ ] Click 'Login' button [UI_FLOW_CHANGE]
  - [ ] Click 'Admin' menu item [UI_FLOW_CHANGE]
  - [ ] Click 'Add' button [UI_FLOW_CHANGE]
- [ ] **When: I fill the new user form with username 'Admin'.**
  - [ ] Select 'Admin' for 'User Role' [FORM_FIELD_INPUT]
  - [ ] Input an employee name in 'Employee Name' field [FORM_FIELD_INPUT]
  - [ ] Select 'Enabled' for 'Status' [FORM_FIELD_INPUT]
  - [ ] Input 'Admin' for 'Username' [FORM_FIELD_INPUT]
  - [ ] Input a password [FORM_FIELD_INPUT]
  - [ ] Confirm the password [FORM_FIELD_INPUT]
- [ ] **And: I click the 'Save' button.**
  - [ ] Click 'Save' button [UI_FLOW_CHANGE]
- [ ] **Then: I should see an error message 'Username already exists'.**
  - [ ] Verify error message 'Username already exists' is visible [VERIFICATION]
