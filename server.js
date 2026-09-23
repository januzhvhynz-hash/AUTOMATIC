const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// Helper function to extract creation date from a Discord Snowflake ID
function parseDiscordEpoch(snowflake) {
    try {
        const milliseconds = (BigInt(snowflake) >> 22.0n) + 1420070400000n;
        return new Date(Number(milliseconds)).toUTCString();
    } catch (e) {
        return "Unknown";
    }
}

app.get('/api/user/:id', async (req, res) => {
    const userId = req.params.id;
    
    try {
        const response = styleResponse = await fetch(`https://discord.com/api/v10/users/${userId}`, {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            return res.json(userData);
        }
        
        // If Discord blocks it (404/Forbidden because bot isn't in a shared server), 
        // fall back to generating basic profile data using the Snowflake ID mathematically!
        const fallbackData = {
            id: userId,
            username: `user_${userId.slice(-4)}`,
            bio: `Account created on: ${parseDiscordEpoch(userId)} (Restricted by Discord API - Bot not in shared server)`,
            avatar: null
        };
        
        res.json(fallbackData);

    } catch (err) {
        res.status(500).json({ error: "Server error fetching user data" });
    }
});

app.listen(PORT, () => {
    console.log(`Lookup backend running on port ${PORT}`);
});
