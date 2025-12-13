# QA Automation Task

## Scenario: Create basic board with a list

- [x] **[UI_FLOW_CHANGE]** Given the user is authenticated as "default"
- [x] **[UI_FLOW_CHANGE]** And the user is on the Boards page
- [x] **[UI_FLOW_CHANGE]** When the user creates a new basic board with the name "<boardName>"
- [x] **[FORM_FIELD_INPUT]** Input board name: "Automated board <uuid4>"
- [x] **[UI_FLOW_CHANGE]** And the user adds a list with the name "<listName>"
- [x] **[FORM_FIELD_INPUT]** Input list name: "Automated List <rand4>"
- [x] **[UI_FLOW_CHANGE]** And the user returns to the Boards page
- [x] **[VERIFICATION]** Then the board named "<boardName>" is visible on the Boards page

## Scenario: Create and delete a board

- [x] **[UI_FLOW_CHANGE]** Given the user is authenticated as "default"
- [x] **[UI_FLOW_CHANGE]** And the user is on the Boards page
- [x] **[UI_FLOW_CHANGE]** When the user creates a new basic board with the name "<boardName>"
- [x] **[FORM_FIELD_INPUT]** Input board name: "Automated board <uuid4>"
- [x] **[UI_FLOW_CHANGE]** And the user returns to the Boards page
- [x] **[UI_FLOW_CHANGE]** And the user deletes the board named "<boardName>"
- [x] **[VERIFICATION]** Then the board named "<boardName>" is not visible on the Boards page

