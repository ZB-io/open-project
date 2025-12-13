@e2e_business_workflow @critical @boards @crud
Feature: Project Board Management Lifecycle
  As a project manager,
  I want to create, populate, and delete project boards
  So that I can maintain an organized and up-to-date project overview.

  @TC-001
  Scenario: Full Board Lifecycle: Create, Add List, Create Second Board, and Delete
    This scenario validates the complete lifecycle of project boards, including creation, adding a list, and deletion, ensuring core CRUD operations are stable.

    Given I am on the homepage 'https://zbio.openproject.com/projects/demo-project'
    
    # Part 1: Navigate and Create the First Board
    When I click the "Boards" link in the side menu
    Then I should be on the "Boards" page
    When I click the "Create new board" button
    Then I should be on the "New board" creation page
    When I fill in the "Title" field with "My First Automated Board"
    And I click the "Create" button
    Then I should be on the page for the board titled "My First Automated Board"
    And the board title "My First Automated Board" should be visible
    
    # Part 2: Add a List to the First Board
    When I click the "Add list to board" button
    And I fill in the new list name with "To Do"
    And I press Enter to save the list name
    Then I should see a list titled "To Do" on the board
    
    # Part 3: Navigate Back and Create a Second Board (for deletion)
    When I click the "Boards" breadcrumb link
    Then I should be on the "Boards" page
    And I should see "My First Automated Board" in the list of boards
    When I click the "Create new board" button
    Then I should be on the "New board" creation page
    When I fill in the "Title" field with "Board To Be Deleted"
    And I click the "Create" button
    Then I should be on the page for the board titled "Board To Be Deleted"
    
    # Part 4: Navigate Back and Delete the Second Board
    When I click the "Boards" breadcrumb link
    Then I should be on the "Boards" page
    And I should see "Board To Be Deleted" in the list of boards
    When I click the delete icon for the board named "Board To Be Deleted"
    And I confirm the deletion in the confirmation dialog
    
    # Part 5: Final Verification
    Then I should be on the "Boards" page
    And I should no longer see "Board To Be Deleted" in the list of boards
    And I should still see "My First Automated Board" in the list of boards