# Gherkin Scenario Execution: Boards CRUD

## Scenario: Create and delete a board (BRD-Create-Delete)

- [ ] **Background: Given the user is authenticated as "default"** [UI_FLOW_CHANGE]
- [ ] **Background: And the user is on the Boards page** [UI_FLOW_CHANGE]
- [x] **When the user creates a new basic board with the name "<boardName>"**
  - [x] Find and click the 'Create new board' button. [UI_FLOW_CHANGE]
  - [x] Find the board name input field. [FORM_FIELD_INPUT]
  - [x] Enter the board name 'Automated board 2'.
  - [x] Click the 'Create' button. [UI_FLOW_CHANGE]
- [x] **And the user returns to the Boards page** [UI_FLOW_CHANGE]
  - [x] Find and click the 'Boards' navigation link/breadcrumb.
- [x] **And the user deletes the board named "<boardName>"**
  - [x] Find the delete button for 'Automated board 2'.
  - [x] Click the delete button.
- [x] **Then the board named "<boardName>" is not visible on the Boards page**
  - [x] Verify the text 'Automated board 2' is not visible on the page.