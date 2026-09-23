const express = require('express');
const app = express();

// Railway assigns a dynamic port, fallback to 3000 for local testing
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Reads your bot token securely from Railway Environment Variables
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

app.get('/api/user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`
            }
        });

        if (!response.ok) {
            return res.status(404).json({ error: "User not found or invalid ID" });
        }

        const userData = await response.json();
        res.json(userData);
    } catch (err) {
        res.status(500).json({ error: "Server error fetching user data" });
    }
});

app.listen(PORT, () => {
    console.log(`Lookup backend running on port ${PORT}`);
});