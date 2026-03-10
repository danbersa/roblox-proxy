const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const COOKIE = process.env.ROBLOSECURITY;

app.get("/outfits", async (req, res) => {
    const userId = req.query.userId;
    const page = req.query.page || 1;

    if (!userId) {
        return res.json({ success: false, error: "userId required" });
    }

    try {
        const url = `https://avatar.roblox.com/v1/users/${userId}/outfits?itemsPerPage=100&page=${page}`;
        
        const response = await fetch(url, {
            headers: {
                "Cookie": `.ROBLOSECURITY=${COOKIE}`,
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0"
            }
        });

        const raw = await response.text(); // JSON değil, ham text
        return res.json({ success: true, status: response.status, raw: raw });

    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

app.get("/outfitdetails", async (req, res) => {
    const outfitId = req.query.outfitId;

    if (!outfitId) {
        return res.json({ success: false, error: "outfitId required" });
    }

    try {
        const url = `https://avatar.roblox.com/v1/outfits/${outfitId}/details`;

        const response = await fetch(url, {
            headers: {
                "Cookie": `.ROBLOSECURITY=${COOKIE}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        return res.json({ success: true, data: data });

    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

app.get("/userid", async (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.json({ success: false, error: "username required" });
    }

    try {
        const url = `https://users.roblox.com/v1/usernames/users`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
        });

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            return res.json({ success: true, userId: data.data[0].id });
        } else {
            return res.json({ success: false, error: "User not found" });
        }

    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

app.get("/test", async (req, res) => {
    try {
        const response = await fetch("https://users.roblox.com/v1/users/authenticated", {
            headers: {
                "Cookie": `.ROBLOSECURITY=${COOKIE}`
            }
        });
        const data = await response.json();
        return res.json({ success: true, data: data });
    } catch (err) {
        return res.json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
