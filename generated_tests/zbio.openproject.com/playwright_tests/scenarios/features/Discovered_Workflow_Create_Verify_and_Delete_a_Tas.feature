@critical @e2e @work-package-management
Feature: Work Package Lifecycle Management
  As a project team member
  I want to create, view, and delete work packages
  So that I can effectively manage project tasks and scope.

  Scenario: Create, Verify, and Delete a 'Task' Work Package
    This end-to-end scenario validates the complete lifecycle of a 'Task' work package.
    It covers creating a new task, verifying its creation on the details page,
    and then successfully deleting it.

    Given I am on the homepage 'https://zbio.openproject.com/projects/demo-project'
    When I click the "Work packages" link in the main menu
    Then I should be on the "Work packages" page

    # Create a new Task
    When I click the "Create" button to open the work package type menu
    And I select "Task" from the creation dropdown menu
    Then I should be on the new "Task" creation page
    When I fill in the "Subject" field with "Automated Test Task - E2E Lifecycle"
    And I fill in the description with "This is a detailed description for the automated E2E test."
    And I click the "Save" button
    Then I should be on the details page for the new work package
    And the page should display the subject "Automated Test Task - E2E Lifecycle"

    # Delete the Task from its details page
    When I click the "More" actions button on the work package details page
    And I select the "Delete" option from the menu
    Then a deletion confirmation dialog should appear
    When I click the "Delete" button in the confirmation dialog
    Then I should be redirected to the "Work packages" list page
    And a success message "Successful deletion." should be displayed
    And the work package with subject "Automated Test Task - E2E Lifecycle" should not be present in the list