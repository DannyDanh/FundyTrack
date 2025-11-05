# FundyTrack

CodePath WEB103 Final Project

Designed and developed by: Danh Nguyen and Richmond Acquah

🔗 Link to deployed app:

## About

### Description and Purpose

FundyTrack is a comprehensive personal finance dashboard that empowers users to manage income, expenses, and investments effortlessly. It provides tools to record transactions, categorize spending, and visualize financial health through intuitive charts and reports.

By consolidating multiple financial activities into one modern interface, FinPort eliminates the need for juggling spreadsheets or multiple banking apps. Users can easily track where their money goes, identify spending patterns, and monitor their net worth growth—all from a single, organized platform.

### Inspiration

FundyTrack was inspired by the idea that effective financial management should be simple, transparent, and accessible. As students passionate about both technology and finance, we set out to build a clean, privacy-focused budgeting experience that teaches financial awareness while demonstrating key full-stack development principles. FundyTrack blends practical money management with data visualization, making it not just a budgeting tool—but a learning platform for smarter financial decision-making.

## Tech Stack

Frontend: React, Tailwind CSS

Backend: Node.js, Express, PostgreSQL

## Features

### 1. Transaction CRUD API & UI

Implements full RESTful functionality for transactions (GET, POST, PATCH, DELETE) with React forms and dynamic list/detail views that allow users to seamlessly create, update, and manage all financial records.

[gif goes here]

### 2. Categories Tagging with Join Table

Enables many-to-many relationships between transactions and categories via a transaction_categories join table with a unique (transaction_id, category_id) constraint, allowing each transaction to be tagged under multiple relevant categories.

[gif goes here]

### 3. User Profiles (1-to-1)

Creates a one-to-one relationship between users and profiles that store personal settings such as avatar, preferred currency, and default account preferences for a personalized dashboard experience.

[gif goes here]

### 4. Filter, Sort, and Search

Allows users to quickly locate transactions by filtering through account, category, or date range, sorting by amount or date, and performing keyword searches on descriptions—all without leaving the page.

[gif goes here]

### 5. Authentication & Authorization

Provides secure registration, login, and logout functionality, ensuring that only authenticated users can access and manage their financial data and personal accounts.

[gif goes here]

### 6. Receipts Capture 

Lets users upload and attach receipt images or PDFs to any transaction, automatically filling in date, amount, and category fields to simplify record keeping.

[gif goes here]

### 7. Spending & Net Worth Visualizations

Displays clear, interactive financial charts that visualize spending by category, income versus expenses, and net worth over time using dynamic and responsive data visualizations.

[gif goes here]

## Installation Instructions

[instructions go here]
