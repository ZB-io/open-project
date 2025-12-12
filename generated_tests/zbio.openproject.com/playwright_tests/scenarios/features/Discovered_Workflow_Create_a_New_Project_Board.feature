@e2e @critical @boards
Feature: Board Creation
  As a Project Manager, I need to create new boards within my projects
  to visually organize and track team tasks. This feature ensures that
  the core board creation functionality is working correctly, from user
  authentication to final board verification.

  Scenario: Successfully create a new project board after logging in
    Given I am on the homepage "https://zbio.openproject.com/projects/demo-project"
    
    # Log out the current user to ensure a clean session
    When I click the user avatar button with the name "HA"
    And I click the "Sign out" link
    Then I should be on the login page
    
    # Authenticate with test user credentials
    When I fill in the "Username*" field with "<UI_SITE_USERNAME>"
    And I fill in the "Password*" field with "<UI_SITE_PASSWORD>"
    And I click the "Sign in" button
    Then I should be redirected to the homepage "https://zbio.openproject.com/"
    
    # Navigate to the Boards section and initiate creation
    When I click the "Boards" link in the main sidebar menu
    Then I should be on the Boards page
    When I click the "Create new board" link
    Then I should be on the new board creation page
    
    # Fill out the new board form
    When I fill in the "Title*" field with "Automated board 1"
    And I fill in the "Search" combobox with "demo-project"
    And I click the "Demo project" option from the search results
    And I click the "Create" button
    
    # Verify the board was created successfully
    Then I should be on the page for the new board "Automated board 1"
    And the board title should be "Automated board 1"
    
    # Return to the boards list and verify the new board is present
    When I click the "Boards" link in the main sidebar menu
    Then I should be on the Boards page
    And I should see the board named "Automated board 1" in the list of boards