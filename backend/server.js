const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORT GEMINI SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

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

// --- ROUTES ---
app.get('/api/test', (req, res) => {
    res.json({ message: "Server is working!" });
});
// ROUTE: AI Generation Endpoint
app.post('/api/generate-content', async (req, res) => {
    try {
        const { prompt } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ content: text });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ROUTE 1: Send all articles
app.get('/api/articles', async (req, res) => {
    try {
        const articles = await Article.find().sort({ _id: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ROUTE 2: Fetch specific article
app.get('/api/articles/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ error: "Article not found" });
        res.json(article);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ROUTE 3: Post new article
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












