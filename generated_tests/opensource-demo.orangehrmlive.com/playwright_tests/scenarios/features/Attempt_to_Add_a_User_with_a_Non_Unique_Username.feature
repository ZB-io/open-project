@critical @user_management @admin
Feature: User Management - Username Uniqueness Validation
  As an Administrator of the OrangeHRM system
  I need to be prevented from creating a new user with a username that already exists
  So that data integrity is maintained and every user has a unique identifier.

  Scenario: Attempt to Add a User with a Non-Unique Username
    This scenario ensures that the system's validation logic correctly identifies and blocks the creation of a user with a duplicate username. It verifies that a clear error message is presented to the administrator, guiding them to correct the input.

    Given I am on the OrangeHRM login page at "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    When I fill in the "Username" field with "Admin"
    And I fill in the "Password" field with "admin123"
    And I click the "Login" button
    Then I should be on the "Dashboard" page

    When I click the "Admin" link in the main navigation menu
    Then I should be on the "System Users" page
    When I click the "Add" button
    Then I should be on the "Add User" page

    When I click the "User Role" dropdown
    And I select the "Admin" option
    And I click the "Status" dropdown
    And I select the "Enabled" option
    And I fill in the "Employee Name" autocomplete field with "manda user"
    And I click the "manda akhil user" suggestion from the list
    And I fill in the "Username" field with "Admin"
    And I fill in the "Password" field with "S3cureP@ssw0rd!"
    And I fill in the "Confirm Password" field with "S3cureP@ssw0rd!"
    And I click the "Save" button

    Then I should see the error message "Username already exists" displayed below the Username field
    And I should still be on the "Add User" page