const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 1. IMPORT GEMINI SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// Prevent direct static bypass to admin.html
app.use((req, res, next) => {
    if (req.path === '/admin.html') {
        return res.status(403).send('Access Denied');
    }
    next();
});

// Serve static assets from the root/parent directory
app.use(express.static(path.join(__dirname, '../')));

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Cloud Database Connected Successfully"))
    .catch(err => console.log("Database connection error: ", err));

const articleSchema = new mongoose.Schema({
    category: String,
    catLabel: String,
    title: String,
    subHeadline: String,
    desc: String,
    img: String,   
    image: String, 
    date: { 
        type: String, 
        default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
    }
});

const Article = mongoose.model('Article', articleSchema);

// --- AUTH & ADMIN ROUTES ---

// Verify password endpoint
app.post('/api/verify-admin', (req, res) => {
    const { password } = req.body;
    
    if (password && password.trim() === process.env.ADMIN_PASSWORD) {
        return res.json({ success: true, adminUrl: process.env.ADMIN_ROUTE });
    } else {
        return res.status(401).json({ success: false, message: "Incorrect Admin Password!" });
    }
});

// Serve admin.html via the secret route defined in .env
if (process.env.ADMIN_ROUTE) {
    app.get(process.env.ADMIN_ROUTE, (req, res) => {
        res.sendFile(path.join(__dirname, '../admin.html'));
    });
}

// --- GENERAL API ROUTES ---

app.get('/api/test', (req, res) => {
    res.json({ message: "Server is working!" });
});

// AI Generation Endpoint
app.post('/api/generate-content', async (req, res) => {
    try {
        const { prompt } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ content: text });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch all articles
app.get('/api/articles', async (req, res) => {
    try {
        const articles = await Article.find().sort({ _id: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch single article by ID
app.get('/api/articles/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ error: "Article not found" });
        res.json(article);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Create new article
app.post('/api/articles', async (req, res) => {
    try {
        const newArticle = new Article(req.body);
        const savedArticle = await newArticle.save();
        res.status(201).json(savedArticle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));












