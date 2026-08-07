const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MySQL Connection Setup (ඔයා දුන් විස්තර මෙහි ඇතුළත් කර ඇත)
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12834825',
    password: 'qYI5KTk7We',
    database: 'sql12834825',
    port: 3306
});

db.connect((err) => {
    if (err) console.error('Database Connection Failed:', err);
    else console.log('✅ Connected to MySQL Database Successfully!');
});

// API Key එකක් Generate කර Database එකේ Save කිරීම
app.post('/api/generate', (req, res) => {
    const { service_name } = req.body;
    if (!service_name) return res.status(400).json({ success: false, message: "Service name required" });

    const randomString = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const apiKey = `sk-sachiya-${service_name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${randomString}`;

    const query = "INSERT INTO api_keys (api_key, service_name, status) VALUES (?, ?, 'active')";
    db.query(query, [apiKey, service_name], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error saving key" });
        }
        res.json({ success: true, api_key: apiKey });
    });
});

app.listen(port, () => {
    console.log(`🚀 API Store Server running on port ${port}`);
});
