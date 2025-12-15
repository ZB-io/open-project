@e2e_business_workflow @critical @board-management
Feature: Project Board Creation and Management
  As a Project Manager
  I want to create a new board and add lists to it
  So that I can effectively organize and track project tasks for my team.

  Scenario: Successfully create a new board and add a custom list
    Given I am on the homepage 'https://zbio.openproject.com/projects/demo-project'
    
    # Navigate to the Boards section
    When I click the 'Boards' link in the main project menu
    Then I should be on the 'Boards' page
    And the page title should contain 'Boards'

    # Initiate board creation
    When I click the 'Create new board' button
    Then I should be on the 'New board' creation page
    And the heading 'New board' should be visible

    # Fill out and submit the new board form
    When I fill in the 'Title' field with 'Automated board 1a2b'
    And I click the 'Create' button
    Then I should be on the newly created board page for 'Automated board 1a2b'
    And the board title 'Automated board 1a2b' should be displayed

    # Add a new list to the board
    When I click the 'Add list to board' button
    Then an input field for the new list name should appear
    When I fill in the new list name field with 'Automated List 1'
    And I press the 'Enter' key to save the list
    Then the board should display a new list titled 'Automated List 1'

    # Navigate back and verify creation
    When I click the 'Boards' breadcrumb link
    Then I should be on the main 'Boards' page
    And I should see the board 'Automated board 1a2b' in the list of boards