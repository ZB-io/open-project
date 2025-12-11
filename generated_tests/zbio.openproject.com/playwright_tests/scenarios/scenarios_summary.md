# Generated Test Scenarios Summary

## Overview

- **Total Scenarios**: 2
- **Application Base URL**: https://zbio.openproject.com/projects/demo-project
- **Generated On**: 2025-12-11 10:24:44

## Scenarios

### 1. Create, Verify, and Delete a 'Task' Work Package
_This end-to-end scenario validates the complete lifecycle of a 'Task' work package. It follows the exact path discovered by the agent: creating a new task with a subject and description, verifying its creation by filtering the list, and then successfully deleting it through the details view._

**Complexity**: high | **Priority**: high | **Risk Level**: high
**Tags**: e2e, work-package, crud, form-submission, deletion
**Est. Execution Time**: 50 seconds | **Flakiness Potential**: medium

**Type**: End-to-End
**Pages Involved:**
- https://zbio.openproject.com/projects/demo-project
- https://zbio.openproject.com/projects/demo-project/work_packages
- https://zbio.openproject.com/projects/demo-project/work_packages/create_new?type=1
- https://zbio.openproject.com/projects/demo-project/work_packages/details/{id}/overview

#### Steps:
- Navigate to the project's main dashboard page.
- Navigate to the 'Work packages' section from the side menu.
- Click the 'Create' button to initiate the creation of a new work package.
- Select 'Task' from the creation dropdown menu.
- Enter the subject line for the new task.
- Enter a detailed description for the new task in the rich text editor.
- Click the 'Save' button to create the new task work package.
- Filter the work package list by the new task's name to verify its creation.
- Click the 'More' actions button in the task details view.
- Select the 'Delete' option from the 'More' actions menu.
- Confirm the action by clicking the 'Delete' button in the confirmation dialog.

#### Expected Results:
- A new 'Task' work package is created successfully with the specified subject and description.
- The newly created task is visible and searchable in the work packages list.
- The task is successfully deleted and removed from the work packages list.

---
### 2. Successful User Authentication
_This scenario validates the standard user login process by navigating to the login page, entering valid credentials, and verifying successful redirection to the application's main page._

**Complexity**: low | **Priority**: high | **Risk Level**: medium
**Tags**: authentication, login, form-submission, happy-path
**Est. Execution Time**: 23 seconds | **Flakiness Potential**: medium

**Type**: Authentication
**Pages Involved:**
- https://zbio.openproject.com/login
- https://zbio.openproject.com/

#### Steps:
- Navigate to the OpenProject login page.
- Enter a valid username into the username field.
- Enter a valid password into the password field.
- Click the 'Sign in' button to submit credentials.
- Verify successful login by checking for navigation to the main application page.

#### Expected Results:
- The user's credentials are submitted successfully.
- The user is redirected to the main application dashboard upon successful authentication.

---