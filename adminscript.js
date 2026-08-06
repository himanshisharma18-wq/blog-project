const API_URL = "https://blog-project-86ee.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('articleForm');
    
    if (!form) {
        console.error("Could not find form element with ID 'articleForm'.");
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // 1. Structure all extended data points from input fields
        const articleData = {
            title: document.getElementById('articleTitle').value.trim(),
            subHeadline: document.getElementById('articleSub').value.trim(), // Captured new field
            category: document.getElementById('articleCategory').value.toLowerCase().trim(),
            image: document.getElementById('articleImage').value.trim(),
            desc: document.getElementById('articleDesc').value.trim()
        };

        try {
            // 2. Fire structured content to your active backend port
            const response = await fetch(`${API_URL}/api/articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleData)
            });

            // 3. Handle confirmation statuses
            if (response.ok) {
                alert('🎉 High-end article published successfully to your MongoDB Cloud!');
                form.reset(); 
            } else {
                const errorMsg = await response.text();
                alert('Failed to publish article: ' + errorMsg);
            }
        } catch (error) {
            console.error('Connection Rejected:', error);
            alert('Cannot connect to server! Ensure your backend terminal window running "node server.js" is active.');
        }
    });
});










document.getElementById('aiBtn').addEventListener('click', async () => {
    const title = document.getElementById('articleTitle').value;
    const descArea = document.getElementById('articleDesc');
    
    if (!title) return alert("Please enter an Article Title first so the AI knows what to write about!");

    descArea.value = "Generating content, please wait...";

    try {
        const response = await fetch(`${API_URL}/api/generate-content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: `Write a professional, structured article titled: ${title}. Include sections for Overview, Architecture, Implementation, and Summary.` })
        });

        const data = await response.json();
        if (data.content) {
            descArea.value = data.content; // Fills the box with AI-generated text
        } else {
            descArea.value = "Error generating content.";
        }
    } catch (error) {
        console.error("AI Error:", error);
        descArea.value = "Failed to connect to AI server.";
    }
});