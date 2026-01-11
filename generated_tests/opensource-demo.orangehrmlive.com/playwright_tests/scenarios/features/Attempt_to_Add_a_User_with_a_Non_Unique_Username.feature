# language: en
@critical @error_validation @admin @user_management
Feature: User Management - Add User Validation

  As a System Administrator,
  I want to be prevented from creating a new user with a username that already exists,
  So that I can maintain unique user identifiers and avoid data conflicts.

  Background: Administrator is logged in and on the User Management page
    Given I am on the login page "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    When I fill in the "Username" field with "Admin"
    And I fill in the "Password" field with "admin123"
    And I click the "Login" button
    Then I should be on the "Dashboard" page
    When I click the "Admin" link in the main navigation menu
    Then I should be on the "System Users" page which contains the text "System Users"

  @negative_test
  Scenario: Attempt to Add a User with a Non-Unique Username
    Given I am on the "System Users" page
    When I click the "Add" button
    Then I should be on the "Add User" page
    When I click the "User Role" dropdown
    And I select the "Admin" option from the dropdown
    And I fill in the "Employee Name" autocomplete field with "a"
    And I click the first available employee suggestion from the list
    And I click the "Status" dropdown
    And I select the "Enabled" option from the dropdown
    And I fill in the "Username" field on the add user form with "Admin"
    And I fill in the "Password" field on the add user form with "S3cureP@ssw0rd!"
    And I fill in the "Confirm Password" field with "S3cureP@ssw0rd!"
    And I click the "Save" button
    Then I should see the error message "Already exists" directly associated with the Username field