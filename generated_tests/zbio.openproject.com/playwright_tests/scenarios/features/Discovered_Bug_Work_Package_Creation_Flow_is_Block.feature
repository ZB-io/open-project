# language: en
@bug @critical @work-packages @creation-flow
Feature: Work Package Creation
  As a Project Manager, I want to create and manage work packages within my project
  so that I can track progress and assign tasks effectively.
  This feature file specifically addresses a critical bug that prevents the creation of new work packages.

  Background:
    Given I am on the homepage 'https://zbio.openproject.com/projects/demo-project'
    And I should see the project title "Demo Project"

  Scenario: Verify the work package creation flow is blocked after selecting the 'Task' type
    This scenario reproduces a critical bug where the user is unable to create a 'Task'
    because the application navigates to a non-functional page after type selection,
    blocking the entire creation workflow.

    When I click the "Work packages" link in the main menu
    Then I should be on the "Work packages" page
    And the page URL should contain "/work_packages"

    When I click the button with the accessible name "Create new work package"
    Then a dropdown menu with work package types should appear

    When I click the "Tasks" link from the creation dropdown
    Then the page URL should contain "?query_id=3"
    And I should see a filtered view of the work packages list
    And the form for creating a new task should not be visible
    And I am blocked from entering a new work package name or details