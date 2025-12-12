# language: en
@project-management @boards
Feature: Board Management in Demo Project
  As a Project Manager,
  I want to create, manage, and delete boards within my project,
  So that I can effectively organize tasks and maintain a clean, up-to-date workspace.

  @critical @e2e_business_workflow
  Scenario: Full board lifecycle: create with a list, then create and delete another board
    Given I am on the homepage 'https://zbio.openproject.com/projects/demo-project'
    
    # Part 1: Create the first board and add a list
    When I click the "Boards" link in the side navigation menu
    Then I should be on the "Boards" page
    When I click the "Create new board" button
    Then I should be on the "New board" page
    When I fill in the "Title*" field with "Automated board 1234"
    And I click the "Create" button
    Then I should be on the "Automated board 1234" board page
    When I click the "Add list to board" placeholder
    And I enter "Automated List 1" into the new list name field and press Enter
    Then the list "Automated List 1" should be visible on the board
    
    # Part 2: Verify the first board's creation
    When I click the "Boards" breadcrumb link
    Then I should be on the "Boards" page
    And the board named "Automated board 1234" should be present in the list
    
    # Part 3: Create a second board for deletion
    When I click the "Create new board" button
    Then I should be on the "New board" page
    When I fill in the "Title*" field with "Automated board for deletion"
    And I click the "Create" button
    Then I should be on the "Automated board for deletion" board page
    
    # Part 4: Navigate back and delete the second board
    When I click the "Boards" breadcrumb link
    Then I should be on the "Boards" page
    And the board named "Automated board for deletion" should be present in the list
    When I click the delete icon for the board named "Automated board for deletion"
    And I accept the confirmation dialog
    
    # Part 5: Final verification
    Then the board named "Automated board for deletion" should not be present in the list
    And the board named "Automated board 1234" should still be present in the list