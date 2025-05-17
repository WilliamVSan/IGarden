require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") }); // Carrega o .env da raiz do projeto de forma dinâmica
const express = require("express");
const axios = require("axios");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = 3000;

const apiKey = process.env.NOUN_PROJECT_API_KEY;
const apiSecret = process.env.NOUN_PROJECT_API_SECRET;
const openWeatherApiKey = process.env.OPENWEATHERMAP_API_KEY; // Carrega do .env

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Serve arquivos estáticos da pasta principal do projeto
app.use(express.static(path.join(__dirname, "../")));

// Rota para servir o home.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../home.html"));
});

const oauth = OAuth({
    consumer: { key: apiKey, secret: apiSecret },
    signature_method: "HMAC-SHA1",
    hash_function(baseString, key) {
        return crypto.createHmac("sha1", key).update(baseString).digest("base64");
    },
});

app.get("/icons", async (req, res) => {
    const { next_page: nextPage, prev_page: prevPage } = req.query;

    const baseEndpoint = "https://api.thenounproject.com/v2/icon";
    const queryParams = new URLSearchParams({
        query: "plant",
        styles: "solid",
        include_svg: "1",
        limit: "6",
    });

    if (nextPage) {
        queryParams.append("next_page", nextPage);
    } else if (prevPage) {
        queryParams.append("prev_page", prevPage);
    }

    const endpoint = `${baseEndpoint}?${queryParams.toString()}`;

    try {
        const requestData = {
            url: endpoint,
            method: "GET",
        };
        const authHeader = oauth.toHeader(oauth.authorize(requestData));

        const response = await axios.get(endpoint, {
            headers: {
                Authorization: authHeader.Authorization,
                "User-Agent": "IGarden/1.0",
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Erro ao buscar ícones:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || "Erro ao buscar ícones",
        });
    }
});

app.get("/weather", async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude e longitude são obrigatórias." });
    }

    const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`;

    try {
        const response = await axios.get(endpoint);
        const { main, weather } = response.data;

        res.json({
            temperature: main.temp,
            humidity: main.humidity,
            description: weather[0]?.description || "Sem descrição",
        });
    } catch (error) {
        console.error("Erro ao buscar informações de clima:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || "Erro ao buscar informações de clima",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor proxy rodando em http://localhost:${PORT}`);
});
