# QA Automation for OpenProject Boards

## Prequisites
- [ ] Initialize `navigation_graph.json` file.

## Scenario 1: Create basic board with a list
- [ ] **Background:**
    - [ ] [UI_FLOW_CHANGE] Navigate to the project URL: https://zbio.openproject.com/projects/demo-project
    - [ ] [UI_FLOW_CHANGE] Handle authentication if redirected to login page.
        - [ ] [FORM_FIELD_INPUT] Enter username: UI_SITE_USERNAME
        - [ ] [FORM_FIELD_INPUT] Enter password: UI_SITE_PASSWORD
        - [ ] [UI_FLOW_CHANGE] Click login button.
    - [ ] [UI_FLOW_CHANGE] Navigate to the 'Boards' section from the project page.
- [ ] **Scenario Steps:**
    - [ ] [UI_FLOW_CHANGE] Click 'Create new board' button.
    - [ ] [FORM_FIELD_INPUT] Enter board name "Automated board <uuid4>".
    - [ ] [UI_FLOW_CHANGE] Click the final 'Create' button.
    - [ ] [UI_FLOW_CHANGE] Click 'Add list' button.
    - [ ] [FORM_FIELD_INPUT] Enter list name "Automated List <rand4>".
    - [ ] [UI_FLOW_CHANGE] Save the new list.
    - [ ] [UI_FLOW_CHANGE] Return to the main Boards page.
    - [ ] [VERIFICATION] Verify the board "Automated board <uuid4>" is visible.

## Scenario 2: Create and delete a board
- [ ] **Background:**
    - [ ] [UI_FLOW_CHANGE] Ensure user is on the Boards page.
- [ ] **Scenario Steps:**
    - [ ] [UI_FLOW_CHANGE] Click 'Create new board' button.
    - [ ] [FORM_FIELD_INPUT] Enter board name "Automated board <uuid4>".
    - [ ] [UI_FLOW_CHANGE] Click the final 'Create' button.
    - [ ] [UI_FLOW_CHANGE] Return to the main Boards page.
    - [ ] [UI_FLOW_CHANGE] Find and click the delete option for "Automated board <uuid4>".
    - [ ] [UI_FLOW_CHANGE] Confirm the deletion.
    - [ ] [VERIFICATION] Verify the board "Automated board <uuid4>" is not visible.
