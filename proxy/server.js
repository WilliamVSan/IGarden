const express = require("express");
const axios = require("axios");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

// Insira suas credenciais diretamente aqui
const apiKey = "25e7d5ab8d16408daba9929d7e60122a"; // Substitua pela sua API Key
const apiSecret = "0e05027a6ffb406f8088e5ddbec22101"; // Substitua pelo seu API Secret

// Middleware para habilitar CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Permite requisições de qualquer origem
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Configuração do OAuth 1.0a
const oauth = OAuth({
    consumer: { key: apiKey, secret: apiSecret },
    signature_method: "HMAC-SHA1",
    hash_function(baseString, key) {
        return crypto.createHmac("sha1", key).update(baseString).digest("base64");
    },
});

// Endpoint para buscar ícones
app.get("/icons", async (req, res) => {
    const nextPage = req.query.next_page; // Obtém o token da próxima página, se existir
    const prevPage = req.query.prev_page; // Obtém o token da página anterior, se existir

    const endpoint = nextPage
        ? `https://api.thenounproject.com/v2/icon?query=plant&styles=solid&include_svg=1&limit=6&next_page=${nextPage}`
        : prevPage
        ? `https://api.thenounproject.com/v2/icon?query=plant&styles=solid&include_svg=1&limit=6&prev_page=${prevPage}`
        : "https://api.thenounproject.com/v2/icon?query=plant&styles=solid&include_svg=1&limit=6"; // Query fixa para "plant" com limite de 6 ícones

    try {
        // Gere o cabeçalho OAuth
        const requestData = {
            url: endpoint,
            method: "GET",
        };
        const authHeader = oauth.toHeader(oauth.authorize(requestData));

        // Faça a requisição para a API do Noun Project
        const response = await axios.get(endpoint, {
            headers: {
                Authorization: authHeader.Authorization,
                "User-Agent": "IGarden/1.0",
            },
        });

        // Retorne os dados da API para o cliente
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao buscar ícones:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || "Erro ao buscar ícones",
        });
    }
});

// Inicie o servidor
app.listen(PORT, () => {
    console.log(`Servidor proxy rodando em http://localhost:${PORT}`);
});
