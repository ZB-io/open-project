# language: en
@regression @critical @usermanagement @validation
Feature: User Management Validation

  As an Administrator of the OrangeHRM system
  I want to be prevented from creating users with duplicate usernames
  So that I can maintain data integrity and avoid account conflicts.

  Background: Administrator is logged in and on the System Users page
    Given I am on the login page 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
    When I fill in the 'Username' field with 'Admin'
    And I fill in the 'Password' field with 'admin123'
    And I click the 'Login' button
    Then I should be on the 'Dashboard' page
    When I click the 'Admin' link in the main navigation menu
    Then I should be on the 'System Users' page

  @error_validation @duplicate_username
  Scenario: Attempt to Add a User with a Non-Unique Username
    Given I am on the 'System Users' page
    When I click the 'Add' button
    Then I should be on the 'Add User' page
    And the header should be 'Add User'

    When I click the 'User Role' dropdown
    And I select the 'Admin' option from the dropdown
    And I fill in the 'Employee Name' field with 'Peter Mac Anderson'
    # The system uses an autocomplete, so we must select the suggested employee.
    And I click the suggestion for 'Peter Mac Anderson'
    And I click the 'Status' dropdown
    And I select the 'Enabled' option from the dropdown
    # This is the key step to trigger the duplicate username validation.
    And I fill in the 'Username' field with 'Admin'
    And I fill in the 'Password' field with 'Password123!'
    And I fill in the 'Confirm Password' field with 'Password123!'
    And I click the 'Save' button

    # Verification of the error state
    Then an error message 'Already exists' should be displayed for the Username field
    And I should still be on the 'Add User' page
    And the page URL should contain '/admin/saveSystemUser'