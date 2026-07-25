# 🚀 Full-Stack AI Article Generator & Publishing Platform

A full-stack web application that allows users to explore articles and enables administrators to generate and publish new blog posts powered by **Google Gemini AI**. Built with a lightweight HTML/CSS/JS frontend and a Node.js/Express backend connected to MongoDB Atlas.

---

## ✨ Features

* **AI Article Generation:** Automatically generates detailed, structured blog content from a simple title prompt using the **Gemini API**.
* **Database Integration:** Saves published articles permanently to **MongoDB Atlas**.
* **Dynamic Article Feed:** Fetches and displays published articles dynamically on the frontend.
* **Admin Dashboard:** Simple, intuitive admin panel to publish, summarize, and manage articles.
* **Secure Environment:** Keeps sensitive API keys and database credentials secure via `.env` configuration.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **AI Engine:** Google Gemini API
* **Deployment Friendly:** Prepared for single-service deployment on Render or Railway

---

## 📂 Project Structure

```text
XYZ/
├── backend/
│   ├── .env               # Secret environment variables (Ignored by Git)
│   ├── .env.example       # Sample environment template
│   ├── .gitignore         # Ignores node_modules and .env
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express server & API routes
├── explorearticle/        # Article viewing sub-module
│   ├── article.html
│   └── explorearticlescript.js
├── images/                # Static assets & illustrations
├── admin.html             # Admin portal for AI content generation
├── adminscript.js         # Admin panel API handling logic
├── index.html             # Main public blog page
├── script.js              # Main frontend dynamic rendering logic
└── README.md              # Project documentation