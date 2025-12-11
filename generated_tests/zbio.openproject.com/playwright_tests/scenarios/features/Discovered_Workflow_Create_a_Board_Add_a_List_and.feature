@e2e_business_workflow @critical @board_management
Feature: Board Management Lifecycle
  As a project manager on the OpenProject platform,
  I need to create, populate, and delete project boards
  to ensure I can effectively manage my project's tasks and workflow stages from start to finish.

  Background:
    Given I am on the homepage 'https://zbio.openproject.com/projects/demo-project'
    And I am logged in with an account that has permissions to manage boards

  @crud @smoke
  Scenario: Create a Board, Add a List, and Delete a Second Board
    # Part 1: Create the first board and add a list
    When I click on the "Boards" link in the main project menu
    Then I should be on the "Boards" page
    When I click on the "Create new board" button
    Then I should be on the "New board" creation page
    When I fill in the "Title" field with "Automated board 1"
    And I click on the "Create" button
    Then I should be on the "Automated board 1" board page
    And I should see the board title "Automated board 1"
    When I click on the "Add list to board" placeholder
    And I fill in the new list name field with "Automated List 1"
    And I press the Enter key
    Then the list "Automated List 1" should appear on the board

    # Part 2: Create a second board to be deleted
    When I click on the "Boards" link in the main project menu
    Then I should be on the "Boards" page
    When I click on the "Create new board" button
    Then I should be on the "New board" creation page
    When I fill in the "Title" field with "Automated board 2"
    And I click on the "Create" button
    Then I should be on the "Automated board 2" board page
    And I should see the board title "Automated board 2"

    # Part 3: Delete the second board and verify the outcome
    When I click on the "Boards" link in the main project menu
    Then I should be on the "Boards" page
    And I should see the board titled "Automated board 1" in the list
    And I should see the board titled "Automated board 2" in the list
    When I click the delete icon for the board "Automated board 2"
    And I confirm the deletion in the confirmation dialog
    Then the board "Automated board 2" should not be visible on the Boards page
    And the board "Automated board 1" should still be visible on the Boards page