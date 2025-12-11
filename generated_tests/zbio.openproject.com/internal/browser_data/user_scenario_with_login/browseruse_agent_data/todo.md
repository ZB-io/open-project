# Work Package Scenarios

## Scenario 1: Create work package (task)
- [x] **Background**: Given the user is authenticated as "default"
- [x] **Background**: And the user is on the Work packages page
- [x] **When**: the user creates a new work package of type "task"
- [x] **And**: the user sets the work package name to "Auto WP <uuid4>"
- [x] **And**: the user sets the work package description to "Auto description <timestamp>"
- [x] **And**: the user saves the work package
- [x] **And**: the user filter for work package with name "Auto WP <uuid4>"
- [x] **Then**: the work package named "Auto WP <uuid4>" exists in the work packages table

## Scenario 2: Delete work package (task)
- [x] **Background**: Given the user is authenticated as "default"
- [x] **Background**: And the user is on the Work packages page
- [x] **When**: the user deletes the work package named "<name>"
- [x] **Then**: the work package named "<name>" does not exist in the work packages table

## Scenario 3: Create work package (phase)
- [x] **Background**: Given the user is authenticated as "default"
- [x] **Background**: And the user is on the Work packages page
- [x] **When**: the user creates a new work package of type "phase" (FAILED)
- [x] **And**: the user sets the work package name to "Auto WP <uuid4>"
- [x] **And**: the user sets the work package description to "Auto description <timestamp>"
- [x] **And**: the user saves the work package
- [x] **Then**: the work package named "<name>" exists in the system (FAILED)

## Scenario 4: Delete work package (phase)
- [x] **Background**: Given the user is authenticated as "default"
- [x] **Background**: And the user is on the Work packages page
- [x] **When**: the user deletes the work package named "<name>"
- [x] **Then**: the work package named "<name>" does not exist in the system (FAILED)

