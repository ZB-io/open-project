# QA Automation Task: Delete All Boards

## Gherkin Scenario Plan:

### Background
- [x] **[UI_FLOW_CHANGE]** Navigate to the initial URL: https://zbio.openproject.com/projects/meeting-test-project-1764854348990
- [x] **[UI_FLOW_CHANGE]** Authenticate as 'default' user. (Assuming current user is 'default')
  - [ ] Enter username using UI_SITE_USERNAME.
  - [ ] Enter password using UI_SITE_PASSWORD.
  - [ ] Click the sign-in button.
- [x] **[UI_FLOW_CHANGE]** Navigate to the Boards page.

### Scenario: Delete all boards
- [x] **[UI_FLOW_CHANGE]** Delete all boards in the table.
  - This may involve looping through multiple elements and clicking a delete option for each, including handling confirmation dialogs.
- [x] **[VERIFICATION]** Verify that no boards are visible on the Boards page.
  - Check for an empty state message or an empty table.
