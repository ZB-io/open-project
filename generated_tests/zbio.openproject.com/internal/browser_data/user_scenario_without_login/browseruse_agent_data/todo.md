# QA Automation Task: OpenProject Boards

## Scenario 1: Create basic board with a list

- [ ] **Navigate to Boards Page:** [UI_FLOW_CHANGE] - Go to the Boards page for the 'demo-project'.
- [ ] **Create New Board:** [UI_FLOW_CHANGE] - Click the button to create a new board.
- [ ] **Select Basic Board:** [UI_FLOW_CHANGE] - Choose the 'basic board' type.
- [ ] **Enter Board Name:** [FORM_FIELD_INPUT] - Input the name 'Automated board <uuid4>'.
- [ ] **Submit Board Creation:** [UI_FLOW_CHANGE] - Click the create/submit button.
- [ ] **Add List:** [FORM_FIELD_INPUT] - Add a new list with the name 'Automated List <rand4>'.
- [ ] **Return to Boards Page:** [UI_FLOW_CHANGE] - Navigate back to the main Boards page.
- [ ] **Verify Board Visibility:** [ASSERTION] - Confirm that the board named 'Automated board <uuid4>' is visible.

## Scenario 2: Create and delete a board

- [ ] **Navigate to Boards Page:** [UI_FLOW_CHANGE] - Go to the Boards page for the 'demo-project'.
- [ ] **Create New Board:** [UI_FLOW_CHANGE] - Click the button to create a new board.
- [ ] **Select Basic Board:** [UI_FLOW_CHANGE] - Choose the 'basic board' type.
- [ ] **Enter Board Name:** [FORM_FIELD_INPUT] - Input the name 'Automated board <uuid4>'.
- [ ] **Submit Board Creation:** [UI_FLOW_CHANGE] - Click the create/submit button.
- [ ] **Return to Boards Page:** [UI_FLOW_CHANGE] - Navigate back to the main Boards page.
- [ ] **Delete Board:** [UI_FLOW_CHANGE] - Find and delete the board named 'Automated board <uuid4>'.
- [ ] **Verify Board Deletion:** [ASSERTION] - Confirm that the board named 'Automated board <uuid4>' is no longer visible.
