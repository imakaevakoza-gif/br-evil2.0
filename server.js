const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/log', async (req, res) => {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (!webhookUrl) {
            console.error("Критическая ошибка: Системный вебхук Discord не настроен на Render.");
            return res.status(500).json({ success: false, error: "Конфигурация сервера нарушена" });
        }

        // Пересылаем полученные от index.html готовые Embed-карточки напрямую в Discord
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        if (response.ok) {
            return res.json({ success: true });
        } else {
            return res.status(response.status).json({ success: false, error: "Discord отклонил запрос" });
        }
    } catch (error) {
        console.error("Ошибка прокси-сервера:", error);
        return res.status(500).json({ success: false, error: "Внутренняя ошибка сервера" });
    }
});

app.listen(PORT, () => {
    console.log(`Защищенный бэкенд запущен на порту ${PORT}`);
});
