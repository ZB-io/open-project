---
id: BRD-Delete-All
suite: Boards
feature: Boards maintenance
component: boards
priority: P3
tags: [ui, board, regression]
---


Background:
  Given the user is authenticated as "default"
  And the user is on the Boards page

Scenario: Delete all boards
  When the user deletes all boards in the table
  Then no boards are visible on the Boards page