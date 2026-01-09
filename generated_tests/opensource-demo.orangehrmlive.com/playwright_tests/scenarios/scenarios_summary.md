# Generated Test Scenarios Summary

## Overview

- **Total Scenarios**: 1
- **Application Base URL**: https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
- **Generated On**: 2026-01-09 12:24:45

## Scenarios

### 1. Attempt to Add a User with a Non-Unique Username
_This scenario tests the form validation on the 'Add User' page. It verifies that the system prevents the creation of a new user if the chosen username already exists, as per the user-provided test case._

**Complexity**: high | **Priority**: high | **Risk Level**: high
**Tags**: user-management, form-submission, validation, authentication, admin-panel, e2e
**Est. Execution Time**: 75 seconds | **Flakiness Potential**: low

**Type**: End-to-End (E2E)
**Pages Involved:**
- https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
- https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers
- https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser

#### Steps:
- Load the OrangeHRM login page to begin the test.
- Enter the administrator's username to log in.
- Enter the administrator's password to log in.
- Click the 'Login' button to submit credentials and access the dashboard.
- Click on the 'Admin' menu item to navigate to the user management section.
- Click the 'Add' button to open the form for creating a new system user.
- Click the 'User Role' dropdown to reveal the list of available roles.
- Select 'Admin' from the list of user roles.
- Enter an employee name to associate with the new user account.
- Click the 'Status' dropdown to reveal account status options.
- Select 'Enabled' from the status dropdown to make the account active upon creation.
- Enter 'Admin' into the username field, which is a known existing username.
- Enter a valid password for the new user.
- Confirm the password to ensure it was typed correctly.
- Click the 'Save' button to attempt to submit the new user form.
- Verify that the form submission was blocked and the user remains on the 'Add User' page, confirming an error message was displayed.

#### Expected Results:
- The user should be prevented from saving the new user form.
- An error message indicating 'Username already exists' should be displayed.
- The user should remain on the 'Add User' page to correct the error.
- No new user account should be created in the system.

---