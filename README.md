# 🚀 Full-Stack AI Article Generator & Publishing Platform

A full-stack web application that allows users to explore articles and enables administrators to generate and publish new blog posts powered by **Google Gemini AI**. Built with a lightweight HTML/CSS/JS frontend and a Node.js/Express backend connected to MongoDB Atlas.

## 🔗 Live Demo
Access the live site here: [https://blog-project-86ee.onrender.com](https://blog-project-86ee.onrender.com)

---

## 🛠️ Installation & Setup

To run this project locally on your machine, follow these steps:

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
* [Google Gemini API Key](https://aistudio.google.com/)

### Steps
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   cd your-repo-name
   Install dependencies:

Bash
cd backend
npm install
Configure Environment:
Create a .env file inside the backend/ folder and add your credentials:

Code snippet
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
ADMIN_PASSWORD=your_secure_password
ADMIN_ROUTE=/secret-admin-path
PORT=5000
Start the server:

Bash
node server.js
✨ Features
AI Article Generation: Automatically generates content using the Gemini API.

Database Integration: Securely saves articles to MongoDB Atlas.

Admin Dashboard: Password-protected portal to manage your blog content.

Responsive Design: Mobile-friendly and clean UI.

📂 Project Structure
Plaintext
XYZ/
├── backend/
│   ├── .env              # (Required) Environment configuration
│   └── server.js         # Express server & API routes
├── explorearticle/       # Article viewing module
├── admin.html            # Admin portal
├── index.html            # Public blog homepage
├── script.js             # Frontend logic
└── README.md             # Project documentation
🤝 Collaborations & Contributions
I am currently accepting new content and feature suggestions!

If you would like to have a custom blog or article featured on this platform, or if you want to collaborate on the project:

Connect with me on LinkedIn: [Insert your LinkedIn Profile Link Here]

Reach out on other socials: [Insert your preferred social link here]

📄 License
This project is open-source and available under the MIT License.

Note: Please ensure you do not share your .env file or commit your API keys to public repositories.