# QA Automation for OpenProject Boards

## Scenario 1: BRD-Create - Create basic board with a list

- [ ] **Background:** Navigate to the project URL and authenticate.
  - [ ] 1.1 [UI_FLOW_CHANGE] Navigate to `https://zbio.openproject.com/projects/demo-project`.
  - [ ] 1.2 [UI_FLOW_CHANGE] Handle authentication using `UI_SITE_USERNAME` and `UI_SITE_PASSWORD`.
- [ ] **Given:** The user is on the Boards page.
  - [ ] 2.1 [UI_FLOW_CHANGE] Navigate to the "Boards" section from the project page.
- [ ] **When:** The user creates a new basic board with the name "<boardName>".
  - [ ] 3.1 [UI_FLOW_CHANGE] Click the "Create new board" or similar button.
  - [ ] 3.2 [UI_FLOW_CHANGE] Select "Basic board" type.
  - [ ] 3.3 [FORM_FIELD_INPUT] Enter the board name "Automated board 1".
  - [ ] 3.4 [UI_FLOW_CHANGE] Click the "Create" or "Save" button.
- [ ] **And:** The user adds a list with the name "<listName>".
  - [ ] 4.1 [UI_FLOW_CHANGE] Click the "Add list" or similar button.
  - [ ] 4.2 [FORM_FIELD_INPUT] Enter the list name "Automated List 1".
  - [ ] 4.3 [UI_FLOW_CHANGE] Click the "Save" or checkmark button to confirm the list name.
- [ ] **And:** The user returns to the Boards page.
  - [ ] 5.1 [UI_FLOW_CHANGE] Click the breadcrumb or navigation link to go back to the main "Boards" page.
- [ ] **Then:** The board named "<boardName>" is visible on the Boards page.
  - [ ] 6.1 [ASSERTION] Verify that the text "Automated board 1" is visible on the page.

## Scenario 2: BRD-Create-Delete - Create and delete a board

- [ ] **Background:** Navigate to the project URL and authenticate. (Should already be done).
- [ ] **Given:** The user is on the Boards page. (Should already be here).
- [ ] **When:** The user creates a new basic board with the name "<boardName>".
  - [ ] 7.1 [UI_FLOW_CHANGE] Click the "Create new board" button.
  - [ ] 7.2 [UI_FLOW_CHANGE] Select "Basic board" type.
  - [ ] 7.3 [FORM_FIELD_INPUT] Enter the board name "Automated board 2".
  - [ ] 7.4 [UI_FLOW_CHANGE] Click the "Create" or "Save" button.
- [ ] **And:** The user returns to the Boards page.
  - [ ] 8.1 [UI_FLOW_CHANGE] Click the breadcrumb or navigation link to go back to the main "Boards" page.
- [ ] **And:** The user deletes the board named "<boardName>".
  - [ ] 9.1 [UI_FLOW_CHANGE] Find the board created in step 7.
  - [ ] 9.2 [UI_FLOW_CHANGE] Click the "more" or "settings" icon for that board.
  - [ ] 9.3 [UI_FLOW_CHANGE] Click the "Delete" option.
  - [ ] 9.4 [UI_FLOW_CHANGE] Confirm the deletion.
- [ ] **Then:** The board named "<boardName>" is not visible on the Boards page.
  - [ ] 10.1 [ASSERTION] Verify that the text "Automated board 2" is NOT visible on the page.