# HisabKitab - Smart Digital Ledger Management System

Full-stack application for managing credit/debit transactions.

## Tech Stack
- **Backend**: Django, Django REST Framework, SQLite
- **Frontend**: React, Vite, Tailwind CSS

## Prerequisites
- Python 3.8+
- Node.js 16+

## Setup & Run

### 1. Backend
Open a terminal in the `hisabkitab/backend` folder:

```bash
# Create virtual environment (if not exists)
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations


# Create Admin User
python manage.py createsuperuser

# Start Server
python manage.py runserver
```
Backend runs at: `http://localhost:8000`

### 2. Frontend
Open a new terminal in the `hisabkitab/frontend` folder:

```bash
# Install dependencies
npm install

# Start Development Server
npm run dev
```
Frontend runs at: `http://localhost:5173`

## Features
- User Authentication (Login/Register)
- Dashboard with Financial Summary
- Customer Management (Add/Edit Customers)
- Transaction Ledger (Credit/Debit) per Customer
- Monthly Reports
