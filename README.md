# FundyTrack

CodePath WEB103 Final Project

Designed and developed by: **Danh Nguyen** 

🔗 **Live App:** *(Add Render link here)*  
🔗 **Backend API:** *(Add Render backend link here)*

---

## 📘 About FundyTrack

FundyTrack is a clean, modern, and intuitive personal finance tracker designed to help users stay in control of their money. Users can log transactions, categorize spending, set monthly budgets, visualize trends, and monitor their financial habits — all through a simple and friendly interface.

Built for college students and young adults, FundyTrack makes personal finance **easy**, **visual**, and **fun**, helping users build strong money habits early on.

---

## 💡 Inspiration

FundyTrack was inspired by a problem we’ve experienced ourselves:  
**Most young adults do not track their income or expenses.**

Between school, work, and life, budgeting gets ignored — and spending becomes invisible.

We wanted to create a tool that:

- makes money management simple  
- helps users understand where their money goes  
- provides charts and insights at a glance  
- encourages healthy financial habits  
- feels modern, fast, and enjoyable to use  

FundyTrack empowers users to build financial awareness through visualization, challenges, and clear budgeting tools — all in one place.

---

## 🧰 Tech Stack

### **Frontend**
- React  
- Vite  
- CSS / Custom Styles  
- Recharts (data visualizations)

### **Backend**
- Node.js  
- Express  
- PostgreSQL  
- Passport.js (Google OAuth 2.0)

### **Deployment**
- Render (Backend)
- Render (Frontend)
- Render PostgreSQL

---

## 🚀 Features

### **1. Transaction CRUD (Create, Read, Update, Delete)**  
Users can add, edit, and delete transactions with the following fields:

- Date  
- Description  
- Amount  
- Type (Income or Expense)  
- Category (1 transaction only have 1 category 1-to-1)

All changes update instantly across the Dashboard and Budget pages.

---

### **2. Category Management**  
Users can create and manage their own categories, and transactions can be assigned to categories for better organization (1 category can have many transactions 1-to-many)

The dashboard automatically visualizes spending per category.

---

### **3. Monthly Budgeting (Global + Per Category)**  
FundyTrack includes a complete budgeting system:

- Set a **global monthly budget**  (1 user have only 1 monthly budget and 1 set of category-specific budgets 1-to-1)
- Set **category-specific budgets** 
- Track percentage used  
- Budget bar fills dynamically  
- Over-budget warnings  

This makes it easy to see where you're overspending.

---

### **4. Dashboard With Smart Visualizations**  
The dashboard provides a high-level monthly overview, including:

- Total income  
- Total expenses  
- Net balance  
- Spending by category (Bar Chart)  
- Spending per day (Line Chart)  
- Recent transactions  
- Budget usage  

Charts are interactive, responsive, and easy to read.

---

### **5. Fun Financial Challenges & Insights**  
To help users build financial discipline, FundyTrack includes:

- **No-Spend Days Counter**  
- **Current No-Spend Streak**  
- **Best Streak**  
- **Low-Spend Days (≤ $20)**  

These insights make saving money more engaging and rewarding.

---

### **6. Google OAuth Login**  
Users can securely sign in with Google. 

- No passwords required  
- Profile picture + name displayed in navbar  
- Protected API routes (`/transactions`, `/categories`, `/budget`)  
- Logout clears session properly  

---

## Video Walkthrough

Here's a walkthrough of implemented required features:

![Video Walkthrough](client/public/demo.gif)

GIF created with LICEcap

