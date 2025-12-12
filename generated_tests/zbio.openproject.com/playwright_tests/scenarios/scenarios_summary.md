# Generated Test Scenarios Summary

## Overview

- **Total Scenarios**: 2
- **Application Base URL**: https://zbio.openproject.com/projects/demo-project
- **Generated On**: 2025-12-12 15:03:31

## Scenarios

### 1. Discovered Workflow: Full Board Lifecycle - Create with List, then Create and Delete
_This end-to-end scenario validates the complete lifecycle of boards. It starts by creating a board, adding a list to it, and verifying its creation. It then proceeds to create a second board and immediately delete it, verifying its removal. This covers the core CRUD (Create, Read, Delete) operations for the Boards feature._

**Complexity**: high | **Priority**: high | **Risk Level**: high
**Tags**: e2e, board-management, crud, form-submission, navigation, list-creation
**Est. Execution Time**: 70 seconds | **Flakiness Potential**: medium

**Type**: e2e_business_workflow
**Pages Involved:**
- https://zbio.openproject.com/projects/demo-project
- https://zbio.openproject.com/projects/demo-project/boards/
- https://zbio.openproject.com/projects/demo-project/boards/new
- https://zbio.openproject.com/projects/demo-project/boards/109
- https://zbio.openproject.com/projects/demo-project/boards/110

#### Steps:
- Navigate to the project's main dashboard page.
- Navigate to the Boards section from the project's side navigation menu.
- Click the 'Create new board' button to initiate the board creation workflow.
- Enter the name 'Automated board 1234' into the title field for the new board.
- Click the 'Create' button to finalize the creation of the new board.
- Click the 'Add list to board' placeholder to create a new list within the board.
- Enter the name 'Automated List <rand4>' for the new list and press Enter to save it.
- Click the 'Boards' breadcrumb link to navigate back to the main boards list.
- Verify that the newly created board 'Automated board 1234' is present in the list of boards.
- Click the 'Create new board' button again to create a second board for the deletion test.
- Enter the name 'Automated board for deletion' into the title field.
- Click the 'Create' button to finalize the creation of the second board.
- Return to the main boards list page to perform the deletion.
- Locate the board named 'Automated board for deletion' and click its delete icon.
- Verify that the board 'Automated board for deletion' is no longer visible on the boards list page.

#### Expected Results:
- User successfully creates a board and adds a list to it.
- The first created board is visible on the main boards page.
- User successfully creates a second board.
- User successfully deletes the second board.
- The second board is no longer visible on the main boards page.

---
### 2. User Authentication - Successful Login
_Validates the standard user login process by entering correct credentials and verifying successful redirection to the application's homepage._

**Complexity**: low | **Priority**: high | **Risk Level**: medium
**Tags**: authentication, login, form-submission, happy-path
**Est. Execution Time**: 20 seconds | **Flakiness Potential**: low

**Type**: e2e_authentication_workflow
**Pages Involved:**
- https://zbio.openproject.com/login
- https://zbio.openproject.com/

#### Steps:
- Navigate to the OpenProject login page.
- Enter the username into the username field.
- Enter the password into the password field.
- Click the 'Sign in' button to submit credentials.
- Verify successful login by checking the URL has changed to the homepage.

#### Expected Results:
- User is able to enter username and password into the respective fields.
- Upon submitting valid credentials, the user is successfully authenticated.
- The user is redirected to the application homepage after a successful login.

---