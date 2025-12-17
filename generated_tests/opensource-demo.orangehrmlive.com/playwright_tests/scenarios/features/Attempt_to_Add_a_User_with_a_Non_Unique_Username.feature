# language: en
@critical @error_validation @admin @user_management
Feature: User Management - Add User Validation
  As an HR Administrator,
  I want to be prevented from creating a user with a duplicate username and see a clear error message,
  so that I can correct my input and maintain unique user records, ensuring data integrity.

  Background:
    Given I am an authenticated administrator on the homepage 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index'

  Scenario: Attempt to Add a User with a Non-Unique Username
    When I click on the "Admin" link in the main navigation menu
    Then I should be on the "System Users" page with the URL containing "/admin/viewSystemUsers"
    And I should see the "System Users" heading

    When I click on the "Add" button to create a new user
    Then I should be on the "Add User" page with the URL containing "/admin/saveSystemUser"
    And I should see the "Add User" heading

    When I click on the "User Role" dropdown
    And I select the "Admin" option from the dropdown list
    And I fill in the "Employee Name" field with "Aniket QA"
    And I select the suggested employee from the autocomplete list
    And I click on the "Status" dropdown
    And I select the "Enabled" option from the dropdown list
    And I fill in the "Username" field with "Admin"
    And I fill in the "Password" field with "ValidPassword123!"
    And I fill in the "Confirm Password" field with "ValidPassword123!"
    And I click on the "Save" button to submit the form

    Then I should remain on the "Add User" page
    And I should see the error message "Already exists" displayed below the Username field