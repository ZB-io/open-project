# QA Automation for OrangeHRM Demo - Add Non-Unique User

## Scenario: Attempt to add a user with a non-unique username

- [ ] **Step 1: Navigate to the site and Login** [UI_FLOW_CHANGE]
    - Navigate to `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`.
    - Enter `UI_SITE_USERNAME` into the username field.
    - Enter `UI_SITE_PASSWORD` into the password field.
    - Click the 'Login' button.
    - Verify successful login by checking for the dashboard page.

- [ ] **Step 2: Navigate to the 'Add User' page** [UI_FLOW_CHANGE]
    - Find and click the 'Admin' menu item.
    - Find and click the 'Add' button on the User Management page.
    - Verify we are on the 'Add User' page.

- [x] **Step 3: Fill the new user form with a non-unique username** [FORM_FIELD_INPUT]
    - Select 'Admin' for 'User Role'.
    - Enter a value for 'Employee Name' (e.g., 'Peter Mac Anderson').
    - Select 'Enabled' for 'Status'.
    - Enter 'Admin' for 'Username'.
    - Enter a password (e.g., 'TestPassword123!').
    - Confirm the password.

- [x] **Step 4: Click the 'Save' button** [UI_FLOW_CHANGE]
    - Locate and click the 'Save' button.

- [x] **Step 5: Verify the error message** [ASSERTION]
    - Wait for the page to respond.
    - Look for the error message 'Username already exists'.
    - If the message is found, the test is successful.
