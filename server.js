const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = "https://ethos-api-temp.onrender.com/api/bypass";
const VALID_API_KEYS = ["xx123123", "api_key_2"]; // Add your friend's valid API keys here

const validateApiKey = (apiKey) => {
    return VALID_API_KEYS.includes(apiKey);
}

app.get('/xs', async (req, res) => {
    const link = req.query.link;
    const apiKey = req.query.api_key;

    if (!link) {
        return res.status(400).json({ error: "Link parameter is missing" });
    }

    if (!apiKey) {
        return res.status(400).json({ error: "API key parameter is missing" });
    }

    if (!validateApiKey(apiKey)) {
        return res.status(403).json({ error: "Detected API key invalid" });
    }

    const fullApiUrl = `${BASE_URL}?link=${link}`;

    try {
        const response = await axios.get(fullApiUrl);
        const { bypassed, error } = response.data;

        if (bypassed) {
            return res.status(200).json({
                bypass: bypassed,
                credit: "Provided by [Your Name]"
            });
        } else if (error) {
            return res.status(500).json({ error: error });
        } else {
            return res.status(500).json({ error: "Unknown error occurred" });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
