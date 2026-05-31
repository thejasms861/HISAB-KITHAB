# Hisab-Kithab - Smart Digital Ledger Management System 📒

Hisab-Kithab is a full-stack, modern ledger management system built to simplify keeping track of your credits (money you need to receive) and debits (money you need to pay). Whether you're a small business owner, a freelancer, or an individual tracking personal finances, Hisab-Kithab provides a seamless and intuitive interface to manage your financial relationships and transactions.

## 🌟 Key Features

- **🔐 Secure Authentication:** JWT-based user login and registration to keep your financial data private.
- **📊 Comprehensive Dashboard:** A bird's-eye view of your finances with beautiful charts and visual summaries of total given, total taken, and net balance.
- **👥 Customer Management:** Easily add, edit, and view individual customers and their specific ledgers.
- **💸 Transaction Tracking:** Record real-time credit and debit transactions for each customer.
- **📄 Automated Reports:** Generate and export monthly and customer-specific financial statements to PDF (powered by jsPDF).
- **📱 Responsive UI:** Fully responsive and modern design optimized for both desktop and mobile platforms.

## 🛠️ Tech Stack

### Frontend (React/Vite)
- **Framework:** React 19 powered by Vite for lightning-fast builds
- **Styling:** Tailwind CSS (v4) with `clsx` and `tailwind-merge` for robust utility styling
- **Routing:** React Router DOM
- **Data Fetching:** Axios
- **Visualization:** Recharts for dynamic and interactive financial charts
- **Icons:** Lucide React & React Icons
- **PDF Generation:** jsPDF & jsPDF-AutoTable

### Backend (Django)
- **Framework:** Django (v5.0+) & Django REST Framework (DRF)
- **Authentication:** Simple JWT (JSON Web Tokens)
- **Database:** SQLite (Development) / PostgreSQL ready (psycopg2-binary included)
- **Security:** Django CORS Headers & Python-dotenv for environment variables

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- **Python 3.8+**
- **Node.js 18+**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/thejasms861/HISAB-KITHAB.git
cd HISAB-KITHAB
```

### 2. Backend Setup
Navigate to the `backend` directory and set up your Python environment:

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Create a superuser (admin account)
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver
```
The backend API will now be running at: `http://localhost:8000`

### 3. Frontend Setup
Open a new terminal window, navigate to the `frontend` directory, and start the Vite development server:

```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend application will now be running at: `http://localhost:5173`

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
└── frontend/              # React/Vite Frontend
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── pages/         # Application views (Dashboard, Customers, etc.)
    │   ├── services/      # Axios API configuration & endpoints
    │   └── ...
    ├── package.json       # Node.js dependencies
    └── tailwind.config.js # Tailwind CSS configuration
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

