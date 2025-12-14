# ClassForge – Academic Task Submission Portal

ClassForge is a full-stack academic task submission and management platform designed for students, faculty, and administrators.
It provides secure authentication, role-based access, and a clean UI for managing academic workflows efficiently.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* Secure login and signup using JWT
* Role-based access (Student / Faculty / Admin)
* Password visibility toggle and validation
* Warning-style error notifications

### 👨‍🎓 Student

* Register and login securely
* Submit academic tasks
* View submission status

### 👨‍🏫 Faculty

* Review student submissions
* Manage tasks and assignments

### 🛠 Admin

* Manage users
* Control system-level operations

### 🎨 UI / UX

* Modern React UI with CSS Modules
* Clean form validations and animations
* Responsive design
* Eye-toggle password fields

---

## 🧑‍💻 Tech Stack

### Frontend

* React.js
* React Router
* CSS Modules
* Fetch API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer (file uploads)

---

## 📁 Project Structure

```
classforge-project/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── classforge/          # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Jivithesh-2007/classforge.git
cd classforge-project
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
node server.js
```

---

### 3️⃣ Frontend Setup

```bash
cd ../classforge
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

Backend runs on:

```
http://localhost:5001
```

---

## 🧪 Database Verification

To check stored users in MongoDB:

```bash
mongosh
use classforge
show collections
db.users.find().pretty()
```

---

## 🔒 Security Notes

* Passwords are hashed before storage
* JWT tokens used for protected routes
* `.env` file is ignored from GitHub

---

## 📌 Future Enhancements

* Dashboard analytics
* Email notifications
* Assignment deadlines & grading
* File preview system
* Cloud deployment

---

## 👤 Author's

**Jivithesh**
Software Engineering Student
GitHub: [https://github.com/Jivithesh-2007](https://github.com/Jivithesh-2007)

**Jebastin**

**Aditi**

**Nishvanth**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub and feel free to fork it!
