# language: en
@critical @e2e_business_workflow @boards
Feature: Project Board Deletion
  As a project manager
  I want to delete all existing boards from a project
  So that I can clean up the project workspace and start fresh.

  Scenario: Delete all existing boards from the project list
    This scenario verifies that a user can systematically delete every board from a project,
    handling the necessary page refreshes, until the board list is empty.

    Given I am on the homepage 'https://zbio.openproject.com/projects/meeting-test-project-1764854348990'
    When I click the "Boards" link in the side navigation menu
    Then I should be on the project's "Boards" page
    And the URL should be 'https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards'
    And I should see a table containing the list of boards

    # Delete the first board (ID: 62)
    When I click the delete icon for the board with ID "62"
    # The application redirects after deletion, so we must navigate back to the list.
    And I navigate to the project's "Boards" page
    Then the board with ID "62" should no longer be displayed in the list

    # Delete the second board (ID: 63)
    When I click the delete icon for the board with ID "63"
    # The application redirects after deletion, so we must navigate back to the list.
    And I navigate to the project's "Boards" page
    Then the board with ID "63" should no longer be displayed in the list

    # Delete the final board (ID: 64)
    When I click the delete icon for the board with ID "64"
    # The application redirects after deletion, so we must navigate back to the list.
    And I navigate to the project's "Boards" page
    Then I should see a message indicating that no boards have been created
    And the board list table should not be visible