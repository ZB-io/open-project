@critical @e2e @user-management @validation
Feature: User Management - Add User Validation
  As an Administrator of the OrangeHRM system
  I want to be prevented from creating a user with a username that already exists
  To ensure data integrity and maintain unique user identifiers.

  Background:
    Given I am logged in as an Administrator
    And I am on the homepage 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index'
    Then I should see the "Dashboard" heading

  @TC-001
  Scenario: Error Validation: Attempt to Add a User with a Non-Unique Username
    This scenario verifies that the system correctly displays an error message when an administrator attempts to create a new user with a username that is already in use.

    When I click on the "Admin" link in the main navigation menu
    Then I should be on the "System Users" page
    And the page URL should contain '/web/index.php/admin/viewSystemUsers'

    When I click on the "Add" button
    Then I should be on the "Add User" page
    And I should see the "Add User" heading

    When I click on the "User Role" dropdown
    And I select "Admin" from the options
    And I click on the "Status" dropdown
    And I select "Enabled" from the options
    And I fill in the "Employee Name" field with "Odis"
    And I wait for the autocomplete options to appear
    And I click on the autocomplete option containing "Odis Adalwin"
    And I fill in the "Username" field with "Admin"
    And I fill in the "Password" field with "admin123"
    And I fill in the "Confirm Password" field with "admin123"
    And I click on the "Save" button

    Then I should see an error message "Already exists" below the Username field
    And I should remain on the "Add User" page
    And the page URL should still contain '/web/index.php/admin/saveSystemUser'