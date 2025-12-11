# QA Automation Task

## Scenario: WP-Create-Task

- [ ] **[UI_FLOW_CHANGE]** Navigate to the login page: https://zbio.openproject.com/projects/demo-project
- [ ] **[UI_FLOW_CHANGE]** Authenticate as 'default' user.
- [ ] **[UI_FLOW_CHANGE]** Navigate to the 'Work packages' page.
- [ ] **[UI_FLOW_CHANGE]** Create a new work package of type 'task'.
- [ ] **[FORM_FIELD_INPUT]** Set the work package name.
- [ ] **[FORM_FIELD_INPUT]** Set the work package description.
- [ ] **[UI_FLOW_CHANGE]** Save the work package.
- [ ] **[UI_FLOW_CHANGE]** Filter for the created work package by name.
- [ ] **[ASSERTION]** Verify the work package exists in the table.
