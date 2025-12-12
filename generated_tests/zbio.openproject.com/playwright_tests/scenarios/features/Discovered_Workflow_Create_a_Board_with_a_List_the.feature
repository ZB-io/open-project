@critical @e2e_business_workflow @board-management
Feature: Board Management Lifecycle
  As a project manager
  I want to create, modify, and delete project boards
  So that I can maintain an organized and relevant workspace

  Scenario: Create a Board with a List, then Create and Delete a Second Board
    Given I am on the homepage 'https://zbio.openproject.com/projects/demo-project'
    When I click the "Boards" link in the main menu
    Then I should be on the "Boards" page

    # Create the first board
    When I click the "Create new board" button
    Then I should be on the "New board" creation page
    When I fill in the "Title" field with "Automated board 1"
    And I click the "Create" button
    Then I should be on the "Automated board 1" board page

    # Add a list to the first board
    When I click the "Add list to board" button
    And I fill in the new list name field with "Automated List 1"
    And I press the "Enter" key
    Then the list "Automated List 1" should be visible on the board

    # Navigate back and verify the first board's existence
    When I click the "Boards" breadcrumb link
    Then I should be on the "Boards" page
    And the board named "Automated board 1" should be visible in the list

    # Create the second board (for deletion)
    When I click the "Create new board" button
    Then I should be on the "New board" creation page
    When I fill in the "Title" field with "Automated board 2"
    And I click the "Create" button
    Then I should be on the "Automated board 2" board page

    # Navigate back and verify both boards exist before deletion
    When I click the "Boards" breadcrumb link
    Then I should be on the "Boards" page
    And the board named "Automated board 1" should be visible in the list
    And the board named "Automated board 2" should be visible in the list

    # Delete the second board and verify its removal
    When I click the delete icon for the board named "Automated board 2"
    Then the board named "Automated board 2" should not be visible in the list
    And the board named "Automated board 1" should still be visible in the list