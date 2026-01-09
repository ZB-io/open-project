# language: en
@critical @e2e_business_workflow @admin @user_management
Feature: User Management - Username Validation
  As an administrator, I want to be prevented from creating a user with a username that already exists,
  so that I can maintain data integrity and avoid user account conflicts.

  Background: Administrator is on the User Management page
    Given I am logged in as an administrator
    And I am on the homepage "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index"
    When I click on the "Admin" link in the main navigation menu
    Then I should be on the "System Users" page
    And the URL should contain "/admin/viewSystemUsers"

  @negative_test @validation
  Scenario: Attempt to Add a User with a Non-Unique Username
    Given I am on the "System Users" page
    When I click on the "Add" button
    Then I should be on the "Add User" page
    And the URL should contain "/admin/saveSystemUser"
    And the heading "Add User" should be visible

    When I click on the "User Role" dropdown
    And I select the "Admin" option from the dropdown
    Then the "User Role" field should be set to "Admin"

    When I fill in the "Employee Name" field with "Odis"
    And I wait for the autocomplete options to appear
    And I click on the autocomplete option containing "Odis Adalwin"

    When I click on the "Status" dropdown
    And I select the "Enabled" option from the dropdown
    Then the "Status" field should be set to "Enabled"

    When I fill in the "Username" field with "Admin"
    And I fill in the "Password" field with "SecureP@ssw0rd123"
    And I fill in the "Confirm Password" field with "SecureP@ssw0rd123"
    And I click on the "Save" button

    Then I should see an error message "Username already exists" displayed below the Username field
    And I should remain on the "Add User" page
    And the URL should still contain "/admin/saveSystemUser"