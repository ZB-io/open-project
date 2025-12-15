# QA Automation Task: OpenProject Boards

## Scenario: BRD-Create-Delete - Create and delete a board

- [x] **Step 1: Authenticate the user** [UI_FLOW_CHANGE]
  - [ ] Navigate to the login page (if not already there).
  - [ ] Input username (harish@zb.io).
  - [ ] Input password (zbioR00st#123).
  - [ ] Click the sign-in button.
- [x] **Step 2: Navigate to the Boards page** [UI_FLOW_CHANGE]
  - [ ] After login, find and click the "Boards" link in the project menu.
- [x] **Step 3: Create a new basic board** [UI_FLOW_CHANGE]
  - [ ] Find and click the "Create" or "New board" button.
  - [ ] Select the "Basic board" type.
  - [ ] Enter the board name: "Automated board <uuid4>".
  - [ ] Click the "Create" or "Save" button.
- [ ] **Step 4: Return to the Boards page** [UI_FLOW_CHANGE]
  - [ ] Find and click the breadcrumb or link to return to the main Boards view.
- [ ] **Step 5: Delete the board** [UI_FLOW_CHANGE]
  - [ ] Find the board named "Automated board <uuid4>".
  - [ ] Click the delete icon next to the board name.
  - [ ] Confirm the deletion.
- [ ] **Step 6: Verify board deletion** [VERIFICATION]
  - [ ] Scan the page to confirm the board named "Automated board <uuid4>" is no longer visible.