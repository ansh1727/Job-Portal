# 🚀 Job Portal - MERN Stack Recruitment Platform

A full-stack MERN Job Portal that enables candidates to discover jobs, apply online, track applications, and allows recruiters to manage job postings and applicants through a dedicated dashboard.

## 🌐 Features

### 👨‍💼 Candidate Features

* Secure JWT Authentication
* User Registration & Login
* Browse and Search Jobs
* Advanced Job Filtering
* Save Jobs for Later
* Apply to Jobs
* Application Tracking Dashboard
* Profile Management

### 🏢 Recruiter Features

* Recruiter Registration
* Company Profile Management
* Post New Jobs
* Manage Job Listings
* View Applicants
* Recruitment Dashboard

### 🛡️ Admin Features

* User Management
* Job Management
* Company Management
* Analytics Dashboard

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Redux Toolkit
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Nodemailer
* Cloudinary

### Security

* Role-Based Access Control
* JWT Access & Refresh Tokens
* Password Hashing
* Request Validation
* Rate Limiting

---

## 📸 Project Screenshots

### Home Page

<img width="1440" height="900" alt="Screenshot 2026-06-13 at 10 12 31 PM" src="https://github.com/user-attachments/assets/5bbda3c1-18ce-4c58-bf82-2c4fd02d1901" />

### Login Page

<img width="1440" height="900" alt="Screenshot 2026-06-13 at 10 12 50 PM" src="https://github.com/user-attachments/assets/6d2ea92c-a535-4288-925f-72558e9c6687" />


### Registration Page

<img width="1440" height="900" alt="Screenshot 2026-06-13 at 10 12 56 PM" src="https://github.com/user-attachments/assets/698903d5-e6d2-4a35-8cfb-45a03fc777d3" />

### Browse Jobs

<img width="1440" height="900" alt="Screenshot 2026-06-13 at 10 16 01 PM" src="https://github.com/user-attachments/assets/517eba7c-1fe0-44b1-9a0a-50b6209d5902" />

---

## 📂 Project Structure

```text
Job-Portal/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── utils/
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/ansh1727/Job-Portal.git
cd Job-Portal
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Key Highlights

* Full MERN Stack Architecture
* RESTful API Design
* Authentication & Authorization
* Recruiter & Candidate Workflows
* Application Tracking System
* Responsive UI
* MongoDB Database Integration
* Production Ready Structure

---

## 🔮 Future Enhancements

* Resume Parsing
* AI Job Recommendations
* Interview Scheduling
* Real-Time Notifications
* Resume Builder
* Video Interview Integration

---

## 👨‍💻 Author

**Ansh Pathak**

GitHub: https://github.com/ansh1727

Project Repository: https://github.com/ansh1727/Job-Portal
