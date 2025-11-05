# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

[👉🏾👉🏾👉🏾 List each table in your diagram]
-Users Profiles
-Transactions
-Transactions Types

## Add the Entity Relationship Diagram

[👉🏾👉🏾👉🏾 Include an image or images of the diagram below. You may also wish to use the following markdown syntax to outline each table, as per your preference.]

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | name of the shoe model |
| ... | ... | ... |

-Users Profiles
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | name of the user |
| email | text | users' unique email |
| password | text | encrypted password |
| created_at | timestamp | account creation date |

-Transactions
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| user_id | integer | Users Profiles -> id |
| amount | decimal | Transaction amount (negative for expenses, positive for income) |
| description | text | transaction notes |
| occurred_at | timestamp | Date of transaction |
| transaction_type_id | integer | transaction type id |
