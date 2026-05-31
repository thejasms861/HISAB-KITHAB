# Hisab-Kithab – Financial Record & Ledger Management Platform 📒

Hisab-Kithab is a full-stack financial record and ledger management platform designed to simplify tracking credits (money to receive) and debits (money to pay). The platform helps small businesses, freelancers, and individuals maintain accurate financial records, manage customer transactions, and generate financial reports through a modern and user-friendly interface.

---

## 🎯 Project Purpose

Many small businesses and individuals still rely on notebooks, spreadsheets, or fragmented systems to manage financial transactions. This often leads to calculation errors, poor visibility of outstanding balances, and difficulties in generating reports.

Hisab-Kithab was developed to provide a secure and centralized platform for managing customer ledgers, tracking transactions, visualizing financial data, and generating reports. The goal was to improve financial record management while delivering a clean and intuitive user experience.

---

## 🌟 Key Features

### 🔐 Secure Authentication

* JWT-based user registration and login
* Protected API endpoints
* Secure session management

### 📊 Financial Dashboard

* Overview of total credits and debits
* Net balance tracking
* Interactive financial visualizations using Recharts

### 👥 Customer Management

* Add, edit, and manage customer profiles
* View customer-specific ledger history
* Track outstanding balances

### 💸 Transaction Tracking

* Record credit and debit transactions
* Real-time balance updates
* Transaction history management

### 📄 Automated Report Generation

* Customer-wise financial statements
* Monthly financial reports
* PDF export functionality using jsPDF

### 📱 Responsive User Experience

* Mobile-friendly interface
* Modern UI built with React and Tailwind CSS
* Consistent experience across devices

---

## 🏗️ System Architecture

The application follows a modern full-stack architecture:

```text
Frontend (React + Vite)
        ↓
REST API Communication (Axios)
        ↓
Django REST Framework Backend
        ↓
JWT Authentication Layer
        ↓
Business Logic & Reporting Services
        ↓
SQLite / PostgreSQL Database
```

Core Modules:

* Authentication & Authorization
* Customer Management
* Transaction Processing
* Financial Analytics Dashboard
* Reporting & PDF Generation

---

## 🔄 Development Workflow

```text
User Action
      ↓
React Frontend
      ↓
Axios API Requests
      ↓
Django REST API
      ↓
Business Logic Layer
      ↓
Database Operations
      ↓
Updated Financial Records & Reports
```

---

## 🛠️ Technology Stack

### Frontend

* React 19
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Recharts
* Lucide React
* React Icons
* jsPDF
* jsPDF-AutoTable

### Backend

* Django
* Django REST Framework
* Simple JWT Authentication
* SQLite (Development)
* PostgreSQL Ready

### Security & Configuration

* Django CORS Headers
* Python-dotenv

---

## ⚙️ Engineering Challenges

One of the key challenges during development was maintaining accurate customer balances while processing multiple credit and debit transactions.

During testing, some transaction aggregation logic produced inconsistent balance calculations. By reviewing the transaction workflow, improving backend validation logic, and conducting iterative testing, I was able to improve reliability and consistency.

Another challenge was designing a responsive dashboard capable of presenting financial information clearly across desktop and mobile devices. Multiple UI iterations were performed to improve usability and readability.

---

## 📚 Lessons Learned

Through this project, I gained practical experience in:

* Full-stack application development
* REST API design and integration
* JWT-based authentication and authorization
* Financial data modeling
* Transaction processing systems
* Dashboard design and data visualization
* PDF reporting workflows
* Frontend and backend debugging
* User-centered software design

This project strengthened my ability to convert business requirements into technical solutions while reinforcing the importance of testing, maintainability, and continuous improvement.

---

## 💡 Business Value

Hisab-Kithab helps users:

* Digitize financial record management
* Reduce manual bookkeeping effort
* Improve transaction visibility
* Generate financial reports efficiently
* Track outstanding balances accurately
* Access financial information from a centralized platform

The platform was designed with simplicity, reliability, and operational efficiency in mind.

---

## 🚀 Future Improvements

Planned enhancements include:

* Multi-user business accounts
* Role-based access control (RBAC)
* Dockerized deployment
* Automated payment reminders
* Data backup and recovery
* Mobile application support
* Advanced financial analytics
* AI-powered spending insights
* Audit logs and activity tracking

---

## 📁 Project Structure

```text
HISAB-KITHAB/
├── backend/               # Django REST API Backend
│   ├── accounts/          # User authentication and management
│   ├── customers/         # Customer profiles API
│   ├── transactions/      # Ledger transactions API
│   ├── reports/           # Financial reporting API
│   ├── hisabkitab/        # Core Django settings
│   └── requirements.txt   # Python dependencies
│
└── frontend/              # React/Vite Frontend
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── pages/         # Application views (Dashboard, Customers, etc.)
    │   ├── services/      # Axios API configuration & endpoints
    │   └── ...
    ├── package.json       # Node.js dependencies
    └── tailwind.config.js # Tailwind CSS configuration
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

* Python 3.8+
* Node.js 18+
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/thejasms861/HISAB-KITHAB.git
cd HISAB-KITHAB
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate

python manage.py createsuperuser

python manage.py runserver
```

Backend API:

```text
http://localhost:8000
```

### 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend Application:

```text
http://localhost:5173
```

---

## 📝 Project Summary

Hisab-Kithab is a full-stack financial record management platform built using React, Django REST Framework, and JWT authentication. The system enables users to manage customer transactions, track balances, visualize financial data through dashboards, and generate automated reports.

The project demonstrates practical experience in full-stack development, API design, authentication systems, financial data management, reporting workflows, and user-focused software engineering. It reflects an engineering approach focused on solving real-world operational problems through technology.

---

## 🤝 Contributing

Contributions are welcome and greatly appreciated.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is intended for educational, portfolio, and software engineering learning purposes.
