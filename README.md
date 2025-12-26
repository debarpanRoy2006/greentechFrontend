# 🌍 EcoDex: Gamified Environmental Dashboard

![EcoDex Banner](https://via.placeholder.com/1000x300/0b0d17/06b6d4?text=ECODEX_SYSTEM_ONLINE)

**EcoDex** is a retro-futuristic, cyberpunk-themed web application that gamifies eco-friendly habits. It combines a **React** frontend with a **Django** backend to track your environmental impact, calculate carbon footprints, and monitor real-time air quality, all while leveling up your RPG-style character.

---

## ✨ Features

* **🎮 Gamification System**: Earn XP and level up by logging real-world eco-actions (Recycling, Planting Trees, Saving Water).
* **⚔️ Battle Arena**: Fight "Pollution Monsters" (like Gengar) in a turn-based RPG quiz battle to save the environment.
* **📊 Impact Tools**:
    * **Carbon Tracker**: Calculate CO2 emissions/savings based on transport modes.
    * **Energy Calculator**: Estimate electricity costs and breakdown by appliance.
    * **Impact Logger**: Log daily activities to update your stats.
* **🌬️ Live Air Scanner**: Real-time Air Quality Index (AQI) monitoring using the World Air Quality Index API.
* **🏆 Badge System**: Unlock pixel-art badges for specific achievements.
* **🎨 Cyber-Retro UI**: A fully responsive interface featuring pixel fonts, neon glows, and interactive HUD modals.

---

## 🛠️ Tech Stack

### **Frontend**
* React (Vite)
* CSS3 (Custom Cyberpunk/Retro Styles)
* GSAP (Animations)
* Lucide React (Icons)
* Axios (API Requests)

### **Backend**
* Django (Python Framework)
* Django Rest Framework (API)
* SQLite (Database)
* Python-dotenv (Environment Management)

---

## 🚀 Installation & Setup

Follow these steps to get the project running locally.


### **1. Clone the Repository**
git clone <YOUR_REPO_URL>
cd GreenTech

git clone <YOUR_REPO_URL>
cd GreenTech
2. Backend Setup (Django)
Navigate to the backend folder and set up the virtual environment.

Bash

# Go to backend directory
cd greentech_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install django djangorestframework django-cors-headers requests python-dotenv

# Run Migrations
python manage.py migrate
Configure Environment Variables
Create a .env file inside greentech_backend/ (next to manage.py) and add your API token:

Ini, TOML

# greentech_backend/.env
WAQI_API_TOKEN=your_waqi_api_token_here
SECRET_KEY=django-insecure-your-secret-key
DEBUG=True
> Note: You can get a free token from aqicn.org.

Run the Server
Bash

python manage.py runserver
The backend will start at http://127.0.0.1:8000.

3. Frontend Setup (React)
Open a new terminal, navigate to the frontend folder (e.g., greentechFrontend or wherever your React files are).

Bash

# Go to frontend directory
cd greentechFrontend

# Install dependencies
npm install

# Start the development server
npm run dev
The frontend will start at http://localhost:5173.

## 📂 Project Structure

```text
GreenTech/
├── greentech_backend/       # Django Backend
│   ├── api/                 # API Views, Models, Serializers
│   ├── greentech_backend/   # Project Settings (CORS, Installed Apps)
│   ├── .env                 # API Keys (Not pushed to Git)
│   ├── db.sqlite3           # Database
│   └── manage.py            # Django Entry Point
│
├── greentechFrontend/       # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/   # Main Dashboard UI
│   │   │   ├── Features/    # Battle Arena, Impact Logger, etc.
│   │   │   └── Gamification/# Badges, Trainer Card
│   │   ├── assets/          # Images, Fonts, Sounds
│   │   └── App.jsx
│   └── package.json
└── README.md


How to play
Dashboard: View your Level, XP, and Current Badges.

Log Contribution: Click "Access Terminal" -> "Input Stream" to log actions like "Recycle" or "Plant Tree". Watch your XP grow!

Battle Protocol: If the threat level rises (or you click the skull icon), enter the Battle Arena. Answer eco-quiz questions correctly to defeat the monster and earn massive XP.

Check AQI: Use the Quick Scan widget to see live pollution data for your location (simulated or real coordinates).

🐛 Troubleshooting
Sensor Error (AQI): Ensure your .env file exists in the correct backend folder and has a valid WAQI_API_TOKEN. Restart the Django server after creating the file.

CORS Error: If the frontend can't talk to the backend, ensure django-cors-headers is installed and CORS_ALLOWED_ORIGINS in settings.py includes http://localhost:5173.

Images Not Loading: Check that your assets (gengar.gif, backgrounds) are in the correct src/assets/images/ path.

🤝 Contributing
Contributions are welcome!

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request
