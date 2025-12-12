# QA Automation Task: OpenProject Boards

## Scenario 1: Create basic board with a list

- [ ] **Background Step 1: Authenticate**
  - [ ] Navigate to the login page. [UI_FLOW_CHANGE]
  - [ ] Enter username. [FORM_FIELD_INPUT]
  - [ ] Enter password. [FORM_FIELD_INPUT]
  - [ ] Click the sign-in button. [UI_FLOW_CHANGE]
- [ ] **Background Step 2: Navigate to Boards**
  - [ ] Find and click the 'Boards' link in the project navigation. [UI_FLOW_CHANGE]
- [ ] **Scenario Step 1: Create Board**
  - [ ] Click the '+ Board' or 'Create new board' button. [UI_FLOW_CHANGE]
  - [ ] Select the 'Basic board' type. [UI_FLOW_CHANGE]
  - [ ] Enter the board name 'Automated board <uuid4>'. [FORM_FIELD_INPUT]
  - [ ] Click the 'Create' button. [UI_FLOW_CHANGE]
- [ ] **Scenario Step 2: Add List**
  - [ ] Find and click the 'Add list' button/input. [UI_FLOW_CHANGE]
  - [ ] Enter the list name 'Automated List <rand4>'. [FORM_FIELD_INPUT]
  - [ ] Save the new list. [UI_FLOW_CHANGE]
- [ ] **Scenario Step 3: Return to Boards Page**
  - [ ] Click the 'Boards' breadcrumb or navigation link to return to the main boards view. [UI_FLOW_CHANGE]
- [ ] **Scenario Step 4: Verify Board Creation**
  - [ ] Verify the board with the name 'Automated board <uuid4>' is visible on the page. [ASSERTION]

## Scenario 2: Create and delete a board

- [ ] **Background Step 1: Authenticate** (Should already be done)
- [ ] **Background Step 2: Navigate to Boards** (Should already be on this page)
- [ ] **Scenario Step 1: Create Board**
  - [ ] Click the '+ Board' or 'Create new board' button. [UI_FLOW_CHANGE]
  - [ ] Select the 'Basic board' type. [UI_FLOW_CHANGE]
  - [ ] Enter the board name 'Automated board <uuid4>'. [FORM_FIELD_INPUT]
  - [ ] Click the 'Create' button. [UI_FLOW_CHANGE]
- [ ] **Scenario Step 2: Return to Boards Page**
  - [ ] Click the 'Boards' breadcrumb or navigation link to return to the main boards view. [UI_FLOW_CHANGE]
- [ ] **Scenario Step 3: Delete Board**
  - [ ] Find the board named 'Automated board <uuid4>'.
  - [ ] Click the settings/more options icon for that board. [UI_FLOW_CHANGE]
  - [ ] Click the 'Delete' option. [UI_FLOW_CHANGE]
  - [ ] Confirm the deletion. [UI_FLOW_CHANGE]
- [ ] **Scenario Step 4: Verify Board Deletion**
  - [ ] Verify the board with the name 'Automated board <uuid4>' is no longer visible on the page. [ASSERTION]
