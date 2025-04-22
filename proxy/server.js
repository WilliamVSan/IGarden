const express = require("express");
const axios = require("axios");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

const apiKey = "25e7d5ab8d16408daba9929d7e60122a";
const apiSecret = "0e05027a6ffb406f8088e5ddbec22101";

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
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

app.listen(PORT, () => {
    console.log(`Servidor proxy rodando em http://localhost:${PORT}`);
});
