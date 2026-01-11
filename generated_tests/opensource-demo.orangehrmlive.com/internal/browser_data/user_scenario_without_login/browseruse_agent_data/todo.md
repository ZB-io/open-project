# QA Automation Plan: Add User with Non-Unique Username

- [x] **Step 1: Navigate and Login.** Navigate to the login page and log in with default credentials ('Admin', 'admin123'). [UI_FLOW_CHANGE]
- [x] **Step 2: Navigate to 'Add User' page.** Click through Admin -> User Management -> Users -> Add. [UI_FLOW_CHANGE]
- [x] **Step 3: Fill User Role.** Select 'Admin' from the User Role dropdown. [FORM_FIELD_INPUT]
- [x] **Step 4: Fill Employee Name.** Enter an existing employee name. [FORM_FIELD_INPUT]
- [x] **Step 5: Fill Status.** Select 'Enabled' from the Status dropdown. [FORM_FIELD_INPUT]
- [x] **Step 6: Fill Username.** Enter 'Admin' into the username field. [FORM_FIELD_INPUT]
- [x] **Step 7: Fill Password.** Enter a password. [FORM_FIELD_INPUT]
- [x] **Step 8: Confirm Password.** Re-enter the password. [FORM_FIELD_INPUT]
- [x] **Step 9: Click 'Save' button.** Submit the form. [UI_FLOW_CHANGE]
- [x] **Step 10: Verify error message.** Check for 'Username already exists' message. [VERIFICATION]
