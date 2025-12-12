# QA Automation for OpenProject Boards

## Scenario 1: BRD-Create - Create basic board with a list

- [ ] **Background:** Navigate to the project URL: https://zbio.openproject.com/projects/demo-project
- [x] **Background:** Authenticate as "default" user. [UI_FLOW_CHANGE]
- [x] **Background:** Navigate to the Boards page. [UI_FLOW_CHANGE]
- [x] **When:** Create a new basic board with the name "Automated board 1". [UI_FLOW_CHANGE]
- [x] **And:** Add a list with the name "Automated List 1". [FORM_FIELD_INPUT]
- [x] **And:** Return to the Boards page. [UI_FLOW_CHANGE]
- [x] **Then:** Verify the board named "Automated board 1" is visible. [ASSERTION]

## Scenario 2: BRD-Create-Delete - Create and delete a board

- [x] **When:** Create a new basic board with the name "Automated board 2". [UI_FLOW_CHANGE]
- [x] **And:** Return to the Boards page. [UI_FLOW_CHANGE]
- [x] **And:** Delete the board named "Automated board 2". [UI_FLOW_CHANGE]
- [x] **Then:** Verify the board named "Automated board 2" is not visible. [ASSERTION]
