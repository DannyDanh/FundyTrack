# FundyTrack

CodePath WEB103 Final Project

Designed and developed by: Danh Nguyen and Richmond Acquah

🔗 Link to deployed app:

## About

### Description and Purpose

FundyTrack is a comprehensive yet simple personal finance tracker that empowers users to effortlessly manage income, expenses, and investments. It offers intuitive tools to record transactions, categorize spending, and visualize financial health through clean charts and insightful reports. Beyond tracking, FundyTrack builds community — allowing users to share personal finance knowledge, tips, and real-life experiences. The platform also features engaging, goal-oriented challenges such as “Save $20 every day for a month” to keep users motivated and accountable while turning saving into a rewarding habit. Whether you’re budgeting smarter, learning from others, or growing your savings step by step, FundyTrack helps you take control of your financial journey with confidence, clarity, and a supportive community by your side.

### Inspiration

FundyTrack was inspired by the realization that many college students and young adults — including ourselves — often overlook the importance of budgeting and managing their finances. Between classes, part-time jobs, and social expenses, it’s easy to lose track of spending and savings. We wanted to create a tool that makes financial awareness simple, visual, and approachable for people our age. FundyTrack helps young users build healthy money habits early, empowering them to understand where their money goes, set meaningful goals, and develop confidence in their financial future.

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
